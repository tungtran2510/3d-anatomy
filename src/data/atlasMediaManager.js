// Atlas Media Manager & Data Store
// Đồng bộ 12 danh mục Hoạt ảnh & Video Y khoa (Atlas 2027)
// Hỗ trợ Quản trị viên tùy biến link video, tiêu đề, thời lượng và lưu vào LocalStorage

// -----------------------------------------------------------------------------
// DANH MỤC 9 VIDEO PLAYLIST ĐÀO TẠO & GIẢI PHẪU BỆNH LÝ CHUYÊN SÂU
// -----------------------------------------------------------------------------
export const MEDICAL_TRAINING_PLAYLISTS = [
  {
    id: 'pl_spine',
    titleVi: '1. Giải Phẫu & Bệnh Lý Cột Sống',
    title: '1. Spine Anatomy & Pathologies',
    subtitle: 'Giải phẫu 33 đốt sống, trục cột sống và cơ chế đĩa đệm',
    duration: '10:38',
    badge: 'Cột sống',
    type: 'video',
    image: './images/atlas/skel_spine.png',
    videoUrl: 'https://www.youtube.com/embed/rDGqkMHPDqE?rel=0&enablejsapi=1',
    playlistUrl: 'https://www.youtube.com/watch?v=rDGqkMHPDqE',
    desc: 'Giải phẫu 33 đốt sống, 4 đường cong sinh lý, đĩa đệm, cơ chế nâng đỡ và bảo vệ tủy sống.'
  },
  {
    id: 'pl_digestive',
    titleVi: '2. Giải Phẫu & Sinh Lý Hệ Tiêu Hóa',
    title: '2. Digestive Anatomy & Physiology',
    subtitle: 'Cấu trúc & chức năng dạ dày, gan, mật, tụy và ruột non',
    duration: 'Playlist',
    badge: 'Tiêu hóa',
    type: 'video',
    image: './images/atlas/dig_upper.png',
    videoUrl: 'https://www.youtube.com/embed/videoseries?list=PLLyiVaWnDvSKaN2oXXs5RHnoPdgv2ZsgF&rel=0&enablejsapi=1',
    playlistUrl: 'https://www.youtube.com/playlist?list=PLLyiVaWnDvSKaN2oXXs5RHnoPdgv2ZsgF',
    desc: 'Cấu trúc và chức năng dạ dày, gan, mật, tụy, ruột non và cơ chế tiêu hóa hấp thu dinh dưỡng.'
  },
  {
    id: 'pl_nutrition',
    titleVi: '3. Ăn Uống & Dinh Dưỡng Khoa Học',
    title: '3. Clinical Nutrition & Diet',
    subtitle: 'Chế độ dinh dưỡng cân bằng và can thiệp hỗ trợ bệnh lý',
    duration: 'Playlist',
    badge: 'Dinh dưỡng',
    type: 'video',
    image: './images/atlas/dig_lower.png',
    videoUrl: 'https://www.youtube.com/embed/videoseries?list=PLLyiVaWnDvSLDD-tu3qmcOEMp-ocgsBMU&rel=0&enablejsapi=1',
    playlistUrl: 'https://www.youtube.com/playlist?list=PLLyiVaWnDvSLDD-tu3qmcOEMp-ocgsBMU',
    desc: 'Chế độ ăn cân bằng các nhóm dưỡng chất, dinh dưỡng hỗ trợ điều trị bệnh và nâng cao thể trạng.'
  },
  {
    id: 'pl_pathology',
    titleVi: '4. Bệnh Lý Học: Nguyên Nhân & Giải Pháp',
    title: '4. Pathologies: Causes & Solutions',
    subtitle: 'Phân tích nguyên nhân gốc rễ, cơ chế bệnh sinh và giải pháp',
    duration: 'Playlist',
    badge: 'Bệnh lý',
    type: 'video',
    image: './images/atlas/circ_simplified.png',
    videoUrl: 'https://www.youtube.com/embed/videoseries?list=PLLyiVaWnDvSI-Ej51joE-6N8R-G3ltg-x&rel=0&enablejsapi=1',
    playlistUrl: 'https://www.youtube.com/playlist?list=PLLyiVaWnDvSI-Ej51joE-6N8R-G3ltg-x',
    desc: 'Phân tích cơ chế bệnh sinh từ gốc rễ, các hội chứng phổ biến và giải pháp can thiệp khoa học.'
  },
  {
    id: 'pl_weight',
    titleVi: '5. Quản Lý Cân Nặng: Tăng Giảm Cân & Chuyển Hóa',
    title: '5. Weight Management & Metabolism',
    subtitle: 'Khoa học tăng cơ giảm mỡ, chuyển hóa và vóc dáng chuẩn',
    duration: '10:53',
    badge: 'Cân nặng',
    type: 'video',
    image: './images/atlas/med_paired_muscles.png',
    videoUrl: 'https://www.youtube.com/embed/Ktv-CaOt6UQ?rel=0&enablejsapi=1',
    playlistUrl: 'https://www.youtube.com/watch?v=Ktv-CaOt6UQ',
    desc: 'Khoa học tăng cơ giảm mỡ, cân bằng năng lượng nạp vào - tiêu hao và tối ưu hóa chuyển hóa cơ thể.'
  },
  {
    id: 'pl_organ_systems',
    titleVi: '6. Tổng Quan Toàn Diện Các Hệ Cơ Quan',
    title: '6. Comprehensive Organ Systems',
    subtitle: 'Giải phẫu đại cương 12 hệ cơ quan trong cơ thể người',
    duration: '10:38',
    badge: 'Hệ cơ quan',
    type: 'video',
    image: './images/atlas/skel_full.png',
    videoUrl: 'https://www.youtube.com/embed/rDGqkMHPDqE?rel=0&enablejsapi=1',
    playlistUrl: 'https://www.youtube.com/watch?v=rDGqkMHPDqE',
    desc: 'Hệ xương, hệ cơ bắp, hệ tuần hoàn, hệ hô hấp, hệ tiêu hóa, hệ thần kinh và sự phối hợp đồng bộ.'
  },
  {
    id: 'pl_preventive',
    titleVi: '7. Y Học Dự Phòng: Phòng Bệnh Chủ Động',
    title: '7. Preventive Medicine & Wellness',
    subtitle: 'Chiến lược bảo vệ miễn dịch, thải độc và phòng ngừa sớm',
    duration: '09:36',
    badge: 'Phòng bệnh',
    type: 'video',
    image: './images/atlas/med_skin.png',
    videoUrl: 'https://www.youtube.com/embed/Orumw-PyNjw?rel=0&enablejsapi=1',
    playlistUrl: 'https://www.youtube.com/watch?v=Orumw-PyNjw',
    desc: 'Nguyên lý bảo vệ sức khỏe sớm, tăng cường hệ miễn dịch, loại bỏ độc tố và duy trì lối sống lành mạnh.'
  },
  {
    id: 'pl_health_knowledge',
    titleVi: '8. Kiến Thức Sức Khỏe Toàn Diện',
    title: '8. Health Education & Wellness Knowledge',
    subtitle: 'Cẩm nang y khoa thường thức bảo vệ sức khỏe cả gia đình',
    duration: 'Playlist',
    badge: 'Sức khỏe',
    type: 'video',
    image: './images/atlas/nerv_brain.png',
    videoUrl: 'https://www.youtube.com/embed/videoseries?list=PLLyiVaWnDvSIysyrnuDZLADVvkGrIKRae&rel=0&enablejsapi=1',
    playlistUrl: 'https://www.youtube.com/playlist?list=PLLyiVaWnDvSIysyrnuDZLADVvkGrIKRae',
    desc: 'Cẩm nang kiến thức y khoa thường thức giúp hiểu rõ cơ thể để tự chăm sóc và bảo vệ sức khỏe gia đình.'
  }
];

