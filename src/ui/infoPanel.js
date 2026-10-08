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
import { getVisualDeckForPart } from '../data/anatomyConcepts.js';
import { dynamicAnatomy, MOTIONS } from '../viewer/dynamicAnatomy.js';
import { CLINICAL_AXES } from '../data/clinicalAxesData.js';
import { openClinicalAxesModal } from './clinicalAxesModal.js';
import { openImageZoomModal } from './imageZoomModal.js';
import { getConstituentsForPart } from '../data/anatomyConstituents.js';
import { formatNameWithSubtitles } from '../utils/textFormatters.js';

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
      showToast('⬇️ Góc nhìn từ trên đỉnh đầu');
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

  // Synchronize history buttons initial state
  notifySelectionHistoryChanged();
}

export function updateInfoPanelContent(part, viewer) {
  if (!part) return;

  // Stop previous text-to-speech audio to prevent audio overlap
  if (typeof window !== 'undefined' && window.speechSynthesis) {
    window.speechSynthesis.cancel();
  }

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

  if (cardTitle) cardTitle.innerHTML = formatNameWithSubtitles(mainName);
  if (cardCompactLabel) cardCompactLabel.textContent = 'Chi tiết giải phẫu';

  let cleanLatin = (latinName || '').trim();
  cleanLatin = cleanLatin.replace(/\s*\((TA2:[^)]+)\)/i, ' · $1');
  if (cleanLatin.startsWith('(') && cleanLatin.endsWith(')')) {
    cleanLatin = cleanLatin.slice(1, -1).trim();
  }
  // Loại bỏ hoàn toàn các chuỗi rác như ???????? hoặc null/undefined
  if (/^[?\s\-_]+$/.test(cleanLatin) || cleanLatin.toLowerCase() === 'null' || cleanLatin.toLowerCase() === 'undefined') {
    cleanLatin = '';
  }

  if (cardSubtitle) {
    cardSubtitle.textContent = cleanLatin ? `${cleanLatin} • ${systemName}` : systemName;
  }

  // Populate 1-to-2 line Mini-Bar
  const miniTitle = document.getElementById('miniCardTitle');
  const miniLatin = document.getElementById('miniCardLatin');
  const miniDesc = document.getElementById('miniCardDesc');
  if (miniTitle) miniTitle.innerHTML = formatNameWithSubtitles(mainName);
  if (miniLatin) {
    if (cleanLatin) {
      miniLatin.textContent = `(${cleanLatin})`;
      miniLatin.style.display = '';
    } else {
      miniLatin.textContent = '';
      miniLatin.style.display = 'none';
    }
  }
  if (miniDesc) {
    const rawDesc = clinical.description || '';
    const firstSentence = rawDesc.split(/[\.\!\?]\s+/)[0] || rawDesc;
    miniDesc.textContent = firstSentence ? `${firstSentence}.` : 'Chạm "Xem thêm" để đọc chi tiết giải phẫu.';
  }

  // 2. Core Anatomical Explanation (Ngắn gọn 1-2 câu ứng dụng thực tế, không lý thuyết dài dòng)
  const explainDesc = document.getElementById('cardExplainDesc');
  const explainFunc = document.getElementById('cardExplainFunc');
  const explainRel = document.getElementById('cardExplainRel');

  if (explainDesc) {
    const raw = clinical.description || 'Đang cập nhật thông tin giải phẫu học...';
    explainDesc.textContent = raw.split(/[\.\!\?]\s+/)[0] + '.';
  }
  if (explainFunc) {
    const raw = clinical.function || clinical.clinical || 'Đang cập nhật chức năng sinh lý & cơ học...';
    explainFunc.textContent = raw.split(/[\.\!\?]\s+/)[0] + '.';
  }
  const relBlock = document.querySelector('.explain-rel');
  if (relBlock) relBlock.style.display = 'none';

  // Stop any previous active speech synthesis when changing structure
  // 2a.0 Render One-Tap Axis Link if part belongs to a clinical axis
  renderClinicalAxisOneTap(part, viewer);

  // 2a. Render Interactive Disc Subunits (Vòng sợi & Nhân nhầy)
  renderDiscSubunitsSection(part, clinical, mainName, viewer);

  // 2a.1 Render 3D Joint Kinematics & Range of Motion (Choice 2)
  renderJointKinematicsSection(part, clinical, mainName, viewer);

  // 2b. Render Dynamic Flow Pathway (Đường đi & Chu trình giải phẫu - Dịch não tủy, Gan mật tụy, Tim mạch)
  renderDynamicPathway(part, clinical, mainName);

  // 2c. Render Video Bài Giảng & Minh Họa Giải Phẫu (YouTube & MP4 Tự Động Nén)
  renderPartVideoSection(part, clinical, mainName, viewer);

  // 3. Update Orientation UI Buttons & Zoom Step UI
  updateOrientationButtons();
  isZoomedIn = false;
  updateZoomStepButtonUI();

  // 3. Render Interactive Anatomical Hierarchy Tree (Gọn gàng, tinh tế)
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

  // 4. Render Cấu tạo chi tiết & Các bộ phận trực quan (Interactive Subparts Chips)
  renderAnatomyConstituents(part, clinical, mainName, viewer);

  // 5. Render Hình ảnh giải phẫu cấu tạo độ phân giải cao (High-Res Visual Diagram with Fullscreen Zoom)
  renderAnatomyPhotoSection(part, clinical, mainName);

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
  btn.title = isZoomedIn ? 'Thu nhỏ toàn cảnh' : 'Phóng to chi tiết';
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
    title: '🌊 Chu Trình Tuần Hoàn Dịch Não Tủy',
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
    title: '🌿 Chu Trình Dòng Chảy Mật & Dịch Tụy',
    match: (partId, nameVi, lower) =>
      /liver|gall|pancrea|bile|chole|cystic|ductus/i.test(partId) ||
      lower.includes('gan') || lower.includes('mật') || lower.includes('tụy') || lower.includes('túi mật'),
    steps: [
      { num: '1', name: 'Gan', partId: 'Liver', subtitle: 'Sản xuất dịch mật' },
      { num: '2', name: 'Túi mật', partId: 'Gallbladder', subtitle: 'Cô đặc & dự trữ mật' },
      { num: '3', name: 'Ống mật chủ', partId: 'Bile duct', fallbackId: 'Gallbladder', subtitle: 'Dẫn mật xuống ruột' },
      { num: '4', name: 'Tuyến tụy', partId: 'Pancreas', subtitle: 'Tiết men tiêu hóa & Insulin' },
      { num: '5', name: 'Tá tràng', partId: 'Duodenum', subtitle: 'Hòa trộn nhũ trấp thức ăn' }
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
      { num: '1', name: 'Nhĩ phải', partId: 'Right atrium', subtitle: 'Nhận máu tĩnh mạch nghèo O₂' },
      { num: '2', name: 'Thất phải', partId: 'Right ventricle', subtitle: 'Bơm máu lên ĐM phổi' },
      { num: '3', name: 'ĐM phổi', partId: 'Pulmonary trunk', subtitle: 'Trao đổi khí phế nang' },
      { num: '4', name: 'Nhĩ trái', partId: 'Left atrium', subtitle: 'Nhận máu giàu O₂ từ phổi' },
      { num: '5', name: 'Thất trái', partId: 'Left ventricle', subtitle: 'Buồng bóp áp lực cao nhất' },
      { num: '6', name: 'ĐM chủ', partId: 'Aorta', subtitle: 'Phân phối máu toàn thân' }
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

  showToast('💥 Đang bóc tách vùng bán kính lân cận...');
  setPartTransparency(0.2);
  viewer?.render?.();
}

