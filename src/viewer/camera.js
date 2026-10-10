// Camera Controls - Predefined views, animations, and camera management
import * as THREE from 'three';
import { state, setAnimating, setCurrentView, notify } from '../state/store.js';
import { restoreAllParts } from './visibility.js';
import { ownMeshesOf } from './loadModel.js';

const VIEWS = {
  front: { position: new THREE.Vector3(0, 0, 1), target: new THREE.Vector3(0, 0, 0) },
  back: { position: new THREE.Vector3(0, 0, -1), target: new THREE.Vector3(0, 0, 0) },
  left: { position: new THREE.Vector3(-0.72, 0.12, 0.68).normalize(), target: new THREE.Vector3(0, 0, 0) },
  right: { position: new THREE.Vector3(0.72, 0.12, 0.68).normalize(), target: new THREE.Vector3(0, 0, 0) }, // Anterolateral 3/4 Perspective (Góc nhìn nghiêng 3/4 chuẩn Visible Body)
  top: { position: new THREE.Vector3(0, 1, 0), target: new THREE.Vector3(0, 0, 0) },
  bottom: { position: new THREE.Vector3(0, -1, 0), target: new THREE.Vector3(0, 0, 0) },
  full: { position: new THREE.Vector3(0, 0, 1), target: new THREE.Vector3(0, 0, 0) }
};

const ANIMATION_DURATION = 500; // ms

export function setView(viewName, viewer, animate = true) {
  const view = VIEWS[viewName];
  if (!view) return Promise.resolve();

  const { camera, controls } = viewer;
  const model = getModelBounds(viewer.scene);

  if (!model) return Promise.resolve();

  // Frame the model where it actually is; adapted for 35° telephoto medical lens
  const aspect = camera.aspect || (window.innerWidth / window.innerHeight) || 1;
  const fovRad = THREE.MathUtils.degToRad(camera.fov || 35);
  const tanHalfFov = Math.tan(fovRad / 2);
  const distV = (model.size.y / 2) / tanHalfFov;
  const distH = (model.size.x / 2) / (tanHalfFov * aspect);
  const padding = aspect < 1.0 ? 1.25 : 1.15;
  const distance = Math.max(distV, distH) * padding;
  const targetTarget = model.center.clone();
  const targetPos = view.position.clone().multiplyScalar(distance).add(targetTarget);

  if (animate) {
    return animateCamera(camera, controls, targetPos, targetTarget, viewer);
  } else {
    camera.position.copy(targetPos);
    controls.target.copy(targetTarget);
    controls.update();
    setCurrentView(viewName);
    viewer?.render();
    return Promise.resolve();
  }
}

function getModelBounds(scene) {
  const box = new THREE.Box3();
  let hasMesh = false;

  scene.traverse(child => {
    if (child.isMesh && child.visible) {
      box.expandByObject(child);
      hasMesh = true;
    }
  });

  if (!hasMesh || box.isEmpty()) return null;

  const size = box.getSize(new THREE.Vector3());
  const center = box.getCenter(new THREE.Vector3());
  const maxDim = Math.max(size.x, size.y, size.z);

  return { box, size, center, maxDim };
}

function animateCamera(camera, controls, targetPosition, targetTarget, viewer) {
  const activeViewer = viewer || state.viewer || window.viewer;
  // A full-viewport camera flight is exactly what reduced-motion is about.
  if (window.matchMedia?.('(prefers-reduced-motion: reduce)').matches) {
    camera.position.copy(targetPosition);
    controls.target.copy(targetTarget);
    controls.update();
    activeViewer?.render();
    return Promise.resolve();
  }

  return new Promise(resolve => {
    setAnimating(true);

    const startPosition = camera.position.clone();
    const startTarget = controls.target.clone();
    const startTime = performance.now();

    function animate(time) {
      const elapsed = time - startTime;
      const progress = Math.min(elapsed / ANIMATION_DURATION, 1);

      // Easing function (ease-out cubic)
      const eased = 1 - Math.pow(1 - progress, 3);

      camera.position.lerpVectors(startPosition, targetPosition, eased);
      controls.target.lerpVectors(startTarget, targetTarget, eased);
      controls.update();
      activeViewer?.render();

      if (progress < 1) {
        requestAnimationFrame(animate);
      } else {
        setAnimating(false);
        activeViewer?.render();
        resolve();
      }
    }

    requestAnimationFrame(animate);
  });
}

