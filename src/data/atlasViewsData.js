// Comprehensive Atlas 2027 Preset Views & Media Data
// Chuẩn thiết kế & Danh mục Giải phẫu học Quốc tế (Việt hóa 100% chuẩn Y khoa)

export const ATLAS_SYSTEMS_CATEGORIES = [
  {
    id: 'skeletal_views',
    titleVi: 'Hệ Xương Khớp',
    systemKey: 'skeletal',
    cards: [
      {
        id: 'skel_full',
        title: '1. Toàn Bộ Hệ Xương',
        subtitle: '206 xương trục và xương chi thể',
        badge: 'Toàn thân',
        image: '/3d/images/atlas/skel_full.png',
        systems: ['skeletal'],
        camera: { x: 0, y: 0.86, z: 2.6, targetX: 0, targetY: 0.86, targetZ: 0 },
        desc: 'Bộ xương người trưởng thành: bảo vệ tạng, tạo máu và khung vận động.'
      },
      {
        id: 'skel_skull',
        title: '2. Hộp Sọ & Xương Mặt',
        subtitle: 'Vòm sọ, nền sọ và xương hàm dưới',
        badge: 'Đầu mặt',
        image: '/3d/images/atlas/skel_skull.png',
        systems: ['skeletal'],
        camera: { x: 0.48, y: 1.62, z: 0.58, targetX: 0, targetY: 1.58, targetZ: 0 },
        desc: 'Khối xương sọ não bảo vệ não bộ và khối xương mặt nâng đỡ các giác quan.'
      },
      {
        id: 'skel_cranial_fossae',
        title: '3. Cấu Trúc Nền Sọ',
        subtitle: 'Hố sọ trước, hố sọ giữa và hố sọ sau',
        badge: 'Nền sọ',
        image: '/3d/images/atlas/skel_cranial_fossae.png',
        systems: ['skeletal'],
        camera: { x: 0, y: 1.95, z: 0.25, targetX: 0, targetY: 1.58, targetZ: 0 },
        desc: 'Hệ thống các lỗ nền sọ cho 12 đôi dây thần kinh sọ và mạch máu não đi qua.'
      },
      {
        id: 'skel_spine',
        title: '4. Cột Sống & Lồng Ngực',
        subtitle: '33 đốt sống và 12 đôi xương sườn',
        badge: 'Thân mình',
        image: '/3d/images/atlas/skel_spine.png',
        systems: ['skeletal'],
        camera: { x: 0, y: 1.15, z: 1.25, targetX: 0, targetY: 1.1, targetZ: 0 },
        desc: 'Trục nâng đỡ cơ thể và khung lồng ngực bảo vệ tim phổi.'
      },
      {
        id: 'skel_pelvis',
        title: '5. Khung Chậu & Khớp Háng',
        subtitle: 'Xương chậu, xương cùng và ổ cối',
        badge: 'Vùng chậu',
        image: '/3d/images/atlas/skel_pelvis.png',
        systems: ['skeletal'],
        camera: { x: 0, y: 0.88, z: 0.95, targetX: 0, targetY: 0.85, targetZ: 0 },
        desc: 'Hai xương chậu kết hợp xương cùng tạo thành khung chậu vững chắc.'
      }
    ]
  },
  {
    id: 'circulatory_views',
    titleVi: 'Hệ Tim Mạch & Tuần Hoàn',
    systemKey: 'cardiovascular',
    cards: [
      {
        id: 'circ_full',
        title: '1. Tuần Hoàn Toàn Thân',
        subtitle: 'Mạng lưới động mạch và tĩnh mạch chủ',
        badge: 'Toàn thân',
        image: '/3d/images/atlas/circ_full.png',
        systems: ['cardiovascular', 'skeletal'],
        camera: { x: 0, y: 1.0, z: 2.0, targetX: 0, targetY: 1.0, targetZ: 0 },
        desc: 'Mạng lưới tuần hoàn lớn và nhỏ vận chuyển oxy và dưỡng chất đi khắp cơ thể.'
      },
      {
        id: 'circ_heart_thorax',
        title: '2. Vị Trí Tim Trong Lồng Ngực',
        subtitle: 'Tim, quai động mạch chủ và trung thất',
        badge: 'Trung thất',
        image: '/3d/images/atlas/circ_heart_thorax.png',
        systems: ['cardiovascular', 'skeletal'],
        camera: { x: 0, y: 1.28, z: 0.78, targetX: 0, targetY: 1.28, targetZ: 0 },
        desc: 'Mối tương quan giải phẫu giữa tim, màng ngoài tim và khung xương lồng ngực.'
      },
      {
        id: 'circ_simplified',
        title: '3. Mạch Máu Đại Tuần Hoàn',
        subtitle: 'Động mạch chủ ngực, cảnh và chi',
        badge: 'Đại tuần hoàn',
        image: '/3d/images/atlas/circ_simplified.png',
        systems: ['cardiovascular'],
        camera: { x: 0, y: 1.2, z: 1.1, targetX: 0, targetY: 1.2, targetZ: 0 },
        desc: 'Cây động mạch chủ phân nhánh nuôi đầu mặt, não bộ và các chi thể.'
      }
    ]
  },
  {
    id: 'nervous_views',
    titleVi: 'Hệ Thần Kinh Trung Ương & Ngoại Biên',
    systemKey: 'nervous',
    cards: [
      {
        id: 'nerv_full',
        title: '1. Hệ Thần Kinh Toàn Thân',
        subtitle: 'Não bộ, tủy sống và mạng lưới dây TK',
        badge: 'Toàn thân',
        image: '/3d/images/atlas/nerv_full.png',
        systems: ['nervous', 'skeletal'],
        camera: { x: 0, y: 1.0, z: 2.1, targetX: 0, targetY: 1.0, targetZ: 0 },
        desc: 'Hệ thống điều khiển toàn bộ cảm giác, vận động và chức năng tự chủ.'
      },
      {
        id: 'nerv_brain',
        title: '2. Não Bộ & Thần Kinh Sọ',
        subtitle: 'Đại não, tiểu não và 12 đôi dây TK sọ',
        badge: 'Não bộ',
        image: '/3d/images/atlas/nerv_brain.png',
        systems: ['nervous', 'skeletal'],
        camera: { x: 0, y: 1.62, z: 0.75, targetX: 0, targetY: 1.58, targetZ: 0 },
        desc: 'Trung khu thần kinh cao cấp, điều khiển tư duy, vận động và cảm giác giác quan.'
      },
      {
        id: 'nerv_spinal',
        title: '3. Tủy Sống & Rễ Thần Kinh',
        subtitle: 'Ống sống và 31 đôi rễ thần kinh gai',
        badge: 'Tủy sống',
        image: '/3d/images/atlas/nerv_spinal.png',
        systems: ['nervous', 'skeletal'],
        camera: { x: 0, y: 1.15, z: 1.0, targetX: 0, targetY: 1.1, targetZ: 0 },
        desc: 'Đường dẫn truyền xung động thần kinh giữa não bộ và ngoại vi cơ thể.'
      }
    ]
  },
  {
    id: 'respiratory_views',
    titleVi: 'Hệ Hô Hấp & Phổi',
    systemKey: 'visceral',
    cards: [
      {
        id: 'resp_upper',
        title: '1. Đường Hô Hấp Trên',
        subtitle: 'Mũi xoang, thanh quản và khí quản',
        badge: 'Đường thở trên',
        image: '/3d/images/atlas/resp_upper.png',
        systems: ['visceral', 'skeletal'],
        camera: { x: 0, y: 1.48, z: 0.75, targetX: 0, targetY: 1.45, targetZ: 0 },
        desc: 'Đường dẫn khí, sụn thanh nhiệt, sụn giáp và dây thanh âm phát âm.'
      },
      {
        id: 'resp_lungs',
        title: '2. Phổi & Cây Phế Quản',
        subtitle: 'Hai lá phổi và hệ phân chia phế quản',
        badge: 'Phổi',
        image: '/3d/images/atlas/resp_lungs.png',
        systems: ['visceral', 'skeletal'],
        camera: { x: 0, y: 1.25, z: 0.95, targetX: 0, targetY: 1.25, targetZ: 0 },
        desc: 'Nơi trao đổi khí oxy và CO2 qua màng phế nang - mao mạch.'
      },
      {
        id: 'resp_diaphragm',
        title: '3. Cơ Hoành & Động Học Thở',
        subtitle: 'Vòm hoành ngăn cách ngực và bụng',
        badge: 'Cơ hô hấp',
        image: '/3d/images/atlas/resp_diaphragm.png',
        systems: ['visceral', 'skeletal'],
        camera: { x: 0, y: 1.15, z: 0.88, targetX: 0, targetY: 1.15, targetZ: 0 },
        desc: 'Cơ hô hấp chính đảm nhiệm 70% thông khí khi hít vào bình thường.'
      }
    ]
  },
  {
    id: 'muscular_views',
    titleVi: 'Hệ Cơ Vân Toàn Thân',
    systemKey: 'muscular',
    cards: [
      {
        id: 'musc_head',
        title: '1. Cơ Vùng Đầu Mặt Cổ & Mạch Máu',
        subtitle: 'Bóc tách cơ nhai, cơ cổ và mạng mạch thái dương',
        badge: 'Đầu mặt',
        image: '/3d/images/atlas/musc_head.png',
        systems: ['muscular', 'skeletal', 'cardiovascular'],
        camera: { x: 0.52, y: 1.62, z: 0.55, targetX: 0, targetY: 1.58, targetZ: 0 },
        desc: 'Quan sát tương quan giải phẫu xương sọ, cơ cắn, cơ ức đòn chũm và mạng mạch máu mặt.'
      },
      {
        id: 'musc_torso',
        title: '2. Cơ Thân Mình & Lưng Bụng',
        subtitle: 'Cơ ngực, cơ liên sườn và cơ thẳng bụng',
        badge: 'Thân mình',
        image: '/3d/images/atlas/musc_torso.png',
        systems: ['muscular', 'skeletal'],
        camera: { x: 0, y: 1.18, z: 1.2, targetX: 0, targetY: 1.15, targetZ: 0 },
        desc: 'Bảo vệ nội tạng ổ bụng và giữ vững cột sống trong tư thế đứng thẳng.'
      },
      {
        id: 'musc_limbs',
        title: '3. Nhóm Cơ Chi Thể',
        subtitle: 'Cơ vai cánh tay, mông đùi và cẳng chân',
        badge: 'Chi thể',
        image: '/3d/images/atlas/musc_limbs.png',
        systems: ['muscular', 'skeletal'],
        camera: { x: 0, y: 0.9, z: 2.2, targetX: 0, targetY: 0.9, targetZ: 0 },
        desc: 'Cơ delta, nhị đầu, tam đầu, tứ đầu đùi và nhóm cơ cẳng chân tạo lực vận động.'
      }
    ]
  },
  {
    id: 'digestive_views',
    titleVi: 'Hệ Tiêu Hóa & Gan Mật',
    systemKey: 'visceral',
    cards: [
      {
        id: 'dig_upper',
        title: '1. Đường Tiêu Hóa Trên',
        subtitle: 'Thực quản, dạ dày và tá tràng',
        badge: 'Dạ dày',
        image: '/3d/images/atlas/dig_upper.png',
        systems: ['visceral', 'skeletal'],
        camera: { x: 0, y: 1.15, z: 0.9, targetX: 0, targetY: 1.15, targetZ: 0 },
        desc: 'Nơi tiếp nhận, nhào trộn và tiêu hóa sơ bộ thức ăn nhờ axit dịch vị.'
      },
      {
        id: 'dig_lower',
        title: '2. Đường Tiêu Hóa Dưới',
        subtitle: 'Ruột non, ruột già và trực tràng',
        badge: 'Ruột non & già',
        image: '/3d/images/atlas/dig_lower.png',
        systems: ['visceral', 'skeletal'],
        camera: { x: 0, y: 0.92, z: 0.9, targetX: 0, targetY: 0.92, targetZ: 0 },
        desc: 'Hấp thu triệt để chất dinh dưỡng và đào thải cặn bã qua đại trực tràng.'
      },
      {
        id: 'dig_peritoneum',
        title: '3. Gan Mật & Tụy Tạng',
        subtitle: 'Lá gan, túi mật và tuyến tụy nội/ngoại tiết',
        badge: 'Gan mật tụy',
        image: '/3d/images/atlas/dig_peritoneum.png',
        systems: ['visceral', 'skeletal'],
        camera: { x: -0.15, y: 1.1, z: 0.95, targetX: 0, targetY: 1.1, targetZ: 0 },
        highlight: 'Gallbladder',
        desc: 'Nhà máy chuyển hóa chất, khử độc và tiết enzym tiêu hóa thức ăn.'
      }
    ]
  },
  {
    id: 'lymphatic_views',
    titleVi: 'Hệ Bạch Huyết & Miễn Dịch',
    systemKey: 'lymphatic',
    cards: [
      {
        id: 'lymph_spleen',
        title: '1. Lá Lách & Hệ Bạch Huyết',
        subtitle: 'Lá lách (Tỳ), chuỗi hạch bạch huyết và ống ngực',
        badge: 'Lá lách & Miễn dịch',
        image: '/3d/images/atlas/circ_full.png',
        systems: ['lymphatic', 'skeletal', 'visceral'],
        camera: { x: -0.25, y: 1.15, z: 0.85, targetX: -0.05, targetY: 1.15, targetZ: 0 },
        highlight: 'Spleen',
        desc: 'Cơ quan lympho lớn nhất cơ thể lọc máu, tiêu hủy hồng cầu già và sinh tế bào miễn dịch.'
      },
      {
        id: 'lymph_nodes_system',
        title: '2. Mạng Lưới Hạch Bạch Huyết Toàn Thân',
        subtitle: 'Hạch vùng cổ, nách, bẹn và ống ngực dẫn lưu',
        badge: 'Hạch bạch huyết',
        image: '/3d/images/atlas/nerv_full.png',
        systems: ['lymphatic', 'skeletal'],
        camera: { x: 0, y: 1.2, z: 1.5, targetX: 0, targetY: 1.15, targetZ: 0 },
        desc: 'Hàng rào phòng thủ miễn dịch tế bào, bắt giữ vi khuẩn và dẫn lưu dịch bạch huyết về tĩnh mạch.'
      }
    ]
  },
  {
    id: 'urinary_views',
    titleVi: 'Hệ Tiết Niệu & Vùng Chậu',
    systemKey: 'visceral',
    cards: [
      {
        id: 'urin_system',
        title: '1. Hệ Tiết Niệu Thận',
        subtitle: 'Hai quả thận, niệu quản và bàng quang',
        badge: 'Thận tiết niệu',
        image: '/3d/images/atlas/urin_system.png',
        systems: ['visceral', 'skeletal'],
        camera: { x: 0, y: 1.05, z: 0.95, targetX: 0, targetY: 1.05, targetZ: 0 },
        desc: 'Lọc máu, cân bằng điện giải và bài tiết chất thải qua nước tiểu.'
      },
      {
        id: 'urin_pelvic',
        title: '2. Các Tạng Vùng Chậu',
        subtitle: 'Bàng quang, niệu đạo và đáy chậu',
        badge: 'Chậu hông',
        image: '/3d/images/atlas/urin_pelvic.png',
        systems: ['visceral', 'skeletal'],
        camera: { x: 0, y: 0.88, z: 0.85, targetX: 0, targetY: 0.88, targetZ: 0 },
        desc: 'Giải phẫu đáy chậu, nâng đỡ các tạng sinh dục và bài tiết nước tiểu.'
      }
    ]
  }
];

