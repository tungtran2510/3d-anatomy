/**
 * CLINICAL AXIS 3D VIEWER ENGINE
 * Module chuyên trách hiển thị trực quan toàn bộ chuỗi cơ quan trên không gian 3D.
 * Cơ chế:
 * 1. Bật sáng đồng thời tất cả các cơ quan trong chuỗi trục (Multi-Organ Isolation).
 * 2. Làm mờ (ghost) toàn bộ các cơ quan/khung xương nền xung quanh thành khối pha lê trong suốt (opacity ~0.04).
 * 3. Tự động đóng khung Camera (Auto Multi-Mesh Framing) bao quát trọn vẹn toàn bộ trục từ trên xuống dưới.
 * 4. Chuyển đổi mượt mà giữa các mắt xích với hiệu ứng phát sáng (emissive highlight) khi chạm chip.
 */

import * as THREE from 'three';
import { state, batchPartStates, notify } from '../state/store.js';
import { CLINICAL_AXES } from '../data/clinicalAxesData.js';
import { getMeshRegistry, ownMeshesOf, loadModel } from './loadModel.js';
import { setStructureVisible, restoreMaterial } from './visibility.js';

let activeAxisId = null;
let activeStepIndex = 0;
let highlightedPartIds = new Set();
let axisPartIdsCache = new Set();
let previousGhostState = null;

// Ghost material cache for clinical axis background
const axisGhostVariants = new WeakMap();
const GHOST_OPACITY = 0.04;

function getGhostMaterial(material) {
  let ghost = axisGhostVariants.get(material);
  if (!ghost) {
    ghost = material.clone();
    ghost.transparent = true;
    ghost.opacity = GHOST_OPACITY;
    ghost.depthWrite = false;
    axisGhostVariants.set(material, ghost);
  }
  return ghost;
}

function applyGhostToMesh(mesh) {
  const base = mesh.userData.baseMaterial;
  if (!base) return;
  if (Array.isArray(base)) {
    mesh.material = base.map(getGhostMaterial);
  } else {
    mesh.material = getGhostMaterial(base);
  }
}

/**
 * Nạp tất cả các hệ giải phẫu cần thiết cho trục lâm sàng
 */
export async function ensureAxisSystemsLoaded(axis, viewer) {
  const systems = axis.primarySystems || ['nervous', 'visceral', 'skeletal'];
  const promises = [];

  for (const sysId of systems) {
    if (!state.loadedSystems.includes(sysId)) {
      promises.push(loadModel(sysId, viewer));
    }
  }

  if (promises.length > 0) {
    await Promise.all(promises);
  }
}

/**
 * Kích hoạt hiển thị trực quan toàn bộ chuỗi trục lâm sàng trên 3D
 */
export async function activateClinicalAxis3D(axisId, viewer = window.viewer) {
  const activeViewer = viewer || state.viewer || window.viewer;
  if (!activeViewer) return;

  const axis = CLINICAL_AXES.find(a => a.id === axisId);
  if (!axis) return;

  activeAxisId = axisId;
  activeStepIndex = 0;

  // 1. Nạp đầy đủ các hệ liên quan nếu chưa có
  await ensureAxisSystemsLoaded(axis, activeViewer);

  // 2. Thu thập toàn bộ partId của tất cả các mắt xích trong trục
  const allAxisPartIds = new Set();
  axis.chainSteps.forEach(step => {
    if (step.partIds && Array.isArray(step.partIds)) {
      step.partIds.forEach(id => allAxisPartIds.add(id));
    } else if (step.partId) {
      allAxisPartIds.add(step.partId);
    }
  });
  axisPartIdsCache = allAxisPartIds;

  // 3. Cô lập đa cơ quan: Các cơ quan trong trục sáng rõ, cơ thể nền làm mờ pha lê
  batchPartStates(() => {
    getMeshRegistry().forEach((node, id) => {
      const isPartOfAxis = allAxisPartIds.has(id);

      if (isPartOfAxis) {
        setStructureVisible(id, true);
        restoreMaterial(id);

        // Đảm bảo độ rõ nét 100% cho các cơ quan của trục
        ownMeshesOf(id).forEach(mesh => {
          mesh.visible = true;
          if (mesh.userData.ownsMaterial) {
            const mats = Array.isArray(mesh.material) ? mesh.material : [mesh.material];
            mats.forEach(m => {
              m.transparent = false;
              m.opacity = 1.0;
              m.depthWrite = true;
            });
          }
        });
      } else {
        // Làm mờ làm khung nền cơ thể trong suốt
        setStructureVisible(id, true);
        ownMeshesOf(id).forEach(mesh => {
          applyGhostToMesh(mesh);
        });
      }
    });
  });

  // 4. Tự động đóng khung Camera (Auto Multi-Mesh Framing) bao trọn toàn bộ chuỗi trục
  frameAllAxisParts(allAxisPartIds, activeViewer, true);

  // 5. Mặc định kích hoạt mắt xích đầu tiên
  focusAxisStep(axisId, 0, activeViewer, false);

  notify('clinicalAxisActivated', { axisId });
  activeViewer.render();
}

