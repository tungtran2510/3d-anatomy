// Smart 3D Anatomy AI Engine
// Natural language 3D model control, grounded medical reasoning, and adaptive pedagogy
import { state, setSelectedPart, getStructureInfo } from '../state/store.js';
import { getClinicalData } from '../data/clinicalInfo.js';
import { searchStructures } from '../utils/dataLoader.js';
import { selectPartById } from '../viewer/selection.js';
import { loadModel } from '../viewer/loadModel.js';
import { showSystem, hideSystem } from '../viewer/visibility.js';
import { highlightMesh } from '../viewer/visibility.js';
import { setClippingPlane } from '../viewer/clipping.js';
import { toggleMeasurementMode } from '../viewer/measurement.js';
import { getWeakStructures, getRoadmapProgress } from '../state/learningRoadmap.js';
import { CLINICAL_AXES } from '../data/clinicalAxesData.js';

// Pre-mapped high-frequency Vietnamese clinical anatomical aliases
export const ANATOMICAL_SYNONYMS = {
  // Muscles
  'cơ delta': { id: 'Acromial part of deltoid muscle.l', base: 'Acromial part of deltoid muscle', system: 'muscular', nameVi: 'Cơ delta (Cơ vai)' },
  'co delta': { id: 'Acromial part of deltoid muscle.l', base: 'Acromial part of deltoid muscle', system: 'muscular', nameVi: 'Cơ delta (Cơ vai)' },
  'cơ nhị đầu': { id: 'Long head of biceps brachii.l', base: 'Long head of biceps brachii', system: 'muscular', nameVi: 'Cơ nhị đầu cánh tay (Chuột trước)' },
  'co nhi dau': { id: 'Long head of biceps brachii.l', base: 'Long head of biceps brachii', system: 'muscular', nameVi: 'Cơ nhị đầu cánh tay' },
  'chuột tay': { id: 'Long head of biceps brachii.l', base: 'Long head of biceps brachii', system: 'muscular', nameVi: 'Cơ nhị đầu cánh tay' },
  'cơ tam đầu': { id: 'Long head of triceps brachii.l', base: 'Long head of triceps brachii', system: 'muscular', nameVi: 'Cơ tam đầu cánh tay (Chuột sau)' },
  'co tam dau': { id: 'Long head of triceps brachii.l', base: 'Long head of triceps brachii', system: 'muscular', nameVi: 'Cơ tam đầu cánh tay' },
  'cơ tứ đầu đùi': { id: 'Rectus femoris muscle.l', base: 'Rectus femoris muscle', system: 'muscular', nameVi: 'Cơ tứ đầu đùi (Cơ thẳng đùi)' },
  'co tu dau dui': { id: 'Rectus femoris muscle.l', base: 'Rectus femoris muscle', system: 'muscular', nameVi: 'Cơ tứ đầu đùi' },
  'cơ tứ đầu': { id: 'Rectus femoris muscle.l', base: 'Rectus femoris muscle', system: 'muscular', nameVi: 'Cơ tứ đầu đùi' },
  'cơ mông lớn': { id: 'Gluteus maximus.l', base: 'Gluteus maximus', system: 'muscular', nameVi: 'Cơ mông lớn' },
  'cơ mông': { id: 'Gluteus maximus.l', base: 'Gluteus maximus', system: 'muscular', nameVi: 'Cơ mông lớn' },
  'cơ thang': { id: 'Descending part of trapezius muscle.l', base: 'Descending part of trapezius muscle', system: 'muscular', nameVi: 'Cơ thang (Cơ cổ vai gáy)' },
  'co thang': { id: 'Descending part of trapezius muscle.l', base: 'Descending part of trapezius muscle', system: 'muscular', nameVi: 'Cơ thang' },
  'cơ hình thang': { id: 'Descending part of trapezius muscle.l', base: 'Descending part of trapezius muscle', system: 'muscular', nameVi: 'Cơ hình thang (Cơ thang)' },
  'co hinh thang': { id: 'Descending part of trapezius muscle.l', base: 'Descending part of trapezius muscle', system: 'muscular', nameVi: 'Cơ hình thang' },
  'cơ cổ vai gáy': { id: 'Descending part of trapezius muscle.l', base: 'Descending part of trapezius muscle', system: 'muscular', nameVi: 'Cơ thang (Cơ cổ vai gáy)' },
  'co co vai gay': { id: 'Descending part of trapezius muscle.l', base: 'Descending part of trapezius muscle', system: 'muscular', nameVi: 'Cơ cổ vai gáy' },
  'cơ vai gáy': { id: 'Descending part of trapezius muscle.l', base: 'Descending part of trapezius muscle', system: 'muscular', nameVi: 'Cơ thang (Cơ cổ vai gáy)' },
  'co vai gay': { id: 'Descending part of trapezius muscle.l', base: 'Descending part of trapezius muscle', system: 'muscular', nameVi: 'Cơ vai gáy' },
  'trapezius': { id: 'Descending part of trapezius muscle.l', base: 'Descending part of trapezius muscle', system: 'muscular', nameVi: 'Cơ thang (Trapezius)' },

  // Back & Spine Muscles (Khối cơ dọc sống lưng / Cơ dựng gai / Cơ cạnh sống)
  'cơ dọc sống lưng': { id: 'Longissimus thoracis muscle.l', base: 'Longissimus thoracis muscle', system: 'muscular', nameVi: 'Cơ cực dài ngực (Khối cơ dọc sống lưng / dựng gai)' },
  'co doc song lung': { id: 'Longissimus thoracis muscle.l', base: 'Longissimus thoracis muscle', system: 'muscular', nameVi: 'Cơ cực dài ngực (Khối cơ dọc sống lưng)' },
  'cơ sống lưng': { id: 'Longissimus thoracis muscle.l', base: 'Longissimus thoracis muscle', system: 'muscular', nameVi: 'Cơ cực dài ngực (Cơ sống lưng)' },
  'co song lung': { id: 'Longissimus thoracis muscle.l', base: 'Longissimus thoracis muscle', system: 'muscular', nameVi: 'Cơ sống lưng' },
  'cơ dựng gai': { id: 'Longissimus thoracis muscle.l', base: 'Longissimus thoracis muscle', system: 'muscular', nameVi: 'Cơ cực dài ngực (Cơ dựng gai sống)' },
  'co dung gai': { id: 'Longissimus thoracis muscle.l', base: 'Longissimus thoracis muscle', system: 'muscular', nameVi: 'Cơ dựng gai' },
  'cơ dựng sống': { id: 'Longissimus thoracis muscle.l', base: 'Longissimus thoracis muscle', system: 'muscular', nameVi: 'Cơ cực dài ngực (Cơ dựng sống)' },
  'co dung song': { id: 'Longissimus thoracis muscle.l', base: 'Longissimus thoracis muscle', system: 'muscular', nameVi: 'Cơ dựng sống' },
  'cơ cạnh sống': { id: 'Longissimus thoracis muscle.l', base: 'Longissimus thoracis muscle', system: 'muscular', nameVi: 'Cơ cực dài ngực (Khối cơ cạnh sống)' },
  'co canh song': { id: 'Longissimus thoracis muscle.l', base: 'Longissimus thoracis muscle', system: 'muscular', nameVi: 'Cơ cạnh sống' },
  'cơ lưng sâu': { id: 'Longissimus thoracis muscle.l', base: 'Longissimus thoracis muscle', system: 'muscular', nameVi: 'Cơ cực dài ngực (Cơ lưng sâu)' },
  'co lung sau': { id: 'Longissimus thoracis muscle.l', base: 'Longissimus thoracis muscle', system: 'muscular', nameVi: 'Cơ lưng sâu' },
  'cơ cực dài': { id: 'Longissimus thoracis muscle.l', base: 'Longissimus thoracis muscle', system: 'muscular', nameVi: 'Cơ cực dài ngực (Longissimus)' },
  'co cuc dai': { id: 'Longissimus thoracis muscle.l', base: 'Longissimus thoracis muscle', system: 'muscular', nameVi: 'Cơ cực dài' },
  'longissimus': { id: 'Longissimus thoracis muscle.l', base: 'Longissimus thoracis muscle', system: 'muscular', nameVi: 'Cơ cực dài (Longissimus)' },
  'erector spinae': { id: 'Longissimus thoracis muscle.l', base: 'Longissimus thoracis muscle', system: 'muscular', nameVi: 'Cơ dựng gai sống (Erector spinae)' },
  'paraspinal': { id: 'Longissimus thoracis muscle.l', base: 'Longissimus thoracis muscle', system: 'muscular', nameVi: 'Khối cơ cạnh sống (Paraspinal muscles)' },
  'cơ chậu sườn': { id: 'Iliocostalis lumborum muscle.l', base: 'Iliocostalis lumborum muscle', system: 'muscular', nameVi: 'Cơ chậu sườn thắt lưng (Iliocostalis)' },
  'co chau suon': { id: 'Iliocostalis lumborum muscle.l', base: 'Iliocostalis lumborum muscle', system: 'muscular', nameVi: 'Cơ chậu sườn' },
  'iliocostalis': { id: 'Iliocostalis lumborum muscle.l', base: 'Iliocostalis lumborum muscle', system: 'muscular', nameVi: 'Cơ chậu sườn (Iliocostalis)' },
  'cơ gai': { id: 'Spinalis thoracis muscle.l', base: 'Spinalis thoracis muscle', system: 'muscular', nameVi: 'Cơ gai ngực (Spinalis)' },
  'co gai': { id: 'Spinalis thoracis muscle.l', base: 'Spinalis thoracis muscle', system: 'muscular', nameVi: 'Cơ gai' },
  'spinalis': { id: 'Spinalis thoracis muscle.l', base: 'Spinalis thoracis muscle', system: 'muscular', nameVi: 'Cơ gai (Spinalis)' },
  'cơ nhiều nhánh': { id: 'Multifidus lumborum muscle.l', base: 'Multifidus lumborum muscle', system: 'muscular', nameVi: 'Cơ nhiều nhánh thắt lưng (Multifidus)' },
  'cơ nhiều chân': { id: 'Multifidus lumborum muscle.l', base: 'Multifidus lumborum muscle', system: 'muscular', nameVi: 'Cơ nhiều nhánh thắt lưng (Multifidus)' },
  'co nhieu nhanh': { id: 'Multifidus lumborum muscle.l', base: 'Multifidus lumborum muscle', system: 'muscular', nameVi: 'Cơ nhiều nhánh' },
  'multifidus': { id: 'Multifidus lumborum muscle.l', base: 'Multifidus lumborum muscle', system: 'muscular', nameVi: 'Cơ nhiều nhánh (Multifidus)' },
  'cơ vuông thắt lưng': { id: 'Quadratus lumborum.l', base: 'Quadratus lumborum', system: 'muscular', nameVi: 'Cơ vuông thắt lưng' },
  'co vuong that lung': { id: 'Quadratus lumborum.l', base: 'Quadratus lumborum', system: 'muscular', nameVi: 'Cơ vuông thắt lưng' },
  'cơ nâng vai': { id: 'Levator scapulae.l', base: 'Levator scapulae', system: 'muscular', nameVi: 'Cơ nâng vai' },
  'co nang vai': { id: 'Levator scapulae.l', base: 'Levator scapulae', system: 'muscular', nameVi: 'Cơ nâng vai' },
  'cơ trám lớn': { id: 'Rhomboid major.l', base: 'Rhomboid major', system: 'muscular', nameVi: 'Cơ trám lớn' },
  'cơ trám': { id: 'Rhomboid major.l', base: 'Rhomboid major', system: 'muscular', nameVi: 'Cơ trám lớn' },
  'co tram': { id: 'Rhomboid major.l', base: 'Rhomboid major', system: 'muscular', nameVi: 'Cơ trám' },
  'cơ gối đầu': { id: 'Splenius capitis.l', base: 'Splenius capitis', system: 'muscular', nameVi: 'Cơ gối đầu' },
  'cơ bán gai': { id: 'Semispinalis thoracis muscle.l', base: 'Semispinalis thoracis muscle', system: 'muscular', nameVi: 'Cơ bán gai' },
  'cơ lưng rộng': { id: 'Latissimus dorsi muscle.l', base: 'Latissimus dorsi muscle', system: 'muscular', nameVi: 'Cơ lưng rộng (Cơ xô)' },
  'co lung rong': { id: 'Latissimus dorsi muscle.l', base: 'Latissimus dorsi muscle', system: 'muscular', nameVi: 'Cơ lưng rộng' },
  'cơ xô': { id: 'Latissimus dorsi muscle.l', base: 'Latissimus dorsi muscle', system: 'muscular', nameVi: 'Cơ lưng rộng (Cơ xô)' },
  'co xo': { id: 'Latissimus dorsi muscle.l', base: 'Latissimus dorsi muscle', system: 'muscular', nameVi: 'Cơ xô' },
  'cơ ức đòn chũm': { id: 'Sternocleidomastoid muscle.l', base: 'Sternocleidomastoid muscle', system: 'muscular', nameVi: 'Cơ ức đòn chũm' },
  'co uc don chum': { id: 'Sternocleidomastoid muscle.l', base: 'Sternocleidomastoid muscle', system: 'muscular', nameVi: 'Cơ ức đòn chũm' },
  'cơ bắp chân': { id: 'Medial head of gastrocnemius.l', base: 'Medial head of gastrocnemius', system: 'muscular', nameVi: 'Cơ bụng chân (Bắp chân)' },
  'co bap chan': { id: 'Medial head of gastrocnemius.l', base: 'Medial head of gastrocnemius', system: 'muscular', nameVi: 'Cơ bụng chân' },
  'cơ may': { id: 'Sartorius muscle.l', base: 'Sartorius muscle', system: 'muscular', nameVi: 'Cơ may (Sartorius)' },
  'co may': { id: 'Sartorius muscle.l', base: 'Sartorius muscle', system: 'muscular', nameVi: 'Cơ may' },
  'sartorius': { id: 'Sartorius muscle.l', base: 'Sartorius muscle', system: 'muscular', nameVi: 'Cơ may (Sartorius)' },
  'cơ hình lê': { id: 'Piriformis muscle.l', base: 'Piriformis muscle', system: 'muscular', nameVi: 'Cơ hình lê (Piriformis)' },
  'co hinh le': { id: 'Piriformis muscle.l', base: 'Piriformis muscle', system: 'muscular', nameVi: 'Cơ hình lê' },
  'cơ tháp chậu': { id: 'Piriformis muscle.l', base: 'Piriformis muscle', system: 'muscular', nameVi: 'Cơ hình lê (Piriformis)' },
  'co thap chau': { id: 'Piriformis muscle.l', base: 'Piriformis muscle', system: 'muscular', nameVi: 'Cơ hình lê' },
  'piriformis': { id: 'Piriformis muscle.l', base: 'Piriformis muscle', system: 'muscular', nameVi: 'Cơ hình lê (Piriformis)' },
  'cơ lưng': { id: 'Latissimus dorsi muscle.l', base: 'Latissimus dorsi muscle', system: 'muscular', nameVi: 'Cơ lưng rộng & Khối cơ cạnh sống' },
  'co lung': { id: 'Latissimus dorsi muscle.l', base: 'Latissimus dorsi muscle', system: 'muscular', nameVi: 'Cơ lưng' },

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
  'tim': { id: 'Left ventricle', base: 'Left ventricle', system: 'cardiovascular', nameVi: 'Trái tim (Tâm thất trái)' },
  'trái tim': { id: 'Left ventricle', base: 'Left ventricle', system: 'cardiovascular', nameVi: 'Trái tim (Tâm thất trái)' },
  'trai tim': { id: 'Left ventricle', base: 'Left ventricle', system: 'cardiovascular', nameVi: 'Trái tim' },
  'hệ tim mạch': { id: 'Left ventricle', base: 'Left ventricle', system: 'cardiovascular', nameVi: 'Hệ Tim mạch' },
  'he tim mach': { id: 'Left ventricle', base: 'Left ventricle', system: 'cardiovascular', nameVi: 'Hệ Tim mạch' },
  
  // Heart Chambers & Valves
  'tâm thất trái': { id: 'Left ventricle', base: 'Left ventricle', system: 'cardiovascular', nameVi: 'Tâm thất trái' },
  'tam that trai': { id: 'Left ventricle', base: 'Left ventricle', system: 'cardiovascular', nameVi: 'Tâm thất trái' },
  'thất trái': { id: 'Left ventricle', base: 'Left ventricle', system: 'cardiovascular', nameVi: 'Tâm thất trái' },
  'that trai': { id: 'Left ventricle', base: 'Left ventricle', system: 'cardiovascular', nameVi: 'Tâm thất trái' },
  'buồng thất trái': { id: 'Left ventricle', base: 'Left ventricle', system: 'cardiovascular', nameVi: 'Tâm thất trái' },
  
  'tâm thất phải': { id: 'Right ventricle', base: 'Right ventricle', system: 'cardiovascular', nameVi: 'Tâm thất phải' },
  'tam that phai': { id: 'Right ventricle', base: 'Right ventricle', system: 'cardiovascular', nameVi: 'Tâm thất phải' },
  'thất phải': { id: 'Right ventricle', base: 'Right ventricle', system: 'cardiovascular', nameVi: 'Tâm thất phải' },
  'that phai': { id: 'Right ventricle', base: 'Right ventricle', system: 'cardiovascular', nameVi: 'Tâm thất phải' },
  'buồng thất phải': { id: 'Right ventricle', base: 'Right ventricle', system: 'cardiovascular', nameVi: 'Tâm thất phải' },
  
  'tâm nhĩ trái': { id: 'Left atrium', base: 'Left atrium', system: 'cardiovascular', nameVi: 'Tâm nhĩ trái' },
  'tam nhi trai': { id: 'Left atrium', base: 'Left atrium', system: 'cardiovascular', nameVi: 'Tâm nhĩ trái' },
  'nhĩ trái': { id: 'Left atrium', base: 'Left atrium', system: 'cardiovascular', nameVi: 'Tâm nhĩ trái' },
  'nhi trai': { id: 'Left atrium', base: 'Left atrium', system: 'cardiovascular', nameVi: 'Tâm nhĩ trái' },
  
  'tâm nhĩ phải': { id: 'Right atrium', base: 'Right atrium', system: 'cardiovascular', nameVi: 'Tâm nhĩ phải' },
  'tam nhi phai': { id: 'Right atrium', base: 'Right atrium', system: 'cardiovascular', nameVi: 'Tâm nhĩ phải' },
  'nhĩ phải': { id: 'Right atrium', base: 'Right atrium', system: 'cardiovascular', nameVi: 'Tâm nhĩ phải' },
  'nhi phai': { id: 'Right atrium', base: 'Right atrium', system: 'cardiovascular', nameVi: 'Tâm nhĩ phải' },

  'van hai lá': { id: 'Posterior leaflet of left atrioventricular valve', base: 'Mitral valve', system: 'cardiovascular', nameVi: 'Van hai lá (Van nhĩ thất trái)' },
  'van 2 la': { id: 'Posterior leaflet of left atrioventricular valve', base: 'Mitral valve', system: 'cardiovascular', nameVi: 'Van hai lá' },
  'van ba lá': { id: 'Anterior leaflet of right atrioventricular valve', base: 'Tricuspid valve', system: 'cardiovascular', nameVi: 'Van ba lá (Van nhĩ thất phải)' },
  'van 3 la': { id: 'Anterior leaflet of right atrioventricular valve', base: 'Tricuspid valve', system: 'cardiovascular', nameVi: 'Van ba lá' },
  'van động mạch chủ': { id: 'Left coronary leaflet', base: 'Aortic valve', system: 'cardiovascular', nameVi: 'Van động mạch chủ' },
  'van dong mach chu': { id: 'Left coronary leaflet', base: 'Aortic valve', system: 'cardiovascular', nameVi: 'Van động mạch chủ' },
  'van động mạch phổi': { id: 'Anterior semilunar leaflet of pulmonary valve', base: 'Pulmonary valve', system: 'cardiovascular', nameVi: 'Van động mạch phổi' },

  // Carotid Arteries & Great Vessels
  'động mạch cảnh trong': { id: 'Internal carotid artery.l', base: 'Internal carotid artery', system: 'cardiovascular', nameVi: 'Động mạch cảnh trong' },
  'dong mach canh trong': { id: 'Internal carotid artery.l', base: 'Internal carotid artery', system: 'cardiovascular', nameVi: 'Động mạch cảnh trong' },
  'mạch cảnh trong': { id: 'Internal carotid artery.l', base: 'Internal carotid artery', system: 'cardiovascular', nameVi: 'Động mạch cảnh trong' },
  'mach canh trong': { id: 'Internal carotid artery.l', base: 'Internal carotid artery', system: 'cardiovascular', nameVi: 'Động mạch cảnh trong' },
  
  'động mạch cảnh ngoài': { id: 'External carotid artery.l', base: 'External carotid artery', system: 'cardiovascular', nameVi: 'Động mạch cảnh ngoài' },
  'dong mach canh ngoai': { id: 'External carotid artery.l', base: 'External carotid artery', system: 'cardiovascular', nameVi: 'Động mạch cảnh ngoài' },
  'mạch cảnh ngoài': { id: 'External carotid artery.l', base: 'External carotid artery', system: 'cardiovascular', nameVi: 'Động mạch cảnh ngoài' },
  'mach canh ngoai': { id: 'External carotid artery.l', base: 'External carotid artery', system: 'cardiovascular', nameVi: 'Động mạch cảnh ngoài' },
  
  'động mạch cảnh': { id: 'Internal carotid artery.l', base: 'Internal carotid artery', system: 'cardiovascular', nameVi: 'Động mạch cảnh' },
  'dong mach canh': { id: 'Internal carotid artery.l', base: 'Internal carotid artery', system: 'cardiovascular', nameVi: 'Động mạch cảnh' },
  'mạch cảnh': { id: 'Internal carotid artery.l', base: 'Internal carotid artery', system: 'cardiovascular', nameVi: 'Động mạch cảnh' },
  'động mạch cảnh chung': { id: 'Left common carotid artery', base: 'Left common carotid artery', system: 'cardiovascular', nameVi: 'Động mạch cảnh chung' },
  'dong mach canh chung': { id: 'Left common carotid artery', base: 'Left common carotid artery', system: 'cardiovascular', nameVi: 'Động mạch cảnh chung' },

  'động mạch chủ': { id: 'Ascending aorta', base: 'Ascending aorta', system: 'cardiovascular', nameVi: 'Động mạch chủ' },
  'dong mach chu': { id: 'Ascending aorta', base: 'Ascending aorta', system: 'cardiovascular', nameVi: 'Động mạch chủ' },
  'cung động mạch chủ': { id: 'Ascending aorta', base: 'Ascending aorta', system: 'cardiovascular', nameVi: 'Cung động mạch chủ' },
  'quai động mạch chủ': { id: 'Ascending aorta', base: 'Ascending aorta', system: 'cardiovascular', nameVi: 'Quai động mạch chủ' },
  'động mạch chủ bụng': { id: 'Abdominal aorta', base: 'Abdominal aorta', system: 'cardiovascular', nameVi: 'Động mạch chủ bụng' },
  'dong mach chu bung': { id: 'Abdominal aorta', base: 'Abdominal aorta', system: 'cardiovascular', nameVi: 'Động mạch chủ bụng' },
  'động mạch chủ ngực': { id: 'Thoracic aorta', base: 'Thoracic aorta', system: 'cardiovascular', nameVi: 'Động mạch chủ ngực' },

  'động mạch phổi': { id: 'Pulmonary trunk', base: 'Pulmonary trunk', system: 'cardiovascular', nameVi: 'Thân động mạch phổi' },
  'dong mach phoi': { id: 'Pulmonary trunk', base: 'Pulmonary trunk', system: 'cardiovascular', nameVi: 'Thân động mạch phổi' },
  'thân động mạch phổi': { id: 'Pulmonary trunk', base: 'Pulmonary trunk', system: 'cardiovascular', nameVi: 'Thân động mạch phổi' },

  'tĩnh mạch chủ trên': { id: 'Superior vena cava', base: 'Superior vena cava', system: 'cardiovascular', nameVi: 'Tĩnh mạch chủ trên' },
  'tinh mach chu tren': { id: 'Superior vena cava', base: 'Superior vena cava', system: 'cardiovascular', nameVi: 'Tĩnh mạch chủ trên' },
  'tĩnh mạch chủ dưới': { id: 'Inferior vena cava', base: 'Inferior vena cava', system: 'cardiovascular', nameVi: 'Tĩnh mạch chủ dưới' },
  'tinh mach chu duoi': { id: 'Inferior vena cava', base: 'Inferior vena cava', system: 'cardiovascular', nameVi: 'Tĩnh mạch chủ dưới' },

  // Respiratory & Lungs
  'phổi': { id: 'Superior lobe of left lung', base: 'Superior lobe of left lung', system: 'visceral', nameVi: 'Hai lá phổi' },
  'phoi': { id: 'Superior lobe of left lung', base: 'Superior lobe of left lung', system: 'visceral', nameVi: 'Hai lá phổi' },
  'lá phổi': { id: 'Superior lobe of left lung', base: 'Superior lobe of left lung', system: 'visceral', nameVi: 'Hai lá phổi' },
  'phổi trái': { id: 'Superior lobe of left lung', base: 'Superior lobe of left lung', system: 'visceral', nameVi: 'Lá phổi trái' },
  'phoi trai': { id: 'Superior lobe of left lung', base: 'Superior lobe of left lung', system: 'visceral', nameVi: 'Lá phổi trái' },
  'phổi phải': { id: 'Superior lobe of right lung', base: 'Superior lobe of right lung', system: 'visceral', nameVi: 'Lá phổi phải' },
  'phoi phai': { id: 'Superior lobe of right lung', base: 'Superior lobe of right lung', system: 'visceral', nameVi: 'Lá phổi phải' },
  'khí quản': { id: 'Trachea', base: 'Trachea', system: 'visceral', nameVi: 'Khí quản' },
  'khi quan': { id: 'Trachea', base: 'Trachea', system: 'visceral', nameVi: 'Khí quản' },
  'thực quản': { id: 'Esophagus', base: 'Esophagus', system: 'visceral', nameVi: 'Thực quản' },
  'thuc quan': { id: 'Esophagus', base: 'Esophagus', system: 'visceral', nameVi: 'Thực quản' },

  // Digestive & Urinary Organs
  'dạ dày': { id: 'Stomach', base: 'Stomach', system: 'visceral', nameVi: 'Dạ dày (Bao tử)' },
  'da day': { id: 'Stomach', base: 'Stomach', system: 'visceral', nameVi: 'Dạ dày (Bao tử)' },
  'bao tử': { id: 'Stomach', base: 'Stomach', system: 'visceral', nameVi: 'Dạ dày' },
  'bao tu': { id: 'Stomach', base: 'Stomach', system: 'visceral', nameVi: 'Dạ dày' },
  'gan': { id: 'Liver', base: 'Liver', system: 'visceral', nameVi: 'Lá gan' },
  'lá gan': { id: 'Liver', base: 'Liver', system: 'visceral', nameVi: 'Lá gan' },
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
  'lach': { id: 'Spleen', base: 'Spleen', system: 'lymphatic', nameVi: 'Lá lách' },

  // Kidneys & Urinary Tract
  'thận': { id: 'Kidney.l', base: 'Kidney', system: 'visceral', nameVi: 'Quả thận' },
  'than': { id: 'Kidney.l', base: 'Kidney', system: 'visceral', nameVi: 'Quả thận' },
  'quả thận': { id: 'Kidney.l', base: 'Kidney', system: 'visceral', nameVi: 'Quả thận' },
  'thận trái': { id: 'Kidney.l', base: 'Kidney', system: 'visceral', nameVi: 'Thận trái' },
  'than trai': { id: 'Kidney.l', base: 'Kidney', system: 'visceral', nameVi: 'Thận trái' },
  'thận phải': { id: 'Kidney.r', base: 'Kidney', system: 'visceral', nameVi: 'Thận phải' },
  'than phai': { id: 'Kidney.r', base: 'Kidney', system: 'visceral', nameVi: 'Thận phải' },
  'bể thận': { id: 'Renal pelvis.l', base: 'Renal pelvis', system: 'visceral', nameVi: 'Bể thận' },
  'be than': { id: 'Renal pelvis.l', base: 'Renal pelvis', system: 'visceral', nameVi: 'Bể thận' },
  'niệu quản': { id: 'Ureter.l', base: 'Ureter', system: 'visceral', nameVi: 'Niệu quản' },
  'nieu quan': { id: 'Ureter.l', base: 'Ureter', system: 'visceral', nameVi: 'Niệu quản' },
  'bàng quang': { id: 'Urinary bladder', base: 'Urinary bladder', system: 'visceral', nameVi: 'Bàng quang (Bọng đái)' },
  'bang quang': { id: 'Urinary bladder', base: 'Urinary bladder', system: 'visceral', nameVi: 'Bàng quang' },

  // Intestines
  'đại tràng': { id: 'Ascending colon', base: 'Colon', system: 'visceral', nameVi: 'Đại tràng (Ruột già)' },
  'dai trang': { id: 'Ascending colon', base: 'Colon', system: 'visceral', nameVi: 'Đại tràng' },
  'ruột già': { id: 'Ascending colon', base: 'Colon', system: 'visceral', nameVi: 'Đại tràng (Ruột già)' },
  'ruot gia': { id: 'Ascending colon', base: 'Colon', system: 'visceral', nameVi: 'Ruột già' },
  'ruột non': { id: 'Jejunum', base: 'Jejunum', system: 'visceral', nameVi: 'Ruột non' },
  'ruot non': { id: 'Jejunum', base: 'Jejunum', system: 'visceral', nameVi: 'Ruột non' },
  'ruột thừa': { id: 'Vermiform appendix', base: 'Vermiform appendix', system: 'visceral', nameVi: 'Ruột thừa' },
  'ruot thua': { id: 'Vermiform appendix', base: 'Vermiform appendix', system: 'visceral', nameVi: 'Ruột thừa' }
};