// -----------------------------------------------------------------------------
// RENDER CẤU TẠO CHI TIẾT & BỘ PHẬN TRỰC QUAN (INTERACTIVE SUBPARTS CHIPS)
// -----------------------------------------------------------------------------
function renderAnatomyConstituents(part, clinical, mainName, viewer) {
  const section = document.getElementById('cardConstituentsSection');
  const grid = document.getElementById('cardConstituentsGrid');
  const titleEl = document.getElementById('constituentsHeaderTitle');
  if (!section || !grid) return;

  const constituents = getConstituentsForPart(
    part.id,
    mainName,
    clinical?.systemVi || '',
    clinical?.regionVi || ''
  );

  if (!constituents || !constituents.subparts || constituents.subparts.length === 0) {
    section.classList.add('hidden');
    grid.innerHTML = '';
    return;
  }

  section.classList.remove('hidden');
  if (titleEl) {
    titleEl.textContent = `🧩 ${constituents.title || 'Cấu tạo chi tiết & Các bộ phận'}`;
  }

  grid.innerHTML = constituents.subparts.map((sub) => {
    return `
      <button type="button" class="constituent-chip" data-search="${sub.searchQuery || sub.name}" data-name="${sub.name}" title="Chạm để định vị 3D: ${sub.name}">
        <span class="chip-icon">${sub.icon || '🔹'}</span>
        <div class="chip-text-wrap">
          <span class="chip-name">${sub.name}</span>
          ${sub.latin ? `<span class="chip-latin">${sub.latin}</span>` : ''}
        </div>
      </button>
    `;
  }).join('');

  grid.querySelectorAll('.constituent-chip').forEach(btn => {
    btn.addEventListener('click', async (e) => {
      e.stopPropagation();
      const q = btn.dataset.search || btn.dataset.name;
      showToast(`🎯 Định vị 3D: ${btn.dataset.name}`);
      try {
        await selectStructureAnywhere(q);
      } catch (err) {
        console.warn('Cannot focus subpart:', err);
      }
    });
  });
}