export const ATLAS_REGIONS_CATEGORIES = [
  {
    id: 'reg_head_neck',
    title: 'Vùng Đầu & Cổ',
    subtitle: 'Hộp sọ, khối mặt và các cơ mạch máu cổ',
    badge: 'Đầu & Cổ',
    image: '/3d/images/atlas/reg_head_neck.png',
    camera: { x: 0, y: 1.55, z: 0.7, targetX: 0, targetY: 1.52, targetZ: 0 },
    systems: ['skeletal', 'nervous', 'cardiovascular']
  },
  {
    id: 'reg_thorax',
    title: 'Vùng Lồng Ngực',
    subtitle: 'Tim, hai lá phổi, trung thất và thành ngực',
    badge: 'Lồng ngực',
    image: '/3d/images/atlas/reg_thorax.png',
    camera: { x: 0, y: 1.25, z: 1.0, targetX: 0, targetY: 1.22, targetZ: 0 },
    systems: ['skeletal', 'cardiovascular', 'visceral']
  },
  {
    id: 'reg_abdomen_pelvis',
    title: 'Vùng Bụng & Chậu',
    subtitle: 'Khoang phúc mạc, ruột và tạng chậu hông',
    badge: 'Bụng & Chậu',
    image: '/3d/images/atlas/reg_abdomen_pelvis.png',
    camera: { x: 0, y: 0.98, z: 1.05, targetX: 0, targetY: 0.95, targetZ: 0 },
    systems: ['skeletal', 'visceral']
  },
  {
    id: 'reg_spine',
    title: 'Trục Cột Sống',
    subtitle: 'Đoạn sống cổ, ngực, thắt lưng và cùng cụt',
    badge: 'Cột sống',
    image: '/3d/images/atlas/reg_spine.png',
    camera: { x: 0.75, y: 1.15, z: 0.9, targetX: 0, targetY: 1.1, targetZ: 0 },
    systems: ['skeletal']
  },
  {
    id: 'reg_upper_limb',
    title: 'Vùng Chi Trên',
    subtitle: 'Đai vai, cánh tay, cẳng tay và bàn tay',
    badge: 'Chi trên',
    image: '/3d/images/atlas/reg_upper_limb.png',
    camera: { x: 0.45, y: 1.1, z: 1.1, targetX: 0.35, ty: 1.1, tz: 0 },
    systems: ['skeletal', 'muscular']
  },
  {
    id: 'reg_lower_limb',
    title: 'Vùng Chi Dưới',
    subtitle: 'Khớp háng, đùi, khớp gối và cẳng bàn chân',
    badge: 'Chi dưới',
    image: '/3d/images/atlas/reg_lower_limb.png',
    camera: { x: 0.25, y: 0.5, z: 1.3, targetX: 0.2, targetY: 0.5, targetZ: 0 },
    systems: ['skeletal']
  }
];