// `spread` sets how much room is left around the structure. Selecting uses a
// Context-preserving structure indication (Góc nhìn chỉ điểm bao quát, không zoom sát rạt)
// Preserves surrounding anatomical overview so user sees where the structure is in relation to the body.
export function focusOnMesh(mesh, viewer, animate = true, spread = 2.5, isExplicitZoom = false) {
  const { camera, controls } = viewer;

  const box = new THREE.Box3();
  const partId = mesh.userData?.partId;
  const meshes = partId ? ownMeshesOf(partId) : [];
  if (meshes.length > 0) {
    meshes.forEach(m => box.expandByObject(m));
  } else {
    box.setFromObject(mesh);
  }

  const center = new THREE.Vector3();
  if (box.isEmpty()) {
    mesh.getWorldPosition(center);
  } else {
    box.getCenter(center);
  }

  const size = box.isEmpty() ? new THREE.Vector3(0.08, 0.08, 0.08) : box.getSize(new THREE.Vector3());
  const maxDim = Math.max(size.x, size.y, size.z, 0.05);

  // Calculate direction from current camera to target, preserving user's viewing angle
  let direction = new THREE.Vector3().subVectors(camera.position, controls.target).normalize();
  if (direction.lengthSq() < 0.001) {
    direction.set(0, 0, 1).normalize();
  }

  // Smoothly rotate camera to optimal anatomical line of sight:
  // If the target is primarily posterior (e.g. Sciatic nerve, gluteal muscles, erector spinae, latissimus),
  // and the current camera is viewing from anterior (direction.z > -0.1),
  // rotate to an optimal posterior 3/4 perspective so the user sees the organ directly!
  const isPosterior = /sciatic|glute|trapezius|latissimus|erector|infraspinatus|teres|poplite|rhomboid|splenius|multifidus|spinalis|longissimus|iliocostalis/i.test(partId || '');
  if (isPosterior && direction.z > -0.1) {
    const sideX = (partId && partId.endsWith('.r')) ? 0.35 : -0.35;
    direction.set(sideX, 0.12, -0.92).normalize();
  } else {
    // If target is primarily anterior (appendix, ACL, deltoid, stomach) and camera is looking from behind:
    const isAnterior = /appendix|cruciate|deltoid|stomach|liver|gallbladder|rectus femoris|biceps brachii/i.test(partId || '');
    if (isAnterior && direction.z < 0.1) {
      const sideX = (partId && (partId.endsWith('.l') || partId.includes('appendix'))) ? 0.35 : -0.35;
      direction.set(sideX, 0.12, 0.92).normalize();
    }
  }

  const fovRad = THREE.MathUtils.degToRad(camera.fov || 35);
  const tanHalfFov = Math.tan(fovRad / 2);
  const aspect = camera.aspect || (typeof window !== 'undefined' ? window.innerWidth / window.innerHeight : 1) || 1;

  let distance;
  if (isExplicitZoom) {
    // Explicit close-up inspection
    distance = Math.max(0.18, (maxDim / 2) / (tanHalfFov * Math.min(1, aspect)) * 1.25);
  } else {
    // Adaptively frame structure in anatomical context:
    // Small structures (discs, cruciate ligaments, appendix): zoom in to ~0.36m - 0.55m so the 3D structure is clearly visible
    // Medium organs (stomach, heart, kidney, deltoid): ~0.75m - 1.15m
    // Large regions / nerve paths (sciatic nerve): ~0.9m - 1.35m
    const fittedDist = (maxDim / 2) / (tanHalfFov * Math.min(1, aspect)) * 2.15;
    distance = Math.max(0.36, Math.min(fittedDist, 2.2));
  }

  const targetPosition = center.clone().add(direction.clone().multiplyScalar(distance));

  if (animate) {
    return animateCamera(camera, controls, targetPosition, center, viewer);
  } else {
    camera.position.copy(targetPosition);
    controls.target.copy(center);
    controls.update();
    viewer?.render();
    return Promise.resolve();
  }
}

// Explicit Step 2: Jump into close-up detail inspection
export function zoomIntoMesh(mesh, viewer, animate = true) {
  return focusOnMesh(mesh, viewer, animate, 2.5, true);
}

// Zoom out back to comfortable regional overview
export function zoomOutToOverview(viewer, animate = true) {
  if (!viewer) return Promise.resolve();
  const { camera, controls } = viewer;
  const curDist = camera.position.distanceTo(controls.target);
  if (curDist >= 1.9) return Promise.resolve(); // already wide
  const direction = new THREE.Vector3().subVectors(camera.position, controls.target).normalize();
  const targetPos = controls.target.clone().add(direction.multiplyScalar(2.15));
  if (animate) {
    return animateCamera(camera, controls, targetPos, controls.target, viewer);
  } else {
    camera.position.copy(targetPos);
    controls.update();
    viewer?.render();
    return Promise.resolve();
  }
}

