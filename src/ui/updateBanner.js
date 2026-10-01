/**
 * PWA Version Update Banner
 * Detects new Service Worker releases and offers 1-click seamless reload update.
 */

export function initPWAUpdateBanner() {
  if (typeof window === 'undefined' || !('serviceWorker' in navigator)) return;

  navigator.serviceWorker.ready.then((registration) => {
    registration.addEventListener('updatefound', () => {
      const newWorker = registration.installing;
      if (!newWorker) return;

      newWorker.addEventListener('statechange', () => {
        if (newWorker.state === 'installed' && navigator.serviceWorker.controller) {
          showUpdateBanner(newWorker);
        }
      });
    });
  });
}

function showUpdateBanner(newWorker) {
  if (document.getElementById('pwaUpdateBanner')) return;

  const banner = document.createElement('div');
  banner.id = 'pwaUpdateBanner';
  banner.className = 'pwa-update-banner animate-in';
  banner.innerHTML = `
    <div class="banner-content">
      <span class="banner-icon">🚀</span>
      <div class="banner-text">
        <strong>Đã có phiên bản Atlas 3D mới!</strong>
        <span>Tối ưu hiệu năng, bổ sung mô hình & cập nhật kiến thức y khoa.</span>
      </div>
    </div>
    <div class="banner-actions">
      <button type="button" class="btn-update-apply" id="btnApplyUpdate">Cập nhật ngay</button>
      <button type="button" class="btn-update-dismiss" id="btnDismissUpdate">&times;</button>
    </div>
  `;

  document.body.appendChild(banner);

  document.getElementById('btnApplyUpdate')?.addEventListener('click', () => {
    newWorker.postMessage({ type: 'SKIP_WAITING' });
    window.location.reload();
  });

  document.getElementById('btnDismissUpdate')?.addEventListener('click', () => {
    banner.classList.add('fade-out');
    setTimeout(() => banner.remove(), 400);
  });
}
