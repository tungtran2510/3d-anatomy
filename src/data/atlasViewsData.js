// Comprehensive Atlas 2027 Preset Views & Media Data
// Chuáº©n thiáº¿t káº¿ & Danh má»¥c Giáº£i pháº«u há»c Quá»‘c táº¿ (Viá»‡t hÃ³a 100% chuáº©n Y khoa)

export const ATLAS_SYSTEMS_CATEGORIES = [
  {
    id: 'skeletal_views',
    titleVi: 'Há»‡ XÆ°Æ¡ng Khá»›p',
    systemKey: 'skeletal',
    cards: [
      {
        id: 'skel_full',
        title: '1. ToÃ n Bá»™ Há»‡ XÆ°Æ¡ng',
        subtitle: '206 xÆ°Æ¡ng trá»¥c vÃ  xÆ°Æ¡ng chi thá»ƒ',
        badge: 'ToÃ n thÃ¢n',
        image: '/images/atlas/skel_full.png',
        systems: ['skeletal'],
        camera: { x: 0, y: 0.86, z: 2.6, targetX: 0, targetY: 0.86, targetZ: 0 },
        desc: 'Bá»™ xÆ°Æ¡ng ngÆ°á»i trÆ°á»Ÿng thÃ nh: báº£o vá»‡ táº¡ng, táº¡o mÃ¡u vÃ  khung váº­n Ä‘á»™ng.'
      },
      {
        id: 'skel_skull',
        title: '2. Há»™p Sá» & XÆ°Æ¡ng Máº·t',
        subtitle: 'VÃ²m sá», ná»n sá» vÃ  xÆ°Æ¡ng hÃ m dÆ°á»›i',
        badge: 'Äáº§u máº·t',
        image: '/images/atlas/skel_skull.png',
        systems: ['skeletal'],
        camera: { x: 0.48, y: 1.62, z: 0.58, targetX: 0, targetY: 1.58, targetZ: 0 },
        highlight: 'Frontal bone',
        desc: 'Khá»‘i xÆ°Æ¡ng sá» nÃ£o báº£o vá»‡ nÃ£o bá»™ vÃ  khá»‘i xÆ°Æ¡ng máº·t nÃ¢ng Ä‘á»¡ cÃ¡c giÃ¡c quan.'
      },
      {
        id: 'skel_cranial_fossae',
        title: '3. Cáº¥u TrÃºc Ná»n Sá»',
        subtitle: 'Há»‘ sá» trÆ°á»›c, há»‘ sá» giá»¯a vÃ  há»‘ sá» sau',
        badge: 'Ná»n sá»',
        image: '/images/atlas/skel_cranial_fossae.png',
        systems: ['skeletal'],
        camera: { x: 0, y: 1.40, z: 0.45, targetX: 0, targetY: 1.55, targetZ: 0 },
        highlight: 'Sphenoid bone',
        desc: 'Há»‡ thá»‘ng cÃ¡c lá»— ná»n sá» cho 12 Ä‘Ã´i dÃ¢y tháº§n kinh sá» vÃ  máº¡ch mÃ¡u nÃ£o Ä‘i qua.'
      },
      {
        id: 'skel_spine',
        title: '4. Cá»™t Sá»‘ng & Lá»“ng Ngá»±c',
        subtitle: '33 Ä‘á»‘t sá»‘ng vÃ  12 Ä‘Ã´i xÆ°Æ¡ng sÆ°á»n',
        badge: 'ThÃ¢n mÃ¬nh',
        image: '/images/atlas/skel_spine.png',
        systems: ['skeletal'],
        camera: { x: 0.6, y: 1.15, z: 1.15, targetX: 0, targetY: 1.1, targetZ: 0 },
        highlight: 'Vertebra L1',
        desc: 'Trá»¥c nÃ¢ng Ä‘á»¡ cÆ¡ thá»ƒ vÃ  khung lá»“ng ngá»±c báº£o vá»‡ tim phá»•i.'
      },
      {
        id: 'skel_pelvis',
        title: '5. Khung Cháº­u & Khá»›p HÃ¡ng',
        subtitle: 'XÆ°Æ¡ng cháº­u, xÆ°Æ¡ng cÃ¹ng vÃ  á»• cá»‘i',
        badge: 'VÃ¹ng cháº­u',
        image: '/images/atlas/skel_pelvis.png',
        systems: ['skeletal'],
        camera: { x: 0, y: 0.88, z: 0.95, targetX: 0, targetY: 0.85, targetZ: 0 },
        highlight: 'Hip bone.l',
        desc: 'Hai xÆ°Æ¡ng cháº­u káº¿t há»£p xÆ°Æ¡ng cÃ¹ng táº¡o thÃ nh khung cháº­u vá»¯ng cháº¯c.'
      }
    ]
  },
  {
    id: 'circulatory_views',
    titleVi: 'Há»‡ Tim Máº¡ch & Tuáº§n HoÃ n',
    systemKey: 'cardiovascular',
    cards: [
      {
        id: 'circ_full',
        title: '1. Tuáº§n HoÃ n ToÃ n ThÃ¢n',
        subtitle: 'Máº¡ng lÆ°á»›i Ä‘á»™ng máº¡ch vÃ  tÄ©nh máº¡ch chá»§',
        badge: 'ToÃ n thÃ¢n',
        image: '/images/atlas/circ_full.png',
        systems: ['cardiovascular', 'skeletal'],
        camera: { x: 0, y: 1.0, z: 2.0, targetX: 0, targetY: 1.0, targetZ: 0 },
        desc: 'Máº¡ng lÆ°á»›i tuáº§n hoÃ n lá»›n vÃ  nhá» váº­n chuyá»ƒn oxy vÃ  dÆ°á»¡ng cháº¥t Ä‘i kháº¯p cÆ¡ thá»ƒ.'
      },
      {
        id: 'circ_heart_thorax',
        title: '2. Vá»‹ TrÃ­ Tim Trong Lá»“ng Ngá»±c',
        subtitle: 'Tim, quai Ä‘á»™ng máº¡ch chá»§ vÃ  trung tháº¥t',
        badge: 'Trung tháº¥t',
        image: '/images/atlas/circ_heart_thorax.png',
        systems: ['cardiovascular', 'skeletal'],
        camera: { x: 0, y: 1.28, z: 0.72, targetX: 0, targetY: 1.28, targetZ: 0 },
        highlight: 'Left ventricle',
        desc: 'Má»‘i tÆ°Æ¡ng quan giáº£i pháº«u giá»¯a tim, mÃ ng ngoÃ i tim vÃ  khung xÆ°Æ¡ng lá»“ng ngá»±c.'
      },
      {
        id: 'circ_simplified',
        title: '3. Máº¡ch MÃ¡u Äáº¡i Tuáº§n HoÃ n',
        subtitle: 'Äá»™ng máº¡ch chá»§ ngá»±c, cáº£nh vÃ  chi',
        badge: 'Äáº¡i tuáº§n hoÃ n',
        image: '/images/atlas/circ_simplified.png',
        systems: ['cardiovascular'],
        camera: { x: 0, y: 1.2, z: 1.1, targetX: 0, targetY: 1.2, targetZ: 0 },
        highlight: 'Ascending aorta',
        desc: 'CÃ¢y Ä‘á»™ng máº¡ch chá»§ phÃ¢n nhÃ¡nh nuÃ´i Ä‘áº§u máº·t, nÃ£o bá»™ vÃ  cÃ¡c chi thá»ƒ.'
      }
    ]
  },
  {
    id: 'nervous_views',
    titleVi: 'Há»‡ Tháº§n Kinh Trung Æ¯Æ¡ng & Ngoáº¡i BiÃªn',
    systemKey: 'nervous',
    cards: [
      {
        id: 'nerv_full',
        title: '1. Há»‡ Tháº§n Kinh ToÃ n ThÃ¢n',
        subtitle: 'NÃ£o bá»™, tá»§y sá»‘ng vÃ  máº¡ng lÆ°á»›i dÃ¢y TK',
        badge: 'ToÃ n thÃ¢n',
        image: '/images/atlas/nerv_full.png',
        systems: ['nervous', 'skeletal'],
        camera: { x: 0, y: 1.0, z: 2.1, targetX: 0, targetY: 1.0, targetZ: 0 },
        desc: 'Há»‡ thá»‘ng Ä‘iá»u khiá»ƒn toÃ n bá»™ cáº£m giÃ¡c, váº­n Ä‘á»™ng vÃ  chá»©c nÄƒng tá»± chá»§.'
      },
      {
        id: 'nerv_brain',
        title: '2. NÃ£o Bá»™ & Tháº§n Kinh Sá»',
        subtitle: 'Äáº¡i nÃ£o, tiá»ƒu nÃ£o vÃ  12 Ä‘Ã´i dÃ¢y TK sá»',
        badge: 'NÃ£o bá»™',
        image: '/images/atlas/nerv_brain.png',
        systems: ['nervous'],
        camera: { x: 0.35, y: 1.62, z: 0.52, targetX: 0, targetY: 1.58, targetZ: 0 },
        highlight: 'Falx cerebri',
        desc: 'Trung khu tháº§n kinh cao cáº¥p, Ä‘iá»u khiá»ƒn tÆ° duy, váº­n Ä‘á»™ng vÃ  cáº£m giÃ¡c giÃ¡c quan.'
      },
      {
        id: 'nerv_spinal',
        title: '3. Tá»§y Sá»‘ng & Rá»… Tháº§n Kinh',
        subtitle: 'á»ng sá»‘ng vÃ  31 Ä‘Ã´i rá»… tháº§n kinh gai',
        badge: 'Tá»§y sá»‘ng',
        image: '/images/atlas/nerv_spinal.png',
        systems: ['nervous', 'skeletal'],
        camera: { x: 0.65, y: 1.15, z: 0.95, targetX: 0, targetY: 1.1, targetZ: 0 },
        highlight: 'Anterior horn of spinal cord',
        desc: 'ÄÆ°á»ng dáº«n truyá»n xung Ä‘á»™ng tháº§n kinh giá»¯a nÃ£o bá»™ vÃ  ngoáº¡i vi cÆ¡ thá»ƒ.'
      },
      {
        id: 'nerv_csf',
        title: '4. Há»‡ NÃ£o Tháº¥t & Dá»‹ch NÃ£o Tá»§y (CSF)',
        subtitle: 'NÃ£o tháº¥t bÃªn, nÃ£o tháº¥t 3-4 vÃ  chu trÃ¬nh tuáº§n hoÃ n CSF',
        badge: 'Dá»‹ch nÃ£o tá»§y',
        image: '/images/atlas/nerv_csf.png',
        systems: ['nervous'],
        camera: { x: 0.28, y: 1.60, z: 0.45, targetX: 0, targetY: 1.58, targetZ: 0 },
        highlight: 'Lateral ventricle.l',
        desc: 'Há»‡ thá»‘ng cÃ¡c buá»“ng nÃ£o tháº¥t chá»©a dá»‹ch nÃ£o tá»§y Ä‘á»‡m giáº£m xÃ³c vÃ  thanh tháº£i Ä‘á»™c tá»‘ há»‡ Glymphatic.'
      }
    ]
  },
  {
    id: 'respiratory_views',
    titleVi: 'Há»‡ HÃ´ Háº¥p & Phá»•i',
    systemKey: 'visceral',
    cards: [
      {
        id: 'resp_upper',
        title: '1. ÄÆ°á»ng HÃ´ Háº¥p TrÃªn',
        subtitle: 'MÅ©i xoang, thanh quáº£n vÃ  khÃ­ quáº£n',
        badge: 'ÄÆ°á»ng thá»Ÿ trÃªn',
        image: '/images/atlas/resp_upper.png',
        systems: ['visceral', 'skeletal'],
        camera: { x: 0.20, y: 1.48, z: 0.60, targetX: 0, targetY: 1.45, targetZ: 0 },
        highlight: 'Trachea',
        desc: 'ÄÆ°á»ng dáº«n khÃ­, sá»¥n thanh nhiá»‡t, sá»¥n giÃ¡p vÃ  dÃ¢y thanh Ã¢m phÃ¡t Ã¢m.'
      },
      {
        id: 'resp_lungs',
        title: '2. Phá»•i & CÃ¢y Pháº¿ Quáº£n',
        subtitle: 'Hai lÃ¡ phá»•i vÃ  há»‡ phÃ¢n chia pháº¿ quáº£n',
        badge: 'Phá»•i',
        image: '/images/atlas/resp_lungs.png',
        systems: ['visceral', 'skeletal'],
        camera: { x: 0, y: 1.25, z: 0.88, targetX: 0, targetY: 1.25, targetZ: 0 },
        highlight: 'Superior lobe of left lung',
        desc: 'NÆ¡i trao Ä‘á»•i khÃ­ oxy vÃ  CO2 qua mÃ ng pháº¿ nang - mao máº¡ch.'
      },
      {
        id: 'resp_diaphragm',
        title: '3. CÆ¡ HoÃ nh & Äá»™ng Há»c Thá»Ÿ',
        subtitle: 'VÃ²m hoÃ nh ngÄƒn cÃ¡ch ngá»±c vÃ  bá»¥ng',
        badge: 'CÆ¡ hÃ´ háº¥p',
        image: '/images/atlas/resp_diaphragm.png',
        systems: ['muscular', 'skeletal', 'visceral'],
        camera: { x: 0, y: 1.15, z: 0.82, targetX: 0, targetY: 1.15, targetZ: 0 },
        highlight: 'Diaphragm',
        desc: 'CÆ¡ hÃ´ háº¥p chÃ­nh Ä‘áº£m nhiá»‡m 70% thÃ´ng khÃ­ khi hÃ­t vÃ o bÃ¬nh thÆ°á»ng.'
      }
    ]
  },
  {
    id: 'muscular_views',
    titleVi: 'Há»‡ CÆ¡ VÃ¢n ToÃ n ThÃ¢n',
    systemKey: 'muscular',
    cards: [
      {
        id: 'musc_head',
        title: '1. CÆ¡ VÃ¹ng Äáº§u Máº·t Cá»• & Máº¡ch MÃ¡u',
        subtitle: 'BÃ³c tÃ¡ch cÆ¡ nhai, cÆ¡ cá»• vÃ  máº¡ng máº¡ch thÃ¡i dÆ°Æ¡ng',
        badge: 'Äáº§u máº·t',
        image: '/images/atlas/musc_head.png',
        systems: ['muscular', 'skeletal', 'cardiovascular'],
        camera: { x: 0.52, y: 1.62, z: 0.55, targetX: 0, targetY: 1.58, targetZ: 0 },
        desc: 'Quan sÃ¡t tÆ°Æ¡ng quan giáº£i pháº«u xÆ°Æ¡ng sá», cÆ¡ cáº¯n, cÆ¡ á»©c Ä‘Ã²n chÅ©m vÃ  máº¡ng máº¡ch mÃ¡u máº·t.'
      },
      {
        id: 'musc_torso',
        title: '2. CÆ¡ ThÃ¢n MÃ¬nh & LÆ°ng Bá»¥ng',
        subtitle: 'CÆ¡ ngá»±c, cÆ¡ liÃªn sÆ°á»n vÃ  cÆ¡ tháº³ng bá»¥ng',
        badge: 'ThÃ¢n mÃ¬nh',
        image: '/images/atlas/musc_torso.png',
        systems: ['muscular', 'skeletal'],
        camera: { x: 0, y: 1.18, z: 1.2, targetX: 0, targetY: 1.15, targetZ: 0 },
        desc: 'Báº£o vá»‡ ná»™i táº¡ng á»• bá»¥ng vÃ  giá»¯ vá»¯ng cá»™t sá»‘ng trong tÆ° tháº¿ Ä‘á»©ng tháº³ng.'
      },
      {
        id: 'musc_limbs',
        title: '3. NhÃ³m CÆ¡ Chi Thá»ƒ',
        subtitle: 'CÆ¡ vai cÃ¡nh tay, mÃ´ng Ä‘Ã¹i vÃ  cáº³ng chÃ¢n',
        badge: 'Chi thá»ƒ',
        image: '/images/atlas/musc_limbs.png',
        systems: ['muscular', 'skeletal'],
        camera: { x: 0, y: 0.9, z: 2.2, targetX: 0, targetY: 0.9, targetZ: 0 },
        desc: 'CÆ¡ delta, nhá»‹ Ä‘áº§u, tam Ä‘áº§u, tá»© Ä‘áº§u Ä‘Ã¹i vÃ  nhÃ³m cÆ¡ cáº³ng chÃ¢n táº¡o lá»±c váº­n Ä‘á»™ng.'
      }
    ]
  },
  {
    id: 'digestive_views',
    titleVi: 'Há»‡ TiÃªu HÃ³a & Gan Máº­t',
    systemKey: 'visceral',
    cards: [
      {
        id: 'dig_upper',
        title: '1. ÄÆ°á»ng TiÃªu HÃ³a TrÃªn',
        subtitle: 'Thá»±c quáº£n, dáº¡ dÃ y vÃ  tÃ¡ trÃ ng',
        badge: 'Dáº¡ dÃ y',
        image: '/images/atlas/dig_upper.png',
        systems: ['visceral', 'skeletal'],
        camera: { x: 0, y: 1.15, z: 0.82, targetX: 0, targetY: 1.15, targetZ: 0 },
        highlight: 'Stomach',
        desc: 'NÆ¡i tiáº¿p nháº­n, nhÃ o trá»™n vÃ  tiÃªu hÃ³a sÆ¡ bá»™ thá»©c Äƒn nhá» axit dá»‹ch vá»‹.'
      },
      {
        id: 'dig_lower',
        title: '2. ÄÆ°á»ng TiÃªu HÃ³a DÆ°á»›i',
        subtitle: 'Ruá»™t non, ruá»™t giÃ  vÃ  trá»±c trÃ ng',
        badge: 'Ruá»™t non & giÃ ',
        image: '/images/atlas/dig_lower.png',
        systems: ['visceral', 'skeletal'],
        camera: { x: 0, y: 0.92, z: 0.85, targetX: 0, targetY: 0.92, targetZ: 0 },
        highlight: 'Ascending colon',
        desc: 'Háº¥p thu triá»‡t Ä‘á»ƒ cháº¥t dinh dÆ°á»¡ng vÃ  Ä‘Ã o tháº£i cáº·n bÃ£ qua Ä‘áº¡i trá»±c trÃ ng.'
      },
      {
        id: 'dig_peritoneum',
        title: '3. Gan Máº­t & Tá»¥y Táº¡ng',
        subtitle: 'LÃ¡ gan, tÃºi máº­t vÃ  tuyáº¿n tá»¥y ná»™i/ngoáº¡i tiáº¿t',
        badge: 'Gan máº­t tá»¥y',
        image: '/images/atlas/dig_peritoneum.png',
        systems: ['visceral', 'skeletal'],
        camera: { x: -0.15, y: 1.1, z: 0.88, targetX: 0, targetY: 1.1, targetZ: 0 },
        highlight: 'Gallbladder',
        desc: 'NhÃ  mÃ¡y chuyá»ƒn hÃ³a cháº¥t, khá»­ Ä‘á»™c vÃ  tiáº¿t enzym tiÃªu hÃ³a thá»©c Äƒn.'
      }
    ]
  },
  {
    id: 'lymphatic_views',
    titleVi: 'Há»‡ Báº¡ch Huyáº¿t & Miá»…n Dá»‹ch',
    systemKey: 'lymphatic',
    cards: [
      {
        id: 'lymph_spleen',
        title: '1. LÃ¡ LÃ¡ch & Há»‡ Báº¡ch Huyáº¿t',
        subtitle: 'LÃ¡ lÃ¡ch (Tá»³), chuá»—i háº¡ch báº¡ch huyáº¿t vÃ  á»‘ng ngá»±c',
        badge: 'LÃ¡ lÃ¡ch & Miá»…n dá»‹ch',
        image: '/images/atlas/lymph_spleen.png',
        systems: ['lymphatic', 'skeletal', 'visceral'],
        camera: { x: 0.25, y: 1.15, z: 0.78, targetX: 0.08, targetY: 1.15, targetZ: 0 },
        highlight: 'Spleen',
        desc: 'CÆ¡ quan lympho lá»›n nháº¥t cÆ¡ thá»ƒ lá»c mÃ¡u, tiÃªu há»§y há»“ng cáº§u giÃ  vÃ  sinh táº¿ bÃ o miá»…n dá»‹ch.'
      },
      {
        id: 'lymph_nodes_system',
        title: '2. Máº¡ng LÆ°á»›i Háº¡ch Báº¡ch Huyáº¿t ToÃ n ThÃ¢n',
        subtitle: 'Háº¡ch vÃ¹ng cá»•, nÃ¡ch, báº¹n vÃ  á»‘ng ngá»±c dáº«n lÆ°u',
        badge: 'Háº¡ch báº¡ch huyáº¿t',
        image: '/images/atlas/lymph_nodes_system.png',
        systems: ['lymphatic', 'skeletal'],
        camera: { x: 0, y: 1.2, z: 1.4, targetX: 0, targetY: 1.15, targetZ: 0 },
        highlight: 'Central axillary nodes.l',
        desc: 'HÃ ng rÃ o phÃ²ng thá»§ miá»…n dá»‹ch táº¿ bÃ o, báº¯t giá»¯ vi khuáº©n vÃ  dáº«n lÆ°u dá»‹ch báº¡ch huyáº¿t vá» tÄ©nh máº¡ch.'
      }
    ]
  },
  {
    id: 'urinary_views',
    titleVi: 'Há»‡ Tiáº¿t Niá»‡u & VÃ¹ng Cháº­u',
    systemKey: 'visceral',
    cards: [
      {
        id: 'urin_system',
        title: '1. Há»‡ Tiáº¿t Niá»‡u Tháº­n',
        subtitle: 'Hai quáº£ tháº­n, niá»‡u quáº£n vÃ  bÃ ng quang',
        badge: 'Tháº­n tiáº¿t niá»‡u',
        image: '/images/atlas/urin_system.png',
        systems: ['visceral', 'skeletal'],
        camera: { x: 0, y: 1.05, z: 0.85, targetX: 0, targetY: 1.05, targetZ: 0 },
        highlight: 'Kidney.l',
        desc: 'Lá»c mÃ¡u, cÃ¢n báº±ng Ä‘iá»‡n giáº£i vÃ  bÃ i tiáº¿t cháº¥t tháº£i qua nÆ°á»›c tiá»ƒu.'
      },
      {
        id: 'urin_pelvic',
        title: '2. CÃ¡c Táº¡ng VÃ¹ng Cháº­u',
        subtitle: 'BÃ ng quang, niá»‡u Ä‘áº¡o vÃ  Ä‘Ã¡y cháº­u',
        badge: 'Cháº­u hÃ´ng',
        image: '/images/atlas/urin_pelvic.png',
        systems: ['visceral', 'skeletal'],
        camera: { x: 0, y: 0.88, z: 0.78, targetX: 0, targetY: 0.88, targetZ: 0 },
        highlight: 'Urinary bladder',
        desc: 'Giáº£i pháº«u Ä‘Ã¡y cháº­u, nÃ¢ng Ä‘á»¡ cÃ¡c táº¡ng sinh dá»¥c vÃ  bÃ i tiáº¿t nÆ°á»›c tiá»ƒu.'
      }
    ]
  }
];

