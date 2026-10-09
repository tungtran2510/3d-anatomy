// Systems +/- Layer Stepper Controller (Complete Anatomy / Visible Body style)
// Allows gradual layer-by-layer opening and closing of each anatomical system.
// Features a collapsible left-edge pull tab: "Systems +/-"
// Supports half-step increments (0.5 nấc: ví dụ 0, 0.5, 1.0, 1.5, 2.0, 2.5, 3.0, 3.5, 4.0).
// Ultra-optimized for 60fps instant responsiveness with solid anatomical colors.

import { state, batchPartStates } from '../state/store.js';
import { loadModel } from '../viewer/loadModel.js';
import { showSystem, hideSystem, setStructureVisible } from '../viewer/visibility.js';
import { setView, frameRegion } from '../viewer/camera.js';
import { getSubSystemParts } from './sidebar.js';
import { getMeshesBySystem } from '../viewer/loadModel.js';
import { ICONS } from './icons.js';
import { suggestOfflineForSystem } from './offlinePrompt.js';
import { toggleBodyEnvelope, isBodyEnvelopeVisible, setBodyEnvelopeVisible, updateBodyEnvelopeAuto } from '../viewer/bodyEnvelope.js';
import { triggerHaptic } from '../viewer/engineManager.js';

export const SYSTEM_CONFIGS = [
  { id: 'skeletal', icon: ICONS.skeletal, nameVi: 'Hệ Xương', shortNameVi: 'XƯƠNG', maxLevels: 3, defaultLevel: 3, baseSystem: 'skeletal' },
  { id: 'joints', icon: ICONS.joints, nameVi: 'Khớp & Dây chằng', shortNameVi: 'KHỚP', maxLevels: 4, defaultLevel: 0, baseSystem: 'joints' },
  { id: 'muscular', icon: ICONS.muscular, nameVi: 'Hệ Cơ bắp', shortNameVi: 'CƠ BẮP', maxLevels: 4, defaultLevel: 0, baseSystem: 'muscular' },
  { id: 'nervous', icon: ICONS.nervous, nameVi: 'Não & Thần kinh', shortNameVi: 'THẦN KINH', maxLevels: 4, defaultLevel: 0, baseSystem: 'nervous' },
  { id: 'arterial', icon: ICONS.arterial, nameVi: 'Tim & Động mạch', shortNameVi: 'ĐỘNG MẠCH', maxLevels: 4, defaultLevel: 0, baseSystem: 'cardiovascular' },
  { id: 'venous', icon: ICONS.venous, nameVi: 'Hệ Tĩnh mạch', shortNameVi: 'TĨNH MẠCH', maxLevels: 4, defaultLevel: 0, baseSystem: 'cardiovascular' },
  { id: 'respiratory', icon: ICONS.respiratory, nameVi: 'Hệ Hô hấp (Phổi)', shortNameVi: 'HÔ HẤP', maxLevels: 4, defaultLevel: 0, baseSystem: 'visceral', subType: 'respiratory' },
  { id: 'digestive', icon: ICONS.digestive, nameVi: 'Hệ Tiêu hóa (Gan, Ruột)', shortNameVi: 'TIÊU HÓA', maxLevels: 4, defaultLevel: 0, baseSystem: 'visceral', subType: 'digestive' },
  { id: 'urinary_genital', icon: ICONS.urinary_genital, nameVi: 'Tiết niệu & Sinh dục', shortNameVi: 'TIẾT NIỆU', maxLevels: 4, defaultLevel: 0, baseSystem: 'visceral', subType: 'urinary_genital' },
  { id: 'endocrine', icon: ICONS.endocrine, nameVi: 'Hệ Nội tiết', shortNameVi: 'NỘI TIẾT', maxLevels: 4, defaultLevel: 0, baseSystem: 'visceral', subType: 'endocrine' },
  { id: 'lymphatic', icon: ICONS.lymphatic, nameVi: 'Hệ Bạch huyết', shortNameVi: 'BẠCH HUYẾT', maxLevels: 4, defaultLevel: 0, baseSystem: 'lymphatic' },
  { id: 'integumentary', icon: ICONS.integumentary, nameVi: 'Hệ Da (Lớp da người)', shortNameVi: 'HỆ DA', maxLevels: 2, defaultLevel: 0, baseSystem: 'integumentary' }
];

export const systemLevels = {
  skeletal: 3.0,
  joints: 0,
  muscular: 0,
  nervous: 0,
  arterial: 0,
  venous: 0,
  respiratory: 0,
  digestive: 0,
  urinary_genital: 0,
  endocrine: 0,
  lymphatic: 0,
  integumentary: 0
};

// -----------------------------------------------------------------------------
// VENOUS SYSTEM DISSECTION LAYERS (8 nấc bóc tách từ 0.5 đến 4.0)
// -----------------------------------------------------------------------------
const VEIN_05 = [
  'inferior vena cava', 'superior vena cava', 'external iliac vein', 'common iliac vein',
  'femoral vein', 'subclavian vein', 'brachiocephalic vein', 'internal jugular vein'
];
const VEIN_10 = [
  ...VEIN_05,
  'renal vein', 'hepatic vein', 'portal vein', 'splenic vein', 'azygos', 'hemiazygos',
  'internal iliac vein', 'deep femoral vein'
];
const VEIN_15 = [
  ...VEIN_10,
  'axillary vein', 'brachial vein', 'basilic vein', 'cephalic vein',
  'popliteal vein', 'great saphenous vein'
];
const VEIN_20 = [
  ...VEIN_15,
  'small saphenous vein', 'anterior tibial vein', 'posterior tibial vein',
  'pulmonary vein', 'mesenteric vein', 'gastric vein', 'vertebral vein'
];
const VEIN_25 = [
  ...VEIN_20,
  'radial vein', 'ulnar vein', 'fibular vein', 'peroneal vein',
  'intercostal vein', 'facial vein', 'temporal vein', 'sigmoid sinus', 'transverse sinus'
];
const VEIN_30 = [
  ...VEIN_25,
  'palmar venous', 'plantar venous', 'dorsal venous arch', 'sagittal sinus',
  'cavernous sinus', 'thyroid vein', 'sinus'
];
const VEIN_35 = [
  ...VEIN_30,
  'digital vein', 'metacarpal vein', 'metatarsal vein'
];

export function isVeinVisibleAtLevel(partIdLower, level) {
  if (level <= 0) return false;
  if (level >= 4.0) return true;
  if (level <= 0.5) return VEIN_05.some(kw => partIdLower.includes(kw));
  if (level <= 1.0) return VEIN_10.some(kw => partIdLower.includes(kw));
  if (level <= 1.5) return VEIN_15.some(kw => partIdLower.includes(kw));
  if (level <= 2.0) return VEIN_20.some(kw => partIdLower.includes(kw));
  if (level <= 2.5) return VEIN_25.some(kw => partIdLower.includes(kw));
  if (level <= 3.0) return VEIN_30.some(kw => partIdLower.includes(kw));
  if (level <= 3.5) return VEIN_35.some(kw => partIdLower.includes(kw));
  return true;
}

// -----------------------------------------------------------------------------
// ARTERIAL & HEART DISSECTION LAYERS (8 nấc bóc tách từ 0.5 đến 4.0)
// -----------------------------------------------------------------------------
const ARTERY_05 = [
  'heart', 'atrium', 'ventricle', 'myocard', 'endocard', 'valve', 'ascending aorta',
  'aortic arch', 'pulmonary trunk', 'coronary'
];
const ARTERY_10 = [
  ...ARTERY_05,
  'descending aorta', 'thoracic aorta', 'abdominal aorta', 'aorta',
  'common iliac artery', 'common carotid', 'subclavian artery', 'celiac trunk',
  'brachiocephalic trunk'
];
const ARTERY_15 = [
  ...ARTERY_10,
  'renal artery', 'mesenteric artery', 'internal iliac', 'external iliac',
  'femoral artery', 'axillary artery', 'brachial artery'
];
const ARTERY_20 = [
  ...ARTERY_15,
  'deep femoral', 'popliteal artery', 'internal carotid', 'external carotid',
  'vertebral artery', 'splenic artery', 'hepatic artery', 'gastric artery'
];
const ARTERY_25 = [
  ...ARTERY_20,
  'radial artery', 'ulnar artery', 'tibial artery', 'fibular artery',
  'peroneal artery', 'intercostal artery', 'basilar artery', 'cerebral artery'
];
const ARTERY_30 = [
  ...ARTERY_25,
  'palmar arch', 'plantar artery', 'dorsalis pedis', 'facial artery',
  'maxillary artery', 'temporal artery'
];
const ARTERY_35 = [
  ...ARTERY_30,
  'digital artery', 'metacarpal artery', 'metatarsal artery'
];

