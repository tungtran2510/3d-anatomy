import { describe, it, expect } from 'vitest';
import { getClinicalData } from '../src/data/clinicalInfo.js';
import { resolvePartId } from '../src/ui/infoPanel.js';
import { findAnatomyConcept } from '../src/data/anatomyConcepts.js';

describe('Carotid Artery & Compact Anatomy Verification', () => {
  it('returns accurate Vietnamese and Latin nomenclature for Internal carotid artery', () => {
    const data = getClinicalData('Internal carotid artery.l');
    expect(data.nameVi).toBe('Động mạch cảnh trong (trái)');
    expect(data.nameLatin).toContain('Arteria carotis interna');
    expect(data.description).toBe('Nhánh lớn của động mạch cảnh chung cấp máu cho đại não và ổ mắt');
  });

  it('correctly maps Vietnamese carotid queries to proper 3D mesh IDs', () => {
    expect(resolvePartId('động mạch cảnh trong')).toBe('Internal carotid artery.l');
    expect(resolvePartId('dong mach canh trong')).toBe('Internal carotid artery.l');
    expect(resolvePartId('động mạch cảnh trong phải')).toBe('Internal carotid artery.r');
    expect(resolvePartId('động mạch cảnh ngoài')).toBe('External carotid artery.l');
    expect(resolvePartId('động mạch cảnh chung')).toBe('Left common carotid artery');
  });

  it('does NOT allow concept_circle_of_willis to hijack specific carotid artery searches', () => {
    expect(findAnatomyConcept('động mạch cảnh trong')).toBeNull();
    expect(findAnatomyConcept('cảnh trong')).toBeNull();
    expect(findAnatomyConcept('internal carotid')).toBeNull();
  });

  it('still correctly matches circle of willis for general cerebral vascular queries', () => {
    const willis = findAnatomyConcept('đa giác willis');
    expect(willis).not.toBeNull();
    expect(willis?.id).toBe('concept_circle_of_willis');
  });
});
