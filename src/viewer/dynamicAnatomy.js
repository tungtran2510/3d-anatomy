// Dynamic Anatomy & Physiological Motion Engine
// Dedicated Physiological Cycles: Cardiac Cycle (Nhịp Tim) & Respiratory Mechanics (Hô Hấp).
// Features: Centroid-Anchored Scaling, Synchronized Thoracic Mechanics, Living Organ Translucency,
// Timeline Scrubbing, Variable Playback Speed, Zero Idle Overhead, Zero Glitch.

import * as THREE from 'three';
import { getMeshRegistry, ownMeshesOf, loadModel } from './loadModel.js';
import { state } from '../state/store.js';

export const MOTIONS = {
  CARDIAC: 'cardiac',
  RESPIRATORY: 'respiratory',
  SPINE_FLEXION: 'spine_flexion',
  SPINE_EXTENSION: 'spine_extension',
  SPINE_LAT_FLEXION: 'spine_lat_flexion',
  HIP_FLEXION: 'hip_flexion',
  HIP_EXTENSION: 'hip_extension',
  HIP_ROTATION: 'hip_rotation',
  KNEE_FLEXION: 'knee_flexion',
  KNEE_EXTENSION: 'knee_extension',
  KNEE_ROTATION: 'knee_rotation',
  SHOULDER_FLEXION: 'shoulder_flexion',
  SHOULDER_EXTENSION: 'shoulder_extension',
  SHOULDER_ABDUCTION: 'shoulder_abduction',
  ELBOW_FLEXION: 'elbow_flexion',
  ELBOW_EXTENSION: 'elbow_extension',
  FOREARM_PRONATION: 'forearm_pronation'
};