// -----------------------------------------------------------------------------
// RENDER HÌNH ẢNH GIẢI PHẪU CẤU TẠO & PHÓNG TO TOÀN MÀN HÌNH (HIGH-RES LIGHTBOX)
// -----------------------------------------------------------------------------
function renderAnatomyPhotoSection(part, clinical, mainName) {
  const section = document.getElementById('cardAnatomyPhotoSection');
  const container = document.getElementById('cardAnatomyPhotoContainer');
  if (!section || !container) return;

  const constituents = getConstituentsForPart(
    part.id,
    mainName,
    clinical?.systemVi || '',
    clinical?.regionVi || ''
  );

  if (!constituents || !constituents.diagram) {
    section.classList.add('hidden');
    container.innerHTML = '';
    return;
  }

  section.classList.remove('hidden');
  container.innerHTML = `
    <div class="anatomy-photo-card" id="btnZoomAnatomyPhoto" title="Chạm để phóng to xem chi tiết toàn màn hình">
      <div class="photo-img-wrap">
        <img src="${constituents.diagram}" alt="${constituents.diagramCaption || mainName}" class="anatomy-photo-img" loading="lazy" />
        <span class="photo-zoom-badge">🔍 Chạm phóng to 2 ngón tay</span>
      </div>
      <div class="photo-caption-bar">
        <span class="photo-caption-text">${constituents.diagramCaption || constituents.title || mainName}</span>
        <button type="button" class="btn-fullscreen-diagram" aria-label="Xem toàn màn hình">
          <svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5"><polyline points="15 3 21 3 21 9"/><polyline points="9 21 3 21 3 15"/><line x1="21" y1="3" x2="14" y2="10"/><line x1="3" y1="21" x2="10" y2="14"/></svg>
        </button>
      </div>
    </div>
  `;

  const zoomHandler = (e) => {
    e.stopPropagation();
    openImageZoomModal({
      src: constituents.diagram,
      title: constituents.title || mainName,
      subtitle: constituents.diagramCaption || `Ảnh giải phẫu cấu tạo chi tiết: ${mainName}`
    });
  };

  container.querySelector('#btnZoomAnatomyPhoto')?.addEventListener('click', zoomHandler);
  container.querySelector('.btn-fullscreen-diagram')?.addEventListener('click', zoomHandler);
}

