/**
 * Chế Độ Bác Sĩ Tư Vấn Bệnh Nhân Trong 30 Giây (Patient Consultation Mode)
 * Giao diện tối ưu di động, chuyên biệt cho phòng khám & bác sĩ
 * Trực quan hóa nguồn gốc triệu chứng và phác đồ điều trị qua mô hình 3D và 4 cấp độ bệnh học.
 */

import { selectStructureAnywhere, showToast } from './sidebar.js';
import { ANATOMY_CONCEPTS } from '../data/anatomyConcepts.js';

let consultationModalEl = null;
let currentActiveCase = null;
let currentlySpeakingBtn = null;

export const PATIENT_CASES = [
  {
    id: 'disc_herniation',
    conceptId: 'concept_intervertebral_disc',
    title: 'Thoát vị đĩa đệm cột sống L4-L5',
    category: 'Cột sống & Đau rễ tọa',
    icon: '🦴',
    partId: 'Intervertebral disc L4-L5',
    idealPlane: 'axial',
    clipOffset: 1.05,
    patientQuestion: 'Bác sĩ ơi, tại sao tôi đau thắt lưng mà lại buốt nhói lan xuống bắp chân?',
    doctorExplanation: 'Đĩa đệm giống như một chiếc đệm giảm chấn giữa hai đốt sống. Khi bao xơ bên ngoài bị nứt rách, nhân nhầy bên trong phòi ra ngoài đè trúng rễ dây thần kinh tọa chạy dọc xuống chân, gây đau buốt, tê bì và yếu chân.',
    stages: [
      { name: 'Cấp 0: Bình thường', desc: 'Đĩa đệm nguyên vẹn, nâng đỡ cột sống đàn hồi êm dịu.' },
      { name: 'Cấp 1: Phình lồi đĩa đệm', desc: 'Bao xơ bị nứt vi thể, đau mỏi thắt lưng âm ỉ khi ngồi lâu.' },
      { name: 'Cấp 2: Thoát vị thực thụ', desc: 'Nhân nhầy chèn ép rễ L5, tê rần dọc từ mông xuống mu bàn chân.' },
      { name: 'Cấp 3: Hẹp ống sống & Liệt', desc: 'Teo cơ cẳng chân, đi rớt dép, rối loạn đại tiểu tiện cấp cứu.' }
    ],
    advice: '✓ Giữ lưng thẳng, tuyệt đối không cúi gập bê vật nặng đột ngột.\n✓ Tập bơi lội, vật lý trị liệu phục hồi chức năng và dùng thuốc kháng viêm giảm áp rễ thần kinh.'
  },
  {
    id: 'gastric_ulcer',
    conceptId: 'concept_gastrointestinal_tract',
    title: 'Viêm loét dạ dày & Vi khuẩn H.pylori',
    category: 'Tiêu hóa & Thượng vị',
    icon: '🥣',
    partId: 'Stomach',
    idealPlane: 'sagittal',
    clipOffset: 0.05,
    patientQuestion: 'Tôi cứ ăn vào là đau quặn thượng vị, đói cũng cồn cào rát bỏng là sao?',
    doctorExplanation: 'Dạ dày chứa axit rất mạnh để tiêu hóa thức ăn nhưng được bảo vệ bởi lớp chất nhầy kiềm. Vi khuẩn H.pylori tiết độc tố phá tan lớp màng bảo vệ này, khiến axit và men tiêu hóa ăn mòn trực tiếp vào thịt dạ dày tạo thành ổ loét sâu.',
    stages: [
      { name: 'Cấp 0: Bình thường', desc: 'Hàng rào nhầy dày trơn láng, bảo vệ niêm mạc khỏi axit pH 1.5.' },
      { name: 'Cấp 1: Viêm trợt niêm mạc', desc: 'H.pylori xâm lấn, xung huyết đỏ rực, ợ chua, nóng rát cồn cào.' },
      { name: 'Cấp 2: Ổ loét sâu thành cơ', desc: 'Axit ăn sâu lớp cơ, đau nhói từng cơn lúc đói/no, rỉ máu vi thể.' },
      { name: 'Cấp 3: Thủng & Chảy máu', desc: 'Đứt động mạch vị nôn máu/phân đen, thủng ổ bụng đau như dao đâm.' }
    ],
    advice: '✓ Tuân thủ nghiêm ngặt phác đồ diệt vi khuẩn HP (kháng sinh + ức chế axit PPI) đủ 14 ngày.\n✓ Kiêng bia rượu, thức ăn cay nóng, đồ chua và tránh thức khuya căng thẳng.'
  },
  {
    id: 'kidney_stones',
    conceptId: 'concept_urinary_nephron',
    title: 'Sỏi kẹt niệu quản & Suy giảm thận',
    category: 'Tiết niệu & Đau quặn',
    icon: '🩺',
    partId: 'Kidney.l',
    idealPlane: 'coronal',
    clipOffset: -0.05,
    patientQuestion: 'Cơn đau quặn từ hông lưng lan xuống bẹn của tôi từ đâu mà ra?',
    doctorExplanation: 'Thận lọc máu liên tục để bài tiết nước tiểu. Tinh thể khoáng chất lắng cặn kết tủa thành sỏi. Khi viên sỏi rơi xuống mắc kẹt vào ống dẫn nước tiểu (niệu quản) hẹp 3mm, nước tiểu bị ứ ngược lên làm căng trướng đài thận gây cơn đau quặn thận dữ dội.',
    stages: [
      { name: 'Cấp 0: Thận khỏe mạnh', desc: '2 thận lọc 180 lít máu mỗi ngày, bài xuất nước tiểu thông thoáng.' },
      { name: 'Cấp 1: Sỏi đài thận nhỏ', desc: 'Sỏi 3-5mm nằm im trong thận, tiểu hơi rắt, mỏi thắt lưng.' },
      { name: 'Cấp 2: Kẹt ống niệu quản', desc: 'Cơn đau quặn thận quằn quại, đài bể thận ứ nước độ 2-3.' },
      { name: 'Cấp 3: Suy thận mạn tính', desc: 'Nhu mô thận bị teo xơ chai mỏng, tăng Ure máu, nguy cơ chạy thận.' }
    ],
    advice: '✓ Uống nhiều nước (2.0 – 2.5 lít/ngày) để tống sỏi nhỏ.\n✓ Tán sỏi nội soi hoặc ngoài cơ thể nếu sỏi > 6mm kẹt gây giãn ứ nước thận.'
  },
  {
    id: 'carpal_tunnel',
    conceptId: 'concept_brachial_plexus',
    title: 'Hội chứng ống cổ tay (CTS)',
    category: 'Thần kinh & Bàn tay',
    icon: '⚡',
    partId: 'Median nerve.r',
    idealPlane: 'coronal',
    clipOffset: 0.15,
    patientQuestion: 'Nửa đêm tôi hay bị tê buốt ngón cái, ngón trỏ và rơi chén đũa là bệnh gì?',
    doctorExplanation: 'Ở cổ tay có một đường hầm hẹp chứa các gân gấp ngón và dây thần kinh giữa. Khi làm việc bàn phím, xe máy nhiều, bao gân bị viêm sưng dày lên làm tăng áp lực đường hầm, thắt nghẽn dây thần kinh giữa gây tê buốt ngón 1-2-3 và teo cơ gốc ngón cái.',
    stages: [
      { name: 'Cấp 0: Bình thường', desc: 'Dây thần kinh giữa trơn láng, dẫn truyền cảm giác linh hoạt.' },
      { name: 'Cấp 1: Tê buốt về đêm', desc: 'Tê châm chích đầu ngón tay khi ngủ, vẩy tay thì thấy đỡ tê.' },
      { name: 'Cấp 2: Hẹp nặng & Teo cơ', desc: 'Tê buốt cả ngày, cầm đũa chén dễ rơi, teo hõm cơ mô cái ngón cái.' },
      { name: 'Cấp 3: Bàn tay khỉ vĩnh viễn', desc: 'Mất hoàn toàn chức năng đối chiếu ngón cái, xơ hóa sợi trục.' }
    ],
    advice: '✓ Đeo nẹp cổ tay cố định tư thế trung tính khi ngủ.\n✓ Nghỉ ngơi giữa giờ làm việc, tiêm kháng viêm hoặc phẫu thuật giải phóng dây chằng ngang cổ tay.'
  },
  {
    id: 'ear_vertigo',
    conceptId: 'concept_inner_ear_vestibular',
    title: 'Rối loạn tiền đình & Sỏi tai BPPV',
    category: 'Tai mũi họng & Thăng bằng',
    icon: '👂',
    partId: 'Malleus.r',
    idealPlane: 'coronal',
    clipOffset: 0.08,
    patientQuestion: 'Mỗi lần tôi nghiêng đầu hoặc trở mình trên giường là nhà cửa quay cuồng dữ dội?',
    doctorExplanation: 'Trong tai trong có hệ thống 3 ống thăng bằng chứa chất lỏng và các tinh thể sỏi canxi tí hon. Do thoái hóa hoặc va đập, sỏi tai bị bong rơi lạc vào ống bán khuyên. Khi bác đổi tư thế, sỏi tai chuyển động tạo dòng xoáy kích thích não hiểu lầm là cơ thể đang xoay tròn, gây chóng mặt dữ dội và nôn mửa.',
    stages: [
      { name: 'Cấp 0: Thăng bằng tốt', desc: 'Sỏi tai nằm cố định trong túi xoang nang, bước đi vững chãi.' },
      { name: 'Cấp 1: Ù tai & Viêm tai giữa', desc: 'Nghẹt vòi tai, hòm nhĩ áp lực âm, nghe kém thoáng qua.' },
      { name: 'Cấp 2: BPPV quay cuồng', desc: 'Sỏi tai trôi trong ống bán khuyên, chóng mặt xoay tròn khi trở mình.' },
      { name: 'Cấp 3: Mất thăng bằng mạn', desc: 'Tổn thương tế bào lông thính giác, đi đứng loạng choạng, điếc tai.' }
    ],
    advice: '✓ Thực hiện nghiệm pháp xoay đầu Epley tại phòng khám để đưa sỏi tai trở về vị trí cũ.\n✓ Đổi tư thế từ tốn, không xoay đầu quá nhanh và dùng thuốc tăng tuần hoàn mê đạo tai.'
  },
  {
    id: 'willis_stroke',
    conceptId: 'concept_circle_of_willis',
    title: 'Đa giác Willis & Đột quỵ thiếu máu não',
    category: 'Mạch máu não & Tai biến',
    icon: '🧠',
    partId: 'Basilar artery',
    idealPlane: 'sagittal',
    clipOffset: 0.0,
    patientQuestion: 'Tại sao mỡ máu và huyết áp cao lại dễ dẫn đến tai biến liệt nửa người?',
    doctorExplanation: 'Não bộ được cấp máu bởi vòng tuần hoàn đa giác Willis đáy não. Khi mảng xơ vữa mỡ máu nứt vỡ hoặc cục máu đông từ tim trôi lên làm bít tắc một nhánh động mạch não, vùng não tương ứng bị chết chỉ sau vài phút do thiếu Oxy, dẫn tới liệt nửa người hoặc mất ngôn ngữ.',
    stages: [
      { name: 'Cấp 0: Mạch máu trơn láng', desc: 'Máu lưu thông thông suốt nuôi dưỡng 100 tỷ tế bào thần kinh.' },
      { name: 'Cấp 1: Xơ vữa thành mạch', desc: 'Mỡ máu bám lòng mạch, hẹp lòng mạch 30-50%, hay đau đầu chóng mặt.' },
      { name: 'Cấp 2: Thiếu máu não thoáng qua', desc: 'Tê yếu tay chân vài phút rồi hồi phục (Cảnh báo đột quỵ sắp tới!).' },
      { name: 'Cấp 3: Nhồi máu não thực sự', desc: 'Tắc hoàn toàn mạch máu, liệt nửa người, méo miệng, hôn mê cấp cứu.' }
    ],
    advice: '✓ Kiểm soát huyết áp < 130/80 mmHg và mỡ máu LDL-C nghiêm ngặt.\n✓ Nhớ dấu hiệu F.A.S.T (Mặt méo, Tay yếu, Giọng nói ngọng, Thời gian vàng < 4.5 giờ đến viện cấp cứu).'
  },
  {
    id: 'knee_acl',
    conceptId: 'concept_knee_joint_ligaments',
    title: 'Đứt dây chằng chéo & Rách sụn chêm gối',
    category: 'Cơ xương khớp & Thể thao',
    icon: '🦵',
    partId: 'Anterior cruciate ligament.r',
    idealPlane: 'sagittal',
    clipOffset: 0.12,
    patientQuestion: 'Sau tiếng "bốp" khi đá bóng, đầu gối tôi bị lỏng và sụm xuống là bị gì?',
    doctorExplanation: 'Khớp gối giữ vững nhờ 2 dây chằng bắt chéo hình chữ X và 2 miếng sụn chêm đệm lực. Khi tiếp đất vặn xoắn gối mạnh, dây chằng chéo trước (ACL) bị đứt toác. Mất điểm giữ, xương chày bị trượt ra trước làm gối lỏng lẻo, nhanh chóng làm rách sụn chêm và mòn khớp gối sớm.',
    stages: [
      { name: 'Cấp 0: Khớp gối vững chắc', desc: 'Dây chằng căng dẻo dai, sụn chêm nguyên vẹn giảm chấn êm ái.' },
      { name: 'Cấp 1: Giãn đứt bán phần', desc: 'Dây chằng rách một số bó sợi, gối sưng đau 1-2 tuần đầu.' },
      { name: 'Cấp 2: Đứt hoàn toàn dây chằng', desc: 'Mâm chày trượt ra trước, gối lỏng lỏng khi đi cầu thang, dễ sụm gối.' },
      { name: 'Cấp 3: Hư rách sụn & Thoái hóa', desc: 'Rách quai vali sụn chêm kẹt khớp, gai xương mọc, thoái hóa khớp sớm.' }
    ],
    advice: '✓ Chườm đá, cố định nẹp gối trong giai đoạn cấp.\n✓ Phẫu thuật nội soi tái tạo dây chằng chéo bằng gân tự thân và khâu sụn chêm để phục hồi thể thao.'
  },
  {
    id: 'biliary_stones',
    conceptId: 'concept_hepatobiliary_pancreas',
    title: 'Sỏi túi mật & Viêm tụy cấp nguy kịch',
    category: 'Gan mật & Cấp cứu tụy',
    icon: '🧪',
    partId: 'Gallbladder',
    idealPlane: 'coronal',
    clipOffset: 0.05,
    patientQuestion: 'Tại sao sỏi nhỏ trong túi mật lại có thể gây nguy hiểm tính mạng?',
    doctorExplanation: 'Túi mật dự trữ dịch tiêu hóa mỡ. Tinh thể cholesterol cô đặc thành sỏi. Những viên sỏi nhỏ rất dễ trôi theo ống mật xuống ngã ba bóng Vater. Nếu viên sỏi bị nghẽn lại tại đây, nó sẽ bít luôn đường thoát của men tụy, làm dịch tụy ứ ngược và tự tiêu hủy chính lá tụy gây viêm tụy cấp hoại tử cực kỳ nguy hiểm.',
    stages: [
      { name: 'Cấp 0: Túi mật khỏe', desc: 'Dịch mật vàng trong lưu thông đều đặn xuống ruột tiêu hóa chất béo.' },
      { name: 'Cấp 1: Bùn mật & Sỏi nhỏ', desc: 'Ăn đồ dầu mỡ thấy đầy trướng bụng, đau tức hạ sườn phải.' },
      { name: 'Cấp 2: Kẹt cổ túi mật', desc: 'Túi mật sưng to ứ mủ, sốt cao rét run, đau quặn dữ dội hạ sườn.' },
      { name: 'Cấp 3: Sỏi kẹt Vater & Viêm tụy', desc: 'Men tụy ăn thủng mạch máu tụy, sốc nhiễm trùng, nguy cơ tử vong cao.' }
    ],
    advice: '✓ Khám siêu âm định kỳ theo dõi kích thước sỏi.\n✓ Phẫu thuật nội soi cắt túi mật sớm khi sỏi gây đau tái phát để triệt tiêu vĩnh viễn nguy cơ viêm tụy cấp.'
  },
  {
    id: 'cardiac_valve',
    conceptId: 'concept_cardiac_valves',
    title: 'Hở van tim & Suy tim sung huyết',
    category: 'Tim mạch & Huyết động',
    icon: '🫀',
    partId: 'Left ventricle',
    idealPlane: 'coronal',
    clipOffset: 0.02,
    patientQuestion: 'Bác sĩ bảo tôi bị hở van 2 lá, tại sao tôi lại hay bị hụt hơi khó thở khi nằm?',
    doctorExplanation: 'Van tim giống như cánh cửa 1 chiều ngăn máu chảy ngược. Khi van bị hở, mỗi nhát co bóp của tim có một lượng máu bị phụt ngược lại tâm nhĩ và ứ dồn lên phổi. Máu ứ ở phổi làm dịch tràn vào phế nang, khiến bác bị khó thở, hụt hơi nhất là khi nằm ngủ vào ban đêm.',
    stages: [
      { name: 'Cấp 0: Van đóng khít', desc: 'Tim co bóp tống máu 1 chiều, phân suất tống máu EF > 60% khỏe mạnh.' },
      { name: 'Cấp 1: Hở van nhẹ 1/4 - 2/4', desc: 'Lá van hơi võng, tim còn bù trừ tốt, chưa có triệu chứng rõ rệt.' },
      { name: 'Cấp 2: Hở van vừa 3/4', desc: 'Tim to ra bù trừ, bắt đầu khó thở khi đi bộ nhanh hoặc leo cầu thang.' },
      { name: 'Cấp 3: Suy tim nặng & Phù phổi', desc: 'Khó thở cả khi nghỉ, phù 2 chân, ho khạc bọt hồng cấp cứu.' }
    ],
    advice: '✓ Giảm muối nghiêm ngặt (< 3g muối/ngày), không uống quá nhiều nước.\n✓ Uống thuốc trợ tim, hạ huyết áp, lợi tiểu đều đặn và phẫu thuật sửa/thay van khi có chỉ định.'
  },
  {
    id: 'respiratory_copd',
    conceptId: 'concept_respiratory_alveoli',
    title: 'Phế nang phổi & Bệnh phổi tắc nghẽn (COPD)',
    category: 'Hô hấp & Phế quản',
    icon: '🫁',
    partId: 'Lung.r',
    idealPlane: 'coronal',
    clipOffset: 0.0,
    patientQuestion: 'Tôi hút thuốc lá lâu năm, gần đây thở khò khè và leo dốc không nổi là vì sao?',
    doctorExplanation: 'Phổi có 300 triệu túi phế nang nhỏ li ti như chùm nho để hấp thụ Oxy vào máu. Khói thuốc lá làm viêm mạn tính và phá hủy các vách phế nang, làm chúng xơ hóa dính lại thành những bóng khí khổng lồ mất tính đàn hồi. Không khí bị ứ kẹt trong phổi không thở ra được, gây cảm giác ngột ngạt thiếu dưỡng khí liên tục.',
    stages: [
      { name: 'Cấp 0: Phế nang hồng hào', desc: '300 triệu phế nang co giãn linh hoạt, trao đổi khí Oxy hoàn hảo.' },
      { name: 'Cấp 1: Viêm phế quản mạn', desc: 'Ho khạc đờm nhiều vào buổi sáng, hay bị viêm họng khò khè.' },
      { name: 'Cấp 2: Tắc nghẽn vừa (COPD)', desc: 'Thở dốc khi leo 1 tầng gác, phải dùng thuốc xịt giãn phế quản cắt cơn.' },
      { name: 'Cấp 3: Suy hô hấp mạn tính', desc: 'Môi tím tái, lồng ngực hình thùng, phải thở Oxy hỗ trợ liên tục tại nhà.' }
    ],
    advice: '✓ CAI THUỐC LÁ NGAY LẬP TỨC (điều quan trọng nhất cứu vãn chức năng phổi còn lại).\n✓ Xịt thuốc dãn phế quản đúng kỹ thuật và tiêm phòng vắc-xin cúm/phế cầu hàng năm.'
  }
];

