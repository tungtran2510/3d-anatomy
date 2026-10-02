// Advanced Anatomy Information Panel Controller (Visible Body & Atlas 2027 Standard)
// Manages: History Navigation (< >), Full/Compact Mode, Model Orientation (Đứng/Nằm ngửa/Nằm sấp/Bàn mổ),
// Audio Pronunciation, Anatomical Hierarchy Tree, 3D Structure Tagging, Learn More & Histology Thumbnails
import { state } from '../state/store.js';
import { getClinicalData } from '../data/clinicalInfo.js';
import { setModelOrientation, toggleDissectionTable, getCurrentOrientation, getTableVisibility } from '../viewer/orientationManager.js';
import { openLesson, showToast, selectStructureAnywhere } from './sidebar.js';
import { openAIAssistant } from './aiAssistantModal.js';
import { hidePart, isolatePart, setPartTransparency, restoreAllParts } from '../viewer/visibility.js';
import { canGoBackSelection, canGoForwardSelection, navigateSelectionHistory, notifySelectionHistoryChanged, selectPartById, zoomIntoCurrentSelection, zoomOutSelectionOverview } from '../viewer/selection.js';
import { setView, getCurrentView } from '../viewer/camera.js';
import { addCustomTag, clearCustomTags } from '../viewer/labels.js';
import { getPartVideo, removePartVideo, isAdminLoggedIn } from '../data/atlasMediaManager.js';
import { getLocalVideoBlobUrl } from '../data/videoStore.js';
import { openQuickVideoModal } from './quickVideoModal.js';
import { openVideoModal } from './sidebar.js';

let isCompact = false;
let isBodyCollapsed = false;
let isZoomedIn = false;
let currentlySpeakingBtn = null;

let isInfoPanelInitialized = false;

