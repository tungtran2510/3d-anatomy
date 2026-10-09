/**
 * CLINICAL AXES FLOATING HUD & SMART MECHANISM SHEET
 * Giao diện Trục Giải Phẫu Ứng Dụng Lâm Sàng
 * Thiết kế chuẩn Apple Health Luxury:
 * - 3D Canvas chiếm 85% màn hình, không bị che khuất
 * - Thanh điều khiển nổi siêu tinh gọn (Floating HUD cao ~78px) ở đáy
 * - 4 Chip mắt xích dòng chảy trực quan: Chạm chip nào 3D zoom & highlight cơ quan đó
 * - Đúng 1 dòng chú giải tinh hoa (<15 chữ)
 * - Nút [📖 Cơ chế] mở Bottom Sheet khi người dùng thực sự muốn đọc sâu
 */

import { CLINICAL_AXES } from '../data/clinicalAxesData.js';
import { activateClinicalAxis3D, focusAxisStep, deactivateClinicalAxis3D } from '../viewer/clinicalAxisViewer.js';
import { showToast } from './sidebar.js';
import { getClinicalAxisIcon } from './icons.js';

let hudEl = null;
let sheetEl = null;
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

/**
 * Mở thanh HUD Trục Lâm Sàng và kích hoạt 3D Multi-Organ Isolation
 */
export async function openClinicalAxesModal(axisId = null, viewer = window.viewer) {
  let matched = CLINICAL_AXES.find(a => a.id === axisId);
  if (!matched) {
    matched = CLINICAL_AXES[0];
  }
  currentAxis = matched;
  currentStepIdx = 0;

  // 1. Tạo thanh Floating HUD nếu chưa có
  if (!hudEl) {
    hudEl = document.createElement('div');
    hudEl.id = 'clinicalAxisHud';
    hudEl.className = 'clinical-axis-hud-island';
    document.body.appendChild(hudEl);
  }

  // 2. Tạo Mechanism Sheet nếu chưa có
  if (!sheetEl) {
    sheetEl = document.createElement('div');
    sheetEl.id = 'clinicalAxisSheet';
    sheetEl.className = 'clinical-axis-sheet-backdrop hidden';
    document.body.appendChild(sheetEl);
  }

  // 3. Render HUD UI
  renderFloatingHud();
  hudEl.classList.remove('hidden');

  // Đóng sheet nếu đang mở & ẩn selectionCard để nhường toàn bộ không gian cho Trục 3D
  closeMechanismSheet();
  const selCard = document.getElementById('selectionCard');
  if (selCard) {
    selCard.classList.add('hidden');
  }

  // 4. Kích hoạt toàn bộ chuỗi trục trên không gian 3D
  await activateClinicalAxis3D(currentAxis.id, viewer);
}

/**
 * Đóng thanh HUD và khôi phục 3D
 */
export function closeClinicalAxesModal(viewer = window.viewer) {
  stopSpeech();
  if (hudEl) {
    hudEl.classList.add('hidden');
    const dropdown = hudEl.querySelector('#hudAxisDropdown');
    if (dropdown) dropdown.classList.add('hidden');
    if (hudEl._outsideDropdownHandler) {
      document.removeEventListener('pointerdown', hudEl._outsideDropdownHandler);
    }
  }
  closeMechanismSheet();
  deactivateClinicalAxis3D(viewer);
}

/**
 * Render thanh điều khiển nổi siêu tinh gọn (Floating HUD)
 */
