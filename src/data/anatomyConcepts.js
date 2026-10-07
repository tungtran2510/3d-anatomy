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
    titleVi: 'Đĩa Đệm Cột Sống',
    latin: 'Discus intervertebralis (TA2: 1222)',
    subtitle: 'Khớp sụn sợi giảm chấn thủy lực 3 tầng liên kết',
    thumbnail: '/images/atlas/disc_cross_section.svg',
    system: 'joints',
    primaryPartId: 'Intervertebral disc L4-L5',
    subunits: [
      { label: '⭕ Vòng sợi ngoài', partId: 'Intervertebral disc L4-L5', note: '15–25 lá sợi collagen góc 30° dẻo dai' },
      { label: '💧 Nhân nhầy', partId: 'Nucleus pulposus L4-L5', note: 'Lõi hydrogel ngậm 80% nước chịu nén' },
      { label: '⚡ Thoát vị L4-L5', partId: 'Intervertebral disc L4-L5', note: 'Chèn rễ L5 gây đau thần kinh tọa' },
      { label: '⚡ Thoát vị L5-S1', partId: 'Intervertebral disc L5-S1', note: 'Chèn rễ S1 gây tê lan gót chân' }
    ],
    slides: [
      {
        id: 'cross_section',
        title: 'Cấu tạo',
        badge: 'Cấu tạo 3 lớp',
        image: '/images/atlas/disc_cross_section.svg',
        caption: 'Mặt cắt ngang bộc lộ Vòng sợi ôm trọn Nhân nhầy hydrogel ở tâm.'
      },
      {
        id: 'biomechanics',
        title: 'Cơ học',
        badge: 'Giảm chấn thủy lực',
        image: '/images/atlas/disc_biomechanics.svg',
        caption: 'Chuyển hóa lực nén dọc trục thành lực căng chu vi 360°.'
      },
      {
        id: 'pathology',
        title: '4 Cấp độ',
        badge: 'Tiến triển thoát vị',
        image: '/images/atlas/disc_herniation_levels.svg',
        caption: 'Từ thoái hóa mất nước đến nứt rách bao xơ chèn rễ tủy sống.'
      }
    ],
    simulator: {
      title: '⚡ MÔ PHỎNG THOÁT VỊ:',
      ticks: ['Bình thường', 'Phình', 'Lồi', 'Thoát vị'],
      stages: [
        { level: 'Cấp 0: Bình thường', desc: 'Đĩa đệm nguyên vẹn, lõi nhân giữ trọn 80% nước.' },
        { level: 'Cấp 1: Phình đĩa đệm', desc: 'Mất nước nhẹ, vòng sợi suy yếu và dãn phình.' },
        { level: 'Cấp 2: Lồi đĩa đệm', desc: 'Rách bán phần lá sợi, nhân dịch chuyển ra sau.' },
        { level: 'Cấp 3: Thoát vị chèn rễ', desc: 'Rách đứt bao xơ, nhân trào chèn bẹp rễ thần kinh.' }
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
    titleVi: 'Đa Giác Willis Não',
    latin: 'Circulus arteriosus cerebri (TA2: 4488)',
    subtitle: 'Vòng nối thông cấp máu nuôi toàn bộ não bộ',
    thumbnail: '/images/atlas/willis_anatomy.svg',
    system: 'cardiovascular',
    primaryPartId: 'Basilar artery',
    subunits: [
      { label: '🔴 ĐM Thân nền', partId: 'Basilar artery', note: 'Hợp lưu từ 2 ĐM đốt sống nuôi thân não' },
      { label: '🔴 ĐM Cảnh trong', partId: 'Internal carotid artery right', note: 'Trụ cột cấp máu chính cho 2 bán cầu' },
      { label: '🔵 ĐM Não giữa', partId: 'Internal carotid artery right', note: 'Nhánh hay bị tắc gây đột quỵ liệt nửa người' },
      { label: '⚡ ĐM Thông trước', partId: 'Basilar artery', note: 'Cầu nối huyết động học bàng hệ 2 bên' }
    ],
    slides: [
      {
        id: 'willis_anatomy',
        title: 'Mạng lưới',
        badge: 'Đa giác đáy não',
        image: '/images/atlas/willis_anatomy.svg',
        caption: 'Nối thông giữa hệ ĐM Cảnh trong và hệ Sống - Thân nền.'
      },
      {
        id: 'willis_collateral',
        title: 'Bàng hệ',
        badge: 'Bù trừ cấp máu',
        image: '/images/atlas/willis_collateral.svg',
        caption: 'Đảo chiều dòng máu qua ACom & PCom cứu sống bán cầu não.'
      },
      {
        id: 'willis_stroke_aneurysm',
        title: '4 Cấp độ',
        badge: 'Đột quỵ & Phình mạch',
        image: '/images/atlas/willis_stroke_aneurysm.svg',
        caption: 'Từ túi phình vi thể đến đột quỵ xuất huyết nguy kịch.'
      }
    ],
    simulator: {
      title: '🧠 TIẾN TRIỂN ĐỘT QUỴ:',
      ticks: ['Bình thường', 'Phình mạch', 'Hẹp ĐM', 'Vỡ / Đột quỵ'],
      stages: [
        { level: 'Cấp 0: Bình thường', desc: 'Thành mạch mềm mại, tưới máu não cân đối 2 bên.' },
        { level: 'Cấp 1: Phình mạch 3-5mm', desc: 'Túi phình mỏng ngã ba ACom, chưa triệu chứng.' },
        { level: 'Cấp 2: Hẹp nặng ĐM Não', desc: 'Hẹp >70% ĐM Não giữa, cơn thiếu máu não thoáng qua.' },
        { level: 'Cấp 3: Vỡ phình / Đột quỵ', desc: 'Vỡ túi phình gây xuất huyết dưới nhện (SAH) nguy kịch.' }
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
    titleVi: 'Gan – Mật – Tuyến Tụy',
    latin: 'Systema hepatobiliare et pancreas (TA2: 3000)',
    subtitle: 'Ngã ba tiêu hóa tiết mật & men tiêu hóa thức ăn',
    thumbnail: '/images/atlas/biliary_anatomy.svg',
    system: 'visceral',
    primaryPartId: 'Gallbladder',
    subunits: [
      { label: '🟢 Túi mật', partId: 'Gallbladder', note: 'Dự trữ & cô đặc 50ml dịch mật sẵn sàng tống xuất' },
      { label: '🟡 Tuyến tụy', partId: 'Pancreas', note: 'Tiết men tiêu hóa cực mạnh (Lipase, Amylase, Trypsin)' },
      { label: '🔴 Nhu mô gan', partId: 'Liver', note: 'Sản xuất 800ml dịch mật sinh hóa mỗi ngày' },
      { label: '⚡ Cơ vòng Oddi', partId: 'Gallbladder', note: 'Ngã ba cắm vào tá tràng D2, nơi sỏi hay kẹt lại' }
    ],
    slides: [
      {
        id: 'biliary_anatomy',
        title: 'Cấu tạo',
        badge: 'Ngã ba mật tụy',
        image: '/images/atlas/biliary_anatomy.svg',
        caption: 'Ống mật chủ và ống tụy chính cắm vào tá tràng qua Oddi.'
      },
      {
        id: 'biliary_physiology',
        title: 'Sinh lý',
        badge: 'Men tiêu hóa',
        image: '/images/atlas/biliary_physiology.svg',
        caption: 'Muối mật nhũ hóa lipid kết hợp men tụy phân cắt thức ăn.'
      },
      {
        id: 'biliary_gallstone_stages',
        title: '4 Cấp độ',
        badge: 'Tiến triển sỏi mật',
        image: '/images/atlas/biliary_gallstone_stages.svg',
        caption: 'Sỏi di chuyển kẹt Oddi gây viêm tụy cấp hoại tử.'
      }
    ],
    simulator: {
      title: '🧪 TIẾN TRIỂN SỎI MẬT:',
      ticks: ['Bình thường', 'Sỏi túi mật', 'Kẹt cổ túi', 'Kẹt Oddi / Tụy'],
      stages: [
        { level: 'Cấp 0: Bình thường', desc: 'Dịch mật lưu thông êm dịu, Oddi mở nhịp nhàng vào tá tràng.' },
        { level: 'Cấp 1: Sỏi túi mật', desc: 'Lắng đọng cholesterol đáy túi mật, chưa tắc nghẽn.' },
        { level: 'Cấp 2: Kẹt cổ túi mật', desc: 'Sỏi kẹt phễu Hartmann gây đau quặn hạ sườn phải.' },
        { level: 'Cấp 3: Sỏi kẹt Oddi / Tụy', desc: 'Trào ngược mật gây viêm tụy cấp hoại tử nguy kịch, vàng da.' }
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