export const ATLAS_REGIONS_CATEGORIES = [
  {
    id: 'reg_head_neck',
    title: 'VÃ¹ng Äáº§u & Cá»•',
    subtitle: 'Há»™p sá», khá»‘i máº·t vÃ  cÃ¡c cÆ¡ máº¡ch mÃ¡u cá»•',
    badge: 'Äáº§u & Cá»•',
    image: '/images/atlas/reg_head_neck.png',
    camera: { x: 0, y: 1.55, z: 0.7, targetX: 0, targetY: 1.52, targetZ: 0 },
    systems: ['skeletal', 'nervous', 'cardiovascular']
  },
  {
    id: 'reg_thorax',
    title: 'VÃ¹ng Lá»“ng Ngá»±c',
    subtitle: 'Tim, hai lÃ¡ phá»•i, trung tháº¥t vÃ  thÃ nh ngá»±c',
    badge: 'Lá»“ng ngá»±c',
    image: '/images/atlas/reg_thorax.png',
    camera: { x: 0, y: 1.25, z: 1.0, targetX: 0, targetY: 1.22, targetZ: 0 },
    systems: ['skeletal', 'cardiovascular', 'visceral']
  },
  {
    id: 'reg_abdomen_pelvis',
    title: 'VÃ¹ng Bá»¥ng & Cháº­u',
    subtitle: 'Khoang phÃºc máº¡c, ruá»™t vÃ  táº¡ng cháº­u hÃ´ng',
    badge: 'Bá»¥ng & Cháº­u',
    image: '/images/atlas/reg_abdomen_pelvis.png',
    camera: { x: 0, y: 0.98, z: 1.05, targetX: 0, targetY: 0.95, targetZ: 0 },
    systems: ['skeletal', 'visceral']
  },
  {
    id: 'reg_spine',
    title: 'Trá»¥c Cá»™t Sá»‘ng',
    subtitle: 'Äoáº¡n sá»‘ng cá»•, ngá»±c, tháº¯t lÆ°ng vÃ  cÃ¹ng cá»¥t',
    badge: 'Cá»™t sá»‘ng',
    image: '/images/atlas/reg_spine.png',
    camera: { x: 0.75, y: 1.15, z: 0.9, targetX: 0, targetY: 1.1, targetZ: 0 },
    systems: ['skeletal']
  },
  {
    id: 'reg_upper_limb',
    title: 'VÃ¹ng Chi TrÃªn',
    subtitle: 'Äai vai, cÃ¡nh tay, cáº³ng tay vÃ  bÃ n tay',
    badge: 'Chi trÃªn',
    image: '/images/atlas/reg_upper_limb.png',
    camera: { x: 0.45, y: 1.1, z: 1.1, targetX: 0.35, targetY: 1.1, targetZ: 0 },
    systems: ['skeletal', 'muscular']
  },
  {
    id: 'reg_lower_limb',
    title: 'VÃ¹ng Chi DÆ°á»›i',
    subtitle: 'Khá»›p hÃ¡ng, Ä‘Ã¹i, khá»›p gá»‘i vÃ  cáº³ng bÃ n chÃ¢n',
    badge: 'Chi dÆ°á»›i',
    image: '/images/atlas/reg_lower_limb.png',
    camera: { x: 0.25, y: 0.5, z: 1.3, targetX: 0.2, targetY: 0.5, targetZ: 0 },
    systems: ['skeletal']
  }
];

