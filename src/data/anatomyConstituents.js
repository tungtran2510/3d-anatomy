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
      { name: 'Van hai lá', latin: 'Valva mitralis', searchQuery: 'Mitral', icon: '🚪' },
      { name: 'Van ba lá', latin: 'Valva tricuspidalis', searchQuery: 'Tricuspid', icon: '🚪' }
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
      { name: 'Cơ thắt môn vị', latin: 'Pylorus', searchQuery: 'Pylorus', icon: '🔒' },
      { name: 'Bờ cong nhỏ', latin: 'Curvatura minor', searchQuery: 'Stomach', icon: '↩️' },
      { name: 'Bờ cong lớn', latin: 'Curvatura major', searchQuery: 'Stomach', icon: '↪️' }
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
      { name: 'Thân não (Cầu não, Hành não)', latin: 'Truncus encephali', searchQuery: 'Brainstem', icon: '🌳' },
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
      { name: '3 Ống bán khuyên tiền đình', latin: 'Canales semicirculares', searchQuery: 'Semicircular', icon: '🔄' }
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
  }
};

/**
 * Tìm kiếm cấu tạo chi tiết & hình ảnh giải phẫu cho bất kỳ bộ phận nào
 */
export function getConstituentsForPart(partId, baseName, systemName, regionName) {
  const target = `${partId || ''} ${baseName || ''} ${systemName || ''} ${regionName || ''}`.toLowerCase();

  // 1. Khớp từ khóa cụ thể
  if (target.includes('liver') || target.includes('gan') || target.includes('hepar') || target.includes('gallbladder') || target.includes('biliary')) {
    return CONSTITUENTS_DATABASE.liver;
  }
  if (target.includes('heart') || target.includes('tim') || target.includes('cardiac') || target.includes('ventricle') || target.includes('atrium') || target.includes('aorta')) {
    return CONSTITUENTS_DATABASE.heart;
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
  if (target.includes('kidney') || target.includes('thận') || target.includes('ren') || target.includes('ureter') || target.includes('bladder')) {
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
  if (target.includes('endocrine') || target.includes('nội tiết') || target.includes('thyroid') || target.includes('tuyến giáp') || target.includes('pituitary') || target.includes('tuyến yên') || target.includes('suprarenal') || target.includes('thượng thận') || target.includes('parathyroid') || target.includes('pineal')) {
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