export const MOTION_METADATA = {
  [MOTIONS.CARDIAC]: {
    id: MOTIONS.CARDIAC,
    titleVi: 'Nhịp Tim & Chu kỳ Tim (Cardiac Cycle)',
    titleEn: 'Cardiac Cycle',
    systemRequired: 'cardiovascular',
    secondarySystem: 'skeletal',
    defaultDuration: 0.85,
    camera: { x: 0.05, y: 1.28, z: 0.65, targetX: 0.02, targetY: 1.28, targetZ: 0.03 },
    phases: [
      { from: 0.0, to: 0.38, name: 'Tâm thu (Systole) — Tâm thất co bóp tống máu vào ĐM chủ & ĐM phổi' },
      { from: 0.38, to: 0.85, name: 'Tâm trương (Diastole) — Các buồng tim giãn ra, máu đổ đầy tâm thất' },
      { from: 0.85, to: 1.0, name: 'Tiền tâm thu (Atrial Kick) — Tâm nhĩ co bóp tống nốt lượng máu cuối vào thất' }
    ],
    keyParts: [
      { id: 'heart_all', nameVi: 'Toàn bộ tim & mạch lớn' },
      { id: 'ventricles', nameVi: 'Tâm thất (Trái & Phải)' },
      { id: 'atria', nameVi: 'Tâm nhĩ (Trái & Phải)' },
      { id: 'aorta', nameVi: 'Quai động mạch chủ' }
    ]
  },
  [MOTIONS.RESPIRATORY]: {
    id: MOTIONS.RESPIRATORY,
    titleVi: 'Cơ Chế Hô Hấp (Respiratory Mechanics)',
    titleEn: 'Respiratory Cycle',
    systemRequired: 'visceral',
    secondarySystem: 'skeletal',
    defaultDuration: 3.6,
    camera: { x: 0, y: 1.28, z: 0.95, targetX: 0, targetY: 1.28, targetZ: 0.01 },
    phases: [
      { from: 0.0, to: 0.45, name: 'Hít vào (Inspiration) — Lồng ngực dãn nở, xương sườn nâng lên, phổi nở rộng' },
      { from: 0.45, to: 1.0, name: 'Thở ra (Expiration) — Lồng ngực hạ xuống xẹp lại, phổi co hồi thụ động' }
    ],
    keyParts: [
      { id: 'lungs_all', nameVi: 'Hai lá phổi & Phế quản' },
      { id: 'ribcage', nameVi: 'Khung xương sườn & Xương ức' },
      { id: 'left_lung', nameVi: 'Phổi trái (2 thùy)' },
      { id: 'right_lung', nameVi: 'Phổi phải (3 thùy)' }
    ]
  },
  [MOTIONS.SPINE_FLEXION]: {
    id: MOTIONS.SPINE_FLEXION,
    titleVi: 'Gập Cột Sống (Spine Flexion)',
    titleEn: 'Spine Flexion',
    systemRequired: 'muscular',
    secondarySystem: 'skeletal',
    defaultDuration: 2.4,
    camera: { x: 0.85, y: 1.15, z: 1.1, targetX: 0, targetY: 1.05, targetZ: 0 },
    phases: [
      { from: 0.0, to: 0.5, name: 'Cột sống thắt lưng gập ra trước (Flexion)' },
      { from: 0.5, to: 1.0, name: 'Trở về tư thế thẳng đứng giải phẫu' }
    ]
  },
  [MOTIONS.SPINE_EXTENSION]: {
    id: MOTIONS.SPINE_EXTENSION,
    titleVi: 'Duỗi Cột Sống (Spine Extension)',
    titleEn: 'Spine Extension',
    systemRequired: 'muscular',
    secondarySystem: 'skeletal',
    defaultDuration: 2.4,
    camera: { x: 0.85, y: 1.15, z: 1.1, targetX: 0, targetY: 1.05, targetZ: 0 },
    phases: [
      { from: 0.0, to: 0.5, name: 'Cơ dựng sống co kéo cột sống ngửa ra sau (Extension)' },
      { from: 0.5, to: 1.0, name: 'Trở về tư thế đứng thẳng' }
    ]
  },
  [MOTIONS.SPINE_LAT_FLEXION]: {
    id: MOTIONS.SPINE_LAT_FLEXION,
    titleVi: 'Nghiêng Cột Sống (Spine Lateral Flexion)',
    titleEn: 'Spine Lateral Flexion',
    systemRequired: 'muscular',
    secondarySystem: 'skeletal',
    defaultDuration: 2.4,
    camera: { x: 0, y: 1.15, z: 1.45, targetX: 0, targetY: 1.05, targetZ: 0 },
    phases: [
      { from: 0.0, to: 0.5, name: 'Cột sống nghiêng sang bên (Lateral flexion)' },
      { from: 0.5, to: 1.0, name: 'Trở về trục thẳng đứng' }
    ]
  },
  [MOTIONS.HIP_FLEXION]: {
    id: MOTIONS.HIP_FLEXION,
    titleVi: 'Gập Khớp Háng (Hip Flexion)',
    titleEn: 'Hip Flexion',
    systemRequired: 'muscular',
    secondarySystem: 'skeletal',
    defaultDuration: 2.2,
    camera: { x: 0.75, y: 0.75, z: 1.0, targetX: 0.1, targetY: 0.75, targetZ: 0 },
    phases: [
      { from: 0.0, to: 0.5, name: 'Cơ thắt lưng chậu co nâng đùi ra trước' },
      { from: 0.5, to: 1.0, name: 'Hạ đùi trở về vị trí giải phẫu' }
    ]
  },
  [MOTIONS.HIP_EXTENSION]: {
    id: MOTIONS.HIP_EXTENSION,
    titleVi: 'Duỗi Khớp Háng (Hip Extension)',
    titleEn: 'Hip Extension',
    systemRequired: 'muscular',
    secondarySystem: 'skeletal',
    defaultDuration: 2.2,
    camera: { x: 0.75, y: 0.75, z: 1.0, targetX: 0.1, targetY: 0.75, targetZ: 0 },
    phases: [
      { from: 0.0, to: 0.5, name: 'Cơ mông lớn kéo đùi ra sau thân mình' },
      { from: 0.5, to: 1.0, name: 'Trở về vị trí đứng thẳng' }
    ]
  },
  [MOTIONS.HIP_ROTATION]: {
    id: MOTIONS.HIP_ROTATION,
    titleVi: 'Xoay Trong Khớp Háng (Hip Medial Rotation)',
    titleEn: 'Hip Medial Rotation',
    systemRequired: 'muscular',
    secondarySystem: 'skeletal',
    defaultDuration: 2.2,
    camera: { x: 0.35, y: 0.75, z: 1.1, targetX: 0.1, targetY: 0.75, targetZ: 0 },
    phases: [
      { from: 0.0, to: 0.5, name: 'Xoay trong chỏm đùi vào trong' },
      { from: 0.5, to: 1.0, name: 'Trở về tư thế trung tính' }
    ]
  },
  [MOTIONS.KNEE_FLEXION]: {
    id: MOTIONS.KNEE_FLEXION,
    titleVi: 'Gập Khớp Gối (Knee Flexion)',
    titleEn: 'Knee Flexion',
    systemRequired: 'muscular',
    secondarySystem: 'skeletal',
    defaultDuration: 2.0,
    camera: { x: 0.65, y: 0.45, z: 0.9, targetX: 0.1, targetY: 0.45, targetZ: 0 },
    phases: [
      { from: 0.0, to: 0.5, name: 'Cơ gân kheo co gập cẳng chân ra sau' },
      { from: 0.5, to: 1.0, name: 'Duỗi thẳng cẳng chân trở lại' }
    ]
  },
  [MOTIONS.KNEE_EXTENSION]: {
    id: MOTIONS.KNEE_EXTENSION,
    titleVi: 'Duỗi Khớp Gối (Knee Extension)',
    titleEn: 'Knee Extension',
    systemRequired: 'muscular',
    secondarySystem: 'skeletal',
    defaultDuration: 2.0,
    camera: { x: 0.65, y: 0.45, z: 0.9, targetX: 0.1, targetY: 0.45, targetZ: 0 },
    phases: [
      { from: 0.0, to: 0.5, name: 'Cơ tứ đầu đùi co duỗi khóa khớp gối' },
      { from: 0.5, to: 1.0, name: 'Trở về trạng thái gập nhẹ' }
    ]
  },
  [MOTIONS.KNEE_ROTATION]: {
    id: MOTIONS.KNEE_ROTATION,
    titleVi: 'Xoay Khớp Gối (Knee Rotation)',
    titleEn: 'Knee Rotation',
    systemRequired: 'muscular',
    secondarySystem: 'skeletal',
    defaultDuration: 2.0,
    camera: { x: 0.35, y: 0.45, z: 0.9, targetX: 0.1, targetY: 0.45, targetZ: 0 },
    phases: [
      { from: 0.0, to: 0.5, name: 'Xoay mở khóa khớp gối' },
      { from: 0.5, to: 1.0, name: 'Trở về tư thế thẳng' }
    ]
  },
  [MOTIONS.SHOULDER_FLEXION]: {
    id: MOTIONS.SHOULDER_FLEXION,
    titleVi: 'Gập Khớp Vai (Shoulder Flexion)',
    titleEn: 'Shoulder Flexion',
    systemRequired: 'muscular',
    secondarySystem: 'skeletal',
    defaultDuration: 2.2,
    camera: { x: 0.65, y: 1.35, z: 0.9, targetX: 0.2, targetY: 1.30, targetZ: 0 },
    phases: [
      { from: 0.0, to: 0.5, name: 'Cơ delta trước nâng cánh tay ra trước' },
      { from: 0.5, to: 1.0, name: 'Hạ cánh tay xuống cạnh thân' }
    ]
  },
  [MOTIONS.SHOULDER_EXTENSION]: {
    id: MOTIONS.SHOULDER_EXTENSION,
    titleVi: 'Duỗi Khớp Vai (Shoulder Extension)',
    titleEn: 'Shoulder Extension',
    systemRequired: 'muscular',
    secondarySystem: 'skeletal',
    defaultDuration: 2.2,
    camera: { x: 0.65, y: 1.35, z: 0.9, targetX: 0.2, targetY: 1.30, targetZ: 0 },
    phases: [
      { from: 0.0, to: 0.5, name: 'Cơ lưng rộng kéo cánh tay ra sau' },
      { from: 0.5, to: 1.0, name: 'Đưa cánh tay về vị trí tự nhiên' }
    ]
  },
  [MOTIONS.SHOULDER_ABDUCTION]: {
    id: MOTIONS.SHOULDER_ABDUCTION,
    titleVi: 'Dang Ngang Khớp Vai (Shoulder Abduction)',
    titleEn: 'Shoulder Abduction',
    systemRequired: 'muscular',
    secondarySystem: 'skeletal',
    defaultDuration: 2.2,
    camera: { x: 0, y: 1.35, z: 1.3, targetX: 0.15, targetY: 1.30, targetZ: 0 },
    phases: [
      { from: 0.0, to: 0.5, name: 'Cơ delta dang cánh tay sang bên' },
      { from: 0.5, to: 1.0, name: 'Khép cánh tay áp sát thân mình' }
    ]
  },
  [MOTIONS.ELBOW_FLEXION]: {
    id: MOTIONS.ELBOW_FLEXION,
    titleVi: 'Gập Khớp Khuỷu (Elbow Flexion)',
    titleEn: 'Elbow Flexion',
    systemRequired: 'muscular',
    secondarySystem: 'skeletal',
    defaultDuration: 2.0,
    camera: { x: 0.55, y: 1.10, z: 0.75, targetX: 0.25, targetY: 1.05, targetZ: 0 },
    phases: [
      { from: 0.0, to: 0.5, name: 'Cơ nhị đầu gập cẳng tay về phía cánh tay' },
      { from: 0.5, to: 1.0, name: 'Duỗi cẳng tay trở lại vị trí ban đầu' }
    ]
  },
  [MOTIONS.ELBOW_EXTENSION]: {
    id: MOTIONS.ELBOW_EXTENSION,
    titleVi: 'Duỗi Khớp Khuỷu (Elbow Extension)',
    titleEn: 'Elbow Extension',
    systemRequired: 'muscular',
    secondarySystem: 'skeletal',
    defaultDuration: 2.0,
    camera: { x: 0.55, y: 1.10, z: 0.75, targetX: 0.25, targetY: 1.05, targetZ: 0 },
    phases: [
      { from: 0.0, to: 0.5, name: 'Cơ tam đầu co duỗi thẳng cẳng tay' },
      { from: 0.5, to: 1.0, name: 'Thư giãn cơ khuỷu' }
    ]
  },
  [MOTIONS.FOREARM_PRONATION]: {
    id: MOTIONS.FOREARM_PRONATION,
    titleVi: 'Sấp Cẳng Tay (Forearm Pronation)',
    titleEn: 'Forearm Pronation',
    systemRequired: 'muscular',
    secondarySystem: 'skeletal',
    defaultDuration: 2.0,
    camera: { x: 0.45, y: 1.00, z: 0.65, targetX: 0.25, targetY: 0.95, targetZ: 0 },
    phases: [
      { from: 0.0, to: 0.5, name: 'Xương quay xoay vắt chéo xương trụ (Úp bàn tay)' },
      { from: 0.5, to: 1.0, name: 'Xoay ngửa trở lại tư thế giải phẫu' }
    ]
  }
};