export function isArteryVisibleAtLevel(partIdLower, level) {
  if (level <= 0) return false;
  if (level >= 4.0) return true;
  if (level <= 0.5) return ARTERY_05.some(kw => partIdLower.includes(kw));
  if (level <= 1.0) return ARTERY_10.some(kw => partIdLower.includes(kw));
  if (level <= 1.5) return ARTERY_15.some(kw => partIdLower.includes(kw));
  if (level <= 2.0) return ARTERY_20.some(kw => partIdLower.includes(kw));
  if (level <= 2.5) return ARTERY_25.some(kw => partIdLower.includes(kw));
  if (level <= 3.0) return ARTERY_30.some(kw => partIdLower.includes(kw));
  if (level <= 3.5) return ARTERY_35.some(kw => partIdLower.includes(kw));
  return true;
}

// -----------------------------------------------------------------------------
// RESPIRATORY SYSTEM DISSECTION LAYERS (8 nấc bóc tách từ 0.5 đến 4.0)
// Chuẩn Y khoa đối chiếu trực tiếp từ Visible Body Atlas:
// Level 4.0 (■■■■): Màng phổi bán trong suốt (Pleura) bao bọc hai lá phổi
// Level 3.0 (■■■_): Bóc màng phổi, để lộ toàn bộ 5 thùy nhu mô phổi (Lungs parenchyma)
// Level 2.0 (■■__): Bóc nhu mô phổi, để lộ toàn bộ cây phế quản phân nhánh (Bronchial tree)
// Level 1.0 (■___): Bóc phế quản nhỏ, chỉ giữ lại Khí quản (Trachea) & Phế quản chính (Main bronchi) & Thanh quản
// Level 0.5: Chỉ còn Khí quản (Trachea) & sụn nắp thanh môn (Epiglottis)
// Level 0.0 (____): Ẩn hoàn toàn hệ hô hấp
// -----------------------------------------------------------------------------
export function isRespiratoryVisibleAtLevel(partIdLower, level) {
  if (level <= 0) return false;

  // 1. Màng phổi (Pleura): chỉ xuất hiện ở nấc cao nhất (Level 3.5 - 4.0)
  if (partIdLower.includes('pleura') || partIdLower.includes('màng phổi')) {
    return level >= 3.5;
  }

  // 2. Nhu mô phổi (Lung Lobes Parenchyma: 5 thùy phổi)
  const isLungParenchyma = partIdLower.includes('lobe of') || (partIdLower.includes('lung') && !partIdLower.includes('bronch'));
  if (isLungParenchyma) {
    if (level < 2.5) return false;
    if (level <= 2.5) return partIdLower.includes('right lung');
    return true;
  }

  // 3. Phân thùy phế quản nhỏ (Segmental Bronchi)
  const isSegmental = partIdLower.includes('segmental') || 
    /\b(b[ivx]+(\+b[ivx]+)?)\b/i.test(partIdLower) ||
    partIdLower.includes('lingular');
  if (isSegmental) {
    return level >= 2.0;
  }

  // 4. Phế quản thùy & trung gian (Lobar & Intermediate Bronchi)
  const isLobar = partIdLower.includes('lobar bronchus') || partIdLower.includes('intermediate bronchus');
  if (isLobar) {
    return level >= 1.5;
  }

  // 5. Phế quản chính (Left & Right Main Bronchus)
  if (partIdLower.includes('main bronchus')) {
    return level >= 1.0;
  }

  // 6. Khí quản, Thanh quản & đường hô hấp trên (Trachea, Epiglottis, Pharynx, Nasal mucosa)
  return level >= 0.5;
}

export function getRespiratoryParts() {
  const sidebarParts = getSubSystemParts('respiratory');
  if (sidebarParts && sidebarParts.length > 0) return sidebarParts;

  const nodes = getMeshesBySystem('visceral') || [];
  return nodes
    .map(n => n.userData?.partId)
    .filter(name => {
      if (!name) return false;
      const lower = name.toLowerCase();
      return lower.includes('bronch') || lower.includes('lung') || lower.includes('trachea') || 
             lower.includes('pleura') || lower.includes('nasal') || lower.includes('pharynx') || 
             lower.includes('epiglottis');
    });
}

export function getVisceralSubType(partIdLower) {
  if (partIdLower.includes('bronch') || partIdLower.includes('lung') || partIdLower.includes('trachea') || 
      partIdLower.includes('pleura') || partIdLower.includes('nasal') || partIdLower.includes('pharynx') || 
      partIdLower.includes('epiglottis')) {
    return 'respiratory';
  }
  if (partIdLower.includes('colon') || partIdLower.includes('liver') || partIdLower.includes('pancrea') || 
      partIdLower.includes('stomach') || partIdLower.includes('duodenum') || partIdLower.includes('jejunum') || 
      partIdLower.includes('appendix') || partIdLower.includes('bile') || partIdLower.includes('gallbladder') || 
      partIdLower.includes('esophagus') || partIdLower.includes('oesophagus') || partIdLower.includes('parotid') || 
      partIdLower.includes('sublingual') || partIdLower.includes('submandibular') || partIdLower.includes('gingiva') || 
      partIdLower.includes('tongue') || partIdLower.includes('palate') || partIdLower.includes('omentum') || 
      partIdLower.includes('taenia') || partIdLower.includes('meso')) {
    return 'digestive';
  }
  if ((partIdLower.includes('kidney') || partIdLower.includes('bladder') || partIdLower.includes('ureter') || 
       partIdLower.includes('urethra') || partIdLower.includes('renal') || partIdLower.includes('penis') || 
       partIdLower.includes('prostate') || partIdLower.includes('testis') || partIdLower.includes('seminal') || 
       partIdLower.includes('deferens') || partIdLower.includes('epididymis') || partIdLower.includes('ejaculatory')) &&
      !partIdLower.includes('gallbladder') && !partIdLower.includes('suprarenal')) {
    return 'urinary_genital';
  }
  if (partIdLower.includes('thyroid') || partIdLower.includes('suprarenal') || partIdLower.includes('hypophysis') || 
      partIdLower.includes('pineal')) {
    return 'endocrine';
  }
  return null;
}

// -----------------------------------------------------------------------------
// DIGESTIVE SYSTEM DISSECTION LAYERS (8 nấc bóc tách từ 0.5 đến 4.0)
// Chuẩn Y khoa đối chiếu trực tiếp từ Visible Body Atlas:
// Level 4.0 (■■■■): Mạc nối lớn (Greater Omentum) phủ kín toàn bộ ổ bụng (Ảnh 1)
// Level 3.0 (■■■_): Bóc mạc nối, lộ toàn bộ Gan, Túi mật, Dạ dày, Khung Đại tràng, Ruột non (Ảnh 2)
// Level 2.0 (■■__): Bóc toàn bộ Gan & Túi mật; bộc lộ trọn vẹn Dạ dày, Tụy, Khung Đại tràng, Ruột non (Ảnh 3)
// Level 1.0 (■___): Bóc toàn bộ Khung Đại tràng; chỉ còn Dạ dày, Tá tràng, Ruột non trung tâm & Thực quản (Ảnh 4)
// Level 0.5: Bóc Ruột non (Jejunum), chỉ giữ lại trục Dạ dày - Tá tràng - Tụy & Thực quản
// Level 0.0 (____): Ẩn hoàn toàn hệ tiêu hóa
// -----------------------------------------------------------------------------
export function isDigestiveVisibleAtLevel(partIdLower, level) {
  if (level <= 0) return false;

  // 1. Mạc nối lớn & mạc treo (Greater / Lesser Omentum, Mesentery): Level 3.5 - 4.0 (Ảnh 1)
  if (partIdLower.includes('omentum') || partIdLower.includes('meso')) {
    return level >= 3.5;
  }

  // 2. Gan, Túi mật, Đường mật (Liver, Gallbladder, Bile duct): Level 2.5 - 4.0 (Bóc tách sạch ở Level 2.0 - Ảnh 3)
  const isBiliaryLiver = partIdLower.includes('liver') || partIdLower.includes('gallbladder') || 
                        partIdLower.includes('bile') || partIdLower.includes('gan') || partIdLower.includes('mật');
  if (isBiliaryLiver) {
    return level >= 2.5;
  }

  // 3. Khung Đại tràng & Ruột thừa & Dải cơ (Colon, Appendix, Taeniae): Level 1.5 - 4.0 (Bóc tách sạch ở Level 1.0 - Ảnh 4)
  const isColon = partIdLower.includes('colon') || partIdLower.includes('appendix') || 
                  partIdLower.includes('taenia') || partIdLower.includes('đại tràng') || 
                  partIdLower.includes('ruột già') || partIdLower.includes('ruột thừa');
  if (isColon) {
    return level >= 1.5;
  }

  // 4. Ruột non hỗng tràng (Jejunum loops): Level 1.0 - 4.0 (Ảnh 4)
  if (partIdLower.includes('jejunum') || partIdLower.includes('hỗng tràng')) {
    return level >= 1.0;
  }

  // 5. Trục tiêu hóa trung tâm cốt lõi: Thực quản, Dạ dày, Tá tràng, Tụy & Khoang miệng: Level >= 0.5
  return level >= 0.5;
}