import { getAtlasMediaCategories } from './atlasMediaManager.js';

export const ATLAS_MEDIA_CATEGORIES = getAtlasMediaCategories();


export const ATLAS_QUIZZES_DATA = [
  {
    id: 'quiz_identify',
    title: '1. Trắc Nghiệm Nhận Diện 3D',
    subtitle: 'Chạm trực tiếp vào đúng cấu trúc được yêu cầu',
    badge: 'Trắc nghiệm 3D',
    image: '/3d/images/atlas/quiz_identify.png',
    action: 'start_quiz',
    desc: 'Hệ thống đưa ra câu hỏi danh pháp y khoa, bạn xoay mô hình 3D và chạm đúng đích.'
  },
  {
    id: 'quiz_fsrs',
    title: '2. Thẻ Ghi Nhớ Thông Minh FSRS',
    subtitle: 'Thuật toán ôn tập ngắt quãng khoa học',
    badge: 'Ôn tập FSRS',
    image: '/3d/images/atlas/quiz_fsrs.png',
    action: 'start_fsrs',
    desc: 'Tự động lên lịch ôn các mốc giải phẫu hay quên để khắc sâu vào trí nhớ dài hạn.'
  },
  {
    id: 'quiz_clinical_cases',
    title: '3. Ca Bệnh Lâm Sàng Tương Tác',
    subtitle: 'Tình huống cấp cứu tai nạn và phẫu thuật',
    badge: 'Bác sĩ ảo',
    image: '/3d/images/atlas/quiz_clinical_cases.png',
    action: 'start_scenario',
    desc: 'Vận dụng giải phẫu vào lâm sàng: vết thương thấu ngực, gãy cổ xương đùi, thoát vị.'
  }
];