function renderFloatingHud() {
  if (!hudEl || !currentAxis) return;
  const a = currentAxis;
  const currentStep = a.chainSteps[currentStepIdx] || a.chainSteps[0];

  hudEl.innerHTML = `
    <div class="hud-inner-container">
      <!-- Row 1: Header + Tools -->
      <div class="hud-top-row">
        <div class="hud-title-wrap">
          <span class="hud-axis-icon">${getClinicalAxisIcon(a.id)}</span>
          <span class="hud-axis-title">${a.titleVi.split('(')[0].trim()}</span>
          <span class="hud-axis-badge">${a.badge}</span>
        </div>
        <div class="hud-actions">
          <button type="button" class="btn-hud-detail" id="btnOpenMechanismSheet" title="Xem cơ chế bệnh sinh chi tiết">
            <svg width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.2"><path d="M2 3h6a4 4 0 0 1 4 4v14a3 3 0 0 0-3-3H2z"/><path d="M22 3h-6a4 4 0 0 0-4 4v14a3 3 0 0 1 3-3h7z"/></svg>
            <span>Cơ chế</span>
          </button>
          <button type="button" class="btn-hud-switch" id="btnSwitchAxis" title="Đổi sang trục khác">
            <svg width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.2"><path d="m16 3 4 4-4 4"/><path d="M20 7H4"/><path d="m8 21-4-4 4-4"/><path d="M4 17h16"/></svg>
          </button>
          <button type="button" class="btn-hud-close" id="btnCloseClinicalHud" title="Đóng trục">
            &times;
          </button>
        </div>
      </div>

      <!-- Row 2: 4 Flow Chips -->
      <div class="hud-flow-chips">
        ${a.chainSteps.map((step, idx) => {
          const cleanName = (step.shortTitle || step.title.split('(')[0].trim()).replace(/^\d+[\.\s\-]+/, '');
          return `
            <button type="button" class="hud-step-chip ${idx === currentStepIdx ? 'active' : ''}" data-step-idx="${idx}">
              <span class="step-chip-num">${step.step}</span>
              <span class="step-chip-name">${cleanName}</span>
            </button>
          `;
        }).join('<span class="hud-flow-arrow">➔</span>')}
      </div>

      <!-- Row 3: Single-line Concise Note (< 15 words) -->
      <div class="hud-note-row">
        <span class="hud-note-bullet">
          <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5" style="display:block;"><circle cx="12" cy="12" r="10"/><path d="M12 16v-4"/><path d="M12 8h.01"/></svg>
        </span>
        <span class="hud-note-text">${currentStep.shortNote || currentStep.note}</span>
      </div>
    </div>

    <!-- Dropdown Menu đổi trục nhanh -->
    <div class="hud-axis-dropdown hidden" id="hudAxisDropdown">
      <div class="hud-dropdown-header">
        <span class="hud-dropdown-title">
          <svg width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.2" style="vertical-align:middle;margin-right:5px;"><path d="m16 3 4 4-4 4"/><path d="M20 7H4"/><path d="m8 21-4-4 4-4"/><path d="M4 17h16"/></svg>
          Trục ứng dụng lâm sàng
        </span>
        <button type="button" class="hud-dropdown-close-btn" id="btnCloseAxisDropdown" title="Đóng danh sách">&times;</button>
      </div>
      <div class="hud-dropdown-scroll">
        ${CLINICAL_AXES.map(item => {
          const cleanTitle = item.titleVi.replace(/\s*\([^)]*\)/g, '').trim();
          return `
            <button type="button" class="hud-dropdown-item ${item.id === a.id ? 'active' : ''}" data-select-axis="${item.id}" title="${item.titleVi}">
              <span class="dropdown-item-icon">${getClinicalAxisIcon(item.id)}</span>
              <span class="dropdown-item-title">${cleanTitle}</span>
            </button>
          `;
        }).join('')}
      </div>
    </div>
  `;

  // Gắn sự kiện tương tác
  bindFloatingHudEvents();
}

/**
 * Gắn sự kiện cho thanh Floating HUD
 */
function bindFloatingHudEvents() {
  if (!hudEl) return;

  // 1. Chạm vào mắt xích nào -> 3D camera zoom & highlight mắt xích đó
  hudEl.querySelectorAll('[data-step-idx]').forEach(chip => {
    chip.addEventListener('click', () => {
      const idx = parseInt(chip.dataset.stepIdx, 10);
      currentStepIdx = idx;

      // Cập nhật class active
      hudEl.querySelectorAll('.hud-step-chip').forEach((c, i) => {
        c.classList.toggle('active', i === idx);
      });

      // Cập nhật dòng chú thích duy nhất
      const noteEl = hudEl.querySelector('.hud-note-text');
      const step = currentAxis.chainSteps[idx];
      if (noteEl && step) {
        noteEl.textContent = step.shortNote || step.note;
      }

      // Kích hoạt 3D Focus & Highlight
      focusAxisStep(currentAxis.id, idx, window.viewer, true);
    });
  });

  // 2. Mở Mechanism Sheet
  const btnDetail = hudEl.querySelector('#btnOpenMechanismSheet');
  if (btnDetail) {
    btnDetail.addEventListener('click', () => {
      openMechanismSheet();
    });
  }

  // 3. Đổi trục nhanh (Dropdown)
  const btnSwitch = hudEl.querySelector('#btnSwitchAxis');
  const dropdown = hudEl.querySelector('#hudAxisDropdown');
  const btnCloseDropdown = hudEl.querySelector('#btnCloseAxisDropdown');

  if (btnSwitch && dropdown) {
    btnSwitch.addEventListener('click', (e) => {
      e.stopPropagation();
      dropdown.classList.toggle('hidden');
    });
  }

  if (btnCloseDropdown && dropdown) {
    btnCloseDropdown.addEventListener('click', (e) => {
      e.stopPropagation();
      dropdown.classList.add('hidden');
    });
  }

  // Outside click listener to dismiss dropdown
  const onOutsideClick = (e) => {
    if (dropdown && !dropdown.classList.contains('hidden')) {
      if (!dropdown.contains(e.target) && !btnSwitch?.contains(e.target)) {
        dropdown.classList.add('hidden');
      }
    }
  };
  if (hudEl._outsideDropdownHandler) {
    document.removeEventListener('pointerdown', hudEl._outsideDropdownHandler);
  }
  hudEl._outsideDropdownHandler = onOutsideClick;
  document.addEventListener('pointerdown', onOutsideClick);

  hudEl.querySelectorAll('[data-select-axis]').forEach(item => {
    item.addEventListener('click', async (e) => {
      e.stopPropagation();
      dropdown?.classList.add('hidden');
      const nextAxisId = item.dataset.selectAxis;
      await openClinicalAxesModal(nextAxisId, window.viewer);
    });
  });

  // 4. Đóng HUD
  const btnClose = hudEl.querySelector('#btnCloseClinicalHud');
  if (btnClose) {
    btnClose.addEventListener('click', () => {
      closeClinicalAxesModal(window.viewer);
    });
  }
}

