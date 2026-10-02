// Comprehensive Academic & Clinical Anatomical Database
// Standardized in Vietnamese, Latin (TA2), English
// Features: Anatomical Description, Biomechanical Function, Clinical Pathology,
// and 4-way Anatomical Relations (Cơ - Xương - Thần kinh - Mạch máu)
import { getVietnameseName, getAnatomyNomenclature } from './vietnamese.js';

export const CLINICAL_DATABASE = {
  // === ĐẦU - VÒM SỌ & MẠC DA ĐẦU (HEAD & SCALP) ===
  'Epicranial aponeurosis': {
    nameVi: 'Cân trên sọ',
    nameLatin: 'Galea aponeurotica (TA2: 2010)',
    nameEn: 'Epicranial aponeurosis',
    regionVi: 'Đầu - Vòm sọ & Da đầu',
    systemVi: 'Hệ Cơ & Mạc Đầu Mặt',
    description: 'Lớp cân mô liên kết sợi collagen dày, chắc phủ toàn bộ vòm sọ, liên kết trực tiếp bụng trán và bụng chẩm của cơ chẩm trán, tạo nên lớp thứ 3 bền vững của da đầu (SCALP).',
    function: 'Làm điểm tựa truyền lực căng cho cơ chẩm trán để cử động nhăn trán, nâng cung mày; đồng thời là lá chắn cơ học bảo vệ xương sọ và mạch máu dưới da đầu chống lại lực ma sát va chạm.',
    relationsText: 'Phía trên dính chặt vào lớp da và mô mỡ dưới da; trượt tự do trên lớp mô liên kết lỏng lẻo phủ ngoài màng xương sọ; phía trước liên tục với cơ trán, phía sau bám vào cơ chẩm và mào chẩm ngoài.',
    clinical: 'Là mốc giải phẫu then chốt trong chấn thương rách da đầu (khi vết thương đứt qua cân trên sọ, cơ co kéo làm miệng vết thương toác rộng, chảy máu nhiều) và là lớp phân chia phẫu thuật bóc tách vạt da đầu an toàn.',
    relations: {
      muscles: 'Bụng trán & bụng chẩm của cơ chẩm trán (Occipitofrontalis), cơ thái dương đỉnh (Temporoparietalis).',
      bones: 'Trượt phía trên vòm sọ gồm xương trán (Frontal), xương đỉnh (Parietal) và xương chẩm (Occipital).',
      nerves: 'Thần kinh trên ổ mắt (Supratrochlear), thần kinh trên ròng rọc, thần kinh tai thái dương và thần kinh chẩm lớn.',
      vessels: 'Mạng lưới nối phong phú của động mạch trên ổ mắt, động mạch thái dương nông và động mạch chẩm.'
    },
    lessonLink: '/giai-phau-dau-mat/can-tren-so',
    lessonTitle: 'Cân Trên Sọ (Galea Aponeurotica): Cấu Trúc & Ứng Dụng Phẫu Thuật',
    videoId: '3ZfVjV7VqJ8'
  },

  'Galea aponeurotica': {
    nameVi: 'Cân trên sọ',
    nameLatin: 'Galea aponeurotica (TA2: 2010)',
    nameEn: 'Epicranial aponeurosis',
    regionVi: 'Đầu - Vòm sọ & Da đầu',
    systemVi: 'Hệ Cơ & Mạc Đầu Mặt',
    description: 'Lớp cân mô liên kết sợi collagen dày, chắc phủ toàn bộ vòm sọ, liên kết trực tiếp bụng trán và bụng chẩm của cơ chẩm trán, tạo nên lớp thứ 3 bền vững của da đầu (SCALP).',
    function: 'Làm điểm tựa truyền lực căng cho cơ chẩm trán để cử động nhăn trán, nâng cung mày; đồng thời là lá chắn cơ học bảo vệ xương sọ và mạch máu dưới da đầu chống lại lực ma sát va chạm.',
    relationsText: 'Phía trên dính chặt vào lớp da và mô mỡ dưới da; trượt tự do trên lớp mô liên kết lỏng lẻo phủ ngoài màng xương sọ; phía trước liên tục với cơ trán, phía sau bám vào cơ chẩm và mào chẩm ngoài.',
    clinical: 'Là mốc giải phẫu then chốt trong chấn thương rách da đầu (khi vết thương đứt qua cân trên sọ, cơ co kéo làm miệng vết thương toác rộng, chảy máu nhiều) và là lớp phân chia phẫu thuật bóc tách vạt da đầu an toàn.',
    relations: {
      muscles: 'Bụng trán & bụng chẩm của cơ chẩm trán (Occipitofrontalis), cơ thái dương đỉnh (Temporoparietalis).',
      bones: 'Trượt phía trên vòm sọ gồm xương trán (Frontal), xương đỉnh (Parietal) và xương chẩm (Occipital).',
      nerves: 'Thần kinh trên ổ mắt (Supratrochlear), thần kinh trên ròng rọc, thần kinh tai thái dương và thần kinh chẩm lớn.',
      vessels: 'Mạng lưới nối phong phú của động mạch trên ổ mắt, động mạch thái dương nông và động mạch chẩm.'
    },
    lessonLink: '/giai-phau-dau-mat/can-tren-so',
    lessonTitle: 'Cân Trên Sọ (Galea Aponeurotica): Cấu Trúc & Ứng Dụng Phẫu Thuật',
    videoId: '3ZfVjV7VqJ8'
  },

  // === CỘT SỐNG & THÂN MÌNH (SPINE & TRUNK) ===
  'Lumbar vertebra': {
    nameVi: 'Đốt sống thắt lưng (L1 - L5)',
    nameLatin: 'Vertebrae lumbales (TA2: 1045)',
    nameEn: 'Lumbar vertebrae',
    regionVi: 'Cột sống & Thân mình',
    systemVi: 'Hệ Xương',
    description: 'Gồm 5 đốt sống lớn nhất trong cột sống, thân đốt hình quả thận chịu lực, cuống cung dày, lỗ đốt sống hình tam giác. Chịu tải trọng chính của toàn bộ nửa trên cơ thể.',
    function: 'Nâng đỡ trọng lượng cơ thể, cho phép cúi gập, ngửa, nghiêng và xoay nhẹ thân mình; bảo vệ đoạn chóp tủy và chùm đuôi ngựa (Cauda equina).',
    clinical: 'Khu vực có tỷ lệ thoát vị đĩa đệm cao nhất (đặc biệt tầng L4-L5 và L5-S1), thoái hóa cột sống, trượt đốt sống (Spondylolisthesis), chèn ép rễ thần kinh tọa gây đau lan xuống mặt sau đùi và bàn chân.',
    relations: {
      muscles: 'Cơ thắt lưng chậu (Psoas major), cơ vuông thắt lưng (Quadratus lumborum), các cơ dựng gai sống (Erector spinae), cơ nhiều chân (Multifidus).',
      bones: 'Khớp với đốt sống ngực T12 ở trên, đĩa đệm gian đốt sống ở giữa các thân đốt, và khớp với xương cùng S1 ở dưới.',
      nerves: 'Đoạn cuối tủy gai (kết thúc ở L1-L2), đám rối thần kinh thắt lưng (L1-L4), chùm đuôi ngựa và các rễ thần kinh thắt lưng.',
      vessels: 'Động mạch chủ bụng (Abdominal aorta) chạy trước thân đốt sống, các nhánh động mạch thắt lưng (Lumbar arteries) nuôi dưỡng xương và tủy.'
    },
    lessonLink: '/cot-song/tu-the-va-van-dong',
    lessonTitle: 'Cột Sống Thắt Lưng: Cơ Sinh Học & Phòng Ngừa Thoát Vị',
    videoId: '3ZfVjV7VqJ8'
  },

  'Atlas': {
    nameVi: 'Đốt sống cổ C1 (Đốt đội)',
    nameLatin: 'Atlas (Vertebra cervicalis I) (TA2: 1018)',
    nameEn: 'Atlas (C1 vertebra)',
    regionVi: 'Đầu - Mặt - Cổ',
    systemVi: 'Hệ Xương',
    description: 'Đốt sống cổ thứ nhất, có cấu tạo vòng xương đặc biệt không có thân đốt và mỏm gai, gồm cung trước và cung sau với hai khối bên mang diện khớp trên lõm.',
    function: 'Nâng đỡ trực tiếp hộp sọ thông qua khớp đội - chẩm; cho phép động tác gật đầu (cúi và ngửa đầu quanh trục ngang).',
    clinical: 'Gãy bung Jefferson do chấn thương dồn nén theo trục đứng từ đỉnh đầu; mất vững khớp đội - trục đe dọa trực tiếp hành tủy và trung tâm hô hấp.',
    relations: {
      muscles: 'Cơ thẳng đầu sau bé, cơ chéo đầu trên, cơ chéo đầu dưới, cơ nâng vai (Levator scapulae).',
      bones: 'Khớp đội - chẩm ở trên với lồi cầu xương chẩm; khớp đội - trục ở dưới với đốt C2 (Axis).',
      nerves: 'Dây thần kinh gai sống cổ C1 (Thần kinh dưới chẩm), hạch thần kinh giao cảm cổ trên.',
      vessels: 'Động mạch đốt sống (Vertebral artery) đi qua lỗ mỏm ngang C1 uốn quanh cung sau vào hộp sọ.'
    },
    lessonLink: '/cot-song/dot-song-co',
    lessonTitle: 'Đốt Sống Cổ: Chăm Sóc Đốt Đội C1 & Khớp Bản Lề',
    videoId: 'fGjG7V3A2sQ'
  },

  'Axis': {
    nameVi: 'Đốt sống cổ C2 (Đốt trục)',
    nameLatin: 'Axis (Vertebra cervicalis II) (TA2: 1022)',
    nameEn: 'Axis (C2 vertebra)',
    regionVi: 'Đầu - Mặt - Cổ',
    systemVi: 'Hệ Xương',
    description: 'Đốt sống cổ thứ hai, nhận diện bởi mỏm răng (Dens / Odontoid process) nhô thẳng lên trên đóng vai trò chốt quay cho đốt C1.',
    function: 'Tạo trục xoay chính cho đầu và cổ, đảm nhiệm hơn 50% biên độ cử động xoay trái - phải của toàn bộ cột sống cổ.',
    clinical: 'Gãy mỏm răng C2 trong tai nạn giao thông hoặc ngã va đập cằm; hội chứng cổ vai gáy do chèn ép thần kinh chẩm lớn.',
    relations: {
      muscles: 'Cơ thẳng đầu sau lớn, cơ chéo đầu dưới, cơ gối đầu (Splenius capitis).',
      bones: 'Tiếp khớp với cung trước đốt C1 qua mỏm răng; khớp với đốt sống cổ C3 ở dưới.',
      nerves: 'Dây thần kinh chẩm lớn (Greater occipital nerve) vòng quanh bờ dưới cơ chéo đầu dưới.',
      vessels: 'Động mạch đốt sống (Vertebral artery) đi qua lỗ ngang C2.'
    },
    lessonLink: '/cot-song/dot-song-co',
    lessonTitle: 'Đốt Trục C2 & Tầm Vận Động Cột Sống Cổ',
    videoId: 'fGjG7V3A2sQ'
  },

  'Cervical vertebra': {
    nameVi: 'Đốt sống cổ C3 - C7',
    nameLatin: 'Vertebrae cervicales (TA2: 1017)',
    nameEn: 'Cervical vertebrae',
    regionVi: 'Đầu - Mặt - Cổ',
    systemVi: 'Hệ Xương',
    description: 'Thân đốt nhỏ dẹt, mỏm gai chẻ đôi (C2-C6), đặc trưng bởi lỗ mỏm ngang để động mạch đốt sống đi qua. C7 là đốt sống lồi có mỏm gai dài nhất sờ thấy dưới da gáy.',
    function: 'Tạo sự linh hoạt tối đa cho vùng đầu cổ, bảo vệ tủy cổ và các rễ thần kinh điều khiển chi trên.',
    clinical: 'Hội chứng thoái hóa cột sống cổ, gai đốt sống chèn ép rễ thần kinh cánh tay (C5-C7) gây tê bì ngón tay; hội chứng Text Neck do cúi nhìn màn hình thời gian dài.',
    relations: {
      muscles: 'Nhóm cơ bậc thang (Scalene muscles), cơ ức đòn chũm, cơ thang, cơ dài cổ.',
      bones: 'Khớp liên đốt sống cổ, khớp mỏm móc (Luschka).',
      nerves: 'Đám rối thần kinh cánh tay (Brachial plexus C5-T1), thần kinh hoành (Phrenic nerve C3-C5).',
      vessels: 'Động mạch đốt sống, động mạch cổ sâu, tĩnh mạch cảnh trong.'
    },
    lessonLink: '/cot-song/dot-song-co',
    lessonTitle: 'Phục Hồi Cổ Vai Gáy Cho Người Văn Phòng',
    videoId: 'fGjG7V3A2sQ'
  },

  'Thoracic vertebra': {
    nameVi: 'Đốt sống ngực (T1 - T12)',
    nameLatin: 'Vertebrae thoracicae (TA2: 1033)',
    nameEn: 'Thoracic vertebrae',
    regionVi: 'Lồng ngực & Lưng',
    systemVi: 'Hệ Xương',
    description: 'Gồm 12 đốt sống có các hố sườn trên thân và mỏm ngang để khớp với đầu và củ xương sườn. Mỏm gai chúc dài xuống dưới như ngói lợp.',
    function: 'Kết hợp cùng xương sườn và xương ức tạo nên lồng ngực vững chắc bảo vệ tim, phổi và các tạng trung thất; điểm tựa cho nhịp thở.',
    clinical: 'Gù vẹo cột sống ngực (Thoracic kyphoscoliosis), đau dây thần kinh liên sườn, loãng xương gây xẹp lún đốt sống ở người lớn tuổi.',
    relations: {
      muscles: 'Cơ gian sườn, cơ trám (Rhomboids), cơ lưng rộng (Latissimus dorsi), cơ nâng sườn.',
      bones: 'Khớp với 12 đôi xương sườn (Khớp sườn sống và khớp sườn mỏm ngang).',
      nerves: 'Dây thần kinh liên sườn (Intercostal nerves), chuỗi hạch giao cảm cạnh sống.',
      vessels: 'Động mạch gian sườn sau (Posterior intercostal arteries), tĩnh mạch đơn (Azygos vein).'
    },
    lessonLink: '/cot-song/tu-the-va-van-dong',
    lessonTitle: 'Cột Sống Ngực & Cơ Chế Hô Hấp Đúng',
    videoId: '3ZfVjV7VqJ8'
  },

  'Sacrum': {
    nameVi: 'Xương cùng (S1 - S5)',
    nameLatin: 'Os sacrum (TA2: 1056)',
    nameEn: 'Sacrum',
    regionVi: 'Khung chậu',
    systemVi: 'Hệ Xương',
    description: 'Xương hình chêm tam giác lớn tạo bởi 5 đốt sống cùng dính liền, nằm giữa hai xương cánh chậu tạo nên vòm sau của khung chậu.',
    function: 'Là nền móng chịu lực truyền tải trọng lượng từ cột sống xuống đai chậu và hai chân; bảo vệ các nhánh thần kinh chùm đuôi ngựa.',
    clinical: 'Viêm khớp cùng chậu (Sacroiliitis) trong bệnh viêm cột sống dính khớp (Ankylosing spondylitis), đau vùng khớp cùng chậu khi mang thai hoặc sau chấn thương.',
    relations: {
      muscles: 'Cơ hình lê (Piriformis), cơ mông lớn (Gluteus maximus), cơ nhiều chân cùng.',
      bones: 'Khớp cùng - chậu (Sacroiliac joint) với hai xương chậu, khớp cùng - cụt ở dưới, khớp L5-S1 ở trên.',
      nerves: 'Đám rối thần kinh cùng (Sacral plexus L4-S4), dây thần kinh tọa (Sciatic nerve).',
      vessels: 'Động mạch cùng giữa, động mạch cùng bên, đám rối tĩnh mạch cùng.'
    },
    lessonLink: '/cot-song/tu-the-va-van-dong',
    lessonTitle: 'Khớp Cùng Chậu & Cân Bằng Khung Xương',
    videoId: 'yU8C5r4N8w0'
  },

  'Coccyx': {
    nameVi: 'Xương cụt (Co1 - Co4)',
    nameLatin: 'Os coccygis (TA2: 1068)',
    nameEn: 'Coccyx (Tailbone)',
    regionVi: 'Khung chậu',
    systemVi: 'Hệ Xương',
    description: 'Đoạn xương nhỏ hình tam giác tận cùng của cột sống, gồm 3 đến 5 đốt sống thoái hóa dính liền nhau.',
    function: 'Điểm bám cốt lõi của các dây chằng và cơ đáy chậu nâng đỡ sàn chậu; điểm tựa khi ngồi ngả lưng.',
    clinical: 'Đau xương cụt (Coccydynia) do ngã đập mông hoặc sinh nở khó; đau tăng rõ rệt khi ngồi ghế cứng lâu.',
    relations: {
      muscles: 'Cơ cụt (Coccygeus), cơ nâng hậu môn (Levator ani), cơ thắt ngoài hậu môn.',
      bones: 'Khớp cùng - cụt (Sacrococcygeal symphysis).',
      nerves: 'Đám rối thần kinh cụt, hạch lẻ (Ganglion impar).',
      vessels: 'Nhánh tận của động mạch cùng giữa.'
    },
    lessonLink: '/cot-song/tu-the-va-van-dong',
    lessonTitle: 'Đáy Chậu & Chăm Sóc Vùng Xương Cụt',
    videoId: 'yU8C5r4N8w0'
  },

  // === LỒNG NGỰC (THORAX) ===
  'Body of sternum': {
    nameVi: 'Xương ức',
    nameLatin: 'Sternum (TA2: 1079)',
    nameEn: 'Sternum (Breastbone)',
    regionVi: 'Lồng ngực',
    systemVi: 'Hệ Xương',
    description: 'Xương dẹt phẳng ở đường giữa trước lồng ngực gồm 3 phần: cán ức (Manubrium), thân ức (Body) và mỏm kiếm (Xiphoid process).',
    function: 'Khóa chặt mặt trước lồng ngực, bảo vệ tim và mạch máu lớn; điểm tựa chuyển động hô hấp của các xương sườn.',
    clinical: 'Vị trí đặt tay hồi sinh tim phổi (CPR); cưa xương ức trong phẫu thuật mở lồng ngực; viêm sụn sườn (Tietze syndrome).',
    relations: {
      muscles: 'Cơ ngực lớn (Pectoralis major), cơ ức đòn chũm, cơ hoành bám vào mỏm kiếm.',
      bones: 'Tiếp khớp với hai xương đòn và sụn sườn của 7 đôi xương sườn đầu tiên.',
      nerves: 'Các nhánh bì trước của dây thần kinh liên sườn.',
      vessels: 'Động mạch ngực trong (Internal thoracic artery) chạy dọc hai bên bờ xương ức.'
    },
    lessonLink: '/cot-song/tu-the-va-van-dong',
    lessonTitle: 'Lồng Ngực & Nhịp Thở Sinh Lý',
    videoId: '3ZfVjV7VqJ8'
  },

  'First rib': {
    nameVi: 'Xương sườn & Cung sườn',
    nameLatin: 'Costae (TA2: 1087)',
    nameEn: 'Ribs (12 pairs)',
    regionVi: 'Lồng ngực',
    systemVi: 'Hệ Xương',
    description: 'Gồm 12 đôi xương dẹt cong hình cung: 7 đôi sườn thật khớp trực tiếp với xương ức, 3 đôi sườn giả nối qua sụn sườn 7, và 2 đôi sườn cụt lơ lửng.',
    function: 'Nâng lên và hạ xuống thay đổi thể tích lồng ngực tạo nhịp thở; bảo vệ tim, phổi, gan, lách và dạ dày.',
    clinical: 'Gãy xương sườn do va đập chấn thương ngực (nguy cơ tràn khí, tràn máu màng phổi); mảng sườn di động trong chấn thương nặng.',
    relations: {
      muscles: 'Cơ gian sườn ngoài, cơ gian sườn trong, cơ răng trước (Serratus anterior), cơ bậc thang.',
      bones: 'Khớp với các đốt sống ngực ở phía sau và xương ức (qua sụn sườn) ở phía trước.',
      nerves: 'Dây thần kinh liên sườn chạy trong rãnh sườn ở bờ dưới mỗi xương.',
      vessels: 'Bó mạch gian sườn (Động mạch và tĩnh mạch liên sườn) đi cùng thần kinh trong rãnh sườn.'
    },
    lessonLink: '/cot-song/tu-the-va-van-dong',
    lessonTitle: 'Lồng Ngực & Cơ Hoành Hô Hấp',
    videoId: '3ZfVjV7VqJ8'
  },

  // === KHUNG CHẬU & CHI DƯỚI (PELVIS & LOWER LIMB) ===
  'Hip bone': {
    nameVi: 'Xương chậu (Xương hông)',
    nameLatin: 'Os coxae (TA2: 1111)',
    nameEn: 'Hip bone (Pelvic bone)',
    regionVi: 'Khung chậu',
    systemVi: 'Hệ Xương',
    description: 'Xương dẹt lớn cấu thành từ 3 xương hợp nhất tại ổ cối: xương cánh chậu (Ilium) ở trên, xương ngồi (Ischium) ở sau dưới và xương mu (Pubis) ở trước dưới.',
    function: 'Bảo vệ các tạng trong tiểu khung (bàng quang, tử cung/tuyến tiền liệt, trực tràng); truyền toàn bộ trọng lượng thân mình xuống hai đùi.',
    clinical: 'Lệch khung chậu do thói quen vắt chéo chân, gác chân cao hoặc mang vác lệch bên; thoái hóa khớp háng (Coxarthrosis); gãy xương chậu trong tai nạn năng lượng cao.',
    relations: {
      muscles: 'Cơ mông lớn, nhỡ, bé; cơ thắt lưng chậu; các cơ khép đùi; cơ thẳng bụng.',
      bones: 'Khớp cùng - chậu ở sau, khớp mu ở trước, ổ cối (Acetabulum) tiếp khớp chỏm xương đùi.',
      nerves: 'Dây thần kinh đùi (Femoral nerve), dây thần kinh bịt, dây thần kinh tọa.',
      vessels: 'Động mạch chậu chung, động mạch chậu trong và động mạch chậu ngoài.'
    },
    lessonLink: '/cot-song/tu-the-va-van-dong',
    lessonTitle: 'Khung Chậu: Cân Bằng Trọng Tâm & Dáng Đi',
    videoId: 'yU8C5r4N8w0'
  },

  'Femur': {
    nameVi: 'Xương đùi',
    nameLatin: 'Os femoris (TA2: 1133)',
    nameEn: 'Femur (Thigh bone)',
    regionVi: 'Chi dưới (Chân)',
    systemVi: 'Hệ Xương',
    description: 'Xương dài nhất, nặng nhất và chắc khỏe nhất trong cơ thể con người. Gồm chỏm hình cầu, cổ xương đùi, mấu chuyển lớn, mấu chuyển bé, thân xương cong lồi ra trước và hai lồi cầu.',
    function: 'Chịu lực chống đỡ toàn thân khi đứng, chạy nhảy; tạo cánh tay đòn chuyển động cho các cơ đùi cực mạnh.',
    clinical: 'Gãy cổ xương đùi ở người cao tuổi do loãng xương (nguy cơ hoại tử vô mạch chỏm xương đùi); gãy thân xương đùi trong tai nạn giao thông.',
    relations: {
      muscles: 'Cơ tứ đầu đùi (Quadriceps femoris), nhóm cơ ụ ngồi cẳng chân (Hamstrings), các cơ khép, cơ mông.',
      bones: 'Khớp háng ở trên với ổ cối xương chậu; khớp gối ở dưới với xương chày và xương bánh chè.',
      nerves: 'Dây thần kinh đùi ở trước, dây thần kinh tọa (Sciatic nerve) chạy sát mặt sau thân xương đùi.',
      vessels: 'Động mạch đùi (Femoral artery) và động mạch đùi sâu cung cấp máu chính cho toàn bộ chi dưới.'
    },
    lessonLink: '/cot-song/tu-the-va-van-dong',
    lessonTitle: 'Khớp Háng & Trục Chịu Lực Chi Dưới',
    videoId: 'yU8C5r4N8w0'
  },

  'Patella': {
    nameVi: 'Xương bánh chè',
    nameLatin: 'Patella (TA2: 1152)',
    nameEn: 'Patella (Kneecap)',
    regionVi: 'Chi dưới (Khớp gối)',
    systemVi: 'Hệ Xương',
    description: 'Xương vừng lớn nhất cơ thể người, hình tam giác dẹt nằm bên trong gân cơ tứ đầu đùi ở mặt trước khớp gối.',
    function: 'Tăng cánh tay đòn cơ học cho cơ tứ đầu đùi giúp duỗi gối hiệu quả hơn 30%; bảo vệ các cấu trúc bên trong khớp gối khỏi va chạm trực tiếp.',
    clinical: 'Hội chứng đau khớp bánh chè - đùi (Patellofemoral pain syndrome); nhuyễn sụn bánh chè; vỡ xương bánh chè do ngã đập gối xuống mặt cứng.',
    relations: {
      muscles: 'Gân cơ tứ đầu đùi bám bờ trên, dây chằng bánh chè (Patellar ligament) nối bờ dưới với lồi củ chày.',
      bones: 'Tiếp khớp với diện bánh chè của đầu dưới xương đùi tạo thành khớp bánh chè - đùi.',
      nerves: 'Các nhánh thần kinh bì trước của thần kinh đùi.',
      vessels: 'Mạng mạch quanh khớp gối (Genicular anastomosis).'
    },
    lessonLink: '/cot-song/tu-the-va-van-dong',
    lessonTitle: 'Chăm Sóc & Bảo Tồn Khớp Gối',
    videoId: '3ZfVjV7VqJ8'
  },

  'Tibia': {
    nameVi: 'Xương chày',
    nameLatin: 'Tibia (TA2: 1156)',
    nameEn: 'Tibia (Shinbone)',
    regionVi: 'Chi dưới (Cẳng chân)',
    systemVi: 'Hệ Xương',
    description: 'Xương lớn chịu lực chính của cẳng chân, nằm ở phía trong. Đầu trên có mâm chày và lồi củ chày; thân xương hình lăng trụ tam giác có bờ trước sắc nằm sát dưới da; đầu dưới có mắt cá trong.',
    function: 'Chịu tải 85-90% trọng lượng cơ thể từ xương đùi truyền xuống cổ chân và bàn chân.',
    clinical: 'Gãy hở xương chày do bờ trước nằm sát dưới da; thoái hóa khớp gối mâm chày; hội chứng nẹp cẳng chân (Shin splints) ở người chạy bộ.',
    relations: {
      muscles: 'Cơ chày trước (Tibialis anterior), cơ chày sau, cơ dép, gân cơ bánh chè bám lồi củ chày.',
      bones: 'Khớp với xương đùi ở trên, xương mác ở ngoài, và xương sên (Talus) ở dưới.',
      nerves: 'Dây thần kinh mác sâu và thần kinh chày.',
      vessels: 'Động mạch chày trước và động mạch chày sau.'
    },
    lessonLink: '/cot-song/tu-the-va-van-dong',
    lessonTitle: 'Trục Cẳng Chân & Phục Hồi Khớp Cổ Chân',
    videoId: 'yU8C5r4N8w0'
  },

  'Fibula': {
    nameVi: 'Xương mác',
    nameLatin: 'Fibula (TA2: 1172)',
    nameEn: 'Fibula (Calf bone)',
    regionVi: 'Chi dưới (Cẳng chân)',
    systemVi: 'Hệ Xương',
    description: 'Xương mảnh nằm ở phía ngoài cẳng chân, song song với xương chày. Đầu trên là chỏm mác, đầu dưới mở rộng tạo nên mắt cá ngoài.',
    function: 'Không chịu tải chính mà là nơi bám của nhiều nhóm cơ cẳng chân; mắt cá ngoài đóng vai trò then chốt giữ vững mộng chày - mác cổ chân.',
    clinical: 'Tổn thương thần kinh mác chung vòng quanh cổ xương mác gây liệt bàn chân rủ (không nhấc mũi chân lên được); gãy mắt cá ngoài trong lật cổ chân.',
    relations: {
      muscles: 'Cơ mác dài, cơ mác ngắn, cơ gấp ngón cái dài, cơ dép.',
      bones: 'Tiếp khớp với xương chày ở khớp chày mác trên và dưới; khớp với xương sên ở cổ chân.',
      nerves: 'Dây thần kinh mác chung (Common fibular nerve) uốn quanh cổ xương mác ngay dưới da.',
      vessels: 'Động mạch mác (Fibular artery) tách từ động mạch chày sau.'
    },
    lessonLink: '/cot-song/tu-the-va-van-dong',
    lessonTitle: 'Cổ Chân & Phòng Ngừa Lật Sơ Mi',
    videoId: 'yU8C5r4N8w0'
  },

  'Calcaneus': {
    nameVi: 'Xương gót chân',
    nameLatin: 'Calcaneus (TA2: 1184)',
    nameEn: 'Calcaneus (Heel bone)',
    regionVi: 'Bàn chân',
    systemVi: 'Hệ Xương',
    description: 'Xương lớn nhất và khỏe nhất trong khối xương cổ chân, nằm ở phía sau dưới bàn chân tạo nên hình dáng của gót chân.',
    function: 'Là điểm tựa chịu lực đầu tiên khi bước đi (gót chạm đất); điểm bám đòn bẩy của gân gót Achilles giúp kiễng gót và đẩy cơ thể về phía trước.',
    clinical: 'Viêm cân gan chân (Plantar fasciitis) gây đau thốn gót khi bước bước chân đầu tiên buổi sáng; gai xương gót; đứt gân gót Achilles.',
    relations: {
      muscles: 'Gân gót Achilles (Cơ bụng chân và cơ dép bám vào củ gót), cân gan chân, cơ dạng ngón cái.',
      bones: 'Khớp với xương sên ở trên (Khớp dưới sên) và xương hộp (Cuboid) ở phía trước.',
      nerves: 'Các nhánh thần kinh gan chân trong và gan chân ngoài.',
      vessels: 'Nhánh gót của động mạch chày sau và động mạch mác.'
    },
    lessonLink: '/cot-song/tu-the-va-van-dong',
    lessonTitle: 'Vòm Bàn Chân & Điểm Chạm Gót Sinh Cơ Học',
    videoId: 'yU8C5r4N8w0'
  },

  // === ĐAI VAI & CHI TRÊN (SHOULDER & UPPER LIMB) ===
  'Clavicle': {
    nameVi: 'Xương đòn (Xương quai xanh)',
    nameLatin: 'Clavicula (TA2: 1098)',
    nameEn: 'Clavicle (Collarbone)',
    regionVi: 'Chi trên (Đai vai)',
    systemVi: 'Hệ Xương',
    description: 'Xương dài cong hình chữ S nằm ngang ở nền cổ và phía trước trên lồng ngực, nối từ cán xương ức ra mỏm cùng vai.',
    function: 'Là thanh chống cơ học giữ cho khớp vai dang rộng ra ngoài lồng ngực, giúp cánh tay cử động tự do tối đa; bảo vệ bó mạch thần kinh dưới đòn.',
    clinical: 'Xương dễ gãy nhất cơ thể người (thường gãy ở vị trí 1/3 ngoài tiếp giáp 2/3 trong khi ngã chống tay hoặc đập vai).',
    relations: {
      muscles: 'Cơ ngực lớn, cơ ức đòn chũm, cơ delta, cơ thang, cơ dưới đòn.',
      bones: 'Khớp ức - đòn ở trong và khớp cùng vai - đòn (AC Joint) ở ngoài.',
      nerves: 'Đám rối thần kinh cánh tay chạy ngay phía sau dưới xương đòn.',
      vessels: 'Động mạch dưới đòn và tĩnh mạch dưới đòn nằm ngay sau xương.'
    },
    lessonLink: '/cot-song/tu-the-va-van-dong',
    lessonTitle: 'Đai Vai & Khớp Vai Linh Hoạt',
    videoId: 'fGjG7V3A2sQ'
  },

  'Scapula': {
    nameVi: 'Xương bả vai',
    nameLatin: 'Scapula (TA2: 1102)',
    nameEn: 'Scapula (Shoulder blade)',
    regionVi: 'Chi trên (Đai vai)',
    systemVi: 'Hệ Xương',
    description: 'Xương dẹt phẳng hình tam giác nằm ở mặt sau trên lồng ngực (ngang mức xương sườn 2 đến 7). Có gai vai, mỏm cùng vai, mỏm quạ và ổ chảo.',
    function: 'Trượt linh hoạt trên lồng ngực (khớp bả vai - lồng ngực), phối hợp nhịp nhàng với xương cánh tay tạo nên tầm vận động cực lớn của khớp vai.',
    clinical: 'Mất nhịp bả vai - cánh tay (Scapular dyskinesis); cánh vai nhô (Winged scapula) do liệt cơ răng trước (thần kinh ngực dài); viêm gân chóp xoay vai.',
    relations: {
      muscles: 'Nhóm cơ chóp xoay (Rotator cuff: Dưới vai, trên gai, dưới gai, tròn bé), cơ răng trước, cơ trám, cơ nâng vai.',
      bones: 'Khớp cùng vai đòn với xương đòn; ổ chảo (Glenoid cavity) tiếp khớp chỏm xương cánh tay.',
      nerves: 'Thần kinh trên vai (Suprascapular nerve), thần kinh ngực dài (Long thoracic nerve).',
      vessels: 'Động mạch trên vai, động mạch dưới vai.'
    },
    lessonLink: '/cot-song/tu-the-va-van-dong',
    lessonTitle: 'Khớp Vai & Cân Bằng Bả Vai - Cánh Tay',
    videoId: 'fGjG7V3A2sQ'
  },

  'Humerus': {
    nameVi: 'Xương cánh tay',
    nameLatin: 'Humerus (TA2: 1118)',
    nameEn: 'Humerus (Arm bone)',
    regionVi: 'Chi trên (Cánh tay)',
    systemVi: 'Hệ Xương',
    description: 'Xương dài lớn nhất chi trên. Đầu trên có chỏm hình bán cầu, củ lớn, củ bé; thân xương hình lăng trụ có rãnh xoắn thần kinh quay; đầu dưới có lồi cầu, ròng rọc và hai mỏm trên lồi cầu.',
    function: 'Là đòn bẩy truyền lực cho toàn bộ chi trên, thực hiện các động tác nâng, đẩy, xoay và ném.',
    clinical: 'Gãy cổ phẫu thuật xương cánh tay ở người lớn tuổi; gãy thân xương cánh tay dễ tổn thương thần kinh quay gây bàn tay rủ; gãy trên lồi cầu ở trẻ em.',
    relations: {
      muscles: 'Cơ delta, cơ nhị đầu cánh tay, cơ tam đầu cánh tay, cơ cánh tay trước.',
      bones: 'Khớp vai ở trên (Khớp ổ chảo - cánh tay); khớp khuỷu ở dưới với xương quay và xương trụ.',
      nerves: 'Dây thần kinh quay (Radial nerve) chạy sát rãnh xoắn; thần kinh nách ở cổ phẫu thuật; thần kinh trụ ở rãnh sau mỏm trên lồi cầu trong.',
      vessels: 'Động mạch cánh tay (Brachial artery) và động mạch cánh tay sâu.'
    },
    lessonLink: '/cot-song/tu-the-va-van-dong',
    lessonTitle: 'Khớp Khuỷu & Cánh Tay Khỏe Mạnh',
    videoId: 'fGjG7V3A2sQ'
  },

  'Radius': {
    nameVi: 'Xương quay',
    nameLatin: 'Radius (TA2: 1127)',
    nameEn: 'Radius',
    regionVi: 'Chi trên (Cẳng tay)',
    systemVi: 'Hệ Xương',
    description: 'Xương dài nằm ở phía ngoài cẳng tay (phía ngón tay cái). Đầu trên có đài quay khớp với xương trụ và xương cánh tay; đầu dưới to mở rộng khớp với cổ tay.',
    function: 'Đảm nhiệm động tác sấp và ngửa cẳng tay bằng cách quay quanh trục xương trụ; là trục truyền lực chính từ bàn tay lên cẳng tay.',
    clinical: 'Gãy Colles đầu dưới xương quay (biến dạng cổ tay hình dĩa) khi ngã chống bàn tay xuống đất; trật chỏm quay ở trẻ nhỏ khi bị kéo giật tay.',
    relations: {
      muscles: 'Cơ nhị đầu bám củ quay, cơ sấp tròn, cơ ngửa, cơ cánh tay quay.',
      bones: 'Khớp quay trụ trên và dưới với xương trụ; khớp với xương thuyền và xương nguyệt ở cổ tay.',
      nerves: 'Dây thần kinh quay và thần kinh giữa.',
      vessels: 'Động mạch quay (Radial artery - vị trí bắt mạch cổ tay quen thuộc).'
    },
    lessonLink: '/cot-song/tu-the-va-van-dong',
    lessonTitle: 'Cổ Tay & Ngón Tay Linh Hoạt',
    videoId: 'fGjG7V3A2sQ'
  },

  'Ulna': {
    nameVi: 'Xương trụ',
    nameLatin: 'Ulna (TA2: 1122)',
    nameEn: 'Ulna',
    regionVi: 'Chi trên (Cẳng tay)',
    systemVi: 'Hệ Xương',
    description: 'Xương dài nằm ở phía trong cẳng tay (phía ngón út). Đầu trên rất to có mỏm khuỷu và mỏm vẹt tạo nên khớp bản lề vững chắc với ròng rọc xương cánh tay.',
    function: 'Tạo trục ổn định cho động tác gấp duỗi khớp khuỷu và là điểm tựa cho xương quay thực hiện động tác sấp ngửa.',
    clinical: 'Vỡ mỏm khuỷu do ngã đập khuỷu tay; chèn ép dây thần kinh trụ tại rãnh khuỷu (Hội chứng đường hầm khuỷu tay) gây tê ngón út và áp út.',
    relations: {
      muscles: 'Cơ tam đầu cánh tay bám mỏm khuỷu, cơ gấp cổ tay trụ, cơ gấp sâu các ngón tay.',
      bones: 'Khớp với ròng rọc xương cánh tay tại khớp khuỷu; khớp với xương quay ở hai đầu.',
      nerves: 'Dây thần kinh trụ (Ulnar nerve) chạy ngay sau mỏm trên lồi cầu trong sát mỏm khuỷu.',
      vessels: 'Động mạch trụ (Ulnar artery) chạy dọc mặt trước cẳng tay.'
    },
    lessonLink: '/cot-song/tu-the-va-van-dong',
    lessonTitle: 'Khớp Khuỷu & Phòng Tránh Tê Bì Bàn Tay',
    videoId: 'fGjG7V3A2sQ'
  },

  // === ĐẦU - MẶT - SỌ (CRANIUM & FACE) ===
  'Frontal bone': {
    nameVi: 'Xương trán',
    nameLatin: 'Os frontale (TA2: 890)',
    nameEn: 'Frontal bone',
    regionVi: 'Đầu - Mặt - Cổ',
    systemVi: 'Hệ Xương',
    description: 'Xương dẹt đơn tạo nên vòm trán, trần ổ mắt và phần trước nền sọ. Bên trong chứa xoang trán thông với ngách mũi giữa.',
    function: 'Bảo vệ thùy trán của đại não (trung tâm tư duy, điều hành, vận động chủ động và cảm xúc); định hình khung khuôn mặt trên.',
    clinical: 'Viêm xoang trán gây đau nhức âm ỉ vùng trán mắt; chấn thương nứt vỡ vòm sọ trán trong va chạm giao thông.',
    relations: {
      muscles: 'Cơ trán (Bụng trán của cơ chẩm trán), cơ cau mày, cơ vòng mắt.',
      bones: 'Khớp với hai xương đỉnh ở khớp vành, khớp với xương bướm, xương sàng, xương gò má và xương mũi.',
      nerves: 'Thần kinh trên ổ mắt và thần kinh trên ròng rọc (nhánh V1 của thần kinh sinh ba).',
      vessels: 'Động mạch trên ổ mắt và động mạch trên ròng rọc (nhánh của động mạch mắt).'
    },
    lessonLink: '/cot-song/dot-song-co',
    lessonTitle: 'Hệ Thần Kinh Trung Ương & Hộp Sọ',
    videoId: 'fGjG7V3A2sQ'
  },

  'Mandible': {
    nameVi: 'Xương hàm dưới',
    nameLatin: 'Mandibula (TA2: 953)',
    nameEn: 'Mandible (Lower jaw)',
    regionVi: 'Đầu - Mặt - Cổ',
    systemVi: 'Hệ Xương',
    description: 'Xương lớn nhất, khỏe nhất và là xương duy nhất có thể cử động được trong khối xương đầu mặt. Gồm thân hình móng ngựa và hai ngành hàm với mỏm vẹt và mỏm lồi cầu.',
    function: 'Mang hàm răng dưới, thực hiện các cử động nhai, nuốt, phát âm và tạo hình cằm.',
    clinical: 'Rối loạn khớp thái dương hàm (TMD/TMJ) gây lục cục khi há miệng và đau cơ cắn; gãy góc hàm hoặc lồi cầu hàm trong ẩu đả hoặc va chạm ngã cằm.',
    relations: {
      muscles: '4 cơ nhai cực khỏe: Cơ cắn (Masseter), cơ thái dương (Temporalis), cơ chân bướm trong và ngoài.',
      bones: 'Khớp thái dương hàm (TMJ) tiếp khớp với hõm khớp của xương thái dương.',
      nerves: 'Dây thần kinh hàm dưới (V3) và thần kinh huyệt răng dưới chạy trong ống hàm dưới.',
      vessels: 'Động mạch mặt và động mạch huyệt răng dưới (nhánh động mạch hàm).'
    },
    lessonLink: '/cot-song/dot-song-co',
    lessonTitle: 'Khớp Thái Dương Hàm & Cơ Nhai',
    videoId: 'fGjG7V3A2sQ'
  },

  // === HỆ TIÊU HÓA, GAN MẬT, TỤY & NỘI TẠNG ===
  'Gallbladder': {
    nameVi: 'Túi mật',
    nameLatin: 'Vesica biliaris (TA2: 2988)',
    nameEn: 'Gallbladder',
    regionVi: 'Bụng trên (Hạ sườn phải)',
    systemVi: 'Hệ Tiêu Hóa (Gan Mật)',
    description: 'Túi hình quả lê nằm ở mặt dưới thùy phải của gan, trong hố túi mật. Dài khoảng 7-10 cm, dung tích 30-50 ml, gồm đáy, thân, phễu và cổ tiếp nối với ống túi mật.',
    function: 'Dự trữ và cô đặc mật do gan tiết ra (tới 5-10 lần). Khi thức ăn chứa chất béo vào tá tràng, hormone Cholecystokinin (CCK) kích thích túi mật co bóp tống mật qua ống mật chủ vào tá tràng để nhũ hóa mỡ.',
    clinical: 'Sỏi túi mật (Cholelithiasis), viêm túi mật cấp (Acute cholecystitis) với nghiệm pháp Murphy (+), polyp túi mật. Phẫu thuật cắt túi mật nội soi là can thiệp ngoại khoa phổ biến hàng đầu.',
    relations: {
      muscles: 'Nằm sau thành bụng trước tại điểm giao nhau giữa bờ ngoài cơ thẳng bụng phải và sụn sườn 9 (Điểm đau Murphy).',
      bones: 'Đối chiếu lên thành ngực tương ứng đầu sụn sườn 9 bên phải.',
      nerves: 'Chi phối bởi đám rối tạng (Celiac plexus), thần kinh X và thần kinh hoành phải (gây phản xạ đau nhói lên mỏm vai phải).',
      vessels: 'Động mạch túi mật (Cystic artery) xuất phát từ nhánh phải động mạch gan riêng (chạy trong tam giác Calot).'
    },
    lessonLink: '/tieu-hoa/gan-mat-tuy',
    lessonTitle: 'Túi Mật: Sinh Lý Bài Tiết & Bệnh Lý Sỏi Mật',
    videoId: '3ZfVjV7VqJ8'
  },

  'Pancreas': {
    nameVi: 'Tuyến tụy (Tụy tạng)',
    nameLatin: 'Pancreas (TA2: 3000)',
    nameEn: 'Pancreas',
    regionVi: 'Sau phúc mạc tầng trên ổ bụng',
    systemVi: 'Hệ Tiêu Hóa & Nội Tiết',
    description: 'Tuyến hỗn hợp mềm màu xám hồng dài 12-15 cm vắt ngang thành bụng sau từ quai tá tràng đến rốn lách. Gồm 4 phần: đầu tụy (ôm bởi tá tràng), cổ, thân và đuôi tụy chạm rốn lách.',
    function: 'Ngoại tiết: Tiết 1.5 - 2 lít dịch tụy mỗi ngày chứa men phân giải thức ăn (Amylase, Lipase, Trypsin). Nội tiết: Các tiểu đảo Langerhans tiết Insulin (hạ đường huyết) và Glucagon (tăng đường huyết).',
    clinical: 'Viêm tụy cấp do rượu hoặc sỏi kẹt bóng Vater (đau bụng dữ dội xuyên ra sau lưng, amylase/lipase máu tăng cao); đái tháo đường; ung thư đầu tụy gây tắc mật vàng da tiến triển (dấu hiệu Courvoisier).',
    relations: {
      muscles: 'Áp sát cơ hoành và cơ thắt lưng chậu (Psoas) trái ở thành bụng sau.',
      bones: 'Nằm vắt ngang trước cột sống ngang mức đốt sống thắt lưng L1 - L2.',
      nerves: 'Đám rối thần kinh tạng (Celiac plexus) chi phối đường dẫn truyền đau tạng hướng tâm ra lưng.',
      vessels: 'Mạng mạch phong phú từ động mạch thân tạng và động mạch mạc treo tràng trên (các động mạch tá tụy trên và dưới).'
    },
    lessonLink: '/tieu-hoa/gan-mat-tuy',
    lessonTitle: 'Tuyến Tụy: Giải Phẫu & Chức Năng Nội / Ngoại Tiết',
    videoId: '3ZfVjV7VqJ8'
  },

  'Spleen': {
    nameVi: 'Lá lách (Tỳ)',
    speakTextVi: 'Lá lách',
    nameLatin: 'Splen / Lien (TA2: 3880)',
    nameEn: 'Spleen',
    regionVi: 'Hạ sườn trái (Sau dạ dày)',
    systemVi: 'Hệ Bạch Huyết & Miễn Dịch',
    description: 'Cơ quan lympho lớn nhất cơ thể, hình hạt cà phê mềm màu đỏ tím nằm sâu trong ô dưới hoành trái, dài ~12 cm, nặng 150-200g, có mặt hoành lồi và rốn lách ở mặt tạng.',
    function: 'Miễn dịch học: Sản xuất kháng thể, nhận diện và tiêu diệt vi khuẩn, kháng nguyên lạ qua tủy trắng. Lọc máu: Tủy đỏ phá hủy hồng cầu già vỡ, tái chế sắt và dự trữ tiểu cầu dự phòng.',
    clinical: 'Chấn thương vỡ lách do va đập kín hạ sườn trái gây mất máu cấp ổ bụng nguy kịch; cường lách (Splenomegaly) gây giảm tiểu cầu và bạch cầu máu ngoại vi.',
    relations: {
      muscles: 'Nằm sát mặt dưới vòm hoành trái, ngăn cách với đáy phổi và màng phổi trái.',
      bones: 'Được bảo vệ bởi xương sườn 9, 10, 11 bên trái; trục dài của lách song song với xương sườn 10.',
      nerves: 'Đám rối lách (Splenic plexus) từ đám rối thân tạng.',
      vessels: 'Động mạch lách (Splenic artery) uốn lượn ngoằn ngoèo trên bờ trên tụy; tĩnh mạch lách đổ về tĩnh mạch cửa.'
    },
    lessonLink: '/bach-huyet/la-lach-mien-dich',
    lessonTitle: 'Lá Lách: Cơ Quan Miễn Dịch & Bộ Lọc Máu Cơ Thể',
    videoId: '3ZfVjV7VqJ8'
  },

  'Left ventricle': {
    nameVi: 'Tâm thất trái',
    nameLatin: 'Ventriculus sinister cordis (TA2: 3820)',
    nameEn: 'Left ventricle',
    regionVi: 'Lồng ngực (Trung thất giữa)',
    systemVi: 'Hệ Tim Mạch (Tim & Buồng Tim)',
    description: 'Buồng tim cơ bắp dày nhất (thành cơ tim 8-12 mm, gấp 3 lần thất phải), tạo nên đỉnh tim (mỏm tim) và phần lớn mặt sau dưới của quả tim. Nhận máu giàu oxy từ nhĩ trái qua van hai lá và bơm vào động mạch chủ qua van tổ chim.',
    function: 'Chiếc bơm áp lực cao chính của hệ tuần hoàn, tạo áp lực tâm thu 100-140 mmHg tống máu nuôi toàn bộ mô tế bào cơ thể.',
    clinical: 'Phì đại thất trái do tăng huyết áp vô căn hoặc hẹp van động mạch chủ; suy tim trái ứ huyết (gây phù phổi cấp, khó thở khi nằm kịch phát ban đêm); nhồi máu cơ tim thất trái do tắc nhánh liên thất trước (LAD).',
    relations: {
      muscles: 'Cơ tim thất trái dày đặc, có hai cột cơ (trước và sau) giữ thừng gân van hai lá.',
      bones: 'Mỏm tim đập ở khoang liên sườn 5 đường trung đòn trái.',
      nerves: 'Đám rối thần kinh tim (hệ tự chủ: giao cảm tăng nhịp, phế vị giảm nhịp).',
      vessels: 'Cấp máu bởi động mạch liên thất trước (LAD) và động mạch mũ từ ĐM vành trái.'
    },
    lessonLink: '/tim-mach/cac-buong-tim',
    lessonTitle: 'Tâm Thất Trái & Động Học Tuần Hoàn Đại Tuần Hoàn',
    videoId: '3ZfVjV7VqJ8'
  },

  'Right ventricle': {
    nameVi: 'Tâm thất phải',
    nameLatin: 'Ventriculus dexter cordis (TA2: 3810)',
    nameEn: 'Right ventricle',
    regionVi: 'Lồng ngực (Trung thất giữa)',
    systemVi: 'Hệ Tim Mạch (Tim & Buồng Tim)',
    description: 'Buồng tim hình tam giác nằm ở mặt trước xương ức của quả tim. Nhận máu nghèo oxy từ nhĩ phải qua van ba lá và tống máu lên phổi qua thân động mạch phổi.',
    function: 'Bơm áp lực thấp (tâm thu 15-30 mmHg) tống máu lên tiểu tuần hoàn phổi để trao đổi khí oxy và CO2.',
    clinical: 'Suy tim phải (gây phù mắt cá chân, gan to đàn xếp, phản hồi gan - tĩnh mạch cổ nổi (+)); thuyên tắc động mạch phổi cấp tính gây tâm phế cấp (Cor pulmonale).',
    relations: {
      muscles: 'Thành cơ tim dày 3-5 mm, có ba cột cơ gắn van ba lá và dải điều hòa (Moderator band).',
      bones: 'Nằm ngay sau thân xương ức và các sụn sườn 4 - 6.',
      nerves: 'Chi phối bởi đám rối thần kinh tim nông và sâu.',
      vessels: 'Cấp máu chủ yếu bởi động mạch vành phải (RCA) và nhánh bờ phải.'
    },
    lessonLink: '/tim-mach/cac-buong-tim',
    lessonTitle: 'Tâm Thất Phải & Tiểu Tuần Hoàn Phổi',
    videoId: '3ZfVjV7VqJ8'
  },

  'Ascending aorta': {
    nameVi: 'Động mạch chủ lên',
    nameLatin: 'Aorta ascendens (TA2: 3950)',
    nameEn: 'Ascending aorta',
    regionVi: 'Lồng ngực (Trung thất giữa)',
    systemVi: 'Hệ Tim Mạch (Đại Tuần Hoàn)',
    description: 'Đoạn đầu tiên của cây động mạch chủ, dài khoảng 5 cm, xuất phát từ lỗ van động mạch chủ của thất trái chạy chếch lên trên, sang phải và ra trước đến mức sụn sườn 2 phải thì tiếp nối cung động mạch chủ.',
    function: 'Chịu xung động áp lực máu tống cực đại từ tâm thất trái, đàn hồi co giãn (hiệu ứng Windkessel) giúp dòng máu chảy liên tục êm ả vào hệ thống mao mạch.',
    clinical: 'Phình bóc tách động mạch chủ ngực loại A (Stanford Type A Dissection - cấp cứu ngoại khoa tối khẩn cấp với tỷ lệ tử vong cao từng giờ); vôi hóa xơ vữa van động mạch chủ.',
    relations: {
      muscles: 'Nằm trong màng ngoài tim sợi, tiếp giáp thân động mạch phổi ở bên trái và nhĩ phải ở bên phải.',
      bones: 'Nằm sau cán xương ức và sụn sườn 2 - 3 bên phải.',
      nerves: 'Các nhánh thần kinh áp cảm thụ quan (Baroreceptors) từ xoang cảnh và quai ĐM chủ.',
      vessels: 'Phát sinh hai nhánh duy nhất: Động mạch vành phải và Động mạch vành trái từ xoang Valsalva.'
    },
    lessonLink: '/tim-mach/dong-mach-chu',
    lessonTitle: 'Cây Động Mạch Chủ & Bệnh Lý Phình Bóc Tách Ngực',
    videoId: '3ZfVjV7VqJ8'
  },

  'Diaphragm': {
    nameVi: 'Cơ hoành (Vòm hoành)',
    nameLatin: 'Diaphragma (TA2: 2150)',
    nameEn: 'Diaphragm',
    regionVi: 'Ranh giới Ngực - Bụng',
    systemVi: 'Hệ Cơ Hô Hấp',
    description: 'Tấm cơ - gân dẹt hình vòm đôi ngăn cách hoàn toàn khoang lồng ngực và ổ bụng. Gồm phần cơ ngoại vi bám vào xương ức, sườn, cột sống và tụ lại ở trung tâm gân (Centrum tendineum). Vòm hoành phải cao hơn vòm hoành trái khoảng 1 khoang liên sườn.',
    function: 'Cơ hô hấp chính yếu nhất cơ thể, đảm nhiệm 70-80% thể tích khí lưu thông hít vào bình thường; đồng thời tăng áp lực ổ bụng hỗ trợ rặn đẻ, đại tiện và nôn.',
    clinical: 'Thoát vị hoành (Hernia qua lỗ thực quản hoặc khe Bochdalek); liệt cơ hoành do tổn thương thần kinh hoành (C3-C5); nấc cụt do co thắt đột ngột cơ hoành.',
    relations: {
      muscles: 'Liên tục với cơ ngang bụng, cơ thắt lưng chậu (Psoas) và cơ vuông thắt lưng.',
      bones: 'Bám vào mỏm mũi kiếm xương ức, mặt trong 6 sụn sườn dưới và các đốt sống thắt lưng L1 - L3.',
      nerves: 'Thần kinh hoành (Phrenic nerve) bắt nguồn từ rễ cổ C3, C4, C5 chi phối vận động duy nhất.',
      vessels: 'Động mạch hoành trên, động mạch hoành dưới (nhánh ĐM chủ bụng) và động mạch cơ hoành.'
    },
    lessonLink: '/ho-hap/co-hoanh-dong-hoc',
    lessonTitle: 'Cơ Hoành: Cơ Sinh Học Hô Hấp & Ứng Dụng Lâm Sàng',
    videoId: '3ZfVjV7VqJ8'
  },

  'Trachea': {
    nameVi: 'Khí quản',
    nameLatin: 'Trachea (TA2: 3200)',
    nameEn: 'Trachea',
    regionVi: 'Cổ & Trung thất trên',
    systemVi: 'Hệ Hô Hấp',
    description: 'Ống dẫn khí hình trụ dẹp phía sau, dài 11-13 cm, đường kính 2 cm, cấu tạo bởi 16-20 vòng sụn hình chữ C hở phía sau được nối kín bởi cơ khí quản. Bắt đầu từ sụn nhẫn (C6) xuống đến trạc ba khí quản (Carina - mức T4-T5).',
    function: 'Dẫn khí, sưởi ấm, tạo độ ẩm và lọc bụi bẩn nhờ biểu mô trụ giả tầng có lông chuyển và lớp chất nhầy bảo vệ.',
    clinical: 'Thủ thuật mở khí quản cấp cứu (Tracheostomy) ở khoang nhẫn giáp hoặc đốt sụn 2-3; hóc dị vật đường thở kẹt ở Carina; xẹp khí quản (Tracheomalacia).',
    relations: {
      muscles: 'Thành sau là cơ trơn khí quản tiếp giáp trực tiếp mặt trước thực quản.',
      bones: 'Chạy dọc phía trước cột sống cổ và ngực trên.',
      nerves: 'Dây thần kinh thanh quản quặt ngược (nhánh Thần kinh X) nằm trong rãnh khí thực quản.',
      vessels: 'Động mạch giáp dưới và các nhánh phế quản của động mạch chủ ngực.'
    },
    lessonLink: '/ho-hap/khi-phe-quan',
    lessonTitle: 'Khí Quản: Cấu Tạo Giải Phẫu & Kỹ Thuật Mở Khí Quản',
    videoId: '3ZfVjV7VqJ8'
  },

  'Superior lobe of left lung': {
    nameVi: 'Thùy trên phổi trái',
    nameLatin: 'Lobus superior pulmonis sinistri',
    nameEn: 'Superior lobe of left lung',
    regionVi: 'Lồng ngực trái',
    systemVi: 'Hệ Hô Hấp (Phổi)',
    description: 'Thùy trên của phổi trái, chiếm phần lớn mặt trước và đỉnh phổi trái, ngăn cách với thùy dưới bởi khe chếch. Có khuyết tim sâu ở bờ trước và mỏm lưỡi (Lingula) tương đương thùy giữa phổi phải.',
    function: 'Trao đổi khí O2 và CO2 cho các phân thùy đỉnh, sau, trước và vùng lưỡi.',
    clinical: 'Viêm thùy phổi, lao phổi (thường khu trú đỉnh phổi thùy trên), u phế quản thùy trên phổi.',
    relations: {
      muscles: 'Áp sát thành lồng ngực và cơ liên sườn phía trước bên.',
      bones: 'Nằm sau xương đòn và các xương sườn 1 đến 6 bên trái.',
      nerves: 'Đám rối phổi trước và sau.',
      vessels: 'Nhánh thùy trên của động mạch phổi trái và tĩnh mạch phổi trên trái.'
    },
    lessonLink: '/ho-hap/phoi-va-mang-phoi',
    lessonTitle: 'Phổi Trái: Các Phân Thùy & Rốn Phổi',
    videoId: '3ZfVjV7VqJ8'
  },

  'Liver': {
    nameVi: 'Gan',
    nameLatin: 'Hepar (TA2: 2940)',
    nameEn: 'Liver',
    regionVi: 'Hạ sườn phải & Thượng vị',
    systemVi: 'Hệ Tiêu Hóa (Gan Mật)',
    description: 'Tạng đặc lớn nhất cơ thể (1.4 - 1.8 kg), hình nêm nằm dưới vòm hoành phải, gồm 2 thùy lớn (phải, trái) chia thành 8 phân thùy Couinaud độc lập về mạch máu và đường mật.',
    function: 'Nhà máy chuyển hóa hóa sinh: Sản xuất dịch mật tiêu hóa lipid, tổng hợp albumin và yếu tố đông máu, khử độc thuốc, dự trữ glycogen, sắt và các vitamin A, D, B12.',
    clinical: 'Viêm gan virus B/C, gan nhiễm mỡ (NAFLD/NASH), xơ gan tăng áp lực tĩnh mạch cửa (gây cổ trướng, giãn vỡ tĩnh mạch thực quản), ung thư biểu mô tế bào gan (HCC).',
    relations: {
      muscles: 'Mặt hoành áp sát vòm cơ hoành phải; mặt tạng tựa lên dạ dày, tá tràng và thận phải.',
      bones: 'Được lồng ngực bảo vệ từ xương sườn 5 đến bờ sườn phải sườn 10.',
      nerves: 'Đám rối gan (Hepatic plexus) từ thân tạng và các nhánh thần kinh phế vị.',
      vessels: 'Hệ mạch máu kép: 75% máu từ tĩnh mạch cửa (giàu chất dinh dưỡng) và 25% từ động mạch gan riêng (giàu oxy).'
    },
    lessonLink: '/tieu-hoa/gan-mat-tuy',
    lessonTitle: 'Lá Gan: Nhà Máy Chuyển Hóa & Khử Độc Sinh Học',
    videoId: '3ZfVjV7VqJ8'
  },

  'Kidney': {
    nameVi: 'Thận',
    nameLatin: 'Ren (TA2: 3040)',
    nameEn: 'Kidney',
    regionVi: 'Sau phúc mạc hai bên cột sống thắt lưng',
    systemVi: 'Hệ Tiết Niệu',
    description: 'Hai cơ quan hình hạt đậu màu nâu đỏ (thận phải thấp hơn thận trái ~1.5 cm do gan đè lên), kích thước 12 x 6 x 3 cm, có bờ ngoài lồi và bờ trong lõm nơi có rốn thận.',
    function: 'Lọc 180 lít huyết tương mỗi ngày tạo 1.5 - 2 lít nước tiểu; đào thải ure, creatinin; cân bằng nước - điện giải - toan kiềm; tiết Renin điều hòa huyết áp và Erythropoietin kích thích tủy xương tạo hồng cầu.',
    clinical: 'Cơn đau quặn thận do sỏi thận/niệu quản; viêm cầu thận; suy thận cấp và suy thận mạn giai đoạn cuối.',
    relations: {
      muscles: 'Tựa lên cơ thắt lưng chậu (Psoas) và cơ vuông thắt lưng ở thành bụng sau.',
      bones: 'Cực trên thận trái ngang xương sườn 11, cực trên thận phải ngang xương sườn 12.',
      nerves: 'Đám rối thần kinh thận từ hạch tạng.',
      vessels: 'Động mạch thận xuất phát trực tiếp từ động mạch chủ bụng; tĩnh mạch thận đổ vào tĩnh mạch chủ dưới.'
    },
    lessonLink: '/tiet-nieu/than-va-loc-mau',
    lessonTitle: 'Hệ Tiết Niệu: Giải Phẫu Quả Thận & Cơ Chế Lọc Nước Tiểu',
    videoId: '3ZfVjV7VqJ8'
  },

  'Duodenum': {
    nameVi: 'Tá tràng',
    nameLatin: 'Duodenum (TA2: 2920)',
    nameEn: 'Duodenum',
    regionVi: 'Thượng vị & Quanh rốn',
    systemVi: 'Hệ Tiêu Hóa',
    description: 'Đoạn đầu ruột non dài 25 cm uốn hình chữ C ôm trọn đầu tụy, gồm 4 phần: trên (hành tá tràng), xuống, ngang và lên. Phần xuống có bóng Vater nơi dịch mật và dịch tụy cùng đổ vào.',
    function: 'Tiếp nhận dưỡng trấp từ dạ dày, trung hòa axit vị toan nhờ dịch kiềm từ tụy và dịch mật; tiêu hóa thức ăn bằng enzyme tụy và ruột non.',
    clinical: 'Loét hành tá tràng do vi khuẩn Helicobacter pylori (đau đói, đau về đêm); hẹp môn vị tá tràng; thủng ổ loét tá tràng.',
    relations: {
      muscles: 'Nằm áp sát thành bụng sau trên cơ thắt lưng chậu phải.',
      bones: 'Vắt ngang các đốt sống thắt lưng L1, L2, L3.',
      nerves: 'Đám rối thân tạng và đám rối mạc treo tràng trên.',
      vessels: 'Cấp máu bởi các nhánh động mạch tá tụy trên và dưới.'
    },
    lessonLink: '/tieu-hoa/duong-ruot',
    lessonTitle: 'Tá Tràng: Cửa Ngõ Tiêu Hóa Thức Ăn',
    videoId: '3ZfVjV7VqJ8'
  },

  'Bile duct': {
    nameVi: 'Ống mật (Đường dẫn mật)',
    nameLatin: 'Ductus choledochus (TA2: 2995)',
    nameEn: 'Bile duct',
    regionVi: 'Cuống gan & Sau tá tràng',
    systemVi: 'Hệ Tiêu Hóa (Gan Mật)',
    description: 'Ống dẫn mật chính dài 7-8 cm hợp thành từ ống gan chung và ống túi mật, chạy xuống sau tá tràng và đầu tụy trước khi đổ vào nhú tá lớn.',
    function: 'Dẫn lưu mật từ gan và túi mật xuống tá tràng liên tục phục vụ quá trình tiêu hóa chất béo.',
    clinical: 'Sỏi ống mật chủ gây tam chứng Charcot (Đau - Sốt - Vàng da); viêm đường mật cấp tính; u đường mật Klatskin.',
    relations: {
      muscles: 'Nằm trong dây chằng gan - tá tràng (bờ tự do mạc nối nhỏ).',
      bones: 'Đối chiếu vùng thượng vị và hạ sườn phải.',
      nerves: 'Đám rối thần kinh gan.',
      vessels: 'Chạy song song cùng động mạch gan riêng và tĩnh mạch cửa (bộ ba cuống gan).'
    },
    lessonLink: '/tieu-hoa/gan-mat-tuy',
    lessonTitle: 'Đường Dẫn Mật & Sỏi Mật',
    videoId: '3ZfVjV7VqJ8'
  },

  'Stomach': {
    nameVi: 'Dạ dày (Bao tử)',
    nameLatin: 'Gaster / Ventriculus (TA2: 2890)',
    nameEn: 'Stomach',
    regionVi: 'Thượng vị & Hạ sườn trái',
    systemVi: 'Hệ Tiêu Hóa',
    description: 'Đoạn phình to nhất của ống tiêu hóa hình chữ J, dung tích 1 - 1.5 lít, gồm tâm vị, phình vị lớn (đáy vị), thân vị, hang môn vị và môn vị.',
    function: 'Tiếp nhận, nhào trộn thức ăn bằng 3 lớp cơ trơn (dọc, vòng, chéo); tiết axit HCl và enzyme Pepsin phân cắt protein.',
    clinical: 'Viêm loét dạ dày (Gastritis), trào ngược dạ dày thực quản (GERD), xuất huyết tiêu hóa do vỡ ổ loét hoặc giãn tĩnh mạch, ung thư dạ dày.',
    relations: {
      muscles: 'Thành dạ dày có 3 lớp cơ trơn dày; áp sát vòm cơ hoành trái.',
      bones: 'Nằm sau khung sườn sụn trái từ sườn 5 đến sườn 9.',
      nerves: 'Dây thần kinh phế vị (Thần kinh X) trước và sau.',
      vessels: 'Vòng mạch bờ cong nhỏ (ĐM vị trái & phải) và vòng mạch bờ cong lớn (ĐM vị mạc nối trái & phải).'
    },
    lessonLink: '/tieu-hoa/da-day-va-ruot',
    lessonTitle: 'Dạ Dày: Cấu Trúc Cơ Học & Chức Năng Tiêu Hóa',
    videoId: '3ZfVjV7VqJ8'
  },

  // === HỆ THỐNG NÃO THẤT & DỊCH NÃO TỦY (VENTRICULAR SYSTEM & CSF) ===
  'Lateral ventricle': {
    nameVi: 'Não thất bên (Não thất I & II)',
    nameLatin: 'Ventriculus lateralis (TA2: 5493)',
    nameEn: 'Lateral ventricle',
    regionVi: 'Đầu - Bán cầu đại não',
    systemVi: 'Hệ Thần Kinh (Hệ Thống Não Thất & Dịch Não Tủy - CSF)',
    description: 'Hai khoang chứa dịch não tủy lớn nhất hình chữ C uốn cong đối xứng sâu bên trong hai bán cầu đại não. Gồm sừng trán (sừng trước), thân não thất, sừng chẩm (sừng sau) và sừng thái dương (sừng dưới) ôm cong quanh đồi thị.',
    function: 'Tiếp nhận dịch não tủy do đám rối màng mạch (Choroid plexus) tiết ra (~500ml/ngày), tạo đệm thủy lực chống va đập cơ học cho não bộ và tham gia chu trình thanh thải độc tố hệ Glymphatic.',
    relationsText: 'Chu trình lưu thông dịch não tủy: Dịch từ Đám rối màng mạch não thất bên chảy qua Lỗ gian não thất (Lỗ Monro) đổ vào Não thất ba; tiếp giáp thể chai (Corpus callosum) ở trần, đồi thị và nhân đuôi ở sàn, vách trong suốt ngăn đôi ở thành trong.',
    clinical: 'Giãn não thất bên do tắc lỗ Monro hoặc não úng thủy áp lực bình thường (NPH - tam chứng Adams: sa sút trí tuệ, rối loạn dáng đi, tiểu không tự chủ); đo chỉ số Evans trên CT/MRI sọ não chẩn đoán Não úng thủy (Hydrocephalus).',
    relations: {
      muscles: 'Được bảo vệ trong hộp sọ kín, không tiếp xúc cơ vân trực tiếp.',
      bones: 'Nằm sâu dưới vòm sọ gồm xương trán, xương đỉnh, xương chẩm và xương thái dương.',
      nerves: 'Bao quanh bởi chất trắng não, thể chai, vòm não (Fornix), đồi thị và các hạch nền não.',
      vessels: 'Đám rối màng mạch não thất bên được cấp máu bởi ĐM màng mạch trước (nhánh ĐM cảnh trong) và ĐM màng mạch sau (nhánh ĐM não sau); tĩnh mạch nội não dẫn lưu về TM Galen.'
    },
    lessonLink: '/than-kinh/he-nao-that-va-csf',
    lessonTitle: 'Hệ Não Thất & Vòng Tuần Hoàn Dịch Não Tủy (CSF)',
    videoId: '3ZfVjV7VqJ8'
  },

  'Lateral ventricle.l': {
    nameVi: 'Não thất bên (trái)',
    nameLatin: 'Ventriculus lateralis sinister (TA2: 5493)',
    nameEn: 'Left lateral ventricle',
    regionVi: 'Đầu - Bán cầu đại não trái',
    systemVi: 'Hệ Thần Kinh (Hệ Thống Não Thất & Dịch Não Tủy - CSF)',
    description: 'Khoang chứa dịch não tủy hình chữ C đối xứng sâu trong bán cầu đại não trái, ôm cong quanh đồi thị trái.',
    function: 'Tiếp nhận và lưu chuyển dịch não tủy do đám rối màng mạch trái tiết ra, bảo vệ bán cầu đại não trái.',
    relationsText: 'Dẫn lưu dịch não tủy qua lỗ Monro trái vào Não thất ba; tiếp giáp thể chai, nhân đuôi và vách trong suốt.',
    clinical: 'Tắc lỗ Monro trái gây giãn đơn độc não thất bên trái, tăng áp lực nội sọ khu trú.',
    relations: {
      muscles: 'Bảo vệ kín trong hộp sọ.',
      bones: 'Xương trán, đỉnh, chẩm, thái dương bên trái.',
      nerves: 'Chất trắng bán cầu đại não trái, thể chai, vòm não.',
      vessels: 'Động mạch màng mạch trước và sau bên trái.'
    },
    lessonLink: '/than-kinh/he-nao-that-va-csf',
    lessonTitle: 'Hệ Não Thất & Vòng Tuần Hoàn Dịch Não Tủy (CSF)',
    videoId: '3ZfVjV7VqJ8'
  },

  'Lateral ventricle.r': {
    nameVi: 'Não thất bên (phải)',
    nameLatin: 'Ventriculus lateralis dexter (TA2: 5493)',
    nameEn: 'Right lateral ventricle',
    regionVi: 'Đầu - Bán cầu đại não phải',
    systemVi: 'Hệ Thần Kinh (Hệ Thống Não Thất & Dịch Não Tủy - CSF)',
    description: 'Khoang chứa dịch não tủy hình chữ C đối xứng sâu trong bán cầu đại não phải, ôm cong quanh đồi thị phải.',
    function: 'Tiếp nhận và lưu chuyển dịch não tủy do đám rối màng mạch phải tiết ra, bảo vệ bán cầu đại não phải.',
    relationsText: 'Dẫn lưu dịch não tủy qua lỗ Monro phải vào Não thất ba; tiếp giáp thể chai, nhân đuôi và vách trong suốt.',
    clinical: 'Tắc lỗ Monro phải gây giãn đơn độc não thất bên phải, tăng áp lực nội sọ khu trú.',
    relations: {
      muscles: 'Bảo vệ kín trong hộp sọ.',
      bones: 'Xương trán, đỉnh, chẩm, thái dương bên phải.',
      nerves: 'Chất trắng bán cầu đại não phải, thể chai, vòm não.',
      vessels: 'Động mạch màng mạch trước và sau bên phải.'
    },
    lessonLink: '/than-kinh/he-nao-that-va-csf',
    lessonTitle: 'Hệ Não Thất & Vòng Tuần Hoàn Dịch Não Tủy (CSF)',
    videoId: '3ZfVjV7VqJ8'
  },

  'Third ventricle': {
    nameVi: 'Não thất ba',
    nameLatin: 'Ventriculus tertius (TA2: 5410)',
    nameEn: 'Third ventricle',
    regionVi: 'Đầu - Gian não (Diencephalon)',
    systemVi: 'Hệ Thần Kinh (Hệ Thống Não Thất & Dịch Não Tủy - CSF)',
    description: 'Khoang hẹp hình khe nằm dọc chính giữa đường giữa của gian não, kẹp giữa hai đồi thị và vùng hạ đồi, nối thông với hai não thất bên qua lỗ Monro và nối với não thất tư qua cống não Sylvius.',
    function: 'Nhận toàn bộ dòng dịch não tủy từ hai não thất bên, bổ sung dịch não tủy do đám rối màng mạch não thất ba tiết ra và hướng dòng dịch chảy xuôi xuống cống não Sylvius.',
    relationsText: 'Chu trình lưu thông: Nhận dịch não tủy từ hai lỗ Monro → Não thất ba → Dẫn dịch chảy vào Cống não Sylvius. Hai thành bên là đồi thị và vùng hạ đồi; sàn là giao thoa thị giác, củ xám, cuống tuyến yên; trần là vòm não.',
    clinical: 'U nang dạng keo não thất ba (Colloid cyst) có thể gây tắc nghẽn cấp tính dòng chảy CSF gây tăng áp lực nội sọ kịch phát, đau đầu dữ dội khi thay đổi tư thế, tụt kẹt não đe dọa tính mạng.',
    relations: {
      muscles: 'Nằm sâu trong khối gian não, không có cơ trực tiếp.',
      bones: 'Nằm phía trên thân xương bướm và hố yên.',
      nerves: 'Tiếp giáp hai đồi thị (Thalamus), vùng hạ đồi (Hypothalamus), giao thoa thị giác (Optic chiasm) và vòm não (Fornix).',
      vessels: 'Được cấp máu bởi động mạch màng mạch sau trong (nhánh ĐM não sau); tĩnh mạch não trong chạy trên trần.'
    },
    lessonLink: '/than-kinh/he-nao-that-va-csf',
    lessonTitle: 'Hệ Não Thất & Vòng Tuần Hoàn Dịch Não Tủy (CSF)',
    videoId: '3ZfVjV7VqJ8'
  },

  'Aqueduct of midbrain': {
    nameVi: 'Cống não Sylvius (Cống trung não)',
    nameLatin: 'Aqueductus mesencephali / Aqueductus cerebri (TA2: 5396)',
    nameEn: 'Aqueduct of midbrain (Cerebral aqueduct)',
    regionVi: 'Đầu - Trung não (Midbrain)',
    systemVi: 'Hệ Thần Kinh (Hệ Thống Não Thất & Dịch Não Tủy - CSF)',
    description: 'Ống dẫn hẹp dài khoảng 1.5 - 2 cm, đường kính chỉ khoảng 1 - 2 mm, chạy dọc qua trung não để nối thông khoang Não thất ba với Não thất tư.',
    function: 'Là eo thắt huyết mạch dẫn toàn bộ dịch não tủy từ bán cầu đại não và gian não thoát xuống hố sau (não thất tư và tủy sống).',
    relationsText: 'Chu trình lưu thông: Nối từ Não thất ba → xuyên qua Trung não → đổ vào Não thất tư. Phía trước là cuống đại não (Tegmentum), phía sau là củ não sinh tư (Tectum), bao quanh là chất xám quanh cống não (PAG).',
    clinical: 'Vị trí dễ bị tắc nghẽn nhất trong toàn bộ hệ thần kinh trung ương (Hẹp cống não bẩm sinh hoặc do khối u chèn ép hố sau) → Ứ trệ dịch gây Não úng thủy tắc nghẽn (Obstructive hydrocephalus), giãn to não thất ba và hai não thất bên.',
    relations: {
      muscles: 'Nằm sâu trong trung tâm trung não, không tiếp giáp cơ.',
      bones: 'Nằm ngang mức xương chẩm và dốc nền xương bướm.',
      nerves: 'Bao quanh bởi chất xám quanh cống não (PAG), nhân thần kinh vận nhãn (TK III) và nhân thần kinh ròng rọc (TK IV).',
      vessels: 'Được cấp máu bởi các nhánh xuyên của động mạch nền (Basilar artery) và động mạch não sau.'
    },
    lessonLink: '/than-kinh/he-nao-that-va-csf',
    lessonTitle: 'Cống Não Sylvius & Cơ Chế Não Úng Thủy Tắc Nghẽn',
    videoId: '3ZfVjV7VqJ8'
  },

  'Fourth ventricle': {
    nameVi: 'Não thất tư',
    nameLatin: 'Ventriculus quartus (TA2: 5313)',
    nameEn: 'Fourth ventricle',
    regionVi: 'Đầu - Trám não & Hố sau',
    systemVi: 'Hệ Thần Kinh (Hệ Thống Não Thất & Dịch Não Tủy - CSF)',
    description: 'Khoang hình thoi (hố trám) nằm ở hố sọ sau, phía trước là cầu não và hành tủy, phía sau là tiểu não, thông lên trên với cống não Sylvius và liên tục xuống dưới với ống trung tâm tủy sống.',
    function: 'Cửa thoát duy nhất của dịch não tủy từ hệ thống não thất ra khoang dưới nhện bao quanh toàn bộ não và tủy sống thông qua 3 lỗ: 1 lỗ giữa (Magendie) và 2 lỗ bên (Luschka).',
    relationsText: 'Chu trình lưu thông: Nhận dịch từ Cống Sylvius → thoát qua 3 lỗ (Magendie & Luschka) → đổ vào Bể lớn (Cisterna magna) và Khoang dưới nhện (Subarachnoid space) bao quanh não & tủy sống.',
    clinical: 'Hội chứng Dandy-Walker (teo thùy giun tiểu não, bít tắc lỗ thoát dịch não thất tư tạo nang khổng lồ); dị tật Chiari (hạnh nhân tiểu não tụt qua lỗ chẩm chèn ép hành tủy và cản trở lưu thông dịch não tủy).',
    relations: {
      muscles: 'Được bảo vệ bởi khối cơ dưới chẩm và cơ thang phía sau gáy.',
      bones: 'Nằm tựa trên dốc nền xương chẩm phía trước và vảy chẩm phía sau.',
      nerves: 'Sàn hố trám chứa nhân các dây thần kinh sọ quan trọng (TK VI, VII, VIII, IX, X, XII) và trung tâm hô hấp, tuần hoàn.',
      vessels: 'Được cấp máu bởi động mạch tiểu não sau dưới (PICA) và động mạch tiểu não trước dưới (AICA).'
    },
    lessonLink: '/than-kinh/he-nao-that-va-csf',
    lessonTitle: 'Não Thất Tư & 3 Cửa Thoát Dịch Não Tủy (Magendie - Luschka)',
    videoId: '3ZfVjV7VqJ8'
  },

  'Choroid plexus': {
    nameVi: 'Đám rối màng mạch (Sinh dịch não tủy)',
    nameLatin: 'Plexus choroideus (TA2: 5500)',
    nameEn: 'Choroid plexus',
    regionVi: 'Đầu - Các buồng não thất',
    systemVi: 'Hệ Thần Kinh (Hệ Thống Não Thất & Dịch Não Tủy - CSF)',
    description: 'Mạng lưới mao mạch vi nhung mao giàu mạch máu phủ lớp tế bào biểu mô màng mạch có nguồn gốc từ màng mềm (Pia mater), nhô vào lòng các não thất bên, não thất ba và não thất tư.',
    function: 'Sản xuất và bài tiết hơn 80% tổng lượng dịch não tủy (CSF) của cơ thể (khoảng 400 - 600 ml/ngày) bằng cơ chế vận chuyển tích cực và siêu lọc huyết tương; đóng vai trò hàng rào máu - dịch não tủy (BCSFB).',
    relationsText: 'Nằm trong lòng các não thất bên (chạy từ sừng thái dương qua thân não thất đến lỗ Monro), não thất ba và não thất tư; liên tục bài tiết dịch não tủy tạo áp lực dòng chảy tuần hoàn liên tục.',
    clinical: 'U nhú đám rối màng mạch (Choroid plexus papilloma) gây tăng tiết dịch não tủy quá mức hoặc chảy máu não thất gây Não úng thủy giao thông (Communicating hydrocephalus).',
    relations: {
      muscles: 'Nằm lơ lửng trong dịch não tủy bên trong các buồng não thất.',
      bones: 'Bảo vệ an toàn sâu trong hộp sọ.',
      nerves: 'Chi phối bởi các sợi thần kinh thực vật tự chủ điều hòa bài tiết.',
      vessels: 'Động mạch màng mạch trước (nhánh ĐM cảnh trong), các động mạch màng mạch sau ngoài và sau trong (nhánh ĐM não sau).'
    },
    lessonLink: '/than-kinh/he-nao-that-va-csf',
    lessonTitle: 'Đám Rối Màng Mạch & Cơ Chế Sản Sinh Dịch Não Tủy',
    videoId: '3ZfVjV7VqJ8'
  },

  'Choroid plexus.l': {
    nameVi: 'Đám rối màng mạch trái (Sinh dịch não tủy)',
    nameLatin: 'Plexus choroideus sinister (TA2: 5500)',
    nameEn: 'Left choroid plexus',
    regionVi: 'Đầu - Não thất bên trái',
    systemVi: 'Hệ Thần Kinh (Hệ Thống Não Thất & Dịch Não Tủy - CSF)',
    description: 'Mạng vi mạch màng mềm nhô vào lòng não thất bên trái, liên tục sản sinh dịch não tủy làm đầy não thất bên trái.',
    function: 'Tiết dịch não tủy vô khuẩn giàu dưỡng chất nuôi dưỡng tế bào thần kinh và bảo vệ nhu mô não.',
    relationsText: 'Chạy uốn lượn trong lòng não thất bên trái, hội tụ về phía lỗ Monro bên trái.',
    clinical: 'Chảy máu não thất do vỡ dị dạng mạch đám rối màng mạch bên trái.',
    relations: {
      muscles: 'Nằm kín trong hộp sọ.',
      bones: 'Xương sọ bán cầu trái.',
      nerves: 'Tiếp giáp đồi thị và vòm não bên trái.',
      vessels: 'Động mạch màng mạch trước và sau bên trái.'
    },
    lessonLink: '/than-kinh/he-nao-that-va-csf',
    lessonTitle: 'Đám Rối Màng Mạch & Cơ Chế Sản Sinh Dịch Não Tủy',
    videoId: '3ZfVjV7VqJ8'
  },

  'Choroid plexus.r': {
    nameVi: 'Đám rối màng mạch phải (Sinh dịch não tủy)',
    nameLatin: 'Plexus choroideus dexter (TA2: 5500)',
    nameEn: 'Right choroid plexus',
    regionVi: 'Đầu - Não thất bên phải',
    systemVi: 'Hệ Thần Kinh (Hệ Thống Não Thất & Dịch Não Tủy - CSF)',
    description: 'Mạng vi mạch màng mềm nhô vào lòng não thất bên phải, liên tục sản sinh dịch não tủy làm đầy não thất bên phải.',
    function: 'Tiết dịch não tủy vô khuẩn giàu dưỡng chất nuôi dưỡng tế bào thần kinh và bảo vệ nhu mô não.',
    relationsText: 'Chạy uốn lượn trong lòng não thất bên phải, hội tụ về phía lỗ Monro bên phải.',
    clinical: 'Chảy máu não thất do vỡ dị dạng mạch đám rối màng mạch bên phải.',
    relations: {
      muscles: 'Nằm kín trong hộp sọ.',
      bones: 'Xương sọ bán cầu phải.',
      nerves: 'Tiếp giáp đồi thị và vòm não bên phải.',
      vessels: 'Động mạch màng mạch trước và sau bên phải.'
    },
    lessonLink: '/than-kinh/he-nao-that-va-csf',
    lessonTitle: 'Đám Rối Màng Mạch & Cơ Chế Sản Sinh Dịch Não Tủy',
    videoId: '3ZfVjV7VqJ8'
  },

  'Spinal dura': {
    nameVi: 'Màng cứng tủy sống & Hộp sọ',
    nameLatin: 'Dura mater spinalis (TA2: 5128)',
    nameEn: 'Spinal dura mater',
    regionVi: 'Cột sống & Ống sống',
    systemVi: 'Hệ Thần Kinh (Màng Não Tủy & Bao Dịch Não Tủy)',
    description: 'Màng xơ collagen dày đặc, dai chắc bọc ngoài cùng của tủy sống, kéo dài từ lỗ chẩm (Foramen magnum) xuống tận đốt sống cùng S2 tạo thành túi màng cứng (Thecal sac).',
    function: 'Tạo bao kín chứa màng nhện, khoang dưới nhện và toàn bộ dịch não tủy bao bọc tủy sống; bảo vệ cơ học chống lại lực uốn cong, kéo giãn của cột sống.',
    relationsText: 'Chu trình dịch não tủy: Bên trong màng cứng là màng nhện và khoang dưới nhện chứa dòng dịch não tủy lưu thông từ não xuống bao quanh tủy sống đến tận bể thắt lưng L2-S2. Phía ngoài là khoang ngoài màng cứng (Epidural space) chứa mỡ và đám rối tĩnh mạch.',
    clinical: 'Vị trí gây tê ngoài màng cứng (Epidural anesthesia) trong giảm đau đẻ; và chọc dò dịch não tủy (Lumbar puncture) qua màng cứng vào khoang dưới nhện tại khe đốt sống L3-L4 hoặc L4-L5 an toàn vì tủy sống đã kết thúc ở tầng L1-L2.',
    relations: {
      muscles: 'Cơ dựng gai sống, cơ nhiều chân và các dây chằng vàng, dây chằng gian gai bảo vệ phía sau.',
      bones: 'Nằm trong ống sống tạo bởi thân các đốt sống và cung đốt sống từ C1 đến S2.',
      nerves: 'Bao bọc tủy sống, nón tủy và chùm đuôi ngựa; các rễ thần kinh gai sống xuyên qua màng cứng.',
      vessels: 'Đám rối tĩnh mạch ngoài màng cứng Batson, động mạch gai sống trước và sau.'
    },
    lessonLink: '/than-kinh/mang-nao-tuy-va-choc-do-csf',
    lessonTitle: 'Màng Cứng Tủy Sống & Giải Phẫu Chọc Dò Dịch Não Tủy',
    videoId: '3ZfVjV7VqJ8'
  }
};

