import { describe, it, expect } from 'vitest';
import { interpretAIQuery } from '../src/ai/anatomyAI.js';
import {
  PATHOLOGY_PROFILES,
  matchPathologyProfile,
  updatePathologyStageVisuals,
  startPathologyPulse,
  stopPathologyPulse
} from '../src/viewer/visibility.js';
import { PATIENT_CASES } from '../src/ui/patientConsultationModal.js';
import { ANATOMY_CONCEPTS } from '../src/data/anatomyConcepts.js';

describe('Step 3: High-Yield Clinical Pathologies (Bệnh Lý Lâm Sàng Thực Tế)', () => {
  it('covers all 15 target clinical pathology profiles with required systems and emissive colors', () => {
    const requiredKeys = [
      'disc_herniation',
      'spinal_spondylosis',
      'knee_acl',
      'knee_meniscus_tear',
      'knee_effusion',
      'rotator_cuff_tear',
      'frozen_shoulder',
      'sciatica_nerve',
      'carpal_tunnel',
      'coronary_artery_disease',
      'acute_appendicitis',
      'gastric_ulcer',
      'gerd_reflux',
      'kidney_stones',
      'patellar_tendinitis'
    ];

    requiredKeys.forEach(key => {
      const profile = PATHOLOGY_PROFILES[key];
      expect(profile, `Missing pathology profile: ${key}`).toBeDefined();
      expect(profile.title).toBeTruthy();
      expect(profile.category).toBeTruthy();
      expect(profile.partId).toBeTruthy();
      expect(profile.requiredSystems.length).toBeGreaterThan(0);
      expect(profile.emissiveColor).toBeDefined();
      expect(profile.speech15s).toBeTruthy();
      expect(profile.keywords.length).toBeGreaterThan(0);
    });
  });

  it('correctly matches clinical query variations to pathology profiles', () => {
    // 1. Cột sống & Đĩa đệm
    expect(matchPathologyProfile('thoát vị đĩa đệm')?.id).toBe('disc_herniation');
    expect(matchPathologyProfile('thoát vị l4 l5')?.id).toBe('disc_herniation');
    expect(matchPathologyProfile('thoát vị l5 s1')?.id).toBe('disc_herniation');
    expect(matchPathologyProfile('gai cột sống')?.id).toBe('spinal_spondylosis');
    expect(matchPathologyProfile('thoái hóa cột sống')?.id).toBe('spinal_spondylosis');

    // 2. Khớp gối & Vận động
    expect(matchPathologyProfile('đứt dây chằng chéo trước')?.id).toBe('knee_acl');
    expect(matchPathologyProfile('đứt acl')?.id).toBe('knee_acl');
    expect(matchPathologyProfile('rách sụn chêm')?.id).toBe('knee_meniscus_tear');
    expect(matchPathologyProfile('tràn dịch khớp gối')?.id).toBe('knee_effusion');
    expect(matchPathologyProfile('tràn dịch gối')?.id).toBe('knee_effusion');

    // 3. Khớp vai
    expect(matchPathologyProfile('rách chóp xoay')?.id).toBe('rotator_cuff_tear');
    expect(matchPathologyProfile('chóp xoay vai')?.id).toBe('rotator_cuff_tear');
    expect(matchPathologyProfile('viêm quanh khớp vai')?.id).toBe('frozen_shoulder');
    expect(matchPathologyProfile('đông cứng vai')?.id).toBe('frozen_shoulder');

    // 4. Thần kinh
    expect(matchPathologyProfile('chèn ép thần kinh tọa')?.id).toBe('sciatica_nerve');
    expect(matchPathologyProfile('đau thần kinh tọa')?.id).toBe('sciatica_nerve');
    expect(matchPathologyProfile('hội chứng ống cổ tay')?.id).toBe('carpal_tunnel');

    // 5. Tim mạch & Tiêu hóa
    expect(matchPathologyProfile('hẹp động mạch vành')?.id).toBe('coronary_artery_disease');
    expect(matchPathologyProfile('nhồi máu cơ tim')?.id).toBe('coronary_artery_disease');
    expect(matchPathologyProfile('viêm ruột thừa')?.id).toBe('acute_appendicitis');
    expect(matchPathologyProfile('viêm ruột thừa cấp')?.id).toBe('acute_appendicitis');
    expect(matchPathologyProfile('viêm loét dạ dày')?.id).toBe('gastric_ulcer');
    expect(matchPathologyProfile('trào ngược dạ dày')?.id).toBe('gerd_reflux');
    expect(matchPathologyProfile('sỏi thận')?.id).toBe('kidney_stones');
    expect(matchPathologyProfile('viêm gân bánh chè')?.id).toBe('patellar_tendinitis');
  });

  it('routes clinical pathology natural queries to CLINICAL_PATHOLOGY intent via interpretAIQuery', () => {
    const testCases = [
      { q: 'thoát vị đĩa đệm l4 l5', expectedId: 'disc_herniation' },
      { q: 'bác sĩ ơi tôi bị rách chóp xoay', expectedId: 'rotator_cuff_tear' },
      { q: 'đứt dây chằng chéo trước', expectedId: 'knee_acl' },
      { q: 'tại sao lại bị tràn dịch khớp gối', expectedId: 'knee_effusion' },
      { q: 'rách sụn chêm', expectedId: 'knee_meniscus_tear' },
      { q: 'đau thần kinh tọa', expectedId: 'sciatica_nerve' },
      { q: 'hội chứng ống cổ tay', expectedId: 'carpal_tunnel' },
      { q: 'viêm ruột thừa cấp', expectedId: 'acute_appendicitis' },
      { q: 'hẹp động mạch vành', expectedId: 'coronary_artery_disease' },
      { q: 'gai cột sống thoái hóa', expectedId: 'spinal_spondylosis' },
      { q: 'trào ngược dạ dày thực quản', expectedId: 'gerd_reflux' },
      { q: 'cơn đau quặn thận do sỏi thận', expectedId: 'kidney_stones' },
      { q: 'viêm gân bánh chè gối', expectedId: 'patellar_tendinitis' }
    ];

    testCases.forEach(({ q, expectedId }) => {
      const result = interpretAIQuery(q);
      expect(result.intent, `Query "${q}" should have intent CLINICAL_PATHOLOGY`).toBe('CLINICAL_PATHOLOGY');
      expect(result.pathologyId, `Query "${q}" should match ${expectedId}`).toBe(expectedId);
    });
  });

  it('preserves non-pathology structure focus for pure anatomical search terms', () => {
    // Normal anatomical part search without disease modifiers must focus the structure directly
    const qDeltoid = interpretAIQuery('cơ delta');
    expect(qDeltoid.intent).toBe('FOCUS_STRUCTURE');
    expect(qDeltoid.target.id).toBe('Acromial part of deltoid muscle.l');

    const qAppendix = interpretAIQuery('ruột thừa');
    expect(qAppendix.intent).toBe('FOCUS_STRUCTURE');
    expect(qAppendix.target.id).toBe('Vermiform appendix');

    const qSciatic = interpretAIQuery('thần kinh tọa');
    expect(qSciatic.intent).toBe('FOCUS_STRUCTURE');
    expect(qSciatic.target.id).toBe('Sciatic nerve.l');

    const qAcl = interpretAIQuery('dây chằng chéo trước');
    expect(qAcl.intent).toBe('FOCUS_STRUCTURE');
    expect(qAcl.target.id).toBe('Anterior cruciate ligament.l');
  });

  it('ensures each PATIENT_CASES entry has 4 progression stages, doctor explanation, and clinical advice', () => {
    expect(PATIENT_CASES.length).toBeGreaterThanOrEqual(12);

    PATIENT_CASES.forEach(c => {
      expect(c.id).toBeTruthy();
      expect(c.title).toBeTruthy();
      expect(c.partId).toBeTruthy();
      expect(c.patientQuestion).toBeTruthy();
      expect(c.doctorExplanation).toBeTruthy();
      expect(c.advice).toBeTruthy();
      expect(c.stages.length).toBe(4);

      c.stages.forEach((st, idx) => {
        expect(st.name, `Case ${c.id} stage ${idx} missing name`).toMatch(new RegExp(`^Cấp\\s*${idx}:`, 'i'));
        expect(st.desc, `Case ${c.id} stage ${idx} missing desc`).toBeTruthy();
      });
    });
  });

  it('ensures anatomyConcepts has clinical pathology concepts with 4-stage progression simulators', () => {
    const concepts = [
      'concept_rotator_cuff',
      'concept_appendicitis',
      'concept_spinal_spondylosis',
      'concept_knee_joint_ligaments',
      'concept_intervertebral_disc'
    ];

    concepts.forEach(cId => {
      const c = ANATOMY_CONCEPTS.find(item => item.id === cId);
      expect(c, `Missing anatomy concept ${cId}`).toBeDefined();
      expect(c.simulator.stages.length).toBe(4);
      expect(c.slides.length).toBeGreaterThanOrEqual(2);
    });
  });

  it('safely invokes updatePathologyStageVisuals, startPathologyPulse, and stopPathologyPulse without crash', () => {
    expect(typeof updatePathologyStageVisuals).toBe('function');
    expect(typeof startPathologyPulse).toBe('function');
    expect(typeof stopPathologyPulse).toBe('function');

    // Test safe invocation when no meshes or invalid id
    expect(() => updatePathologyStageVisuals(0, 'NonExistentPart')).not.toThrow();
    expect(() => updatePathologyStageVisuals(3, null)).not.toThrow();
    expect(() => stopPathologyPulse()).not.toThrow();
    expect(() => startPathologyPulse([], 0xef4444, 1.0)).not.toThrow();
  });
});
