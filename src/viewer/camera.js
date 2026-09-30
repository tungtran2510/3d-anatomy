// Camera Controls - Predefined views, animations, and camera management
import * as THREE from 'three';
import { state, setAnimating, setCurrentView, notify } from '../state/store.js';
import { restoreAllParts } from './visibility.js';

const VIEWS = {
  front: { position: new THREE.Vector3(0, 0, 1), target: new THREE.Vector3(0, 0, 0) },
  back: { position: new THREE.Vector3(0, 0, -1), target: new THREE.Vector3(0, 0, 0) },
  left: { position: new THREE.Vector3(-1, 0, 0), target: new THREE.Vector3(0, 0, 0) },
  right: { position: new THREE.Vector3(1, 0, 0), target: new THREE.Vector3(0, 0, 0) },
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

  // Frame the model where it actually is; it is not centred on the origin.
  const distance = model.maxDim * 1.5;
  const targetTarget = model.center.clone();
  const targetPos = view.position.clone().multiplyScalar(distance).add(targetTarget);

  if (animate) {
    return animateCamera(camera, controls, targetPos, targetTarget);
  } else {
    camera.position.copy(targetPos);
    controls.target.copy(targetTarget);
    controls.update();
    setCurrentView(viewName);
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

function animateCamera(camera, controls, targetPosition, targetTarget) {
  // A full-viewport camera flight is exactly what reduced-motion is about.
  if (window.matchMedia?.('(prefers-reduced-motion: reduce)').matches) {
    camera.position.copy(targetPosition);
    controls.target.copy(targetTarget);
    controls.update();
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

      if (progress < 1) {
        requestAnimationFrame(animate);
      } else {
        setAnimating(false);
        resolve();
      }
    }

    requestAnimationFrame(animate);
  });
}

// `spread` sets how much room is left around the structure. Selecting uses a
// gentler value than double-click, which is an explicit "take me there".
export function focusOnMesh(mesh, viewer, animate = true, spread = 2.5) {
  const { camera, controls } = viewer;

  const box = new THREE.Box3().setFromObject(mesh);
  const center = box.getCenter(new THREE.Vector3());
  const size = box.getSize(new THREE.Vector3());
  const maxDim = Math.max(size.x, size.y, size.z);

  // A small bone would otherwise pull the camera inside neighbouring geometry.
  const currentDistance = camera.position.distanceTo(controls.target);
  const distance = Math.min(Math.max(maxDim * spread, maxDim * 1.2), currentDistance);

  // Calculate direction from current camera to target
  const direction = new THREE.Vector3().subVectors(camera.position, controls.target).normalize();
  const targetPosition = center.clone().add(direction.multiplyScalar(distance));

  if (animate) {
    return animateCamera(camera, controls, targetPosition, center);
  } else {
    camera.position.copy(targetPosition);
    controls.target.copy(center);
    controls.update();
    return Promise.resolve();
  }
}

export function resetView(viewer, animate = true) {
  return setView('front', viewer, animate).then(() => {
    // Show all parts
    showAllParts();
    notify('viewReset', true);
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
  return animateCamera(camera, controls, targetPos, targetTarget);
}