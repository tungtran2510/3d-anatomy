// Atlas Media Manager & Data Store
// Đồng bộ 12 danh mục Hoạt ảnh & Video Y khoa (Atlas 2027)
// Hỗ trợ Quản trị viên tùy biến link video, tiêu đề, thời lượng và lưu vào LocalStorage

export const DEFAULT_ATLAS_MEDIA_CATEGORIES = [
  {
    id: 'system_overviews_media',
    titleVi: 'Tổng Quan Các Hệ Cơ Quan',
    cards: [
      {
        id: 'med_skin',
        titleVi: '1. Cấu Trúc & Chức Năng Của Hệ Da',
        title: '1. Function of the Skin',
        subtitle: 'Chức năng của da: Bảo vệ, điều hòa thân nhiệt và xúc giác',
        duration: '0:56',
        badge: 'Tổng quan',
        type: 'video',
        image: './images/atlas/med_skin.png',
        videoUrl: 'https://www.youtube.com/embed/aMGgCxUXV3o',
        desc: 'Hàng rào bảo vệ sinh học, thụ cảm thần kinh và điều hòa thân nhiệt.'
      },
      {
        id: 'med_skeleton',
        titleVi: '2. Chức Năng Nâng Đỡ Của Hệ Xương',
        title: '2. Function of the Skeleton',
        subtitle: 'Chức năng hệ xương: Khung nâng đỡ, bảo vệ tạng và sinh máu',
        duration: '0:46',
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
        duration: '0:43',
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
        duration: '1:04',
        badge: 'Cơ xương',
        type: 'video',
        image: './images/atlas/med_paired_muscles.png',
        videoUrl: 'https://www.youtube.com/embed/7rA8k_FvT_U',
        motionType: 'elbow_flexion',
        desc: 'Cơ chế cơ nhị đầu co gấp khuỷu đối kháng cơ tam đầu duỗi khuỷu.'
      },
      {
        id: 'med_ball_socket',
        titleVi: '2. Khớp Hoạt Dịch Dạng Cầu (Khớp Vai & Háng)',
        title: '2. Joint: Ball and Socket',
        subtitle: 'Khớp chỏm cầu: Vận động đa trục xoay tròn 360 độ',
        duration: '0:07',
        badge: 'Khớp 3D',
        type: 'video',
        image: './images/atlas/med_ball_socket.png',
        videoUrl: 'https://www.youtube.com/embed/n4K_bKx6VzI',
        motionType: 'hip_abduction',
        desc: 'Khớp cử động linh hoạt nhất cơ thể với 3 bậc tự do và chuyển động đa trục.'
      },
      {
        id: 'med_condyloid',
        titleVi: '3. Khớp Hoạt Dịch Dạng Lồi Cầu (Khớp Gối)',
        title: '3. Joint: Condyloid',
        subtitle: 'Khớp lồi cầu: Chuyển động gập duỗi bản lề của khớp',
        duration: '0:07',
        badge: 'Khớp 3D',
        type: 'video',
        image: './images/atlas/med_condyloid.png',
        videoUrl: 'https://www.youtube.com/embed/WJ6V3n4P4sY',
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
        duration: '0:48',
        badge: 'Tế bào học',
        type: 'video',
        image: './images/atlas/med_skin.png',
        videoUrl: 'https://www.youtube.com/embed/URUJD5NEXC8',
        desc: 'Cấu trúc tế bào người và các bào quan thực hiện chuyển hóa năng lượng.'
      },
      {
        id: 'med_bone_repair',
        titleVi: '2. Cơ Chế Tự Phục Hồi & Tái Tạo Xương',
        title: '2. Bone Repair',
        subtitle: 'Tiến trình liền xương: Tái tạo can xương sau gãy',
        duration: '0:36',
        badge: 'Tái tạo',
        type: 'video',
        image: './images/atlas/med_bone_repair.png',
        videoUrl: 'https://www.youtube.com/embed/zvhfN6e6m0c',
        desc: 'Quá trình đại thực bào dọn ổ gãy, hình thành mạng lưới mao mạch và can xương cứng.'
      },
      {
        id: 'med_soft_tissue',
        titleVi: '3. Cơ Chế Liền Sẹo & Tái Tạo Mô Mềm',
        title: '3. Soft Tissue Repair',
        subtitle: 'Tái tạo mô mềm: Tăng sinh nguyên bào sợi và collagen',
        duration: '0:52',
        badge: 'Phục hồi',
        type: 'video',
        image: './images/atlas/med_soft_tissue.png',
        videoUrl: 'https://www.youtube.com/embed/yPZZ8zH3b5U',
        desc: 'Cơ chế lành vết thương và tái sinh sợi collagen chịu lực của gân và dây chằng.'
      }
    ]
  },
  {
    id: 'respiration_circulation_media',
    titleVi: 'Hô Hấp & Tuần Hoàn',
    cards: [
      {
        id: 'med_breathing',
        titleVi: '1. Cơ Chế Thông Khí Phổi & Hít Thở',
        title: '1. Breathing',
        subtitle: 'Cơ chế thở: Vòm hoành và lồng ngực tạo áp suất âm hút khí',
        duration: '0:57',
        badge: 'Hô hấp',
        type: 'video',
        image: './images/atlas/resp_lungs.png',
        videoUrl: 'https://www.youtube.com/embed/bLZPzL_K2rI',
        desc: 'Cơ hoành hạ thấp mở rộng thể tích ngực tạo áp suất âm hút khí vào phổi.'
      },
      {
        id: 'med_external_respiration',
        titleVi: '2. Trao Đổi Khí Tại Phế Nang (Hô Hấp Ngoài)',
        title: '2. External Respiration',
        subtitle: 'Hô hấp ngoài: Trao đổi O2 và CO2 qua màng phế nang mao mạch',
        duration: '0:31',
        badge: 'Sinh lý phổi',
        type: 'video',
        image: './images/atlas/resp_upper.png',
        videoUrl: 'https://www.youtube.com/embed/mzv7_uF-JdM',
        desc: 'Sự chênh lệch phân áp khí thúc đẩy oxy vào máu và giải phóng khí CO2.'
      },
      {
        id: 'med_daltons_law',
        titleVi: '3. Định Luật Dalton Trong Áp Suất Khí Phổi',
        title: "3. Dalton's Law",
        subtitle: 'Định luật Dalton: Phân áp chất khí trong trao đổi hô hấp',
        duration: '0:41',
        badge: 'Vật lý y sinh',
        type: 'video',
        image: './images/atlas/resp_diaphragm.png',
        videoUrl: 'https://www.youtube.com/embed/Vv5YfT4C4_0',
        desc: 'Áp suất toàn phần của hỗn hợp khí bằng tổng các áp suất riêng phần.'
      }
    ]
  },
  {
    id: 'nutrition_elimination_media',
    titleVi: 'Dinh Dưỡng & Bài Tiết',
    cards: [
      {
        id: 'med_chewing_swallowing',
        titleVi: '1. Cơ Chế Nhai & Phản Xạ Nuốt',
        title: '1. Chewing and Swallowing',
        subtitle: 'Nhai và nuốt: Vận động khoang miệng và nhu động thực quản',
        duration: '0:33',
        badge: 'Tiêu hóa',
        type: 'video',
        image: './images/atlas/dig_upper.png',
        videoUrl: 'https://www.youtube.com/embed/p9VdK1_7pQw',
        desc: 'Giai đoạn nuốt có ý thức ở miệng chuyển tiếp nhu động tự chủ qua thực quản.'
      },
      {
        id: 'med_epiglottis',
        titleVi: '2. Chức Năng Của Nắp Thanh Môn Đóng Khí Quản',
        title: '2. Function of the Epiglottis',
        subtitle: 'Chức năng sụn nắp thanh môn: Đóng đường thở khi nuốt',
        duration: '0:43',
        badge: 'Hầu thanh quản',
        type: 'video',
        image: './images/atlas/resp_upper.png',
        videoUrl: 'https://www.youtube.com/embed/q_2mX3VfEtw',
        desc: 'Cơ chế cơ học tự động gập sụn nắp ngăn dị vật và thức ăn rơi vào khí quản.'
      },
      {
        id: 'med_nutrient_absorption',
        titleVi: '3. Cơ Chế Hấp Thu Dinh Dưỡng Tại Ruột Non',
        title: '3. Nutrient Absorption',
        subtitle: 'Hấp thu dưỡng chất: Nhung mao ruột non đưa chất vào mao mạch',
        duration: '0:43',
        badge: 'Hấp thu',
        type: 'video',
        image: './images/atlas/dig_lower.png',
        videoUrl: 'https://www.youtube.com/embed/b20VRR9C37Q',
        desc: 'Hệ thống vi nhung mao ruột non tăng diện tích tiếp xúc hấp thu chất dinh dưỡng.'
      }
    ]
  },
  {
    id: 'reproductive_media',
    titleVi: 'Hệ Sinh Sản & Phôi Thai',
    cards: [
      {
        id: 'med_female_cells',
        titleVi: '1. Quá Trình Phát Triển Tế Bào Trứng (Noãn)',
        title: '1. Female Sex Cells',
        subtitle: 'Tế bào sinh dục nữ: Phát triển nang noãn và rụng trứng',
        duration: '0:50',
        badge: 'Sinh sản nữ',
        type: 'video',
        image: './images/atlas/urin_pelvic.png',
        videoUrl: 'https://www.youtube.com/embed/RFDatCchpus',
        desc: 'Tiến trình giảm phân tạo noãn bào trưởng thành dưới tác động hormone buồng trứng.'
      },
      {
        id: 'med_male_cells',
        titleVi: '2. Quá Trình Sinh Tinh & Tế Bào Tinh Trùng',
        title: '2. Male Sex Cells',
        subtitle: 'Tế bào sinh dục nam: Sinh tinh và cấu trúc tinh trùng',
        duration: '0:34',
        badge: 'Sinh sản nam',
        type: 'video',
        image: './images/atlas/urin_system.png',
        videoUrl: 'https://www.youtube.com/embed/Wcqg5tD0xVo',
        desc: 'Ống sinh tinh sản sinh tinh trùng mang bộ nhiễm sắc thể đơn bội di chuyển linh hoạt.'
      },
      {
        id: 'med_fertilization',
        titleVi: '3. Từ Thụ Tinh Đến Làm Tổ Của Phôi Thai',
        title: '3. Fertilization to Implantation',
        subtitle: 'Thụ tinh đến làm tổ: Hợp tử phân chia và bám vào nội mạc tử cung',
        duration: '0:30',
        badge: 'Phôi thai',
        type: 'video',
        image: './images/atlas/urin_pelvic.png',
        videoUrl: 'https://www.youtube.com/embed/_5OvgQW6FG4',
        desc: 'Giai đoạn thụ tinh ở 1/3 ngoài vòi trứng đến phôi nang làm tổ tại tử cung.'
      }
    ]
  },
  {
    id: 'endocrine_media',
    titleVi: 'Hệ Nội Tiết & Hormone',
    cards: [
      {
        id: 'med_negative_feedback',
        titleVi: '1. Vòng Điều Hòa Ngược Âm Tính (Feedback Âm)',
        title: '1. Negative Feedback Loops',
        subtitle: 'Vòng điều hòa ngược âm tính: Trục hạ đồi - tuyến yên - đích',
        duration: '0:55',
        badge: 'Nội tiết',
        type: 'video',
        image: './images/atlas/med_skin.png',
        videoUrl: 'https://www.youtube.com/embed/CLv3SkFvv60',
        desc: 'Cơ chế tự điều chỉnh nồng độ hormone giữ cân bằng nội môi cơ thể.'
      },
      {
        id: 'med_positive_feedback',
        titleVi: '2. Vòng Điều Hòa Ngược Dương Tính (Feedback Dương)',
        title: '2. Positive Feedback Loops',
        subtitle: 'Vòng điều hòa ngược dương tính: Tác dụng khuếch đại sinh lý',
        duration: '0:50',
        badge: 'Sinh lý học',
        type: 'video',
        image: './images/atlas/med_skin.png',
        videoUrl: 'https://www.youtube.com/embed/q_2mX3VfEtw',
        desc: 'Cơ chế kích hoạt đỉnh điểm đáp ứng, điển hình là cơn co dạ con khi chuyển dạ.'
      },
      {
        id: 'med_water_soluble',
        titleVi: '3. Cơ Chế Tác Động Của Hormone Tan Trong Nước',
        title: '3. Water-Soluble Hormone Action',
        subtitle: 'Hormone tan trong nước: Thụ thể màng và chất truyền tin cAMP',
        duration: '0:50',
        badge: 'Tín hiệu TB',
        type: 'video',
        image: './images/atlas/med_skin.png',
        videoUrl: 'https://www.youtube.com/embed/FTv8V_nE4Qc',
        desc: 'Hormone gắn thụ thể ngoại bào kích hoạt chuỗi phản ứng enzym nội bào.'
      }
    ]
  },
  {
    id: 'special_senses_media',
    titleVi: 'Các Giác Quan Chuyên Biệt',
    cards: [
      {
        id: 'med_hearing',
        titleVi: '1. Cơ Chế Dẫn Truyền & Cảm Thụ Thính Giác',
        title: '1. Hearing',
        subtitle: 'Thính giác: Cơ chế truyền âm từ màng nhĩ qua chuỗi xương con',
        duration: '0:59',
        badge: 'Thính giác',
        type: 'video',
        image: './images/atlas/skel_skull.png',
        videoUrl: 'https://www.youtube.com/embed/PeSteAXN454',
        desc: 'Chuyển đổi dao động cơ học thành xung thần kinh truyền về thùy thái dương.'
      },
      {
        id: 'med_sight',
        titleVi: '2. Đường Dẫn Truyền & Thụ Cảm Thị Giác',
        title: '2. Sight',
        subtitle: 'Thị giác: Quang học mắt và khúc xạ hội tụ lên võng mạc',
        duration: '0:51',
        badge: 'Thị giác',
        type: 'video',
        image: './images/atlas/skel_cranial_fossae.png',
        videoUrl: 'https://www.youtube.com/embed/o0DYP-DV9rA',
        desc: 'Ánh sáng đi qua giác mạc và thể thủy tinh kích hoạt tế bào que và nón.'
      },
      {
        id: 'med_types_vision',
        titleVi: '3. Các Dạng Thị Giác & Khúc Xạ Mắt',
        title: '3. Types of Vision',
        subtitle: 'Các loại thị lực: Tật cận thị, viễn thị và điều tiết mắt',
        duration: '0:21',
        badge: 'Khúc xạ',
        type: 'video',
        image: './images/atlas/skel_skull.png',
        videoUrl: 'https://www.youtube.com/embed/9_E9i1Qd5q4',
        desc: 'Nguyên nhân sai lệch tiêu cự quang học mắt và phương pháp điều chỉnh kính.'
      }
    ]
  },
  {
    id: 'resp_circ_pathologies_media',
    titleVi: 'Bệnh Lý Hô Hấp & Tuần Hoàn',
    cards: [
      {
        id: 'med_pvd',
        titleVi: '1. Bệnh Lý Mạch Máu Ngoại Biên (PVD)',
        title: '1. Peripheral Vascular Disease',
        subtitle: 'Bệnh mạch máu ngoại biên: Hẹp xơ vữa gây thiếu máu chi',
        duration: '0:20',
        badge: 'Mạch máu',
        type: 'video',
        image: './images/atlas/circ_full.png',
        videoUrl: 'https://www.youtube.com/embed/b20VRR9C37Q',
        desc: 'Mảng xơ vữa làm giảm khẩu kính mạch máu, cản trở tuần hoàn động mạch ngoại vi.'
      },
      {
        id: 'med_chf',
        titleVi: '2. Suy Tim Sung Huyết (CHF)',
        title: '2. Congestive Heart Failure',
        subtitle: 'Suy tim ứ huyết: Giảm cung lượng tim và ứ dịch phổi ngoại biên',
        duration: '0:19',
        badge: 'Tim mạch',
        type: 'video',
        image: './images/atlas/circ_heart_thorax.png',
        videoUrl: 'https://www.youtube.com/embed/g_m3n4hU6u8',
        desc: 'Thất trái suy giảm khả năng bơm máu dẫn đến tăng áp lực mao mạch phổi.'
      },
      {
        id: 'med_infarction',
        titleVi: '3. Nhồi Máu Cơ Tim Cấp Tính',
        title: '3. Infarction',
        subtitle: 'Nhồi máu cơ tim: Tắc động mạch vành gây hoại tử tế bào cơ tim',
        duration: '0:19',
        badge: 'Cấp cứu tim',
        type: 'video',
        image: './images/atlas/circ_simplified.png',
        videoUrl: 'https://www.youtube.com/embed/bXkL1jZ238c',
        desc: 'Mảng xơ vữa nứt vỡ tạo cục máu đông chặn dòng nuôi cơ tim gây đau thắt ngực.'
      }
    ]
  },
  {
    id: 'dig_urin_pathologies_media',
    titleVi: 'Bệnh Lý Tiêu Hóa & Tiết Niệu',
    cards: [
      {
        id: 'med_gerd',
        titleVi: '1. Bệnh Trào Ngược Dạ Dày Thực Quản (GERD)',
        title: '1. GERD',
        subtitle: 'Trào ngược dạ dày thực quản: Acid dịch vị gây viêm niêm mạc',
        duration: '0:25',
        badge: 'Dạ dày',
        type: 'video',
        image: './images/atlas/dig_upper.png',
        videoUrl: 'https://www.youtube.com/embed/7Vb9N42gQ-8',
        desc: 'Rối loạn cơ thắt thực quản dưới làm acid dịch vị kích ứng đường ăn.'
      },
      {
        id: 'med_gallstones',
        titleVi: '2. Sỏi Túi Mật & Đường Dẫn Mật',
        title: '2. Gallstones',
        subtitle: 'Sỏi túi mật: Tinh thể cholesterol và sỏi tắc ống mật',
        duration: '0:33',
        badge: 'Gan mật',
        type: 'video',
        image: './images/atlas/dig_peritoneum.png',
        videoUrl: 'https://www.youtube.com/embed/8vR4M7h7w-4',
        desc: 'Mất cân bằng thành phần dịch mật lắng đọng tạo thành sỏi cản trở tiêu hóa mỡ.'
      },
      {
        id: 'med_diverticulitis',
        titleVi: '3. Viêm Túi Thừa Đại Tràng',
        title: '3. Diverticulitis',
        subtitle: 'Viêm túi thừa đại tràng: Túi phình thành ruột bị nhiễm trùng',
        duration: '0:24',
        badge: 'Đại tràng',
        type: 'video',
        image: './images/atlas/dig_lower.png',
        videoUrl: 'https://www.youtube.com/embed/79-wEaE4qQw',
        desc: 'Ứ đọng cặn bã trong các túi thừa niêm mạc gây viêm đau hố chậu trái.'
      }
    ]
  },
  {
    id: 'muscle_bone_pathologies_media',
    titleVi: 'Bệnh Lý Cơ Bắp & Xương Khớp',
    cards: [
      {
        id: 'med_acl_tear',
        titleVi: '1. Đứt Dây Chằng Chéo Trước (ACL)',
        title: '1. ACL tear',
        subtitle: 'Đứt dây chằng chéo trước: Tổn thương mất vững khớp gối',
        duration: '0:15',
        badge: 'Khớp gối',
        type: 'video',
        image: './images/atlas/reg_lower_limb.png',
        videoUrl: 'https://www.youtube.com/embed/4yW4mD7w-4k',
        desc: 'Chấn thương xoắn vặn quá mức làm rách đứt dây chằng chéo trước khớp gối.'
      },
      {
        id: 'med_cervical_spondylosis',
        titleVi: '2. Thoái Hóa Đốt Sống Cổ',
        title: '2. Cervical Spondylosis',
        subtitle: 'Thoái hóa đốt sống cổ: Thoái hóa đĩa đệm và gai xương chèn ép',
        duration: '0:49',
        badge: 'Cột sống cổ',
        type: 'video',
        image: './images/atlas/skel_spine.png',
        videoUrl: 'https://www.youtube.com/embed/w74-x9qM_gA',
        desc: 'Mòn sụn khớp đĩa đệm và gai xương thoái hóa chèn rễ thần kinh cánh tay.'
      },
      {
        id: 'med_carpal_tunnel',
        titleVi: '3. Hội Chứng Ống Cổ Tay (CTS)',
        title: '3. Carpal Tunnel Syndrome Overview',
        subtitle: 'Hội chứng ống cổ tay: Chèn ép thần kinh giữa tại cổ tay',
        duration: '0:22',
        badge: 'Cổ tay',
        type: 'video',
        image: './images/atlas/reg_upper_limb.png',
        videoUrl: 'https://www.youtube.com/embed/7rA8k_FvT_U',
        desc: 'Tăng áp lực trong ống cổ tay chèn ép dây thần kinh giữa gây tê bì bàn tay.'
      }
    ]
  },
  {
    id: 'lymphatic_pathologies_media',
    titleVi: 'Bệnh Lý Hệ Bạch Huyết & Miễn Dịch',
    cards: [
      {
        id: 'med_hiv_aids',
        titleVi: '1. Cơ Chế Nhiễm & Suy Giảm Miễn Dịch (HIV/AIDS)',
        title: '1. HIV and AIDS',
        subtitle: 'Nhiễm HIV & AIDS: Phá hủy tế bào Lympho T-CD4 suy giảm miễn dịch',
        duration: '1:06',
        badge: 'Miễn dịch',
        type: 'video',
        image: './images/atlas/circ_full.png',
        videoUrl: 'https://www.youtube.com/embed/ng22Ucr33aw',
        desc: 'Virus HIV xâm nhập và tiêu diệt dần tế bào miễn dịch chỉ huy mở đường cho nhiễm trùng cơ hội.'
      }
    ]
  }
];

