/**
 * PWA App Installation Prompt (Gợi ý Cài Đặt Ứng Dụng vào Màn Hình Chính / Desktop)
 * Supports modern Chromium browsers (beforeinstallprompt) and iOS Safari (Share -> Add to Home Screen).
 */

let deferredPrompt = null;
let pwaPromptEl = null;

export function initPWAInstallPrompt() {
  if (typeof window === 'undefined') return;

  // 1. If already installed or running as standalone PWA, do not show
  const isStandalone = window.matchMedia('(display-mode: standalone)').matches 
    || window.navigator.standalone === true 
    || localStorage.getItem('pwa_installed') === '1';
  if (isStandalone) return;

  // 2. Capture beforeinstallprompt (Android Chrome, Edge, Chrome Desktop)
  window.addEventListener('beforeinstallprompt', (e) => {
    e.preventDefault();
    deferredPrompt = e;
    console.log('[PWA] beforeinstallprompt event captured');
    // If prompt is already visible, update button state
    updateInstallButtonState();
  });

  window.addEventListener('appinstalled', () => {
    console.log('[PWA] App successfully installed');
    localStorage.setItem('pwa_installed', '1');
    dismissPWAInstallPrompt();
  });

  // 3. If user previously dismissed, skip
  if (localStorage.getItem('pwa_install_dismissed') === '1') {
    return;
  }

  // 4. Show install suggestion after 1.8 seconds
  setTimeout(() => {
    showPWAInstallPrompt();
  }, 1800);
}

export function showPWAInstallPrompt() {
  if (pwaPromptEl || document.getElementById('pwaInstallPromptBanner')) return;

  // Re-check standalone
  const isStandalone = window.matchMedia('(display-mode: standalone)').matches 
    || window.navigator.standalone === true;
  if (isStandalone) return;

  pwaPromptEl = document.createElement('div');
  pwaPromptEl.id = 'pwaInstallPromptBanner';
  pwaPromptEl.className = 'pwa-install-prompt-banner animate-in';
  pwaPromptEl.innerHTML = `
    <div class="pwa-prompt-container">
      <button type="button" class="btn-pwa-close" id="btnPWAClose" title="Đóng thông báo">&times;</button>
      <div class="pwa-prompt-left">
        <div class="pwa-prompt-icon-wrap">
          <img src="/favicon.svg" alt="App Icon" class="pwa-prompt-icon" width="34" height="34" />
        </div>
        <div class="pwa-prompt-text">
          <div class="pwa-prompt-title">Cài đặt Ứng dụng Atlas Giải Phẫu 3D</div>
          <div class="pwa-prompt-subtitle">Thêm vào màn hình chính để mở tức thì, học mượt mà và toàn màn hình như App gốc.</div>
          <div class="pwa-ios-guide hidden" id="pwaIosGuide">
            <span>💡 Chạm nút Chia sẻ <strong>⎋</strong> ở thanh dưới trình duyệt, sau đó chọn <strong>"Thêm vào MH chính (+)"</strong>.</span>
          </div>
        </div>
      </div>
      <div class="pwa-prompt-actions">
        <button type="button" class="btn-pwa-install" id="btnPWAInstallNow">
          <svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5"><path d="M21 15v4a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-4"/><polyline points="7 10 12 15 17 10"/><line x1="12" y1="15" x2="12" y2="3"/></svg>
          <span>Cài đặt ngay</span>
        </button>
        <button type="button" class="btn-pwa-dismiss" id="btnPWADismiss" title="Để sau">Để sau</button>
      </div>
    </div>
  `;

  document.body.appendChild(pwaPromptEl);

  const btnInstall = pwaPromptEl.querySelector('#btnPWAInstallNow');
  const btnDismiss = pwaPromptEl.querySelector('#btnPWADismiss');
  const btnClose = pwaPromptEl.querySelector('#btnPWAClose');
  const iosGuide = pwaPromptEl.querySelector('#pwaIosGuide');

  btnClose?.addEventListener('click', () => {
    localStorage.setItem('pwa_install_dismissed', '1');
    dismissPWAInstallPrompt();
  });

  btnInstall?.addEventListener('click', async () => {
    if (deferredPrompt) {
      deferredPrompt.prompt();
      const { outcome } = await deferredPrompt.userChoice;
      console.log('[PWA] User response to install prompt:', outcome);
      if (outcome === 'accepted') {
        localStorage.setItem('pwa_installed', '1');
      }
      deferredPrompt = null;
      dismissPWAInstallPrompt();
    } else {
      const isIOS = /iPad|iPhone|iPod/.test(navigator.userAgent) && !window.MSStream;
      if (isIOS && iosGuide) {
        iosGuide.classList.remove('hidden');
      } else {
        alert('Để cài đặt ứng dụng: Nhấn vào biểu tượng Cài đặt [⊕] trên thanh địa chỉ của trình duyệt hoặc menu Tùy chọn -> "Cài đặt ứng dụng".');
        dismissPWAInstallPrompt();
      }
    }
  });

  btnDismiss?.addEventListener('click', () => {
    localStorage.setItem('pwa_install_dismissed', '1');
    dismissPWAInstallPrompt();
  });
}

function updateInstallButtonState() {
  if (!pwaPromptEl) return;
  const btnInstall = pwaPromptEl.querySelector('#btnPWAInstallNow');
  if (btnInstall) {
    btnInstall.classList.add('ready');
  }
}

export function dismissPWAInstallPrompt() {
  if (!pwaPromptEl) {
    pwaPromptEl = document.getElementById('pwaInstallPromptBanner');
  }
  if (pwaPromptEl) {
    pwaPromptEl.classList.remove('animate-in');
    pwaPromptEl.classList.add('fade-out');
    setTimeout(() => {
      pwaPromptEl?.remove();
      pwaPromptEl = null;
    }, 350);
  }
}
