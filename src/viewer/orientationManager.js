// Model Orientation & Dissection Table Manager
// Supports Standing, Supine (nằm ngửa), Prone (nằm sấp), Sitting (ngồi)
// and Stainless Steel Cadaver Dissection Table (Bàn phẫu tích y khoa)
import * as THREE from 'three';
import { state } from '../state/store.js';

let currentOrientation = 'standing'; // 'standing' | 'supine' | 'prone' | 'sitting'
let isTableVisible = false;
let dissectionTableMesh = null;
let anatomyRootGroup = null;

export function getAnatomyRoot(scene) {
  if (!anatomyRootGroup) {
    anatomyRootGroup = new THREE.Group();
    anatomyRootGroup.name = 'anatomyRootGroup';
    const targetScene = scene || state.viewer?.scene || window.viewer?.scene;
    if (targetScene) {
      targetScene.add(anatomyRootGroup);
    }
  }
  return anatomyRootGroup;
}

export function getCurrentOrientation() {
  return currentOrientation;
}

export function getTableVisibility() {
  return isTableVisible;
}

let tableTrayMat = null;
let tableRimMat = null;
let tableLegMat = null;
let tableCasterMat = null;

export function updateDissectionTableTheme(isDarkParam, scene) {
  const isDark = isDarkParam !== undefined ? isDarkParam : (typeof document !== 'undefined' && (document.documentElement.getAttribute('data-theme') === 'dark' || document.body?.classList?.contains('theme-dark')));

  if (tableTrayMat) {
    if (isDark) {
      tableTrayMat.color.setHex(0x1e293b);
      tableTrayMat.metalness = 0.35;
      tableTrayMat.roughness = 0.42;
    } else {
      tableTrayMat.color.setHex(0xe2e8f0);
      tableTrayMat.metalness = 0.22;
      tableTrayMat.roughness = 0.42;
    }
    tableTrayMat.needsUpdate = true;
  }

  if (tableRimMat) {
    if (isDark) {
      tableRimMat.color.setHex(0x334155);
      tableRimMat.metalness = 0.38;
      tableRimMat.roughness = 0.35;
    } else {
      tableRimMat.color.setHex(0xcbd5e1);
      tableRimMat.metalness = 0.25;
      tableRimMat.roughness = 0.35;
    }
    tableRimMat.needsUpdate = true;
  }

  if (tableLegMat) {
    if (isDark) {
      tableLegMat.color.setHex(0x475569);
      tableLegMat.metalness = 0.40;
      tableLegMat.roughness = 0.38;
    } else {
      tableLegMat.color.setHex(0x94a3b8);
      tableLegMat.metalness = 0.28;
      tableLegMat.roughness = 0.38;
    }
    tableLegMat.needsUpdate = true;
  }

  if (tableCasterMat) {
    if (isDark) {
      tableCasterMat.color.setHex(0x0f172a);
      tableCasterMat.metalness = 0.30;
      tableCasterMat.roughness = 0.60;
    } else {
      tableCasterMat.color.setHex(0x64748b);
      tableCasterMat.metalness = 0.20;
      tableCasterMat.roughness = 0.60;
    }
    tableCasterMat.needsUpdate = true;
  }

  // Ensure all table children remain visible when table is visible
  if (dissectionTableMesh && isTableVisible) {
    dissectionTableMesh.traverse(child => {
      if (child.isMesh) child.visible = true;
    });
  }

  const targetViewer = state.viewer || window.viewer;
  targetViewer?.render?.();
  targetViewer?.invalidate?.(5);
}

