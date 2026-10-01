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