// 4. GROSS ANATOMY LAB (Phòng Thực Tập Giải Phẫu Thi Thể / Bàn Mổ - Visible Body Cadaver Standard)
export const ATLAS_LAB_CATEGORIES = [
  {
    id: 'lab_back',
    title: '1. Vùng Lưng (Back - Nằm sấp)',
    subtitle: 'Cơ thang, cơ lưng rộng và cột sống trên bàn mổ',
    badge: 'Nằm sấp',
    orientation: 'prone',
    showTable: true,
    systems: ['muscular', 'skeletal'],
    camera: { x: 0.65, y: 1.55, z: 0.45, targetX: 0, targetY: 0.85, targetZ: 0 },
    image: '/3d/images/atlas/reg_thorax.png',
    desc: 'Phẫu tích vùng lưng ở tư thế nằm sấp (Prone) trên bàn mổ inox y khoa.'
  },
  {
    id: 'lab_upper_limb',
    title: '2. Chi Trên & Đai Vai (Upper Limb)',
    subtitle: 'Đai vai, cánh tay, cẳng tay và bàn tay',
    badge: 'Nằm ngửa',
    orientation: 'supine',
    showTable: true,
    systems: ['muscular', 'skeletal', 'nervous'],
    camera: { x: 0.85, y: 1.35, z: 0.65, targetX: 0.35, targetY: 0.85, targetZ: -0.35 },
    image: '/3d/images/atlas/reg_upper_limb.png',
    desc: 'Bộc lộ cơ delta, ống cánh tay và bó mạch thần kinh chi trên.'
  },
  {
    id: 'lab_thorax',
    title: '3. Lồng Ngực (Thorax)',
    subtitle: 'Khung sườn, cơ liên sườn và cơ ngực lớn',
    badge: 'Nằm ngửa',
    orientation: 'supine',
    showTable: true,
    systems: ['skeletal', 'muscular'],
    camera: { x: 0.45, y: 1.50, z: 0.35, targetX: 0, targetY: 0.85, targetZ: -0.25 },
    image: '/3d/images/atlas/reg_thorax.png',
    desc: 'Bóc tách thành ngực trước bộc lộ xương ức, sụn sườn và cơ hoành.'
  },
  {
    id: 'lab_heart_lungs',
    title: '4. Tim & Phổi (Heart & Lungs)',
    subtitle: 'Trung thất, màng ngoài tim và phế quản',
    badge: 'Nằm ngửa',
    orientation: 'supine',
    showTable: true,
    systems: ['visceral', 'cardiovascular', 'skeletal'],
    camera: { x: 0.35, y: 1.45, z: 0.25, targetX: 0, targetY: 0.85, targetZ: -0.25 },
    image: '/3d/images/atlas/med_heart.png',
    desc: 'Phẫu tích trung thất giữa bộc lộ các buồng tim, quai động mạch chủ và hai lá phổi.'
  },
  {
    id: 'lab_abdomen',
    title: '5. Thành Bụng & Ổ Bụng (Abdomen)',
    subtitle: 'Cơ thẳng bụng, cơ chéo bụng và bao cơ',
    badge: 'Nằm ngửa',
    orientation: 'supine',
    showTable: true,
    systems: ['muscular', 'visceral'],
    camera: { x: 0.50, y: 1.40, z: 0.45, targetX: 0, targetY: 0.82, targetZ: 0.05 },
    image: '/3d/images/atlas/reg_abdomen.png',
    desc: 'Mở thành bụng trước bộc lộ lá phúc mạc thành và mạc nối lớn.'
  },
  {
    id: 'lab_intraperitoneal',
    title: '6. Tạng Trong Phúc Mạc (Intraperitoneal)',
    subtitle: 'Dạ dày, gan, ruột non và đại tràng',
    badge: 'Nằm ngửa',
    orientation: 'supine',
    showTable: true,
    systems: ['visceral'],
    camera: { x: 0.40, y: 1.35, z: 0.35, targetX: 0, targetY: 0.82, targetZ: 0.05 },
    image: '/3d/images/atlas/reg_abdomen.png',
    desc: 'Hệ tiêu hóa trong ổ bụng, mạc treo ruột và phân bố mạch mạc treo tràng trên.'
  },
  {
    id: 'lab_retroperitoneal',
    title: '7. Tạng Sau Phúc Mạc (Retroperitoneal)',
    subtitle: 'Hai quả thận, tuyến thượng thận và ĐM chủ bụng',
    badge: 'Nằm ngửa',
    orientation: 'supine',
    showTable: true,
    systems: ['visceral', 'cardiovascular', 'skeletal'],
    camera: { x: 0.30, y: 1.35, z: 0.20, targetX: 0, targetY: 0.82, targetZ: 0.02 },
    image: '/3d/images/atlas/reg_abdomen.png',
    desc: 'Bóc tách khoang sau phúc mạc bộc lộ đài bể thận, niệu quản và TM chủ dưới.'
  },
  {
    id: 'lab_pelvis',
    title: '8. Vùng Chậu (Pelvis & Perineum)',
    subtitle: 'Bàng quang, trực tràng và đáy chậu',
    badge: 'Nằm ngửa',
    orientation: 'supine',
    showTable: true,
    systems: ['skeletal', 'visceral', 'muscular'],
    camera: { x: 0.45, y: 1.35, z: 0.55, targetX: 0, targetY: 0.80, targetZ: 0.25 },
    image: '/3d/images/atlas/reg_pelvis.png',
    desc: 'Khung chậu thực tập giải phẫu cơ sàn chậu và động mạch chậu trong.'
  },
  {
    id: 'lab_lower_limb',
    title: '9. Chi Dưới (Lower Limb Regional)',
    subtitle: 'Đùi, khớp gối, cẳng chân và bàn chân',
    badge: 'Nằm ngửa',
    orientation: 'supine',
    showTable: true,
    systems: ['muscular', 'skeletal', 'nervous'],
    camera: { x: 0.75, y: 1.25, z: 0.85, targetX: 0, targetY: 0.78, targetZ: 0.65 },
    image: '/3d/images/atlas/reg_lower_limb.png',
    desc: 'Bộc lộ tam giác đùi Scarpa, thần kinh tọa và các nhóm cơ cẳng chân.'
  }
];