// -----------------------------------------------------------------------------
// URINARY & GENITAL DISSECTION LAYERS (8 nấc bóc tách từ 0.5 đến 4.0)
// Chuẩn Y khoa đối chiếu trực tiếp từ Visible Body Atlas:
// Level 4.0 (■■■■): Thận + Bàng quang + Cơ quan sinh dục ngoài đầy đủ (Dương vật, Bao quy đầu, Bìu) (Ảnh 3)
// Level 3.0 (■■■_): Bóc tách lớp da ngoài; lộ thể hang, thể xốp, quy đầu, tinh hoàn, mào tinh (Ảnh 4)
// Level 2.0 (■■__): Bóc toàn bộ thân dương vật; lộ Tinh hoàn treo, Mào tinh, Ống dẫn tinh, Tuyến tiền liệt (Ảnh 2)
// Level 1.0 (■___): Bóc sạch toàn bộ cơ quan sinh dục; chỉ còn Hệ Tiết niệu: Thận, Bể thận, Niệu quản, Bàng quang (Ảnh 1)
// Level 0.5: Bóc nhu mô thận, chỉ còn Bể thận (Renal pelvis), Niệu quản & Bàng quang
// Level 0.0 (____): Ẩn hoàn toàn hệ tiết niệu & sinh dục
// -----------------------------------------------------------------------------
export function isUrinaryGenitalVisibleAtLevel(partIdLower, level) {
  if (level <= 0) return false;

  // 1. Thân dương vật & cấu trúc cương (Corpus cavernosum, spongiosum, glans penis): Level >= 2.5 (Level 3.0 & 4.0 - Ảnh 3 & 4)
  const isErectilePenis = partIdLower.includes('cavernosum') || partIdLower.includes('spongiosum') || 
                         partIdLower.includes('glans penis') || (partIdLower.includes('penis') && !partIdLower.includes('bulb'));
  if (isErectilePenis) {
    return level >= 2.5;
  }

  // 2. Cơ quan sinh dục trong: Tinh hoàn, Mào tinh, Ống dẫn tinh, Túi tinh, Tuyến tiền liệt: Level >= 1.5 (Level 2.0 - Ảnh 2)
  const isInternalGenital = partIdLower.includes('testis') || partIdLower.includes('epididymis') || 
                           partIdLower.includes('deferens') || partIdLower.includes('seminal') || 
                           partIdLower.includes('prostate') || partIdLower.includes('ejaculatory') ||
                           partIdLower.includes('tinh hoàn') || partIdLower.includes('mào tinh') || 
                           partIdLower.includes('tiền liệt');
  if (isInternalGenital) {
    return level >= 1.5;
  }

  // 3. Vỏ nhu mô thận (Kidney parenchyma): Level >= 1.0 (Ảnh 1)
  const isKidneyCortex = (partIdLower.includes('kidney') || partIdLower.includes('thận')) && !partIdLower.includes('pelvis');
  if (isKidneyCortex) {
    return level >= 1.0;
  }

  // 4. Hệ tiết niệu cốt lõi: Bể thận (Renal pelvis), Niệu quản (Ureter), Bàng quang (Bladder), Niệu đạo (Urethra)
  return level >= 0.5;
}

// -----------------------------------------------------------------------------
// LYMPHATIC DISSECTION LAYERS (8 nấc bóc tách từ 0.5 đến 4.0)
// Chuẩn Y khoa đối chiếu trực tiếp từ Visible Body Atlas:
// Level 4.0 (■■■■): Toàn bộ mạng lưới hạch & mạch nông/sâu khắp cơ thể tới tận đầu chi (Ảnh 4)
// Level 3.0 (■■■_): Mạng lưới trung gian: Hạch bẹn, hạch nách, hạch dưới hàm, hạch khoeo (Ảnh 1)
// Level 2.0 (■■__): Mạng lưới sâu thân mình & gốc chi: Hạch trung thất, liên sườn, rễ mạc treo, chậu sâu, nách sâu (Ảnh 3)
// Level 1.0 (■___): Cơ quan lympho tiên phát & thân bạch huyết trung tâm: Lá lách, Tuyến ức, Amidan, Hạch quanh ĐM/TM chủ (Ảnh 2)
// Level 0.5: Chỉ còn 2 cơ quan lympho lớn nhất: Lá lách (Spleen) & Tuyến ức (Thymus)
// Level 0.0 (____): Ẩn hoàn toàn hệ bạch huyết
// -----------------------------------------------------------------------------
export function isLymphaticVisibleAtLevel(partIdLower, level) {
  if (level <= 0) return false;

  // 1. Distal Extremities & Superficial Craniofacial (Level 4.0 - Ảnh 4)
  // Tibial, Fibular, Cubital, Supratrochlear, Superficial Craniofacial (Bucinator, Nasolabial, Mandibular, Mastoid, Occipital, Parotid, Auricular, Superficial inguinal)
  const isDistalOrSuperficial = 
    partIdLower.includes('tibial') || partIdLower.includes('fibular') || 
    partIdLower.includes('cubital') || partIdLower.includes('supratrochlear') ||
    partIdLower.includes('bucinator') || partIdLower.includes('nasolabial') ||
    partIdLower.includes('mandibular node') || partIdLower.includes('mastoid') ||
    partIdLower.includes('occipital') || partIdLower.includes('parotid') ||
    partIdLower.includes('auricular') || partIdLower.includes('superficial parotid') ||
    partIdLower.includes('superficial lateral cervical') ||
    partIdLower.includes('superficial inguinal');
  
  if (isDistalOrSuperficial) {
    if (partIdLower.includes('tibial') || partIdLower.includes('fibular') || 
        partIdLower.includes('bucinator') || partIdLower.includes('nasolabial') ||
        partIdLower.includes('mandibular node') || partIdLower.includes('mastoid') ||
        partIdLower.includes('occipital') || partIdLower.includes('parotid') ||
        partIdLower.includes('auricular') || partIdLower.includes('superficial lateral cervical')) {
      return level >= 4.0;
    }
    return level >= 3.5;
  }

  // 2. Intermediate Mesenteric, Intermediate Inguinal, Axillary, Popliteal, Submandibular/Submental (Level 3.0 - Ảnh 1)
  const isIntermediate = 
    partIdLower.includes('deep inguinal') || partIdLower.includes('lacunar') ||
    partIdLower.includes('popliteal') || partIdLower.includes('brachial') ||
    partIdLower.includes('submandibular') || partIdLower.includes('submental') ||
    partIdLower.includes('thyroid node') || partIdLower.includes('anterior inferior jugular') ||
    partIdLower.includes('lateral superior jugular') || partIdLower.includes('superficial anterior cervical') ||
    partIdLower.includes('mesenter') || partIdLower.includes('colic') ||
    partIdLower.includes('appendicular') || partIdLower.includes('caecal') ||
    partIdLower.includes('sigmoid') ||
    partIdLower.includes('epigastric') || partIdLower.includes('supraclavicular') ||
    partIdLower.includes('infraclavicular') || partIdLower.includes('interpectoral') ||
    (partIdLower.includes('axillary') && (partIdLower.includes('anterior') || partIdLower.includes('lateral') || partIdLower.includes('posterior')));

  if (isIntermediate) {
    if (partIdLower.includes('deep inguinal') || partIdLower.includes('lacunar') ||
        partIdLower.includes('popliteal') || partIdLower.includes('brachial') ||
        partIdLower.includes('submandibular') || partIdLower.includes('submental') ||
        partIdLower.includes('thyroid node') || partIdLower.includes('anterior inferior jugular') ||
        partIdLower.includes('lateral superior jugular') || partIdLower.includes('superficial anterior cervical')) {
      return level >= 3.0;
    }
    return level >= 2.5;
  }

  // 3. Deep Mediastinal, Intercostal, Deep Cervical, Visceral Gastric/Hepatic/Pancreatic, Deep Pelvic, Deep Central Axillary (Level 2.0 - Ảnh 3)
  const isDeepRegional = 
    partIdLower.includes('intercostal') || partIdLower.includes('parasternal') ||
    partIdLower.includes('tracheo') || partIdLower.includes('bronch') ||
    partIdLower.includes('oesophageal') || partIdLower.includes('pericardial') ||
    partIdLower.includes('azygos') || partIdLower.includes('arteriosum') ||
    partIdLower.includes('brachiocephalic') || partIdLower.includes('intrapulmonary') ||
    partIdLower.includes('diaphragmatic') || partIdLower.includes('pretracheal') ||
    partIdLower.includes('paratracheal') || partIdLower.includes('retropharyngeal') ||
    partIdLower.includes('jugulodigastric') || partIdLower.includes('deep lateral cervical') ||
    partIdLower.includes('coeliac') || partIdLower.includes('cystic node') ||
    partIdLower.includes('gastric') || partIdLower.includes('omental') || partIdLower.includes('pyloric') ||
    partIdLower.includes('pancreatic') || partIdLower.includes('splenic node') ||
    partIdLower.includes('iliac') || partIdLower.includes('sacral') ||
    partIdLower.includes('obturator') || partIdLower.includes('pararectal') ||
    partIdLower.includes('vesical') || partIdLower.includes('gluteal') ||
    (partIdLower.includes('axillary') && (partIdLower.includes('apical') || partIdLower.includes('central')));

  if (isDeepRegional) {
    if (partIdLower.includes('intercostal') || partIdLower.includes('parasternal') ||
        partIdLower.includes('deep lateral cervical') || partIdLower.includes('retropharyngeal') ||
        partIdLower.includes('jugulodigastric') || partIdLower.includes('coeliac') ||
        partIdLower.includes('gastric') || partIdLower.includes('omental') || partIdLower.includes('pyloric') ||
        partIdLower.includes('pancreatic') || partIdLower.includes('splenic node') ||
        partIdLower.includes('iliac') || partIdLower.includes('sacral') ||
        partIdLower.includes('obturator') || partIdLower.includes('pararectal') ||
        partIdLower.includes('vesical') || partIdLower.includes('gluteal') ||
        partIdLower.includes('axillary')) {
      return level >= 2.0;
    }
    return level >= 1.5;
  }

  // 4. Primary Lymphoid Organs & Central Trunks (Level 1.0 - Ảnh 2)
  // Spleen, Thymus, Tonsils, Central Aortic/Caval/Lumbar trunks along spine
  if (partIdLower.includes('aortic') || partIdLower.includes('caval') || 
      partIdLower.includes('lumbar node') || partIdLower.includes('prevertebral') ||
      partIdLower.includes('tonsil') || partIdLower.includes('amidan')) {
    return level >= 1.0;
  }

  // Level 0.5: Spleen (Lá lách) & Thymus (Tuyến ức)
  const isPrimaryOrgan = partIdLower.includes('spleen') || partIdLower.includes('lá lách') || 
                        partIdLower.includes('thymus') || partIdLower.includes('tuyến ức');
  if (isPrimaryOrgan) {
    return level >= 0.5;
  }

  return level >= 2.0;
}

