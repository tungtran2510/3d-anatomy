// Visibility Management - Hide, isolate, transparency, restore
import * as THREE from 'three';
import { state, setHiddenParts, setTransparentParts, setIsolatedPart, getPartState, setPartState, batchPartStates, notify, setSelectedPart } from '../state/store.js';
import { getMeshRegistry, getMeshesBySystem, ownMeshesOf, withDescendants, loadModel } from './loadModel.js';
import { updateBodyEnvelopeAuto } from './bodyEnvelope.js';
import { SYSTEM_PROFILES, matchSystemProfile } from '../data/systemProfiles.js';
import { focusOnSystem } from './camera.js';
import { hideCallout } from '../ui/callout.js';
import { speakVietnamese } from '../utils/speechVoice.js';

// --- Material ownership ------------------------------------------------------
// Meshes share the 65 materials that came out of the GLB. A mesh only gets
// its own copy when it is actually modified, and goes back to the shared one
// when the modification is undone.

function materialsOf(mesh) {
  return Array.isArray(mesh.material) ? mesh.material : [mesh.material];
}

// Clone-on-write: returns the mesh's private materials, creating them once.
function ownMaterials(mesh) {
  if (!mesh.userData.ownsMaterial) {
    mesh.material = Array.isArray(mesh.material)
      ? mesh.material.map(mat => mat.clone())
      : mesh.material.clone();
    mesh.userData.ownsMaterial = true;
  }
  return materialsOf(mesh);
}

// What a mesh should look like when nothing is being done to it: faded if its
// structure is currently ghosted, otherwise the shared material from the GLB.
// Getting this wrong is what made hovering dissolve the ghost.
function restingMaterial(mesh, partId) {
  const base = mesh.userData.baseMaterial;
  if (!base) return null;

  if (ghostedIds?.has(partId)) {
    return Array.isArray(base) ? base.map(ghostVariantOf) : ghostVariantOf(base);
  }
  return base;
}

function releaseMaterial(mesh, partId) {
  if (mesh.userData.ownsMaterial) {
    materialsOf(mesh).forEach(mat => mat.dispose());
    mesh.userData.ownsMaterial = false;
  }

  const resting = restingMaterial(mesh, partId);
  if (resting) mesh.material = resting;
}

// Ghosting touches nearly every mesh at once, so it uses one shared faded
// variant per source material — 65 of them, not one per mesh.
// Dynamic theme-aware opacity: Dark mode ~0.18 (soft translucent crystal), Light mode ~0.22 (crisp crystal silhouette without milky fog)
const GHOST_OPACITY_DARK = 0.18;
const GHOST_OPACITY_LIGHT = 0.22;
const ghostVariants = new WeakMap();
const activeGhostMaterials = new Set();

function isCurrentThemeDark() {
  if (typeof document === 'undefined') return true;
  return document.documentElement.getAttribute('data-theme') === 'dark' || document.body?.classList?.contains('theme-dark');
}

export function getGhostOpacity() {
  return isCurrentThemeDark() ? GHOST_OPACITY_DARK : GHOST_OPACITY_LIGHT;
}

function ghostVariantOf(material) {
  let ghost = ghostVariants.get(material);
  const isDark = isCurrentThemeDark();
  const targetOpacity = isDark ? GHOST_OPACITY_DARK : GHOST_OPACITY_LIGHT;

  if (!ghost) {
    ghost = material.clone();
    ghost.transparent = true;
    ghost.opacity = targetOpacity;
    ghost.depthWrite = false;

    // In light mode, enhance silhouette contrast against bright white background
    if (ghost.color) {
      ghost.userData.darkColor = ghost.color.clone();
      ghost.userData.lightColor = ghost.color.clone().lerp(new THREE.Color(0x334155), 0.38);
      ghost.color.copy(isDark ? ghost.userData.darkColor : ghost.userData.lightColor);
    }

    activeGhostMaterials.add(ghost);
    ghostVariants.set(material, ghost);
  } else {
    ghost.opacity = targetOpacity;
    if (ghost.color && ghost.userData.darkColor) {
      ghost.color.copy(isDark ? ghost.userData.darkColor : ghost.userData.lightColor);
    }
  }
  return ghost;
}

export function syncGhostMaterialsTheme(isDark) {
  const targetOpacity = isDark ? GHOST_OPACITY_DARK : GHOST_OPACITY_LIGHT;
  activeGhostMaterials.forEach(ghost => {
    ghost.opacity = targetOpacity;
    if (ghost.color && ghost.userData.darkColor) {
      ghost.color.copy(isDark ? ghost.userData.darkColor : ghost.userData.lightColor);
    }
    ghost.needsUpdate = true;
  });
}

// High-performance shared opacity variant cache for whole systems.
// Prevents cloning thousands of materials when fading entire systems (e.g. muscular/skeletal).
const systemOpacityVariants = new WeakMap();

function systemOpacityVariantOf(material, opacity) {
  let cache = systemOpacityVariants.get(material);
  if (!cache) {
    cache = new Map();
    systemOpacityVariants.set(material, cache);
  }
  const key = Math.round(opacity * 100);
  let variant = cache.get(key);
  if (!variant) {
    variant = material.clone();
    variant.transparent = opacity < 0.99;
    variant.opacity = opacity;
    variant.depthWrite = opacity >= 0.95;
    cache.set(key, variant);
  }
  return variant;
}

// Visibility is applied to the meshes a structure owns, never to its node:
// three.js propagates `visible` down the subtree, and 868 of the 2827
// structures sit inside another one, so touching the node would take unrelated
// structures with it.
export function setStructureVisible(partId, visible) {
  ownMeshesOf(partId).forEach(mesh => { mesh.visible = visible; });

  const partState = getPartState(partId);
  partState.visible = visible;
  setPartState(partId, { visible });

  if (visible) {
    state.hiddenParts.delete(partId);
  } else {
    state.hiddenParts.add(partId);
  }
}

