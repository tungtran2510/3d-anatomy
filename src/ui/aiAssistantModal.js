// Compact Transparent AI Bar & Voice/Text Co-pilot
// Designed for zero obstruction: 1-line transparent glass bar & 1-2 line transparent HUD response
import { state } from '../state/store.js';
import { interpretAIQuery, executeAICommand } from '../ai/anatomyAI.js';
import { selectPartById } from '../viewer/selection.js';

let aiBarEl = null;
let aiToastEl = null;
let recognition = null;
let isRecording = false;
let toastTimeout = null;
let autoSubmitTimer = null;

export function initAIAssistantUI(viewer) {
  if (aiBarEl) return;

  const container = document.getElementById('viewerContainer') || document.body;

  // 1. Create Spacious & Touch-friendly Transparent AI Bar with Prominent Voice Mic
  aiBarEl = document.createElement('div');
  aiBarEl.id = 'compactAIBar';
  aiBarEl.className = 'compact-ai-bar hidden';
  aiBarEl.innerHTML = `
    <input type="text" class="input-ai-cmd" id="inputAIQuickCmd" placeholder="Nói hoặc nhập câu hỏi (VD: trục não ruột, tìm gan, xương chậu...)" autocomplete="off">
    <button type="button" class="btn-ai-mic" id="btnAIQuickMic" title="Chạm để nói câu hỏi bằng giọng nói">
      <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.2"><path d="M12 2a3 3 0 0 0-3 3v7a3 3 0 0 0 6 0V5a3 3 0 0 0-3-3Z"/><path d="M19 10v2a7 7 0 0 1-14 0v-2"/><line x1="12" y1="19" x2="12" y2="22"/></svg>
    </button>
    <button type="button" class="btn-ai-send" id="btnAIQuickSend" title="Gửi câu hỏi cho AI">
      <svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path d="M22 2L11 13M22 2l-7 20-4-9-9-4 20-7z"/></svg>
    </button>
    <button type="button" class="btn-ai-close" id="btnAIQuickClose" title="Thu gọn">&times;</button>
  `;
  container.appendChild(aiBarEl);

  // 2. Create Transparent Floating HUD Toast (1-2 lines for AI response)
  aiToastEl = document.createElement('div');
  aiToastEl.id = 'aiTransparentToast';
  aiToastEl.className = 'ai-transparent-toast hidden';
  aiToastEl.innerHTML = `
    <span class="ai-toast-badge" id="aiToastBadge">🎯</span>
    <span class="ai-toast-text" id="aiToastText">Đang xử lý...</span>
    <button type="button" class="ai-toast-close" id="aiToastClose" title="Đóng">&times;</button>
  `;
  container.appendChild(aiToastEl);

  // Setup event listeners
  setupBarEvents(viewer);
  setupSpeechRecognition(viewer);
}

function setupBarEvents(viewer) {
  const inputEl = aiBarEl.querySelector('#inputAIQuickCmd');
  const sendBtn = aiBarEl.querySelector('#btnAIQuickSend');
  const closeBtn = aiBarEl.querySelector('#btnAIQuickClose');
  const micBtn = aiBarEl.querySelector('#btnAIQuickMic');
  const toastClose = aiToastEl.querySelector('#aiToastClose');

  const submitQuery = () => {
    if (autoSubmitTimer) {
      clearTimeout(autoSubmitTimer);
      autoSubmitTimer = null;
    }
    const q = inputEl.value.trim();
    if (q) {
      handleCompactAISubmit(q, viewer);
      inputEl.value = '';
      sendBtn?.classList.remove('has-text');
      closeAIAssistant(); // Auto minimize bar after submit to reveal 3D view
    }
  };

  sendBtn?.addEventListener('click', submitQuery);
  inputEl?.addEventListener('keydown', (e) => {
    if (e.key === 'Enter') {
      submitQuery();
    }
  });

  inputEl?.addEventListener('input', () => {
    if (inputEl.value.trim().length > 0) {
      sendBtn?.classList.add('has-text');
    } else {
      sendBtn?.classList.remove('has-text');
    }
  });

  closeBtn?.addEventListener('click', () => {
    closeAIAssistant();
  });

  micBtn?.addEventListener('click', () => {
    toggleVoiceRecording(viewer);
  });

  toastClose?.addEventListener('click', () => {
    hideAIToast();
  });

  aiToastEl?.addEventListener('click', () => {
    hideAIToast();
  });
}

