// AR Modal & HUD Controller
// Manages the floating Head-Up Display (HUD) while Augmented Reality is active.

import { arManager, AR_MODES } from '../viewer/arManager.js';

let arHudEl = null;
let activeViewer = null;

export function initARUI(viewer) {
  activeViewer = viewer;
  arManager.init(viewer);

  arHudEl = document.getElementById('arHud');
  if (!arHudEl) {
    arHudEl = document.createElement('div');
    arHudEl.id = 'arHud';
    arHudEl.className = 'ar-hud hidden';
    document.getElementById('viewerContainer')?.appendChild(arHudEl);
  }

  renderARHud();
  setupAREvents();

  arManager.subscribe(updateARUI);
}

export async function openARModal(viewer) {
  if (!arHudEl) {
    initARUI(viewer);
  }

  arHudEl.classList.remove('hidden');
  document.getElementById('btnToolAR')?.classList.add('active');

  const started = await arManager.startAR('auto');
  if (!started) {
    closeARModal();
  }
}

export function closeARModal() {
  if (arHudEl) {
    arHudEl.classList.add('hidden');
  }
  document.getElementById('btnToolAR')?.classList.remove('active');
  arManager.exitAR();
}

function renderARHud() {
  if (!arHudEl) return;

  arHudEl.innerHTML = `
    <!-- Top AR Bar -->
    <div class="ar-top-bar">
      <div class="ar-status-badge">
        <span class="ar-pulse-dot"></span>
        <span class="ar-status-text" id="arStatusText">AR Không gian thực</span>
      </div>

      <!-- Scale Presets -->
      <div class="ar-scale-presets">
        <button type="button" class="ar-preset-btn active" data-preset="tabletop" title="Đặt trên mặt bàn (cao ~34cm)">
          🪑 Mặt bàn (1:5)
        </button>
        <button type="button" class="ar-preset-btn" data-preset="medium" title="Kích thước vừa (cao ~85cm)">
          📦 Vừa (1:2)
        </button>
        <button type="button" class="ar-preset-btn" data-preset="human" title="Tỉ lệ người thật 1:1 (cao 1.7m)">
          🧍 Người thật (1:1)
        </button>
      </div>

      <div class="ar-top-actions">
        <button type="button" class="ar-btn-snapshot" id="btnARSnapshot" title="Chụp ảnh mô hình trong phòng">
          📸 Chụp ảnh
        </button>
        <button type="button" class="ar-btn-exit" id="btnARExit" title="Thoát chế độ AR">
          ✕ Thoát AR
        </button>
      </div>
    </div>

    <!-- Bottom AR Controls & Gestures Guide -->
    <div class="ar-bottom-controls">
      <div class="ar-slider-card">
        <div class="ar-slider-row">
          <span class="ar-slider-label">Tỉ lệ kích thước:</span>
          <input type="range" id="arScaleSlider" class="ar-scale-slider" min="10" max="150" value="35" step="1">
          <span id="arScaleValue" class="ar-scale-val">35%</span>
        </div>
      </div>
      <div class="ar-hint-bar">
        <span>🖐️ 1 ngón xoay • 2 ngón chụm phóng to/thu nhỏ • Kéo 2 ngón để di chuyển vị trí</span>
      </div>
    </div>
  `;
}

function setupAREvents() {
  if (!arHudEl) return;

  const btnExit = arHudEl.querySelector('#btnARExit');
  btnExit?.addEventListener('click', closeARModal);

  const btnSnapshot = arHudEl.querySelector('#btnARSnapshot');
  btnSnapshot?.addEventListener('click', async () => {
    btnSnapshot.textContent = '⏳ Đang chụp...';
    await arManager.captureARSnapshot();
    btnSnapshot.textContent = '✓ Đã lưu ảnh!';
    setTimeout(() => {
      btnSnapshot.textContent = '📸 Chụp ảnh';
    }, 2000);
  });

  // Scale presets
  const presetBtns = arHudEl.querySelectorAll('.ar-preset-btn');
  presetBtns.forEach(btn => {
    btn.addEventListener('click', () => {
      presetBtns.forEach(b => b.classList.remove('active'));
      btn.classList.add('active');
      arManager.setPresetScale(btn.dataset.preset);
      const state = arManager.getState();
      const slider = arHudEl.querySelector('#arScaleSlider');
      const valText = arHudEl.querySelector('#arScaleValue');
      if (slider) slider.value = Math.round(state.currentScale * 100);
      if (valText) valText.textContent = `${Math.round(state.currentScale * 100)}%`;
    });
  });

  // Scale slider
  const slider = arHudEl.querySelector('#arScaleSlider');
  const valText = arHudEl.querySelector('#arScaleValue');
  slider?.addEventListener('input', (e) => {
    const val = parseInt(e.target.value, 10);
    if (valText) valText.textContent = `${val}%`;
    arManager.setScale(val / 100);
    presetBtns.forEach(b => b.classList.remove('active'));
  });
}

function updateARUI(state) {
  if (!arHudEl) return;

  if (!state.isActive) {
    arHudEl.classList.add('hidden');
    document.getElementById('btnToolAR')?.classList.remove('active');
    return;
  }

  arHudEl.classList.remove('hidden');
  const statusText = arHudEl.querySelector('#arStatusText');
  if (statusText) {
    if (state.activeMode === AR_MODES.WEBXR) {
      statusText.textContent = 'AR WebXR (Định vị sàn)';
    } else {
      statusText.textContent = 'AR Camera Thực tế';
    }
  }

  const slider = arHudEl.querySelector('#arScaleSlider');
  const valText = arHudEl.querySelector('#arScaleValue');
  if (slider) slider.value = Math.round(state.currentScale * 100);
  if (valText) valText.textContent = `${Math.round(state.currentScale * 100)}%`;
}
