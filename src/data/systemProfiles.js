// Academic & Clinical Profiles for Organ Systems & Functional Divisions
// Standardized according to Terminologia Anatomica (TA2) and Vietnamese Medical Nomenclature
// Provides 15s zero-fluff physiological audio summaries, key organ constituent anchors,
// model associations, and camera framing parameters for whole-system showcases.

export const SYSTEM_PROFILES = {
  digestive: {
    id: 'digestive',
    baseSystem: 'visceral',
    subType: 'digestive',
    nameVi: 'Hệ Tiêu hóa',
    nameLatin: 'Systema digestorium (TA2: 2795)',
    nameEn: 'Digestive system',
    icon: '🥣',
    badgeClass: 'sys-badge-digestive',
    badgeColor: '#f59e0b',
    count: 46,
    cameraAngle: { x: 0.35, y: 0.1, z: 0.93 },
    speech15s: 'Hệ tiêu hóa. Bao gồm ống tiêu hóa dài gần chín mét từ miệng, thực quản, dạ dày, ruột non, ruột già và các tuyến gan mật tụy, thực hiện nghiền nát, tiết enzym phân giải hóa học, hấp thụ dưỡng chất vào máu và đào thải cặn bã.',
    summary: 'Ống tiêu hóa từ miệng đến hậu môn cùng các tuyến tiêu hóa phụ trợ (gan, tụy, mật), đảm nhiệm tiếp nhận, tiêu hóa cơ học - hóa học, hấp thụ dinh dưỡng và đào thải cặn bã sinh học.',
    keyOrgans: [
      { nameVi: 'Dạ dày', partId: 'Stomach', latin: 'Gaster' },
      { nameVi: 'Gan', partId: 'Liver', latin: 'Hepar' },
      { nameVi: 'Túi mật & Đường mật', partId: 'Gallbladder', latin: 'Vesica biliaris' },
      { nameVi: 'Tuyến tụy', partId: 'Pancreas', latin: 'Pancreas' },
      { nameVi: 'Tá tràng', partId: 'Duodenum', latin: 'Duodenum' },
      { nameVi: 'Ruột non (Hỗng & Hồi tràng)', partId: 'Jejunum', latin: 'Intestinum tenue' },
      { nameVi: 'Ruột già & Đại tràng', partId: 'Ascending colon', latin: 'Colon' },
      { nameVi: 'Ruột thừa', partId: 'Vermiform appendix', latin: 'Appendix vermiformis' },
      { nameVi: 'Thực quản', partId: 'Esophagus', latin: 'Oesophagus' }
    ],
    keywords: [
      'hệ tiêu hóa', 'he tieu hoa', 'hệ tiêu hoá', 'tiêu hóa', 'tieu hoa', 'tiêu hoá',
      'ống tiêu hóa', 'ong tieu hoa', 'bộ máy tiêu hóa', 'bo may tieu hoa', 'digestive', 'digestive system'
    ]
  },

  cardiovascular: {
    id: 'cardiovascular',
    baseSystem: 'cardiovascular',
    subType: null,
    nameVi: 'Hệ Tim mạch & Tuần hoàn',
    nameLatin: 'Systema cardiovasculare (TA2: 3881)',
    nameEn: 'Cardiovascular system',
    icon: '🫀',
    badgeClass: 'sys-badge-cardiovascular',
    badgeColor: '#ef4444',
    count: 676,
    cameraAngle: { x: 0.3, y: 0.15, z: 0.94 },
    speech15s: 'Hệ tim mạch. Gồm quả tim bốn ngăn đóng vai trò máy bơm trung tâm và mạng lưới mạch máu dài hơn một trăm nghìn kilomet, vận chuyển oxy, dưỡng chất, hormone đến từng tế bào và thu gom chất thải chuyển hóa.',
    summary: 'Quả tim trung tâm kết hợp vòng đại tuần hoàn cơ thể và tiểu tuần hoàn phổi, tạo dòng chảy áp lực cao phân phối oxy, dưỡng chất và bảo vệ nội môi hằng định.',
    keyOrgans: [
      { nameVi: 'Quả tim (4 buồng tim)', partId: 'Heart', latin: 'Cor' },
      { nameVi: 'Động mạch chủ', partId: 'Ascending aorta', latin: 'Aorta' },
      { nameVi: 'Thân động mạch phổi', partId: 'Pulmonary trunk', latin: 'Truncus pulmonalis' },
      { nameVi: 'Tĩnh mạch chủ trên', partId: 'Superior vena cava', latin: 'Vena cava superior' },
      { nameVi: 'Tĩnh mạch chủ dưới', partId: 'Inferior vena cava', latin: 'Vena cava inferior' },
      { nameVi: 'Động mạch vành trái', partId: 'Left coronary artery', latin: 'Arteria coronaria sinistra' },
      { nameVi: 'Động mạch cảnh chung', partId: 'Left common carotid artery', latin: 'Arteria carotis communis' }
    ],
    keywords: [
      'hệ tuần hoàn', 'he tuan hoan', 'hệ tim mạch', 'he tim mach', 'tim mạch', 'tim mach',
      'tuần hoàn', 'tuan hoan', 'mạch máu', 'mach mau', 'vòng tuần hoàn', 'vong tuan hoan',
      'cardiovascular', 'circulatory system'
    ]
  },

  nervous: {
    id: 'nervous',
    baseSystem: 'nervous',
    subType: null,
    nameVi: 'Hệ Thần kinh',
    nameLatin: 'Systema nervosum (TA2: 5212)',
    nameEn: 'Nervous system',
    icon: '🧠',
    badgeClass: 'sys-badge-nervous',
    badgeColor: '#8b5cf6',
    count: 580,
    cameraAngle: { x: 0.38, y: 0.12, z: 0.91 },
    speech15s: 'Hệ thần kinh. Gồm hệ thần kinh trung ương là não bộ và tủy sống cùng mạng lưới dây thần kinh ngoại biên, tiếp nhận thụ cảm giác quan, phân tích xử lý tín hiệu và chỉ huy mọi hoạt động cơ thể.',
    summary: 'Mạng lưới điều khiển vi mô và vĩ mô tinh vi nhất cơ thể, phân chia thành thần kinh trung ương (não - tủy sống) và thần kinh ngoại biên, đảm bảo phản xạ sinh tồn và tư duy nhận thức.',
    keyOrgans: [
      { nameVi: 'Não bộ (Đại não)', partId: 'Brain', latin: 'Cerebrum' },
      { nameVi: 'Tiểu não', partId: 'Lingula of cerebellum', latin: 'Cerebellum' },
      { nameVi: 'Tủy sống', partId: 'Spinal cord', latin: 'Medulla spinalis' },
      { nameVi: 'Hệ thống não thất (CSF)', partId: 'Lateral ventricle.l', latin: 'Ventriculi cerebri' },
      { nameVi: 'Dây thần kinh tọa', partId: 'Sciatic nerve.l', latin: 'Nervus ischiadicus' },
      { nameVi: 'Dây thần kinh đùi', partId: 'Femoral nerve.l', latin: 'Nervus femoralis' },
      { nameVi: 'Đám rối cánh tay', partId: 'Radial nerve.l', latin: 'Plexus brachialis' }
    ],
    keywords: [
      'hệ thần kinh', 'he than kinh', 'thần kinh', 'than kinh',
      'não bộ và dây thần kinh', 'nao bo va day than kinh', 'nervous', 'nervous system'
    ]
  },

  respiratory: {
    id: 'respiratory',
    baseSystem: 'visceral',
    subType: 'respiratory',
    nameVi: 'Hệ Hô hấp',
    nameLatin: 'Systema respiratorium (TA2: 3125)',
    nameEn: 'Respiratory system',
    icon: '🫁',
    badgeClass: 'sys-badge-respiratory',
    badgeColor: '#06b6d4',
    count: 40,
    cameraAngle: { x: 0.28, y: 0.1, z: 0.95 },
    speech15s: 'Hệ hô hấp. Gồm đường dẫn khí từ thanh quản, khí quản, cây phế quản dẫn vào hai lá phổi, thực hiện quá trình thông khí và khuếch tán oxy vào máu, đồng thời đào thải khí carbonic ra môi trường ngoài.',
    summary: 'Đường dẫn khí và nhu mô phổi chuyên trách trao đổi khí oxy và CO2 qua màng phế nang - mao mạch, đồng thời tham gia điều hòa toan kiềm máu và phát âm.',
    keyOrgans: [
      { nameVi: 'Phổi phải', partId: 'Right lung', latin: 'Pulmo dexter' },
      { nameVi: 'Phổi trái', partId: 'Left lung', latin: 'Pulmo sinister' },
      { nameVi: 'Khí quản', partId: 'Trachea', latin: 'Trachea' },
      { nameVi: 'Cây phế quản', partId: 'Left superior lobar bronchus', latin: 'Arbor bronchialis' },
      { nameVi: 'Thanh quản', partId: 'Thyroid cartilage', latin: 'Larynx' },
      { nameVi: 'Màng phổi', partId: 'Pleura', latin: 'Pleura' }
    ],
    keywords: [
      'hệ hô hấp', 'he ho hap', 'hô hấp', 'ho hap', 'đường hô hấp', 'duong ho hap',
      'phổi và phế quản', 'phoi va phe quan', 'respiratory', 'respiratory system'
    ]
  },

  skeletal: {
    id: 'skeletal',
    baseSystem: 'skeletal',
    subType: null,
    nameVi: 'Hệ Xương',
    nameLatin: 'Systema skeletale (TA2: 0361)',
    nameEn: 'Skeletal system',
    icon: '💀',
    badgeClass: 'sys-badge-skeletal',
    badgeColor: '#f97316',
    count: 277,
    cameraAngle: { x: 0.25, y: 0.08, z: 0.96 },
    speech15s: 'Hệ xương. Gồm hai trăm linh sáu xương tạo thành khung nâng đỡ cơ thể vững chắc, bảo vệ các tạng trọng yếu bên trong, làm điểm tựa cho cơ bắp vận động và dự trữ khoáng chất canxi.',
    summary: 'Khung xương cứng cáp phân chia thành bộ xương trục (sọ, cột sống, lồng ngực) và bộ xương treo (đai chi và tứ chi), tạo điểm tựa đòn bẩy cơ học và tủy xương sinh máu.',
    keyOrgans: [
      { nameVi: 'Hộp sọ', partId: 'Frontal bone', latin: 'Cranium' },
      { nameVi: 'Cột sống', partId: 'Vertebra L1', latin: 'Columna vertebralis' },
      { nameVi: 'Lồng ngực & Xương ức', partId: 'Sternum', latin: 'Thorax' },
      { nameVi: 'Khung chậu & Xương hông', partId: 'Hip bone.l', latin: 'Pelvis' },
      { nameVi: 'Xương đùi', partId: 'Femur.l', latin: 'Femur' },
      { nameVi: 'Xương cánh tay', partId: 'Humerus.l', latin: 'Humerus' }
    ],
    keywords: [
      'hệ xương', 'he xuong', 'bộ xương', 'bo xuong', 'khung xương', 'khung xuong',
      'xương', 'xuong', 'skeletal', 'skeletal system'
    ]
  },

  joints: {
    id: 'joints',
    baseSystem: 'joints',
    subType: null,
    nameVi: 'Khớp & Dây chằng',
    nameLatin: 'Systema articulare (TA2: 1220)',
    nameEn: 'Joints & Ligaments',
    icon: '🦴',
    badgeClass: 'sys-badge-joints',
    badgeColor: '#10b981',
    count: 349,
    cameraAngle: { x: 0.3, y: 0.05, z: 0.95 },
    speech15s: 'Hệ khớp và dây chằng. Gồm hơn ba trăm khớp và hệ thống dây chằng liên kết các đầu xương, kết hợp bao hoạt dịch và sụn chêm giảm chấn, cho phép các chuyển động linh hoạt và giữ vững bộ khung cơ thể.',
    summary: 'Liên kết các đòn bẩy xương qua các khớp động hoạt dịch, khớp bán động sụn và khớp bất động sợi, kèm hệ thống dây chằng chịu lực căng phi thường.',
    keyOrgans: [
      { nameVi: 'Đĩa đệm cột sống', partId: 'Intervertebral disc L4-L5', latin: 'Disci intervertebrales' },
      { nameVi: 'Dây chằng chéo trước (ACL)', partId: 'Anterior cruciate ligament.l', latin: 'Ligamentum cruciatum anterius' },
      { nameVi: 'Dây chằng chéo sau (PCL)', partId: 'Posterior cruciate ligament.l', latin: 'Ligamentum cruciatum posterius' },
      { nameVi: 'Sụn chêm khớp gối', partId: 'Medial meniscus.l', latin: 'Meniscus' },
      { nameVi: 'Dây chằng chậu đùi (Khớp háng)', partId: 'Iliofemoral ligament.l', latin: 'Ligamentum iliofemorale' }
    ],
    keywords: [
      'khớp và dây chằng', 'khop va day chang', 'hệ khớp', 'he khop', 'dây chằng', 'day chang',
      'khớp', 'khop', 'hệ dây chằng', 'he day chang', 'joints', 'articular system'
    ]
  },

  muscular: {
    id: 'muscular',
    baseSystem: 'muscular',
    subType: null,
    nameVi: 'Hệ Cơ bắp',
    nameLatin: 'Systema musculare (TA2: 1850)',
    nameEn: 'Muscular system',
    icon: '💪',
    badgeClass: 'sys-badge-muscular',
    badgeColor: '#ec4899',
    count: 669,
    cameraAngle: { x: 0.35, y: 0.1, z: 0.92 },
    speech15s: 'Hệ cơ bắp. Gồm hơn sáu trăm cơ vân chiếm tới bốn mươi phần trăm trọng lượng cơ thể, co rút tạo lực kéo di chuyển các khớp xương, duy trì tư thế chống trọng lực và sản sinh nhiệt sưởi ấm.',
    summary: 'Bộ máy cơ học chủ động tạo chuyển động, sinh công lực cơ học qua cơ chế trượt actin-myosin tiêu thụ năng lượng ATP, chiếm tỷ trọng khối lượng lớn nhất cơ thể.',
    keyOrgans: [
      { nameVi: 'Cơ delta (Vai)', partId: 'Acromial part of deltoid muscle.l', latin: 'Musculus deltoideus' },
      { nameVi: 'Cơ nhị đầu cánh tay', partId: 'Long head of biceps brachii.l', latin: 'Musculus biceps brachii' },
      { nameVi: 'Cơ tứ đầu đùi', partId: 'Rectus femoris muscle.l', latin: 'Musculus quadriceps femoris' },
      { nameVi: 'Cơ mông lớn', partId: 'Gluteus maximus.l', latin: 'Musculus gluteus maximus' },
      { nameVi: 'Cơ dựng gai sống (Lưng sâu)', partId: 'Longissimus thoracis muscle.l', latin: 'Musculus erector spinae' },
      { nameVi: 'Cơ thang (Cổ vai gáy)', partId: 'Descending part of trapezius muscle.l', latin: 'Musculus trapezius' }
    ],
    keywords: [
      'hệ cơ', 'he co', 'hệ cơ bắp', 'he co bap', 'cơ bắp', 'co bap', 'hệ cơ vân', 'he co van',
      'các nhóm cơ', 'cac nhom co', 'muscular', 'muscular system'
    ]
  },

  urinary_genital: {
    id: 'urinary_genital',
    baseSystem: 'visceral',
    subType: 'urinary_genital',
    nameVi: 'Hệ Tiết niệu & Sinh dục',
    nameLatin: 'Systema urogenitale (TA2: 3375)',
    nameEn: 'Urogenital system',
    icon: '🚾',
    badgeClass: 'sys-badge-urinary',
    badgeColor: '#6366f1',
    count: 24,
    cameraAngle: { x: 0.25, y: 0.05, z: 0.96 },
    speech15s: 'Hệ tiết niệu. Gồm hai quả thận, hai niệu quản, bàng quang và niệu đạo, thực hiện lọc liên tục dòng máu để đào thải độc tố hòa tan, cân bằng nước điện giải và duy trì huyết áp ổn định.',
    summary: 'Cơ quan lọc máu bài tiết chất thải chuyển hóa, điều hòa dịch ngoại bào, thăng bằng axit - bazơ và duy trì chức năng nội tiết sinh dục giống loài.',
    keyOrgans: [
      { nameVi: 'Thận trái', partId: 'Kidney.l', latin: 'Ren sinister' },
      { nameVi: 'Thận phải', partId: 'Kidney.r', latin: 'Ren dexter' },
      { nameVi: 'Niệu quản', partId: 'Ureter.l', latin: 'Ureter' },
      { nameVi: 'Bàng quang', partId: 'Urinary bladder', latin: 'Vesica urinaria' },
      { nameVi: 'Tuyến thượng thận', partId: 'Suprarenal gland.l', latin: 'Glandula suprarenalis' }
    ],
    keywords: [
      'hệ tiết niệu và sinh dục', 'hệ tiết niệu & sinh dục', 'tiết niệu sinh dục',
      'hệ sinh dục', 'he sinh duc', 'sinh dục', 'sinh duc', 'urogenital', 'urogenital system'
    ]
  },

  endocrine: {
    id: 'endocrine',
    baseSystem: 'visceral',
    subType: 'endocrine',
    nameVi: 'Hệ Nội tiết',
    nameLatin: 'Systema endocrinum (TA2: 3820)',
    nameEn: 'Endocrine system',
    icon: '⚡',
    badgeClass: 'sys-badge-endocrine',
    badgeColor: '#14b8a6',
    count: 8,
    cameraAngle: { x: 0.25, y: 0.25, z: 0.95 },
    speech15s: 'Hệ nội tiết. Gồm mạng lưới các tuyến không ống dẫn tiết trực tiếp hormone vào máu, phối hợp cùng hệ thần kinh để điều hòa chuyển hóa năng lượng, tăng trưởng, nhịp sinh học và đáp ứng stress.',
    summary: 'Mạng lưới truyền tin thể dịch qua các chất hóa học hormone, chi phối chuyển hóa vi mô, sinh sản và giữ cân bằng nội môi kéo dài.',
    keyOrgans: [
      { nameVi: 'Tuyến giáp', partId: 'Thyroid gland', latin: 'Glandula thyroidea' },
      { nameVi: 'Tuyến yên', partId: 'Adenohypophysis', latin: 'Hypophysis' },
      { nameVi: 'Tuyến tùng', partId: 'Pineal gland', latin: 'Glandula pinealis' },
      { nameVi: 'Tuyến thượng thận', partId: 'Suprarenal gland.l', latin: 'Glandula suprarenalis' }
    ],
    keywords: [
      'hệ nội tiết', 'he noi tiet', 'nội tiết', 'noi tiet', 'tuyến nội tiết', 'tuyen noi tiet',
      'endocrine', 'endocrine system'
    ]
  },

  spine: {
    id: 'spine',
    baseSystem: 'skeletal',
    subType: 'spine',
    nameVi: 'Trục Cột sống Toàn Thể',
    nameLatin: 'Columna vertebralis (TA2: 1010)',
    nameEn: 'Vertebral column',
    icon: '🪜',
    badgeClass: 'sys-badge-skeletal',
    badgeColor: '#d97706',
    count: 56,
    cameraAngle: { x: -0.45, y: 0.1, z: -0.88 }, // Posterior 3/4 view to display natural lordosis & kyphosis curves
    speech15s: 'Trục cột sống. Gồm ba mươi ba đốt sống liên kết qua các đĩa đệm gian đốt, tạo thành bốn đoạn cong sinh lý chịu tải trọng cơ học, bảo vệ tủy sống chạy bên trong và nâng đỡ toàn bộ thân trên.',
    summary: 'Trục đỡ trung tâm cơ thể gồm 7 đốt sống cổ, 12 đốt sống ngực, 5 đốt sống thắt lưng, khối xương cùng và xương cụt, tạo thành ống sống che chở tủy thần kinh.',
    keyOrgans: [
      { nameVi: 'Đoạn Cổ (C1 - C7)', partId: 'Vertebra C7', latin: 'Vertebrae cervicales' },
      { nameVi: 'Đoạn Ngực (T1 - T12)', partId: 'Vertebra T12', latin: 'Vertebrae thoracicae' },
      { nameVi: 'Đoạn Thắt lưng (L1 - L5)', partId: 'Vertebra L4', latin: 'Vertebrae lumbales' },
      { nameVi: 'Khối Xương cùng & Cụt', partId: 'Sacrum', latin: 'Os sacrum & Coccyx' },
      { nameVi: 'Hệ thống Đĩa đệm', partId: 'Intervertebral disc L4-L5', latin: 'Disci intervertebrales' }
    ],
    keywords: [
      'cột sống', 'cot song', 'trục cột sống', 'truc cot song', 'toàn bộ cột sống', 'toan bo cot song',
      'xương sống', 'xuong song', 'đốt sống', 'dot song', 'spine', 'vertebral column'
    ]
  },


  spinal_cord: {
    id: 'spinal_cord',
    baseSystem: 'nervous',
    requiredSystems: ['nervous', 'skeletal'],
    subType: 'spinal_cord',
    nameVi: 'Trục Tủy Sống & Thần Kinh Gai Sống',
    nameLatin: 'Medulla spinalis et Nervi spinales (TA2: 5410)',
    nameEn: 'Spinal Cord & Spinal Nerves',
    icon: '🧬',
    badgeClass: 'sys-badge-nervous',
    badgeColor: '#a855f7',
    count: 38,
    cameraAngle: { x: -0.4, y: 0.1, z: -0.9 }, // Posterior view to see the spinal canal
    speech15s: 'Tủy sống là trung ương thần kinh dài khoảng bốn mươi lăm centimet chạy trong ống sống từ lỗ chẩm đến thắt lưng L1-L2, tiếp nối bởi nón tủy và chùm đuôi ngựa, điều hòa các cung phản xạ sinh tồn và là huyết mạch dẫn truyền vận động cảm giác giữa não và toàn thân.',
    summary: 'Trụ cột thần kinh trung ương chạy dọc bên trong ống sống được cột sống che chở. Gồm chất trắng dẫn truyền xung động, chất xám tích hợp phản xạ tủy (sừng trước vận động, sừng sau cảm giác), nón tủy và chùm đuôi ngựa.',
    keyOrgans: [
      { nameVi: 'Chất trắng tủy sống', partId: 'White matter of spinal cord', latin: 'Substantia alba' },
      { nameVi: 'Sừng trước (Vận động)', partId: 'Anterior horn of spinal cord', latin: 'Cornu anterius' },
      { nameVi: 'Sừng sau (Cảm giác)', partId: 'Posterior horn of spinal cord', latin: 'Cornu posterius' },
      { nameVi: 'Chùm đuôi ngựa', partId: 'Cauda equina', latin: 'Cauda equina' },
      { nameVi: 'Rễ thần kinh gai sống', partId: 'Anterior root of spinal nerve', latin: 'Radices nervorum spinalium' },
      { nameVi: 'Màng cứng tủy sống', partId: 'Spinal dura', latin: 'Dura mater spinalis' }
    ],
    keywords: [
      'tủy', 'tuy', 'tuỷ', 'tủy sống', 'tuy song', 'tuỷ sống', 'tủy gai', 'tuy gai',
      'trục tủy sống', 'truc tuy song', 'chùm đuôi ngựa', 'chum duoi ngua', 'nón tủy', 'non tuy',
      'tủy thần kinh', 'tuy than kinh', 'spinal cord', 'medulla spinalis'
    ]
  },

  cns: {
    id: 'cns',
    baseSystem: 'nervous',
    requiredSystems: ['nervous', 'skeletal'],
    subType: 'cns',
    nameVi: 'Hệ Thần Kinh Trung Ương (CNS)',
    nameLatin: 'Systema nervosum centrale (TA2: 5213)',
    nameEn: 'Central nervous system',
    icon: '🧠',
    badgeClass: 'sys-badge-nervous',
    badgeColor: '#7c3aed',
    count: 86,
    cameraAngle: { x: 0.35, y: 0.15, z: 0.92 },
    speech15s: 'Hệ thần kinh trung ương gồm não bộ nằm trong hộp sọ và tủy sống chạy trong ống sống, đảm nhiệm chức năng tích hợp thông tin cảm giác, điều khiển vận động chủ ý và các hoạt động tư duy, nhận thức cấp cao.',
    summary: 'Bộ chỉ huy tối cao của cơ thể bao gồm hai bán cầu đại não, tiểu não, thân não và tủy sống, được bao bọc an toàn bởi màng não tủy và hộp sọ, cột sống.',
    keyOrgans: [
      { nameVi: 'Đại não', partId: 'Superior frontal gyrus.l', latin: 'Cerebrum' },
      { nameVi: 'Tiểu não', partId: 'Lingula of cerebellum', latin: 'Cerebellum' },
      { nameVi: 'Thân não (Cầu & Hành não)', partId: 'Midbrain.l', latin: 'Truncus encephali' },
      { nameVi: 'Tủy sống', partId: 'White matter of spinal cord', latin: 'Medulla spinalis' },
      { nameVi: 'Chùm đuôi ngựa', partId: 'Cauda equina', latin: 'Cauda equina' }
    ],
    keywords: [
      'hệ thần kinh trung ương', 'he than kinh trung uong', 'thần kinh trung ương', 'than kinh trung uong',
      'cns', 'não và tủy', 'nao va tuy', 'não bộ và tủy sống', 'nao bo va tuy song', 'central nervous system'
    ]
  },

  lymphatic: {
    id: 'lymphatic',
    baseSystem: 'lymphatic',
    requiredSystems: ['lymphatic', 'skeletal'],
    subType: 'lymphatic',
    nameVi: 'Hệ Bạch Huyết & Miễn Dịch',
    nameLatin: 'Systema lymphoideum (TA2: 4400)',
    nameEn: 'Lymphatic system',
    icon: '🛡️',
    badgeClass: 'sys-badge-lymphatic',
    badgeColor: '#059669',
    count: 158,
    cameraAngle: { x: 0.3, y: 0.1, z: 0.94 },
    speech15s: 'Hệ bạch huyết gồm mạng lưới mạch bạch huyết, các cụm hạch lympho, lá lách và ống ngực, dẫn lưu dịch gian bào thừa trở về tĩnh mạch, vận chuyển lipid và là lá chắn phòng thủ miễn dịch tối quan trọng của cơ thể.',
    summary: 'Mạng lưới tuần hoàn dịch thứ hai song hành với mạch máu, chuyên chở tế bào miễn dịch lympho T và B nhận diện, tiêu diệt vi khuẩn, virus và tế bào đột biến.',
    keyOrgans: [
      { nameVi: 'Ống ngực (Dẫn lưu chính)', partId: 'Thoracic duct', latin: 'Ductus thoracicus' },
      { nameVi: 'Lá lách (Cơ quan lympho)', partId: 'Spleen', latin: 'Splen' },
      { nameVi: 'Hạch bạch huyết cổ', partId: 'Deep cervical lymph nodes.l', latin: 'Nodi lymphoidei cervicales' },
      { nameVi: 'Hạch bạch huyết nách', partId: 'Axillary lymph nodes.l', latin: 'Nodi lymphoidei axillares' },
      { nameVi: 'Hạch bạch huyết bẹn', partId: 'Inguinal lymph nodes.l', latin: 'Nodi lymphoidei inguinales' }
    ],
    keywords: [
      'hệ bạch huyết', 'he bach huyet', 'bạch huyết', 'bach huyet', 'hệ miễn dịch', 'he mien dich',
      'hạch bạch huyết', 'hach bach huyet', 'hạch lympho', 'hach lympho', 'lymphatic', 'lymphatic system'
    ]
  },

  urinary: {
    id: 'urinary',
    baseSystem: 'visceral',
    requiredSystems: ['visceral', 'skeletal'],
    subType: 'urinary',
    nameVi: 'Hệ Tiết Niệu',
    nameLatin: 'Systema urinarium (TA2: 3376)',
    nameEn: 'Urinary system',
    icon: '💧',
    badgeClass: 'sys-badge-urinary',
    badgeColor: '#3b82f6',
    count: 16,
    cameraAngle: { x: 0.25, y: 0.05, z: 0.96 },
    speech15s: 'Hệ tiết niệu gồm hai quả thận, hai niệu quản, bàng quang và niệu đạo, thực hiện lọc liên tục dòng máu để đào thải độc tố urê và cặn bã chuyển hóa, tái hấp thu nước điện giải và điều hòa huyết áp sinh tồn.',
    summary: 'Nhà máy lọc máu tinh vi với hơn hai triệu nephron ở hai thận, đào thải chất độc qua nước tiểu, giữ thăng bằng nội môi và điều hòa áp suất thẩm thấu.',
    keyOrgans: [
      { nameVi: 'Thận trái', partId: 'Kidney.l', latin: 'Ren sinister' },
      { nameVi: 'Thận phải', partId: 'Kidney.r', latin: 'Ren dexter' },
      { nameVi: 'Niệu quản', partId: 'Ureter.l', latin: 'Ureter' },
      { nameVi: 'Bàng quang', partId: 'Urinary bladder', latin: 'Vesica urinaria' }
    ],
    keywords: [
      'hệ tiết niệu', 'he tiet nieu', 'tiết niệu', 'tiet nieu', 'thận và bàng quang', 'than va bang quang',
      'thận bàng quang', 'than bang quang', 'urinary', 'urinary system'
    ]
  }
};

