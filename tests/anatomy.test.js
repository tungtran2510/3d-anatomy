import { describe, it, expect } from 'vitest';
import { splitSide, formatPartName, buildPartsData, SYSTEM_IDS } from '../src/data/anatomy.js';

describe('splitSide', () => {
  it('separates the Z-Anatomy side suffix', () => {
    expect(splitSide('Femur.l')).toEqual({ base: 'Femur', side: 'left' });
    expect(splitSide('Femur.r')).toEqual({ base: 'Femur', side: 'right' });
  });

  it('leaves unpaired structures alone', () => {
    expect(splitSide('Body of sternum')).toEqual({ base: 'Body of sternum', side: null });
  });

  it('does not mistake a trailing letter for a side', () => {
    expect(splitSide('Vertebra L5')).toEqual({ base: 'Vertebra L5', side: null });
  });
});

describe('formatPartName', () => {
  it('localises the side', () => {
    expect(formatPartName('Femur.l', 'en')).toBe('Femur (left)');
    expect(formatPartName('Femur.l', 'it')).toBe('Femur (sinistro)');
  });

  it('strips the parentheses Z-Anatomy uses for non-official terms', () => {
    expect(formatPartName('(Adductor minimus).r', 'en')).toBe('Adductor minimus (right)');
  });

  it('keeps inner parentheses, which are part of the name', () => {
    expect(formatPartName('Atlas (C1)', 'en')).toBe('Atlas (C1)');
    expect(formatPartName('Abducens nerve (VI).l', 'en')).toBe('Abducens nerve (VI) (left)');
  });
});

describe('buildPartsData', () => {
  const systems = {
    skeletal: ['Femur.l', 'Femur.r', 'Body of sternum'],
    muscular: ['(Adductor minimus).l']
  };

  it('indexes every mesh and records its system', () => {
    const parts = buildPartsData(systems);
    expect(Object.keys(parts)).toHaveLength(4);
    expect(parts['Femur.l'].system).toBe('skeletal');
    expect(parts['Femur.l'].baseName).toBe('Femur');
    expect(parts['Femur.l'].side).toBe('left');
  });

  it('shares lexicon entries between the two sides', () => {
    const parts = buildPartsData(systems, { Femur: { la: 'Os femoris' } });
    expect(parts['Femur.l'].latinName).toBe('Os femoris');
    expect(parts['Femur.r'].latinName).toBe('Os femoris');
  });

  it('marks non-official terminology', () => {
    const parts = buildPartsData(systems, { '(Adductor minimus)': { official: false } });
    expect(parts['(Adductor minimus).l'].official).toBe(false);
    expect(parts['Femur.l'].official).toBe(true);
  });

  it('survives an empty lexicon', () => {
    const parts = buildPartsData(systems);
    expect(parts['Femur.l'].latinName).toBe('');
    expect(parts['Femur.l'].official).toBe(true);
  });
});

describe('SYSTEM_IDS', () => {
  it('matches the seven models that are exported', () => {
    expect(SYSTEM_IDS).toEqual([
      'skeletal', 'muscular', 'joints', 'cardiovascular', 'lymphatic', 'nervous', 'visceral'
    ]);
  });

  it('translates ventricular system & CSF structures to Vietnamese accurately', () => {
    expect(formatPartName('Lateral ventricle.l', 'vi')).toBe('Não thất bên (trái)');
    expect(formatPartName('Third ventricle', 'vi')).toBe('Não thất ba');
    expect(formatPartName('Aqueduct of midbrain', 'vi')).toBe('Cống não Sylvius');
    expect(formatPartName('Fourth ventricle', 'vi')).toBe('Não thất tư');
    expect(formatPartName('Choroid plexus.l', 'vi')).toBe('Đám rối màng mạch (Sinh dịch não tủy) (trái)');
    expect(formatPartName('Spinal dura', 'vi')).toBe('Màng cứng tủy gai & Hộp sọ');
  });
});
