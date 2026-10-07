// Visibility Management - Hide, isolate, transparency, restore
import * as THREE from 'three';
import { state, setHiddenParts, setTransparentParts, setIsolatedPart, getPartState, setPartState, batchPartStates, notify } from '../state/store.js';
import { getMeshRegistry, getMeshesBySystem, ownMeshesOf, withDescendants } from './loadModel.js';
import { updateBodyEnvelopeAuto } from './bodyEnvelope.js';

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
// GHOST_OPACITY = 0.035 ensures background structures remain transparent and clear without thick milky haze
const GHOST_OPACITY = 0.035;
const ghostVariants = new WeakMap();

function ghostVariantOf(material) {
  let ghost = ghostVariants.get(material);
  if (!ghost) {
    ghost = material.clone();
    ghost.transparent = true;
    ghost.opacity = GHOST_OPACITY;
    ghost.depthWrite = false;
    ghostVariants.set(material, ghost);
  }
  return ghost;
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
      const keeping = keep.has(id);
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
    return ['Bile duct', 'Liver', 'Duodenum'];
  }
  if (lower === 'bile duct' || lower.includes('ống mật') || lower.includes('ductus choledochus')) {
    return ['Gallbladder', 'Liver', 'Duodenum', 'Pancreatic duct'];
  }
  if (lower === 'pancreas' || lower.includes('tụy')) {
    return ['Pancreatic duct', 'Accessory pancreatic duct', 'Duodenum', 'Bile duct', 'Spleen'];
  }
  if (lower.startsWith('kidney') || lower.includes('thận') || lower.includes('ren ')) {
    const isLeft = lower.includes('.l') || lower.includes('left') || lower.includes('trái');
    const side = isLeft ? '.l' : '.r';
    return [`Renal pelvis${side}`, `Ureter${side}`, `Suprarenal gland${side}`, 'Urinary bladder'];
  }
  if (lower.includes('urinary bladder') || lower.includes('bàng quang')) {
    return ['Ureter.l', 'Ureter.r', 'Prostate', 'Urethra'];
  }
  // Knee complex: ACL, PCL, Meniscus must bring along opposing cruciate, menisci, and articular bone ends
  if (lower.includes('cruciate') || lower.includes('meniscus') || lower.includes('patellar ligament')) {
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
  // Gastrointestinal tract: Stomach brings Duodenum, Liver, and Colon context
  if (lower === 'stomach' || lower.includes('dạ dày') || lower.includes('gaster')) {
    return ['Duodenum', 'Liver', 'Pancreas', 'Transverse colon'];
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
    if (keep.has(id)) return;

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
    // Liver: elegant translucent bed (35% opacity) showing gallbladder resting under right lobe
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
    // Duodenum: subtle context translucency (28% opacity) showing terminal duct entry
    ownMeshesOf('Duodenum').forEach(mesh => {
      ownMaterials(mesh).forEach(mat => {
        mat.transparent = true;
        mat.opacity = 0.28;
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

// Highlighting only touches `emissive`, so it can be undone without disturbing
// a transparency the user set.
export function highlightMesh(partId, color = 0xffdf5d, intensity = 0.5) {
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