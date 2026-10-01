// Advanced Anatomy Information Panel Controller (Visible Body & Atlas 2027 Standard)
// Manages: History Navigation (< >), Full/Compact Mode, Model Orientation (Đứng/Nằm ngửa/Nằm sấp/Bàn mổ),
// Audio Pronunciation, Anatomical Hierarchy Tree, 3D Structure Tagging, Learn More & Histology Thumbnails
import { state } from '../state/store.js';
import { getClinicalData } from '../data/clinicalInfo.js';
import { setModelOrientation, toggleDissectionTable, getCurrentOrientation, getTableVisibility } from '../viewer/orientationManager.js';
import { openLesson, showToast } from './sidebar.js';
import { openAIAssistant } from './aiAssistantModal.js';
import { hidePart, isolatePart, setPartTransparency, restoreAllParts } from '../viewer/visibility.js';
import { canGoBackSelection, canGoForwardSelection, navigateSelectionHistory, notifySelectionHistoryChanged, selectPartById } from '../viewer/selection.js';
import { addCustomTag, clearCustomTags } from '../viewer/labels.js';

let isCompact = false;
let isBodyCollapsed = false;

export function initInfoPanel(viewer) {
  const card = document.getElementById('selectionCard');
  if (!card) return;

  // 1. Selection History Navigation (< and > buttons, Visible Body standard)
  const backBtn = document.getElementById('btnSelectionHistoryBack');
  const fwdBtn = document.getElementById('btnSelectionHistoryForward');

  backBtn?.addEventListener('click', (e) => {
    e.stopPropagation();
    if (canGoBackSelection()) {
      navigateSelectionHistory(-1, viewer);
    }
  });

  fwdBtn?.addEventListener('click', (e) => {
    e.stopPropagation();
    if (canGoForwardSelection()) {
      navigateSelectionHistory(1, viewer);
    }
  });

  // 2. Audio Pronunciation
  const audioBtn = document.getElementById('btnPronounceAudio');
  audioBtn?.addEventListener('click', (e) => {
    e.stopPropagation();
    speakCurrentStructure();
  });

  // 3. Compact Mode & Dropdown Toggles
  const toggleCompactBtn = document.getElementById('btnToggleCompactCard');
  const compactBar = document.getElementById('btnSwitchCompactMode');
  const toggleDropdownBtn = document.getElementById('btnToggleInfoDropdown');

  toggleCompactBtn?.addEventListener('click', (e) => {
    e.stopPropagation();
    setCompactMode(!isCompact);
  });

  compactBar?.addEventListener('click', (e) => {
    e.stopPropagation();
    setCompactMode(true);
  });

  toggleDropdownBtn?.addEventListener('click', (e) => {
    e.stopPropagation();
    toggleCardBodyDropdown();
  });

  // 4. Model Orientation Buttons
  card.querySelectorAll('[data-orientation]').forEach(btn => {
    btn.addEventListener('click', () => {
      const targetPosture = btn.dataset.orientation;
      setModelOrientation(targetPosture, viewer);
      updateOrientationButtons();
    });
  });

  // 5. Table Toggle Button
  const tableBtn = document.getElementById('btnCardTableToggle');
  tableBtn?.addEventListener('click', () => {
    const isVisible = toggleDissectionTable(viewer);
    tableBtn.classList.toggle('active', isVisible);
    showToast(isVisible ? '🗄️ Đã bật Bàn phẫu tích y khoa' : '🗄️ Đã ẩn Bàn phẫu tích');
  });

  // 6. Adjust Model Actions (Hide, Ghost, Isolate, Radius Blast)
  document.getElementById('cardHideBtn')?.addEventListener('click', () => {
    const part = state.selectedPart;
    if (part) {
      hidePart(part.id);
      viewer?.render?.();
      showToast(`👁️ Đã ẩn: ${part.displayName || part.id}`);
    }
  });

  document.getElementById('cardGhostBtn')?.addEventListener('click', () => {
    const part = state.selectedPart;
    if (part) {
      setPartTransparency(part.id, 0.3);
      viewer?.render?.();
      showToast(`👻 Làm mờ: ${part.displayName || part.id}`);
    }
  });

  document.getElementById('cardIsolateBtn')?.addEventListener('click', () => {
    const part = state.selectedPart;
    if (part) {
      isolatePart(part.id);
      viewer?.render?.();
      showToast(`🔍 Cô lập: ${part.displayName || part.id}`);
    }
  });

  const radiusBtn = document.getElementById('cardRadiusBlastBtn');
  radiusBtn?.addEventListener('click', () => {
    handleRadiusBlast(viewer);
  });

  // 7. 3D Structure Tagging (Visible Body Standard: Add Tag / Clear Tags)
  document.getElementById('btnAddTagBtn')?.addEventListener('click', (e) => {
    e.stopPropagation();
    const part = state.selectedPart;
    if (!part) return;
    const clinical = getClinicalData(part.id);
    const tagName = clinical.nameVi || part.displayName || part.id;
    addCustomTag(part.id, tagName, viewer);
    showToast(`🏷️ Đã ghim thẻ nhãn 3D: ${tagName}`);
  });

  document.getElementById('btnClearTagsBtn')?.addEventListener('click', (e) => {
    e.stopPropagation();
    clearCustomTags(viewer);
    showToast('🗑️ Đã xóa toàn bộ thẻ nhãn 3D');
  });

  // 8. Learn More (Giáo trình, Lâm sàng, Dermatomes, AI)
  document.getElementById('cardLessonBtn')?.addEventListener('click', () => {
    const part = state.selectedPart;
    if (part) openLesson(part.id);
  });

  document.getElementById('cardClinicalBtn')?.addEventListener('click', () => {
    showClinicalModal();
  });

  document.getElementById('cardDermatomeBtn')?.addEventListener('click', () => {
    showDermatomeInfo();
  });

  document.getElementById('cardAIBtn')?.addEventListener('click', () => {
    const part = state.selectedPart;
    if (part) {
      openAIAssistant(viewer, `Giải thích chi tiết giải phẫu học, cấu tạo, chức năng và ý nghĩa lâm sàng của ${part.displayName || part.id}`);
    }
  });

  // 9. Floating AR Button (Bottom Left)
  const floatingAR = document.getElementById('floatingARBtn');
  floatingAR?.addEventListener('click', () => {
    document.getElementById('btnToolAR')?.click();
  });

  // Synchronize history buttons initial state
  notifySelectionHistoryChanged();
}