function cleanSpeech(raw) {
  if (!raw) return '';
  return raw
    .replace(/[()[\]{}#*]/g, ' ')
    .replace(/\s+/g, ' ')
    .trim();
}

function stopCurrentSpeech() {
  if ('speechSynthesis' in window) {
    window.speechSynthesis.cancel();
  }
  if (currentlySpeakingBtn) {
    currentlySpeakingBtn.classList.remove('is-speaking');
    currentlySpeakingBtn = null;
  }
}

function speakExplanation(text, btnEl) {
  if (!text || !('speechSynthesis' in window)) {
    showToast('Trình duyệt không hỗ trợ Web Speech TTS.');
    return;
  }

  if (btnEl && btnEl.classList.contains('is-speaking')) {
    stopCurrentSpeech();
    showToast('⏹️ Đã dừng đọc');
    return;
  }

  stopCurrentSpeech();

  const utterance = new SpeechSynthesisUtterance(cleanSpeech(text));
  utterance.lang = 'vi-VN';
  utterance.rate = 0.95;

  const voices = window.speechSynthesis.getVoices();
  const viVoice = voices.find(v => v.lang === 'vi-VN' || v.lang.startsWith('vi'));
  if (viVoice) utterance.voice = viVoice;

  if (btnEl) {
    btnEl.classList.add('is-speaking');
    currentlySpeakingBtn = btnEl;
  }

  utterance.onend = () => {
    if (btnEl) btnEl.classList.remove('is-speaking');
    if (currentlySpeakingBtn === btnEl) currentlySpeakingBtn = null;
  };
  utterance.onerror = () => {
    if (btnEl) btnEl.classList.remove('is-speaking');
    if (currentlySpeakingBtn === btnEl) currentlySpeakingBtn = null;
  };

  window.speechSynthesis.speak(utterance);
  showToast('🔊 Bác sĩ AI đang đọc tư vấn...');
}

export function openPatientConsultationModal(targetCaseId = null, viewer = window.viewer) {
  let matchedCase = PATIENT_CASES.find(c => c.id === targetCaseId || c.conceptId === targetCaseId);
  if (!matchedCase) {
    matchedCase = PATIENT_CASES[0];
  }
  currentActiveCase = matchedCase;

  if (!consultationModalEl) {
    consultationModalEl = document.createElement('div');
    consultationModalEl.id = 'patientConsultationModal';
    consultationModalEl.className = 'patient-consult-modal-backdrop';
    document.body.appendChild(consultationModalEl);
  }

  renderConsultationUI();
  consultationModalEl.classList.remove('hidden');

  // Navigate 3D to structure
  if (currentActiveCase?.partId) {
    selectStructureAnywhere(currentActiveCase.partId);
  }
}

export function closePatientConsultationModal() {
  stopCurrentSpeech();
  if (consultationModalEl) {
    consultationModalEl.classList.add('hidden');
  }
}

function renderConsultationUI() {
  if (!consultationModalEl || !currentActiveCase) return;

  const c = currentActiveCase;

  consultationModalEl.innerHTML = `
    <div class="patient-consult-dialog">
      <!-- Header -->
      <div class="consult-dialog-header">
        <div class="consult-header-left">
          <span class="consult-header-badge">🩺 BÁC SĨ TƯ VẤN (30 GIÂY)</span>
          <h3 class="consult-header-title">${c.title}</h3>
        </div>
        <button type="button" class="consult-close-btn" id="consultCloseBtn">&times;</button>
      </div>

      <!-- Quick Disease Carousel / Tabs -->
      <div class="consult-disease-tabs-scroll">
        ${PATIENT_CASES.map(item => `
          <button type="button" class="consult-tab-btn ${item.id === c.id ? 'active' : ''}" data-case="${item.id}">
            <span>${item.icon} ${item.title}</span>
          </button>
        `).join('')}
      </div>

      <!-- Main Body Container -->
      <div class="consult-dialog-body">
        <!-- Patient Question Callout -->
        <div class="consult-patient-question-card">
          <div class="patient-q-icon">👤</div>
          <div class="patient-q-text">
            <strong>Bệnh nhân hỏi:</strong> "${c.patientQuestion}"
          </div>
        </div>

        <!-- Doctor's 10-Second Explanation -->
        <div class="consult-doctor-explain-card">
          <div class="doctor-card-top">
            <div class="doctor-badge-title">
              <span>🩺 Bác sĩ giải thích (Dễ hiểu & Trực quan)</span>
            </div>
            <button type="button" class="btn-consult-tts" id="btnConsultTTS" title="Nghe Bác sĩ AI đọc to">
              <svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.2"><polygon points="11 5 6 9 2 9 2 15 6 15 11 19 11 5"/><path d="M19.07 4.93a10 10 0 0 1 0 14.14M15.54 8.46a5 5 0 0 1 0 7.07"/></svg>
              <span>Nghe đọc</span>
            </button>
          </div>
          <p class="doctor-card-body">${c.doctorExplanation}</p>
        </div>

        <!-- 4-Stage Pathology Progression Slider -->
        <div class="consult-stages-card">
          <div class="consult-stages-header">
            <span class="stages-header-label">⚡ TIẾN TRIỂN BỆNH NẾU KHÔNG ĐIỀU TRỊ:</span>
            <span class="stages-stage-pill" id="consultStageLabel">${c.stages[1].name}</span>
          </div>
          <div class="consult-range-wrap">
            <input type="range" min="0" max="${c.stages.length - 1}" value="1" step="1" class="consult-range" id="consultRange" />
            <div class="consult-ticks">
              ${c.stages.map((st, i) => `<span class="${i === c.stages.length - 1 ? 'text-danger' : ''}">${st.name.split(':')[0]}</span>`).join('')}
            </div>
          </div>
          <div class="consult-stage-desc" id="consultStageDesc">
            ${c.stages[1].desc}
          </div>
        </div>

        <!-- Clinical Advice Card -->
        <div class="consult-advice-card">
          <div class="advice-card-header">
            <span>💡 LỜI KHUYÊN & PHÁC ĐỒ ĐIỀU TRỊ</span>
          </div>
          <div class="advice-card-body">
            ${c.advice.split('\n').map(line => `<p class="advice-line">${line}</p>`).join('')}
          </div>
        </div>

        <!-- Action Toolbar -->
        <div class="consult-toolbar-card">
          <button type="button" class="btn-consult-action primary" id="btnConsultOpenClip">
            <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><circle cx="6" cy="6" r="3"/><circle cx="6" cy="18" r="3"/><line x1="20" y1="4" x2="8.12" y2="15.88"/><line x1="14.47" y1="14.48" x2="20" y2="20"/><line x1="8.12" y1="8.12" x2="12" y2="12"/></svg>
            <span>✂️ Cắt Lớp 3D Nhìn Lòng Tạng</span>
          </button>
          <button type="button" class="btn-consult-action secondary" id="btnConsultFocus3D">
            <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><circle cx="11" cy="11" r="8"/><line x1="21" y1="21" x2="16.65" y2="16.65"/><line x1="11" y1="8" x2="11" y2="14"/><line x1="8" y1="11" x2="14" y2="11"/></svg>
            <span>Phóng To Cấu Trúc 3D</span>
          </button>
        </div>
      </div>
    </div>
  `;

  // Attach event listeners
  consultationModalEl.querySelector('#consultCloseBtn')?.addEventListener('click', closePatientConsultationModal);

  // Disease switch tabs
  consultationModalEl.querySelectorAll('.consult-tab-btn').forEach(btn => {
    btn.addEventListener('click', () => {
      const caseId = btn.dataset.case;
      const found = PATIENT_CASES.find(item => item.id === caseId);
      if (found) {
        stopCurrentSpeech();
        currentActiveCase = found;
        renderConsultationUI();
        selectStructureAnywhere(found.partId);
      }
    });
  });

  // Slider change
  const range = consultationModalEl.querySelector('#consultRange');
  const stageLabel = consultationModalEl.querySelector('#consultStageLabel');
  const stageDesc = consultationModalEl.querySelector('#consultStageDesc');

  range?.addEventListener('input', (e) => {
    const idx = parseInt(e.target.value, 10) || 0;
    const st = c.stages[idx];
    if (st) {
      if (stageLabel) stageLabel.textContent = st.name;
      if (stageDesc) stageDesc.textContent = st.desc;
    }
  });

  // TTS Speaker
  const ttsBtn = consultationModalEl.querySelector('#btnConsultTTS');
  ttsBtn?.addEventListener('click', () => {
    const fullText = `${c.title}. Bệnh nhân hỏi: ${c.patientQuestion}. Bác sĩ giải thích: ${c.doctorExplanation}. Lời khuyên điều trị: ${c.advice}`;
    speakExplanation(fullText, ttsBtn);
  });

  // 3D Clipping button
  consultationModalEl.querySelector('#btnConsultOpenClip')?.addEventListener('click', () => {
    closePatientConsultationModal();
    if (typeof window.openClippingController === 'function') {
      window.openClippingController(c.idealPlane, c.clipOffset);
    }
  });

  // 3D Focus button
  consultationModalEl.querySelector('#btnConsultFocus3D')?.addEventListener('click', () => {
    closePatientConsultationModal();
    selectStructureAnywhere(c.partId);
  });
}

// Global exposure
if (typeof window !== 'undefined') {
  window.openPatientConsultationModal = openPatientConsultationModal;
  window.closePatientConsultationModal = closePatientConsultationModal;
}
