// Voice AI Controller for Hands-Free Anatomy 3D Navigation
// Utilizes Web Speech API (SpeechRecognition / webkitSpeechRecognition)
// Native Vietnamese (vi-VN) Voice Commands without server costs or lag.

import { dynamicAnatomy, MOTIONS } from '../viewer/dynamicAnatomy.js';
import { openMotionPanel, minimizeMotionPanel, closeMotionPanel } from '../ui/motionPanel.js';
import { handleCompactAISubmit } from '../ui/aiAssistantModal.js';

let recognition = null;
let isListening = false;
let toastEl = null;
let toastTimeout = null;

export function initVoiceController(viewer) {
  const SpeechRecognition = window.SpeechRecognition || window.webkitSpeechRecognition;
  const btnVoice = document.getElementById('btnToolVoice');

  if (!toastEl) {
    toastEl = document.createElement('div');
    toastEl.className = 'voice-toast';
    toastEl.id = 'voiceToast';
    document.getElementById('viewerContainer')?.appendChild(toastEl);
  }

  if (!SpeechRecognition) {
    console.warn('[VoiceAI] Web Speech API not supported on this browser');
    btnVoice?.addEventListener('click', () => {
      showVoiceToast('⚠️ Trình duyệt chưa hỗ trợ Web Speech API', 2500);
    });
    return;
  }

  try {
    recognition = new SpeechRecognition();
    recognition.lang = 'vi-VN';
    recognition.continuous = false;
    recognition.interimResults = false;
    recognition.maxAlternatives = 3;

    recognition.onstart = () => {
      isListening = true;
      btnVoice?.classList.add('listening');
      showVoiceToast('🎙️ Đang nghe... Hãy nói lệnh', 3000);
    };

    recognition.onend = () => {
      isListening = false;
      btnVoice?.classList.remove('listening');
    };

    recognition.onerror = (event) => {
      console.warn('[VoiceAI] Speech error:', event.error);
      isListening = false;
      btnVoice?.classList.remove('listening');
      if (event.error === 'not-allowed') {
        showVoiceToast('⚠️ Vui lòng cấp quyền Micro trong cài đặt', 2500);
      }
    };

    recognition.onresult = (event) => {
      const results = event.results;
      if (!results || !results[0] || !results[0][0]) return;

      const transcript = results[0][0].transcript.trim().toLowerCase();
      console.log('[VoiceAI] Heard:', transcript);
      executeVoiceCommand(transcript, viewer);
    };

    btnVoice?.addEventListener('click', () => {
      if (isListening) {
        stopVoiceListening();
      } else {
        startVoiceListening();
      }
    });

  } catch (err) {
    console.error('[VoiceAI] Init error:', err);
  }
}

export function startVoiceListening() {
  if (recognition && !isListening) {
    try {
      recognition.start();
    } catch (e) {
      console.warn('[VoiceAI] Start error:', e);
    }
  }
}

export function stopVoiceListening() {
  if (recognition && isListening) {
    try {
      recognition.stop();
    } catch (e) {
      console.warn('[VoiceAI] Stop error:', e);
    }
  }
}

function showVoiceToast(text, duration = 2000) {
  if (!toastEl) return;
  toastEl.textContent = text;
  toastEl.classList.add('show');
  
  if (toastTimeout) clearTimeout(toastTimeout);
  toastTimeout = setTimeout(() => {
    toastEl.classList.remove('show');
  }, duration);
}

