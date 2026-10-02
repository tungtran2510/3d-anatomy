// Smart 3D Anatomy AI Engine
// Natural language 3D model control, grounded medical reasoning, and adaptive pedagogy
import { state } from '../state/store.js';
import { getClinicalData } from '../data/clinicalInfo.js';
import { searchStructures } from '../utils/dataLoader.js';
import { selectPartById } from '../viewer/selection.js';
import { loadModel } from '../viewer/loadModel.js';
import { showSystem, hideSystem } from '../viewer/visibility.js';
import { highlightMesh } from '../viewer/visibility.js';
import { setClippingPlane } from '../viewer/clipping.js';
import { toggleMeasurementMode } from '../viewer/measurement.js';
import { getWeakStructures, getRoadmapProgress } from '../state/learningRoadmap.js';

// Pre-mapped high-frequency Vietnamese clinical anatomical aliases
export const ANATOMICAL_SYNONYMS = {
  // Muscles
  'cơ delta': { id: 'Deltoid.l', base: 'Deltoid', system: 'muscular', nameVi: 'Cơ delta (Cơ vai)' },
  'co delta': { id: 'Deltoid.l', base: 'Deltoid', system: 'muscular', nameVi: 'Cơ delta (Cơ vai)' },
  'cơ nhị đầu': { id: 'Biceps brachii.l', base: 'Biceps brachii', system: 'muscular', nameVi: 'Cơ nhị đầu cánh tay (Chuột trước)' },
  'chuột tay': { id: 'Biceps brachii.l', base: 'Biceps brachii', system: 'muscular', nameVi: 'Cơ nhị đầu cánh tay' },
  'cơ tam đầu': { id: 'Triceps brachii.l', base: 'Triceps brachii', system: 'muscular', nameVi: 'Cơ tam đầu cánh tay (Chuột sau)' },
  'cơ tứ đầu đùi': { id: 'Quadriceps femoris.l', base: 'Quadriceps femoris', system: 'muscular', nameVi: 'Cơ tứ đầu đùi' },
  'cơ tứ đầu': { id: 'Quadriceps femoris.l', base: 'Quadriceps femoris', system: 'muscular', nameVi: 'Cơ tứ đầu đùi' },
  'cơ mông lớn': { id: 'Gluteus maximus.l', base: 'Gluteus maximus', system: 'muscular', nameVi: 'Cơ mông lớn' },
  'cơ mông': { id: 'Gluteus maximus.l', base: 'Gluteus maximus', system: 'muscular', nameVi: 'Cơ mông lớn' },
  'cơ thang': { id: 'Trapezius.l', base: 'Trapezius', system: 'muscular', nameVi: 'Cơ thang (Cơ cổ vai lưng)' },
  'cơ lưng rộng': { id: 'Latissimus dorsi.l', base: 'Latissimus dorsi', system: 'muscular', nameVi: 'Cơ lưng rộng' },
  'cơ ức đòn chũm': { id: 'Sternocleidomastoid.l', base: 'Sternocleidomastoid', system: 'muscular', nameVi: 'Cơ ức đòn chũm' },
  'cơ bắp chân': { id: 'Gastrocnemius.l', base: 'Gastrocnemius', system: 'muscular', nameVi: 'Cơ bụng chân (Bắp chân)' },

  // Nerves & Ventricular System / CSF
  'thần kinh tọa': { id: 'Sciatic nerve.l', base: 'Sciatic nerve', system: 'nervous', nameVi: 'Dây thần kinh tọa (Dây thần kinh ngồi)' },
  'thần kinh hông to': { id: 'Sciatic nerve.l', base: 'Sciatic nerve', system: 'nervous', nameVi: 'Dây thần kinh tọa' },
  'thần kinh đùi': { id: 'Femoral nerve.l', base: 'Femoral nerve', system: 'nervous', nameVi: 'Dây thần kinh đùi' },
  'tủy sống': { id: 'Spinal cord', base: 'Spinal cord', system: 'nervous', nameVi: 'Tủy sống' },
  'dịch não tủy': { id: 'Lateral ventricle.l', base: 'Lateral ventricle', system: 'nervous', nameVi: 'Hệ thống Não thất & Dịch não tủy (CSF)' },
  'dich nao tuy': { id: 'Lateral ventricle.l', base: 'Lateral ventricle', system: 'nervous', nameVi: 'Hệ thống Não thất & Dịch não tủy (CSF)' },
  'nước não tủy': { id: 'Lateral ventricle.l', base: 'Lateral ventricle', system: 'nervous', nameVi: 'Dịch não tủy (CSF)' },
  'csf': { id: 'Lateral ventricle.l', base: 'Lateral ventricle', system: 'nervous', nameVi: 'Dịch não tủy (CSF)' },
  'não thất': { id: 'Lateral ventricle.l', base: 'Lateral ventricle', system: 'nervous', nameVi: 'Hệ thống Não thất & Dịch não tủy' },
  'nao that': { id: 'Lateral ventricle.l', base: 'Lateral ventricle', system: 'nervous', nameVi: 'Hệ thống Não thất' },
  'hệ thống não thất': { id: 'Lateral ventricle.l', base: 'Lateral ventricle', system: 'nervous', nameVi: 'Hệ thống Não thất & Dịch não tủy' },
  'não thất bên': { id: 'Lateral ventricle.l', base: 'Lateral ventricle', system: 'nervous', nameVi: 'Não thất bên (Lateral ventricle)' },
  'nao that ben': { id: 'Lateral ventricle.l', base: 'Lateral ventricle', system: 'nervous', nameVi: 'Não thất bên' },
  'não thất 3': { id: 'Third ventricle', base: 'Third ventricle', system: 'nervous', nameVi: 'Não thất ba' },
  'não thất ba': { id: 'Third ventricle', base: 'Third ventricle', system: 'nervous', nameVi: 'Não thất ba' },
  'nao that ba': { id: 'Third ventricle', base: 'Third ventricle', system: 'nervous', nameVi: 'Não thất ba' },
  'não thất 4': { id: 'Fourth ventricle', base: 'Fourth ventricle', system: 'nervous', nameVi: 'Não thất tư' },
  'não thất tư': { id: 'Fourth ventricle', base: 'Fourth ventricle', system: 'nervous', nameVi: 'Não thất tư' },
  'nao that tu': { id: 'Fourth ventricle', base: 'Fourth ventricle', system: 'nervous', nameVi: 'Não thất tư' },
  'cống não': { id: 'Aqueduct of midbrain', base: 'Aqueduct of midbrain', system: 'nervous', nameVi: 'Cống não Sylvius' },
  'cong nao': { id: 'Aqueduct of midbrain', base: 'Aqueduct of midbrain', system: 'nervous', nameVi: 'Cống não Sylvius' },
  'cống sylvius': { id: 'Aqueduct of midbrain', base: 'Aqueduct of midbrain', system: 'nervous', nameVi: 'Cống não Sylvius' },
  'cống trung não': { id: 'Aqueduct of midbrain', base: 'Aqueduct of midbrain', system: 'nervous', nameVi: 'Cống não Sylvius' },
  'đám rối màng mạch': { id: 'Choroid plexus.l', base: 'Choroid plexus', system: 'nervous', nameVi: 'Đám rối màng mạch (Sinh dịch não tủy)' },
  'dam roi mang mach': { id: 'Choroid plexus.l', base: 'Choroid plexus', system: 'nervous', nameVi: 'Đám rối màng mạch' },
  'màng cứng': { id: 'Spinal dura', base: 'Spinal dura', system: 'nervous', nameVi: 'Màng cứng tủy sống & Hộp sọ' },
  'khoang dưới nhện': { id: 'Lateral ventricle.l', base: 'Lateral ventricle', system: 'nervous', nameVi: 'Khoang dịch não tủy' },
  'khoang duoi nhen': { id: 'Lateral ventricle.l', base: 'Lateral ventricle', system: 'nervous', nameVi: 'Khoang dịch não tủy' },

  // Bones & Joints
  // Bones & Joints - Pelvis / Hip bone (Xương chậu & Khung hông)
  'xương chậu': { id: 'Hip bone.l', base: 'Hip bone', system: 'skeletal', nameVi: 'Xương chậu (Xương hông)' },
  'xuong chau': { id: 'Hip bone.l', base: 'Hip bone', system: 'skeletal', nameVi: 'Xương chậu' },
  'khung chậu': { id: 'Hip bone.l', base: 'Hip bone', system: 'skeletal', nameVi: 'Khung chậu (Xương chậu & Khung hông)' },
  'khung chau': { id: 'Hip bone.l', base: 'Hip bone', system: 'skeletal', nameVi: 'Khung chậu' },
  'vùng chậu': { id: 'Hip bone.l', base: 'Hip bone', system: 'skeletal', nameVi: 'Khung chậu' },
  'vung chau': { id: 'Hip bone.l', base: 'Hip bone', system: 'skeletal', nameVi: 'Khung chậu' },
  'chậu hông': { id: 'Hip bone.l', base: 'Hip bone', system: 'skeletal', nameVi: 'Khung chậu' },
  'xương hông': { id: 'Hip bone.l', base: 'Hip bone', system: 'skeletal', nameVi: 'Xương chậu' },
  'xương cánh chậu': { id: 'Hip bone.l', base: 'Hip bone', system: 'skeletal', nameVi: 'Xương cánh chậu (Ilium)' },
  'cánh chậu': { id: 'Hip bone.l', base: 'Hip bone', system: 'skeletal', nameVi: 'Xương cánh chậu' },
  'xương mu': { id: 'Hip bone.l', base: 'Hip bone', system: 'skeletal', nameVi: 'Xương mu (Pubis)' },
  'xương ngồi': { id: 'Hip bone.l', base: 'Hip bone', system: 'skeletal', nameVi: 'Xương ngồi (Ischium)' },
  'xương chậu trái': { id: 'Hip bone.l', base: 'Hip bone', system: 'skeletal', nameVi: 'Xương chậu trái' },
  'xương chậu phải': { id: 'Hip bone.r', base: 'Hip bone', system: 'skeletal', nameVi: 'Xương chậu phải' },
  'hip bone': { id: 'Hip bone.l', base: 'Hip bone', system: 'skeletal', nameVi: 'Xương chậu (Hip bone)' },
  'pelvis': { id: 'Hip bone.l', base: 'Hip bone', system: 'skeletal', nameVi: 'Khung chậu (Pelvis)' },

  // Cervical Vertebrae (Đốt sống cổ C1 - C7)
  'cột sống cổ c7': { id: 'Vertebra C7', base: 'Vertebra C7', system: 'skeletal', nameVi: 'Đốt sống cổ C7 (Đốt sống lồi)' },
  'đốt sống cổ c7': { id: 'Vertebra C7', base: 'Vertebra C7', system: 'skeletal', nameVi: 'Đốt sống cổ C7 (Đốt sống lồi)' },
  'đốt sống c7': { id: 'Vertebra C7', base: 'Vertebra C7', system: 'skeletal', nameVi: 'Đốt sống cổ C7' },
  'cột sống c7': { id: 'Vertebra C7', base: 'Vertebra C7', system: 'skeletal', nameVi: 'Đốt sống cổ C7' },
  'đốt cổ c7': { id: 'Vertebra C7', base: 'Vertebra C7', system: 'skeletal', nameVi: 'Đốt sống cổ C7' },
  'xương c7': { id: 'Vertebra C7', base: 'Vertebra C7', system: 'skeletal', nameVi: 'Đốt sống cổ C7' },
  'cổ c7': { id: 'Vertebra C7', base: 'Vertebra C7', system: 'skeletal', nameVi: 'Đốt sống cổ C7' },
  'đốt sống lồi': { id: 'Vertebra C7', base: 'Vertebra C7', system: 'skeletal', nameVi: 'Đốt sống cổ C7 (Vertebra prominens)' },
  'đốt sống cổ 7': { id: 'Vertebra C7', base: 'Vertebra C7', system: 'skeletal', nameVi: 'Đốt sống cổ C7' },
  'cột sống cổ 7': { id: 'Vertebra C7', base: 'Vertebra C7', system: 'skeletal', nameVi: 'Đốt sống cổ C7' },
  'c7': { id: 'Vertebra C7', base: 'Vertebra C7', system: 'skeletal', nameVi: 'Đốt sống cổ C7 (Đốt sống lồi)' },

  'cột sống cổ c6': { id: 'Vertebra C6', base: 'Vertebra C6', system: 'skeletal', nameVi: 'Đốt sống cổ C6' },
  'đốt sống cổ c6': { id: 'Vertebra C6', base: 'Vertebra C6', system: 'skeletal', nameVi: 'Đốt sống cổ C6' },
  'c6': { id: 'Vertebra C6', base: 'Vertebra C6', system: 'skeletal', nameVi: 'Đốt sống cổ C6' },

  'cột sống cổ c5': { id: 'Vertebra C5', base: 'Vertebra C5', system: 'skeletal', nameVi: 'Đốt sống cổ C5' },
  'đốt sống cổ c5': { id: 'Vertebra C5', base: 'Vertebra C5', system: 'skeletal', nameVi: 'Đốt sống cổ C5' },
  'c5': { id: 'Vertebra C5', base: 'Vertebra C5', system: 'skeletal', nameVi: 'Đốt sống cổ C5' },

  'cột sống cổ c4': { id: 'Vertebra C4', base: 'Vertebra C4', system: 'skeletal', nameVi: 'Đốt sống cổ C4' },
  'đốt sống cổ c4': { id: 'Vertebra C4', base: 'Vertebra C4', system: 'skeletal', nameVi: 'Đốt sống cổ C4' },
  'c4': { id: 'Vertebra C4', base: 'Vertebra C4', system: 'skeletal', nameVi: 'Đốt sống cổ C4' },

  'cột sống cổ c3': { id: 'Vertebra C3', base: 'Vertebra C3', system: 'skeletal', nameVi: 'Đốt sống cổ C3' },
  'đốt sống cổ c3': { id: 'Vertebra C3', base: 'Vertebra C3', system: 'skeletal', nameVi: 'Đốt sống cổ C3' },
  'c3': { id: 'Vertebra C3', base: 'Vertebra C3', system: 'skeletal', nameVi: 'Đốt sống cổ C3' },

  'đốt sống cổ c2': { id: 'Axis', base: 'Axis', system: 'skeletal', nameVi: 'Đốt sống cổ C2 (Đốt trục - Axis)' },
  'đốt trục': { id: 'Axis', base: 'Axis', system: 'skeletal', nameVi: 'Đốt sống cổ C2 (Đốt trục)' },
  'axis': { id: 'Axis', base: 'Axis', system: 'skeletal', nameVi: 'Đốt sống cổ C2 (Axis)' },
  'c2': { id: 'Axis', base: 'Axis', system: 'skeletal', nameVi: 'Đốt sống cổ C2 (Axis)' },

  'đốt sống cổ c1': { id: 'Atlas', base: 'Atlas', system: 'skeletal', nameVi: 'Đốt sống cổ C1 (Đốt đội - Atlas)' },
  'đốt đội': { id: 'Atlas', base: 'Atlas', system: 'skeletal', nameVi: 'Đốt sống cổ C1 (Đốt đội)' },
  'atlas': { id: 'Atlas', base: 'Atlas', system: 'skeletal', nameVi: 'Đốt sống cổ C1 (Atlas)' },
  'c1': { id: 'Atlas', base: 'Atlas', system: 'skeletal', nameVi: 'Đốt sống cổ C1 (Atlas)' },

  // Spine & Thoracic & Lumbar
  'cột sống': { id: 'Lumbar vertebra I', base: 'Vertebra', system: 'skeletal', nameVi: 'Cột sống' },
  'đốt sống thắt lưng': { id: 'Lumbar vertebra I', base: 'Lumbar vertebra', system: 'skeletal', nameVi: 'Đốt sống thắt lưng' },
  'l1': { id: 'Vertebra L1', base: 'Vertebra L1', system: 'skeletal', nameVi: 'Đốt sống thắt lưng L1' },
  'l2': { id: 'Vertebra L2', base: 'Vertebra L2', system: 'skeletal', nameVi: 'Đốt sống thắt lưng L2' },
  'l3': { id: 'Vertebra L3', base: 'Vertebra L3', system: 'skeletal', nameVi: 'Đốt sống thắt lưng L3' },
  'l4': { id: 'Vertebra L4', base: 'Vertebra L4', system: 'skeletal', nameVi: 'Đốt sống thắt lưng L4' },
  'l5': { id: 'Vertebra L5', base: 'Vertebra L5', system: 'skeletal', nameVi: 'Đốt sống thắt lưng L5' },
  'xương cùng': { id: 'Sacrum', base: 'Sacrum', system: 'skeletal', nameVi: 'Xương cùng (Sacrum)' },
  'xương cụt': { id: 'Coccyx', base: 'Coccyx', system: 'skeletal', nameVi: 'Xương cụt (Coccyx)' },

  // Other Bones
  'xương đùi': { id: 'Femur.l', base: 'Femur', system: 'skeletal', nameVi: 'Xương đùi' },
  'xương bánh chè': { id: 'Patella.l', base: 'Patella', system: 'skeletal', nameVi: 'Xương bánh chè' },
  'khớp gối': { id: 'Patella.l', base: 'Patella', system: 'skeletal', nameVi: 'Khớp gối & Xương bánh chè' },
  'xương chày': { id: 'Tibia.l', base: 'Tibia', system: 'skeletal', nameVi: 'Xương chày' },
  'xương mác': { id: 'Fibula.l', base: 'Fibula', system: 'skeletal', nameVi: 'Xương mác' },
  'xương gót': { id: 'Calcaneus.l', base: 'Calcaneus', system: 'skeletal', nameVi: 'Xương gót chân' },
  'xương đòn': { id: 'Clavicle.l', base: 'Clavicle', system: 'skeletal', nameVi: 'Xương đòn (Quai xanh)' },
  'quai xanh': { id: 'Clavicle.l', base: 'Clavicle', system: 'skeletal', nameVi: 'Xương đòn (Quai xanh)' },
  'xương bả vai': { id: 'Scapula.l', base: 'Scapula', system: 'skeletal', nameVi: 'Xương bả vai' },
  'xương cánh tay': { id: 'Humerus.l', base: 'Humerus', system: 'skeletal', nameVi: 'Xương cánh tay' },
  'xương quay': { id: 'Radius.l', base: 'Radius', system: 'skeletal', nameVi: 'Xương quay cẳng tay' },
  'xương trụ': { id: 'Ulna.l', base: 'Ulna', system: 'skeletal', nameVi: 'Xương trụ cẳng tay' },
  'xương sọ': { id: 'Frontal bone', base: 'Frontal bone', system: 'skeletal', nameVi: 'Hộp sọ (Xương trán)' },
  'hộp sọ': { id: 'Frontal bone', base: 'Frontal bone', system: 'skeletal', nameVi: 'Hộp sọ' },
  'xương trán': { id: 'Frontal bone', base: 'Frontal bone', system: 'skeletal', nameVi: 'Xương trán' },
  'xương hàm dưới': { id: 'Mandible', base: 'Mandible', system: 'skeletal', nameVi: 'Xương hàm dưới' },
  'xương ức': { id: 'Body of sternum', base: 'Body of sternum', system: 'skeletal', nameVi: 'Xương ức' },
  'xương sườn': { id: 'First rib.l', base: 'First rib', system: 'skeletal', nameVi: 'Xương sườn' },

  // Visceral, Lymphatic & Cardiovascular
  'tim': { id: 'heart_all', base: 'Heart', system: 'cardiovascular', nameVi: 'Trái tim' },
  'trái tim': { id: 'heart_all', base: 'Heart', system: 'cardiovascular', nameVi: 'Trái tim' },
  'phổi': { id: 'lungs_all', base: 'Lungs', system: 'visceral', nameVi: 'Hai lá phổi' },
  'lá phổi': { id: 'lungs_all', base: 'Lungs', system: 'visceral', nameVi: 'Hai lá phổi' },
  'dạ dày': { id: 'Stomach', base: 'Stomach', system: 'visceral', nameVi: 'Dạ dày (Bao tử)' },
  'bao tử': { id: 'Stomach', base: 'Stomach', system: 'visceral', nameVi: 'Dạ dày' },
  'gan': { id: 'Liver', base: 'Liver', system: 'visceral', nameVi: 'Lá gan' },
  'túi mật': { id: 'Gallbladder', base: 'Gallbladder', system: 'visceral', nameVi: 'Túi mật' },
  'tui mat': { id: 'Gallbladder', base: 'Gallbladder', system: 'visceral', nameVi: 'Túi mật' },
  'mật': { id: 'Gallbladder', base: 'Gallbladder', system: 'visceral', nameVi: 'Túi mật & Đường mật' },
  'mat': { id: 'Gallbladder', base: 'Gallbladder', system: 'visceral', nameVi: 'Túi mật' },
  'ống mật': { id: 'Bile duct', base: 'Bile duct', system: 'visceral', nameVi: 'Ống dẫn mật' },
  'tuyến tụy': { id: 'Pancreas', base: 'Pancreas', system: 'visceral', nameVi: 'Tuyến tụy (Tụy tạng)' },
  'tuyen tuy': { id: 'Pancreas', base: 'Pancreas', system: 'visceral', nameVi: 'Tuyến tụy' },
  'tụy': { id: 'Pancreas', base: 'Pancreas', system: 'visceral', nameVi: 'Tụy' },
  'tuy': { id: 'Pancreas', base: 'Pancreas', system: 'visceral', nameVi: 'Tụy' },
  'lá lách': { id: 'Spleen', base: 'Spleen', system: 'lymphatic', nameVi: 'Lá lách (Tỳ)' },
  'la lach': { id: 'Spleen', base: 'Spleen', system: 'lymphatic', nameVi: 'Lá lách' },
  'lách': { id: 'Spleen', base: 'Spleen', system: 'lymphatic', nameVi: 'Lá lách' },
  'lach': { id: 'Spleen', base: 'Spleen', system: 'lymphatic', nameVi: 'Lá lách' }
};

