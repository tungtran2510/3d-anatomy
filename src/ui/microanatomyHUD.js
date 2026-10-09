// Microanatomy & Histology Interactive HUD Controller
// Visible Body & TA2 Standard Microscopic Anatomy & Histology Inspection Engine
// Displays 3D histological cross-sections, multi-layer breakdowns, clinical correlations,
// and 15-second natural AI voice summary for Skin, Sensory & Bone microanatomy.

import { showToast } from './sidebar.js';
import { getVietnameseVoice } from '../utils/speechVoice.js';

let hudEl = null;
let currentVoiceUtterance = null;
let isSpeaking = false;

const MICRO_DATA = {
  micro_skin_dark: {
    titleVi: 'Lát Cắt Da Sắc Tố Đậm (Hắc Tố Melanin)',
    category: '🔬 Mô học Hệ Da — Cắt Lớp Đa Tầng',
    image: '/images/atlas/micro_skin_dark.jpg',
    layers: [
      { name: '1. Biểu Bì (Epidermis)', desc: 'Lớp sừng bảo vệ ngoài cùng, các tế bào keratinocytes xếp lớp, lớp hạt và lớp gai liên kết vững chắc.' },
      { name: '2. Tế Bào Hắc Tố Melanin (Melanocytes)', desc: 'Nằm tại lớp đáy (Stratum basale), sản xuất hạt sắc tố Eumelanin che chắn nhân tế bào trước bức xạ cực tím UV.' },
      { name: '3. Trung Bì (Dermis)', desc: 'Mạng lưới sợi Collagen type I và Elastin dẻo dai, chứa mao mạch máu nuôi dưỡng, thụ thể xúc giác Meissner và mạt thần kinh.' },
      { name: '4. Hạ Bì (Hypodermis)', desc: 'Mô mỡ đệm lót cách nhiệt, thụ thể áp lực Pacini và mạng lưới mạch máu lớn phân nhánh lên bề mặt.' }
    ],
    clinicalPearls: 'Mật độ hắc tố Melanin cao giúp giảm nguy cơ ung thư biểu mô đáy và ung thư hắc tố (Melanoma). Tuy nhiên cần chú ý tổng hợp Vitamin D dưới ánh nắng.',
    audioScript: 'Lát cắt da sắc tố đậm cho thấy cấu trúc đa tầng hoàn chỉnh. Tại lớp tế bào đáy của biểu bì, các tế bào hắc tố melanocytes tiết ra vô số hạt sắc tố Melanin tạo thành những chiếc ô siêu vi che chắn nhân tế bào trước tác hại của tia cực tím.'
  },
  micro_skin_light: {
    titleVi: 'Lát Cắt Da Sắc Tố Sáng (Light Pigmentation)',
    category: '🔬 Mô học Hệ Da — Cắt Lớp Đa Tầng',
    image: '/images/atlas/micro_skin_light.jpg',
    layers: [
      { name: '1. Tầng Sừng & Biểu Bì', desc: 'Lớp sừng mỏng hơn, tế bào keratin liên tục bong tróc và đổi mới chu kỳ 28 ngày.' },
      { name: '2. Sắc Tố Pheomelanin', desc: 'Mật độ hạt melanosome thưa hơn, sắc tố đỏ vàng Pheomelanin chiếm ưu thế, hấp thu ánh sáng nhạy cảm hơn.' },
      { name: '3. Lưới Mao Mạch Trung Bì', desc: 'Mao mạch máu dưới nhú bì tạo sắc ửng hồng tự nhiên cho làn da sáng màu.' },
      { name: '4. Mô Đệm & Tuyến Mồ Hôi', desc: 'Tuyến mồ hôi ngoại tiết eccrine và mạng lưới thần kinh giao cảm điều hòa nhiệt.' }
    ],
    clinicalPearls: 'Da sắc tố sáng có nguy cơ cháy nắng (Sunburn) và ung thư da cao hơn do ít Melanin bảo vệ, nhưng có ưu thế tổng hợp Vitamin D rất nhanh.',
    audioScript: 'Lát cắt da sắc tố sáng có mật độ hạt melanosome thấp hơn, cho phép ánh sáng xuyên sâu hơn để tổng hợp nhanh vitamin D, nhưng đòi hỏi sự bảo vệ cẩn trọng trước bức xạ cực tím mặt trời.'
  },
  micro_hair_follicle: {
    titleVi: 'Nang Lông & Tuyến Bã Nhờn (Hair Follicle & Sebaceous Gland)',
    category: '🔬 Phụ Bì & Tuyến Ngoại Tiết',
    image: '/images/atlas/micro_hair_follicle.jpg',
    layers: [
      { name: '1. Thân Lông & Vỏ Bao Rễ', desc: 'Trục lông chứa chất sừng cứng, bao chân lông trong và ngoài liên tục với biểu bì.' },
      { name: '2. Nhú Chân Lông & Mầm Tóc', desc: 'Mao mạch máu nuôi dưỡng tế bào mầm phân chia liên tục tạo nên sợi lông.' },
      { name: '3. Tuyến Bã Nhờn (Sebaceous Gland)', desc: 'Tiết dịch nhờn Sebum qua ống tuyến vào cổ nang lông, bôi trơn chống thấm và kháng khuẩn cho bề mặt da.' },
      { name: '4. Cơ Dựng Lông (Arrector Pili)', desc: 'Bó cơ trơn nối từ trung bì vào bao lông, co thắt dưới kích thích lạnh hoặc sợ hãi tạo hiện tượng nổi gai ốc.' }
    ],
    clinicalPearls: 'Bít tắc cổ nang lông kết hợp tăng tiết bã nhờn và vi khuẩn C. acnes là cơ chế bệnh sinh then chốt của mụn trứng cá (Acne vulgaris).',
    audioScript: 'Nang lông và tuyến bã nhờn tạo thành một đơn vị chức năng độc đáo. Tuyến bã tiết ra lớp chất nhờn bảo vệ da, trong khi cơ dựng lông co thắt giúp ép chất bã bài xuất và tạo nên hiện tượng nổi da gà khi trời lạnh.'
  },
  micro_eye: {
    titleVi: 'Cấu Trúc Nhãn Cầu 3D (Eyeball Anatomy)',
    category: '👁️ Giải Phẫu Vi Thể Giác Quan',
    image: '/images/atlas/micro_eye.jpg',
    layers: [
      { name: '1. Vỏ Ngoài (Xơ)', desc: 'Giác mạc trong suốt phía trước chiếm 1/6, củng mạc trắng mờ phía sau chiếm 5/6 bảo vệ nhãn cầu.' },
      { name: '2. Màng Mạch (Màng Bồ Đào)', desc: 'Mống mắt điều chỉnh đồng tử, thể mi tiết thủy dịch và màng mạch giàu mạch máu nuôi võng mạc.' },
      { name: '3. Võng Mạc (Retina)', desc: 'Tầng cảm thụ thần kinh chứa tế bào nón (nhìn màu) và tế bào que (nhìn sáng tối), điểm vàng và gai thị.' },
      { name: '4. Thần Kinh Thị Giác (CN II)', desc: 'Tập hợp hơn 1 triệu sợi trục thần kinh dẫn truyền tín hiệu thị giác về vỏ não chẩm.' }
    ],
    clinicalPearls: 'Tăng áp lực nội nhãn do tắc nghẽn dẫn lưu thủy dịch dẫn tới bệnh Glaucoma (Cườm nước), gây teo lõm gai thị và mù lòa vĩnh viễn nếu không điều trị sớm.',
    audioScript: 'Nhãn cầu là cơ quan thị giác tinh xảo nhất cơ thể. Ánh sáng đi qua giác mạc trong suốt, qua đồng tử và thấu kính thể thủy tinh để hội tụ sắc nét trên bề mặt võng mạc thụ cảm.'
  },
  micro_lacrimal: {
    titleVi: 'Bộ Lệ & Tuyến Lệ (Lacrimal Apparatus)',
    category: '👁️ Bộ Máy Bảo Vệ Mắt',
    image: '/images/atlas/micro_lacrimal.jpg',
    layers: [
      { name: '1. Tuyến Lệ Chính (Lacrimal Gland)', desc: 'Nằm ở góc trên ngoài hốc mắt, tiết nước mắt chứa enzyme Lysozyme kháng khuẩn.' },
      { name: '2. Điểm Lệ & Tiểu Quản Lệ', desc: 'Hai lỗ nhỏ ở góc trong mi mắt trên và dưới thu nhận dòng nước mắt chảy qua bề mặt.' },
      { name: '3. Túi Lệ (Lacrimal Sac)', desc: 'Khoang chứa nước mắt nằm trong rãnh lệ xương lệ và xương hàm trên.' },
      { name: '4. Ống Lệ Mũi (Nasolacrimal Duct)', desc: 'Dẫn lưu nước mắt đổ vào ngách mũi dưới; giải thích lý do khi khóc thường kèm chảy nước mũi.' }
    ],
    clinicalPearls: 'Viêm tắc ống lệ mũi bẩm sinh hoặc mắc phải gây ứ đọng nước mắt sống và nhiễm trùng túi lệ (Dacryocystitis).',
    audioScript: 'Hệ thống bộ lệ giữ cho giác mạc luôn ẩm mượt và sạch khuẩn. Nước mắt tiết ra từ góc trên ngoài, quét qua toàn bộ giác mạc mỗi khi chớp mắt rồi thu về túi lệ và thoát xuống hốc mũi.'
  },
  micro_lens_zonule: {
    titleVi: 'Thể Thủy Tinh & Dây Chằng Zinn (Lens & Zonular Fibers)',
    category: '👁️ Hệ Thống Khúc Xạ & Điều Tiết',
    image: '/images/atlas/micro_lens_zonule.jpg',
    layers: [
      { name: '1. Thể Thủy Tinh (Crystalline Lens)', desc: 'Thấu kính hội tụ hai mặt lồi trong suốt, không mạch máu, thay đổi độ cong để điều tiết tiêu cự.' },
      { name: '2. Dây Chằng Zinn (Zonular Fibers)', desc: 'Hàng ngàn sợi vi thể liên kết từ nếp thể mi bám vòng quanh xích đạo thể thủy tinh.' },
      { name: '3. Cơ Thể Mi (Ciliary Muscle)', desc: 'Khi co lại làm chùng dây chằng Zinn, thể thủy tinh phồng lên để nhìn gần; khi giãn thì kéo căng thể thủy tinh để nhìn xa.' }
    ],
    clinicalPearls: 'Lão hóa làm biến tính protein tinh thể gây đục thủy tinh thể (Cataract) - nguyên nhân gây giảm thị lực phổ biến nhất ở người lớn tuổi.',
    audioScript: 'Thể thủy tinh và hệ thống dây chằng Zinn hoạt động như bộ cơ zoom tự động của máy ảnh. Khi nhìn vật thể ở gần, cơ mi co lại làm chùng dây chằng Zinn, giúp thể thủy tinh tự phồng lên để tăng độ khúc xạ.'
  },
  micro_femur_section: {
    titleVi: 'Mặt Cắt Xương Đùi & Bè Xương Xốp (Femur Trabecular Architecture)',
    category: '🦴 Giải Phẫu Vi Thể Hệ Xương',
    image: '/images/atlas/micro_femur_section.jpg',
    layers: [
      { name: '1. Vỏ Xương Đặc (Compact Bone)', desc: 'Tầng xương đặc chắc bao bọc thân xương, chịu lực xoắn và lực uốn cực đại.' },
      { name: '2. Bè Xương Xốp (Trabeculae / Spongy Bone)', desc: 'Mạng lưới các bè xương xếp theo các đường cong chịu lực nén và lực căng cơ học (Định luật Wolff).' },
      { name: '3. Khoang Tủy & Tủy Đỏ', desc: 'Chứa tủy đỏ tạo máu ở đầu xương và tủy vàng giàu lipid ở thân xương.' },
      { name: '4. Màng Xương (Periosteum)', desc: 'Lớp màng liên kết giàu mạch máu và thần kinh thụ cảm đau, chứa nguyên bào xương phát triển bề ngang.' }
    ],
    clinicalPearls: 'Gãy cổ xương đùi ở người cao tuổi loãng xương xảy ra tại tam giác Ward - nơi mật độ bè xương xốp bị suy giảm nhiều nhất.',
    audioScript: 'Mặt cắt đầu trên xương đùi minh chứng cho kỳ quan kiến trúc cơ học sinh học. Các bè xương xốp đan xen chính xác theo các vector chịu lực nén và lực kéo, giúp xương đạt độ bền vững tối đa với trọng lượng nhẹ nhất.'
  },
  micro_osteon: {
    titleVi: 'Đơn Vị Xương Vi Thể Havers (Osteon / Haversian System)',
    category: '🦴 Đơn Vị Cấu Tạo Vi Thể Xương Đặc',
    image: '/images/atlas/micro_osteon.jpg',
    layers: [
      { name: '1. Ống Havers Trung Tâm', desc: 'Chạy dọc trục xương, chứa động mạch mao mạch, tĩnh mạch và sợi thần kinh nuôi dưỡng.' },
      { name: '2. Các Lá Xương Đồng Tâm (Concentric Lamellae)', desc: 'Các ống trụ đồng tâm lồng vào nhau, các sợi collagen ở hai lá liền kề bắt chéo góc 90 độ chống xoắn vặn.' },
      { name: '3. Tế Bào Xương (Osteocytes) & Ổ Xương', desc: 'Tế bào xương trưởng thành nằm trong các ổ khuyết lacunae, cảm nhận ứng suất cơ học.' },
      { name: '4. Vi Quản Xương (Canaliculi)', desc: 'Mạng lưới ống dẫn siêu vi nối thông các tế bào xương với ống trung tâm để trao đổi chất dinh dưỡng.' }
    ],
    clinicalPearls: 'Hiện tượng tái cấu trúc xương (Bone remodeling) diễn ra liên tục nhờ hủy cốt bào đào đường hầm và tạo cốt bào xếp các lá Osteon mới.',
    audioScript: 'Đơn vị Osteon là tế bào kiến trúc cơ bản của xương đặc. Các lá xương hình ống lồng vào nhau với các sợi collagen đan chéo góc đối nghịch, tạo nên một kết cấu chịu lực xoắn vặn siêu bền vững tương tự như sợi carbon hiện đại.'
  },
  micro_stomach_wall: {
    titleVi: 'Cắt Lớp Đa Tầng Thành Dạ Dày & Nếp Gấp Rugae',
    category: '🔬 Mô Học & Giải Phẫu Vi Thể Dạ Dày',
    image: '/images/atlas/gastric_wall_histology.svg',
    layers: [
      { name: '1. Tầng Thanh Mạc (Tunica Serosa)', desc: 'Lá phúc mạc tạng mỏng phủ ngoài trơn nhẵn, tiết thanh dịch giúp dạ dày trượt êm ái khi co bóp.' },
      { name: '2. Tầng Cơ 3 Lớp (Dọc - Vòng - Chéo)', desc: 'Cơ dọc ngoài, cơ vòng giữa (dày lên ở môn vị) và cơ chéo trong đặc thù giúp dạ dày nhào nghiền nát thức ăn đa hướng.' },
      { name: '3. Tầng Dưới Niêm Mạc (Tela Submucosa)', desc: 'Mô liên kết chứa mạng mao mạch dày đặc và đám rối thần kinh Meissner điều tiết lưu lượng máu và bài tiết dịch vị.' },
      { name: '4. Cơ Niêm & Tầng Niêm Mạc (Tunica Mucosa)', desc: 'Biểu mô trụ đơn tiết chất nhầy kiềm bảo vệ thành dạ dày trước nồng độ axit chát HCl pH 1.5 - 2.0.' },
      { name: '5. Tuyến Vị & Nếp Gấp Rugae', desc: 'Tế bào viền (Parietal cells) tiết HCl và Yếu tố nội tại Castle; tế bào chính (Chief cells) tiết men Pepsinogen thủy phân protein.' }
    ],
    clinicalPearls: 'Vi khuẩn Helicobacter pylori phá vỡ hàng rào chất nhầy bảo vệ, phối hợp cùng tăng tiết acid do stress gây viêm loét dạ dày tá tràng. Thuốc ức chế bơm proton (PPI) chẹn trực tiếp bơm H+/K+-ATPase trên tế bào viền.',
    audioScript: 'Thành dạ dày sở hữu cấu trúc năm tầng mô học kiên cố. Đặc biệt nhất là ba lớp cơ trơn đan chéo đa hướng kết hợp cùng hàng rào niêm mạc tiết chất nhầy kiềm, vừa đảm bảo nhào nghiền thức ăn mạnh mẽ vừa chống lại sự ăn mòn của axit clohydric nồng độ cao.'
  },
  micro_ampulla_vater: {
    titleVi: 'Vi Thể Ngã Ba Gan Mật Tụy & Cơ Vòng Oddi',
    category: '🔬 Mô Học Hệ Thống Dẫn Mật & Tụy',
    image: '/images/atlas/biliary_anatomy.svg',
    layers: [
      { name: '1. Ống Mật Chủ (Common Bile Duct)', desc: 'Dẫn mật từ gan và túi mật xuống, đi sau đoạn D1 tá tràng và vùi sau đầu tụy.' },
      { name: '2. Ống Tụy Chính Wirsung', desc: 'Chạy dọc trục thân tụy, thu gom enzyme amylase, lipase và trypsinogen kiềm hóa dịch vị.' },
      { name: '3. Bóng Gan Tụy (Ampulla of Vater)', desc: 'Khoang phình giãn ngã ba nơi ống mật chủ hợp lưu cùng ống tụy trước khi xuyên vào thành tá tràng.' },
      { name: '4. Cơ Vòng Oddi & Nhú Tá Lớn (Major Duodenal Papilla)', desc: 'Cụm cơ vòng nhẵn dày kiểm soát van xả một chiều: giãn mở khi thức ăn vào tá tràng và co đóng khi đói.' }
    ],
    clinicalPearls: 'Sỏi mật từ túi mật rơi xuống kẹt tại bóng Vater là nguyên nhân hàng đầu gây Viêm tụy cấp do tắc nghẽn dòng chảy dịch tụy (Biliary pancreatitis). Kỹ thuật nội soi mật tụy ngược dòng (ERCP) cho phép cắt mở cơ vòng Oddi để gắp sỏi giải áp cấp cứu.',
    audioScript: 'Ngã ba mật tụy và cơ vòng Oddi là chốt chặn sinh học quyết định quá trình tiêu hóa mỡ và protein. Khi thức ăn giàu lipid kích thích hormone CCK bài tiết, cơ vòng Oddi sẽ giãn mở cho dịch mật và dịch tụy cùng ùa vào tá tràng D2 để nhũ hóa thức ăn.'
  },
  micro_intestinal_villi: {
    titleVi: 'Vi Thể Quai Ruột Non & Nhung Mao Hấp Thu',
    category: '🔬 Mô Học Hệ Thống Hấp Thu Dinh Dưỡng',
    image: '/images/atlas/gi_tract_anatomy.svg',
    layers: [
      { name: '1. Nếp Gấp Vòng Kerckring (Plicae Circulares)', desc: 'Các nếp gấp niêm mạc vĩnh viễn chạy vòng quanh lòng ruột non, tăng diện tích tiếp xúc lên 3 lần.' },
      { name: '2. Nhung Mao Ruột (Intestinal Villi)', desc: 'Hàng triệu nhú lồi hình ngón tay cao 0.5 - 1 mm, tăng diện tích bề mặt lên gấp 10 lần.' },
      { name: '3. Mao Mạch & Mạch Dưỡng Trấp Trung Tâm (Lacteal)', desc: 'Mạch bạch huyết ở trục nhung mao chuyên biệt hấp thu axit béo chuỗi dài và chylomicron dạng nhũ tương trắng sữa.' },
      { name: '4. Bờ Bàn Chải Vi Nhung Mao (Microvilli)', desc: 'Gấp nếp siêu vi của màng tế bào biểu mô ruột, chứa men lactase, maltase và peptidase, đẩy tổng diện tích hấp thu lên tới 250 mét vuông.' },
      { name: '5. Mảng Bạch Huyết Peyer (Peyer\'s Patches)', desc: 'Cụm nang lympho miễn dịch GALT tại hồi tràng nhận diện kháng nguyên vi khuẩn đường ruột.' }
    ],
    clinicalPearls: 'Trong bệnh Celiac, phản ứng dị ứng Gluten dẫn tới phá hủy và teo đét toàn bộ nhung mao ruột, gây hội chứng kém hấp thu nghiêm trọng, tiêu chảy phân mỡ và sụt cân.',
    audioScript: 'Nhung mao ruột non là bề mặt hấp thu tinh vi và rộng lớn nhất cơ thể người. Với sự kết hợp giữa nếp gấp Kerckring, nhung mao và bờ bàn chải vi nhung mao, diện tích trao đổi chất của ruột non đạt tới 250 mét vuông, tương đương một sân tennis tiêu chuẩn.'
  }
};