// -----------------------------------------------------------------------------
// RENDER KHỐI VIDEO MINH HỌA GIẢI PHẪU (YOUTUBE & MP4 NỘI BỘ KÈM NÉN)
// -----------------------------------------------------------------------------
function renderPartVideoSection(part, clinical, mainName, viewer) {
  const section = document.getElementById('cardVideoSection');
  if (!section) return;

  const video = getPartVideo(part.id);
  if (!video) {
    section.classList.add('hidden');
    section.innerHTML = '';
    return;
  }

  const isAdmin = isAdminLoggedIn();
  section.classList.remove('hidden');

  section.innerHTML = `
    <div class="info-group-title">
      <span>🎬 Video hoạt ảnh 3D y khoa</span>
    </div>
    <div class="part-microvideo-row" id="btnPlayPartVideo" title="Chạm để phát video hoạt ảnh 3D">
      <div class="microvideo-thumb-box">
        <img src="${video.thumbnail || './images/atlas/med_skin.png'}" class="microvideo-img" alt="${video.title}" loading="lazy" />
        <div class="microvideo-play-btn-circle">
          <svg width="13" height="13" viewBox="0 0 24 24" fill="currentColor"><polygon points="6 4 20 12 6 20 6 4"/></svg>
        </div>
        <span class="microvideo-duration">${video.duration || '0:40'}</span>
      </div>
      <div class="microvideo-details">
        <div class="microvideo-badge-row">
          <span class="microvideo-category-badge">${video.badge || 'Giải phẫu 3D'}</span>
          <span class="microvideo-tap-hint">Chạm xem ➔</span>
        </div>
        <div class="microvideo-title-text">${video.title}</div>
        <div class="microvideo-desc-text">${video.desc || video.subtitle}</div>
      </div>
      ${isAdmin ? `
        <button type="button" class="btn-microvideo-admin-edit" id="btnAdminEditVideo" title="Quản trị: Đổi video">
          ⚙️
        </button>
      ` : ''}
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

  if (isAdmin) {
    section.querySelector('#btnAdminEditVideo')?.addEventListener('click', (e) => {
      e.stopPropagation();
      openQuickVideoModal(part.id, mainName, () => updateInfoPanelContent(part, viewer));
    });
  }
}

function renderClinicalAxisOneTap(part, viewer) {
  let container = document.getElementById('cardAxisOneTapBox');
  if (!container) {
    const subtitleEl = document.getElementById('cardSubtitle');
    if (subtitleEl) {
      container = document.createElement('div');
      container.id = 'cardAxisOneTapBox';
      container.className = 'card-axis-onetap-box';
      subtitleEl.insertAdjacentElement('afterend', container);
    }
  }
  if (!container) return;

  const partId = part?.id || '';
  const partIdLower = partId.toLowerCase();
  let matchedAxis = null;

  for (const axis of CLINICAL_AXES) {
    const inSteps = axis.chainSteps.some(step => {
      if (step.partIds && step.partIds.some(p => p.toLowerCase() === partIdLower)) return true;
      if (step.partId && step.partId.toLowerCase() === partIdLower) return true;
      return false;
    });
    if (inSteps) {
      matchedAxis = axis;
      break;
    }
    if (axis.keywords.some(k => partIdLower.includes(k) || k.includes(partIdLower))) {
      matchedAxis = axis;
      break;
    }
  }

  if (matchedAxis) {
    container.innerHTML = `
      <button type="button" class="btn-one-tap-axis" id="btnOneTapAxis" title="Kích hoạt xem toàn bộ chuỗi trục ${matchedAxis.titleVi} trên 3D">
        <span class="onetap-icon">${matchedAxis.icon.slice(0, 2)}</span>
        <span class="onetap-text">Trục: <strong>${matchedAxis.titleVi.split('(')[0].trim()}</strong></span>
        <span class="onetap-arrow">➔ 3D</span>
      </button>
    `;
    container.style.display = 'block';

    const btn = container.querySelector('#btnOneTapAxis');
    btn?.addEventListener('click', (e) => {
      e.stopPropagation();
      openClinicalAxesModal(matchedAxis.id, viewer);
    });
  } else {
    container.style.display = 'none';
    container.innerHTML = '';
  }
}

function renderDiscSubunitsSection(part, clinical, mainName, viewer) {
  const container = document.getElementById('cardDiscSubunitsSection');
  if (!container) return;

  const partId = part?.id || '';
  const deck = getVisualDeckForPart(partId);

  // Exclusively dedicate this specialized micro-deck/simulator block to Intervertebral Discs & Herniation
  // All other organs use the cleaner, streamlined Constituents + Micro-Video + High-Res Photo blocks
  if (!deck || deck.id !== 'concept_intervertebral_disc') {
    container.classList.add('hidden');
    container.innerHTML = '';
    return;
  }

  container.classList.remove('hidden');
  const slides = deck.slides || [];
  const sim = deck.simulator || {
    title: '⚡ MÔ PHỎNG TIẾN TRIỂN LÂM SÀNG:',
    ticks: ['Bình thường', 'Giai đoạn 1', 'Giai đoạn 2', 'Nguy kịch'],
    stages: [
      { level: 'Cấp 0: Bình thường', desc: 'Cấu trúc giải phẫu bình thường, không tổn thương.' },
      { level: 'Cấp 1: Giai đoạn sớm', desc: 'Tổn thương vi thể chưa gây biến chứng.' },
      { level: 'Cấp 2: Tiến triển', desc: 'Có biểu hiện lâm sàng đau hoặc chèn ép.' },
      { level: 'Cấp 3: Nguy kịch', desc: 'Biến chứng cấp tính đe dọa chức năng cơ quan.' }
    ]
  };

  let currentSlide = 0;

  const deckHtml = slides.length > 0 ? `
    <div class="disc-visual-deck">
      <div class="deck-slide-frame" id="deckSlideFrame" title="Chạm để phóng to xem chi tiết vi thể">
        <img src="${slides[0].image}" class="deck-slide-img" id="deckSlideImg" alt="${slides[0].title}" />
        <span class="deck-slide-badge" id="deckSlideBadge">${slides[0].badge}</span>
        <span class="deck-slide-zoom-hint">🔍 Chạm phóng to</span>
        ${deck.video ? `<button type="button" class="btn-deck-video" id="btnDeckVideo">▶ Video 3D</button>` : ''}
      </div>
      <div class="deck-nav-pills" id="deckPills">
        ${slides.map((s, idx) => `
          <button type="button" class="deck-pill ${idx === 0 ? 'active' : ''}" data-slide="${idx}">
            ${s.title}
          </button>
        `).join('')}
      </div>
    </div>
  ` : '';

  const simHtml = `
    <div class="herniation-simulator-box">
      <div class="herniation-sim-header">
        <span class="herniation-sim-title">${sim.title}</span>
        <span class="herniation-sim-status" id="herniationStageLabel">${sim.stages[0]?.level || 'Cấp 0'}</span>
      </div>
      <div class="herniation-slider-wrap">
        <input type="range" min="0" max="${sim.stages.length - 1}" value="0" step="1" class="herniation-range" id="herniationRange" />
        <div class="herniation-ticks">
          ${sim.ticks.map((t, i) => `<span class="${i === sim.ticks.length - 1 ? 'text-danger' : ''}">${t}</span>`).join('')}
        </div>
      </div>
      <div class="herniation-desc-pill" id="herniationStageDesc">
        ${sim.stages[0]?.desc || ''}
      </div>
    </div>
  `;

  const subunitsHtml = (deck.subunits && deck.subunits.length > 0) ? `
    <div class="disc-subunits-chips">
      ${deck.subunits.slice(0, 4).map(sub => {
        const isActive = sub.partId === partId;
        return `
          <button type="button" class="sub-chip-btn ${isActive ? 'active' : ''}" data-part="${sub.partId}" title="${sub.note}">
            <span>${sub.label}</span>
          </button>
        `;
      }).join('')}
    </div>
  ` : '';

  // Dynamic Header Title (Strict 1-line)
  let headerTitle = `🔬 CẤU TRÚC GIẢI PHẪU CHUYÊN SÂU`;
  if (deck.id === 'concept_intervertebral_disc') {
    const isDisc = partId.startsWith('Intervertebral disc ');
    const isNucleus = partId.startsWith('Nucleus pulposus ');
    const level = isDisc ? partId.slice('Intervertebral disc '.length) : (isNucleus ? partId.slice('Nucleus pulposus '.length) : 'L4-L5');
    headerTitle = `🔬 ĐĨA ĐỆM CỘT SỐNG ${level}`;
  } else if (deck.id === 'concept_circle_of_willis') {
    headerTitle = `🧠 ĐA GIÁC WILLIS NÃO`;
  } else if (deck.id === 'concept_hepatobiliary_pancreas') {
    headerTitle = `🧪 GAN – MẬT – TUYẾN TỤY`;
  } else if (deck.id === 'concept_knee_joint_ligaments') {
    headerTitle = `🦴 KHỚP GỐI & DÂY CHẰNG CHÉO`;
  } else if (deck.id === 'concept_gastrointestinal_tract') {
    headerTitle = `🥣 HỆ TIÊU HÓA & VI THỂ DẠ DÀY`;
  } else if (deck.id === 'concept_cardiac_valves') {
    headerTitle = `🫀 TIM MẠCH & 4 BUỒNG TIM`;
  } else if (deck.id === 'concept_respiratory_alveoli') {
    headerTitle = `🫁 HỆ HÔ HẤP & PHẾ NANG`;
  } else if (deck.id === 'concept_urinary_nephron') {
    headerTitle = `🩺 HỆ TIẾT NIỆU & CẦU THẬN`;
  } else if (deck.id === 'concept_brachial_plexus') {
    headerTitle = `⚡ ĐÁM RỐI THẦN KINH CÁNH TAY`;
  } else if (deck.id === 'concept_inner_ear_vestibular') {
    headerTitle = `👂 TAI TRONG & TIỀN ĐÌNH`;
  }

  container.innerHTML = `
    <div class="disc-subunits-box">
      <div class="disc-subunits-header">
        <span class="disc-subunits-title">${headerTitle}</span>
      </div>
      ${deckHtml}
      ${simHtml}
      ${subunitsHtml}
      <div class="deck-quick-tools-row">
        <button type="button" class="btn-deck-axis-tool" id="btnDeckClinicalAxis" title="Xem chuỗi mắt xích & trục giải phẫu ứng dụng liên quan">
          <svg width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.2"><path d="M10 13a5 5 0 0 0 7.54.54l3-3a5 5 0 0 0-7.07-7.07l-1.72 1.71"/><path d="M14 11a5 5 0 0 0-7.54-.54l-3 3a5 5 0 0 0 7.07 7.07l1.71-1.71"/></svg>
          <span>🧬 Trục Giải Phẫu Ứng Dụng Liên Quan</span>
        </button>
      </div>
    </div>
  `;

  // Reset scroll container to top to prevent cutting off top of slide
  const cardBody = document.getElementById('selectionCardBody');
  if (cardBody) {
    cardBody.scrollTop = 0;
  }

  // Attach event listeners
  const imgEl = container.querySelector('#deckSlideImg');
  const badgeEl = container.querySelector('#deckSlideBadge');
  const pills = container.querySelectorAll('.deck-pill');

  function setSlide(index) {
    if (!slides[index]) return;
    currentSlide = index;
    if (imgEl) imgEl.src = slides[index].image;
    if (badgeEl) badgeEl.textContent = slides[index].badge;
    pills.forEach((p, idx) => {
      p.classList.toggle('active', idx === index);
    });
  }

  pills.forEach(pill => {
    pill.addEventListener('click', (e) => {
      e.stopPropagation();
      const idx = parseInt(pill.dataset.slide, 10);
      setSlide(idx);
    });
  });

  container.querySelector('#deckSlideFrame')?.addEventListener('click', (e) => {
    if (e.target.closest('#btnDeckVideo')) return;
    e.stopPropagation();
    openImageZoomModal({
      src: slides[currentSlide]?.image,
      title: slides[currentSlide]?.title,
      subtitle: slides[currentSlide]?.badge,
      slides: slides,
      currentIndex: currentSlide,
      onSlideChange: (newIdx) => {
        setSlide(newIdx);
      }
    });
  });

  container.querySelector('#btnDeckVideo')?.addEventListener('click', (e) => {
    e.stopPropagation();
    if (deck?.video) {
      openVideoModal(deck.video.url, deck.video.title);
    }
  });

  const range = container.querySelector('#herniationRange');
  const stageLabel = container.querySelector('#herniationStageLabel');
  const stageDesc = container.querySelector('#herniationStageDesc');

  range?.addEventListener('input', (e) => {
    const val = parseInt(e.target.value, 10);
    const stage = sim.stages[val] || sim.stages[0];
    if (stageLabel) stageLabel.textContent = stage.level;
    if (stageDesc) stageDesc.textContent = stage.desc;
    // Automatically switch to slide index 2 (Bệnh học) if user moves slider
    if (slides.length >= 3 && currentSlide !== 2) {
      setSlide(2);
    }
  });

  ['pointerdown', 'touchstart', 'touchmove', 'mousedown'].forEach(evt => {
    range?.addEventListener(evt, e => e.stopPropagation(), { passive: true });
  });

  container.querySelectorAll('.sub-chip-btn').forEach(btn => {
    btn.addEventListener('click', (e) => {
      e.stopPropagation();
      const targetId = btn.dataset.part;
      if (targetId) {
        selectPartById(targetId, viewer);
      }
    });
  });

  // 🧬 Quick Clinical Axis Jump
  container.querySelector('#btnDeckClinicalAxis')?.addEventListener('click', (e) => {
    e.stopPropagation();
    let axisId = 'axis_gut_brain';
    if (deck.id === 'concept_gastrointestinal_tract') axisId = 'axis_gut_brain';
    else if (deck.id === 'concept_hepatobiliary_pancreas') axisId = 'axis_hepatobiliary_pancreas';
    else if (deck.id === 'concept_intervertebral_disc' || deck.id === 'concept_knee_joint_ligaments') axisId = 'axis_brain_spine_sciatic';
    else if (deck.id === 'concept_circle_of_willis' || deck.id === 'concept_inner_ear_vestibular') axisId = 'axis_cranial_nerves';
    else if (deck.id === 'concept_cardiac_valves' || deck.id === 'concept_respiratory_alveoli') axisId = 'axis_cardiopulmonary_loop';

    import('./clinicalAxesModal.js').then(({ openClinicalAxesModal }) => {
      openClinicalAxesModal(axisId);
    });
  });
}

// =========================================================================
// 2a.1 3D Joint Kinematics & Range of Motion (ROM) Controller (Choice 2)
// =========================================================================
const JOINT_KINEMATICS_MAP = [
  {
    match: ['knee', 'cruciate', 'meniscus', 'patella', 'tibia', 'gối', 'chày', 'bánh chè'],
    motionId: MOTIONS.KNEE_FLEXION,
    title: '🏃 ĐỘNG HỌC KHỚP GỐI',
    actionName: 'Gập gối',
    minAngle: 0,
    maxAngle: 140,
    agonist: 'Nhóm cơ gân kheo (Hamstrings)',
    note: 'Biên độ gập 0° (duỗi thẳng) đến 140° (gập sâu)'
  },
  {
    match: ['shoulder', 'humerus', 'scapula', 'glenoid', 'vai', 'cánh tay', 'bả vai'],
    motionId: MOTIONS.SHOULDER_ABDUCTION,
    title: '🏃 ĐỘNG HỌC KHỚP VAI',
    actionName: 'Dạng vai',
    minAngle: 0,
    maxAngle: 180,
    agonist: 'Cơ delta & Cơ trên gai (Deltoid & Supraspinatus)',
    note: 'Dạng cánh tay từ 0° đến 180° qua đầu'
  },
  {
    match: ['hip', 'pelvis', 'acetabulum', 'háng', 'xương chậu', 'ổ cối'],
    motionId: MOTIONS.HIP_FLEXION,
    title: '🏃 ĐỘNG HỌC KHỚP HÁNG',
    actionName: 'Gập háng',
    minAngle: 0,
    maxAngle: 120,
    agonist: 'Cơ thắt lưng chậu (Iliopsoas) & Cơ thẳng đùi',
    note: 'Nâng đùi ra trước từ 0° đến 120°'
  },
  {
    match: ['elbow', 'radius', 'ulna', 'khuỷu', 'xương quay', 'xương trụ'],
    motionId: MOTIONS.ELBOW_FLEXION,
    title: '🏃 ĐỘNG HỌC KHỚP KHUỶU',
    actionName: 'Gập khuỷu',
    minAngle: 0,
    maxAngle: 145,
    agonist: 'Cơ nhị đầu cánh tay (Biceps) & Cơ cánh tay',
    note: 'Gấp cẳng tay từ 0° đến 145° chạm vai'
  },
  {
    match: ['spine', 'vertebra', 'cột sống', 'đốt sống', 'l4', 'l5', 'c5', 'c6'],
    motionId: MOTIONS.SPINE_FLEXION,
    title: '🏃 ĐỘNG HỌC CỘT SỐNG',
    actionName: 'Cúi gập thân',
    minAngle: 0,
    maxAngle: 80,
    agonist: 'Cơ thẳng bụng & Cơ chéo bụng (Abdominals)',
    note: 'Cúi gập thân mình ra trước từ 0° đến 80°'
  }
];

let kinematicsUnsub = null;

function renderJointKinematicsSection(part, clinical, mainName, viewer) {
  const container = document.getElementById('cardJointKinematicsSection');
  if (!container) return;

  const partId = String(part?.id || '').toLowerCase();
  const nameVi = String(clinical?.nameVi || mainName || '').toLowerCase();
  const searchStr = `${partId} ${nameVi}`;

  const kin = JOINT_KINEMATICS_MAP.find(k => k.match.some(m => searchStr.includes(m)));

  if (!kin) {
    container.classList.add('hidden');
    container.innerHTML = '';
    if (kinematicsUnsub) {
      kinematicsUnsub();
      kinematicsUnsub = null;
    }
    return;
  }

  container.classList.remove('hidden');

  container.innerHTML = `
    <div class="joint-kinematics-box">
      <div class="joint-kinematics-header">
        <span class="joint-kinematics-title">${kin.title}</span>
        <span class="joint-kinematics-angle-badge" id="jointKinAngleBadge">${kin.actionName}: 0° / ${kin.maxAngle}°</span>
      </div>
      <div class="joint-kinematics-controls">
        <button type="button" class="btn-joint-play" id="btnJointKinPlay" title="Chạy mô phỏng chuyển động 3D">
          ▶ Chạy 3D
        </button>
        <div class="joint-slider-wrap">
          <input type="range" min="0" max="100" value="0" step="1" class="joint-rom-range" id="jointRomRange" />
          <div class="joint-rom-ticks">
            <span>0° (Duỗi)</span>
            <span>${Math.round(kin.maxAngle / 2)}°</span>
            <span>${kin.maxAngle}° (Gập)</span>
          </div>
        </div>
        <button type="button" class="btn-joint-reset" id="btnJointKinReset" title="Đặt lại tư thế giải phẫu">
          ↺
        </button>
      </div>
      <div class="joint-kinematics-desc">
        <span class="agonist-label">Cơ chủ vận:</span> ${kin.agonist} (${kin.note})
      </div>
    </div>
  `;

  const range = container.querySelector('#jointRomRange');
  const playBtn = container.querySelector('#btnJointKinPlay');
  const resetBtn = container.querySelector('#btnJointKinReset');
  const badge = container.querySelector('#jointKinAngleBadge');

  if (kinematicsUnsub) {
    kinematicsUnsub();
    kinematicsUnsub = null;
  }

  // Subscribe to dynamicAnatomy state updates to sync UI when playing
  kinematicsUnsub = dynamicAnatomy.subscribe((st) => {
    if (st.motionId === kin.motionId) {
      if (range && !range.matches(':active')) {
        range.value = Math.round(st.progress * 100);
      }
      const angle = Math.round(st.progress * kin.maxAngle);
      if (badge) badge.textContent = `${kin.actionName}: ${angle}° / ${kin.maxAngle}°`;
      if (playBtn) playBtn.innerHTML = st.isPlaying ? '⏸ Dừng' : '▶ Chạy 3D';
    }
  });

  range?.addEventListener('input', async (e) => {
    const pct = parseFloat(e.target.value) / 100;
    const currentAngle = Math.round(pct * kin.maxAngle);
    if (badge) badge.textContent = `${kin.actionName}: ${currentAngle}° / ${kin.maxAngle}°`;

    const cur = dynamicAnatomy.getState();
    if (cur.motionId !== kin.motionId) {
      await dynamicAnatomy.setMotion(kin.motionId);
    }
    dynamicAnatomy.pause();
    dynamicAnatomy.seek(pct);
    if (playBtn) playBtn.innerHTML = '▶ Chạy 3D';
  });

  ['pointerdown', 'touchstart', 'touchmove', 'mousedown'].forEach(evt => {
    range?.addEventListener(evt, e => e.stopPropagation(), { passive: true });
  });

  playBtn?.addEventListener('click', async (e) => {
    e.stopPropagation();
    const cur = dynamicAnatomy.getState();
    if (cur.motionId !== kin.motionId) {
      await dynamicAnatomy.setMotion(kin.motionId);
    }
    dynamicAnatomy.togglePlay();
  });

  resetBtn?.addEventListener('click', async (e) => {
    e.stopPropagation();
    dynamicAnatomy.pause();
    dynamicAnatomy.seek(0);
    if (range) range.value = 0;
    if (badge) badge.textContent = `${kin.actionName}: 0° / ${kin.maxAngle}°`;
    if (playBtn) playBtn.innerHTML = '▶ Chạy 3D';
  });
}