const STORAGE_KEY = 'atlas_custom_media_data_v3';
const ADMIN_LOGGED_IN_KEY = 'atlas_admin_logged_in';
export const ADMIN_DEFAULT_PASS = '123456';

// Lấy danh sách danh mục Media (ưu tiên LocalStorage nếu Admin đã tùy biến)
export function getAtlasMediaCategories() {
  try {
    const raw = localStorage.getItem(STORAGE_KEY);
    if (raw) {
      const parsed = JSON.parse(raw);
      if (Array.isArray(parsed) && parsed.length > 0) {
        // Tự động thay thế link video hệ xương nếu còn lưu link YouTube cũ bị vô hiệu hóa
        let healed = false;
        parsed.forEach(cat => {
          if (cat.cards) {
            cat.cards.forEach(card => {
              if (card.videoUrl && card.videoUrl.includes('rGz9H1hX-3M')) {
                card.videoUrl = 'https://www.youtube.com/embed/rDGqkMHPDqE';
                healed = true;
              }
            });
          }
        });
        if (healed) {
          try { localStorage.setItem(STORAGE_KEY, JSON.stringify(parsed)); } catch {}
        }
        return parsed;
      }
    }
  } catch (err) {
    console.warn('[AtlasMediaManager] Failed to read custom media:', err);
  }
  // Mặc định 12 danh mục chuẩn
  return JSON.parse(JSON.stringify(DEFAULT_ATLAS_MEDIA_CATEGORIES));
}

