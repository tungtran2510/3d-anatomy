// Anatomy Concepts Store - Smart Symptom-to-Anatomy & Multi-Layer Concept Cards
// Provides visual concept cards in Search and multi-slide interactive micro-decks

export const ANATOMY_CONCEPTS = [
  {
    id: 'concept_intervertebral_disc',
    keywords: [
      'đĩa đệm', 'dia dem', 'thoát vị', 'thoat vi', 'hnp', 
      'annulus', 'fibrosus', 'nucleus', 'pulposus', 
      'thần kinh tọa', 'than kinh toa', 'đau thần kinh tọa',
      'tê chân', 'l4-l5', 'l5-s1', 'c5-c6', 'cột sống'
    ],
    titleVi: 'ĐĨA ĐỆM CỘT SỐNG (GỒM VÒNG SỢI & NHÂN NHẦY)',
    latin: 'Discus intervertebralis (TA2: 1222)',
    subtitle: 'Khớp sụn sợi giảm chấn thủy lực gồm 3 tầng lớp liên kết sinh học',
    thumbnail: '/images/atlas/disc_cross_section.svg',
    system: 'joints',
    primaryPartId: 'Intervertebral disc L4-L5',
    subunits: [
      { label: '⭕ Vòng sợi ngoài (15–25 lá)', partId: 'Intervertebral disc L4-L5', note: 'Collagen Type I xếp chéo góc 30° dẻo dai' },
      { label: '💧 Nhân nhầy (80% nước)', partId: 'Nucleus pulposus L4-L5', note: 'Lõi hydrogel giàu Aggrecan chịu nén thủy tĩnh' },
      { label: '⚡ Thoát vị L4-L5 (Rễ L5)', partId: 'Intervertebral disc L4-L5', note: 'Chèn rễ L5 gây đau thần kinh tọa, tê mu bàn chân' },
      { label: '⚡ Thoát vị L5-S1 (Rễ S1)', partId: 'Intervertebral disc L5-S1', note: 'Chèn rễ S1 gây đau lan gót chân, yếu cơ bắp chân' },
      { label: 'Đĩa đệm cổ C5-C6', partId: 'Intervertebral disc C5-C6', note: 'Thoát vị cổ phổ biến nhất gây tê bì ngón tay cái' }
    ],
    slides: [
      {
        id: 'cross_section',
        title: 'Lát Cắt Vi Thể',
        badge: 'Cấu tạo 3 lớp',
        image: '/images/atlas/disc_cross_section.svg',
        caption: 'Mặt cắt ngang bộc lộ Vòng sợi (15-25 lá collagen góc 30°) ôm trọn Nhân nhầy hydrogel ở tâm.'
      },
      {
        id: 'biomechanics',
        title: 'Cơ Sinh Học',
        badge: 'Giảm chấn thủy lực',
        image: '/images/atlas/disc_biomechanics.svg',
        caption: 'Chuyển hóa lực nén ép dọc trục thành lực căng chu vi 360°, bảo vệ tủy sống khi vận động.'
      },
      {
        id: 'pathology',
        title: '4 Cấp Độ Thoát Vị',
        badge: 'Bệnh học lâm sàng',
        image: '/images/atlas/disc_herniation_levels.svg',
        caption: 'Từ thoái hóa mất nước đến nứt rách vòng sợi, nhân nhầy trào ra chèn bẹp rễ thần kinh tủy sống.'
      }
    ],
    simulator: {
      title: '⚡ MÔ PHỎNG TIẾN TRIỂN THOÁT VỊ:',
      ticks: ['Bình thường', 'Phình', 'Lồi', 'Thoát vị'],
      stages: [
        { level: 'Cấp 0: Bình thường', desc: 'Đĩa đệm nguyên vẹn, lõi nhân nhầy giữ trọn 80% nước, mâm sụn dinh dưỡng tốt.' },
        { level: 'Cấp 1: Phình đĩa đệm (Degeneration)', desc: 'Mất nước nhẹ, vòng sợi suy yếu và phình đều chu vi, chưa rách vỏ sợi.' },
        { level: 'Cấp 2: Lồi đĩa đệm (Prolapse)', desc: 'Rách bán phần các lá sợi bên trong, nhân nhầy dịch chuyển ra sau nhưng còn vỏ bao bọc.' },
        { level: 'Cấp 3: Thoát vị chèn rễ (Extrusion)', desc: 'Rách đứt toàn bộ vòng sợi, khối nhân trào vào ống sống đè bẹp rễ thần kinh tủy sống.' }
      ]
    },
    video: {
      title: 'Mô phỏng 3D: Cơ Chế Thoát Vị Đĩa Đệm',
      url: 'https://www.youtube.com/embed/3ZfVjV7VqJ8',
      duration: '0:45'
    }
  },

  {
    id: 'concept_circle_of_willis',
    keywords: [
      'willis', 'đa giác willis', 'da giac willis', 'mạch máu não', 'mach mau nao',
      'đột quỵ', 'dot quy', 'tai biến', 'tai bien', 'phình mạch', 'phinh mach',
      'aneurysm', 'stroke', 'basilar', 'thân nền', 'than nen', 'cảnh trong', 'canh trong',
      'não giữa', 'nao giua', 'mca', 'aca', 'pca', 'não trước', 'não sau'
    ],
    titleVi: 'ĐA GIÁC WILLIS (TUẦN HOÀN MẠCH MÁU NÃO)',
    latin: 'Circulus arteriosus cerebri (TA2: 4488)',
    subtitle: 'Mạng lưới nối thông động mạch khép kín cấp máu nuôi toàn bộ não bộ',
    thumbnail: '/images/atlas/willis_anatomy.svg',
    system: 'cardiovascular',
    primaryPartId: 'Basilar artery',
    subunits: [
      { label: '🔴 ĐM Thân nền (Basilar)', partId: 'Basilar artery', note: 'Hợp lưu từ 2 ĐM đốt sống nuôi thân não và tiểu não' },
      { label: '🔴 ĐM Cảnh trong (ICA)', partId: 'Internal carotid artery right', note: 'Trụ cột cấp máu chính cho 2 bán cầu đại não' },
      { label: '🔵 ĐM Não giữa (MCA)', partId: 'Internal carotid artery right', note: 'Vùng cấp máu lớn nhất, nhánh hay bị tắc gây đột quỵ liệt nửa người' },
      { label: '⚡ ĐM Thông trước (ACom)', partId: 'Basilar artery', note: 'Cầu nối huyết động học bàng hệ giữa 2 bán cầu' }
    ],
    slides: [
      {
        id: 'willis_anatomy',
        title: 'Mạng Lưới Đa Giác',
        badge: 'Giải phẫu động mạch',
        image: '/images/atlas/willis_anatomy.svg',
        caption: 'Mạng lưới nối thông giữa hệ Động mạch Cảnh trong và hệ Động mạch Sống - Thân nền tại đáy não.'
      },
      {
        id: 'willis_collateral',
        title: 'Tuần Hoàn Bàng Hệ',
        badge: 'Huyết động học bù trừ',
        image: '/images/atlas/willis_collateral.svg',
        caption: 'Cơ chế đảo chiều dòng máu qua ACom & PCom cứu sống bán cầu não khi một nhánh động mạch cảnh bị tắc.'
      },
      {
        id: 'willis_stroke_aneurysm',
        title: '4 Cấp Độ Đột Quỵ',
        badge: 'Phình mạch & Tai biến',
        image: '/images/atlas/willis_stroke_aneurysm.svg',
        caption: 'Từ túi phình vi thể không triệu chứng đến đột quỵ thiếu máu cục bộ và vỡ phình xuất huyết khoang dưới nhện (SAH).'
      }
    ],
    simulator: {
      title: '🧠 MÔ PHỎNG PHÌNH MẠCH & ĐỘT QUỴ NÃO:',
      ticks: ['Bình thường', 'Phình mạch', 'Hẹp ĐM', 'Vỡ / Đột quỵ'],
      stages: [
        { level: 'Cấp 0: Bình thường', desc: 'Thành động mạch trơn láng, đàn hồi tốt, dòng máu tưới đều 2 bán cầu não.' },
        { level: 'Cấp 1: Phình động mạch (Aneurysm 3-5mm)', desc: 'Thành mạch mỏng phình hình quả dâu tại ngã ba ACom, thường không triệu chứng.' },
        { level: 'Cấp 2: Hẹp ĐM Não giữa (MCA Stenosis >70%)', desc: 'Mảng xơ vữa làm hẹp nặng lòng mạch, gây cơn thiếu máu não thoáng qua (TIA).' },
        { level: 'Cấp 3: Vỡ túi phình / Đột quỵ diện rộng', desc: 'Vỡ túi phình gây xuất huyết dưới nhện (SAH), đau đầu sét đánh, hôn mê nguy kịch.' }
      ]
    },
    video: {
      title: 'Mô phỏng 3D: Dòng Chảy & Đột Quỵ Đa Giác Willis',
      url: 'https://www.youtube.com/embed/Pj1eXvWd7fI',
      duration: '0:50'
    }
  },

  {
    id: 'concept_hepatobiliary_pancreas',
    keywords: [
      'gan', 'túi mật', 'tui mat', 'tụy', 'tuyến tụy', 'tuyen tuy', 'sỏi mật', 'soi mat',
      'viêm tụy', 'viem tuy', 'vàng da', 'vang da', 'ống mật chủ', 'ong mat chu',
      'oddi', 'vater', 'wirsung', 'gallbladder', 'pancreas', 'liver', 'mật', 'mat'
    ],
    titleVi: 'PHỨC HỢP GAN – TÚI MẬT – TUYẾN TỤY',
    latin: 'Systema hepatobiliare et pancreas (TA2: 3000)',
    subtitle: 'Ngã ba tiêu hóa giải phẫu tiết mật & enzym tiêu hóa thức ăn dầu mỡ',
    thumbnail: '/images/atlas/biliary_anatomy.svg',
    system: 'visceral',
    primaryPartId: 'Gallbladder',
    subunits: [
      { label: '🟢 Túi mật (Gallbladder)', partId: 'Gallbladder', note: 'Cô đặc và dự trữ 50ml dịch mật sẵn sàng tống xuất' },
      { label: '🟡 Tuyến tụy (Pancreas)', partId: 'Pancreas', note: 'Tiết các men tiêu hóa cực mạnh (Amylase, Lipase, Trypsin)' },
      { label: '🔴 Nhu mô gan (Liver)', partId: 'Liver', note: 'Nhà máy sinh hóa sản xuất 800ml dịch mật mỗi ngày' },
      { label: '⚡ Cơ vòng Oddi & Bóng Vater', partId: 'Gallbladder', note: 'Ngã ba sinh tử hợp lưu giữa ống mật chủ và ống tụy chính' }
    ],
    slides: [
      {
        id: 'biliary_anatomy',
        title: 'Ngã Ba Mật Tụy',
        badge: 'Cấu trúc giải phẫu',
        image: '/images/atlas/biliary_anatomy.svg',
        caption: 'Hợp lưu giữa Ống mật chủ và Ống tụy chính Wirsung cắm vào thành tá tràng qua Cơ vòng Oddi.'
      },
      {
        id: 'biliary_physiology',
        title: 'Sinh Lý Tiết Mật',
        badge: 'Hòa hợp tiêu hóa',
        image: '/images/atlas/biliary_physiology.svg',
        caption: 'Muối mật nhũ hóa chất béo kết hợp men tụy lipase phân cắt thức ăn, điều hòa bởi hormone CCK.'
      },
      {
        id: 'biliary_gallstone_stages',
        title: '4 Cấp Độ Sỏi Mật',
        badge: 'Bệnh lý & Biến chứng',
        image: '/images/atlas/biliary_gallstone_stages.svg',
        caption: 'Sự di chuyển nguy hiểm của sỏi từ túi mật xuống kẹt tại cơ vòng Oddi gây viêm tụy cấp hoại tử.'
      }
    ],
    simulator: {
      title: '🧪 MÔ PHỎNG TIẾN TRIỂN SỎI MẬT & VIÊM TỤY:',
      ticks: ['Bình thường', 'Sỏi túi mật', 'Kẹt cổ túi', 'Kẹt Oddi / Tụy'],
      stages: [
        { level: 'Cấp 0: Bình thường', desc: 'Dịch mật lưu thông êm dịu, cơ vòng Oddi co bóp nhịp nhàng vào tá tràng.' },
        { level: 'Cấp 1: Sỏi trong túi mật (Cholelithiasis)', desc: 'Lắng đọng bùn và sỏi cholesterol dưới đáy túi mật, thường chưa gây tắc nghẽn.' },
        { level: 'Cấp 2: Kẹt cổ túi mật (Cystic duct obstruction)', desc: 'Sỏi kẹt tại phễu Hartmann gây ứ căng túi mật, đau quặn dữ dội hạ sườn phải.' },
        { level: 'Cấp 3: Sỏi kẹt Cơ vòng Oddi / Viêm tụy cấp', desc: 'Trào ngược dịch mật kích hoạt enzyme tự tiêu hủy nhu mô tụy, vàng da tắc mật nguy kịch.' }
      ]
    },
    video: {
      title: 'Mô phỏng 3D: Cơ Chế Sỏi Mật & Viêm Tụy Cấp',
      url: 'https://www.youtube.com/embed/8vK5eOqY7Qc',
      duration: '0:55'
    }
  }
];

