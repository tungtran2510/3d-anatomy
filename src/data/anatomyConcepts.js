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
    video: {
      title: 'Mô phỏng 3D: Cơ Chế Thoát Vị Đĩa Đệm',
      url: 'https://www.youtube.com/embed/3ZfVjV7VqJ8',
      duration: '0:45'
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
  return null;
}