import { getAtlasMediaCategories } from './atlasMediaManager.js';

export const ATLAS_MEDIA_CATEGORIES = getAtlasMediaCategories();


export const ATLAS_QUIZZES_DATA = [
  {
    id: 'quiz_identify',
    title: '1. Tráº¯c Nghiá»‡m Nháº­n Diá»‡n 3D',
    subtitle: 'Cháº¡m trá»±c tiáº¿p vÃ o Ä‘Ãºng cáº¥u trÃºc Ä‘Æ°á»£c yÃªu cáº§u',
    badge: 'Tráº¯c nghiá»‡m 3D',
    image: '/images/atlas/quiz_identify.png',
    action: 'start_quiz',
    desc: 'Há»‡ thá»‘ng Ä‘Æ°a ra cÃ¢u há»i danh phÃ¡p y khoa, báº¡n xoay mÃ´ hÃ¬nh 3D vÃ  cháº¡m Ä‘Ãºng Ä‘Ã­ch.'
  },
  {
    id: 'quiz_fsrs',
    title: '2. Tháº» Ghi Nhá»› ThÃ´ng Minh FSRS',
    subtitle: 'Thuáº­t toÃ¡n Ã´n táº­p ngáº¯t quÃ£ng khoa há»c',
    badge: 'Ã”n táº­p FSRS',
    image: '/images/atlas/quiz_fsrs.png',
    action: 'start_fsrs',
    desc: 'Tá»± Ä‘á»™ng lÃªn lá»‹ch Ã´n cÃ¡c má»‘c giáº£i pháº«u hay quÃªn Ä‘á»ƒ kháº¯c sÃ¢u vÃ o trÃ­ nhá»› dÃ i háº¡n.'
  },
  {
    id: 'quiz_clinical_cases',
    title: '3. Ca Bá»‡nh LÃ¢m SÃ ng TÆ°Æ¡ng TÃ¡c',
    subtitle: 'TÃ¬nh huá»‘ng cáº¥p cá»©u tai náº¡n vÃ  pháº«u thuáº­t',
    badge: 'BÃ¡c sÄ© áº£o',
    image: '/images/atlas/quiz_clinical_cases.png',
    action: 'start_scenario',
    desc: 'Váº­n dá»¥ng giáº£i pháº«u vÃ o lÃ¢m sÃ ng: váº¿t thÆ°Æ¡ng tháº¥u ngá»±c, gÃ£y cá»• xÆ°Æ¡ng Ä‘Ã¹i, thoÃ¡t vá»‹.'
  }
];

