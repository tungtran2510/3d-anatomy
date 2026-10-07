/**
 * CLINICAL AXES MODAL (Mô Đun Giải Phẫu Ứng Dụng Theo Chuỗi & Trục)
 * Thiết kế chuẩn Apple Health Luxury: Kính mờ siêu sâu, phông chữ tinh tế, sơ đồ liên hoàn trực quan.
 */

import { CLINICAL_AXES } from '../data/clinicalAxesData.js';
import { selectStructureAnywhere, showToast } from './sidebar.js';

let modalEl = null;
let currentAxis = null;
let currentStepIdx = 0;
let isSpeaking = false;

function stopSpeech() {
  if (typeof window !== 'undefined' && 'speechSynthesis' in window) {
    window.speechSynthesis.cancel();
    isSpeaking = false;
  }
}

function speakText(text, btnEl) {
  if (!('speechSynthesis' in window)) {
    showToast('Trình duyệt chưa hỗ trợ phát âm.');
    return;
  }
  if (isSpeaking) {
    stopSpeech();
    if (btnEl) btnEl.classList.remove('speaking');
    showToast('Đã dừng đọc.');
    return;
  }

  stopSpeech();
  const utterance = new SpeechSynthesisUtterance(text);
  utterance.lang = 'vi-VN';
  utterance.rate = 0.95;

  const voices = window.speechSynthesis.getVoices();
  const viVoice = voices.find(v => v.lang.includes('vi') || v.lang.includes('VN'));
  if (viVoice) utterance.voice = viVoice;

  isSpeaking = true;
  if (btnEl) btnEl.classList.add('speaking');

  utterance.onend = () => {
    isSpeaking = false;
    if (btnEl) btnEl.classList.remove('speaking');
  };
  utterance.onerror = () => {
    isSpeaking = false;
    if (btnEl) btnEl.classList.remove('speaking');
  };

  window.speechSynthesis.speak(utterance);
  showToast('🔊 Đang đọc giải phẫu ứng dụng...');
}

export function openClinicalAxesModal(axisId = null, viewer = window.viewer) {
  let matched = CLINICAL_AXES.find(a => a.id === axisId);
  if (!matched) {
    matched = CLINICAL_AXES[0];
  }
  currentAxis = matched;
  currentStepIdx = 0;

  if (!modalEl) {
    modalEl = document.createElement('div');
    modalEl.id = 'clinicalAxesModal';
    modalEl.className = 'clinical-axes-modal-backdrop';
    document.body.appendChild(modalEl);
  }

  renderModalUI();
  modalEl.classList.remove('hidden');

  // Trigger 3D focus for default organ in this axis
  if (currentAxis.defaultPartId) {
    selectStructureAnywhere(currentAxis.defaultPartId);
  }
}

export function closeClinicalAxesModal() {
  stopSpeech();
  if (modalEl) {
    modalEl.classList.add('hidden');
  }
}

