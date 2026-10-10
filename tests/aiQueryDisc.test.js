import { describe, it, expect } from 'vitest';
import { interpretAIQuery, cleanSearchQuery } from '../src/ai/anatomyAI.js';

describe('AI Query Interpretation & Target Resolution', () => {
  const activeSternum = {
    id: 'Body of sternum',
    displayName: 'Thân xương ức',
    system: 'skeletal'
  };

  it('correctly cleans Vietnamese query prefixes', () => {
    expect(cleanSearchQuery('tôi hỏi tìm đĩa đệm')).toBe('đĩa đệm');
    expect(cleanSearchQuery('tôi muốn tìm đĩa đệm')).toBe('đĩa đệm');
    expect(cleanSearchQuery('tìm giúp tôi đĩa đệm')).toBe('đĩa đệm');
    expect(cleanSearchQuery('cho tôi hỏi đĩa đệm')).toBe('đĩa đệm');
    expect(cleanSearchQuery('đĩa đệm nằm ở đâu')).toBe('đĩa đệm');
    expect(cleanSearchQuery('đĩa đệm là gì')).toBe('đĩa đệm');
    expect(cleanSearchQuery('ở đâu có đĩa đệm')).toBe('đĩa đệm');
    expect(cleanSearchQuery('cho tôi xem xương cánh tay')).toBe('xương cánh tay');
    expect(cleanSearchQuery('chỉ chỗ dây chằng chéo trước')).toBe('dây chằng chéo trước');
    expect(cleanSearchQuery('cấu trúc xương đùi')).toBe('xương đùi');
  });

  it('routes "tìm đĩa đệm" to FOCUS_STRUCTURE with Intervertebral disc L4-L5', () => {
    const res = interpretAIQuery('tìm đĩa đệm', activeSternum);
    expect(res.intent).toBe('FOCUS_STRUCTURE');
    expect(res.target.id).toBe('Intervertebral disc L4-L5');
    expect(res.target.system).toBe('joints');
  });

  it('routes "tôi hỏi tìm đĩa đệm" to FOCUS_STRUCTURE with Intervertebral disc L4-L5 even when on sternum', () => {
    const res = interpretAIQuery('tôi hỏi tìm đĩa đệm', activeSternum);
    expect(res.intent).toBe('FOCUS_STRUCTURE');
    expect(res.target.id).toBe('Intervertebral disc L4-L5');
    expect(res.target.system).toBe('joints');
  });

  it('routes "thoát vị đĩa đệm" to disc structure', () => {
    const res = interpretAIQuery('thoát vị đĩa đệm', activeSternum);
    expect(res.target.id).toBe('Intervertebral disc L4-L5');
  });

  it('routes "tìm dây chằng chéo" and "acl" to ACL ligament', () => {
    const res1 = interpretAIQuery('tìm dây chằng chéo', activeSternum);
    expect(res1.target.id).toBe('Anterior cruciate ligament.l');
    expect(res1.target.system).toBe('joints');

    const res2 = interpretAIQuery('cho tôi xem acl', activeSternum);
    expect(res2.target.id).toBe('Anterior cruciate ligament.l');
  });

  it('routes "xương cánh tay ở đâu" to humerus', () => {
    const res = interpretAIQuery('xương cánh tay ở đâu', activeSternum);
    expect(res.target.id).toBe('Humerus.l');
    expect(res.target.system).toBe('skeletal');
  });

  it('does NOT hijack target with activePart when asking an unrelated question without reference', () => {
    const res = interpretAIQuery('thời tiết hôm nay thế nào', activeSternum);
    expect(res.intent).toBe('ASSISTANT_REPLY');
    expect(res.target).toBeNull();
  });

  it('resolves to activePart ONLY when referential pronouns like "nó" or "xương này" are used', () => {
    const res = interpretAIQuery('xương này có chức năng gì', activeSternum);
    expect(res.intent).toBe('CLINICAL_QNA');
    expect(res.target.id).toBe('Body of sternum');
  });

  it('switches target away from activePart to newly asked bone (e.g. xương đùi)', () => {
    const res = interpretAIQuery('tìm xương đùi', activeSternum);
    expect(res.intent).toBe('FOCUS_STRUCTURE');
    expect(res.target.id).toBe('Femur.l');
  });

  it('routes "tìm thần kinh tọa" to Sciatic nerve in nervous system', () => {
    const res = interpretAIQuery('tìm thần kinh tọa', activeSternum);
    expect(res.intent).toBe('FOCUS_STRUCTURE');
    expect(res.target.id).toBe('Sciatic nerve.l');
    expect(res.target.system).toBe('nervous');
  });

  it('routes "ruột thừa ở đâu" to Vermiform appendix in visceral system', () => {
    const res = interpretAIQuery('ruột thừa ở đâu', activeSternum);
    expect(res.intent).toBe('FOCUS_STRUCTURE');
    expect(res.target.id).toBe('Vermiform appendix');
    expect(res.target.system).toBe('visceral');
  });

  it('routes "cho xem cơ delta" to deltoid muscle in muscular system', () => {
    const res = interpretAIQuery('cho xem cơ delta', activeSternum);
    expect(res.intent).toBe('FOCUS_STRUCTURE');
    expect(res.target.id).toBe('Acromial part of deltoid muscle.l');
    expect(res.target.system).toBe('muscular');
  });
});