// 4. GROSS ANATOMY LAB (PhÃ²ng Thá»±c Táº­p Giáº£i Pháº«u Thi Thá»ƒ / BÃ n Má»• - Visible Body Cadaver Standard)
export const ATLAS_LAB_CATEGORIES = [
  {
    id: 'lab_back',
    title: '1. VÃ¹ng LÆ°ng (Back - Náº±m sáº¥p)',
    subtitle: 'CÆ¡ thang, cÆ¡ lÆ°ng rá»™ng vÃ  cá»™t sá»‘ng trÃªn bÃ n má»•',
    badge: 'Náº±m sáº¥p',
    orientation: 'prone',
    showTable: true,
    systems: ['muscular', 'skeletal'],
    camera: { x: 0.65, y: 1.55, z: 0.45, targetX: 0, targetY: 0.85, targetZ: 0 },
    image: '/images/atlas/reg_thorax.png',
    desc: 'Pháº«u tÃ­ch vÃ¹ng lÆ°ng á»Ÿ tÆ° tháº¿ náº±m sáº¥p (Prone) trÃªn bÃ n má»• inox y khoa.'
  },
  {
    id: 'lab_upper_limb',
    title: '2. Chi TrÃªn & Äai Vai (Upper Limb)',
    subtitle: 'Äai vai, cÃ¡nh tay, cáº³ng tay vÃ  bÃ n tay',
    badge: 'Náº±m ngá»­a',
    orientation: 'supine',
    showTable: true,
    systems: ['muscular', 'skeletal', 'nervous'],
    camera: { x: 0.85, y: 1.35, z: 0.65, targetX: 0.35, targetY: 0.85, targetZ: -0.35 },
    image: '/images/atlas/reg_upper_limb.png',
    desc: 'Bá»™c lá»™ cÆ¡ delta, á»‘ng cÃ¡nh tay vÃ  bÃ³ máº¡ch tháº§n kinh chi trÃªn.'
  },
  {
    id: 'lab_thorax',
    title: '3. Lá»“ng Ngá»±c (Thorax)',
    subtitle: 'Khung sÆ°á»n, cÆ¡ liÃªn sÆ°á»n vÃ  cÆ¡ ngá»±c lá»›n',
    badge: 'Náº±m ngá»­a',
    orientation: 'supine',
    showTable: true,
    systems: ['skeletal', 'muscular'],
    camera: { x: 0.45, y: 1.50, z: 0.35, targetX: 0, targetY: 0.85, targetZ: -0.25 },
    image: '/images/atlas/reg_thorax.png',
    desc: 'BÃ³c tÃ¡ch thÃ nh ngá»±c trÆ°á»›c bá»™c lá»™ xÆ°Æ¡ng á»©c, sá»¥n sÆ°á»n vÃ  cÆ¡ hoÃ nh.'
  },
  {
    id: 'lab_heart_lungs',
    title: '4. Tim & Phá»•i (Heart & Lungs)',
    subtitle: 'Trung tháº¥t, mÃ ng ngoÃ i tim vÃ  pháº¿ quáº£n',
    badge: 'Náº±m ngá»­a',
    orientation: 'supine',
    showTable: true,
    systems: ['visceral', 'cardiovascular', 'skeletal'],
    camera: { x: 0.35, y: 1.45, z: 0.25, targetX: 0, targetY: 0.85, targetZ: -0.25 },
    image: '/images/atlas/med_heart.png',
    desc: 'Pháº«u tÃ­ch trung tháº¥t giá»¯a bá»™c lá»™ cÃ¡c buá»“ng tim, quai Ä‘á»™ng máº¡ch chá»§ vÃ  hai lÃ¡ phá»•i.'
  },
  {
    id: 'lab_abdomen',
    title: '5. ThÃ nh Bá»¥ng & á»” Bá»¥ng (Abdomen)',
    subtitle: 'CÆ¡ tháº³ng bá»¥ng, cÆ¡ chÃ©o bá»¥ng vÃ  bao cÆ¡',
    badge: 'Náº±m ngá»­a',
    orientation: 'supine',
    showTable: true,
    systems: ['muscular', 'visceral'],
    camera: { x: 0.50, y: 1.40, z: 0.45, targetX: 0, targetY: 0.82, targetZ: 0.05 },
    image: '/images/atlas/reg_abdomen.png',
    desc: 'Má»Ÿ thÃ nh bá»¥ng trÆ°á»›c bá»™c lá»™ lÃ¡ phÃºc máº¡c thÃ nh vÃ  máº¡c ná»‘i lá»›n.'
  },
  {
    id: 'lab_intraperitoneal',
    title: '6. Táº¡ng Trong PhÃºc Máº¡c (Intraperitoneal)',
    subtitle: 'Dáº¡ dÃ y, gan, ruá»™t non vÃ  Ä‘áº¡i trÃ ng',
    badge: 'Náº±m ngá»­a',
    orientation: 'supine',
    showTable: true,
    systems: ['visceral'],
    camera: { x: 0.40, y: 1.35, z: 0.35, targetX: 0, targetY: 0.82, targetZ: 0.05 },
    image: '/images/atlas/reg_abdomen.png',
    desc: 'Há»‡ tiÃªu hÃ³a trong á»• bá»¥ng, máº¡c treo ruá»™t vÃ  phÃ¢n bá»‘ máº¡ch máº¡c treo trÃ ng trÃªn.'
  },
  {
    id: 'lab_retroperitoneal',
    title: '7. Táº¡ng Sau PhÃºc Máº¡c (Retroperitoneal)',
    subtitle: 'Hai quáº£ tháº­n, tuyáº¿n thÆ°á»£ng tháº­n vÃ  ÄM chá»§ bá»¥ng',
    badge: 'Náº±m ngá»­a',
    orientation: 'supine',
    showTable: true,
    systems: ['visceral', 'cardiovascular', 'skeletal'],
    camera: { x: 0.30, y: 1.35, z: 0.20, targetX: 0, targetY: 0.82, targetZ: 0.02 },
    image: '/images/atlas/reg_abdomen.png',
    desc: 'BÃ³c tÃ¡ch khoang sau phÃºc máº¡c bá»™c lá»™ Ä‘Ã i bá»ƒ tháº­n, niá»‡u quáº£n vÃ  TM chá»§ dÆ°á»›i.'
  },
  {
    id: 'lab_pelvis',
    title: '8. VÃ¹ng Cháº­u (Pelvis & Perineum)',
    subtitle: 'BÃ ng quang, trá»±c trÃ ng vÃ  Ä‘Ã¡y cháº­u',
    badge: 'Náº±m ngá»­a',
    orientation: 'supine',
    showTable: true,
    systems: ['skeletal', 'visceral', 'muscular'],
    camera: { x: 0.45, y: 1.35, z: 0.55, targetX: 0, targetY: 0.80, targetZ: 0.25 },
    image: '/images/atlas/reg_pelvis.png',
    desc: 'Khung cháº­u thá»±c táº­p giáº£i pháº«u cÆ¡ sÃ n cháº­u vÃ  Ä‘á»™ng máº¡ch cháº­u trong.'
  },
  {
    id: 'lab_lower_limb',
    title: '9. Chi DÆ°á»›i (Lower Limb Regional)',
    subtitle: 'ÄÃ¹i, khá»›p gá»‘i, cáº³ng chÃ¢n vÃ  bÃ n chÃ¢n',
    badge: 'Náº±m ngá»­a',
    orientation: 'supine',
    showTable: true,
    systems: ['muscular', 'skeletal', 'nervous'],
    camera: { x: 0.75, y: 1.25, z: 0.85, targetX: 0, targetY: 0.78, targetZ: 0.65 },
    image: '/images/atlas/reg_lower_limb.png',
    desc: 'Bá»™c lá»™ tam giÃ¡c Ä‘Ã¹i Scarpa, tháº§n kinh tá»a vÃ  cÃ¡c nhÃ³m cÆ¡ cáº³ng chÃ¢n.'
  }
];

