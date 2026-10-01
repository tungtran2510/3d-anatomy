// Vietnamese Anatomical Dictionary and Transliterator
// Standard Terminologia Anatomica (TA2) Vietnamese translation

const EXACT_DICTIONARY = {
  // --- BONES: HEAD & NECK ---
  'Frontal bone': 'Xương trán',
  'Parietal bone': 'Xương đỉnh',
  'Occipital bone': 'Xương chẩm',
  'Temporal bone': 'Xương thái dương',
  'Sphenoid bone': 'Xương bướm',
  'Ethmoid bone': 'Xương sàng',
  'Mandible': 'Xương hàm dưới',
  'Maxilla': 'Xương hàm trên',
  'Zygomatic bone': 'Xương gò má',
  'Nasal bone': 'Xương mũi',
  'Lacrimal bone': 'Xương lệ',
  'Palatine bone': 'Xương khẩu cái',
  'Vomer': 'Xương lá mía',
  'Inferior nasal concha': 'Xương xoăn mũi dưới',
  'Hyoid bone': 'Xương móng',
  'Anterior cells of ethmoid bone': 'Các xoang sàng trước',
  'Middle cells of ethmoid bone': 'Các xoang sàng giữa',
  'Posterior cells of ethmoid bone': 'Các xoang sàng sau',
  'Arytenoid cartilage': 'Sụn phễu',
  'Thyroid cartilage': 'Sụn giáp',
  'Cricoid cartilage': 'Sụn nhẫn',
  'Epiglottis': 'Nắp thanh môn',
  'Corniculate cartilage': 'Sụn sừng',
  'Cuneiform cartilage': 'Sụn chêm',

  // --- BONES: SPINE & THORAX ---
  'Atlas (C1)': 'Đốt sống cổ C1 (Đốt đội)',
  'Axis (C2)': 'Đốt sống cổ C2 (Đốt trục)',
  'Third cervical vertebra (C3)': 'Đốt sống cổ C3',
  'Fourth cervical vertebra (C4)': 'Đốt sống cổ C4',
  'Fifth cervical vertebra (C5)': 'Đốt sống cổ C5',
  'Sixth cervical vertebra (C6)': 'Đốt sống cổ C6',
  'Seventh cervical vertebra (C7)': 'Đốt sống cổ C7',
  'First thoracic vertebra (T1)': 'Đốt sống ngực T1',
  'Second thoracic vertebra (T2)': 'Đốt sống ngực T2',
  'Third thoracic vertebra (T3)': 'Đốt sống ngực T3',
  'Fourth thoracic vertebra (T4)': 'Đốt sống ngực T4',
  'Fifth thoracic vertebra (T5)': 'Đốt sống ngực T5',
  'Sixth thoracic vertebra (T6)': 'Đốt sống ngực T6',
  'Seventh thoracic vertebra (T7)': 'Đốt sống ngực T7',
  'Eighth thoracic vertebra (T8)': 'Đốt sống ngực T8',
  'Ninth thoracic vertebra (T9)': 'Đốt sống ngực T9',
  'Tenth thoracic vertebra (T10)': 'Đốt sống ngực T10',
  'Eleventh thoracic vertebra (T11)': 'Đốt sống ngực T11',
  'Twelfth thoracic vertebra (T12)': 'Đốt sống ngực T12',
  'First lumbar vertebra (L1)': 'Đốt sống thắt lưng L1',
  'Second lumbar vertebra (L2)': 'Đốt sống thắt lưng L2',
  'Third lumbar vertebra (L3)': 'Đốt sống thắt lưng L3',
  'Fourth lumbar vertebra (L4)': 'Đốt sống thắt lưng L4',
  'Fifth lumbar vertebra (L5)': 'Đốt sống thắt lưng L5',
  'Sacrum': 'Xương cùng',
  'Coccyx': 'Xương cụt',
  'Sternum': 'Xương ức',
  'Body of sternum': 'Thân xương ức',
  'Manubrium of sternum': 'Cán xương ức',
  'Xiphoid process': 'Mỏm mũi kiếm (xương ức)',
  'First rib': 'Xương sườn 1',
  'Second rib': 'Xương sườn 2',
  'Third rib': 'Xương sườn 3',
  'Fourth rib': 'Xương sườn 4',
  'Fifth rib': 'Xương sườn 5',
  'Sixth rib': 'Xương sườn 6',
  'Seventh rib': 'Xương sườn 7',
  'Eighth rib': 'Xương sườn 8',
  'Ninth rib': 'Xương sườn 9',
  'Tenth rib': 'Xương sườn 10',
  'Eleventh rib': 'Xương sườn 11',
  'Twelfth rib': 'Xương sườn 12',
  'Costal cartilage of first rib': 'Sụn sườn 1',
  'Costal cartilage of second rib': 'Sụn sườn 2',
  'Costal cartilage of third rib': 'Sụn sườn 3',
  'Costal cartilage of fourth rib': 'Sụn sườn 4',
  'Costal cartilage of fifth rib': 'Sụn sườn 5',
  'Costal cartilage of sixth rib': 'Sụn sườn 6',
  'Costal cartilage of seventh rib': 'Sụn sườn 7',
  'Costal cartilage of eighth rib': 'Sụn sườn 8',
  'Costal cartilage of ninth rib': 'Sụn sườn 9',
  'Costal cartilage of tenth rib': 'Sụn sườn 10',

  // --- BONES: UPPER LIMB ---
  'Clavicle': 'Xương đòn (Quai xanh)',
  'Scapula': 'Xương bả vai',
  'Humerus': 'Xương cánh tay',
  'Radius': 'Xương quay',
  'Ulna': 'Xương trụ',
  'Scaphoid bone': 'Xương thuyền',
  'Lunate bone': 'Xương nguyệt',
  'Triquetrum': 'Xương tháp',
  'Pisiform bone': 'Xương đậu',
  'Trapezium bone': 'Xương thang',
  'Trapezoid bone': 'Xương thê',
  'Capitate bone': 'Xương cả',
  'Hamate bone': 'Xương móc',
  'First metacarpal bone': 'Xương đốt bàn tay 1 (ngón cái)',
  'Second metacarpal bone': 'Xương đốt bàn tay 2',
  'Third metacarpal bone': 'Xương đốt bàn tay 3',
  'Fourth metacarpal bone': 'Xương đốt bàn tay 4',
  'Fifth metacarpal bone': 'Xương đốt bàn tay 5',

  // --- BONES: LOWER LIMB ---
  'Hip bone': 'Xương chậu',
  'Pelvis': 'Khung chậu',
  'Femur': 'Xương đùi',
  'Patella': 'Xương bánh chè',
  'Tibia': 'Xương chày',
  'Fibula': 'Xương mác',
  'Talus': 'Xương sên',
  'Calcaneus': 'Xương gót',
  'Navicular bone': 'Xương ghe',
  'Medial cuneiform bone': 'Xương chêm trong',
  'Intermediate cuneiform bone': 'Xương chêm giữa',
  'Lateral cuneiform bone': 'Xương chêm ngoài',
  'Cuboid bone': 'Xương hộp',
  'First metatarsal bone': 'Xương đốt bàn chân 1',
  'Second metatarsal bone': 'Xương đốt bàn chân 2',
  'Third metatarsal bone': 'Xương đốt bàn chân 3',
  'Fourth metatarsal bone': 'Xương đốt bàn chân 4',
  'Fifth metatarsal bone': 'Xương đốt bàn chân 5',

  // --- MUSCLES ---
  'Deltoid muscle': 'Cơ delta (cơ vai)',
  'Pectoralis major': 'Cơ ngực lớn',
  'Pectoralis minor': 'Cơ ngực bé',
  'Biceps brachii': 'Cơ nhị đầu cánh tay (chuột trước)',
  'Triceps brachii': 'Cơ tam đầu cánh tay (bắp sau)',
  'Brachialis': 'Cơ cánh tay',
  'Brachioradialis': 'Cơ cánh tay quay',
  'Trapezius': 'Cơ thang (vai - gáy)',
  'Latissimus dorsi': 'Cơ lưng rộng (cơ xô)',
  'Rectus abdominis': 'Cơ thẳng bụng (cơ 6 múi)',
  'External oblique': 'Cơ chéo bụng ngoài',
  'Internal oblique': 'Cơ chéo bụng trong',
  'Transversus abdominis': 'Cơ ngang bụng',
  'Gluteus maximus': 'Cơ mông lớn',
  'Gluteus medius': 'Cơ mông nhỡ',
  'Gluteus minimus': 'Cơ mông bé',
  'Piriformis': 'Cơ hình lê',
  'Quadriceps femoris': 'Cơ tứ đầu đùi',
  'Rectus femoris': 'Cơ thẳng đùi',
  'Vastus lateralis': 'Cơ rộng ngoài',
  'Vastus medialis': 'Cơ rộng trong',
  'Vastus intermedius': 'Cơ rộng giữa',
  'Biceps femoris': 'Cơ nhị đầu đùi',
  'Semitendinosus': 'Cơ bán gân',
  'Semimembranosus': 'Cơ bán màng',
  'Sartorius': 'Cơ may',
  'Gracilis': 'Cơ thon',
  'Gastrocnemius': 'Cơ bụng chân (bắp chuối)',
  'Soleus': 'Cơ dép',
  'Tibialis anterior': 'Cơ chày trước',
  'Sternocleidomastoid': 'Cơ ức đòn chũm',
  'Masseter': 'Cơ cắn',
  'Temporalis': 'Cơ thái dương',
  'Diaphragm': 'Cơ hoành',

  // --- ORGANS & VISCERA ---
  'Heart': 'Quả tim',
  'Lung': 'Phổi',
  'Left lung': 'Phổi trái',
  'Right lung': 'Phổi phải',
  'Brain': 'Não bộ',
  'Liver': 'Gan',
  'Stomach': 'Dạ dày',
  'Duodenum': 'Tá tràng',
  'Small intestine': 'Ruột non',
  'Large intestine': 'Ruột già (Đại tràng)',
  'Appendix': 'Ruột thừa',
  'Vermiform appendix': 'Ruột thừa',
  'Spleen': 'Lá lách',
  'Pancreas': 'Tụy',
  'Pancreatic duct': 'Ống tụy',
  'Accessory pancreatic duct': 'Ống tụy phụ',
  'Gallbladder': 'Túi mật',
  'Bile duct': 'Ống mật',
  'Common bile duct': 'Ống mật chủ',
  'Cystic duct': 'Ống túi mật',
  'Kidney': 'Thận',
  'Left kidney': 'Thận trái',
  'Right kidney': 'Thận phải',
  'Urinary bladder': 'Bàng quang',
  'Ureter': 'Niệu quản',
  'Urethra': 'Niệu đạo',
  'Prostate': 'Tuyến tiền liệt',
  'Testis': 'Tinh hoàn',
  'Epididymis': 'Mào tinh',
  'Trachea': 'Khí quản',
  'Esophagus': 'Thực quản',
  'Oesophagus': 'Thực quản',
  'Thyroid gland': 'Tuyến giáp',
  'Parathyroid gland': 'Tuyến cận giáp',
  'Suprarenal gland': 'Tuyến thượng thận',
  'Adrenal gland': 'Tuyến thượng thận',
  'Thoracic duct': 'Ống ngực (Bạch huyết)',
  'Jejunum': 'Hỗng tràng',
  'Ileum': 'Hồi tràng',
  'Ascending colon': 'Đại tràng lên',
  'Transverse colon': 'Đại tràng ngang',
  'Descending colon': 'Đại tràng xuống',
  'Sigmoid colon': 'Đại tràng xích-ma',
  'Greater omentum': 'Mạc nối lớn',
  'Lesser omentum': 'Mạc nối nhỏ',
  'Mesentery': 'Mạc treo ruột',
  'Mesocolon': 'Mạc treo đại tràng',

  // --- CARDIOVASCULAR ---
  'Aorta': 'Động mạch chủ',
  'Ascending aorta': 'Động mạch chủ lên',
  'Aortic arch': 'Cung động mạch chủ',
  'Abdominal aorta': 'Động mạch chủ bụng',
  'Thoracic aorta': 'Động mạch chủ ngực',
  'Superior vena cava': 'Tĩnh mạch chủ trên',
  'Inferior vena cava': 'Tĩnh mạch chủ dưới',
  'Pulmonary trunk': 'Thân động mạch phổi',
  'Pulmonary artery': 'Động mạch phổi',
  'Pulmonary vein': 'Tĩnh mạch phổi',
  'Common carotid artery': 'Động mạch cảnh chung',
  'Internal carotid artery': 'Động mạch cảnh trong',
  'External carotid artery': 'Động mạch cảnh ngoài',
  'Femoral artery': 'Động mạch đùi',
  'Radial artery': 'Động mạch quay',
  'Ulnar artery': 'Động mạch trụ',
  'Brachial artery': 'Động mạch cánh tay',
  'Subclavian artery': 'Động mạch dưới đòn',

  // --- NERVES ---
  'Sciatic nerve': 'Dây thần kinh tọa (thần kinh ngồi)',
  'Femoral nerve': 'Dây thần kinh đùi',
  'Radial nerve': 'Dây thần kinh quay',
  'Ulnar nerve': 'Dây thần kinh trụ',
  'Median nerve': 'Dây thần kinh giữa',
  'Vagus nerve': 'Dây thần kinh phế vị (TK X)',
  'Trigeminal nerve': 'Dây thần kinh sinh ba (TK V)',
  'Facial nerve': 'Dây thần kinh mặt (TK VII)',
  'Olfactory nerve': 'Dây thần kinh khứu giác (TK I)',

  // --- HEAD & FACE MUSCLES, FASCIAS & APONEUROSES ---
  'Epicranial aponeurosis': 'Cân trên sọ',
  'Galea aponeurotica': 'Cân trên sọ',
  'Occipitofrontalis': 'Cơ chẩm trán',
  'Occipitofrontalis muscle': 'Cơ chẩm trán',
  'Frontalis': 'Cơ trán (Bụng trán cơ chẩm trán)',
  'Occipitalis': 'Cơ chẩm (Bụng chẩm cơ chẩm trán)',
  'Frontal belly of occipitofrontalis': 'Bụng trán (Cơ chẩm trán)',
  'Occipital belly of occipitofrontalis': 'Bụng chẩm (Cơ chẩm trán)',
  'Temporoparietalis': 'Cơ thái dương đỉnh',
  'Temporoparietal fascia': 'Mạc thái dương đỉnh',
  'Temporal fascia': 'Mạc thái dương',
  'Platysma': 'Cơ bám da cổ',
  'Orbicularis oculi': 'Cơ vòng mắt',
  'Orbicularis oris': 'Cơ vòng miệng',
  'Buccinator': 'Cơ mút',
  'Zygomaticus major': 'Cơ gò má lớn',
  'Zygomaticus minor': 'Cơ gò má bé',
  'Risorius': 'Cơ cười',
  'Levator labii superioris': 'Cơ nâng môi trên',
  'Depressor labii inferioris': 'Cơ hạ môi dưới',
  'Depressor anguli oris': 'Cơ hạ góc miệng',
  'Mentalis': 'Cơ cằm',
  'Corrugator supercilii': 'Cơ cau mày',
  'Procerus': 'Cơ tháp',
  'Nasalis': 'Cơ mũi',
  'Medial pterygoid': 'Cơ chân bướm trong',
  'Lateral pterygoid': 'Cơ chân bướm ngoài',

  // --- FASCIAS, LIGAMENTS & TRUNK ---
  'Thoracolumbar fascia': 'Mạc ngực thắt lưng',
  'Fascia lata': 'Mạc rộng đùi',
  'Iliotibial tract': 'Dải chậu chày',
  'Plantar aponeurosis': 'Cân gan chân',
  'Palmar aponeurosis': 'Cân gan tay',
  'Linea alba': 'Đường trắng giữa bụng',
  'Rectus sheath': 'Bao cơ thẳng bụng',
  'Inguinal ligament': 'Dây chằng bẹn',
  'Flexor retinaculum': 'Hãm gân gấp',
  'Extensor retinaculum': 'Hãm gân duỗi',
  'Cervical vertebra': 'Đốt sống cổ',
  'Thoracic vertebra': 'Đốt sống ngực',
  'Lumbar vertebra': 'Đốt sống thắt lưng',
  'Intervertebral disc': 'Đĩa đệm gian đốt sống',
  'Right lymphatic duct': 'Ống bạch huyết phải',
  'Cisterna chyli': 'Bể dưỡng chấp'
};