// 5. CROSS SECTIONS (Lát Cắt Giải Phẫu 3D - Cắt Lớp Y Khoa CT/MRI Chuẩn Visible Body)
export const ATLAS_CROSS_SECTIONS_CATEGORIES = [
  {
    id: 'cs_group_head_axial',
    titleVi: 'Vùng Đầu (Head Axial - Cắt ngang)',
    plane: 'axial',
    cards: [
      {
        id: 'cs_head_thalamus',
        title: '1. Head (Thalamus)',
        subtitle: 'Lát cắt ngang qua não thất ba, đồi thị và bao trong',
        badge: 'Axial',
        plane: 'axial',
        offset: 1.62,
        camera: { x: 0, y: 1.88, z: 0.05, targetX: 0, targetY: 1.62, targetZ: 0 },
        systems: ['skeletal', 'nervous'],
        image: '/3d/images/atlas/nerv_brain.png',
        desc: 'Lát cắt ngang tiêu chuẩn qua đồi thị và hạch nền não bộ.'
      },
      {
        id: 'cs_head_brow',
        title: '2. Head (Brow)',
        subtitle: 'Lát cắt ngang qua thùy trán, xoang trán và sừng trán não thất bên',
        badge: 'Axial',
        plane: 'axial',
        offset: 1.58,
        camera: { x: 0, y: 1.85, z: 0.05, targetX: 0, targetY: 1.58, targetZ: 0 },
        systems: ['skeletal', 'nervous'],
        image: '/3d/images/atlas/nerv_brain.png',
        desc: 'Mặt phẳng cắt ngang qua mức cung mày và cực trán.'
      },
      {
        id: 'cs_head_orbit_ax',
        title: '3. Head (Orbit) (Axial)',
        subtitle: 'Lát cắt ngang qua nhãn cầu, thần kinh thị giác và xương bướm',
        badge: 'Axial',
        plane: 'axial',
        offset: 1.52,
        camera: { x: 0, y: 1.80, z: 0.05, targetX: 0, targetY: 1.52, targetZ: 0 },
        systems: ['skeletal', 'nervous'],
        image: '/3d/images/atlas/skel_skull.png',
        desc: 'Mặt phẳng cắt ngang qua hai hốc mắt và xoang bướm.'
      }
    ]
  },
  {
    id: 'cs_group_head_coronal',
    titleVi: 'Vùng Đầu (Head Coronal - Cắt trán)',
    plane: 'coronal',
    cards: [
      {
        id: 'cs_head_orbit_cor',
        title: '1. Head (Orbit) (Coronal)',
        subtitle: 'Mặt phẳng đứng ngang qua nhãn cầu, xoang trán và xoang hàm trên',
        badge: 'Coronal',
        plane: 'coronal',
        offset: 0.06,
        camera: { x: 0, y: 1.55, z: 0.70, targetX: 0, targetY: 1.55, targetZ: 0 },
        systems: ['skeletal', 'nervous'],
        image: '/3d/images/atlas/skel_skull.png',
        desc: 'Cắt đứng ngang bộc lộ hốc mắt và xoang cạnh mũi.'
      },
      {
        id: 'cs_head_pituitary',
        title: '2. Head (Pituitary)',
        subtitle: 'Mặt phẳng đứng ngang qua hố yên, tuyến yên và giao thoa thị',
        badge: 'Coronal',
        plane: 'coronal',
        offset: 0.00,
        camera: { x: 0, y: 1.55, z: 0.70, targetX: 0, targetY: 1.55, targetZ: 0 },
        systems: ['skeletal', 'nervous'],
        image: '/3d/images/atlas/nerv_brain.png',
        desc: 'Lát cắt đứng ngang qua tuyến yên và động mạch cảnh trong xoang hang.'
      },
      {
        id: 'cs_head_pons',
        title: '3. Head (Pons)',
        subtitle: 'Mặt phẳng đứng ngang qua cầu não, não thất tư và bán cầu tiểu não',
        badge: 'Coronal',
        plane: 'coronal',
        offset: -0.04,
        camera: { x: 0, y: 1.55, z: 0.70, targetX: 0, targetY: 1.55, targetZ: 0 },
        systems: ['skeletal', 'nervous'],
        image: '/3d/images/atlas/nerv_brain.png',
        desc: 'Cắt đứng ngang hố sọ sau bộc lộ cầu não và tiểu não.'
      }
    ]
  },
  {
    id: 'cs_group_head_sagittal',
    titleVi: 'Vùng Đầu (Head Sagittal - Cắt dọc)',
    plane: 'sagittal',
    cards: [
      {
        id: 'cs_head_midsagittal',
        title: '1. Head (Midsagittal)',
        subtitle: 'Lát cắt đứng dọc chính giữa qua thể chai, thân não và tủy sống',
        badge: 'Sagittal',
        plane: 'sagittal',
        offset: 0.00,
        camera: { x: 0.70, y: 1.55, z: 0.0, targetX: 0, targetY: 1.55, targetZ: 0 },
        systems: ['skeletal', 'nervous'],
        image: '/3d/images/atlas/nerv_brain.png',
        desc: 'Lát cắt đứng dọc chính giữa thể hiện hệ thần kinh trung ương trung tâm.'
      },
      {
        id: 'cs_head_orbit_sag',
        title: '2. Head (Orbit) (Sagittal)',
        subtitle: 'Lát cắt đứng dọc qua nhãn cầu, thần kinh thị và cơ thẳng trên/dưới',
        badge: 'Sagittal',
        plane: 'sagittal',
        offset: 0.05,
        camera: { x: 0.70, y: 1.55, z: 0.05, targetX: 0.05, targetY: 1.55, targetZ: 0.05 },
        systems: ['skeletal', 'nervous'],
        image: '/3d/images/atlas/skel_skull.png',
        desc: 'Mặt phẳng đứng dọc xuyên qua trục hốc mắt và ổ mắt.'
      }
    ]
  },
  {
    id: 'cs_group_thorax_axial',
    titleVi: 'Lồng Ngực (Thorax Axial)',
    plane: 'axial',
    cards: [
      {
        id: 'cs_thorax_t02_t03',
        title: '1. Thorax (T02-T03)',
        subtitle: 'Lát cắt ngang qua cung động mạch chủ, tĩnh mạch vô danh và khí quản',
        badge: 'Axial',
        plane: 'axial',
        offset: 1.36,
        camera: { x: 0, y: 1.70, z: 0.05, targetX: 0, targetY: 1.36, targetZ: 0 },
        systems: ['cardiovascular', 'visceral', 'skeletal'],
        image: '/3d/images/atlas/reg_thorax.png',
        scoutLabel: 'Thorax T02-T03',
        desc: 'Mặt phẳng cắt ngang qua đốt sống ngực T2-T3 bộc lộ các mạch máu lớn vùng nền cổ.'
      },
      {
        id: 'cs_thorax_t03_t04',
        title: '2. Thorax (T03-T04)',
        subtitle: 'Lát cắt ngang qua phế quản gốc, trạc ba khí quản carina và ĐM phổi',
        badge: 'Axial',
        plane: 'axial',
        offset: 1.32,
        camera: { x: 0, y: 1.68, z: 0.05, targetX: 0, targetY: 1.32, targetZ: 0 },
        systems: ['cardiovascular', 'visceral', 'skeletal'],
        image: '/3d/images/atlas/resp_lungs.png',
        scoutLabel: 'Thorax T03-T04',
        desc: 'Mặt phẳng cắt ngang qua trạc ba khí quản và cuống phổi.'
      },
      {
        id: 'cs_thorax_t04_t05',
        title: '3. Thorax (T04-T05)',
        subtitle: 'Lát cắt ngang qua 4 buồng tim, nhĩ thất và rãnh liên thất',
        badge: 'Axial',
        plane: 'axial',
        offset: 1.28,
        camera: { x: 0, y: 1.65, z: 0.05, targetX: 0, targetY: 1.28, targetZ: 0 },
        systems: ['cardiovascular', 'visceral', 'skeletal'],
        image: '/3d/images/atlas/circ_heart_thorax.png',
        scoutLabel: 'Thorax T04-T05',
        desc: 'Lát cắt ngang 4 buồng tim tiêu chuẩn đối chiếu siêu âm và CT tim.'
      }
    ]
  },
  {
    id: 'cs_group_abdomen_axial',
    titleVi: 'Ổ Bụng (Abdomen Axial)',
    plane: 'axial',
    cards: [
      {
        id: 'cs_abdomen_t11_t12',
        title: '1. Abdomen (T11-T12)',
        subtitle: 'Lát cắt ngang qua thùy gan, phình vị dạ dày, lách và động mạch thân tạng',
        badge: 'Axial',
        plane: 'axial',
        offset: 1.12,
        camera: { x: 0, y: 1.55, z: 0.05, targetX: 0, targetY: 1.12, targetZ: 0 },
        systems: ['visceral', 'skeletal'],
        image: '/3d/images/atlas/dig_upper.png',
        scoutLabel: 'Abdomen T11-T12',
        desc: 'Mặt phẳng cắt ngang tầng trên mạc treo bộc lộ gan, dạ dày và lách.'
      },
      {
        id: 'cs_abdomen_t12_l01',
        title: '2. Abdomen (T12-L01)',
        subtitle: 'Lát cắt ngang qua tụy, tá tràng, cuống thận và động mạch mạc treo tràng trên',
        badge: 'Axial',
        plane: 'axial',
        offset: 1.08,
        camera: { x: 0, y: 1.50, z: 0.05, targetX: 0, targetY: 1.08, targetZ: 0 },
        systems: ['visceral', 'skeletal'],
        image: '/3d/images/atlas/dig_upper.png',
        scoutLabel: 'Abdomen T12-L01',
        desc: 'Lát cắt ngang qua cuống mạch thận và đầu tụy tá tràng.'
      },
      {
        id: 'cs_abdomen_l01_l02',
        title: '3. Abdomen (L01-L02)',
        subtitle: 'Lát cắt ngang qua quai ruột non, đại tràng lên/xuống và tĩnh mạch chủ dưới',
        badge: 'Axial',
        plane: 'axial',
        offset: 1.04,
        camera: { x: 0, y: 1.48, z: 0.05, targetX: 0, targetY: 1.04, targetZ: 0 },
        systems: ['visceral', 'skeletal'],
        image: '/3d/images/atlas/dig_lower.png',
        scoutLabel: 'Abdomen L01-L02',
        desc: 'Mặt phẳng cắt ngang tầng dưới mạc treo đại tràng ngang.'
      }
    ]
  },
  {
    id: 'cs_group_pelvis_axial',
    titleVi: 'Vùng Chậu (Pelvis Axial)',
    plane: 'axial',
    cards: [
      {
        id: 'cs_pelvis_s05',
        title: '1. Pelvis (S05) (M)',
        subtitle: 'Lát cắt ngang qua khớp cùng chậu, đỉnh bàng quang và bóng trực tràng',
        badge: 'Axial',
        plane: 'axial',
        offset: 0.92,
        camera: { x: 0, y: 1.35, z: 0.05, targetX: 0, targetY: 0.92, targetZ: 0 },
        systems: ['visceral', 'skeletal', 'muscular'],
        image: '/3d/images/atlas/skel_pelvis.png',
        scoutLabel: 'Pelvis S05',
        desc: 'Mặt phẳng cắt ngang qua chậu hông bé và bóng bàng quang.'
      },
      {
        id: 'cs_pelvis_coccyx',
        title: '2. Pelvis (Coccyx) (M)',
        subtitle: 'Lát cắt ngang qua xương cụt, tuyến tiền liệt/tử cung và cơ nâng hậu môn',
        badge: 'Axial',
        plane: 'axial',
        offset: 0.87,
        camera: { x: 0, y: 1.30, z: 0.05, targetX: 0, targetY: 0.87, targetZ: 0 },
        systems: ['visceral', 'skeletal', 'muscular'],
        image: '/3d/images/atlas/urin_pelvic.png',
        scoutLabel: 'Pelvis Coccyx',
        desc: 'Mặt phẳng cắt ngang qua sàn chậu và cơ nâng hậu môn.'
      },
      {
        id: 'cs_pelvis_symphysis',
        title: '3. Pelvis (Symphysis) (M)',
        subtitle: 'Lát cắt ngang qua khớp mu, chỏm xương đùi và củ ngồi',
        badge: 'Axial',
        plane: 'axial',
        offset: 0.83,
        camera: { x: 0, y: 1.25, z: 0.05, targetX: 0, targetY: 0.83, targetZ: 0 },
        systems: ['skeletal', 'muscular'],
        image: '/3d/images/atlas/skel_pelvis.png',
        scoutLabel: 'Pelvis Symphysis',
        desc: 'Mặt phẳng cắt ngang qua ổ cối và diện khớp mu.'
      },
      {
        id: 'cs_pelvis_midsagittal',
        title: '4. Pelvis (Midsagittal)',
        subtitle: 'Lát cắt đứng dọc qua bàng quang, trực tràng và sàn chậu',
        badge: 'Sagittal',
        plane: 'sagittal',
        offset: 0.00,
        camera: { x: 0.75, y: 0.85, z: 0.0, targetX: 0, targetY: 0.85, targetZ: 0 },
        systems: ['visceral', 'skeletal', 'muscular'],
        image: '/3d/images/atlas/skel_pelvis.png',
        scoutLabel: 'Pelvis Midsagittal',
        desc: 'Mặt phẳng đứng dọc chính giữa qua các tạng vùng chậu và đáy chậu.'
      }
    ]
  }
];