export function hidePart(partId) {
  if (!getMeshRegistry().has(partId)) return;

  // Hiding a structure hides what is nested inside it.
  batchPartStates(() => {
    withDescendants(partId).forEach(id => setStructureVisible(id, false));
  });

  notify('partHidden', partId);
}

export function showPart(partId) {
  if (!getMeshRegistry().has(partId)) return;

  batchPartStates(() => {
    withDescendants(partId).forEach(id => {
      setStructureVisible(id, true);
      restoreMaterial(id);
      setPartState(id, { opacity: 1 });
      state.transparentParts.delete(id);
    });
  });

  notify('partShown', partId);
}

// One structure's fade, without the notification. Both entry points go through
// here, so both clone before they write and both leave the same recorded state
// behind.
function applyTransparency(partId, opacity) {
  ownMeshesOf(partId).forEach(mesh => {
    if (opacity >= 1 && !mesh.userData.ownsMaterial) return;

    ownMaterials(mesh).forEach(mat => {
      mat.transparent = opacity < 1;
      mat.opacity = opacity;
      mat.depthWrite = opacity >= 1;
      mat.needsUpdate = true;
    });
  });

  const partState = getPartState(partId);
  partState.opacity = opacity;
  setPartState(partId, { opacity });

  if (opacity < 1) {
    state.transparentParts.add(partId);
  } else {
    state.transparentParts.delete(partId);
  }
}

export function setPartTransparency(partId, opacity) {
  if (!getMeshRegistry().has(partId)) return;

  opacity = THREE.MathUtils.clamp(opacity, 0, 1);
  applyTransparency(partId, opacity);

  notify('partTransparencyChanged', { partId, opacity });
}

export function isolatePart(partId) {
  if (!getMeshRegistry().has(partId)) return;

  const keep = new Set(withDescendants(partId));
  const companions = getAnatomicalCompanions(partId);
  companions.forEach(cid => {
    withDescendants(cid).forEach(descId => keep.add(descId));
  });

  batchPartStates(() => {
    getMeshRegistry().forEach((node, id) => {
      const ownerId = node.userData?.partId || id;
      const keeping = keep.has(id) || keep.has(ownerId);
      setStructureVisible(id, keeping);
      if (!keeping) return;

      // Isolating is a "show" like every other one. Isolating a row while
      // something else is selected used to leave the isolated structure
      // wearing the ghost material: the one thing left on screen, at 12%
      // opacity with no depth write, over an empty viewport.
      restoreMaterial(id);

      // restoreMaterial hands the mesh back to the shared material, so a fade
      // the user asked for has to be re-applied rather than quietly dropped.
      const opacity = getPartState(id)?.opacity ?? 1;
      if (opacity < 1) applyTransparency(id, opacity);
    });
  });

  // Apply context opacity for hepatobiliary unit if isolating Gallbladder or Bile duct
  const isBiliary = partId === 'Gallbladder' || partId === 'Bile duct';
  if (isBiliary) {
    withDescendants('Liver').forEach(descId => {
      ownMeshesOf(descId).forEach(mesh => {
        ownMaterials(mesh).forEach(mat => {
          mat.transparent = true;
          mat.opacity = 0.35;
          mat.depthWrite = false;
          mat.needsUpdate = true;
        });
      });
    });
    ownMeshesOf('Duodenum').forEach(mesh => {
      ownMaterials(mesh).forEach(mat => {
        mat.transparent = true;
        mat.opacity = 0.28;
        mat.depthWrite = false;
        mat.needsUpdate = true;
      });
    });
  }

  // Apply context opacity for Stomach (Liver in front softens to 25% opacity so stomach is unobscured)
  const isStomach = partId === 'Stomach' || (typeof partId === 'string' && partId.toLowerCase().includes('dạ dày'));
  if (isStomach) {
    withDescendants('Liver').forEach(descId => {
      ownMeshesOf(descId).forEach(mesh => {
        ownMaterials(mesh).forEach(mat => {
          mat.transparent = true;
          mat.opacity = 0.25;
          mat.depthWrite = false;
          mat.needsUpdate = true;
        });
      });
    });
  }

  // Apply context opacity for Pancreas (Stomach in front softens to 20% opacity)
  const isPancreas = partId === 'Pancreas' || (typeof partId === 'string' && partId.toLowerCase().includes('tụy'));
  if (isPancreas) {
    ownMeshesOf('Stomach').forEach(mesh => {
      ownMaterials(mesh).forEach(mat => {
        mat.transparent = true;
        mat.opacity = 0.20;
        mat.depthWrite = false;
        mat.needsUpdate = true;
      });
    });
  }

  // Intervertebral disc & Nucleus Pulposus: ensure both maintain their distinct PBR materials and opacities
  const isDisc = /^intervertebral[ _]disc/i.test(partId) || /^nucleus[ _]pulposus/i.test(partId);
  if (isDisc) {
    const level = partId.replace(/^(intervertebral[ _]disc|nucleus[ _]pulposus)[ _]/i, '');
    const discKeys = [`Intervertebral_disc_${level}`, `Nucleus_pulposus_${level}`, `Intervertebral disc ${level}`, `Nucleus pulposus ${level}`];
    discKeys.forEach(id => {
      setStructureVisible(id, true);
      restoreMaterial(id);
      ownMeshesOf(id).forEach(mesh => {
        mesh.visible = true;
        ownMaterials(mesh).forEach(mat => {
          if (mesh.userData.isNucleusPulposus) {
            mat.transparent = true;
            mat.opacity = 0.96;
            mat.transmission = 0.55;
            mat.depthWrite = true;
            mat.needsUpdate = true;
          } else {
            mat.transparent = true;
            mat.opacity = 0.68;
            mat.roughness = 0.52;
            mat.depthWrite = true;
            mat.needsUpdate = true;
          }
        });
      });
    });
  }

  setIsolatedPart(partId);
  notify('partIsolated', partId);
}