// Morphological glossary for compound terms
const PATTERNS = [
  { match: /\bcostal cartilage of (.*) rib\b/i, replace: (m, p) => `Sụn sườn ${translateNumber(p)}` },
  { match: /\bcostal cartilage\b/i, replace: 'Sụn sườn' },
  { match: /\bfirst rib\b/i, replace: 'Xương sườn 1' },
  { match: /\bsecond rib\b/i, replace: 'Xương sườn 2' },
  { match: /\bthird rib\b/i, replace: 'Xương sườn 3' },
  { match: /\bfourth rib\b/i, replace: 'Xương sườn 4' },
  { match: /\bfifth rib\b/i, replace: 'Xương sườn 5' },
  { match: /\bsixth rib\b/i, replace: 'Xương sườn 6' },
  { match: /\bseventh rib\b/i, replace: 'Xương sườn 7' },
  { match: /\beighth rib\b/i, replace: 'Xương sườn 8' },
  { match: /\bninth rib\b/i, replace: 'Xương sườn 9' },
  { match: /\btenth rib\b/i, replace: 'Xương sườn 10' },
  { match: /\beleventh rib\b/i, replace: 'Xương sườn 11' },
  { match: /\btwelfth rib\b/i, replace: 'Xương sườn 12' },
  { match: /\bproximal phalanx\b/i, replace: 'Đốt ngón gần' },
  { match: /\bmiddle phalanx\b/i, replace: 'Đốt ngón giữa' },
  { match: /\bdistal phalanx\b/i, replace: 'Đốt ngón xa' },
  { match: /\bintervertebral disc\b/i, replace: 'Đĩa đệm gian đốt sống' },
  { match: /\bcervical vertebra\b/i, replace: 'Đốt sống cổ' },
  { match: /\bthoracic vertebra\b/i, replace: 'Đốt sống ngực' },
  { match: /\blumbar vertebra\b/i, replace: 'Đốt sống thắt lưng' },
  { match: /\bsacral vertebra\b/i, replace: 'Đốt sống cùng' },
  { match: /\bvertebra\b/i, replace: 'Đốt sống' },
  { match: /\bepicranial aponeurosis\b/i, replace: 'Cân trên sọ' },
  { match: /\bgalea aponeurotica\b/i, replace: 'Cân trên sọ' },
  { match: /\btemporoparietal fascia\b/i, replace: 'Mạc thái dương đỉnh' },
  { match: /\btemporal fascia\b/i, replace: 'Mạc thái dương' },
  { match: /\bthoracolumbar fascia\b/i, replace: 'Mạc ngực thắt lưng' },
  { match: /\bfascia lata\b/i, replace: 'Mạc rộng đùi' },
  { match: /\bplantar aponeurosis\b/i, replace: 'Cân gan chân' },
  { match: /\bpalmar aponeurosis\b/i, replace: 'Cân gan tay' },
  { match: /\baponeurosis of (.*)\b/i, replace: (m, p) => `Cân ${getVietnameseName(p)}` },
  { match: /\baponeurosis\b/i, replace: 'Cân cơ' },
  { match: /\bfascia of (.*)\b/i, replace: (m, p) => `Mạc ${getVietnameseName(p)}` },
  { match: /\bfascia\b/i, replace: 'Mạc' },
  { match: /\bretinaculum\b/i, replace: 'Hãm gân' },
  { match: /\blymph node(s)? of (.*)\b/i, replace: (m, p1, p2) => `Hạch bạch huyết ${getVietnameseName(p2)}` },
  { match: /\blymph node(s)?\b/i, replace: 'Hạch bạch huyết' },
  { match: /\blymphatic vessel(s)?\b/i, replace: 'Mạch bạch huyết' },
  { match: /\bcartilage\b/i, replace: 'Sụn' },
  { match: /\badductor longus\b/i, replace: 'Cơ khép dài' },
  { match: /\badductor magnus\b/i, replace: 'Cơ khép lớn' },
  { match: /\badductor brevis\b/i, replace: 'Cơ khép ngắn' },
  { match: /\badductor\b/i, replace: 'Cơ khép' },
  { match: /\babductor hallucis\b/i, replace: 'Cơ dạng ngón cái' },
  { match: /\babductor pollicis\b/i, replace: 'Cơ dạng ngón cái' },
  { match: /\babductor digiti minimi\b/i, replace: 'Cơ dạng ngón út' },
  { match: /\babductor\b/i, replace: 'Cơ dạng' },
  { match: /\bextensor digitorum\b/i, replace: 'Cơ duỗi các ngón' },
  { match: /\bextensor\b/i, replace: 'Cơ duỗi' },
  { match: /\bflexor digitorum\b/i, replace: 'Cơ gấp các ngón' },
  { match: /\bflexor\b/i, replace: 'Cơ gấp' },
  { match: /\bpronator teres\b/i, replace: 'Cơ sấp tròn' },
  { match: /\bpronator quadratus\b/i, replace: 'Cơ sấp vuông' },
  { match: /\bpronator\b/i, replace: 'Cơ sấp' },
  { match: /\bsupinator\b/i, replace: 'Cơ ngửa' },
  { match: /\blevator scapulae\b/i, replace: 'Cơ nâng vai' },
  { match: /\blevator\b/i, replace: 'Cơ nâng' },
  { match: /\bdepressor\b/i, replace: 'Cơ hạ' },
  { match: /\bmuscle\b/i, replace: 'Cơ' },
  { match: /\bartery\b/i, replace: 'Động mạch' },
  { match: /\bvein\b/i, replace: 'Tĩnh mạch' },
  { match: /\bnerve\b/i, replace: 'Dây thần kinh' },
  { match: /\bligament\b/i, replace: 'Dây chằng' },
  { match: /\btendon\b/i, replace: 'Gân' },
  { match: /\bjoint\b/i, replace: 'Khớp' },
  { match: /\bbone\b/i, replace: 'Xương' }
];