// -----------------------------------------------------------------------------
// MUSCULAR 3-TIER + SUB-STEP DISSECTION (8 nấc bóc tách từ 0.5 đến 4.0)
// -----------------------------------------------------------------------------
const SUPERFICIAL_PATTERNS = [
  'fascia', 'retinaculum', 'aponeurosis', 'mạc', 'cân',
  'platysma', 'cơ bám da cổ',
  'pectoralis major', 'ngực lớn',
  'deltoid', 'cơ delta',
  'rectus abdominis', 'thẳng bụng',
  'external abdominal oblique', 'external oblique', 'chéo bụng ngoài',
  'trapezius', 'cơ thang',
  'latissimus dorsi', 'latissimus', 'lưng rộng',
  'gluteus maximus', 'mông lớn',
  'gastrocnemius', 'bụng chân',
  'biceps brachii', 'nhị đầu cánh tay',
  'sartorius', 'cơ may',
  'tensor fasciae latae', 'căng mạc đùi',
  'gracilis', 'cơ thon',
  'orbicularis oris', 'orbicularis oculi', 'zygomaticus', 'risorius',
  'frontalis', 'occipitalis',
  'brachioradialis', 'cánh tay quay',
  'pronator teres', 'sấp tròn',
  'flexor carpi radialis', 'flexor carpi ulnaris', 'palmaris longus',
  'extensor carpi radialis', 'extensor digitorum', 'extensor digiti minimi',
  'extensor carpi ulnaris', 'tibialis anterior', 'chày trước',
  'fibularis longus', 'peroneus longus', 'mác dài',
  'sternocleidomastoid', 'ức đòn chũm'
];

const INTERMEDIATE_PATTERNS = [
  'pectoralis minor', 'ngực bé',
  'subclavius', 'dưới đòn',
  'internal abdominal oblique', 'internal oblique', 'chéo bụng trong',
  'rhomboid', 'cơ trám',
  'levator scapulae', 'nâng vai',
  'serratus anterior', 'răng trước',
  'serratus posterior', 'răng sau',
  'infraspinatus', 'dưới gai',
  'supraspinatus', 'trên gai',
  'teres major', 'tròn lớn',
  'teres minor', 'tròn bé',
  'gluteus medius', 'mông nhỡ',
  'rectus femoris', 'thẳng đùi',
  'vastus lateralis', 'rộng ngoài',
  'vastus medialis', 'rộng trong',
  'vastus intermedius', 'rộng giữa',
  'semitendinosus', 'bán gân',
  'semimembranosus', 'bán màng',
  'biceps femoris', 'nhị đầu đùi',
  'soleus', 'cơ dép',
  'plantaris', 'gan chân gầy',
  'brachialis', 'cánh tay',
  'coracobrachialis', 'quạ cánh tay',
  'triceps brachii', 'tam đầu cánh tay',
  'anconeus', 'cơ khuỷu',
  'flexor digitorum superficialis', 'gấp các ngón nông',
  'extensor digitorum longus', 'duỗi các ngón dài',
  'extensor hallucis longus', 'duỗi ngón cái dài',
  'masseter', 'cơ cắn',
  'temporalis', 'cơ thái dương',
  'buccinator', 'cơ mút',
  'scalenus', 'scalene', 'cơ bậc thang',
  'splenius', 'cơ gối',
  'omohyoid', 'vai móng',
  'sternohyoid', 'ức móng',
  'sternothyroid', 'ức giáp',
  'pectineus', 'cơ lược',
  'adductor longus', 'khép dài',
  'adductor brevis', 'khép ngắn',
  'erector spinae', 'dựng gai sống',
  'iliocostalis', 'chậu sườn',
  'longissimus', 'cực dài',
  'spinalis', 'gai sống'
];

let muscleLayersCache = null;

export function getMuscleLayers() {
  if (muscleLayersCache) return muscleLayersCache;
  const nodes = getMeshesBySystem('muscular') || [];
  const superficial = new Set();
  const intermediate = new Set();
  const deep = new Set();

  nodes.forEach(node => {
    const partId = node.userData?.partId;
    if (!partId) return;
    const lower = partId.toLowerCase();
    if (SUPERFICIAL_PATTERNS.some(p => lower.includes(p))) {
      superficial.add(partId);
    } else if (INTERMEDIATE_PATTERNS.some(p => lower.includes(p))) {
      intermediate.add(partId);
    } else {
      deep.add(partId);
    }
  });

  muscleLayersCache = {
    superficial: Array.from(superficial),
    intermediate: Array.from(intermediate),
    deep: Array.from(deep)
  };
  return muscleLayersCache;
}

// -----------------------------------------------------------------------------
// NERVOUS & SKELETAL PATTERNS
// -----------------------------------------------------------------------------
const CNS_PATTERNS = ['brain', 'não', 'cerebr', 'cerebell', 'spinal cord', 'tủy sống', 'brainstem', 'pons', 'medulla'];
const PLEXUS_PATTERNS = [...CNS_PATTERNS, 'plexus', 'đám rối', 'sciatic', 'ngồi', 'femoral nerve', 'radial nerve', 'median nerve', 'ulnar nerve'];

