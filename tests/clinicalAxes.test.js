import { describe, it, expect } from 'vitest';
import { interpretAIQuery, executeAICommand } from '../src/ai/anatomyAI.js';
import { CLINICAL_AXES } from '../src/data/clinicalAxesData.js';

describe('Clinical Axes & AI Mechanism Query Tests', () => {
  it('includes all 8 essential clinical axes', () => {
    const axisIds = CLINICAL_AXES.map(a => a.id);
    expect(axisIds).toContain('axis_gut_brain');
    expect(axisIds).toContain('axis_hepatobiliary_pancreas');
    expect(axisIds).toContain('axis_digestive_glands');
    expect(axisIds).toContain('axis_csf_ventricles');
    expect(axisIds).toContain('axis_cranial_nerves');
    expect(axisIds).toContain('axis_brain_spine_sciatic');
    expect(axisIds).toContain('axis_cardiopulmonary_loop');
    expect(axisIds).toContain('axis_postural_kinetic_chain');
  });

  it('correctly maps "gan mật tụy" and "bộ ba chức năng" to axis_hepatobiliary_pancreas', () => {
    const queries = [
      'gan mật tụy',
      'bộ ba chức năng',
      'bộ ba gan mật tụy',
      'bộ 3 gan mật tụy',
      'gân mà tự',
      'sỏi mật viêm tụy cấp'
    ];

    for (const q of queries) {
      const res = interpretAIQuery(q);
      expect(res.intent).toBe('CLINICAL_AXIS');
      expect(res.axisId).toBe('axis_hepatobiliary_pancreas');
      expect(res.axis.titleVi).toContain('Hệ Gan – Mật – Tụy');
      expect(res.axis.chainSteps.length).toBeGreaterThanOrEqual(4);
    }
  });

  it('correctly maps "tuyến tiêu hóa" to axis_digestive_glands', () => {
    const queries = [
      'tuyến tiêu hóa',
      'các tuyến tiêu hóa',
      'hệ tuyến tiêu hóa',
      'tất cả tuyến tiêu hóa',
      'tuyến nước bọt'
    ];

    for (const q of queries) {
      const res = interpretAIQuery(q);
      expect(res.intent).toBe('CLINICAL_AXIS');
      expect(res.axisId).toBe('axis_digestive_glands');
      expect(res.axis.titleVi).toContain('Hệ Thống Tuyến Tiêu Hóa');
      expect(res.axis.chainSteps.length).toBe(4);
      // Salivary glands step includes parotid, submandibular, sublingual
      const salivaryStep = res.axis.chainSteps[0];
      expect(salivaryStep.partIds).toContain('Parotid gland.l');
      expect(salivaryStep.partIds).toContain('Submandibular gland.l');
      expect(salivaryStep.partIds).toContain('Sublingual gland.l');
    }
  });

  it('correctly maps "dịch não tủy" and "não thất" to axis_csf_ventricles', () => {
    const queries = [
      'dịch não tủy',
      'tuần hoàn dịch não tủy',
      'hệ thống não thất',
      'não thất',
      'não úng thủy'
    ];

    for (const q of queries) {
      const res = interpretAIQuery(q);
      expect(res.intent).toBe('CLINICAL_AXIS');
      expect(res.axisId).toBe('axis_csf_ventricles');
      expect(res.axis.titleVi).toContain('Vòng Tuần Hoàn Dịch Não Tủy');
      expect(res.axis.chainSteps.length).toBe(4);
      // Lateral ventricles and choroid plexus
      const step1 = res.axis.chainSteps[0];
      expect(step1.partIds).toContain('Lateral ventricle.l');
      expect(step1.partIds).toContain('Choroid plexus.l');
      // Aqueduct of midbrain
      const step3 = res.axis.chainSteps[2];
      expect(step3.partIds).toContain('Aqueduct of midbrain');
    }
  });

  it('correctly handles voice acoustic typos for "trục não ruột" including "chục lão chuột"', () => {
    const queries = [
      'trục não ruột',
      'chục lão chuột',
      'chụp não ruột',
      'chục não ruột',
      'chục não',
      'trục ruột não'
    ];

    for (const q of queries) {
      const res = interpretAIQuery(q);
      expect(res.intent).toBe('CLINICAL_AXIS');
      expect(res.axisId).toBe('axis_gut_brain');
      expect(res.axis.titleVi).toContain('Trục Não – Ruột');
      expect(res.axis.chainSteps.length).toBe(4);
    }
  });

  it('executeAICommand produces rich clinical mechanism markdown and speech', async () => {
    const interpreted = interpretAIQuery('giải thích cơ chế bộ ba gan mật tụy');
    const result = await executeAICommand(interpreted, null);

    expect(result.action).toBe('CLINICAL_AXIS');
    expect(result.axisId).toBe('axis_hepatobiliary_pancreas');
    expect(result.message).toContain('Hệ Gan – Mật – Tụy');
    expect(result.message).toContain('Cơ Chế Lâm Sàng');
    expect(result.message).toContain('Viêm tụy cấp');
    expect(result.speechText).toBeTruthy();
  });
});
