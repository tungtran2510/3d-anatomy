// AI Assistant Modal & Interactive Natural Language 3D Copilot
import { state } from '../state/store.js';
import { interpretAIQuery, executeAICommand } from '../ai/anatomyAI.js';
import { selectPartById } from '../viewer/selection.js';
import { startAdaptiveQuiz } from './quiz.js';

let aiModalEl = null;
let chatHistory = [];

export function initAIAssistantUI(viewer) {
  let existing = document.getElementById('aiAssistantModal');
  if (existing) {
    aiModalEl = existing;
    return;
  }

  aiModalEl = document.createElement('div');
  aiModalEl.className = 'ai-assistant-modal hidden';
  aiModalEl.id = 'aiAssistantModal';
  const app = document.getElementById('app') || document.body;
  app.appendChild(aiModalEl);
}

export function openAIAssistant(viewer, initialPrompt = null) {
  if (!aiModalEl) initAIAssistantUI(viewer);

  aiModalEl.classList.remove('hidden');

  const selectedPart = state.selectedPart;
  const partName = selectedPart ? (selectedPart.displayName || selectedPart.id) : null;

  renderAIAssistantMarkup(viewer, partName);

  if (initialPrompt) {
    handleAISubmit(initialPrompt, viewer);
  }
}

export function closeAIAssistant() {
  if (aiModalEl) {
    aiModalEl.classList.add('hidden');
  }
}

function renderAIAssistantMarkup(viewer, currentPartName) {
  if (!aiModalEl) return;

  aiModalEl.innerHTML = `
    <div class="ai-assistant-card animate-in">
      <!-- AI Header -->
      <div class="ai-header">
        <div class="ai-title-wrap">
          <div class="ai-avatar">🤖</div>
          <div>
            <h3 class="ai-title">Trợ Lý AI Giải Phẫu 3D</h3>
            <span class="ai-sub">Hỏi đáp chuẩn Y khoa & Điều khiển 3D bằng tiếng Việt</span>
          </div>
        </div>
        <button type="button" class="ai-close-btn" id="aiCloseBtn">&times;</button>
      </div>

      <!-- Active 3D Context Chip -->
      <div class="ai-context-bar">
        <span class="ai-context-icon">🎯</span>
        <span class="ai-context-text">
          ${currentPartName ? `Ngữ cảnh: <strong>${escapeHtml(currentPartName)}</strong>` : 'Chưa chọn cấu trúc cụ thể (Đang ở chế độ toàn thân)'}
        </span>
      </div>

      <!-- Quick Suggestion Chips -->
      <div class="ai-chips-scroll">
        <button type="button" class="ai-chip" data-prompt="chỉ cơ delta">💪 Chỉ cơ delta</button>
        <button type="button" class="ai-chip" data-prompt="ẩn cơ để xem thần kinh">👁️ Ẩn cơ xem thần kinh</button>
        <button type="button" class="ai-chip" data-prompt="so sánh xương đùi trái–phải">⚖️ So sánh trái - phải</button>
        ${currentPartName ? `<button type="button" class="ai-chip highlight" data-prompt="Cấu trúc này có 4 liên quan giải phẫu nào?">🔗 4 Liên quan của ${escapeHtml(currentPartName)}</button>` : ''}
        ${currentPartName ? `<button type="button" class="ai-chip" data-prompt="Cấu trúc này có chức năng và cơ sinh học gì?">⚡ Chức năng ${escapeHtml(currentPartName)}</button>` : ''}
        <button type="button" class="ai-chip danger" data-prompt="ôn lại cấu trúc hay sai">🎯 Ôn câu hay sai</button>
        <button type="button" class="ai-chip" data-prompt="xem lộ trình học tập">📊 Xem lộ trình học</button>
      </div>

      <!-- Chat Messages Container -->
      <div class="ai-chat-messages" id="aiChatMessages">
        ${chatHistory.length === 0 ? `
          <div class="ai-welcome-box">
            <span class="welcome-icon">🩺</span>
            <h4>Xin chào! Tôi có thể hỗ trợ bạn:</h4>
            <p>1. <strong>Ra lệnh 3D bằng tiếng Việt:</strong> <em>"chỉ cơ delta"</em>, <em>"ẩn cơ để xem thần kinh"</em>, <em>"so sánh xương đùi trái-phải"</em>.</p>
            <p>2. <strong>Hỏi đáp chuyên sâu:</strong> Chức năng, 4 liên quan (Cơ - Xương - Thần kinh - Mạch máu), bệnh lý lâm sàng.</p>
            <p>3. <strong>Học thông minh:</strong> Ôn lại các cấu trúc hay sai và xem lộ trình cá nhân.</p>
          </div>
        ` : ''}

        ${chatHistory.map(item => `
          <div class="chat-msg ${item.role}">
            ${item.badge ? `<div class="msg-action-badge">${item.badge}</div>` : ''}
            <div class="msg-bubble">${formatMarkdownToHtml(item.text)}</div>
            ${item.partId ? `<button type="button" class="msg-focus-btn" data-part="${item.partId}">🔍 Focus trên mô hình 3D</button>` : ''}
            ${item.action === 'TRIGGER_ADAPTIVE_QUIZ' ? `<button type="button" class="msg-focus-btn quiz" id="btnStartAdaptiveFromChat">🎯 Bắt đầu bài thi thích ứng</button>` : ''}
          </div>
        `).join('')}
      </div>

      <!-- Chat Input Row -->
      <div class="ai-input-row">
        <input type="text" id="aiChatInput" class="ai-chat-input" placeholder="Nhập câu hỏi hoặc lệnh (VD: chỉ cơ delta, ẩn cơ...)..." autocomplete="off">
        <button type="button" id="aiSendBtn" class="ai-send-btn" aria-label="Gửi câu hỏi">
          <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path d="M22 2L11 13M22 2l-7 20-4-9-9-4 20-7z"/></svg>
        </button>
      </div>
    </div>
  `;

  // Attach Listeners
  document.getElementById('aiCloseBtn')?.addEventListener('click', closeAIAssistant);

  const inputEl = document.getElementById('aiChatInput');
  const sendBtn = document.getElementById('aiSendBtn');

  sendBtn?.addEventListener('click', () => {
    const val = inputEl?.value.trim();
    if (val) {
      handleAISubmit(val, viewer);
      if (inputEl) inputEl.value = '';
    }
  });

  inputEl?.addEventListener('keydown', (e) => {
    if (e.key === 'Enter') {
      const val = inputEl.value.trim();
      if (val) {
        handleAISubmit(val, viewer);
        inputEl.value = '';
      }
    }
  });

  aiModalEl.querySelectorAll('.ai-chip').forEach(chip => {
    chip.addEventListener('click', () => {
      const prompt = chip.dataset.prompt;
      if (prompt) {
        handleAISubmit(prompt, viewer);
      }
    });
  });

  aiModalEl.querySelectorAll('.msg-focus-btn[data-part]').forEach(btn => {
    btn.addEventListener('click', () => {
      const partId = btn.dataset.part;
      if (partId) {
        selectPartById(partId, viewer);
        closeAIAssistant();
      }
    });
  });

  document.getElementById('btnStartAdaptiveFromChat')?.addEventListener('click', () => {
    closeAIAssistant();
    startAdaptiveQuiz(viewer);
  });

  scrollToBottom();
}