// Whole System Framing: Smoothly centers and frames an entire organ system or regional division
export function focusOnSystem(systemId, viewer, animate = true) {
  const activeViewer = viewer || state.viewer || window.viewer;
  if (!activeViewer) return Promise.resolve();
  const { camera, controls, scene } = activeViewer;

  const box = new THREE.Box3();
  let count = 0;

  const subTypeCheck = (name, subType) => {
    const lower = (name || '').toLowerCase().replace(/_/g, ' ');
    if (subType === 'gut_brain') {
      const isBrainVagus = lower.includes('hypothalamus') || lower.includes('medulla') ||
                           lower.includes('pons') || lower.includes('midbrain') ||
                           lower.includes('vagus') || lower.includes('superior frontal gyrus');
      const isDigestiveTract = lower.includes('stomach') || lower.includes('esophagus') ||
                               lower.includes('oesophagus') || lower.includes('duodenum') ||
                               lower.includes('jejunum') || lower.includes('ileum') ||
                               lower.includes('colon') || lower.includes('omentum');
      return isBrainVagus || isDigestiveTract;
    }
    if (subType === 'spinal_cord') {
      return lower.includes('spinal cord') || lower.includes('horn of spinal cord') ||
             lower.includes('white matter of spinal cord') || lower.includes('cauda equina') ||
             lower.includes('root of spinal nerve') || lower.includes('spinal dura');
    }
    if (subType === 'cns') {
      return lower.includes('brain') || lower.includes('cerebr') || lower.includes('cerebell') ||
             lower.includes('gyrus') || lower.includes('pons') || lower.includes('medulla') ||
             lower.includes('spinal cord') || lower.includes('cauda equina');
    }
    if (subType === 'urinary') {
      return lower.includes('kidney') || lower.includes('ureter') || lower.includes('bladder') || lower.includes('urethra') || lower.includes('renal');
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
    return false;
  };

  scene.traverse(child => {
    if (child.isMesh && child.visible) {
      const partId = child.userData?.partId || child.name || '';
      const partSystem = child.userData?.system;
      let matches = false;

      if (['spine', 'spinal_cord', 'gut_brain', 'cns', 'urinary', 'csf_axis', 'hepatobiliary', 'digestive', 'respiratory', 'urinary_genital', 'endocrine'].includes(systemId)) {
        matches = subTypeCheck(partId, systemId);
      } else if (partSystem === systemId || child.name.toLowerCase().includes(systemId)) {
        matches = true;
      }

      if (matches) {
        box.expandByObject(child);
        count++;
      }
    }
  });

  if (count === 0 || box.isEmpty()) {
    const bounds = getModelBounds(scene);
    if (!bounds) return Promise.resolve();
    box.copy(bounds.box);
  }

  const center = box.getCenter(new THREE.Vector3());
  const size = box.getSize(new THREE.Vector3());

  let direction = new THREE.Vector3(0.35, 0.12, 0.93).normalize();
  if (systemId === 'spine' || systemId === 'spinal_cord') {
    direction.set(-0.45, 0.1, -0.88).normalize();
  } else if (systemId === 'gut_brain') {
    direction.set(0.32, 0.08, 0.94).normalize();
  } else if (systemId === 'csf_axis') {
    direction.set(0.35, 0.2, 0.91).normalize();
  }

  const fovRad = THREE.MathUtils.degToRad(camera.fov || 35);
  const tanHalfFov = Math.tan(fovRad / 2);
  const aspect = camera.aspect || (typeof window !== 'undefined' ? window.innerWidth / window.innerHeight : 1) || 1;

  const distV = (size.y / 2) / tanHalfFov;
  const distH = (size.x / 2) / (tanHalfFov * aspect);
  const padding = aspect < 1.0 ? 1.25 : 1.15;
  const distance = Math.max(0.45, Math.max(distV, distH) * padding);

  const targetPosition = center.clone().add(direction.multiplyScalar(distance));

  if (animate) {
    return animateCamera(camera, controls, targetPosition, center, activeViewer);
  } else {
    camera.position.copy(targetPosition);
    controls.target.copy(center);
    controls.update();
    activeViewer?.render();
    return Promise.resolve();
  }
}

export function resetView(viewer, animate = true) {
  return setView('front', viewer, animate).then(() => {
    // Show all parts
    showAllParts();
    notify('viewReset', true);
    viewer?.render();
  });
}

// Material state is owned by viewer/visibility.js; this is kept as a thin alias
// because the toolbar still calls it.
export function showAllParts() {
  restoreAllParts();
}

export function getCurrentView() {
  return state.currentView;
}

export function isAnimating() {
  return state.isAnimating;
}

// View button handlers
export function setupViewButtons(viewer) {
  const buttons = {
    frontViewBtn: 'front',
    backViewBtn: 'back',
    sideViewBtn: 'left', // or right
    topViewBtn: 'top',
    bottomViewBtn: 'bottom'
  };

  Object.entries(buttons).forEach(([btnId, view]) => {
    const btn = document.getElementById(btnId);
    if (btn) {
      btn.addEventListener('click', () => setView(view, viewer));
    }
  });

  const resetBtn = document.getElementById('resetBtn');
  if (resetBtn) {
    resetBtn.addEventListener('click', () => resetView(viewer));
  }
}

export function frameRegion(regionCamera, viewer) {
  if (!viewer || !regionCamera) return Promise.resolve();
  const { camera, controls } = viewer;
  const targetPos = new THREE.Vector3(regionCamera.x, regionCamera.y, regionCamera.z);
  const targetTarget = new THREE.Vector3(regionCamera.targetX, regionCamera.targetY, regionCamera.targetZ);
  return animateCamera(camera, controls, targetPos, targetTarget, viewer);
}