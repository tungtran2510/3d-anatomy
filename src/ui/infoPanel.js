// Advanced Anatomy Information Panel Controller (Visible Body & Atlas 2027 Standard)
// Manages: Full/Compact Mode, Model Orientation (Đứng/Nằm ngửa/Nằm sấp/Bàn mổ),
// Audio Pronunciation, Anatomical Hierarchy, Learn More & Histology Thumbnails
import { state } from '../state/store.js';
import { getClinicalData } from '../data/clinicalInfo.js';
import { setModelOrientation, toggleDissectionTable, getCurrentOrientation, getTableVisibility } from '../viewer/orientationManager.js';
import { openLesson, showToast } from './sidebar.js';
import { openAIAssistant } from './aiAssistantModal.js';
import { hidePart, isolatePart, setPartTransparency, restoreAllParts } from '../viewer/visibility.js';

let isCompact = false;

export function initInfoPanel(viewer) {
  const card = document.getElementById('selectionCard');
  if (!card) return;

  // 1. Audio Pronunciation
  const audioBtn = document.getElementById('btnPronounceAudio');
  audioBtn?.addEventListener('click', () => {
    speakCurrentStructure();
  });

  // 2. Compact Mode Toggles
  const toggleCompactBtn = document.getElementById('btnToggleCompactCard');
  const compactBar = document.getElementById('btnSwitchCompactMode');

  toggleCompactBtn?.addEventListener('click', () => {
    setCompactMode(!isCompact);
  });

  compactBar?.addEventListener('click', () => {
    setCompactMode(true);
  });

  // 3. Model Orientation Buttons
  card.querySelectorAll('[data-orientation]').forEach(btn => {
    btn.addEventListener('click', () => {
      const targetPosture = btn.dataset.orientation;
      setModelOrientation(targetPosture, viewer);
      updateOrientationButtons();
    });
  });

  // 4. Table Toggle Button
  const tableBtn = document.getElementById('btnCardTableToggle');
  tableBtn?.addEventListener('click', () => {
    const isVisible = toggleDissectionTable(viewer);
    tableBtn.classList.toggle('active', isVisible);
    showToast(isVisible ? '🗄️ Đã bật Bàn phẫu tích y khoa' : '🗄️ Đã ẩn Bàn phẫu tích');
  });

  // 5. Radius Blast (Bóc tách lân cận)
  const radiusBtn = document.getElementById('cardRadiusBlastBtn');
  radiusBtn?.addEventListener('click', () => {
    handleRadiusBlast(viewer);
  });

  // 6. Clinical & Dermatomes
  document.getElementById('cardClinicalBtn')?.addEventListener('click', () => {
    showClinicalModal();
  });

  document.getElementById('cardDermatomeBtn')?.addEventListener('click', () => {
    showDermatomeInfo();
  });

  // 7. AI Assistant
  document.getElementById('cardAIBtn')?.addEventListener('click', () => {
    const part = state.selectedPart;
    if (part) {
      openAIAssistant(viewer, `Giải thích chi tiết giải phẫu học, chức năng và liên quan lâm sàng của ${part.displayName || part.id}`);
    }
  });
}

export function updateInfoPanelContent(part, viewer) {
  if (!part) return;

  const clinical = getClinicalData(part.id);
  const lang = state.language || 'vi';

  // 1. Title & Subtitle
  const cardTitle = document.getElementById('cardTitle');
  const cardSubtitle = document.getElementById('cardSubtitle');

  const mainName = clinical.nameVi || part.info?.name?.[lang] || part.displayName || part.id;
  const latinName = clinical.nameLatin || part.info?.latinName || '';
  const systemName = clinical.systemVi || part.system || '';

  if (cardTitle) cardTitle.textContent = mainName;
  if (cardSubtitle) {
    cardSubtitle.textContent = latinName ? `${latinName} • ${systemName}` : systemName;
  }

  // 2. Update Orientation UI Buttons
  updateOrientationButtons();

  // 3. Render 4-Way Anatomical Hierarchy & Relations
  const hierarchyBox = document.getElementById('cardHierarchyBox');
  if (hierarchyBox) {
    hierarchyBox.innerHTML = `
      <div class="hierarchy-badge-flow">
        <span class="hier-step hier-sys">${clinical.systemVi}</span>
        <span class="hier-arrow">›</span>
        <span class="hier-step hier-part">${mainName}</span>
      </div>
      <div class="relations-summary-grid">
        <div class="rel-mini-item">
          <span class="rel-tag muscle">🔴 Cơ</span>
          <span class="rel-text">${clinical.relations?.muscles || 'Liên kết nhóm cơ vận động.'}</span>
        </div>
        <div class="rel-mini-item">
          <span class="rel-tag bone">🦴 Xương</span>
          <span class="rel-text">${clinical.relations?.bones || 'Khớp nối diện xương kế cận.'}</span>
        </div>
        <div class="rel-mini-item">
          <span class="rel-tag nerve">⚡ Thần kinh</span>
          <span class="rel-text">${clinical.relations?.nerves || 'Nhánh thần kinh chi phối.'}</span>
        </div>
        <div class="rel-mini-item">
          <span class="rel-tag vessel">🩸 Mạch máu</span>
          <span class="rel-text">${clinical.relations?.vessels || 'Động mạch cấp máu và tĩnh mạch dẫn lưu.'}</span>
        </div>
      </div>
    `;
  }

  // 4. Render Related Histology & Media Cards
  const relatedScroll = document.getElementById('cardRelatedMediaScroll');
  if (relatedScroll) {
    const histologyTiles = [
      { title: 'Lát cắt mô học (HE)', badge: 'Mô học 40x', icon: '🔬', desc: 'Cấu trúc vi thể tế bào và mô liên kết' },
      { title: 'Tiết đoạn cảm giác', badge: 'Dermatome', icon: '🌈', desc: 'Vùng chi phối cảm giác rễ thần kinh' },
      { title: 'Cơ sinh học chuyển động', badge: 'Sinh học', icon: '🦴', desc: 'Trục chịu lực và biên độ vận động' },
      { title: 'Mạch máu cấp dưỡng', badge: 'Angio 3D', icon: '🩸', desc: 'Mạng lưới vi mạch mao quản' }
    ];

    relatedScroll.innerHTML = histologyTiles.map(tile => `
      <div class="related-tile" title="${tile.desc}">
        <div class="tile-icon-box">${tile.icon}</div>
        <div class="tile-texts">
          <span class="tile-badge">${tile.badge}</span>
          <strong class="tile-title">${tile.title}</strong>
        </div>
      </div>
    `).join('');
  }
}