export function restoreAllParts() {
  batchPartStates(() => {
    getMeshRegistry().forEach((node, id) => {
      setStructureVisible(id, true);
      restoreMaterial(id);

      const partState = getPartState(id);
      partState.opacity = 1;
      partState.selected = false;
      setPartState(id, { opacity: 1, selected: false });
    });
  });

  state.hiddenParts.clear();
  state.transparentParts.clear();
  setIsolatedPart(null);
  setHiddenParts([]);
  setTransparentParts([]);

  notify('allPartsRestored', true);
  updateBodyEnvelopeAuto(state.viewer);
}

export function hideSystem(systemId) {
  batchPartStates(() => {
    getMeshesBySystem(systemId).forEach(node => {
      const partId = node.userData.partId;
      if (partId) setStructureVisible(partId, false);
    });
  });

  notify('systemHidden', systemId);
  updateBodyEnvelopeAuto(state.viewer);
}

export function showSystem(systemId) {
  batchPartStates(() => {
    getMeshesBySystem(systemId).forEach(node => {
      const partId = node.userData.partId;
      if (!partId) return;

      setStructureVisible(partId, true);
      restoreMaterial(partId);
      setPartState(partId, { opacity: 1 });
      state.transparentParts.delete(partId);
    });
  });

  notify('systemShown', systemId);
  updateBodyEnvelopeAuto(state.viewer);
}

export function setSystemTransparency(systemId, opacity) {
  opacity = THREE.MathUtils.clamp(opacity, 0, 1);
  const isSolid = opacity >= 0.99;

  batchPartStates(() => {
    getMeshesBySystem(systemId).forEach(node => {
      const partId = node.userData.partId;
      if (!partId) return;

      ownMeshesOf(partId).forEach(mesh => {
        const base = mesh.userData.baseMaterial;
        if (!base) return;

        if (isSolid) {
          if (mesh.userData.ownsMaterial) {
            materialsOf(mesh).forEach(mat => mat.dispose());
            mesh.userData.ownsMaterial = false;
          }
          mesh.material = base;
        } else {
          // Re-use shared opacity variant - ultra fast 60fps!
          if (Array.isArray(base)) {
            mesh.material = base.map(mat => systemOpacityVariantOf(mat, opacity));
          } else {
            mesh.material = systemOpacityVariantOf(base, opacity);
          }
        }
      });

      const partState = getPartState(partId);
      if (partState) partState.opacity = opacity;
      setPartState(partId, { opacity });

      if (isSolid) {
        state.transparentParts.delete(partId);
      } else {
        state.transparentParts.add(partId);
      }
    });
  });

  notify('systemTransparencyChanged', { systemId, opacity });
  updateBodyEnvelopeAuto(state.viewer);
}

export function toggleSystemVisibility(systemId) {
  const { total, visible } = getSystemVisibilityState(systemId);
  if (total === 0) return;

  if (visible) {
    hideSystem(systemId);
  } else {
    showSystem(systemId);
  }
}

export function getSystemVisibilityState(systemId) {
  const nodes = getMeshesBySystem(systemId);
  if (nodes.length === 0) return { visible: false, total: 0, visibleCount: 0 };

  // Reads the owned meshes, because the node itself is never toggled.
  const visibleCount = nodes.filter(node => {
    const partId = node.userData.partId;
    return partId && ownMeshesOf(partId).some(mesh => mesh.visible);
  }).length;

  return {
    visible: visibleCount > 0,
    total: nodes.length,
    visibleCount
  };
}

// Restoring is now "point back at the shared material" rather than copying a
// dozen properties back one by one.
export function restoreMaterial(partId) {
  ghostedIds?.delete(partId);
  ownMeshesOf(partId).forEach(mesh => releaseMaterial(mesh, partId));
}

// On a 277-piece skeleton an emissive tint on an occluded structure is simply
// not visible, so selecting also drops everything else back to a ghost. The
// user's own transparency settings are restored from partStates when it clears.
let ghostedIds = null;

