// 3D Landmark Labels / Pins System - Expanded Academic Atlas Coverage
import * as THREE from 'three';
import { selectPartById } from './selection.js';

// Comprehensive anatomical landmarks with exact 3D coordinates and metadata
export const LANDMARKS = [
  // --- ĐẦU MẶT CỔ ---
  { id: 'Cranium', nameVi: 'Xương sọ (Vòm sọ)', nameLatin: 'Calvaria', pos: [0, 1.68, 0.08], partId: 'Frontal bone' },
  { id: 'Orbit', nameVi: 'Hốc mắt', nameLatin: 'Orbita', pos: [0.06, 1.58, 0.12], partId: 'Zygomatic bone.l' },
  { id: 'Mandible', nameVi: 'Xương hàm dưới', nameLatin: 'Mandibula', pos: [0, 1.52, 0.11], partId: 'Mandible' },
  { id: 'Cervical', nameVi: 'Đốt sống cổ C1-C7', nameLatin: 'Vertebrae cervicales', pos: [0, 1.44, -0.05], partId: 'Atlas' },

  // --- LỒNG NGỰC & THÂN MÌNH ---
  { id: 'Clavicle', nameVi: 'Xương đòn (Quai xanh)', nameLatin: 'Clavicula', pos: [0.12, 1.39, 0.07], partId: 'Clavicle.l' },
  { id: 'Acromion', nameVi: 'Mỏm cùng vai', nameLatin: 'Acromion', pos: [0.22, 1.38, 0.02], partId: 'Scapula.l' },
  { id: 'Sternum', nameVi: 'Xương ức', nameLatin: 'Sternum', pos: [0, 1.28, 0.12], partId: 'Body of sternum' },
  { id: 'Ribcage', nameVi: 'Lồng ngực / Xương sườn', nameLatin: 'Cavea thoracis', pos: [0.18, 1.22, 0.09], partId: 'First rib.l' },
  { id: 'ThoracicSpine', nameVi: 'Cột sống ngực T1-T12', nameLatin: 'Vertebrae thoracicae', pos: [0, 1.24, -0.08], partId: 'First rib.l' },
  { id: 'LumbarSpine', nameVi: 'Cột sống thắt lưng L1-L5', nameLatin: 'Vertebrae lumbales', pos: [0, 1.10, -0.07], partId: 'Lumbar vertebra I' },

  // --- CHI TRÊN ---
  { id: 'Humerus', nameVi: 'Xương cánh tay', nameLatin: 'Humerus', pos: [0.24, 1.18, 0.02], partId: 'Humerus.l' },
  { id: 'Elbow', nameVi: 'Khớp khuỷu / Mỏm khuỷu', nameLatin: 'Olecranon', pos: [0.27, 1.05, -0.01], partId: 'Ulna.l' },
  { id: 'Radius', nameVi: 'Xương quay (Cẳng tay ngoài)', nameLatin: 'Radius', pos: [0.29, 0.94, 0.02], partId: 'Radius.l' },
  { id: 'Ulna', nameVi: 'Xương trụ (Cẳng tay trong)', nameLatin: 'Ulna', pos: [0.25, 0.94, 0.01], partId: 'Ulna.l' },
  { id: 'Wrist', nameVi: 'Khớp cổ tay & Xương cổ tay', nameLatin: 'Carpus', pos: [0.31, 0.83, 0.02], partId: 'Radius.l' },
  { id: 'Hand', nameVi: 'Xương bàn tay & Ngón', nameLatin: 'Ossa manus', pos: [0.33, 0.74, 0.02], partId: 'Radius.l' },

  // --- KHUNG CHẬU ---
  { id: 'IliacCrest', nameVi: 'Mào chậu (Đỉnh eo)', nameLatin: 'Crista iliaca', pos: [0.17, 1.03, 0.02], partId: 'Hip bone.l' },
  { id: 'Pelvis', nameVi: 'Xương chậu (Cánh chậu)', nameLatin: 'Os coxae', pos: [0.14, 0.96, 0.05], partId: 'Hip bone.l' },
  { id: 'Sacrum', nameVi: 'Xương cùng', nameLatin: 'Os sacrum', pos: [0, 0.92, -0.05], partId: 'Sacrum' },
  { id: 'Coccyx', nameVi: 'Xương cụt', nameLatin: 'Os coccygis', pos: [0, 0.86, -0.06], partId: 'Coccyx' },
  { id: 'Trochanter', nameVi: 'Mấu chuyển lớn đùi', nameLatin: 'Trochanter major', pos: [0.19, 0.86, 0.02], partId: 'Femur.l' },

  // --- CHI DƯỚI ---
  { id: 'Femur', nameVi: 'Xương đùi', nameLatin: 'Os femoris', pos: [0.14, 0.68, 0.03], partId: 'Femur.l' },
  { id: 'Patella', nameVi: 'Xương bánh chè', nameLatin: 'Patella', pos: [0.12, 0.46, 0.10], partId: 'Patella.l' },
  { id: 'KneeJoint', nameVi: 'Khớp gối', nameLatin: 'Articulatio genus', pos: [0.12, 0.44, 0.04], partId: 'Patella.l' },
  { id: 'Tibia', nameVi: 'Xương chày (Chịu lực chính)', nameLatin: 'Tibia', pos: [0.11, 0.28, 0.05], partId: 'Tibia.l' },
  { id: 'Fibula', nameVi: 'Xương mác (Cẳng chân ngoài)', nameLatin: 'Fibula', pos: [0.16, 0.28, 0.02], partId: 'Fibula.l' },
  { id: 'AnkleMedial', nameVi: 'Mắt cá trong', nameLatin: 'Malleolus medialis', pos: [0.08, 0.11, 0.03], partId: 'Tibia.l' },
  { id: 'AnkleLateral', nameVi: 'Mắt cá ngoài', nameLatin: 'Malleolus lateralis', pos: [0.16, 0.11, 0.02], partId: 'Fibula.l' },
  { id: 'Calcaneus', nameVi: 'Xương gót chân', nameLatin: 'Calcaneus', pos: [0.12, 0.05, -0.04], partId: 'Calcaneus.l' },
  { id: 'Foot', nameVi: 'Xương bàn chân & Vòm chân', nameLatin: 'Ossa pedis', pos: [0.12, 0.04, 0.10], partId: 'Calcaneus.l' }
];