/**
 * Tra cứu thông tin hồ sơ hệ cơ quan dựa trên từ khóa tìm kiếm tiếng Việt hoặc tiếng Anh
 */
export function matchSystemProfile(query) {
  if (!query) return null;
  let q = query.toLowerCase().trim();

  // Guard against queries intended for Clinical Functional Axes (Gut-Brain, Hepatobiliary, CSF, Endocrine, etc.)
  if (
    q.includes('trực não') || q.includes('trục não') || q.includes('chục lão') || q.includes('chục não') ||
    q.includes('chụp não') || q.includes('não ruột') || q.includes('ruột não') ||
    q.includes('gan mật tụy') || q.includes('bộ ba') || q.includes('gân mà tự') ||
    q.includes('dịch não tủy') || q.includes('não thất') ||
    q.includes('tuyến tiêu hóa') || q.includes('nội tiết') || q.includes('tim thận')
  ) {
    return null;
  }

  // Normalize common typing / speech-to-text variations
  if (q === 'tuỷ' || q === 'tuy' || q === 'tuỷ sống' || q === 'tuy song' || q === 'tủy') {
    q = 'tủy sống';
  }

  // 1. Direct key match
  if (SYSTEM_PROFILES[q]) return SYSTEM_PROFILES[q];

  // 2. Exact keyword match pass (Ensures specific profiles like 'cns' match 'hệ thần kinh trung ương' before 'nervous')
  for (const profile of Object.values(SYSTEM_PROFILES)) {
    if (profile.keywords.some(k => {
      if (q === k) return true;
      if (q === `xem ${k}` || q === `tìm ${k}` || q === `mở ${k}` || q === `bật ${k}` || q === `cho xem ${k}` || q === `chỉ ${k}`) return true;
      return false;
    })) {
      return profile;
    }
  }

  // 3. Prefix/suffix or boundary match pass
  for (const profile of Object.values(SYSTEM_PROFILES)) {
    if (profile.keywords.some(k => {
      if (q.startsWith(k + ' ') || q.endsWith(' ' + k) || q.includes(' ' + k + ' ')) return true;
      return false;
    })) {
      return profile;
    }
  }

  return null;
}
