// Voice AI Controller for Hands-Free Anatomy 3D Navigation
// Utilizes Web Speech API (SpeechRecognition / webkitSpeechRecognition)
// Native Vietnamese (vi-VN) Voice Commands without server costs or lag.

import { dynamicAnatomy, MOTIONS } from '../viewer/dynamicAnatomy.js';
import { openMotionPanel, minimizeMotionPanel, closeMotionPanel } from '../ui/motionPanel.js';

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
  const clean = text.toLowerCase().normalize('NFD').replace(/[\u0300-\u036f]/g, ''); // unaccented for flexible matching

  // 1. CHUYỂN ĐỘNG TIM / TUẦN HOÀN
  if (text.includes('tim') || clean.includes('tim') || text.includes('tam thu') || text.includes('tam truong')) {
    dynamicAnatomy.setMotion(MOTIONS.CARDIAC);
    openMotionPanel(viewer, MOTIONS.CARDIAC);
    // Auto minimize to reveal full 3D heartbeat
    setTimeout(() => minimizeMotionPanel(), 200);
    showVoiceToast('🫀 "Nhịp Tim 3D" · Đang chạy', 2200);
    return;
  }

  // 2. CHUYỂN ĐỘNG HÔ HẤP / PHỔI / LỒNG NGỰC
  if (text.includes('tho') || clean.includes('tho') || text.includes('ho hap') || text.includes('phoi') || clean.includes('phoi')) {
    dynamicAnatomy.setMotion(MOTIONS.RESPIRATORY);
    openMotionPanel(viewer, MOTIONS.RESPIRATORY);
    setTimeout(() => minimizeMotionPanel(), 200);
    showVoiceToast('🫁 "Cử Động Hô Hấp" · Đang chạy', 2200);
    return;
  }

  // 3. CHUYỂN ĐỘNG NHAI / HÀM
  if (text.includes('nhai') || clean.includes('nhai') || text.includes('ham') || clean.includes('ham')) {
    dynamicAnatomy.setMotion(MOTIONS.MASTICATION);
    openMotionPanel(viewer, MOTIONS.MASTICATION);
    setTimeout(() => minimizeMotionPanel(), 200);
    showVoiceToast('🦷 "Cử Động Nhai" · Đang chạy', 2200);
    return;
  }

  // 4. CHUYỂN ĐỘNG GỐI
  if (text.includes('goi') || clean.includes('goi') || text.includes('chan') || clean.includes('chan')) {
    dynamicAnatomy.setMotion(MOTIONS.KNEE_FLEXION);
    openMotionPanel(viewer, MOTIONS.KNEE_FLEXION);
    setTimeout(() => minimizeMotionPanel(), 200);
    showVoiceToast('🦵 "Co Duỗi Gối" · Đang chạy', 2200);
    return;
  }

  // 5. ĐIỀU KHIỂN PLAY / PAUSE / DỪNG
  if (text.includes('dung') || text.includes('tam dung') || clean.includes('dung') || clean.includes('pause')) {
    dynamicAnatomy.pause();
    showVoiceToast('⏸️ "Đã tạm dừng chuyển động"', 1800);
    return;
  }

  if (text.includes('chay') || text.includes('tiep tuc') || clean.includes('chay') || clean.includes('play')) {
    dynamicAnatomy.play();
    minimizeMotionPanel();
    showVoiceToast('▶️ "Đang tiếp tục chuyển động"', 1800);
    return;
  }

  if (text.includes('tat') || clean.includes('tat') || text.includes('dong') || clean.includes('dong')) {
    closeMotionPanel();
    showVoiceToast('✕ "Đã tắt chuyển động"', 1800);
    return;
  }

  // 6. GÓC NHÌN CAMERA
  if (text.includes('truoc') || clean.includes('truoc')) {
    document.getElementById('frontViewBtn')?.click();
    showVoiceToast('👁️ "Góc nhìn phía trước"', 1800);
    return;
  }

  if (text.includes('sau') || clean.includes('sau')) {
    document.getElementById('backViewBtn')?.click();
    showVoiceToast('🔄 "Góc nhìn phía sau"', 1800);
    return;
  }

  if (text.includes('nghieng') || clean.includes('nghieng') || text.includes('ben')) {
    document.getElementById('sideViewBtn')?.click();
    showVoiceToast('📐 "Góc nhìn nghiêng"', 1800);
    return;
  }

  if (text.includes('tren') || clean.includes('tren')) {
    document.getElementById('topViewBtn')?.click();
    showVoiceToast('⬇️ "Góc nhìn từ trên"', 1800);
    return;
  }

  if (text.includes('dat lai') || text.includes('khoi phuc') || clean.includes('dat lai') || clean.includes('reset')) {
    document.getElementById('resetBtn')?.click();
    showVoiceToast('↺ "Đã đặt lại góc nhìn"', 1800);
    return;
  }

  // Fallback unrecognized
  showVoiceToast(`🎙️ "${text}" (Chưa rõ lệnh)`, 2000);
}
