// Motion Panel UI Controller
// Provides user interface for Dynamic Anatomy: Motion selector, timeline scrubbing,
// playback speed controls, physiological phase indicator, and live structure isolation.

import { dynamicAnatomy, MOTIONS, MOTION_METADATA } from '../viewer/dynamicAnatomy.js';

const SVG_PLAY = `<svg width="18" height="18" viewBox="0 0 24 24" fill="currentColor"><polygon points="5 3 19 12 5 21 5 3"/></svg>`;
const SVG_PAUSE = `<svg width="18" height="18" viewBox="0 0 24 24" fill="currentColor"><rect x="6" y="4" width="4" height="16"/><rect x="14" y="4" width="4" height="16"/></svg>`;
const SVG_REWIND = `<svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><polygon points="11 19 2 12 11 5 11 19"/><polygon points="22 19 13 12 22 5 22 19"/></svg>`;
const SVG_LOOP = `<svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><polyline points="17 1 21 5 17 9"/><path d="M3 11V9a4 4 0 0 1 4-4h14"/><polyline points="7 23 3 19 7 15"/><path d="M21 13v2a4 4 0 0 1-4 4H3"/></svg>`;
const SVG_EYE = `<svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" style="vertical-align:middle;margin-right:4px;"><path d="M1 12s4-8 11-8 11 8 11 8-4 8-11 8-11-8-11-8z"/><circle cx="12" cy="12" r="3"/></svg>`;
const SVG_CLOSE = `<svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" style="vertical-align:middle;margin-right:4px;"><path d="M18 6L6 18M6 6l12 12"/></svg>`;
const SVG_SETTINGS = `<svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" style="vertical-align:middle;margin-right:4px;"><circle cx="12" cy="12" r="3"/><path d="M19.4 15a1.65 1.65 0 0 0 .33 1.82l.06.06a2 2 0 0 1 0 2.83 2 2 0 0 1-2.83 0l-.06-.06a1.65 1.65 0 0 0-1.82-.33 1.65 1.65 0 0 0-1 1.51V21a2 2 0 0 1-2 2 2 2 0 0 1-2-2v-.09A1.65 1.65 0 0 0 9 19.4a1.65 1.65 0 0 0-1.82.33l-.06.06a2 2 0 0 1-2.83 0 2 2 0 0 1 0-2.83l.06-.06a1.65 1.65 0 0 0 .33-1.82 1.65 1.65 0 0 0-1.51-1H3a2 2 0 0 1-2-2 2 2 0 0 1 2-2h.09A1.65 1.65 0 0 0 4.6 9a1.65 1.65 0 0 0-.33-1.82l-.06-.06a2 2 0 0 1 0-2.83 2 2 0 0 1 2.83 0l.06.06a1.65 1.65 0 0 0 1.82.33H9a1.65 1.65 0 0 0 1-1.51V3a2 2 0 0 1 2-2 2 2 0 0 1 2 2v.09a1.65 1.65 0 0 0 1 1.51 1.65 1.65 0 0 0 1.82-.33l.06-.06a2 2 0 0 1 2.83 0 2 2 0 0 1 0 2.83l-.06.06a1.65 1.65 0 0 0-.33 1.82V9a1.65 1.65 0 0 0 1.51 1H21a2 2 0 0 1 2 2 2 2 0 0 1-2 2h-.09a1.65 1.65 0 0 0-1.51 1z"/></svg>`;
const SVG_FILM = `<svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" style="vertical-align:middle;margin-right:5px;"><rect x="2" y="2" width="20" height="20" rx="2.18" ry="2.18"/><line x1="7" y1="2" x2="7" y2="22"/><line x1="17" y1="2" x2="17" y2="22"/><line x1="2" y1="12" x2="22" y2="12"/><line x1="2" y1="7" x2="7" y2="7"/><line x1="2" y1="17" x2="7" y2="17"/><line x1="17" y1="17" x2="22" y2="17"/><line x1="17" y1="7" x2="22" y2="7"/></svg>`;
const SVG_TARGET = `<svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" style="vertical-align:middle;margin-right:4px;"><circle cx="12" cy="12" r="10"/><circle cx="12" cy="12" r="4"/></svg>`;

let popoverEl = null;
let isDraggingScrubber = false;
let canvasListenerAttached = false;

