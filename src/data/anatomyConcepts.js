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
      title: 'Bài Giảng 3D: Cột Sống, Đốt Sống & Thoát Vị Đĩa Đệm',
      url: 'https://www.youtube.com/embed/rDGqkMHPDqE',
      duration: '10:38'
    }
  },

  {
    id: 'concept_circle_of_willis',
    keywords: [
      'willis', 'đa giác willis', 'da giac willis', 'vòng willis', 'vong willis',
      'đáy não', 'day nao', 'mạch máu não', 'mach mau nao',
      'tuần hoàn não', 'tuan hoan nao', 'phình mạch não', 'phinh mach nao',
      'aneurysm', 'stroke'
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
      title: 'Bài Giảng 3D: Hệ Thần Kinh, Não Bộ & Mạch Máu Não',
      url: 'https://www.youtube.com/embed/qPix_X-9t7E',
      duration: '10:36'
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
      title: 'Bài Giảng 3D: Hệ Tiêu Hóa, Gan Mật & Tuyến Tụy',
      url: 'https://www.youtube.com/embed/jGme7BRkpuQ',
      duration: '10:50'
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
      title: 'Bài Giảng 3D: Khớp Gối, Dây Chằng & Động Học Khớp',
      url: 'https://www.youtube.com/embed/DLxYDoN634c',
      duration: '09:20'
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
    titleVi: 'Hệ Tiêu Hóa & Vi Thể Dạ Dày',
    latin: 'Gaster / Tractus gastrointestinalis (TA2: 2890)',
    subtitle: 'Mô học 4 lớp thành dạ dày, tiêu hóa acid HCl và tiến triển loét H.pylori',
    thumbnail: '/images/atlas/stomach_anatomy_macro.svg',
    system: 'visceral',
    primaryPartId: 'Stomach',
    subunits: [
      { label: '🥣 Dạ dày', partId: 'Stomach', note: 'Dung tích 1.0–1.5L, nhào trộn acid HCl pH 1.5–2 diệt khuẩn & tiêu hóa đạm' },
      { label: '🟡 Tá tràng', partId: 'Duodenum', note: 'Đoạn đầu ruột non uốn hình chữ C tiếp nhận mật và men tụy trung hòa acid' }
    ],
    slides: [
      {
        id: 'stomach_macro',
        title: 'Cấu tạo',
        badge: 'Đại thể Dạ dày & Tá tràng',
        image: '/images/atlas/stomach_anatomy_macro.svg',
        caption: 'Toàn cảnh giải phẫu từ thực quản qua tâm vị, đáy vị, thân vị, hang môn vị đến tá tràng.'
      },
      {
        id: 'gastric_wall',
        title: 'Sinh lý',
        badge: 'Mô học 4 Lớp Thành',
        image: '/images/atlas/gastric_wall_histology.svg',
        caption: 'Vi thể 4 lớp: Niêm mạc (tế bào viền tiết HCl), Dưới niêm, Lớp cơ 3 chiều và Thanh mạc.'
      },
      {
        id: 'gastric_ulcer',
        title: '4 Cấp độ',
        badge: 'Viêm loét & H.pylori',
        image: '/images/atlas/gastric_ulcer_progression.svg',
        caption: 'Tiến triển từ viêm trợt niêm mạc, nhiễm khuẩn H.pylori đến loét sâu và biến chứng thủng xuất huyết.'
      }
    ],
    simulator: {
      title: '🥣 BỆNH LÝ VIÊM LOÉT DẠ DÀY & H.PYLORI:',
      ticks: ['Bình thường', 'Viêm trợt', 'Loét sâu', 'Thủng & Máu'],
      stages: [
        { level: 'Cấp 0: Bình thường', desc: 'Hàng rào nhầy Mucin dày nguyên vẹn, pH acid 1.5-2.0 được đệm tốt, không HP.' },
        { level: 'Cấp 1: Viêm trợt niêm mạc', desc: 'H.pylori tiết Urease phá vỡ lớp nhầy, xung huyết đỏ rực, ợ hơi nóng rát.' },
        { level: 'Cấp 2: Loét sâu thành cơ', desc: 'Ổ loét ăn sâu lớp dưới niêm và cơ, đau cồn cào lúc đói/no, đáy phủ giả mạc.' },
        { level: 'Cấp 3: Thủng & Xuất huyết', desc: 'Đứt động mạch vị, nôn ra máu, đi ngoài phân đen, thủng tạng rỗng cấp cứu.' }
      ]
    },
    video: {
      title: 'Bài Giảng 3D: Cấu Tạo Dạ Dày & Hệ Tiêu Hóa',
      url: 'https://www.youtube.com/embed/jGme7BRkpuQ',
      duration: '10:50'
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
      'phổi', 'phoi', 'lá phổi', 'lungs', 'khí quản', 'khi quan', 'trachea',
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
  },
  {
    id: 'concept_urinary_nephron',
    keywords: [
      'thận', 'hệ thận', 'quả thận', 'qua than', 'kidney', 'tiết niệu', 'tiet nieu', 'urinary',
      'cầu thận', 'cau than', 'nephron', 'bowman', 'bàng quang', 'bang quang',
      'bladder', 'niệu quản', 'nieu quan', 'ureter', 'sỏi thận', 'soi than',
      'suy thận', 'suy than', 'ckd', 'egfr', 'nước tiểu', 'lọc máu'
    ],
    titleVi: 'Hệ Tiết Niệu & Cầu Thận',
    latin: 'Systema urinarium / Ren (TA2: 3348)',
    subtitle: '1 triệu Nephron lọc 180 lít máu mỗi ngày & bài xuất nước tiểu',
    thumbnail: '/images/atlas/urinary_anatomy.svg',
    system: 'visceral',
    primaryPartId: 'Kidney.l',
    subunits: [
      { label: '🩺 Thận trái & Vỏ thận', partId: 'Kidney.l', note: '1 triệu đơn vị Nephron lọc 180L máu mỗi ngày' },
      { label: '🩺 Thận phải', partId: 'Kidney.r', note: 'Nằm thấp hơn do gan đè, đài bể thận tống xuất nước tiểu' },
      { label: '🟡 Niệu quản', partId: 'Ureter.l', note: 'Ống dẫn nhu động dài 25-30cm đưa nước tiểu xuống bàng quang' },
      { label: '💧 Bàng quang', partId: 'Urinary bladder', note: 'Dung tích 300–500ml co bóp tống nước tiểu qua niệu đạo' }
    ],
    slides: [
      {
        id: 'anatomy',
        title: 'Cấu tạo',
        badge: 'Hệ Tiết niệu & 2 Thận',
        image: '/images/atlas/urinary_anatomy.svg',
        caption: 'Toàn cảnh 2 thận, đài bể thận, 2 niệu quản và bàng quang chứa nước tiểu.'
      },
      {
        id: 'physiology',
        title: 'Sinh lý',
        badge: 'Màng lọc Nephron',
        image: '/images/atlas/nephron_filtration.svg',
        caption: 'Búi mao mạch cầu thận lọc 180L máu/ngày, tái hấp thu 99% dưỡng chất.'
      },
      {
        id: 'pathology',
        title: '4 Cấp độ',
        badge: 'Sỏi thận & Suy thận (CKD)',
        image: '/images/atlas/ckd_kidney_stones.svg',
        caption: 'Tiến triển từ sỏi đài bể thận, cơn đau quặn thận đến suy thận giai đoạn cuối.'
      }
    ],
    simulator: {
      title: '🩺 BỆNH LÝ TIẾT NIỆU & CHỨC NĂNG THẬN:',
      ticks: ['Bình thường', 'Sỏi thận', 'Ứ nước', 'Suy thận GĐ cuối'],
      stages: [
        { level: 'Cấp 0: Bình thường (eGFR > 90)', desc: 'Thận hồng hào, lọc 180L máu, Creatinin 60-110 µmol/L bình thường.' },
        { level: 'Cấp 1: Sỏi đài thận (eGFR 60-89)', desc: 'Sỏi đài bể thận 4-8mm, đau mỏi thắt lưng, tiểu buốt rắt nhẹ.' },
        { level: 'Cấp 2: Kẹt niệu quản (eGFR 30-59)', desc: 'Cơn đau quặn thận dữ dội, dãn ứ nước đài bể thận, nhu mô thận mỏng.' },
        { level: 'Cấp 3: Suy thận mạn (eGFR < 15)', desc: 'Thận teo xơ chai, hội chứng Ure máu cao, chỉ định chạy thận nhân tạo.' }
      ]
    },
    video: {
      title: 'Bài Giảng 3D: Cấu Tạo Thận & Cơ Chế Hoạt Động Của Nephron',
      url: 'https://www.youtube.com/embed/l128tW1H5a8',
      duration: '10:18'
    }
  },
  {
    id: 'concept_brachial_plexus',
    keywords: [
      'đám rối', 'dam roi', 'cánh tay', 'canh tay', 'brachial plexus', 'plexus',
      'dây giữa', 'day giua', 'median nerve', 'thần kinh giữa', 'than kinh giua',
      'dây trụ', 'day tru', 'ulnar nerve', 'thần kinh trụ', 'than kinh tru',
      'dây quay', 'day quay', 'radial nerve', 'thần kinh quay', 'than kinh quay',
      'ống cổ tay', 'ong co tay', 'carpal tunnel', 'cts', 'tê tay', 'teo cơ mô cái'
    ],
    titleVi: 'Đám Rối Thần Kinh Cánh Tay',
    latin: 'Plexus brachialis (TA2: 4578)',
    subtitle: '5 rễ (C5-T1), 3 thân, 6 ngành, 3 bó chi phối toàn bộ chi trên & bàn tay',
    thumbnail: '/images/atlas/brachial_plexus_anatomy.svg',
    system: 'nervous',
    primaryPartId: 'Median nerve.r',
    subunits: [
      { label: '⚡ Dây TK Giữa', partId: 'Median nerve.r', note: 'Chi phối cảm giác ngón 1-2-3 và đối chiếu ngón cái' },
      { label: '⚡ Dây TK Quay', partId: 'Radial nerve.r', note: 'Dây lớn nhất chi phối duỗi cổ tay và cảm giác mu tay' },
      { label: '⚡ Dây TK Trụ', partId: 'Ulnar nerve.r', note: 'Chi phối ngón út, nửa ngón nhẫn và cơ gian cốt bàn tay' },
      { label: '⚡ Bó sau đám rối', partId: 'Posterior cord of brachial plexus.r', note: 'Hợp lưu từ các ngành sau rễ C5-T1 nuôi cơ delta, tam đầu' }
    ],
    slides: [
      {
        id: 'anatomy',
        title: 'Cấu tạo',
        badge: '5 Rễ • 3 Thân • 3 Bó',
        image: '/images/atlas/brachial_plexus_anatomy.svg',
        caption: 'Mạng lưới thần kinh từ rễ cổ C5-T1 phân nhánh cấp phát cho toàn bộ cánh tay.'
      },
      {
        id: 'physiology',
        title: 'Chi phối',
        badge: 'Cảm giác 3 Dây TK',
        image: '/images/atlas/radial_median_ulnar_nerves.svg',
        caption: 'Bản đồ chi phối cảm giác gan tay và mu tay của TK Giữa, Trụ và Quay.'
      },
      {
        id: 'pathology',
        title: '4 Cấp độ',
        badge: 'Hội chứng Ống Cổ Tay (CTS)',
        image: '/images/atlas/carpal_tunnel_syndrome.svg',
        caption: 'Tiến triển từ tê thoáng qua về đêm đến teo cơ mô cái và liệt bàn tay khỉ.'
      }
    ],
    simulator: {
      title: '⚡ HỘI CHỨNG ỐNG CỔ TAY (CTS):',
      ticks: ['Bình thường', 'Tê thoáng qua', 'Teo mô cái', 'Bàn tay khỉ'],
      stages: [
        { level: 'Cấp 0: Bình thường', desc: 'Dây thần kinh giữa trơn láng, áp lực ống cổ tay < 10 mmHg bình thường.' },
        { level: 'Cấp 1: Chèn ép sớm', desc: 'Tê rần châm chích ngón 1-3 về đêm, vẩy tay đỡ tê, test Tinel (+/-).' },
        { level: 'Cấp 2: Hẹp nặng & Teo cơ', desc: 'Tê buốt cả ngày, rơi đũa chén, teo cơ mô cái rõ rệt, dẫn truyền chậm.' },
        { level: 'Cấp 3: Mất chức năng', desc: 'Bàn tay khỉ (Ape hand), xơ hóa sợi trục, mất đối chiếu ngón cái vĩnh viễn.' }
      ]
    },
    video: {
      title: 'Bài Giảng 3D: Khớp & Dây Thần Kinh Chi Trên',
      url: 'https://www.youtube.com/embed/DLxYDoN634c',
      duration: '09:20'
    }
  },
  {
    id: 'concept_inner_ear_vestibular',
    keywords: [
      'tai', 'ear', 'tai trong', 'tai giữa', 'tai ngoai', 'màng nhĩ', 'mang nhi',
      'tympanic', 'xương búa', 'xuong bua', 'malleus', 'xương đe', 'xuong de',
      'incus', 'xương bàn đạp', 'xuong ban dap', 'stapes', 'ốc tai', 'oc tai',
      'cochlea', 'tiền đình', 'tien dinh', 'vestibular', 'bán khuyên', 'ban khuyen',
      'semicircular', 'chóng mặt', 'chong mat', 'bppv', 'meniere', 'ù tai', 'u tai',
      'thủng màng nhĩ', 'điếc', 'thính lực'
    ],
    titleVi: 'Hệ Thống Thính Giác & Tiền Đình Tai Trong',
    latin: 'Auris interna / Organum vestibulocochleare (TA2: 5740)',
    subtitle: 'Chuỗi xương con khuếch đại 22 lần âm thanh & hệ thống 3 ống bán khuyên thăng bằng',
    thumbnail: '/images/atlas/ear_anatomy_macro.svg',
    system: 'skeletal',
    primaryPartId: 'Malleus.r',
    subunits: [
      { label: '🦴 Xương Búa', partId: 'Malleus.r', note: 'Cán búa gắn chặt vào màng nhĩ truyền rung động âm thanh' },
      { label: '🦴 Xương Đe', partId: 'Incus.r', note: 'Khớp nối đòn bẩy trung gian giữa xương búa và xương bàn đạp' },
      { label: '🦴 Xương Bàn Đạp', partId: 'Stapes.r', note: 'Xương nhỏ nhất cơ thể gõ vào cửa sổ bầu dục ốc tai' },
      { label: '🥁 Màng Nhĩ', partId: 'Tympanic membrane.r', note: 'Màng mỏng hình nón ngăn cách tai ngoài và hòm nhĩ' }
    ],
    slides: [
      {
        id: 'ear_anatomy',
        title: 'Cấu tạo',
        badge: 'Tai Ngoài - Giữa - Trong',
        image: '/images/atlas/ear_anatomy_macro.svg',
        caption: 'Toàn cảnh vành tai, ống tai ngoài, màng nhĩ, chuỗi xương con, vòi Eustache và ốc tai.'
      },
      {
        id: 'cochlea_vestibular',
        title: 'Sinh lý',
        badge: 'Corti & Ống Bán Khuyên',
        image: '/images/atlas/cochlea_vestibular_micro.svg',
        caption: 'Vi thể cơ quan Corti chuyển sóng âm thành xung điện và màng thạch nhĩ cảm nhận trọng lực.'
      },
      {
        id: 'ear_pathology',
        title: '4 Cấp độ',
        badge: 'Bệnh lý Tai & Tiền đình',
        image: '/images/atlas/inner_ear_pathology.svg',
        caption: 'Tiến triển từ viêm tai giữa ứ dịch, chóng mặt kịch phát BPPV đến thủng nhĩ và điếc tiếp nhận.'
      }
    ],
    simulator: {
      title: '👂 BỆNH LÝ TAI & TIỀN ĐÌNH THĂNG BẰNG:',
      ticks: ['Bình thường', 'Viêm tai giữa', 'BPPV/Meniere', 'Thủng & Điếc'],
      stages: [
        { level: 'Cấp 0: Bình thường', desc: 'Màng nhĩ sáng bóng, sỏi tai nằm cố định trong xoang nang, thính lực 0-20 dB.' },
        { level: 'Cấp 1: Viêm tai giữa', desc: 'Tắc vòi Eustache, hòm nhĩ áp lực âm, ứ dịch sau màng nhĩ, ù tai nghẹt mũi.' },
        { level: 'Cấp 2: BPPV / Meniere', desc: 'Sỏi tai rơi vào ống bán khuyên, chóng mặt quay cuồng dữ dội khi trở mình, giật nhãn cầu.' },
        { level: 'Cấp 3: Thủng màng nhĩ / Điếc', desc: 'Thủng màng nhĩ mạn tính hoặc thoái hóa tế bào lông ốc tai vĩnh viễn, điếc sâu >70 dB.' }
      ]
    },
    video: {
      title: 'Mô phỏng 3D: Cấu Tạo Tai & Cơ Chế Hoạt Động Của Tiền Đình Thăng Bằng',
      url: 'https://www.youtube.com/embed/flIAxGsV1q0',
      duration: '1:15'
    }
  },

  // 11. Động Mạch Vành & Xơ Vữa Động Mạch
  {
    id: 'concept_coronary_atherosclerosis',
    keywords: [
      'mạch vành', 'mach vanh', 'xơ vữa', 'xo vua', 'nhồi máu cơ tim', 'nhoi mau co tim',
      'đau thắt ngực', 'dau that nguc', 'lad', 'rca', 'lcx', 'coronary', 'atherosclerosis', 'heart attack'
    ],
    titleVi: 'Động Mạch Vành & Xơ Vữa Động Mạch',
    latin: 'Arteriae coronariae (TA2: 3951)',
    subtitle: 'Cây cấp máu nuôi tim & tiến triển xơ vữa gây nhồi máu cơ tim',
    thumbnail: '/images/atlas/coronary_circulation_conduction.svg',
    system: 'cardiovascular',
    primaryPartId: 'Left coronary artery',
    subunits: [
      { label: '🔴 ĐM Liên thất trước (LAD)', partId: 'Left coronary artery', note: 'Nhánh quan trọng nhất nuôi mỏm và vách liên thất' },
      { label: '🔴 ĐM Vành phải (RCA)', partId: 'Right coronary artery', note: 'Cấp máu cho tâm thất phải và hệ thống nút xoang' },
      { label: '🩸 Nhánh mũ tim (LCx)', partId: 'Circumflex artery of heart', note: 'Vòng quanh rãnh nhĩ thất nuôi thành sau thất trái' }
    ],
    slides: [
      {
        id: 'coronary_anatomy',
        title: 'Cây Mạch Vành',
        badge: 'Cấp máu cơ tim',
        image: '/images/atlas/coronary_circulation_conduction.svg',
        caption: 'Giải phẫu các nhánh động mạch vành và hệ thống dẫn truyền phát xung nhịp SA-AV.'
      },
      {
        id: 'atherosclerosis_pathology',
        title: '4 Giai Đoạn',
        badge: 'Tiến triển xơ vữa',
        image: '/images/atlas/atherosclerosis_stages.svg',
        caption: 'Từ vệt mỡ nội mạc nhẹ đến mảng xơ loét nứt vỡ hình thành huyết khối cấp.'
      }
    ],
    simulator: {
      title: '⚡ XƠ VỮA ĐỘNG MẠCH VÀNH:',
      ticks: ['Bình thường', 'Vệt mỡ', 'Mảng xơ', 'Nhồi máu'],
      stages: [
        { level: 'Giai đoạn 1: Mạch khỏe mạnh', desc: 'Lòng mạch thông suốt, nội mạc nhẵn bóng không cặn mỡ.' },
        { level: 'Giai đoạn 2: Vệt mỡ nội mạc', desc: 'Lắng đọng cholesterol LDL dưới nội mạc, hẹp nhẹ <30%.' },
        { level: 'Giai đoạn 3: Mảng xơ vữa sợi', desc: 'Mảng xơ chiếm 70% lòng mạch, gây đau thắt ngực khi gắng sức.' },
        { level: 'Giai đoạn 4: Nhồi máu cơ tim cấp', desc: 'Nứt vỡ mảng xơ, huyết khối bít tắc 100% gây hoại tử cơ tim.' }
      ]
    },
    video: {
      title: 'Hoạt Ảnh 3D: Cây Động Mạch Vành & Cơ Chế Nhồi Máu Cơ Tim',
      url: 'https://www.youtube.com/embed/Ktv-CaOt6UQ',
      duration: '08:45'
    }
  },

  // 12. 8 Hạ Phân Thùy Gan & Bệnh Học Xơ Gan
  {
    id: 'concept_liver_cirrhosis',
    keywords: [
      'xơ gan', 'xo gan', 'gan nhiễm mỡ', 'gan nhiem mo', 'couinaud', 'hạ phân thùy',
      'ha phan thuy', 'tĩnh mạch cửa', 'men gan', 'cirrhosis', 'steatosis'
    ],
    titleVi: '8 Hạ Phân Thùy Gan & Bệnh Học Xơ Gan',
    latin: 'Hepar & Cirrhosis hepatis (TA2: 2955)',
    subtitle: 'Phân chia ngoại khoa Couinaud và tiến triển thoái hóa mỡ đến xơ gan',
    thumbnail: '/images/atlas/couinaud_liver_segments.svg',
    system: 'visceral',
    primaryPartId: 'Liver',
    subunits: [
      { label: '🥩 8 Hạ phân thùy Couinaud', partId: 'Liver', note: '8 đơn vị giải phẫu độc lập có cuống mạch - mật riêng biệt' },
      { label: '🔵 Tĩnh mạch cửa gan', partId: 'Hepatic portal vein', note: 'Gom toàn bộ máu dinh dưỡng từ dạ dày, ruột non về gan' },
      { label: '🟢 Túi mật & Đường mật', partId: 'Gallbladder', note: 'Dự trữ và cô đặc dịch mật hỗ trợ tiêu hóa chất béo' }
    ],
    slides: [
      {
        id: 'couinaud_anatomy',
        title: 'Couinaud I-VIII',
        badge: 'Ngoại khoa gan',
        image: '/images/atlas/couinaud_liver_segments.svg',
        caption: 'Sơ đồ phân chia 8 hạ phân thùy gan độc lập theo trục tĩnh mạch cửa và tĩnh mạch gan.'
      },
      {
        id: 'cirrhosis_pathology',
        title: '4 Giai Đoạn',
        badge: 'Tiến triển xơ gan',
        image: '/images/atlas/liver_cirrhosis_stages.svg',
        caption: 'Từ tích tụ hạt mỡ >5% đến lắng đọng dải xơ bắc cầu F2-F3 và xơ gan nốt F4.'
      }
    ],
    simulator: {
      title: '⚡ BỆNH HỌC GAN MẬT:',
      ticks: ['Khỏe mạnh', 'Nhiễm mỡ', 'Xơ hóa', 'Xơ gan F4'],
      stages: [
        { level: 'Giai đoạn 1: Gan khỏe mạnh', desc: 'Nhu mô mịn, mềm mại, men gan AST/ALT chuẩn.' },
        { level: 'Giai đoạn 2: Gan nhiễm mỡ', desc: 'Tích tụ hạt mỡ >5% thể tích gan, có thể đảo ngược 100% nếu điều chỉnh lối sống.' },
        { level: 'Giai đoạn 3: Viêm gan xơ hóa F2-F3', desc: 'Dải xơ collagen bắc cầu giữa các khoảng cửa, tế bào gan tổn thương mạn tính.' },
        { level: 'Giai đoạn 4: Xơ gan nốt F4', desc: 'Đảo lộn cấu trúc vi thể, bề mặt sần sùi cục nốt, tăng áp lực tĩnh mạch cửa.' }
      ]
    },
    video: {
      title: 'Hoạt Ảnh 3D: Cấu Trúc Nhu Mô Gan & Quá Trình Xơ Hóa',
      url: 'https://www.youtube.com/embed/jGme7BRkpuQ',
      duration: '09:12'
    }
  },

  // 13. Nhãn Cầu & Bệnh Đục Thủy Tinh Thể
  {
    id: 'concept_eye_cataract',
    keywords: [
      'mắt', 'mat', 'nhãn cầu', 'nhan cau', 'thị giác', 'thi giac', 'đục thủy tinh thể',
      'duc thuy tinh the', 'cườm khô', 'cuom kho', 'cataract', 'glaucoma', 'giác mạc', 'võng mạc'
    ],
    titleVi: 'Nhãn Cầu & Bệnh Đục Thủy Tinh Thể',
    latin: 'Bulbus oculi & Cataracta (TA2: 5410)',
    subtitle: 'Cơ quan thị giác, đường khúc xạ ánh sáng và tiến triển vẩn đục thể thủy tinh',
    thumbnail: '/images/atlas/eye_anatomy_macro.svg',
    system: 'nervous',
    primaryPartId: 'Anterior chamber of eyeball.r',
    subunits: [
      { label: '👁️ Giác mạc & Tiền phòng', partId: 'Anterior chamber of eyeball.r', note: 'Thấu kính hội tụ ngoài cùng trong suốt' },
      { label: '⚡ Dây thần kinh thị giác II', partId: 'Optic nerve (II).r', note: 'Dẫn truyền tín hiệu xung điện từ võng mạc về vỏ não chẩm' },
      { label: '🔴 Động mạch mi', partId: 'Long posterior ciliary arteries.r', note: 'Mạng mạch máu nuôi dưỡng màng bọc nhãn cầu' }
    ],
    slides: [
      {
        id: 'eye_macro',
        title: 'Cấu tạo Mắt',
        badge: 'Giải phẫu thị giác',
        image: '/images/atlas/eye_anatomy_macro.svg',
        caption: 'Mặt cắt ngang nhãn cầu: Giác mạc, Thể mi, Thể thủy tinh, Võng mạc và Thần kinh thị giác II.'
      },
      {
        id: 'cataract_stages',
        title: '4 Cấp độ Đục',
        badge: 'Tiến triển đục TTT',
        image: '/images/atlas/cataract_glaucoma_stages.svg',
        caption: 'Từ vẩn đục vỏ sớm đến đục nhân vàng nâu và đục chín toàn bộ cản trở ánh sáng.'
      }
    ],
    simulator: {
      title: '⚡ TIẾN TRIỂN THỦY TINH THỂ:',
      ticks: ['Trong suốt', 'Đục sớm', 'Đục nhân', 'Đục chín'],
      stages: [
        { level: 'Cấp 1: Trong suốt 10/10', desc: 'Thủy tinh thể trong suốt hoàn hảo, thị lực sắc nét.' },
        { level: 'Cấp 2: Đục vỏ nhẹ', desc: 'Vệt mờ li ti ở rìa thể mi, chói mắt khi nhìn đèn pha hoặc ánh nắng.' },
        { level: 'Cấp 3: Đục nhân vàng nâu', desc: 'Nhìn mờ như qua màn sương mù, giảm thị lực ban đêm rõ rệt.' },
        { level: 'Cấp 4: Đục chín toàn bộ', desc: 'Đồng tử trắng đục, chỉ còn cảm nhận sáng/tối, chỉ định mổ Phaco.' }
      ]
    },
    video: {
      title: 'Hoạt Ảnh 3D: Cấu Trúc Khúc Xạ Mắt & Phẫu Thuật Phaco',
      url: 'https://www.youtube.com/embed/flIAxGsV1q0',
      duration: '06:30'
    }
  },

  // 14. Khớp Háng & Thoái Hóa Khớp
  {
    id: 'concept_hip_osteoarthritis',
    keywords: [
      'khớp háng', 'khop hang', 'thoái hóa khớp háng', 'thoai hoa khop hang',
      'chỏm xương đùi', 'chom xuong dui', 'ổ cối', 'o coi', 'hip osteoarthritis', 'kellgren'
    ],
    titleVi: 'Khớp Háng & Thoái Hóa Khớp',
    latin: 'Articulatio coxae & Coxarthrosis (TA2: 1412)',
    subtitle: 'Khớp chỏm cầu chịu lực lớn nhất và 4 độ thoái hóa theo Kellgren-Lawrence',
    thumbnail: '/images/atlas/hip_joint_anatomy.svg',
    system: 'joints',
    primaryPartId: 'Articular capsule of hip joint.r',
    subunits: [
      { label: '🛡️ Bao khớp & Dây chằng', partId: 'Articular capsule of hip joint.r', note: 'Dây chằng chậu đùi Bigelow chịu lực kéo >350kg' },
      { label: '🦴 Chỏm xương đùi', partId: 'Femur.r', note: 'Hình 2/3 khối cầu bọc sụn trong trơn nhẵn' },
      { label: '🧱 Ổ cối xương chậu', partId: 'Hip bone.r', note: 'Hõm khớp sâu có sụn viền mút kín giữ vững chỏm đùi' }
    ],
    slides: [
      {
        id: 'hip_anatomy',
        title: 'Khớp Háng',
        badge: 'Khớp chỏm cầu',
        image: '/images/atlas/hip_joint_anatomy.svg',
        caption: 'Mặt cắt trán khớp háng: Ổ cối, Sụn viền, Chỏm xương đùi và Dây chằng chậu đùi.'
      },
      {
        id: 'hip_oa_stages',
        title: '4 Độ Thoái Hóa',
        badge: 'Kellgren-Lawrence',
        image: '/images/atlas/hip_osteoarthritis_stages.svg',
        caption: 'Từ mòn sụn nhẹ khe khớp đến gai xương lớn, xơ đặc xương và biến dạng chỏm đùi.'
      }
    ],
    simulator: {
      title: '⚡ THOÁI HÓA KHỚP HÁNG:',
      ticks: ['Độ I', 'Độ II', 'Độ III', 'Độ IV'],
      stages: [
        { level: 'Độ I: Nghi ngờ thoái hóa', desc: 'Khe khớp còn bảo tồn, nghi ngờ gai xương nhỏ ở viền ổ cối.' },
        { level: 'Độ II: Thoái hóa nhẹ', desc: 'Gai xương rõ rệt, sụn khớp bắt đầu mòn nhẹ, đau khi đi bộ xa.' },
        { level: 'Độ III: Thoái hóa vừa', desc: 'Hẹp khe khớp >50%, xơ đặc xương dưới sụn, cản trở bước chân lên cầu thang.' },
        { level: 'Độ IV: Thoái hóa nặng', desc: 'Mất toàn bộ sụn khớp (bone-on-bone), biến dạng chỏm xương đùi, chỉ định thay khớp.' }
      ]
    },
    video: {
      title: 'Hoạt Ảnh 3D: Động Học Khớp Háng & Thay Khớp Nhân Tạo',
      url: 'https://www.youtube.com/embed/DLxYDoN634c',
      duration: '09:20'
    }
  }
];

export function normaliseConceptText(str) {
  if (!str) return '';
  return str.normalize('NFD').replace(/[\u0300-\u036f]/g, '').replace(/[đĐ]/g, 'd').toLowerCase().trim();
}

function matchConceptKeyword(text, keyword) {
  if (!text || !keyword) return false;
  const escaped = keyword.replace(/[.*+?^${}()|[\]\\]/g, '\\$&');
  const regex = new RegExp(`(^|[^a-zA-Z0-9àáảãạăắằẳẵặâấầẩẫậèéẻẽẹêếềểễệìíỉĩịòóỏõọôốồổỗộơớờởỡợùúủũụưứừửữựỳýỷỹỵđĐ])${escaped}([^a-zA-Z0-9àáảãạăắằẳẵặâấầẩẫậèéẻẽẹêếềểễệìíỉĩịòóỏõọôốồổỗộơớờởỡợùúủũụưứừửữựỳýỷỹỵđĐ]|$)`, 'i');
  return regex.test(text);
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
      return matchConceptKeyword(clean, kwLower) || matchConceptKeyword(norm, kwNorm) || (kwLower.length >= 4 && clean === kwLower);
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
    lower.includes('willis') ||
    lower.includes('đa giác willis') ||
    lower.includes('da giac willis') ||
    lower.includes('circulus arteriosus') ||
    (lower.includes('mạch máu') && lower.includes('não')) ||
    (lower.includes('tuần hoàn') && lower.includes('não'))
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

  // 8. Urinary System & Nephron
  if (
    lower.includes('kidney') ||
    lower.includes('renal') ||
    lower.includes('nephron') ||
    lower.includes('ureter') ||
    lower.includes('bladder') ||
    lower.includes('thận') ||
    lower.includes('niệu quản') ||
    lower.includes('bàng quang') ||
    lower.includes('tiết niệu')
  ) {
    return ANATOMY_CONCEPTS.find(c => c.id === 'concept_urinary_nephron');
  }

  // 9. Brachial Plexus & Hand Nerves
  if (
    lower.includes('brachial') ||
    lower.includes('plexus') ||
    lower.includes('median nerve') ||
    lower.includes('radial nerve') ||
    lower.includes('ulnar nerve') ||
    lower.includes('carpal') ||
    lower.includes('đám rối') ||
    lower.includes('thần kinh giữa') ||
    lower.includes('thần kinh trụ') ||
    lower.includes('thần kinh quay') ||
    lower.includes('cánh tay')
  ) {
    return ANATOMY_CONCEPTS.find(c => c.id === 'concept_brachial_plexus');
  }

  // 10. Inner Ear & Vestibular System (Malleus, Incus, Stapes, Tympanic, Cochlea, Ear)
  if (
    lower.includes('malleus') ||
    lower.includes('incus') ||
    lower.includes('stapes') ||
    lower.includes('tympanic') ||
    lower.includes('cochle') ||
    lower.includes('vestibul') ||
    lower.includes('auric') ||
    lower.includes('tai') ||
    lower.includes('màng nhĩ') ||
    lower.includes('xương búa') ||
    lower.includes('xương đe') ||
    lower.includes('xương bàn đạp') ||
    (lower.includes('ear') && !lower.includes('bear') && !lower.includes('clear'))
  ) {
    return ANATOMY_CONCEPTS.find(c => c.id === 'concept_inner_ear_vestibular');
  }

  // 11. Coronary Circulation & Atherosclerosis
  if (
    lower.includes('coronary') ||
    lower.includes('vành') ||
    lower.includes('atherosclero') ||
    lower.includes('nhồi máu') ||
    lower.includes('lad') ||
    lower.includes('rca') ||
    lower.includes('circumflex')
  ) {
    return ANATOMY_CONCEPTS.find(c => c.id === 'concept_coronary_atherosclerosis');
  }

  // 12. Liver Couinaud & Cirrhosis
  if (
    lower.includes('couinaud') ||
    lower.includes('cirrhosis') ||
    lower.includes('xơ gan') ||
    lower.includes('segment of liver') ||
    (lower.includes('gan') && !lower.includes('ngang'))
  ) {
    return ANATOMY_CONCEPTS.find(c => c.id === 'concept_liver_cirrhosis');
  }

  // 13. Eye, Vision & Cataract
  if (
    lower.includes('eyeball') ||
    lower.includes('cornea') ||
    lower.includes('retina') ||
    lower.includes('ciliary') ||
    lower.includes('optic') ||
    lower.includes('cataract') ||
    lower.includes('glaucoma') ||
    lower.includes('mắt') ||
    lower.includes('thị giác')
  ) {
    return ANATOMY_CONCEPTS.find(c => c.id === 'concept_eye_cataract');
  }

  // 14. Hip Joint & Osteoarthritis
  if (
    lower.includes('capsule of hip') ||
    lower.includes('hip joint') ||
    lower.includes('acetabul') ||
    lower.includes('coxae') ||
    lower.includes('coxarthrosis') ||
    lower.includes('khớp háng')
  ) {
    return ANATOMY_CONCEPTS.find(c => c.id === 'concept_hip_osteoarthritis');
  }

  return null;
}

