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
});
