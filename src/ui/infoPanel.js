// Advanced Anatomy Information Panel Controller (Visible Body & Atlas 2027 Standard)
// Manages: History Navigation (< >), Full/Compact Mode, Model Orientation (Đứng/Nằm ngửa/Nằm sấp/Bàn mổ),
// Audio Pronunciation, Anatomical Hierarchy Tree, 3D Structure Tagging, Learn More & Histology Thumbnails
import { state, getStructureInfo, pushUndo, subscribe } from '../state/store.js';
import { searchStructures } from '../utils/dataLoader.js';
import { getClinicalData } from '../data/clinicalInfo.js';
import { PATIENT_CASES } from './patientConsultationModal.js';
import { setModelOrientation, toggleDissectionTable, getCurrentOrientation, getTableVisibility } from '../viewer/orientationManager.js';
import { openLesson, showToast, selectStructureAnywhere } from './sidebar.js';
import { openAIAssistant } from './aiAssistantModal.js';
import { hidePart, isolatePart, setPartTransparency, restoreAllParts, isGhostActive, ghostAllExcept, clearGhost, showcaseWholeSystem, peelAnteriorObstacles, ghostOthers, unghost, isGhosted } from '../viewer/visibility.js';
import { SYSTEM_PROFILES, matchSystemProfile } from '../data/systemProfiles.js';
import { canGoBackSelection, canGoForwardSelection, navigateSelectionHistory, notifySelectionHistoryChanged, selectPartById, zoomIntoCurrentSelection, zoomOutSelectionOverview, resolveAnatomicalAlias } from '../viewer/selection.js';
import { setView, getCurrentView } from '../viewer/camera.js';
import { addCustomTag, clearCustomTags } from '../viewer/labels.js';
import { getPartVideo, removePartVideo, isAdminLoggedIn, isVerifiedVideo } from '../data/atlasMediaManager.js';
import { getLocalVideoBlobUrl } from '../data/videoStore.js';
import { openQuickVideoModal } from './quickVideoModal.js';
import { openVideoModal } from './sidebar.js';
import { getVisualDeckForPart } from '../data/anatomyConcepts.js';
import { dynamicAnatomy, MOTIONS } from '../viewer/dynamicAnatomy.js';
import { CLINICAL_AXES } from '../data/clinicalAxesData.js';
import { openClinicalAxesModal } from './clinicalAxesModal.js';
import { openImageZoomModal } from './imageZoomModal.js';
import { getConstituentsForPart } from '../data/anatomyConstituents.js';
import { formatNameWithSubtitles, setupCollapsibleClamp, renderCollapsibleTextHtml, escapeHTML } from '../utils/textFormatters.js';
import { getVietnameseVoice } from '../utils/speechVoice.js';

let currentSnapTier = 'compact'; // 'compact' | 'half' | 'full'
let isCompact = true;
let isBodyCollapsed = false;
let isZoomedIn = false;
let currentlySpeakingBtn = null;

let isInfoPanelInitialized = false;
let isGesturesInitialized = false;