/**
 * Parses user input to extract semantic intent, target entities, and 3D action
 */
export function interpretAIQuery(query, activePart = null) {
  const q = query.toLowerCase().trim();

  // 1. Natural Language 3D Scene Controls

  // Intent: Compare bilateral (Trái - Phải)
  if (
    q.includes('so sánh') ||
    q.includes('hai bên') ||
    q.includes('trái phải') ||
    q.includes('trái - phải') ||
    q.includes('đối xứng')
  ) {
    const matched = findTargetStructure(q, activePart);
    return {
      intent: 'COMPARE_BILATERAL',
      target: matched,
      rawQuery: query
    };
  }

  // Intent: System hide/show (e.g. "ẩn cơ để xem thần kinh", "bật hệ thần kinh", "tắt cơ", "chỉ xem xương")
  if (
    q.includes('ẩn cơ') ||
    q.includes('tắt cơ') ||
    q.includes('xem thần kinh') ||
    q.includes('bật thần kinh') ||
    q.includes('bật mạch máu') ||
    q.includes('chỉ xem xương') ||
    q.includes('ẩn xương')
  ) {
    let hideSystems = [];
    let showSystems = [];

    if (q.includes('cơ')) {
      if (q.includes('ẩn') || q.includes('tắt')) hideSystems.push('muscular');
      else if (q.includes('bật') || q.includes('xem')) showSystems.push('muscular');
    }
    if (q.includes('thần kinh')) {
      showSystems.push('nervous');
    }
    if (q.includes('mạch máu') || q.includes('tim mạch')) {
      showSystems.push('cardiovascular');
    }
    if (q.includes('chỉ xem xương')) {
      showSystems.push('skeletal');
      hideSystems.push('muscular', 'visceral', 'joints');
    }

    return {
      intent: 'SYSTEM_CONTROL',
      hideSystems,
      showSystems,
      rawQuery: query
    };
  }

  // Intent: Focus / Locate structure (e.g. "tìm khung chậu", "chỉ cơ delta", or simply "khung chậu", "xương đùi")
  const matchedDirect = findTargetStructure(q, activePart);
  const isQuestion = q.includes('là gì') || q.includes('thế nào') || q.includes('chức năng') || q.includes('bệnh') || q.includes('triệu chứng') || q.includes('tại sao');

  if (
    matchedDirect && (
      !isQuestion ||
      q.startsWith('chỉ ') ||
      q.startsWith('tìm ') ||
      q.startsWith('xem ') ||
      q.startsWith('cho xem ') ||
      q.startsWith('cho tôi xem ') ||
      q.startsWith('ở đâu') ||
      q.includes('ở vị trí nào') ||
      q.startsWith('focus ') ||
      q.startsWith('chỉ vào ')
    )
  ) {
    return {
      intent: 'FOCUS_STRUCTURE',
      target: matchedDirect,
      rawQuery: query
    };
  }

  // Intent: Isolate
  if (q.includes('cô lập') || q.includes('isolate') || q.includes('chỉ giữ lại')) {
    const matched = findTargetStructure(q, activePart);
    return {
      intent: 'ISOLATE_STRUCTURE',
      target: matched || activePart,
      rawQuery: query
    };
  }

  // Intent: Dissect / Hide part
  if (q.includes('bóc tách') || q.includes('mổ') || q.includes('ẩn cấu trúc') || q.includes('ẩn đi')) {
    return {
      intent: 'DISSECT_PART',
      target: activePart,
      rawQuery: query
    };
  }

  // Intent: 3D Cross-section / Clipping
  if (q.includes('mặt cắt') || q.includes('cắt dọc') || q.includes('cắt ngang') || q.includes('sagittal') || q.includes('axial')) {
    let plane = 'sagittal';
    if (q.includes('ngang') || q.includes('axial')) plane = 'axial';
    if (q.includes('đứng ngang') || q.includes('coronal')) plane = 'coronal';
    return {
      intent: 'CLIPPING_CONTROL',
      plane,
      rawQuery: query
    };
  }

  // Intent: Caliper / Measurement
  if (q.includes('thước đo') || q.includes('đo kích thước') || q.includes('đo khoảng cách') || q.includes('kích thước bao nhiêu')) {
    return {
      intent: 'MEASURE_CONTROL',
      rawQuery: query
    };
  }

  // Intent: Adaptive Quiz / Review Mistakes
  if (
    q.includes('ôn lại') ||
    q.includes('cấu trúc hay sai') ||
    q.includes('câu sai') ||
    q.includes('điểm yếu') ||
    q.includes('quiz thích ứng') ||
    q.includes('kiểm tra lại')
  ) {
    return {
      intent: 'ADAPTIVE_QUIZ',
      rawQuery: query
    };
  }

  // Intent: Dynamic Motion & Physiological Animation
  if (
    q.includes('chuyển động') ||
    q.includes('giải phẫu động') ||
    q.includes('tim đập') ||
    q.includes('nhịp tim') ||
    q.includes('hô hấp') ||
    q.includes('thở') ||
    q.includes('gập gối') ||
    q.includes('khớp gối') ||
    q.includes('khớp khuỷu') ||
    q.includes('gập khuỷu') ||
    q.includes('cúi ngửa') ||
    (q.includes('cột sống') && q.includes('cúi')) ||
    q.includes('dạng háng')
  ) {
    let motionType = 'cardiac';
    if (q.includes('hô hấp') || q.includes('thở') || q.includes('phổi')) motionType = 'respiratory';
    if (q.includes('khuỷu') || q.includes('biceps') || q.includes('nhị đầu')) motionType = 'elbow_flexion';
    if (q.includes('gối') || q.includes('patella') || q.includes('bánh chè')) motionType = 'knee_flexion';
    if (q.includes('cột sống') || q.includes('cúi')) motionType = 'spine_flexion';
    if (q.includes('háng') || q.includes('dạng')) motionType = 'hip_abduction';

    return {
      intent: 'DYNAMIC_MOTION',
      motionType,
      rawQuery: query
    };
  }

  // Intent: Augmented Reality (AR)
  if (q.includes('ar') || q.includes('thực tế tăng cường') || q.includes('không gian thật') || q.includes('đặt vào phòng') || q.includes('mở camera')) {
    return {
      intent: 'AR_CONTROL',
      rawQuery: query
    };
  }

  // Intent: Roadmap & Progress
  if (q.includes('lộ trình') || q.includes('tiến độ') || q.includes('tiến bộ') || q.includes('thống kê học tập')) {
    return {
      intent: 'VIEW_ROADMAP',
      rawQuery: query
    };
  }

  // Fallback: Clinical Q&A about current or matched structure
  const matched = findTargetStructure(q, activePart);
  return {
    intent: 'CLINICAL_QNA',
    target: matched || activePart,
    rawQuery: query
  };
}

