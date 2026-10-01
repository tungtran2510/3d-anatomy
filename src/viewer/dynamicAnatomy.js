// Dynamic Anatomy & Physiological / Biomechanical Motion Engine
// Supports: Cardiac Cycle, Respiratory Mechanics, Elbow Flexion/Extension,
// Knee Flexion/Extension, Spine Flexion/Extension, Hip Abduction.
// Features: Timeline Scrubbing, Variable Speed, Play/Pause, Isolated Motion, Zero Idle Overhead.

import * as THREE from 'three';
import { getMeshRegistry, ownMeshesOf, loadModel } from './loadModel.js';
import { getPartState, state } from '../state/store.js';

export const MOTIONS = {
  CARDIAC: 'cardiac',
  RESPIRATORY: 'respiratory',
  ELBOW_FLEXION: 'elbow_flexion',
  KNEE_FLEXION: 'knee_flexion',
  SPINE_FLEXION: 'spine_flexion',
  HIP_ABDUCTION: 'hip_abduction'
};

export const MOTION_METADATA = {
  [MOTIONS.CARDIAC]: {
    id: MOTIONS.CARDIAC,
    titleVi: '🫀 Nhịp Tim & Chu kỳ Tim (Cardiac Cycle)',
    titleEn: 'Cardiac Cycle',
    systemRequired: 'cardiovascular',
    defaultDuration: 0.8, // seconds (~75 bpm)
    camera: { x: 0, y: 1.25, z: 0.8, targetX: 0, targetY: 1.25, targetZ: 0 },
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
    titleVi: '🫁 Cơ Chế Hô Hấp (Respiratory Mechanics)',
    titleEn: 'Respiratory Cycle',
    systemRequired: 'visceral',
    secondarySystem: 'skeletal',
    defaultDuration: 3.75, // seconds (~16 breaths/min)
    camera: { x: 0, y: 1.25, z: 1.1, targetX: 0, targetY: 1.25, targetZ: 0 },
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
  [MOTIONS.ELBOW_FLEXION]: {
    id: MOTIONS.ELBOW_FLEXION,
    titleVi: '💪 Gập Duỗi Khớp Khuỷu (Elbow Kinematics)',
    titleEn: 'Elbow Flexion & Extension',
    systemRequired: 'skeletal',
    secondarySystem: 'muscular',
    defaultDuration: 2.2, // seconds
    camera: { x: 0.5, y: 1.05, z: 0.7, targetX: 0.3, targetY: 1.0, targetZ: 0 },
    phases: [
      { from: 0.0, to: 0.5, name: 'Gập khuỷu (Flexion 0° → 135°) — Cơ nhị đầu co đồng tâm, cơ tam đầu dãn dài' },
      { from: 0.5, to: 1.0, name: 'Duỗi khuỷu (Extension 135° → 0°) — Cơ tam đầu co duỗi cẳng tay thẳng lại' }
    ],
    keyParts: [
      { id: 'forearm_bones', nameVi: 'Xương cẳng tay (Quay & Trụ)' },
      { id: 'biceps', nameVi: 'Cơ nhị đầu cánh tay (Biceps brachii)' },
      { id: 'triceps', nameVi: 'Cơ tam đầu cánh tay (Triceps brachii)' },
      { id: 'humerus', nameVi: 'Xương cánh tay (Humerus)' }
    ]
  },
  [MOTIONS.KNEE_FLEXION]: {
    id: MOTIONS.KNEE_FLEXION,
    titleVi: '🦵 Gập Duỗi Khớp Gối (Knee Kinematics)',
    titleEn: 'Knee Flexion & Extension',
    systemRequired: 'skeletal',
    secondarySystem: 'muscular',
    defaultDuration: 2.5, // seconds
    camera: { x: 0.25, y: 0.45, z: 0.8, targetX: 0.12, targetY: 0.45, targetZ: 0 },
    phases: [
      { from: 0.0, to: 0.5, name: 'Gập gối (Flexion 0° → 120°) — Xương bánh chè trượt dọc rãnh lồi cầu đùi' },
      { from: 0.5, to: 1.0, name: 'Duỗi gối (Extension 120° → 0°) — Cơ tứ đầu đùi co, kéo thẳng cẳng chân' }
    ],
    keyParts: [
      { id: 'patella', nameVi: 'Xương bánh chè (Patella)' },
      { id: 'shank_bones', nameVi: 'Xương cẳng chân (Chày & Mác)' },
      { id: 'quadriceps', nameVi: 'Cơ tứ đầu đùi (Quadriceps)' },
      { id: 'femur', nameVi: 'Xương đùi (Femur)' }
    ]
  },
  [MOTIONS.SPINE_FLEXION]: {
    id: MOTIONS.SPINE_FLEXION,
    titleVi: '🦴 Cúi Ngửa Cột Sống (Spine Articulation)',
    titleEn: 'Spine Flexion & Extension',
    systemRequired: 'skeletal',
    defaultDuration: 3.0,
    camera: { x: 0.9, y: 1.1, z: 0, targetX: 0, targetY: 1.1, targetZ: 0 },
    phases: [
      { from: 0.0, to: 0.5, name: 'Cúi thân trước (Flexion 35°) — Các đốt sống uốn cong dồn nén đĩa đệm phía trước' },
      { from: 0.5, to: 1.0, name: 'Ngửa thân sau (Extension 15°) — Cột sống ưỡn ngửa sinh lý' }
    ],
    keyParts: [
      { id: 'lumbar', nameVi: 'Các đốt sống thắt lưng (L1 - L5)' },
      { id: 'thoracic', nameVi: 'Các đốt sống ngực (T1 - T12)' },
      { id: 'cervical', nameVi: 'Các đốt sống cổ (C1 - C7)' }
    ]
  },
  [MOTIONS.HIP_ABDUCTION]: {
    id: MOTIONS.HIP_ABDUCTION,
    titleVi: '🤸 Dạng Khép Khớp Háng (Hip Abduction)',
    titleEn: 'Hip Abduction & Adduction',
    systemRequired: 'skeletal',
    secondarySystem: 'muscular',
    defaultDuration: 2.2,
    camera: { x: 0, y: 0.75, z: 1.2, targetX: 0, targetY: 0.7, targetZ: 0 },
    phases: [
      { from: 0.0, to: 0.5, name: 'Dạng khớp háng (Abduction 0° → 40°) — Chỏm đùi xoay trong ổ cối' },
      { from: 0.5, to: 1.0, name: 'Khép khớp háng (Adduction 40° → 0°) — Cơ mông & cơ khép phối hợp' }
    ],
    keyParts: [
      { id: 'femur_hip', nameVi: 'Khớp háng & Xương đùi phải' },
      { id: 'gluteal', nameVi: 'Nhóm cơ mông (Gluteus medius)' }
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

    // Reset previous motion pose cleanly
    this.resetPose();

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

    // Capture resting base transforms for all relevant nodes
    this.cacheBaseTransforms();

    this.play();
    this.notifyStateChange();
  }

  frameCamera(cam) {
    if (!this.viewer || !this.viewer.camera || !this.viewer.controls) return;
    const { camera, controls } = this.viewer;
    
    // Smooth camera transition
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
    registry.forEach((node) => {
      if (!node.userData._basePosition) {
        node.userData._basePosition = node.position.clone();
        node.userData._baseRotation = node.rotation.clone();
        node.userData._baseScale = node.scale.clone();
      }
      node.traverse((child) => {
        if (child.isMesh && !child.userData._basePosition) {
          child.userData._basePosition = child.position.clone();
          child.userData._baseRotation = child.rotation.clone();
          child.userData._baseScale = child.scale.clone();
        }
      });
    });
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
      if (this.viewer) {
        this.viewer.invalidate(2);
      }
      this.notifyStateChange();
    };

    this.viewer.onFrame(this.registeredFrameCallback);
  }

  stopFrameLoop() {
    if (this.registeredFrameCallback && this.viewer) {
      this.registeredFrameCallback = null;
    }
  }

  // Applies biomechanical transformation according to active motion and normalized progress (0..1)
  applyMotionFrame(p) {
    if (!this.currentMotion) return;

    switch (this.currentMotion) {
      case MOTIONS.CARDIAC:
        this.animateCardiac(p);
        break;
      case MOTIONS.RESPIRATORY:
        this.animateRespiratory(p);
        break;
      case MOTIONS.ELBOW_FLEXION:
        this.animateElbow(p);
        break;
      case MOTIONS.KNEE_FLEXION:
        this.animateKnee(p);
        break;
      case MOTIONS.SPINE_FLEXION:
        this.animateSpine(p);
        break;
      case MOTIONS.HIP_ABDUCTION:
        this.animateHip(p);
        break;
      default:
        break;
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
      // Systole: t goes 0 -> 1
      const t = p / 0.38;
      const sinT = Math.sin(t * Math.PI);
      // Ventricles contract down to 88%
      ventScale = 1.0 - 0.12 * Math.sin(t * Math.PI * 0.5);
      // Apical wringing twist ~4°
      ventTwist = 0.07 * Math.sin(t * Math.PI);
      // Atria relax / fill with blood
      atrialScale = 1.0 + 0.05 * sinT;
      // Pulsatile expansion of ascending aorta
      aortaDilation = 1.0 + 0.06 * Math.sin(t * Math.PI);
    } else if (p < 0.85) {
      // Diastole: ventricles relax back out to 104%
      const t = (p - 0.38) / (0.85 - 0.38);
      const ease = Math.sin(t * Math.PI * 0.5);
      ventScale = 0.88 + 0.16 * ease;
      ventTwist = 0.07 * (1.0 - ease);
      atrialScale = 1.05 - 0.03 * ease;
      aortaDilation = 1.06 - 0.06 * ease;
    } else {
      // Atrial Kick: 0.85 - 1.0
      const t = (p - 0.85) / 0.15;
      const kick = Math.sin(t * Math.PI);
      ventScale = 1.04;
      ventTwist = 0;
      atrialScale = 1.02 - 0.10 * kick;
      aortaDilation = 1.0;
    }

    registry.forEach((node, partId) => {
      const lower = partId.toLowerCase();
      const isVentricle = lower.includes('ventricle') || lower.includes('papillary') || lower.includes('interventricular');
      const isAtrium = lower.includes('atrium') || lower.includes('auricle');
      const isAorta = lower.includes('aorta') || lower.includes('pulmonary trunk');
      const isHeart = lower.includes('heart') || lower.includes('coronary') || lower.includes('valve') || isVentricle || isAtrium || isAorta;

      if (!isHeart) return;

      this.modifiedNodes.add(node);
      const baseScale = node.userData._baseScale || new THREE.Vector3(1, 1, 1);
      const baseRot = node.userData._baseRotation || new THREE.Euler();

      if (isVentricle) {
        node.scale.set(baseScale.x * ventScale, baseScale.y * (1.0 - (1.0 - ventScale) * 0.5), baseScale.z * ventScale);
        node.rotation.y = baseRot.y + ventTwist;
      } else if (isAtrium) {
        node.scale.set(baseScale.x * atrialScale, baseScale.y * atrialScale, baseScale.z * atrialScale);
      } else if (isAorta) {
        node.scale.set(baseScale.x * aortaDilation, baseScale.y, baseScale.z * aortaDilation);
      } else {
        // Generalized myocardium pulsating
        node.scale.set(baseScale.x * ventScale, baseScale.y * ventScale, baseScale.z * ventScale);
      }
    });
  }

  // --- 2. RESPIRATORY MECHANICS ANIMATION ---
  animateRespiratory(p) {
    const registry = getMeshRegistry();

    // Respiratory curve:
    // Inhalation: p = 0 -> 0.45 (Active expansion)
    // Exhalation: p = 0.45 -> 1.0 (Passive relaxation)
    let expansion;
    if (p < 0.45) {
      const t = p / 0.45;
      expansion = 0.5 - Math.cos(t * Math.PI) / 2; // Smooth 0 -> 1
    } else {
      const t = (p - 0.45) / 0.55;
      expansion = 0.5 + Math.cos(t * Math.PI) / 2; // Smooth 1 -> 0
    }

    registry.forEach((node, partId) => {
      const lower = partId.toLowerCase();
      const isLung = lower.includes('lung') || lower.includes('pulmo') || lower.includes('bronch');
      const isRib = lower.includes('rib') || lower.includes('costa') || lower.includes('cartilage');
      const isSternum = lower.includes('sternum') || lower.includes('xiphoid') || lower.includes('manubrium');
      const isDiaphragm = lower.includes('diaphragm');

      if (!isLung && !isRib && !isSternum && !isDiaphragm) return;

      this.modifiedNodes.add(node);
      const basePos = node.userData._basePosition || node.position.clone();
      const baseScale = node.userData._baseScale || new THREE.Vector3(1, 1, 1);

      if (isLung) {
        // Lungs expand multidirectionally
        node.scale.set(
          baseScale.x * (1.0 + 0.16 * expansion),
          baseScale.y * (1.0 + 0.09 * expansion),
          baseScale.z * (1.0 + 0.18 * expansion)
        );
      } else if (isSternum) {
        // Pump-handle motion: Sternum moves anteriorly and slightly superiorly
        node.position.set(
          basePos.x,
          basePos.y + 0.014 * expansion,
          basePos.z + 0.022 * expansion
        );
      } else if (isRib) {
        // Bucket-handle motion: Ribs elevate and expand laterally
        const isLeft = lower.endsWith('.l') || lower.includes('left');
        const lateralDir = isLeft ? -1 : 1;
        node.position.set(
          basePos.x + lateralDir * 0.018 * expansion,
          basePos.y + 0.012 * expansion,
          basePos.z + 0.015 * expansion
        );
      } else if (isDiaphragm) {
        // Diaphragm descends during inhalation
        node.position.set(basePos.x, basePos.y - 0.025 * expansion, basePos.z);
      }
    });
  }

  // --- 3. ELBOW FLEXION & EXTENSION ANIMATION ---
  animateElbow(p) {
    const registry = getMeshRegistry();

    // Cycle: 0 -> 0.5 (Flexion 0° -> 135°), 0.5 -> 1.0 (Extension 135° -> 0°)
    let flexFactor;
    if (p < 0.5) {
      const t = p / 0.5;
      flexFactor = 0.5 - Math.cos(t * Math.PI) / 2;
    } else {
      const t = (p - 0.5) / 0.5;
      flexFactor = 0.5 + Math.cos(t * Math.PI) / 2;
    }

    const maxAngleRad = 135 * (Math.PI / 180); // ~2.35 rad
    const currentAngle = maxAngleRad * flexFactor;

    // Approximate elbow joint pivot for right arm (Humeroradial / Humeroulnar joint)
    const elbowPivot = new THREE.Vector3(0.28, 1.02, -0.02);

    registry.forEach((node, partId) => {
      const lower = partId.toLowerCase();
      const isRightForearm = (lower.includes('radius.r') || lower.includes('ulna.r') || lower.includes('carpal.r') || lower.includes('metacarpal.r') || lower.includes('phalanx') && lower.includes('.r') || lower.includes('hand.r'));
      const isBiceps = lower.includes('biceps') && lower.includes('brachii') && lower.includes('.r');
      const isTriceps = lower.includes('triceps') && lower.includes('brachii') && lower.includes('.r');

      if (!isRightForearm && !isBiceps && !isTriceps) return;

      this.modifiedNodes.add(node);
      const basePos = node.userData._basePosition || node.position.clone();
      const baseRot = node.userData._baseRotation || node.rotation.clone();
      const baseScale = node.userData._baseScale || new THREE.Vector3(1, 1, 1);

      if (isRightForearm) {
        // Rotate forearm forward and up around transverse X axis
        const offset = basePos.clone().sub(elbowPivot);
        const rotMatrix = new THREE.Matrix4().makeRotationX(currentAngle);
        offset.applyMatrix4(rotMatrix);
        node.position.copy(elbowPivot).add(offset);
        node.rotation.x = baseRot.x + currentAngle;
      } else if (isBiceps) {
        // Concentric contraction: belly bulges outward (scale X,Z) and shortens along Y
        const bulge = 1.0 + 0.32 * flexFactor;
        const shorten = 1.0 - 0.20 * flexFactor;
        node.scale.set(baseScale.x * bulge, baseScale.y * shorten, baseScale.z * bulge);
        node.position.set(basePos.x, basePos.y + 0.015 * flexFactor, basePos.z + 0.012 * flexFactor);
      } else if (isTriceps) {
        // Antagonist stretch: lengthens and flattens
        const flatten = 1.0 - 0.12 * flexFactor;
        const lengthen = 1.0 + 0.15 * flexFactor;
        node.scale.set(baseScale.x * flatten, baseScale.y * lengthen, baseScale.z * flatten);
      }
    });
  }

  // --- 4. KNEE FLEXION & EXTENSION ANIMATION ---
  animateKnee(p) {
    const registry = getMeshRegistry();

    // 0 -> 0.5 (Flexion 0° -> 120° backwards), 0.5 -> 1.0 (Extension 120° -> 0°)
    let flexFactor;
    if (p < 0.5) {
      const t = p / 0.5;
      flexFactor = 0.5 - Math.cos(t * Math.PI) / 2;
    } else {
      const t = (p - 0.5) / 0.5;
      flexFactor = 0.5 + Math.cos(t * Math.PI) / 2;
    }

    const maxAngleRad = 120 * (Math.PI / 180);
    const currentAngle = -maxAngleRad * flexFactor; // Backwards flexion

    // Knee pivot right leg
    const kneePivot = new THREE.Vector3(0.12, 0.48, -0.01);

    registry.forEach((node, partId) => {
      const lower = partId.toLowerCase();
      const isRightShank = (lower.includes('tibia.r') || lower.includes('fibula.r') || lower.includes('talus.r') || lower.includes('calcaneus.r') || lower.includes('foot.r') || lower.includes('metatarsal') && lower.includes('.r'));
      const isPatella = lower.includes('patella.r');
      const isQuad = (lower.includes('rectus femoris.r') || lower.includes('vastus') && lower.includes('.r') || lower.includes('quadriceps.r'));

      if (!isRightShank && !isPatella && !isQuad) return;

      this.modifiedNodes.add(node);
      const basePos = node.userData._basePosition || node.position.clone();
      const baseRot = node.userData._baseRotation || node.rotation.clone();
      const baseScale = node.userData._baseScale || new THREE.Vector3(1, 1, 1);

      if (isRightShank) {
        const offset = basePos.clone().sub(kneePivot);
        const rotMatrix = new THREE.Matrix4().makeRotationX(currentAngle);
        offset.applyMatrix4(rotMatrix);
        node.position.copy(kneePivot).add(offset);
        node.rotation.x = baseRot.x + currentAngle;
      } else if (isPatella) {
        // Patellar tracking: glides downwards and posteriorly along the femoral condyles
        node.position.set(
          basePos.x,
          basePos.y - 0.042 * flexFactor,
          basePos.z - 0.024 * flexFactor
        );
      } else if (isQuad) {
        // Quadriceps stretches during flexion
        node.scale.set(baseScale.x * (1 - 0.08 * flexFactor), baseScale.y * (1 + 0.12 * flexFactor), baseScale.z * (1 - 0.08 * flexFactor));
      }
    });
  }

  // --- 5. SPINE FLEXION & EXTENSION ANIMATION ---
  animateSpine(p) {
    const registry = getMeshRegistry();

    // 0 -> 0.5 (Flexion 35° forward), 0.5 -> 1.0 (Extension 15° backward)
    let flexAngleRad;
    if (p < 0.5) {
      const t = p / 0.5;
      flexAngleRad = 0.61 * Math.sin(t * Math.PI); // Forward flex ~35°
    } else {
      const t = (p - 0.5) / 0.5;
      flexAngleRad = -0.26 * Math.sin(t * Math.PI); // Backward extend ~15°
    }

    registry.forEach((node, partId) => {
      const lower = partId.toLowerCase();
      if (!lower.includes('vertebra') && !lower.includes('sacrum') && !lower.includes('spine')) return;

      this.modifiedNodes.add(node);
      const basePos = node.userData._basePosition || node.position.clone();
      const baseRot = node.userData._baseRotation || node.rotation.clone();

      // Cumulative bend based on vertical height
      const heightFactor = Math.max(0, (basePos.y - 0.9) / 0.6); // 0 at sacrum, 1 at cervical
      const nodeAngle = flexAngleRad * heightFactor;

      node.rotation.x = baseRot.x + nodeAngle;
      node.position.set(
        basePos.x,
        basePos.y - 0.025 * Math.abs(flexAngleRad) * heightFactor,
        basePos.z + 0.045 * flexAngleRad * heightFactor
      );
    });
  }

  // --- 6. HIP ABDUCTION ANIMATION ---
  animateHip(p) {
    const registry = getMeshRegistry();

    // 0 -> 0.5 (Abduction 40° outward), 0.5 -> 1.0 (Adduction 40° -> 0°)
    let abductFactor;
    if (p < 0.5) {
      const t = p / 0.5;
      abductFactor = 0.5 - Math.cos(t * Math.PI) / 2;
    } else {
      const t = (p - 0.5) / 0.5;
      abductFactor = 0.5 + Math.cos(t * Math.PI) / 2;
    }

    const maxAbductRad = 40 * (Math.PI / 180);
    const angle = maxAbductRad * abductFactor;
    const hipPivot = new THREE.Vector3(0.14, 0.88, 0.0);

    registry.forEach((node, partId) => {
      const lower = partId.toLowerCase();
      const isRightLowerLimb = (lower.includes('femur.r') || lower.includes('tibia.r') || lower.includes('fibula.r') || lower.includes('patella.r') || lower.includes('foot.r') || lower.includes('calcaneus.r'));
      const isGluteus = lower.includes('gluteus') && lower.includes('.r');

      if (!isRightLowerLimb && !isGluteus) return;

      this.modifiedNodes.add(node);
      const basePos = node.userData._basePosition || node.position.clone();
      const baseRot = node.userData._baseRotation || node.rotation.clone();
      const baseScale = node.userData._baseScale || new THREE.Vector3(1, 1, 1);

      if (isRightLowerLimb) {
        // Rotate outward around anterior-posterior Z axis (Coronal plane)
        const offset = basePos.clone().sub(hipPivot);
        const rotMatrix = new THREE.Matrix4().makeRotationZ(angle);
        offset.applyMatrix4(rotMatrix);
        node.position.copy(hipPivot).add(offset);
        node.rotation.z = baseRot.z + angle;
      } else if (isGluteus) {
        // Gluteus medius contracts
        node.scale.set(baseScale.x * (1 + 0.25 * abductFactor), baseScale.y * (1 - 0.15 * abductFactor), baseScale.z * (1 + 0.25 * abductFactor));
      }
    });
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
      } else if (partId === 'forearm_bones') {
        match = lower.includes('radius.r') || lower.includes('ulna.r');
      } else if (partId === 'biceps') {
        match = lower.includes('biceps') && lower.includes('.r');
      } else if (partId === 'triceps') {
        match = lower.includes('triceps') && lower.includes('.r');
      } else if (partId === 'humerus') {
        match = lower.includes('humerus.r');
      } else if (partId === 'patella') {
        match = lower.includes('patella.r');
      } else if (partId === 'shank_bones') {
        match = lower.includes('tibia.r') || lower.includes('fibula.r');
      } else if (partId === 'quadriceps') {
        match = lower.includes('rectus femoris.r') || lower.includes('vastus') && lower.includes('.r');
      } else if (partId === 'femur') {
        match = lower.includes('femur.r');
      } else if (partId === 'lumbar') {
        match = lower.includes('lumbar');
      } else if (partId === 'thoracic') {
        match = lower.includes('thoracic');
      } else if (partId === 'cervical') {
        match = lower.includes('cervical') || lower.includes('atlas') || lower.includes('axis');
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

  // Resets all transformed nodes back to initial resting anatomical pose
  resetPose() {
    this.modifiedNodes.forEach(node => {
      if (node.userData._basePosition) {
        node.position.copy(node.userData._basePosition);
      }
      if (node.userData._baseRotation) {
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
    this.restoreAllVisibility();
    this.currentMotion = null;
    this.listeners.clear();
  }
}

export const dynamicAnatomy = new DynamicAnatomyEngine();
