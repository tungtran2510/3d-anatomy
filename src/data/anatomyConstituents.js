/**
 * ANATOMY CONSTITUENTS & HIGH-RES VISUAL DIAGRAM REGISTRY
 * Cấu tạo chi tiết từng bộ phận và Hình ảnh giải phẫu trực quan chuẩn y khoa
 * Phục vụ học nhanh - hiểu sâu - tương tác 1 chạm trực quan trên 3D
 */

export const CONSTITUENTS_DATABASE = {
  // 1. GAN - MẬT - TỤY (HEPATOBILIARY & PANCREAS)
  liver: {
    title: 'Cấu tạo Gan, Túi Mật & Đường Mật',
    diagram: '/images/atlas/biliary_anatomy.svg',
    diagramCaption: 'Đại thể giải phẫu Gan, Hệ thống Đường mật ngoài gan & Tụy tạng',
    subparts: [
      { name: 'Thùy phải gan', latin: 'Lobus dexter', searchQuery: 'Liver', icon: '🥩' },
      { name: 'Thùy trái gan', latin: 'Lobus sinister', searchQuery: 'Liver', icon: '🥩' },
      { name: 'Túi mật', latin: 'Vesica biliaris', searchQuery: 'Gallbladder', icon: '🟢' },
      { name: 'Ống mật chủ', latin: 'Ductus choledochus', searchQuery: 'Bile duct', icon: '🟡' },
      { name: 'Tuyến tụy', latin: 'Pancreas', searchQuery: 'Pancreas', icon: '🧈' },
      { name: 'Tá tràng D2 & Oddi', latin: 'Duodenum & Sphincter Oddi', searchQuery: 'Duodenum', icon: '⚡' },
      { name: 'Tĩnh mạch cửa', latin: 'Vena portae', searchQuery: 'Portal vein', icon: '🔵' }
    ]
  },

  // 2. TIM MẠCH (HEART & CARDIOVASCULAR)
  heart: {
    title: 'Cấu tạo 4 Buồng Tim & Hệ Thống Van',
    diagram: '/images/atlas/cardiac_anatomy.svg',
    diagramCaption: 'Mặt cắt 4 buồng tim, hệ van 2 lá/3 lá & các mạch máu lớn',
    subparts: [
      { name: 'Tâm thất trái', latin: 'Ventriculus sinister', searchQuery: 'Left ventricle', icon: '❤️' },
      { name: 'Tâm thất phải', latin: 'Ventriculus dexter', searchQuery: 'Right ventricle', icon: '💙' },
      { name: 'Tâm nhĩ trái', latin: 'Atrium sinistrum', searchQuery: 'Left atrium', icon: '🔴' },
      { name: 'Tâm nhĩ phải', latin: 'Atrium dextrum', searchQuery: 'Right atrium', icon: '🔵' },
      { name: 'Cung động mạch chủ', latin: 'Arcus aortae', searchQuery: 'Aorta', icon: '🩸' },
      { name: 'Thân động mạch phổi', latin: 'Truncus pulmonalis', searchQuery: 'Pulmonary', icon: '🫁' },
      { name: 'Van hai lá', latin: 'Valva mitralis', searchQuery: 'left atrioventricular valve', icon: '🚪' },
      { name: 'Van ba lá', latin: 'Valva tricuspidalis', searchQuery: 'right atrioventricular valve', icon: '🚪' }
    ]
  },

  // 3. DẠ DÀY & ỐNG TIÊU HÓA (STOMACH & GI TRACT)
  stomach: {
    title: 'Cấu tạo Các Vùng Dạ Dày & 5 Lớp Thành',
    diagram: '/images/atlas/stomach_anatomy_macro.svg',
    diagramCaption: 'Đại thể dạ dày: Tâm vị, Đáy vị, Thân vị, Hang môn vị & Cơ thắt môn vị',
    subparts: [
      { name: 'Tâm vị', latin: 'Cardia', searchQuery: 'Cardia', icon: '🚪' },
      { name: 'Đáy vị', latin: 'Fundus gastricus', searchQuery: 'Stomach', icon: '🫙' },
      { name: 'Thân vị', latin: 'Corpus gastricum', searchQuery: 'Stomach', icon: '🥘' },
      { name: 'Hang môn vị', latin: 'Antrum pyloricum', searchQuery: 'Stomach', icon: '⏳' },
      { name: 'Cơ thắt môn vị', latin: 'Pylorus', searchQuery: 'duodenum', icon: '🔒' },
      { name: 'Bờ cong nhỏ', latin: 'Curvatura minor', searchQuery: 'Stomach', icon: '↩️' },
      { name: 'Bờ cong lớn', latin: 'Curvatura major', searchQuery: 'Stomach', icon: '↪️' },
      { name: 'Thành trước dạ dày (Bóc tách)', latin: 'Paries anterior', searchQuery: 'Stomach', icon: '🔪' },
      { name: 'Lòng dạ dày & Niêm mạc', latin: 'Tunica mucosa gastrica', searchQuery: 'Stomach', icon: '🔬' }
    ]
  },

  // 4. CỘT SỐNG & ĐĨA ĐỆM (SPINE, VERTEBRAE & DISCS)
  vertebra: {
    title: 'Cấu tạo Đốt Sống, Cung Đốt & Đĩa Đệm',
    diagram: '/images/atlas/disc_cross_section.svg',
    diagramCaption: 'Mặt cắt ngang đốt sống: Thân đốt, Cuống sống, Bản sống, Lỗ tủy & Đĩa đệm',
    subparts: [
      { name: 'Thân đốt sống', latin: 'Corpus vertebrae', searchQuery: 'Vertebra', icon: '🧱' },
      { name: 'Đĩa đệm gian đốt', latin: 'Discus intervertebralis', searchQuery: 'Disc', icon: '💿' },
      { name: 'Mỏm gai sau', latin: 'Processus spinosus', searchQuery: 'Vertebra', icon: '📍' },
      { name: 'Mỏm ngang', latin: 'Processus transversus', searchQuery: 'Vertebra', icon: '↔️' },
      { name: 'Mỏm khớp trên/dưới', latin: 'Processus articularis', searchQuery: 'Vertebra', icon: '🔗' },
      { name: 'Ống sống & Lỗ liên hợp', latin: 'Foramen vertebrale', searchQuery: 'Vertebra', icon: '🕳️' }
    ]
  },

  // 5. CƠ NGỰC & LỒNG NGỰC (PECTORALIS & THORAX)
  pectoralis: {
    title: 'Cấu tạo Các Bó Cơ Ngực & Khung Lồng Ngực',
    diagram: '/images/atlas/reg_thorax.png',
    diagramCaption: 'Các bó cơ ngực lớn, cơ ngực bé và khung xương lồng ngực',
    subparts: [
      { name: 'Bó ức sườn', latin: 'Pars sternocostalis', searchQuery: 'Pectoralis', icon: '🥩' },
      { name: 'Bó xương đòn', latin: 'Pars clavicularis', searchQuery: 'Pectoralis', icon: '🦴' },
      { name: 'Bó bụng', latin: 'Pars abdominalis', searchQuery: 'Pectoralis', icon: '🎽' },
      { name: 'Xương ức', latin: 'Sternum', searchQuery: 'Sternum', icon: '🛡️' },
      { name: 'Xương sườn', latin: 'Costae', searchQuery: 'Rib', icon: '🩻' },
      { name: 'Xương đòn', latin: 'Clavicula', searchQuery: 'Clavicle', icon: '🪝' }
    ]
  },

  // 6. THẬN & HỆ TIẾT NIỆU (KIDNEYS & URINARY)
  kidney: {
    title: 'Cấu tạo Thận, Nephron & Đường Tiết Niệu',
    diagram: '/images/atlas/urinary_anatomy.svg',
    diagramCaption: 'Bổ dọc thận: Vỏ thận, Tháp tủy thận, Đài bể thận & Niệu quản',
    subparts: [
      { name: 'Vỏ thận & Cầu thận', latin: 'Cortex renalis', searchQuery: 'Kidney', icon: '🫘' },
      { name: 'Tủy thận & Tháp Malpighi', latin: 'Medulla renalis', searchQuery: 'Kidney', icon: '🔺' },
      { name: 'Bể thận', latin: 'Pelvis renalis', searchQuery: 'Kidney', icon: '🫙' },
      { name: 'Niệu quản', latin: 'Ureter', searchQuery: 'Ureter', icon: '🚿' },
      { name: 'Bàng quang', latin: 'Vesica urinaria', searchQuery: 'Bladder', icon: '💧' },
      { name: 'Động mạch thận', latin: 'Arteria renalis', searchQuery: 'Renal artery', icon: '🔴' }
    ]
  },

  // 7. PHỔI & ĐƯỜNG HÔ HẤP (LUNGS & RESPIRATORY)
  lung: {
    title: 'Cấu tạo Phổi, Cây Phế Quản & Màng Phổi',
    diagram: '/images/atlas/respiratory_anatomy.svg',
    diagramCaption: 'Đại thể phổi: Các thùy phổi, phân thùy phế quản và phế nang',
    subparts: [
      { name: 'Thùy trên phổi', latin: 'Lobus superior', searchQuery: 'Lung', icon: '🫁' },
      { name: 'Thùy giữa & Thùy dưới', latin: 'Lobus medius & inferior', searchQuery: 'Lung', icon: '🫁' },
      { name: 'Khí quản & Ngã ba Carina', latin: 'Trachea & Carina', searchQuery: 'Trachea', icon: '🎋' },
      { name: 'Phế quản chính', latin: 'Bronchus principalis', searchQuery: 'Bronchus', icon: '🌿' },
      { name: 'Rốn phổi', latin: 'Hilum pulmonis', searchQuery: 'Lung', icon: '🚪' },
      { name: 'Màng phổi', latin: 'Pleura', searchQuery: 'Lung', icon: '🛡️' }
    ]
  },

  // 8. KHỚP GỐI & DÂY CHẰNG (KNEE JOINT & LIGAMENTS)
  knee: {
    title: 'Cấu tạo Khớp Gối, Dây Chằng & Sụn Chêm',
    diagram: '/images/atlas/knee_anatomy.svg',
    diagramCaption: 'Khớp gối: Dây chằng chéo trước ACL, chéo sau PCL, sụn chêm & xương bánh chè',
    subparts: [
      { name: 'Dây chằng chéo trước (ACL)', latin: 'Lig. cruciatum anterius', searchQuery: 'Cruciate', icon: '🎗️' },
      { name: 'Dây chằng chéo sau (PCL)', latin: 'Lig. cruciatum posterius', searchQuery: 'Cruciate', icon: '🎗️' },
      { name: 'Sụn chêm trong & ngoài', latin: 'Meniscus medialis & lateralis', searchQuery: 'Meniscus', icon: '🌙' },
      { name: 'Xương bánh chè', latin: 'Patella', searchQuery: 'Patella', icon: '🛡️' },
      { name: 'Lồi cầu xương đùi', latin: 'Condylus femoris', searchQuery: 'Femur', icon: '🦴' },
      { name: 'Mâm chày', latin: 'Plateau tibialis', searchQuery: 'Tibia', icon: '🪜' }
    ]
  },

  // 9. NÃO BỘ & VÒNG MẠCH WILLIS (BRAIN & WILLIS CIRCLE)
  brain: {
    title: 'Cấu tạo Não Bộ & Mạch Máu Não Willis',
    diagram: '/images/atlas/willis_anatomy.svg',
    diagramCaption: 'Đại não, Tiểu não, Thân não và Đa giác động mạch Willis',
    subparts: [
      { name: 'Bán cầu đại não', latin: 'Hemispherium cerebri', searchQuery: 'Brain', icon: '🧠' },
      { name: 'Tiểu não', latin: 'Cerebellum', searchQuery: 'Cerebellum', icon: '🪸' },
      { name: 'Thân não (Cầu não, Hành não)', latin: 'Truncus encephali', searchQuery: 'Pons', icon: '🌳' },
      { name: 'Đồi thị & Vùng dưới đồi', latin: 'Thalamus & Hypothalamus', searchQuery: 'Brain', icon: '🎛️' },
      { name: 'Động mạch cảnh trong', latin: 'A. carotis interna', searchQuery: 'Carotid', icon: '🔴' },
      { name: 'Động mạch thân nền', latin: 'A. basilaris', searchQuery: 'Basilar', icon: '🔴' }
    ]
  },

  // 10. TAI TRONG & ỐC TAI (EAR & VESTIBULAR)
  ear: {
    title: 'Cấu tạo Tai Ngoài, Tai Giữa & Tai Trong',
    diagram: '/images/atlas/ear_anatomy_macro.svg',
    diagramCaption: 'Màng nhĩ, chuỗi 3 xương con, ốc tai & 3 ống bán khuyên tiền đình',
    subparts: [
      { name: 'Vành tai & Ống tai', latin: 'Auris externa', searchQuery: 'Ear', icon: '👂' },
      { name: 'Màng nhĩ', latin: 'Membrana tympani', searchQuery: 'Tympanic', icon: '🥁' },
      { name: 'Chuỗi xương con (Búa, Đe, Bàn đạp)', latin: 'Ossicula auditus', searchQuery: 'Malleus', icon: '🔨' },
      { name: 'Ốc tai', latin: 'Cochlea', searchQuery: 'Cochlea', icon: '🐚' },
      { name: '3 Ống bán khuyên tiền đình', latin: 'Canales semicirculares', searchQuery: 'Vestibule', icon: '🔄' }
    ]
  },

  // 11. ĐÁM RỐI CÁNH TAY & CHI TRÊN (BRACHIAL PLEXUS & UPPER LIMB)
  brachial: {
    title: 'Cấu tạo Đám Rối Cánh Tay & Thần Kinh Chi Trên',
    diagram: '/images/atlas/brachial_plexus_anatomy.svg',
    diagramCaption: 'Đám rối cánh tay C5-T1 và các dây thần kinh trụ, quay, giữa',
    subparts: [
      { name: 'Thần kinh giữa (Median)', latin: 'Nervus medianus', searchQuery: 'Median nerve', icon: '⚡' },
      { name: 'Thần kinh quay (Radial)', latin: 'Nervus radialis', searchQuery: 'Radial nerve', icon: '⚡' },
      { name: 'Thần kinh trụ (Ulnar)', latin: 'Nervus ulnaris', searchQuery: 'Ulnar nerve', icon: '⚡' },
      { name: 'Xương cánh tay', latin: 'Humerus', searchQuery: 'Humerus', icon: '🦴' },
      { name: 'Xương quay & Xương trụ', latin: 'Radius & Ulna', searchQuery: 'Radius', icon: '🥢' }
    ]
  },

  // 12. HỆ NỘI TIẾT (ENDOCRINE GLANDS & HPA AXIS)
  endocrine: {
    title: 'Cấu tạo Các Tuyến Nội Tiết & Trục HPA',
    diagram: '/images/atlas/reg_head_neck.png',
    diagramCaption: 'Vùng dưới đồi, Tuyến yên, Tuyến giáp, Tuyến cận giáp & Tuyến thượng thận',
    subparts: [
      { name: 'Tuyến giáp', latin: 'Glandula thyroidea', searchQuery: 'Thyroid', icon: '🦋' },
      { name: 'Tuyến cận giáp (4 tuyến)', latin: 'Glandulae parathyroideae', searchQuery: 'Parathyroid', icon: '🟡' },
      { name: 'Tuyến yên', latin: 'Hypophysis / Pituitary', searchQuery: 'Adenohypophysis', icon: '🎛️' },
      { name: 'Tuyến tùng', latin: 'Glandula pinealis', searchQuery: 'Pineal', icon: '👁️' },
      { name: 'Tuyến thượng thận', latin: 'Glandula suprarenalis', searchQuery: 'Suprarenal', icon: '⛰️' },
      { name: 'Vùng dưới đồi', latin: 'Hypothalamus', searchQuery: 'Brain', icon: '🧠' }
    ]
  },

  // 13. TUYẾN TIÊU HÓA & NƯỚC BỌT (SALIVARY & DIGESTIVE GLANDS)
  salivary: {
    title: 'Cấu tạo Các Tuyến Nước Bọt & Ống Dẫn Tiêu Hóa',
    diagram: '/images/atlas/dig_upper.png',
    diagramCaption: 'Tuyến mang tai (Stensen), Tuyến dưới hàm (Wharton) & Tuyến dưới lưỡi',
    subparts: [
      { name: 'Tuyến mang tai', latin: 'Glandula parotidea', searchQuery: 'Parotid gland', icon: '🧃' },
      { name: 'Ống tuyến mang tai (Stensen)', latin: 'Ductus parotideus', searchQuery: 'Parotid duct', icon: '🟡' },
      { name: 'Tuyến dưới hàm', latin: 'Glandula submandibularis', searchQuery: 'Submandibular gland', icon: '💧' },
      { name: 'Ống tuyến dưới hàm (Wharton)', latin: 'Ductus submandibularis', searchQuery: 'Submandibular duct', icon: '🟡' },
      { name: 'Tuyến dưới lưỡi', latin: 'Glandula sublingualis', searchQuery: 'Sublingual gland', icon: '💦' },
      { name: 'Lưỡi', latin: 'Lingua', searchQuery: 'Tongue', icon: '👅' }
    ]
  },

  // 14. NHÃN CẦU & THỊ GIÁC (EYE & VISUAL PATHWAY)
  eye: {
    title: 'Cấu tạo Nhãn Cầu & Đường Dẫn Truyền Thị Giác',
    diagram: '/images/atlas/eye_anatomy_macro.svg',
    diagramCaption: 'Mặt cắt ngang nhãn cầu: Tiền phòng, Thể mi, Thể thủy tinh, Võng mạc & Dây TK thị giác II',
    subparts: [
      { name: 'Tiền phòng nhãn cầu', latin: 'Camera anterior bulbi', searchQuery: 'chamber of eyeball', icon: '👁️' },
      { name: 'Bán phần trước nhãn cầu', latin: 'Segmentum anterius', searchQuery: 'segment of eyeball', icon: '🔍' },
      { name: 'Bán phần sau nhãn cầu', latin: 'Segmentum posterius', searchQuery: 'segment of eyeball', icon: '🎯' },
      { name: 'Dây thần kinh thị giác (TK II)', latin: 'Nervus opticus (II)', searchQuery: 'optic nerve', icon: '⚡' },
      { name: 'Động mạch mi nuôi nhãn cầu', latin: 'Arteriae ciliares', searchQuery: 'ciliary', icon: '🔴' },
      { name: 'Giao thoa thị giác', latin: 'Chiasma opticum', searchQuery: 'optic chiasm', icon: '🔀' }
    ]
  },

  // 15. 8 HẠ PHÂN THÙY GAN THEO COUINAUD (COUINAUD LIVER SEGMENTATION I-VIII)
  couinaud_liver: {
    title: '8 Hạ Phân Thùy Gan Ngoại Khoa (Couinaud I – VIII)',
    diagram: '/images/atlas/couinaud_liver_segments.svg',
    diagramCaption: 'Phân chia 8 hạ phân thùy độc lập theo cuống tĩnh mạch cửa và tĩnh mạch gan',
    subparts: [
      { name: 'Hạ phân thùy I (Thùy đuôi)', latin: 'Segmentum posterius (I)', searchQuery: 'posterior segment of liver (i)', icon: '1️⃣' },
      { name: 'Hạ phân thùy II (Sau trên trái)', latin: 'Segmentum posterius laterale (II)', searchQuery: 'left posterior lateral segment of liver (ii)', icon: '2️⃣' },
      { name: 'Hạ phân thùy III (Trước dưới trái)', latin: 'Segmentum anterius laterale (III)', searchQuery: 'left anterior lateral segment of liver (iii)', icon: '3️⃣' },
      { name: 'Hạ phân thùy IV (Thùy vuông giữa trái)', latin: 'Segmentum mediale (IV)', searchQuery: 'left medial segment of liver (iv)', icon: '4️⃣' },
      { name: 'Hạ phân thùy V (Trước dưới phải)', latin: 'Segmentum anterius mediale (V)', searchQuery: 'anterior medial segment of liver (v)', icon: '5️⃣' },
      { name: 'Hạ phân thùy VI (Sau dưới phải)', latin: 'Segmentum anterius laterale (VI)', searchQuery: 'anterior lateral segment of liver (vi)', icon: '6️⃣' },
      { name: 'Hạ phân thùy VII (Sau trên phải)', latin: 'Segmentum posterius laterale (VII)', searchQuery: 'posterior lateral segment of liver (vii)', icon: '7️⃣' },
      { name: 'Hạ phân thùy VIII (Trước trên phải)', latin: 'Segmentum posterius mediale (VIII)', searchQuery: 'posterior medial segment of liver (viii)', icon: '8️⃣' },
      { name: 'Tĩnh mạch cửa gan', latin: 'Vena portae hepatis', searchQuery: 'hepatic portal vein', icon: '🔵' },
      { name: 'Túi mật', latin: 'Vesica biliaris', searchQuery: 'gallbladder', icon: '🟢' }
    ]
  },

  // 16. CẤU TRÚC TRONG TIM & VAN TIM (INTERNAL CARDIAC & VALVULAR COMPLEX)
  cardiac_internal: {
    title: 'Cấu tạo Trong Buồng Tim & Bộ Máy Van Tim',
    diagram: '/images/atlas/cardiac_valve_pathology.svg',
    diagramCaption: 'Các buồng tim, cơ nhú, thừng gân & hệ van 2 lá, 3 lá, van tổ chim',
    subparts: [
      { name: 'Cột cơ nhú trước thất phải', latin: 'M. papillaris anterior', searchQuery: 'anterior papillary muscle of right ventricle', icon: '🥩' },
      { name: 'Cột cơ nhú dưới thất trái', latin: 'M. papillaris inferior', searchQuery: 'inferior papillary muscle of left ventricle', icon: '🥩' },
      { name: 'Cột cơ nhú vách thất phải', latin: 'M. papillaris septalis', searchQuery: 'septal papillary muscle of right ventricle', icon: '🥩' },
      { name: 'Lá van ba lá (Thất phải)', latin: 'Cuspis valvae tricuspidalis', searchQuery: 'leaflet of right atrioventricular valve', icon: '🚪' },
      { name: 'Lá van hai lá (Thất trái)', latin: 'Cuspis valvae mitralis', searchQuery: 'leaflet of left atrioventricular valve', icon: '🚪' },
      { name: 'Lá van động mạch chủ', latin: 'Valvula semilunaris aortae', searchQuery: 'coronary leaflet', icon: '🩸' },
      { name: 'Lá van động mạch phổi', latin: 'Valvula semilunaris pulmonalis', searchQuery: 'semilunar leaflet of pulmonary valve', icon: '🫁' }
    ]
  },

  // 17. ĐỘNG MẠCH VÀNH & HỆ THỐNG DẪN TRUYỀN TIM (CORONARY ARTERIES & CONDUCTION)
  coronary_circulation: {
    title: 'Cây Động Mạch Vành & Điện Sinh Lý Tim',
    diagram: '/images/atlas/coronary_circulation_conduction.svg',
    diagramCaption: 'Cây cấp máu động mạch vành LAD, LCx, RCA & hệ thống phát nhịp tự động SA-AV',
    subparts: [
      { name: 'Động mạch vành trái (LCA)', latin: 'Arteria coronaria sinistra', searchQuery: 'left coronary artery', icon: '🔴' },
      { name: 'Động mạch vành phải (RCA)', latin: 'Arteria coronaria dextra', searchQuery: 'right coronary artery', icon: '🔴' },
      { name: 'Nhánh mũ tim (LCx)', latin: 'Ramus circumflexus', searchQuery: 'circumflex artery', icon: '🩸' },
      { name: 'Xoang tĩnh mạch vành', latin: 'Sinus coronarius', searchQuery: 'coronary sinus', icon: '🔵' },
      { name: 'Tĩnh mạch dưới thất trái', latin: 'Vena posterior ventriculi sinistri', searchQuery: 'inferior vein of left ventricle', icon: '🔵' }
    ]
  },

  // 18. KHỚP HÁNG & VÙNG CHẬU ĐÙI (HIP JOINT & FEMORAL COMPLEX)
  hip_joint: {
    title: 'Cấu tạo Khớp Háng, Sụn Viền & Dây Chằng Chậu Đùi',
    diagram: '/images/atlas/hip_joint_anatomy.svg',
    diagramCaption: 'Khớp chỏm cầu chịu lực lớn nhất: Ổ cối, Chỏm xương đùi, Sụn viền & Dây chằng Bigelow',
    subparts: [
      { name: 'Bao khớp háng', latin: 'Capsula articularis coxae', searchQuery: 'capsule of hip', icon: '🛡️' },
      { name: 'Chỏm & Thân xương đùi', latin: 'Femur', searchQuery: 'femur', icon: '🦴' },
      { name: 'Xương chậu & Ổ cối', latin: 'Os coxae & Acetabulum', searchQuery: 'hip bone', icon: '🧱' },
      { name: 'Dây chằng chỏm xương đùi', latin: 'Ligamentum capitis femoris', searchQuery: 'ligament of head of femur', icon: '🎗️' }
    ]
  },

  // 19. THANH QUẢN & TUYẾN GIÁP (LARYNX & THYROID GLAND)
  larynx_thyroid: {
    title: 'Cấu tạo Thanh Quản, Tuyến Giáp & Dây Thanh Âm',
    diagram: '/images/atlas/larynx_thyroid_anatomy.svg',
    diagramCaption: 'Khung sụn thanh quản: Sụn giáp, Sụn nhẫn, Tuyến giáp và Dây chằng nhẫn giáp',
    subparts: [
      { name: 'Sụn giáp (Trái táo Adam)', latin: 'Cartilago thyroidea', searchQuery: 'thyroid cartilage', icon: '🛡️' },
      { name: 'Màng & Dây chằng nhẫn giáp', latin: 'Ligamentum cricothyroideum', searchQuery: 'cricothyroid', icon: '🎗️' },
      { name: 'Màng giáp móng', latin: 'Membrana thyrohyoidea', searchQuery: 'thyrohyoid', icon: '🧣' },
      { name: 'Tuyến giáp & Mạch nuôi', latin: 'Glandula thyroidea', searchQuery: 'thyroid', icon: '🦋' }
    ]
  },

  // 20. ĐẠI TRÀNG & MẠC TREO (COLON & MESENTERY)
  colon_mesentery: {
    title: 'Cấu tạo Khung Đại Tràng & Dải Cơ Dọc Taenia Coli',
    diagram: '/images/atlas/colon_mesentery_anatomy.svg',
    diagramCaption: 'Khung ruột già: Manh tràng, Đại tràng lên, ngang, xuống, sigma & Mạc treo đại tràng',
    subparts: [
      { name: 'Đại tràng lên', latin: 'Colon ascendens', searchQuery: 'ascending colon', icon: '🌭' },
      { name: 'Đại tràng ngang', latin: 'Colon transversum', searchQuery: 'transverse colon', icon: '🌭' },
      { name: 'Đại tràng xuống', latin: 'Colon descendens', searchQuery: 'descending colon', icon: '🌭' },
      { name: 'Đại tràng sigma', latin: 'Colon sigmoideum', searchQuery: 'sigmoid colon', icon: '➰' },
      { name: 'Mạc treo đại tràng', latin: 'Mesocolon', searchQuery: 'mesocolon', icon: '🕸️' }
    ]
  },

  // 21. TUYẾN TỤY & ĐƯỜNG TIÊU HÓA TRUNG TÂM (PANCREAS & CENTRAL GI)
  pancreatic_ducts: {
    title: 'Cấu tạo Tuyến Tụy, Đảo Langerhans & Ống Wirsung',
    diagram: '/images/atlas/biliary_anatomy.svg',
    diagramCaption: 'Đại thể tụy tạng nằm sau phúc mạc, vắt ngang cột sống trong khung tá tràng D1-D4',
    subparts: [
      { name: 'Tuyến tụy', latin: 'Pancreas', searchQuery: 'pancreas', icon: '🧈' },
      { name: 'Tá tràng C-loop', latin: 'Duodenum', searchQuery: 'duodenum', icon: '⚡' },
      { name: 'Động mạch lách (Nuôi tụy)', latin: 'Arteria splenica', searchQuery: 'splenic artery', icon: '🔴' },
      { name: 'Tĩnh mạch lách', latin: 'Vena splenica', searchQuery: 'splenic vein', icon: '🔵' }
    ]
  },

  // 22. BÀNG QUANG & TIẾT NIỆU DƯỚI (URINARY BLADDER & LOWER TRACT)
  urinary_bladder: {
    title: 'Cấu tạo Bàng Quang & Đường Tiết Niệu Dưới',
    diagram: '/images/atlas/urinary_anatomy.svg',
    diagramCaption: 'Bàng quang cơ chóp, vùng cổ bàng quang, tam giác Lieutaud và 2 lỗ niệu quản',
    subparts: [
      { name: 'Bàng quang', latin: 'Vesica urinaria', searchQuery: 'urinary bladder', icon: '💧' },
      { name: 'Niệu quản', latin: 'Ureter', searchQuery: 'ureter', icon: '🚿' }
    ]
  },

  // 23. LÁCH & HỆ MIỄN DỊCH BẠCH HUYẾT (SPLEEN & LYMPHOID ORGANS)
  spleen_lymph: {
    title: 'Cấu tạo Lách & Hệ Cơ Quan Miễn Dịch',
    diagram: '/images/atlas/lymph_spleen.png',
    diagramCaption: 'Lách (Tỳ tạng) - Cơ quan bạch huyết lớn nhất cơ thể lọc sạch máu và tiêu hủy hồng cầu già',
    subparts: [
      { name: 'Lách (Tỳ tạng)', latin: 'Splen / Lien', searchQuery: 'spleen', icon: '🟣' },
      { name: 'Động mạch lách', latin: 'Arteria splenica', searchQuery: 'splenic artery', icon: '🔴' },
      { name: 'Hạch bạch huyết bẹn', latin: 'Nodi lymphoidei', searchQuery: 'inguinal node', icon: '🟢' }
    ]
  },

  // 24. HỆ DA & MÔ DƯỚI DA (INTEGUMENTARY SYSTEM)
  integumentary_layers: {
    title: 'Cấu trúc Lớp Da, Biểu Bì & Mô Mỡ Dưới Da',
    diagram: '/images/atlas/micro_skin_light.jpg',
    diagramCaption: '3 tầng giải phẫu da người: Biểu bì (Epidermis), Trung bì (Dermis) & Hạ bì (Hypodermis)',
    subparts: [
      { name: 'Toàn bộ lớp da người', latin: 'Integumentum commune', searchQuery: 'skin', icon: '🧖' }
    ]
  }
};