// Motion Engine State
class DynamicAnatomyEngine {
  constructor() {
    this.viewer = null;
    this.currentMotion = null;
    this.isPlaying = false;
    this.playbackSpeed = 1.0;
    this.progress = 0.0; // 0.0 to 1.0
    this.duration = 2.0; // seconds for full cycle
    this.isLooping = true;
    this.isolatedPartId = null;
    this.ghostNonIsolated = false;
    this.registeredFrameCallback = null;
    this.modifiedNodes = new Set();
    this.listeners = new Set();
    this.lastTimestamp = performance.now();
    this._savedMeshStates = new Map();
    this._cachedMotionNodes = null;
    this._lastUiUpdate = 0;
  }

  init(viewer) {
    this.viewer = viewer;
  }

  subscribe(callback) {
    this.listeners.add(callback);
    return () => this.listeners.delete(callback);
  }

  notifyStateChange() {
    const info = this.getState();
    this.listeners.forEach(cb => {
      try { cb(info); } catch (e) { console.error('[DynamicAnatomy] Listener error:', e); }
    });
  }

  getState() {
    const meta = this.currentMotion ? MOTION_METADATA[this.currentMotion] : null;
    let currentPhase = null;
    if (meta && meta.phases) {
      currentPhase = meta.phases.find(p => this.progress >= p.from && this.progress <= p.to) || meta.phases[0];
    }

    return {
      motionId: this.currentMotion,
      titleVi: meta ? meta.titleVi : '',
      isPlaying: this.isPlaying,
      playbackSpeed: this.playbackSpeed,
      progress: this.progress,
      duration: this.duration,
      isLooping: this.isLooping,
      isolatedPartId: this.isolatedPartId,
      ghostNonIsolated: this.ghostNonIsolated,
      phaseName: currentPhase ? currentPhase.name : '',
      keyParts: meta ? meta.keyParts : []
    };
  }