// -----------------------------------------------------------------------------
// SKELETAL SYSTEM DISSECTION LAYERS (Chuẩn đối chiếu Visible Body - 4 nấc)
// -----------------------------------------------------------------------------
// SKELETAL SYSTEM DISSECTION LAYERS (Chuẩn đối chiếu Visible Body - 3 nấc)
// Level 1.0 (■__): Trục Cột sống & Nền chẩm (Vertebral Column: C1-Coccyx + Occipital) (Ảnh 1)
// Level 2.0 (■■_): Khung xương trục + Khung chậu (Cột sống, Hộp sọ, Lồng ngực, Xương chậu) (Ảnh 2)
// Level 3.0 (■■■): Toàn bộ hệ xương 100% (Gồm toàn bộ 4 chi, bàn tay, bàn chân...) (Ảnh 3)
// -----------------------------------------------------------------------------
export function isSkeletalVisibleAtLevel(pIdLower, level) {
  if (level <= 0) return false;
  if (level >= 4.0) return true; // Level 4: 100% complete skeleton!

  // 1. Cột sống (Vertebral Column) & Nền chẩm Occipital (Hiển thị ở Level 1, 2, 3, 4 - Ảnh 1)
  const isSpine = 
    pIdLower.includes('vertebra') || pIdLower.includes('atlas') || pIdLower.includes('axis') ||
    pIdLower.includes('sacrum') || pIdLower.includes('coccyx') || pIdLower.includes('occipital') ||
    pIdLower.includes('c1') || pIdLower.includes('c2') || pIdLower.includes('c3') || pIdLower.includes('c4') || 
    pIdLower.includes('c5') || pIdLower.includes('c6') || pIdLower.includes('c7') ||
    pIdLower.includes('t1') || pIdLower.includes('t2') || pIdLower.includes('t3') || pIdLower.includes('t4') || 
    pIdLower.includes('t5') || pIdLower.includes('t6') || pIdLower.includes('t7') || pIdLower.includes('t8') || 
    pIdLower.includes('t9') || pIdLower.includes('t10') || pIdLower.includes('t11') || pIdLower.includes('t12') ||
    pIdLower.includes('l1') || pIdLower.includes('l2') || pIdLower.includes('l3') || pIdLower.includes('l4') || pIdLower.includes('l5') ||
    pIdLower.includes('cột sống') || pIdLower.includes('đốt sống') || pIdLower.includes('xương cùng') || pIdLower.includes('xương cụt');

  if (isSpine) return true;
  if (level <= 1.0) return false; // Level 1 ONLY shows vertebral column!

  // 2. Level 2.0: Khung xương trục + Khung chậu (Hộp sọ, Lồng ngực, Xương chậu - Ảnh 2)
  const isSkull = 
    pIdLower.includes('ethmoid') || pIdLower.includes('sphenoid') || pIdLower.includes('frontal') || 
    pIdLower.includes('parietal') || pIdLower.includes('temporal') || pIdLower.includes('maxilla') || 
    pIdLower.includes('mandible') || pIdLower.includes('zygomatic') || pIdLower.includes('nasal') || 
    pIdLower.includes('lacrimal') || pIdLower.includes('palatine') || pIdLower.includes('vomer') || 
    pIdLower.includes('hyoid') || pIdLower.includes('concha') || pIdLower.includes('ossicle') || 
    pIdLower.includes('malleus') || pIdLower.includes('incus') || pIdLower.includes('stapes') || 
    pIdLower.includes('skull') || pIdLower.includes('tooth') || pIdLower.includes('teeth') || pIdLower.includes('molar') || 
    pIdLower.includes('incisor') || pIdLower.includes('premolar') || pIdLower.includes('canine') ||
    pIdLower.includes('sọ') || pIdLower.includes('hàm') || pIdLower.includes('răng');

  const isThorax = 
    pIdLower.includes('sternum') || pIdLower.includes('rib') || pIdLower.includes('costal') || 
    pIdLower.includes('xiphoid') || pIdLower.includes('manubrium') || pIdLower.includes('sườn') || pIdLower.includes('ức');

  const isPelvis = 
    pIdLower.includes('ilium') || pIdLower.includes('ischium') || pIdLower.includes('pubis') || 
    pIdLower.includes('hip bone') || pIdLower.includes('pelvi') || pIdLower.includes('chậu');

  if (isSkull || isThorax || isPelvis) {
    return true;
  }

  // Level 3: Shows Axial + Pelvis + Long bones of 4 limbs, peels distal hand/foot bones
  if (level >= 3.0) {
    const isDistalHandFoot = 
      pIdLower.includes('phalanx') || pIdLower.includes('scaphoid') || pIdLower.includes('lunate') ||
      pIdLower.includes('triquetrum') || pIdLower.includes('pisiform') || pIdLower.includes('trapezium') ||
      pIdLower.includes('trapezoid') || pIdLower.includes('capitate') || pIdLower.includes('hamate') ||
      pIdLower.includes('metacarpal') || pIdLower.includes('calcaneus') || pIdLower.includes('talus') ||
      pIdLower.includes('navicular') || pIdLower.includes('cuboid') || pIdLower.includes('cuneiform') ||
      pIdLower.includes('metatarsal') || pIdLower.includes('sesamoid');
    return !isDistalHandFoot;
  }

  return false;
}

export function isSkullOrTeeth(partIdLower) {
  return partIdLower.includes('skull') ||
         partIdLower.includes('frontal') ||
         partIdLower.includes('parietal') ||
         partIdLower.includes('occipital') ||
         partIdLower.includes('temporal') ||
         partIdLower.includes('sphenoid') ||
         partIdLower.includes('ethmoid') ||
         partIdLower.includes('maxilla') ||
         partIdLower.includes('mandible') ||
         partIdLower.includes('zygomatic') ||
         partIdLower.includes('nasal') ||
         partIdLower.includes('lacrimal') ||
         partIdLower.includes('palatine') ||
         partIdLower.includes('vomer') ||
         partIdLower.includes('hyoid') ||
         partIdLower.includes('concha') ||
         partIdLower.includes('ossicle') ||
         partIdLower.includes('malleus') ||
         partIdLower.includes('incus') ||
         partIdLower.includes('stapes') ||
         partIdLower.includes('tooth') ||
         partIdLower.includes('teeth') ||
         partIdLower.includes('molar') ||
         partIdLower.includes('incisor') ||
         partIdLower.includes('canine') ||
         partIdLower.includes('premolar') ||
         partIdLower.includes('sọ') ||
         partIdLower.includes('hàm') ||
         partIdLower.includes('răng');
}

export async function focusDigestiveSystem(viewer = state.viewer || window.viewer) {
  if (!viewer) return;

  // 1. Ensure visceral and skeletal models are loaded
  if (!state.loadedSystems.includes('visceral')) {
    setItemLoading('digestive', true);
    await loadModel('visceral', viewer);
    setItemLoading('digestive', false);
  }
  if (!state.loadedSystems.includes('skeletal')) {
    await loadModel('skeletal', viewer);
  }

  // 2. Hide other soft-tissue systems
  SYSTEM_CONFIGS.forEach(sys => {
    if (sys.id !== 'digestive' && sys.id !== 'skeletal') {
      systemLevels[sys.id] = 0;
      updateItemUI(sys.id);
    }
  });
  ['muscular', 'cardiovascular', 'lymphatic', 'nervous'].forEach(s => hideSystem(s));

  // 3. Configure Visceral: Level 3.0 (all organs: liver, gallbladder, stomach, pancreas, intestines, colon, esophagus, salivary glands, tongue visible; omentum hidden)
  showSystem('visceral');
  systemLevels.digestive = 3.0;
  systemLevels.respiratory = 0;
  systemLevels.urinary_genital = 0;
  systemLevels.endocrine = 0;

  const visceralNodes = getMeshesBySystem('visceral') || [];
  visceralNodes.forEach(n => {
    const partId = n.userData?.partId;
    if (!partId) return;
    const lower = partId.toLowerCase();
    const subType = getVisceralSubType(lower);
    if (subType === 'digestive') {
      setStructureVisible(partId, isDigestiveVisibleAtLevel(lower, 3.0));
    } else {
      setStructureVisible(partId, false);
    }
  });

  // 4. Configure Skeletal: Keep Skull & Teeth at head, hide ribs, vertebrae, pelvis, limbs
  showSystem('skeletal');
  systemLevels.skeletal = 1.0;
  const skeletalNodes = getMeshesBySystem('skeletal') || [];
  skeletalNodes.forEach(n => {
    const partId = n.userData?.partId;
    if (!partId) return;
    const lower = partId.toLowerCase();
    const isHeadBone = isSkullOrTeeth(lower);
    setStructureVisible(partId, isHeadBone);
  });

  // 5. Activate frosted body silhouette envelope
  setBodyEnvelopeVisible(true, viewer);
  const envBtn = drawerEl?.querySelector('#btnToggleEnvelope');
  if (envBtn) envBtn.classList.add('active');

  // 6. Frame camera on anterior digestive tract (Visible Body Photo 2 & 3: target at stomach/navel level, z ~1.55)
  frameRegion({ x: 0, y: 1.12, z: 1.55, targetX: 0, targetY: 1.12, targetZ: 0 }, viewer);

  // 7. Update UI steppers
  SYSTEM_CONFIGS.forEach(sys => updateItemUI(sys.id));
  updateSilhouetteActive('front');
  viewer?.render?.();
}

const loadingSystems = new Set();
let drawerEl = null;
let pullTabEl = null;
let isDrawerOpen = false;