// 5. CROSS SECTIONS (LÃ¡t Cáº¯t Giáº£i Pháº«u 3D - Cáº¯t Lá»›p Y Khoa CT/MRI Chuáº©n Visible Body)
export const ATLAS_CROSS_SECTIONS_CATEGORIES = [
  {
    id: 'cs_group_head_axial',
    titleVi: 'VÃ¹ng Äáº§u (Head Axial - Cáº¯t ngang)',
    plane: 'axial',
    cards: [
      {
        id: 'cs_head_thalamus',
        title: '1. Head (Thalamus)',
        subtitle: 'LÃ¡t cáº¯t ngang qua nÃ£o tháº¥t ba, Ä‘á»“i thá»‹ vÃ  bao trong',
        badge: 'Axial',
        plane: 'axial',
        offset: 1.62,
        camera: { x: 0, y: 1.88, z: 0.05, targetX: 0, targetY: 1.62, targetZ: 0 },
        systems: ['skeletal', 'nervous'],
        image: '/images/atlas/nerv_brain.png',
        desc: 'LÃ¡t cáº¯t ngang tiÃªu chuáº©n qua Ä‘á»“i thá»‹ vÃ  háº¡ch ná»n nÃ£o bá»™.'
      },
      {
        id: 'cs_head_brow',
        title: '2. Head (Brow)',
        subtitle: 'LÃ¡t cáº¯t ngang qua thÃ¹y trÃ¡n, xoang trÃ¡n vÃ  sá»«ng trÃ¡n nÃ£o tháº¥t bÃªn',
        badge: 'Axial',
        plane: 'axial',
        offset: 1.58,
        camera: { x: 0, y: 1.85, z: 0.05, targetX: 0, targetY: 1.58, targetZ: 0 },
        systems: ['skeletal', 'nervous'],
        image: '/images/atlas/nerv_brain.png',
        desc: 'Máº·t pháº³ng cáº¯t ngang qua má»©c cung mÃ y vÃ  cá»±c trÃ¡n.'
      },
      {
        id: 'cs_head_orbit_ax',
        title: '3. Head (Orbit) (Axial)',
        subtitle: 'LÃ¡t cáº¯t ngang qua nhÃ£n cáº§u, tháº§n kinh thá»‹ giÃ¡c vÃ  xÆ°Æ¡ng bÆ°á»›m',
        badge: 'Axial',
        plane: 'axial',
        offset: 1.52,
        camera: { x: 0, y: 1.80, z: 0.05, targetX: 0, targetY: 1.52, targetZ: 0 },
        systems: ['skeletal', 'nervous'],
        image: '/images/atlas/skel_skull.png',
        desc: 'Máº·t pháº³ng cáº¯t ngang qua hai há»‘c máº¯t vÃ  xoang bÆ°á»›m.'
      }
    ]
  },
  {
    id: 'cs_group_head_coronal',
    titleVi: 'VÃ¹ng Äáº§u (Head Coronal - Cáº¯t trÃ¡n)',
    plane: 'coronal',
    cards: [
      {
        id: 'cs_head_orbit_cor',
        title: '1. Head (Orbit) (Coronal)',
        subtitle: 'Máº·t pháº³ng Ä‘á»©ng ngang qua nhÃ£n cáº§u, xoang trÃ¡n vÃ  xoang hÃ m trÃªn',
        badge: 'Coronal',
        plane: 'coronal',
        offset: 0.06,
        camera: { x: 0, y: 1.55, z: 0.70, targetX: 0, targetY: 1.55, targetZ: 0 },
        systems: ['skeletal', 'nervous'],
        image: '/images/atlas/skel_skull.png',
        desc: 'Cáº¯t Ä‘á»©ng ngang bá»™c lá»™ há»‘c máº¯t vÃ  xoang cáº¡nh mÅ©i.'
      },
      {
        id: 'cs_head_pituitary',
        title: '2. Head (Pituitary)',
        subtitle: 'Máº·t pháº³ng Ä‘á»©ng ngang qua há»‘ yÃªn, tuyáº¿n yÃªn vÃ  giao thoa thá»‹',
        badge: 'Coronal',
        plane: 'coronal',
        offset: 0.00,
        camera: { x: 0, y: 1.55, z: 0.70, targetX: 0, targetY: 1.55, targetZ: 0 },
        systems: ['skeletal', 'nervous'],
        image: '/images/atlas/nerv_brain.png',
        desc: 'LÃ¡t cáº¯t Ä‘á»©ng ngang qua tuyáº¿n yÃªn vÃ  Ä‘á»™ng máº¡ch cáº£nh trong xoang hang.'
      },
      {
        id: 'cs_head_pons',
        title: '3. Head (Pons)',
        subtitle: 'Máº·t pháº³ng Ä‘á»©ng ngang qua cáº§u nÃ£o, nÃ£o tháº¥t tÆ° vÃ  bÃ¡n cáº§u tiá»ƒu nÃ£o',
        badge: 'Coronal',
        plane: 'coronal',
        offset: -0.04,
        camera: { x: 0, y: 1.55, z: 0.70, targetX: 0, targetY: 1.55, targetZ: 0 },
        systems: ['skeletal', 'nervous'],
        image: '/images/atlas/nerv_brain.png',
        desc: 'Cáº¯t Ä‘á»©ng ngang há»‘ sá» sau bá»™c lá»™ cáº§u nÃ£o vÃ  tiá»ƒu nÃ£o.'
      }
    ]
  },
  {
    id: 'cs_group_head_sagittal',
    titleVi: 'VÃ¹ng Äáº§u (Head Sagittal - Cáº¯t dá»c)',
    plane: 'sagittal',
    cards: [
      {
        id: 'cs_head_midsagittal',
        title: '1. Head (Midsagittal)',
        subtitle: 'LÃ¡t cáº¯t Ä‘á»©ng dá»c chÃ­nh giá»¯a qua thá»ƒ chai, thÃ¢n nÃ£o vÃ  tá»§y sá»‘ng',
        badge: 'Sagittal',
        plane: 'sagittal',
        offset: 0.00,
        camera: { x: 0.70, y: 1.55, z: 0.0, targetX: 0, targetY: 1.55, targetZ: 0 },
        systems: ['skeletal', 'nervous'],
        image: '/images/atlas/nerv_brain.png',
        desc: 'LÃ¡t cáº¯t Ä‘á»©ng dá»c chÃ­nh giá»¯a thá»ƒ hiá»‡n há»‡ tháº§n kinh trung Æ°Æ¡ng trung tÃ¢m.'
      },
      {
        id: 'cs_head_orbit_sag',
        title: '2. Head (Orbit) (Sagittal)',
        subtitle: 'LÃ¡t cáº¯t Ä‘á»©ng dá»c qua nhÃ£n cáº§u, tháº§n kinh thá»‹ vÃ  cÆ¡ tháº³ng trÃªn/dÆ°á»›i',
        badge: 'Sagittal',
        plane: 'sagittal',
        offset: 0.05,
        camera: { x: 0.70, y: 1.55, z: 0.05, targetX: 0.05, targetY: 1.55, targetZ: 0.05 },
        systems: ['skeletal', 'nervous'],
        image: '/images/atlas/skel_skull.png',
        desc: 'Máº·t pháº³ng Ä‘á»©ng dá»c xuyÃªn qua trá»¥c há»‘c máº¯t vÃ  á»• máº¯t.'
      }
    ]
  },
  {
    id: 'cs_group_thorax_axial',
    titleVi: 'Lá»“ng Ngá»±c (Thorax Axial)',
    plane: 'axial',
    cards: [
      {
        id: 'cs_thorax_t02_t03',
        title: '1. Thorax (T02-T03)',
        subtitle: 'LÃ¡t cáº¯t ngang qua cung Ä‘á»™ng máº¡ch chá»§, tÄ©nh máº¡ch vÃ´ danh vÃ  khÃ­ quáº£n',
        badge: 'Axial',
        plane: 'axial',
        offset: 1.36,
        camera: { x: 0, y: 1.70, z: 0.05, targetX: 0, targetY: 1.36, targetZ: 0 },
        systems: ['cardiovascular', 'visceral', 'skeletal'],
        image: '/images/atlas/reg_thorax.png',
        scoutLabel: 'Thorax T02-T03',
        desc: 'Máº·t pháº³ng cáº¯t ngang qua Ä‘á»‘t sá»‘ng ngá»±c T2-T3 bá»™c lá»™ cÃ¡c máº¡ch mÃ¡u lá»›n vÃ¹ng ná»n cá»•.'
      },
      {
        id: 'cs_thorax_t03_t04',
        title: '2. Thorax (T03-T04)',
        subtitle: 'LÃ¡t cáº¯t ngang qua pháº¿ quáº£n gá»‘c, tráº¡c ba khÃ­ quáº£n carina vÃ  ÄM phá»•i',
        badge: 'Axial',
        plane: 'axial',
        offset: 1.32,
        camera: { x: 0, y: 1.68, z: 0.05, targetX: 0, targetY: 1.32, targetZ: 0 },
        systems: ['cardiovascular', 'visceral', 'skeletal'],
        image: '/images/atlas/resp_lungs.png',
        scoutLabel: 'Thorax T03-T04',
        desc: 'Máº·t pháº³ng cáº¯t ngang qua tráº¡c ba khÃ­ quáº£n vÃ  cuá»‘ng phá»•i.'
      },
      {
        id: 'cs_thorax_t04_t05',
        title: '3. Thorax (T04-T05)',
        subtitle: 'LÃ¡t cáº¯t ngang qua 4 buá»“ng tim, nhÄ© tháº¥t vÃ  rÃ£nh liÃªn tháº¥t',
        badge: 'Axial',
        plane: 'axial',
        offset: 1.28,
        camera: { x: 0, y: 1.65, z: 0.05, targetX: 0, targetY: 1.28, targetZ: 0 },
        systems: ['cardiovascular', 'visceral', 'skeletal'],
        image: '/images/atlas/circ_heart_thorax.png',
        scoutLabel: 'Thorax T04-T05',
        desc: 'LÃ¡t cáº¯t ngang 4 buá»“ng tim tiÃªu chuáº©n Ä‘á»‘i chiáº¿u siÃªu Ã¢m vÃ  CT tim.'
      }
    ]
  },
  {
    id: 'cs_group_abdomen_axial',
    titleVi: 'á»” Bá»¥ng (Abdomen Axial)',
    plane: 'axial',
    cards: [
      {
        id: 'cs_abdomen_t11_t12',
        title: '1. Abdomen (T11-T12)',
        subtitle: 'LÃ¡t cáº¯t ngang qua thÃ¹y gan, phÃ¬nh vá»‹ dáº¡ dÃ y, lÃ¡ch vÃ  Ä‘á»™ng máº¡ch thÃ¢n táº¡ng',
        badge: 'Axial',
        plane: 'axial',
        offset: 1.12,
        camera: { x: 0, y: 1.55, z: 0.05, targetX: 0, targetY: 1.12, targetZ: 0 },
        systems: ['visceral', 'skeletal'],
        image: '/images/atlas/dig_upper.png',
        scoutLabel: 'Abdomen T11-T12',
        desc: 'Máº·t pháº³ng cáº¯t ngang táº§ng trÃªn máº¡c treo bá»™c lá»™ gan, dáº¡ dÃ y vÃ  lÃ¡ch.'
      },
      {
        id: 'cs_abdomen_t12_l01',
        title: '2. Abdomen (T12-L01)',
        subtitle: 'LÃ¡t cáº¯t ngang qua tá»¥y, tÃ¡ trÃ ng, cuá»‘ng tháº­n vÃ  Ä‘á»™ng máº¡ch máº¡c treo trÃ ng trÃªn',
        badge: 'Axial',
        plane: 'axial',
        offset: 1.08,
        camera: { x: 0, y: 1.50, z: 0.05, targetX: 0, targetY: 1.08, targetZ: 0 },
        systems: ['visceral', 'skeletal'],
        image: '/images/atlas/dig_upper.png',
        scoutLabel: 'Abdomen T12-L01',
        desc: 'LÃ¡t cáº¯t ngang qua cuá»‘ng máº¡ch tháº­n vÃ  Ä‘áº§u tá»¥y tÃ¡ trÃ ng.'
      },
      {
        id: 'cs_abdomen_l01_l02',
        title: '3. Abdomen (L01-L02)',
        subtitle: 'LÃ¡t cáº¯t ngang qua quai ruá»™t non, Ä‘áº¡i trÃ ng lÃªn/xuá»‘ng vÃ  tÄ©nh máº¡ch chá»§ dÆ°á»›i',
        badge: 'Axial',
        plane: 'axial',
        offset: 1.04,
        camera: { x: 0, y: 1.48, z: 0.05, targetX: 0, targetY: 1.04, targetZ: 0 },
        systems: ['visceral', 'skeletal'],
        image: '/images/atlas/dig_lower.png',
        scoutLabel: 'Abdomen L01-L02',
        desc: 'Máº·t pháº³ng cáº¯t ngang táº§ng dÆ°á»›i máº¡c treo Ä‘áº¡i trÃ ng ngang.'
      }
    ]
  },
  {
    id: 'cs_group_pelvis_axial',
    titleVi: 'VÃ¹ng Cháº­u (Pelvis Axial)',
    plane: 'axial',
    cards: [
      {
        id: 'cs_pelvis_s05',
        title: '1. Pelvis (S05) (M)',
        subtitle: 'LÃ¡t cáº¯t ngang qua khá»›p cÃ¹ng cháº­u, Ä‘á»‰nh bÃ ng quang vÃ  bÃ³ng trá»±c trÃ ng',
        badge: 'Axial',
        plane: 'axial',
        offset: 0.92,
        camera: { x: 0, y: 1.35, z: 0.05, targetX: 0, targetY: 0.92, targetZ: 0 },
        systems: ['visceral', 'skeletal', 'muscular'],
        image: '/images/atlas/skel_pelvis.png',
        scoutLabel: 'Pelvis S05',
        desc: 'Máº·t pháº³ng cáº¯t ngang qua cháº­u hÃ´ng bÃ© vÃ  bÃ³ng bÃ ng quang.'
      },
      {
        id: 'cs_pelvis_coccyx',
        title: '2. Pelvis (Coccyx) (M)',
        subtitle: 'LÃ¡t cáº¯t ngang qua xÆ°Æ¡ng cá»¥t, tuyáº¿n tiá»n liá»‡t/tá»­ cung vÃ  cÆ¡ nÃ¢ng háº­u mÃ´n',
        badge: 'Axial',
        plane: 'axial',
        offset: 0.87,
        camera: { x: 0, y: 1.30, z: 0.05, targetX: 0, targetY: 0.87, targetZ: 0 },
        systems: ['visceral', 'skeletal', 'muscular'],
        image: '/images/atlas/urin_pelvic.png',
        scoutLabel: 'Pelvis Coccyx',
        desc: 'Máº·t pháº³ng cáº¯t ngang qua sÃ n cháº­u vÃ  cÆ¡ nÃ¢ng háº­u mÃ´n.'
      },
      {
        id: 'cs_pelvis_symphysis',
        title: '3. Pelvis (Symphysis) (M)',
        subtitle: 'LÃ¡t cáº¯t ngang qua khá»›p mu, chá»m xÆ°Æ¡ng Ä‘Ã¹i vÃ  cá»§ ngá»“i',
        badge: 'Axial',
        plane: 'axial',
        offset: 0.83,
        camera: { x: 0, y: 1.25, z: 0.05, targetX: 0, targetY: 0.83, targetZ: 0 },
        systems: ['skeletal', 'muscular'],
        image: '/images/atlas/skel_pelvis.png',
        scoutLabel: 'Pelvis Symphysis',
        desc: 'Máº·t pháº³ng cáº¯t ngang qua á»• cá»‘i vÃ  diá»‡n khá»›p mu.'
      },
      {
        id: 'cs_pelvis_midsagittal',
        title: '4. Pelvis (Midsagittal)',
        subtitle: 'LÃ¡t cáº¯t Ä‘á»©ng dá»c qua bÃ ng quang, trá»±c trÃ ng vÃ  sÃ n cháº­u',
        badge: 'Sagittal',
        plane: 'sagittal',
        offset: 0.00,
        camera: { x: 0.75, y: 0.85, z: 0.0, targetX: 0, targetY: 0.85, targetZ: 0 },
        systems: ['visceral', 'skeletal', 'muscular'],
        image: '/images/atlas/skel_pelvis.png',
        scoutLabel: 'Pelvis Midsagittal',
        desc: 'Máº·t pháº³ng Ä‘á»©ng dá»c chÃ­nh giá»¯a qua cÃ¡c táº¡ng vÃ¹ng cháº­u vÃ  Ä‘Ã¡y cháº­u.'
      }
    ]
  }
];

