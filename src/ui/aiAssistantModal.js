// Compact Transparent AI Bar & Voice/Text Co-pilot
// Designed for zero obstruction: 1-line transparent glass bar & 1-2 line transparent HUD response
import { state } from '../state/store.js';
import { interpretAIQuery, executeAICommand } from '../ai/anatomyAI.js';
import { selectPartById } from '../viewer/selection.js';
import { searchStructures } from '../utils/dataLoader.js';
import { selectStructureAnywhere } from './sidebar.js';

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
    <input type="text" class="input-ai-cmd" id="inputAIQuickCmd" placeholder="Hỏi AI hoặc chạm Micro để nói..." autocomplete="off">
    <button type="button" class="btn-ai-mic" id="btnAIQuickMic" title="Chạm để nói câu hỏi bằng giọng nói">
      <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.2"><path d="M12 2a3 3 0 0 0-3 3v7a3 3 0 0 0 6 0V5a3 3 0 0 0-3-3Z"/><path d="M19 10v2a7 7 0 0 1-14 0v-2"/><line x1="12" y1="19" x2="12" y2="22"/></svg>
    </button>
    <button type="button" class="btn-ai-send" id="btnAIQuickSend" title="Gửi câu hỏi cho AI">
      <svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path d="M22 2L11 13M22 2l-7 20-4-9-9-4 20-7z"/></svg>
    </button>
    <button type="button" class="btn-ai-close" id="btnAIQuickClose" title="Thu gọn">&times;</button>
  `;
  container.appendChild(aiBarEl);

  // 2. Create Frameless Subtle Whisper Text (No container, no badges, zero obstruction)
  aiToastEl = document.createElement('div');
  aiToastEl.id = 'aiTransparentToast';
  aiToastEl.className = 'ai-transparent-toast hidden';
  aiToastEl.innerHTML = `
    <span class="ai-toast-text" id="aiToastText">Đang xử lý...</span>
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

  // Khi người dùng bấm vào ô nhập hoặc gõ phím -> Tự động dừng ghi âm để người dùng gõ phím
  const cancelVoiceOnTyping = () => {
    if (isRecording) {
      try { recognition?.stop(); } catch {}
      stopVoiceRecording();
    }
  };
  inputEl?.addEventListener('focus', cancelVoiceOnTyping);
  inputEl?.addEventListener('pointerdown', cancelVoiceOnTyping);
  inputEl?.addEventListener('keydown', (e) => {
    if (e.key === 'Enter') {
      submitQuery();
    } else {
      cancelVoiceOnTyping();
    }
  });

  inputEl?.addEventListener('input', () => {
    cancelVoiceOnTyping();
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
    sessionStorage.removeItem('mic_perm_denied');
    sessionStorage.removeItem('mic_perm_notified');
    toggleVoiceRecording(viewer);
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

      // 1. GÁN TRỰC TIẾP LỜI NÓI VÀO KHUNG CHAT ĐỂ NGƯỜI DÙNG THẤY NGAY
      if (inputEl && activeText) {
        inputEl.value = activeText;
        sendBtn?.classList.add('has-text');
      }

      // 2. KHI NÓI XONG CÂU HOÀN CHỈNH
      if (finalTranscript) {
        stopVoiceRecording();

        if (autoSubmitTimer) clearTimeout(autoSubmitTimer);
        // Chờ 1.2 giây để người dùng nhìn thấy câu hỏi đã hiện lên khung chat, sau đó tự động gửi
        autoSubmitTimer = setTimeout(() => {
          if (inputEl) {
            const queryToSend = inputEl.value.trim() || finalTranscript.trim();
            if (queryToSend) {
              handleCompactAISubmit(queryToSend, viewer);
              inputEl.value = '';
              sendBtn?.classList.remove('has-text');
              closeAIAssistant();
            }
          }
        }, 1200);
      }
    };

    rec.onerror = (e) => {
      console.warn('SpeechRecognition error:', e);
      stopVoiceRecording();
      if (e.error === 'not-allowed') {
        sessionStorage.setItem('mic_perm_denied', 'true');
        // Chỉ thông báo 1 lần duy nhất, tuyệt đối không lặp lại gây phiền toái
        const alreadyNotified = sessionStorage.getItem('mic_perm_notified');
        if (!alreadyNotified) {
          sessionStorage.setItem('mic_perm_notified', 'true');
          showAIToast('Cần cấp quyền micro trong trình duyệt để nói', true);
        }
      } else if (e.error !== 'no-speech') {
        const alreadyNotifiedSpeech = sessionStorage.getItem('speech_err_notified');
        if (!alreadyNotifiedSpeech) {
          sessionStorage.setItem('speech_err_notified', 'true');
          showAIToast('Không nhận được âm thanh, hãy nói lại', true);
        }
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

export function startVoiceRecording(viewer) {
  if (isRecording) return;
  isRecording = true;
  const micBtn = aiBarEl?.querySelector('#btnAIQuickMic');
  const inputEl = aiBarEl?.querySelector('#inputAIQuickCmd');
  micBtn?.classList.add('recording');
  if (inputEl) {
    inputEl.placeholder = '🎙️ Đang nghe... Hãy nói ngay (Chạm ô để gõ)';
    inputEl.classList.add('listening');
  }

  try {
    if (!recognition) {
      recognition = createSpeechRecognition(viewer);
    }
    if (recognition) {
      recognition.start();
    }
  } catch (err) {
    console.warn('[AI voice start]:', err);
  }
}

function toggleVoiceRecording(viewer) {
  if (isRecording) {
    try { recognition?.stop(); } catch {}
    stopVoiceRecording();
  } else {
    startVoiceRecording(viewer);
  }
}

function stopVoiceRecording() {
  isRecording = false;
  const micBtn = aiBarEl?.querySelector('#btnAIQuickMic');
  const inputEl = aiBarEl?.querySelector('#inputAIQuickCmd');
  micBtn?.classList.remove('recording');
  if (inputEl) {
    inputEl.placeholder = 'Hỏi AI hoặc chạm Micro để nói...';
    inputEl.classList.remove('listening');
  }
}

export function openAIAssistant(viewer, initialPrompt = null, autoStartVoice = true) {
  if (!aiBarEl) initAIAssistantUI(viewer);

  aiBarEl.classList.remove('hidden');
  document.getElementById('floatingAIBubble')?.classList.add('ai-bar-active');

  const inputEl = aiBarEl.querySelector('#inputAIQuickCmd');

  if (initialPrompt) {
    if (inputEl) inputEl.value = initialPrompt;
    handleCompactAISubmit(initialPrompt, viewer);
    closeAIAssistant();
    return;
  }

  // Tự động nhảy vào ghi âm ngay lập tức nếu chưa bị từ chối; nếu đã từ chối thì focus ô gõ, không hỏi lại
  const micDenied = sessionStorage.getItem('mic_perm_denied');
  if (autoStartVoice && !micDenied) {
    startVoiceRecording(viewer);
  } else if (inputEl) {
    inputEl.focus();
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

  // Kiểm tra nếu câu lệnh hỏi về Trục lâm sàng (e.g. "trục não ruột", "chục lão chuột", "gan mật tụy", "bộ ba chức năng", "tuyến tiêu hóa", "dịch não tủy")
  const lower = text.toLowerCase();
  try {
    const { CLINICAL_AXES } = await import('../data/clinicalAxesData.js');

    // 1. Nhận diện các biến thể giọng nói & từ khóa chuyên sâu
    let targetAxisId = null;
    if (
      lower.includes('chục lão chuột') ||
      lower.includes('chuc lao chuot') ||
      lower.includes('chụp não ruột') ||
      lower.includes('chup nao ruot') ||
      lower.includes('chục não ruột') ||
      lower.includes('chuc nao ruot') ||
      lower.includes('chục não') ||
      lower.includes('trục não ruột') ||
      lower.includes('trục ruột não') ||
      lower.includes('não ruột')
    ) {
      targetAxisId = 'axis_gut_brain';
    } else if (
      lower.includes('gan mật tụy') ||
      lower.includes('gân mà tự') ||
      lower.includes('gan mat tuy') ||
      lower.includes('bộ ba chức năng') ||
      lower.includes('bo ba chuc nang') ||
      lower.includes('bộ ba gan mật tụy') ||
      lower.includes('bo ba gan mat tuy') ||
      lower.includes('bộ ba') ||
      lower.includes('bộ 3') ||
      lower.includes('hệ gan mật') ||
      lower.includes('gan mật và tụy')
    ) {
      targetAxisId = 'axis_hepatobiliary_pancreas';
    } else if (
      lower.includes('tuyến tiêu hóa') ||
      lower.includes('tuyen tieu hoa') ||
      lower.includes('các tuyến tiêu hóa') ||
      lower.includes('hệ tuyến tiêu hóa') ||
      lower.includes('tuyến nước bọt')
    ) {
      targetAxisId = 'axis_digestive_glands';
    } else if (
      lower.includes('dịch não tủy') ||
      lower.includes('dich nao tuy') ||
      lower.includes('nước não tủy') ||
      lower.includes('tuần hoàn dịch não tủy') ||
      lower.includes('hệ thống não thất') ||
      lower.includes('não thất') ||
      lower.includes('não úng thủy')
    ) {
      targetAxisId = 'axis_csf_ventricles';
    } else if (
      lower.includes('nội tiết') ||
      lower.includes('noi tiet') ||
      lower.includes('tuyến yên') ||
      lower.includes('tuyen yen') ||
      lower.includes('tuyến giáp') ||
      lower.includes('tuyen giap') ||
      lower.includes('thượng thận') ||
      lower.includes('thuong than') ||
      lower.includes('tuyến cận giáp') ||
      lower.includes('dưới đồi') ||
      lower.includes('duoi doi') ||
      lower.includes('tuyến tùng') ||
      lower.includes('hpa') ||
      lower.includes('trục nội tiết')
    ) {
      targetAxisId = 'axis_hpa_endocrine';
    } else if (
      lower.includes('tim thận') ||
      lower.includes('tim than') ||
      lower.includes('trục tim thận') ||
      lower.includes('thận tim') ||
      lower.includes('huyết áp') ||
      lower.includes('huyet ap') ||
      lower.includes('raas') ||
      lower.includes('điều hòa huyết áp') ||
      lower.includes('dieu hoa huyet ap')
    ) {
      targetAxisId = 'axis_renal_cardiovascular';
    } else {
      const matched = CLINICAL_AXES.find(axis => {
        return axis.keywords.some(k => lower.includes(k.toLowerCase()));
      });
      if (matched) targetAxisId = matched.id;
    }

    if (targetAxisId) {
      const matchedAxis = CLINICAL_AXES.find(a => a.id === targetAxisId);
      const { openClinicalAxesModal, openMechanismSheet } = await import('./clinicalAxesModal.js');
      await openClinicalAxesModal(targetAxisId, viewer);

      // Tự động mở Bottom Sheet cơ chế nếu câu hỏi nhắc đến "cơ chế", "giải thích", "chức năng", "bộ ba", "tại sao" hoặc "ai"
      const needsMechanism =
        lower.includes('cơ chế') ||
        lower.includes('giải thích') ||
        lower.includes('chức năng') ||
        lower.includes('tại sao') ||
        lower.includes('như thế nào') ||
        lower.includes('bộ ba') ||
        lower.includes('đầy đủ') ||
        lower.includes('ai') ||
        lower.includes('hỏi về');

      if (needsMechanism) {
        openMechanismSheet();
      }

      const axisName = matchedAxis ? matchedAxis.titleVi.split('(')[0].trim() : 'Trục Lâm Sàng';
      showAIToast(`🎯 Đã kích hoạt 3D & cơ chế: ${axisName}!`, true);

      // Đọc tóm tắt cơ chế qua giọng nói nếu có hỗ trợ
      if (matchedAxis && 'speechSynthesis' in window) {
        try {
          const u = new SpeechSynthesisUtterance(`${matchedAxis.titleVi}. ${matchedAxis.summary}`);
          u.lang = 'vi-VN';
          u.rate = 1.0;
          window.speechSynthesis.speak(u);
        } catch {}
      }
      return;
    }
  } catch (err) {
    console.warn('[Clinical Axis AI match error]:', err);
  }

  let interpreted = interpretAIQuery(text, state.selectedPart);

  // If interpreted has no target and no axis, perform an immediate direct search fallback
  if (!interpreted.target && !interpreted.axis && interpreted.intent !== 'SYSTEM_CONTROL') {
    const matches = searchStructures(text);
    if (matches.length > 0) {
      const top = matches[0];
      const targetPartId = top.sides?.none || top.sides?.left || top.sides?.right || (top.partIds && top.partIds[0]) || top.base;
      interpreted = {
        intent: 'FOCUS_STRUCTURE',
        target: {
          id: targetPartId,
          base: top.base,
          system: top.system,
          nameVi: top.label || top.base
        },
        rawQuery: text
      };
    }
  }

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
    console.warn('[AI Command Execution Error]:', err);
    // Secondary fallback: if executeAICommand somehow failed, attempt selectStructureAnywhere directly
    const directMatches = searchStructures(text);
    if (directMatches.length > 0) {
      const top = directMatches[0];
      const targetPartId = top.sides?.none || top.sides?.left || top.sides?.right || (top.partIds && top.partIds[0]) || top.base;
      await selectStructureAnywhere(targetPartId);
      showAIToast(`🎯 AI đã định vị & làm nổi bật: ${top.label || top.base}`, true);
      return;
    }
    showAIToast(`Không tìm thấy "${text}". Vui lòng thử lại!`, true);
  }
}

export function showAIToast(message, autoHide = true) {
  if (!aiToastEl) return;

  // Lọc sạch toàn bộ emoji / biểu tượng theo yêu cầu: "không có biểu tượng gì hết"
  const cleanMsg = typeof message === 'string'
    ? message.replace(/^[\s\u{1F300}-\u{1F9FF}\u{2600}-\u{26FF}\u{2700}-\u{27BF}🎯⚠️💡🧬🎙️✅❌]+\s*/u, '')
    : message;

  const textEl = aiToastEl.querySelector('#aiToastText');
  if (textEl) textEl.textContent = cleanMsg;

  if (aiBarEl && !aiBarEl.classList.contains('hidden')) {
    aiToastEl.classList.add('has-bar');
  } else {
    aiToastEl.classList.remove('has-bar');
  }

  aiToastEl.classList.remove('hidden');

  if (toastTimeout) clearTimeout(toastTimeout);

  if (autoHide) {
    // Thoát nhanh, nhẹ nhàng theo yêu cầu người dùng
    toastTimeout = setTimeout(() => {
      hideAIToast();
    }, 2200);
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