/**
 * Intelligent Academic Anatomical Lookup with Fallback
 * Generates accurate anatomical metadata, 3-tier core explanation (Là gì, Ý nghĩa là gì, Liên kết ra sao),
 * clean medical pronunciation, and 4-way relations for ANY mesh in the 3D atlas
 */
export function getClinicalData(partId, baseName) {
  if (!partId && !baseName) return null;

  const raw = baseName || partId;
  const nom = getAnatomyNomenclature(raw);

  // 1. Direct hit on clinical database (by full partId, baseName, or cleanBase)
  let matched = CLINICAL_DATABASE[partId] || (baseName && CLINICAL_DATABASE[baseName]) || CLINICAL_DATABASE[nom.cleanBase];

  // 2. Keyword substring hit
  if (!matched) {
    const target = `${partId} ${baseName || ''} ${nom.cleanBase}`.toLowerCase();
    for (const [key, data] of Object.entries(CLINICAL_DATABASE)) {
      if (target.includes(key.toLowerCase()) || key.toLowerCase().includes(nom.cleanBase.toLowerCase())) {
        matched = data;
        break;
      }
    }
  }

  if (matched) {
    const result = { ...matched, relations: { ...matched.relations } };
    if (nom.side) {
      const sideVi = nom.side === 'left' ? 'trái' : 'phải';
      const hasSideAlready = result.nameVi.toLowerCase().includes('trái') || result.nameVi.toLowerCase().includes('phải');
      if (!hasSideAlready) {
        result.nameVi = `${result.nameVi} (${sideVi})`;
      }
      if (!result.nameLatin.toLowerCase().includes(nom.sideLatin.toLowerCase())) {
        result.nameLatin = `${result.nameLatin} (${nom.sideLatin})`;
      }
      if (!result.nameEn.toLowerCase().includes(nom.sideEn.toLowerCase())) {
        result.nameEn = `${result.nameEn} (${nom.sideEn})`;
      }
      // Accurate Vietnamese pronunciation with lateral side (e.g. "Não thất bên trái")
      if (hasSideAlready) {
        result.speakTextVi = result.nameVi.replace(/[()]/g, ' ');
      } else {
        result.speakTextVi = `${matched.nameVi} ${sideVi}`;
      }
    } else {
      result.speakTextVi = matched.nameVi;
    }

    result.speakTextVi = result.speakTextVi
      .replace(/\([A-Z0-9_:\s.-]+\)/gi, '')
      .replace(/[()]/g, ' ')
      .replace(/[._]/g, ' ')
      .replace(/\s+/g, ' ')
      .trim();

    if (!result.relationsText) {
      const rel = result.relations;
      result.relationsText = `Tiếp giáp và liên kết với: Cơ (${rel?.muscles || 'mô cơ vùng'}). Xương (${rel?.bones || 'khung xương lân cận'}). Thần kinh (${rel?.nerves || 'nhánh thần kinh khu vực'}). Mạch máu (${rel?.vessels || 'mạng mạch nuôi dưỡng'}).`;
    }
    return result;
  }

  // 3. Fallback academic anatomical inference
  return generateFallbackAcademicData(partId, baseName, nom);
}

