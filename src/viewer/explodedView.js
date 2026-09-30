// Exploded View Engine - Smoothly displaces anatomical structures outward
import * as THREE from 'three';
import { getMeshRegistry } from './loadModel.js';

let currentFactor = 0;
const cachedDisplacements = new Map(); // Map<Mesh, THREE.Vector3>

/**
 * Computes an anatomical displacement vector for a mesh.
 * Meshes explode radially from the body center, with vertical expansion for vertebrae.
 */
function computeDisplacement(mesh) {
  if (cachedDisplacements.has(mesh)) {
    return cachedDisplacements.get(mesh);
  }

  // Record initial local position once
  if (!mesh.userData._basePosition) {
    mesh.userData._basePosition = mesh.position.clone();
  }

  const box = new THREE.Box3().setFromObject(mesh);
  const center = new THREE.Vector3();
  box.getCenter(center);

  // Anatomical center axis: (0, y, 0)
  const name = (mesh.name || '').toLowerCase();
  let dx = center.x * 2.2;
  let dy = (center.y - 1.0) * 0.9;
  let dz = center.z * 2.0;

  // Specific anatomical tuning for clean separation
  if (name.includes('vertebra') || name.includes('atlas') || name.includes('axis') || name.includes('sacrum') || name.includes('coccyx')) {
    // Expand spine vertically along Y
    dy = (center.y - 1.1) * 2.0;
    dx = center.x * 0.5;
    dz = (center.z + 0.05) * 1.5;
  } else if (name.includes('rib') || name.includes('costa') || name.includes('sternum')) {
    // Expand ribcage outward anteriorly and laterally
    dx = center.x * 2.8;
    dz = center.z * 2.6;
    dy = (center.y - 1.25) * 0.8;
  } else if (name.includes('cranium') || name.includes('frontal') || name.includes('parietal') || name.includes('occipital') || name.includes('temporal') || name.includes('maxilla') || name.includes('mandible')) {
    // Explode skull outward from head center (0, 1.65, 0)
    dx = center.x * 3.0;
    dy = (center.y - 1.65) * 2.5;
    dz = (center.z - 0.05) * 2.8;
  } else if (name.includes('scapula') || name.includes('clavicle') || name.includes('humerus') || name.includes('radius') || name.includes('ulna') || name.includes('carpal') || name.includes('hand')) {
    // Arms move strongly laterally
    dx = center.x * 2.5;
    dy = (center.y - 1.2) * 0.5;
    dz = center.z * 1.2;
  } else if (name.includes('femur') || name.includes('patella') || name.includes('tibia') || name.includes('fibula') || name.includes('tarsal') || name.includes('foot')) {
    // Legs move laterally and down
    dx = center.x * 2.2;
    dy = (center.y - 0.8) * 0.7;
    dz = center.z * 1.5;
  }

  const vec = new THREE.Vector3(dx, dy, dz);
  cachedDisplacements.set(mesh, vec);
  return vec;
}

/**
 * Sets the explosion factor from 0.0 (assembled) to 1.0 (fully exploded).
 */
export function setExplodeFactor(factor, viewer) {
  currentFactor = Math.max(0, Math.min(1, factor));
  const registry = getMeshRegistry();

  registry.forEach((node) => {
    node.traverse((child) => {
      if (child.isMesh) {
        if (!child.userData._basePosition) {
          child.userData._basePosition = child.position.clone();
        }

        if (currentFactor === 0) {
          child.position.copy(child.userData._basePosition);
        } else {
          const disp = computeDisplacement(child);
          child.position.copy(child.userData._basePosition).addScaledVector(disp, currentFactor * 0.35);
        }
      }
    });
  });

  if (viewer) {
    viewer.render();
  }
}

export function getExplodeFactor() {
  return currentFactor;
}

export function resetExplode(viewer) {
  setExplodeFactor(0, viewer);
}