// Procedural Stainless Steel Cadaver Dissection Table (Chuẩn Bàn Mổ Y Khoa)
export function createDissectionTable(scene) {
  if (dissectionTableMesh) return dissectionTableMesh;

  const isDark = typeof document !== 'undefined' && (document.documentElement.getAttribute('data-theme') === 'dark' || document.body?.classList?.contains('theme-dark'));

  const tableGroup = new THREE.Group();
  tableGroup.name = 'dissectionTableGroup';
  tableGroup.userData.isDissectionTable = true;

  // Materials: Adaptive Medical Brushed Stainless Steel
  tableTrayMat = new THREE.MeshStandardMaterial({
    color: isDark ? 0x1e293b : 0xe2e8f0,
    metalness: isDark ? 0.35 : 0.22,
    roughness: 0.42,
    name: 'DissectionTableTray'
  });

  tableRimMat = new THREE.MeshStandardMaterial({
    color: isDark ? 0x334155 : 0xcbd5e1,
    metalness: isDark ? 0.38 : 0.25,
    roughness: 0.35,
    name: 'DissectionTableRim'
  });

  tableLegMat = new THREE.MeshStandardMaterial({
    color: isDark ? 0x475569 : 0x94a3b8,
    metalness: isDark ? 0.40 : 0.28,
    roughness: 0.38,
    name: 'DissectionTableLegs'
  });

  tableCasterMat = new THREE.MeshStandardMaterial({
    color: isDark ? 0x0f172a : 0x64748b,
    metalness: isDark ? 0.30 : 0.20,
    roughness: 0.60,
    name: 'DissectionTableCasters'
  });

  // Table Top Dimensions (metres)
  const length = 2.15;
  const width = 0.86;
  const thickness = 0.04;
  const tableHeight = 0.74; // Surface at Y = 0.74m

  // 1. Main Tray
  const trayGeo = new THREE.BoxGeometry(width, thickness, length);
  const tray = new THREE.Mesh(trayGeo, tableTrayMat);
  tray.position.set(0, tableHeight - thickness / 2, 0);
  tray.userData.isDissectionTable = true;
  tableGroup.add(tray);

  // 2. Raised Perimeter Rim (Gờ chống tràn dịch mổ xung quanh)
  const rimHeight = 0.035;
  const rimThick = 0.025;

  // Left & Right Rims
  const longRimGeo = new THREE.BoxGeometry(rimThick, rimHeight, length);
  const leftRim = new THREE.Mesh(longRimGeo, tableRimMat);
  leftRim.position.set(-(width / 2) + rimThick / 2, tableHeight + rimHeight / 2, 0);
  leftRim.userData.isDissectionTable = true;
  tableGroup.add(leftRim);

  const rightRim = new THREE.Mesh(longRimGeo, tableRimMat);
  rightRim.position.set((width / 2) - rimThick / 2, tableHeight + rimHeight / 2, 0);
  rightRim.userData.isDissectionTable = true;
  tableGroup.add(rightRim);

  // Head & Foot Rims
  const shortRimGeo = new THREE.BoxGeometry(width, rimHeight, rimThick);
  const headRim = new THREE.Mesh(shortRimGeo, tableRimMat);
  headRim.position.set(0, tableHeight + rimHeight / 2, -(length / 2) + rimThick / 2);
  headRim.userData.isDissectionTable = true;
  tableGroup.add(headRim);

  const footRim = new THREE.Mesh(shortRimGeo, tableRimMat);
  footRim.position.set(0, tableHeight + rimHeight / 2, (length / 2) - rimThick / 2);
  footRim.userData.isDissectionTable = true;
  tableGroup.add(footRim);

  // 3. Four Tubular Stainless Steel Legs
  const legRadius = 0.022;
  const legHeight = tableHeight - thickness;
  const legGeo = new THREE.CylinderGeometry(legRadius, legRadius, legHeight, 16);
  const legX = width / 2 - 0.06;
  const legZ = length / 2 - 0.12;

  const legPositions = [
    [-legX, legZ],
    [legX, legZ],
    [-legX, -legZ],
    [legX, -legZ]
  ];

  legPositions.forEach(([x, z]) => {
    const leg = new THREE.Mesh(legGeo, tableLegMat);
    leg.position.set(x, legHeight / 2, z);
    leg.userData.isDissectionTable = true;
    tableGroup.add(leg);

    // Caster wheel at base
    const caster = new THREE.Mesh(new THREE.CylinderGeometry(0.03, 0.03, 0.04, 12), tableCasterMat);
    caster.rotation.z = Math.PI / 2;
    caster.position.set(x, 0.02, z);
    caster.userData.isDissectionTable = true;
    tableGroup.add(caster);
  });

  // 4. Sturdy H-Frame Crossbars (Thanh giằng chịu lực)
  const barRadius = 0.014;
  const barY = 0.22;

  // Longitudinal Bars
  const longBarGeo = new THREE.CylinderGeometry(barRadius, barRadius, legZ * 2, 12);
  const leftBar = new THREE.Mesh(longBarGeo, tableLegMat);
  leftBar.rotation.x = Math.PI / 2;
  leftBar.position.set(-legX, barY, 0);
  leftBar.userData.isDissectionTable = true;
  tableGroup.add(leftBar);

  const rightBar = new THREE.Mesh(longBarGeo, tableLegMat);
  rightBar.rotation.x = Math.PI / 2;
  rightBar.position.set(legX, barY, 0);
  rightBar.userData.isDissectionTable = true;
  tableGroup.add(rightBar);

  // Transverse Center Crossbar
  const transBarGeo = new THREE.CylinderGeometry(barRadius, barRadius, legX * 2, 12);
  const centerBar = new THREE.Mesh(transBarGeo, tableLegMat);
  centerBar.rotation.z = Math.PI / 2;
  centerBar.position.set(0, barY, 0);
  centerBar.userData.isDissectionTable = true;
  tableGroup.add(centerBar);

  tableGroup.visible = false;
  dissectionTableMesh = tableGroup;

  const targetScene = scene || state.viewer?.scene || window.viewer?.scene;
  if (targetScene) {
    targetScene.add(tableGroup);
  }

  return dissectionTableMesh;
}

