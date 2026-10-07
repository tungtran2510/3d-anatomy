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
      title: '⚡ THOÁT VỊ ĐĨA ĐỆM:',
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
      { label: '🔴 ĐM Cảnh trong', partId: 'Internal carotid artery.r', note: 'Trụ cột cấp máu chính cho 2 bán cầu' },
      { label: '🔵 ĐM Não giữa', partId: 'Internal carotid artery.r', note: 'Nhánh hay bị tắc gây đột quỵ liệt nửa người' },
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
      title: '🧠 ĐỘT QUỴ ĐM NÃO:',
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
      title: '🧪 BỆNH LÝ MẬT - TỤY:',
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
  },

  {
    id: 'concept_knee_joint_ligaments',
    keywords: [
      'khớp gối', 'khop goi', 'gối', 'goi', 'dây chằng chéo', 'day chang cheo',
      'acl', 'pcl', 'mcl', 'lcl', 'sụn chêm', 'sun chem', 'meniscus',
      'rách sụn chêm', 'rach sun chem', 'đứt dây chằng', 'dut day chang',
      'thoái hóa khớp gối', 'thoai hoa khop goi', 'lỏng gối', 'tràn dịch gối',
      'patella', 'bánh chè', 'banh che', 'cruciate', 'collateral ligament'
    ],
    titleVi: 'Phức Hợp Khớp Gối & Dây Chằng',
    latin: 'Articulatio genus et ligamenta cruciata (TA2: 1530)',
    subtitle: 'Khớp chịu tải lớn nhất & 4 trụ cột dây chằng giữ vững',
    thumbnail: '/images/atlas/knee_anatomy.svg',
    system: 'joints',
    primaryPartId: 'Anterior cruciate ligament.r',
    subunits: [
      { label: '⚡ Chéo trước (ACL)', partId: 'Anterior cruciate ligament.r', note: 'Khóa trượt mâm chày ra trước, trụ cột khi nhảy & tiếp đất' },
      { label: '🛡️ Chéo sau (PCL)', partId: 'Posterior cruciate ligament.r', note: 'Bó sợi to khỏe gấp 2 lần ACL, ngăn mâm chày thụt ra sau' },
      { label: '🌙 Sụn chêm (Meniscus)', partId: 'Medial meniscus.r', note: 'Đệm sợi bán nguyệt hấp thu 70% phản lực chấn động' },
      { label: '🧱 Dây chằng bên (MCL/LCL)', partId: 'Fibular collateral ligament.r', note: 'Ổn định trục ngang, chống vẹo gối trong và ngoài' }
    ],
    slides: [
      {
        id: 'knee_anatomy',
        title: 'Cấu tạo',
        badge: '4 Trụ cột dây chằng',
        image: '/images/atlas/knee_anatomy.svg',
        caption: 'Mặt trước khớp gối bộc lộ xương đùi, xương chày, ACL, PCL và sụn chêm.'
      },
      {
        id: 'knee_biomechanics',
        title: 'Cơ sinh học',
        badge: 'Chịu tải 300% BW',
        image: '/images/atlas/knee_biomechanics.svg',
        caption: 'Cơ chế cuộn – trượt lồi cầu đùi và sụn chêm đệm tải trọng nén.'
      },
      {
        id: 'knee_injury_stages',
        title: '4 Cấp độ',
        badge: 'Chấn thương thể thao',
        image: '/images/atlas/knee_injury_stages.svg',
        caption: 'Từ giãn vi thể đến đứt hoàn toàn ACL và rách sụn quai vali kẹt gối.'
      }
    ],
    simulator: {
      title: '⚡ CHẤN THƯƠNG GỐI:',
      ticks: ['Bình thường', 'Giãn Độ 1', 'Rách Độ 2', 'Đứt Độ 3'],
      stages: [
        { level: 'Cấp 0: Bình thường', desc: 'Dây chằng căng chắc, sụn chêm trơn láng, khớp gối vững vàng 100%.' },
        { level: 'Cấp 1: Giãn Độ 1', desc: 'Rách vi thể <5% bó sợi, phù nề nhẹ quanh gối, chưa mất vững trục.' },
        { level: 'Cấp 2: Rách bán phần Độ 2', desc: 'Đứt 50% bó sợi, gối lỏng lẻo khi vặn xoay, tràn dịch khớp.' },
        { level: 'Cấp 3: Đứt hoàn toàn Độ 3', desc: 'Đứt lìa toàn bộ ACL kèm rách sụn quai vali, dấu hiệu ngăn kéo trước (+).' }
      ]
    },
    video: {
      title: 'Mô phỏng 3D: Cơ Chế Đứt Dây Chằng ACL & Rách Sụn Chêm',
      url: 'https://www.youtube.com/embed/36y0wHn04_s',
      duration: '0:52'
    }
  },

  {
    id: 'concept_gastrointestinal_tract',
    keywords: [
      'dạ dày', 'da day', 'bao tử', 'bao tu', 'tá tràng', 'ta trang', 'hành tá tràng',
      'ruột thừa', 'ruot thua', 'viêm ruột thừa', 'viem ruot thua', 'ruột non', 'ruot non',
      'đại tràng', 'dai trang', 'ruột già', 'ruot gia', 'trực tràng', 'truc trang',
      'polyp', 'loét dạ dày', 'loet da day', 'h. pylori', 'trĩ', 'tri', 'mcburney',
      'stomach', 'duodenum', 'appendix', 'colon'
    ],
    titleVi: 'Hệ Ống Tiêu Hóa & Ổ Bụng',
    latin: 'Tractus gastrointestinalis (TA2: 2850)',
    subtitle: 'Chuỗi tiêu hóa liên tục chuyển hóa dinh dưỡng & đào thải cặn bã',
    thumbnail: '/images/atlas/gi_tract_anatomy.svg',
    system: 'visceral',
    primaryPartId: 'Stomach',
    subunits: [
      { label: '🍲 Dạ dày (Stomach)', partId: 'Stomach', note: 'Chứa 1.5–2L, nhào trộn acid HCl pH 1.5–2 diệt khuẩn & tiêu hóa đạm' },
      { label: '🌀 Hành tá tràng (Duodenum)', partId: 'Duodenum', note: 'Cửa ngõ trung hòa acid dịch vị & hấp thu dưỡng chất đầu tiên' },
      { label: '⚡ Ruột thừa (Appendix)', partId: 'Vermiform appendix', note: 'Túi lympho miễn dịch manh tràng, vị trí viêm cấp hay gặp nhất' },
      { label: '⭕ Khung đại tràng (Colon)', partId: 'Transverse colon', note: 'Hấp thu nước, tái hấp thu điện giải và tạo khuôn phân' }
    ],
    slides: [
      {
        id: 'gi_tract_anatomy',
        title: 'Cấu tạo',
        badge: 'Chuỗi liên tục',
        image: '/images/atlas/gi_tract_anatomy.svg',
        caption: 'Toàn cảnh ống tiêu hóa từ thực quản qua dạ dày, tá tràng đến ruột thừa.'
      },
      {
        id: 'gi_endoscopy_physiology',
        title: 'Sinh lý',
        badge: 'Hàng rào bảo vệ',
        image: '/images/atlas/gi_endoscopy_physiology.svg',
        caption: 'Màng nhầy Bicarbonate kiềm pH 7.0 bảo vệ niêm mạc khỏi acid pH 1.5.'
      },
      {
        id: 'gi_pathology_stages',
        title: '4 Cấp độ',
        badge: 'Tiến triển bệnh học',
        image: '/images/atlas/gi_pathology_stages.svg',
        caption: 'Từ viêm trợt niêm mạc đến loét thủng dạ dày & viêm ruột thừa vỡ mủ.'
      }
    ],
    simulator: {
      title: '🔬 BỆNH LÝ TIÊU HÓA:',
      ticks: ['Bình thường', 'Viêm trợt', 'Loét sâu', 'Biến chứng cấp'],
      stages: [
        { level: 'Cấp 0: Bình thường', desc: 'Hàng rào nhầy bảo vệ nguyên vẹn, niêm mạc hồng hào trơn bóng.' },
        { level: 'Cấp 1: Viêm trợt niêm mạc', desc: 'Trợt lớp biểu mô bề mặt, xung huyết phù nề, ợ hơi nóng rát.' },
        { level: 'Cấp 2: Loét sâu thành cơ', desc: 'Ổ loét ăn sâu lớp cơ niêm, đau quặn khi đói, rỉ máu mao mạch.' },
        { level: 'Cấp 3: Biến chứng cấp tính', desc: 'Thủng tạng rỗng / Viêm ruột thừa vỡ mủ, bụng cứng như gỗ cấp cứu.' }
      ]
    },
    video: {
      title: 'Mô phỏng 3D: Cơ Chế Loét Dạ Dày Tá Tràng & Viêm Ruột Thừa Cấp',
      url: 'https://www.youtube.com/embed/z13P_zZvZ4U',
      duration: '0:58'
    }
  },
  {
    id: 'concept_cardiac_valves',
    keywords: [
      'tim', 'heart', 'tâm thất', 'tam that', 'tâm nhĩ', 'tam nhi',
      'ventricle', 'atrium', 'van tim', 'van 2 lá', 'van 3 lá', 'van đm chủ',
      'mitral', 'tricuspid', 'aortic valve', 'pulmonary valve', 'động mạch chủ',
      'suy tim', 'hở van', 'hẹp van', 'nhồi máu cơ tim'
    ],
    titleVi: 'Hệ Tim Mạch & 4 Buồng Tim',
    latin: 'Cor / Apparatus cardiovascularis (TA2: 3672)',
    subtitle: 'Giải phẫu 4 buồng tim, chu trình tâm thu/tâm trương & 4 van tim',
    thumbnail: '/images/atlas/cardiac_anatomy.svg',
    system: 'cardiovascular',
    primaryPartId: 'Left ventricle',
    subunits: [
      { label: '🫀 Tâm thất trái', partId: 'Left ventricle', note: 'Buồng bơm máu chính áp lực 120mmHg đi nuôi cơ thể' },
      { label: '🩸 Van 2 lá', partId: 'Left ventricle', note: 'Van ngăn trào ngược giữa nhĩ trái và thất trái' },
      { label: '🔴 Van ĐM chủ', partId: 'Ascending aorta', note: 'Van một chiều mở thì tâm thu tống máu vào tuần hoàn lớn' },
      { label: '🫁 Vách tim', partId: 'Right ventricle', note: 'Vách liên thất và liên nhĩ ngăn máu giàu/nghèo Oxy' }
    ],
    slides: [
      {
        id: 'anatomy',
        title: 'Cấu tạo',
        badge: '4 Buồng tim & Van',
        image: '/images/atlas/cardiac_anatomy.svg',
        caption: 'Mặt cắt bộc lộ Nhĩ phải, Thất phải, Nhĩ trái, Thất trái và 4 van tim một chiều.'
      },
      {
        id: 'physiology',
        title: 'Huyết động',
        badge: 'Tâm thu & Tâm trương',
        image: '/images/atlas/cardiac_cycle.svg',
        caption: 'Chu trình co bóp 0.8s tống máu nuôi toàn thân và hút máu hồi lưu.'
      },
      {
        id: 'pathology',
        title: '4 Cấp độ',
        badge: 'Hẹp hở van & Suy tim',
        image: '/images/atlas/cardiac_valve_pathology.svg',
        caption: 'Tiến triển từ sa van nhẹ, dòng trào ngược đến suy tim và phù phổi cấp.'
      }
    ],
    simulator: {
      title: '🫀 BỆNH LÝ VAN TIM & CƠ TIM:',
      ticks: ['Bình thường', 'Sa van', 'Hở van', 'Suy tim'],
      stages: [
        { level: 'Cấp 0: Bình thường', desc: '4 van đóng kín hoàn toàn, phân suất tống máu EF > 60%.' },
        { level: 'Cấp 1: Sa van tim', desc: 'Lá van võng ngược vào buồng nhĩ, có tiếng Click tâm thu nhẹ.' },
        { level: 'Cấp 2: Hở van vừa', desc: 'Dòng máu phụt ngược thất trái, tim phì đại bù trừ, khó thở khi gắng sức.' },
        { level: 'Cấp 3: Suy tim cấp', desc: 'EF < 35%, ứ máu mao mạch phổi gây phù phổi cấp nguy kịch.' }
      ]
    },
    video: {
      title: 'Mô phỏng 3D: Cấu Tạo Tim & Chu Trình Hoạt Động Của Van Tim',
      url: 'https://www.youtube.com/embed/7XaftdE_h60',
      duration: '1:10'
    }
  },
  {
    id: 'concept_respiratory_alveoli',
    keywords: [
      'phổi', 'phoi', 'lung', 'khí quản', 'khi quan', 'trachea',
      'phế quản', 'phe quan', 'bronchus', 'bronchial', 'phế nang', 'phe nang',
      'alveoli', 'alveolus', 'màng phổi', 'mang phoi', 'cơ hoành', 'co hoanh',
      'hô hấp', 'ho hap', 'respiratory', 'hen suyễn', 'copd', 'khó thở'
    ],
    titleVi: 'Hệ Hô Hấp & Phế Nang',
    latin: 'Systema respiratorium / Pulmones (TA2: 3100)',
    subtitle: 'Cây khí phế quản 23 thế hệ, chùm phế nang mao mạch & trao đổi khí',
    thumbnail: '/images/atlas/respiratory_anatomy.svg',
    system: 'visceral',
    primaryPartId: 'Superior lobe of left lung',
    subunits: [
      { label: '🫁 Phổi & Phế nang', partId: 'Superior lobe of left lung', note: '300 triệu phế nang diện tích 70–100m² trao đổi khí' },
      { label: '🌬️ Cây phế quản', partId: 'Trachea', note: '23 thế hệ phân nhánh dẫn và sưởi ấm không khí' },
      { label: '💨 Cơ hoành', partId: 'Diaphragm', note: 'Cơ hô hấp chính tạo chênh lệch áp suất lồng ngực' },
      { label: '🛡️ Màng phổi', partId: 'Superior lobe of right lung', note: 'Lá thành và lá tạng chứa dịch giảm ma sát hô hấp' }
    ],
    slides: [
      {
        id: 'anatomy',
        title: 'Cấu tạo',
        badge: 'Cây khí phế quản',
        image: '/images/atlas/respiratory_anatomy.svg',
        caption: 'Hệ thống đường dẫn khí từ Khí quản, Phế quản gốc đến 2 lá phổi.'
      },
      {
        id: 'physiology',
        title: 'Sinh lý',
        badge: 'Trao đổi khí O2/CO2',
        image: '/images/atlas/respiratory_alveoli_gas_exchange.svg',
        caption: 'Khuếch tán qua màng phế nang mao mạch 0.5 µm nuôi dưỡng hồng cầu.'
      },
      {
        id: 'pathology',
        title: '4 Cấp độ',
        badge: 'Co thắt hen & COPD',
        image: '/images/atlas/respiratory_copd_asthma.svg',
        caption: 'Từ co thắt phế quản nhẹ, nút nhầy bít tắc đến xẹp phế nang và suy hô hấp.'
      }
    ],
    simulator: {
      title: '🫁 ĐƯỜNG THỞ & PHẾ NANG:',
      ticks: ['Bình thường', 'Co thắt nhẹ', 'Tắc nhầy', 'Suy hô hấp'],
      stages: [
        { level: 'Cấp 0: Thông thoáng', desc: 'Đường thở sạch, niêm mạc mỏng, SpO2 98–100% thở êm dịu.' },
        { level: 'Cấp 1: Co thắt nhẹ', desc: 'Cơ trơn phế quản co hẹp, xuất hiện tiếng rít nhẹ thì thở ra.' },
        { level: 'Cấp 2: Tắc nghẽn nhầy', desc: 'Tăng tiết đờm đặc quánh, bẫy khí trong phổi, SpO2 tụt 90–93%.' },
        { level: 'Cấp 3: Suy hô hấp', desc: 'Bít tắc hoàn toàn, xẹp phế nang lan tỏa, tím tái đe dọa tính mạng.' }
      ]
    },
    video: {
      title: 'Mô phỏng 3D: Cơ Chế Hít Thở & Trao Đổi Khí Tại Phế Nang',
      url: 'https://www.youtube.com/embed/bHZsvBdUC2I',
      duration: '1:05'
    }
  }
];