  async setMotion(motionId) {
    if (!MOTION_METADATA[motionId]) {
      console.warn(`[DynamicAnatomy] Unknown motion: ${motionId}`);
      return;
    }

    // Reset previous motion pose and system visibility cleanly
    this.resetPose();
    this.restoreSystemVisibility();
    this._cachedMotionNodes = null;

    const meta = MOTION_METADATA[motionId];
    this.currentMotion = motionId;
    this.duration = meta.defaultDuration || 2.0;
    this.progress = 0.0;
    this.isolatedPartId = null;

    // Load required systems if not yet loaded
    if (this.viewer) {
      if (meta.systemRequired && !state.loadedSystems.includes(meta.systemRequired)) {
        await loadModel(meta.systemRequired, this.viewer);
      }
      if (meta.secondarySystem && !state.loadedSystems.includes(meta.secondarySystem)) {
        await loadModel(meta.secondarySystem, this.viewer);
      }

      // Smoothly animate camera to optimal framing
      if (meta.camera) {
        this.frameCamera(meta.camera);
      }
    }

    // Capture resting base transforms and accurate centroids
    this.cacheBaseTransforms();

    // Build fast pre-filtered node cache (reduces loop iterations from 2800 to 20!)
    this.buildMotionNodesCache(motionId);

    // Apply clean system isolation for optimal medical pedagogical view
    this.applyMotionIsolation(motionId);

    this.play();
    this.notifyStateChange();
  }

  buildMotionNodesCache(motionId) {
    const registry = getMeshRegistry();
    this._cachedMotionNodes = [];

    if (motionId === MOTIONS.CARDIAC) {
      registry.forEach((node, partId) => {
        const lower = partId.toLowerCase();
        const isVentricle = lower.includes('ventricle') || lower.includes('papillary') || lower.includes('interventricular');
        const isAtrium = lower.includes('atrium') || lower.includes('auricle');
        const isAorta = lower.includes('aorta') || lower.includes('pulmonary trunk');
        const isHeart = lower.includes('heart') || lower.includes('coronary') || lower.includes('valve') || isVentricle || isAtrium || isAorta;

        if (isHeart) {
          const baseRot = node.userData._baseRotation || node.rotation.clone();
          this._cachedMotionNodes.push({
            node,
            partId,
            subType: isVentricle ? 'ventricle' : (isAtrium ? 'atrium' : (isAorta ? 'aorta' : 'other')),
            baseRot
          });
          this.modifiedNodes.add(node);
        }
      });
    } else if (motionId === MOTIONS.RESPIRATORY) {
      registry.forEach((node, partId) => {
        const lower = partId.toLowerCase();
        const isLung = lower.includes('lung') || lower.includes('pulmo') || lower.includes('bronch');
        const isRib = lower.includes('rib') || lower.includes('costa') || lower.includes('cartilage');
        const isSternum = lower.includes('sternum') || lower.includes('xiphoid') || lower.includes('manubrium');
        const isDiaphragm = lower.includes('diaphragm');

        if (isLung || isRib || isSternum || isDiaphragm) {
          const isLeft = lower.endsWith('.l') || lower.includes('left');
          const basePos = node.userData._basePosition || node.position.clone();
          this._cachedMotionNodes.push({
            node,
            partId,
            subType: isLung ? 'lung' : (isSternum ? 'sternum' : (isRib ? 'rib' : 'diaphragm')),
            isLeft,
            basePos
          });
          this.modifiedNodes.add(node);
        }
      });
    } else {
      // Kinematic Joint Actions (Spine, Hip, Knee, Shoulder, Elbow, Forearm)
      let keywords = [];
      let pivot = new THREE.Vector3(0, 0, 0);
      let axis = new THREE.Vector3(1, 0, 0);
      let maxAngle = 0;

      if (motionId === MOTIONS.SPINE_FLEXION) {
        keywords = ['vertebra c', 'vertebra t', 'rib', 'sternum', 'rectus abdominis', 'pectoralis'];
        pivot = new THREE.Vector3(0, 1.05, 0);
        axis = new THREE.Vector3(1, 0, 0);
        maxAngle = -Math.PI * 0.18;
      } else if (motionId === MOTIONS.SPINE_EXTENSION) {
        keywords = ['vertebra c', 'vertebra t', 'rib', 'sternum', 'erector spinae', 'trapezius', 'latissimus'];
        pivot = new THREE.Vector3(0, 1.05, 0);
        axis = new THREE.Vector3(1, 0, 0);
        maxAngle = Math.PI * 0.14;
      } else if (motionId === MOTIONS.SPINE_LAT_FLEXION) {
        keywords = ['vertebra c', 'vertebra t', 'rib', 'sternum', 'quadratus lumborum', 'oblique'];
        pivot = new THREE.Vector3(0, 1.05, 0);
        axis = new THREE.Vector3(0, 0, 1);
        maxAngle = Math.PI * 0.15;
      } else if (motionId === MOTIONS.HIP_FLEXION) {
        keywords = ['femur.l', 'patella.l', 'tibia.l', 'fibula.l', 'foot.l', 'tars', 'phalang', 'iliopsoas.l', 'rectus femoris.l', 'sartorius.l'];
        pivot = new THREE.Vector3(-0.09, 0.86, 0.0);
        axis = new THREE.Vector3(1, 0, 0);
        maxAngle = -Math.PI * 0.38;
      } else if (motionId === MOTIONS.HIP_EXTENSION) {
        keywords = ['femur.l', 'patella.l', 'tibia.l', 'fibula.l', 'foot.l', 'gluteus maximus.l', 'biceps femoris.l'];
        pivot = new THREE.Vector3(-0.09, 0.86, 0.0);
        axis = new THREE.Vector3(1, 0, 0);
        maxAngle = Math.PI * 0.22;
      } else if (motionId === MOTIONS.HIP_ROTATION) {
        keywords = ['femur.l', 'patella.l', 'tibia.l', 'fibula.l', 'foot.l', 'piriformis.l', 'obturator.l'];
        pivot = new THREE.Vector3(-0.09, 0.86, 0.0);
        axis = new THREE.Vector3(0, 1, 0);
        maxAngle = -Math.PI * 0.25;
      } else if (motionId === MOTIONS.KNEE_FLEXION) {
        keywords = ['tibia.l', 'fibula.l', 'patella.l', 'foot.l', 'tars', 'phalang', 'gastrocnemius.l', 'soleus.l', 'semitendinosus.l', 'biceps femoris.l'];
        pivot = new THREE.Vector3(-0.08, 0.48, 0.0);
        axis = new THREE.Vector3(1, 0, 0);
        maxAngle = Math.PI * 0.65;
      } else if (motionId === MOTIONS.KNEE_EXTENSION) {
        keywords = ['tibia.l', 'fibula.l', 'patella.l', 'foot.l', 'quadriceps.l', 'rectus femoris.l'];
        pivot = new THREE.Vector3(-0.08, 0.48, 0.0);
        axis = new THREE.Vector3(1, 0, 0);
        maxAngle = -Math.PI * 0.20;
      } else if (motionId === MOTIONS.KNEE_ROTATION) {
        keywords = ['tibia.l', 'fibula.l', 'foot.l', 'popliteus.l'];
        pivot = new THREE.Vector3(-0.08, 0.48, 0.0);
        axis = new THREE.Vector3(0, 1, 0);
        maxAngle = -Math.PI * 0.16;
      } else if (motionId === MOTIONS.SHOULDER_FLEXION) {
        keywords = ['humerus.r', 'radius.r', 'ulna.r', 'hand.r', 'carpal', 'deltoid.r', 'pectoralis.r', 'biceps brachii.r'];
        pivot = new THREE.Vector3(0.18, 1.36, 0.0);
        axis = new THREE.Vector3(1, 0, 0);
        maxAngle = -Math.PI * 0.50;
      } else if (motionId === MOTIONS.SHOULDER_EXTENSION) {
        keywords = ['humerus.r', 'radius.r', 'ulna.r', 'hand.r', 'latissimus.r', 'triceps.r', 'deltoid.r'];
        pivot = new THREE.Vector3(0.18, 1.36, 0.0);
        axis = new THREE.Vector3(1, 0, 0);
        maxAngle = Math.PI * 0.25;
      } else if (motionId === MOTIONS.SHOULDER_ABDUCTION) {
        keywords = ['humerus.r', 'radius.r', 'ulna.r', 'hand.r', 'deltoid.r', 'supraspinatus.r'];
        pivot = new THREE.Vector3(0.18, 1.36, 0.0);
        axis = new THREE.Vector3(0, 0, 1);
        maxAngle = Math.PI * 0.45;
      } else if (motionId === MOTIONS.ELBOW_FLEXION) {
        keywords = ['radius.r', 'ulna.r', 'hand.r', 'carpal', 'metacarp', 'biceps brachii.r', 'brachialis.r', 'brachioradialis.r'];
        pivot = new THREE.Vector3(0.22, 1.15, 0.0);
        axis = new THREE.Vector3(1, 0, 0);
        maxAngle = -Math.PI * 0.60;
      } else if (motionId === MOTIONS.ELBOW_EXTENSION) {
        keywords = ['radius.r', 'ulna.r', 'hand.r', 'triceps.r', 'anconeus.r'];
        pivot = new THREE.Vector3(0.22, 1.15, 0.0);
        axis = new THREE.Vector3(1, 0, 0);
        maxAngle = Math.PI * 0.20;
      } else if (motionId === MOTIONS.FOREARM_PRONATION) {
        keywords = ['radius.r', 'hand.r', 'carpal', 'metacarp', 'pronator.r'];
        pivot = new THREE.Vector3(0.25, 1.05, 0.0);
        axis = new THREE.Vector3(0, 1, 0);
        maxAngle = Math.PI * 0.50;
      }

      registry.forEach((node, partId) => {
        const lower = partId.toLowerCase();
        const matched = keywords.some(k => lower.includes(k));
        if (matched) {
          this._cachedMotionNodes.push({
            node,
            partId,
            pivot,
            axis,
            maxAngle
          });
          this.modifiedNodes.add(node);
        }
      });
    }
  }