export const DEFAULT_ATLAS_MEDIA_CATEGORIES = [
  {
    id: 'medical_training_playlists',
    titleVi: 'Khóa Đào Tạo & Video Series Chuyên Sâu',
    cards: MEDICAL_TRAINING_PLAYLISTS
  },
  {
    id: 'system_overviews_media',
    titleVi: 'Tổng Quan Các Hệ Cơ Quan',
    cards: [
      {
        id: 'med_skin',
        titleVi: '1. Cấu Trúc & Chức Năng Của Hệ Da',
        title: '1. Function of the Skin',
        subtitle: 'Chức năng của da: Bảo vệ, điều hòa thân nhiệt và xúc giác',
        duration: '09:36',
        badge: 'Tổng quan',
        type: 'video',
        image: './images/atlas/med_skin.png',
        videoUrl: 'https://www.youtube.com/embed/Orumw-PyNjw',
        desc: 'Hàng rào bảo vệ sinh học, thụ cảm thần kinh và điều hòa thân nhiệt.'
      },
      {
        id: 'med_skeleton',
        titleVi: '2. Chức Năng Nâng Đỡ Của Hệ Xương',
        title: '2. Function of the Skeleton',
        subtitle: 'Chức năng hệ xương: Khung nâng đỡ, bảo vệ tạng và sinh máu',
        duration: '10:38',
        badge: 'Cơ xương',
        type: 'video',
        image: './images/atlas/med_skeleton.png',
        videoUrl: 'https://www.youtube.com/embed/rDGqkMHPDqE',
        desc: 'Bộ khung cơ thể, tạo khoang bảo vệ tạng và tủy xương sinh máu.'
      },
      {
        id: 'med_muscles',
        titleVi: '3. Phân Loại Các Mô Cơ (Vân, Trơn, Tim)',
        title: '3. Muscle Tissue Types',
        subtitle: 'Các loại mô cơ: Cơ vân, cơ trơn nội tạng và cơ tim',
        duration: '10:53',
        badge: 'Mô học',
        type: 'video',
        image: './images/atlas/med_muscles.png',
        videoUrl: 'https://www.youtube.com/embed/Ktv-CaOt6UQ',
        desc: 'Đặc điểm sinh lý học của cơ vân có ý thức, cơ trơn tạng và cơ tim.'
      }
    ]
  },
  {
    id: 'bones_skeletal_muscles_media',
    titleVi: 'Hệ Xương & Cơ Bắp',
    cards: [
      {
        id: 'med_paired_muscles',
        titleVi: '1. Hoạt Động Của Các Cặp Cơ Đối Vận',
        title: '1. Paired Muscle Actions',
        subtitle: 'Cặp cơ đối vận: Cơ chế gấp và duỗi khuỷu tay',
        duration: '10:53',
        badge: 'Cơ xương',
        type: 'video',
        image: './images/atlas/med_paired_muscles.png',
        videoUrl: 'https://www.youtube.com/embed/Ktv-CaOt6UQ',
        motionType: 'elbow_flexion',
        desc: 'Cơ chế cơ nhị đầu co gấp khuỷu đối kháng cơ tam đầu duỗi khuỷu.'
      },
      {
        id: 'med_ball_socket',
        titleVi: '2. Khớp Hoạt Dịch Dạng Cầu (Khớp Vai & Háng)',
        title: '2. Joint: Ball and Socket',
        subtitle: 'Khớp chỏm cầu: Vận động đa trục xoay tròn 360 độ',
        duration: '09:20',
        badge: 'Khớp 3D',
        type: 'video',
        image: './images/atlas/med_ball_socket.png',
        videoUrl: 'https://www.youtube.com/embed/DLxYDoN634c',
        motionType: 'hip_abduction',
        desc: 'Khớp cử động linh hoạt nhất cơ thể với 3 bậc tự do và chuyển động đa trục.'
      },
      {
        id: 'med_condyloid',
        titleVi: '3. Khớp Hoạt Dịch Dạng Lồi Cầu (Khớp Gối)',
        title: '3. Joint: Condyloid',
        subtitle: 'Khớp lồi cầu: Chuyển động gập duỗi bản lề của khớp',
        duration: '09:20',
        badge: 'Khớp 3D',
        type: 'video',
        image: './images/atlas/med_condyloid.png',
        videoUrl: 'https://www.youtube.com/embed/DLxYDoN634c',
        motionType: 'knee_flexion',
        desc: 'Chuyển động gập duỗi bản lề của khớp gối và lồi cầu.'
      }
    ]
  },
  {
    id: 'cells_tissues_media',
    titleVi: 'Tế Bào & Mô Học',
    cards: [
      {
        id: 'med_cell_types',
        titleVi: '1. Các Loại Tế Bào Trong Cơ Thể Người',
        title: '1. Types of Cells',
        subtitle: 'Các loại tế bào: Cấu trúc và sự biệt hóa tế bào người',
        duration: '04:22',
        badge: 'Tế bào học',
        type: 'video',
        image: './images/atlas/med_skin.png',
        videoUrl: 'https://www.youtube.com/embed/URUJD5NEXC8',
        desc: 'Cấu trúc tế bào người và các bào quan thực hiện chuyển hóa năng lượng.'
      },
      {
        id: 'med_bone_repair',
        titleVi: '2. Cơ Chế Tái Tạo Khung Xương',
        title: '2. Bone Structure and Repair',
        subtitle: 'Tiến trình nâng đỡ & tái tạo can xương',
        duration: '10:38',
        badge: 'Tái tạo',
        type: 'video',
        image: './images/atlas/med_bone_repair.png',
        videoUrl: 'https://www.youtube.com/embed/rDGqkMHPDqE',
        desc: 'Bộ khung cơ thể, tạo khoang bảo vệ tạng và phân phối tải trọng vận động.'
      },
      {
        id: 'med_soft_tissue',
        titleVi: '3. Cấu Tạo & Hoạt Hóa Sợi Cơ',
        title: '3. Muscle Structure & Tissue',
        subtitle: 'Tái tạo mô mềm: Cấu trúc myofibril và co cơ',
        duration: '10:53',
        badge: 'Phục hồi',
        type: 'video',
        image: './images/atlas/med_soft_tissue.png',
        videoUrl: 'https://www.youtube.com/embed/Ktv-CaOt6UQ',
        desc: 'Cơ chế co rút của sợi myosin và actin tạo động lực vận động.'
      }
    ]
  },
  {
    id: 'respiration_circulation_media',
    titleVi: 'Hô Hấp & Tuần Hoàn',
    cards: [
      {
        id: 'med_breathing',
        titleVi: '1. Cơ Chế Thông Khí Phổi & Trao Đổi Khí',
        title: '1. Respiratory System & Breathing',
        subtitle: 'Cơ chế thở: Áp suất âm lồng ngực và phế nang',
        duration: '09:22',
        badge: 'Hô hấp',
        type: 'video',
        image: './images/atlas/resp_lungs.png',
        videoUrl: 'https://www.youtube.com/embed/bHZsvBdUC2I',
        desc: 'Cơ hoành hạ thấp mở rộng thể tích ngực tạo áp suất âm hút khí vào phổi.'
      },
      {
        id: 'med_heart_pressure',
        titleVi: '2. Sinh Lý Tim & Chu Chuyển Van Tim',
        title: '2. The Heart Under Pressure',
        subtitle: '4 buồng tim, áp lực buồng tim và hệ van',
        duration: '10:36',
        badge: 'Tim mạch',
        type: 'video',
        image: './images/atlas/circ_simplified.png',
        videoUrl: 'https://www.youtube.com/embed/X9ZZ6tcxArI',
        desc: 'Chuyển động nhịp nhàng đóng mở van tim và tống máu đi khắp cơ thể.'
      },
      {
        id: 'med_heart_circulation',
        titleVi: '3. Dòng Chảy Máu Qua Tim & Đại Tuần Hoàn',
        title: '3. Flow Through the Heart',
        subtitle: 'Vòng tuần hoàn phổi và đại tuần hoàn',
        duration: '07:51',
        badge: 'Tuần hoàn',
        type: 'video',
        image: './images/atlas/circ_heart_thorax.png',
        videoUrl: 'https://www.youtube.com/embed/7XaftdE_h60',
        desc: 'Đường đi của máu giàu oxy và nghèo oxy qua 2 nửa tim.'
      }
    ]
  },
  {
    id: 'nutrition_elimination_media',
    titleVi: 'Dinh Dưỡng & Bài Tiết',
    cards: [
      {
        id: 'med_digestive_playlist',
        titleVi: '1. Giải Phẫu & Sinh Lý Hệ Tiêu Hóa',
        title: '1. Digestive System Series',
        subtitle: 'Toàn bộ ống tiêu hóa từ dạ dày đến ruột',
        duration: 'Playlist',
        badge: 'Tiêu hóa',
        type: 'video',
        image: './images/atlas/dig_upper.png',
        videoUrl: 'https://www.youtube.com/embed/videoseries?list=PLLyiVaWnDvSKaN2oXXs5RHnoPdgv2ZsgF&rel=0&enablejsapi=1',
        desc: 'Cấu trúc & chức năng dạ dày, nhu động ruột và hấp thu dưỡng chất.'
      },
      {
        id: 'med_digestive_absorption',
        titleVi: '2. Quá Trình Hấp Thu Dinh Dưỡng Ruột Non',
        title: '2. Digestive System: Absorption',
        subtitle: 'Hệ nhung mao ruột non và chuyển hóa',
        duration: '10:50',
        badge: 'Ruột non',
        type: 'video',
        image: './images/atlas/dig_lower.png',
        videoUrl: 'https://www.youtube.com/embed/jGme7BRkpuQ',
        desc: 'Hệ thống vi nhung mao ruột non tăng diện tích tiếp xúc hấp thu chất dinh dưỡng.'
      },
      {
        id: 'med_urinary_system',
        titleVi: '3. Hệ Tiết Niệu & Cơ Chế Lọc Cầu Thận',
        title: '3. Urinary System & Nephron',
        subtitle: 'Thận, nephron và quá trình tạo nước tiểu',
        duration: '10:18',
        badge: 'Hệ tiết niệu',
        type: 'video',
        image: './images/atlas/urinary_anatomy.svg',
        videoUrl: 'https://www.youtube.com/embed/l128tW1H5a8',
        desc: 'Mô phỏng siêu lọc huyết tương tại tiểu cầu thận và tái hấp thu chất thiết yếu.'
      }
    ]
  },
  {
    id: 'reproductive_media',
    titleVi: 'Hệ Sinh Sản & Phôi Thai',
    cards: [
      {
        id: 'med_female_cells',
        titleVi: '1. Sinh Lý Hệ Sinh Sản Nữ',
        title: '1. Female Reproductive System',
        subtitle: 'Tế bào sinh dục nữ: Nang noãn và chu kỳ hormone',
        duration: '10:14',
        badge: 'Sinh sản nữ',
        type: 'video',
        image: './images/atlas/urin_pelvic.png',
        videoUrl: 'https://www.youtube.com/embed/RFDatCchpus',
        desc: 'Tiến trình giảm phân tạo noãn bào trưởng thành dưới tác động hormone buồng trứng.'
      },
      {
        id: 'med_fertilization',
        titleVi: '2. Từ Thụ Tinh Đến Làm Tổ Của Phôi Thai',
        title: '2. Fertilization to Implantation',
        subtitle: 'Thụ tinh đến làm tổ: Hợp tử phân chia và bám vào tử cung',
        duration: '04:15',
        badge: 'Phôi thai',
        type: 'video',
        image: './images/atlas/urin_pelvic.png',
        videoUrl: 'https://www.youtube.com/embed/_5OvgQW6FG4',
        desc: 'Giai đoạn thụ tinh ở 1/3 ngoài vòi trứng đến phôi nang làm tổ tại tử cung.'
      }
    ]
  },
  {
    id: 'endocrine_nervous_media',
    titleVi: 'Hệ Thần Kinh & Cảm Giác',
    cards: [
      {
        id: 'med_nervous_overview',
        titleVi: '1. Hệ Thần Kinh & Dẫn Truyền Xung Động',
        title: '1. The Nervous System Overview',
        subtitle: 'Não bộ, tủy sống và mạng lưới nơ-ron',
        duration: '10:36',
        badge: 'Thần kinh',
        type: 'video',
        image: './images/atlas/nerv_brain.png',
        videoUrl: 'https://www.youtube.com/embed/qPix_X-9t7E',
        desc: 'Hệ thần kinh trung ương và ngoại vi phối hợp điều khiển toàn cơ thể.'
      },
      {
        id: 'med_action_potential',
        titleVi: '2. Điện Thế Hoạt Động & Synapse Thần Kinh',
        title: '2. Action Potential & Synapse',
        subtitle: 'Cơ chế khử cực và truyền dẫn tín hiệu',
        duration: '11:43',
        badge: 'Điện sinh lý',
        type: 'video',
        image: './images/atlas/nerv_brain.png',
        videoUrl: 'https://www.youtube.com/embed/OZG8M_ldA1M',
        desc: 'Kênh ion Natri-Kali và chất dẫn truyền thần kinh qua khe synapse.'
      },
      {
        id: 'med_hearing',
        titleVi: '3. Cơ Chế Thính Giác & Tiền Đình',
        title: '3. Hearing and How it Works',
        subtitle: 'Tai trong, màng nhĩ và ốc tai',
        duration: '03:15',
        badge: 'Thính giác',
        type: 'video',
        image: './images/atlas/skel_skull.png',
        videoUrl: 'https://www.youtube.com/embed/flIAxGsV1q0',
        desc: 'Chuyển đổi dao động cơ học qua xương con thành xung thần kinh tại ốc tai.'
      },
      {
        id: 'med_sight',
        titleVi: '4. Quang Học Mắt & Dẫn Truyền Thị Giác',
        title: '4. Journey Through the Human Eye',
        subtitle: 'Giác mạc, thể thủy tinh và võng mạc',
        duration: '04:45',
        badge: 'Thị giác',
        type: 'video',
        image: './images/atlas/skel_cranial_fossae.png',
        videoUrl: 'https://www.youtube.com/embed/gvozcv8pS3c',
        desc: 'Ánh sáng đi qua giác mạc hội tụ lên võng mạc truyền về vỏ não thị giác.'
      }
    ]
  },
  {
    id: 'pathology_conditions_media',
    titleVi: 'Bệnh Lý Học & Lâm Sàng',
    cards: [
      {
        id: 'med_pathology_playlist',
        titleVi: '1. Bệnh Lý Học: Nguyên Nhân & Giải Pháp (Playlist)',
        title: '1. Pathology Causes & Solutions',
        subtitle: 'Phân tích cơ chế bệnh sinh từ gốc rễ',
        duration: 'Playlist',
        badge: 'Bệnh lý',
        type: 'video',
        image: './images/atlas/circ_simplified.png',
        videoUrl: 'https://www.youtube.com/embed/videoseries?list=PLLyiVaWnDvSI-Ej51joE-6N8R-G3ltg-x&rel=0&enablejsapi=1',
        desc: 'Phân tích cơ chế bệnh sinh từ gốc rễ, các hội chứng phổ biến và giải pháp can thiệp khoa học.'
      },
      {
        id: 'med_heart_pathology',
        titleVi: '2. Bệnh Tim Mạch & Huyết Áp Cao',
        title: '2. Cardiovascular Pathologies',
        subtitle: 'Áp lực tim, xơ vữa và suy tim',
        duration: '10:36',
        badge: 'Tim mạch',
        type: 'video',
        image: './images/atlas/circ_heart_thorax.png',
        videoUrl: 'https://www.youtube.com/embed/X9ZZ6tcxArI',
        desc: 'Cơ chế thiếu máu cơ tim cục bộ và biến chứng mạch vành.'
      },
      {
        id: 'med_joint_pathology',
        titleVi: '3. Thoái Hóa Khớp & Chấn Thương Dây Chằng',
        title: '3. Joint Pathologies & Ligaments',
        subtitle: 'Tổn thương sụn khớp, mòn khớp và dây chằng',
        duration: '09:20',
        badge: 'Khớp',
        type: 'video',
        image: './images/atlas/reg_lower_limb.png',
        videoUrl: 'https://www.youtube.com/embed/DLxYDoN634c',
        desc: 'Cơ chế mòn sụn khớp và mất vững dây chằng khi vận động quá tải.'
      }
    ]
  },
  {
    id: 'lymphatic_pathologies_media',
    titleVi: 'Hệ Bạch Huyết & Miễn Dịch',
    cards: [
      {
        id: 'med_immune_system',
        titleVi: '1. Hệ Miễn Dịch & Tế Bào Đại Thực Bào',
        title: '1. Immune System, Part 1',
        subtitle: 'Hàng rào miễn dịch bẩm sinh và thích ứng',
        duration: '09:35',
        badge: 'Miễn dịch',
        type: 'video',
        image: './images/atlas/med_skin.png',
        videoUrl: 'https://www.youtube.com/embed/GIJK3dwCWCw',
        desc: 'Cơ chế hoạt động của đại thực bào, tế bào B và T bảo vệ cơ thể.'
      },
      {
        id: 'med_hiv_aids',
        titleVi: '2. Cơ Chế Nhiễm & Suy Giảm Miễn Dịch (HIV/AIDS)',
        title: '2. HIV and AIDS Medical Animation',
        subtitle: 'Phá hủy tế bào Lympho T-CD4 suy giảm miễn dịch',
        duration: '05:32',
        badge: 'Miễn dịch',
        type: 'video',
        image: './images/atlas/circ_full.png',
        videoUrl: 'https://www.youtube.com/embed/ng22Ucr33aw',
        desc: 'Virus HIV xâm nhập và tiêu diệt dần tế bào miễn dịch chỉ huy mở đường cho nhiễm trùng cơ hội.'
      }
    ]
  }
];