export function showMicroanatomyHUD(card, viewer) {
  const data = MICRO_DATA[card.id];
  if (!data) return;

  if (!hudEl) {
    createHUDElement();
  }

  // Populate data
  hudEl.querySelector('#microHUDCategory').textContent = data.category;
  hudEl.querySelector('#microHUDTitle').textContent = data.titleVi || card.titleVi;
  
  const imgEl = hudEl.querySelector('#microHUDImg');
  if (imgEl) {
    imgEl.src = data.image || card.image;
    imgEl.alt = data.titleVi;
  }

  const layersContainer = hudEl.querySelector('#microHUDLayers');
  if (layersContainer) {
    layersContainer.innerHTML = data.layers.map(l => `
      <div class="micro-layer-card">
        <h5 class="micro-layer-name">${escapeHtml(l.name)}</h5>
        <p class="micro-layer-desc">${escapeHtml(l.desc)}</p>
      </div>
    `).join('');
  }

  const pearlsEl = hudEl.querySelector('#microHUDPearls');
  if (pearlsEl) {
    pearlsEl.textContent = data.clinicalPearls;
  }

  // Bind Voice Button
  const voiceBtn = hudEl.querySelector('#btnMicroVoiceAI');
  if (voiceBtn) {
    voiceBtn.onclick = () => {
      toggleVoiceSummary(data.audioScript);
    };
  }

  // Ensure HUD is visible
  hudEl.classList.remove('hidden');
  hudEl.classList.add('visible');
  hudEl.style.display = 'block';
}

