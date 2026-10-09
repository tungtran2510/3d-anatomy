// Navigation History & Android Back Button / Exit Guard
// Intercepts hardware back button, Android back gesture, and browser Back navigation.
// - If any modal, drawer, or panel is open: closes the topmost overlay and stays in app.
// - If at root view (no modals/panels): displays Exit Confirmation Modal ("Thoát ứng dụng? - Có / Quay lại").

import { state } from '../state/store.js';
import { deselectPart } from '../viewer/selection.js';
import { closeAtlasHub } from './atlasHubModal.js';
import { closeSettingsModal } from './settingsModal.js';
import { closeOfflineModal } from './offlineModal.js';
import { closeMotionPanel } from './motionPanel.js';
import { hideNeuromuscularHUD } from './neuromuscularHUD.js';
import { hideMicroanatomyHUD } from './microanatomyHUD.js';

let isInitialized = false;
let exitModalEl = null;

export function initNavigationHistory(viewer) {
  if (isInitialized) return;
  isInitialized = true;

  // Initialize browser history trap with guard states
  try {
    window.history.replaceState({ appRoot: true, step: 'root' }, '');
    window.history.pushState({ appRoot: true, step: 'guard-1' }, '');
    window.history.pushState({ appRoot: true, step: 'guard-2' }, '');
  } catch (err) {
    console.warn('[NavigationHistory] Failed to initialize history state:', err);
  }

  createExitModal();

  window.addEventListener('popstate', () => {
    // Re-arm history trap IMMEDIATELY so the browser can never escape to previous site
    replenishHistoryTrap();
    handleBackNavigation(viewer);
  });
}

/**
 * Check if an element is genuinely visible and not hidden by itself or an ancestor
 */
function isElementVisible(el) {
  if (!el) return false;
  if (el.classList.contains('hidden') || el.closest('.hidden')) return false;
  if (el.style.display === 'none') return false;
  if (typeof el.checkVisibility === 'function') {
    return el.checkVisibility({ checkVisibilityCSS: true });
  }
  return el.offsetParent !== null;
}

/**
 * Handle Back Navigation (Android Back gesture, Phone Back button, Browser Back)
 */
function handleBackNavigation(viewer) {
  // 1. If Exit Modal is currently open, pressing back cancels/closes it and stays in app
  if (isElementVisible(exitModalEl)) {
    hideExitModal();
    return;
  }

  // 2. Settings Modal
  const settingsModal = document.getElementById('atlasSettingsModal');
  if (isElementVisible(settingsModal)) {
    closeSettingsModal();
    return;
  }

  // 3. Offline Download Modal
  const offlineModal = document.getElementById('offlineModal');
  if (isElementVisible(offlineModal)) {
    closeOfflineModal();
    return;
  }

  // 4. Atlas Hub Modal
  const hubModal = document.getElementById('atlasHubModal');
  if (isElementVisible(hubModal)) {
    closeAtlasHub();
    return;
  }

  // 5. AI Assistant Modal
  const aiModal = document.getElementById('aiAssistantModal');
  if (isElementVisible(aiModal)) {
    document.getElementById('aiModalClose')?.click();
    document.getElementById('btnAIQuickClose')?.click();
    aiModal.classList.add('hidden');
    document.body.classList.remove('ai-modal-open');
    return;
  }

  // 6. Quick Video / Media Modal
  const videoModal = document.getElementById('videoModal');
  if (isElementVisible(videoModal)) {
    document.getElementById('videoModalClose')?.click();
    videoModal.classList.add('hidden');
    return;
  }

  // 7. Neuromuscular / Clinical HUD
  const neuroHUD = document.getElementById('neuromuscularHUD');
  if (isElementVisible(neuroHUD)) {
    hideNeuromuscularHUD();
    return;
  }

  // 8. Microanatomy HUD
  const microHUD = document.getElementById('microanatomyHUD');
  if (isElementVisible(microHUD)) {
    hideMicroanatomyHUD();
    return;
  }

  // 9. Quiz Modal
  const quizModal = document.getElementById('quizModal');
  if (isElementVisible(quizModal)) {
    document.getElementById('btnQuizClose')?.click();
    quizModal.classList.add('hidden');
    return;
  }

  // 10. Study Mode / Picker
  const studyPicker = document.getElementById('studyModeModal') || document.getElementById('studyModePicker');
  if (isElementVisible(studyPicker)) {
    document.getElementById('studyClosePickerBtn')?.click();
    document.getElementById('studyExitBtn')?.click();
    studyPicker.classList.add('hidden');
    return;
  }

  // 11. Clinical Axes Modal / Sheet
  const axisHud = document.getElementById('clinicalAxisHud');
  const axisSheet = document.getElementById('clinicalAxisSheet');
  const axesModal = document.getElementById('clinicalAxesModal');
  if (isElementVisible(axisHud) || isElementVisible(axisSheet) || isElementVisible(axesModal)) {
    import('./clinicalAxesModal.js').then(({ closeClinicalAxesModal }) => {
      closeClinicalAxesModal();
    }).catch(() => {
      document.getElementById('clinicalAxesCloseBtn')?.click();
      if (axesModal) axesModal.classList.add('hidden');
    });
    return;
  }

  // 12. Motion Popover / Dynamic Anatomy Controller
  const motionPopover = document.getElementById('motionPopover');
  if (isElementVisible(motionPopover)) {
    closeMotionPanel();
    return;
  }

  // 13. Generic Modal Fallback (Only if truly visible and not inside hidden container)
  const dialogs = document.querySelectorAll('.modal:not(#exitConfirmModal), .atlas-hub-modal, .offline-modal-backdrop, [role="dialog"]:not([aria-labelledby="exitConfirmTitle"])');
  for (const dlg of dialogs) {
    if (isElementVisible(dlg)) {
      const closeBtn = dlg.querySelector('.modal-close, .btn-close, .close-btn, [data-dismiss], [aria-label="Close"], [aria-label="Đóng"], [title*="Đóng"]');
      if (closeBtn) {
        closeBtn.click();
      } else {
        dlg.classList.add('hidden');
      }
      return;
    }
  }

  // 14. Systems & Info Drawers on narrow / mobile layouts
  const app = document.getElementById('app');
  if (app?.classList.contains('systems-open')) {
    document.getElementById('systemsToggle')?.click();
    return;
  }
  if (app?.classList.contains('info-open')) {
    document.getElementById('infoToggle')?.click();
    return;
  }

  // 15. Structure Details Card (if active 3D part is selected)
  if (state.selectedPart) {
    deselectPart();
    document.getElementById('cardCloseBtn')?.click();
    return;
  }

  // 16. ROOT LEVEL REACHED: Display Exit Confirmation Modal
  showExitModal();
}