function createSpeechRecognition(viewer) {
  const SpeechRecognition = typeof window !== 'undefined' ? (window.SpeechRecognition || window.webkitSpeechRecognition) : null;
  if (!SpeechRecognition) return null;

  try {
    const rec = new SpeechRecognition();
    rec.lang = 'vi-VN';
    rec.continuous = false;
    rec.interimResults = true; // HIỆN THỰC THỜI GIAN THỰC LỜI NÓI LÊN Ô CHAT KHI ĐANG NÓI

    rec.onresult = (event) => {
      let interimTranscript = '';
      let finalTranscript = '';

      for (let i = event.resultIndex; i < event.results.length; ++i) {
        const item = event.results[i];
        if (item.isFinal) {
          finalTranscript += item[0].transcript;
        } else {
          interimTranscript += item[0].transcript;
        }
      }

      const activeText = (finalTranscript || interimTranscript).trim();
      const inputEl = aiBarEl?.querySelector('#inputAIQuickCmd');
      const sendBtn = aiBarEl?.querySelector('#btnAIQuickSend');

      // 1. GÁN TRỰC TIẾP LỜI NÓI VÀO KHUNG CHAT
      if (inputEl && activeText) {
        inputEl.value = activeText;
        sendBtn?.classList.add('has-text');
      }

      if (activeText) {
        showAIToast(`🎙️ "${activeText}"`, false);
      }

      // 2. KHI NÓI XONG CÂU HOÀN CHỈNH
      if (finalTranscript) {
        stopVoiceRecording();

        if (autoSubmitTimer) clearTimeout(autoSubmitTimer);
        // Chờ 1.2 giây để người dùng nhìn thấy câu hỏi đã hiện lên khung chat, sau đó tự động gửi
        autoSubmitTimer = setTimeout(() => {
          if (inputEl && inputEl.value.trim() === finalTranscript.trim()) {
            handleCompactAISubmit(finalTranscript.trim(), viewer);
            inputEl.value = '';
            sendBtn?.classList.remove('has-text');
            closeAIAssistant();
          }
        }, 1200);
      }
    };

    rec.onerror = (e) => {
      console.warn('SpeechRecognition error:', e);
      stopVoiceRecording();
      if (e.error === 'not-allowed') {
        showAIToast('⚠️ Cần cấp quyền Microphone trong trình duyệt để nói', true);
      } else if (e.error !== 'no-speech') {
        showAIToast('⚠️ Không nhận diện được âm thanh, hãy thử nói lại', true);
      }
    };

    rec.onend = () => {
      stopVoiceRecording();
    };

    return rec;
  } catch (err) {
    console.error('Speech recognition init error:', err);
    return null;
  }
}

function setupSpeechRecognition(viewer) {
  recognition = createSpeechRecognition(viewer);
}

function toggleVoiceRecording(viewer) {
  if (isRecording) {
    try { recognition?.stop(); } catch {}
    stopVoiceRecording();
  } else {
    try {
      if (!recognition) {
        recognition = createSpeechRecognition(viewer);
      }
      if (!recognition) {
        showAIToast('⚠️ Trình duyệt chưa hỗ trợ nhận dạng giọng nói tiếng Việt', true);
        return;
      }
      recognition.start();
      isRecording = true;
      const micBtn = aiBarEl?.querySelector('#btnAIQuickMic');
      micBtn?.classList.add('recording');
      showAIToast('🎙️ Đang lắng nghe... Hãy nói câu hỏi hoặc lệnh', false);
    } catch {
      stopVoiceRecording();
    }
  }
}