  frameCamera(cam) {
    if (!this.viewer || !this.viewer.camera || !this.viewer.controls) return;
    const { camera, controls } = this.viewer;
    
    const startPos = camera.position.clone();
    const targetPos = new THREE.Vector3(cam.x, cam.y, cam.z);
    const startTarget = controls.target.clone();
    const targetLook = new THREE.Vector3(cam.targetX, cam.targetY, cam.targetZ);

    const startTime = performance.now();
    const durationMs = 600;

    const animateCam = (time) => {
      const elapsed = time - startTime;
      const t = Math.min(1.0, elapsed / durationMs);
      const ease = 0.5 - Math.cos(t * Math.PI) / 2;

      camera.position.lerpVectors(startPos, targetPos, ease);
      controls.target.lerpVectors(startTarget, targetLook, ease);
      controls.update();
      this.viewer.render();

      if (t < 1.0) {
        requestAnimationFrame(animateCam);
      }
    };
    requestAnimationFrame(animateCam);
  }

  cacheBaseTransforms() {
    const registry = getMeshRegistry();
    const box = new THREE.Box3();
    const center = new THREE.Vector3();

    registry.forEach((node) => {
      if (!node.userData._basePosition) {
        node.userData._basePosition = node.position.clone();
        node.userData._baseRotation = node.rotation.clone();
        node.userData._baseQuaternion = node.quaternion.clone();
        node.userData._baseScale = node.scale.clone();
      }

      if (!node.userData._centroid) {
        box.setFromObject(node);
        if (!box.isEmpty()) {
          box.getCenter(center);
          node.userData._centroid = center.clone();
        } else {
          node.userData._centroid = node.position.clone();
        }
      }

      node.traverse((child) => {
        if (child.isMesh && !child.userData._basePosition) {
          child.userData._basePosition = child.position.clone();
          child.userData._baseRotation = child.rotation.clone();
          child.userData._baseQuaternion = child.quaternion.clone();
          child.userData._baseScale = child.scale.clone();
        }
      });
    });
  }

