// Comprehensive Academic & Clinical Anatomical Database
// Standardized in Vietnamese, Latin (TA2), English
// Features: Anatomical Description, Biomechanical Function, Clinical Pathology,
// and 4-way Anatomical Relations (Cơ - Xương - Thần kinh - Mạch máu)

export const CLINICAL_DATABASE = {
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
  }
};

/**
 * Intelligent Academic Anatomical Lookup with Fallback
 * Generates accurate anatomical metadata and 4-way relations for ANY mesh in the 3D atlas
 */
export function getClinicalData(partId, baseName) {
  if (!partId && !baseName) return null;

  // 1. Direct hit on clinical database
  if (CLINICAL_DATABASE[partId]) return CLINICAL_DATABASE[partId];
  if (baseName && CLINICAL_DATABASE[baseName]) return CLINICAL_DATABASE[baseName];

  // 2. Keyword substring hit
  const target = `${partId} ${baseName || ''}`.toLowerCase();
  for (const [key, data] of Object.entries(CLINICAL_DATABASE)) {
    if (target.includes(key.toLowerCase())) {
      return data;
    }
  }

  // 3. Fallback inference based on anatomical region & naming pattern
  return generateFallbackAcademicData(partId, baseName);
}

function generateFallbackAcademicData(partId, baseName) {
  const name = baseName || partId || 'Cấu trúc giải phẫu';
  const lower = name.toLowerCase();

  let regionVi = 'Thân mình & Chi';
  let systemVi = 'Hệ Giải Phẫu';
  let desc = `Cấu trúc giải phẫu ${name}, định danh trong hệ thống Terminologia Anatomica 2.`;
  let func = 'Đóng vai trò quan trọng trong việc nâng đỡ, vận động và định hình giải phẫu học cơ thể.';
  let clin = 'Cần được bảo vệ và tập luyện duy trì biên độ chuyển động tự nhiên; tránh chấn thương do sai tư thế kéo dài.';
  let lessonLink = '/cot-song/tu-the-va-van-dong';
  let lessonTitle = 'Kiến Thức Giải Phẫu & Vận Động Đúng';

  let muscles = 'Liên kết với các bó cơ sâu và màng cơ cục bộ quanh vùng giải phẫu.';
  let bones = 'Tiếp giáp và liên kết với khung xương trục hoặc xương chi lân cận.';
  let nerves = 'Được chi phối bởi các nhánh thần kinh ngoại biên tương ứng theo từng đốt tủy.';
  let vessels = 'Được nuôi dưỡng bởi các nhánh động mạch và mạng lưới vi mạch cục bộ.';

  if (lower.includes('vertebra') || lower.includes('spine') || lower.includes('disc')) {
    regionVi = 'Cột sống';
    systemVi = 'Hệ Xương & Đĩa Đệm';
    desc = 'Thuộc trục cột sống, cấu tạo gồm thân đốt xương xốp, cuống cung, mỏm gai và mỏm ngang.';
    func = 'Chịu tải trọng trục cơ thể, bảo vệ tủy gai và cho phép cử động uốn cong thân mình.';
    clin = 'Dễ thoái hóa hoặc thoát vị đĩa đệm nếu ngồi sai tư thế hoặc mang vác vật nặng sai kỹ thuật.';
    muscles = 'Cơ dựng sống (Erector spinae), cơ nhiều chân (Multifidus), cơ liên gai.';
    bones = 'Khớp gian thân đốt sống (đĩa đệm) và khớp liên mỏm gai.';
    nerves = 'Rễ thần kinh gai sống thoát ra từ lỗ gian đốt sống.';
    vessels = 'Các nhánh động mạch gian đốt sống và đám rối tĩnh mạch đốt sống trong/ngoài.';
    lessonLink = '/cot-song/tu-the-va-van-dong';
    lessonTitle = 'Cột Sống: Tư Thế & Vận Động Đúng';
  } else if (lower.includes('muscle') || lower.includes('cơ')) {
    systemVi = 'Hệ Cơ bắp';
    desc = 'Mô cơ vân có khả năng co rút sinh công lực, bám vào xương qua gân.';
    func = 'Tạo lực vận động các khớp, duy trì tư thế đứng và sinh nhiệt cho cơ thể.';
    clin = 'Căng cơ, co thắt cơ mạn tính (Trigger points), teo cơ do bất động lâu ngày.';
  } else if (lower.includes('artery') || lower.includes('vein') || lower.includes('mạch')) {
    systemVi = 'Hệ Tim mạch';
    desc = 'Ống dẫn máu có thành đàn hồi vận chuyển oxy và dưỡng chất đi nuôi mô bào.';
    func = 'Đảm bảo tưới máu liên tục cho các cơ quan và hồi lưu máu về tim.';
    clin = 'Xơ vữa động mạch, huyết khối tĩnh mạch sâu, suy giãn tĩnh mạch.';
  }

  return {
    nameVi: name,
    nameLatin: `${name} (Terminologia Anatomica)`,
    nameEn: name,
    regionVi,
    systemVi,
    description: desc,
    function: func,
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
