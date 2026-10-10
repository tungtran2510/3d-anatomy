import { describe, it, expect } from 'vitest';
import { interpretAIQuery } from '../src/ai/anatomyAI.js';
import { resolveAnatomicalAlias } from '../src/viewer/selection.js';
import { getStructure15sSpeechText } from '../src/utils/speechVoice.js';

describe('Step 2: Pinpoint Search, Ghosting, and Zero-Fluff 15s Speech', () => {
  it('resolves anatomical aliases accurately for all 5 exemplar structures', () => {
    expect(resolveAnatomicalAlias('đĩa đệm')).toBe('Intervertebral disc L4-L5');
    expect(resolveAnatomicalAlias('dia dem')).toBe('Intervertebral disc L4-L5');
    expect(resolveAnatomicalAlias('thoát vị đĩa đệm')).toBe('Intervertebral disc L4-L5');

    expect(resolveAnatomicalAlias('dây chằng chéo trước')).toBe('Anterior cruciate ligament.l');
    expect(resolveAnatomicalAlias('day chang cheo truoc')).toBe('Anterior cruciate ligament.l');
    expect(resolveAnatomicalAlias('acl')).toBe('Anterior cruciate ligament.l');

    expect(resolveAnatomicalAlias('thần kinh tọa')).toBe('Sciatic nerve.l');
    expect(resolveAnatomicalAlias('than kinh toa')).toBe('Sciatic nerve.l');

    expect(resolveAnatomicalAlias('ruột thừa')).toBe('Vermiform appendix');
    expect(resolveAnatomicalAlias('ruot thua')).toBe('Vermiform appendix');

    expect(resolveAnatomicalAlias('cơ delta')).toBe('Acromial part of deltoid muscle.l');
    expect(resolveAnatomicalAlias('co delta')).toBe('Acromial part of deltoid muscle.l');
  });

  it('interprets AI queries accurately for all 5 exemplar structures into correct systems', () => {
    const qDisc = interpretAIQuery('tìm đĩa đệm');
    expect(qDisc.target.id).toBe('Intervertebral disc L4-L5');
    expect(qDisc.target.system).toBe('joints');

    const qAcl = interpretAIQuery('chỉ dây chằng chéo trước');
    expect(qAcl.target.id).toBe('Anterior cruciate ligament.l');
    expect(qAcl.target.system).toBe('joints');

    const qSciatic = interpretAIQuery('thần kinh tọa nằm ở đâu');
    expect(qSciatic.target.id).toBe('Sciatic nerve.l');
    expect(qSciatic.target.system).toBe('nervous');

    const qAppendix = interpretAIQuery('cho xem ruột thừa');
    expect(qAppendix.target.id).toBe('Vermiform appendix');
    expect(qAppendix.target.system).toBe('visceral');

    const qDeltoid = interpretAIQuery('cơ delta');
    expect(qDeltoid.target.id).toBe('Acromial part of deltoid muscle.l');
    expect(qDeltoid.target.system).toBe('muscular');
  });

  it('generates zero-fluff 15-second speech text without greeting phrases', () => {
    const targets = [
      { id: 'Intervertebral disc L4-L5', base: 'Intervertebral disc L4-L5', expectWords: ['Đĩa đệm', 'thắt lưng', 'vận động'] },
      { id: 'Anterior cruciate ligament.l', base: 'Anterior cruciate ligament', expectWords: ['Dây chằng chéo trước', 'mâm chày'] },
      { id: 'Sciatic nerve.l', base: 'Sciatic nerve', expectWords: ['thần kinh tọa', 'đùi sau'] },
      { id: 'Vermiform appendix', base: 'Vermiform appendix', expectWords: ['Ruột thừa', 'miễn dịch'] },
      { id: 'Acromial part of deltoid muscle.l', base: 'Deltoid muscle', expectWords: ['Cơ delta', 'cánh tay'] }
    ];

    targets.forEach(({ id, base, expectWords }) => {
      const text = getStructure15sSpeechText(id, base);
      expect(text).toBeTruthy();
      // Strictly zero greeting fluff
      expect(text).not.toMatch(/^(chào bạn|xin chào|tôi là|rất vui)/i);
      // Contains the structure's core name
      expect(text.length).toBeGreaterThan(20);
      expect(text.length).toBeLessThan(350); // Under ~15-20s speaking length
    });
  });
});