  // Scales a node strictly around its own centroid or custom pivot point
  scaleAroundCentroid(node, sx, sy, sz, pivotOverride = null) {
    const basePos = node.userData._basePosition || node.position;
    const baseScale = node.userData._baseScale || new THREE.Vector3(1, 1, 1);
    const C = pivotOverride || node.userData._centroid || basePos;

    node.scale.set(baseScale.x * sx, baseScale.y * sy, baseScale.z * sz);

    node.position.set(
      C.x - (sx * baseScale.x) * (C.x - basePos.x),
      C.y - (sy * baseScale.y) * (C.y - basePos.y),
      C.z - (sz * baseScale.z) * (C.z - basePos.z)
    );
  }

  // Rotates a node smoothly around an anatomical joint pivot point
  rotateAroundPivot(node, angle, axis, pivot) {
    const basePos = node.userData._basePosition || node.position;
    const baseQuat = node.userData._baseQuaternion || node.quaternion;

    node.position.copy(basePos);
    node.quaternion.copy(baseQuat);

    if (Math.abs(angle) < 0.0001) return;

    const rel = new THREE.Vector3().subVectors(basePos, pivot);
    rel.applyAxisAngle(axis, angle);
    node.position.copy(pivot).add(rel);

    const q = new THREE.Quaternion().setFromAxisAngle(axis, angle);
    node.quaternion.copy(baseQuat);
    node.quaternion.premultiply(q);
  }

  applyMotionIsolation(motionId) {
    this.restoreSystemVisibility();

    const registry = getMeshRegistry();

    if (motionId === MOTIONS.CARDIAC) {
      // In cardiac: ghost thoracic bones (ribs/sternum) so heart is clearly visible; hide digestive organs & limbs
      registry.forEach((node, partId) => {
        const lower = partId.toLowerCase();
        const isThoraxBone = lower.includes('rib') || lower.includes('costa') || lower.includes('sternum') || lower.includes('clavicle');
        const isHeart = lower.includes('heart') || lower.includes('ventricle') || lower.includes('atrium') || lower.includes('aorta') || lower.includes('pulmonary');
        
        const meshes = ownMeshesOf(partId);
        meshes.forEach(mesh => {
          if (!this._savedMeshStates.has(mesh)) {
            this._savedMeshStates.set(mesh, {
              visible: mesh.visible,
              opacity: mesh.material?.opacity ?? 1,
              transparent: mesh.material?.transparent ?? false,
              depthWrite: mesh.material?.depthWrite ?? true
            });
          }

          if (isHeart) {
            mesh.visible = true;
          } else if (isThoraxBone) {
            mesh.visible = true;
            if (mesh.material) {
              mesh.material.transparent = true;
              mesh.material.opacity = 0.20;
              mesh.material.depthWrite = false;
            }
          } else {
            mesh.visible = false;
          }
        });
      });
    } else if (motionId === MOTIONS.RESPIRATORY) {
      // In respiratory: show lungs, bronchi, ribcage; hide digestive organs (stomach, liver, intestines, etc.) and muscles
      registry.forEach((node, partId) => {
        const lower = partId.toLowerCase();
        const isResp = lower.includes('lung') || lower.includes('pulmo') || lower.includes('bronch') || lower.includes('trachea') || lower.includes('diaphragm');
        const isRibcage = lower.includes('rib') || lower.includes('costa') || lower.includes('sternum') || lower.includes('clavicle') || lower.includes('vertebra');
        const isDigestive = lower.includes('stomach') || lower.includes('liver') || lower.includes('intestine') || lower.includes('colon') || lower.includes('pancreas') || lower.includes('gallbladder') || lower.includes('kidney') || lower.includes('bladder') || lower.includes('spleen');
        const isLimbOrSkull = lower.includes('femur') || lower.includes('tibia') || lower.includes('fibula') || lower.includes('foot') || lower.includes('phalang') || lower.includes('tars') || lower.includes('patella') || lower.includes('humerus') || lower.includes('radius') || lower.includes('ulna') || lower.includes('hand') || lower.includes('carpal') || lower.includes('metacarp') || lower.includes('cranium') || lower.includes('skull') || lower.includes('mandible') || lower.includes('maxilla') || lower.includes('pelvis') || lower.includes('ilium') || lower.includes('ischium') || lower.includes('pubis') || lower.includes('sacrum');

        const meshes = ownMeshesOf(partId);
        meshes.forEach(mesh => {
          if (!this._savedMeshStates.has(mesh)) {
            this._savedMeshStates.set(mesh, {
              visible: mesh.visible,
              opacity: mesh.material?.opacity ?? 1,
              transparent: mesh.material?.transparent ?? false,
              depthWrite: mesh.material?.depthWrite ?? true
            });
          }

          if (isResp || isRibcage) {
            mesh.visible = true;
          } else if (isDigestive || isLimbOrSkull) {
            mesh.visible = false;
          }
        });
      });
    }
  }

  restoreSystemVisibility() {
    if (this._savedMeshStates && this._savedMeshStates.size > 0) {
      this._savedMeshStates.forEach((saved, mesh) => {
        mesh.visible = saved.visible;
        if (mesh.material) {
          mesh.material.opacity = saved.opacity;
          mesh.material.transparent = saved.transparent;
          mesh.material.depthWrite = saved.depthWrite;
        }
      });
      this._savedMeshStates.clear();
    }
  }

  play() {
    this.isPlaying = true;
    this.lastTimestamp = performance.now();
    this.startFrameLoop();
    this.notifyStateChange();
  }