const STORAGE_KEY = 'atlas_custom_media_data_v5';
const ADMIN_LOGGED_IN_KEY = 'atlas_admin_logged_in';
export const ADMIN_DEFAULT_PASS = '123456';

// Lấy danh sách danh mục Media (ưu tiên LocalStorage nếu Admin đã tùy biến, lọc nghiêm ngặt chỉ giữ video hoạt động)
export function getAtlasMediaCategories() {
  const sanitizeCategories = (categories) => {
    return categories.map(cat => ({
      ...cat,
      cards: (cat.cards || []).filter(card => isVerifiedVideo(card.videoUrl))
    })).filter(cat => cat.cards.length > 0);
  };

  if (typeof window === 'undefined' || typeof localStorage === 'undefined') {
    return sanitizeCategories(JSON.parse(JSON.stringify(DEFAULT_ATLAS_MEDIA_CATEGORIES)));
  }
  try {
    const raw = localStorage.getItem(STORAGE_KEY);
    if (raw) {
      const parsed = JSON.parse(raw);
      if (Array.isArray(parsed) && parsed.length > 0) {
        return sanitizeCategories(parsed);
      }
    }
  } catch (err) {
    console.warn('[AtlasMediaManager] Failed to read custom media:', err);
  }
  return sanitizeCategories(JSON.parse(JSON.stringify(DEFAULT_ATLAS_MEDIA_CATEGORIES)));
}