export function hideMicroanatomyHUD() {
  if (hudEl) {
    hudEl.classList.remove('visible');
    hudEl.classList.add('hidden');
    hudEl.style.display = 'none';
  }
  stopVoiceSummary();
}

function createHUDElement() {
  hudEl = document.createElement('div');
  hudEl.id = 'microanatomyHUD';
  hudEl.className = 'microanatomy-hud hidden';
  hudEl.innerHTML = `
    <div class="micro-hud-container">
      <div class="micro-hud-header">
        <div class="micro-hud-title-col">
          <span class="micro-hud-badge" id="microHUDCategory">🔬 Mô học</span>
          <h4 class="micro-hud-title" id="microHUDTitle">Lát Cắt Vi Thể</h4>
        </div>
        <button type="button" class="micro-hud-close" id="btnMicroHUDClose" aria-label="Đóng">✕</button>
      </div>

      <div class="micro-hud-body">
        <div class="micro-hud-visual-row">
          <div class="micro-hud-thumb-box">
            <img id="microHUDImg" class="micro-hud-img" src="" alt="Vi thể" />
          </div>
          <div class="micro-hud-quick-audio">
            <button type="button" class="btn-micro-voice" id="btnMicroVoiceAI">
              <span class="micro-voice-icon">🎙️</span>
              <span class="micro-voice-label">AI Giải Thích 15s</span>
              <div class="micro-wave-bars">
                <span class="micro-wave-bar"></span>
                <span class="micro-wave-bar"></span>
                <span class="micro-wave-bar"></span>
              </div>
            </button>
          </div>
        </div>

        <div class="micro-hud-layers-list" id="microHUDLayers"></div>

        <div class="micro-hud-clinical-box">
          <div class="micro-clinical-label">💡 Ý nghĩa lâm sàng & Bệnh học:</div>
          <p class="micro-clinical-text" id="microHUDPearls"></p>
        </div>
      </div>
    </div>
  `;

  document.body.appendChild(hudEl);

  hudEl.querySelector('#btnMicroHUDClose')?.addEventListener('click', hideMicroanatomyHUD);
}