export function initMotionPanel(viewer) {
  dynamicAnatomy.init(viewer);
  popoverEl = document.getElementById('motionPopover');

  if (!popoverEl) {
    popoverEl = document.createElement('div');
    popoverEl.id = 'motionPopover';
    popoverEl.className = 'motion-popover hidden';
    document.getElementById('viewerContainer')?.appendChild(popoverEl);
  }

  renderMotionPanelContent();
  setupEventListeners();

  // Clicking or touching outside popover / on 3D canvas automatically minimizes the frame
  if (!canvasListenerAttached) {
    const viewerContainer = document.getElementById('viewerContainer');
    const dismissToMini = (e) => {
      if (popoverEl && !popoverEl.classList.contains('hidden') && !popoverEl.classList.contains('minimized')) {
        if (!popoverEl.contains(e.target) && !document.getElementById('btnToolMotion')?.contains(e.target)) {
          minimizeMotionPanel();
        }
      }
    };
    viewerContainer?.addEventListener('pointerdown', dismissToMini);
    viewerContainer?.addEventListener('touchstart', dismissToMini, { passive: true });
    canvasListenerAttached = true;
  }

  // Subscribe to dynamic anatomy engine state
  dynamicAnatomy.subscribe(updateMotionUI);
}

export function openMotionPanel(viewer, defaultMotion = MOTIONS.CARDIAC) {
  if (!popoverEl) {
    initMotionPanel(viewer);
  }

  popoverEl.style.display = '';
  popoverEl.classList.remove('hidden');
  popoverEl.classList.remove('minimized');
  document.getElementById('btnToolMotion')?.classList.add('active');

  // If a motion is requested, switch to it, otherwise keep current or launch default
  const curState = dynamicAnatomy.getState();
  if (defaultMotion && defaultMotion !== curState.motionId) {
    dynamicAnatomy.setMotion(defaultMotion);
  } else if (!curState.motionId) {
    dynamicAnatomy.setMotion(defaultMotion || MOTIONS.CARDIAC);
  } else {
    updateMotionUI(curState);
  }
}

export function minimizeMotionPanel() {
  if (popoverEl) {
    popoverEl.classList.add('minimized');
  }
}

export function expandMotionPanel() {
  if (popoverEl) {
    popoverEl.classList.remove('minimized');
  }
}

export function closeMotionPanel() {
  if (popoverEl) {
    popoverEl.classList.add('hidden');
    popoverEl.classList.remove('minimized');
    popoverEl.style.display = 'none';
  }
  document.getElementById('btnToolMotion')?.classList.remove('active');
  dynamicAnatomy.pause();
  dynamicAnatomy.resetPose();
  dynamicAnatomy.restoreSystemVisibility();
  dynamicAnatomy.restoreAllVisibility();
}

export function toggleMotionPanel(viewer) {
  if (!popoverEl || popoverEl.classList.contains('hidden') || popoverEl.style.display === 'none') {
    openMotionPanel(viewer);
  } else if (!popoverEl.classList.contains('minimized')) {
    // Currently in full view: minimize so user can see 3D model completely!
    minimizeMotionPanel();
  } else {
    // Currently minimized: expand to full settings!
    expandMotionPanel();
  }
}

