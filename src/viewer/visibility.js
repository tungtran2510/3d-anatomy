// Visibility Management - Hide, isolate, transparency, restore
import * as THREE from 'three';
import { state, setHiddenParts, setTransparentParts, setIsolatedPart, getPartState, setPartState, batchPartStates, notify, setSelectedPart, pushUndo } from '../state/store.js';
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

export function isolatePart(partId, viewer = null) {
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

  // Focus & Frame camera smoothly on the isolated unit
  const activeViewer = viewer || state.viewer || (typeof window !== 'undefined' ? window.viewer : null);
  if (activeViewer) {
    import('./camera.js').then(({ focusOnMesh }) => {
      const meshes = ownMeshesOf(partId);
      if (meshes.length > 0) {
        focusOnMesh(meshes[0], activeViewer, true, 2.2);
        activeViewer.render();
      }
    }).catch(() => {});
  }
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

/**
 * Automatically peels / hides anterior obscuring structures (ribs, sternum, pectoralis, abdominal wall)
 * in front of a deep selected structure (Heart, Lungs, Stomach, Liver, Sciatic nerve...)
 * to provide an unobstructed 1-touch view on mobile.
 */
export function peelAnteriorObstacles(targetPartId, viewer) {
  const activeViewer = viewer || state.viewer || (typeof window !== 'undefined' ? window.viewer : null);
  const partId = targetPartId || (state.selectedPart ? state.selectedPart.id : null);
  if (!partId) return false;

  const lower = String(partId).toLowerCase();
  const obstaclesToHide = new Set();

  // 1. Thoracic & Cardiac organs (Heart, Lungs, Great vessels) -> Peels Sternum, Costal cartilages, Anterior ribs, Pectoralis muscles
  if (
    lower.includes('heart') || lower.includes('tim') || lower.includes('ventricle') || lower.includes('atrium') ||
    lower.includes('coronary') || lower.includes('lung') || lower.includes('phổi') || lower.includes('trachea') ||
    lower.includes('aorta') || lower.includes('pulmonary') || lower.includes('esophagus')
  ) {
    ['Body of sternum', 'Manubrium of sternum', 'Xiphoid process', 'First rib.l', 'First rib.r'].forEach(id => obstaclesToHide.add(id));
    getMeshRegistry().forEach((node, id) => {
      const idLow = id.toLowerCase();
      if ((idLow.includes('rib') && !idLow.includes('t11') && !idLow.includes('t12')) || idLow.includes('costal cartilage') || idLow.includes('sternum') || idLow.includes('pectoralis')) {
        obstaclesToHide.add(id);
      }
    });
  }
  // 2. Abdominal organs (Stomach, Liver, Gallbladder, Pancreas, Intestines) -> Peels Rectus abdominis & anterior rib margin
  else if (
    lower.includes('stomach') || lower.includes('dạ dày') || lower.includes('liver') || lower.includes('gan') ||
    lower.includes('gallbladder') || lower.includes('túi mật') || lower.includes('pancreas') || lower.includes('tụy') ||
    lower.includes('duodenum') || lower.includes('colon') || lower.includes('ruột') || lower.includes('appendix')
  ) {
    getMeshRegistry().forEach((node, id) => {
      const idLow = id.toLowerCase();
      if (idLow.includes('rectus abdominis') || idLow.includes('external oblique') || idLow.includes('internal oblique') || idLow.includes('transversus abdominis') || idLow.includes('pyramidalis') || idLow.includes('rectus sheath')) {
        obstaclesToHide.add(id);
      }
    });
  }
  // 3. Posterior Pelvis & Sciatic nerve -> Peels Gluteus maximus & medius
  else if (lower.includes('sciatic') || lower.includes('tọa') || lower.includes('piriformis')) {
    getMeshRegistry().forEach((node, id) => {
      const idLow = id.toLowerCase();
      if (idLow.includes('gluteus maximus') || idLow.includes('gluteus medius')) {
        obstaclesToHide.add(id);
      }
    });
  }
  // 4. Knee joint (ACL, PCL, Meniscus) -> Peels Patella & Patellar ligament & Quadriceps tendon
  else if (lower.includes('cruciate') || lower.includes('meniscus') || lower.includes('sụn chêm') || lower.includes('dây chằng chéo')) {
    const isLeft = lower.includes('.l') || lower.includes('left');
    const side = isLeft ? '.l' : '.r';
    obstaclesToHide.add(`Patella${side}`);
    obstaclesToHide.add(`Patellar ligament${side}`);
    obstaclesToHide.add(`Quadriceps femoris${side}`);
  }

  if (obstaclesToHide.size === 0) {
    return false;
  }

  batchPartStates(() => {
    obstaclesToHide.forEach(id => {
      setStructureVisible(id, false);
    });
  });

  pushUndo({
    type: 'peel_obstacles',
    targetPartId: partId,
    peeledIds: Array.from(obstaclesToHide)
  });

  if (activeViewer && typeof activeViewer.render === 'function') {
    activeViewer.render();
  }

  return true;
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
  stopPathologyPulse();
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
  // Vertebra & Functional Spinal Unit (Đốt sống & Đĩa đệm liền kề)
  if (/^vertebra\s+[lcst]\d+/i.test(partId) || /^lumbar vertebra/i.test(partId) || /^cervical vertebra/i.test(partId) || /^thoracic vertebra/i.test(partId)) {
    if (partId.includes('L4') || partId.includes('IV')) {
      return ['Intervertebral disc L4-L5', 'Intervertebral_disc_L4-L5', 'Nucleus pulposus L4-L5', 'Intervertebral disc L3-L4', 'Vertebra L5', 'Lumbar vertebra L5', 'Vertebra L3', 'Lumbar vertebra L3'];
    }
    if (partId.includes('L5') || partId.includes('V')) {
      return ['Intervertebral disc L5-S1', 'Intervertebral_disc_L5-S1', 'Nucleus pulposus L5-S1', 'Intervertebral disc L4-L5', 'Sacrum', 'Vertebra L4', 'Lumbar vertebra L4'];
    }
    if (partId.includes('L3') || partId.includes('III')) {
      return ['Intervertebral disc L3-L4', 'Intervertebral disc L2-L3', 'Vertebra L4', 'Lumbar vertebra L4', 'Vertebra L2', 'Lumbar vertebra L2'];
    }
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
      'Aortic arch',
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
  // Knee complex: ACL, PCL, Meniscus, Patella & Patellar ligament
  if (lower.includes('cruciate') || lower.includes('meniscus') || lower.includes('patellar') || lower.includes('patella') || lower.includes('khớp gối')) {
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
      `Patellar ligament${side}`,
      'Anterior cruciate ligament',
      'Posterior cruciate ligament',
      'Medial meniscus',
      'Lateral meniscus',
      'Patella.l', 'Patella.r'
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
  stopPathologyPulse();
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

// =========================================================================
// HIGH-YIELD CLINICAL PATHOLOGY SHOWCASE ENGINE (STEP 3)
// =========================================================================

export const PATHOLOGY_PROFILES = {
  'disc_herniation': {
    id: 'disc_herniation',
    title: 'Thoát vị đĩa đệm cột sống L4-L5',
    category: 'Cột sống & Đĩa đệm',
    partId: 'Intervertebral disc L4-L5',
    targetMesh: 'Intervertebral disc L4-L5',
    requiredSystems: ['skeletal', 'joints', 'nervous'],
    emissiveColor: 0xef4444, // Fire Red
    emissiveIntensity: 0.95,
    speech15s: 'Thoát vị đĩa đệm L4-L5: Nhân nhầy thoát vị chèn ép rễ thần kinh tọa L5 gây đau buốt dọc từ thắt lưng xuống chân.',
    keywords: [
      'thoát vị đĩa đệm', 'thoat vi dia dem', 'thoát vị l4 l5', 'thoat vi l4 l5',
      'thoát vị l5 s1', 'thoat vi l5 s1', 'thoát vị cột sống', 'thoat vi cot song',
      'thoát vị', 'thoat vi', 'chèn rễ l5', 'l4-l5'
    ]
  },
  'spinal_spondylosis': {
    id: 'spinal_spondylosis',
    title: 'Gai cột sống & Thoái hóa đốt sống',
    category: 'Cột sống & Đĩa đệm',
    partId: 'Vertebra L4',
    targetMesh: 'Vertebra L4',
    requiredSystems: ['skeletal', 'joints'],
    emissiveColor: 0xf59e0b, // Degenerative Gold
    emissiveIntensity: 0.90,
    speech15s: 'Gai cột sống hình thành do đĩa đệm xẹp thoái hóa, cơ thể tăng sinh màng xương tạo mấu gai rìa thân đốt sống, có thể chèn ép rễ thần kinh.',
    keywords: [
      'gai cột sống', 'gai cot song', 'thoái hóa cột sống', 'thoai hoa cot song',
      'thoái hóa đốt sống', 'thoai hoa dot song', 'gai xương', 'gai xuong',
      'chồi xương', 'choi xuong', 'spondylosis'
    ]
  },
  'knee_acl': {
    id: 'knee_acl',
    title: 'Đứt dây chằng chéo trước (ACL)',
    category: 'Khớp gối & Vận động',
    partId: 'Anterior cruciate ligament.r',
    targetMesh: 'Anterior cruciate ligament.r',
    requiredSystems: ['skeletal', 'joints'],
    emissiveColor: 0xef4444, // Acute Tear Red
    emissiveIntensity: 0.95,
    speech15s: 'Đứt dây chằng chéo trước ACL làm mất điểm tựa giữ mâm chày, khiến khớp gối bị lỏng lẻo khi đi cầu thang và dễ tổn thương sụn chêm.',
    keywords: [
      'đứt dây chằng chéo trước', 'dut day chang cheo truoc', 'đứt dây chằng chéo',
      'dut day chang cheo', 'đứt acl', 'dut acl', 'giãn dây chằng chéo',
      'gian day chang cheo', 'chấn thương acl', 'đứt dây chằng gối'
    ]
  },
  'knee_meniscus_tear': {
    id: 'knee_meniscus_tear',
    title: 'Rách sụn chêm khớp gối (Meniscus Tear)',
    category: 'Khớp gối & Vận động',
    partId: 'Lateral meniscus.r',
    targetMesh: 'Lateral meniscus.r',
    requiredSystems: ['skeletal', 'joints'],
    emissiveColor: 0xf97316, // Vivid Orange Tear
    emissiveIntensity: 0.95,
    speech15s: 'Rách sụn chêm khớp gối xảy ra khi gối chịu lực xoắn vặn đột ngột, mảnh sụn rách kẹt vào khe khớp gây hiện tượng kẹt khớp và sưng đau.',
    keywords: [
      'rách sụn chêm', 'rach sun chem', 'sụn chêm rách', 'sun chem rach',
      'rách sụn chêm ngoài', 'rách sụn chêm trong', 'kẹt khớp gối', 'ket khop goi', 'meniscus tear'
    ]
  },
  'knee_effusion': {
    id: 'knee_effusion',
    title: 'Tràn dịch khớp gối & Viêm bao hoạt dịch',
    category: 'Khớp gối & Vận động',
    partId: 'Patella.r',
    targetMesh: 'Patella.r',
    requiredSystems: ['skeletal', 'joints'],
    emissiveColor: 0x06b6d4, // Cyan Hydration / Effusion
    emissiveIntensity: 0.85,
    opacity: 0.65,
    speech15s: 'Tràn dịch khớp gối do màng hoạt dịch bị viêm kích thích tăng tiết lượng lớn dịch nhờn vào ổ khớp, làm đầu gối sưng phù bập bềnh xương bánh chè.',
    keywords: [
      'tràn dịch khớp gối', 'tran dich khop goi', 'tràn dịch gối', 'tran dich goi',
      'sưng khớp gối', 'sung khop goi', 'viêm bao hoạt dịch', 'viem bao hoat dich',
      'bập bềnh bánh chè', 'dịch khớp gối'
    ]
  },
  'rotator_cuff_tear': {
    id: 'rotator_cuff_tear',
    title: 'Rách gân chóp xoay vai (Rotator Cuff Tear)',
    category: 'Khớp vai',
    partId: 'Supraspinatus muscle.r',
    targetMesh: 'Supraspinatus muscle.r',
    requiredSystems: ['skeletal', 'muscular'],
    emissiveColor: 0xef4444, // Red Tear
    emissiveIntensity: 0.95,
    speech15s: 'Rách gân chóp xoay vai thường gặp ở gân cơ trên gai bị cọ xát dưới mỏm cùng vai, gây đau buốt dữ dội khi nhấc tay qua đầu và yếu lực dạng vai.',
    keywords: [
      'rách chóp xoay', 'rach chop xoay', 'rách gân chóp xoay', 'chóp xoay vai',
      'chop xoay vai', 'đứt gân chóp xoay', 'rách gân cơ trên gai', 'cơ trên gai',
      'viêm gân chóp xoay', 'rotator cuff tear', 'rotator cuff'
    ]
  },
  'frozen_shoulder': {
    id: 'frozen_shoulder',
    title: 'Viêm quanh khớp vai (Đông cứng khớp vai)',
    category: 'Khớp vai',
    partId: 'Articular capsule of glenohumeral joint.r',
    targetMesh: 'Articular capsule of glenohumeral joint.r',
    requiredSystems: ['skeletal', 'joints', 'muscular'],
    emissiveColor: 0x38bdf8, // Ice Sky Blue
    emissiveIntensity: 0.90,
    speech15s: 'Viêm quanh khớp vai thể đông cứng khiến bao khớp vai bị viêm dày dính co rút, làm mất hoàn toàn biên độ vận động quay và nâng của khớp vai.',
    keywords: [
      'viêm quanh khớp vai', 'viem quanh khop vai', 'đông cứng vai', 'dong cung vai',
      'đông cứng khớp vai', 'dong cung khop vai', 'vai đông cứng', 'bao khớp vai',
      'dính bao khớp vai', 'frozen shoulder'
    ]
  },
  'sciatica_nerve': {
    id: 'sciatica_nerve',
    title: 'Chèn ép dây thần kinh tọa (Sciatica)',
    category: 'Thần kinh',
    partId: 'Sciatic nerve.r',
    targetMesh: 'Sciatic nerve.r',
    requiredSystems: ['skeletal', 'nervous', 'muscular'],
    emissiveColor: 0xf59e0b, // Electric Amber
    emissiveIntensity: 0.95,
    speech15s: 'Chèn ép dây thần kinh tọa do thoát vị đĩa đệm hoặc co thắt cơ hình lê ở mông, gây cơn đau nhói như điện giật phóng dọc từ mông xuống gót chân.',
    keywords: [
      'chèn ép thần kinh tọa', 'chen ep than kinh toa', 'đau thần kinh tọa',
      'dau than kinh toa', 'đau dây thần kinh tọa', 'hội chứng cơ hình lê',
      'chèn ép rễ tọa', 'sciatica'
    ]
  },
  'carpal_tunnel': {
    id: 'carpal_tunnel',
    title: 'Hội chứng ống cổ tay (CTS)',
    category: 'Thần kinh',
    partId: 'Median nerve.r',
    targetMesh: 'Median nerve.r',
    requiredSystems: ['skeletal', 'nervous'],
    emissiveColor: 0xf59e0b, // Electric Amber
    emissiveIntensity: 0.95,
    speech15s: 'Hội chứng ống cổ tay xảy ra khi dây thần kinh giữa bị chèn ép trong đường hầm cổ tay hẹp, gây tê buốt các ngón cái, trỏ, giữa và teo hõm cơ mô cái.',
    keywords: [
      'hội chứng ống cổ tay', 'hoi chung ong co tay', 'tê tay ống cổ tay',
      'chèn ép thần kinh giữa', 'hẹp ống cổ tay', 'cts', 'carpal tunnel'
    ]
  },
  'coronary_artery_disease': {
    id: 'coronary_artery_disease',
    title: 'Hẹp xơ vữa động mạch vành & Thiếu máu cơ tim',
    category: 'Tim mạch & Tiêu hóa',
    partId: 'Left coronary artery',
    targetMesh: 'Left coronary artery',
    requiredSystems: ['skeletal', 'cardiovascular'],
    emissiveColor: 0xef4444, // Stenosis Red
    emissiveIntensity: 0.95,
    speech15s: 'Hẹp xơ vữa động mạch vành làm giảm lưu lượng máu nuôi cơ tim, gây cơn đau thắt ngực đè nặng khi gắng sức và nguy cơ nhồi máu cơ tim cấp tử vong.',
    keywords: [
      'hẹp động mạch vành', 'hep dong mach vanh', 'tắc động mạch vành',
      'xơ vữa động mạch vành', 'nhồi máu cơ tim', 'nhoi mau co tim',
      'thiếu máu cơ tim', 'đau thắt ngực', 'mạch vành tắc hẹp'
    ]
  },
  'acute_appendicitis': {
    id: 'acute_appendicitis',
    title: 'Viêm ruột thừa cấp & Biến chứng vỡ mủ',
    category: 'Tim mạch & Tiêu hóa',
    partId: 'Vermiform appendix',
    targetMesh: 'Vermiform appendix',
    requiredSystems: ['skeletal', 'visceral'],
    emissiveColor: 0xef4444, // Acute Inflamed Red
    emissiveIntensity: 0.95,
    speech15s: 'Viêm ruột thừa cấp xuất phát từ tắc nghẽn lòng ruột thừa do sỏi phân, vi khuẩn sinh sôi gây sưng to ứ mủ và đau nhói dữ dội tại hố chậu phải điểm McBurney.',
    keywords: [
      'viêm ruột thừa', 'viem ruot thua', 'viêm ruột thừa cấp', 'viem ruot thua cap',
      'ruột thừa cấp', 'ruot thua cap', 'đau ruột thừa', 'dau ruot thua', 'mcburney'
    ]
  },
  'gastric_ulcer': {
    id: 'gastric_ulcer',
    title: 'Viêm loét dạ dày - tá tràng & Vi khuẩn HP',
    category: 'Tim mạch & Tiêu hóa',
    partId: 'Stomach',
    targetMesh: 'Stomach',
    requiredSystems: ['skeletal', 'visceral'],
    emissiveColor: 0xf43f5e, // Gastric Mucosa Rose Red
    emissiveIntensity: 0.85,
    speech15s: 'Viêm loét dạ dày tá tràng do mất cân bằng giữa axit dịch vị và lớp nhầy bảo vệ niêm mạc, vi khuẩn HP ăn mòn thành dạ dày gây đau rát cồn cào thượng vị.',
    keywords: [
      'viêm loét dạ dày', 'viem loet da day', 'loét dạ dày', 'loet da day',
      'loét dạ dày tá tràng', 'loet da day ta trang', 'dạ dày tá tràng',
      'thủng dạ dày', 'vi khuẩn hp', 'h.pylori'
    ]
  },
  'gerd_reflux': {
    id: 'gerd_reflux',
    title: 'Trào ngược dạ dày thực quản (GERD) & Bỏng rát niêm mạc',
    category: 'Tim mạch & Tiêu hóa',
    partId: 'Esophagus',
    targetMesh: 'Esophagus',
    requiredSystems: ['skeletal', 'visceral'],
    emissiveColor: 0xf97316, // Acid Burn Orange
    emissiveIntensity: 0.95,
    speech15s: 'Trào ngược dạ dày thực quản xảy ra khi cơ thắt thực quản dưới đóng không kín, axit dịch vị trào ngược gây bỏng rát sau xương ức, ợ chua và viêm loét niêm mạc thực quản.',
    keywords: [
      'trào ngược dạ dày', 'trao nguoc da day', 'gerd', 'trào ngược thực quản',
      'ợ chua', 'viêm thực quản trào ngược', 'trao nguoc thuc quan'
    ]
  },
  'kidney_stones': {
    id: 'kidney_stones',
    title: 'Sỏi thận - niệu quản & Cơn đau quặn thận',
    category: 'Tiết niệu & Tiêu hóa',
    partId: 'Kidney.r',
    targetMesh: 'Kidney.r',
    requiredSystems: ['skeletal', 'visceral'],
    emissiveColor: 0xf59e0b, // Colic Amber
    emissiveIntensity: 0.95,
    speech15s: 'Sỏi thận kết tinh từ lắng đọng khoáng chất, khi sỏi di chuyển kẹt tại đoạn hẹp niệu quản gây ứ nước bể thận và bùng phát cơn đau quặn thận dữ dội lan xuống bẹn.',
    keywords: [
      'sỏi thận', 'soi than', 'sỏi niệu quản', 'soi nieu quan',
      'cơn đau quặn thận', 'đau sỏi thận', 'ứ nước thận'
    ]
  },
  'patellar_tendinitis': {
    id: 'patellar_tendinitis',
    title: 'Viêm gân bánh chè (Jumper’s Knee) & Khớp gối',
    category: 'Khớp gối & Vận động',
    partId: 'Patella.r',
    targetMesh: 'Patella.r',
    requiredSystems: ['skeletal', 'muscular'],
    emissiveColor: 0xef4444, // Tendon Inflammation Red
    emissiveIntensity: 0.95,
    speech15s: 'Viêm gân bánh chè do quá tải lặp đi lặp lại từ các động tác nhảy hoặc chạy dốc, làm rách vi thể sợi collagen gân bánh chè, gây sưng đau nhói ngay dưới xương bánh chè.',
    keywords: [
      'viêm gân bánh chè', 'viem gan banh che', 'gân bánh chè',
      'jumper knee', 'đau gân bánh chè'
    ]
  }
};

/**
 * Match a user query or caseId against the high-yield clinical pathology profiles
 */
export function matchPathologyProfile(query) {
  if (!query) return null;
  const q = String(query).toLowerCase().trim();

  // 1. Direct ID match
  if (PATHOLOGY_PROFILES[q]) return PATHOLOGY_PROFILES[q];

  // 2. Keyword exact / inclusion match (longest keywords first)
  const profiles = Object.values(PATHOLOGY_PROFILES);
  for (const p of profiles) {
    const sortedKeywords = [...p.keywords].sort((a, b) => b.length - a.length);
    for (const kw of sortedKeywords) {
      if (q === kw || q.includes(kw)) {
        return p;
      }
    }
  }

  // 3. Match by partId
  for (const p of profiles) {
    if (p.partId.toLowerCase() === q || q.includes(p.partId.toLowerCase())) {
      return p;
    }
  }

  return null;
}

// Dynamic 3D Pathology Lesion Pulse Engine (60fps smooth breathing glow)
let activePathologyPulseId = null;

export function stopPathologyPulse() {
  if (activePathologyPulseId) {
    cancelAnimationFrame(activePathologyPulseId);
    activePathologyPulseId = null;
  }
}

export function startPathologyPulse(targetMeshes, baseColorHex, baseIntensity = 1.0, activeViewer = null) {
  stopPathologyPulse();
  if (!targetMeshes || targetMeshes.length === 0) return;
  const v = activeViewer || state.viewer || (typeof window !== 'undefined' ? window.viewer : null);
  const color = new THREE.Color(baseColorHex);
  const startTime = performance.now();

  function pulseFrame(now) {
    const elapsedSec = (now - startTime) / 1000;
    // Breathing frequency 1.25Hz: wave from 0.70 to 1.35
    const wave = 0.70 + 0.65 * (0.5 + 0.5 * Math.sin(elapsedSec * Math.PI * 2.5));
    const currentIntensity = baseIntensity * wave;

    targetMeshes.forEach(mesh => {
      if (!mesh || !mesh.visible) return;
      ownMaterials(mesh).forEach(mat => {
        if (mat.emissive) {
          mat.emissive.copy(color);
          mat.emissiveIntensity = currentIntensity;
        }
      });
    });

    if (v && typeof v.render === 'function') {
      v.render();
    }
    activePathologyPulseId = requestAnimationFrame(pulseFrame);
  }

  activePathologyPulseId = requestAnimationFrame(pulseFrame);
}

/**
 * Dynamically synchronizes the 4 pathology stages (0 to 3) into the 3D anatomical model:
 * - Stage 0: Healthy physiology / normal state (calm tissue, mild emissive 0.15)
 * - Stage 1: Mild / Early reaction (amber-gold glow #f59e0b, 0.65 intensity)
 * - Stage 2: Acute lesion / Partial tear / Clear compression (vibrant orange-red #f97316, 1.05 intensity, pulsing)
 * - Stage 3: Severe complication / Full tear / Chronic degeneration (intense crimson #ef4444, 1.45 intensity, rapid pulsing)
 */
export function updatePathologyStageVisuals(stageIndex, partId, viewer) {
  const activeViewer = viewer || state.viewer || (typeof window !== 'undefined' ? window.viewer : null);
  const targetId = partId || (state.selectedPart ? state.selectedPart.id : null);
  if (!targetId) return;

  const targetMeshes = ownMeshesOf(targetId);
  if (targetMeshes.length === 0) return;

  const stage = Math.max(0, Math.min(3, parseInt(stageIndex, 10) || 0));

  stopPathologyPulse();

  let colorHex = 0x38bdf8;
  let intensity = 0.5;
  let shouldPulse = false;

  switch (stage) {
    case 0:
      colorHex = 0x22c55e; // Green / calm physiological
      intensity = 0.15;
      break;
    case 1:
      colorHex = 0xf59e0b; // Amber-gold
      intensity = 0.65;
      break;
    case 2:
      colorHex = 0xf97316; // Fiery orange
      intensity = 1.05;
      shouldPulse = true;
      break;
    case 3:
      colorHex = 0xef4444; // Acute crimson red
      intensity = 1.45;
      shouldPulse = true;
      break;
  }

  const c = new THREE.Color(colorHex);
  targetMeshes.forEach(mesh => {
    mesh.visible = true;
    ownMaterials(mesh).forEach(mat => {
      if (mat.emissive) {
        mat.emissive.copy(c);
        mat.emissiveIntensity = intensity;
        mat.needsUpdate = true;
      }
    });
  });

  if (shouldPulse) {
    startPathologyPulse(targetMeshes, colorHex, intensity, activeViewer);
  } else if (activeViewer && typeof activeViewer.render === 'function') {
    activeViewer.render();
  }
}

/**
 * Seamlessly showcases a clinical pathology case in 3D:
 * 1. Loads and activates required systems (keeps skeletal reference intact).
 * 2. Emissive highlight on target lesion with dynamic 60fps breathing pulse.
 * 3. Ghosting surrounding anatomical reference structures with crisp translucent crystal opacity.
 * 4. Smooth medical camera framing directly onto the lesion with optimal line-of-sight.
 * 5. Expands selection card / bottom sheet and activates 4-stage pathology simulator.
 * 6. Speaks 15s clinical zero-fluff audio explanation.
 */
export async function showcasePathology(caseIdOrQuery, viewer, options = {}) {
  const activeViewer = viewer || state.viewer || (typeof window !== 'undefined' ? window.viewer : null);
  const profile = matchPathologyProfile(caseIdOrQuery);
  if (!profile) {
    console.warn('Unknown pathology profile:', caseIdOrQuery);
    return false;
  }

  // 1. Load and show all required systems
  if (activeViewer) {
    for (const sys of profile.requiredSystems) {
      if (!state.loadedSystems.includes(sys)) {
        try {
          await loadModel(sys, activeViewer);
        } catch (err) {
          console.warn('Failed background load of system:', sys, err);
        }
      }
      showSystem(sys);
    }
  }

  // 2. Select target structure
  const { selectPartById } = await import('./selection.js');
  const { focusOnMesh } = await import('./camera.js');
  const { updateInfoPanelContent } = await import('../ui/infoPanel.js');
  const { getClinicalData } = await import('../data/clinicalInfo.js');

  let selected = selectPartById(profile.partId, activeViewer, true, true);
  if (!selected && profile.targetMesh) {
    selected = selectPartById(profile.targetMesh, activeViewer, true, true);
  }

  // 3. Ghost surrounding reference structures (skeletal, adjacent organs)
  ghostAllExcept(profile.partId);

  // 4. Apply vibrant pathology emissive glow to the lesion & start breathing pulse
  const targetMeshes = ownMeshesOf(profile.partId);
  targetMeshes.forEach(mesh => {
    mesh.visible = true;
    ownMaterials(mesh).forEach(mat => {
      mat.emissive = new THREE.Color(profile.emissiveColor);
      mat.emissiveIntensity = profile.emissiveIntensity || 0.95;
      if (profile.opacity) {
        mat.transparent = true;
        mat.opacity = profile.opacity;
        mat.depthWrite = false;
      }
      mat.needsUpdate = true;
    });
  });

  // Start alive breathing pulse on lesion
  startPathologyPulse(targetMeshes, profile.emissiveColor, profile.emissiveIntensity || 1.05, activeViewer);

  // 5. Camera framing: focus directly on the target lesion
  if (targetMeshes.length > 0 && activeViewer) {
    await focusOnMesh(targetMeshes[0], activeViewer, true, 2.2);
    activeViewer.render();
  }

  // 6. Update Selection Card / Bottom Sheet UI
  const clinical = getClinicalData(profile.partId);
  const synthesizedPart = {
    id: profile.partId,
    meshName: profile.targetMesh || profile.partId,
    displayName: profile.title,
    pathologyProfile: profile,
    system: profile.requiredSystems[profile.requiredSystems.length - 1],
    info: {
      name: { vi: profile.title, en: profile.partId },
      latinName: clinical?.nameLatin || profile.partId,
      system: profile.requiredSystems[profile.requiredSystems.length - 1],
      description: profile.speech15s,
      function: clinical?.function || '',
      clinical: clinical?.clinical || ''
    }
  };
  setSelectedPart(synthesizedPart);

  if (typeof window !== 'undefined') {
    const card = document.getElementById('selectionCard');
    if (card) {
      card.classList.remove('hidden');
      if (window.setSheetSnapTier) window.setSheetSnapTier('compact');
    }
    updateInfoPanelContent(synthesizedPart, activeViewer);
    window.dispatchEvent(new CustomEvent('expand-selection-card'));
    window.dispatchEvent(new CustomEvent('pathology-showcase-active', { detail: profile }));

    // Set interactive 4-stage slider to active lesion level (Stage 1 or 2)
    setTimeout(() => {
      const slider = document.getElementById('pathologyRangeSlider');
      if (slider) {
        slider.value = 1;
        slider.dispatchEvent(new Event('input', { bubbles: true }));
      }
    }, 200);
  }

  // 7. 15s zero-fluff clinical explanation
  if (options.autoSpeak !== false) {
    speakVietnamese(profile.speech15s);
  }

  return { success: true, profile, partId: profile.partId };
}

if (typeof window !== 'undefined') {
  window.showcaseWholeSystem = showcaseWholeSystem;
  window.showcasePathology = showcasePathology;
  window.matchPathologyProfile = matchPathologyProfile;
  window.updatePathologyStageVisuals = updatePathologyStageVisuals;
  window.startPathologyPulse = startPathologyPulse;
  window.stopPathologyPulse = stopPathologyPulse;
  window.isolatePart = isolatePart;
  window.peelAnteriorObstacles = peelAnteriorObstacles;
}