function executeVoiceCommand(text, viewer) {
  // Normalize text
  const clean = text.toLowerCase().normalize('NFD').replace(/[\u0300-\u036f]/g, '').trim();

  // 0. ANATOMICAL SEARCH / PINPOINT PRIORITY
  // If the command is a query, question, or references anatomical structures/diseases,
  // execute 3D search & pinpointing directly without getting intercepted by animation triggers.
  const hasSearchIntent = /^(tìm|hãy tìm|chỉ|hãy chỉ|xem|cho xem|vị trí|ở đâu|đâu|khám phá|mở|bật)\b/i.test(text) ||
                          /\b(hệ|he|tiêu hóa|tuan hoan|tuần hoàn|thần kinh|hô hấp|tiết niệu|đĩa đệm|dây chằng|ruột thừa|cơ delta|thoát vị|khớp|xương|động mạch|tĩnh mạch|não|phổi|gan|thận|dạ dày|tim mạch|bàng quang|cột sống|sụn chêm|tủy sống)\b/i.test(text);

  if (hasSearchIntent) {
    handleCompactAISubmit(text, viewer);
    return;
  }

  // 1. CHUYỂN ĐỘNG TIM / TUẦN HOÀN (Chỉ khi nói rõ chuyển động nhịp tim)
  if (/\b(nhịp tim|nhip tim|co bóp tim|đập tim|tâm thu|tâm trương|mô phỏng tim)\b/i.test(text) || clean === 'tim' || clean === 'trai tim') {
    dynamicAnatomy.setMotion(MOTIONS.CARDIAC);
    openMotionPanel(viewer, MOTIONS.CARDIAC);
    // Auto minimize to reveal full 3D heartbeat
    setTimeout(() => minimizeMotionPanel(), 200);
    showVoiceToast('🫀 "Nhịp Tim 3D" · Đang chạy', 2200);
    return;
  }

  // 2. CHUYỂN ĐỘNG HÔ HẤP / LỒNG NGỰC (Chỉ khi nói rõ cử động thở/hô hấp)
  if (/\b(hô hấp|ho hap|hít thở|hit tho|cử động thở|cu dong tho|nhịp thở|nhip tho)\b/i.test(text) || clean === 'tho' || clean === 'hit tho') {
    dynamicAnatomy.setMotion(MOTIONS.RESPIRATORY);
    openMotionPanel(viewer, MOTIONS.RESPIRATORY);
    setTimeout(() => minimizeMotionPanel(), 200);
    showVoiceToast('🫁 "Cử Động Hô Hấp" · Đang chạy', 2200);
    return;
  }

  // 3. CHUYỂN ĐỘNG NHAI / HÀM
  if (/\b(cử động nhai|cu dong nhai|nhai thức ăn|khớp cắn)\b/i.test(text) || clean === 'nhai') {
    dynamicAnatomy.setMotion(MOTIONS.MASTICATION);
    openMotionPanel(viewer, MOTIONS.MASTICATION);
    setTimeout(() => minimizeMotionPanel(), 200);
    showVoiceToast('🦷 "Cử Động Nhai" · Đang chạy', 2200);
    return;
  }

  // 4. CHUYỂN ĐỘNG CO DUỠI GỐI
  if (/\b(co duỗi gối|co duoi goi|chuyển động gối|chuyen dong goi|uốn gối)\b/i.test(text) || clean === 'co duoi goi') {
    dynamicAnatomy.setMotion(MOTIONS.KNEE_FLEXION);
    openMotionPanel(viewer, MOTIONS.KNEE_FLEXION);
    setTimeout(() => minimizeMotionPanel(), 200);
    showVoiceToast('🦵 "Co Duỗi Gối" · Đang chạy', 2200);
    return;
  }

  // 5. ĐIỀU KHIỂN PLAY / PAUSE / DỪNG
  if (/\b(tạm dừng|tam dung|dừng lại|dung lai|pause)\b/i.test(text) || clean === 'dung' || clean === 'stop') {
    dynamicAnatomy.pause();
    showVoiceToast('⏸️ "Đã tạm dừng chuyển động"', 1800);
    return;
  }

  if (/\b(tiếp tục|tiep tuc|chạy tiếp|chay tiep|phát tiếp|play)\b/i.test(text) || clean === 'chay' || clean === 'play') {
    dynamicAnatomy.play();
    minimizeMotionPanel();
    showVoiceToast('▶️ "Đang tiếp tục chuyển động"', 1800);
    return;
  }

  if (/\b(tắt chuyển động|tat chuyen dong|đóng chuyển động|dong chuyen dong)\b/i.test(text) || clean === 'tat') {
    closeMotionPanel();
    showVoiceToast('✕ "Đã tắt chuyển động"', 1800);
    return;
  }

  // 6. GÓC NHÌN CAMERA
  if (/\b(nhìn trước|phía trước|mat truoc|nhin truoc)\b/i.test(text) || clean === 'truoc') {
    document.getElementById('frontViewBtn')?.click();
    showVoiceToast('👁️ "Góc nhìn phía trước"', 1800);
    return;
  }

  if (/\b(nhìn sau|phía sau|mat sau|nhin sau)\b/i.test(text) || clean === 'sau') {
    document.getElementById('backViewBtn')?.click();
    showVoiceToast('🔄 "Góc nhìn phía sau"', 1800);
    return;
  }

  if (/\b(nhìn nghiêng|nhìn bên|goc nghieng)\b/i.test(text) || clean === 'nghieng') {
    document.getElementById('sideViewBtn')?.click();
    showVoiceToast('📐 "Góc nhìn nghiêng"', 1800);
    return;
  }

  if (/\b(nhìn trên|từ trên xuống|nhin tren)\b/i.test(text) || clean === 'tren') {
    document.getElementById('topViewBtn')?.click();
    showVoiceToast('⬇️ "Góc nhìn từ trên"', 1800);
    return;
  }

  if (/\b(đặt lại|khoi phuc|dat lai|reset)\b/i.test(text)) {
    document.getElementById('resetBtn')?.click();
    showVoiceToast('↺ "Đã đặt lại góc nhìn"', 1800);
    return;
  }

  // 7. ANATOMICAL 3D SEARCH & AI DISCOVERY (Dịch não tủy, Túi mật, Tuyến tụy, Khung chậu...)
  handleCompactAISubmit(text, viewer);
}