/**
 * Strips common Vietnamese command prefixes and cleans query
 */
function cleanSearchQuery(text) {
  return text
    .toLowerCase()
    .replace(/^(tìm|hãy tìm|chỉ|cho xem|cho tôi xem|xem|focus|định vị|ở đâu|vị trí của|vị trí|chỉ ra|hãy chỉ)\s+/i, '')
    .replace(/[?!.,;:()]/g, ' ')
    .trim();
}

/**
 * Searches for target structure from query or active selection
 */
function findTargetStructure(query, activePart) {
  const q = query.toLowerCase().trim();
  const cleanQ = cleanSearchQuery(query);

  // 1. Dynamic Regex Matcher for Vertebrae (C1-C7, T1-T12, L1-L5)
  // Cervical (C1 - C7)
  const cMatch = cleanQ.match(/(?:cột\s*sống\s*cổ|đốt\s*sống\s*cổ|đốt\s*cổ|cổ|c)\s*([1-7])\b/i) ||
                 q.match(/(?:cột\s*sống\s*cổ|đốt\s*sống\s*cổ|đốt\s*cổ|cổ|c)\s*([1-7])\b/i);
  if (cMatch) {
    const num = parseInt(cMatch[1], 10);
    if (num === 1) return { id: 'Atlas', base: 'Atlas', system: 'skeletal', nameVi: 'Đốt sống cổ C1 (Đốt đội - Atlas)' };
    if (num === 2) return { id: 'Axis', base: 'Axis', system: 'skeletal', nameVi: 'Đốt sống cổ C2 (Đốt trục - Axis)' };
    return { id: `Vertebra C${num}`, base: `Vertebra C${num}`, system: 'skeletal', nameVi: `Đốt sống cổ C${num}${num === 7 ? ' (Đốt sống lồi)' : ''}` };
  }

  // Thoracic (T1 - T12)
  const tMatch = cleanQ.match(/(?:cột\s*sống\s*ngực|đốt\s*sống\s*ngực|đốt\s*ngực|ngực|t|d)\s*([1-9]|1[0-2])\b/i) ||
                 q.match(/(?:cột\s*sống\s*ngực|đốt\s*sống\s*ngực|đốt\s*ngực|ngực|t|d)\s*([1-9]|1[0-2])\b/i);
  if (tMatch) {
    const num = parseInt(tMatch[1], 10);
    return { id: `Vertebra T${num}`, base: `Vertebra T${num}`, system: 'skeletal', nameVi: `Đốt sống ngực T${num}` };
  }

  // Lumbar (L1 - L5)
  const lMatch = cleanQ.match(/(?:cột\s*sống\s*thắt\s*lưng|đốt\s*sống\s*thắt\s*lưng|đốt\s*thắt\s*lưng|thắt\s*lưng|l)\s*([1-5])\b/i) ||
                 q.match(/(?:cột\s*sống\s*thắt\s*lưng|đốt\s*sống\s*thắt\s*lưng|đốt\s*thắt\s*lưng|thắt\s*lưng|l)\s*([1-5])\b/i);
  if (lMatch) {
    const num = parseInt(lMatch[1], 10);
    return { id: `Vertebra L${num}`, base: `Vertebra L${num}`, system: 'skeletal', nameVi: `Đốt sống thắt lưng L${num}` };
  }

  // Pelvis / Hip Bone / Xương chậu / Khung chậu
  if (
    cleanQ.match(/^(xương\s*chậu|khung\s*chậu|vùng\s*chậu|chậu\s*hông|xương\s*hông|cánh\s*chậu|pelvis|hip\s*bone)$/i) ||
    cleanQ.includes('xương chậu') || cleanQ.includes('khung chậu') || cleanQ.includes('vùng chậu') ||
    cleanQ.includes('xuong chau') || cleanQ.includes('khung chau') ||
    q.includes('xương chậu') || q.includes('khung chậu') || q.includes('xuong chau') || q.includes('khung chau')
  ) {
    return { id: 'Hip bone.l', base: 'Hip bone', system: 'skeletal', nameVi: 'Xương chậu (Khung chậu)' };
  }

  // 2. Check known high-yield synonyms (Longest match first!)
  const sortedSynonyms = Object.keys(ANATOMICAL_SYNONYMS).sort((a, b) => b.length - a.length);
  for (const synonym of sortedSynonyms) {
    if (cleanQ.includes(synonym) || q.includes(synonym)) {
      return ANATOMICAL_SYNONYMS[synonym];
    }
  }

  // 3. Search database with cleanQ and query
  const searchResults = searchStructures(cleanQ).concat(searchStructures(q));
  if (searchResults.length > 0) {
    const first = searchResults[0];
    const side = first.sides?.[0];
    return {
      id: side?.id || first.baseName,
      base: first.baseName,
      system: first.system,
      nameVi: first.name?.vi || first.baseName
    };
  }

  // 4. Fallback to active selected part ONLY if user query implies referring to current selection
  const isReferential = q.includes('nó') || q.includes('này') || q.includes('đang chọn') || q.includes('đây') || q.includes('vừa chọn');
  if (activePart && isReferential) {
    return {
      id: activePart.id,
      base: activePart.info?.baseName || activePart.id,
      system: activePart.system,
      nameVi: activePart.displayName
    };
  }

  return null;
}