function stopVoiceRecording() {
  isRecording = false;
  const micBtn = aiBarEl?.querySelector('#btnAIQuickMic');
  micBtn?.classList.remove('recording');
}

export function openAIAssistant(viewer, initialPrompt = null) {
  if (!aiBarEl) initAIAssistantUI(viewer);

  aiBarEl.classList.remove('hidden');
  document.getElementById('floatingAIBubble')?.classList.add('ai-bar-active');

  const inputEl = aiBarEl.querySelector('#inputAIQuickCmd');
  if (inputEl) {
    inputEl.focus();
  }

  if (initialPrompt) {
    if (inputEl) inputEl.value = initialPrompt;
    handleCompactAISubmit(initialPrompt, viewer);
    closeAIAssistant();
  }
}

export function closeAIAssistant() {
  if (aiBarEl) {
    aiBarEl.classList.add('hidden');
    document.getElementById('floatingAIBubble')?.classList.remove('ai-bar-active');
    stopVoiceRecording();
    if (autoSubmitTimer) {
      clearTimeout(autoSubmitTimer);
      autoSubmitTimer = null;
    }
  }
}

export function toggleAIAssistant(viewer) {
  if (!aiBarEl) initAIAssistantUI(viewer);
  if (aiBarEl.classList.contains('hidden')) {
    openAIAssistant(viewer);
  } else {
    closeAIAssistant();
  }
}

export async function handleCompactAISubmit(text, viewer) {
  showAIToast(`Đang tìm kiếm & điều khiển 3D: "${text}"...`, false);

  // Kiểm tra nếu câu lệnh hỏi về Trục lâm sàng (e.g. "trục não ruột", "gan mật tụy")
  const lower = text.toLowerCase();
  if (lower.includes('trục') || lower.includes('truc') || lower.includes('gan mật') || lower.includes('não ruột')) {
    try {
      const { openClinicalAxesModal } = await import('./clinicalAxesModal.js');
      if (lower.includes('gan') || lower.includes('mật') || lower.includes('tụy')) {
        await openClinicalAxesModal('axis_hepatobiliary_pancreas', viewer);
      } else {
        await openClinicalAxesModal('axis_gut_brain', viewer);
      }
      showAIToast(`🧬 Đã kích hoạt hiển thị trực quan toàn bộ trục 3D!`, true);
      return;
    } catch {}
  }

  const interpreted = interpretAIQuery(text, state.selectedPart);

  try {
    const result = await executeAICommand(interpreted, viewer);
    const badgeText = result.actionBadge || `Đã xử lý: ${text}`;
    
    // Transparent 1-2 line response
    showAIToast(badgeText, true);

    // Speak response if voice synthesis is supported
    if (result.speechText && 'speechSynthesis' in window) {
      try {
        const u = new SpeechSynthesisUtterance(result.speechText);
        u.lang = 'vi-VN';
        u.rate = 1.05;
        window.speechSynthesis.speak(u);
      } catch {}
    }
  } catch (err) {
    showAIToast(`Không tìm thấy "${text}". Vui lòng thử lại!`, true);
  }
}

export function showAIToast(message, autoHide = true) {
  if (!aiToastEl) return;

  const textEl = aiToastEl.querySelector('#aiToastText');
  if (textEl) textEl.textContent = message;

  if (aiBarEl && !aiBarEl.classList.contains('hidden')) {
    aiToastEl.classList.add('has-bar');
  } else {
    aiToastEl.classList.remove('has-bar');
  }

  aiToastEl.classList.remove('hidden');

  if (toastTimeout) clearTimeout(toastTimeout);

  if (autoHide) {
    toastTimeout = setTimeout(() => {
      hideAIToast();
    }, 4500);
  }
}

export function hideAIToast() {
  if (aiToastEl) {
    aiToastEl.classList.add('hidden');
  }
  if (toastTimeout) {
    clearTimeout(toastTimeout);
    toastTimeout = null;
  }
}
