import { describe, it, expect, beforeEach } from 'vitest';
import { interpretAIQuery, executeAICommand, matchKeywordInText } from '../src/ai/anatomyAI.js';
import { normalise, searchStructures } from '../src/utils/dataLoader.js';
import { state } from '../src/state/store.js';
import { getVietnameseName, getVietnameseSynonyms } from '../src/data/vietnamese.js';

describe('Muscle Search & AI Query Tests (Cơ Thang, Cơ Dọc Sống Lưng, Các Loại Cơ)', () => {
  beforeEach(() => {
    state.loadedSystems = ['muscular'];
    const parts = [
      'Descending part of trapezius muscle',
      'Transverse part of trapezius muscle',
      'Ascending part of trapezius muscle',
      'Longissimus thoracis muscle',
      'Iliocostalis lumborum muscle',
      'Spinalis thoracis muscle'
    ];
    state.searchIndex = parts.map(base => {
      const label = getVietnameseName(base);
      const synonyms = getVietnameseSynonyms(base, label);
      return {
        key: `${base}|muscular`,
        base,
        label,
        system: 'muscular',
        sides: { left: `${base}.l`, right: `${base}.r` },
        partIds: [`${base}.l`, `${base}.r`],
        italian: [],
        terms: [normalise(base), normalise(label), ...synonyms.map(normalise)]
      };
    });
  });

  it('correctly matches keyword boundaries and prevents "cơ thang" from colliding with "than" or "thận"', () => {
    expect(matchKeywordInText('cơ thang', 'than')).toBe(false);
    expect(matchKeywordInText('cơ thang', 'thận')).toBe(false);
    expect(matchKeywordInText('trục tim thận', 'thận')).toBe(true);
    expect(matchKeywordInText('tim than', 'than')).toBe(true);
  });

  it('correctly maps "cơ thang" and variations to Trapezius muscle and never to renal axis', () => {
    const trapeziusQueries = [
      'cơ thang',
      'co thang',
      'cơ hình thang',
      'co hinh thang',
      'cơ cổ vai gáy',
      'cơ vai gáy',
      'tìm cơ thang',
      'cho xem cơ thang',
      'trapezius'
    ];

    for (const q of trapeziusQueries) {
      const res = interpretAIQuery(q);
      expect(res.intent).toBe('FOCUS_STRUCTURE');
      expect(res.target).toBeTruthy();
      expect(res.target.base).toContain('trapezius');
      expect(res.target.system).toBe('muscular');
      expect(res.target.nameVi).toContain('thang');
      expect(res.intent).not.toBe('CLINICAL_AXIS');
    }
  });

  it('correctly maps "cơ dọc sống lưng" and back muscle variations to Erector spinae / Longissimus', () => {
    const backQueries = [
      'cơ dọc sống lưng',
      'co doc song lung',
      'cơ dựng gai',
      'co dung gai',
      'cơ dựng sống',
      'co dung song',
      'cơ sống lưng',
      'co song lung',
      'cơ cạnh sống',
      'co canh song',
      'cơ lưng sâu',
      'cơ cực dài',
      'erector spinae',
      'paraspinal',
      'tìm cơ dọc sống lưng'
    ];

    for (const q of backQueries) {
      const res = interpretAIQuery(q);
      expect(res.intent).toBe('FOCUS_STRUCTURE');
      expect(res.target).toBeTruthy();
      expect(res.target.base).toBe('Longissimus thoracis muscle');
      expect(res.target.system).toBe('muscular');
      expect(res.target.nameVi.toLowerCase()).toContain('cơ');
    }
  });

  it('correctly maps "các loại cơ", "các nhóm cơ", "hệ cơ" to MUSCLE_OVERVIEW', () => {
    const overviewQueries = [
      'các loại cơ',
      'cac loai co',
      'các nhóm cơ',
      'cac nhom co',
      'hệ cơ',
      'he co',
      'hệ thống cơ',
      'các loại cơ bắp',
      'có những loại cơ nào',
      'phân loại cơ',
      'nhóm cơ chính',
      'cơ bắp'
    ];

    for (const q of overviewQueries) {
      const res = interpretAIQuery(q);
      expect(res.intent).toBe('MUSCLE_OVERVIEW');
    }
  });

  it('executeAICommand produces rich muscle overview markdown covering 3 muscle types and 5 functional groups', async () => {
    const interpreted = interpretAIQuery('các loại cơ');
    const result = await executeAICommand(interpreted, null);

    expect(result.action).toBe('MUSCLE_OVERVIEW');
    expect(result.actionBadge).toContain('Hệ Cơ');
    expect(result.message).toContain('Cơ Vân');
    expect(result.message).toContain('Cơ Trơn');
    expect(result.message).toContain('Cơ Tim');
    expect(result.message).toContain('Khối Cơ Lưng & Cột Sống');
    expect(result.message).toContain('Cơ thang (Trapezius)');
    expect(result.message).toContain('Cơ dọc sống lưng / Dựng gai');
    expect(result.speechText).toBeTruthy();
  });

  it('correctly handles direct clinical Q&A about muscles (e.g. "cơ thang là gì")', () => {
    const res = interpretAIQuery('cơ thang là gì');
    expect(res.intent).toBe('CLINICAL_QNA');
    expect(res.target).toBeTruthy();
    expect(res.target.base).toContain('trapezius');
  });

  it('searchStructures returns valid matches for "cơ thang" and "cơ dọc sống lưng"', () => {
    const trapeziusMatches = searchStructures('cơ thang');
    expect(trapeziusMatches.length).toBeGreaterThan(0);
    expect(trapeziusMatches.some(m => m.base.toLowerCase().includes('trapezius'))).toBe(true);

    const erectorMatches = searchStructures('cơ dọc sống lưng');
    expect(erectorMatches.length).toBeGreaterThan(0);
    expect(erectorMatches.some(m => m.base.toLowerCase().includes('longissimus') || m.base.toLowerCase().includes('iliocostalis'))).toBe(true);
  });
});