export function setCompactMode(compact) {
  isCompact = compact;
  const card = document.getElementById('selectionCard');
  if (!card) return;

  card.classList.toggle('compact-mode', isCompact);

  const iconMin = card.querySelector('.icon-minimize');
  const iconMax = card.querySelector('.icon-maximize');
  if (iconMin && iconMax) {
    iconMin.classList.toggle('hidden', isCompact);
    iconMax.classList.toggle('hidden', !isCompact);
  }
}

export function updateOrientationButtons() {
  const current = getCurrentOrientation();
  const isTable = getTableVisibility();

  document.querySelectorAll('[data-orientation]').forEach(btn => {
    btn.classList.toggle('active', btn.dataset.orientation === current);
  });

  const tableBtn = document.getElementById('btnCardTableToggle');
  if (tableBtn) {
    tableBtn.classList.toggle('active', isTable);
  }
}

function speakCurrentStructure() {
  const part = state.selectedPart;
  if (!part) return;

  const clinical = getClinicalData(part.id);
  const textToSpeak = clinical.nameLatin || clinical.nameVi || part.displayName || part.id;

  if ('speechSynthesis' in window) {
    window.speechSynthesis.cancel();
    const utterance = new SpeechSynthesisUtterance(textToSpeak);
    utterance.lang = 'la'; // Latin for medical anatomical nomenclature
    utterance.rate = 0.85;
    window.speechSynthesis.speak(utterance);
    showToast(`🔊 Đang phát âm: ${textToSpeak}`);
  } else {
    showToast('Trình duyệt không hỗ trợ tổng hợp giọng nói Web Speech.');
  }
}

function handleRadiusBlast(viewer) {
  const part = state.selectedPart;
  if (!part) return;

  showToast('💥 Đang bóc tách vùng bán kính lân cận (Radius Blast)...');
  // Radius blast: Dim other parts to 0.15 and highlight the selected structure
  setPartTransparency(0.2);
  viewer?.render?.();
}

function showClinicalModal() {
  const part = state.selectedPart;
  if (!part) return;
  const clinical = getClinicalData(part.id);

  const modalHtml = `
    <div class="atlas-hub-modal" id="clinicalDetailModal">
      <div class="atlas-hub-backdrop" id="clinicalBackdrop"></div>
      <div class="study-dialog" style="max-width: 500px; padding: 20px;">
        <div class="study-dialog-header">
          <div>
            <h3>🩺 Ứng Dụng Lâm Sàng & Bệnh Học</h3>
            <p style="color: #64748b; font-size: 13px;">${clinical.nameVi} (${clinical.nameLatin})</p>
          </div>
          <button type="button" class="dialog-close-btn" id="clinicalCloseBtn">&times;</button>
        </div>
        <div style="margin-top: 14px; font-size: 13.5px; line-height: 1.6; color: #334155;">
          <p><strong>Triệu chứng thường gặp:</strong> ${clinical.symptoms || 'Đau khu trú, hạn chế vận động khi có chấn thương hoặc viêm.'}</p>
          <div style="margin-top: 10px; padding: 10px; background: #f0fdf4; border-radius: 8px; border: 1px solid #bbf7d0;">
            <strong style="color: #166534;">Ý nghĩa lâm sàng:</strong>
            <p style="margin: 4px 0 0; color: #15803d;">Cột mốc giải phẫu quan trọng trong thăm khám, chẩn đoán hình ảnh (X-quang, MRI) và phẫu thuật tiếp cận an toàn.</p>
          </div>
        </div>
      </div>
    </div>
  `;

  const container = document.createElement('div');
  container.innerHTML = modalHtml;
  document.body.appendChild(container);

  const close = () => container.remove();
  container.querySelector('#clinicalCloseBtn')?.addEventListener('click', close);
  container.querySelector('#clinicalBackdrop')?.addEventListener('click', close);
}

function showDermatomeInfo() {
  const part = state.selectedPart;
  if (!part) return;
  const clinical = getClinicalData(part.id);
  showToast(`🌈 Tiết đoạn Dermatome chi phối: ${clinical.relations?.nerves || 'Rễ thần kinh ngoại biên tương ứng'}`);
}
