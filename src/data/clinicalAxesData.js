/**
 * CLINICAL AXES & APPLIED ANATOMY DATA
 * Dữ liệu Giải Phẫu Ứng Dụng Theo Chuỗi & Trục Chức Năng Lâm Sàng
 * Phục vụ học tập thông minh, hiểu sâu cơ chế bệnh sinh và liên kết các cơ quan trong cơ thể.
 */

export const CLINICAL_AXES = [
  {
    id: 'axis_gut_brain',
    titleVi: 'Trục Não – Ruột (Gut-Brain Axis)',
    latin: 'Axis cerebro-intestinalis',
    category: 'Thần kinh – Tiêu hóa – Tâm thể',
    badge: 'Trục Tương Tác 2 Chiều',
    icon: '🧠⚡🥣',
    summary: 'Mạng lưới truyền tín hiệu 2 chiều giữa hệ thần kinh trung ương và hệ tiêu hóa, giải thích tại sao căng thẳng lại gây đau dạ dày và rối loạn tiêu hóa.',
    primarySystems: ['nervous', 'visceral'],
    defaultPartId: 'Stomach',
    keywords: [
      'trục não ruột', 'truc nao ruot', 'gut brain', 'vagus', 'dây thần kinh x', 'than kinh 10',
      'dạ dày', 'da day', 'lo âu đau bụng', 'ruột kích thích', 'ibs', 'trầm cảm tiêu hóa'
    ],
    chainSteps: [
      {
        step: 1,
        title: 'Não bộ & Vùng dưới đồi',
        partId: 'Brain',
        system: 'nervous',
        note: 'Tiếp nhận căng thẳng (stress), phát tín hiệu báo động đến hệ thần kinh tự chủ.'
      },
      {
        step: 2,
        title: 'Dây thần kinh X (Lang thang)',
        partId: 'Vagus nerve.l',
        system: 'nervous',
        note: 'Dây thần kinh sọ dài nhất cơ thể, dẫn truyền xung động từ thân não xuống tim, dạ dày và ruột.'
      },
      {
        step: 3,
        title: 'Dạ dày & Tuyến dịch vị',
        partId: 'Stomach',
        system: 'visceral',
        note: 'Bị kích thích tăng tiết axit HCl quá mức, giảm lưu lượng máu nuôi niêm mạc gây đau cồn cào.'
      },
      {
        step: 4,
        title: 'Đại tràng & Hệ vi sinh đường ruột',
        partId: 'Stomach',
        system: 'visceral',
        note: 'Co bóp bất thường gây hội chứng ruột kích thích (IBS); tổng hợp 90% Serotonin điều hòa tâm trạng ngược lên não.'
      }
    ],
    clinicalInsights: [
      {
        question: 'Tại sao khi lo lắng, thi cử hay căng thẳng ta lại bị đau quặn bụng, đi ngoài?',
        explanation: 'Khi não bị stress, tín hiệu truyền dọc theo Dây thần kinh X làm dạ dày co bóp hỗn loạn và kích hoạt nhu động ruột quá mức. 90% thụ thể Serotonin (chất dẫn truyền thần kinh) nằm ở ruột chứ không phải ở não.'
      },
      {
        question: 'Bệnh nhân trầm cảm hoặc stress kéo dài có dễ bị loét dạ dày không?',
        explanation: 'Có. Căng thẳng kéo dài làm suy yếu lớp màng nhầy Mucin bảo vệ thành dạ dày, tạo cơ hội cho axit và vi khuẩn H.pylori tấn công gây viêm trợt và loét sâu.'
      }
    ],
    lifestyleTips: [
      'Tập thở sâu cơ hoành 5 phút/ngày để kích hoạt nhánh đối giao cảm của dây thần kinh X, làm dịu dạ dày tức thì.',
      'Bổ sung lợi khuẩn (Probiotics) và thức ăn lên men tự nhiên giúp ổn định dẫn truyền thần kinh ngược lên não bộ.',
      'Ăn uống đúng giờ, tránh vừa ăn vừa lướt điện thoại hay làm việc căng thẳng.'
    ]
  },

  {
    id: 'axis_hepatobiliary_pancreas',
    titleVi: 'Hệ Gan – Mật – Tụy & Tuyến Tiêu Hóa',
    latin: 'Systema hepatobiliare et pancreas',
    category: 'Tiêu hóa – Gan mật – Nội tiết',
    badge: 'Ngã Ba Dịch Tiêu Hóa',
    icon: '🟡🟢🔴',
    summary: 'Chuỗi sản xuất, cô đặc mật và men tiêu hóa hợp lưu tại cơ vòng Oddi đổ vào tá tràng để tiêu hóa mỡ và protein.',
    primarySystems: ['visceral'],
    defaultPartId: 'Gallbladder',
    keywords: [
      'gan mật tụy', 'gan mat tuy', 'túi mật', 'tui mat', 'tuyến tụy', 'tuyen tuy', 'sỏi mật',
      'viêm tụy cấp', 'oddi', 'vater', 'vàng da', 'tá tràng', 'men tụy'
    ],
    chainSteps: [
      {
        step: 1,
        title: 'Nhu mô Gan',
        partId: 'Liver',
        system: 'visceral',
        note: 'Sản xuất liên tục 800 - 1000ml dịch mật mỗi ngày để nhũ hóa chất béo.'
      },
      {
        step: 2,
        title: 'Túi mật',
        partId: 'Gallbladder',
        system: 'visceral',
        note: 'Dự trữ và cô đặc dịch mật gấp 10 lần, co bóp tống mật khi thức ăn dầu mỡ xuống tá tràng.'
      },
      {
        step: 3,
        title: 'Tuyến tụy (Tụy tạng)',
        partId: 'Pancreas',
        system: 'visceral',
        note: 'Tiết các men tiêu hóa cực mạnh (Amylase, Lipase, Trypsinogen) ở dạng bất hoạt để bảo vệ chính nó.'
      },
      {
        step: 4,
        title: 'Cơ vòng Oddi & Bóng Vater (Tá tràng)',
        partId: 'Gallbladder',
        system: 'visceral',
        note: 'Ngã ba chung nơi ống mật chủ và ống tụy chính đổ dịch vào tá tràng D2.'
      }
    ],
    clinicalInsights: [
      {
        question: 'Tại sao một viên sỏi mật nhỏ lại có thể gây biến chứng Viêm tụy cấp nguy kịch?',
        explanation: 'Ống mật chủ và ống tụy chính có đoạn chung tại bóng Vater. Khi sỏi từ túi mật rơi xuống kẹt tắc ngay ngã ba này, dịch mật và dịch tụy bị ứ ngược lại. Các men tụy bị kích hoạt sớm ngay trong tuyến tụy, tự tiêu hủy mô tụy gây đau dữ dội và đe dọa tính mạng.'
      },
      {
        question: 'Cắt bỏ túi mật rồi có tiêu hóa mỡ được nữa không?',
        explanation: 'Vẫn tiêu hóa được. Gan vẫn sản xuất mật bình thường và dịch mật sẽ chảy trực tiếp xuống ruột. Tuy nhiên vì không còn túi gom cô đặc mật nên người cắt túi mật cần hạn chế ăn bữa quá nhiều dầu mỡ cùng một lúc.'
      }
    ],
    lifestyleTips: [
      'Ăn sáng đầy đủ giúp túi mật co bóp tống mật đều đặn, chống đọng bùn và sỏi mật.',
      'Hạn chế bia rượu tuyệt đối nếu có tiền sử đau tức hạ sườn phải hoặc men gan tăng cao.',
      'Uống đủ nước, duy trì cân nặng hợp lý để giảm bài tiết cholesterol quá bão hòa vào dịch mật.'
    ]
  },

  {
    id: 'axis_cranial_nerves',
    titleVi: '12 Đôi Dây Thần Kinh Sọ Não (Cranial Nerves)',
    latin: 'Nervi craniales I - XII',
    category: 'Thần kinh – Tai Mũi Họng – Mắt',
    badge: 'Mạng Lưới Thần Kinh Sọ',
    icon: '⚡👁️👂',
    summary: 'Mạng lưới thần kinh khởi phát trực tiếp từ não bộ và thân não, điều khiển toàn bộ giác quan, vận động nét mặt và nội tạng.',
    primarySystems: ['nervous'],
    defaultPartId: 'Brain',
    keywords: [
      '12 dây thần kinh', '12 day than kinh so', 'cranial nerves', 'liệt dây 7', 'méo miệng',
      'dây 5', 'đau dây 5', 'dây x', 'phế vị', 'thần kinh thị giác', 'thần kinh sọ'
    ],
    chainSteps: [
      {
        step: 1,
        title: 'Não bộ & Thân não (Cầu não - Hành não)',
        partId: 'Brain',
        system: 'nervous',
        note: 'Chứa các nhân nguyên ủy của 12 đôi dây thần kinh sọ.'
      },
      {
        step: 2,
        title: 'Dây thần kinh V (Tam thoa / Sinh ba)',
        partId: 'Brain',
        system: 'nervous',
        note: 'Chi phối cảm giác toàn bộ khuôn mặt, răng miệng và cơ nhai. Tổn thương gây cơn đau buốt mặt như điện giật.'
      },
      {
        step: 3,
        title: 'Dây thần kinh VII (Thần kinh mặt)',
        partId: 'Brain',
        system: 'nervous',
        note: 'Chi phối toàn bộ cơ biểu cảm khuôn mặt. Khi bị lạnh/phù nề trong ống xương đá gây liệt Bell méo miệng, mắt nhắm không kín.'
      },
      {
        step: 4,
        title: 'Dây thần kinh X (Phế vị / Lang thang)',
        partId: 'Vagus nerve.l',
        system: 'nervous',
        note: 'Dây sọ dài nhất, điều hòa nhịp tim, co bóp phế quản phổi và nhu động dạ dày ruột.'
      }
    ],
    clinicalInsights: [
      {
        question: 'Tại sao chỉ ngủ bật quạt thổi vào mặt hoặc tắm đêm lại bị méo miệng, liệt mặt sáng hôm sau?',
        explanation: 'Dây thần kinh số VII chạy qua một khe xương hẹp gọi là ống Fallop trong xương thái dương. Gió lạnh đột ngột làm co mạch nuôi thần kinh, gây phù nề. Dây thần kinh bị sưng to nhưng kẹt trong ống xương hẹp nên bị thiếu máu và liệt tạm thời (Liệt mặt Bell).'
      },
      {
        question: 'Đau buốt nửa mặt nhói như dao đâm khi đánh răng, rửa mặt là bệnh gì?',
        explanation: 'Đó là cơn đau dây thần kinh số V (Dây sinh ba). Thường do một nhánh mạch máu não nhỏ chèn ép vào rễ dây V ngay lối ra từ thân não, khiến chỉ một cái chạm nhẹ ngoài da cũng kích hoạt cơn đau cực độ.'
      }
    ],
    lifestyleTips: [
      'Giữ ấm vùng đầu cổ mặt khi trời lạnh; không để quạt hay điều hòa phả thẳng vào mặt khi ngủ.',
      'Khám và can thiệp vật lý trị liệu phục hồi cơ mặt trong vòng 72 giờ vàng nếu phát hiện mắt nhắm không kín, uống nước trào mép.',
      'Bảo vệ mắt bằng nước mắt nhân tạo và kính chắn bụi khi bị liệt cơ mi mắt.'
    ]
  },

  {
    id: 'axis_brain_spine_sciatic',
    titleVi: 'Trục Não – Tủy Sống – Thần Kinh Tọa',
    latin: 'Axis cerebro-spinalis et nervus ischiadicus',
    category: 'Thần kinh – Cột sống – Vận động',
    badge: 'Đường Truyền Lực Vận Động',
    icon: '🧠🦴⚡',
    summary: 'Trục dẫn truyền xung động vận động từ vỏ não qua tủy sống và rễ thần kinh thắt lưng xuống chi dưới, giải thích đau lưng lan xuống chân.',
    primarySystems: ['nervous', 'skeletal', 'joints'],
    defaultPartId: 'Intervertebral disc L4-L5',
    keywords: [
      'trục não tủy', 'não tủy', 'tủy sống', 'thoát vị đĩa đệm', 'thần kinh tọa',
      'đau thắt lưng', 'l4-l5', 'sciatic', 'spinal cord', 'liệt nửa người', 'đau rễ'
    ],
    chainSteps: [
      {
        step: 1,
        title: 'Vỏ não vận động (Thùy trán)',
        partId: 'Brain',
        system: 'nervous',
        note: 'Phát lệnh vận động cử động cơ thể, bắt chéo tháp sang bên đối diện tại hành não.'
      },
      {
        step: 2,
        title: 'Tủy sống (Đoạn cổ - ngực - thắt lưng)',
        partId: 'Spinal cord',
        system: 'nervous',
        note: 'Cáp quang sinh học chạy bên trong ống sống đốt sống, chia các đôi rễ thần kinh tủy gai.'
      },
      {
        step: 3,
        title: 'Khớp Đĩa đệm Cột sống L4-L5 & L5-S1',
        partId: 'Intervertebral disc L4-L5',
        system: 'joints',
        note: 'Khu vực chịu tải trọng lớn nhất cơ thể, nơi nhân nhầy dễ thoát vị ra sau chèn ép rễ tủy.'
      },
      {
        step: 4,
        title: 'Dây thần kinh Tọa (Thần kinh ngồi)',
        partId: 'Sciatic nerve.l',
        system: 'nervous',
        note: 'Dây thần kinh to nhất cơ thể, hợp lưu từ các rễ L4-S3 chạy qua mông dọc xuống tận gót và ngón chân.'
      }
    ],
    clinicalInsights: [
      {
        question: 'Tại sao tổn thương não bên trái lại gây yếu liệt tay chân bên phải?',
        explanation: 'Tại vùng hành não có hiện tượng "Bắt chéo tháp" (Pyramidal decussation), nơi khoảng 85-90% các bó sợi thần kinh vận động từ bán cầu não trái bắt chéo sang điều khiển nửa người bên phải và ngược lại.'
      },
      {
        question: 'Tại sao đau lưng mà lại thấy buốt nhói rát bỏng ở ngón chân cái?',
        explanation: 'Nhân nhầy đĩa đệm L4-L5 khi thoát vị sẽ chèn ép đúng rễ thần kinh L5. Rễ này chi phối cảm giác cho vùng da mu bàn chân và ngón chân cái, tạo cảm giác đau buốt như dòng điện chạy dọc xuống dưới.'
      }
    ],
    lifestyleTips: [
      'Quy tắc bê đồ nặng: Luôn ngồi xổm, gập khớp gối và giữ lưng thẳng đứng sát vật thể; tuyệt đối không đứng thẳng cúi gập lưng.',
      'Thay đổi tư thế ngồi sau mỗi 45 phút, dùng gối đỡ thắt lưng khi ngồi làm việc máy tính.',
      'Tập bơi lội hoặc bài tập treo xà đơn nhẹ nhàng để giải áp lực nén trọng lực lên các tầng đĩa đệm.'
    ]
  },

  {
    id: 'axis_cardiopulmonary_loop',
    titleVi: 'Trục Tim – Phổi & Vòng Tuần Hoàn Kép',
    latin: 'Circulatio sanguinis cardiopulmonalis',
    category: 'Tim mạch – Hô hấp – Trao đổi khí',
    badge: 'Vòng Sinh Mệnh Trao Đổi Khí',
    icon: '❤️🫁🩸',
    summary: 'Sự phối hợp nhịp nhàng giữa Tim và 2 lá Phổi: Máu nghèo oxy được bơm lên phổi lấy dưỡng khí rồi quay về tim để đi nuôi toàn bộ tế bào cơ thể.',
    primarySystems: ['cardiovascular', 'visceral'],
    defaultPartId: 'Stomach',
    keywords: [
      'tim phổi', 'tim phoi', 'tuần hoàn', 'tuan hoan', 'động mạch phổi', 'khó thở suy tim',
      'phế nang', 'trao đổi khí', 'huyết áp', 'nhồi máu cơ tim'
    ],
    chainSteps: [
      {
        step: 1,
        title: 'Tâm thất phải (Tim phải)',
        partId: 'Brain',
        system: 'cardiovascular',
        note: 'Tiếp nhận máu nghèo oxy từ cơ thể trở về và bơm qua Động mạch phổi.'
      },
      {
        step: 2,
        title: 'Mao mạch Phế nang 2 lá Phổi',
        partId: 'Brain',
        system: 'visceral',
        note: 'Nơi hồng cầu nhả khí CO2 và hấp thụ khí O2 qua màng phế nang mao mạch mỏng 0.5 micromet.'
      },
      {
        step: 3,
        title: 'Tĩnh mạch phổi về Tâm nhĩ & Thất trái',
        partId: 'Brain',
        system: 'cardiovascular',
        note: 'Đưa máu đỏ tươi giàu oxy trở về buồng tim trái với áp lực cao.'
      },
      {
        step: 4,
        title: 'Quai Động mạch chủ (Aorta)',
        partId: 'Brain',
        system: 'cardiovascular',
        note: 'Động mạch lớn nhất cơ thể, phân nhánh bơm máu nuôi não, tim và toàn bộ cơ quan nội tạng.'
      }
    ],
    clinicalInsights: [
      {
        question: 'Tại sao người suy tim lại hay bị khó thở kịch phát, phải ngồi dậy để thở?',
        explanation: 'Khi tâm thất trái bị suy, lực bơm máu đi nuôi cơ thể bị yếu khiến máu bị ứ trệ ngược lại ở phổi. Áp lực tĩnh mạch phổi tăng cao làm dịch huyết tương tràn vào lòng phế nang (phù phổi), gây cảm giác ngạt thở dữ dội, đặc biệt là khi nằm ngửa.'
      },
      {
        question: 'Viêm phổi hay tắc mạch phổi ảnh hưởng đến tim như thế nào?',
        explanation: 'Khi phổi bị xơ hóa hoặc có cục máu đông tắc động mạch phổi, sức cản dòng máu tăng vọt khiến thất phải phải gồng mình bóp máu, lâu ngày dẫn đến giãn phình và suy tim phải (Tâm phế mạn).'
      }
    ],
    lifestyleTips: [
      'Tập thể dục nhịp điệu (cardio, đi bộ nhanh, đạp xe) 30 phút/ngày giúp tăng độ giãn nở phế nang và sức bóp cơ tim.',
      'Bỏ thuốc lá hoàn toàn để bảo vệ biểu mô lông chuyển phế quản và tránh vữa xơ thành động mạch.',
      'Kiểm soát huyết áp và lượng muối nạp vào cơ thể dưới 5g/ngày để giảm tải gánh nặng tuần hoàn cho tim.'
    ]
  },

  {
    id: 'axis_postural_kinetic_chain',
    titleVi: 'Chuỗi Động Học Tư Thế & Trọng Lực Cột Sống',
    latin: 'Catena motus et gravitatis corporis',
    category: 'Cơ xương khớp – Vật lý trị liệu – Tư thế',
    badge: 'Chuỗi Tải Trọng Động Học',
    icon: '🚶‍♂️⚖️🦴',
    summary: 'Chuỗi liên kết tải lực liên hoàn từ đầu cổ, thắt lưng đến khớp háng và khớp gối, lý giải nguyên nhân đau mỏi của dân văn phòng và người thoái hóa khớp.',
    primarySystems: ['skeletal', 'joints', 'muscular'],
    defaultPartId: 'Intervertebral disc L4-L5',
    keywords: [
      'chuỗi động học', 'chuoi dong hoc', 'tư thế', 'gù lưng', 'cổ rùa', 'đau vai gáy',
      'khớp gối', 'khớp háng', 'văn phòng', 'cột sống cổ', 'thoái hóa khớp'
    ],
    chainSteps: [
      {
        step: 1,
        title: 'Cột sống cổ & Hộp sọ (Tư thế Cổ rùa)',
        partId: 'Intervertebral disc L4-L5',
        system: 'skeletal',
        note: 'Đầu người nặng ~5kg. Khi cúi 45-60° xem điện thoại, áp lực lên đốt sống cổ tăng vọt lên 22-27kg.'
      },
      {
        step: 2,
        title: 'Lồng ngực & Đốt sống ngực (Gù lưng trên)',
        partId: 'Intervertebral disc L4-L5',
        system: 'skeletal',
        note: 'Cơ ngực bị co rút ngắn lại, cơ lưng trên và cơ trám bị kéo dãn yếu ớt gây mỏi vai gáy âm ỉ.'
      },
      {
        step: 3,
        title: 'Đốt sống Thắt lưng & Xương chậu (Võng lưng)',
        partId: 'Intervertebral disc L4-L5',
        system: 'skeletal',
        note: 'Khung chậu xoay trước (Anterior Pelvic Tilt) làm tăng độ ưỡn thắt lưng, ép nén rìa sau đĩa đệm.'
      },
      {
        step: 4,
        title: 'Khớp háng & Khớp gối chịu tải',
        partId: 'Intervertebral disc L4-L5',
        system: 'joints',
        note: 'Cơ mông bị ức chế khiến khớp gối bị vặn trục vào trong (Knee valgus), tăng lực ma sát mòn sụn chêm.'
      }
    ],
    clinicalInsights: [
      {
        question: 'Tại sao đau nhức khớp gối lại có thể bắt nguồn từ yếu cơ mông và lệch xương chậu?',
        explanation: 'Cơ mông nhỡ đóng vai trò giữ thăng bằng khung chậu khi bước đi. Khi cơ mông bị yếu (do ngồi nhiều), xương đùi bị xoay vào trong khiến khớp gối phải chịu lực xoắn vặn lệch trục, làm sụn bánh chè cọ xát gây đau mỏi kéo dài.'
      },
      {
        question: 'Tại sao ngồi máy tính lâu hay bị đau căng cơ vùng cổ vai gáy?',
        explanation: 'Hội chứng chéo trên (Upper Crossed Syndrome): Khi đầu đưa ra trước và vai cuộn vào trong, cơ nâng vai và cơ thang trên bị co thắt liên tục để giữ cho đầu không gục xuống, gây thiếu máu nuôi cơ tạo thành các điểm nút đau (trigger points).'
      }
    ],
    lifestyleTips: [
      'Điều chỉnh màn hình làm việc ngang tầm mắt để giữ cột sống cổ ở tư thế trung tính tự nhiên.',
      'Thực hiện bài tập thu cằm (Chin tuck) và mở rộng ngực 10 lần mỗi khi giải lao.',
      'Tập các bài tăng cường cơ mông (Glute bridge, Clamshell) để ổn định trục chân khi đi đứng.'
    ]
  }
];