let labelsContainer = null;
let isVisible = false;
let frameUnsub = null;
const pinElements = new Map();

export function disposeLabels() {
  if (frameUnsub) {
    frameUnsub();
    frameUnsub = null;
  }
  if (labelsContainer) {
    labelsContainer.remove();
    labelsContainer = null;
  }
}

export function initLabels(viewer) {
  if (labelsContainer) return;

  const viewerContainer = document.getElementById('viewerContainer');
  if (!viewerContainer) return;

  labelsContainer = document.createElement('div');
  labelsContainer.className = 'labels-overlay';
  labelsContainer.id = 'labelsOverlay';
  labelsContainer.style.display = 'none';
  viewerContainer.appendChild(labelsContainer);

  // Create badge pins
  LANDMARKS.forEach((item) => {
    const badge = document.createElement('div');
    badge.className = 'landmark-pin';
    badge.dataset.landmarkId = item.id;
    badge.innerHTML = `
      <span class="pin-dot"></span>
      <span class="pin-text">${item.nameVi}</span>
    `;

    badge.addEventListener('click', (e) => {
      e.stopPropagation();
      if (item.partId) {
        selectPartById(item.partId, viewer);
      }
      if (navigator.vibrate) navigator.vibrate(25);
    });

    labelsContainer.appendChild(badge);
    pinElements.set(item.id, badge);
  });

  // Subscribe to render loop to project 3D to 2D
  if (viewer.onFrame) {
    frameUnsub = viewer.onFrame(() => updatePinPositions(viewer));
  }
}