export function getAnatomicalCompanions(partId) {
  if (!partId) return [];
  const lower = partId.toLowerCase();
  if (/^intervertebral[ _]disc/i.test(partId)) {
    const level = partId.replace(/^intervertebral[ _]disc[ _]/i, '');
    return [`Nucleus pulposus ${level}`, `Nucleus_pulposus_${level}`];
  }
  if (/^nucleus[ _]pulposus/i.test(partId)) {
    const level = partId.replace(/^nucleus[ _]pulposus[ _]/i, '');
    return [`Intervertebral disc ${level}`, `Intervertebral_disc_${level}`];
  }
  // Biliary system: Gallbladder is intimately bound to the biliary tree, liver fossa, and duodenum
  if (lower === 'gallbladder' || lower.includes('túi mật') || lower.includes('vesica biliaris')) {
    return ['Bile duct', 'Liver', 'Duodenum', 'Pancreas', 'Pancreatic duct', 'Proper hepatic artery', 'Common hepatic artery', 'Hepatic portal vein'];
  }
  if (lower === 'bile duct' || lower.includes('ống mật') || lower.includes('ductus choledochus')) {
    return ['Gallbladder', 'Liver', 'Duodenum', 'Pancreas', 'Pancreatic duct', 'Proper hepatic artery', 'Hepatic portal vein'];
  }
  if (lower === 'pancreas' || lower.includes('tụy')) {
    return ['Pancreatic duct', 'Accessory pancreatic duct', 'Duodenum', 'Bile duct', 'Gallbladder', 'Spleen', 'Splenic artery', 'Splenic vein', 'Inferior pancreaticoduodenal artery', 'Stomach'];
  }
  if (lower === 'stomach' || lower.includes('dạ dày') || lower.includes('gaster') || lower.includes('gastric')) {
    return ['Duodenum', 'Esophagus', 'Spleen', 'Pancreas', 'Liver'];
  }
  if (
    lower === 'brain' || lower.includes('não') || lower.includes('encephalon') || lower.includes('cerebrum') ||
    lower.includes('gyrus') || lower.includes('sulcus') || lower.includes('frontal') || lower.includes('parietal') ||
    lower.includes('temporal') || lower.includes('occipital') || lower.includes('cerebell') || lower.includes('midbrain')
  ) {
    return [
      'Superior frontal gyrus.l', 'Superior frontal gyrus.r',
      'Middle frontal gyrus.l', 'Middle frontal gyrus.r',
      'Inferior temporal gyrus.l', 'Inferior temporal gyrus.r',
      'Lateral occipital gyrus (Middle occipital gyrus*).l', 'Lateral occipital gyrus (Middle occipital gyrus*).r',
      'Falx cerebri', 'Lingula of cerebellum', 'Midbrain.l', 'Midbrain.r',
      'White matter of spinal cord'
    ];
  }
  if (lower.startsWith('kidney') || lower.includes('thận') || lower.includes('ren ') || lower.includes('suprarenal') || lower.includes('thượng thận') || lower.includes('ureter')) {
    const isLeft = lower.includes('.l') || lower.includes('left') || lower.includes('trái');
    const side = isLeft ? '.l' : '.r';
    return [
      `Renal pelvis${side}`,
      `Ureter${side}`,
      `Suprarenal gland${side}`,
      `Suprarenal gland${side === '.l' ? '.r' : '.l'}`,
      'Urinary bladder',
      'Abdominal aorta',
      'Inferior vena cava (abdominal part)',
      `Intrarenal arteries of ${isLeft ? 'left' : 'right'} kidney`
    ];
  }
  if (lower.includes('urinary bladder') || lower.includes('bàng quang')) {
    return ['Ureter.l', 'Ureter.r', 'Prostate', 'Urethra', 'Kidney.l', 'Kidney.r'];
  }
  // Heart & Great Vessels: Cardiac chambers, coronary arteries, aorta and pulmonary trunk
  if (lower.includes('heart') || lower.includes('tim') || lower.includes('ventricle') || lower.includes('atrium') || lower.includes('tâm thất') || lower.includes('tâm nhĩ') || lower.includes('coronary') || lower.includes('mạch vành') || lower.includes('aorta')) {
    return [
      'Left ventricle',
      'Right ventricle',
      'Left atrium',
      'Right atrium',
      'Ascending aorta',
      'Thoracic aorta',
      'Pulmonary trunk',
      'Left pulmonary artery',
      'Right pulmonary artery',
      'Left coronary artery',
      'Right coronary artery',
      'Circumflex artery of heart',
      'Superior vena cava',
      'Inferior vena cava (thoracic part)'
    ];
  }
  // Respiratory System: Trachea, Bronchi, Lungs & Pulmonary Vasculature
  if (lower.includes('lung') || lower.includes('phổi') || lower.includes('pulmo') || lower.includes('trachea') || lower.includes('khí quản') || lower.includes('bronch') || lower.includes('phế quản')) {
    return [
      'Trachea',
      'Left lung',
      'Right lung',
      'Left inferior lobar bronchus',
      'Left superior lobar bronchus',
      'Pulmonary trunk',
      'Left pulmonary artery',
      'Right pulmonary artery',
      'Heart',
      'Pleura'
    ];
  }
  // Thyroid & Parathyroid Glands: Intimately bound to Trachea, Laryngeal Cartilages & Carotid Arteries
  if (lower.includes('thyroid') || lower.includes('giáp') || lower.includes('parathyroid') || lower.includes('cận giáp')) {
    return [
      'Thyroid gland',
      'Inferior parathyroid gland.l',
      'Inferior parathyroid gland.r',
      'Superior parathyroid gland.l',
      'Superior parathyroid gland.r',
      'Trachea',
      'Thyroid cartilage',
      'Inferior thyroid artery.l',
      'Inferior thyroid artery.r',
      'Left common carotid artery',
      'Right common carotid artery'
    ];
  }
  // Pituitary & Pineal Glands (Endocrine Brain Core)
  if (lower.includes('adenohypophysis') || lower.includes('neurohypophysis') || lower.includes('hypophysis') || lower.includes('tuyến yên') || lower.includes('pineal') || lower.includes('tuyến tùng')) {
    return [
      'Adenohypophysis',
      'Neurohypophysis',
      'Pineal gland',
      'Hypothalamus',
      'Third ventricle',
      'Optic chiasm',
      'Internal carotid artery.l',
      'Internal carotid artery.r'
    ];
  }
  // Salivary Glands: Parotid, Submandibular, Sublingual & their Ducts
  if (lower.includes('parotid') || lower.includes('mang tai') || lower.includes('submandibular') || lower.includes('dưới hàm') || lower.includes('sublingual') || lower.includes('dưới lưỡi')) {
    return [
      'Parotid gland.l',
      'Parotid gland.r',
      'Parotid duct.l',
      'Parotid duct.r',
      'Submandibular gland.l',
      'Submandibular gland.r',
      'Submandibular duct.l',
      'Submandibular duct.r',
      'Sublingual gland.l',
      'Sublingual gland.r',
      'Tongue'
    ];
  }
  // Sciatic Nerve & Lumbosacral Plexus
  if (lower.includes('sciatic') || lower.includes('thần kinh tọa') || lower.includes('thần kinh ngồi')) {
    return [
      'Sciatic nerve.l',
      'Sciatic nerve.r',
      'Vertebra L4',
      'Vertebra L5',
      'Sacrum',
      'Femur.l',
      'Femur.r'
    ];
  }
  // Knee complex: ACL, PCL, Meniscus must bring along opposing cruciate, menisci, and articular bone ends
  if (lower.includes('cruciate') || lower.includes('meniscus') || lower.includes('patellar ligament') || lower.includes('khớp gối')) {
    const isLeft = lower.includes('.l') || lower.includes('left');
    const side = isLeft ? '.l' : '.r';
    return [
      `Anterior cruciate ligament${side}`,
      `Posterior cruciate ligament${side}`,
      `Medial meniscus${side}`,
      `Lateral meniscus${side}`,
      `Femur${side}`,
      `Tibia${side}`,
      `Patella${side}`,
      'Anterior cruciate ligament',
      'Posterior cruciate ligament',
      'Medial meniscus',
      'Lateral meniscus'
    ];
  }
  // Gastrointestinal tract: Stomach brings Duodenum, Oesophagus, Lesser Omentum, Liver, Pancreas and Gastric Vessels
  if (lower === 'stomach' || lower.includes('dạ dày') || lower.includes('gaster')) {
    return [
      'Duodenum',
      'Oesophagus',
      'Lesser omentum',
      'Liver',
      'Pancreas',
      'Left gastric artery',
      'Common hepatic artery',
      'Gastroduodenal artery',
      'Splenic artery',
      'Hepatic portal vein'
    ];
  }
  // Liver brings Gallbladder, Bile duct, Portal vein, Hepatic artery and Duodenum
  if (lower === 'liver' || lower.includes('gan') || lower.includes('hepar')) {
    return [
      'Gallbladder',
      'Bile duct',
      'Duodenum',
      'Stomach',
      'Pancreas',
      'Pancreatic duct',
      'Lesser omentum',
      'Hepatic portal vein',
      'Proper hepatic artery',
      'Common hepatic artery',
      'Hepatic veins',
      'Inferior vena cava (abdominal part)'
    ];
  }
  // Duodenum brings Stomach, Pancreas, Bile duct, and Pancreatic duct
  if (lower === 'duodenum' || lower.includes('tá tràng')) {
    return [
      'Stomach',
      'Pancreas',
      'Pancreatic duct',
      'Accessory pancreatic duct',
      'Bile duct',
      'Gallbladder',
      'Jejunum',
      'Lesser omentum',
      'Gastroduodenal artery',
      'Inferior pancreaticoduodenal artery',
      'Anterior inferior pancreaticoduodenal artery'
    ];
  }
  // Appendix brings Manh tràng (Cecum) and Ascending colon
  if (lower.includes('appendix') || lower.includes('ruột thừa')) {
    return ['Cecum', 'Ascending colon', 'Ileum', 'Vermiform appendix'];
  }
  return [];
}