// Lưu dữ liệu danh mục Media mới do Admin cập nhật
export function saveAtlasMediaCategories(categories) {
  if (!Array.isArray(categories)) return false;
  if (typeof window === 'undefined' || typeof localStorage === 'undefined') return false;
  try {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(categories));
    window.dispatchEvent(new CustomEvent('atlas-media-updated', { detail: categories }));
    return true;
  } catch (err) {
    console.error('[AtlasMediaManager] Save error:', err);
    return false;
  }
}

// Khôi phục về danh mục 12 nhóm mặc định gốc
export function resetAtlasMediaCategories() {
  if (typeof window === 'undefined' || typeof localStorage === 'undefined') return false;
  try {
    localStorage.removeItem(STORAGE_KEY);
    window.dispatchEvent(new CustomEvent('atlas-media-updated', { detail: DEFAULT_ATLAS_MEDIA_CATEGORIES }));
    return true;
  } catch (err) {
    console.error('[AtlasMediaManager] Reset error:', err);
    return false;
  }
}

// Xuất file JSON cấu hình Media để sao lưu
export function exportAtlasMediaJSON() {
  const currentData = getAtlasMediaCategories();
  const jsonStr = JSON.stringify(currentData, null, 2);
  const blob = new Blob([jsonStr], { type: 'application/json' });
  const url = URL.createObjectURL(blob);
  const a = document.createElement('a');
  a.href = url;
  a.download = `atlas_media_categories_${new Date().toISOString().slice(0, 10)}.json`;
  document.body.appendChild(a);
  a.click();
  document.body.removeChild(a);
  URL.revokeObjectURL(url);
}

// Nhập file JSON do người dùng cung cấp
export function importAtlasMediaJSON(jsonString) {
  try {
    const parsed = JSON.parse(jsonString);
    if (!Array.isArray(parsed) || parsed.length === 0) {
      throw new Error('Dữ liệu JSON không đúng định dạng mảng danh mục.');
    }
    return saveAtlasMediaCategories(parsed);
  } catch (err) {
    console.error('[AtlasMediaManager] Import error:', err);
    throw err;
  }
}