/**
 * Mở Bottom Sheet xem chi tiết cơ chế bệnh sinh
 */
export function openMechanismSheet() {
  if (!sheetEl || !currentAxis) return;
  const a = currentAxis;

  sheetEl.innerHTML = `
    <div class="clinical-sheet-card" role="dialog" aria-modal="true">
      <div class="sheet-drag-handle"></div>

      <div class="sheet-header">
        <div class="sheet-title-group">
          <span class="sheet-pill-badge">${a.badge}</span>
          <h3 class="sheet-title">${a.titleVi}</h3>
          <span class="sheet-latin">${a.latin}</span>
        </div>
        <button type="button" class="btn-sheet-close" id="btnCloseMechanismSheet">&times;</button>
      </div>

      <div class="sheet-body-scroll">
        <!-- Summary Box with Voice -->
        <div class="sheet-summary-box">
          <p class="sheet-summary-p">${a.summary}</p>
          <button type="button" class="btn-sheet-voice" id="btnSheetVoice">
            <svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><polygon points="11 5 6 9 2 9 2 15 6 15 11 19 11 5"/><path d="M19.07 4.93a10 10 0 0 1 0 14.14M15.54 8.46a5 5 0 0 1 0 7.07"/></svg>
            <span>Nghe giải thích</span>
          </button>
        </div>

        <!-- 4 Steps Overview -->
        <div class="sheet-steps-list">
          <h4 class="sheet-section-title">4 MẮT XÍCH LIÊN KẾT:</h4>
          ${a.chainSteps.map((st, i) => `
            <div class="sheet-step-item ${i === currentStepIdx ? 'highlighted' : ''}">
              <div class="step-item-badge">#${st.step}</div>
              <div class="step-item-content">
                <div class="step-item-title">${st.title}</div>
                <div class="step-item-desc">${st.note}</div>
              </div>
            </div>
          `).join('')}
        </div>

        <!-- Clinical Insights Q&A -->
        <div class="sheet-qa-list">
          <h4 class="sheet-section-title">CƠ CHẾ LÂM SÀNG THỰC TẾ:</h4>
          ${a.clinicalInsights.map(qa => `
            <div class="sheet-qa-card">
              <div class="sheet-qa-question">
                <span class="qa-q-icon">❓</span>
                <span>${qa.question}</span>
              </div>
              <div class="sheet-qa-answer">
                <span class="qa-a-icon">🩺</span>
                <span>${qa.explanation}</span>
              </div>
            </div>
          `).join('')}
        </div>

        <!-- Lifestyle Tips -->
        <div class="sheet-tips-box">
          <h4 class="sheet-section-title">LỜI KHUYÊN THỰC HÀNH Y KHOA:</h4>
          <ul class="sheet-tips-ul">
            ${a.lifestyleTips.map(tip => `<li>${tip}</li>`).join('')}
          </ul>
        </div>
      </div>
    </div>
  `;

  sheetEl.classList.remove('hidden');

  // Gắn sự kiện đóng sheet
  const btnClose = sheetEl.querySelector('#btnCloseMechanismSheet');
  if (btnClose) {
    btnClose.addEventListener('click', closeMechanismSheet);
  }
  sheetEl.addEventListener('click', (e) => {
    if (e.target === sheetEl) closeMechanismSheet();
  });

  // Gắn voice
  const btnVoice = sheetEl.querySelector('#btnSheetVoice');
  if (btnVoice) {
    const textToRead = `${a.titleVi}. ${a.summary} ${a.clinicalInsights.map(q => q.question + ' ' + q.explanation).join(' ')}`;
    btnVoice.addEventListener('click', () => speakText(textToRead, btnVoice));
  }
}

export function closeMechanismSheet() {
  stopSpeech();
  if (sheetEl) sheetEl.classList.add('hidden');
}