async function handleAISubmit(text, viewer) {
  // Push user message
  chatHistory.push({ role: 'user', text });
  renderAIAssistantMarkup(viewer, state.selectedPart?.displayName);

  // Interpret with smart 3D NLP
  const interpreted = interpretAIQuery(text, state.selectedPart);

  // Add thinking indicator
  const messagesContainer = document.getElementById('aiChatMessages');
  if (messagesContainer) {
    const thinkingEl = document.createElement('div');
    thinkingEl.className = 'chat-msg bot thinking';
    thinkingEl.id = 'aiThinkingBubble';
    thinkingEl.innerHTML = `<span class="spinner-inline"></span> Đang phân tích câu lệnh & xử lý mô hình 3D...`;
    messagesContainer.appendChild(thinkingEl);
    scrollToBottom();
  }

  // Execute 3D action & fetch grounded data
  try {
    const result = await executeAICommand(interpreted, viewer);
    document.getElementById('aiThinkingBubble')?.remove();

    chatHistory.push({
      role: 'bot',
      text: result.message,
      badge: result.actionBadge,
      partId: result.partId,
      action: result.action
    });

    renderAIAssistantMarkup(viewer, state.selectedPart?.displayName);
  } catch (err) {
    document.getElementById('aiThinkingBubble')?.remove();
    chatHistory.push({
      role: 'bot',
      text: 'Đã có lỗi nhỏ xảy ra khi phân tích mô hình 3D. Vui lòng thử lại lệnh khác!'
    });
    renderAIAssistantMarkup(viewer, state.selectedPart?.displayName);
  }
}

function scrollToBottom() {
  const c = document.getElementById('aiChatMessages');
  if (c) c.scrollTop = c.scrollHeight;
}

function formatMarkdownToHtml(md) {
  if (!md) return '';
  return md
    .replace(/^### (.*$)/gim, '<h4 style="margin: 6px 0 4px; color: #58a6ff; font-size: 13px;">$1</h4>')
    .replace(/^## (.*$)/gim, '<h3 style="margin: 8px 0 4px; color: #fff; font-size: 14px;">$1</h3>')
    .replace(/\*\*(.*?)\*\*/gim, '<strong>$1</strong>')
    .replace(/\*(.*?)\*/gim, '<em>$1</em>')
    .replace(/^- (.*$)/gim, '<li style="margin-left: 14px; margin-bottom: 2px;">$1</li>')
    .replace(/\n\n/gim, '<br><br>')
    .replace(/\n/gim, '<br>');
}

function escapeHtml(str) {
  if (!str) return '';
  return String(str)
    .replace(/&/g, '&amp;')
    .replace(/</g, '&lt;')
    .replace(/>/g, '&gt;')
    .replace(/"/g, '&quot;');
}
