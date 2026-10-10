/**
 * CLINICAL AXES & APPLIED ANATOMY DATA
 * Dữ liệu Giải Phẫu Ứng Dụng Theo Chuỗi & Trục Chức Năng Lâm Sàng
 * Phục vụ học tập thông minh, hiểu sâu cơ chế bệnh sinh và liên kết trực quan các cơ quan trên 3D.
 */

export const CLINICAL_AXES = [
  {
    id: 'axis_gut_brain',
    titleVi: 'Trục Não – Ruột (Gut-Brain Axis)',
    latin: 'Axis cerebro-intestinalis',
    category: 'Thần kinh – Tiêu hóa – Tâm thể',
    badge: 'Trục Tương Tác 2 Chiều',
    icon: '🧠',
    summary: 'Mạng lưới truyền tín hiệu 2 chiều giữa hệ thần kinh trung ương và hệ tiêu hóa, giải thích tại sao căng thẳng lo âu lại gây đau dạ dày và rối loạn tiêu hóa.',
    primarySystems: ['nervous', 'visceral', 'cardiovascular', 'skeletal'],
    defaultPartId: 'Stomach',
    keywords: [
      'trục não ruột', 'truc nao ruot', 'chục lão chuột', 'chuc lao chuot', 'chụp não ruột', 'chup nao ruot',
      'chục não ruột', 'chuc nao ruot', 'chục lão ruột', 'chuc lao ruot', 'chục não', 'chuc nao',
      'trục ruột não', 'truc ruot nao', 'trục não', 'truc nao', 'gut brain', 'gut-brain', 'vagus',
      'dây thần kinh x', 'than kinh 10', 'dây x', 'dạ dày ruột', 'lo âu đau bụng', 'ruột kích thích',
      'ibs', 'trầm cảm tiêu hóa'
    ],
    chainSteps: [
      {
        step: 1,
        title: 'Não bộ & Vùng dưới đồi',
        shortTitle: '1. Não bộ',
        partId: 'Hypothalamus',
        partIds: ['Hypothalamus', 'Midbrain.l', 'Midbrain.r', 'Pons.l', 'Pons.r', 'Medulla oblongata.l', 'Medulla oblongata.r'],
        system: 'nervous',
        shortNote: 'Tiếp nhận stress, phát tín hiệu báo động đến hệ thần kinh tự chủ.',
        note: 'Tiếp nhận căng thẳng (stress), phát tín hiệu báo động đến hệ thần kinh tự chủ và trục dưới đồi - tuyến yên - thượng thận (HPA).'
      },
      {
        step: 2,
        title: 'Dây thần kinh X (Phế vị / Lang thang)',
        shortTitle: '2. Dây X',
        partId: 'Vagus nerve (X).l',
        partIds: ['Vagus nerve (X).l', 'Vagus nerve (X).r', 'Posterior nucleus of vagus nerve.l', 'Posterior nucleus of vagus nerve.r'],
        system: 'nervous',
        shortNote: 'Dây sọ dài nhất, dẫn xung động từ thân não xuống dạ dày và ruột.',
        note: 'Dây thần kinh sọ dài nhất cơ thể (Dây X), dẫn truyền xung động đối giao cảm từ thân não xuống tim, dạ dày và toàn bộ ống tiêu hóa.'
      },
      {
        step: 3,
        title: 'Dạ dày, Môn vị & Mạc Nối (Dạ Dày Liên Kết)',
        shortTitle: '3. Dạ dày & Mạc nối',
        partId: 'Stomach',
        partIds: ['Stomach', 'Oesophagus', 'Lesser omentum', 'Left gastric artery'],
        system: 'visceral',
        shortNote: 'Nối thực quản và tá tràng, tăng tiết axit HCl khi stress.',
        note: 'Dạ dày tiếp nối Thực quản ở tâm vị và Tá tràng ở môn vị, được nuôi bởi ĐM vị trái và liên kết với gan qua mạc nối nhỏ; khi stress, dây X kích thích tăng tiết acid HCl quá mức gây đau cồn cào và trợt loét.'
      },
      {
        step: 4,
        title: 'Tá Tràng, Ruột Non & Ruột Già (ENS & Vi sinh ruột)',
        shortTitle: '4. Ruột & ENS',
        partId: 'Transverse colon',
        partIds: ['Duodenum', 'Jejunum', 'Transverse colon', 'Ascending colon', 'Descending colon', 'Sigmoid colon', 'Superior mesenteric artery', 'Superior mesenteric vein'],
        system: 'visceral',
        shortNote: 'Co bóp gây ruột kích thích; sản xuất 90% Serotonin điều hòa não.',
        note: 'Co bóp bất thường gây hội chứng ruột kích thích (IBS); tổng hợp 90% Serotonin và 50% Dopamine điều hòa tâm trạng ngược lên não.'
      }
    ],
    clinicalInsights: [
      {
        question: 'Tại sao khi lo lắng, thi cử hay căng thẳng ta lại bị đau quặn bụng, đi ngoài?',
        explanation: 'Khi não bị stress, tín hiệu truyền dọc theo Dây thần kinh X làm dạ dày co bóp hỗn loạn và kích hoạt nhu động ruột quá mức. 90% thụ thể Serotonin (chất dẫn truyền thần kinh) nằm ở ruột chứ không phải ở não.'
      },
      {
        question: 'Vì sao đường ruột được mệnh danh là "Bộ não thứ hai" (The Second Brain)?',
        explanation: 'Hệ thần kinh ruột (ENS) chứa hơn 500 triệu nơron thần kinh kết nối mật thiết với hệ vi sinh đường ruột (Microbiota). Chúng liên tục gửi tín hiệu điều hòa cảm xúc, giấc ngủ và miễn dịch ngược lên não bộ.'
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
    titleVi: 'Hệ Gan – Mật – Tụy (Bộ Ba Chức Năng)',
    latin: 'Systema hepatobiliare et pancreas',
    category: 'Tiêu hóa – Gan mật – Chuyển hóa & Nội tiết',
    badge: 'Bộ Ba Tiết & Chuyển Hóa',
    icon: '🫀',
    summary: 'Bộ ba cơ quan tiêu hóa & chuyển hóa then chốt liên kết hữu cơ: Gan sản xuất dịch mật, Túi mật cô đặc mật, Tuyến tụy tiết enzyme cực mạnh và insulin; toàn bộ kết nối chặt chẽ bằng ống mật chủ, ống tụy Wirsung, mạc nối nhỏ và hệ mạch máu cửa/thân tạng đổ vào tá tràng D2.',
    primarySystems: ['visceral', 'cardiovascular', 'skeletal'],
    defaultPartId: 'Gallbladder',
    keywords: [
      'gan mật tụy', 'gan mat tuy', 'gân mà tự', 'gan mat', 'bộ ba chức năng', 'bo ba chuc nang',
      'bộ ba gan mật tụy', 'bo ba gan mat tuy', 'bộ 3 chức năng', 'bộ 3 gan mật tụy', 'hệ gan mật tụy',
      'he gan mat tuy', 'gan mật và tụy', 'túi mật và tụy', 'túi mật', 'tui mat', 'tuyến tụy', 'tuyen tuy',
      'sỏi mật', 'viêm tụy cấp', 'oddi', 'vater', 'bóng vater', 'cơ vòng oddi', 'vàng da', 'tá tràng', 'men tụy',
      'ống mật chủ', 'ong mat chu', 'ống tụy', 'ong tuy', 'wirsung', 'mạc nối nhỏ'
    ],
    chainSteps: [
      {
        step: 1,
        title: 'Nhu mô Gan & Hệ Mạch Máu Cửa (Sản xuất mật & Lọc máu)',
        shortTitle: '1. Gan & TM Cửa',
        partId: 'Liver',
        partIds: [
          'Liver',
          'Anterior lateral segment of liver (VI)',
          'Anterior medial segment of liver (V)',
          'Left anterior lateral segment of liver (III)',
          'Left medial segment of liver (IV)',
          'Left posterior lateral segment of liver (II)',
          'Posterior lateral segment of liver (VII)',
          'Posterior medial segment of liver (VIII)',
          'Posterior segment of liver (I)',
          'Hepatic portal vein',
          'Proper hepatic artery',
          'Common hepatic artery',
          'Hepatic veins',
          'Inferior vena cava (abdominal part)'
        ],
        system: 'visceral',
        shortNote: 'Sản xuất 800-1000ml mật/ngày; nhận máu dinh dưỡng từ Tĩnh mạch cửa.',
        note: 'Tuyến lớn nhất cơ thể (~1.5kg), sản xuất 800 - 1000ml dịch mật/ngày; nhận 75-80% lượng máu qua Tĩnh mạch cửa và 20-25% máu giàu oxy từ Động mạch gan riêng.'
      },
      {
        step: 2,
        title: 'Túi Mật, Ống Mật Chủ & Mạc Nối Nhỏ (Dự trữ & Dẫn lưu)',
        shortTitle: '2. Túi mật & Ống mật',
        partId: 'Gallbladder',
        partIds: ['Gallbladder', 'Bile duct', 'Lesser omentum'],
        system: 'visceral',
        shortNote: 'Cô đặc mật 10-20 lần; Ống mật chủ trong mạc nối nhỏ dẫn mật xuống D2.',
        note: 'Túi mật cô đặc mật gấp 10-20 lần; co bóp tống mật qua Ống mật chủ (chạy trong dây chằng gan - tá tràng của Mạc nối nhỏ) đổ xuống tá tràng khi có thức ăn mỡ.'
      },
      {
        step: 3,
        title: 'Tuyến Tụy, Ống Tụy Chính & Mạch Lách (Ngoại tiết men & Nội tiết)',
        shortTitle: '3. Tuyến tụy & Ống tụy',
        partId: 'Pancreas',
        partIds: [
          'Pancreas',
          'Pancreatic duct',
          'Accessory pancreatic duct',
          'Splenic artery',
          'Splenic vein',
          'Superior mesenteric vein'
        ],
        system: 'visceral',
        shortNote: 'Ống tụy Wirsung dẫn Lipase, Amylase, Trypsin; ĐM lách chạy bờ trên.',
        note: 'Tụy ngoại tiết tiết 1.5 - 2L dịch men tiêu hóa qua Ống tụy chính (Wirsung) & Ống tụy phụ (Santorini); Động mạch lách chạy dọc bờ trên tụy; Tĩnh mạch lách hợp lưu với TM mạc treo tràng trên sau đầu tụy để tạo nên Tĩnh mạch cửa; Tụy nội tiết tiết Insulin điều hòa đường huyết.'
      },
      {
        step: 4,
        title: 'Tá Tràng Chữ C, Môn Vị Dạ Dày & Cơ Vòng Oddi (Hợp lưu dịch)',
        shortTitle: '4. Tá tràng & Cơ Oddi',
        partId: 'Duodenum',
        partIds: [
          'Duodenum',
          'Stomach',
          'Oesophagus',
          'Gastroduodenal artery',
          'Left gastric artery',
          'Inferior pancreaticoduodenal artery',
          'Anterior inferior pancreaticoduodenal artery'
        ],
        system: 'visceral',
        shortNote: 'Khung tá tràng C ôm đầu tụy, nối môn vị dạ dày; ngã ba sỏi dễ kẹt.',
        note: 'Khung tá tràng chữ C ôm trọn đầu tụy, tiếp nối môn vị dạ dày và thực quản; bóng Vater và cơ vòng Oddi tại D2 là ngã ba hợp lưu dịch mật và men tụy; mạng mạch vị - tá tràng và tụy - tá tràng nuôi dưỡng phong phú, nơi sỏi mật dễ kẹt gây Viêm tụy cấp nguy kịch.'
      }
    ],
    clinicalInsights: [
      {
        question: 'Tại sao một viên sỏi mật nhỏ lại có thể gây biến chứng Viêm tụy cấp nguy kịch?',
        explanation: 'Ống mật chủ và ống tụy chính cùng đổ vào tá tràng qua một kênh chung tại bóng Vater. Khi sỏi mật rơi xuống kẹt tắc ngay ngã ba này, dịch mật dội ngược vào ống tụy. Men tụy (Trypsinogen) bị kích hoạt sớm ngay trong tuyến tụy, tự tiêu hủy và hoại tử mô tụy gây đau dữ dội, tụt huyết áp và đe dọa tính mạng.'
      },
      {
        question: 'Cắt bỏ túi mật rồi thì gan và ruột có tiêu hóa mỡ được nữa không?',
        explanation: 'Vẫn tiêu hóa được. Gan vẫn sản xuất mật liên tục và chảy thẳng xuống tá tràng. Tuy nhiên vì không còn túi mật để cô đặc và xả mật ồ ạt sau bữa ăn nhiều dầu mỡ, người đã cắt túi mật nên chia nhỏ bữa ăn và hạn chế ăn quá nhiều chất béo cùng lúc.'
      },
      {
        question: 'Tam chứng Charcot trong nhiễm trùng đường mật do sỏi mật gồm những dấu hiệu gì?',
        explanation: 'Bao gồm: Đau quặn hạ sườn phải -> Sốt rét run -> Vàng da vàng mắt. Đây là dấu hiệu cảnh báo sỏi đang tắc nghẽn ống mật chủ cần can thiệp cấp cứu lấy sỏi qua nội soi mật tụy ngược dòng (ERCP).'
      }
    ],
    lifestyleTips: [
      'Ăn sáng đầy đủ giúp túi mật co bóp tống mật đều đặn, chống đọng bùn và sỏi cholesterol.',
      'Hạn chế bia rượu tuyệt đối nếu có tiền sử đau tức hạ sườn phải hoặc men gan tăng cao.',
      'Uống đủ nước, duy trì cân nặng hợp lý để giảm bài tiết cholesterol quá bão hòa vào dịch mật.'
    ]
  },

  {
    id: 'axis_digestive_glands',
    titleVi: 'Hệ Thống Tuyến Tiêu Hóa (Digestive Glands System)',
    latin: 'Systema glandularum digestoriarum',
    category: 'Tiêu hóa – Tuyến ngoại tiết & Dịch thể',
    badge: 'Bộ Máy Tiết Men Tiêu Hóa',
    icon: '🧪',
    summary: 'Toàn bộ mạng lưới tuyến tiêu hóa từ khoang miệng đến ổ bụng: 3 cặp tuyến nước bọt lớn (Mang tai, Dưới hàm, Dưới lưỡi), Tuyến dịch vị dạ dày, Tuyến tụy nội/ngoại tiết và Nhu mô gan.',
    primarySystems: ['visceral', 'cardiovascular', 'skeletal'],
    defaultPartId: 'Pancreas',
    keywords: [
      'tuyến tiêu hóa', 'tuyen tieu hoa', 'các tuyến tiêu hóa', 'cac tuyen tieu hoa', 'hệ tuyến tiêu hóa',
      'he tuyen tieu hoa', 'tất cả tuyến tiêu hóa', 'tuyến nước bọt', 'tuyen nuoc bot', 'tuyến mang tai',
      'tuyến dưới hàm', 'tuyến dưới lưỡi', 'men tiêu hóa', 'dịch tiêu hóa', 'tuyến dịch vị'
    ],
    chainSteps: [
      {
        step: 1,
        title: '3 Cặp Tuyến Nước Bọt & Ống Tuyến (Mang tai, Dưới hàm, Dưới lưỡi)',
        shortTitle: '1. Tuyến nước bọt',
        partId: 'Parotid gland.l',
        partIds: [
          'Parotid gland.l',
          'Parotid gland.r',
          'Parotid duct.l',
          'Parotid duct.r',
          'Submandibular gland.l',
          'Submandibular gland.r',
          'Submandibular duct.l',
          'Submandibular duct.r',
          'Sublingual gland.l',
          'Sublingual gland.r'
        ],
        system: 'visceral',
        shortNote: 'Tiết 1 - 1.5 lít nước bọt/ngày chứa Amylase (Ptyalin) tiêu hóa tinh bột chín.',
        note: '3 cặp tuyến ngoại tiết lớn: Tuyến mang tai tiết thanh dịch chứa Amylase (Ptyalin); Tuyến dưới hàm và dưới lưỡi tiết hỗn hợp dịch nhầy Mucin giúp bôi trơn và tiêu hóa tinh bột chín ngay tại miệng.'
      },
      {
        step: 2,
        title: 'Tuyến Dịch Vị Dạ Dày & Ống Tiêu Hóa (Gastric Glands)',
        shortTitle: '2. Tuyến dịch vị',
        partId: 'Stomach',
        partIds: ['Stomach', 'Oesophagus', 'Left gastric artery'],
        system: 'visceral',
        shortNote: 'Tế bào viền tiết axit HCl pH 1.5-2 và men Pepsin tiêu hóa protein.',
        note: 'Hàng triệu tuyến vi thể ở niêm mạc: Tế bào thành (viền) tiết axit HCl pH 1.5 - 2 diệt khuẩn và hoạt hóa Pepsinogen; Tế bào chính tiết Pepsinogen phân cắt đạm; Tế bào cổ tuyến tiết nhầy kiềm bảo vệ.'
      },
      {
        step: 3,
        title: 'Lá Gan & Hệ Thống Dẫn Mật (Tuyến tiêu hóa lớn nhất cơ thể)',
        shortTitle: '3. Nhu mô Gan & Mật',
        partId: 'Liver',
        partIds: [
          'Liver',
          'Anterior lateral segment of liver (VI)',
          'Anterior medial segment of liver (V)',
          'Left anterior lateral segment of liver (III)',
          'Left medial segment of liver (IV)',
          'Left posterior lateral segment of liver (II)',
          'Posterior lateral segment of liver (VII)',
          'Posterior medial segment of liver (VIII)',
          'Posterior segment of liver (I)',
          'Gallbladder',
          'Bile duct',
          'Hepatic portal vein',
          'Proper hepatic artery'
        ],
        system: 'visceral',
        shortNote: 'Tuyến nặng 1.5kg, liên tục tiết 800 - 1000ml dịch mật nhũ hóa chất béo.',
        note: 'Tuyến tiêu hóa kiêm chuyển hóa lớn nhất cơ thể, sản xuất liên tục 800 - 1000ml dịch mật chứa muối mật và sắc tố mật để nhũ hóa lipid thức ăn tại tá tràng.'
      },
      {
        step: 4,
        title: 'Tuyến Tụy, Hệ Thống Ống Tụy & Tá Tràng (Men Tiêu Hóa & Insulin)',
        shortTitle: '4. Tuyến tụy & Ống tụy',
        partId: 'Pancreas',
        partIds: ['Pancreas', 'Pancreatic duct', 'Accessory pancreatic duct', 'Duodenum', 'Splenic artery'],
        system: 'visceral',
        shortNote: 'Tiết bộ ba men Amylase, Lipase, Protease và hormone Insulin.',
        note: 'Tụy ngoại tiết tiết 1.5 - 2 lít dịch tụy chứa Amylase (đường), Lipase (mỡ), Trypsinogen/Chymotrypsinogen (đạm) dẫn qua ống Wirsung vào tá tràng D2; Tụy nội tiết tiết Insulin và Glucagon.'
      }
    ],
    clinicalInsights: [
      {
        question: 'Cơ chế điều hòa phối hợp giữa các tuyến tiêu hóa trong bữa ăn diễn ra như thế nào?',
        explanation: 'Giai đoạn tâm linh (Cephalic phase): Nhìn, ngửi thức ăn kích thích dây X bài tiết nước bọt và dịch vị trước khi nuốt. Khi thức ăn xuống tá tràng (Intestinal phase), niêm mạc ruột tiết hormone Secretin và Cholecystokinin (CCK) kích thích gan tiết mật, túi mật co bóp và tuyến tụy bơm ồ ạt enzyme tiêu hóa vào ruột.'
      },
      {
        question: 'Nếu tuyến tụy bị suy giảm chức năng ngoại tiết thì cơ thể bị ảnh hưởng gì?',
        explanation: 'Khi tụy không tiết đủ men Lipase và Protease, cơ thể không thể hấp thu chất béo và vitamin tan trong dầu (A, D, E, K), dẫn đến tình trạng tiêu phân mỡ (steatorrhea), sụt cân nhanh chóng và suy kiệt dinh dưỡng.'
      }
    ],
    lifestyleTips: [
      'Nhai kỹ khi ăn để enzyme amylase tuyến nước bọt có đủ thời gian phân giải tinh bột, giảm gánh nặng co bóp cho dạ dày.',
      'Uống đủ nước trong ngày để duy trì lưu lượng tiết nước bọt và bảo vệ men răng chống sâu răng.',
      'Hạn chế bia rượu để phòng ngừa viêm tụy mạn tính và xơ hóa nhu mô gan.'
    ]
  },

  {
    id: 'axis_csf_ventricles',
    titleVi: 'Vòng Tuần Hoàn Dịch Não Tủy & Não Thất (CSF Circulation)',
    latin: 'Circulatio liquoris cerebrospinalis et systema ventriculare',
    category: 'Thần kinh – Dịch thể – Nội sọ',
    badge: 'Vòng Đệm Sinh Mệnh Não Thất',
    icon: '💧',
    summary: 'Hệ thống sản xuất, luân chuyển và tái hấp thu của Dịch não tủy (CSF): Đám rối màng mạch lọc huyết tương sản xuất CSF, chảy qua 4 buồng não thất, khoang dưới nhện và hấp thu về xoang tĩnh mạch màng cứng.',
    primarySystems: ['nervous', 'skeletal'],
    defaultPartId: 'Lateral ventricle.l',
    keywords: [
      'dịch não tủy', 'dich nao tuy', 'nước não tủy', 'csf', 'tuần hoàn dịch não tủy', 'tuan hoan dich nao tuy',
      'hệ thống não thất', 'he thong nao that', 'não thất', 'nao that', 'não thất bên', 'não thất 3', 'não thất ba',
      'não thất 4', 'não thất tư', 'cống não', 'cống sylvius', 'đám rối màng mạch', 'áp lực nội sọ',
      'não úng thủy', 'nao ung thuy', 'khoang dưới nhện'
    ],
    chainSteps: [
      {
        step: 1,
        title: 'Đám Rối Màng Mạch & Hai Não Thất Bên',
        shortTitle: '1. Não thất bên & Màng mạch',
        partId: 'Lateral ventricle.l',
        partIds: ['Lateral ventricle.l', 'Lateral ventricle.r', 'Choroid plexus.l', 'Choroid plexus.r'],
        system: 'nervous',
        shortNote: 'Sản xuất 500ml CSF/ngày; thể tích luân chuyển khoảng 150ml.',
        note: 'Đám rối màng mạch (Choroid plexus) trong hai não thất bên liên tục lọc huyết tương sản xuất 500ml dịch não tủy mỗi ngày, đóng vai trò đệm thủy lực chống va đập cho não.'
      },
      {
        step: 2,
        title: 'Lỗ Gian Não Thất (Monro) & Não Thất Ba',
        shortTitle: '2. Não thất ba',
        partId: 'Third ventricle',
        partIds: ['Third ventricle'],
        system: 'nervous',
        shortNote: 'Dịch từ hai bán cầu chảy qua lỗ Monro hội tụ vào Não thất ba ở đường giữa.',
        note: 'Dịch não tủy từ hai não thất bên luân chuyển qua lỗ gian não thất Monro đổ vào Não thất ba nằm hẹp ở đường giữa giữa hai đồi thị và vùng dưới đồi.'
      },
      {
        step: 3,
        title: 'Cống Não Sylvius (Aqueduct of Midbrain)',
        shortTitle: '3. Cống não Sylvius',
        partId: 'Aqueduct of midbrain',
        partIds: ['Aqueduct of midbrain'],
        system: 'nervous',
        shortNote: 'Ống hẹp 1-2mm dài 15mm; vị trí tắc nghẽn phổ biến gây não úng thủy.',
        note: 'Kênh dẫn hẹp nhất chỉ rộng 1-2mm chạy xuyên qua trung não nối não thất ba và não thất tư. Đây là điểm thắt hiểm yếu dễ bị tắc nghẽn do u hoặc xuất huyết.'
      },
      {
        step: 4,
        title: 'Não Thất Tư & Khoang Dưới Nhện',
        shortTitle: '4. Não thất tư & Dưới nhện',
        partId: 'Fourth ventricle',
        partIds: ['Fourth ventricle'],
        system: 'nervous',
        shortNote: 'Thoát qua lỗ Luschka & Magendie vào khoang dưới nhện bao bọc toàn bộ não tủy.',
        note: 'Từ não thất tư, dịch não tủy thoát qua 2 lỗ bên (Luschka) và 1 lỗ giữa (Magendie) ra khoang dưới nhện bao quanh toàn bộ não và tủy sống, trước khi hấp thu qua hạt màng nhện Pacchioni vào máu tĩnh mạch.'
      }
    ],
    clinicalInsights: [
      {
        question: 'Cơ chế bệnh sinh của bệnh Não úng thủy (Hydrocephalus) là gì?',
        explanation: 'Khi cống não Sylvius bị hẹp bẩm sinh hoặc có khối u/máu tụ chèn ép các lỗ thoát não thất tư, dịch não tủy tiếp tục sinh ra nhưng không thoát được. Dịch ứ trệ làm giãn căng các buồng não thất, tăng vọt áp lực nội sọ gây đau đầu dữ dội, nôn vọt, teo nhu mô não và đe dọa tử vong.'
      },
      {
        question: 'Tại sao chọc dò tủy sống thắt lưng (L3-L4 hoặc L4-L5) lại lấy được dịch não tủy an toàn?',
        explanation: 'Khoang dưới nhện bao quanh não thông liên tục xuống tận khoang cùng tủy sống. Tủy sống tận cùng ở đốt sống L1-L2, nên chọc kim ở mức L3-L4 an toàn lấy dịch não tủy xét nghiệm tìm vi khuẩn gây viêm màng não mà không sợ chọc vào tủy sống.'
      }
    ],
    lifestyleTips: [
      'Đi khám ngay nếu xuất hiện tam chứng tăng áp lực nội sọ: Đau đầu dữ dội tăng dần, buồn nôn vọt vào buổi sáng và nhìn mờ/song thị.',
      'Đội mũ bảo hiểm đạt chuẩn khi tham gia giao thông để bảo vệ hộp sọ khỏi chấn thương xuất huyết khoang dưới nhện.'
    ]
  },

  {
    id: 'axis_cranial_nerves',
    titleVi: '12 Đôi Dây Thần Kinh Sọ Não (Cranial Nerves)',
    latin: 'Nervi craniales I - XII',
    category: 'Thần kinh – Tai Mũi Họng – Mắt',
    badge: 'Mạng Lưới Thần Kinh Sọ',
    icon: '⚡',
    summary: 'Mạng lưới thần kinh khởi phát trực tiếp từ não bộ và thân não, điều khiển toàn bộ giác quan, vận động nét mặt và nội tạng.',
    primarySystems: ['nervous', 'skeletal'],
    defaultPartId: 'Pons.l',
    keywords: [
      '12 dây thần kinh', '12 day than kinh so', 'cranial nerves', 'liệt dây 7', 'méo miệng',
      'dây 5', 'đau dây 5', 'dây x', 'phế vị', 'thần kinh thị giác', 'thần kinh sọ'
    ],
    chainSteps: [
      {
        step: 1,
        title: 'Não bộ & Thân não (Cầu - Hành não)',
        shortTitle: '1. Thân não',
        partId: 'Pons.l',
        partIds: ['Midbrain.l', 'Midbrain.r', 'Pons.l', 'Pons.r', 'Medulla oblongata.l', 'Medulla oblongata.r'],
        system: 'nervous',
        shortNote: 'Chứa các nhân nguyên ủy của 12 đôi dây thần kinh sọ.',
        note: 'Chứa các nhân nguyên ủy của 12 đôi dây thần kinh sọ.'
      },
      {
        step: 2,
        title: 'Dây thần kinh V (Tam thoa / Sinh ba)',
        shortTitle: '2. Dây V',
        partId: 'Trigeminal nerve (V).l',
        partIds: ['Trigeminal nerve (V).l', 'Trigeminal nerve (V).r'],
        system: 'nervous',
        shortNote: 'Cảm giác mặt và cơ nhai; tổn thương gây đau buốt như điện giật.',
        note: 'Chi phối cảm giác toàn bộ khuôn mặt, răng miệng và cơ nhai. Tổn thương gây cơn đau buốt mặt như điện giật.'
      },
      {
        step: 3,
        title: 'Dây thần kinh VII (Thần kinh mặt)',
        shortTitle: '3. Dây VII',
        partId: 'Facial nerve (VII).l',
        partIds: ['Facial nerve (VII).l', 'Facial nerve (VII).r'],
        system: 'nervous',
        shortNote: 'Vận động cơ mặt; nhiễm lạnh gây liệt mặt Bell méo miệng.',
        note: 'Chi phối toàn bộ cơ biểu cảm khuôn mặt. Khi bị lạnh/phù nề trong ống xương đá gây liệt Bell méo miệng, mắt nhắm không kín.'
      },
      {
        step: 4,
        title: 'Dây thần kinh X (Phế vị / Lang thang)',
        shortTitle: '4. Dây X',
        partId: 'Vagus nerve (X).l',
        partIds: ['Vagus nerve (X).l', 'Vagus nerve (X).r'],
        system: 'nervous',
        shortNote: 'Chi phối nhịp tim, phế quản và nhu động ống tiêu hóa.',
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
    icon: '🦴',
    summary: 'Trục dẫn truyền xung động vận động từ vỏ não qua tủy sống và rễ thần kinh thắt lưng xuống chi dưới, giải thích đau lưng lan xuống chân.',
    primarySystems: ['nervous', 'joints', 'skeletal'],
    defaultPartId: 'Intervertebral disc L4-L5',
    keywords: [
      'trục não tủy', 'não tủy', 'trục thần kinh tọa',
      'đau thắt lưng', 'l4-l5', 'sciatic', 'spinal cord', 'liệt nửa người', 'đau rễ'
    ],
    chainSteps: [
      {
        step: 1,
        title: 'Vỏ não & Thân não vận động',
        shortTitle: '1. Não bộ',
        partId: 'Midbrain.l',
        partIds: ['Midbrain.l', 'Midbrain.r', 'Pons.l', 'Pons.r', 'Medulla oblongata.l', 'Medulla oblongata.r'],
        system: 'nervous',
        shortNote: 'Phát xung vận động, bắt chéo tháp sang bên đối diện tại hành não.',
        note: 'Phát lệnh vận động cử động cơ thể, bắt chéo tháp sang bên đối diện tại hành não.'
      },
      {
        step: 2,
        title: 'Tủy sống (Trục dẫn truyền)',
        shortTitle: '2. Tủy sống',
        partId: 'White matter of spinal cord',
        partIds: ['White matter of spinal cord', 'Anterior horn of spinal cord', 'Posterior horn of spinal cord'],
        system: 'nervous',
        shortNote: 'Cáp quang sinh học trong ống sống truyền tín hiệu thần kinh.',
        note: 'Cáp quang sinh học chạy bên trong ống sống đốt sống, chia các đôi rễ thần kinh tủy gai.'
      },
      {
        step: 3,
        title: 'Đĩa đệm L4-L5 & Khớp sống',
        shortTitle: '3. Đĩa đệm',
        partId: 'Intervertebral disc L4-L5',
        partIds: ['Intervertebral disc L4-L5', 'Nucleus pulposus L4-L5'],
        system: 'joints',
        shortNote: 'Chịu tải trọng lớn nhất; nhân nhầy dễ thoát vị chèn rễ thần kinh.',
        note: 'Khu vực chịu tải trọng lớn nhất cơ thể, nơi nhân nhầy dễ thoát vị ra sau chèn ép rễ tủy.'
      },
      {
        step: 4,
        title: 'Dây thần kinh Tọa (Thần kinh ngồi)',
        shortTitle: '4. Dây Tọa',
        partId: 'Sciatic nerve.l',
        partIds: ['Sciatic nerve.l', 'Sciatic nerve.r'],
        system: 'nervous',
        shortNote: 'Dây lớn nhất cơ thể, chạy dọc mông xuống chân gây đau tê rát.',
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
    icon: '🫁',
    summary: 'Sự phối hợp nhịp nhàng giữa Tim và 2 lá Phổi: Máu nghèo oxy được bơm lên phổi lấy dưỡng khí rồi quay về tim để đi nuôi toàn bộ tế bào cơ thể.',
    primarySystems: ['cardiovascular', 'visceral', 'skeletal'],
    defaultPartId: 'Right ventricle',
    keywords: [
      'tim phổi', 'tim phoi', 'tuần hoàn', 'tuan hoan', 'động mạch phổi', 'khó thở suy tim',
      'phế nang', 'trao đổi khí', 'huyết áp', 'nhồi máu cơ tim'
    ],
    chainSteps: [
      {
        step: 1,
        title: 'Tâm thất Tim & Thân Động Mạch Phổi (Bơm Máu Lên Phổi)',
        shortTitle: '1. Tâm thất & Thân ĐMP',
        partId: 'Right ventricle',
        partIds: ['Right ventricle', 'Left ventricle', 'Pulmonary trunk', 'Left pulmonary artery', 'Right pulmonary artery'],
        system: 'cardiovascular',
        shortNote: 'Thất phải bơm máu lên phổi qua thân ĐMP, thất trái bơm đi nuôi cơ thể.',
        note: 'Tiếp nhận máu nghèo oxy từ cơ thể trở về và bơm qua Thân động mạch phổi chia 2 nhánh vào hai lá phổi.'
      },
      {
        step: 2,
        title: 'Mao mạch Phổi (Trao đổi khí)',
        shortTitle: '2. Hai lá phổi',
        partId: 'Superior lobe of left lung',
        partIds: ['Superior lobe of left lung', 'Inferior lobe of left lung', 'Superior lobe of right lung', 'Middle lobe of right lung', 'Inferior lobe of right lung'],
        system: 'visceral',
        shortNote: 'Thải CO2 và hấp thụ O2 qua màng phế nang mỏng 0.5 micromet.',
        note: 'Nơi hồng cầu nhả khí CO2 và hấp thụ khí O2 qua màng phế nang mao mạch mỏng 0.5 micromet.'
      },
      {
        step: 3,
        title: 'Tĩnh Mạch Phổi & Tâm Nhĩ Tim (Hồi Lưu Máu Giàu Oxy)',
        shortTitle: '3. TM Phổi & Tâm nhĩ',
        partId: 'Left atrium',
        partIds: [
          'Left atrium',
          'Right atrium',
          'Left superior pulmonary vein',
          'Left inferior pulmonary vein',
          'Right superior pulmonary vein',
          'Right inferior pulmonary vein'
        ],
        system: 'cardiovascular',
        shortNote: '4 tĩnh mạch phổi dẫn máu giàu oxy về tâm nhĩ trái chuẩn bị tống máu.',
        note: 'Đưa máu đỏ tươi giàu oxy từ phổi qua 4 tĩnh mạch phổi trở về tâm nhĩ trái với áp lực cao.'
      },
      {
        step: 4,
        title: 'Quai Động mạch chủ (Aorta)',
        shortTitle: '4. ĐM Chủ',
        partId: 'Ascending aorta',
        partIds: ['Ascending aorta', 'Thoracic aorta'],
        system: 'cardiovascular',
        shortNote: 'Động mạch lớn nhất cơ thể phân nhánh nuôi toàn bộ mô tế bào.',
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
    icon: '⚖️',
    summary: 'Chuỗi liên kết tải lực liên hoàn từ đầu cổ, thắt lưng đến khớp háng và khớp gối, lý giải nguyên nhân đau mỏi của dân văn phòng và người thoái hóa khớp.',
    primarySystems: ['skeletal', 'joints'],
    defaultPartId: 'Intervertebral disc L4-L5',
    keywords: [
      'chuỗi động học', 'chuoi dong hoc', 'tư thế', 'gù lưng', 'cổ rùa', 'đau vai gáy',
      'khớp gối', 'khớp háng', 'văn phòng', 'cột sống cổ', 'thoái hóa khớp'
    ],
    chainSteps: [
      {
        step: 1,
        title: 'Cột sống cổ C1-C2 (Tư thế Cổ rùa)',
        shortTitle: '1. Cột sống cổ',
        partId: 'Atlas (C1)',
        partIds: ['Atlas (C1)', 'Axis (C2)'],
        system: 'skeletal',
        shortNote: 'Cúi đầu 45-60° làm tăng tải trọng lên đốt sống cổ tới 27kg.',
        note: 'Đầu người nặng ~5kg. Khi cúi 45-60° xem điện thoại, áp lực lên đốt sống cổ tăng vọt lên 22-27kg.'
      },
      {
        step: 2,
        title: 'Lồng ngực & Cột sống ngực (Gù lưng)',
        shortTitle: '2. Lưng trên',
        partId: 'Vertebra L3',
        partIds: ['Vertebra L3'],
        system: 'skeletal',
        shortNote: 'Gù lưng trên làm co rút cơ ngực và gây đau mỏi cơ vai gáy.',
        note: 'Cơ ngực bị co rút ngắn lại, cơ lưng trên và cơ trám bị kéo dãn yếu ớt gây mỏi vai gáy âm ỉ.'
      },
      {
        step: 3,
        title: 'Đốt sống Thắt lưng & Đĩa đệm L4-L5',
        shortTitle: '3. Thắt lưng',
        partId: 'Intervertebral disc L4-L5',
        partIds: ['Intervertebral disc L4-L5', 'Nucleus pulposus L4-L5'],
        system: 'joints',
        shortNote: 'Võng lưng ép nén rìa sau đĩa đệm, tăng nguy cơ thoái hóa.',
        note: 'Khung chậu xoay trước (Anterior Pelvic Tilt) làm tăng độ ưỡn thắt lưng, ép nén rìa sau đĩa đệm.'
      },
      {
        step: 4,
        title: 'Khớp chậu háng (Chịu lực động)',
        shortTitle: '4. Khớp háng',
        partId: 'Acetabular labrum.l',
        partIds: ['Acetabular labrum.l', 'Acetabular labrum.r'],
        system: 'joints',
        shortNote: 'Cơ mông yếu làm gối vẹo trong, mòn sụn chêm và đau khớp.',
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
  },

  {
    id: 'axis_hpa_endocrine',
    titleVi: 'Trục Thần Kinh – Thể Dịch – Nội Tiết (HPA & Thyroid Axis)',
    latin: 'Axis hypothalamo-hypophyseo-adrenalis et thyroideus',
    category: 'Nội tiết – Thần kinh – Chuyển hóa',
    badge: 'Hệ Thống Tuyến Nội Tiết Toàn Thân',
    icon: '🧬',
    summary: 'Bộ chỉ huy thể dịch tối cao điều hòa toàn bộ cơ thể: Vùng dưới đồi và Tuyến yên phát lệnh kích hoạt Tuyến giáp điều hòa chuyển hóa năng lượng và Tuyến thượng thận đáp ứng stress sinh tồn.',
    primarySystems: ['nervous', 'visceral', 'cardiovascular', 'skeletal'],
    defaultPartId: 'Adenohypophysis',
    keywords: [
      'hpa', 'nội tiết', 'noi tiet', 'hệ nội tiết', 'he noi tiet', 'các tuyến nội tiết', 'cac tuyen noi tiet',
      'tuyến yên', 'tuyen yen', 'tuyến giáp', 'tuyen giap', 'tuyến thượng thận', 'tuyen thuong than',
      'tuyến tùng', 'tuyen tung', 'tuyến cận giáp', 'tuyen can giap', 'hormone', 'cortisol', 't3 t4',
      'stress sinh tồn', 'tuyến nội tiết', 'tuyen noi tiet'
    ],
    chainSteps: [
      {
        step: 1,
        title: 'Vùng Dưới Đồi & Tuyến Yên (Bộ Chỉ Huy Thể Dịch Tối Cao)',
        shortTitle: '1. Dưới đồi - Yên',
        partId: 'Adenohypophysis',
        partIds: ['Adenohypophysis', 'Neurohypophysis', 'Pineal gland', 'Hypothalamus', 'Third ventricle'],
        system: 'visceral',
        shortNote: 'Tiết CRH, TRH kích thích tuyến yên sản xuất ACTH, TSH, GH, LH/FSH.',
        note: 'Vùng dưới đồi là cầu nối giữa hệ thần kinh và hệ nội tiết, tiết hormone giải phóng (CRH, TRH) điều khiển thùy trước tuyến yên sản xuất hormone hướng tuyến và thùy sau dự trữ ADH, Oxytocin.'
      },
      {
        step: 2,
        title: 'Tuyến Giáp, Tuyến Cận Giáp & Mạch Máu Giáp (Chuyển Hóa & Canxi)',
        shortTitle: '2. Tuyến giáp',
        partId: 'Thyroid gland',
        partIds: [
          'Thyroid gland',
          'Thyroid cartilage',
          'Inferior parathyroid gland.l',
          'Inferior parathyroid gland.r',
          'Superior parathyroid gland.l',
          'Superior parathyroid gland.r',
          'Trachea',
          'Inferior thyroid artery.l',
          'Inferior thyroid artery.r'
        ],
        system: 'visceral',
        shortNote: 'Tuyến giáp tiết T3-T4 chuyển hóa; 4 tuyến cận giáp tiết PTH giữ canxi máu.',
        note: 'Tuyến giáp tựa trên sụn giáp và khí quản, tiết Thyroxine (T4) và T3 điều hòa tốc độ chuyển hóa cơ bản; 4 hạt tuyến cận giáp nằm mặt sau tiết hormone PTH đối kháng với Calcitonin để duy trì hằng định nồng độ canxi máu.'
      },
      {
        step: 3,
        title: 'Tuyến Thượng Thận & Thận (Trục Đối Phó Stress Sinh Tồn)',
        shortTitle: '3. Thượng thận',
        partId: 'Suprarenal gland.l',
        partIds: [
          'Suprarenal gland.l',
          'Suprarenal gland.r',
          'Renal pelvis.l',
          'Renal pelvis.r',
          'Inferior suprarenal artery.l',
          'Inferior suprarenal artery.r',
          'Abdominal aorta',
          'Inferior vena cava (abdominal part)'
        ],
        system: 'visceral',
        shortNote: 'Vỏ tiết Cortisol, Aldosterone; Tủy tiết Adrenaline phản xạ chống stress.',
        note: 'Tuyến thượng thận nằm chụp lên cực trên hai quả thận; Vỏ thượng thận nhận lệnh ACTH tiết Cortisol chống viêm và Aldosterone giữ muối nước; Tủy thượng thận được dây giao cảm kích thích trực tiếp tiết Adrenaline tăng nhịp tim và huyết áp trong tích tắc.'
      },
      {
        step: 4,
        title: 'Đảo Tụy Nội Tiết & Gan (Chuyển Hóa Glucose & Cân Bằng Năng Lượng)',
        shortTitle: '4. Đảo tụy & Gan',
        partId: 'Pancreas',
        partIds: [
          'Pancreas',
          'Liver',
          'Hepatic portal vein',
          'Splenic vein',
          'Superior mesenteric vein'
        ],
        system: 'visceral',
        shortNote: 'Đảo tụy tiết Insulin & Glucagon; dẫn qua Tĩnh mạch cửa vào gan điều hòa đường huyết.',
        note: 'Tuyến tụy nội tiết chứa các đảo tụy Langerhans: tế bào Beta tiết Insulin hạ đường huyết, tế bào Alpha tiết Glucagon tăng đường huyết; toàn bộ hormone dẫn qua Tĩnh mạch cửa trực tiếp vào Gan để tổng hợp dự trữ Glycogen.'
      }
    ],
    clinicalInsights: [
      {
        question: 'Tại sao căng thẳng kéo dài (Chronic Stress) lại gây tăng cân, teo cơ và suy giảm miễn dịch?',
        explanation: 'Khi stress kéo dài, trục HPA bị kích hoạt liên tục khiến tuyến thượng thận bơm ồ ạt hormone Cortisol. Cortisol dư thừa phân hủy protein ở cơ bắp để tạo đường, tích tụ mỡ ở vùng bụng và ức chế các tế bào lympho miễn dịch khiến cơ thể dễ nhiễm trùng.'
      },
      {
        question: 'Tại sao cắt bỏ toàn bộ tuyến giáp bắt buộc phải bảo tồn các tuyến cận giáp?',
        explanation: 'Nếu vô tình cắt hoặc làm tổn thương 4 hạt tuyến cận giáp siêu nhỏ ở mặt sau tuyến giáp, nồng độ canxi máu sẽ tụt nghiêm trọng trong vài giờ gây co giật cơ liên tục (Cơn hạ canxi Tetany), co thắt thanh quản dẫn đến ngạt thở đe dọa tính mạng.'
      }
    ],
    lifestyleTips: [
      'Ngủ đủ 7-8 tiếng trong phòng tối hoàn toàn giúp tuyến tùng tiết Melatonin tối ưu, phục hồi hệ nội tiết.',
      'Thiền định, hít thở sâu và đi dạo trong thiên nhiên giúp ức chế trục HPA, hạ nồng độ Cortisol huyết tương.',
      'Đảm bảo đủ muối Iod trong khẩu phần ăn hàng ngày để phòng ngừa bướu cổ và suy giáp.'
    ]
  },

  {
    id: 'axis_renal_cardiovascular',
    titleVi: 'Trục Tim – Thận & Hệ RAAS (Cardiorenal & Blood Pressure Axis)',
    latin: 'Axis cardiorenalis et systema reninum-angiotensinum',
    category: 'Tuần hoàn – Tiết niệu – Huyết áp',
    badge: 'Cân Bằng Thể Tích & Huyết Áp',
    icon: '🫘',
    summary: 'Trục tương tác sống còn giữa Tim mạch và Tiết niệu: Thận lọc 180 lít dịch/ngày và tiết enzyme Renin điều hòa huyết áp; Tim bơm máu nuôi thận và tiết peptide ANP khi quá tải thể tích tuần hoàn.',
    primarySystems: ['cardiovascular', 'visceral', 'skeletal'],
    defaultPartId: 'Renal pelvis.l',
    keywords: [
      'tim thận', 'tim than', 'trục tim thận', 'truc tim than', 'huyết áp', 'huyet ap', 'raas', 'renin',
      'hệ thận', 'he than', 'quả thận', 'qua than', 'thận học', 'bệnh thận', 'suy tim suy thận',
      'thượng thận', 'thuong than', 'niệu quản', 'bàng quang', 'lọc máu',
      'cardiorenal', 'angiotensin', 'aldosterone'
    ],
    chainSteps: [
      {
        step: 1,
        title: 'Cầu Thận, Bể Thận & Mạch Máu Thận (Bộ Lọc Máu Cực Lớn)',
        shortTitle: '1. Thận & Mạch',
        partId: 'Renal pelvis.l',
        partIds: [
          'Renal pelvis.l',
          'Renal pelvis.r',
          'Intrarenal arteries of left kidney',
          'Intrarenal arteries of right kidney',
          'Abdominal aorta',
          'Inferior vena cava (abdominal part)'
        ],
        system: 'visceral',
        shortNote: 'Nhận 20-25% cung lượng tim, lọc 180 lít dịch/ngày; tiết Renin khi tụt áp.',
        note: 'Mỗi phút thận đón nhận hơn 1.2 lít máu từ Động mạch chủ bụng qua Động mạch thận; tế bào cạnh cầu thận cảm nhận áp lực tưới máu để tiết enzyme Renin khởi động hệ thống co mạch RAAS.'
      },
      {
        step: 2,
        title: 'Tuyến Thượng Thận & Aldosterone (Hấp Thu Lại Muối Nước)',
        shortTitle: '2. Thượng thận',
        partId: 'Suprarenal gland.l',
        partIds: [
          'Suprarenal gland.l',
          'Suprarenal gland.r',
          'Renal pelvis.l',
          'Renal pelvis.r',
          'Inferior suprarenal artery.l',
          'Inferior suprarenal artery.r'
        ],
        system: 'visceral',
        shortNote: 'Angiotensin II kích hoạt vỏ thượng thận tiết Aldosterone tăng giữ Natri.',
        note: 'Renin từ thận hoạt hóa Angiotensinogen thành Angiotensin I, qua men ACE tại phổi thành Angiotensin II co mạch cực mạnh và kích thích thượng thận tiết Aldosterone giữ muối nước.'
      },
      {
        step: 3,
        title: 'Quả Tim, Cung Động Mạch Chủ & Mạch Vành (Bơm Máu & Tiết ANP)',
        shortTitle: '3. Tim & Cung ĐM',
        partId: 'Left ventricle',
        partIds: [
          'Left ventricle',
          'Right ventricle',
          'Left atrium',
          'Right atrium',
          'Ascending aorta',
          'Left coronary artery',
          'Right coronary artery'
        ],
        system: 'cardiovascular',
        shortNote: 'Thể tích dịch tăng làm tăng huyết áp; cơ tâm nhĩ căng tiết ANP giúp hạ áp.',
        note: 'Khi thể tích tuần hoàn tăng, tim phải bóp máu với lực lớn hơn; khi tâm nhĩ bị căng dãn quá mức do ứ máu, tế bào cơ tim tiết hormone ANP kích thích thận thải natri và nước để bảo vệ tim.'
      },
      {
        step: 4,
        title: 'Niệu Quản, Bàng Quang & Đường Thoát Nước Tiểu (Điều Hòa Thể Tích)',
        shortTitle: '4. Bàng quang',
        partId: 'Urinary bladder',
        partIds: ['Renal pelvis.l', 'Renal pelvis.r', 'Ureter.l', 'Ureter.r', 'Urinary bladder'],
        system: 'visceral',
        shortNote: 'Dẫn lưu 1.5 - 2 lít nước tiểu/ngày ra ngoài duy trì áp suất thẩm thấu cơ thể.',
        note: 'Nước tiểu sau khi tinh lọc và cô đặc chảy xuống bể thận, được sóng nhu động niệu quản đẩy xuống bàng quang tích trữ và bài xuất ra ngoài nhằm giữ cân bằng nước và điện giải.'
      }
    ],
    clinicalInsights: [
      {
        question: 'Tại sao suy tim lâu ngày lại dẫn đến suy thận và ngược lại (Hội chứng Tim - Thận)?',
        explanation: 'Khi tim suy, lượng máu bơm tới thận bị giảm khiến thận tưởng cơ thể bị mất máu nên tăng tiết Renin giữ muối nước. Lượng nước ứ đọng lại làm tăng gánh nặng thể tích khiến quả tim suy càng kiệt quệ hơn, tạo vòng xoắn bệnh lý ác tính (Cardiorenal Syndrome).'
      },
      {
        question: 'Tại sao bệnh nhân tăng huyết áp thường được kê thuốc ức chế men chuyển (ACEi)?',
        explanation: 'Thuốc ức chế men chuyển ngăn chặn việc chuyển đổi Angiotensin I thành Angiotensin II, làm giãn mạch máu toàn thân và ức chế bài tiết Aldosterone giúp thận đào thải bớt muối nước, từ đó hạ huyết áp hiệu quả và bảo vệ thành mạch.'
      }
    ],
    lifestyleTips: [
      'Giảm lượng muối ăn dưới 5g/ngày (khoảng 1 thìa cà phê) để giảm tải tích tụ Natri và bảo vệ cầu thận.',
      'Uống đủ 1.5 - 2 lít nước mỗi ngày giúp thận lọc độc tố dễ dàng và ngừa hình thành sỏi niệu.',
      'Đo huyết áp định kỳ để phát hiện sớm các tổn thương thành mạch âm thầm của tim và thận.'
    ]
  }
];