export function initInfoPanel(viewer) {
  const card = document.getElementById('selectionCard');
  if (!card || isInfoPanelInitialized) return;
  isInfoPanelInitialized = true;

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

  // 2b. Section Explanation TTS Speaker Buttons (Đọc tiếng Việt chuẩn y khoa cho từng mục)
  document.getElementById('btnSpeakDesc')?.addEventListener('click', (e) => {
    e.stopPropagation();
    const text = document.getElementById('cardExplainDesc')?.textContent || '';
    const btn = document.getElementById('btnSpeakDesc');
    speakSectionExplanation(text, btn, 'Bản chất & Khái niệm');
  });

  document.getElementById('btnSpeakFunc')?.addEventListener('click', (e) => {
    e.stopPropagation();
    const text = document.getElementById('cardExplainFunc')?.textContent || '';
    const btn = document.getElementById('btnSpeakFunc');
    speakSectionExplanation(text, btn, 'Ý nghĩa & Chức năng');
  });

  document.getElementById('btnSpeakRel')?.addEventListener('click', (e) => {
    e.stopPropagation();
    const text = document.getElementById('cardExplainRel')?.textContent || '';
    const btn = document.getElementById('btnSpeakRel');
    speakSectionExplanation(text, btn, 'Vị trí & Liên kết giải phẫu');
  });

  // 2c. Floating Top View Button (Nhìn từ trên đỉnh đầu)
  document.getElementById('btnQuickTopView')?.addEventListener('click', () => {
    const curView = getCurrentView?.();
    if (curView === 'top') {
      setView('front', viewer);
      showToast('🔄 Trở về góc nhìn chính diện');
    } else {
      setView('top', viewer);
      showToast('⬇️ Góc nhìn từ trên đỉnh đầu (Top View)');
    }
  });

  // 3a. Mini-Bar Interactions (1-2 line mode)
  const miniExpandBtn = document.getElementById('btnMiniExpand');
  const miniTrigger = document.getElementById('miniBarExpandTrigger');
  const miniAudioBtn = document.getElementById('btnMiniAudio');
  const miniZoomBtn = document.getElementById('btnMiniZoom');
  const miniCloseBtn = document.getElementById('btnMiniClose');

  miniExpandBtn?.addEventListener('click', (e) => {
    e.stopPropagation();
    setCompactMode(false);
  });

  miniTrigger?.addEventListener('click', (e) => {
    e.stopPropagation();
    setCompactMode(false);
  });

  miniAudioBtn?.addEventListener('click', (e) => {
    e.stopPropagation();
    speakCurrentStructure();
  });

  miniZoomBtn?.addEventListener('click', async (e) => {
    e.stopPropagation();
    isZoomedIn = !isZoomedIn;
    updateZoomStepButtonUI();
    if (isZoomedIn) {
      await zoomIntoCurrentSelection(viewer);
      showToast('🔍 Đã phóng to chi tiết cấu trúc');
    } else {
      await zoomOutSelectionOverview(viewer);
      showToast('🌐 Đã trở về góc nhìn bao quát');
    }
  });

  miniCloseBtn?.addEventListener('click', (e) => {
    e.stopPropagation();
    card.classList.add('hidden');
    showToast('Đã thu gọn thanh (Cấu trúc vẫn đang được chỉ điểm 📍)');
  });

  window.addEventListener('expand-selection-card', () => {
    setCompactMode(false);
  });

  // 3. Compact Mode & Dropdown Toggles
  const toggleCompactBtn = document.getElementById('btnToggleCompactCard');
  const compactBar = document.getElementById('btnSwitchCompactMode');
  const toggleDropdownBtn = document.getElementById('btnToggleInfoDropdown');

  toggleCompactBtn?.addEventListener('click', (e) => {
    e.stopPropagation();
    setCompactMode(true);
  });

  compactBar?.addEventListener('click', (e) => {
    e.stopPropagation();
    setCompactMode(true);
  });

  toggleDropdownBtn?.addEventListener('click', (e) => {
    e.stopPropagation();
    setCompactMode(true);
  });

  // 3b. 2-Step Zoom / Overview Toggle (Không zoom giật đột ngột, chỉ phóng to khi người dùng bấm)
  const toggleZoomBtn = document.getElementById('btnToggleZoomStep');
  toggleZoomBtn?.addEventListener('click', async (e) => {
    e.stopPropagation();
    isZoomedIn = !isZoomedIn;
    updateZoomStepButtonUI();
    if (isZoomedIn) {
      await zoomIntoCurrentSelection(viewer);
      showToast('🔍 Đã phóng to chi tiết cấu trúc');
    } else {
      await zoomOutSelectionOverview(viewer);
      showToast('🌐 Đã trở về góc nhìn bao quát');
    }
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

  const cardBody = document.getElementById('selectionCardBody');
  if (cardBody) {
    cardBody.scrollTop = 0;
    cardBody.scrollLeft = 0;
  }

  const clinical = getClinicalData(part.id);
  const lang = state.language || 'vi';

  // 1. Title & Subtitle (Visible Body Prominent Anatomy Teal Header)
  const cardTitle = document.getElementById('cardTitle');
  const cardSubtitle = document.getElementById('cardSubtitle');
  const cardCompactLabel = document.getElementById('cardCompactLabel');

  const mainName = clinical.nameVi || part.info?.name?.[lang] || part.displayName || part.id;
  const latinName = clinical.nameLatin || part.info?.latinName || '';
  const systemName = clinical.systemVi || part.system || '';

  if (cardTitle) cardTitle.textContent = mainName;
  if (cardCompactLabel) cardCompactLabel.textContent = mainName;
  if (cardSubtitle) {
    cardSubtitle.textContent = latinName ? `${latinName} • ${systemName}` : systemName;
  }

  // Populate 1-to-2 line Mini-Bar
  const miniTitle = document.getElementById('miniCardTitle');
  const miniLatin = document.getElementById('miniCardLatin');
  const miniDesc = document.getElementById('miniCardDesc');
  if (miniTitle) miniTitle.textContent = mainName;
  if (miniLatin) miniLatin.textContent = latinName ? `(${latinName})` : '';
  if (miniDesc) {
    const rawDesc = clinical.description || '';
    const firstSentence = rawDesc.split(/[\.\!\?]\s+/)[0] || rawDesc;
    miniDesc.textContent = firstSentence ? `${firstSentence}.` : 'Chạm "Xem thêm" để đọc chi tiết giải phẫu.';
  }

  // 2. Core Anatomical Explanation (Là gì, Ý nghĩa là gì, Liên kết ra sao - Ưu tiên ở trên đầu)
  const explainDesc = document.getElementById('cardExplainDesc');
  const explainFunc = document.getElementById('cardExplainFunc');
  const explainRel = document.getElementById('cardExplainRel');

  if (explainDesc) explainDesc.textContent = clinical.description || 'Đang cập nhật thông tin giải phẫu học...';
  if (explainFunc) explainFunc.textContent = clinical.function || 'Đang cập nhật chức năng sinh lý & cơ học...';
  if (explainRel) explainRel.textContent = clinical.relationsText || 'Đang cập nhật liên kết giải phẫu...';

  // Stop any previous active speech synthesis when changing structure
  stopCurrentSpeech();

  // 2b. Render Dynamic Flow Pathway (Đường đi & Chu trình giải phẫu - Dịch não tủy, Gan mật tụy, Tim mạch)
  renderDynamicPathway(part, clinical, mainName);

  // 2c. Render Video Bài Giảng & Minh Họa Giải Phẫu (YouTube & MP4 Tự Động Nén)
  renderPartVideoSection(part, clinical, mainName, viewer);

  // 3. Update Orientation UI Buttons & Zoom Step UI
  updateOrientationButtons();
  isZoomedIn = false;
  updateZoomStepButtonUI();

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

export function updateZoomStepButtonUI() {
  const btn = document.getElementById('btnToggleZoomStep');
  if (!btn) return;
  const textEl = btn.querySelector('.btn-zoom-step-text');
  if (textEl) {
    textEl.textContent = isZoomedIn ? 'Toàn cảnh' : 'Phóng to';
  }
  btn.title = isZoomedIn ? 'Thu nhỏ toàn cảnh (Overview)' : 'Phóng to chi tiết (Zoom closer)';
  btn.classList.toggle('active', isZoomedIn);
  const zoomInIcon = btn.querySelector('.icon-zoom-in');
  if (zoomInIcon) {
    zoomInIcon.innerHTML = isZoomedIn
      ? '<circle cx="11" cy="11" r="8"/><line x1="21" y1="21" x2="16.65" y2="16.65"/><line x1="8" y1="11" x2="14" y2="11"/>'
      : '<circle cx="11" cy="11" r="8"/><line x1="21" y1="21" x2="16.65" y2="16.65"/><line x1="11" y1="8" x2="11" y2="14"/><line x1="8" y1="11" x2="14" y2="11"/>';
  }
}

function cleanMedicalSpeech(rawText) {
  if (!rawText) return '';
  return rawText
    .replace(/\([A-Z0-9_:\s.-]+\)/gi, '')
    .replace(/(\d+)\s*cm\b/gi, '$1 xen ti mét')
    .replace(/(\d+)\s*mm\b/gi, '$1 mi li mét')
    .replace(/(\d+)\s*g\b/gi, '$1 gam')
    .replace(/(\d+)\s*kg\b/gi, '$1 ki lô gam')
    .replace(/(\d+)\s*ml\b/gi, '$1 mi li lít')
    .replace(/~/g, 'khoảng ')
    .replace(/\bCSF\b/g, 'dịch não tủy')
    .replace(/→/g, ', dẫn tới ')
    .replace(/&/g, 'và')
    .replace(/[()[\]]/g, ' ')
    .replace(/[:;]/g, ', ')
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

function speakSectionExplanation(text, btnEl, sectionLabel) {
  if (!text || !('speechSynthesis' in window)) {
    showToast('Trình duyệt không hỗ trợ đọc giọng nói Web Speech.');
    return;
  }

  // If already speaking this button, clicking again stops speech
  if (btnEl && btnEl.classList.contains('is-speaking')) {
    stopCurrentSpeech();
    showToast('⏹️ Đã dừng đọc');
    return;
  }

  stopCurrentSpeech();

  const clean = cleanMedicalSpeech(text);
  if (!clean) return;

  const utterance = new SpeechSynthesisUtterance(clean);
  utterance.lang = 'vi-VN';
  utterance.rate = 0.95; // Natural medical cadence

  const voices = window.speechSynthesis.getVoices();
  const viVoice = voices.find(v => v.lang === 'vi-VN' || v.lang.startsWith('vi'));
  if (viVoice) {
    utterance.voice = viVoice;
  }

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
  showToast(`🔊 Đang đọc: ${sectionLabel}`);
}

function speakCurrentStructure() {
  const part = state.selectedPart;
  if (!part) return;

  const clinical = getClinicalData(part.id);
  const textToSpeak = clinical.speakTextVi || clinical.nameVi || part.displayName || part.id;
  const cleanSpeech = cleanMedicalSpeech(textToSpeak);

  const audioBtn = document.getElementById('btnPronounceAudio');
  speakSectionExplanation(cleanSpeech, audioBtn, cleanSpeech);
}

// Physiological & Anatomical Circulation Pathways (Đường đi & Chu trình giải phẫu trực quan)
const ANATOMICAL_PATHWAYS = [
  {
    id: 'csf_pathway',
    title: '🌊 Chu Trình Tuần Hoàn Dịch Não Tủy (CSF Flow)',
    match: (partId, nameVi, lower) =>
      (/ventricle|choroid|aqueduct|spinal dura|dura|csf/i.test(partId) && !/left ventricle|right ventricle|cordis/i.test(partId)) ||
      lower.includes('não thất') || lower.includes('dịch não tủy') || lower.includes('cống não') || lower.includes('màng mạch') || lower.includes('màng cứng'),
    steps: [
      { num: '1', name: 'Đám rối màng mạch', partId: 'Choroid plexus.l', subtitle: 'Tiết ~500ml CSF/ngày' },
      { num: '2', name: 'Não thất bên (2 bên)', partId: 'Lateral ventricle.l', subtitle: 'Khoang hình chữ C' },
      { num: '3', name: 'Não thất ba', partId: 'Third ventricle', subtitle: 'Gian não (Lỗ Monro)' },
      { num: '4', name: 'Cống não Sylvius', partId: 'Aqueduct of midbrain', fallbackId: 'Fourth ventricle', subtitle: 'Eo thắt 1-2mm qua trung não' },
      { num: '5', name: 'Não thất tư', partId: 'Fourth ventricle', subtitle: 'Hố trám & 3 lỗ thoát' },
      { num: '6', name: 'Khoang dưới nhện & Tủy', partId: 'Spinal dura', subtitle: 'Bao bọc não - tủy sống' }
    ],
    note: '💡 Dịch não tủy lưu thông liên tục từ các buồng não thất ra khoang dưới nhện bao bọc toàn bộ não và tủy sống, hoạt động như đệm thủy lực giảm chấn và thanh thải độc tố hệ Glymphatic.'
  },
  {
    id: 'biliary_pathway',
    title: '🌿 Chu Trình Dòng Chảy Mật & Dịch Tụy (Biliary-Pancreatic)',
    match: (partId, nameVi, lower) =>
      /liver|gall|pancrea|bile|chole|cystic|ductus/i.test(partId) ||
      lower.includes('gan') || lower.includes('mật') || lower.includes('tụy') || lower.includes('túi mật'),
    steps: [
      { num: '1', name: 'Gan (Nhu mô gan)', partId: 'Liver', subtitle: 'Sản xuất dịch mật' },
      { num: '2', name: 'Túi mật & Ống túi mật', partId: 'Gallbladder', subtitle: 'Cô đặc & dự trữ mật' },
      { num: '3', name: 'Ống mật chủ', partId: 'Bile duct', fallbackId: 'Gallbladder', subtitle: 'Dẫn mật xuống ruột' },
      { num: '4', name: 'Tuyến tụy & Ống tụy', partId: 'Pancreas', subtitle: 'Tiết men tiêu hóa & Insulin' },
      { num: '5', name: 'Tá tràng (Bóng Vater)', partId: 'Duodenum', subtitle: 'Hòa trộn nhũ trấp thức ăn' }
    ],
    note: '💡 Mật từ gan qua túi mật hòa cùng dịch tụy tại bóng Vater đổ vào tá tràng để tiêu hóa lipid chất béo.'
  },
  {
    id: 'cardiac_circuit',
    title: '❤️ Vòng Tuần Hoàn Tim Phổi & Đại Tuần Hoàn',
    match: (partId, nameVi, lower) =>
      (/ventricle|atrium|aort|pulmonary/i.test(partId) && !/lateral|third|fourth/i.test(partId)) ||
      lower.includes('tâm thất') || lower.includes('tâm nhĩ') || lower.includes('động mạch chủ') || lower.includes('van tim'),
    steps: [
      { num: '1', name: 'Tâm nhĩ phải', partId: 'Right atrium', subtitle: 'Nhận máu tĩnh mạch nghèo O₂' },
      { num: '2', name: 'Tâm thất phải', partId: 'Right ventricle', subtitle: 'Bơm máu lên động mạch phổi' },
      { num: '3', name: 'Thân ĐM phổi', partId: 'Pulmonary trunk', subtitle: 'Trao đổi khí tại phế nang' },
      { num: '4', name: 'Tâm nhĩ trái', partId: 'Left atrium', subtitle: 'Nhận máu giàu O₂ từ phổi' },
      { num: '5', name: 'Tâm thất trái', partId: 'Left ventricle', subtitle: 'Buồng bóp áp lực cao nhất' },
      { num: '6', name: 'Cung ĐM chủ', partId: 'Aorta', subtitle: 'Phân phối máu đi nuôi toàn thân' }
    ],
    note: '💡 Chu chuyển tim co bóp nhịp nhàng 60-80 lần/phút tống máu qua 2 vòng tiểu tuần hoàn phổi và đại tuần hoàn toàn thân.'
  }
];

function renderDynamicPathway(part, clinical, mainName) {
  const section = document.getElementById('cardPathwaySection');
  const container = document.getElementById('cardPathwayContainer');
  const titleEl = document.getElementById('cardPathwayHeaderTitle');
  if (!section || !container) return;

  const partId = part.id || '';
  const lower = (partId + ' ' + mainName + ' ' + (clinical.systemVi || '')).toLowerCase();

  const matched = ANATOMICAL_PATHWAYS.find(p => p.match(partId, mainName, lower));
  if (!matched) {
    section.classList.add('hidden');
    container.innerHTML = '';
    return;
  }

  if (titleEl) titleEl.textContent = matched.title;
  section.classList.remove('hidden');

  container.innerHTML = `
    <div class="pathway-flow-scroll">
      ${matched.steps.map((step, idx) => {
        const isCurrent = partId.toLowerCase().includes(step.partId.toLowerCase()) || 
                          (step.fallbackId && partId.toLowerCase().includes(step.fallbackId.toLowerCase()));
        return `
          <button type="button" class="pathway-step-btn ${isCurrent ? 'active' : ''}" data-part="${step.partId}" data-fallback="${step.fallbackId || ''}" title="Chạm để chuyển góc nhìn 3D tới ${step.name}">
            <span class="step-badge">${step.num}</span>
            <span class="step-main">
              <span class="step-name">${step.name}</span>
              <span class="step-sub">${step.subtitle}</span>
            </span>
          </button>
          ${idx < matched.steps.length - 1 ? '<span class="pathway-arrow">→</span>' : ''}
        `;
      }).join('')}
    </div>
    <div class="pathway-clinical-note">${matched.note}</div>
  `;

  // Bind click on each step to jump to that 3D structure
  container.querySelectorAll('.pathway-step-btn').forEach(btn => {
    btn.addEventListener('click', async (e) => {
      e.stopPropagation();
      const targetPart = btn.dataset.part;
      const fallbackPart = btn.dataset.fallback;
      showToast(`🎯 Định vị 3D: ${btn.querySelector('.step-name')?.textContent}`);
      try {
        await selectStructureAnywhere(targetPart);
      } catch {
        if (fallbackPart) await selectStructureAnywhere(fallbackPart);
      }
    });
  });
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

// -----------------------------------------------------------------------------
// RENDER KHỐI VIDEO MINH HỌA GIẢI PHẪU (YOUTUBE & MP4 NỘI BỘ KÈM NÉN)
// -----------------------------------------------------------------------------
function renderPartVideoSection(part, clinical, mainName, viewer) {
  const section = document.getElementById('cardVideoSection');
  if (!section) return;

  const video = getPartVideo(part.id);
  const isAdmin = isAdminLoggedIn();

  if (video) {
    section.classList.remove('hidden');
    section.innerHTML = `
      <div class="part-video-card">
        <div class="part-video-header">
          <span class="part-video-tag">🎬 Video Minh Họa Y Khoa</span>
          <span class="part-video-duration">${video.duration || '0:45'}</span>
        </div>
        <div class="part-video-preview" id="btnPlayPartVideo" title="Chạm để phát video">
          <div class="part-video-poster" style="background-image: url('${video.thumbnail || './images/atlas/med_skin.png'}')"></div>
          <div class="part-video-play-overlay">
            <div class="play-circle">
              <svg width="22" height="22" viewBox="0 0 24 24" fill="currentColor"><polygon points="5 3 19 12 5 21 5 3"/></svg>
            </div>
            <span class="play-label">Chạm để phát video</span>
          </div>
        </div>
        <div class="part-video-title">${video.title}</div>
        <div class="part-video-toolbar">
          <button type="button" class="btn-video-watch" id="btnWatchPartVideo">
            <svg width="15" height="15" viewBox="0 0 24 24" fill="currentColor"><polygon points="5 3 19 12 5 21 5 3"/></svg>
            <span>Phát Video</span>
          </button>
          <button type="button" class="btn-video-edit-admin" id="btnAdminEditVideo" title="Đổi hoặc gắn video mới">
            <span>⚙️ Đổi Video</span>
          </button>
          ${video.isDefault ? '' : `
            <button type="button" class="btn-video-remove-admin" id="btnAdminRemoveVideo" title="Gỡ video khỏi bộ phận này">
              <span>🗑️ Gỡ</span>
            </button>
          `}
        </div>
      </div>
    `;

    const playAction = async (e) => {
      e?.stopPropagation();
      let playUrl = video.videoUrl;
      if (video.localVideoId) {
        const blobUrl = await getLocalVideoBlobUrl(video.localVideoId);
        if (blobUrl) playUrl = blobUrl;
      }
      openVideoModal(playUrl, video.title);
    };

    section.querySelector('#btnPlayPartVideo')?.addEventListener('click', playAction);
    section.querySelector('#btnWatchPartVideo')?.addEventListener('click', playAction);

    section.querySelector('#btnAdminEditVideo')?.addEventListener('click', (e) => {
      e.stopPropagation();
      openQuickVideoModal(part.id, mainName, () => updateInfoPanelContent(part, viewer));
    });

    section.querySelector('#btnAdminRemoveVideo')?.addEventListener('click', (e) => {
      e.stopPropagation();
      if (confirm(`Gỡ video khỏi bộ phận ${mainName}?`)) {
        removePartVideo(part.id);
        showToast(`✓ Đã gỡ video khỏi ${mainName}`);
        updateInfoPanelContent(part, viewer);
      }
    });

  } else {
    // Chưa có video gắn cho bộ phận này
    section.classList.remove('hidden');
    section.innerHTML = `
      <div class="part-video-card empty-card">
        <div class="empty-video-info">
          <span class="empty-icon">🎬</span>
          <div class="empty-text-wrap">
            <strong class="empty-title">Chưa có video cho ${mainName}</strong>
            <span class="empty-desc">Gắn link YouTube hoặc tải video MP4 từ máy để học tập trực quan.</span>
          </div>
        </div>
        <button type="button" class="btn-add-organ-video" id="btnAdminAddOrganVideo" title="Thêm video YouTube hoặc file MP4 từ máy">
          <span>➕ Gắn Video Cho Bộ Phận Này</span>
        </button>
      </div>
    `;

    section.querySelector('#btnAdminAddOrganVideo')?.addEventListener('click', (e) => {
      e.stopPropagation();
      openQuickVideoModal(part.id, mainName, () => updateInfoPanelContent(part, viewer));
    });
  }
}
