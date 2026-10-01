// 3D Anatomical Cross-Section / Clipping Planes System
// Supports Sagittal (Đứng dọc), Coronal (Đứng ngang / trán), Axial / Transverse (Nằm ngang)
import * as THREE from 'three';

let activePlaneType = null; // 'sagittal' | 'coronal' | 'axial' | null
let clipPlane = null;
let isFlipped = false;
let currentOffset = 0;
let planeHelper = null;

const PLANE_DEFAULTS = {
  sagittal: {
    nameVi: 'Mặt phẳng đứng dọc (Sagittal)',
    normal: new THREE.Vector3(1, 0, 0),
    min: -0.4,
    max: 0.4,
    step: 0.01,
    defaultVal: 0.0
  },
  coronal: {
    nameVi: 'Mặt phẳng đứng ngang (Coronal)',
    normal: new THREE.Vector3(0, 0, 1),
    min: -0.3,
    max: 0.3,
    step: 0.01,
    defaultVal: 0.0
  },
  axial: {
    nameVi: 'Mặt phẳng nằm ngang (Axial / Transverse)',
    normal: new THREE.Vector3(0, 1, 0),
    min: 0.0,
    max: 1.8,
    step: 0.02,
    defaultVal: 1.0
  }
};

let showPlaneHelper = false;

/**
 * Initializes clipping plane system with Three.js renderer
 */
export function initClipping(viewer) {
  if (!viewer || !viewer.renderer) return;
  viewer.renderer.localClippingEnabled = true;
  viewer.renderer.clippingPlanes = [];
}

/**
 * Sets active clipping plane
 * @param {'sagittal' | 'coronal' | 'axial' | null} type 
 * @param {number|object} offset 
 * @param {boolean} flipped 
 * @param {object} viewer 
 * @param {boolean} withHelper
 */
export function setClippingPlane(type, offset, flipped = false, viewer, withHelper = false) {
  // Support flexible signature setClippingPlane(type, viewer)
  if (offset && typeof offset === 'object' && offset.renderer) {
    viewer = offset;
    offset = undefined;
    flipped = false;
  }

  if (!viewer || !viewer.renderer) return;

  if (!type || !PLANE_DEFAULTS[type]) {
    disableClipping(viewer);
    return;
  }

  activePlaneType = type;
  isFlipped = flipped;
  showPlaneHelper = withHelper;
  const config = PLANE_DEFAULTS[type];
  currentOffset = (typeof offset === 'number') ? offset : config.defaultVal;

  const normal = config.normal.clone();
  if (isFlipped) {
    normal.negate();
  }

  // constant is negative distance from origin along normal
  const constant = isFlipped ? currentOffset : -currentOffset;

  clipPlane = new THREE.Plane(normal, constant);
  viewer.renderer.clippingPlanes = [clipPlane];

  // Visual plane helper if requested
  updatePlaneHelper(viewer);

  viewer.render();
}

/**
 * Updates offset of the current clipping plane
 */
export function updateClippingOffset(offset, viewer) {
  if (!clipPlane || !activePlaneType || !viewer) return;

  currentOffset = offset;
  const constant = isFlipped ? currentOffset : -currentOffset;
  clipPlane.constant = constant;

  updatePlaneHelper(viewer);
  viewer.render();
}

/**
 * Toggles normal direction of the clipping plane
 */
export function toggleClippingFlip(viewer) {
  if (!activePlaneType || !viewer) return isFlipped;
  setClippingPlane(activePlaneType, currentOffset, !isFlipped, viewer, showPlaneHelper);
  return isFlipped;
}

/**
 * Disables clipping and restores full 3D rendering
 */
export function disableClipping(viewer) {
  activePlaneType = null;
  clipPlane = null;
  showPlaneHelper = false;

  if (viewer && viewer.renderer) {
    viewer.renderer.clippingPlanes = [];
    if (planeHelper && viewer.scene) {
      viewer.scene.remove(planeHelper);
      planeHelper.dispose();
      planeHelper = null;
    }
    viewer.render();
  }
}

/**
 * Toggles Half-Body Hemisection (Bật/Tắt nửa người)
 * Slices the body along the sagittal plane (midline, x = 0)
 * @param {object} viewer
 * @returns {boolean} true if half-body is now active, false if disabled
 */
export function toggleHalfBody(viewer) {
  if (activePlaneType === 'sagittal') {
    disableClipping(viewer);
    return false;
  } else {
    // Sagittal cut at x = 0.0 with clean cut
    setClippingPlane('sagittal', 0.0, false, viewer, false);
    return true;
  }
}

export function isHalfBodyActive() {
  return activePlaneType === 'sagittal';
}

export function flipHalfBody(viewer) {
  if (activePlaneType === 'sagittal') {
    return toggleClippingFlip(viewer);
  }
  return false;
}

function updatePlaneHelper(viewer) {
  if (!viewer || !viewer.scene) return;

  if (planeHelper) {
    viewer.scene.remove(planeHelper);
    planeHelper.dispose();
    planeHelper = null;
  }

  if (!clipPlane || !showPlaneHelper) return;

  // Soft translucent green-cyan helper disc
  planeHelper = new THREE.PlaneHelper(clipPlane, 0.8, 0x00f0ff);
  planeHelper.material.transparent = true;
  planeHelper.material.opacity = 0.25;
  planeHelper.material.depthWrite = false;
  viewer.scene.add(planeHelper);
}

export function getClippingState() {
  return {
    activeType: activePlaneType,
    offset: currentOffset,
    isFlipped,
    config: activePlaneType ? PLANE_DEFAULTS[activePlaneType] : null
  };
}
