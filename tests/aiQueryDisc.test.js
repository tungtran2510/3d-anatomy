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
