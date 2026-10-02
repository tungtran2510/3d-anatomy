// Camera Controls - Predefined views, animations, and camera management
import * as THREE from 'three';
import { state, setAnimating, setCurrentView, notify } from '../state/store.js';
import { restoreAllParts } from './visibility.js';

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
  const distance = model.maxDim * 1.8;
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

  const box = new THREE.Box3().setFromObject(mesh);
  const center = box.getCenter(new THREE.Vector3());
  const size = box.getSize(new THREE.Vector3());
  const maxDim = Math.max(size.x, size.y, size.z, 0.05);

  let distance;
  if (isExplicitZoom) {
    // Explicit 2nd step: Smooth close-up inspection
    distance = Math.max(0.42, maxDim * 3.2);
  } else {
    // 1st step: Keep wide anatomical context (vẫn ở giải phẫu đó và chỉ vào)
    const curDist = camera.position.distanceTo(controls.target);
    if (curDist >= 0.85 && curDist <= 1.6) {
      distance = curDist; // Giữ nguyên khoảng cách hiện tại, không zoom giật
    } else if (curDist > 1.6) {
      distance = 1.25; // Chuyển từ toàn thân về tầm nhìn khu vực rộng rãi
    } else {
      distance = 0.95; // Đảm bảo khoảng cách tối thiểu luôn bao quát cả vùng
    }
  }

  // Calculate direction from current camera to target, biasing towards front view for visibility
  let direction = new THREE.Vector3().subVectors(camera.position, controls.target).normalize();
  if (direction.lengthSq() < 0.001 || direction.z < 0.2) {
    direction.set(direction.x * 0.4, 0.15, 0.85).normalize();
  }
  const targetPosition = center.clone().add(direction.multiplyScalar(distance));

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
  if (curDist >= 1.2) return Promise.resolve(); // already wide
  const direction = new THREE.Vector3().subVectors(camera.position, controls.target).normalize();
  const targetPos = controls.target.clone().add(direction.multiplyScalar(1.25));
  if (animate) {
    return animateCamera(camera, controls, targetPos, controls.target, viewer);
  } else {
    camera.position.copy(targetPos);
    controls.update();
    viewer?.render();
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