/**
 * Robust word-boundary matching for Vietnamese and alphanumeric terms
 * Prevents substring collisions like 'than' matching 'cơ thang'
 */
export function matchKeywordInText(text, keyword) {
  if (!text || !keyword) return false;
  const kw = keyword.toLowerCase().trim();
  const t = text.toLowerCase().trim();
  if (t === kw) return true;
  const escaped = kw.replace(/[\.\*\+\?\^\$\{\}\(\)\|\[\]\\]/g, '\\$&');
  const pattern = new RegExp('(?:^|[^a-z0-9àáạảãâầấậẩẫăằắặẳẵèéẹẻẽêềếệểễìíịỉĩòóọỏõôồốộổỗơờớợởỡùúụủũưừứựửữỳýỵỷỹđ])' + escaped + '(?:$|[^a-z0-9àáạảãâầấậẩẫăằắặẳẵèéẹẻẽêềếệểễìíịỉĩòóọỏõôồốộổỗơờớợởỡùúụủũưừứựửữỳýỵỷỹđ])', 'i');
  return pattern.test(t);
}

/**
 * Parses user input to extract semantic intent, target entities, and 3D action
 */
export function interpretAIQuery(query, activePart = null) {
  const q = query.toLowerCase().trim();

  // -1. Intent: Muscle Overview & Classification ("các loại cơ", "các nhóm cơ", "hệ cơ", "cơ bắp", "có những loại cơ nào")
  const isMuscleOverview = (
    q.includes('các loại cơ') ||
    q.includes('cac loai co') ||
    q.includes('các nhóm cơ') ||
    q.includes('cac nhom co') ||
    q.includes('hệ cơ') ||
    q.includes('he co') ||
    q.includes('hệ thống cơ') ||
    q.includes('he thong co') ||
    q.includes('các loại cơ bắp') ||
    q.includes('cac loai co bap') ||
    q.includes('có những loại cơ nào') ||
    q.includes('co nhung loai co nao') ||
    q.includes('phân loại cơ') ||
    q.includes('phan loai co') ||
    q.includes('nhóm cơ chính') ||
    q.includes('nhom co chinh') ||
    (q.includes('cơ bắp') && (q.includes('loại') || q.includes('nhóm') || q.includes('tổng quan') || q.includes('phân loại') || q.includes('những'))) ||
    q === 'các cơ' ||
    q === 'hệ cơ bắp' ||
    q === 'hệ cơ vân' ||
    q === 'cơ bắp'
  );

  if (isMuscleOverview) {
    return {
      intent: 'MUSCLE_OVERVIEW',
      rawQuery: query
    };
  }

  // -0.5 Direct Muscle Structure Priority:
  // If the query directly targets a specific muscle (e.g. "cơ thang", "cơ dọc sống lưng", "cơ delta"),
  // route directly to structure focus/Q&A so it never gets intercepted by clinical axes.
  const isExplicitAxisQuery = q.includes('trục') || q.includes('truc') || q.includes('chục') || q.includes('chuc') ||
                              q.includes('bộ ba') || q.includes('bo ba') || q.includes('bộ 3') || q.includes('bo 3') ||
                              q.includes('chuỗi') || q.includes('vòng tuần hoàn');

  const directStructure = findTargetStructure(q, activePart);
  const isMuscleTarget = directStructure && directStructure.system === 'muscular';

  if (isMuscleTarget && !isExplicitAxisQuery) {
    const isQuestion = q.includes('là gì') || q.includes('thế nào') || q.includes('chức năng') || q.includes('bệnh') || q.includes('triệu chứng') || q.includes('tại sao');
    return {
      intent: isQuestion ? 'CLINICAL_QNA' : 'FOCUS_STRUCTURE',
      target: directStructure,
      rawQuery: query
    };
  }

  // 0. Intent: Clinical Functional Axes (Trục lâm sàng / Bộ ba chức năng / Tuyến tiêu hóa / Dịch não tủy / Trục não ruột / Chục lão chuột)
  let targetAxis = null;
  if (
    q.includes('chục lão chuột') ||
    q.includes('chuc lao chuot') ||
    q.includes('chụp não ruột') ||
    q.includes('chup nao ruot') ||
    q.includes('chục não ruột') ||
    q.includes('chuc nao ruot') ||
    q.includes('chục não') ||
    q.includes('trục não ruột') ||
    q.includes('trục ruột não')
  ) {
    targetAxis = CLINICAL_AXES.find(a => a.id === 'axis_gut_brain');
  } else if (
    q.includes('gan mật tụy') ||
    q.includes('gân mà tự') ||
    q.includes('gan mat tuy') ||
    q.includes('bộ ba chức năng') ||
    q.includes('bo ba chuc nang') ||
    q.includes('bộ ba gan mật tụy') ||
    q.includes('bo ba gan mat tuy') ||
    q.includes('bộ ba') ||
    q.includes('bộ 3') ||
    q.includes('hệ gan mật') ||
    q.includes('gan mật và tụy')
  ) {
    targetAxis = CLINICAL_AXES.find(a => a.id === 'axis_hepatobiliary_pancreas');
  } else if (
    q.includes('tuyến tiêu hóa') ||
    q.includes('tuyen tieu hoa') ||
    q.includes('các tuyến tiêu hóa') ||
    q.includes('hệ tuyến tiêu hóa') ||
    q.includes('tất cả tuyến tiêu hóa') ||
    q.includes('tuyến nước bọt')
  ) {
    targetAxis = CLINICAL_AXES.find(a => a.id === 'axis_digestive_glands');
  } else if (
    q.includes('dịch não tủy') ||
    q.includes('dich nao tuy') ||
    q.includes('nước não tủy') ||
    q.includes('tuần hoàn dịch não tủy') ||
    q.includes('hệ thống não thất') ||
    q.includes('não úng thủy')
  ) {
    targetAxis = CLINICAL_AXES.find(a => a.id === 'axis_csf_ventricles');
  } else if (
    q.includes('nội tiết') ||
    q.includes('noi tiet') ||
    q.includes('tuyến yên') ||
    q.includes('tuyen yen') ||
    q.includes('tuyến giáp') ||
    q.includes('tuyen giap') ||
    q.includes('thượng thận') ||
    q.includes('thuong than') ||
    q.includes('tuyến cận giáp') ||
    q.includes('dưới đồi') ||
    q.includes('tuyến tùng') ||
    q.includes('hpa') ||
    q.includes('trục nội tiết')
  ) {
    targetAxis = CLINICAL_AXES.find(a => a.id === 'axis_hpa_endocrine');
  } else if (
    q.includes('tim thận') ||
    q.includes('tim than') ||
    q.includes('trục tim thận') ||
    q.includes('thận tim') ||
    q.includes('huyết áp') ||
    q.includes('huyet ap') ||
    q.includes('raas') ||
    q.includes('điều hòa huyết áp') ||
    q.includes('dieu hoa huyet ap')
  ) {
    targetAxis = CLINICAL_AXES.find(a => a.id === 'axis_renal_cardiovascular');
  } else {
    targetAxis = CLINICAL_AXES.find(axis => {
      return axis.keywords?.some(k => matchKeywordInText(q, k));
    });
  }

  if (targetAxis) {
    return {
      intent: 'CLINICAL_AXIS',
      axis: targetAxis,
      axisId: targetAxis.id,
      rawQuery: query
    };
  }

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
    .replace(/^(tìm|hãy tìm|chỉ|cho xem|cho tôi xem|hãy cho xem|xem|focus|định vị|vị trí của|vị trí|chỉ ra|hãy chỉ|hỏi về|thông tin về)\s+/i, '')
    .replace(/\s+(?:ở đâu|ở vị trí nào|nằm ở đâu|nằm ở chỗ nào|ở chỗ nào|là gì|như thế nào|ra sao|là cái gì)$/i, '')
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
  let searchResults = searchStructures(cleanQ);
  if (searchResults.length === 0 && q !== cleanQ) {
    searchResults = searchStructures(q);
  }
  if (searchResults.length > 0) {
    const first = searchResults[0];
    const targetPartId = first.sides?.none || first.sides?.left || first.sides?.right || (first.partIds && first.partIds[0]) || first.base;
    return {
      id: targetPartId,
      base: first.base,
      system: first.system,
      nameVi: first.label || first.base
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
  const { intent, target, rawQuery, hideSystems, showSystems, plane, axis } = interpreted;
  const activeViewer = viewer || state.viewer || (typeof window !== 'undefined' ? window.viewer : null);

  // 0. CLINICAL AXIS (Trục lâm sàng / Bộ ba chức năng / Tuyến tiêu hóa / Dịch não tủy / Trục não ruột)
  if (intent === 'CLINICAL_AXIS' && axis) {
    if (activeViewer) {
      const { openClinicalAxesModal, openMechanismSheet } = await import('../ui/clinicalAxesModal.js');
      await openClinicalAxesModal(axis.id, activeViewer);

      const qLower = (rawQuery || '').toLowerCase();
      if (
        qLower.includes('cơ chế') ||
        qLower.includes('giải thích') ||
        qLower.includes('chức năng') ||
        qLower.includes('tại sao') ||
        qLower.includes('như thế nào') ||
        qLower.includes('bộ ba') ||
        qLower.includes('đầy đủ') ||
        qLower.includes('ai')
      ) {
        openMechanismSheet();
      }
    }

    const stepsFormatted = axis.chainSteps.map(s => `- **${s.title}:** ${s.note}`).join('\n');
    const insightsFormatted = axis.clinicalInsights.map(qa => `> **❓ ${qa.question}**\n> 🩺 ${qa.explanation}`).join('\n\n');

    return {
      action: 'CLINICAL_AXIS',
      axisId: axis.id,
      actionBadge: `⚡ 3D: ${axis.titleVi.split('(')[0].trim()}`,
      speechText: `${axis.titleVi}. ${axis.summary}`,
      message: `
### ⚡ ${axis.titleVi}
*Latinh:* **${axis.latin}** | *Hệ cơ quan:* **${axis.category}**

📖 **Tổng quan & Cơ chế sinh học:**
${axis.summary}

🔗 **Các Mắt Xích Liên Hoàn Trong Hệ Thống:**
${stepsFormatted}

🩺 **Cơ Chế Lâm Sàng & Ứng Dụng Y Khoa:**
${insightsFormatted}

💡 *Chạm vào từng chip trên thanh điều khiển nổi bên dưới để phóng to & chiếu sáng từng cơ quan!*
      `.trim(),
      data: axis
    };
  }

  // 0.1 MUSCLE OVERVIEW (Tổng quan hệ cơ & các nhóm cơ trên 3D)
  if (intent === 'MUSCLE_OVERVIEW') {
    if (activeViewer) {
      if (!state.loadedSystems.includes('muscular')) {
        loadModel('muscular', activeViewer).catch(err => console.warn('Failed background load of muscular:', err));
      }
      showSystem('muscular');
      activeViewer.render();
    }

    const speechText = 'Hệ cơ cơ thể người gồm hơn 600 cơ, chia làm 3 loại mô: cơ vân, cơ trơn và cơ tim. Bạn có thể chọn xem các nhóm cơ lưng, vai gáy, chi trên và chi dưới trực tiếp trên mô hình 3D.';

    return {
      action: 'MUSCLE_OVERVIEW',
      actionBadge: '💪 AI: Đã kích hoạt 3D Hệ Cơ & Phân Loại Các Nhóm Cơ',
      speechText,
      message: `
### 💪 TỔNG QUAN HỆ CƠ & CÁC LOẠI CƠ TRONG CƠ THỂ
*Hệ vận động & Động lực học sinh học (Muscular System)*

---

### 🧬 1. PHÂN LOẠI 3 LOẠI MÔ CƠ SINH HỌC:
1. **Cơ Vân (Cơ Xương - Skeletal Muscle):**
   - **Cấu tạo & Vị trí:** Gồm hơn 600 cơ bám vào xương qua các gân sợi collagen; chiếm 40-50% trọng lượng cơ thể. Tế bào cơ vân có các dải sáng tối (Sarcomere) chứa protein Actin & Myosin.
   - **Phương thức hoạt động:** Vận động **chủ động theo ý muốn** dưới sự chỉ huy của vỏ não qua dây thần kinh sọ và dây thần kinh gai sống.
   - **Chức năng:** Tạo lực kéo di chuyển các khớp xương, giúp đi đứng, nâng vác, duy trì tư thế chống lại trọng lực và sinh nhiệt sưởi ấm cơ thể.

2. **Cơ Trơn (Smooth Muscle):**
   - **Cấu tạo & Vị trí:** Tế bào hình thoi đơn nhân không có vân ngang, nằm ở thành các cơ quan rỗng: ống tiêu hóa (dạ dày, ruột), phế quản phổi, thành mạch máu, bàng quang và tử cung.
   - **Phương thức hoạt động:** Hoạt động **hoàn toàn tự chủ vô thức**, do Hệ thần kinh tự chủ (Giao cảm / Đối giao cảm) và hormone điều hòa.
   - **Chức năng:** Tạo sóng nhu động đẩy thức ăn, điều chỉnh huyết áp qua co giãn lòng mạch, và kiểm soát lưu lượng khí thở.

3. **Cơ Tim (Cardiac Muscle - Myocardium):**
   - **Cấu tạo & Vị trí:** Chỉ hiện diện duy nhất tại thành quả tim. Tế bào cơ tim phân nhánh đan lưới qua các đĩa gian bào (Intercalated discs) giúp xung điện lan truyền đồng bộ tức thì.
   - **Phương thức hoạt động:** Co bóp **tự động liên tục 24/7** nhịp nhàng từ lúc phôi thai đến trọn đời nhờ hệ thống phát nhịp nội tại (Nút xoang).

---

### 🏋️ 2. NĂM NHÓM CƠ VẬN ĐỘNG CHÍNH TRÊN MÔ HÌNH 3D:
- **Khối Cơ Lưng & Cột Sống (Back & Spine Muscles):**
  - **Cơ thang (Trapezius):** Phủ kín cổ vai gáy và lưng trên; giữ vững bả vai và nâng đỡ cánh tay.
  - **Cơ dọc sống lưng / Dựng gai (Erector Spinae):** Chạy dọc hai bên cột sống từ chậu lên sọ (Cơ chậu sườn, Cơ cực dài, Cơ gai); giữ lưng thẳng đứng.
  - **Cơ lưng rộng (Latissimus dorsi - Cơ xô):** Kéo cánh tay ra sau và khép vào trong.
  - **Cơ lưng sâu (Multifidus):** Khóa vững từng đốt sống, ngăn ngừa chấn thương đĩa đệm.
- **Nhóm Cơ Đầu Mặt & Cổ:** Cơ ức đòn chũm, Cơ nâng vai, Cơ cắn nhai, Cơ biểu cảm nét mặt.
- **Nhóm Cơ Chi Trên (Vai & Cánh tay):** Cơ delta (dang vai), Cơ nhị đầu (gấp cẳng tay), Cơ tam đầu (duỗi khuỷu).
- **Nhóm Cơ Thân Mình (Ngực & Bụng):** Cơ ngực lớn, Cơ thẳng bụng (6 múi gập bụng), Cơ chéo bụng (xoay eo), Cơ hoành (hô hấp).
- **Nhóm Cơ Chi Dưới (Mông & Chân):** Cơ mông lớn (duỗi háng), Cơ tứ đầu đùi (duỗi gối), Cơ gân kheo (gấp gối), Cơ bụng chân (bắp chuối kiễng gót).

💡 *Bạn có thể bấm vào hoặc nói tên từng cơ cụ thể như: **"cơ thang"**, **"cơ dọc sống lưng"**, **"cơ delta"** để xem vị trí và chức năng chi tiết!*
      `.trim()
    };
  }

  // 1. FOCUS STRUCTURE
  if (intent === 'FOCUS_STRUCTURE' && target) {
    if (activeViewer) {
      const sys = target.system;
      if (sys && !state.loadedSystems.includes(sys)) {
        loadModel(sys, activeViewer).catch(err => console.warn('Failed background load of', sys, err));
      }
      if (sys) showSystem(sys);
      let selected = selectPartById(target.id, activeViewer);
      if (!selected && target.base) {
        selected = selectPartById(target.base, activeViewer) ||
                   selectPartById(target.base + '.l', activeViewer) ||
                   selectPartById(target.base + '.r', activeViewer);
      }
      activeViewer.render();
    }

    const clinical = getClinicalData(target.id, target.base);
    const displayName = clinical?.nameVi || target.nameVi || target.base || 'cấu trúc giải phẫu';

    const info = getStructureInfo(target.id) || getStructureInfo(target.base);
    const synthesizedPart = {
      id: target.id,
      meshName: target.base || target.id,
      displayName: displayName,
      system: target.system || info?.system || 'muscular',
      region: info?.region || 'unknown',
      info: {
        ...(info || {}),
        name: { vi: displayName, en: target.base || target.id },
        latinName: clinical?.nameLatin || target.base || target.id,
        system: target.system || info?.system || 'muscular'
      }
    };
    setSelectedPart(synthesizedPart);

    // Expand selection card on mobile/desktop so user sees detailed clinical information
    const card = document.getElementById('selectionCard');
    if (card) {
      card.classList.remove('hidden');
      window.dispatchEvent(new CustomEvent('expand-selection-card'));
    }

    return {
      action: 'FOCUS',
      actionBadge: `🎯 AI đã định vị & làm nổi bật: ${displayName}`,
      speechText: `Đã tìm thấy ${displayName}.`,
      message: `
        **${displayName}** *(Latin: ${clinical?.nameLatin || ''})*
        - **Hệ cơ quan:** ${clinical?.systemVi || target.system || 'Hệ giải phẫu'}
        - **Chức năng chính:** ${clinical?.function || 'Tham gia cấu tạo, vận động hoặc nâng đỡ sinh lý liên quan.'}
        - **Liên quan lâm sàng:** ${clinical?.clinical || 'Cần chú ý thăm khám và bảo vệ tránh tổn thương cơ học.'}
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

  // 9. AUGMENTED REALITY (AR - Deprecated / Streamlined)
  if (intent === 'AR_CONTROL') {
    return {
      action: 'NONE',
      actionBadge: '💡 Thông Báo Tính Năng',
      message: `
        ### 💡 Chế độ Quan sát 3D Chuyên Sâu
        Tính năng AR (thực tế tăng cường) đã được gỡ bỏ để tối ưu hiệu năng và độ nét cho mô hình giải phẫu 3D chuyên sâu trên nền tương phản cao.
        - Bạn có thể xoay 360°, phóng to/thu nhỏ và bóc tách các lớp giải phẫu mượt mà.
        - Sử dụng thanh công cụ để mở **Mặt cắt 3D**, **Thước đo**, **Chuyển động** hoặc làm **Trắc nghiệm**.
      `.trim()
    };
  }

  // 10. CLINICAL Q&A (Grounded Medical Knowledge)
  if (target) {
    const clinical = getClinicalData(target.id, target.base);
    const rel = clinical?.relations || {};
    const displayName = clinical?.nameVi || target.nameVi || target.base || 'Cấu trúc giải phẫu';

    let answerContent = '';
    const qLower = rawQuery.toLowerCase();

    if (qLower.includes('thần kinh') || qLower.includes('dây thần kinh')) {
      answerContent = `
        **Chi phối Thần kinh của ${displayName}:**
        ⚡ ${rel.nerves || 'Được chi phối bởi các nhánh thần kinh vận động và cảm giác khu vực.'}
      `.trim();
    } else if (qLower.includes('mạch máu') || qLower.includes('máu') || qLower.includes('động mạch')) {
      answerContent = `
        **Cấp máu & Tuần hoàn của ${displayName}:**
        🩸 ${rel.vessels || 'Được nuôi dưỡng bởi các nhánh động mạch và mạng mạch quanh vùng.'}
      `.trim();
    } else if (qLower.includes('cơ') || qLower.includes('bám')) {
      answerContent = `
        **Liên quan Cơ bắp của ${displayName}:**
        🔴 ${rel.muscles || 'Liên kết với các gân cơ phụ trách vận động và giữ vững tư thế.'}
      `.trim();
    } else if (qLower.includes('bệnh') || qLower.includes('chấn thương') || qLower.includes('đau')) {
      answerContent = `
        **Bệnh lý & Ý nghĩa Lâm sàng của ${displayName}:**
        🩺 ${clinical?.clinical || 'Cần chú ý bảo vệ trong sinh hoạt và vận động hàng ngày.'}
      `.trim();
    } else {
      // Full Academic Brief
      answerContent = `
### 📘 Thông Tin Học Thuật: ${displayName}
*Latinh (TA2):* **${clinical?.nameLatin || 'Chưa định danh'}** | *Tiếng Anh:* **${clinical?.nameEn || ''}**

⚡ **Chức năng & Cơ sinh học:**
${clinical?.function || 'Đóng vai trò quan trọng trong việc nâng đỡ cấu trúc, truyền lực cơ học hoặc tham gia điều hòa sinh lý cơ thể.'}

🔗 **4 Liên Quan Giải Phẫu Trọng Yếu:**
- 🔴 **Cơ liên quan:** ${rel.muscles || 'Gân cơ vận động chính.'}
- 🦴 **Xương & Khớp:** ${rel.bones || 'Tiếp khớp các diện xương kế cận.'}
- ⚡ **Thần kinh chi phối:** ${rel.nerves || 'Các nhánh thần kinh ngoại biên.'}
- 🩸 **Mạch máu cấp máu:** ${rel.vessels || 'Mạng mạch máu khu vực.'}

🩺 **Ý Nghĩa Lâm Sàng & Tổn Thương:**
${clinical?.clinical || 'Cần chú ý tránh va chạm hoặc tổn thương cơ học.'}
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
      - 🎯 **Ôn luyện điểm yếu:** Gõ *"ôn lại cấu trúc hay sai"* để mở bài kiểm tra thích ứng.
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