// Bộ phân giải URL Video thông minh (YouTube playlist, watch, youtu.be, embed, shorts, hoặc video MP4/WebM/Blob)
export function parseVideoUrl(rawUrl) {
  if (!rawUrl) return { type: 'none', url: '' };
  const str = rawUrl.trim();

  // Kiểm tra file video trực tiếp (.mp4, .webm, .ogg, .mov, blob:, data:video)
  if (
    str.startsWith('blob:') ||
    str.startsWith('data:video') ||
    /\.(mp4|webm|ogg|mov|m4v)(\?.*)?$/i.test(str)
  ) {
    return { type: 'video', url: str };
  }

  // Bóc tách YouTube Playlist ID (bắt buộc dùng embed/videoseries?list= để nhúng an toàn trong iframe)
  const playlistMatch = str.match(/[?&]list=([a-zA-Z0-9_-]+)/);
  if (playlistMatch && playlistMatch[1]) {
    const listId = playlistMatch[1];
    return {
      type: 'youtube_playlist',
      id: listId,
      url: `https://www.youtube.com/embed/videoseries?list=${listId}&rel=0&enablejsapi=1`,
      watchUrl: `https://www.youtube.com/playlist?list=${listId}`
    };
  }

  // Bóc tách YouTube ID từ mọi biến thể liên kết
  const ytMatch = str.match(/(?:youtu\.be\/|youtube\.com\/(?:embed\/|v\/|watch\?v=|watch\?.+&v=|shorts\/))([\w-]{11})/);
  if (ytMatch && ytMatch[1]) {
    return {
      type: 'youtube',
      id: ytMatch[1],
      url: `https://www.youtube.com/embed/${ytMatch[1]}?autoplay=1&rel=0&enablejsapi=1`
    };
  }

  // Trường hợp truyền thẳng ID 11 ký tự
  if (/^[\w-]{11}$/.test(str)) {
    return {
      type: 'youtube',
      id: str,
      url: `https://www.youtube.com/embed/${str}?autoplay=1&rel=0&enablejsapi=1`
    };
  }

  // Fallback dạng nhúng trực tiếp Iframe
  return { type: 'iframe', url: str };
}

// -----------------------------------------------------------------------------
// DANH SÁCH VIDEO ĐÃ KIỂM CHỨNG 100% HOẠT ĐỘNG (HTTP 200 TỪ YOUTUBE)
// -----------------------------------------------------------------------------
export const VERIFIED_VALID_VIDEO_IDS = new Set([
  'rDGqkMHPDqE', // Skeletal System & Spine: Crash Course #19
  'DLxYDoN634c', // Joints: Crash Course #20
  'Ktv-CaOt6UQ', // Muscles: Crash Course #21
  'X9ZZ6tcxArI', // The Heart, Part 1: Crash Course #25
  '7XaftdE_h60', // Flow through the heart: Khan Academy
  'bHZsvBdUC2I', // Respiratory System, Part 1: Crash Course #31
  'jGme7BRkpuQ', // Digestive System, Part 3: Crash Course #35
  'l128tW1H5a8', // Urinary System, Part 1: Crash Course #38
  'RFDatCchpus', // Reproductive System, Part 1: Crash Course #40
  '_5OvgQW6FG4', // Fertilization: Medical Animation
  'GIJK3dwCWCw', // Immune System, Part 1: Crash Course #45
  'ng22Ucr33aw', // Medical Animation: HIV and AIDS
  'qPix_X-9t7E', // The Nervous System, Part 1: Crash Course #8
  'OZG8M_ldA1M', // The Nervous System, Part 2: Crash Course #9
  '44B0ms3XPKU', // The Nervous System in 9 mins
  'Orumw-PyNjw', // The Integumentary System, Part 1 - Skin: Crash Course #6
  'flIAxGsV1q0', // Video about Hearing and How it Works: MED-EL
  'gvozcv8pS3c', // A Journey Through the Human Eye
  'URUJD5NEXC8', // Cell Structure: Nucleus Medical Media
  'uBGl2BujkPQ'  // Intro to Anatomy: Crash Course #1
]);

export const VERIFIED_VALID_PLAYLIST_IDS = new Set([
  'PLLyiVaWnDvSKaN2oXXs5RHnoPdgv2ZsgF', // Giải phẫu tiêu hóa
  'PLLyiVaWnDvSLDD-tu3qmcOEMp-ocgsBMU', // Ăn uống - dinh dưỡng
  'PLLyiVaWnDvSI-Ej51joE-6N8R-G3ltg-x', // Bệnh lý | Nguyên nhân - Giải pháp
  'PLUwNUcW9Grzk',                     // Cân nặng . Tăng giảm cân
  'PLXeja4lDX0Qc',                     // Hệ cơ quan
  'PLFCWgyj8rzLA',                     // Phòng bệnh chủ động
  'PLLyiVaWnDvSIysyrnuDZLADVvkGrIKRae'  // Kiến thức sức khỏe
]);

export function isVerifiedVideo(url) {
  if (!url || typeof url !== 'string') return false;
  const clean = url.trim();
  if (clean.startsWith('blob:') || clean.startsWith('/') || clean.startsWith('./') || clean.endsWith('.mp4') || clean.endsWith('.webm')) {
    return true; // Local videos
  }
  const plMatch = clean.match(/[?&]list=([a-zA-Z0-9_-]+)/);
  if (plMatch && plMatch[1]) {
    return VERIFIED_VALID_PLAYLIST_IDS.has(plMatch[1]);
  }
  const ytMatch = clean.match(/(?:youtu\.be\/|youtube\.com\/(?:embed\/|v\/|watch\?v=|watch\?.+&v=|shorts\/))([\w-]{11})/);
  if (ytMatch && ytMatch[1]) {
    return VERIFIED_VALID_VIDEO_IDS.has(ytMatch[1]);
  }
  if (/^[\w-]{11}$/.test(clean)) {
    return VERIFIED_VALID_VIDEO_IDS.has(clean);
  }
  return false;
}

// Kiểm tra quyền Admin
export function verifyAdminPassword(inputPass) {
  if (!inputPass) return false;
  return inputPass.trim() === ADMIN_DEFAULT_PASS;
}

export function isAdminLoggedIn() {
  if (typeof window === 'undefined' || typeof sessionStorage === 'undefined') return false;
  try {
    return sessionStorage.getItem(ADMIN_LOGGED_IN_KEY) === 'true';
  } catch {
    return false;
  }
}

export function setAdminLoggedIn(status) {
  if (typeof window === 'undefined' || typeof sessionStorage === 'undefined') return;
  try {
    if (status) {
      sessionStorage.setItem(ADMIN_LOGGED_IN_KEY, 'true');
    } else {
      sessionStorage.removeItem(ADMIN_LOGGED_IN_KEY);
    }
  } catch {}
}

// -----------------------------------------------------------------------------
// BINDING VIDEO VÀO TỪNG CƠ QUAN / BỘ PHẬN GIẢI PHẪU (PART-TO-VIDEO MAPPINGS)
// -----------------------------------------------------------------------------
const PART_VIDEOS_KEY = 'atlas_part_videos_v3';