/**
 * Executes AI 3D actions and builds an authoritative, grounded response
 */
export async function executeAICommand(interpreted, viewer) {
  const { intent, target, rawQuery, hideSystems, showSystems, plane } = interpreted;
  const activeViewer = viewer || state.viewer || window.viewer;

  // 1. FOCUS STRUCTURE
  if (intent === 'FOCUS_STRUCTURE' && target) {
    if (activeViewer) {
      const sys = target.system;
      if (sys && !state.loadedSystems.includes(sys)) {
        await loadModel(sys, activeViewer).catch(err => console.warn('Failed background load of', sys, err));
      }
      if (sys) showSystem(sys);
      const selected = selectPartById(target.id, activeViewer);
      if (!selected && target.base) {
        selectPartById(target.base + '.l', activeViewer) ||
        selectPartById(target.base, activeViewer) ||
        selectPartById(target.base + '.r', activeViewer);
      }
      activeViewer.render();
    }
    const clinical = getClinicalData(target.id, target.base);
    return {
      action: 'FOCUS',
      actionBadge: `🎯 AI đã định vị & làm nổi bật: ${target.nameVi}`,
      speechText: `Đã tìm thấy ${target.nameVi}.`,
      message: `
        **${clinical.nameVi}** *(Latin: ${clinical.nameLatin || ''})*
        - **Hệ cơ quan:** ${clinical.systemVi}
        - **Chức năng chính:** ${clinical.function}
        - **Liên quan lâm sàng:** ${clinical.clinical}
      `.trim(),
      data: clinical,
      partId: target.id
    };
  }

  // 2. SYSTEM CONTROL ("ẩn cơ để xem thần kinh", "bật hệ thần kinh",...)
  if (intent === 'SYSTEM_CONTROL') {
    let actionDesc = [];
    if (hideSystems?.length) {
      hideSystems.forEach(sys => {
        hideSystem(sys);
        actionDesc.push(`Ẩn ${getSystemNameVi(sys)}`);
      });
    }
    if (showSystems?.length) {
      showSystems.forEach(sys => {
        if (viewer && !state.loadedSystems.includes(sys)) {
          loadModel(sys, viewer).then(() => showSystem(sys)).catch(() => {});
        } else {
          showSystem(sys);
        }
        actionDesc.push(`Bật ${getSystemNameVi(sys)}`);
      });
    }
    viewer?.render();

    return {
      action: 'SYSTEM_VISIBILITY',
      actionBadge: `👁️ AI đã điều chỉnh: ${actionDesc.join(', ')}`,
      message: `
        Đã điều chỉnh các lớp giải phẫu theo yêu cầu:
        ${actionDesc.map(d => `- ✅ **${d}**`).join('\n')}
        
        *💡 Mẹo y khoa:* Khi ẩn các khối cơ nông, bạn có thể quan sát rõ đường đi của các bó mạch thần kinh sâu bên dưới và diện tiếp khớp giữa các xương.
      `.trim()
    };
  }

  // 3. COMPARE BILATERAL (So sánh trái - phải)
  if (intent === 'COMPARE_BILATERAL') {
    const t = target || { id: 'Femur.l', base: 'Femur', nameVi: 'Xương đùi', system: 'skeletal' };
    const leftId = t.base + '.l';
    const rightId = t.base + '.r';

    if (viewer) {
      const sys = t.system || 'skeletal';
      if (!state.loadedSystems.includes(sys)) {
        loadModel(sys, viewer).then(() => {
          showSystem(sys);
          highlightMesh(leftId, 0x00f0ff, 0.9);
          highlightMesh(rightId, 0xffd700, 0.9);
          selectPartById(leftId, viewer);
          viewer?.render();
        }).catch(() => {});
      } else {
        showSystem(sys);
        highlightMesh(leftId, 0x00f0ff, 0.9);
        highlightMesh(rightId, 0xffd700, 0.9);
        selectPartById(leftId, viewer);
        viewer?.render();
      }
    }

    // Highlight both in 3D
    highlightMesh(leftId, 0x00f0ff, 0.9);
    highlightMesh(rightId, 0xffd700, 0.9);
    viewer?.render();

    const clinical = getClinicalData(leftId, t.base);

    return {
      action: 'COMPARE_BILATERAL',
      actionBadge: `⚖️ AI đang so sánh hai bên: ${clinical.nameVi} (Trái 🔵 & Phải 🟡)`,
      message: `
        ### ⚖️ So Sánh Giải Phẫu Đối Xứng: ${clinical.nameVi}
        - **Đặc điểm hình thái:** Cấu trúc đối xứng gương qua mặt phẳng đứng dọc giữa (*Mid-sagittal plane*).
        - **Cơ chế chịu lực & Động học:** Hai bên phối hợp đồng vận để phân bổ tải trọng cơ thể đều 50/50 qua khung chậu xuống hai chân khi đứng thẳng.
        - **Ý nghĩa lâm sàng sai lệch:**
          - Sự bất đối xứng chiều dài (>0.5 - 1.0 cm) gây lệch vẹo xương chậu và vẹo cột sống phản ứng (*Compensatory scoliosis*).
          - Lệch tải trọng dẫn đến mòn sụn không đều ở một bên khớp (*Unilateral osteoarthritis*).
        - **Liên quan thần kinh:** Chi phối đối xứng bởi các rễ thần kinh tương ứng ở hai bên tủy sống.
      `.trim(),
      partId: leftId
    };
  }

  // 4. CLIPPING CONTROL
  if (intent === 'CLIPPING_CONTROL') {
    setClippingPlane(plane || 'sagittal', viewer);
    const planeName = plane === 'sagittal' ? 'Đứng dọc (Sagittal)' : plane === 'coronal' ? 'Đứng ngang (Coronal)' : 'Ngang (Axial)';
    return {
      action: 'CLIPPING',
      actionBadge: `🔪 AI đã kích hoạt Mặt cắt 3D: ${planeName}`,
      message: `Đã kích hoạt mặt phẳng cắt **${planeName}**. Bạn có thể dùng thanh trượt để di chuyển mặt cắt đi xuyên qua các lớp giải phẫu bên trong cơ thể.`
    };
  }

  // 5. MEASURE CONTROL
  if (intent === 'MEASURE_CONTROL') {
    toggleMeasurementMode(viewer);
    return {
      action: 'MEASURE',
      actionBadge: `📏 AI đã bật Thước đo 3D Caliper`,
      message: `Đã mở thước đo kích thước 3D thực tế. Hãy chạm 2 điểm bất kỳ trên mô hình để tính khoảng cách giải phẫu theo cm và mm.`
    };
  }

  // 6. ADAPTIVE QUIZ
  if (intent === 'ADAPTIVE_QUIZ') {
    const weakList = getWeakStructures();
    return {
      action: 'TRIGGER_ADAPTIVE_QUIZ',
      actionBadge: `🎯 AI sẵn sàng mở bài kiểm tra thích ứng`,
      message: weakList.length > 0
        ? `Hệ thống ghi nhận bạn đang có **${weakList.length} cấu trúc cần củng cố** (như *${weakList.slice(0, 3).map(w => w.title).join(', ')}*). Nhấn nút bên dưới để bắt đầu bài thi thích ứng tập trung đúng điểm yếu!`
        : `Hiện tại bạn chưa có câu sai nào được ghi nhận. Hệ thống sẽ tạo bài kiểm tra tổng hợp 5 câu ngẫu nhiên để thử thách năng lực!`
    };
  }

  // 7. VIEW ROADMAP
  if (intent === 'VIEW_ROADMAP') {
    const progress = getRoadmapProgress();
    return {
      action: 'OPEN_ROADMAP',
      actionBadge: `📊 Lộ trình học: Hoàn thành ${progress.overallPercentage}%`,
      message: `
        ### 📊 Tiến Trình Học Tập Của Bạn
        - **Tiến độ tổng thể:** **${progress.overallPercentage}%**
        - **Cấu trúc đã thành thạo:** ${progress.totalMastered} cấu trúc
        - **Tỷ lệ trả lời chính xác:** ${progress.accuracyRate}%
        - **Chuỗi học liên tục:** ${progress.streakDays} ngày 🔥
        - **Điểm yếu cần ôn:** ${progress.weakCount} cấu trúc
      `.trim()
    };
  }

  // 8. DYNAMIC ANATOMY & MOTION CONTROL
  if (intent === 'DYNAMIC_MOTION') {
    import('../ui/motionPanel.js').then(({ openMotionPanel }) => {
      openMotionPanel(viewer, interpreted.motionType);
    }).catch(err => console.error('Failed to load motion panel:', err));

    const motionLabels = {
      cardiac: '🫀 Nhịp Tim & Chu kỳ Tim',
      respiratory: '🫁 Cơ Chế Hô Hấp',
      elbow_flexion: '💪 Gập Duỗi Khớp Khuỷu',
      knee_flexion: '🦵 Gập Duỗi Khớp Gối',
      spine_flexion: '🦴 Cúi Ngửa Cột Sống',
      hip_abduction: '🤸 Dạng Khép Khớp Háng'
    };
    const title = motionLabels[interpreted.motionType] || 'Mô phỏng chuyển động sinh lý';

    return {
      action: 'DYNAMIC_MOTION',
      actionBadge: `🎬 AI đã mở mô phỏng: ${title}`,
      message: `
        ### 🎬 ${title}
        Đã kích hoạt mô phỏng giải phẫu động 3D theo cơ chế sinh lý thực tế:
        - Sử dụng thanh trượt **Timeline** để tua tới từng góc độ hoặc thì chuyển động.
        - Điều chỉnh tốc độ **0.25x - 0.5x** để quan sát chuyển động chậm.
        - Chọn và bấm **Cô lập** để chỉ quan sát chuyển động của xương/cơ bạn quan tâm.
      `.trim()
    };
  }

  // 9. AUGMENTED REALITY (AR)
  if (intent === 'AR_CONTROL') {
    import('../ui/arModal.js').then(({ openARModal }) => {
      openARModal(viewer);
    }).catch(err => console.error('Failed to load AR modal:', err));

    return {
      action: 'AR_CONTROL',
      actionBadge: '📱 AI đã kích hoạt AR Thực tế',
      message: `
        ### 📱 Thực Tế Tăng Cường AR
        Đang khởi động chế độ AR để đưa mô hình người 3D vào phòng thực tế:
        - Hỗ trợ dò bề mặt sàn/bàn (WebXR) hoặc chiếu Camera trực tiếp.
        - Có thể chuyển đổi tỉ lệ: **Mặt bàn (1:5)** hoặc **Người thật (1:1)**.
        - Dùng 1 ngón tay xoay, 2 ngón tay chụm thu phóng và bấm **Chụp ảnh** để lưu lại.
      `.trim()
    };
  }

  // 10. CLINICAL Q&A (Grounded Medical Knowledge)
  if (target) {
    const clinical = getClinicalData(target.id, target.base);
    const rel = clinical.relations || {};

    let answerContent = '';
    const qLower = rawQuery.toLowerCase();

    if (qLower.includes('thần kinh') || qLower.includes('dây thần kinh')) {
      answerContent = `
        **Chi phối Thần kinh của ${clinical.nameVi}:**
        ⚡ ${rel.nerves || 'Được chi phối bởi các nhánh thần kinh vận động và cảm giác khu vực.'}
      `.trim();
    } else if (qLower.includes('mạch máu') || qLower.includes('máu') || qLower.includes('động mạch')) {
      answerContent = `
        **Cấp máu & Tuần hoàn của ${clinical.nameVi}:**
        🩸 ${rel.vessels || 'Được nuôi dưỡng bởi các nhánh động mạch và mạng mạch quanh vùng.'}
      `.trim();
    } else if (qLower.includes('cơ') || qLower.includes('bám')) {
      answerContent = `
        **Liên quan Cơ bắp của ${clinical.nameVi}:**
        🔴 ${rel.muscles || 'Liên kết với các gân cơ phụ trách vận động và giữ vững tư thế.'}
      `.trim();
    } else if (qLower.includes('bệnh') || qLower.includes('chấn thương') || qLower.includes('đau')) {
      answerContent = `
        **Bệnh lý & Ý nghĩa Lâm sàng của ${clinical.nameVi}:**
        🩺 ${clinical.clinical}
      `.trim();
    } else {
      // Full Academic Brief
      answerContent = `
### 📘 Thông Tin Học Thuật: ${clinical.nameVi}
*Latinh (TA2):* **${clinical.nameLatin || 'Chưa định danh'}** | *Tiếng Anh:* **${clinical.nameEn || ''}**

⚡ **Chức năng & Cơ sinh học:**
${clinical.function}

🔗 **4 Liên Quan Giải Phẫu Trọng Yếu:**
- 🔴 **Cơ liên quan:** ${rel.muscles || 'Gân cơ vận động chính.'}
- 🦴 **Xương & Khớp:** ${rel.bones || 'Tiếp khớp các diện xương kế cận.'}
- ⚡ **Thần kinh chi phối:** ${rel.nerves || 'Các nhánh thần kinh ngoại biên.'}
- 🩸 **Mạch máu cấp máu:** ${rel.vessels || 'Mạng mạch máu khu vực.'}

🩺 **Ý Nghĩa Lâm Sàng & Tổn Thương:**
${clinical.clinical}
      `.trim();
    }

    return {
      action: 'CLINICAL_ANSWER',
      message: answerContent,
      data: clinical,
      partId: target.id
    };
  }

  // General Fallback
  return {
    action: 'ASSISTANT_REPLY',
    message: `
      Xin chào! Tôi là Trợ lý AI Giải Phẫu 3D. Tôi có thể giúp bạn:
      - 🎯 **Điều khiển 3D bằng giọng lệnh:** Gõ *"chỉ cơ delta"*, *"tìm xương đùi"*, *"xương chày ở đâu"*...
      - 👁️ **Bóc tách nhiều lớp:** Gõ *"ẩn cơ để xem thần kinh"*, *"chỉ xem xương"*...
      - ⚖️ **So sánh đối xứng:** Gõ *"so sánh xương đùi trái-phải"*...
      - 📚 **Hỏi đáp giải phẫu học:** Hỏi chức năng, thần kinh, mạch máu của bất kỳ bộ phận nào đang chọn.
      - 🎯 **Ôn luyện điểm yếu:** Gõ *"ôn lại cấu trúc hay sai"* để mở quiz thích ứng.
    `.trim()
  };
}

function getSystemNameVi(systemId) {
  const map = {
    skeletal: 'Hệ Xương',
    muscular: 'Hệ Cơ',
    nervous: 'Hệ Thần kinh',
    cardiovascular: 'Hệ Tim mạch',
    visceral: 'Hệ Nội tạng',
    joints: 'Hệ Khớp',
    lymphatic: 'Hệ Bạch huyết'
  };
  return map[systemId] || systemId;
}
