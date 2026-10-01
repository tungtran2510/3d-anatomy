// Motion Panel UI Controller
// Provides user interface for Dynamic Anatomy: Motion selector, timeline scrubbing,
// playback speed controls, physiological phase indicator, and live structure isolation.

import { dynamicAnatomy, MOTIONS, MOTION_METADATA } from '../viewer/dynamicAnatomy.js';

let popoverEl = null;
let isDraggingScrubber = false;
let activeViewer = null;

export function initMotionPanel(viewer) {
  activeViewer = viewer;
  dynamicAnatomy.init(viewer);
  popoverEl = document.getElementById('motionPopover');

  if (!popoverEl) {
    popoverEl = document.createElement('div');
    popoverEl.id = 'motionPopover';
    popoverEl.className = 'explode-popover motion-popover hidden';
    document.getElementById('viewerContainer')?.appendChild(popoverEl);
  }

  renderMotionPanelContent();
  setupEventListeners();

  // Subscribe to dynamic anatomy engine state
  dynamicAnatomy.subscribe(updateMotionUI);
}

export function openMotionPanel(viewer, defaultMotion = MOTIONS.CARDIAC) {
  if (!popoverEl) {
    initMotionPanel(viewer);
  }

  popoverEl.classList.remove('hidden');
  document.getElementById('btnToolMotion')?.classList.add('active');

  // If no motion is selected, launch default
  const state = dynamicAnatomy.getState();
  if (!state.motionId) {
    dynamicAnatomy.setMotion(defaultMotion);
  } else {
    updateMotionUI(state);
  }
}

export function closeMotionPanel() {
  if (popoverEl) {
    popoverEl.classList.add('hidden');
  }
  document.getElementById('btnToolMotion')?.classList.remove('active');
  dynamicAnatomy.pause();
  dynamicAnatomy.resetPose();
  dynamicAnatomy.restoreAllVisibility();
}

export function toggleMotionPanel(viewer) {
  if (!popoverEl || popoverEl.classList.contains('hidden')) {
    openMotionPanel(viewer);
  } else {
    closeMotionPanel();
  }
}

function renderMotionPanelContent() {
  if (!popoverEl) return;

  const motionOptions = Object.values(MOTION_METADATA).map(m => `
    <option value="${m.id}">${m.titleVi}</option>
  `).join('');

  popoverEl.innerHTML = `
    <div class="motion-header">
      <div class="motion-title-row">
        <span class="motion-badge">🎬 GIẢI PHẪU ĐỘNG</span>
        <button class="popover-close-btn" id="motionCloseBtn" aria-label="Đóng">&times;</button>
      </div>
      <div class="motion-select-wrapper">
        <select id="motionSelect" class="motion-select">
          ${motionOptions}
        </select>
      </div>
    </div>

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
      <button type="button" class="btn-motion-ctrl" id="btnMotionRewind" title="Tua về đầu">⏮</button>
      <button type="button" class="btn-motion-ctrl btn-play-large" id="btnMotionPlayPause" title="Chạy / Tạm dừng">⏸</button>
      <button type="button" class="btn-motion-ctrl" id="btnMotionLoop" title="Lặp lại chu kỳ">🔁</button>
      
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
        <span>🎯 Cô lập cấu trúc khi chuyển động:</span>
      </div>
      <div class="isolation-row">
        <select id="motionPartSelect" class="motion-part-select">
          <option value="all">👁️ Xem toàn bộ</option>
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
  `;
}

function setupEventListeners() {
  if (!popoverEl) return;

  const closeBtn = popoverEl.querySelector('#motionCloseBtn');
  closeBtn?.addEventListener('click', closeMotionPanel);

  const motionSelect = popoverEl.querySelector('#motionSelect');
  motionSelect?.addEventListener('change', (e) => {
    dynamicAnatomy.setMotion(e.target.value);
  });

  const btnPlayPause = popoverEl.querySelector('#btnMotionPlayPause');
  btnPlayPause?.addEventListener('click', () => {
    dynamicAnatomy.togglePlay();
  });

  const btnRewind = popoverEl.querySelector('#btnMotionRewind');
  btnRewind?.addEventListener('click', () => {
    dynamicAnatomy.seek(0.0);
  });

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

  // Update phase text
  const phaseText = popoverEl.querySelector('#motionPhaseText');
  if (phaseText && state.phaseName) {
    phaseText.textContent = state.phaseName;
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

  // Update Play/Pause button
  const btnPlay = popoverEl.querySelector('#btnMotionPlayPause');
  if (btnPlay) {
    btnPlay.textContent = state.isPlaying ? '⏸' : '▶';
    btnPlay.title = state.isPlaying ? 'Tạm dừng' : 'Chạy tiếp';
  }

  // Update key parts dropdown if motion changed
  const partSelect = popoverEl.querySelector('#motionPartSelect');
  if (partSelect && state.keyParts && partSelect.dataset.motionId !== state.motionId) {
    partSelect.dataset.motionId = state.motionId;
    let opts = '<option value="all">👁️ Xem toàn bộ</option>';
    state.keyParts.forEach(kp => {
      opts += `<option value="${kp.id}">${kp.nameVi}</option>`;
    });
    partSelect.innerHTML = opts;
    if (state.isolatedPartId) {
      partSelect.value = state.isolatedPartId;
    }
  }
}