function generateFallbackAcademicData(partId, baseName, passedNom) {
  const nom = passedNom || getAnatomyNomenclature(baseName || partId);
  const nameVi = nom.nameVi;
  const nameLatin = nom.nameLatin;
  const nameEn = nom.nameEn;
  const speakTextVi = (nom.speakTextVi || nom.nameVi)
    .replace(/\([A-Z0-9_:\s.-]+\)/gi, '')
    .replace(/[()]/g, ' ')
    .replace(/[._]/g, ' ')
    .replace(/\s+/g, ' ')
    .trim();
  const cleanBase = nom.cleanBase;
  const lower = cleanBase.toLowerCase();

  // 1. Regional inference
  let regionVi = 'Thân mình & Tứ chi';
  if (/cran|scalp|head|face|facial|front|pariet|occipit|tempor|nasal|oral|eye|orbit|ear|mandib|maxill|zygomat|bucc|mental|masseter/i.test(lower)) {
    regionVi = 'Đầu & Mặt';
  } else if (/neck|cervic|throat|laryng|pharyng|thyroid|carotid|jugular|hyoid|platysma/i.test(lower)) {
    regionVi = 'Cổ';
  } else if (/thorac|chest|rib|costal|sternum|pectoral|intercostal|mediastin|heart|cardio|aort|pulmon|lung|pleura/i.test(lower)) {
    regionVi = 'Lồng ngực';
  } else if (/abdomin|stomach|gastr|liver|hepat|gall|pancrea|spleen|splen|intestin|duoden|jejun|ileum|colon|mesenter|omentum/i.test(lower)) {
    regionVi = 'Ổ bụng';
  } else if (/pelvi|sacr|coccyx|pubi|isch|iliac|bladder|ureter|urethr|prostat|uter|ovary|rectum/i.test(lower)) {
    regionVi = 'Chậu hông & Đáy chậu';
  } else if (/vertebra|spine|spinal|disc|erector|multifidus/i.test(lower)) {
    regionVi = 'Cột sống & Lưng';
  } else if (/scapul|clavicl|shoulder|deltoid|axill|brachi|arm|humerus|radius|ulna|forearm|carpal|wrist|metacarpal|hand|finger/i.test(lower)) {
    regionVi = 'Chi trên (Vai - Tay)';
  } else if (/hip|glute|femur|thigh|quadricep|hamstring|patella|knee|poplite|tibia|fibula|leg|calf|soleus|gastrocn|ankle|tarsal|calcane|talus|metatarsal|foot|toe/i.test(lower)) {
    regionVi = 'Chi dưới (Hông - Chân)';
  }

  // 2. Tissue & System classification
  let systemVi = 'Hệ Giải Phẫu';
  let desc = `Cấu trúc giải phẫu ${nameVi} (${cleanBase}), định danh quốc tế theo Terminologia Anatomica.`;
  let func = 'Đóng vai trò quan trọng trong việc nâng đỡ cấu trúc, truyền lực cơ học hoặc tham gia điều hòa sinh lý cơ thể.';
  let relationsText = `Nằm tại phân vùng ${regionVi}, tiếp giáp các bó cơ, màng xương và được cấp máu bởi mạng vi mạch thần kinh lân cận.`;
  let clin = 'Cần được bảo vệ tránh chấn thương trực tiếp, viêm dính mô hạt hoặc chèn ép cơ học kéo dài.';
  let lessonLink = '/giai-phau-tong-quan';
  let lessonTitle = 'Kiến Thức Giải Phẫu & Vận Động Đúng';

  let muscles = 'Liên kết với các bó cơ sâu và màng cơ cục bộ quanh vùng giải phẫu.';
  let bones = 'Tiếp giáp và liên kết với khung xương trục hoặc xương chi lân cận.';
  let nerves = 'Được chi phối bởi các nhánh thần kinh ngoại biên tương ứng theo từng đốt tủy.';
  let vessels = 'Được nuôi dưỡng bởi các nhánh động mạch và mạng lưới vi mạch cục bộ.';

  const isBrainVentricle = /ventricle\.[lr]|lateral ventricle|third ventricle|fourth ventricle|aqueduct|choroid plexus|spinal dura/i.test(lower) || nameVi.includes('Não thất') || nameVi.includes('Cống não') || nameVi.includes('màng mạch') || nameVi.includes('Màng cứng');
  const isHeart = !isBrainVentricle && (nameVi.includes('thất') || nameVi.includes('nhĩ') || nameVi.includes('tim') || nameVi.includes('Van') || /ventric|atrium|heart|myocard|valv|septum/i.test(lower));
  const isFascia = nameVi.startsWith('Cân') || nameVi.startsWith('Mạc') || nameVi.startsWith('Hãm gân') || /aponeurosis|fascia|retinaculum|sheath/i.test(lower);
  const isMuscle = !isFascia && !isHeart && !isBrainVentricle && (nameVi.startsWith('Cơ') || /muscle|belly|head of |adductor|abductor|extensor|flexor|pronator|supinator|levator|depressor|tensor|rotator|platysma|sartorius|gracilis|masseter|temporalis|trapezius|latissimus|deltoid|pectoralis|biceps|triceps|quadriceps|gastrocnemius|soleus|gluteus|psoas|iliacus|scalenus|splenius|rhomboid|infraspinatus|supraspinatus/i.test(lower));
  const isBoneJoint = nameVi.startsWith('Xương') || nameVi.startsWith('Sụn') || nameVi.startsWith('Khớp') || nameVi.startsWith('Dây chằng') || nameVi.startsWith('Đốt sống') || /bone|\bos\b|vertebra|process|tubercle|spine|crest|cartilage|meniscus|joint|ligament/i.test(lower);
  const isArtery = nameVi.startsWith('Động mạch') || /artery|aort|trunk/i.test(lower);
  const isVein = nameVi.startsWith('Tĩnh mạch') || /vein|vena|sinus/i.test(lower);
  const isNerve = nameVi.startsWith('Dây thần kinh') || nameVi.startsWith('Thần kinh') || /nerve|plexus|ganglion|\bcord\b/i.test(lower);
  const isLymph = nameVi.startsWith('Hạch') || nameVi.startsWith('Bạch huyết') || nameVi.startsWith('Ống ngực') || /\b(?:lymph|lymphatic|cisterna|thoracic duct)\b/i.test(lower) || (/\bnode\b/i.test(lower) && !isMuscle && !isBoneJoint);
  const isResp = nameVi.includes('Phổi') || nameVi.includes('Khí quản') || /lung|bronch|trachea|pleura/i.test(lower);
  const isDigest = nameVi.includes('Dạ dày') || nameVi.includes('Gan') || nameVi.includes('Mật') || nameVi.includes('Tụy') || nameVi.includes('Ruột') || /stomach|liver|gall|pancrea|intestin|colon|duct|oesophag|esophag/i.test(lower);
  const isUrinary = nameVi.includes('Thận') || nameVi.includes('Bàng quang') || nameVi.includes('Niệu') || /kidney|ureter|bladder|urethr|prostat/i.test(lower);

  if (isBrainVentricle) {
    systemVi = 'Hệ Thần Kinh (Hệ Thống Não Thất & Dịch Não Tủy - CSF)';
    desc = `Cấu trúc não thất / màng não dẫn lưu dịch não tủy ${nameVi} (${cleanBase}) thuộc hệ thống các khoang chứa và tuần hoàn dịch não tủy (CSF) bảo vệ thần kinh trung ương.`;
    func = 'Chứa đựng, sản sinh hoặc dẫn truyền dòng dịch não tủy, giảm chấn động cơ học cho não bộ (đệm thủy lực) và tham gia chu trình thanh thải độc tố hệ Glymphatic.';
    relationsText = `Nằm trong hệ thống não thất và khoang dưới nhện tại vùng ${regionVi}; thông thương liên tục từ hai bán cầu đại não qua cống Sylvius xuống não thất tư và tủy sống.`;
    muscles = 'Được bảo vệ tuyệt đối bên trong hộp sọ và ống sống, không tiếp xúc cơ vân trực tiếp.';
    bones = 'Được che chở an toàn bởi các xương sọ và các cung đốt sống.';
    nerves = 'Tiếp giáp các cấu trúc thần kinh trung ương trọng yếu như đồi thị, thể chai, trung não và tủy sống.';
    vessels = 'Đám rối màng mạch được cấp máu bởi các nhánh động mạch màng mạch trước/sau; tĩnh mạch não trong dẫn lưu.';
    clin = 'Não úng thủy (Hydrocephalus) do tắc cống Sylvius hoặc lỗ Monro, tăng áp lực nội sọ, viêm màng não hoặc rò rỉ dịch não tủy.';
  } else if (isHeart) {
    systemVi = 'Hệ Tim Mạch (Tim & Buồng Tim)';
    desc = `Cấu trúc tim học ${nameVi} (${cleanBase}) thuộc khối cơ tim rỗng 4 buồng hoạt động như một chiếc bơm áp lực cao nhịp nhàng.`;
    func = 'Co bóp tống máu giàu oxy vào đại tuần hoàn hoặc máu nghèo oxy lên phổi, phối hợp đóng mở van tim ngăn dòng máu phụt ngược.';
    relationsText = `Nằm trong trung thất giữa khoang lồng ngực ${regionVi}; được bao bọc bởi màng ngoài tim (Pericardium), tiếp giáp xương ức phía trước, thực quản phía sau và hai lá phổi hai bên.`;
    muscles = 'Cấu tạo từ các lớp sợi cơ tim xoắn ốc (Myocardium) có tính tự động dẫn truyền xung động.';
    bones = 'Được bảo vệ phía trước bởi xương ức và các sụn sườn 3 - 6, phía sau tựa các đốt sống ngực T5 - T8.';
    nerves = 'Được điều hòa bởi hệ thần kinh tự chủ (Đám rối tim, Thần kinh X và chuỗi hạch giao cảm ngực).';
    vessels = 'Được nuôi dưỡng trực tiếp bởi hai nhánh động mạch vành (ĐM vành phải và ĐM vành trái).';
    clin = 'Nhồi máu cơ tim, suy tim sung huyết, hở/hẹp van tim, rối loạn nhịp tim hoặc phì đại tâm thất.';
  } else if (isFascia) {
    systemVi = 'Hệ Cơ & Mạc Liên Kết';
    desc = `Lớp mô liên kết sợi collagen dày đặc và bền chắc ${nameVi} (${cleanBase}), tạo thành màng bọc bảo vệ hoặc bản gân dẹt.`;
    func = 'Phân bố lực kéo cơ học đồng đều, cố định hướng trượt của các gân cơ, giảm ma sát chuyển động và duy trì khoang giải phẫu vững chắc.';
    relationsText = `Bao phủ bên ngoài hoặc xen giữa các nhóm cơ vùng ${regionVi}; bám chặt vào màng xương và liên tục với các vách gian cơ lân cận.`;
    muscles = 'Bao bọc các bó cơ lân cận, định hình hướng co cơ.';
    bones = 'Bám chắc vào các gờ xương, mào xương hoặc mỏm xương lân cận.';
    nerves = 'Chứa nhiều thụ thể nhận cảm bản thể (proprioception) và nhánh thần kinh cảm giác.';
    vessels = 'Mạng vi mạch tưới máu từ mô liên kết bao quanh.';
    clin = 'Viêm cân mạc (fasciitis), co rút mô sợi, dày dính sau phẫu thuật hoặc hội chứng chèn ép khoang cơ.';
  } else if (isMuscle) {
    systemVi = 'Hệ Cơ Bắp';
    desc = `Khối mô cơ vân ${nameVi} (${cleanBase}) gồm các bó sợi cơ có khả năng co rút chủ động sinh công động lực.`;
    func = 'Tạo lực vận động các khớp xương, ổn định tư thế giải phẫu, hỗ trợ bơm máu tĩnh mạch và sinh nhiệt nội sinh.';
    relationsText = `Xuất phát từ nguyên ủy trên xương/mạc, đi qua khớp và bám tận vào xương đích tại vùng ${regionVi}; tiếp giáp bao thần kinh mạch máu.`;
    muscles = 'Phối hợp với các cơ đồng vận và đối kháng trong chuỗi động học khu vực.';
    bones = 'Bám vào mấu xương qua gân cơ, tạo đòn bẩy cử động.';
    nerves = 'Được chi phối vận động và cảm giác bởi các sợi thần kinh vận động tương ứng.';
    vessels = 'Được tưới máu dồi dào bởi nhánh động mạch cơ và mạng mao mạch dày đặc.';
    clin = 'Căng rách sợi cơ, co thắt mạn tính hình thành điểm đau (Trigger points), teo cơ do bất động lâu ngày.';
  } else if (isBoneJoint) {
    systemVi = (nameVi.startsWith('Sụn') || /cartilage|meniscus/i.test(lower)) ? 'Hệ Sụn Khớp' : ((nameVi.startsWith('Dây chằng') || /ligament/i.test(lower)) ? 'Hệ Dây Chằng' : 'Hệ Xương');
    desc = `Cấu trúc xương/sụn vững chắc ${nameVi} (${cleanBase}), cấu tạo từ khung chất nền khoáng hóa và tế bào chuyên biệt.`;
    func = 'Chịu tải trọng cơ học của cơ thể, tạo khung nâng đỡ, bảo vệ tạng bên trong và làm điểm tựa đòn bẩy cho hệ cơ.';
    relationsText = `Tiếp khớp với các cấu trúc xương lân cận qua diện khớp tại vùng ${regionVi}; là nơi bám chắc của các dây chằng và gân cơ.`;
    muscles = 'Cung cấp diện bám chắc chắn cho gân của các cơ vận động.';
    bones = 'Khớp nối với các xương kế cận trong trục giải phẫu.';
    nerves = 'Màng xương được chi phối dày đặc bởi các sợi thần kinh cảm giác dẫn truyền đau.';
    vessels = 'Được nuôi dưỡng bởi động mạch màng xương và nhánh mạch nuôi xương sâu.';
    clin = 'Gãy nứt do chấn thương, viêm màng xương, thoái hóa bề mặt sụn khớp hoặc lỏng lẻo dây chằng.';
  } else if (isArtery) {
    systemVi = 'Hệ Tim Mạch (Động Mạch)';
    desc = `Mạch máu động mạch đàn hồi ${nameVi} (${cleanBase}) vận chuyển máu giàu oxy và chất dinh dưỡng nuôi mô bào.`;
    func = `Dẫn máu từ tim đến phân phối liên tục cho các cơ quan vùng ${regionVi}, duy trì huyết áp và tưới máu mô.`;
    relationsText = `Đi trong bao mạch thần kinh cùng tĩnh mạch đồng hành và dây thần kinh khu vực ${regionVi}; phân nhánh cấp máu sâu.`;
    muscles = 'Chạy dọc theo bờ các cơ mốc định vị giải phẫu.';
    bones = 'Nằm sát rãnh xương hoặc uốn quanh các mỏm xương.';
    nerves = 'Đi song song với các nhánh thần kinh ngoại biên cùng tên.';
    vessels = 'Nối tiếp với mạng lưới động mạch kế cận tạo vòng tuần hoàn bàng hệ.';
    clin = 'Xơ vữa thành mạch, hẹp tắc mạch gây thiếu máu cục bộ, phình mạch hoặc rách vỡ chấn thương.';
  } else if (isVein) {
    systemVi = 'Hệ Tim Mạch (Tĩnh Mạch)';
    desc = `Mạch máu tĩnh mạch có van một chiều ${nameVi} (${cleanBase}), thu gom máu nghèo oxy từ mô bào.`;
    func = 'Dẫn lưu máu hồi lưu về tim phải, tham gia điều hòa áp lực dịch kẽ và điều hòa thân nhiệt.';
    relationsText = `Đi kèm theo động mạch cùng tên hoặc nằm nông dưới da vùng ${regionVi}; đổ dần về các thân tĩnh mạch lớn hơn.`;
    muscles = 'Được các khối cơ xung quanh ép cơ học hỗ trợ dòng hồi lưu.';
    bones = 'Nằm áp sát xương hoặc trong các rãnh tĩnh mạch sọ/xương.';
    nerves = 'Đi cùng bao mô liên kết với các sợi thần kinh cảm giác.';
    vessels = 'Nối thông phong phú với các tĩnh mạch nông và sâu lân cận.';
    clin = 'Huyết khối tĩnh mạch sâu (DVT), suy giãn van tĩnh mạch, viêm tắc tĩnh mạch huyết khối.';
  } else if (isNerve) {
    systemVi = 'Hệ Thần Kinh';
    desc = `Dây/đám rối thần kinh ngoại biên ${nameVi} (${cleanBase}) chứa hàng ngàn sợi trục dẫn truyền xung động thần kinh.`;
    func = 'Chỉ huy vận động co cơ chủ động, truyền cảm giác xúc giác/đau/nhiệt về thần kinh trung ương và điều hòa tự chủ.';
    relationsText = `Chạy trong khoang liên cơ hoặc bao mạch thần kinh vùng ${regionVi}; chia nhánh tận chi phối các cơ và da tương ứng.`;
    muscles = 'Phân nhánh tận tạo synap bản vận động trên sợi cơ.';
    bones = 'Chui qua các lỗ, ống xương hoặc rãnh xương.';
    nerves = 'Xuất phát từ rễ thần kinh gai sống hoặc dây thần kinh sọ não.';
    vessels = 'Được nuôi dưỡng bởi mạng vi mạch thần kinh riêng biệt (Vasa nervorum).';
    clin = 'Hội chứng chèn ép thần kinh (tê bì, teo cơ, mất phản xạ), viêm đa dây thần kinh, đụng dập chấn thương.';
  } else if (isLymph) {
    systemVi = 'Hệ Bạch Huyết & Miễn Dịch';
    desc = `Cấu trúc hạch/mạch bạch huyết ${nameVi} (${cleanBase}) thuộc mạng lưới miễn dịch và thanh thải dịch kẽ cơ thể.`;
    func = 'Lọc sạch dịch bạch huyết, nhận diện và bắt giữ kháng nguyên lạ/vi khuẩn, sinh lympho bào và hoàn lưu dịch kẽ dư thừa.';
    relationsText = `Xếp thành chuỗi dọc theo các mạch máu lớn vùng ${regionVi}; liên kết hệ thống mao mạch bạch huyết nông và sâu.`;
    muscles = 'Nằm trong lớp mỡ lỏng lẻo giữa các cân mạc cơ.';
    bones = 'Tựa vào các hõm xương và vùng tam giác giải phẫu an toàn.';
    nerves = 'Được phân bố sợi thần kinh tự chủ điều hòa trương lực thành mạch.';
    vessels = 'Dẫn lưu dịch kẽ từ mao mạch và đổ về hệ thống tĩnh mạch lớn.';
    clin = 'Viêm sưng hạch phản ứng (Lymphadenitis), phù bạch huyết do tắc dòng dẫn lưu, di căn hạch ung thư.';
  } else if (isResp) {
    systemVi = 'Hệ Hô Hấp';
    desc = `Cơ quan hô hấp ${nameVi} (${cleanBase}) có cấu trúc phế nang hoặc ống dẫn khí đàn hồi.`;
    func = 'Dẫn khí, sưởi ấm, lọc sạch không khí và thực hiện trao đổi khí O2 - CO2 giữa phế nang và mao mạch.';
    relationsText = `Nằm trong khoang lồng ngực vùng ${regionVi}; áp sát màng phổi và các tạng trung thất.`;
    muscles = 'Phối hợp với cơ hoành và các cơ gian sườn trong chu kỳ hô hấp.';
    bones = 'Được bảo vệ bên ngoài bởi lồng ngực gồm xương sườn và xương ức.';
    nerves = 'Chi phối bởi đám rối thần kinh phổi và dây thần kinh hoành.';
    vessels = 'Tuần hoàn kép gồm động mạch phổi (chức phận) và động mạch phế quản (dinh dưỡng).';
    clin = 'Viêm phổi, hen phế quản, tràn dịch/tràn khí màng phổi, giãn phế quản.';
  } else if (isDigest) {
    systemVi = 'Hệ Tiêu Hóa & Gan Mật';
    desc = `Cơ quan tiêu hóa ${nameVi} (${cleanBase}) cấu tạo từ nhiều tầng biểu mô, tuyến tiết dịch và cơ trơn co bóp.`;
    func = 'Tiêu hóa thức ăn, tiết dịch enzyme phân giải chất hữu cơ, hấp thu dưỡng chất và chuyển hóa nội môi.';
    relationsText = `Nằm trong khoang phúc mạc ổ bụng vùng ${regionVi}; được treo và cố định bởi mạc nối, mạc treo.`;
    muscles = 'Thành tạng có lớp cơ trơn co bóp tạo sóng nhu động.';
    bones = 'Được bảo vệ một phần bởi khung sườn dưới và khung chậu.';
    nerves = 'Chi phối bởi hệ thần kinh phế vị (Thần kinh X) và đám rối tạng tự chủ.';
    vessels = 'Cấp máu bởi các thân động mạch tạng xuất phát từ động mạch chủ bụng.';
    clin = 'Viêm loét tiêu hóa, sỏi đường mật, tắc ruột, rối loạn tiêu hóa và hấp thu.';
  } else if (isUrinary) {
    systemVi = 'Hệ Tiết Niệu & Sinh Dục';
    desc = `Cơ quan tiết niệu ${nameVi} (${cleanBase}) cấu tạo từ mô lọc chuyên biệt (nephron) và ống dẫn nước tiểu.`;
    func = 'Lọc máu đào thải chất cặn bã chuyển hóa, cân bằng nước điện giải, điều hòa huyết áp và dẫn truyền nước tiểu.';
    relationsText = `Nằm sau phúc mạc hoặc trong tiểu khung vùng ${regionVi}; tiếp giáp các bó cơ thành bụng sau và mạch chậu.`;
    muscles = 'Tiếp giáp cơ thắt lưng lớn, cơ vuông thắt lưng và cơ đáy chậu.';
    bones = 'Được che chở bởi xương sườn 11-12 hoặc khung chậu xương.';
    nerves = 'Đám rối thận và đám rối hạ vị điều hòa bài tiết và co bóp.';
    vessels = 'Được cấp máu áp lực cao trực tiếp từ động mạch thận / động mạch chậu.';
    clin = 'Sỏi thận tiết niệu, viêm đường tiết niệu, suy thận, ứ nước bể thận.';
  }

  return {
    nameVi,
    nameLatin,
    nameEn,
    speakTextVi,
    regionVi,
    systemVi,
    description: desc,
    function: func,
    relationsText,
    clinical: clin,
    relations: {
      muscles,
      bones,
      nerves,
      vessels
    },
    lessonLink,
    lessonTitle,
    videoId: '3ZfVjV7VqJ8'
  };
}