export function initSystemsLayerController(viewer) {
  const container = document.getElementById('viewerContainer');
  if (!container || drawerEl) return;

  // 1. Pull Tab on Left Edge (Exact Visible Body layout)
  pullTabEl = document.createElement('button');
  pullTabEl.id = 'systemsPullTab';
  pullTabEl.className = 'systems-pull-tab';
  pullTabEl.title = 'Hệ cơ quan & Phân lớp giải phẫu (+/-)';
  pullTabEl.innerHTML = `
    <span class="tab-vertical-text">Hệ Cơ Quan +/-</span>
    <span class="tab-body-icon">${ICONS.humanAnatomyWithPlus}</span>
  `;
  container.appendChild(pullTabEl);

  // 2. Sliding Systems Stepper Panel - Slim Medical Sidebar (~126px width)
  drawerEl = document.createElement('div');
  drawerEl.id = 'systemsStepperDrawer';
  drawerEl.className = 'systems-stepper-drawer';
  drawerEl.innerHTML = `
    <div class="stepper-drawer-header">
      <div class="stepper-header-title">
        <span class="stepper-views-title">HỆ CƠ QUAN</span>
        <button type="button" class="btn-stepper-close" id="btnStepperClose" title="Đóng bảng">✕</button>
      </div>
      
      <div class="stepper-region-label">Mặt trước / sau</div>
      
      <!-- Quick Region Selector: Anterior, Posterior, and More Dots -->
      <div class="stepper-regions-row">
        <button type="button" class="btn-region-silhouette active" data-region="front" title="Xoay mặt trước">
          ${ICONS.silhouetteAnterior}
          <span class="region-sublabel">Trước</span>
        </button>
        <button type="button" class="btn-region-silhouette" data-region="back" title="Xoay mặt sau">
          ${ICONS.silhouettePosterior}
          <span class="region-sublabel">Sau</span>
        </button>
        <div class="region-dropdown-wrap">
          <button type="button" class="btn-region-more" id="btnRegionMore" title="Chọn phân vùng giải phẫu khác (Đầu, Ngực, Chậu, Chi trên, Chi dưới)">
            ${ICONS.moreDots}
          </button>
          <div class="region-dropdown-menu hidden" id="regionDropdownMenu">
            <div class="region-dropdown-header">Phân vùng giải phẫu:</div>
            <button type="button" class="region-menu-item" data-region="head">Đầu & Cổ</button>
            <button type="button" class="region-menu-item" data-region="torso">Lồng ngực</button>
            <button type="button" class="region-menu-item" data-region="pelvis">Khung chậu</button>
            <button type="button" class="region-menu-item" data-region="upperLimb">Chi trên (Tay)</button>
            <button type="button" class="region-menu-item" data-region="lowerLimb">Chi dưới (Chân)</button>
          </div>
        </div>
      </div>
    </div>

    <!-- Systems Steppers List (4 segments per row, 0.5 step increments) -->
    <div class="stepper-systems-list" id="stepperSystemsList">
      ${renderSystemRows()}
    </div>

    <!-- Bottom Tools: Pelvis, Silhouette Envelope & Sex Switcher -->
    <div class="stepper-drawer-footer">
      <button type="button" class="btn-drawer-tool" id="btnFocusPelvis" title="Tập trung vùng chậu">
        <span class="drawer-tool-icon">${ICONS.pelvisBox}</span>
      </button>
      <button type="button" class="btn-drawer-tool active" id="btnToggleEnvelope" title="Lớp mờ bao quanh cơ thể - Bật/Tắt">
        <span class="drawer-tool-icon">${ICONS.humanAnatomyWithPlus}</span>
      </button>
      <button type="button" class="btn-drawer-tool" id="btnToggleGender" title="Mô hình: Nam Y khoa chuẩn (Dữ liệu Nữ đang cập nhật)">
        <span class="drawer-tool-icon">${ICONS.genderToggle}</span>
      </button>
    </div>
  `;
  container.appendChild(drawerEl);

  setupEvents(viewer);
  syncStateWithLoadedSystems();
}

function renderSystemRows() {
  return SYSTEM_CONFIGS.map(sys => {
    const lvl = Number(systemLevels[sys.id]) || 0;
    return `
      <div class="system-stepper-item ${lvl > 0 ? 'is-active' : ''}" data-system="${sys.id}">
        <div class="stepper-item-header">
          <span class="system-name-tag">${sys.shortNameVi}</span>
        </div>
        <div class="stepper-controls-row">
          <button type="button" class="btn-stepper-dec minus stepper-btn" data-action="dec" data-system="${sys.id}" title="Giảm lớp ${sys.nameVi} (bước 0.5)" ${lvl <= 0 ? 'disabled' : ''}>
            —
          </button>
          <button type="button" class="btn-stepper-icon ${lvl > 0 ? 'active' : ''}" data-action="toggle" data-system="${sys.id}" title="${sys.nameVi} (Bật / Tắt)">
            <span class="sys-icon">${sys.icon}</span>
            <span class="sys-loading-spinner hidden"></span>
          </button>
          <button type="button" class="btn-stepper-inc plus stepper-btn" data-action="inc" data-system="${sys.id}" title="Tăng lớp ${sys.nameVi} (bước 0.5)" ${lvl >= sys.maxLevels ? 'disabled' : ''}>
            +
          </button>
        </div>
        <div class="stepper-level-segments" id="segments_${sys.id}">
          ${renderSegments(lvl, sys.maxLevels)}
        </div>
      </div>
    `;
  }).join('');
}

function renderSegments(currentLevel, maxLevels = 4) {
  let html = '';
  const lvl = Number(currentLevel) || 0;
  for (let i = 1; i <= maxLevels; i++) {
    let stateClass = '';
    if (lvl >= i) {
      stateClass = 'filled';
    } else if (lvl >= i - 0.5) {
      stateClass = 'half-filled';
    }
    html += `<span class="level-segment ${stateClass}"></span>`;
  }
  return html;
}

function setupEvents(viewer) {
  // 1. Toggle Drawer via Pull Tab
  pullTabEl?.addEventListener('click', (e) => {
    e.stopPropagation();
    toggleDrawer();
  });

  // 2. Close Drawer via Close Button
  drawerEl?.querySelector('#btnStepperClose')?.addEventListener('click', (e) => {
    e.stopPropagation();
    closeDrawer();
  });

  // 3. Clicking / touching anywhere outside drawer smoothly dismisses it
  const handleOutsideDismiss = (e) => {
    if (isDrawerOpen && drawerEl && !drawerEl.contains(e.target) && !pullTabEl?.contains(e.target)) {
      closeDrawer();
    }
  };
  document.addEventListener('pointerdown', handleOutsideDismiss, { passive: true });

  // 4. Views Navigation: Prev/Next
  const viewOrder = ['front', 'back', 'left', 'right', 'top'];
  let currentViewIdx = 0;
  drawerEl?.querySelector('#btnViewPrev')?.addEventListener('click', () => {
    currentViewIdx = (currentViewIdx - 1 + viewOrder.length) % viewOrder.length;
    setView(viewOrder[currentViewIdx], viewer);
    updateSilhouetteActive(viewOrder[currentViewIdx]);
  });
  drawerEl?.querySelector('#btnViewNext')?.addEventListener('click', () => {
    currentViewIdx = (currentViewIdx + 1) % viewOrder.length;
    setView(viewOrder[currentViewIdx], viewer);
    updateSilhouetteActive(viewOrder[currentViewIdx]);
  });

  // 5. Silhouette buttons (Anterior / Posterior)
  const silhouetteBtns = drawerEl?.querySelectorAll('.btn-region-silhouette');
  silhouetteBtns?.forEach(btn => {
    btn.addEventListener('click', () => {
      const reg = btn.dataset.region;
      silhouetteBtns.forEach(b => b.classList.remove('active'));
      btn.classList.add('active');
      if (reg === 'front') {
        currentViewIdx = 0;
        setView('front', viewer);
      } else if (reg === 'back') {
        currentViewIdx = 1;
        setView('back', viewer);
      }
    });
  });

  // 6. Region More Dropdown (...)
  const moreBtn = drawerEl?.querySelector('#btnRegionMore');
  const dropdownMenu = drawerEl?.querySelector('#regionDropdownMenu');
  moreBtn?.addEventListener('click', (e) => {
    e.stopPropagation();
    dropdownMenu?.classList.toggle('hidden');
  });

  drawerEl?.querySelectorAll('.region-menu-item').forEach(item => {
    item.addEventListener('click', () => {
      dropdownMenu?.classList.add('hidden');
      const reg = item.dataset.region;
      if (reg === 'head') frameRegion({ x: 0, y: 1.6, z: 0.7, targetX: 0, targetY: 1.55, targetZ: 0 }, viewer);
      else if (reg === 'torso') frameRegion({ x: 0, y: 1.25, z: 1.0, targetX: 0, targetY: 1.25, targetZ: 0 }, viewer);
      else if (reg === 'pelvis') frameRegion({ x: 0, y: 0.95, z: 0.9, targetX: 0, targetY: 0.92, targetZ: 0 }, viewer);
      else if (reg === 'upperLimb') frameRegion({ x: 0.35, y: 1.15, z: 0.8, targetX: 0.3, targetY: 1.15, targetZ: 0 }, viewer);
      else if (reg === 'lowerLimb') frameRegion({ x: 0.15, y: 0.45, z: 1.0, targetX: 0.15, targetY: 0.45, targetZ: 0 }, viewer);
    });
  });

  // 7. Stepper Actions (+, -, Icon toggle, or item title click) with 0.5 step
  drawerEl?.querySelector('#stepperSystemsList')?.addEventListener('click', async (e) => {
    const btn = e.target.closest('button');
    const header = e.target.closest('.stepper-item-header') || e.target.closest('.system-name-tag');

    if (header) {
      const item = header.closest('.system-stepper-item');
      const sysId = item?.dataset?.system;
      if (sysId === 'digestive') {
        await focusDigestiveSystem(viewer);
        return;
      }
    }

    if (!btn || btn.disabled) return;
    const action = btn.dataset.action;
    const sysId = btn.dataset.system;
    if (!action || !sysId) return;

    if (action === 'inc') {
      await incrementSystemLevel(sysId, viewer);
    } else if (action === 'dec') {
      await decrementSystemLevel(sysId, viewer);
    } else if (action === 'toggle') {
      await toggleSystemLevel(sysId, viewer);
    }
  });

  // 8. Bottom Footer Tools (Pelvis, Envelope & Gender)
  drawerEl?.querySelector('#btnFocusPelvis')?.addEventListener('click', () => {
    frameRegion({ x: 0, y: 0.95, z: 0.9, targetX: 0, targetY: 0.92, targetZ: 0 }, viewer);
  });
  drawerEl?.querySelector('#btnToggleEnvelope')?.addEventListener('click', () => {
    toggleBodyEnvelope(viewer);
    const envBtn = drawerEl?.querySelector('#btnToggleEnvelope');
    if (envBtn) {
      envBtn.classList.toggle('active', isBodyEnvelopeVisible());
    }
  });
  drawerEl?.querySelector('#btnToggleGender')?.addEventListener('click', () => {
    if (window.showAtlasToast) {
      window.showAtlasToast('Hiện tại hệ thống sử dụng bộ dữ liệu 3D Nam chuẩn Y khoa (Z-Anatomy). Dữ liệu giải phẫu Nữ đang được cập nhật.');
    }
  });
}