function renderModalUI() {
  if (!modalEl || !currentAxis) return;

  const a = currentAxis;
  const currentStep = a.chainSteps[currentStepIdx] || a.chainSteps[0];

  modalEl.innerHTML = `
    <div class="clinical-axes-dialog" role="dialog" aria-modal="true">
      <!-- Header -->
      <div class="axes-header">
        <div class="axes-header-info">
          <div class="axes-badge-row">
            <span class="axes-pill-badge">${a.badge}</span>
            <span class="axes-category-text">${a.category}</span>
          </div>
          <h2 class="axes-title">${a.titleVi}</h2>
          <span class="axes-latin-name">${a.latin}</span>
        </div>
        <button type="button" class="axes-close-btn" id="axesCloseBtn" aria-label="Đóng">&times;</button>
      </div>

      <!-- Axes Carousel Tabs -->
      <div class="axes-tabs-scroller">
        ${CLINICAL_AXES.map(item => `
          <button type="button" class="axes-tab-btn ${item.id === a.id ? 'active' : ''}" data-axis="${item.id}">
            <span class="tab-btn-icon">${item.icon}</span>
            <span class="tab-btn-title">${item.titleVi.split('(')[0].trim()}</span>
          </button>
        `).join('')}
      </div>

      <!-- Body Scrollable Content -->
      <div class="axes-content-body">
        <!-- Summary Box -->
        <div class="axes-summary-card">
          <p class="axes-summary-text">${a.summary}</p>
          <button type="button" class="btn-axes-listen" id="btnAxesListen" title="Nghe đọc tóm tắt giải phẫu ứng dụng">
            <svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><polygon points="11 5 6 9 2 9 2 15 6 15 11 19 11 5"/><path d="M19.07 4.93a10 10 0 0 1 0 14.14M15.54 8.46a5 5 0 0 1 0 7.07"/></svg>
            <span>Nghe đọc</span>
          </button>
        </div>

        <!-- Interactive Flow Chain -->
        <div class="axes-chain-section">
          <div class="section-label-row">
            <span class="section-badge-icon">⛓️</span>
            <span class="section-label-title">CHUỖI LIÊN HOÀN CÁC MẮT XÍCH (CHẠM ĐỂ XEM 3D):</span>
          </div>

          <div class="axes-flow-steps">
            ${a.chainSteps.map((st, idx) => `
              <button type="button" class="flow-step-btn ${idx === currentStepIdx ? 'active' : ''}" data-step="${idx}">
                <span class="step-num">${st.step}</span>
                <span class="step-title">${st.title}</span>
              </button>
            `).join('<span class="flow-arrow">→</span>')}
          </div>

          <!-- Active Step Detail Box -->
          <div class="step-detail-card">
            <div class="step-detail-header">
              <span class="step-marker">Mắt xích #${currentStep.step}:</span>
              <strong class="step-name">${currentStep.title}</strong>
            </div>
            <p class="step-note">${currentStep.note}</p>
            <button type="button" class="btn-focus-step-3d" id="btnFocusStep3D">
              <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><circle cx="11" cy="11" r="8"/><line x1="21" y1="21" x2="16.65" y2="16.65"/><line x1="11" y1="8" x2="11" y2="14"/><line x1="8" y1="11" x2="14" y2="11"/></svg>
              <span>Phóng to ${currentStep.title.split('&')[0].trim()} trên mô hình 3D</span>
            </button>
          </div>
        </div>

        <!-- Clinical Insights Q&A -->
        <div class="axes-insights-section">
          <div class="section-label-row">
            <span class="section-badge-icon">💡</span>
            <span class="section-label-title">HIỂU SÂU BỆNH HỌC LÂM SÀNG THỰC TẾ:</span>
          </div>
          <div class="insights-list">
            ${a.clinicalInsights.map(qa => `
              <div class="insight-card">
                <div class="insight-q">
                  <span class="q-icon">❓</span>
                  <span class="q-text">${qa.question}</span>
                </div>
                <div class="insight-a">
                  <span class="a-icon">🩺</span>
                  <p class="a-text">${qa.explanation}</p>
                </div>
              </div>
            `).join('')}
          </div>
        </div>

        <!-- Lifestyle & Ergonomic Tips -->
        <div class="axes-tips-section">
          <div class="section-label-row">
            <span class="section-badge-icon">🛡️</span>
            <span class="section-label-title">LỜI KHUYÊN & PHÁC ĐỒ BẢO VỆ CHỦ ĐỘNG:</span>
          </div>
          <ul class="tips-ul">
            ${a.lifestyleTips.map(tip => `
              <li class="tip-li">
                <span class="tip-bullet">✓</span>
                <span class="tip-text">${tip}</span>
              </li>
            `).join('')}
          </ul>
        </div>
      </div>
    </div>
  `;

  // Attach event handlers
  modalEl.querySelector('#axesCloseBtn')?.addEventListener('click', closeClinicalAxesModal);

  // Tabs
  modalEl.querySelectorAll('.axes-tab-btn').forEach(btn => {
    btn.addEventListener('click', () => {
      const axisId = btn.dataset.axis;
      const matched = CLINICAL_AXES.find(it => it.id === axisId);
      if (matched) {
        stopSpeech();
        currentAxis = matched;
        currentStepIdx = 0;
        renderModalUI();
        if (matched.defaultPartId) {
          selectStructureAnywhere(matched.defaultPartId);
        }
      }
    });
  });

  // Steps
  modalEl.querySelectorAll('.flow-step-btn').forEach(btn => {
    btn.addEventListener('click', () => {
      const idx = parseInt(btn.dataset.step, 10) || 0;
      currentStepIdx = idx;
      renderModalUI();
      const targetStep = a.chainSteps[idx];
      if (targetStep?.partId) {
        selectStructureAnywhere(targetStep.partId);
      }
    });
  });

  // Focus button
  modalEl.querySelector('#btnFocusStep3D')?.addEventListener('click', () => {
    closeClinicalAxesModal();
    if (currentStep?.partId) {
      selectStructureAnywhere(currentStep.partId);
    }
  });

  // TTS Listen
  const listenBtn = modalEl.querySelector('#btnAxesListen');
  listenBtn?.addEventListener('click', () => {
    const fullText = `${a.titleVi}. ${a.summary}. Các mắt xích liên hoàn gồm: ${a.chainSteps.map(s => s.title).join(', ')}. Cơ chế lâm sàng: ${a.clinicalInsights.map(c => c.question + ' ' + c.explanation).join(' ')}`;
    speakText(fullText, listenBtn);
  });
}

// Global exposure
if (typeof window !== 'undefined') {
  window.openClinicalAxesModal = openClinicalAxesModal;
  window.closeClinicalAxesModal = closeClinicalAxesModal;
}