export function normaliseConceptText(str) {
  if (!str) return '';
  return str.normalize('NFD').replace(/[\u0300-\u036f]/g, '').replace(/[đĐ]/g, 'd').toLowerCase().trim();
}

export function findAnatomyConcept(query) {
  if (!query || typeof query !== 'string') return null;
  const clean = query.toLowerCase().trim();
  if (clean.length < 2) return null;
  const norm = normaliseConceptText(clean);

  return ANATOMY_CONCEPTS.find(concept => {
    return concept.keywords.some(kw => {
      const kwLower = kw.toLowerCase().trim();
      const kwNorm = normaliseConceptText(kw);
      return clean.includes(kwLower) || kwLower.includes(clean) || norm.includes(kwNorm) || kwNorm.includes(norm);
    });
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

  // 4. Knee Joint & Cruciate Ligaments (ACL / PCL / Meniscus / Collateral)
  if (
    lower.includes('cruciate') ||
    lower.includes('meniscus') ||
    lower.includes('knee') ||
    lower.includes('patellar') ||
    lower.includes('khớp gối') ||
    lower.includes('dây chằng chéo') ||
    lower.includes('sụn chêm') ||
    lower.includes('fibular collateral') ||
    lower.includes('tibial collateral')
  ) {
    return ANATOMY_CONCEPTS.find(c => c.id === 'concept_knee_joint_ligaments');
  }

  // 5. Gastrointestinal Tract (Stomach, Duodenum, Appendix, Colon)
  if (
    lower.includes('stomach') ||
    lower.includes('gastric') ||
    lower.includes('duodenum') ||
    lower.includes('appendix') ||
    lower.includes('append') ||
    lower.includes('colon') ||
    lower.includes('cecum') ||
    lower.includes('rectum') ||
    lower.includes('dạ dày') ||
    lower.includes('tá tràng') ||
    lower.includes('ruột thừa') ||
    lower.includes('đại tràng')
  ) {
    return ANATOMY_CONCEPTS.find(c => c.id === 'concept_gastrointestinal_tract');
  }

  // 6. Cardiac System & Valvular Cycle
  if (
    lower.includes('heart') ||
    lower.includes('cardiac') ||
    lower.includes('ventricle') ||
    lower.includes('atrium') ||
    lower.includes('aorta') ||
    lower.includes('mitral') ||
    lower.includes('tricuspid') ||
    lower.includes('tim')
  ) {
    return ANATOMY_CONCEPTS.find(c => c.id === 'concept_cardiac_valves');
  }

  // 7. Respiratory System & Alveoli
  if (
    lower.includes('lung') ||
    lower.includes('pulmon') ||
    lower.includes('trachea') ||
    lower.includes('bronch') ||
    lower.includes('alveol') ||
    lower.includes('diaphragm') ||
    lower.includes('phổi') ||
    lower.includes('khí quản') ||
    lower.includes('phế quản') ||
    lower.includes('cơ hoành')
  ) {
    return ANATOMY_CONCEPTS.find(c => c.id === 'concept_respiratory_alveoli');
  }

  return null;
}

