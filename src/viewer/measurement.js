// 3D Anatomical Measurement (Caliper) System
// Allows students & clinicians to measure real anatomical distances on 3D structures
import * as THREE from 'three';
import { getPickTargets } from './loadModel.js';

let isMeasuring = false;
let pointA = null; // THREE.Vector3
let pointB = null; // THREE.Vector3
let markerA = null; // THREE.Mesh
let markerB = null; // THREE.Mesh
let measureLine = null; // THREE.Line
let measureBadge = null; // DOM Element
let unsubscribeFrame = null;
let onMeasureChangeCallback = null;

// Raycaster for surface points
const raycaster = new THREE.Raycaster();
raycaster.firstHitOnly = true;
const mouse = new THREE.Vector2();

/**
 * Activates or deactivates measurement mode
 */
export function toggleMeasurementMode(viewer, onMeasureChange) {
  isMeasuring = !isMeasuring;
  onMeasureChangeCallback = onMeasureChange;

  if (isMeasuring) {
    clearMeasurement(viewer);
    if (viewer?.canvas) {
      viewer.canvas.style.cursor = 'crosshair';
    }
    initBadge(viewer);
  } else {
    clearMeasurement(viewer);
    if (viewer?.canvas) {
      viewer.canvas.style.cursor = '';
    }
    removeBadge();
  }

  return isMeasuring;
}

export function isMeasurementActive() {
  return isMeasuring;
}

/**
 * Handles pointer click in measurement mode
 * Returns true if the click was consumed by measurement
 */
export function handleMeasurementClick(event, viewer) {
  if (!isMeasuring || !viewer) return false;

  const rect = viewer.canvas.getBoundingClientRect();
  const clientX = event.clientX || (event.touches && event.touches[0].clientX) || 0;
  const clientY = event.clientY || (event.touches && event.touches[0].clientY) || 0;

  mouse.x = ((clientX - rect.left) / rect.width) * 2 - 1;
  mouse.y = -((clientY - rect.top) / rect.height) * 2 + 1;

  raycaster.setFromCamera(mouse, viewer.camera);
  const hits = raycaster.intersectObjects(getPickTargets(), true);

  const hit = hits.find(h => h.object.visible);
  if (!hit) return false;

  const hitPoint = hit.point.clone();
  const partName = hit.object.userData?.partId || hit.object.name || 'Cấu trúc 3D';

  if (!pointA) {
    // Set First Point
    pointA = hitPoint;
    markerA = createMarker(pointA, 0x00f0ff, viewer);
    if (navigator.vibrate) navigator.vibrate(20);

    onMeasureChangeCallback?.({
      status: 'point1_set',
      point1: pointA,
      part1: partName
    });
  } else if (!pointB) {
    // Set Second Point
    pointB = hitPoint;
    markerB = createMarker(pointB, 0xffd700, viewer);
    createMeasurementLine(pointA, pointB, viewer);
    if (navigator.vibrate) navigator.vibrate([20, 50, 20]);

    // Calculate real anatomical scale
    // In Z-Anatomy 1.0 unit ≈ 1.0 meter (100 cm)
    const distanceMeters = pointA.distanceTo(pointB);
    const distanceCm = (distanceMeters * 100).toFixed(1);
    const distanceMm = (distanceMeters * 1000).toFixed(0);

    updateBadgeText(`${distanceCm} cm (${distanceMm} mm)`);

    onMeasureChangeCallback?.({
      status: 'completed',
      point1: pointA,
      point2: pointB,
      part2: partName,
      distanceCm,
      distanceMm
    });
  } else {
    // Reset and start new measurement from this point
    clearMeasurement(viewer);
    pointA = hitPoint;
    markerA = createMarker(pointA, 0x00f0ff, viewer);
    if (navigator.vibrate) navigator.vibrate(20);

    onMeasureChangeCallback?.({
      status: 'point1_set',
      point1: pointA,
      part1: partName
    });
  }

  viewer.render();
  return true;
}

function createMarker(position, colorHex, viewer) {
  const geom = new THREE.SphereGeometry(0.015, 16, 16);
  const mat = new THREE.MeshBasicMaterial({
    color: colorHex,
    depthTest: false,
    transparent: true,
    opacity: 0.95
  });
  const mesh = new THREE.Mesh(geom, mat);
  mesh.position.copy(position);
  mesh.renderOrder = 999;
  viewer.scene.add(mesh);
  return mesh;
}

function createMeasurementLine(p1, p2, viewer) {
  if (measureLine && viewer.scene) {
    viewer.scene.remove(measureLine);
    measureLine.geometry.dispose();
    measureLine.material.dispose();
  }

  const points = [p1, p2];
  const geom = new THREE.BufferGeometry().setFromPoints(points);
  const mat = new THREE.LineBasicMaterial({
    color: 0x00f0ff,
    linewidth: 3,
    depthTest: false,
    transparent: true,
    opacity: 0.9
  });
  measureLine = new THREE.Line(geom, mat);
  measureLine.renderOrder = 998;
  viewer.scene.add(measureLine);
}

function initBadge(viewer) {
  if (measureBadge) return;

  const container = document.getElementById('viewerContainer');
  if (!container) return;

  measureBadge = document.createElement('div');
  measureBadge.className = 'measure-badge';
  measureBadge.id = 'measureBadge';
  measureBadge.style.display = 'none';
  container.appendChild(measureBadge);

  if (viewer.onFrame) {
    unsubscribeFrame = viewer.onFrame(() => updateBadgePosition(viewer));
  }
}

function removeBadge() {
  if (measureBadge) {
    measureBadge.remove();
    measureBadge = null;
  }
  if (unsubscribeFrame) {
    unsubscribeFrame();
    unsubscribeFrame = null;
  }
}

function updateBadgeText(text) {
  if (measureBadge) {
    measureBadge.innerHTML = `📏 <strong>${text}</strong>`;
    measureBadge.style.display = 'block';
  }
}

function updateBadgePosition(viewer) {
  if (!measureBadge || !pointA || !pointB || !viewer) return;

  const midpoint = new THREE.Vector3().addVectors(pointA, pointB).multiplyScalar(0.5);
  const { camera, canvas } = viewer;

  const projected = midpoint.clone().project(camera);
  if (projected.z > 1.0 || projected.z < -1.0) {
    measureBadge.style.display = 'none';
    return;
  }

  const width = canvas.clientWidth;
  const height = canvas.clientHeight;
  const x = (projected.x * 0.5 + 0.5) * width;
  const y = (-projected.y * 0.5 + 0.5) * height;

  measureBadge.style.transform = `translate(-50%, -50%) translate3d(${x}px, ${y}px, 0)`;
  measureBadge.style.display = 'block';
}

/**
 * Clears current measurement points and lines
 */
export function clearMeasurement(viewer) {
  pointA = null;
  pointB = null;

  if (viewer?.scene) {
    if (markerA) {
      viewer.scene.remove(markerA);
      markerA.geometry.dispose();
      markerA.material.dispose();
      markerA = null;
    }
    if (markerB) {
      viewer.scene.remove(markerB);
      markerB.geometry.dispose();
      markerB.material.dispose();
      markerB = null;
    }
    if (measureLine) {
      viewer.scene.remove(measureLine);
      measureLine.geometry.dispose();
      measureLine.material.dispose();
      measureLine = null;
    }
    viewer.render();
  }

  if (measureBadge) {
    measureBadge.style.display = 'none';
  }
}