  pause() {
    this.isPlaying = false;
    this.stopFrameLoop();
    this.notifyStateChange();
  }

  togglePlay() {
    if (this.isPlaying) {
      this.pause();
    } else {
      this.play();
    }
  }

  setSpeed(speed) {
    this.playbackSpeed = Math.max(0.1, Math.min(4.0, speed));
    this.notifyStateChange();
  }

  seek(progress) {
    this.progress = Math.max(0.0, Math.min(1.0, progress));
    this.applyMotionFrame(this.progress);
    if (this.viewer) {
      this.viewer.render();
    }
    this.notifyStateChange();
  }

  setLoop(loop) {
    this.isLooping = !!loop;
    this.notifyStateChange();
  }

  startFrameLoop() {
    if (this.registeredFrameCallback || !this.viewer) return;

    this.registeredFrameCallback = () => {
      if (!this.isPlaying) return;

      const now = performance.now();
      const deltaSec = (now - this.lastTimestamp) / 1000;
      this.lastTimestamp = now;

      // Advance progress
      const cycleStep = (deltaSec * this.playbackSpeed) / this.duration;
      this.progress += cycleStep;

      if (this.progress >= 1.0) {
        if (this.isLooping) {
          this.progress = this.progress % 1.0;
        } else {
          this.progress = 1.0;
          this.pause();
        }
      }

      this.applyMotionFrame(this.progress);
      if (typeof this.viewer?.invalidate === 'function') {
        this.viewer.invalidate(2);
      } else if (typeof this.viewer?.render === 'function') {
        this.viewer.render();
      }

      // Throttle UI listener updates to ~12 FPS (every 80ms) to eliminate DOM layout thrashing
      if (now - this._lastUiUpdate > 80) {
        this._lastUiUpdate = now;
        this.notifyStateChange();
      }
    };

    if (typeof this.viewer.onFrame === 'function') {
      this.unsubscribeFrame = this.viewer.onFrame(this.registeredFrameCallback);
    }
  }

  stopFrameLoop() {
    if (typeof this.unsubscribeFrame === 'function') {
      this.unsubscribeFrame();
      this.unsubscribeFrame = null;
    }
    this.registeredFrameCallback = null;
  }

  applyMotionFrame(p) {
    if (!this.currentMotion) return;

    switch (this.currentMotion) {
      case MOTIONS.CARDIAC:
        this.animateCardiac(p);
        break;
      case MOTIONS.RESPIRATORY:
        this.animateRespiratory(p);
        break;
      default:
        this.animateKinematicJoint(this.currentMotion, p);
        break;
    }
  }

  // --- 0. KINEMATIC JOINT ACTIONS ANIMATION ---
  animateKinematicJoint(motionId, p) {
    if (!this._cachedMotionNodes || this._cachedMotionNodes.length === 0) {
      this.buildMotionNodesCache(motionId);
    }

    const nodes = this._cachedMotionNodes;
    if (!nodes || nodes.length === 0) return;

    // Smooth sinusoidal movement 0 -> 1 -> 0
    const cycle = 0.5 - Math.cos(p * Math.PI * 2) / 2;

    for (let i = 0; i < nodes.length; i++) {
      const item = nodes[i];
      const angle = item.maxAngle * cycle;
      this.rotateAroundPivot(item.node, angle, item.axis, item.pivot);
    }
  }

  // --- 1. CARDIAC CYCLE ANIMATION ---
  animateCardiac(p) {
    const registry = getMeshRegistry();

    // Physiological contraction curve:
    // Systole (0 - 0.38): Strong fast ventricular contraction & slight apical torsion
    // Diastole (0.38 - 0.85): Rapid filling and slow filling
    // Atrial kick (0.85 - 1.0): Brief brisk atrial contraction
    let ventScale;
    let ventTwist;
    let atrialScale;
    let aortaDilation;

    if (p < 0.38) {
      const t = p / 0.38;
      const sinT = Math.sin(t * Math.PI);
      ventScale = 1.0 - 0.09 * Math.sin(t * Math.PI * 0.5);
      ventTwist = 0.05 * Math.sin(t * Math.PI);
      atrialScale = 1.0 + 0.04 * sinT;
      aortaDilation = 1.0 + 0.05 * Math.sin(t * Math.PI);
    } else if (p < 0.85) {
      const t = (p - 0.38) / (0.85 - 0.38);
      const ease = Math.sin(t * Math.PI * 0.5);
      ventScale = 0.91 + 0.12 * ease;
      ventTwist = 0.05 * (1.0 - ease);
      atrialScale = 1.04 - 0.02 * ease;
      aortaDilation = 1.05 - 0.05 * ease;
    } else {
      const t = (p - 0.85) / 0.15;
      const kick = Math.sin(t * Math.PI);
      ventScale = 1.03;
      ventTwist = 0;
      atrialScale = 1.02 - 0.07 * kick;
      aortaDilation = 1.0;
    }

    const heartPivot = new THREE.Vector3(0.018, 1.288, 0.028);

    if (!this._cachedMotionNodes || this._cachedMotionNodes.length === 0) {
      this.buildMotionNodesCache(MOTIONS.CARDIAC);
    }

    const nodes = this._cachedMotionNodes;
    for (let i = 0; i < nodes.length; i++) {
      const item = nodes[i];
      const node = item.node;
      const subType = item.subType;
      const baseRot = item.baseRot;

      if (subType === 'ventricle') {
        this.scaleAroundCentroid(node, ventScale, 1.0 - (1.0 - ventScale) * 0.5, ventScale, heartPivot);
        node.rotation.y = baseRot.y + ventTwist;
      } else if (subType === 'atrium') {
        this.scaleAroundCentroid(node, atrialScale, atrialScale, atrialScale, heartPivot);
      } else if (subType === 'aorta') {
        this.scaleAroundCentroid(node, aortaDilation, 1.0, aortaDilation, heartPivot);
      } else {
        this.scaleAroundCentroid(node, ventScale, ventScale, ventScale, heartPivot);
      }
    }
  }