/**
 * Tính toán Bounding Box và đóng khung camera toàn bộ chuỗi trục
 */
function frameAllAxisParts(partIdsSet, viewer, animate = true) {
  if (!viewer) return;
  const { camera, controls } = viewer;

  const box = new THREE.Box3();
  let hasMeshes = false;

  partIdsSet.forEach(partId => {
    const meshes = ownMeshesOf(partId);
    meshes.forEach(mesh => {
      if (mesh.visible) {
        box.expandByObject(mesh);
        hasMeshes = true;
      }
    });
  });

  if (!hasMeshes || box.isEmpty()) return;

  const center = box.getCenter(new THREE.Vector3());
  const size = box.getSize(new THREE.Vector3());
  const maxDim = Math.max(size.x, size.y, size.z, 0.3);

  // Góc nghiêng 3/4 thanh lịch (Anterolateral view), giữ tầm nhìn toàn thân từ đầu xuống bụng
  const direction = new THREE.Vector3(0.28, 0.08, 0.95).normalize();
  const distance = Math.max(1.85, maxDim * 2.2);
  const targetPosition = center.clone().add(direction.multiplyScalar(distance));

  animateCameraTo(camera, controls, targetPosition, center, viewer, animate ? 600 : 0);
}

/**
 * Tập trung & phát quang vào một mắt xích cụ thể trong chuỗi trục
 */
export function focusAxisStep(axisId, stepIdx, viewer = window.viewer, zoomCloser = true) {
  const activeViewer = viewer || state.viewer || window.viewer;
  if (!activeViewer) return;

  const axis = CLINICAL_AXES.find(a => a.id === axisId);
  if (!axis) return;

  activeStepIndex = stepIdx;
  const step = axis.chainSteps[stepIdx] || axis.chainSteps[0];
  const stepPartIds = step.partIds || [step.partId];

  // 1. Tắt highlight cũ
  clearCurrentStepHighlight();

  // 2. Chiếu sáng rực rỡ (Emissive Glow) cho các mesh của mắt xích hiện tại
  stepPartIds.forEach(id => {
    highlightedPartIds.add(id);
    ownMeshesOf(id).forEach(mesh => {
      if (!mesh.userData.ownsMaterial) {
        mesh.material = Array.isArray(mesh.material)
          ? mesh.material.map(m => m.clone())
          : mesh.material.clone();
        mesh.userData.ownsMaterial = true;
      }
      const mats = Array.isArray(mesh.material) ? mesh.material : [mesh.material];
      mats.forEach(mat => {
        mat.emissive = new THREE.Color(0xfacc15); // Vàng ngọc ánh kim rực rỡ
        mat.emissiveIntensity = 0.75;
        mat.needsUpdate = true;
      });
    });
  });

  // 3. Nếu người dùng chạm vào mắt xích, camera lướt mượt mà hướng về mắt xích đó
  if (zoomCloser) {
    const stepBox = new THREE.Box3();
    let hasMeshes = false;
    stepPartIds.forEach(id => {
      ownMeshesOf(id).forEach(m => {
        if (m.visible) {
          stepBox.expandByObject(m);
          hasMeshes = true;
        }
      });
    });

    if (hasMeshes && !stepBox.isEmpty()) {
      const stepCenter = stepBox.getCenter(new THREE.Vector3());
      const stepSize = stepBox.getSize(new THREE.Vector3());
      const maxDim = Math.max(stepSize.x, stepSize.y, stepSize.z, 0.1);

      const direction = new THREE.Vector3().subVectors(activeViewer.camera.position, activeViewer.controls.target).normalize();
      if (direction.lengthSq() < 0.001) direction.set(0.2, 0.1, 0.96).normalize();

      // Giữ khoảng cách vừa phải (không zoom sát rạt) để vẫn thấy liên kết với các cơ quan khác trong trục
      const dist = Math.max(1.35, maxDim * 3.5);
      const targetPos = stepCenter.clone().add(direction.multiplyScalar(dist));

      animateCameraTo(activeViewer.camera, activeViewer.controls, targetPos, stepCenter, activeViewer, 500);
    }
  }

  notify('clinicalAxisStepChanged', { axisId, stepIdx });
  activeViewer.render();
}