export function ghostAllExcept(partId) {
  const keep = new Set(withDescendants(partId));
  const companions = getAnatomicalCompanions(partId);
  companions.forEach(cid => {
    withDescendants(cid).forEach(descId => keep.add(descId));
  });

  const ghosted = new Set();

  getMeshRegistry().forEach((node, id) => {
    const ownerId = node.userData?.partId || id;
    if (keep.has(id) || keep.has(ownerId)) return;

    const meshes = ownMeshesOf(id);
    if (!meshes.some(mesh => mesh.visible)) return;

    ghosted.add(id);
  });

  // Recorded first: releaseMaterial reads this to decide what "resting" means.
  ghostedIds = ghosted;

  ghosted.forEach(id => {
    ownMeshesOf(id).forEach(mesh => releaseMaterial(mesh, id));
  });

  // The selected structure and its anatomical companions must read as solid/translucent even where they were see-through.
  keep.forEach(id => restoreMaterial(id));

  // Specialized context transparency for anatomical companions:
  // When Gallbladder or Bile duct is selected, ensure the entire hepatobiliary unit is legible
  const isBiliary = partId === 'Gallbladder' || partId === 'Bile duct';
  if (isBiliary) {
    // Bile duct must be 100% solid, fully visible pipe connecting gallbladder to duodenum!
    ownMeshesOf('Bile duct').forEach(mesh => {
      ownMaterials(mesh).forEach(mat => {
        mat.transparent = false;
        mat.opacity = 1.0;
        mat.depthWrite = true;
        mat.needsUpdate = true;
      });
    });
    // Liver: rich semi-translucent anatomical context (75% opacity) showing gallbladder resting under right lobe
    withDescendants('Liver').forEach(descId => {
      ownMeshesOf(descId).forEach(mesh => {
        ownMaterials(mesh).forEach(mat => {
          mat.transparent = true;
          mat.opacity = 0.75;
          mat.depthWrite = true;
          mat.needsUpdate = true;
        });
      });
    });
    // Duodenum: solid mucosal C-loop (100% opacity) showing terminal duct entry at major papilla
    ownMeshesOf('Duodenum').forEach(mesh => {
      ownMaterials(mesh).forEach(mat => {
        mat.transparent = false;
        mat.opacity = 1.0;
        mat.depthWrite = true;
        mat.needsUpdate = true;
      });
    });
  }

  // When Stomach is selected, ensure Liver right in-front fades to 25% so stomach is completely visible
  const isStomach = partId === 'Stomach' || (typeof partId === 'string' && partId.toLowerCase().includes('dạ dày'));
  if (isStomach) {
    ownMeshesOf('Stomach').forEach(mesh => {
      ownMaterials(mesh).forEach(mat => {
        mat.transparent = false;
        mat.opacity = 1.0;
        mat.depthWrite = true;
        mat.needsUpdate = true;
      });
    });
    withDescendants('Liver').forEach(descId => {
      ownMeshesOf(descId).forEach(mesh => {
        ownMaterials(mesh).forEach(mat => {
          mat.transparent = true;
          mat.opacity = 0.25;
          mat.depthWrite = false;
          mat.needsUpdate = true;
        });
      });
    });
    ['Duodenum', 'Esophagus', 'Spleen', 'Pancreas'].forEach(cid => {
      ownMeshesOf(cid).forEach(mesh => {
        ownMaterials(mesh).forEach(mat => {
          mat.transparent = false;
          mat.opacity = 0.95;
          mat.depthWrite = true;
          mat.needsUpdate = true;
        });
      });
    });
  }

  // When Pancreas is selected, ensure Stomach in front softens to 20%
  const isPancreas = partId === 'Pancreas' || (typeof partId === 'string' && partId.toLowerCase().includes('tụy'));
  if (isPancreas) {
    ownMeshesOf('Pancreas').forEach(mesh => {
      ownMaterials(mesh).forEach(mat => {
        mat.transparent = false;
        mat.opacity = 1.0;
        mat.depthWrite = true;
        mat.needsUpdate = true;
      });
    });
    ownMeshesOf('Stomach').forEach(mesh => {
      ownMaterials(mesh).forEach(mat => {
        mat.transparent = true;
        mat.opacity = 0.20;
        mat.depthWrite = false;
        mat.needsUpdate = true;
      });
    });
  }

  // Intervertebral disc & Nucleus Pulposus: ensure both maintain their distinct PBR materials and opacities
  const isDisc = /^intervertebral[ _]disc/i.test(partId) || /^nucleus[ _]pulposus/i.test(partId);
  if (isDisc) {
    const level = partId.replace(/^(intervertebral[ _]disc|nucleus[ _]pulposus)[ _]/i, '');
    const discKeys = [`Intervertebral_disc_${level}`, `Nucleus_pulposus_${level}`, `Intervertebral disc ${level}`, `Nucleus pulposus ${level}`];
    discKeys.forEach(id => {
      restoreMaterial(id);
      ownMeshesOf(id).forEach(mesh => {
        ownMaterials(mesh).forEach(mat => {
          if (mesh.userData.isNucleusPulposus) {
            mat.transparent = true;
            mat.opacity = 0.96;
            mat.transmission = 0.55;
            mat.depthWrite = true;
            mat.needsUpdate = true;
          } else {
            mat.transparent = true;
            mat.opacity = 0.68;
            mat.roughness = 0.52;
            mat.depthWrite = true;
            mat.needsUpdate = true;
          }
        });
      });
    });
  }

  notify('ghostModeChanged', partId);
}