export function updateInfoPanelContent(part, viewer) {
  if (!part) return;

  const clinical = getClinicalData(part.id);
  const lang = state.language || 'vi';

  // 1. Title & Subtitle (Visible Body Prominent Anatomy Teal Header)
  const cardTitle = document.getElementById('cardTitle');
  const cardSubtitle = document.getElementById('cardSubtitle');

  const mainName = clinical.nameVi || part.info?.name?.[lang] || part.displayName || part.id;
  const latinName = clinical.nameLatin || part.info?.latinName || '';
  const systemName = clinical.systemVi || part.system || '';

  if (cardTitle) cardTitle.textContent = mainName;
  if (cardSubtitle) {
    cardSubtitle.textContent = latinName ? `${latinName} • ${systemName}` : systemName;
  }

  // 2. Core Anatomical Explanation (Là gì, Ý nghĩa là gì, Liên kết ra sao - Ưu tiên ở trên đầu)
  const explainDesc = document.getElementById('cardExplainDesc');
  const explainFunc = document.getElementById('cardExplainFunc');
  const explainRel = document.getElementById('cardExplainRel');

  if (explainDesc) explainDesc.textContent = clinical.description || 'Đang cập nhật thông tin giải phẫu học...';
  if (explainFunc) explainFunc.textContent = clinical.function || 'Đang cập nhật chức năng sinh lý & cơ học...';
  if (explainRel) explainRel.textContent = clinical.relationsText || 'Đang cập nhật liên kết giải phẫu...';

  // 3. Update Orientation UI Buttons
  updateOrientationButtons();

  // 3. Render Interactive Anatomical Hierarchy Tree (Visible Body Standard: Photo 5)
  const hierarchyBox = document.getElementById('cardHierarchyBox');
  if (hierarchyBox) {
    const systemDisplayName = clinical.systemVi || 'Hệ Giải Phẫu';
    const regionName = clinical.regionVi || 'Vùng Cơ Thể';

    hierarchyBox.innerHTML = `
      <div class="anatomical-hierarchy-tree">
        <div class="tree-node tree-root" data-action="select-system" title="Xem toàn bộ ${systemDisplayName}">
          <span class="tree-icon">🏛️</span>
          <span class="tree-label">${systemDisplayName}</span>
        </div>
        <div class="tree-branch">
          <div class="tree-node tree-region" data-action="select-region" title="Xem phân vùng ${regionName}">
            <span class="tree-connector">├─</span>
            <span class="tree-icon">📍</span>
            <span class="tree-label">${regionName}</span>
          </div>
          <div class="tree-node tree-current active" title="Cấu trúc hiện tại">
            <span class="tree-connector">└─</span>
            <span class="tree-icon">🎯</span>
            <span class="tree-label highlight-teal">${mainName}</span>
          </div>
        </div>
      </div>

      <div class="relations-summary-grid">
        <div class="rel-mini-item">
          <span class="rel-tag muscle">🔴 Cơ</span>
          <span class="rel-text">${clinical.relations?.muscles || 'Liên kết với các bó cơ sâu và màng cơ cục bộ quanh vùng giải phẫu.'}</span>
        </div>
        <div class="rel-mini-item">
          <span class="rel-tag bone">🦴 Xương</span>
          <span class="rel-text">${clinical.relations?.bones || 'Khớp nối hoặc bám tận vào mạc, mấu xương kế cận.'}</span>
        </div>
        <div class="rel-mini-item">
          <span class="rel-tag nerve">⚡ Thần kinh</span>
          <span class="rel-text">${clinical.relations?.nerves || 'Được chi phối bởi các nhánh thần kinh ngoại biên tương ứng theo từng tiết đoạn.'}</span>
        </div>
        <div class="rel-mini-item">
          <span class="rel-tag vessel">🩸 Mạch máu</span>
          <span class="rel-text">${clinical.relations?.vessels || 'Được cấp máu bởi các nhánh động mạch khu vực và mạng lưới mao mạch nuôi dưỡng.'}</span>
        </div>
      </div>
    `;

    // Bind hierarchy navigation
    hierarchyBox.querySelector('[data-action="select-system"]')?.addEventListener('click', () => {
      showToast(`🏛️ Đang chọn hệ: ${systemDisplayName}`);
      document.getElementById('systemsOpen')?.click();
    });

    hierarchyBox.querySelector('[data-action="select-region"]')?.addEventListener('click', () => {
      showToast(`📍 Khu trú phân vùng: ${regionName}`);
    });
  }

  // 4. Render Related Histology & Media Cards (Visible Body Standard: Photo 5)
  const relatedScroll = document.getElementById('cardRelatedMediaScroll');
  if (relatedScroll) {
    const histologyTiles = [
      {
        id: 'histology_he',
        title: 'Lát cắt mô học (HE)',
        badge: 'Mô học 40x',
        icon: '🔬',
        desc: 'Cấu trúc vi thể tế bào và mô liên kết nhuộm Hematoxylin-Eosin',
        action: () => showHistologyPreview(mainName, 'Lát cắt mô học HE 40x')
      },
      {
        id: 'dermatome_map',
        title: 'Tiết đoạn cảm giác',
        badge: 'Dermatome',
        icon: '🌈',
        desc: 'Bản đồ chi phối cảm giác rễ thần kinh tủy sống',
        action: () => showDermatomeInfo()
      },
      {
        id: 'biomechanics',
        title: 'Cơ sinh học chuyển động',
        badge: 'Sinh học',
        icon: '🦴',
        desc: 'Trục chịu lực, biên độ vận động và gân bám',
        action: () => {
          document.getElementById('btnToolMotion')?.click();
        }
      },
      {
        id: 'vascular_angio',
        title: 'Mạch máu cấp dưỡng',
        badge: 'Angio 3D',
        icon: '🩸',
        desc: 'Mạng lưới vi mạch động mạch và tĩnh mạch hồi lưu',
        action: () => {
          showToast(`🩸 Mạng vi mạch cấp máu cho ${mainName}`);
        }
      }
    ];

    relatedScroll.innerHTML = histologyTiles.map(tile => `
      <div class="related-tile" data-tile-id="${tile.id}" title="${tile.desc}">
        <div class="tile-icon-box">${tile.icon}</div>
        <div class="tile-texts">
          <span class="tile-badge">${tile.badge}</span>
          <strong class="tile-title">${tile.title}</strong>
        </div>
      </div>
    `).join('');

    relatedScroll.querySelectorAll('.related-tile').forEach(tileEl => {
      tileEl.addEventListener('click', () => {
        const found = histologyTiles.find(t => t.id === tileEl.dataset.tileId);
        if (found?.action) found.action();
      });
    });
  }

  // Update history buttons state
  notifySelectionHistoryChanged();
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

export function toggleCardBodyDropdown() {
  const body = document.getElementById('selectionCardBody');
  const arrow = document.querySelector('.info-header-arrow');
  if (!body) return;

  isBodyCollapsed = !isBodyCollapsed;
  body.classList.toggle('collapsed-dropdown', isBodyCollapsed);
  if (arrow) {
    arrow.style.transform = isBodyCollapsed ? 'rotate(-90deg)' : 'rotate(0deg)';
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
  const textToSpeak = clinical.speakTextVi || clinical.nameVi || part.displayName || part.id;
  const cleanSpeech = textToSpeak
    .replace(/\(.*?\)/g, '')
    .replace(/[._]/g, ' ')
    .replace(/\s+/g, ' ')
    .trim();

  if ('speechSynthesis' in window) {
    window.speechSynthesis.cancel();
    const utterance = new SpeechSynthesisUtterance(cleanSpeech);
    utterance.lang = 'vi-VN';
    utterance.rate = 0.9;

    // Select Vietnamese voice if available in browser
    const voices = window.speechSynthesis.getVoices();
    const viVoice = voices.find(v => v.lang === 'vi-VN' || v.lang.startsWith('vi'));
    if (viVoice) {
      utterance.voice = viVoice;
    }

    window.speechSynthesis.speak(utterance);
    showToast(`🔊 Đang đọc: ${cleanSpeech}`);
  } else {
    showToast('Trình duyệt không hỗ trợ tổng hợp giọng nói Web Speech.');
  }
}

function handleRadiusBlast(viewer) {
  const part = state.selectedPart;
  if (!part) return;

  showToast('💥 Đang bóc tách vùng bán kính lân cận (Radius Blast)...');
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

function showHistologyPreview(structureName, title) {
  const modalHtml = `
    <div class="atlas-hub-modal" id="histologyPreviewModal">
      <div class="atlas-hub-backdrop" id="histologyBackdrop"></div>
      <div class="study-dialog" style="max-width: 520px; padding: 20px; text-align: center;">
        <div class="study-dialog-header">
          <h3 style="margin: 0; font-size: 16px;">🔬 ${title}</h3>
          <button type="button" class="dialog-close-btn" id="histologyCloseBtn">&times;</button>
        </div>
        <p style="color: #0284c7; font-weight: 600; font-size: 13px; margin: 6px 0 14px;">${structureName}</p>
        <div style="width: 100%; height: 260px; border-radius: 12px; background: #0f172a; display: flex; align-items: center; justify-content: center; overflow: hidden; position: relative; border: 1px solid #334155;">
          <div style="color: #94a3b8; font-size: 13px; padding: 20px; line-height: 1.6;">
            <span style="font-size: 36px; display: block; margin-bottom: 8px;">🔬</span>
            <strong>Hình ảnh vi thể kính hiển vi quang học (Nhuộm HE 40x)</strong>
            <p style="margin: 6px 0 0; color: #64748b; font-size: 12px;">Hiển thị nguyên bào sợi, chất căn bản ngoại bào và các bó sợi collagen đan xen.</p>
          </div>
        </div>
      </div>
    </div>
  `;

  const container = document.createElement('div');
  container.innerHTML = modalHtml;
  document.body.appendChild(container);

  const close = () => container.remove();
  container.querySelector('#histologyCloseBtn')?.addEventListener('click', close);
  container.querySelector('#histologyBackdrop')?.addEventListener('click', close);
}