function renderMotionPanelContent() {
  if (!popoverEl) return;

  const motionOptions = Object.values(MOTION_METADATA).map(m => `
    <option value="${m.id}">${m.titleVi}</option>
  `).join('');

  popoverEl.innerHTML = `
    <!-- Full Settings Body (Bottom Sheet style) -->
    <div class="motion-full-body">
      <!-- Swipeable handle -->
      <div class="bottom-sheet-drag-handle" id="motionDragHandle" title="Vuốt xuống hoặc chạm để thu nhỏ xem 3D">
        <span class="drag-bar"></span>
      </div>

      <div class="motion-header">
        <div class="motion-title-row">
          <span class="motion-badge">${SVG_FILM} GIẢI PHẪU ĐỘNG</span>
          <div class="motion-head-actions">
            <button type="button" class="btn-motion-view-3d" id="motionView3dBtn" title="Thu nhỏ để xem trọn vẹn mô hình 3D">
              ${SVG_EYE} Xem 3D
            </button>
            <button type="button" class="btn-motion-exit" id="motionCloseBtn" title="Tắt chuyển động & đóng khung">
              ${SVG_CLOSE} Tắt
            </button>
          </div>
        </div>
        <div class="motion-select-wrapper">
          <select id="motionSelect" class="motion-select">
            ${motionOptions}
          </select>
        </div>
      </div>

      <!-- Quick watch full screen button -->
      <button type="button" class="btn-motion-watch-full" id="btnMotionWatchFull" title="Chạy ngay và thu gọn thanh công cụ để ngắm mô hình 3D">
        Bắt đầu & Xem 3D Toàn Màn Hình
      </button>

      <!-- Live Phase & Physiology Banner -->
      <div class="motion-phase-card" id="motionPhaseCard">
        <span class="phase-indicator-dot"></span>
        <span class="phase-text" id="motionPhaseText">Đang khởi tạo chuyển động...</span>
      </div>

      <!-- Timeline Scrubber -->
      <div class="motion-timeline-container">
        <div class="timeline-labels">
          <span class="time-current" id="motionTimeCurrent">0.0s</span>
          <span class="time-percent" id="motionPercent">0%</span>
          <span class="time-total" id="motionTimeTotal">2.0s</span>
        </div>
        <input type="range" class="motion-slider" id="motionTimelineSlider" min="0" max="1000" value="0" step="1" aria-label="Tua chuyển động">
      </div>

      <!-- Playback Controls -->
      <div class="motion-controls-row">
        <button type="button" class="btn-motion-ctrl" id="btnMotionRewind" title="Tua về đầu">${SVG_REWIND}</button>
        <button type="button" class="btn-motion-ctrl btn-play-large" id="btnMotionPlayPause" title="Chạy / Tạm dừng">${SVG_PAUSE}</button>
        <button type="button" class="btn-motion-ctrl" id="btnMotionLoop" title="Lặp lại chu kỳ">${SVG_LOOP}</button>
        
        <!-- Speed Selector Chips -->
        <div class="motion-speed-chips">
          <button type="button" class="speed-chip" data-speed="0.25" title="Xem rất chậm (0.25x)">0.25x</button>
          <button type="button" class="speed-chip" data-speed="0.5" title="Xem chậm (0.5x)">0.5x</button>
          <button type="button" class="speed-chip active" data-speed="1.0" title="Tốc độ bình thường (1.0x)">1.0x</button>
          <button type="button" class="speed-chip" data-speed="2.0" title="Tốc độ nhanh (2.0x)">2.0x</button>
        </div>
      </div>

      <!-- Isolation in Motion Section -->
      <div class="motion-isolation-section">
        <div class="isolation-header">
          <span>${SVG_TARGET} Cô lập cấu trúc khi chuyển động:</span>
        </div>
        <div class="isolation-row">
          <select id="motionPartSelect" class="motion-part-select">
            <option value="all">Xem toàn bộ</option>
          </select>
          <button type="button" class="btn-isolate-action primary" id="btnMotionIsolateCurrent" title="Chỉ quan sát cấu trúc đã chọn">
            Cô lập
          </button>
          <button type="button" class="btn-isolate-action ghost" id="btnMotionGhostToggle" title="Bóng mờ các bộ phận xung quanh">
            Bóng mờ
          </button>
          <button type="button" class="btn-isolate-action reset" id="btnMotionResetIsolate" title="Khôi phục đầy đủ">
            Khôi phục
          </button>
        </div>
      </div>
    </div>

    <!-- Mini Player Bar (shown when minimized so user can watch 3D model without obstruction) -->
    <div class="motion-mini-bar">
      <button type="button" class="btn-mini-play" id="btnMiniPlayPause" title="Chạy / Tạm dừng">${SVG_PAUSE}</button>
      <div class="mini-info" id="miniMotionInfo" title="Bấm để mở bảng điều khiển chi tiết">
        <span class="mini-title" id="miniMotionTitle">Nhịp Tim</span>
        <span class="mini-phase" id="miniMotionPhase">Tâm thu (0.4s)</span>
      </div>
      <button type="button" class="btn-mini-action" id="btnMiniExpand" title="Mở bảng điều khiển chi tiết">${SVG_SETTINGS} Cài đặt</button>
      <button type="button" class="btn-mini-action danger" id="btnMiniClose" title="Dừng chuyển động & thoát">${SVG_CLOSE} Tắt</button>
    </div>
  `;
}