function translateNumber(word) {
  const map = {
    'first': '1', 'second': '2', 'third': '3', 'fourth': '4', 'fifth': '5',
    'sixth': '6', 'seventh': '7', 'eighth': '8', 'ninth': '9', 'tenth': '10',
    'eleventh': '11', 'twelfth': '12'
  };
  return map[word.toLowerCase()] || word;
}

export function splitSideAndSuffix(rawName) {
  if (!rawName) return { base: '', side: null };
  let str = String(rawName).trim();
  str = str.replace(/^\((.*)\)$/, '$1').trim();

  // Strip technical suffixes like .l, .r, _l, _r, .left, .right, (left), (right)
  const leftRegex = /(?:[\._](?:l|left)|\s*\((?:l|left)\))\s*$/i;
  const rightRegex = /(?:[\._](?:r|right)|\s*\((?:r|right)\))\s*$/i;

  if (leftRegex.test(str)) {
    const base = str.replace(leftRegex, '').trim();
    return { base, side: 'left' };
  }
  if (rightRegex.test(str)) {
    const base = str.replace(rightRegex, '').trim();
    return { base, side: 'right' };
  }

  return { base: str, side: null };
}

export function getVietnameseName(englishBaseName) {
  if (!englishBaseName) return '';
  const { base, side } = splitSideAndSuffix(englishBaseName);
  const clean = base.replace(/^\((.*)\)$/, '$1').trim();

  let vnBase = null;

  // 1. Direct match
  if (EXACT_DICTIONARY[clean]) {
    vnBase = EXACT_DICTIONARY[clean];
  } else {
    // 2. Case-insensitive exact match
    const lower = clean.toLowerCase();
    for (const [key, val] of Object.entries(EXACT_DICTIONARY)) {
      if (key.toLowerCase() === lower) {
        vnBase = val;
        break;
      }
    }
  }

  // 3. Pattern match
  if (!vnBase) {
    for (const p of PATTERNS) {
      if (p.match.test(clean)) {
        if (typeof p.replace === 'function') {
          vnBase = clean.replace(p.match, p.replace);
        } else {
          vnBase = clean.replace(p.match, p.replace);
        }
        break;
      }
    }
  }

  if (!vnBase) {
    vnBase = clean;
  }

  if (side === 'left') {
    return `${vnBase} (Trái)`;
  } else if (side === 'right') {
    return `${vnBase} (Phải)`;
  }
  return vnBase;
}