function updatePinPositions(viewer) {
  if (!isVisible || !labelsContainer) return;

  const { camera, canvas } = viewer;
  const rect = canvas.getBoundingClientRect();
  const width = rect.width;
  const height = rect.height;

  const tempVec = new THREE.Vector3();

    LANDMARKS.forEach((item) => {
    const el = pinElements.get(item.id);
    if (!el) return;

    tempVec.set(item.pos[0], item.pos[1], item.pos[2]);
    tempVec.project(camera);

    // Only show if in front of camera (-1 to 1)
    const isFront = tempVec.z < 1.0 && tempVec.z > -1.0;
    const isInsideScreen = tempVec.x >= -1.1 && tempVec.x <= 1.1 && tempVec.y >= -1.1 && tempVec.y <= 1.1;

    if (isFront && isInsideScreen) {
      const x = (tempVec.x * 0.5 + 0.5) * width;
      const y = (-tempVec.y * 0.5 + 0.5) * height;

      el.style.transform = `translate3d(${x}px, ${y}px, 0)`;
      el.style.display = 'flex';
      el.style.opacity = Math.max(0.2, 1.0 - tempVec.z * 0.5);
    } else {
      el.style.display = 'none';
    }
  });

  // Project custom user-pinned tags
  customTags.forEach((item) => {
    tempVec.set(item.pos[0], item.pos[1], item.pos[2]);
    tempVec.project(camera);

    const isFront = tempVec.z < 1.0 && tempVec.z > -1.0;
    const isInsideScreen = tempVec.x >= -1.1 && tempVec.x <= 1.1 && tempVec.y >= -1.1 && tempVec.y <= 1.1;

    if (isFront && isInsideScreen) {
      const x = (tempVec.x * 0.5 + 0.5) * width;
      const y = (-tempVec.y * 0.5 + 0.5) * height;

      item.el.style.transform = `translate3d(${x}px, ${y}px, 0)`;
      item.el.style.display = 'flex';
      item.el.style.opacity = Math.max(0.2, 1.0 - tempVec.z * 0.5);
    } else {
      item.el.style.display = 'none';
    }
  });
}

const customTags = new Map();

export function addCustomTag(partId, name, viewer) {
  if (!viewer) return;
  if (!labelsContainer) initLabels(viewer);

  let pos = new THREE.Vector3(0, 1.2, 0);
  const mesh = viewer.scene.getObjectByName(partId);
  if (mesh) {
    const box = new THREE.Box3().setFromObject(mesh);
    if (!box.isEmpty()) {
      box.getCenter(pos);
    }
  }

  // Remove existing tag for this part if any
  if (customTags.has(partId)) {
    customTags.get(partId).el.remove();
  }

  const badge = document.createElement('div');
  badge.className = 'landmark-pin custom-tag-pin';
  badge.style.borderColor = '#0b2559';
  badge.style.background = 'rgba(11, 37, 89, 0.92)';
  badge.style.color = '#fff';
  badge.innerHTML = `
    <span class="pin-dot" style="background:#1d72b8;"></span>
    <span class="pin-text">${name}</span>
  `;
  badge.addEventListener('click', (e) => {
    e.stopPropagation();
    selectPartById(partId, viewer);
  });

  labelsContainer.appendChild(badge);
  customTags.set(partId, { el: badge, pos: [pos.x, pos.y, pos.z] });

  setLabelsVisible(true, viewer);
  updatePinPositions(viewer);
  return customTags.size;
}

export function clearCustomTags(viewer) {
  customTags.forEach(tag => tag.el.remove());
  customTags.clear();
  if (viewer) {
    updatePinPositions(viewer);
    viewer.render();
  }
}

export function setLabelsVisible(show, viewer) {
  isVisible = show;
  if (labelsContainer) {
    labelsContainer.style.display = isVisible ? 'block' : 'none';
  }
  if (viewer) {
    updatePinPositions(viewer);
    viewer.render();
  }
}

export function toggleLabels(viewer) {
  setLabelsVisible(!isVisible, viewer);
  return isVisible;
}

export function areLabelsVisible() {
  return isVisible;
}
