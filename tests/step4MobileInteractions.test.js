import { describe, it, expect, beforeEach } from 'vitest';
import { state } from '../src/state/store.js';
import {
  isolatePart,
  restoreAllParts,
  getAnatomicalCompanions,
  peelAnteriorObstacles,
  setStructureVisible,
  ghostOthers,
  unghost,
  isGhosted
} from '../src/viewer/visibility.js';
import { getMeshRegistry } from '../src/viewer/loadModel.js';
import { DISSECTION_STAGES } from '../src/ui/depthSlider.js';
import * as THREE from 'three';

describe('Step 4: 1-Touch Mobile Pragmatic Interactions (Thao tác 1-chạm thực dụng)', () => {
  beforeEach(() => {
    // Reset state & mesh registry
    state.isolatedPart = null;
    state.hiddenParts = new Set();
    state.isolatedPrevStates = null;
    state.partStates.clear();

    const registry = getMeshRegistry();
    registry.clear();

    // Mock dummy meshes for test verification
    const dummyGeo = new THREE.BoxGeometry(1, 1, 1);
    const dummyMat = new THREE.MeshBasicMaterial();

    const meshHeart = new THREE.Mesh(dummyGeo, dummyMat.clone());
    meshHeart.userData = { partId: 'Heart' };
    registry.set('Heart', meshHeart);

    const meshAorta = new THREE.Mesh(dummyGeo, dummyMat.clone());
    meshAorta.userData = { partId: 'Ascending aorta' };
    registry.set('Ascending aorta', meshAorta);

    const meshRib = new THREE.Mesh(dummyGeo, dummyMat.clone());
    meshRib.userData = { partId: 'Rib 5.r' };
    registry.set('Rib 5.r', meshRib);

    const meshSternum = new THREE.Mesh(dummyGeo, dummyMat.clone());
    meshSternum.userData = { partId: 'Sternum' };
    registry.set('Sternum', meshSternum);

    const meshL4 = new THREE.Mesh(dummyGeo, dummyMat.clone());
    meshL4.userData = { partId: 'Lumbar vertebra L4' };
    registry.set('Lumbar vertebra L4', meshL4);

    const meshDiscL4L5 = new THREE.Mesh(dummyGeo, dummyMat.clone());
    meshDiscL4L5.userData = { partId: 'Intervertebral disc L4-L5' };
    registry.set('Intervertebral disc L4-L5', meshDiscL4L5);

    const meshPatella = new THREE.Mesh(dummyGeo, dummyMat.clone());
    meshPatella.userData = { partId: 'Patella.r' };
    registry.set('Patella.r', meshPatella);

    const meshPatellarLig = new THREE.Mesh(dummyGeo, dummyMat.clone());
    meshPatellarLig.userData = { partId: 'Patellar ligament.r' };
    registry.set('Patellar ligament.r', meshPatellarLig);

    const meshACL = new THREE.Mesh(dummyGeo, dummyMat.clone());
    meshACL.userData = { partId: 'Anterior cruciate ligament.r' };
    registry.set('Anterior cruciate ligament.r', meshACL);

    const meshGluteusMax = new THREE.Mesh(dummyGeo, dummyMat.clone());
    meshGluteusMax.userData = { partId: 'Gluteus maximus.r' };
    registry.set('Gluteus maximus.r', meshGluteusMax);

    const meshSciatic = new THREE.Mesh(dummyGeo, dummyMat.clone());
    meshSciatic.userData = { partId: 'Sciatic nerve.r' };
    registry.set('Sciatic nerve.r', meshSciatic);

    // Initialize all test meshes as visible
    Array.from(registry.keys()).forEach(id => {
      setStructureVisible(id, true);
    });
  });

  describe('1. Smart Anatomical Companions (getAnatomicalCompanions)', () => {
    it('pulls great vessels alongside Heart for meaningful anatomical context', () => {
      const companions = getAnatomicalCompanions('Heart');
      expect(companions).toContain('Ascending aorta');
      expect(companions).toContain('Aortic arch');
      expect(companions).toContain('Superior vena cava');
      expect(companions).toContain('Pulmonary trunk');
    });

    it('pulls Functional Spinal Unit (adjacent discs and vertebrae) alongside Lumbar vertebra L4', () => {
      const companions = getAnatomicalCompanions('Lumbar vertebra L4');
      expect(companions).toContain('Intervertebral disc L4-L5');
      expect(companions).toContain('Intervertebral disc L3-L4');
      expect(companions).toContain('Lumbar vertebra L3');
      expect(companions).toContain('Lumbar vertebra L5');
    });

    it('pulls full Knee Complex (ligaments, menisci, femur, tibia) alongside Patella or ACL', () => {
      const kneeCompanions = getAnatomicalCompanions('Patella.r');
      expect(kneeCompanions).toContain('Patellar ligament.r');
      expect(kneeCompanions).toContain('Femur.r');
      expect(kneeCompanions).toContain('Tibia.r');
      expect(kneeCompanions).toContain('Medial meniscus.r');
      expect(kneeCompanions).toContain('Anterior cruciate ligament.r');
    });

    it('pulls airway bronchial tree alongside Lung', () => {
      const lungCompanions = getAnatomicalCompanions('Left lung');
      expect(lungCompanions).toContain('Trachea');
      expect(lungCompanions).toContain('Right lung');
    });
  });

  describe('2. 1-Touch Isolate & Restore (Cô lập & Khôi phục)', () => {
    it('isolates Heart while retaining anatomical companion vessels, and restores cleanly', () => {
      // Isolate Heart
      isolatePart('Heart');
      expect(state.isolatedPart).toBe('Heart');

      // Heart and companion Aorta must be visible
      expect(state.partStates.get('Heart')?.visible).toBe(true);
      expect(state.partStates.get('Ascending aorta')?.visible).toBe(true);

      // Unrelated bones like Rib must be hidden
      expect(state.partStates.get('Rib 5.r')?.visible).toBe(false);

      // Restore all parts
      restoreAllParts();
      expect(state.isolatedPart).toBeNull();
      expect(state.partStates.get('Rib 5.r')?.visible).toBe(true);
    });

    it('isolates Lumbar Vertebra L4 retaining FSU (Intervertebral disc L4-L5)', () => {
      isolatePart('Lumbar vertebra L4');
      expect(state.isolatedPart).toBe('Lumbar vertebra L4');

      expect(state.partStates.get('Lumbar vertebra L4')?.visible).toBe(true);
      expect(state.partStates.get('Intervertebral disc L4-L5')?.visible).toBe(true);
      expect(state.partStates.get('Patella.r')?.visible).toBe(false);

      restoreAllParts();
      expect(state.isolatedPart).toBeNull();
      expect(state.partStates.get('Patella.r')?.visible).toBe(true);
    });
  });

  describe('3. Smart Anterior Obstacle Peeling (peelAnteriorObstacles)', () => {
    it('peels thoracic cage obstacles (Ribs, Sternum) when viewing deep thoracic organs', () => {
      // Deep organ Heart
      const peeled = peelAnteriorObstacles('Heart');
      expect(peeled).toBe(true);

      // Rib 5.r and Sternum should be hidden to reveal heart
      expect(state.partStates.get('Rib 5.r')?.visible).toBe(false);
      expect(state.partStates.get('Sternum')?.visible).toBe(false);

      // Heart itself remains visible
      expect(state.partStates.get('Heart')?.visible).toBe(true);
    });

    it('peels anterior patella and patellar ligament to expose ACL & Meniscus', () => {
      const peeled = peelAnteriorObstacles('Anterior cruciate ligament.r');
      expect(peeled).toBe(true);

      expect(state.partStates.get('Patella.r')?.visible).toBe(false);
      expect(state.partStates.get('Patellar ligament.r')?.visible).toBe(false);
      expect(state.partStates.get('Anterior cruciate ligament.r')?.visible).toBe(true);
    });

    it('peels gluteus maximus to expose Sciatic nerve', () => {
      const peeled = peelAnteriorObstacles('Sciatic nerve.r');
      expect(peeled).toBe(true);

      expect(state.partStates.get('Gluteus maximus.r')?.visible).toBe(false);
      expect(state.partStates.get('Sciatic nerve.r')?.visible).toBe(true);
    });
  });

  describe('4. Standardized 4-Tier Mobile Dissection HUD Stages', () => {
    it('defines clear clinical layers from superficial to core skeleton', () => {
      expect(DISSECTION_STAGES.length).toBe(6);

      // Stage 0: Nông (All muscles)
      expect(DISSECTION_STAGES[0].level).toBe(0);
      expect(DISSECTION_STAGES[0].title).toContain('Toàn bộ cấu trúc');

      // Stage 1: Giữa (Peels superficial)
      expect(DISSECTION_STAGES[1].level).toBe(1);
      expect(DISSECTION_STAGES[1].title).toContain('Bóc cơ nông');

      // Stage 3: Sâu (Stripped muscles revealing viscera & neurovascular)
      expect(DISSECTION_STAGES[3].level).toBe(3);
      expect(DISSECTION_STAGES[3].title).toContain('Bóc toàn bộ hệ cơ');

      // Stage 5: Xương (Core skeleton framework)
      expect(DISSECTION_STAGES[5].level).toBe(5);
      expect(DISSECTION_STAGES[5].title).toContain('Khung xương cốt lõi');
    });
  });

  describe('5. Mobile 1-Touch Ghosting / X-Ray (ghostOthers & unghost)', () => {
    it('ghosts surrounding structures while keeping target organ solid', () => {
      ghostOthers('Heart');
      expect(isGhosted()).toBe(true);

      unghost();
      expect(isGhosted()).toBe(false);
    });
  });
});
