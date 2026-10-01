/**
 * Offline Download Suggestion Banner (LỆNH #10)
 * Politely prompts the user to pre-download the 3D anatomical models
 * into browser cache for 100% offline usage, lightning-fast rendering, and zero stutter/lag.
 */

import { openOfflineModal } from './offlineModal.js';

let promptBannerEl = null;

export function initOfflinePrompt(viewer) {
  if (typeof window === 'undefined') return;

  // If user previously dismissed or already downloaded, don't nag them immediately
  const isDismissed = localStorage.getItem('offline_prompt_dismissed') === '1';
  if (isDismissed) return;

  // Show banner gently 2.5 seconds after initial render
  setTimeout(() => {
    showOfflinePrompt(viewer);
  }, 2500);
}

export function showOfflinePrompt(viewer) {
  if (promptBannerEl || document.getElementById('offlinePromptBanner')) return;

  promptBannerEl = document.createElement('div');
  promptBannerEl.id = 'offlinePromptBanner';
  promptBannerEl.className = 'offline-prompt-banner animate-in';
  promptBannerEl.innerHTML = `
    <div class="prompt-main">
      <div class="prompt-icon-badge">⚡</div>
      <div class="prompt-content">
        <strong class="prompt-headline">Tải về máy để xem siêu mượt & chạy Offline 100%?</strong>
        <span class="prompt-subline">Lưu mô hình 3D vào bộ nhớ máy giúp lướt cực nhanh, triệt tiêu giật lag. Khuyên dùng Wi-Fi khi tải!</span>
      </div>
    </div>
    <div class="prompt-actions">
      <button type="button" class="btn-prompt-primary" id="btnPromptDownloadAll">
        <svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5"><path d="M21 15v4a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-4"/><polyline points="7 10 12 15 17 10"/><line x1="12" y1="15" x2="12" y2="3"/></svg>
        Tải về máy ngay
      </button>
      <button type="button" class="btn-prompt-dismiss" id="btnPromptDismiss" title="Để sau">Để sau</button>
    </div>
  `;

  document.body.appendChild(promptBannerEl);

  const btnDownload = promptBannerEl.querySelector('#btnPromptDownloadAll');
  const btnDismiss = promptBannerEl.querySelector('#btnPromptDismiss');

  btnDownload?.addEventListener('click', () => {
    dismissOfflinePrompt();
    localStorage.setItem('offline_prompt_dismissed', '1');
    openOfflineModal(viewer);
  });

  btnDismiss?.addEventListener('click', () => {
    dismissOfflinePrompt();
    localStorage.setItem('offline_prompt_dismissed', '1');
  });
}

export function dismissOfflinePrompt() {
  if (!promptBannerEl) {
    promptBannerEl = document.getElementById('offlinePromptBanner');
  }
  if (promptBannerEl) {
    promptBannerEl.classList.remove('animate-in');
    promptBannerEl.classList.add('fade-out');
    setTimeout(() => {
      promptBannerEl?.remove();
      promptBannerEl = null;
    }, 350);
  }
}