export function clearGhost() {
  if (!ghostedIds) return;

  const wasGhosted = [...ghostedIds];
  ghostedIds = null;

  wasGhosted.forEach(id => {
    restoreMaterial(id);

    // Give back a transparency the user had set before the ghost.
    const opacity = getPartState(id)?.opacity ?? 1;
    if (opacity < 1) setPartTransparency(id, opacity);
  });

  notify('ghostModeChanged', null);
}

export function isGhostActive() {
  return ghostedIds !== null && ghostedIds.size > 0;
}

// Highlighting only touches `emissive`, so it can be undone without disturbing
// a transparency the user set. Uses vivid clinical cyan accent to illuminate target structure brightly.
export function highlightMesh(partId, color = 0x38bdf8, intensity = 0.55) {
  if (!partId) return;

  let resolvedPartId = partId;
  if (partId === 'Atlas') resolvedPartId = 'Atlas (C1)';
  else if (partId === 'Axis') resolvedPartId = 'Axis (C2)';
  else if (partId.startsWith('Lumbar vertebra')) resolvedPartId = 'Vertebra L3';

  const isDisc = resolvedPartId.startsWith('Intervertebral disc ');
  const isNucleus = resolvedPartId.startsWith('Nucleus pulposus ');

  ownMeshesOf(resolvedPartId).forEach(mesh => {
    // Materials are shared, so tinting one in place would light up every mesh
    // using it; the highlighted structure gets its own copy instead.
    ownMaterials(mesh).forEach(mat => {
      mat.emissive = new THREE.Color(color);
      mat.emissiveIntensity = intensity;
      if (isDisc) {
        mat.transparent = true;
        mat.opacity = 0.62; // Translucent outer anulus fibrosus so inner nucleus is clearly visible!
        mat.depthWrite = true;
      }
      mat.needsUpdate = true;
    });
  });

  // If selecting Gallbladder, also illuminate Bile duct so the pipeline is visible!
  if (resolvedPartId === 'Gallbladder') {
    ownMeshesOf('Bile duct').forEach(mesh => {
      ownMaterials(mesh).forEach(mat => {
        mat.transparent = false;
        mat.opacity = 1.0;
        mat.depthWrite = true;
        mat.emissive = new THREE.Color(0x22c55e); // Emerald biliary glow
        mat.emissiveIntensity = 0.65;
        mat.needsUpdate = true;
      });
    });
  } else if (resolvedPartId === 'Bile duct') {
    ownMeshesOf('Gallbladder').forEach(mesh => {
      ownMaterials(mesh).forEach(mat => {
        mat.transparent = false;
        mat.opacity = 1.0;
        mat.depthWrite = true;
        mat.emissive = new THREE.Color(0x22c55e);
        mat.emissiveIntensity = 0.65;
        mat.needsUpdate = true;
      });
    });
  }

  // If selecting the Disc, also illuminate its inner companion Nucleus pulposus!
  if (isDisc) {
    const level = resolvedPartId.slice('Intervertebral disc '.length);
    const nucleusId = `Nucleus pulposus ${level}`;
    ownMeshesOf(nucleusId).forEach(mesh => {
      ownMaterials(mesh).forEach(mat => {
        mat.transparent = false;
        mat.opacity = 1.0;
        mat.color = new THREE.Color(0x1e3a8a); // Luxurious sapphire navy
        mat.emissive = new THREE.Color(0x1e40af); // Refined inner nucleus glow
        mat.emissiveIntensity = 0.9;
        mat.needsUpdate = true;
      });
    });
  } else if (isNucleus) {
    // If selecting Nucleus directly, keep its outer Anulus fibrosus visible as a protective translucent ring!
    const level = resolvedPartId.slice('Nucleus pulposus '.length);
    const discId = `Intervertebral disc ${level}`;
    ownMeshesOf(discId).forEach(mesh => {
      ownMaterials(mesh).forEach(mat => {
        mat.transparent = true;
        mat.opacity = 0.4; // Gentle translucent boundary
        mat.emissive = new THREE.Color(0x64748b);
        mat.emissiveIntensity = 0.25;
        mat.needsUpdate = true;
      });
    });
  }
}