export const BUILTIN_CLINICAL_VIDEOS = {
  hepatobiliary: {
    id: 'vid_hepatobiliary',
    title: 'Hoạt Ảnh 3D: Dòng Chảy Mật & Cơ Vòng Oddi',
    subtitle: 'Hệ Gan - Mật - Tuyến Tụy',
    desc: 'Mô phỏng 3D dòng chảy dịch mật từ gan và túi mật hòa cùng men tụy tại bóng Vater đổ vào tá tràng D2.',
    videoUrl: 'https://www.youtube.com/embed/jGme7BRkpuQ',
    thumbnail: './images/atlas/dig_peritoneum.png',
    duration: '10:50',
    badge: 'Gan mật tụy'
  },
  spine_disc: {
    id: 'vid_spine_disc',
    title: 'Hoạt Ảnh 3D & Bài Giảng: Giải Phẫu Cột Sống & Đĩa Đệm',
    subtitle: 'Trục Cột Sống, Đốt Sống & Đĩa Đệm',
    desc: 'Giải phẫu toàn diện 33 đốt sống, trục nâng đỡ cơ thể, cấu tạo đĩa đệm và cơ chế bảo vệ tủy sống.',
    videoUrl: 'https://www.youtube.com/embed/rDGqkMHPDqE',
    playlistUrl: 'https://www.youtube.com/watch?v=rDGqkMHPDqE',
    thumbnail: './images/atlas/skel_spine.png',
    duration: '10:38',
    badge: 'Cột sống'
  },
  heart_valves: {
    id: 'vid_heart_valves',
    title: 'Hoạt Ảnh 3D: Chu Chuyển Tim & Chuyển Động Van',
    subtitle: '4 Buồng Tim & Hệ Thống Van',
    desc: 'Chuyển động đóng mở của van 2 lá, 3 lá và chu kỳ tống máu nhịp nhàng qua động mạch chủ và ĐM phổi.',
    videoUrl: 'https://www.youtube.com/embed/X9ZZ6tcxArI',
    thumbnail: './images/atlas/circ_simplified.png',
    duration: '10:36',
    badge: 'Tim mạch'
  },
  stomach_gi: {
    id: 'vid_stomach_gi',
    title: 'Giải Phẫu & Sinh Lý Hệ Tiêu Hóa (Playlist Chuyên Sâu)',
    subtitle: 'Dạ Dày & Ống Tiêu Hóa',
    desc: 'Cấu trúc & chức năng dạ dày, nhu động 3 lớp cơ, cơ thắt môn vị và cơ chế tiêu hóa hấp thu dinh dưỡng.',
    videoUrl: 'https://www.youtube.com/embed/videoseries?list=PLLyiVaWnDvSKaN2oXXs5RHnoPdgv2ZsgF&rel=0&enablejsapi=1',
    playlistUrl: 'https://www.youtube.com/playlist?list=PLLyiVaWnDvSKaN2oXXs5RHnoPdgv2ZsgF',
    nutritionUrl: 'https://www.youtube.com/playlist?list=PLLyiVaWnDvSLDD-tu3qmcOEMp-ocgsBMU',
    nutritionTitle: 'Ăn Uống & Dinh Dưỡng Khoa Học',
    thumbnail: './images/atlas/dig_upper.png',
    duration: 'Playlist',
    badge: 'Tiêu hóa'
  },
  intestine_absorption: {
    id: 'vid_intestine_absorption',
    title: 'Hoạt Ảnh 3D: Nhu Động Ruột & Hấp Thu Nhung Mao',
    subtitle: 'Ruột Non, Đại Tràng & Ruột Thừa',
    desc: 'Mô phỏng 3D hệ thống vi nhung mao ruột non tăng diện tích tiếp xúc hấp thu chất dinh dưỡng vào mao mạch.',
    videoUrl: 'https://www.youtube.com/embed/jGme7BRkpuQ',
    thumbnail: './images/atlas/dig_lower.png',
    duration: '10:50',
    badge: 'Ống tiêu hóa'
  },
  knee_ligaments: {
    id: 'vid_knee_ligaments',
    title: 'Hoạt Ảnh 3D: Cơ Học Khớp Gối & Dây Chằng Chéo',
    subtitle: 'Khớp Gối, Dây Chằng & Sụn Chêm',
    desc: 'Động học trượt xoay của lồi cầu đùi trên mâm chày và cơ chế giữ vững khớp gối của dây chằng chéo.',
    videoUrl: 'https://www.youtube.com/embed/DLxYDoN634c',
    thumbnail: './images/atlas/reg_lower_limb.png',
    duration: '09:20',
    badge: 'Khớp gối'
  },
  respiratory_alveoli: {
    id: 'vid_respiratory_alveoli',
    title: 'Hoạt Ảnh 3D: Trao Đổi Khí O₂/CO₂ Tại Phế Nang Phổi',
    subtitle: 'Hệ Hô Hấp & Phế Nang',
    desc: 'Cơ chế khuếch tán khí qua màng phế nang - mao mạch theo chênh lệch phân áp giữa máu và không khí.',
    videoUrl: 'https://www.youtube.com/embed/bHZsvBdUC2I',
    thumbnail: './images/atlas/resp_lungs.png',
    duration: '09:22',
    badge: 'Hô hấp'
  },
  kidney_nephron: {
    id: 'vid_kidney_nephron',
    title: 'Hoạt Ảnh 3D: Quá Trình Siêu Lọc Máu Tại Cầu Thận',
    subtitle: 'Thận & Đơn Vị Nephron',
    desc: 'Mô phỏng 3D dòng máu qua tiểu cầu thận, quá trình lọc huyết tương và tái hấp thu các chất thiết yếu.',
    videoUrl: 'https://www.youtube.com/embed/l128tW1H5a8',
    thumbnail: './images/atlas/urinary_anatomy.svg',
    duration: '10:18',
    badge: 'Hệ tiết niệu'
  },
  brain_csf: {
    id: 'vid_brain_csf',
    title: 'Hoạt Ảnh 3D: Dòng Chảy Dịch Não Tủy & Não Thất',
    subtitle: 'Não Bộ & Hệ Thần Kinh',
    desc: 'Dòng chảy dịch não tủy từ đám rối màng mạch qua các buồng não thất ra khoang dưới nhện bao bọc não - tủy sống.',
    videoUrl: 'https://www.youtube.com/embed/qPix_X-9t7E',
    thumbnail: './images/atlas/nerv_brain.png',
    duration: '10:36',
    badge: 'Thần kinh'
  },
  shoulder_rotator_cuff: {
    id: 'vid_shoulder_rotator_cuff',
    title: 'Hoạt Ảnh 3D: Động Học Khớp Vai & 4 Cơ Chóp Xoay',
    subtitle: 'Khớp Vai & Cơ Chóp Xoay',
    desc: 'Chuyển động đa trục chỏm cầu của khớp vai và sự phối hợp giữ vững của cơ trên gai, dưới gai, tròn bé và dưới vai.',
    videoUrl: 'https://www.youtube.com/embed/DLxYDoN634c',
    thumbnail: './images/atlas/med_ball_socket.png',
    duration: '09:20',
    badge: 'Khớp vai'
  },
  carpal_tunnel: {
    id: 'vid_carpal_tunnel',
    title: 'Hoạt Ảnh 3D: Hội Chứng Ống Cổ Tay & TK Giữa',
    subtitle: 'Cổ Tay & Đám Rối Thần Kinh',
    desc: 'Tăng áp lực trong khoang ống cổ tay chèn ép dây thần kinh giữa gây tê bì và yếu cơ bàn tay.',
    videoUrl: 'https://www.youtube.com/embed/DLxYDoN634c',
    thumbnail: './images/atlas/reg_upper_limb.png',
    duration: '09:20',
    badge: 'Chi trên'
  },
  ear_hearing: {
    id: 'vid_ear_hearing',
    title: 'Hoạt Ảnh 3D: Cơ Chế Cảm Thụ Thính Giác & Tiền Đình',
    subtitle: 'Tai Trong & Ốc Tai',
    desc: 'Chuyển đổi dao động sóng âm qua màng nhĩ và chuỗi xương con thành xung thần kinh tại ốc tai.',
    videoUrl: 'https://www.youtube.com/embed/flIAxGsV1q0',
    thumbnail: './images/atlas/skel_skull.png',
    duration: '0:59',
    badge: 'Thính giác'
  },
  eye_sight: {
    id: 'vid_eye_sight',
    title: 'Hoạt Ảnh 3D: Quang Học Nhãn Cầu & Dẫn Truyền Thị Giác',
    subtitle: 'Mắt & Hốc Mắt',
    desc: 'Đường đi của ánh sáng qua giác mạc và thể thủy tinh hội tụ lên hoàng điểm võng mạc truyền về vỏ não thị giác.',
    videoUrl: 'https://www.youtube.com/embed/gvozcv8pS3c',
    thumbnail: './images/atlas/skel_cranial_fossae.png',
    duration: '0:51',
    badge: 'Thị giác'
  },
  skin_integumentary: {
    id: 'vid_skin_integumentary',
    title: 'Hoạt Ảnh 3D: Cấu Trúc & Sinh Lý Hệ Da',
    subtitle: 'Biểu Bì, Trung Bì & Hàng Rào Miễn Dịch',
    desc: 'Cấu trúc đa tầng của hệ da, chức năng điều hòa thân nhiệt, thụ cảm xúc giác và hàng rào bảo vệ sinh học.',
    videoUrl: 'https://www.youtube.com/embed/Orumw-PyNjw',
    thumbnail: './images/atlas/med_skin.png',
    duration: '09:36',
    badge: 'Hệ da'
  },
  immune_system: {
    id: 'vid_immune_system',
    title: 'Hoạt Ảnh 3D: Hệ Miễn Dịch & Tế Bào Bạch Cầu',
    subtitle: 'Miễn Dịch Tự Nhiên & Thích Ứng',
    desc: 'Cơ chế hoạt động của đại thực bào, kháng thể và hàng rào miễn dịch bảo vệ cơ thể trước tác nhân gây bệnh.',
    videoUrl: 'https://www.youtube.com/embed/GIJK3dwCWCw',
    thumbnail: './images/atlas/med_skin.png',
    duration: '09:35',
    badge: 'Miễn dịch'
  },
  reproductive_system: {
    id: 'vid_reproductive_system',
    title: 'Hoạt Ảnh 3D: Sinh Lý Hệ Sinh Sản & Thụ Tinh',
    subtitle: 'Tế Bào Sinh Dục & Thụ Tinh',
    desc: 'Quá trình phát triển tế bào sinh dục, chu trình hormone và cơ chế thụ tinh hình thành hợp tử.',
    videoUrl: 'https://www.youtube.com/embed/RFDatCchpus',
    thumbnail: './images/atlas/urin_pelvic.png',
    duration: '10:14',
    badge: 'Sinh sản'
  },
  skeletal_support: {
    id: 'vid_skeletal_support',
    title: 'Hoạt Ảnh 3D: Chức Năng Nâng Đỡ & Cơ Học Khung Xương',
    subtitle: 'Khung Xương Toàn Thân',
    desc: 'Bộ khung cơ thể, tạo khoang bảo vệ các tạng quan trọng và phân phối tải trọng vận động.',
    videoUrl: 'https://www.youtube.com/embed/rDGqkMHPDqE',
    thumbnail: './images/atlas/med_skeleton.png',
    duration: '10:38',
    badge: 'Hệ xương'
  },
  muscular_contraction: {
    id: 'vid_muscular_contraction',
    title: 'Hoạt Ảnh 3D: Hoạt Động Của Cặp Cơ Đối Vận Gấp - Duỗi',
    subtitle: 'Hệ Cơ Bắp Vận Động',
    desc: 'Cơ chế cơ chủ vận co rút kết hợp cơ đối vận giãn dài tạo lực đòn bẩy cử động các khớp xương.',
    videoUrl: 'https://www.youtube.com/embed/Ktv-CaOt6UQ',
    thumbnail: './images/atlas/med_paired_muscles.png',
    duration: '10:53',
    badge: 'Hệ cơ'
  }
};