/**
 * Xóa hiệu ứng phát quang của mắt xích
 */
function clearCurrentStepHighlight() {
  highlightedPartIds.forEach(id => {
    ownMeshesOf(id).forEach(mesh => {
      if (mesh.userData.ownsMaterial) {
        const base = mesh.userData.baseMaterial;
        const source = Array.isArray(base) ? base[0] : base;
        const mats = Array.isArray(mesh.material) ? mesh.material : [mesh.material];
        mats.forEach(mat => {
          if (source?.emissive) mat.emissive.copy(source.emissive);
          else mat.emissive = new THREE.Color(0x000000);
          mat.emissiveIntensity = source?.emissiveIntensity ?? 0;
          mat.needsUpdate = true;
        });
      }
    });
  });
  highlightedPartIds.clear();
}

/**
 * Tắt chế độ trục lâm sàng, khôi phục lại toàn bộ mô hình 3D
 */
export function deactivateClinicalAxis3D(viewer = window.viewer) {
  const activeViewer = viewer || state.viewer || window.viewer;
  if (!activeViewer) return;

  clearCurrentStepHighlight();
  activeAxisId = null;
  axisPartIdsCache.clear();

  // Khôi phục tất cả vật liệu bình thường
  getMeshRegistry().forEach((node, id) => {
    restoreMaterial(id);
    ownMeshesOf(id).forEach(mesh => {
      const base = mesh.userData.baseMaterial;
      if (base) mesh.material = base;
    });
  });

  notify('clinicalAxisDeactivated', true);
  activeViewer.render();
}

/**
 * Camera Flight Helper mượt mà
 */
function animateCameraTo(camera, controls, targetPosition, targetTarget, viewer, duration = 500) {
  if (duration === 0 || window.matchMedia?.('(prefers-reduced-motion: reduce)').matches) {
    camera.position.copy(targetPosition);
    controls.target.copy(targetTarget);
    controls.update();
    viewer?.render();
    return Promise.resolve();
  }

  return new Promise(resolve => {
    const startPosition = camera.position.clone();
    const startTarget = controls.target.clone();
    const startTime = performance.now();

    function step(now) {
      const elapsed = now - startTime;
      const progress = Math.min(elapsed / duration, 1);
      const eased = 1 - Math.pow(1 - progress, 3); // ease-out cubic

      camera.position.lerpVectors(startPosition, targetPosition, eased);
      controls.target.lerpVectors(startTarget, targetTarget, eased);
      controls.update();
      viewer?.render();

      if (progress < 1) {
        requestAnimationFrame(step);
      } else {
        resolve();
      }
    }

    requestAnimationFrame(step);
  });
}