/**
 * Tìm kiếm cấu tạo chi tiết & hình ảnh giải phẫu cho bất kỳ bộ phận nào
 */
export function getConstituentsForPart(partId, baseName, systemName, regionName) {
  const target = `${partId || ''} ${baseName || ''} ${systemName || ''} ${regionName || ''}`.toLowerCase();

  // 1. Khớp từ khóa cụ thể ưu tiên cao
  if (target.includes('couinaud') || target.includes('segment of liver') || target.includes('phân thùy gan')) {
    return CONSTITUENTS_DATABASE.couinaud_liver;
  }
  if (target.includes('liver') || target.includes('gan') || target.includes('hepar') || target.includes('gallbladder') || target.includes('biliary')) {
    return CONSTITUENTS_DATABASE.liver;
  }
  if (target.includes('coronary') || target.includes('động mạch vành') || target.includes('lad') || target.includes('rca') || target.includes('circumflex') || target.includes('vành')) {
    return CONSTITUENTS_DATABASE.coronary_circulation;
  }
  if (target.includes('papillary') || target.includes('leaflet') || target.includes('tricuspid') || target.includes('mitral') || target.includes('van tim') || target.includes('cột cơ')) {
    return CONSTITUENTS_DATABASE.cardiac_internal;
  }
  if (target.includes('heart') || target.includes('tim') || target.includes('cardiac') || target.includes('ventricle') || target.includes('atrium') || target.includes('aorta')) {
    return CONSTITUENTS_DATABASE.heart;
  }
  if (target.includes('eye') || target.includes('mắt') || target.includes('eyeball') || target.includes('cornea') || target.includes('retina') || target.includes('optic')) {
    return CONSTITUENTS_DATABASE.eye;
  }
  if (target.includes('hip') || target.includes('háng') || target.includes('acetabul') || target.includes('chậu đùi') || target.includes('trochanter')) {
    return CONSTITUENTS_DATABASE.hip_joint;
  }
  if (target.includes('larynx') || target.includes('thanh quản') || target.includes('thyroid') || target.includes('tuyến giáp') || target.includes('cricoid')) {
    return CONSTITUENTS_DATABASE.larynx_thyroid;
  }
  if (target.includes('colon') || target.includes('đại tràng') || target.includes('ruột già') || target.includes('cecum') || target.includes('manh tràng') || target.includes('appendix') || target.includes('ruột thừa') || target.includes('mesocolon') || target.includes('taenia')) {
    return CONSTITUENTS_DATABASE.colon_mesentery;
  }
  if (target.includes('pancreas') || target.includes('tụy') || target.includes('wirsung') || target.includes('santorini')) {
    return CONSTITUENTS_DATABASE.pancreatic_ducts;
  }
  if (target.includes('bladder') || target.includes('bàng quang')) {
    return CONSTITUENTS_DATABASE.urinary_bladder;
  }
  if (target.includes('spleen') || target.includes('lách') || target.includes('tỳ')) {
    return CONSTITUENTS_DATABASE.spleen_lymph;
  }
  if (target.includes('skin') || target.includes('lớp da') || target.includes('biểu bì') || target.includes('dermis') || target.includes('epidermis')) {
    return CONSTITUENTS_DATABASE.integumentary_layers;
  }
  if (target.includes('stomach') || target.includes('dạ dày') || target.includes('gaster') || target.includes('pylorus') || target.includes('cardia')) {
    return CONSTITUENTS_DATABASE.stomach;
  }
  if (target.includes('vertebra') || target.includes('đốt sống') || target.includes('disc') || target.includes('đĩa đệm') || target.includes('spine') || target.includes('cột sống')) {
    return CONSTITUENTS_DATABASE.vertebra;
  }
  if (target.includes('pectoralis') || target.includes('cơ ngực') || target.includes('sternum') || target.includes('rib') || target.includes('sườn')) {
    return CONSTITUENTS_DATABASE.pectoralis;
  }
  if (target.includes('kidney') || target.includes('thận') || target.includes('ren') || target.includes('ureter')) {
    return CONSTITUENTS_DATABASE.kidney;
  }
  if (target.includes('lung') || target.includes('phổi') || target.includes('pulmo') || target.includes('bronch') || target.includes('trachea')) {
    return CONSTITUENTS_DATABASE.lung;
  }
  if (target.includes('knee') || target.includes('khớp gối') || target.includes('patella') || target.includes('cruciate') || target.includes('meniscus')) {
    return CONSTITUENTS_DATABASE.knee;
  }
  if (target.includes('brain') || target.includes('não') || target.includes('encephalon') || target.includes('willis') || target.includes('cerebell')) {
    return CONSTITUENTS_DATABASE.brain;
  }
  if (target.includes('ear') || target.includes('tai') || target.includes('cochlea') || target.includes('tympanic')) {
    return CONSTITUENTS_DATABASE.ear;
  }
  if (target.includes('plexus') || target.includes('arm') || target.includes('cánh tay') || target.includes('median') || target.includes('radial') || target.includes('ulnar')) {
    return CONSTITUENTS_DATABASE.brachial;
  }
  if (target.includes('endocrine') || target.includes('nội tiết') || target.includes('pituitary') || target.includes('tuyến yên') || target.includes('suprarenal') || target.includes('thượng thận') || target.includes('parathyroid') || target.includes('pineal')) {
    return CONSTITUENTS_DATABASE.endocrine;
  }
  if (target.includes('salivary') || target.includes('nước bọt') || target.includes('parotid') || target.includes('submandibular') || target.includes('sublingual') || target.includes('stensen') || target.includes('wharton')) {
    return CONSTITUENTS_DATABASE.salivary;
  }

  // 2. Fallback theo hệ cơ quan và phân vùng giải phẫu
  return getSystemFallbackConstituents(systemName, regionName, baseName);
}