function setupEventListeners() {
  if (!popoverEl) return;

  // Drag handle click/touch to minimize
  const dragHandle = popoverEl.querySelector('#motionDragHandle');
  dragHandle?.addEventListener('click', minimizeMotionPanel);

  // Swipe down gesture on drag handle or header
  let touchStartY = 0;
  dragHandle?.addEventListener('touchstart', (e) => {
    touchStartY = e.touches[0].clientY;
  }, { passive: true });
  dragHandle?.addEventListener('touchend', (e) => {
    const touchEndY = e.changedTouches[0].clientY;
    if (touchEndY - touchStartY > 30) {
      minimizeMotionPanel();
    }
  }, { passive: true });

  // Quick watch full button: plays and immediately minimizes
  const btnWatchFull = popoverEl.querySelector('#btnMotionWatchFull');
  btnWatchFull?.addEventListener('click', () => {
    dynamicAnatomy.play();
    minimizeMotionPanel();
  });

  // View 3D / Minimize button
  const view3dBtn = popoverEl.querySelector('#motionView3dBtn');
  view3dBtn?.addEventListener('click', minimizeMotionPanel);

  // Close / Exit buttons
  const closeBtn = popoverEl.querySelector('#motionCloseBtn');
  closeBtn?.addEventListener('click', closeMotionPanel);

  const miniCloseBtn = popoverEl.querySelector('#btnMiniClose');
  miniCloseBtn?.addEventListener('click', closeMotionPanel);

  // Mini expand buttons
  const miniExpandBtn = popoverEl.querySelector('#btnMiniExpand');
  miniExpandBtn?.addEventListener('click', expandMotionPanel);

  const miniInfo = popoverEl.querySelector('#miniMotionInfo');
  miniInfo?.addEventListener('click', expandMotionPanel);

  // Mini Play/Pause button
  const miniPlayBtn = popoverEl.querySelector('#btnMiniPlayPause');
  miniPlayBtn?.addEventListener('click', () => {
    dynamicAnatomy.togglePlay();
  });

  // Motion select dropdown
  const motionSelect = popoverEl.querySelector('#motionSelect');
  motionSelect?.addEventListener('change', (e) => {
    dynamicAnatomy.setMotion(e.target.value);
  });

  // Play/Pause button: when clicked to PLAY, automatically minimize so user sees 3D!
  const btnPlayPause = popoverEl.querySelector('#btnMotionPlayPause');
  btnPlayPause?.addEventListener('click', () => {
    const s = dynamicAnatomy.getState();
    dynamicAnatomy.togglePlay();
    if (!s.isPlaying) {
      // User tapped Play -> automatically minimize to reveal the 3D model!
      setTimeout(() => minimizeMotionPanel(), 150);
    }
  });

  // Rewind button
  const btnRewind = popoverEl.querySelector('#btnMotionRewind');
  btnRewind?.addEventListener('click', () => {
    dynamicAnatomy.seek(0.0);
  });

  // Loop toggle
  const btnLoop = popoverEl.querySelector('#btnMotionLoop');
  btnLoop?.addEventListener('click', () => {
    const s = dynamicAnatomy.getState();
    dynamicAnatomy.setLoop(!s.isLooping);
    btnLoop.classList.toggle('active', !s.isLooping);
  });

  // Timeline Scrubber Slider
  const slider = popoverEl.querySelector('#motionTimelineSlider');
  slider?.addEventListener('mousedown', () => { isDraggingScrubber = true; });
  slider?.addEventListener('touchstart', () => { isDraggingScrubber = true; }, { passive: true });

  slider?.addEventListener('input', (e) => {
    const val = parseInt(e.target.value, 10);
    const progress = val / 1000;
    dynamicAnatomy.seek(progress);
  });

  window.addEventListener('mouseup', () => { isDraggingScrubber = false; });
  window.addEventListener('touchend', () => { isDraggingScrubber = false; });

  // Speed chips
  const speedChips = popoverEl.querySelectorAll('.speed-chip');
  speedChips.forEach(chip => {
    chip.addEventListener('click', () => {
      const speed = parseFloat(chip.dataset.speed) || 1.0;
      dynamicAnatomy.setSpeed(speed);
      speedChips.forEach(c => c.classList.remove('active'));
      chip.classList.add('active');
    });
  });

  // Isolation Controls
  const partSelect = popoverEl.querySelector('#motionPartSelect');
  const btnIsolate = popoverEl.querySelector('#btnMotionIsolateCurrent');
  btnIsolate?.addEventListener('click', () => {
    const val = partSelect?.value;
    dynamicAnatomy.isolateStructure(val);
  });

  const btnGhost = popoverEl.querySelector('#btnMotionGhostToggle');
  btnGhost?.addEventListener('click', () => {
    dynamicAnatomy.toggleGhostMode();
    const s = dynamicAnatomy.getState();
    btnGhost.classList.toggle('active', s.ghostNonIsolated);
  });

  const btnReset = popoverEl.querySelector('#btnMotionResetIsolate');
  btnReset?.addEventListener('click', () => {
    if (partSelect) partSelect.value = 'all';
    dynamicAnatomy.restoreAllVisibility();
  });
}

