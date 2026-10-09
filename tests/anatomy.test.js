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
  it('matches the eight models that are exported', () => {
    expect(SYSTEM_IDS).toEqual([
      'skeletal', 'muscular', 'joints', 'cardiovascular', 'lymphatic', 'nervous', 'visceral', 'integumentary'
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

  it('translates cervical vertebrae accurately', () => {
    expect(formatPartName('Vertebra C7', 'vi')).toBe('Đốt sống cổ C7 (Đốt sống lồi)');
    expect(formatPartName('Vertebra C1', 'vi')).toBe('Đốt sống cổ C1 (Đốt đội)');
    expect(formatPartName('Vertebra C2', 'vi')).toBe('Đốt sống cổ C2 (Đốt trục)');
  });
});

import { isSkeletalVisibleAtLevel } from '../src/ui/systemsLayerController.js';

describe('isSkeletalVisibleAtLevel - 4 Visible Body Dissection Stages', () => {
  it('Level 0 hides all skeletal parts', () => {
    expect(isSkeletalVisibleAtLevel('vertebra c1', 0)).toBe(false);
    expect(isSkeletalVisibleAtLevel('femur.l', 0)).toBe(false);
  });

  it('Level 1 shows ONLY vertebral column + occiput (Spine)', () => {
    // Spine parts should be visible
    expect(isSkeletalVisibleAtLevel('vertebra c1', 1.0)).toBe(true);
    expect(isSkeletalVisibleAtLevel('vertebra t5', 1.0)).toBe(true);
    expect(isSkeletalVisibleAtLevel('vertebra l5', 1.0)).toBe(true);
    expect(isSkeletalVisibleAtLevel('sacrum', 1.0)).toBe(true);
    expect(isSkeletalVisibleAtLevel('coccyx', 1.0)).toBe(true);
    expect(isSkeletalVisibleAtLevel('occipital bone', 1.0)).toBe(true);

    // Non-spine parts MUST be hidden
    expect(isSkeletalVisibleAtLevel('frontal bone', 1.0)).toBe(false);
    expect(isSkeletalVisibleAtLevel('mandible', 1.0)).toBe(false);
    expect(isSkeletalVisibleAtLevel('rib 1.l', 1.0)).toBe(false);
    expect(isSkeletalVisibleAtLevel('sternum', 1.0)).toBe(false);
    expect(isSkeletalVisibleAtLevel('ilium.l', 1.0)).toBe(false);
    expect(isSkeletalVisibleAtLevel('femur.l', 1.0)).toBe(false);
    expect(isSkeletalVisibleAtLevel('humerus.r', 1.0)).toBe(false);
  });

  it('Level 2 shows Axial Skeleton (Spine + Skull + Thorax) + Pelvis, hides limbs', () => {
    expect(isSkeletalVisibleAtLevel('vertebra c1', 2.0)).toBe(true);
    expect(isSkeletalVisibleAtLevel('frontal bone', 2.0)).toBe(true);
    expect(isSkeletalVisibleAtLevel('mandible', 2.0)).toBe(true);
    expect(isSkeletalVisibleAtLevel('rib 1.l', 2.0)).toBe(true);
    expect(isSkeletalVisibleAtLevel('sternum', 2.0)).toBe(true);
    expect(isSkeletalVisibleAtLevel('ilium.l', 2.0)).toBe(true);

    // Limbs MUST be hidden
    expect(isSkeletalVisibleAtLevel('femur.l', 2.0)).toBe(false);
    expect(isSkeletalVisibleAtLevel('humerus.r', 2.0)).toBe(false);
    expect(isSkeletalVisibleAtLevel('tibia.l', 2.0)).toBe(false);
  });

  it('Level 3 shows Axial + Pelvis + Long bones of 4 limbs, peels distal hand/foot bones', () => {
    expect(isSkeletalVisibleAtLevel('vertebra c1', 3.0)).toBe(true);
    expect(isSkeletalVisibleAtLevel('femur.l', 3.0)).toBe(true);
    expect(isSkeletalVisibleAtLevel('tibia.r', 3.0)).toBe(true);
    expect(isSkeletalVisibleAtLevel('humerus.l', 3.0)).toBe(true);
    expect(isSkeletalVisibleAtLevel('radius.r', 3.0)).toBe(true);

    // Distal hands and feet bones peeled away
    expect(isSkeletalVisibleAtLevel('scaphoid.l', 3.0)).toBe(false);
    expect(isSkeletalVisibleAtLevel('calcaneus.r', 3.0)).toBe(false);
    expect(isSkeletalVisibleAtLevel('distal phalanx.l', 3.0)).toBe(false);
  });

  it('Level 4 shows 100% complete skeleton', () => {
    expect(isSkeletalVisibleAtLevel('vertebra c1', 4.0)).toBe(true);
    expect(isSkeletalVisibleAtLevel('scaphoid.l', 4.0)).toBe(true);
    expect(isSkeletalVisibleAtLevel('calcaneus.r', 4.0)).toBe(true);
    expect(isSkeletalVisibleAtLevel('distal phalanx.l', 4.0)).toBe(true);
  });
});