export function getAnatomyNomenclature(rawName) {
  if (!rawName) {
    return {
      rawName: '',
      cleanBase: '',
      side: null,
      sideLabelVi: '',
      sideSpeechVi: '',
      nameVi: '',
      nameLatin: '',
      nameEn: '',
      speakTextVi: ''
    };
  }

  const { base, side } = splitSideAndSuffix(rawName);
  const cleanBase = base.replace(/^\((.*)\)$/, '$1').trim();
  const baseVn = getVietnameseName(cleanBase);

  const sideLabelVi = side === 'left' ? 'Trái' : (side === 'right' ? 'Phải' : '');
  const sideSpeechVi = side === 'left' ? 'bên trái' : (side === 'right' ? 'bên phải' : '');
  const sideLatin = side === 'left' ? 'Sinistra' : (side === 'right' ? 'Dextra' : '');
  const sideEn = side === 'left' ? 'Left' : (side === 'right' ? 'Right' : '');

  const nameVi = sideLabelVi ? `${baseVn} (${sideLabelVi})` : baseVn;
  const nameEn = sideEn ? `${cleanBase} (${sideEn})` : cleanBase;
  const nameLatin = sideLatin ? `${cleanBase} (${sideLatin})` : cleanBase;
  const speakTextVi = sideSpeechVi ? `${baseVn} ${sideSpeechVi}` : baseVn;

  return {
    rawName,
    cleanBase,
    side,
    sideLabelVi,
    sideSpeechVi,
    sideLatin,
    sideEn,
    nameVi,
    nameLatin,
    nameEn,
    speakTextVi
  };
}