function toggleVoiceSummary(script) {
  if (isSpeaking) {
    stopVoiceSummary();
    return;
  }
  playVoiceSummary(script);
}

function playVoiceSummary(script) {
  if (!('speechSynthesis' in window) || !script) {
    showToast('⚠️ Thiết bị không hỗ trợ giọng nói tự động');
    return;
  }

  stopVoiceSummary();

  const utterance = new SpeechSynthesisUtterance(script);
  utterance.lang = 'vi-VN';
  utterance.rate = 1.0;
  utterance.pitch = 1.0;

  const viVoice = getVietnameseVoice();
  if (viVoice) utterance.voice = viVoice;

  utterance.onstart = () => {
    isSpeaking = true;
    hudEl?.querySelector('#btnMicroVoiceAI')?.classList.add('playing');
    showToast('🎙️ AI đang giải thích cấu trúc vi thể...');
  };

  utterance.onend = () => {
    isSpeaking = false;
    hudEl?.querySelector('#btnMicroVoiceAI')?.classList.remove('playing');
  };

  utterance.onerror = () => {
    isSpeaking = false;
    hudEl?.querySelector('#btnMicroVoiceAI')?.classList.remove('playing');
  };

  currentVoiceUtterance = utterance;
  window.speechSynthesis.speak(utterance);
}

function stopVoiceSummary() {
  if ('speechSynthesis' in window && window.speechSynthesis.speaking) {
    window.speechSynthesis.cancel();
  }
  isSpeaking = false;
  hudEl?.querySelector('#btnMicroVoiceAI')?.classList.remove('playing');
}

function escapeHtml(text) {
  if (!text) return '';
  return String(text)
    .replace(/&/g, '&amp;')
    .replace(/</g, '&lt;')
    .replace(/>/g, '&gt;')
    .replace(/"/g, '&quot;');
}
