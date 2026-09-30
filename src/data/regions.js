// Anatomical Regions Definition & Camera Framing

export const REGIONS_DATA = [
  {
    id: 'head_neck',
    labelVi: 'Đầu - Mặt - Cổ',
    labelEn: 'Head & Neck',
    icon: '👤',
    camera: { x: 0, y: 1.6, z: 0.7, targetX: 0, targetY: 1.55, targetZ: 0 },
    keywords: ['cranium', 'frontal', 'parietal', 'occipital', 'temporal', 'mandible', 'maxilla', 'atlas', 'axis', 'cervical', 'hyoid', 'head', 'neck', 'brain']
  },
  {
    id: 'spine',
    labelVi: 'Cột sống & Thân mình',
    labelEn: 'Spine & Trunk',
    icon: '🦴',
    camera: { x: 0, y: 1.15, z: 1.2, targetX: 0, targetY: 1.1, targetZ: 0 },
    keywords: ['vertebra', 'vertebrae', 'atlas', 'axis', 'sacrum', 'coccyx', 'intervertebral', 'spine']
  },
  {
    id: 'thorax',
    labelVi: 'Lồng ngực & Tim Phổi',
    labelEn: 'Thorax',
    icon: '🫁',
    camera: { x: 0, y: 1.25, z: 1.0, targetX: 0, targetY: 1.25, targetZ: 0 },
    keywords: ['sternum', 'rib', 'costa', 'costal', 'thorax', 'thoracic', 'heart', 'lung']
  },
  {
    id: 'pelvis',
    labelVi: 'Bụng & Khung chậu',
    labelEn: 'Abdomen & Pelvis',
    icon: '🩻',
    camera: { x: 0, y: 0.95, z: 0.9, targetX: 0, targetY: 0.92, targetZ: 0 },
    keywords: ['hip', 'ilium', 'ischium', 'pubis', 'pelvis', 'sacrum', 'bladder', 'stomach', 'liver']
  },
  {
    id: 'upper_limb',
    labelVi: 'Chi trên (Tay & Khớp vai)',
    labelEn: 'Upper Limb',
    icon: '💪',
    camera: { x: 0.35, y: 1.1, z: 1.0, targetX: 0.25, targetY: 1.05, targetZ: 0 },
    keywords: ['clavicle', 'scapula', 'humerus', 'radius', 'ulna', 'carpal', 'metacarpal', 'phalanx', 'hand', 'arm']
  },
  {
    id: 'lower_limb',
    labelVi: 'Chi dưới (Chân & Khớp gối)',
    labelEn: 'Lower Limb',
    icon: '🦵',
    camera: { x: 0, y: 0.45, z: 1.4, targetX: 0, targetY: 0.45, targetZ: 0 },
    keywords: ['femur', 'patella', 'tibia', 'fibula', 'tarsal', 'metatarsal', 'foot', 'calcaneus', 'talus', 'leg']
  }
];

export function getRegionForStructure(structureName) {
  const name = (structureName || '').toLowerCase();
  for (const region of REGIONS_DATA) {
    if (region.keywords.some(k => name.includes(k))) {
      return region;
    }
  }
  return null;
}