/**
 * Replenishes history trap so Android back gesture remains intercepted
 */
export function replenishHistoryTrap() {
  try {
    window.history.pushState({ appRoot: true, step: 'guard-' + Date.now() }, '');
  } catch (e) {
    // Ignore in restricted environments
  }
}

/**
 * Creates the Exit Confirmation Modal DOM
 */
function createExitModal() {
  if (document.getElementById('exitConfirmModal')) {
    exitModalEl = document.getElementById('exitConfirmModal');
    return;
  }

  exitModalEl = document.createElement('div');
  exitModalEl.id = 'exitConfirmModal';
  exitModalEl.className = 'exit-confirm-modal hidden';
  exitModalEl.innerHTML = `
    <div class="exit-confirm-backdrop" id="exitConfirmBackdrop"></div>
    <div class="exit-confirm-dialog" role="dialog" aria-modal="true" aria-labelledby="exitConfirmTitle">
      <div class="exit-confirm-icon-box">
        <svg width="28" height="28" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
          <path d="M9 21H5a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h4"></path>
          <polyline points="16 17 21 12 16 7"></polyline>
          <line x1="21" y1="12" x2="9" y2="12"></line>
        </svg>
      </div>
      <h3 class="exit-confirm-title" id="exitConfirmTitle">Thoát ứng dụng?</h3>
      <p class="exit-confirm-desc">Bạn có muốn thoát khỏi Atlas Giải Phẫu 3D?</p>
      <div class="exit-confirm-actions">
        <button type="button" class="btn-exit-action btn-exit-cancel" id="btnExitConfirmCancel">Quay lại</button>
        <button type="button" class="btn-exit-action btn-exit-confirm" id="btnExitConfirmOk">Có</button>
      </div>
    </div>
  `;

  document.body.appendChild(exitModalEl);

  exitModalEl.querySelector('#btnExitConfirmCancel')?.addEventListener('click', hideExitModal);
  exitModalEl.querySelector('#exitConfirmBackdrop')?.addEventListener('click', hideExitModal);
  exitModalEl.querySelector('#btnExitConfirmOk')?.addEventListener('click', confirmExitApp);
}

export function showExitModal() {
  if (!exitModalEl) createExitModal();
  exitModalEl.classList.remove('hidden');
  exitModalEl.classList.add('visible');
}

export function hideExitModal() {
  if (!exitModalEl) return;
  exitModalEl.classList.remove('visible');
  exitModalEl.classList.add('hidden');
}

function confirmExitApp() {
  hideExitModal();
  // If running inside Capacitor / Cordova / WebView wrapper
  if (window.navigator?.app?.exitApp) {
    window.navigator.app.exitApp();
    return;
  }
  // Try closing window
  try {
    window.close();
  } catch {
    // In standard browser tabs, window.close() might be blocked if not opened by script.
  }
  // Fallback: history back without replenish
  try {
    window.history.go(-10);
  } catch {
    // Done
  }
}
