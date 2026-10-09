// Ampulla of Vater & Hepatopancreatoduodenal Confluence Floating Clinical Callout HUD
let ampullaHudEl = null;

export function showAmpullaHUD(viewer) {
  if (ampullaHudEl) {
    ampullaHudEl.style.display = 'block';
    return;
  }

  const appEl = document.getElementById('app') || document.body;
  const hud = document.createElement('div');
  hud.id = 'ampullaCalloutHud';
  hud.className = 'ampulla-callout-hud';
  hud.innerHTML = `
    <div class="ampulla-hud-content">
      <div class="ampulla-hud-header">
        <div class="ampulla-tag-wrap">
          <span class="ampulla-pulse-indicator"></span>
          <span class="ampulla-tag-text">GIẢI PHẪU LÂM SÀNG • HỘI TỤ MẬT - TỤY</span>
        </div>
        <button type="button" class="ampulla-hud-close" id="ampullaCloseBtn" aria-label="Đóng">&times;</button>
      </div>
      <div class="ampulla-hud-title">Nhú Tá Lớn (Bóng Vater & Cơ Vòng Oddi)</div>
      <div class="ampulla-hud-desc">
        <strong>Giải phẫu:</strong> Ngã ba hợp lưu giữa <em>Ống Mật Chủ (Ductus choledochus)</em> và <em>Ống Tụy Chính (Wirsung)</em> đổ vào thành trong đoạn xuống tá tràng D2.
      </div>
      <div class="ampulla-hud-pearl">
        <span class="pearl-bullet">✦</span> <strong>Cơ vòng Oddi:</strong> Khẩu kính lỗ đổ 2–3 mm, điều hòa dòng mật/tụy và chống trào ngược dịch ruột. Mốc can thiệp chụp cắt cơ vòng nội soi mật tụy ngược dòng (ERCP).
      </div>
    </div>
  `;

  appEl.appendChild(hud);
  ampullaHudEl = hud;

  document.getElementById('ampullaCloseBtn')?.addEventListener('click', () => {
    hideAmpullaHUD();
  });
}

export function hideAmpullaHUD() {
  if (ampullaHudEl) {
    ampullaHudEl.remove();
    ampullaHudEl = null;
  }
}