export function findAnatomyConcept(query) {
  if (!query || typeof query !== 'string') return null;
  const clean = query.toLowerCase().trim();
  if (clean.length < 2) return null;

  return ANATOMY_CONCEPTS.find(concept => {
    return concept.keywords.some(kw => clean.includes(kw) || kw.includes(clean));
  }) || null;
}

export function getVisualDeckForPart(partId) {
  if (!partId) return null;
  const lower = String(partId).toLowerCase();

  // 1. Intervertebral Disc
  if (
    lower.includes('intervertebral') || 
    lower.includes('đĩa đệm') || 
    lower.includes('dia dem') || 
    lower.includes('discus') || 
    lower.includes('nucleus') ||
    lower.includes('pulposus') ||
    lower.includes('annulus') ||
    lower.includes('fibrosus')
  ) {
    return ANATOMY_CONCEPTS.find(c => c.id === 'concept_intervertebral_disc');
  }

  // 2. Circle of Willis & Cerebral Arteries
  if (
    lower.includes('basilar') ||
    lower.includes('carotid') ||
    lower.includes('cerebral artery') ||
    lower.includes('communicating artery') ||
    lower.includes('willis') ||
    lower.includes('vertebral artery')
  ) {
    return ANATOMY_CONCEPTS.find(c => c.id === 'concept_circle_of_willis');
  }

  // 3. Hepatobiliary & Pancreas
  if (
    lower.includes('gallbladder') ||
    lower.includes('pancreas') ||
    lower.includes('liver') ||
    lower.includes('bile duct') ||
    lower.includes('hepatic duct') ||
    lower.includes('cystic duct')
  ) {
    return ANATOMY_CONCEPTS.find(c => c.id === 'concept_hepatobiliary_pancreas');
  }

  return null;
}