// Lưu dữ liệu danh mục Media mới do Admin cập nhật
export function saveAtlasMediaCategories(categories) {
  if (!Array.isArray(categories)) return false;
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

// Bộ phân giải URL Video thông minh (YouTube watch, youtu.be, embed, shorts, hoặc video MP4/WebM/Blob)
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

// Kiểm tra quyền Admin
export function verifyAdminPassword(inputPass) {
  if (!inputPass) return false;
  return inputPass.trim() === ADMIN_DEFAULT_PASS;
}

export function isAdminLoggedIn() {
  return sessionStorage.getItem(ADMIN_LOGGED_IN_KEY) === 'true';
}

export function setAdminLoggedIn(status) {
  if (status) {
    sessionStorage.setItem(ADMIN_LOGGED_IN_KEY, 'true');
  } else {
    sessionStorage.removeItem(ADMIN_LOGGED_IN_KEY);
  }
}

// -----------------------------------------------------------------------------
// BINDING VIDEO VÀO TỪNG CƠ QUAN / BỘ PHẬN GIẢI PHẪU (PART-TO-VIDEO MAPPINGS)
// -----------------------------------------------------------------------------
const PART_VIDEOS_KEY = 'atlas_part_videos_v2';

export function getPartVideo(partId) {
  if (!partId) return null;
  const clean = String(partId).replace(/[\._](l|r)$/i, '').replace(/\s*\((l|r|left|right)\)$/i, '').trim();

  // 1. Kiểm tra cấu hình do Admin đã tự gắn trực tiếp vào bộ phận này
  try {
    const raw = localStorage.getItem(PART_VIDEOS_KEY);
    if (raw) {
      const map = JSON.parse(raw);
      if (map[partId]) return map[partId];
      if (map[clean]) return map[clean];
    }
  } catch {}

  // 2. Tự động liên kết thông minh với các video mẫu chuẩn có sẵn theo hệ cơ quan
  const lower = clean.toLowerCase();
  const categories = getAtlasMediaCategories();
  for (const cat of categories) {
    if (!cat.cards) continue;
    for (const card of cat.cards) {
      const cardTitleLower = (card.title + ' ' + (card.subtitle || '') + ' ' + (card.desc || '')).toLowerCase();

      if (
        (lower.includes('heart') || lower.includes('tim') || lower.includes('atrium') || lower.includes('ventricle')) &&
        (card.id.includes('heart') || cardTitleLower.includes('heart') || cardTitleLower.includes('tim'))
      ) {
        return { ...card, isDefault: true };
      }
      if (
        (lower.includes('femur') || lower.includes('đùi') || lower.includes('hip') || lower.includes('háng')) &&
        (card.id.includes('ball_socket') || cardTitleLower.includes('ball and socket'))
      ) {
        return { ...card, isDefault: true };
      }
      if (
        (lower.includes('knee') || lower.includes('gối') || lower.includes('cruciate') || lower.includes('meniscus') || lower.includes('chéo')) &&
        (card.id.includes('condyloid') || cardTitleLower.includes('gối') || cardTitleLower.includes('condyloid'))
      ) {
        return { ...card, isDefault: true };
      }
      if (
        (lower.includes('skin') || lower.includes('da')) &&
        (card.id.includes('skin') || cardTitleLower.includes('da'))
      ) {
        return { ...card, isDefault: true };
      }
      if (
        (lower.includes('biceps') || lower.includes('triceps') || lower.includes('nhị đầu') || lower.includes('tam đầu')) &&
        (card.id.includes('paired_muscles') || cardTitleLower.includes('cơ đối vận'))
      ) {
        return { ...card, isDefault: true };
      }
      if (
        (lower.includes('lung') || lower.includes('phổi') || lower.includes('trachea') || lower.includes('khí quản')) &&
        (card.id.includes('gas_exchange') || cardTitleLower.includes('khí') || cardTitleLower.includes('phổi'))
      ) {
        return { ...card, isDefault: true };
      }
      if (
        (lower.includes('vertebra') || lower.includes('spine') || lower.includes('đốt sống') || lower.includes('cột sống')) &&
        (card.id.includes('skeleton') || cardTitleLower.includes('xương'))
      ) {
        return { ...card, isDefault: true };
      }
    }
  }

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