  // --- 2. RESPIRATORY MECHANICS ANIMATION ---
  animateRespiratory(p) {
    const registry = getMeshRegistry();

    // Physiological tidal breathing curve:
    // Inhalation: 0 -> 0.45 (Active smooth expansion)
    // Exhalation: 0.45 -> 1.0 (Passive smooth relaxation)
    let expansion;
    if (p < 0.45) {
      const t = p / 0.45;
      expansion = 0.5 - Math.cos(t * Math.PI) / 2;
    } else {
      const t = (p - 0.45) / 0.55;
      expansion = 0.5 + Math.cos(t * Math.PI) / 2;
    }

    // Centroids measured directly from resting Z-Anatomy geometry
    const leftLungPivot = new THREE.Vector3(0.071, 1.295, 0.010);
    const rightLungPivot = new THREE.Vector3(-0.065, 1.297, 0.013);

    if (!this._cachedMotionNodes || this._cachedMotionNodes.length === 0) {
      this.buildMotionNodesCache(MOTIONS.RESPIRATORY);
    }

    const nodes = this._cachedMotionNodes;
    for (let i = 0; i < nodes.length; i++) {
      const item = nodes[i];
      const node = item.node;
      const subType = item.subType;
      const isLeft = item.isLeft;
      const basePos = item.basePos;

      if (subType === 'lung') {
        const pivot = isLeft ? leftLungPivot : rightLungPivot;

        // Subtle, realistic volumetric tidal expansion anchored strictly at the lung's centroid
        const sx = 1.0 + 0.07 * expansion;
        const sy = 1.0 + 0.04 * expansion;
        const sz = 1.0 + 0.07 * expansion;

        this.scaleAroundCentroid(node, sx, sy, sz, pivot);
      } else if (subType === 'sternum') {
        // Pump-handle motion: anterior and slight superior elevation
        node.position.set(
          basePos.x,
          basePos.y + 0.006 * expansion,
          basePos.z + 0.010 * expansion
        );
      } else if (subType === 'rib') {
        // Bucket-handle motion: lateral and superior elevation
        const lateralDir = isLeft ? 1 : -1;
        node.position.set(
          basePos.x + lateralDir * 0.006 * expansion,
          basePos.y + 0.005 * expansion,
          basePos.z + 0.006 * expansion
        );
      } else if (subType === 'diaphragm') {
        // Diaphragm dome descends during inhalation
        node.position.set(basePos.x, basePos.y - 0.012 * expansion, basePos.z);
      }
    }
  }

  // --- ISOLATION IN MOTION ---
  isolateStructure(partId) {
    if (!partId || partId === 'all') {
      this.restoreAllVisibility();
      return;
    }

    this.isolatedPartId = partId;
    const registry = getMeshRegistry();

    registry.forEach((node, id) => {
      const lower = id.toLowerCase();
      let match = false;

      if (partId === 'ventricles') {
        match = lower.includes('ventricle');
      } else if (partId === 'atria') {
        match = lower.includes('atrium');
      } else if (partId === 'aorta') {
        match = lower.includes('aorta');
      } else if (partId === 'lungs_all') {
        match = lower.includes('lung') || lower.includes('pulmo');
      } else if (partId === 'ribcage') {
        match = lower.includes('rib') || lower.includes('costa') || lower.includes('sternum');
      } else if (partId === 'left_lung') {
        match = lower.includes('left lung');
      } else if (partId === 'right_lung') {
        match = lower.includes('right lung');
      } else {
        match = (id === partId || lower.includes(partId.toLowerCase()));
      }

      const ownMeshes = ownMeshesOf(id);
      ownMeshes.forEach(mesh => {
        if (this.ghostNonIsolated) {
          mesh.visible = true;
          if (!match && mesh.material) {
            mesh.material.transparent = true;
            mesh.material.opacity = 0.12;
          }
        } else {
          mesh.visible = match;
        }
      });
    });

    if (this.viewer) {
      this.viewer.render();
    }
    this.notifyStateChange();
  }

  toggleGhostMode() {
    this.ghostNonIsolated = !this.ghostNonIsolated;
    if (this.isolatedPartId) {
      this.isolateStructure(this.isolatedPartId);
    }
    this.notifyStateChange();
  }

  restoreAllVisibility() {
    this.isolatedPartId = null;
    const registry = getMeshRegistry();
    registry.forEach((node, id) => {
      const ownMeshes = ownMeshesOf(id);
      ownMeshes.forEach(mesh => {
        mesh.visible = true;
        if (mesh.userData.baseMaterial) {
          mesh.material = mesh.userData.baseMaterial;
        } else if (mesh.material) {
          mesh.material.transparent = false;
          mesh.material.opacity = 1.0;
        }
      });
    });

    if (this.viewer) {
      this.viewer.render();
    }
    this.notifyStateChange();
  }

  resetPose() {
    this.modifiedNodes.forEach(node => {
      if (node.userData._basePosition) {
        node.position.copy(node.userData._basePosition);
      }
      if (node.userData._baseQuaternion) {
        node.quaternion.copy(node.userData._baseQuaternion);
      } else if (node.userData._baseRotation) {
        node.rotation.copy(node.userData._baseRotation);
      }
      if (node.userData._baseScale) {
        node.scale.copy(node.userData._baseScale);
      }
    });
    this.modifiedNodes.clear();

    if (this.viewer) {
      this.viewer.render();
    }
  }

  dispose() {
    this.pause();
    this.resetPose();
    this.restoreSystemVisibility();
    this.restoreAllVisibility();
    this.currentMotion = null;
    this.listeners.clear();
  }
}

export const dynamicAnatomy = new DynamicAnatomyEngine();