export function clearHighlight(partId) {
  if (!partId) return;

  let resolvedPartId = partId;
  if (partId === 'Atlas') resolvedPartId = 'Atlas (C1)';
  else if (partId === 'Axis') resolvedPartId = 'Axis (C2)';
  else if (partId.startsWith('Lumbar vertebra')) resolvedPartId = 'Vertebra L3';

  const companions = getAnatomicalCompanions(resolvedPartId);
  [resolvedPartId, ...companions].forEach(id => {
    ownMeshesOf(id).forEach(mesh => {
      if (!mesh.userData.ownsMaterial) return;

      const opacity = getPartState(id)?.opacity ?? 1;

      // A structure the user made transparent keeps its own material; one that
      // was only hovered goes back to the shared one.
      if (opacity < 1) {
        materialsOf(mesh).forEach(mat => {
          const base = mesh.userData.baseMaterial;
          const source = Array.isArray(base) ? base[0] : base;
          if (source?.emissive) mat.emissive.copy(source.emissive);
          mat.emissiveIntensity = source?.emissiveIntensity ?? 1;
          mat.needsUpdate = true;
        });
      } else {
        releaseMaterial(mesh, id);
      }
    });
  });
}

export function clearAllHighlights() {
  getMeshRegistry().forEach((node, partId) => clearHighlight(partId));
}

export function getPartVisibility(partId) {
  if (!getMeshRegistry().has(partId)) return { visible: false, opacity: 0, selected: false };

  const partState = getPartState(partId);
  return {
    visible: ownMeshesOf(partId).some(mesh => mesh.visible),
    opacity: partState?.opacity ?? 1,
    selected: partState?.selected ?? false
  };
}

export function setPartVisibility(partId, visible) {
  if (!getMeshRegistry().has(partId)) return;
  setStructureVisible(partId, visible);
}

export function toggleStomachDissection(forceOpen = null) {
  const patchMesh = getMeshRegistry().get('Stomach_AnteriorWall');
  if (!patchMesh) return false;
  const isCurrentlyOpen = !patchMesh.visible;
  const shouldOpen = forceOpen !== null ? forceOpen : !isCurrentlyOpen;
  patchMesh.visible = !shouldOpen;
  return shouldOpen;
}

export function isStomachDissected() {
  const patchMesh = getMeshRegistry().get('Stomach_AnteriorWall');
  return patchMesh ? !patchMesh.visible : false;
}

/**
 * Whole System Showcase:
 * Automatically loads the whole organ system, frames it in camera with perspective,
 * keeps target system meshes 100% solid & vibrant PBR colored,
 * smoothly ghosts surrounding skeletal framework as 3D crystal reference context,
 * reads 15-second zero-fluff summary, and triggers interactive system overview card.
 */