// 6. MICROANATOMY (Giải Phẫu Vi Thể & Cắt Lớp Tầng Da - Mô Học Y Khoa)
export const ATLAS_MICROANATOMY_CATEGORIES = [
  {
    id: 'micro_group_skin',
    titleVi: 'Hệ Da & Cắt Lớp Tầng Da (Integumentary System)',
    cards: [
      {
        id: 'micro_skin_dark',
        title: '1. Skin (Dark Pigmentation)',
        subtitle: 'Cắt lớp 3D đa tầng: Biểu bì, Trung bì và Mô mỡ dưới da',
        badge: 'Cắt lớp da',
        systems: ['visceral', 'skeletal'],
        camera: { x: 0.15, y: 1.15, z: 0.35, targetX: 0.05, targetY: 1.12, targetZ: 0 },
        image: '/3d/images/atlas/med_skin.png',
        desc: 'Mô hình cắt lớp 3D tầng da: lớp sừng, lớp gai, lớp hạt, lớp đáy hắc tố Melanin, collagen và mỡ hạ bì.'
      },
      {
        id: 'micro_skin_light',
        title: '2. Skin (Light Pigmentation)',
        subtitle: 'Lát cắt da sắc tố sáng: Tế bào đáy sinh sản và vi tuần hoàn mao mạch',
        badge: 'Mô học da',
        systems: ['visceral', 'skeletal'],
        camera: { x: 0.12, y: 1.15, z: 0.30, targetX: 0.05, targetY: 1.12, targetZ: 0 },
        image: '/3d/images/atlas/med_skin.png',
        desc: 'Chi tiết mô học vi thể các lớp tế bào sừng hóa và mạng lưới sợi đàn hồi elastin nâng đỡ.'
      },
      {
        id: 'micro_hair_follicle',
        title: '3. Hair Follicle (Curly Hair)',
        subtitle: 'Nang lông, tuyến bã nhờn, tuyến mồ hôi và cơ dựng lông',
        badge: 'Phụ bì',
        systems: ['visceral', 'skeletal'],
        camera: { x: 0.10, y: 1.18, z: 0.28, targetX: 0.05, targetY: 1.15, targetZ: 0 },
        image: '/3d/images/atlas/med_soft_tissue.png',
        desc: 'Đơn vị nang lông tuyến bã: bóng chân lông, cơ dựng lông arrector pili và tuyến tiết bã nhờn.'
      }
    ]
  },
  {
    id: 'micro_group_senses',
    titleVi: 'Giác Quan Vi Thể (Senses)',
    cards: [
      {
        id: 'micro_eye',
        title: '1. Eye (Nhãn Cầu 3D)',
        subtitle: 'Giác mạc, củng mạc, màng bồ đào, thể mi, mống mắt và võng mạc',
        badge: 'Thị giác',
        systems: ['nervous', 'skeletal'],
        camera: { x: 0.10, y: 1.58, z: 0.25, targetX: 0.03, targetY: 1.58, targetZ: 0.04 },
        image: '/3d/images/atlas/skel_skull.png',
        desc: 'Mặt cắt cấu trúc nhãn cầu thể hiện đường truyền ánh sáng và võng mạc thụ cảm.'
      },
      {
        id: 'micro_lacrimal',
        title: '2. Lacrimal Apparatus (Bộ Lệ)',
        subtitle: 'Tuyến lệ chính, tiểu quản lệ, túi lệ và ống lệ mũi',
        badge: 'Bộ lệ',
        systems: ['skeletal', 'nervous'],
        camera: { x: 0.08, y: 1.60, z: 0.22, targetX: 0.02, targetY: 1.60, targetZ: 0.04 },
        image: '/3d/images/atlas/skel_skull.png',
        desc: 'Hệ thống tiết và dẫn lưu nước mắt giữ ẩm và bảo vệ bề mặt giác mạc.'
      },
      {
        id: 'micro_lens_zonule',
        title: '3. Lens and Zonular Fibers',
        subtitle: 'Thể thủy tinh hai mặt lồi và dây chằng treo Zinn điều tiết',
        badge: 'Khúc xạ',
        systems: ['nervous'],
        camera: { x: 0.06, y: 1.58, z: 0.18, targetX: 0.03, targetY: 1.58, targetZ: 0.04 },
        image: '/3d/images/atlas/skel_skull.png',
        desc: 'Dây chằng Zinn treo thể thủy tinh vào thể mi phục vụ điều tiết thị lực gần xa.'
      }
    ]
  },
  {
    id: 'micro_group_skeletal',
    titleVi: 'Hệ Xương Vi Thể (Skeletal System)',
    cards: [
      {
        id: 'micro_femur_section',
        title: '1. Sectioned Femur (Mặt Cắt Xương Đùi)',
        subtitle: 'Vỏ xương đặc ngoài, bè xương xốp xốp và khoang tủy xương',
        badge: 'Mô học xương',
        systems: ['skeletal'],
        camera: { x: 0.25, y: 0.65, z: 0.45, targetX: 0.15, targetY: 0.65, targetZ: 0 },
        image: '/3d/images/atlas/med_skeleton.png',
        desc: 'Cấu trúc giải phẫu vi thể xương đùi với hệ thống bè xương xốp chịu lực nén tối ưu.'
      },
      {
        id: 'micro_osteon',
        title: '2. Osteon (Đơn Vị Xương Vi Thể Havers)',
        subtitle: 'Ống Havers trung tâm, các lá xương đồng tâm và tế bào xương Osteocyte',
        badge: 'Vi thể',
        systems: ['skeletal'],
        camera: { x: 0.20, y: 0.65, z: 0.35, targetX: 0.15, targetY: 0.65, targetZ: 0 },
        image: '/3d/images/atlas/med_bone_repair.png',
        desc: 'Đơn vị cấu tạo chức năng cơ bản của xương đặc, dẫn truyền mạch máu và thần kinh nuôi xương.'
      }
    ]
  }
];