// 6. MICROANATOMY (Giáº£i Pháº«u Vi Thá»ƒ & Cáº¯t Lá»›p Táº§ng Da - MÃ´ Há»c Y Khoa)
export const ATLAS_MICROANATOMY_CATEGORIES = [
  {
    id: 'micro_group_skin',
    titleVi: 'Há»‡ Da & Cáº¯t Lá»›p Táº§ng Da (Integumentary System)',
    cards: [
      {
        id: 'micro_skin_dark',
        title: '1. Skin (Dark Pigmentation)',
        subtitle: 'Cáº¯t lá»›p 3D Ä‘a táº§ng: Biá»ƒu bÃ¬, Trung bÃ¬ vÃ  MÃ´ má»¡ dÆ°á»›i da',
        badge: 'Cáº¯t lá»›p da',
        systems: ['visceral', 'skeletal'],
        camera: { x: 0.15, y: 1.15, z: 0.35, targetX: 0.05, targetY: 1.12, targetZ: 0 },
        image: '/images/atlas/med_skin.png',
        desc: 'MÃ´ hÃ¬nh cáº¯t lá»›p 3D táº§ng da: lá»›p sá»«ng, lá»›p gai, lá»›p háº¡t, lá»›p Ä‘Ã¡y háº¯c tá»‘ Melanin, collagen vÃ  má»¡ háº¡ bÃ¬.'
      },
      {
        id: 'micro_skin_light',
        title: '2. Skin (Light Pigmentation)',
        subtitle: 'LÃ¡t cáº¯t da sáº¯c tá»‘ sÃ¡ng: Táº¿ bÃ o Ä‘Ã¡y sinh sáº£n vÃ  vi tuáº§n hoÃ n mao máº¡ch',
        badge: 'MÃ´ há»c da',
        systems: ['visceral', 'skeletal'],
        camera: { x: 0.12, y: 1.15, z: 0.30, targetX: 0.05, targetY: 1.12, targetZ: 0 },
        image: '/images/atlas/med_skin.png',
        desc: 'Chi tiáº¿t mÃ´ há»c vi thá»ƒ cÃ¡c lá»›p táº¿ bÃ o sá»«ng hÃ³a vÃ  máº¡ng lÆ°á»›i sá»£i Ä‘Ã n há»“i elastin nÃ¢ng Ä‘á»¡.'
      },
      {
        id: 'micro_hair_follicle',
        title: '3. Hair Follicle (Curly Hair)',
        subtitle: 'Nang lÃ´ng, tuyáº¿n bÃ£ nhá»n, tuyáº¿n má»“ hÃ´i vÃ  cÆ¡ dá»±ng lÃ´ng',
        badge: 'Phá»¥ bÃ¬',
        systems: ['visceral', 'skeletal'],
        camera: { x: 0.10, y: 1.18, z: 0.28, targetX: 0.05, targetY: 1.15, targetZ: 0 },
        image: '/images/atlas/med_soft_tissue.png',
        desc: 'ÄÆ¡n vá»‹ nang lÃ´ng tuyáº¿n bÃ£: bÃ³ng chÃ¢n lÃ´ng, cÆ¡ dá»±ng lÃ´ng arrector pili vÃ  tuyáº¿n tiáº¿t bÃ£ nhá»n.'
      }
    ]
  },
  {
    id: 'micro_group_senses',
    titleVi: 'GiÃ¡c Quan Vi Thá»ƒ (Senses)',
    cards: [
      {
        id: 'micro_eye',
        title: '1. Eye (NhÃ£n Cáº§u 3D)',
        subtitle: 'GiÃ¡c máº¡c, cá»§ng máº¡c, mÃ ng bá»“ Ä‘Ã o, thá»ƒ mi, má»‘ng máº¯t vÃ  vÃµng máº¡c',
        badge: 'Thá»‹ giÃ¡c',
        systems: ['nervous', 'skeletal'],
        camera: { x: 0.10, y: 1.58, z: 0.25, targetX: 0.03, targetY: 1.58, targetZ: 0.04 },
        image: '/images/atlas/skel_skull.png',
        desc: 'Máº·t cáº¯t cáº¥u trÃºc nhÃ£n cáº§u thá»ƒ hiá»‡n Ä‘Æ°á»ng truyá»n Ã¡nh sÃ¡ng vÃ  vÃµng máº¡c thá»¥ cáº£m.'
      },
      {
        id: 'micro_lacrimal',
        title: '2. Lacrimal Apparatus (Bá»™ Lá»‡)',
        subtitle: 'Tuyáº¿n lá»‡ chÃ­nh, tiá»ƒu quáº£n lá»‡, tÃºi lá»‡ vÃ  á»‘ng lá»‡ mÅ©i',
        badge: 'Bá»™ lá»‡',
        systems: ['skeletal', 'nervous'],
        camera: { x: 0.08, y: 1.60, z: 0.22, targetX: 0.02, targetY: 1.60, targetZ: 0.04 },
        image: '/images/atlas/skel_skull.png',
        desc: 'Há»‡ thá»‘ng tiáº¿t vÃ  dáº«n lÆ°u nÆ°á»›c máº¯t giá»¯ áº©m vÃ  báº£o vá»‡ bá» máº·t giÃ¡c máº¡c.'
      },
      {
        id: 'micro_lens_zonule',
        title: '3. Lens and Zonular Fibers',
        subtitle: 'Thá»ƒ thá»§y tinh hai máº·t lá»“i vÃ  dÃ¢y cháº±ng treo Zinn Ä‘iá»u tiáº¿t',
        badge: 'KhÃºc xáº¡',
        systems: ['nervous'],
        camera: { x: 0.06, y: 1.58, z: 0.18, targetX: 0.03, targetY: 1.58, targetZ: 0.04 },
        image: '/images/atlas/skel_skull.png',
        desc: 'DÃ¢y cháº±ng Zinn treo thá»ƒ thá»§y tinh vÃ o thá»ƒ mi phá»¥c vá»¥ Ä‘iá»u tiáº¿t thá»‹ lá»±c gáº§n xa.'
      }
    ]
  },
  {
    id: 'micro_group_skeletal',
    titleVi: 'Há»‡ XÆ°Æ¡ng Vi Thá»ƒ (Skeletal System)',
    cards: [
      {
        id: 'micro_femur_section',
        title: '1. Sectioned Femur (Máº·t Cáº¯t XÆ°Æ¡ng ÄÃ¹i)',
        subtitle: 'Vá» xÆ°Æ¡ng Ä‘áº·c ngoÃ i, bÃ¨ xÆ°Æ¡ng xá»‘p xá»‘p vÃ  khoang tá»§y xÆ°Æ¡ng',
        badge: 'MÃ´ há»c xÆ°Æ¡ng',
        systems: ['skeletal'],
        camera: { x: 0.25, y: 0.65, z: 0.45, targetX: 0.15, targetY: 0.65, targetZ: 0 },
        image: '/images/atlas/med_skeleton.png',
        desc: 'Cáº¥u trÃºc giáº£i pháº«u vi thá»ƒ xÆ°Æ¡ng Ä‘Ã¹i vá»›i há»‡ thá»‘ng bÃ¨ xÆ°Æ¡ng xá»‘p chá»‹u lá»±c nÃ©n tá»‘i Æ°u.'
      },
      {
        id: 'micro_osteon',
        title: '2. Osteon (ÄÆ¡n Vá»‹ XÆ°Æ¡ng Vi Thá»ƒ Havers)',
        subtitle: 'á»ng Havers trung tÃ¢m, cÃ¡c lÃ¡ xÆ°Æ¡ng Ä‘á»“ng tÃ¢m vÃ  táº¿ bÃ o xÆ°Æ¡ng Osteocyte',
        badge: 'Vi thá»ƒ',
        systems: ['skeletal'],
        camera: { x: 0.20, y: 0.65, z: 0.35, targetX: 0.15, targetY: 0.65, targetZ: 0 },
        image: '/images/atlas/med_bone_repair.png',
        desc: 'ÄÆ¡n vá»‹ cáº¥u táº¡o chá»©c nÄƒng cÆ¡ báº£n cá»§a xÆ°Æ¡ng Ä‘áº·c, dáº«n truyá»n máº¡ch mÃ¡u vÃ  tháº§n kinh nuÃ´i xÆ°Æ¡ng.'
      }
    ]
  }
];