export async function showcaseWholeSystem(systemId, viewer, options = {}) {
  const activeViewer = viewer || state.viewer || window.viewer;
  const profile = SYSTEM_PROFILES[systemId] || matchSystemProfile(systemId);
  if (!profile) return false;

  const targetSystemId = profile.id;
  const baseSystem = profile.baseSystem || targetSystemId;
  const subType = profile.subType;
  const requiredSystems = profile.requiredSystems || [baseSystem];

  // Close any active clinical axis HUD or mechanism sheet so selection card can display
  if (typeof window !== 'undefined') {
    if (window.closeClinicalAxesModal) {
      window.closeClinicalAxesModal(activeViewer);
    } else {
      const hud = document.getElementById('clinicalAxisHud');
      if (hud) hud.classList.add('hidden');
    }
  }

  // 1. Ensure all required base systems are loaded
  for (const sys of requiredSystems) {
    if (!state.loadedSystems.includes(sys)) {
      try {
        await loadModel(sys, activeViewer);
      } catch (e) {
        console.warn('Failed to load system model:', sys, e);
      }
    }
    showSystem(sys);
  }

  // 2. Ensure skeletal is loaded as anatomical crystal reference
  if (!requiredSystems.includes('skeletal') && !state.loadedSystems.includes('skeletal')) {
    try {
      await loadModel('skeletal', activeViewer);
    } catch (e) {
      console.warn('Failed to load skeletal reference model:', e);
    }
  }

  // 4. Hide all unrelated loaded systems
  const allowedSystems = new Set([...requiredSystems, 'skeletal']);
  if (targetSystemId === 'spine') allowedSystems.add('joints');

  state.loadedSystems.forEach(sys => {
    if (!allowedSystems.has(sys)) {
      hideSystem(sys);
    }
  });

  // 5. Structure filtering & Material styling
  const subTypeFilter = (name, partSys) => {
    const lower = (name || '').toLowerCase().replace(/_/g, ' ');
    if (subType === 'gut_brain') {
      const isBrainVagus = lower.includes('hypothalamus') || lower.includes('medulla oblongata') ||
                           lower.includes('pons') || lower.includes('midbrain') ||
                           lower.includes('vagus') || lower.includes('superior frontal gyrus') ||
                           lower.includes('posterior nucleus of vagus');
      const isDigestiveTract = lower.includes('stomach') || lower.includes('esophagus') ||
                               lower.includes('oesophagus') || lower.includes('duodenum') ||
                               lower.includes('jejunum') || lower.includes('ileum') ||
                               lower.includes('transverse colon') || lower.includes('ascending colon') ||
                               lower.includes('descending colon') || lower.includes('sigmoid colon') ||
                               lower.includes('omentum') || lower.includes('meso');
      return isBrainVagus || isDigestiveTract;
    }
    if (subType === 'spinal_cord') {
      return lower.includes('spinal cord') || lower.includes('horn of spinal cord') ||
             lower.includes('white matter of spinal cord') || lower.includes('cauda equina') ||
             lower.includes('root of spinal nerve') || lower.includes('spinal nerve') ||
             lower.includes('spinal dura');
    }
    if (subType === 'cns') {
      return lower.includes('brain') || lower.includes('cerebr') || lower.includes('cerebell') ||
             lower.includes('gyrus') || lower.includes('sulcus') || lower.includes('pons') ||
             lower.includes('medulla oblongata') || lower.includes('midbrain') ||
             lower.includes('thalamus') || lower.includes('hypothalamus') || lower.includes('ventricle') ||
             lower.includes('spinal cord') || lower.includes('cauda equina');
    }
    if (subType === 'lymphatic') {
      return partSys === 'lymphatic';
    }
    if (subType === 'urinary') {
      return lower.includes('kidney') || lower.includes('ureter') || lower.includes('urinary bladder') || lower.includes('urethra') || lower.includes('renal');
    }
    if (subType === 'csf_axis') {
      return lower.includes('ventricle') || lower.includes('choroid plexus') || lower.includes('aqueduct') || lower.includes('spinal dura');
    }
    if (subType === 'hepatobiliary') {
      return lower.includes('liver') || lower.includes('gallbladder') || lower.includes('pancrea') || lower.includes('bile') || lower.includes('duodenum');
    }
    if (subType === 'respiratory') {
      return lower.includes('bronchus') || lower.includes('lung') || lower.includes('trachea') || lower.includes('pleura') || lower.includes('nasal') || lower.includes('pharynx') || lower.includes('epiglottis');
    }
    if (subType === 'digestive') {
      return lower.includes('colon') || lower.includes('liver') || lower.includes('pancrea') || lower.includes('stomach') || lower.includes('duodenum') || lower.includes('jejunum') || lower.includes('appendix') || lower.includes('bile') || lower.includes('gallbladder') || lower.includes('esophagus') || lower.includes('oesophagus') || lower.includes('parotid') || lower.includes('sublingual') || lower.includes('submandibular') || lower.includes('gingiva') || lower.includes('tongue') || lower.includes('palate') || lower.includes('omentum') || lower.includes('taenia') || lower.includes('meso');
    }
    if (subType === 'urinary_genital') {
      return lower.includes('kidney') || lower.includes('bladder') || lower.includes('ureter') || lower.includes('urethra') || lower.includes('renal') || lower.includes('penis') || lower.includes('prostate') || lower.includes('testis') || lower.includes('seminal') || lower.includes('deferens') || lower.includes('epididymis') || lower.includes('ejaculatory');
    }
    if (subType === 'endocrine') {
      return lower.includes('thyroid') || lower.includes('suprarenal') || lower.includes('hypophysis') || lower.includes('pineal');
    }
    if (subType === 'spine') {
      return lower.includes('vertebra') || lower.includes('sacrum') || lower.includes('coccyx') || lower.includes('intervertebral disc') || lower.includes('nucleus pulposus');
    }
    return true;
  };

  const keepParts = new Set();
  const ghostParts = new Set();

  getMeshRegistry().forEach((node, id) => {
    const partSys = node.userData?.system;
    const isTargetSystem = subType ? subTypeFilter(id, partSys) : (partSys === targetSystemId || partSys === baseSystem);

    if (isTargetSystem) {
      keepParts.add(id);
      setStructureVisible(id, true);
      restoreMaterial(id);
    } else if (allowedSystems.has(partSys) && (partSys === 'visceral' || partSys === 'nervous')) {
      setStructureVisible(id, false);
    } else if (partSys === 'skeletal' || partSys === 'joints') {
      setStructureVisible(id, true);
      ghostParts.add(id);
    } else {
      setStructureVisible(id, false);
    }
  });

  // Apply Ghosting to reference skeleton
  ghostedIds = ghostParts;
  ghostParts.forEach(id => {
    ownMeshesOf(id).forEach(mesh => {
      releaseMaterial(mesh, id);
      ownMaterials(mesh).forEach(mat => {
        mat.transparent = true;
        mat.opacity = 0.22;
        mat.depthWrite = false;
        mat.needsUpdate = true;
      });
    });
  });

  // Restore vibrant solid materials on target organ system
  keepParts.forEach(id => {
    restoreMaterial(id);
    if (targetSystemId === 'spinal_cord') {
      ownMeshesOf(id).forEach(mesh => {
        ownMaterials(mesh).forEach(mat => {
          mat.transparent = false;
          mat.opacity = 1.0;
          mat.depthWrite = true;
          mat.emissive = new THREE.Color(0xa855f7);
          mat.emissiveIntensity = 0.75;
          mat.needsUpdate = true;
        });
      });
    }
  });

  // 6. Camera Focus & Frame the entire system
  if (activeViewer) {
    await focusOnSystem(targetSystemId, activeViewer, true);
    activeViewer.render();
  }

  // 7. Hide single-part callout pin
  hideCallout();

  // 8. Update UI Selection Card with System Showcase Mode
  const synthesizedSystemPart = {
    id: `system_${targetSystemId}`,
    meshName: profile.nameVi,
    displayName: profile.nameVi,
    isSystem: true,
    system: targetSystemId,
    systemProfile: profile,
    info: {
      name: { vi: profile.nameVi, en: profile.nameEn },
      latinName: profile.nameLatin,
      system: targetSystemId,
      description: profile.summary,
      function: profile.speech15s,
      keyOrgans: profile.keyOrgans
    }
  };
  setSelectedPart(synthesizedSystemPart);

  // Directly update info panel content and trigger UI expansion
  if (typeof window !== 'undefined') {
    const card = document.getElementById('selectionCard');
    if (card) {
      card.classList.remove('hidden');
      if (window.setSheetSnapTier) window.setSheetSnapTier('compact');
    }
    import('../ui/infoPanel.js').then(({ updateInfoPanelContent }) => {
      updateInfoPanelContent(synthesizedSystemPart, activeViewer);
    }).catch(() => {});
    window.dispatchEvent(new CustomEvent('system-showcase-active', { detail: profile }));
  }

  // 9. Speak 15s zero-fluff summary
  if (options.autoSpeak !== false) {
    speakVietnamese(profile.speech15s);
  }

  return true;
}

if (typeof window !== 'undefined') {
  window.showcaseWholeSystem = showcaseWholeSystem;
}