function getSystemFallbackConstituents(systemName, regionName, baseName) {
  const sys = (systemName || '').toLowerCase();
  const reg = (regionName || '').toLowerCase();

  let diagram = '/images/atlas/skel_full.png';
  let title = `Cấu tạo Giải Phẫu: ${baseName || 'Bộ phận cơ thể'}`;

  if (sys.includes('xương') || sys.includes('skeletal')) {
    if (reg.includes('cột sống') || reg.includes('spine')) {
      diagram = '/images/atlas/skel_spine.png';
    } else if (reg.includes('đầu') || reg.includes('sọ') || reg.includes('head')) {
      diagram = '/images/atlas/skel_skull.png';
    } else if (reg.includes('chậu') || reg.includes('pelvis')) {
      diagram = '/images/atlas/skel_pelvis.png';
    } else {
      diagram = '/images/atlas/med_skeleton.png';
    }
  } else if (sys.includes('cơ') || sys.includes('muscular')) {
    if (reg.includes('đầu') || reg.includes('mặt')) {
      diagram = '/images/atlas/musc_head.png';
    } else if (reg.includes('chi')) {
      diagram = '/images/atlas/musc_limbs.png';
    } else {
      diagram = '/images/atlas/musc_torso.png';
    }
  } else if (sys.includes('thần kinh') || sys.includes('nervous')) {
    diagram = '/images/atlas/nerv_brain.png';
  } else if (sys.includes('tuần hoàn') || sys.includes('cardiovascular')) {
    diagram = '/images/atlas/circ_simplified.png';
  } else if (sys.includes('tiêu hóa') || sys.includes('visceral') || sys.includes('digestive')) {
    diagram = '/images/atlas/dig_upper.png';
  } else if (sys.includes('hô hấp') || sys.includes('respiratory')) {
    diagram = '/images/atlas/resp_lungs.png';
  }

  return {
    title,
    diagram,
    diagramCaption: `Sơ đồ giải phẫu tổng quan phân vùng ${regionName || systemName || 'cơ thể'}`,
    subparts: [
      { name: 'Phần thân chính', latin: 'Pars principalis', searchQuery: baseName, icon: '🎯' },
      { name: 'Mặt trước (Anterior)', latin: 'Facies anterior', searchQuery: baseName, icon: '⬆️' },
      { name: 'Mặt sau (Posterior)', latin: 'Facies posterior', searchQuery: baseName, icon: '⬇️' },
      { name: 'Mấu & Gân liên kết', latin: 'Insertio', searchQuery: baseName, icon: '🔗' },
      { name: 'Khung xương/Cơ nâng đỡ', latin: 'Fulcrum', searchQuery: baseName, icon: '🦴' }
    ]
  };
}