function updateSilhouetteActive(viewName) {
  const frontBtn = drawerEl?.querySelector('.btn-region-silhouette[data-region="front"]');
  const backBtn = drawerEl?.querySelector('.btn-region-silhouette[data-region="back"]');
  if (viewName === 'front') {
    frontBtn?.classList.add('active');
    backBtn?.classList.remove('active');
  } else if (viewName === 'back') {
    frontBtn?.classList.remove('active');
    backBtn?.classList.add('active');
  } else {
    frontBtn?.classList.remove('active');
    backBtn?.classList.remove('active');
  }
}

export function openDrawer() {
  if (!drawerEl) return;
  drawerEl.classList.add('open');
  pullTabEl?.classList.add('drawer-open');
  isDrawerOpen = true;

  // On mobile, collapse selection card to compact mode to prevent collision
  if (typeof window !== 'undefined' && window.innerWidth <= 768) {
    const card = document.getElementById('selectionCard');
    if (card && !card.classList.contains('hidden') && !card.classList.contains('compact-mode')) {
      card.classList.add('compact-mode');
    }
  }
}

export function closeDrawer() {
  if (!drawerEl) return;
  drawerEl.classList.remove('open');
  pullTabEl?.classList.remove('drawer-open');
  isDrawerOpen = false;
  drawerEl.querySelector('#regionDropdownMenu')?.classList.add('hidden');
}

export function toggleDrawer() {
  if (isDrawerOpen) {
    closeDrawer();
  } else {
    openDrawer();
  }
}

async function incrementSystemLevel(systemId, viewer) {
  const current = Number(systemLevels[systemId]) || 0;
  const cfg = SYSTEM_CONFIGS.find(s => s.id === systemId);
  const maxLvl = cfg?.maxLevels || 3;
  if (current >= maxLvl) return;
  const step = (systemId === 'skeletal' || maxLvl === 3) ? 1.0 : 0.5;
  const next = Math.min(maxLvl, Math.round((current + step) * 10) / 10);
  await applySystemLevel(systemId, next, viewer);
}

async function decrementSystemLevel(systemId, viewer) {
  const current = Number(systemLevels[systemId]) || 0;
  if (current <= 0) return;
  const cfg = SYSTEM_CONFIGS.find(s => s.id === systemId);
  const maxLvl = cfg?.maxLevels || 3;
  const step = (systemId === 'skeletal' || maxLvl === 3) ? 1.0 : 0.5;
  const next = Math.max(0, Math.round((current - step) * 10) / 10);
  await applySystemLevel(systemId, next, viewer);
}

async function toggleSystemLevel(systemId, viewer) {
  const current = Number(systemLevels[systemId]) || 0;
  if (systemId === 'digestive') {
    if (current <= 0) {
      await focusDigestiveSystem(viewer);
    } else {
      await applySystemLevel(systemId, 0, viewer);
    }
    return;
  }
  const cfg = SYSTEM_CONFIGS.find(s => s.id === systemId);
  const maxLvl = cfg?.maxLevels || 4;
  const next = current > 0 ? 0 : maxLvl;
  await applySystemLevel(systemId, next, viewer);
}

export async function setSystemLevel(systemId, level, viewer) {
  const cfg = SYSTEM_CONFIGS.find(s => s.id === systemId);
  const maxLvl = cfg?.maxLevels || 4;
  const clamped = Math.max(0, Math.min(maxLvl, Math.round(Number(level) * 10) / 10));
  await applySystemLevel(systemId, clamped, viewer || state.viewer || window.viewer);
}

if (typeof window !== 'undefined') {
  window.setSystemLevel = setSystemLevel;
  window.systemLevels = systemLevels;
}