export function initInfoPanel(viewer) {
  const card = document.getElementById('selectionCard');
  if (!card || isInfoPanelInitialized) return;
  isInfoPanelInitialized = true;

  // Initialize Smart Multi-Snap Touch & Drag Gestures
  initBottomSheetGestures(card);

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

  // 2a. AI Doctor 15-sec Voice Summary Buttons (Full Sheet & Mini-Bar)
  const aiVoiceBtn = document.getElementById('btnAIVoiceSummary');
  aiVoiceBtn?.addEventListener('click', (e) => {
    e.stopPropagation();
    play15SecVoiceSummary(aiVoiceBtn);
  });

  const miniAIVoiceBtn = document.getElementById('btnMiniAIVoice');
  miniAIVoiceBtn?.addEventListener('click', (e) => {
    e.stopPropagation();
    play15SecVoiceSummary(miniAIVoiceBtn);
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
    setSheetSnapTier('half');
  });

  miniTrigger?.addEventListener('click', (e) => {
    e.stopPropagation();
    setSheetSnapTier('half');
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

  // 3a.1 1-Touch Ergonomic Actions: Cô lập (Isolate), Bóc lớp trước (Peel), Xuyên thấu (Ghost), Khôi phục (Restore)
  const miniIsolateBtn = document.getElementById('btnMiniIsolate');
  const miniHideBtn = document.getElementById('btnMiniHide');
  const miniGhostBtn = document.getElementById('btnMiniGhost');
  const miniRestoreBtn = document.getElementById('btnMiniRestore');
  const isoFloatingBadge = document.getElementById('isolationFloatingBadge');
  const isoBadgeText = document.getElementById('isoBadgeText');
  const btnIsoRestore = document.getElementById('btnIsoRestore');

  function updateFloatingIsolationBadge(part) {
    if (!isoFloatingBadge) return;
    if (state.isolatedPart) {
      const partObj = part || state.selectedPart;
      const info = state.isolatedPart ? getStructureInfo(state.isolatedPart) : null;
      let name = partObj?.displayName || partObj?.nameVi;
      if (!name && info?.name) {
        name = info.name[state.language] || info.name.vi || info.name.en;
      }
      if (!name) name = state.isolatedPart;
      const parenIdx = name.indexOf('(');
      const shortName = parenIdx > 0 ? name.slice(0, parenIdx).trim() : name;
      if (isoBadgeText) isoBadgeText.textContent = `Đang xem riêng: ${shortName}`;
      isoFloatingBadge.classList.remove('hidden');
    } else {
      isoFloatingBadge.classList.add('hidden');
    }
  }

  // Subscribe to isolation state to keep badge and buttons perfectly in sync
  subscribe('isolatedPart', (iso) => {
    if (!iso) {
      if (isoFloatingBadge) isoFloatingBadge.classList.add('hidden');
      if (miniIsolateBtn) {
        miniIsolateBtn.classList.remove('active');
        const l = miniIsolateBtn.querySelector('.dock-btn-label') || miniIsolateBtn.querySelector('.mini-btn-label');
        const i = miniIsolateBtn.querySelector('.dock-btn-icon') || miniIsolateBtn.querySelector('.mini-btn-icon');
        if (l) l.textContent = 'Cô lập';
        if (i) i.textContent = '⚡';
      }
      const cardIsoBtn = document.getElementById('cardIsolateBtn');
      if (cardIsoBtn) cardIsoBtn.classList.remove('active');
    } else {
      updateFloatingIsolationBadge(state.selectedPart);
    }
  });

  subscribe('selectedPart', (part) => {
    if (!part && !state.isolatedPart) {
      if (isoFloatingBadge) isoFloatingBadge.classList.add('hidden');
    }
  });

  function handleFullRestore() {
    restoreAllParts();
    unghost();
    if (miniIsolateBtn) {
      miniIsolateBtn.classList.remove('active');
      const l = miniIsolateBtn.querySelector('.dock-btn-label') || miniIsolateBtn.querySelector('.mini-btn-label');
      const i = miniIsolateBtn.querySelector('.dock-btn-icon') || miniIsolateBtn.querySelector('.mini-btn-icon');
      if (l) l.textContent = 'Cô lập';
      if (i) i.textContent = '⚡';
    }
    if (miniHideBtn) {
      miniHideBtn.classList.remove('active');
      const l = miniHideBtn.querySelector('.dock-btn-label') || miniHideBtn.querySelector('.mini-btn-label');
      const i = miniHideBtn.querySelector('.dock-btn-icon') || miniHideBtn.querySelector('.mini-btn-icon');
      if (l) l.textContent = 'Ẩn vật cản';
      if (i) i.textContent = '👁️';
    }
    if (miniGhostBtn) {
      miniGhostBtn.classList.remove('active');
      const l = miniGhostBtn.querySelector('.dock-btn-label');
      const i = miniGhostBtn.querySelector('.dock-btn-icon');
      if (l) l.textContent = 'Xuyên thấu';
      if (i) i.textContent = '👻';
    }
    const cardIsoBtn = document.getElementById('cardIsolateBtn');
    if (cardIsoBtn) cardIsoBtn.classList.remove('active');
    if (isoFloatingBadge) isoFloatingBadge.classList.add('hidden');
    viewer?.render();
  }

  btnIsoRestore?.addEventListener('click', (e) => {
    e.stopPropagation();
    handleFullRestore();
    showToast('↺ Đã khôi phục toàn bộ giải phẫu');
  });

  miniRestoreBtn?.addEventListener('click', (e) => {
    e.stopPropagation();
    handleFullRestore();
    showToast('↺ Đã khôi phục toàn bộ giải phẫu');
  });

  miniGhostBtn?.addEventListener('click', (e) => {
    e.stopPropagation();
    if (!state.selectedPart) return;
    const isGhostNow = isGhosted();
    const l = miniGhostBtn.querySelector('.dock-btn-label');
    const i = miniGhostBtn.querySelector('.dock-btn-icon');

    if (isGhostNow) {
      unghost();
      miniGhostBtn.classList.remove('active');
      if (l) l.textContent = 'Xuyên thấu';
      if (i) i.textContent = '👻';
      viewer?.render();
      showToast('Đã tắt nhìn xuyên thấu');
    } else {
      ghostOthers(state.selectedPart.id);
      miniGhostBtn.classList.add('active');
      if (l) l.textContent = 'Xuyên thấu';
      if (i) i.textContent = '✓';
      viewer?.render();
      showToast('👻 Đã bật nhìn xuyên thấu (Ghosting/X-Ray)');
    }
  });

  miniIsolateBtn?.addEventListener('click', (e) => {
    e.stopPropagation();
    if (!state.selectedPart) return;
    const isCurrentlyIsolated = miniIsolateBtn.classList.contains('active') || state.isolatedPart === state.selectedPart.id;
    const cardIsoBtn = document.getElementById('cardIsolateBtn');
    const l = miniIsolateBtn.querySelector('.dock-btn-label') || miniIsolateBtn.querySelector('.mini-btn-label');
    const i = miniIsolateBtn.querySelector('.dock-btn-icon') || miniIsolateBtn.querySelector('.mini-btn-icon');

    if (isCurrentlyIsolated) {
      pushUndo({
        type: 'isolate',
        partId: state.selectedPart.id,
        prevIsolated: state.isolatedPart
      });
      handleFullRestore();
      showToast('Đã tắt cô lập - Khôi phục toàn bộ giải phẫu');
    } else {
      pushUndo({
        type: 'isolate',
        partId: state.selectedPart.id,
        prevIsolated: state.isolatedPart || null
      });
      isolatePart(state.selectedPart.id, viewer);
      miniIsolateBtn.classList.add('active');
      if (l) l.textContent = 'Đang cô lập';
      if (i) i.textContent = '✓';
      if (cardIsoBtn) cardIsoBtn.classList.add('active');
      updateFloatingIsolationBadge(state.selectedPart);
      viewer?.render();
      const name = state.selectedPart.displayName || state.selectedPart.nameVi || state.selectedPart.name || 'bộ phận';
      showToast(`⚡ Đã cô lập ${name}`);
    }
  });

  miniHideBtn?.addEventListener('click', (e) => {
    e.stopPropagation();
    if (!state.selectedPart) return;
    const part = state.selectedPart;
    const isPeeled = miniHideBtn.classList.contains('active');
    const l = miniHideBtn.querySelector('.dock-btn-label') || miniHideBtn.querySelector('.mini-btn-label');
    const i = miniHideBtn.querySelector('.dock-btn-icon') || miniHideBtn.querySelector('.mini-btn-icon');
    const displayName = part.displayName || part.nameVi || part.name || 'bộ phận';

    if (isPeeled) {
      handleFullRestore();
      showToast('Đã khôi phục các cấu trúc che chắn');
    } else {
      const peeled = peelAnteriorObstacles(part.id, viewer);
      if (peeled) {
        miniHideBtn.classList.add('active');
        if (l) l.textContent = 'Đã ẩn cản';
        if (i) i.textContent = '✓';
        showToast(`👁️ Đã gỡ bỏ xương & cơ chắn phía trước để soi rõ ${displayName}`);
      } else {
        hidePart(part.id);
        showToast(`👁️ Đã ẩn ${displayName}`);
      }
      viewer?.render();
    }
  });

  window.addEventListener('expand-selection-card', () => {
    setSheetSnapTier('compact');
  });

  // 3. Compact Mode & Dropdown Toggles (Intelligent 3-Snap Switching)
  const toggleCompactBtn = document.getElementById('btnToggleCompactCard');
  const compactBar = document.getElementById('btnSwitchCompactMode');
  const toggleDropdownBtn = document.getElementById('btnToggleInfoDropdown');

  toggleCompactBtn?.addEventListener('click', (e) => {
    e.stopPropagation();
    if (currentSnapTier === 'compact') {
      setSheetSnapTier('half');
    } else {
      setSheetSnapTier('compact');
    }
  });

  compactBar?.addEventListener('click', (e) => {
    e.stopPropagation();
    setSheetSnapTier('compact');
  });

  toggleDropdownBtn?.addEventListener('click', (e) => {
    e.stopPropagation();
    if (currentSnapTier === 'compact') {
      setSheetSnapTier('half');
    } else {
      setSheetSnapTier('compact');
      showToast('🔽 Đã thu gọn thành 1 dòng');
    }
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

  // 6. Adjust Model Actions (Ghost / Fade Others, Isolate, Radius Blast)
  document.getElementById('cardGhostBtn')?.addEventListener('click', () => {
    const part = state.selectedPart;
    if (part) {
      if (isGhostActive()) {
        clearGhost();
        viewer?.render?.();
        showToast('✨ Đã khôi phục giải phẫu xung quanh sắc nét');
      } else {
        ghostAllExcept(part.id);
        viewer?.render?.();
        showToast(`👻 Đã làm mờ các cơ quan xung quanh (Fade Others)`);
      }
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

  let clinical = getClinicalData(part.id);
  const lang = state.language || 'vi';
  const isWholeSystem = Boolean(part.isSystem || part.systemProfile || (typeof part.id === 'string' && part.id.startsWith('system_')));
  if (isWholeSystem && (part.systemProfile || part.info)) {
    const prof = part.systemProfile || {
      nameVi: part.info?.name?.vi || part.displayName,
      nameEn: part.info?.name?.en || '',
      nameLatin: part.info?.latinName || '',
      structureCount: part.info?.structureCount || 46,
      summary: part.info?.description || '',
      speech15s: part.info?.function || '',
      keyOrgans: part.info?.keyOrgans || []
    };
    clinical = {
      ...clinical,
      nameVi: prof.nameVi,
      nameEn: prof.nameEn,
      nameLatin: prof.nameLatin,
      systemVi: `Toàn Bộ Hệ Cơ Quan`,
      regionVi: 'Toàn thân',
      description: prof.summary || clinical.description,
      function: prof.speech15s || clinical.function,
      clinical: `Hệ thống tích hợp ${prof.structureCount || 40} thành phần giải phẫu phối hợp đồng bộ để duy trì chức năng sống.`,
      keyOrgans: prof.keyOrgans || []
    };
  }

  // 1. Title & Subtitle (Visible Body Prominent Anatomy Teal Header)
  const cardTitle = document.getElementById('cardTitle');
  const cardSubtitle = document.getElementById('cardSubtitle');
  const cardCompactLabel = document.getElementById('cardCompactLabel');

  const mainName = isWholeSystem && part.systemProfile ? part.systemProfile.nameVi : (clinical.nameVi || part.info?.name?.[lang] || part.displayName || part.id);
  const latinName = isWholeSystem && part.systemProfile ? part.systemProfile.nameLatin : (clinical.nameLatin || part.info?.latinName || '');
  const systemName = isWholeSystem && part.systemProfile ? `Toàn Bộ Hệ Cơ Quan (${part.systemProfile.structureCount} cấu trúc)` : (clinical.systemVi || part.system || '');

  if (cardTitle) cardTitle.innerHTML = formatNameWithSubtitles(mainName);
  if (cardCompactLabel) cardCompactLabel.textContent = 'Thông tin';

  let cleanLatin = (latinName || '').trim();
  cleanLatin = cleanLatin.replace(/\s*\((TA2:[^)]+)\)/i, ' · $1');
  if (cleanLatin.startsWith('(') && cleanLatin.endsWith(')')) {
    cleanLatin = cleanLatin.slice(1, -1).trim();
  }
  // Loại bỏ hoàn toàn các chuỗi rác như ???????? hoặc null/undefined
  if (/^[?\s\-_]+$/.test(cleanLatin) || cleanLatin.toLowerCase() === 'null' || cleanLatin.toLowerCase() === 'undefined') {
    cleanLatin = '';
  }

  const cleanSystem = (systemName || '').replace(/\s*\([^)]*\)/g, '').trim();

  if (cardSubtitle) {
    cardSubtitle.textContent = cleanLatin ? `${cleanLatin} • ${cleanSystem}` : cleanSystem;
    cardSubtitle.title = cleanLatin ? `${cleanLatin} • ${systemName}` : systemName;
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
    const rawDesc = clinical.description || clinical.function || '';
    let firstSentence = rawDesc.split(/[\.\!\?]\s+/)[0] || rawDesc;
    firstSentence = firstSentence.replace(/[\.\!\?]$/, '').trim();
    miniDesc.textContent = firstSentence ? `${firstSentence}.` : 'Chạm để mở rộng toàn bộ giải phẫu.';
    miniDesc.title = rawDesc || firstSentence;
  }

  // Sync Mini 1-tap quick action buttons
  const miniIso = document.getElementById('btnMiniIsolate');
  if (miniIso) {
    const isIso = !!(part && state.isolatedPart === part.id);
    miniIso.classList.toggle('active', isIso);
    const l = miniIso.querySelector('.dock-btn-label') || miniIso.querySelector('.mini-btn-label');
    const i = miniIso.querySelector('.dock-btn-icon') || miniIso.querySelector('.mini-btn-icon');
    if (l) l.textContent = isIso ? 'Đang cô lập' : 'Cô lập';
    if (i) i.textContent = isIso ? '✓' : '⚡';
  }

  const miniHide = document.getElementById('btnMiniHide');
  if (miniHide) {
    const isPeeled = miniHide.classList.contains('active');
    const l = miniHide.querySelector('.dock-btn-label') || miniHide.querySelector('.mini-btn-label');
    const i = miniHide.querySelector('.dock-btn-icon') || miniHide.querySelector('.mini-btn-icon');
    if (l) l.textContent = isPeeled ? 'Đã ẩn cản' : 'Ẩn vật cản';
    if (i) i.textContent = isPeeled ? '✓' : '👁️';
  }

  const miniGhost = document.getElementById('btnMiniGhost');
  if (miniGhost) {
    const isGhostNow = isGhosted();
    miniGhost.classList.toggle('active', isGhostNow);
    const l = miniGhost.querySelector('.dock-btn-label');
    const i = miniGhost.querySelector('.dock-btn-icon');
    if (l) l.textContent = 'Xuyên thấu';
    if (i) i.textContent = isGhostNow ? '✓' : '👻';
  }

  const isoBadge = document.getElementById('isolationFloatingBadge');
  const isoText = document.getElementById('isoBadgeText');
  if (isoBadge) {
    if (state.isolatedPart && part) {
      const parenIdx = mainName.indexOf('(');
      const shortName = parenIdx > 0 ? mainName.slice(0, parenIdx).trim() : mainName;
      if (isoText) isoText.textContent = `Đang xem riêng: ${shortName}`;
      isoBadge.classList.remove('hidden');
    } else {
      isoBadge.classList.add('hidden');
    }
  }

  // Phase 2: Render Visual Anatomical Breadcrumbs (Hệ Cơ Quan › Cơ Quan Cha › Cấu Trúc Hiện Tại)
  renderBreadcrumbTrail(part, clinical, mainName, viewer);

  // Phase 2: Render Neighbor Smart-Chips (Cấu trúc tiếp giáp & Khám phá nhanh 1 chạm)
  renderNeighborSmartChips(part, clinical, mainName, viewer);

  // Phase 3: Render Interactive 4-Stage Pathology Simulator
  renderPathologyProgressionSection(part, clinical, mainName, viewer);

  // 2. Core Anatomical Explanation (Ngắn gọn 1 câu siêu nhỏ, không lý thuyết dài dòng)
  const explainDesc = document.getElementById('cardExplainDesc');
  const explainFunc = document.getElementById('cardExplainFunc');
  const explainRel = document.getElementById('cardExplainRel');

  if (explainDesc) {
    const raw = clinical.description || 'Đang cập nhật thông tin giải phẫu học...';
    setupCollapsibleClamp(explainDesc, raw, 110, 'Mở rộng ↓', 'Thu gọn ↑');
  }
  if (explainFunc) {
    const raw = clinical.function || clinical.clinical || 'Đang cập nhật chức năng sinh lý & cơ học...';
    setupCollapsibleClamp(explainFunc, raw, 110, 'Mở rộng ↓', 'Thu gọn ↑');
  }
  const relBlock = document.querySelector('.explain-rel');
  if (relBlock) relBlock.style.display = 'none';

  // Stop any previous active speech synthesis when changing structure
  // 2a.0 Render One-Tap Axis Link if part belongs to a clinical axis
  renderClinicalAxisOneTap(part, viewer);

  // 2a. Render Interactive Disc Subunits (Vòng sợi & Nhân nhầy)
  renderDiscSubunitsSection(part, clinical, mainName, viewer);

  // 2a.2 Render Netter Clinical Musculoskeletal Biomechanics Card (Nguyên ủy, Bám tận, Thần kinh, Chức năng)
  renderNetterBiomechanicsSection(part, clinical, mainName, viewer);

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
    if (isWholeSystem && part.systemProfile) {
      hierarchyBox.innerHTML = `
        <div class="anatomical-hierarchy-tree">
          <div class="tree-node tree-root active" title="Toàn bộ ${part.systemProfile.nameVi}">
            <span class="tree-icon">🏛️</span>
            <span class="tree-label highlight-teal">${part.systemProfile.nameVi} (${part.systemProfile.nameLatin})</span>
          </div>
          <div class="tree-branch">
            <div class="tree-node tree-current" title="${part.systemProfile.structureCount} cấu trúc giải phẫu">
              <span class="tree-connector">└─</span>
              <span class="tree-icon">✨</span>
              <span class="tree-label">Toàn bộ ${part.systemProfile.structureCount} cấu trúc giải phẫu • Nhấn cơ quan bên dưới để phóng to</span>
            </div>
          </div>
        </div>
      `;
    } else {
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
  }

  // 4. Render Cấu tạo chi tiết & Các bộ phận trực quan (Interactive Subparts Chips)
  renderAnatomyConstituents(part, clinical, mainName, viewer);

  // 5. Render Hình ảnh giải phẫu cấu tạo độ phân giải cao (High-Res Visual Diagram with Fullscreen Zoom)
  renderAnatomyPhotoSection(part, clinical, mainName);

  // Update history buttons state
  notifySelectionHistoryChanged();
}

export function setSheetSnapTier(tier) {
  const card = document.getElementById('selectionCard');
  if (!card) return;

  currentSnapTier = tier;
  card.style.transform = '';
  card.classList.remove('is-dragging');

  if (tier === 'compact') {
    isCompact = true;
    card.classList.add('compact-mode');
    card.classList.remove('sheet-half', 'sheet-full');
  } else if (tier === 'half') {
    isCompact = false;
    card.classList.remove('compact-mode', 'sheet-full');
    card.classList.add('sheet-half');
  } else if (tier === 'full') {
    isCompact = false;
    card.classList.remove('compact-mode', 'sheet-half');
    card.classList.add('sheet-full');
  }

  const iconMin = card.querySelector('.icon-minimize');
  const iconMax = card.querySelector('.icon-maximize');
  if (iconMin && iconMax) {
    iconMin.classList.toggle('hidden', tier === 'compact');
    iconMax.classList.toggle('hidden', tier !== 'compact');
  }

  const label = document.getElementById('cardCompactLabel');
  if (label) {
    label.textContent = 'Thông tin';
  }

  const toggleDropdownBtn = document.getElementById('btnToggleInfoDropdown');
  if (toggleDropdownBtn) {
    toggleDropdownBtn.title = (tier === 'compact') ? 'Chạm để mở rộng chi tiết' : 'Chạm để thu gọn thành 1 dòng (hoặc gạt nhẹ xuống)';
  }

  const arrow = card.querySelector('.info-header-arrow svg');
  if (arrow) {
    arrow.style.transform = (tier === 'compact') ? 'rotate(180deg)' : 'rotate(0deg)';
    arrow.style.transition = 'transform 0.2s ease';
  }
}

export function getSheetSnapTier() {
  return currentSnapTier;
}

if (typeof window !== 'undefined') {
  window.setSheetSnapTier = setSheetSnapTier;
  window.getSheetSnapTier = getSheetSnapTier;
}

export function setCompactMode(compact) {
  setSheetSnapTier(compact ? 'compact' : 'half');
}

function initBottomSheetGestures(card) {
  if (isGesturesInitialized || !card) return;
  isGesturesInitialized = true;

  const dragHandleWrap = document.getElementById('cardDragHandleWrap');
  const header = card.querySelector('.selection-card-header');
  const miniTrigger = document.getElementById('miniBarExpandTrigger');

  let startY = 0;
  let startTime = 0;
  let isDragging = false;
  let lastDeltaY = 0;
  let initialTier = currentSnapTier;

  function onPointerStart(e) {
    if (e.target.closest('button') || e.target.closest('input') || e.target.closest('a')) {
      return;
    }

    startY = e.touches ? e.touches[0].clientY : e.clientY;
    startTime = Date.now();
    isDragging = true;
    lastDeltaY = 0;
    initialTier = currentSnapTier;
    card.classList.add('is-dragging');
  }

  function onPointerMove(e) {
    if (!isDragging) return;
    const clientY = e.touches ? e.touches[0].clientY : e.clientY;
    const deltaY = clientY - startY;
    lastDeltaY = deltaY;

    if (deltaY > 0) {
      card.style.transform = `translateY(${deltaY}px)`;
    } else if (deltaY < 0 && (initialTier === 'half' || initialTier === 'compact')) {
      card.style.transform = `translateY(${Math.max(-200, deltaY)}px)`;
    }
  }

  function onPointerEnd(e) {
    if (!isDragging) return;
    isDragging = false;
    card.classList.remove('is-dragging');
    card.style.transform = '';

    const deltaTime = Math.max(1, Date.now() - startTime);
    const velocityY = lastDeltaY / deltaTime; // px / ms

    // 1. Any downward swipe/flick (flick velocity > 0.25 or downward drag > 20px) -> collapse directly to 1-line compact mode!
    if (velocityY > 0.25 || lastDeltaY > 20) {
      setSheetSnapTier('compact');
      showToast('🔽 Đã thu gọn thành 1 dòng');
      return;
    }

    // 2. Fast flick / swipe up -> expand
    if (velocityY < -0.3 || lastDeltaY < -35) {
      if (initialTier === 'compact') {
        setSheetSnapTier('half');
      } else {
        setSheetSnapTier('full');
      }
      showToast('🔼 Mở rộng thông tin');
      return;
    }

    // 3. Tap / Click on drag handle wrap or info header
    if (Math.abs(lastDeltaY) < 10 && e.target && e.target.closest('#cardDragHandleWrap, #btnToggleInfoDropdown')) {
      if (currentSnapTier === 'compact') {
        setSheetSnapTier('half');
      } else {
        setSheetSnapTier('compact');
        showToast('🔽 Đã thu gọn thành 1 dòng');
      }
      return;
    }
  }

  if (dragHandleWrap) {
    dragHandleWrap.addEventListener('touchstart', onPointerStart, { passive: true });
    dragHandleWrap.addEventListener('touchmove', onPointerMove, { passive: true });
    dragHandleWrap.addEventListener('touchend', onPointerEnd, { passive: true });
    dragHandleWrap.addEventListener('touchcancel', onPointerEnd, { passive: true });
    dragHandleWrap.addEventListener('mousedown', onPointerStart);
    dragHandleWrap.addEventListener('click', (e) => {
      e.stopPropagation();
      if (currentSnapTier === 'compact') {
        setSheetSnapTier('half');
      } else {
        setSheetSnapTier('compact');
        showToast('🔽 Đã thu gọn thành 1 dòng');
      }
    });
  }

  if (header) {
    header.addEventListener('touchstart', onPointerStart, { passive: true });
    header.addEventListener('touchmove', onPointerMove, { passive: true });
    header.addEventListener('touchend', onPointerEnd, { passive: true });
    header.addEventListener('touchcancel', onPointerEnd, { passive: true });
    header.addEventListener('click', (e) => {
      if (e.target.closest('button') || e.target.closest('input') || e.target.closest('a')) {
        return;
      }
      e.stopPropagation();
      if (currentSnapTier === 'compact') {
        setSheetSnapTier('half');
      } else {
        setSheetSnapTier('compact');
        showToast('🔽 Đã thu gọn thành 1 dòng');
      }
    });
  }

  if (miniTrigger) {
    miniTrigger.addEventListener('touchstart', onPointerStart, { passive: true });
    miniTrigger.addEventListener('touchmove', onPointerMove, { passive: true });
    miniTrigger.addEventListener('touchend', onPointerEnd, { passive: true });
  }

  window.addEventListener('mousemove', (e) => {
    if (isDragging) onPointerMove(e);
  });
  window.addEventListener('mouseup', (e) => {
    if (isDragging) onPointerEnd(e);
  });
  window.addEventListener('touchmove', (e) => {
    if (isDragging) onPointerMove(e);
  }, { passive: true });
  window.addEventListener('touchend', (e) => {
    if (isDragging) onPointerEnd(e);
  }, { passive: true });
  window.addEventListener('touchcancel', (e) => {
    if (isDragging) onPointerEnd(e);
  }, { passive: true });
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

  const viVoice = getVietnameseVoice();
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
    <div class="pathway-clinical-note">${renderCollapsibleTextHtml(matched.note, 100, 'Mở rộng ↓', 'Thu gọn ↑')}</div>
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

// =========================================================================
// PHASE 2: VISUAL ANATOMICAL BREADCRUMB & NEIGHBOR SMART-CHIPS ENGINE
// =========================================================================

function getSystemIcon(systemName) {
  const s = (systemName || '').toLowerCase();
  if (s.includes('tim') || s.includes('tuần hoàn') || s.includes('mạch')) return '❤️';
  if (s.includes('thần kinh') || s.includes('não')) return '🧠';
  if (s.includes('tiêu hóa')) return '🥗';
  if (s.includes('xương') || s.includes('khớp')) return '🦴';
  if (s.includes('cơ')) return '💪';
  if (s.includes('hô hấp') || s.includes('phổi')) return '🫁';
  if (s.includes('tiết niệu') || s.includes('thận')) return '💧';
  if (s.includes('nội tiết')) return '⚡';
  if (s.includes('da')) return '🛡️';
  return '🏛️';
}

function getParentOrganInfo(partId, mainName, clinical) {
  const str = `${partId} ${mainName}`.toLowerCase();

  // Heart chambers, valves, great vessels
  if (/ventricle|atrium|valve|aorta|pulmonar|coronary|thất|nhĩ|van tim|mỏm tim|màng ngoài tim/.test(str)) {
    return { name: 'Trái tim', latin: 'Cor', query: 'tim', icon: '❤️' };
  }
  // Stomach & gastric regions
  if (/stomach|gaster|pylor|fundus|cardia|dạ dày|môn vị|tâm vị|hang vị/.test(str)) {
    return { name: 'Dạ dày', latin: 'Gaster', query: 'dạ dày', icon: '🫄' };
  }
  // Hepatobiliary system
  if (/hepar|liver|hepatic|gallbladder|biliar|gan|túi mật|ống mật/.test(str)) {
    return { name: 'Gan - Mật', latin: 'Systema hepatobiliare', query: 'gan', icon: '🟤' };
  }
  // Pancreas
  if (/pancrea|tụy/.test(str)) {
    return { name: 'Tụy tạng', latin: 'Pancreas', query: 'tụy', icon: '🥖' };
  }
  // Kidneys & Urinary tract
  if (/ren|kidney|nephron|ureter|bladder|thận|niệu quản|bàng quang/.test(str)) {
    return { name: 'Thận - Tiết niệu', latin: 'Systema urinarium', query: 'thận', icon: '💧' };
  }
  // Brain & Central Nervous System
  if (/cerebr|encephal|brain|thần kinh|não|tủy sống|tiểu não|thân não/.test(str)) {
    return { name: 'Não bộ & Thần kinh', latin: 'Encephalon', query: 'não', icon: '🧠' };
  }
  // Spine & Vertebrae
  if (/vertebra|disc|cột sống|đốt sống|đĩa đệm/.test(str)) {
    return { name: 'Cột sống', latin: 'Columna vertebralis', query: 'cột sống', icon: '🦴' };
  }
  // Lungs & Respiratory
  if (/lung|pulmo|bronch|trachea|phổi|phế quản|khí quản/.test(str)) {
    return { name: 'Phổi & Đường thở', latin: 'Pulmones', query: 'phổi', icon: '🫁' };
  }
  // Shoulder & Upper Limb
  if (/deltoid|pectoral|biceps|triceps|vai|cánh tay|ngực/.test(str)) {
    return { name: 'Chi trên & Ngực', latin: 'Membrum superius', query: 'cơ delta', icon: '💪' };
  }
  // Knee & Lower Limb
  if (/knee|femur|tibia|patella|meniscus|cruciate|gối|đùi|cẳng chân/.test(str)) {
    return { name: 'Khớp gối & Chi dưới', latin: 'Articulatio genus', query: 'khớp gối', icon: '🦵' };
  }

  // Fallback to clinical region
  if (clinical?.regionVi) {
    return { name: clinical.regionVi, latin: '', query: clinical.regionVi, icon: '📍' };
  }

  return { name: 'Cơ quan giải phẫu', latin: '', query: '', icon: '🏛️' };
}

export function resolvePartId(query) {
  if (!query) return null;
  const aliased = resolveAnatomicalAlias(query);
  if (aliased && aliased.toLowerCase().trim() !== query.toLowerCase().trim()) return aliased;
  // If query is an exact partId in partsData
  if (getStructureInfo(query)) return query;

  // Try searchStructures
  try {
    const matches = searchStructures(query);
    if (matches && matches.length > 0 && matches[0].partIds && matches[0].partIds.length > 0) {
      return matches[0].partIds[0];
    }
  } catch (err) {
    console.warn('resolvePartId search error:', err);
  }

  // Case-insensitive direct key search
  const qLower = query.toLowerCase();
  if (state.partsData) {
    for (const id of Object.keys(state.partsData)) {
      if (id.toLowerCase() === qLower || id.toLowerCase().startsWith(`${qLower}.`)) {
        return id;
      }
    }
  }

  return query;
}

const ANATOMICAL_NEIGHBORS = [
  // Tim mạch - Thất trái & các thành phần
  {
    matches: ['ventricle_left', 'left_ventricle', 'thất trái', 'tâm thất trái'],
    neighbors: [
      { name: 'Tâm thất phải', latin: 'Ventriculus dexter', query: 'Right ventricle', icon: '💙' },
      { name: 'Van hai lá (Mitral)', latin: 'Valva bicuspidalis', query: 'Mitral valve', icon: '🚪' },
      { name: 'Động mạch chủ lên', latin: 'Aorta ascendens', query: 'Aorta', icon: '🔴' },
      { name: 'Tâm nhĩ trái', latin: 'Atrium sinistrum', query: 'Left atrium', icon: '❤️' },
      { name: 'Mỏm tim', latin: 'Apex cordis', query: 'Left ventricle', icon: '📍' }
    ]
  },
  // Tim mạch - Thất phải
  {
    matches: ['ventricle_right', 'right_ventricle', 'thất phải', 'tâm thất phải'],
    neighbors: [
      { name: 'Tâm thất trái', latin: 'Ventriculus sinister', query: 'Left ventricle', icon: '❤️' },
      { name: 'Van ba lá (Tricuspid)', latin: 'Valva tricuspidalis', query: 'Tricuspid valve', icon: '🚪' },
      { name: 'Thân động mạch phổi', latin: 'Truncus pulmonalis', query: 'Pulmonary trunk', icon: '🔵' },
      { name: 'Tâm nhĩ phải', latin: 'Atrium dextrum', query: 'Right atrium', icon: '💙' }
    ]
  },
  // Động mạch chủ (Aorta)
  {
    matches: ['aorta', 'động mạch chủ', 'quai động mạch chủ'],
    neighbors: [
      { name: 'Tâm thất trái', latin: 'Ventriculus sinister', query: 'Left ventricle', icon: '❤️' },
      { name: 'Quai động mạch chủ', latin: 'Arcus aortae', query: 'Aorta', icon: '🔴' },
      { name: 'Thân tay đầu', latin: 'Truncus brachiocephalicus', query: 'Brachiocephalic trunk', icon: '🔴' },
      { name: 'ĐM cảnh chung trái', latin: 'A. carotis communis', query: 'Left common carotid artery', icon: '🔴' },
      { name: 'ĐM dưới đòn trái', latin: 'A. subclavia', query: 'Left subclavian artery', icon: '🔴' }
    ]
  },
  // Tâm nhĩ
  {
    matches: ['atrium', 'tâm nhĩ', 'nhĩ trái', 'nhĩ phải'],
    neighbors: [
      { name: 'Tâm thất trái', latin: 'Ventriculus sinister', query: 'Left ventricle', icon: '❤️' },
      { name: 'Tâm thất phải', latin: 'Ventriculus dexter', query: 'Right ventricle', icon: '💙' },
      { name: 'Tĩnh mạch chủ trên', latin: 'Vena cava superior', query: 'Superior vena cava', icon: '🔵' },
      { name: 'Tĩnh mạch phổi', latin: 'Venae pulmonales', query: 'Pulmonary vein', icon: '🔴' }
    ]
  },
  // Dạ dày
  {
    matches: ['stomach', 'dạ dày', 'gaster', 'pylorus', 'môn vị', 'tâm vị'],
    neighbors: [
      { name: 'Đoạn dưới thực quản', latin: 'Esophagus', query: 'Esophagus', icon: '🥢' },
      { name: 'Tá tràng (Duodenum)', latin: 'Duodenum', query: 'Duodenum', icon: '🌀' },
      { name: 'Gan (Thùy trái)', latin: 'Hepar', query: 'Liver', icon: '🟤' },
      { name: 'Tụy tạng (Thân tụy)', latin: 'Pancreas', query: 'Pancreas', icon: '🥖' },
      { name: 'Lách', latin: 'Splen', query: 'Spleen', icon: '🟣' }
    ]
  },
  // Tá tràng
  {
    matches: ['duodenum', 'tá tràng'],
    neighbors: [
      { name: 'Dạ dày (Môn vị)', latin: 'Gaster', query: 'Stomach', icon: '🫄' },
      { name: 'Đầu tụy', latin: 'Caput pancreatis', query: 'Pancreas', icon: '🥖' },
      { name: 'Ống mật chủ', latin: 'Ductus choledochus', query: 'Cystic duct', icon: '🟢' },
      { name: 'Hỗng tràng', latin: 'Jejunum', query: 'Jejunum', icon: '🌀' },
      { name: 'Túi mật', latin: 'Vesica biliaris', query: 'Gallbladder', icon: '🍐' }
    ]
  },
  // Gan
  {
    matches: ['liver', 'gan', 'hepar'],
    neighbors: [
      { name: 'Túi mật', latin: 'Vesica biliaris', query: 'Gallbladder', icon: '🍐' },
      { name: 'Dạ dày', latin: 'Gaster', query: 'Stomach', icon: '🫄' },
      { name: 'Tá tràng', latin: 'Duodenum', query: 'Duodenum', icon: '🌀' },
      { name: 'Cơ hoành', latin: 'Diaphragma', query: 'Diaphragm', icon: '🛡️' },
      { name: 'Tĩnh mạch chủ dưới', latin: 'Vena cava inferior', query: 'Inferior vena cava', icon: '🔵' }
    ]
  },
  // Túi mật
  {
    matches: ['gallbladder', 'túi mật', 'vesica biliaris'],
    neighbors: [
      { name: 'Gan (Mặt tạng)', latin: 'Hepar', query: 'Liver', icon: '🟤' },
      { name: 'Ống mật chủ', latin: 'Ductus choledochus', query: 'Cystic duct', icon: '🟢' },
      { name: 'Tá tràng (Khối tá tụy)', latin: 'Duodenum', query: 'Duodenum', icon: '🌀' },
      { name: 'Dạ dày (Môn vị)', latin: 'Pylorus', query: 'Stomach', icon: '🫄' }
    ]
  },
  // Thận
  {
    matches: ['kidney', 'thận', 'ren'],
    neighbors: [
      { name: 'Tuyến thượng thận', latin: 'Glandula suprarenalis', query: 'Suprarenal gland', icon: '👑' },
      { name: 'Thận đối bên', latin: 'Ren', query: 'Kidney', icon: '🫘' },
      { name: 'Niệu quản', latin: 'Ureter', query: 'Ureter', icon: '💧' },
      { name: 'Đại tràng ngang', latin: 'Colon', query: 'Transverse colon', icon: '➰' }
    ]
  },
  // Phổi
  {
    matches: ['lung', 'phổi', 'pulmo'],
    neighbors: [
      { name: 'Trái tim & Trung thất', latin: 'Cor & Mediastinum', query: 'Left ventricle', icon: '❤️' },
      { name: 'Khí quản & Phế quản', latin: 'Trachea & Bronchus', query: 'Trachea', icon: '🫁' },
      { name: 'Cơ hoành', latin: 'Diaphragma', query: 'Diaphragm', icon: '🛡️' }
    ]
  },
  // Não bộ
  {
    matches: ['brain', 'não', 'cerebrum', 'cerebellum', 'thân não', 'tiểu não'],
    neighbors: [
      { name: 'Thân não', latin: 'Truncus encephali', query: 'Brainstem', icon: '⚡' },
      { name: 'Tiểu não', latin: 'Cerebellum', query: 'Cerebellum', icon: '🧠' },
      { name: 'Tủy sống', latin: 'Medulla spinalis', query: 'Spinal cord', icon: '🧬' }
    ]
  },
  // Khớp gối
  {
    matches: ['knee', 'gối', 'cruciate', 'meniscus', 'patella'],
    neighbors: [
      { name: 'Xương bánh chè', latin: 'Patella', query: 'Patella.l', icon: '🦴' },
      { name: 'Xương đùi', latin: 'Femur', query: 'Femur.l', icon: '🦴' },
      { name: 'Xương chày', latin: 'Tibia', query: 'Tibia.l', icon: '🦴' }
    ]
  },
  // Cột sống / Đĩa đệm
  {
    matches: ['vertebra', 'disc', 'đốt sống', 'đĩa đệm', 'lumbar', 'thắt lưng', 'cổ'],
    neighbors: [
      { name: 'Đĩa đệm gian đốt', latin: 'Discus intervertebralis', query: 'Intervertebral disc', icon: '💿' },
      { name: 'Đốt sống lân cận', latin: 'Vertebra', query: 'Vertebra', icon: '🦴' }
    ]
  },
  // Cơ delta / Vai
  {
    matches: ['deltoid', 'delta', 'cơ delta', 'vai', 'shoulder'],
    neighbors: [
      { name: 'Cơ ngực lớn', latin: 'M. pectoralis major', query: 'Pectoralis major.l', icon: '💪' },
      { name: 'Cơ thang', latin: 'M. trapezius', query: 'Trapezius.l', icon: '💪' },
      { name: 'Xương đòn', latin: 'Clavicula', query: 'Clavicle.l', icon: '🦴' }
    ]
  },
  // Cơ ngực lớn
  {
    matches: ['pectoralis', 'ngực lớn', 'cơ ngực'],
    neighbors: [
      { name: 'Cơ delta', latin: 'M. deltoideus', query: 'Deltoid.l', icon: '💪' },
      { name: 'Xương đòn', latin: 'Clavicula', query: 'Clavicle.l', icon: '🦴' },
      { name: 'Xương ức', latin: 'Sternum', query: 'Sternum', icon: '🦴' }
    ]
  }
];

function getNeighborList(partId, mainName, clinical) {
  const searchStr = `${partId} ${mainName}`.toLowerCase();
  for (const item of ANATOMICAL_NEIGHBORS) {
    if (item.matches.some(m => searchStr.includes(m))) {
      return item.neighbors.filter(n => n.name.toLowerCase() !== mainName.toLowerCase());
    }
  }

  // Fallback: check if constituents has subparts
  const constituents = getConstituentsForPart(partId, mainName, clinical?.systemVi, clinical?.regionVi);
  if (constituents && constituents.subparts && constituents.subparts.length > 0) {
    return constituents.subparts.slice(0, 5).map(sub => ({
      name: sub.name,
      latin: sub.latin || '',
      query: sub.searchQuery || sub.name,
      icon: sub.icon || '🔹'
    }));
  }

  return [];
}

function renderBreadcrumbTrail(part, clinical, mainName, viewer) {
  const container = document.getElementById('selectionBreadcrumbTrail');
  if (!container) return;

  if (part.isSystem && part.systemProfile) {
    const prof = part.systemProfile;
    container.innerHTML = `
      <div class="crumb-chip crumb-system" title="Hệ cơ quan: ${prof.nameVi}">
        <span class="crumb-icon">${prof.icon}</span>
        <span class="crumb-text">${prof.nameVi}</span>
      </div>
      <span class="crumb-separator">›</span>
      <div class="crumb-chip crumb-current" title="Toàn hệ 3D">
        <span class="crumb-icon">🌐</span>
        <span class="crumb-text">Toàn Bộ Hệ Cơ Quan (${prof.count} cấu trúc)</span>
      </div>
    `;
    container.classList.remove('hidden');
    return;
  }

  const rawSystemName = clinical.systemVi || part.system || 'Hệ Giải Phẫu';
  const systemName = rawSystemName.replace(/\s*\([^)]*\)/g, '').trim();
  const systemIcon = getSystemIcon(systemName);
  const parentInfo = getParentOrganInfo(part.id, mainName, clinical);
  const sysProfile = matchSystemProfile(part.system) || matchSystemProfile(systemName);

  let html = `
    <button type="button" class="crumb-chip crumb-system" data-action="system" title="Hệ: ${systemName} (Chạm để xem cả hệ)">
      <span class="crumb-icon">${systemIcon}</span>
      <span class="crumb-text">${systemName}</span>
      ${sysProfile ? '<span class="crumb-system-tag" style="opacity:0.85;font-size:9.5px;margin-left:4px;background:rgba(255,255,255,0.18);padding:1px 5px;border-radius:4px;">🌐 Xem cả hệ</span>' : ''}
    </button>
  `;

  if (parentInfo.name && parentInfo.name.toLowerCase() !== mainName.toLowerCase()) {
    html += `
      <span class="crumb-separator">›</span>
      <button type="button" class="crumb-chip crumb-parent" data-action="parent" data-query="${parentInfo.query}" title="Cơ quan: ${parentInfo.name}">
        <span class="crumb-icon">${parentInfo.icon}</span>
        <span class="crumb-text">${parentInfo.name}</span>
      </button>
    `;
  }

  html += `
    <span class="crumb-separator">›</span>
    <div class="crumb-chip crumb-current" title="Cấu trúc đang chọn">
      <span class="crumb-icon">🎯</span>
      <span class="crumb-text">${mainName}</span>
    </div>
  `;

  container.innerHTML = html;
  container.classList.remove('hidden');

  // Bind clicks
  container.querySelector('.crumb-system')?.addEventListener('click', async (e) => {
    e.stopPropagation();
    if (sysProfile) {
      showToast(`🌐 Đang mở Toàn Bộ: ${sysProfile.nameVi}`);
      await showcaseWholeSystem(sysProfile.id, viewer || state.viewer || window.viewer);
    } else {
      showToast(`🏛️ Đang chọn hệ: ${systemName}`);
      const sysBtn = document.getElementById('systemsToggle');
      if (sysBtn) sysBtn.click();
    }
  });

  container.querySelector('.crumb-parent')?.addEventListener('click', async (e) => {
    e.stopPropagation();
    const query = e.currentTarget.dataset.query;
    if (query) {
      showToast(`📍 Khám phá cơ quan: ${parentInfo.name}`);
      try {
        const resolvedId = resolvePartId(query);
        await selectStructureAnywhere(resolvedId);
        const card = document.getElementById('selectionCard');
        if (card) {
          card.classList.remove('hidden');
          window.dispatchEvent(new CustomEvent('expand-selection-card'));
        }
      } catch (err) {
        console.warn('Cannot navigate to parent organ:', err);
      }
    }
  });

  // Update Mini-Card crumb badge
  const miniCrumb = document.getElementById('miniCardCrumb');
  if (miniCrumb) {
    const badgeText = (parentInfo.name && parentInfo.name.toLowerCase() !== mainName.toLowerCase())
      ? parentInfo.name
      : systemName;
    miniCrumb.textContent = badgeText;
    miniCrumb.style.display = 'inline-flex';
    miniCrumb.title = `${systemName} › ${badgeText}`;
    miniCrumb.onclick = async (e) => {
      e.stopPropagation();
      if (parentInfo.query) {
        showToast(`📍 Cơ quan: ${parentInfo.name}`);
        const resolvedId = resolvePartId(parentInfo.query);
        await selectStructureAnywhere(resolvedId);
        const card = document.getElementById('selectionCard');
        if (card) {
          card.classList.remove('hidden');
          window.dispatchEvent(new CustomEvent('expand-selection-card'));
        }
      }
    };
  }
}

function renderNeighborSmartChips(part, clinical, mainName, viewer) {
  const section = document.getElementById('cardNeighborSmartSection');
  const scrollWrap = document.getElementById('cardNeighborChipsScroll');
  if (!section || !scrollWrap) return;

  // 1. If currently viewing a Whole System Showcase, display its key organs!
  if (part.isSystem && part.systemProfile?.keyOrgans) {
    section.classList.remove('hidden');
    const label = section.querySelector('.neighbor-label') || section.querySelector('h4');
    if (label) label.textContent = '🎯 CÁC CƠ QUAN TRỌNG ĐIỂM (Chạm để phóng to xem chi tiết)';

    scrollWrap.innerHTML = part.systemProfile.keyOrgans.map(org => `
      <button type="button" class="neighbor-smart-chip" data-search="${org.partId}" data-name="${org.nameVi}" title="Phóng to: ${org.nameVi}">
        <span class="neighbor-chip-icon">📍</span>
        <span class="neighbor-chip-name">${org.nameVi}</span>
        ${org.latin ? `<span class="neighbor-chip-latin" style="opacity:0.65;font-size:9.5px;font-style:italic;">(${org.latin})</span>` : ''}
      </button>
    `).join('');

    scrollWrap.querySelectorAll('.neighbor-smart-chip').forEach(btn => {
      btn.addEventListener('click', async (e) => {
        e.stopPropagation();
        const targetQuery = btn.dataset.search;
        const targetName = btn.dataset.name;
        showToast(`🎯 Phóng to cơ quan: ${targetName}`);
        try {
          await selectStructureAnywhere(targetQuery);
          const card = document.getElementById('selectionCard');
          if (card) {
            card.classList.remove('hidden');
            setSheetSnapTier('compact');
          }
        } catch (err) {
          console.warn('Organ zoom failed:', err);
        }
      });
    });
    return;
  }

  const neighbors = getNeighborList(part.id, mainName, clinical);
  if (!neighbors || neighbors.length === 0) {
    section.classList.add('hidden');
    scrollWrap.innerHTML = '';
    return;
  }

  section.classList.remove('hidden');
  scrollWrap.innerHTML = neighbors.map(n => `
    <button type="button" class="neighbor-smart-chip" data-search="${n.query || n.name}" data-name="${n.name}" title="Chuyển đến: ${n.name}">
      <span class="neighbor-chip-icon">${n.icon || '🔗'}</span>
      <span class="neighbor-chip-name">${n.name}</span>
      ${n.latin ? `<span class="neighbor-chip-latin" style="opacity:0.65;font-size:9.5px;font-style:italic;">(${n.latin})</span>` : ''}
    </button>
  `).join('');

  scrollWrap.querySelectorAll('.neighbor-smart-chip').forEach(btn => {
    btn.addEventListener('click', async (e) => {
      e.stopPropagation();
      const targetQuery = btn.dataset.search || btn.dataset.name;
      const targetName = btn.dataset.name;
      showToast(`🔗 Chuyển đến: ${targetName}`);
      try {
        const resolvedId = resolvePartId(targetQuery);
        await selectStructureAnywhere(resolvedId);
        const card = document.getElementById('selectionCard');
        if (card) {
          card.classList.remove('hidden');
          window.dispatchEvent(new CustomEvent('expand-selection-card'));
        }
      } catch (err) {
        console.warn('Neighbor navigation failed:', err);
      }
    });
  });
}

// =========================================================================
// PHASE 3: INTERACTIVE 4-STAGE PATHOLOGY & 15-SEC AI DOCTOR VOICE ENGINE
// =========================================================================

let currentActivePathology = null;
let currentActivePartForAI = null;
let currentClinicalForAI = null;

function getPathologyForPart(partId, mainName, clinical) {
  const str = `${partId} ${mainName}`.toLowerCase();

  // 1. Match against clinically authored PATIENT_CASES
  if (Array.isArray(PATIENT_CASES)) {
    for (const c of PATIENT_CASES) {
      if (c.partId && str.includes(c.partId.toLowerCase())) return c;
      if (c.id === 'acute_appendicitis' && /appendix|ruột thừa|ruot thua|hố chậu phải|mcburney/.test(str)) return c;
      if (c.id === 'rotator_cuff_tear' && /supraspinatus|infraspinatus|subscapularis|teres minor|rotator|chóp xoay|chop xoay|cơ trên gai/.test(str)) return c;
      if (c.id === 'frozen_shoulder' && /glenohumeral|capsule of shoulder|đông cứng vai|dong cung vai|viêm quanh khớp vai/.test(str)) return c;
      if (c.id === 'knee_meniscus_tear' && /meniscus|sụn chêm|sun chem/.test(str)) return c;
      if (c.id === 'knee_effusion' && /effusion|tràn dịch|tran dich|synovit/.test(str)) return c;
      if (c.id === 'sciatica_nerve' && /sciatic|thần kinh tọa|than kinh toa|thần kinh ngồi|piriformis|cơ hình lê/.test(str)) return c;
      if (c.id === 'coronary_artery_disease' && /coronary|động mạch vành|dong mach vanh|mạch vành|nhồi máu cơ tim/.test(str)) return c;
      if (c.id === 'spinal_spondylosis' && /spondylosis|gai cột sống|gai cot song|thoái hóa đốt sống|osteophyte/.test(str)) return c;
      if (c.id === 'cervical_spondylosis' && /cervical|c1|c2|c3|c4|c5|c6|c7|đốt sống cổ|cột sống cổ|atlas|axis/.test(str)) return c;
      if (c.id === 'gastric_ulcer' && /stomach|gaster|dạ dày|môn vị|tâm vị|tá tràng|duodenum/.test(str)) return c;
      if (c.id === 'cardiac_valve' && /ventricle|atrium|valve|aorta|pulmonar|tim|thất|nhĩ|van/.test(str)) return c;
      if (c.id === 'biliary_stones' && /gallbladder|liver|hepar|pancreas|túi mật|gan|tụy|ống mật/.test(str)) return c;
      if (c.id === 'disc_herniation' && (/lumbar|l1|l2|l3|l4|l5|thắt lưng|tọa/.test(str) || (/vertebra|disc|cột sống|đốt sống|đĩa đệm/.test(str) && !/cervical|c1|c2|c3|c4|c5|c6|c7|cổ|thoracic|t1|t2|t3|t4|t5|t6|t7|t8|t9|t10|t11|t12|ngực/.test(str)))) return c;
      if (c.id === 'knee_acl' && /knee|cruciate|patella|gối|chày|chéo/.test(str)) return c;
      if (c.id === 'kidney_stones' && /kidney|ren|ureter|thận|niệu quản/.test(str)) return c;
      if (c.id === 'willis_stroke' && /brain|cerebr|artery.*cerebr|willis|não|thần kinh sọ/.test(str)) return c;
      if (c.id === 'respiratory_copd' && /lung|pulmo|bronch|trachea|alveol|phổi|phế quản|khí quản/.test(str)) return c;
      if (c.id === 'carpal_tunnel' && /carpal|median nerve|bàn tay|cổ tay|gân gấp/.test(str)) return c;
      if (c.id === 'ear_vertigo' && /ear|vestibular|tiền đình|tai trong|malleus|incus|stapes/.test(str)) return c;
    }
  }

  // 2. Synthesize clinical 4-stage progression for other body systems
  const systemVi = clinical?.systemVi || '';
  if (/cơ|muscular|deltoid|pectoral|biceps|triceps/.test(str) || systemVi.includes('Cơ')) {
    return {
      id: 'muscle_pathology',
      title: 'Tổn thương cơ học & Hội chứng quá tải cơ',
      category: 'Cơ bắp & Vận động',
      icon: '💪',
      stages: [
        { name: 'Cấp 0: Bình thường', desc: 'Trương lực cơ và độ đàn hồi sợi Actin-Myosin đạt chuẩn sinh lý khỏe mạnh.' },
        { name: 'Cấp 1: Căng cứng & Vi chấn thương', desc: 'Tích tụ acid lactic sau vận động, mỏi nhức cơ âm ỉ, căng cơ cục bộ.' },
        { name: 'Cấp 2: Rách sợi cơ bán phần', desc: 'Rách một phần bó sợi cơ, sưng nề, đau nhói khi co cơ, tụ máu mô mềm.' },
        { name: 'Cấp 3: Đứt cơ hoàn toàn & Teo xơ', desc: 'Đứt toác gân cơ hoàn toàn, tụt đầu cơ, mất lực chi, cần phẫu thuật khâu phục hồi.' }
      ],
      advice: '✓ Nghỉ ngơi, chườm lạnh trong 48h đầu sau chấn thương.\n✓ Khởi động kỹ trước khi tập luyện và bổ sung đủ nước, điện giải.'
    };
  }

  if (/xương|khớp|bone|skeletal|femur|tibia|clavicle|humerus|radius|ulna/.test(str) || systemVi.includes('Xương')) {
    return {
      id: 'bone_joint_pathology',
      title: 'Thoái hóa sụn khớp & Loãng xương',
      category: 'Hệ xương khớp',
      icon: '🦴',
      stages: [
        { name: 'Cấp 0: Khung xương vững chắc', desc: 'Mật độ khoáng xương cao, bề mặt sụn khớp trơn láng hấp thu lực tốt.' },
        { name: 'Cấp 1: Giảm mật độ xương & Mòn sụn', desc: 'Mỏi nhức khớp nhẹ khi mang vác nặng, thời tiết lạnh hoặc ngồi lâu.' },
        { name: 'Cấp 2: Hẹp khe khớp & Mọc gai xương', desc: 'Đau cứng khớp buổi sáng, lạo xạo khi vận động, sưng viêm bao hoạt dịch.' },
        { name: 'Cấp 3: Dính biến dạng & Gãy xương bệnh lý', desc: 'Mất biên độ vận động khớp, biến dạng trục chi, giòn xốp dễ gãy xương.' }
      ],
      advice: '✓ Bổ sung Canxi, Vitamin D3, Magie và tập thể dục chịu tải thường xuyên.\n✓ Tránh bê vác quá tải và kiểm tra mật độ xương định kỳ.'
    };
  }

  if (/mạch máu|artery|vein|động mạch|tĩnh mạch|vascular/.test(str) || systemVi.includes('Mạch')) {
    return {
      id: 'vascular_pathology',
      title: 'Xơ vữa động mạch & Thiếu máu cục bộ',
      category: 'Tuần hoàn & Mạch máu',
      icon: '🔴',
      stages: [
        { name: 'Cấp 0: Mạch máu trơn láng', desc: 'Lớp nội mô trơn nhẵn, thành mạch đàn hồi, tưới máu thông suốt.' },
        { name: 'Cấp 1: Lắng đọng mảng lipid', desc: 'Mỡ máu LDL thâm nhập nội mô, dày thành mạch vi thể, chưa hẹp lòng.' },
        { name: 'Cấp 2: Hẹp lòng mạch 50-70%', desc: 'Mảng xơ vữa phát triển, thiếu máu nuôi khi gắng sức, đau cách hồi.' },
        { name: 'Cấp 3: Nứt vỡ & Bít tắc huyết khối', desc: 'Cục máu đông bít kín lòng mạch, hoại tử mô cấp cứu, nguy cơ nhồi máu cao.' }
      ],
      advice: '✓ Kiểm soát mỡ máu LDL, huyết áp và chỉ số đường huyết.\n✓ Không hút thuốc lá và tập thể dục nhịp điệu đều đặn 30 phút/ngày.'
    };
  }

  return {
    id: 'general_pathology',
    title: 'Diễn tiến bệnh lý & Biến chứng lâm sàng',
    category: 'Bệnh học & Phục hồi',
    icon: '🩺',
    stages: [
      { name: 'Cấp 0: Sinh lý bình thường', desc: 'Cấu trúc giải phẫu học hoàn chỉnh, đảm bảo đầy đủ chức năng sinh lý cơ bản.' },
      { name: 'Cấp 1: Rối loạn phản ứng sớm', desc: 'Xung huyết nhẹ hoặc phù nề mô kẽ, cảm giác căng mỏi hoặc đau âm ỉ.' },
      { name: 'Cấp 2: Tổn thương cấu trúc thực thể', desc: 'Suy giảm chức năng rõ rệt, đau tăng khi vận động, có biểu hiện viêm mạn tính.' },
      { name: 'Cấp 3: Biến chứng mạn tính & Thoái biến', desc: 'Xơ hóa mô, teo mất chức năng, ảnh hưởng dây chuyền đến các cơ quan lân cận.' }
    ],
    advice: '✓ Lắng nghe cơ thể, thăm khám chuyên khoa khi có dấu hiệu bất thường kéo dài.\n✓ Duy trì chế độ dinh dưỡng lành mạnh và thói quen sinh hoạt khoa học.'
  };
}

function renderPathologyProgressionSection(part, clinical, mainName, viewer) {
  const section = document.getElementById('cardPathologySection');
  if (!section) return;

  const pathology = getPathologyForPart(part.id, mainName, clinical);
  currentActivePathology = pathology;
  currentActivePartForAI = part;
  currentClinicalForAI = clinical;

  if (!pathology || !pathology.stages || pathology.stages.length < 4) {
    section.classList.add('hidden');
    return;
  }

  section.classList.remove('hidden');

  const titleEl = document.getElementById('pathologyTitle');
  const catEl = document.getElementById('pathologyCategoryTag');
  const iconEl = document.getElementById('pathologyIcon');
  const slider = document.getElementById('pathologyRangeSlider');
  const badge = document.getElementById('pathologyStageBadge');
  const levelEl = document.getElementById('pathologyStageLevel');
  const nameEl = document.getElementById('pathologyStageName');
  const descEl = document.getElementById('pathologyStageDesc');
  const adviceEl = document.getElementById('pathologyStageAdvice');
  const stageCard = document.getElementById('pathologyStageCard');
  const stageBody = document.getElementById('pathologyStageBody');
  const toggleBtn = document.getElementById('btnTogglePathologyDesc');
  const toggleLabel = document.getElementById('pathologyToggleLabel');
  const ticks = section.querySelectorAll('.stage-tick');

  if (titleEl) titleEl.textContent = pathology.title || 'Mô phỏng diễn tiến bệnh lý';
  if (catEl) catEl.textContent = pathology.category || 'Bệnh học';
  if (iconEl) iconEl.textContent = pathology.icon || '⚡';

  // Mặc định luôn ẩn mô tả chi tiết để siêu gọn
  if (stageBody) {
    stageBody.classList.add('hidden');
  }
  if (toggleBtn) {
    toggleBtn.setAttribute('aria-expanded', 'false');
    toggleBtn.classList.remove('expanded');
  }
  if (toggleLabel) {
    toggleLabel.textContent = 'Xem mô tả ↓';
  }

  // Xử lý nút bật/tắt xem mô tả giai đoạn
  if (toggleBtn) {
    toggleBtn.onclick = (e) => {
      e.stopPropagation();
      if (!stageBody) return;
      const isCurrentlyHidden = stageBody.classList.contains('hidden');
      if (isCurrentlyHidden) {
        stageBody.classList.remove('hidden');
        toggleBtn.setAttribute('aria-expanded', 'true');
        toggleBtn.classList.add('expanded');
        if (toggleLabel) toggleLabel.textContent = 'Thu gọn ↑';
      } else {
        stageBody.classList.add('hidden');
        toggleBtn.setAttribute('aria-expanded', 'false');
        toggleBtn.classList.remove('expanded');
        if (toggleLabel) toggleLabel.textContent = 'Xem mô tả ↓';
      }
    };
  }

  function applyStage(idx) {
    const stage = pathology.stages[idx] || pathology.stages[0];
    if (slider) slider.value = idx;

    if (badge) {
      badge.textContent = stage.name;
      badge.className = `pathology-stage-pill stage-pill-${idx}`;
    }

    if (levelEl) levelEl.textContent = `GĐ ${idx}`;
    if (nameEl) nameEl.textContent = stage.name.replace(/^Cấp\s*\d+:\s*/i, '');
    if (descEl) {
      descEl.textContent = stage.desc;
    }

    if (stageCard) {
      stageCard.className = `pathology-stage-card level-${idx}`;
    }

    ticks.forEach((tick, i) => {
      tick.classList.toggle('active', i === idx);
    });

    if (adviceEl) {
      if (idx >= 2 && pathology.advice) {
        adviceEl.textContent = pathology.advice;
        adviceEl.classList.remove('hidden');
      } else {
        adviceEl.classList.add('hidden');
      }
    }

    if (typeof window !== 'undefined' && typeof window.updatePathologyStageVisuals === 'function') {
      window.updatePathologyStageVisuals(idx, part.id, viewer);
    }
  }

  applyStage(0);

  if (slider) {
    slider.oninput = (e) => {
      e.stopPropagation();
      const val = parseInt(e.target.value, 10);
      applyStage(val);
      showToast(`⚡ Bệnh lý Giai đoạn ${val}: ${pathology.stages[val]?.name || ''}`);
    };
  }

  ticks.forEach(tick => {
    tick.onclick = (e) => {
      e.stopPropagation();
      const step = parseInt(tick.dataset.step, 10);
      applyStage(step);
      showToast(`⚡ Bệnh lý Giai đoạn ${step}: ${pathology.stages[step]?.name || ''}`);
    };
  });

  // Append-only 1-click Quick Action for 3D Pathology Showcase
  const titleWrap = section.querySelector('.pathology-title-wrap');
  let btn3DFocus = section.querySelector('#btnPathology3DFocus');
  if (!btn3DFocus && titleWrap) {
    btn3DFocus = document.createElement('button');
    btn3DFocus.type = 'button';
    btn3DFocus.id = 'btnPathology3DFocus';
    btn3DFocus.className = 'pathology-3d-quick-btn';
    btn3DFocus.title = 'Kích hoạt mô phỏng 3D tiêu điểm ca bệnh này';
    btn3DFocus.innerHTML = '<span>⚡ Xem 3D</span>';
    btn3DFocus.style.cssText = 'display:inline-flex;align-items:center;gap:4px;padding:3px 8px;font-size:11px;font-weight:600;color:#0ea5e9;background:rgba(14,165,233,0.12);border:1px solid rgba(14,165,233,0.3);border-radius:12px;cursor:pointer;margin-top:4px;transition:all 0.2s ease;';
    btn3DFocus.onmouseover = () => { btn3DFocus.style.background = 'rgba(14,165,233,0.22)'; };
    btn3DFocus.onmouseout = () => { btn3DFocus.style.background = 'rgba(14,165,233,0.12)'; };
    titleWrap.appendChild(btn3DFocus);
  }
  if (btn3DFocus) {
    btn3DFocus.onclick = (e) => {
      e.stopPropagation();
      if (typeof window !== 'undefined' && typeof window.showcasePathology === 'function') {
        window.showcasePathology(pathology.id, viewer);
      }
    };
  }
}

function generate15SecVoiceSummary(part, clinical, pathology) {
  const rawName = part.displayName || clinical.nameVi || part.id;
  const cleanName = (rawName || '').replace(/\s*\([^)]*\)/g, '').trim() || rawName;

  let funcText = clinical.function || clinical.description || '';
  funcText = funcText.split(/[\.\!\?]\s+/)[0] || funcText;
  funcText = funcText.replace(/^[A-ZÀ-Ỹ\s]+:/i, '').trim();

  let pathoText = '';
  if (pathology && pathology.title) {
    pathoText = `Về mặt lâm sàng, thường gặp bệnh lý ${pathology.title}.`;
  } else if (clinical.clinical) {
    const rawClin = clinical.clinical.split(/[\.\!\?]\s+/)[0];
    pathoText = `Lưu ý lâm sàng: ${rawClin}.`;
  } else {
    pathoText = `Cần lưu ý bảo vệ và theo dõi sức khỏe cơ quan này định kỳ.`;
  }

  let adviceText = '';
  if (pathology && pathology.advice) {
    const firstAdvice = pathology.advice.split('\n')[0].replace(/^✓\s*/, '');
    adviceText = `Lời khuyên: ${firstAdvice}`;
  } else {
    adviceText = `Hãy giữ lối sống lành mạnh và thăm khám khi có biểu hiện bất thường.`;
  }

  // Bỏ chữ chào bạn hay giới thiệu, vào luôn vấn đề cốt lõi
  return `${cleanName}: ${funcText}. ${pathoText} ${adviceText}`;
}

function play15SecVoiceSummary(btnEl) {
  if (!('speechSynthesis' in window)) {
    showToast('Trình duyệt không hỗ trợ Web Speech TTS.');
    return;
  }

  if (currentlySpeakingBtn) {
    window.speechSynthesis.cancel();
    currentlySpeakingBtn.classList.remove('is-speaking');
    const wasThis = (currentlySpeakingBtn === btnEl);
    currentlySpeakingBtn = null;
    if (wasThis) {
      showToast('⏹️ Đã dừng nghe giải thích');
      return;
    }
  }

  const part = currentActivePartForAI || state.selectedPart;
  if (!part) {
    showToast('Vui lòng chọn một cấu trúc giải phẫu trước.');
    return;
  }

  const clinical = currentClinicalForAI || getClinicalData(part.id);
  const speechText = generate15SecVoiceSummary(part, clinical, currentActivePathology);
  const clean = cleanMedicalSpeech(speechText);

  const utterance = new SpeechSynthesisUtterance(clean);
  utterance.lang = 'vi-VN';
  utterance.rate = 0.95;
  utterance.pitch = 1.0;

  const viVoice = getVietnameseVoice();
  if (viVoice) utterance.voice = viVoice;

  btnEl?.classList.add('is-speaking');
  currentlySpeakingBtn = btnEl;
  showToast('🎙️ Đang nghe giải thích (15s)...');

  utterance.onend = () => {
    btnEl?.classList.remove('is-speaking');
    if (currentlySpeakingBtn === btnEl) currentlySpeakingBtn = null;
  };

  utterance.onerror = () => {
    btnEl?.classList.remove('is-speaking');
    if (currentlySpeakingBtn === btnEl) currentlySpeakingBtn = null;
  };

  window.speechSynthesis.speak(utterance);
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

  const subparts = constituents.subparts || [];
  const maxInitial = 4;
  const hasExtra = subparts.length > maxInitial;

  const chipsHtml = subparts.map((sub, idx) => {
    const isExtra = idx >= maxInitial;
    return `
      <button type="button" class="constituent-chip ${isExtra ? 'subpart-extra hidden' : ''}" data-search="${sub.searchQuery || sub.name}" data-name="${sub.name}" title="Chạm để định vị 3D: ${sub.name}">
        <span class="chip-icon">${sub.icon || '🔹'}</span>
        <div class="chip-text-wrap">
          <span class="chip-name">${sub.name}</span>
          ${sub.latin ? `<span class="chip-latin">${sub.latin}</span>` : ''}
        </div>
      </button>
    `;
  }).join('');

  const toggleHtml = hasExtra ? `
    <button type="button" class="btn-subparts-expand-toggle btn-text-expand-toggle" id="btnToggleSubparts">
      <span class="subparts-toggle-text">+${subparts.length - maxInitial} bộ phận khác (Mở rộng ↓)</span>
      <svg width="10" height="10" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5"><polyline points="6 9 12 15 18 9"/></svg>
    </button>
  ` : '';

  grid.innerHTML = chipsHtml + toggleHtml;

  if (hasExtra) {
    const toggleSubBtn = grid.querySelector('#btnToggleSubparts');
    toggleSubBtn?.addEventListener('click', (e) => {
      e.stopPropagation();
      const extraChips = grid.querySelectorAll('.subpart-extra');
      const isHidden = extraChips[0]?.classList.contains('hidden');
      extraChips.forEach(c => c.classList.toggle('hidden', !isHidden));
      toggleSubBtn.classList.toggle('is-expanded', isHidden);
      const textSpan = toggleSubBtn.querySelector('.subparts-toggle-text');
      if (textSpan) {
        textSpan.textContent = isHidden ? 'Thu gọn ↑' : `+${subparts.length - maxInitial} bộ phận khác (Mở rộng ↓)`;
      }
    });
  }

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
// RENDER HÌNH ẢNH MINH HỌA GIẢI PHẪU (CHỈ HIỂN THỊ KHI NGƯỜI DÙNG BẤM XEM TRONG MÔ TẢ)
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

  // Strictly follow rule: "ảnh chỉ trong mô tả thôi tuyệt đối không ấn vào một cái bộ phận nào mà ra một cái ảnh"
  // Keep collapsed by default so selecting any 3D part NEVER pops up or reveals an image upfront.
  section.classList.remove('hidden');
  container.innerHTML = `
    <div class="anatomy-photo-accordion">
      <button type="button" class="btn-toggle-diagram-desc" id="btnToggleDiagramDesc" aria-expanded="false">
        <span class="diagram-icon">🖼️</span>
        <span class="diagram-label">Xem ảnh minh họa mô tả 2D (${constituents.title || mainName})</span>
        <span class="diagram-arrow">▼</span>
      </button>
      <div class="diagram-desc-drawer hidden" id="diagramDescDrawer">
        <div class="anatomy-photo-card" id="btnZoomAnatomyPhoto" title="Chạm để phóng to xem chi tiết toàn màn hình">
          <div class="photo-img-wrap">
            <img src="${constituents.diagram}" alt="${constituents.diagramCaption || mainName}" class="anatomy-photo-img" loading="lazy" />
            <span class="photo-zoom-badge">🔍 Chạm phóng to toàn màn hình</span>
          </div>
          <div class="photo-caption-bar">
            <span class="photo-caption-text">${constituents.diagramCaption || constituents.title || mainName}</span>
          </div>
        </div>
      </div>
    </div>
  `;

  const toggleBtn = container.querySelector('#btnToggleDiagramDesc');
  const drawer = container.querySelector('#diagramDescDrawer');
  const arrow = container.querySelector('.diagram-arrow');

  toggleBtn?.addEventListener('click', (e) => {
    e.stopPropagation();
    const isHidden = drawer.classList.contains('hidden');
    drawer.classList.toggle('hidden', !isHidden);
    toggleBtn.setAttribute('aria-expanded', String(isHidden));
    if (arrow) arrow.textContent = isHidden ? '▲' : '▼';
  });

  const zoomHandler = (e) => {
    e.stopPropagation();
    openImageZoomModal({
      src: constituents.diagram,
      title: constituents.title || mainName,
      subtitle: constituents.diagramCaption || `Ảnh giải phẫu cấu tạo chi tiết: ${mainName}`
    });
  };

  container.querySelector('#btnZoomAnatomyPhoto')?.addEventListener('click', zoomHandler);
}

// -----------------------------------------------------------------------------
// RENDER KHỐI VIDEO MINH HỌA GIẢI PHẪU (YOUTUBE & MP4 NỘI BỘ KÈM NÉN)
// -----------------------------------------------------------------------------
function renderPartVideoSection(part, clinical, mainName, viewer) {
  const section = document.getElementById('cardVideoSection');
  if (!section) return;

  const video = getPartVideo(part.id);
  if (!video || !video.videoUrl || !isVerifiedVideo(video.videoUrl)) {
    section.classList.add('hidden');
    section.innerHTML = '';
    return;
  }

  const isAdmin = isAdminLoggedIn();
  section.classList.remove('hidden');

  section.innerHTML = `
    <div class="info-group-title">
      <span>🎬 Video hoạt ảnh & Playlist đào tạo y khoa</span>
    </div>
    <div class="part-microvideo-row" id="btnPlayPartVideo" title="Chạm để phát video hoạt ảnh 3D">
      <div class="microvideo-thumb-box">
        <img src="${video.thumbnail || './images/atlas/med_skin.png'}" class="microvideo-img" alt="${video.title}" loading="lazy" />
        <div class="microvideo-play-btn-circle">
          <svg width="13" height="13" viewBox="0 0 24 24" fill="currentColor"><polygon points="6 4 20 12 6 20 6 4"/></svg>
        </div>
        <span class="microvideo-duration">${video.duration || 'Playlist'}</span>
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
    ${video.nutritionUrl ? `
      <div class="part-microvideo-extra-row">
        <button type="button" class="btn-microvideo-extra-pill nutrition" id="btnPlayExtraNutrition" title="Xem hướng dẫn dinh dưỡng lâm sàng">
          <span>🥗 ${video.nutritionTitle || 'Ăn Uống & Dinh Dưỡng Khoa Học'} ▶</span>
        </button>
      </div>
    ` : ''}
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

  section.querySelector('#btnPlayExtraNutrition')?.addEventListener('click', (e) => {
    e.stopPropagation();
    openVideoModal(video.nutritionUrl, video.nutritionTitle || 'Ăn Uống & Dinh Dưỡng Khoa Học');
  });

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

  // Support all specialized micro-decks & 4-stage simulators (Discs, Coronary Atherosclerosis, Liver Cirrhosis, Hip OA, Cataract)
  if (!deck) {
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

  const diagramSrc = deck.diagramImage || deck.slides?.[1]?.image || deck.slides?.[0]?.image || deck.thumbnail;
  const diagramHtml = diagramSrc ? `
    <div class="deck-diagram-wrap" style="margin-bottom:8px;border-radius:8px;overflow:hidden;background:rgba(15,23,42,0.6);border:1px solid rgba(255,255,255,0.08);text-align:center;padding:4px;">
      <img src="${diagramSrc}" alt="${deck.titleVi || deck.title}" style="max-width:100%;height:auto;max-height:160px;display:block;margin:0 auto;border-radius:6px;filter:contrast(1.05);" />
    </div>
  ` : '';

  // Dynamic Header Title (Strict 1-line)
  let headerTitle = deck.titleVi || deck.title || `🔬 CẤU TRÚC GIẢI PHẪU CHUYÊN SÂU`;
  if (deck.id === 'concept_intervertebral_disc') {
    const isDisc = partId.startsWith('Intervertebral disc ');
    const isNucleus = partId.startsWith('Nucleus pulposus ');
    const level = isDisc ? partId.slice('Intervertebral disc '.length) : (isNucleus ? partId.slice('Nucleus pulposus '.length) : 'L4-L5');
    headerTitle = `🔬 CẤU TRÚC ĐĨA ĐỆM CỘT SỐNG ${level}`;
  }

  const descText = deck.desc || (deck.id === 'concept_intervertebral_disc'
    ? 'Cấu trúc đĩa đệm gồm <strong>Vòng sợi bao xơ</strong> (Anulus fibrosus) dày chắc bên ngoài và <strong>Nhân nhầy</strong> (Nucleus pulposus) ở tâm chịu lực nén thủy lực.'
    : 'Cấu trúc giải phẫu học chuyên sâu và mô phỏng tiến triển 4 giai đoạn lâm sàng.');

  container.innerHTML = `
    <div class="disc-subunits-box">
      <div class="disc-subunits-header">
        <span class="disc-subunits-title">${headerTitle}</span>
      </div>
      <div class="disc-structure-intro" style="font-size:12px;color:var(--text-secondary,#475569);margin-bottom:8px;line-height:1.45;">
        ${descText}
      </div>
      ${diagramHtml}
      ${subunitsHtml}
      ${simHtml}
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

  const range = container.querySelector('#herniationRange');
  const stageLabel = container.querySelector('#herniationStageLabel');
  const stageDesc = container.querySelector('#herniationStageDesc');

  range?.addEventListener('input', (e) => {
    const val = parseInt(e.target.value, 10);
    const stage = sim.stages[val] || sim.stages[0];
    if (stageLabel) stageLabel.textContent = stage.level;
    if (stageDesc) stageDesc.textContent = stage.desc;
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

    openClinicalAxesModal(axisId);
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
    match: ['ankle', 'talus', 'calcaneus', 'cổ chân', 'xương sên', 'xương gót', 'mắt cá'],
    motionId: MOTIONS.KNEE_FLEXION,
    title: '🏃 ĐỘNG HỌC KHỚP CỔ CHÂN',
    actionName: 'Gập mu chân (Dorsiflexion)',
    minAngle: 0,
    maxAngle: 50,
    agonist: 'Cơ chày trước (Tibialis anterior) & Cơ bụng chân',
    note: 'Gập mu chân 0-20°, gập lòng bàn chân 0-50°'
  },
  {
    match: ['wrist', 'carpal', 'scaphoid', 'lunate', 'cổ tay', 'xương thuyền', 'xương nguyệt'],
    motionId: MOTIONS.FOREARM_PRONATION,
    title: '🏃 ĐỘNG HỌC KHỚP CỔ TAY',
    actionName: 'Gập cổ tay (Palmar flexion)',
    minAngle: 0,
    maxAngle: 80,
    agonist: 'Cơ gấp cổ tay quay & Cơ gấp cổ tay trụ',
    note: 'Gập cổ tay 0-80°, duỗi cổ tay 0-70°'
  },
  {
    match: ['mandible', 'temporomandibular', 'tmj', 'hàm dưới', 'thái dương hàm', 'cơ cắn'],
    motionId: MOTIONS.SPINE_FLEXION,
    title: '🏃 ĐỘNG HỌC KHỚP THÁI DƯƠNG HÀM',
    actionName: 'Há miệng (Hạ hàm)',
    minAngle: 0,
    maxAngle: 45,
    agonist: 'Cơ chân bướm ngoài & Nhóm cơ trên móng',
    note: 'Biên độ há miệng 35-45mm, trượt ra trước 5-10mm'
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

function renderNetterBiomechanicsSection(part, clinical, mainName, viewer) {
  const container = document.getElementById('cardMuscleNetterSection');
  if (!container) return;

  const partId = String(part?.id || '').toLowerCase();
  const nameVi = String(clinical?.nameVi || mainName || '').toLowerCase();
  const system = String(part?.system || clinical?.systemVi || '').toLowerCase();

  const isMuscle = system.includes('muscular') ||
                   system.includes('cơ') ||
                   partId.includes('muscle') ||
                   partId.includes('tendon') ||
                   partId.includes('aponeuros') ||
                   nameVi.includes('cơ ') ||
                   nameVi.includes('gân ') ||
                   nameVi.includes('cân ');

  if (!isMuscle) {
    container.classList.add('hidden');
    container.innerHTML = '';
    return;
  }

  const bonesRelation = clinical.relations?.bones || 'Bám vào các mấu, củ, mào và diện xương qua gân cơ, tạo hệ thống đòn bẩy cử động.';
  const nervesRelation = clinical.relations?.nerves || 'Được phân nhánh chi phối bởi các sợi thần kinh vận động và cảm giác bản thể tương ứng.';
  const vesselsRelation = clinical.relations?.vessels || 'Được cấp máu nuôi dưỡng phong phú bởi các nhánh động mạch cơ và mạng mao mạch nội mạc.';
  const actionText = clinical.function || 'Tham gia co rút chủ động, truyền lực đòn bẩy qua khớp và duy trì tư thế sinh lý.';

  container.classList.remove('hidden');
  container.innerHTML = `
    <div class="muscle-netter-box">
      <div class="muscle-netter-header">
        <div class="muscle-netter-badge">
          <span class="netter-dot"></span>
          <span>Giải Phẫu Lâm Sàng Netter</span>
        </div>
        <span class="muscle-netter-sub">Nguyên ủy · Bám tận · Thần kinh</span>
      </div>

      <div class="muscle-netter-grid">
        <!-- Điểm bám xương / Nguyên ủy & Bám tận -->
        <div class="netter-field-card origin-field">
          <div class="netter-field-title">
            <span class="netter-icon">🦴</span>
            <span>Nguyên ủy & Bám tận trên Xương:</span>
          </div>
          <div class="netter-field-desc">${renderCollapsibleTextHtml(bonesRelation, 100, 'Mở rộng ↓', 'Thu gọn ↑')}</div>
        </div>

        <!-- Thần kinh chi phối -->
        <div class="netter-field-card nerve-field">
          <div class="netter-field-title">
            <span class="netter-icon">⚡</span>
            <span>Thần kinh chi phối:</span>
          </div>
          <div class="netter-field-desc">${renderCollapsibleTextHtml(nervesRelation, 100, 'Mở rộng ↓', 'Thu gọn ↑')}</div>
        </div>

        <!-- Mạch máu nuôi -->
        <div class="netter-field-card vessel-field">
          <div class="netter-field-title">
            <span class="netter-icon">🩸</span>
            <span>Mạch máu cấp máu:</span>
          </div>
          <div class="netter-field-desc">${renderCollapsibleTextHtml(vesselsRelation, 100, 'Mở rộng ↓', 'Thu gọn ↑')}</div>
        </div>

        <!-- Động tác vận động -->
        <div class="netter-field-card action-field">
          <div class="netter-field-title">
            <span class="netter-icon">🏋️</span>
            <span>Chức năng cơ học:</span>
          </div>
          <div class="netter-field-desc">${renderCollapsibleTextHtml(actionText, 100, 'Mở rộng ↓', 'Thu gọn ↑')}</div>
        </div>
      </div>

      <!-- Action Buttons: Tương tác lâm sàng Netter -->
      <div class="muscle-netter-actions">
        <button type="button" class="btn-netter-action btn-show-attachment" id="btnShowBoneAttachment" title="Hiển thị khung xương và điểm bám của cơ này">
          <span>🦴 Xem Khung xương & Điểm bám</span>
        </button>
        <button type="button" class="btn-netter-action btn-reset-muscles" id="btnResetMuscles" title="Khôi phục hiển thị toàn bộ cơ">
          <span>🔄 Khôi phục hệ cơ</span>
        </button>
      </div>
    </div>
  `;

  // Bind actions
  const btnAttachment = container.querySelector('#btnShowBoneAttachment');
  const btnReset = container.querySelector('#btnResetMuscles');

  btnAttachment?.addEventListener('click', async (e) => {
    e.stopPropagation();
    const activeViewer = viewer || window.viewer || state.viewer;
    if (activeViewer) {
      if (!state.loadedSystems.includes('skeletal')) {
        showToast('⏳ Đang tải khung xương để hiển thị điểm bám...');
        await activeViewer.loadModel('skeletal', activeViewer);
      }
      ghostAllExcept(part.id);
      showToast(`🦴 Đang hiển thị điểm bám xương của: ${clinical.nameVi || mainName}`);
    }
  });

  btnReset?.addEventListener('click', (e) => {
    e.stopPropagation();
    clearGhost();
    restoreAllParts();
    showToast('🔄 Đã khôi phục toàn bộ hệ cơ bắp');
  });
}