// 7. MUSCLE ACTIONS (Chuyá»ƒn Äá»™ng Khá»›p & CÆ¡ Sinh LÃ½ 3D - Chuáº©n Visible Body)
export const ATLAS_MUSCLE_ACTIONS_CATEGORIES = [
  {
    id: 'act_group_spine',
    titleVi: 'Cá»™t Sá»‘ng & LÆ°ng (Spine and Back)',
    cards: [
      {
        id: 'act_spine_flex',
        title: '1. Spine Flexion (Gáº­p Cá»™t Sá»‘ng)',
        subtitle: 'CÆ¡ tháº³ng bá»¥ng co, cá»™t sá»‘ng tháº¯t lÆ°ng gáº­p ra trÆ°á»›c',
        badge: 'Cá»™t sá»‘ng',
        motionId: 'spine_flexion',
        systems: ['muscular', 'skeletal'],
        camera: { x: 0.85, y: 1.15, z: 1.1, targetX: 0, targetY: 1.05, targetZ: 0 },
        image: '/images/atlas/musc_torso.png',
        desc: 'Chuyá»ƒn Ä‘á»™ng gáº­p thÃ¢n mÃ¬nh quanh trá»¥c ngang á»Ÿ cÃ¡c Ä‘á»‘t sá»‘ng tháº¯t lÆ°ng.'
      },
      {
        id: 'act_spine_ext',
        title: '2. Spine Extension (Duá»—i Cá»™t Sá»‘ng)',
        subtitle: 'NhÃ³m cÆ¡ dá»±ng sá»‘ng (Erector spinae) kÃ©o cá»™t sá»‘ng ngá»­a ra sau',
        badge: 'Cá»™t sá»‘ng',
        motionId: 'spine_extension',
        systems: ['muscular', 'skeletal'],
        camera: { x: 0.85, y: 1.15, z: 1.1, targetX: 0, targetY: 1.05, targetZ: 0 },
        image: '/images/atlas/musc_torso.png',
        desc: 'Chuyá»ƒn Ä‘á»™ng duá»—i cá»™t sá»‘ng giÃºp duy trÃ¬ tÆ° tháº¿ Ä‘á»©ng tháº³ng cá»§a con ngÆ°á»i.'
      },
      {
        id: 'act_spine_lat',
        title: '3. Spine Lateral Flexion (NghiÃªng Cá»™t Sá»‘ng)',
        subtitle: 'CÆ¡ vuÃ´ng tháº¯t lÆ°ng vÃ  cÆ¡ chÃ©o bá»¥ng co nghiÃªng thÃ¢n sang bÃªn',
        badge: 'Cá»™t sá»‘ng',
        motionId: 'spine_lat_flexion',
        systems: ['muscular', 'skeletal'],
        camera: { x: 0, y: 1.15, z: 1.45, targetX: 0, targetY: 1.05, targetZ: 0 },
        image: '/images/atlas/musc_torso.png',
        desc: 'Chuyá»ƒn Ä‘á»™ng nghiÃªng cá»™t sá»‘ng trong máº·t pháº³ng Ä‘á»©ng ngang.'
      }
    ]
  },
  {
    id: 'act_group_pelvis',
    titleVi: 'Khung Cháº­u & Khá»›p HÃ¡ng (Pelvis and Hip)',
    cards: [
      {
        id: 'act_hip_flex',
        title: '1. Hip Flexion (Gáº­p Khá»›p HÃ¡ng)',
        subtitle: 'CÆ¡ tháº¯t lÆ°ng cháº­u (Iliopsoas) vÃ  cÆ¡ tháº³ng Ä‘Ã¹i nÃ¢ng Ä‘Ã¹i ra trÆ°á»›c',
        badge: 'Khá»›p hÃ¡ng',
        motionId: 'hip_flexion',
        systems: ['muscular', 'skeletal'],
        camera: { x: 0.75, y: 0.75, z: 1.0, targetX: 0.1, targetY: 0.75, targetZ: 0 },
        image: '/images/atlas/musc_limbs.png',
        desc: 'Chuyá»ƒn Ä‘á»™ng gáº­p khá»›p chá»m Ä‘Ã¹i - á»• cá»‘i trong bÆ°á»›c Ä‘i vÃ  cháº¡y.'
      },
      {
        id: 'act_hip_ext',
        title: '2. Hip Extension (Duá»—i Khá»›p HÃ¡ng)',
        subtitle: 'CÆ¡ mÃ´ng lá»›n (Gluteus maximus) vÃ  gÃ¢n kheo kÃ©o Ä‘Ã¹i ra sau',
        badge: 'Khá»›p hÃ¡ng',
        motionId: 'hip_extension',
        systems: ['muscular', 'skeletal'],
        camera: { x: 0.75, y: 0.75, z: 1.0, targetX: 0.1, targetY: 0.75, targetZ: 0 },
        image: '/images/atlas/musc_limbs.png',
        desc: 'Chuyá»ƒn Ä‘á»™ng táº¡o lá»±c Ä‘áº©y chÃ­nh khi Ä‘á»©ng dáº­y, leo dá»‘c vÃ  cháº¡y nháº£y.'
      },
      {
        id: 'act_hip_rot',
        title: '3. Hip Medial Rotation (Xoay Trong Khá»›p HÃ¡ng)',
        subtitle: 'CÆ¡ cÄƒng máº¡c Ä‘Ã¹i vÃ  cÆ¡ mÃ´ng nhá»¡ xoay Ä‘Ã¹i vÃ o trong',
        badge: 'Khá»›p hÃ¡ng',
        motionId: 'hip_rotation',
        systems: ['muscular', 'skeletal'],
        camera: { x: 0.35, y: 0.75, z: 1.1, targetX: 0.1, targetY: 0.75, targetZ: 0 },
        image: '/images/atlas/musc_limbs.png',
        desc: 'Chuyá»ƒn Ä‘á»™ng xoay trá»¥c Ä‘Ã¹i quanh Ä‘Æ°á»ng ná»‘i tá»« chá»m Ä‘Ã¹i Ä‘áº¿n lá»“i cáº§u.'
      }
    ]
  },
  {
    id: 'act_group_lower_limbs',
    titleVi: 'Chi DÆ°á»›i & Khá»›p Gá»‘i (Lower Limbs)',
    cards: [
      {
        id: 'act_knee_flex',
        title: '1. Knee Flexion (Gáº­p Khá»›p Gá»‘i)',
        subtitle: 'NhÃ³m cÆ¡ gÃ¢n kheo (Hamstrings) co gáº­p cáº³ng chÃ¢n ra sau',
        badge: 'Khá»›p gá»‘i',
        motionId: 'knee_flexion',
        systems: ['muscular', 'skeletal'],
        camera: { x: 0.65, y: 0.45, z: 0.9, targetX: 0.1, targetY: 0.45, targetZ: 0 },
        image: '/images/atlas/musc_limbs.png',
        desc: 'Khá»›p báº£n lá» gá»‘i gáº­p cáº³ng chÃ¢n lÃªn Ä‘Ã¹i.'
      },
      {
        id: 'act_knee_ext',
        title: '2. Knee Extension (Duá»—i Khá»›p Gá»‘i)',
        subtitle: 'CÆ¡ tá»© Ä‘áº§u Ä‘Ã¹i (Quadriceps) kÃ©o bÃ¡nh chÃ¨ duá»—i tháº³ng cáº³ng chÃ¢n',
        badge: 'Khá»›p gá»‘i',
        motionId: 'knee_extension',
        systems: ['muscular', 'skeletal'],
        camera: { x: 0.65, y: 0.45, z: 0.9, targetX: 0.1, targetY: 0.45, targetZ: 0 },
        image: '/images/atlas/musc_limbs.png',
        desc: 'KhÃ³a khá»›p gá»‘i giÃºp giá»¯ vá»¯ng trá»ng tÃ¢m cÆ¡ thá»ƒ khi Ä‘á»©ng tháº³ng.'
      },
      {
        id: 'act_knee_rot',
        title: '3. Knee Medial Rotation (Xoay Trong Khá»›p Gá»‘i)',
        subtitle: 'CÆ¡ khoeo vÃ  cÆ¡ bÃ¡n gÃ¢n xoay nháº¹ cáº³ng chÃ¢n vÃ o trong',
        badge: 'Khá»›p gá»‘i',
        motionId: 'knee_rotation',
        systems: ['muscular', 'skeletal'],
        camera: { x: 0.35, y: 0.45, z: 0.9, targetX: 0.1, targetY: 0.45, targetZ: 0 },
        image: '/images/atlas/musc_limbs.png',
        desc: 'Má»Ÿ khÃ³a khá»›p gá»‘i khi báº¯t Ä‘áº§u bÆ°á»›c gáº­p chÃ¢n.'
      }
    ]
  },
  {
    id: 'act_group_shoulder',
    titleVi: 'Khá»›p Vai (Shoulder)',
    cards: [
      {
        id: 'act_shoulder_flex',
        title: '1. Shoulder Flexion (Gáº­p Khá»›p Vai)',
        subtitle: 'BÃ³ trÆ°á»›c cÆ¡ delta vÃ  cÆ¡ ngá»±c lá»›n nÃ¢ng cÃ¡nh tay ra trÆ°á»›c',
        badge: 'Khá»›p vai',
        motionId: 'shoulder_flexion',
        systems: ['muscular', 'skeletal'],
        camera: { x: 0.65, y: 1.35, z: 0.9, targetX: 0.2, targetY: 1.30, targetZ: 0 },
        image: '/images/atlas/musc_limbs.png',
        desc: 'Chuyá»ƒn Ä‘á»™ng nÃ¢ng cÃ¡nh tay lÃªn phÃ­a trÆ°á»›c theo máº·t pháº³ng Ä‘á»©ng dá»c.'
      },
      {
        id: 'act_shoulder_ext',
        title: '2. Shoulder Extension (Duá»—i Khá»›p Vai)',
        subtitle: 'CÆ¡ lÆ°ng rá»™ng, cÆ¡ trÃ²n lá»›n vÃ  bÃ³ sau cÆ¡ delta kÃ©o tay ra sau',
        badge: 'Khá»›p vai',
        motionId: 'shoulder_extension',
        systems: ['muscular', 'skeletal'],
        camera: { x: 0.65, y: 1.35, z: 0.9, targetX: 0.2, targetY: 1.30, targetZ: 0 },
        image: '/images/atlas/musc_limbs.png',
        desc: 'Chuyá»ƒn Ä‘á»™ng Ä‘Æ°a cÃ¡nh tay vá» sau thÃ¢n mÃ¬nh.'
      },
      {
        id: 'act_shoulder_abd',
        title: '3. Shoulder Horizontal Abduction (Dang Ngang Vai)',
        subtitle: 'CÆ¡ delta vÃ  cÆ¡ trÃªn gai dang cÃ¡nh tay sang bÃªn',
        badge: 'Khá»›p vai',
        motionId: 'shoulder_abduction',
        systems: ['muscular', 'skeletal'],
        camera: { x: 0, y: 1.35, z: 1.3, targetX: 0.15, targetY: 1.30, targetZ: 0 },
        image: '/images/atlas/musc_limbs.png',
        desc: 'Khá»›p chá»m cáº§u á»• cháº£o dang cÃ¡nh tay tá»« 0 Ä‘áº¿n 90 Ä‘á»™.'
      }
    ]
  },
  {
    id: 'act_group_upper_limbs',
    titleVi: 'Chi TrÃªn & Khá»›p Khuá»·u (Upper Limbs)',
    cards: [
      {
        id: 'act_elbow_flex',
        title: '1. Elbow Flexion (Gáº­p Khá»›p Khuá»·u)',
        subtitle: 'CÆ¡ nhá»‹ Ä‘áº§u cÃ¡nh tay (Biceps) vÃ  cÆ¡ cÃ¡nh tay gáº­p cáº³ng tay',
        badge: 'Khuá»·u tay',
        motionId: 'elbow_flexion',
        systems: ['muscular', 'skeletal'],
        camera: { x: 0.55, y: 1.10, z: 0.75, targetX: 0.25, targetY: 1.05, targetZ: 0 },
        image: '/images/atlas/musc_limbs.png',
        desc: 'Chuyá»ƒn Ä‘á»™ng gáº­p báº£n lá» cá»§a khá»›p cÃ¡nh tay - trá»¥ vÃ  cÃ¡nh tay - quay.'
      },
      {
        id: 'act_elbow_ext',
        title: '2. Elbow Extension (Duá»—i Khá»›p Khuá»·u)',
        subtitle: 'CÆ¡ tam Ä‘áº§u cÃ¡nh tay (Triceps) kÃ©o má»m khuá»·u duá»—i tháº³ng tay',
        badge: 'Khuá»·u tay',
        motionId: 'elbow_extension',
        systems: ['muscular', 'skeletal'],
        camera: { x: 0.55, y: 1.10, z: 0.75, targetX: 0.25, targetY: 1.05, targetZ: 0 },
        image: '/images/atlas/musc_limbs.png',
        desc: 'KhÃ³a khá»›p khuá»·u khi Ä‘áº©y hoáº·c nÃ¢ng váº­t thá»ƒ.'
      },
      {
        id: 'act_forearm_pro',
        title: '3. Forearm Pronation (Sáº¥p Cáº³ng Tay)',
        subtitle: 'CÆ¡ sáº¥p trÃ²n vÃ  cÆ¡ sáº¥p vuÃ´ng xoay xÆ°Æ¡ng quay váº¯t chÃ©o xÆ°Æ¡ng trá»¥',
        badge: 'Cáº³ng tay',
        motionId: 'forearm_pronation',
        systems: ['muscular', 'skeletal'],
        camera: { x: 0.45, y: 1.00, z: 0.65, targetX: 0.25, targetY: 0.95, targetZ: 0 },
        image: '/images/atlas/musc_limbs.png',
        desc: 'Khá»›p quay - trá»¥ xoay bÃ n tay Ãºp xuá»‘ng dÆ°á»›i.'
      }
    ]
  },
  {
    id: 'act_group_thorax',
    titleVi: 'Lá»“ng Ngá»±c & HÃ´ Háº¥p (Thorax & Respiration)',
    cards: [
      {
        id: 'act_ribs_elev',
        title: '1. Ribs Elevation (NÃ¢ng Khung SÆ°á»n - HÃ­t VÃ o)',
        subtitle: 'CÆ¡ liÃªn sÆ°á»n ngoÃ i nÃ¢ng khung sÆ°á»n lÃ m tÄƒng thá»ƒ tÃ­ch lá»“ng ngá»±c',
        badge: 'HÃ´ háº¥p',
        motionId: 'respiratory',
        systems: ['skeletal', 'visceral'],
        camera: { x: 0, y: 1.28, z: 1.0, targetX: 0, targetY: 1.28, targetZ: 0 },
        image: '/images/atlas/med_respiratory_cycle.png',
        desc: 'Chuyá»ƒn Ä‘á»™ng nÃ¢ng sÆ°á»n dáº¡ng cÃ¡n xÃ´ vÃ  tay cáº§m bÆ¡m khi hÃ­t vÃ o.'
      },
      {
        id: 'act_ribs_dep',
        title: '2. Ribs Depression (Háº¡ Khung SÆ°á»n - Thá»Ÿ Ra)',
        subtitle: 'Khung sÆ°á»n háº¡ xuá»‘ng xáº¹p láº¡i, phá»•i co há»“i thá»¥ Ä‘á»™ng Ä‘áº©y khÃ­ ra ngoÃ i',
        badge: 'HÃ´ háº¥p',
        motionId: 'respiratory',
        systems: ['skeletal', 'visceral'],
        camera: { x: 0, y: 1.28, z: 1.0, targetX: 0, targetY: 1.28, targetZ: 0 },
        image: '/images/atlas/med_respiratory_cycle.png',
        desc: 'Giai Ä‘oáº¡n thá»Ÿ ra cá»§a chu ká»³ thÃ´ng khÃ­ phá»•i.'
      },
      {
        id: 'act_cardiac',
        title: '3. Cardiac Cycle (Chu Ká»³ Co BÃ³p Tim)',
        subtitle: 'TÃ¢m thu tá»‘ng mÃ¡u vÃ o Ä‘á»™ng máº¡ch vÃ  tÃ¢m trÆ°Æ¡ng giÃ£n ná»Ÿ hÃºt mÃ¡u vá»',
        badge: 'Tuáº§n hoÃ n',
        motionId: 'cardiac',
        systems: ['cardiovascular', 'skeletal'],
        camera: { x: 0.05, y: 1.28, z: 0.65, targetX: 0.02, targetY: 1.28, targetZ: 0.03 },
        image: '/images/atlas/med_cardiac_cycle.png',
        desc: 'Hoáº¡t Ä‘á»™ng co bÃ³p nhá»‹p nhÃ ng cá»§a cÆ¡ tim theo há»‡ thá»‘ng dáº«n truyá»n tá»± Ä‘á»™ng.'
      }
    ]
  }
];