async function applySystemLevel(systemId, level, viewer) {
  if (loadingSystems.has(systemId)) return;
  const prevLevel = Number(systemLevels[systemId]) || 0;
  if (level !== prevLevel) {
    triggerHaptic('light');
  }
  systemLevels[systemId] = level;

  // Immediate optimistic UI response
  updateItemUI(systemId);

  const cfg = SYSTEM_CONFIGS.find(s => s.id === systemId);
  const baseSys = cfg?.baseSystem || systemId;

  // Politely suggest downloading offline if user activates/increments a heavy system (cơ, động mạch, tĩnh mạch...)
  if (level > 0 && prevLevel <= 0) {
    suggestOfflineForSystem(systemId, cfg?.nameVi || systemId, viewer);
  }

  // 1. If level > 0 and base system not loaded, load it dynamically
  if (level > 0 && !state.loadedSystems.includes(baseSys)) {
    loadingSystems.add(systemId);
    setItemLoading(systemId, true);
    try {
      await loadModel(baseSys, viewer);
      if (baseSys === 'visceral') {
        // Initialize other visceral subsystems that are at level 0 to hidden
        SYSTEM_CONFIGS.filter(s => s.baseSystem === 'visceral' && s.id !== systemId).forEach(sub => {
          if ((Number(systemLevels[sub.id]) || 0) <= 0) {
            const parts = getSubSystemParts(sub.subType);
            parts.forEach(p => setStructureVisible(p, false));
          }
        });
      }
    } catch (err) {
      console.error(`[systemsLayer] Failed to load model for ${baseSys}:`, err);
    } finally {
      loadingSystems.delete(systemId);
      setItemLoading(systemId, false);
    }
  }

  // Muscular system requires the skeletal framework as structural anchor
  if (systemId === 'muscular' && level > 0) {
    if (!state.loadedSystems.includes('skeletal')) {
      try {
        await loadModel('skeletal', viewer);
        systemLevels.skeletal = 3.0;
        showSystem('skeletal');
        updateItemUI('skeletal');
      } catch (err) {
        console.error('[systemsLayer] Failed to load skeletal anchor for muscular:', err);
      }
    } else if ((Number(systemLevels.skeletal) || 0) <= 0) {
      systemLevels.skeletal = 3.0;
      showSystem('skeletal');
      updateItemUI('skeletal');
    }
  }

  // 2. Adjust visibility with solid, crisp, authentic medical colors (NO alpha transparency lag!)
  batchPartStates(() => {
    if (cfg?.baseSystem === 'visceral') {
      // -------------------------------------------------------------
      // VISCERAL SUB-SYSTEMS: RESPIRATORY, DIGESTIVE, URINARY, ENDOCRINE
      // Filter every single visceral organ according to its respective stepper level!
      // -------------------------------------------------------------
      const respLvl = Number(systemLevels.respiratory) || 0;
      const digLvl = Number(systemLevels.digestive) || 0;
      const uriLvl = Number(systemLevels.urinary_genital) || 0;
      const endLvl = Number(systemLevels.endocrine) || 0;

      if (respLvl <= 0 && digLvl <= 0 && uriLvl <= 0 && endLvl <= 0) {
        hideSystem('visceral');
      } else {
        showSystem('visceral');
        const nodes = getMeshesBySystem('visceral') || [];
        nodes.forEach(n => {
          const partId = n.userData?.partId;
          if (!partId) return;
          const lower = partId.toLowerCase();
          const subType = getVisceralSubType(lower);

          if (subType === 'respiratory') {
            setStructureVisible(partId, isRespiratoryVisibleAtLevel(lower, respLvl));
          } else if (subType === 'digestive') {
            setStructureVisible(partId, isDigestiveVisibleAtLevel(lower, digLvl));
          } else if (subType === 'urinary_genital') {
            setStructureVisible(partId, isUrinaryGenitalVisibleAtLevel(lower, uriLvl));
          } else if (subType === 'endocrine') {
            setStructureVisible(partId, endLvl > 0);
          }
        });
      }
    } else if (systemId === 'arterial' || systemId === 'venous') {
      // -------------------------------------------------------------
      // CARDIOVASCULAR INDEPENDENT DISSECTION: ARTERIAL vs VENOUS
      // Step: 0.5 increments (0.0 to 4.0)
      // -------------------------------------------------------------
      const artLvl = Number(systemLevels.arterial) || 0;
      const venLvl = Number(systemLevels.venous) || 0;
      if (artLvl <= 0 && venLvl <= 0) {
        hideSystem('cardiovascular');
      } else {
        showSystem('cardiovascular');
        const nodes = getMeshesBySystem('cardiovascular') || [];
        nodes.forEach(n => {
          const partId = n.userData?.partId || '';
          const lower = partId.toLowerCase();
          const isVenous = lower.includes('vein') || lower.includes('vena') || lower.includes('venous') || lower.includes('sinus');
          if (isVenous) {
            setStructureVisible(partId, isVeinVisibleAtLevel(lower, venLvl));
          } else {
            setStructureVisible(partId, isArteryVisibleAtLevel(lower, artLvl));
          }
        });
      }
    } else if (systemId === 'muscular') {
      // -------------------------------------------------------------
      // MUSCULAR 4-TIER MULTI-STEP DISSECTION (0.5 steps)
      // -------------------------------------------------------------
      if (level <= 0) {
        hideSystem('muscular');
      } else {
        if ((Number(systemLevels.skeletal) || 0) <= 0) {
          systemLevels.skeletal = 3.0;
          showSystem('skeletal');
          updateItemUI('skeletal');
        }
        showSystem('muscular');
        const { superficial, intermediate, deep } = getMuscleLayers();
        if (level <= 1.0) {
          // Deepest layer (Level 0.5 - 1.0)
          superficial.forEach(id => setStructureVisible(id, false));
          intermediate.forEach(id => setStructureVisible(id, false));
          deep.forEach(id => setStructureVisible(id, true));
        } else if (level <= 2.5) {
          // Intermediate layer (Level 1.5 - 2.5)
          superficial.forEach(id => setStructureVisible(id, false));
          intermediate.forEach(id => setStructureVisible(id, true));
          deep.forEach(id => setStructureVisible(id, true));
        } else {
          // Superficial layer (Level 3.0 - 4.0)
          superficial.forEach(id => setStructureVisible(id, true));
          intermediate.forEach(id => setStructureVisible(id, true));
          deep.forEach(id => setStructureVisible(id, true));
        }
      }
    } else if (systemId === 'nervous') {
      if (level <= 0) {
        hideSystem('nervous');
      } else {
        showSystem('nervous');
        const nodes = getMeshesBySystem('nervous') || [];
        if (level <= 1.0) {
          nodes.forEach(n => {
            const pId = (n.userData?.partId || '').toLowerCase();
            setStructureVisible(n.userData?.partId, CNS_PATTERNS.some(kw => pId.includes(kw)));
          });
        } else if (level <= 2.5) {
          nodes.forEach(n => {
            const pId = (n.userData?.partId || '').toLowerCase();
            setStructureVisible(n.userData?.partId, PLEXUS_PATTERNS.some(kw => pId.includes(kw)));
          });
        } else {
          nodes.forEach(n => setStructureVisible(n.userData?.partId, true));
        }
      }
    } else if (systemId === 'skeletal') {
      if (level <= 0) {
        hideSystem('skeletal');
      } else {
        showSystem('skeletal');
        const nodes = getMeshesBySystem('skeletal') || [];
        nodes.forEach(n => {
          const partId = n.userData?.partId || n.name || '';
          if (partId) {
            setStructureVisible(partId, isSkeletalVisibleAtLevel(partId.toLowerCase(), level));
          }
        });
        if (level === 1) {
          setBodyEnvelopeVisible(true, viewer);
          const envBtn = drawerEl?.querySelector('#btnToggleEnvelope');
          if (envBtn) envBtn.classList.add('active');
        }
      }
    } else if (systemId === 'lymphatic') {
      if (level <= 0) {
        hideSystem('lymphatic');
      } else {
        showSystem('lymphatic');
        const nodes = getMeshesBySystem('lymphatic') || [];
        nodes.forEach(n => {
          const partId = n.userData?.partId || n.name || '';
          if (partId) {
            setStructureVisible(partId, isLymphaticVisibleAtLevel(partId.toLowerCase(), level));
          }
        });
      }
    } else if (systemId === 'integumentary') {
      const isSolid = level > 1.0;
      // When solid skin is active, hide internal nasal cartilages so they do not pierce the nose skin
      viewer?.scene?.traverse(c => {
        if (c.name && /alar_cartilage|septal_cartilage|lateral_process/i.test(c.name)) {
          c.visible = !isSolid;
        }
      });
      if (level <= 0) {
        hideSystem('integumentary');
        updateBodyEnvelopeAuto(viewer);
      } else {
        showSystem('integumentary');
        setBodyEnvelopeVisible(false, viewer);
        const nodes = getMeshesBySystem('integumentary') || [];
        nodes.forEach(n => {
          const updateMeshMat = (mesh) => {
            if (!mesh?.isMesh || !mesh?.material) return;
            const mats = Array.isArray(mesh.material) ? mesh.material : [mesh.material];
            mats.forEach(m => {
              if (level <= 1.0) {
                m.transparent = true;
                m.opacity = 0.35;
                m.depthWrite = false;
              } else {
                m.transparent = false;
                m.opacity = 1.0;
                m.depthWrite = true;
              }
              m.needsUpdate = true;
            });
          };
          updateMeshMat(n);
          n.traverse?.(updateMeshMat);
        });
      }
    } else {
      // Standard full system (joints)
      if (level <= 0) {
        hideSystem(systemId);
      } else {
        showSystem(systemId);
      }
    }
  });

  // 3. Final DOM update & immediate render frame
  updateItemUI(systemId);
  viewer?.invalidate?.(5);
  if (typeof viewer?.render === 'function') viewer.render();
}

function setItemLoading(systemId, isLoading) {
  const itemEl = drawerEl?.querySelector(`.system-stepper-item[data-system="${systemId}"]`);
  if (!itemEl) return;
  itemEl.classList.toggle('is-loading', isLoading);
  const spinner = itemEl.querySelector('.sys-loading-spinner');
  if (spinner) spinner.classList.toggle('hidden', !isLoading);
}

export function updateItemUI(systemId) {
  const itemEl = drawerEl?.querySelector(`.system-stepper-item[data-system="${systemId}"]`);
  if (!itemEl) return;

  const lvl = Number(systemLevels[systemId]) || 0;
  const cfg = SYSTEM_CONFIGS.find(s => s.id === systemId);
  const maxLvl = cfg?.maxLevels || 4;

  itemEl.classList.toggle('is-active', lvl > 0);

  const iconBtn = itemEl.querySelector('.btn-stepper-icon');
  iconBtn?.classList.toggle('active', lvl > 0);

  const decBtn = itemEl.querySelector('.btn-stepper-dec');
  if (decBtn) decBtn.disabled = lvl <= 0;

  const incBtn = itemEl.querySelector('.btn-stepper-inc');
  if (incBtn) incBtn.disabled = lvl >= maxLvl;

  const segmentsEl = itemEl.querySelector('.stepper-level-segments');
  if (segmentsEl) {
    segmentsEl.innerHTML = renderSegments(lvl, maxLvl);
  }
}

export function syncStateWithLoadedSystems() {
  state.loadedSystems.forEach(sysId => {
    if (sysId === 'cardiovascular') {
      if (systemLevels.arterial === 0 && systemLevels.venous === 0) {
        systemLevels.arterial = 4.0;
        systemLevels.venous = 4.0;
      }
    } else if (sysId === 'visceral') {
      if (systemLevels.respiratory === 0 && systemLevels.digestive === 0 && 
          systemLevels.urinary_genital === 0 && systemLevels.endocrine === 0) {
        systemLevels.respiratory = 4.0;
        systemLevels.digestive = 4.0;
        systemLevels.urinary_genital = 4.0;
        systemLevels.endocrine = 4.0;
      }
    } else if (systemLevels[sysId] === 0) {
      systemLevels[sysId] = 4.0;
    }
  });
  SYSTEM_CONFIGS.forEach(sys => updateItemUI(sys.id));
  const envBtn = drawerEl?.querySelector('#btnToggleEnvelope');
  if (envBtn) {
    envBtn.classList.toggle('active', isBodyEnvelopeVisible());
  }
}