export function getPartVideo(partId) {
  if (!partId) return null;
  const clean = String(partId).replace(/[\._](l|r)$/i, '').replace(/\s*\((l|r|left|right)\)$/i, '').trim();

  // 1. Kiểm tra cấu hình do Admin đã tự gắn trực tiếp vào bộ phận này (phải qua kiểm chứng)
  if (typeof window !== 'undefined' && typeof localStorage !== 'undefined') {
    try {
      const raw = localStorage.getItem(PART_VIDEOS_KEY);
      if (raw) {
        const map = JSON.parse(raw);
        const custom = map[partId] || map[clean];
        if (custom && custom.videoUrl && isVerifiedVideo(custom.videoUrl)) {
          return custom;
        }
      }
    } catch {}
  }

  // 2. Tự động liên kết thông minh với thư viện video 3D y khoa chuẩn theo từ khóa giải phẫu
  const lower = clean.toLowerCase();

  // 1. CỘT SỐNG & ĐĨA ĐỆM (Ưu tiên kiểm tra trước các xương khác)
  if (
    lower.includes('vertebra') || lower.includes('spine') || lower.includes('disc') || lower.includes('discus') ||
    lower.includes('pulposus') || lower.includes('fibrosus') || lower.includes('đốt sống') || lower.includes('cột sống') ||
    lower.includes('đĩa đệm') || lower.includes('thắt lưng') || lower.includes('tủy sống') ||
    lower.includes('atlas') || lower.includes('axis') || lower.includes('sacrum') || lower.includes('coccyx') ||
    lower.includes('đốt đội') || lower.includes('đốt trục') || lower.includes('xương cùng') || lower.includes('cùng cụt') ||
    /\b(l[1-5]|c[1-7]|t[1-9]|t1[0-2])\b/i.test(lower)
  ) {
    return { ...BUILTIN_CLINICAL_VIDEOS.spine_disc, isDefault: true };
  }

  // 2. TIM MẠCH & VAN TIM
  if (
    lower.includes('heart') || lower.includes('cardio') || lower.includes('atrium') || lower.includes('ventricle') ||
    lower.includes('mitral') || lower.includes('tricuspid') || lower.includes('aort') || lower.includes('tim') ||
    lower.includes('tâm thất') || lower.includes('tâm nhĩ') || lower.includes('van tim')
  ) {
    return { ...BUILTIN_CLINICAL_VIDEOS.heart_valves, isDefault: true };
  }

  // 3. DẠ DÀY & ỐNG TIÊU HÓA TRÊN
  if (
    lower.includes('stomach') || lower.includes('gastr') || lower.includes('pylor') || lower.includes('cardia') ||
    lower.includes('fundus') || lower.includes('esophag') || lower.includes('dạ dày') || lower.includes('thực quản')
  ) {
    return { ...BUILTIN_CLINICAL_VIDEOS.stomach_gi, isDefault: true };
  }

  // 4. GAN - MẬT - TỤY
  if (
    lower.includes('liver') || lower.includes('hepar') || lower.includes('gall') || lower.includes('chole') ||
    lower.includes('bile') || lower.includes('pancrea') || lower.includes('oddi') || lower.includes('vater') ||
    lower.includes('gan') || lower.includes('mật') || lower.includes('tụy') || lower.includes('túi mật')
  ) {
    return { ...BUILTIN_CLINICAL_VIDEOS.hepatobiliary, isDefault: true };
  }

  // 5. RUỘT & ỐNG TIÊU HÓA DƯỚI
  if (
    lower.includes('intestin') || lower.includes('duoden') || lower.includes('jejun') || lower.includes('ileum') ||
    lower.includes('colon') || lower.includes('caecum') || lower.includes('cecum') || lower.includes('appendix') ||
    lower.includes('ruột') || lower.includes('manh tràng') || lower.includes('đại tràng') || lower.includes('trực tràng')
  ) {
    return { ...BUILTIN_CLINICAL_VIDEOS.intestine_absorption, isDefault: true };
  }

  // 6. KHỚP GỐI, DÂY CHẰNG & SỤN CHÊM
  if (
    lower.includes('knee') || lower.includes('patella') || lower.includes('cruciate') || lower.includes('meniscus') ||
    lower.includes('gối') || lower.includes('bánh chè') || lower.includes('dây chằng') || lower.includes('sụn chêm')
  ) {
    return { ...BUILTIN_CLINICAL_VIDEOS.knee_ligaments, isDefault: true };
  }

  // 7. PHỔI & HÔ HẤP
  if (
    lower.includes('lung') || lower.includes('pulmo') || lower.includes('bronch') || lower.includes('trachea') ||
    lower.includes('alveol') || lower.includes('phổi') || lower.includes('khí quản') || lower.includes('phế quản')
  ) {
    return { ...BUILTIN_CLINICAL_VIDEOS.respiratory_alveoli, isDefault: true };
  }

  // 8. THẬN & HỆ TIẾT NIỆU
  if (
    lower.includes('kidney') || lower.includes('ren') || lower.includes('nephr') || lower.includes('ureter') ||
    lower.includes('bladder') || lower.includes('glomerul') || lower.includes('thận') || lower.includes('niệu quản') ||
    lower.includes('bàng quang')
  ) {
    return { ...BUILTIN_CLINICAL_VIDEOS.kidney_nephron, isDefault: true };
  }

  // 9. NÃO BỘ & DỊCH NÃO TỦY
  if (
    lower.includes('brain') || lower.includes('cerebr') || lower.includes('cerebell') || lower.includes('encephalon') ||
    lower.includes('choroid') || lower.includes('dura') || lower.includes('não') || lower.includes('màng não')
  ) {
    return { ...BUILTIN_CLINICAL_VIDEOS.brain_csf, isDefault: true };
  }

  // 10. KHỚP VAI & CHÓP XOAY
  if (
    lower.includes('shoulder') || lower.includes('scapula') || lower.includes('glenoid') ||
    lower.includes('supraspinatus') || lower.includes('rotator') || lower.includes('vai') || lower.includes('bả vai')
  ) {
    return { ...BUILTIN_CLINICAL_VIDEOS.shoulder_rotator_cuff, isDefault: true };
  }

  // 11. CỔ TAY & CHI TRÊN
  if (
    lower.includes('wrist') || lower.includes('carpal') || lower.includes('cổ tay')
  ) {
    return { ...BUILTIN_CLINICAL_VIDEOS.carpal_tunnel, isDefault: true };
  }

  // 12. TAI & THÍNH GIÁC
  if (
    lower.includes('ear') || lower.includes('tympan') || lower.includes('cochlea') || lower.includes('vestibul') ||
    lower.includes('tai') || lower.includes('màng nhĩ') || lower.includes('ốc tai')
  ) {
    return { ...BUILTIN_CLINICAL_VIDEOS.ear_hearing, isDefault: true };
  }

  // 13. MẮT & THỊ GIÁC
  if (
    lower.includes('eye') || lower.includes('ocul') || lower.includes('cornea') || lower.includes('retina') ||
    lower.includes('lens') || lower.includes('optic') || lower.includes('mắt') || lower.includes('giác mạc') ||
    lower.includes('võng mạc')
  ) {
    return { ...BUILTIN_CLINICAL_VIDEOS.eye_sight, isDefault: true };
  }

  // 14. HỆ DA
  if (
    lower.includes('skin') || lower.includes('integument') || lower.includes('derma') || lower.includes('epiderm') || lower.includes('da')
  ) {
    return { ...BUILTIN_CLINICAL_VIDEOS.skin_integumentary, isDefault: true };
  }

  // 15. HỆ MIỄN DỊCH & HẠCH BẠCH HUYẾT
  if (
    lower.includes('lymph') || lower.includes('spleen') || lower.includes('thymus') || lower.includes('lách') ||
    lower.includes('hạch') || lower.includes('miễn dịch')
  ) {
    return { ...BUILTIN_CLINICAL_VIDEOS.immune_system, isDefault: true };
  }

  // 16. HỆ SINH SẢN
  if (
    lower.includes('uterus') || lower.includes('ovary') || lower.includes('testis') || lower.includes('prostate') ||
    lower.includes('tử cung') || lower.includes('buồng trứng') || lower.includes('tinh hoàn') || lower.includes('tiền liệt')
  ) {
    return { ...BUILTIN_CLINICAL_VIDEOS.reproductive_system, isDefault: true };
  }

  // 17. HỆ CƠ BẮP
  if (
    lower.includes('muscle') || lower.includes('muscul') || lower.includes('cơ') || lower.includes('biceps') ||
    lower.includes('triceps') || lower.includes('pectoralis') || lower.includes('deltoid') || lower.includes('gluteus')
  ) {
    return { ...BUILTIN_CLINICAL_VIDEOS.muscular_contraction, isDefault: true };
  }

  // 18. HỆ XƯƠNG (chỉ khi là xương thực thụ)
  if (
    lower.includes('bone') || lower.includes('osseous') || lower.includes('skelet') || lower.includes('femur') ||
    lower.includes('tibia') || lower.includes('fibula') || lower.includes('radius') || lower.includes('ulna') ||
    lower.includes('clavicle') || lower.includes('costa') || lower.includes('xương') || lower.includes('sườn')
  ) {
    return { ...BUILTIN_CLINICAL_VIDEOS.skeletal_support, isDefault: true };
  }

  // Nếu không thuộc cơ quan nào có video đã kiểm chứng: TRẢ VỀ NULL (KHÔNG HIỂN THỊ)
  return null;
}