function updateMotionUI(state) {
  if (!popoverEl || popoverEl.classList.contains('hidden')) return;

  // Update motion dropdown
  const motionSelect = popoverEl.querySelector('#motionSelect');
  if (motionSelect && motionSelect.value !== state.motionId) {
    motionSelect.value = state.motionId;
  }

  // Update phase text on full card
  const phaseText = popoverEl.querySelector('#motionPhaseText');
  if (phaseText && state.phaseName) {
    phaseText.textContent = state.phaseName;
  }

  // Update mini bar title and phase
  const miniTitle = popoverEl.querySelector('#miniMotionTitle');
  if (miniTitle) {
    const meta = MOTION_METADATA[state.motionId];
    miniTitle.textContent = meta ? meta.titleVi : 'Giải Phẫu Động';
  }
  const miniPhase = popoverEl.querySelector('#miniMotionPhase');
  if (miniPhase && state.phaseName) {
    const curSec = (state.progress * state.duration).toFixed(1);
    miniPhase.textContent = `${state.phaseName} (${curSec}s)`;
  }

  // Update timeline slider and time texts
  if (!isDraggingScrubber) {
    const slider = popoverEl.querySelector('#motionTimelineSlider');
    if (slider) {
      slider.value = Math.round(state.progress * 1000);
    }
  }

  const timeCur = popoverEl.querySelector('#motionTimeCurrent');
  const timeTot = popoverEl.querySelector('#motionTimeTotal');
  const percent = popoverEl.querySelector('#motionPercent');

  const curSec = (state.progress * state.duration).toFixed(2);
  const totSec = state.duration.toFixed(1);
  if (timeCur) timeCur.textContent = `${curSec}s`;
  if (timeTot) timeTot.textContent = `${totSec}s`;
  if (percent) percent.textContent = `${Math.round(state.progress * 100)}%`;

  // Update Play/Pause buttons (both full and mini)
  const btnPlay = popoverEl.querySelector('#btnMotionPlayPause');
  if (btnPlay) {
    btnPlay.innerHTML = state.isPlaying ? SVG_PAUSE : SVG_PLAY;
    btnPlay.title = state.isPlaying ? 'Tạm dừng' : 'Chạy tiếp';
  }
  const miniPlay = popoverEl.querySelector('#btnMiniPlayPause');
  if (miniPlay) {
    miniPlay.innerHTML = state.isPlaying ? SVG_PAUSE : SVG_PLAY;
    miniPlay.title = state.isPlaying ? 'Tạm dừng' : 'Chạy tiếp';
  }

  // Update key parts dropdown if motion changed
  const partSelect = popoverEl.querySelector('#motionPartSelect');
  if (partSelect && state.keyParts && partSelect.dataset.motionId !== state.motionId) {
    partSelect.dataset.motionId = state.motionId;
    let opts = '<option value="all">Xem toàn bộ</option>';
    state.keyParts.forEach(kp => {
      opts += `<option value="${kp.id}">${kp.nameVi}</option>`;
    });
    partSelect.innerHTML = opts;
    if (state.isolatedPartId) {
      partSelect.value = state.isolatedPartId;
    }
  }
}
