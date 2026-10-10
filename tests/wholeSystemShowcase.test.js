import { describe, it, expect } from 'vitest';
import { SYSTEM_PROFILES, matchSystemProfile } from '../src/data/systemProfiles.js';
import { interpretAIQuery } from '../src/ai/anatomyAI.js';

describe('Whole Organ System Showcase & Intelligent Pinpoint Tests', () => {
  it('covers all major organ systems with academic profiles and key organs', () => {
    const requiredSystems = [
      'digestive',
      'cardiovascular',
      'nervous',
      'respiratory',
      'skeletal',
      'joints',
      'muscular',
      'urinary_genital',
      'endocrine',
      'spine'
    ];

    for (const sysId of requiredSystems) {
      const profile = SYSTEM_PROFILES[sysId];
      expect(profile).toBeDefined();
      expect(profile.nameVi).toBeTruthy();
      expect(profile.nameLatin).toBeTruthy();
      expect(profile.count).toBeGreaterThan(0);
      expect(profile.speech15s).toBeTruthy();
      expect(Array.isArray(profile.keyOrgans)).toBe(true);
      expect(profile.keyOrgans.length).toBeGreaterThan(0);

      // Verify zero greeting fluff in audio
      expect(profile.speech15s).not.toMatch(/chào bạn|tôi là trợ lý|xin chào|kính chào/i);
      expect(profile.speech15s.length).toBeGreaterThan(40);
    }
  });

  it('correctly matches system queries using matchSystemProfile', () => {
    expect(matchSystemProfile('hệ tiêu hóa')?.id).toBe('digestive');
    expect(matchSystemProfile('tiêu hóa')?.id).toBe('digestive');
    expect(matchSystemProfile('ống tiêu hóa')?.id).toBe('digestive');

    expect(matchSystemProfile('hệ tuần hoàn')?.id).toBe('cardiovascular');
    expect(matchSystemProfile('tim mạch')?.id).toBe('cardiovascular');
    expect(matchSystemProfile('tuần hoàn')?.id).toBe('cardiovascular');

    expect(matchSystemProfile('hệ thần kinh')?.id).toBe('nervous');
    expect(matchSystemProfile('thần kinh')?.id).toBe('nervous');

    expect(matchSystemProfile('hệ hô hấp')?.id).toBe('respiratory');
    expect(matchSystemProfile('hô hấp')?.id).toBe('respiratory');

    expect(matchSystemProfile('hệ xương')?.id).toBe('skeletal');
    expect(matchSystemProfile('bộ xương')?.id).toBe('skeletal');

    expect(matchSystemProfile('khớp và dây chằng')?.id).toBe('joints');
    expect(matchSystemProfile('hệ khớp')?.id).toBe('joints');

    expect(matchSystemProfile('cột sống')?.id).toBe('spine');
    expect(matchSystemProfile('trục cột sống')?.id).toBe('spine');

    expect(matchSystemProfile('hệ tiết niệu')?.id).toBe('urinary');
    expect(matchSystemProfile('tiết niệu')?.id).toBe('urinary');

    // Anatomical systems and regional subdivisions
    expect(matchSystemProfile('tủy')?.id).toBe('spinal_cord');
    expect(matchSystemProfile('tủy sống')?.id).toBe('spinal_cord');
    expect(matchSystemProfile('tuỷ sống')?.id).toBe('spinal_cord');
    expect(matchSystemProfile('tủy gai')?.id).toBe('spinal_cord');

    expect(matchSystemProfile('hệ thần kinh trung ương')?.id).toBe('cns');
    expect(matchSystemProfile('thần kinh trung ương')?.id).toBe('cns');

    expect(matchSystemProfile('hệ bạch huyết')?.id).toBe('lymphatic');
    expect(matchSystemProfile('bạch huyết')?.id).toBe('lymphatic');
  });

  it('interprets natural language queries into SHOWCASE_SYSTEM intent', () => {
    const testCases = [
      { q: 'hệ tiêu hóa', expectedSystem: 'digestive' },
      { q: 'xem hệ tuần hoàn', expectedSystem: 'cardiovascular' },
      { q: 'cho xem hệ thần kinh', expectedSystem: 'nervous' },
      { q: 'tìm hệ hô hấp', expectedSystem: 'respiratory' },
      { q: 'hệ xương', expectedSystem: 'skeletal' },
      { q: 'khớp và dây chằng', expectedSystem: 'joints' },
      { q: 'cột sống', expectedSystem: 'spine' },
      { q: 'hệ tiết niệu', expectedSystem: 'urinary' },
      { q: 'tủy sống', expectedSystem: 'spinal_cord' },
      { q: 'tủy', expectedSystem: 'spinal_cord' },
      { q: 'hệ bạch huyết', expectedSystem: 'lymphatic' }
    ];

    for (const tc of testCases) {
      const res = interpretAIQuery(tc.q);
      expect(res.intent).toBe('SHOWCASE_SYSTEM');
      expect(res.systemId).toBe(tc.expectedSystem);
      expect(res.profile.nameVi).toBeTruthy();
    }
  });

  it('preserves single-organ search priority when user targets a specific organ', () => {
    // When user targets a specific sub-structure like "đĩa đệm", it must focus on the disc, not the entire joint system
    const resDisc = interpretAIQuery('tìm đĩa đệm');
    expect(resDisc.intent).toBe('FOCUS_STRUCTURE');
    expect(resDisc.target.id).toContain('Intervertebral disc');

    const resAppendix = interpretAIQuery('ruột thừa');
    expect(resAppendix.intent).toBe('FOCUS_STRUCTURE');
    expect(resAppendix.target.id).toBe('Vermiform appendix');
  });
});