// 7. MUSCLE ACTIONS (Chuyển Động Khớp & Cơ Sinh Lý 3D - Chuẩn Visible Body)
export const ATLAS_MUSCLE_ACTIONS_CATEGORIES = [
  {
    id: 'act_group_spine',
    titleVi: 'Cột Sống & Lưng (Spine and Back)',
    cards: [
      {
        id: 'act_spine_flex',
        title: '1. Spine Flexion (Gập Cột Sống)',
        subtitle: 'Cơ thẳng bụng co, cột sống thắt lưng gập ra trước',
        badge: 'Cột sống',
        motionId: 'spine_flexion',
        systems: ['muscular', 'skeletal'],
        camera: { x: 0.85, y: 1.15, z: 1.1, targetX: 0, targetY: 1.05, targetZ: 0 },
        image: '/3d/images/atlas/musc_torso.png',
        desc: 'Chuyển động gập thân mình quanh trục ngang ở các đốt sống thắt lưng.'
      },
      {
        id: 'act_spine_ext',
        title: '2. Spine Extension (Duỗi Cột Sống)',
        subtitle: 'Nhóm cơ dựng sống (Erector spinae) kéo cột sống ngửa ra sau',
        badge: 'Cột sống',
        motionId: 'spine_extension',
        systems: ['muscular', 'skeletal'],
        camera: { x: 0.85, y: 1.15, z: 1.1, targetX: 0, targetY: 1.05, targetZ: 0 },
        image: '/3d/images/atlas/musc_torso.png',
        desc: 'Chuyển động duỗi cột sống giúp duy trì tư thế đứng thẳng của con người.'
      },
      {
        id: 'act_spine_lat',
        title: '3. Spine Lateral Flexion (Nghiêng Cột Sống)',
        subtitle: 'Cơ vuông thắt lưng và cơ chéo bụng co nghiêng thân sang bên',
        badge: 'Cột sống',
        motionId: 'spine_lat_flexion',
        systems: ['muscular', 'skeletal'],
        camera: { x: 0, y: 1.15, z: 1.45, targetX: 0, targetY: 1.05, targetZ: 0 },
        image: '/3d/images/atlas/musc_torso.png',
        desc: 'Chuyển động nghiêng cột sống trong mặt phẳng đứng ngang.'
      }
    ]
  },
  {
    id: 'act_group_pelvis',
    titleVi: 'Khung Chậu & Khớp Háng (Pelvis and Hip)',
    cards: [
      {
        id: 'act_hip_flex',
        title: '1. Hip Flexion (Gập Khớp Háng)',
        subtitle: 'Cơ thắt lưng chậu (Iliopsoas) và cơ thẳng đùi nâng đùi ra trước',
        badge: 'Khớp háng',
        motionId: 'hip_flexion',
        systems: ['muscular', 'skeletal'],
        camera: { x: 0.75, y: 0.75, z: 1.0, targetX: 0.1, targetY: 0.75, targetZ: 0 },
        image: '/3d/images/atlas/musc_limbs.png',
        desc: 'Chuyển động gập khớp chỏm đùi - ổ cối trong bước đi và chạy.'
      },
      {
        id: 'act_hip_ext',
        title: '2. Hip Extension (Duỗi Khớp Háng)',
        subtitle: 'Cơ mông lớn (Gluteus maximus) và gân kheo kéo đùi ra sau',
        badge: 'Khớp háng',
        motionId: 'hip_extension',
        systems: ['muscular', 'skeletal'],
        camera: { x: 0.75, y: 0.75, z: 1.0, targetX: 0.1, targetY: 0.75, targetZ: 0 },
        image: '/3d/images/atlas/musc_limbs.png',
        desc: 'Chuyển động tạo lực đẩy chính khi đứng dậy, leo dốc và chạy nhảy.'
      },
      {
        id: 'act_hip_rot',
        title: '3. Hip Medial Rotation (Xoay Trong Khớp Háng)',
        subtitle: 'Cơ căng mạc đùi và cơ mông nhỡ xoay đùi vào trong',
        badge: 'Khớp háng',
        motionId: 'hip_rotation',
        systems: ['muscular', 'skeletal'],
        camera: { x: 0.35, y: 0.75, z: 1.1, targetX: 0.1, targetY: 0.75, targetZ: 0 },
        image: '/3d/images/atlas/musc_limbs.png',
        desc: 'Chuyển động xoay trục đùi quanh đường nối từ chỏm đùi đến lồi cầu.'
      }
    ]
  },
  {
    id: 'act_group_lower_limbs',
    titleVi: 'Chi Dưới & Khớp Gối (Lower Limbs)',
    cards: [
      {
        id: 'act_knee_flex',
        title: '1. Knee Flexion (Gập Khớp Gối)',
        subtitle: 'Nhóm cơ gân kheo (Hamstrings) co gập cẳng chân ra sau',
        badge: 'Khớp gối',
        motionId: 'knee_flexion',
        systems: ['muscular', 'skeletal'],
        camera: { x: 0.65, y: 0.45, z: 0.9, targetX: 0.1, targetY: 0.45, targetZ: 0 },
        image: '/3d/images/atlas/musc_limbs.png',
        desc: 'Khớp bản lề gối gập cẳng chân lên đùi.'
      },
      {
        id: 'act_knee_ext',
        title: '2. Knee Extension (Duỗi Khớp Gối)',
        subtitle: 'Cơ tứ đầu đùi (Quadriceps) kéo bánh chè duỗi thẳng cẳng chân',
        badge: 'Khớp gối',
        motionId: 'knee_extension',
        systems: ['muscular', 'skeletal'],
        camera: { x: 0.65, y: 0.45, z: 0.9, targetX: 0.1, targetY: 0.45, targetZ: 0 },
        image: '/3d/images/atlas/musc_limbs.png',
        desc: 'Khóa khớp gối giúp giữ vững trọng tâm cơ thể khi đứng thẳng.'
      },
      {
        id: 'act_knee_rot',
        title: '3. Knee Medial Rotation (Xoay Trong Khớp Gối)',
        subtitle: 'Cơ khoeo và cơ bán gân xoay nhẹ cẳng chân vào trong',
        badge: 'Khớp gối',
        motionId: 'knee_rotation',
        systems: ['muscular', 'skeletal'],
        camera: { x: 0.35, y: 0.45, z: 0.9, targetX: 0.1, targetY: 0.45, targetZ: 0 },
        image: '/3d/images/atlas/musc_limbs.png',
        desc: 'Mở khóa khớp gối khi bắt đầu bước gập chân.'
      }
    ]
  },
  {
    id: 'act_group_shoulder',
    titleVi: 'Khớp Vai (Shoulder)',
    cards: [
      {
        id: 'act_shoulder_flex',
        title: '1. Shoulder Flexion (Gập Khớp Vai)',
        subtitle: 'Bó trước cơ delta và cơ ngực lớn nâng cánh tay ra trước',
        badge: 'Khớp vai',
        motionId: 'shoulder_flexion',
        systems: ['muscular', 'skeletal'],
        camera: { x: 0.65, y: 1.35, z: 0.9, targetX: 0.2, targetY: 1.30, targetZ: 0 },
        image: '/3d/images/atlas/musc_limbs.png',
        desc: 'Chuyển động nâng cánh tay lên phía trước theo mặt phẳng đứng dọc.'
      },
      {
        id: 'act_shoulder_ext',
        title: '2. Shoulder Extension (Duỗi Khớp Vai)',
        subtitle: 'Cơ lưng rộng, cơ tròn lớn và bó sau cơ delta kéo tay ra sau',
        badge: 'Khớp vai',
        motionId: 'shoulder_extension',
        systems: ['muscular', 'skeletal'],
        camera: { x: 0.65, y: 1.35, z: 0.9, targetX: 0.2, targetY: 1.30, targetZ: 0 },
        image: '/3d/images/atlas/musc_limbs.png',
        desc: 'Chuyển động đưa cánh tay về sau thân mình.'
      },
      {
        id: 'act_shoulder_abd',
        title: '3. Shoulder Horizontal Abduction (Dang Ngang Vai)',
        subtitle: 'Cơ delta và cơ trên gai dang cánh tay sang bên',
        badge: 'Khớp vai',
        motionId: 'shoulder_abduction',
        systems: ['muscular', 'skeletal'],
        camera: { x: 0, y: 1.35, z: 1.3, targetX: 0.15, targetY: 1.30, targetZ: 0 },
        image: '/3d/images/atlas/musc_limbs.png',
        desc: 'Khớp chỏm cầu ổ chảo dang cánh tay từ 0 đến 90 độ.'
      }
    ]
  },
  {
    id: 'act_group_upper_limbs',
    titleVi: 'Chi Trên & Khớp Khuỷu (Upper Limbs)',
    cards: [
      {
        id: 'act_elbow_flex',
        title: '1. Elbow Flexion (Gập Khớp Khuỷu)',
        subtitle: 'Cơ nhị đầu cánh tay (Biceps) và cơ cánh tay gập cẳng tay',
        badge: 'Khuỷu tay',
        motionId: 'elbow_flexion',
        systems: ['muscular', 'skeletal'],
        camera: { x: 0.55, y: 1.10, z: 0.75, targetX: 0.25, targetY: 1.05, targetZ: 0 },
        image: '/3d/images/atlas/musc_limbs.png',
        desc: 'Chuyển động gập bản lề của khớp cánh tay - trụ và cánh tay - quay.'
      },
      {
        id: 'act_elbow_ext',
        title: '2. Elbow Extension (Duỗi Khớp Khuỷu)',
        subtitle: 'Cơ tam đầu cánh tay (Triceps) kéo mỏm khuỷu duỗi thẳng tay',
        badge: 'Khuỷu tay',
        motionId: 'elbow_extension',
        systems: ['muscular', 'skeletal'],
        camera: { x: 0.55, y: 1.10, z: 0.75, targetX: 0.25, targetY: 1.05, targetZ: 0 },
        image: '/3d/images/atlas/musc_limbs.png',
        desc: 'Khóa khớp khuỷu khi đẩy hoặc nâng vật thể.'
      },
      {
        id: 'act_forearm_pro',
        title: '3. Forearm Pronation (Sấp Cẳng Tay)',
        subtitle: 'Cơ sấp tròn và cơ sấp vuông xoay xương quay vắt chéo xương trụ',
        badge: 'Cẳng tay',
        motionId: 'forearm_pronation',
        systems: ['muscular', 'skeletal'],
        camera: { x: 0.45, y: 1.00, z: 0.65, targetX: 0.25, targetY: 0.95, targetZ: 0 },
        image: '/3d/images/atlas/musc_limbs.png',
        desc: 'Khớp quay - trụ xoay bàn tay úp xuống dưới.'
      }
    ]
  },
  {
    id: 'act_group_thorax',
    titleVi: 'Lồng Ngực & Hô Hấp (Thorax & Respiration)',
    cards: [
      {
        id: 'act_ribs_elev',
        title: '1. Ribs Elevation (Nâng Khung Sườn - Hít Vào)',
        subtitle: 'Cơ liên sườn ngoài nâng khung sườn làm tăng thể tích lồng ngực',
        badge: 'Hô hấp',
        motionId: 'respiratory',
        systems: ['skeletal', 'visceral'],
        camera: { x: 0, y: 1.28, z: 1.0, targetX: 0, targetY: 1.28, targetZ: 0 },
        image: '/3d/images/atlas/med_respiratory_cycle.png',
        desc: 'Chuyển động nâng sườn dạng cán xô và tay cầm bơm khi hít vào.'
      },
      {
        id: 'act_ribs_dep',
        title: '2. Ribs Depression (Hạ Khung Sườn - Thở Ra)',
        subtitle: 'Khung sườn hạ xuống xẹp lại, phổi co hồi thụ động đẩy khí ra ngoài',
        badge: 'Hô hấp',
        motionId: 'respiratory',
        systems: ['skeletal', 'visceral'],
        camera: { x: 0, y: 1.28, z: 1.0, targetX: 0, targetY: 1.28, targetZ: 0 },
        image: '/3d/images/atlas/med_respiratory_cycle.png',
        desc: 'Giai đoạn thở ra của chu kỳ thông khí phổi.'
      },
      {
        id: 'act_cardiac',
        title: '3. Cardiac Cycle (Chu Kỳ Co Bóp Tim)',
        subtitle: 'Tâm thu tống máu vào động mạch và tâm trương giãn nở hút máu về',
        badge: 'Tuần hoàn',
        motionId: 'cardiac',
        systems: ['cardiovascular', 'skeletal'],
        camera: { x: 0.05, y: 1.28, z: 0.65, targetX: 0.02, targetY: 1.28, targetZ: 0.03 },
        image: '/3d/images/atlas/med_cardiac_cycle.png',
        desc: 'Hoạt động co bóp nhịp nhàng của cơ tim theo hệ thống dẫn truyền tự động.'
      }
    ]
  }
];


