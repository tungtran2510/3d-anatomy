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
    camera: { x: 1.25, y: 1.15, z: 1.45, targetX: 0, targetY: 1.05, targetZ: 0 },
    agonists: ['rectus abdominis', 'oblique', 'pectoralis'],
    phases: [
      { from: 0.0, to: 0.5, name: 'Cơ thẳng bụng & cơ chéo bụng co, gập cột sống ra trước' },
      { from: 0.5, to: 1.0, name: 'Trở về tư thế đứng thẳng giải phẫu' }
    ]
  },
  [MOTIONS.SPINE_EXTENSION]: {
    id: MOTIONS.SPINE_EXTENSION,
    titleVi: 'Duỗi Cột Sống (Spine Extension)',
    titleEn: 'Spine Extension',
    systemRequired: 'muscular',
    secondarySystem: 'skeletal',
    defaultDuration: 2.4,
    camera: { x: 1.25, y: 1.15, z: -1.45, targetX: 0, targetY: 1.05, targetZ: 0 },
    agonists: ['erector spinae', 'iliocostalis', 'longissimus', 'spinalis', 'latissimus', 'trapezius', 'splenius'],
    phases: [
      { from: 0.0, to: 0.5, name: 'Nhóm cơ dựng sống (Erector spinae) kéo cột sống ngửa ra sau' },
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
    camera: { x: 0, y: 1.15, z: 1.75, targetX: 0, targetY: 1.05, targetZ: 0 },
    agonists: ['quadratus lumborum', 'oblique', 'intertransversarii'],
    phases: [
      { from: 0.0, to: 0.5, name: 'Cơ vuông thắt lưng & cơ chéo bụng co nghiêng thân sang bên' },
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
    camera: { x: 1.25, y: 0.65, z: 1.20, targetX: 0.08, targetY: 0.55, targetZ: 0 },
    agonists: ['iliopsoas.l', 'psoas.l', 'iliacus.l', 'rectus femoris.l', 'sartorius.l', 'pectineus.l'],
    phases: [
      { from: 0.0, to: 0.5, name: 'Cơ thắt lưng chậu (Iliopsoas) và cơ thẳng đùi co nâng đùi ra trước' },
      { from: 0.5, to: 1.0, name: 'Hạ đùi trở về tư thế giải phẫu' }
    ]
  },
  [MOTIONS.HIP_EXTENSION]: {
    id: MOTIONS.HIP_EXTENSION,
    titleVi: 'Duỗi Khớp Háng (Hip Extension)',
    titleEn: 'Hip Extension',
    systemRequired: 'muscular',
    secondarySystem: 'skeletal',
    defaultDuration: 2.2,
    camera: { x: 1.15, y: 0.65, z: -1.15, targetX: 0.08, targetY: 0.55, targetZ: 0 },
    agonists: ['gluteus maximus.l', 'biceps femoris.l', 'semitendinosus.l', 'semimembranosus.l'],
    phases: [
      { from: 0.0, to: 0.5, name: 'Cơ mông lớn & nhóm gân kheo kéo đùi ra sau thân mình' },
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
    camera: { x: 0.40, y: 0.65, z: 1.45, targetX: 0.08, targetY: 0.55, targetZ: 0 },
    agonists: ['tensor fasciae latae.l', 'gluteus medius.l', 'gluteus minimus.l'],
    phases: [
      { from: 0.0, to: 0.5, name: 'Cơ căng mạc đùi & cơ mông nhỡ xoay đùi vào trong' },
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
    camera: { x: 0.85, y: 0.40, z: 0.75, targetX: 0.09, targetY: 0.35, targetZ: 0 },
    agonists: ['biceps femoris.l', 'semitendinosus.l', 'semimembranosus.l', 'gastrocnemius.l', 'popliteus.l'],
    phases: [
      { from: 0.0, to: 0.5, name: 'Nhóm cơ gân kheo co gập cẳng chân ra sau' },
      { from: 0.5, to: 1.0, name: 'Duỗi cẳng chân trở lại vị trí ban đầu' }
    ]
  },
  [MOTIONS.KNEE_EXTENSION]: {
    id: MOTIONS.KNEE_EXTENSION,
    titleVi: 'Duỗi Khớp Gối (Knee Extension)',
    titleEn: 'Knee Extension',
    systemRequired: 'muscular',
    secondarySystem: 'skeletal',
    defaultDuration: 2.0,
    camera: { x: 0.85, y: 0.40, z: 0.75, targetX: 0.09, targetY: 0.35, targetZ: 0 },
    agonists: ['rectus femoris.l', 'vastus lateralis.l', 'vastus medialis.l', 'vastus intermedius.l', 'quadriceps.l'],
    phases: [
      { from: 0.0, to: 0.5, name: 'Cơ tứ đầu đùi co kéo bánh chè duỗi thẳng khóa khớp gối' },
      { from: 0.5, to: 1.0, name: 'Khớp gối thư giãn về tư thế chuẩn' }
    ]
  },
  [MOTIONS.KNEE_ROTATION]: {
    id: MOTIONS.KNEE_ROTATION,
    titleVi: 'Xoay Trong Khớp Gối (Knee Medial Rotation)',
    titleEn: 'Knee Medial Rotation',
    systemRequired: 'muscular',
    secondarySystem: 'skeletal',
    defaultDuration: 2.0,
    camera: { x: 0.35, y: 0.40, z: 0.95, targetX: 0.09, targetY: 0.35, targetZ: 0 },
    agonists: ['popliteus.l', 'semitendinosus.l', 'semimembranosus.l', 'gracilis.l'],
    phases: [
      { from: 0.0, to: 0.5, name: 'Cơ khoeo và cơ bán gân xoay nhẹ cẳng chân vào trong để mở khóa gối' },
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
    camera: { x: -0.95, y: 1.25, z: 0.95, targetX: -0.18, targetY: 1.20, targetZ: 0 },
    agonists: ['deltoid.r', 'pectoralis major.r', 'biceps brachii.r', 'coracobrachialis.r'],
    phases: [
      { from: 0.0, to: 0.5, name: 'Bó trước cơ delta & cơ ngực lớn co nâng cánh tay ra trước' },
      { from: 0.5, to: 1.0, name: 'Hạ cánh tay xuống dọc theo thân' }
    ]
  },
  [MOTIONS.SHOULDER_EXTENSION]: {
    id: MOTIONS.SHOULDER_EXTENSION,
    titleVi: 'Duỗi Khớp Vai (Shoulder Extension)',
    titleEn: 'Shoulder Extension',
    systemRequired: 'muscular',
    secondarySystem: 'skeletal',
    defaultDuration: 2.2,
    camera: { x: -0.95, y: 1.25, z: -0.95, targetX: -0.18, targetY: 1.20, targetZ: 0 },
    agonists: ['latissimus dorsi.r', 'teres major.r', 'deltoid.r', 'triceps brachii.r'],
    phases: [
      { from: 0.0, to: 0.5, name: 'Cơ lưng rộng & cơ tròn lớn kéo cánh tay ra sau thân mình' },
      { from: 0.5, to: 1.0, name: 'Đưa cánh tay về vị trí giải phẫu' }
    ]
  },
  [MOTIONS.SHOULDER_ABDUCTION]: {
    id: MOTIONS.SHOULDER_ABDUCTION,
    titleVi: 'Dang Ngang Khớp Vai (Shoulder Abduction)',
    titleEn: 'Shoulder Abduction',
    systemRequired: 'muscular',
    secondarySystem: 'skeletal',
    defaultDuration: 2.2,
    camera: { x: -0.30, y: 1.25, z: 1.55, targetX: -0.22, targetY: 1.20, targetZ: 0 },
    agonists: ['deltoid.r', 'supraspinatus.r'],
    phases: [
      { from: 0.0, to: 0.5, name: 'Cơ trên gai khởi động dạng, cơ delta kéo cánh tay dang ngang sang bên' },
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
    camera: { x: -0.75, y: 1.10, z: 0.85, targetX: -0.22, targetY: 1.02, targetZ: 0 },
    agonists: ['biceps brachii.r', 'brachialis.r', 'brachioradialis.r'],
    phases: [
      { from: 0.0, to: 0.5, name: 'Cơ nhị đầu cánh tay & cơ cánh tay co gập cẳng tay lên' },
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
    camera: { x: -0.75, y: 1.10, z: 0.85, targetX: -0.22, targetY: 1.02, targetZ: 0 },
    agonists: ['triceps brachii.r', 'anconeus.r'],
    phases: [
      { from: 0.0, to: 0.5, name: 'Cơ tam đầu cánh tay co kéo mỏm khuỷu duỗi thẳng tay' },
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
    camera: { x: -0.65, y: 0.95, z: 0.75, targetX: -0.24, targetY: 0.92, targetZ: 0 },
    agonists: ['pronator teres.r', 'pronator quadratus.r'],
    phases: [
      { from: 0.0, to: 0.5, name: 'Cơ sấp tròn & sấp vuông xoay xương quay vắt chéo xương trụ (Úp bàn tay)' },
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
    this._cachedMotionNodes = [];
    if (!this.viewer || !this.viewer.scene) return;

    if (motionId === MOTIONS.CARDIAC) {
      this.viewer.scene.traverse((node) => {
        if (!node.isMesh || node.parent?.name !== 'Scene') return;
        const partId = (node.userData?.partId || node.name || '').toLowerCase();
        const isVentricle = partId.includes('ventricle') || partId.includes('papillary') || partId.includes('interventricular');
        const isAtrium = partId.includes('atrium') || partId.includes('auricle');
        const isAorta = partId.includes('aorta') || partId.includes('pulmonary trunk') || partId.includes('pulmonary_trunk');
        const isHeart = partId.includes('heart') || partId.includes('coronary') || partId.includes('valve') || isVentricle || isAtrium || isAorta;

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
      this.viewer.scene.traverse((node) => {
        if (!node.isMesh || node.parent?.name !== 'Scene') return;
        const partId = (node.userData?.partId || node.name || '').toLowerCase();
        const isLung = partId.includes('lung') || partId.includes('pulmo') || partId.includes('bronch');
        const isRib = partId.includes('rib') || partId.includes('costa') || partId.includes('cartilage');
        const isSternum = partId.includes('sternum') || partId.includes('xiphoid') || partId.includes('manubrium');
        const isDiaphragm = partId.includes('diaphragm');

        if (isLung || isRib || isSternum || isDiaphragm) {
          const isLeft = partId.endsWith('.l') || partId.includes('left') || (node.position.x > 0.01);
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
      // Kinematic Segment Chains (Unified Multi-Mesh Anatomical Chains)
      let chainType = '';
      let pivot = new THREE.Vector3(0, 0, 0);
      let axis = new THREE.Vector3(1, 0, 0);
      let maxAngle = 0;

      if (motionId === MOTIONS.SPINE_FLEXION) {
        chainType = 'spine';
        pivot.set(0, 0.970, -0.030);
        axis.set(1, 0, 0);
        maxAngle = 0.22; // ~13 deg forward
      } else if (motionId === MOTIONS.SPINE_EXTENSION) {
        chainType = 'spine';
        pivot.set(0, 0.970, -0.030);
        axis.set(1, 0, 0);
        maxAngle = -0.18; // ~ -10 deg backward
      } else if (motionId === MOTIONS.SPINE_LAT_FLEXION) {
        chainType = 'spine';
        pivot.set(0, 0.970, -0.030);
        axis.set(0, 0, 1);
        maxAngle = 0.16; // ~9 deg side
      } else if (motionId === MOTIONS.HIP_FLEXION) {
        chainType = 'left_leg';
        pivot.set(0.088, 0.865, -0.019);
        axis.set(1, 0, 0);
        maxAngle = -0.72; // ~ -41 deg forward
      } else if (motionId === MOTIONS.HIP_EXTENSION) {
        chainType = 'left_leg';
        pivot.set(0.088, 0.865, -0.019);
        axis.set(1, 0, 0);
        maxAngle = 0.35; // ~ +20 deg backward
      } else if (motionId === MOTIONS.HIP_ROTATION) {
        chainType = 'left_leg';
        pivot.set(0.088, 0.865, -0.019);
        axis.set(0, 1, 0);
        maxAngle = 0.32; // ~ +18 deg internal rotation
      } else if (motionId === MOTIONS.KNEE_FLEXION) {
        chainType = 'left_shank';
        pivot.set(0.093, 0.445, -0.015);
        axis.set(1, 0, 0);
        maxAngle = 1.15; // ~ +65 deg backward flexion
      } else if (motionId === MOTIONS.KNEE_EXTENSION) {
        chainType = 'left_shank';
        pivot.set(0.093, 0.445, -0.015);
        axis.set(1, 0, 0);
        maxAngle = -0.45; // straightens from flexion
      } else if (motionId === MOTIONS.KNEE_ROTATION) {
        chainType = 'left_shank';
        pivot.set(0.093, 0.445, -0.015);
        axis.set(0, 1, 0);
        maxAngle = 0.22; // ~ +12 deg internal rotation
      } else if (motionId === MOTIONS.SHOULDER_FLEXION) {
        chainType = 'right_arm';
        pivot.set(-0.185, 1.385, -0.028);
        axis.set(1, 0, 0);
        maxAngle = -0.95; // ~ -55 deg forward lift
      } else if (motionId === MOTIONS.SHOULDER_EXTENSION) {
        chainType = 'right_arm';
        pivot.set(-0.185, 1.385, -0.028);
        axis.set(1, 0, 0);
        maxAngle = 0.45; // ~ +25 deg backward swing
      } else if (motionId === MOTIONS.SHOULDER_ABDUCTION) {
        chainType = 'right_arm';
        pivot.set(-0.185, 1.385, -0.028);
        axis.set(0, 0, 1);
        maxAngle = -0.95; // ~ -55 deg outward abduction
      } else if (motionId === MOTIONS.ELBOW_FLEXION) {
        chainType = 'right_forearm';
        pivot.set(-0.238, 1.085, -0.028);
        axis.set(1, 0, 0);
        maxAngle = -1.15; // ~ -65 deg flexion forward
      } else if (motionId === MOTIONS.ELBOW_EXTENSION) {
        chainType = 'right_forearm';
        pivot.set(-0.238, 1.085, -0.028);
        axis.set(1, 0, 0);
        maxAngle = 0.65; // straightens downward
      } else if (motionId === MOTIONS.FOREARM_PRONATION) {
        chainType = 'right_hand_radius';
        pivot.set(-0.245, 1.00, -0.025);
        axis.set(0.12, -0.98, -0.12);
        maxAngle = 1.25; // ~70 deg pronation
      }

      this.viewer.scene.traverse((obj) => {
        if (!obj.isMesh || obj.parent?.name !== 'Scene' || !obj.geometry) return;
        const partId = (obj.userData?.partId || obj.name || '').toLowerCase();

        if (!obj.geometry.boundingBox) obj.geometry.computeBoundingBox();
        const b = obj.geometry.boundingBox;
        const cx = obj.position.x + (b ? (b.min.x + b.max.x) / 2 : 0);
        const cy = obj.position.y + (b ? (b.min.y + b.max.y) / 2 : 0);
        const cz = obj.position.z + (b ? (b.min.z + b.max.z) / 2 : 0);

        let inChain = false;
        let weight = 1.0;

        if (chainType === 'spine') {
          const isPelvisOrLeg = partId.includes('sacrum') || partId.includes('coccyx') || 
            partId.includes('hip_bone') || partId.includes('ilium') || partId.includes('ischium') || 
            partId.includes('pubis') || partId.includes('femur') || partId.includes('gluteus') || 
            partId.includes('patella') || partId.includes('tibia') || partId.includes('fibula') || 
            partId.includes('foot') || partId.includes('toe') || partId.includes('psoas') || 
            partId.includes('iliacus') || partId.includes('trochanter') || partId.includes('acetabul') || 
            (cy < 0.96 && Math.abs(cx) < 0.15);

          if (!isPelvisOrLeg && (cy >= 0.96 || (Math.abs(cx) >= 0.14 && cy >= 0.58))) {
            inChain = true;
            weight = 1.0;
          }
        } else if (chainType === 'left_leg') {
          const isPelvis = partId.includes('sacrum') || partId.includes('coccyx') || 
            partId.includes('hip_bone') || partId.includes('ilium') || partId.includes('ischium') || 
            partId.includes('pubis') || partId.includes('vertebra') || partId.includes('spine');
          if (!isPelvis && cx > 0.01 && cy < 0.875) {
            inChain = true;
            weight = 1.0;
          }
        } else if (chainType === 'left_shank') {
          const isThigh = partId.includes('femur') || partId.includes('quadriceps') || partId.includes('sartorius');
          if (!isThigh && cx > 0.01 && cy < 0.445) {
            inChain = true;
            weight = 1.0;
          }
        } else if (chainType === 'right_arm') {
          const isTrunk = partId.includes('clavicle') || partId.includes('scapula') || 
            partId.includes('rib') || partId.includes('costa') || partId.includes('sternum') || 
            partId.includes('vertebra') || partId.includes('pectoralis') || partId.includes('latissimus') || 
            partId.includes('trapezius');
          if (!isTrunk && cx < -0.13 && cy < 1.385) {
            inChain = true;
            weight = 1.0;
          }
        } else if (chainType === 'right_forearm') {
          if (cx < -0.13 && cy < 1.085 && cy > 0.50) {
            inChain = true;
            weight = 1.0;
          }
        } else if (chainType === 'right_hand_radius') {
          const isForearmRotator = partId.includes('radius') || partId.includes('hand') || 
            partId.includes('carpal') || partId.includes('phalanx') || partId.includes('metacarpal') || 
            partId.includes('digit') || partId.includes('thumb') || partId.includes('pronator');
          if (cx < -0.15 && cy < 1.085 && isForearmRotator) {
            inChain = true;
            weight = 1.0;
          }
        }

        if (inChain) {
          if (!obj.userData._basePosition) {
            obj.userData._basePosition = obj.position.clone();
            obj.userData._baseRotation = obj.rotation.clone();
            obj.userData._baseQuaternion = obj.quaternion.clone();
            obj.userData._baseScale = obj.scale.clone();
          }
          this._cachedMotionNodes.push({
            node: obj,
            partId,
            pivot,
            axis,
            maxAngle,
            weight
          });
          this.modifiedNodes.add(obj);
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
    if (!this.viewer || !this.viewer.scene) return;
    const box = new THREE.Box3();
    const center = new THREE.Vector3();

    this.viewer.scene.traverse((node) => {
      if (!node.isMesh) return;
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

    if (Math.abs(angle) < 0.0001) {
      node.position.copy(basePos);
      node.quaternion.copy(baseQuat);
      return;
    }

    const rel = this._scratchRel || (this._scratchRel = new THREE.Vector3());
    const q = this._scratchQuat || (this._scratchQuat = new THREE.Quaternion());

    rel.subVectors(basePos, pivot);
    rel.applyAxisAngle(axis, angle);
    node.position.copy(pivot).add(rel);

    q.setFromAxisAngle(axis, angle);
    node.quaternion.copy(baseQuat);
    node.quaternion.premultiply(q);
  }

  applyMotionIsolation(motionId) {
    this.restoreSystemVisibility();
    if (!this.viewer || !this.viewer.scene) return;

    const saveMesh = (mesh) => {
      if (!this._savedMeshStates.has(mesh)) {
        this._savedMeshStates.set(mesh, {
          visible: mesh.visible,
          opacity: mesh.material?.opacity ?? 1,
          transparent: mesh.material?.transparent ?? false,
          depthWrite: mesh.material?.depthWrite ?? true,
          emissiveHex: mesh.material?.emissive ? mesh.material.emissive.getHex() : 0
        });
      }
    };

    if (motionId === MOTIONS.CARDIAC) {
      this.viewer.scene.traverse((mesh) => {
        if (!mesh.isMesh || mesh.parent?.name !== 'Scene') return;
        const lower = (mesh.userData?.partId || mesh.name || '').toLowerCase();
        const isThoraxBone = lower.includes('rib') || lower.includes('costa') || lower.includes('sternum') || lower.includes('clavicle');
        const isHeart = lower.includes('heart') || lower.includes('ventricle') || lower.includes('atrium') || lower.includes('aorta') || lower.includes('pulmonary');

        saveMesh(mesh);

        if (isHeart) {
          mesh.visible = true;
          if (mesh.material) {
            mesh.material.transparent = false;
            mesh.material.opacity = 1.0;
          }
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
    } else if (motionId === MOTIONS.RESPIRATORY) {
      this.viewer.scene.traverse((mesh) => {
        if (!mesh.isMesh || mesh.parent?.name !== 'Scene') return;
        const lower = (mesh.userData?.partId || mesh.name || '').toLowerCase();
        const isResp = lower.includes('lung') || lower.includes('pulmo') || lower.includes('bronch') || lower.includes('trachea') || lower.includes('diaphragm');
        const isRibcage = lower.includes('rib') || lower.includes('costa') || lower.includes('sternum') || lower.includes('clavicle') || lower.includes('vertebra');
        const isDigestive = lower.includes('stomach') || lower.includes('liver') || lower.includes('intestine') || lower.includes('colon') || lower.includes('pancreas') || lower.includes('gallbladder') || lower.includes('kidney') || lower.includes('bladder') || lower.includes('spleen');
        const isLimbOrSkull = lower.includes('femur') || lower.includes('tibia') || lower.includes('fibula') || lower.includes('foot') || lower.includes('phalang') || lower.includes('tars') || lower.includes('patella') || lower.includes('humerus') || lower.includes('radius') || lower.includes('ulna') || lower.includes('hand') || lower.includes('carpal') || lower.includes('metacarp') || lower.includes('cranium') || lower.includes('skull') || lower.includes('mandible') || lower.includes('maxilla') || lower.includes('pelvis') || lower.includes('ilium') || lower.includes('ischium') || lower.includes('pubis') || lower.includes('sacrum');

        saveMesh(mesh);

        if (isResp || isRibcage) {
          mesh.visible = true;
        } else if (isDigestive || isLimbOrSkull) {
          mesh.visible = false;
        }
      });
    } else {
      // Kinematic Joint Muscle Actions:
      // Active moving chain + Agonists: solid, opaque, with prime movers glowing
      // Other surrounding bones/muscles: ghosted at opacity 0.22 for anatomical context
      // Internal visceral organs: hidden
      const meta = MOTION_METADATA[motionId];
      const agonists = meta?.agonists || [];
      const movingNodesSet = new Set(this._cachedMotionNodes ? this._cachedMotionNodes.map(m => m.node) : []);

      this.viewer.scene.traverse((mesh) => {
        if (!mesh.isMesh || mesh.parent?.name !== 'Scene') return;
        const lower = (mesh.userData?.partId || mesh.name || '').toLowerCase();
        const sys = mesh.userData?.system;
        const isInternalOrgan = sys === 'visceral' || sys === 'lymphatic' || sys === 'nervous' ||
          lower.includes('stomach') || lower.includes('liver') || lower.includes('intestine') || 
          lower.includes('kidney') || lower.includes('bladder') || lower.includes('colon');

        saveMesh(mesh);

        if (isInternalOrgan) {
          mesh.visible = false;
          return;
        }

        const isInMovingChain = movingNodesSet.has(mesh);
        const isAgonist = agonists.some(a => lower.includes(a));

        if (isInMovingChain || isAgonist) {
          mesh.visible = true;
          if (mesh.material) {
            mesh.material.transparent = false;
            mesh.material.opacity = 1.0;
            mesh.material.depthWrite = true;
            if (isAgonist && mesh.material.emissive) {
              mesh.material.emissive.setHex(0x550a0a); // Subtle vibrant active red glow
            }
          }
        } else {
          // Surrounding body: translucent ghost
          mesh.visible = true;
          if (mesh.material) {
            mesh.material.transparent = true;
            mesh.material.opacity = 0.22;
            mesh.material.depthWrite = false;
          }
        }
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
          if (mesh.material.emissive && saved.emissiveHex !== undefined) {
            mesh.material.emissive.setHex(saved.emissiveHex);
          }
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
    let cycle = 0.5 - Math.cos(p * Math.PI * 2) / 2;
    if (motionId === MOTIONS.KNEE_EXTENSION || motionId === MOTIONS.ELBOW_EXTENSION) {
      // Extends from pre-flexed position to straight position and back
      cycle = 0.5 + Math.cos(p * Math.PI * 2) / 2;
    }

    for (let i = 0; i < nodes.length; i++) {
      const item = nodes[i];
      const effWeight = item.weight !== undefined ? item.weight : 1.0;
      const angle = item.maxAngle * effWeight * cycle;
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