export function setModelOrientation(orientation, viewer, options = {}) {
  const targetViewer = viewer || state.viewer || window.viewer;
  if (!targetViewer) return;

  const root = getAnatomyRoot(targetViewer.scene);
  if (!root) return;

  // Ensure table exists
  if (!dissectionTableMesh) {
    createDissectionTable(targetViewer.scene);
  }

  currentOrientation = orientation;
  const showTableExplicit = options.showTable !== undefined ? options.showTable : (orientation === 'supine' || orientation === 'prone');
  isTableVisible = showTableExplicit;

  if (dissectionTableMesh) {
    dissectionTableMesh.visible = isTableVisible;
    if (isTableVisible) {
      updateDissectionTableTheme(undefined, targetViewer.scene);
    }
  }

  const { controls, camera } = targetViewer;

  if (orientation === 'standing') {
    // 1. STANDING (Tư thế đứng thẳng giải phẫu chuẩn)
    root.quaternion.identity();
    root.position.set(0, 0, 0);

    if (controls) {
      controls.target.set(0, 0.88, 0);
      camera.position.set(0, 0.88, 2.6);
      controls.update();
    }
  } else if (orientation === 'supine') {
    // 2. SUPINE (Tư thế nằm ngửa - Mặt/ngực hướng lên trời +Y)
    root.quaternion.setFromAxisAngle(new THREE.Vector3(1, 0, 0), -Math.PI / 2);
    root.position.set(0, 0.83, 0.86);

    if (controls) {
      controls.target.set(0, 0.80, 0);
      camera.position.set(1.1, 1.6, 0.9);
      controls.update();
    }
  } else if (orientation === 'prone') {
    // 3. PRONE (Tư thế nằm sấp - Lưng hướng lên trời +Y, mặt úp xuống bàn)
    const qX = new THREE.Quaternion().setFromAxisAngle(new THREE.Vector3(1, 0, 0), -Math.PI / 2);
    const qZ = new THREE.Quaternion().setFromAxisAngle(new THREE.Vector3(0, 0, 1), Math.PI);
    root.quaternion.copy(qZ).multiply(qX);
    root.position.set(0, 0.83, 0.86);

    if (controls) {
      controls.target.set(0, 0.80, 0);
      camera.position.set(0.9, 1.6, 0.6);
      controls.update();
    }
  } else if (orientation === 'sitting') {
    // 4. SITTING (Tư thế ngồi lâm sàng / Fowler)
    root.quaternion.setFromAxisAngle(new THREE.Vector3(1, 0, 0), -Math.PI / 3.5);
    root.position.set(0, 0.62, 0.45);

    if (controls) {
      controls.target.set(0, 0.82, 0);
      camera.position.set(0, 1.05, 1.9);
      controls.update();
    }
  }

  // Update UI indicators
  updateOrientationUI();
  targetViewer.render?.();
  targetViewer.invalidate?.(15);
}

export function toggleDissectionTable(viewer) {
  const targetViewer = viewer || state.viewer || window.viewer;
  if (!dissectionTableMesh) {
    createDissectionTable(targetViewer?.scene);
  }
  isTableVisible = !isTableVisible;
  if (dissectionTableMesh) {
    dissectionTableMesh.visible = isTableVisible;
  }
  updateOrientationUI();
  targetViewer?.render?.();
  targetViewer?.invalidate?.(5);
  return isTableVisible;
}

export function setDissectionTableVisible(visible, viewer) {
  const targetViewer = viewer || state.viewer || window.viewer;
  if (!dissectionTableMesh) {
    createDissectionTable(targetViewer?.scene);
  }
  isTableVisible = !!visible;
  if (dissectionTableMesh) {
    dissectionTableMesh.visible = isTableVisible;
  }
  updateOrientationUI();
  targetViewer?.render?.();
  targetViewer?.invalidate?.(5);
}

export function updateOrientationUI() {
  document.querySelectorAll('[data-orientation]').forEach(btn => {
    btn.classList.toggle('active', btn.dataset.orientation === currentOrientation);
  });
  document.querySelectorAll('#btnToggleTable, .btn-table-toggle').forEach(btn => {
    btn.classList.toggle('active', isTableVisible);
  });
}