export function getVietnameseSynonyms(englishBaseName) {
  const vn = getVietnameseName(englishBaseName);
  if (!vn || vn === englishBaseName) return [];

  const synonyms = [vn];
  const lower = vn.toLowerCase();
  const enLower = (englishBaseName || '').toLowerCase();

  // Visceral & Lymphatic Organs
  if (lower.includes('lách') || enLower.includes('spleen')) {
    synonyms.push('lá lách', 'lách', 'tỳ', 'lách tỳ', 'la lach', 'ty', 'spleen');
  }
  if (lower.includes('tụy') || enLower.includes('pancreas')) {
    synonyms.push('tụy', 'tuyến tụy', 'tụy tạng', 'tuy', 'tuyen tuy', 'pancreas');
  }
  if (lower.includes('túi mật') || lower.includes('mật') || enLower.includes('gallbladder')) {
    synonyms.push('mật', 'túi mật', 'bọng mật', 'tui mat', 'mat', 'gallbladder');
  }
  if (lower.includes('ống mật') || enLower.includes('bile duct')) {
    synonyms.push('ống dẫn mật', 'đường mật', 'ong mat', 'ong dan mat', 'duong mat', 'bile');
  }
  if (lower.includes('ống tụy') || enLower.includes('pancreatic duct')) {
    synonyms.push('ống tụy chính', 'ống wirsung', 'ong tuy');
  }
  if (lower.includes('gan') || enLower.includes('liver')) {
    synonyms.push('lá gan', 'gan mật', 'la gan', 'hepar', 'liver');
  }
  if (lower.includes('thận') || enLower.includes('kidney')) {
    synonyms.push('quả thận', 'hai quả thận', 'qua than', 'than', 'kidney');
  }
  if (lower.includes('dạ dày') || enLower.includes('stomach')) {
    synonyms.push('bao tử', 'da day', 'bao tu', 'stomach');
  }
  if (lower.includes('ruột thừa') || enLower.includes('appendix')) {
    synonyms.push('manh tràng', 'dau ruot thua', 'ruot thua', 'appendix');
  }
  if (lower.includes('tá tràng') || enLower.includes('duodenum')) {
    synonyms.push('ruột non', 'ta trang', 'duodenum');
  }
  if (lower.includes('phổi') || enLower.includes('lung')) {
    synonyms.push('lá phổi', 'hai lá phổi', 'la phoi', 'phoi', 'lung');
  }
  if (lower.includes('quả tim') || lower.includes('tim') || enLower.includes('heart')) {
    synonyms.push('tim', 'trai tim', 'qua tim', 'heart');
  }
  if (lower.includes('não') || enLower.includes('brain')) {
    synonyms.push('bộ não', 'nao bo', 'nao', 'brain');
  }
  if (lower.includes('bạch huyết') || enLower.includes('lymph')) {
    synonyms.push('hệ bạch huyết', 'hạch bạch huyết', 'bach huyet', 'hach');
  }

  // Bones & Muscles
  if (lower.includes('xương đùi')) synonyms.push('đùi', 'bắp đùi', 'xuong dui', 'dui');
  if (lower.includes('xương đòn')) synonyms.push('xương quai xanh', 'quai xanh');
  if (lower.includes('cơ delta')) synonyms.push('cơ vai', 'bắp vai');
  if (lower.includes('cơ nhị đầu')) synonyms.push('chuột trước', 'bắp tay trước');
  if (lower.includes('cơ tam đầu')) synonyms.push('chuột sau', 'bắp tay sau');
  if (lower.includes('đốt sống')) synonyms.push('cột sống', 'xương sống', 'dot song', 'cot song');
  if (lower.includes('thần kinh tọa')) synonyms.push('thần kinh ngồi', 'đau dây tọa');

  return [...new Set(synonyms)];
}