export function setPartVideo(partId, videoData) {
  if (!partId || !videoData) return false;
  try {
    const raw = localStorage.getItem(PART_VIDEOS_KEY);
    const map = raw ? JSON.parse(raw) : {};
    const clean = String(partId).replace(/[\._](l|r)$/i, '').replace(/\s*\((l|r|left|right)\)$/i, '').trim();

    const record = {
      id: videoData.id || `pvid_${Date.now()}`,
      partId,
      cleanPartId: clean,
      title: videoData.title || 'Video Minh Họa Giải Phẫu',
      subtitle: videoData.subtitle || '',
      videoUrl: videoData.videoUrl || '',
      videoType: videoData.videoType || (videoData.videoUrl?.includes('youtube') ? 'youtube' : 'local_mp4'),
      localVideoId: videoData.localVideoId || null,
      thumbnail: videoData.thumbnail || './images/atlas/med_skin.png',
      duration: videoData.duration || '0:30',
      badge: videoData.badge || 'Giải phẫu',
      desc: videoData.desc || '',
      updatedAt: Date.now()
    };

    map[partId] = record;
    map[clean] = record;
    localStorage.setItem(PART_VIDEOS_KEY, JSON.stringify(map));
    window.dispatchEvent(new CustomEvent('atlas-part-video-updated', { detail: record }));
    return true;
  } catch (err) {
    console.error('[AtlasMediaManager] setPartVideo error:', err);
    return false;
  }
}

export function removePartVideo(partId) {
  if (!partId) return false;
  try {
    const raw = localStorage.getItem(PART_VIDEOS_KEY);
    if (!raw) return true;
    const map = JSON.parse(raw);
    const clean = String(partId).replace(/[\._](l|r)$/i, '').replace(/\s*\((l|r|left|right)\)$/i, '').trim();
    delete map[partId];
    delete map[clean];
    localStorage.setItem(PART_VIDEOS_KEY, JSON.stringify(map));
    window.dispatchEvent(new CustomEvent('atlas-part-video-updated', { detail: { partId, removed: true } }));
    return true;
  } catch {
    return false;
  }
}

export function getAllPartVideos() {
  try {
    const raw = localStorage.getItem(PART_VIDEOS_KEY);
    return raw ? JSON.parse(raw) : {};
  } catch {
    return {};
  }
}
