// Atlas Settings Modal (Visible Body & Medical Atlas Standard)
// Tách biệt hoàn toàn Cài đặt hệ thống khỏi Chế độ Sáng/Tối.
// Hỗ trợ tối ưu trên điện thoại, thông minh, hiện đại, và sao lưu tự động (Máy + Google Drive).

import { state, setLanguage } from '../state/store.js';
import { getAppTheme, setAppTheme, isDarkTheme } from '../utils/themeManager.js';
import { showToast } from './sidebar.js';
import {
  exportLocalBackup,
  restoreFromBackupFile,
  syncGoogleDriveBackup,
  isAutoBackupEnabled,
  setAutoBackupEnabled,
  getLastBackupTimestamps
} from '../utils/backupManager.js';
import { engineManager } from '../viewer/engineManager.js';

let modalEl = null;

export function initSettingsModal(viewer) {
  if (modalEl) return;

  modalEl = document.createElement('div');
  modalEl.id = 'atlasSettingsModal';
  modalEl.className = 'modal atlas-settings-modal hidden';
  modalEl.setAttribute('role', 'dialog');
  modalEl.setAttribute('aria-modal', 'true');
  modalEl.setAttribute('aria-label', 'Cài đặt hệ thống Atlas 3D');

  const backupInfo = getLastBackupTimestamps();
  const autoBackup = isAutoBackupEnabled();

  modalEl.innerHTML = `
    <div class="modal-overlay" id="atlasSettingsOverlay"></div>
    <div class="modal-content atlas-settings-content">
      <!-- Mobile grab handle indicator -->
      <div class="settings-sheet-handle"></div>

      <div class="modal-header settings-header-compact">
        <div class="settings-modal-title">
          <div class="settings-header-icon-badge">
            <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.2">
              <circle cx="12" cy="12" r="3"/>
              <path d="M19.4 15a1.65 1.65 0 0 0 .33 1.82l.06.06a2 2 0 0 1 0 2.83 2 2 0 0 1-2.83 0l-.06-.06a1.65 1.65 0 0 0-1.82-.33 1.65 1.65 0 0 0-1 1.51V21a2 2 0 0 1-2 2 2 2 0 0 1-2-2v-.09A1.65 1.65 0 0 0 9 19.4a1.65 1.65 0 0 0-1.82.33l-.06.06a2 2 0 0 1-2.83 0 2 2 0 0 1 0-2.83l.06-.06a1.65 1.65 0 0 0 .33-1.82 1.65 1.65 0 0 0-1.51-1H3a2 2 0 0 1-2-2 2 2 0 0 1 2-2h.09A1.65 1.65 0 0 0 4.6 9a1.65 1.65 0 0 0-.33-1.82l-.06-.06a2 2 0 0 1 0-2.83 2 2 0 0 1 2.83 0l.06.06a1.65 1.65 0 0 0 1.82.33H9a1.65 1.65 0 0 0 1-1.51V3a2 2 0 0 1 2-2 2 2 0 0 1 2 2v.09a1.65 1.65 0 0 0 1 1.51 1.65 1.65 0 0 0 1.82-.33l.06-.06a2 2 0 0 1 2.83 0 2 2 0 0 1 0 2.83l-.06.06a1.65 1.65 0 0 0-.33 1.82V9a1.65 1.65 0 0 0 1.51 1H21a2 2 0 0 1 2 2 2 2 0 0 1-2 2h-.09a1.65 1.65 0 0 0-1.51 1z"/>
            </svg>
          </div>
          <div>
            <h3>Cài Đặt Hệ Thống</h3>
            <span class="settings-sub-header">Tùy biến hiển thị, đồ họa & sao lưu dữ liệu</span>
          </div>
        </div>
        <button type="button" class="modal-close" id="btnSettingsClose" aria-label="Đóng">&times;</button>
      </div>

      <div class="modal-body settings-modal-body">
        <!-- 1. Ngôn ngữ danh pháp giải phẫu (Segmented Control) -->
        <div class="settings-section">
          <div class="section-label-row">
            <span class="section-icon">🌐</span>
            <span class="section-title">Danh Pháp Y Khoa & Ngôn Ngữ</span>
          </div>
          <div class="settings-segmented-lang" id="settingsLangCards">
            <button type="button" class="segment-lang-btn" data-lang="vi">
              <span class="segment-flag">🇻🇳</span>
              <div class="segment-text">
                <span class="segment-name">Tiếng Việt</span>
                <span class="segment-hint">Bộ Y tế</span>
              </div>
            </button>
            <button type="button" class="segment-lang-btn" data-lang="en">
              <span class="segment-flag">🇬🇧</span>
              <div class="segment-text">
                <span class="segment-name">English</span>
                <span class="segment-hint">Global</span>
              </div>
            </button>
            <button type="button" class="segment-lang-btn" data-lang="it">
              <span class="segment-flag">🏛️</span>
              <div class="segment-text">
                <span class="segment-name">Latina</span>
                <span class="segment-hint">TA2 FIPAT</span>
              </div>
            </button>
          </div>
        </div>

        <!-- 2. Giao diện & Chế độ Sáng / Tối -->
        <div class="settings-section">
          <div class="section-label-row">
            <span class="section-icon">🎨</span>
            <span class="section-title">Chế Độ Hiển Thị & Màu Nền</span>
          </div>
          <div class="settings-theme-cards">
            <button type="button" class="theme-card-option" data-theme="light">
              <div class="theme-card-icon-wrap light-bg">
                <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
                  <circle cx="12" cy="12" r="5"/><line x1="12" y1="1" x2="12" y2="3"/><line x1="12" y1="21" x2="12" y2="23"/><line x1="4.22" y1="4.22" x2="5.64" y2="5.64"/><line x1="18.36" y1="18.36" x2="19.78" y2="19.78"/><line x1="1" y1="12" x2="3" y2="12"/><line x1="21" y1="12" x2="23" y2="12"/><line x1="4.22" y1="19.78" x2="5.64" y2="18.36"/><line x1="18.36" y1="5.64" x2="19.78" y2="4.22"/>
                </svg>
              </div>
              <div class="theme-card-text">
                <strong>Nền Sáng</strong>
                <small>Medical White</small>
              </div>
            </button>
            <button type="button" class="theme-card-option" data-theme="dark">
              <div class="theme-card-icon-wrap dark-bg">
                <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
                  <path d="M21 12.79A9 9 0 1 1 11.21 3 7 7 0 0 0 21 12.79z"/>
                </svg>
              </div>
              <div class="theme-card-text">
                <strong>Nền Tối</strong>
                <small>Deep Navy</small>
              </div>
            </button>
          </div>
        </div>

        <!-- 3. Hiệu năng & Đồ họa 3D + Âm thanh -->
        <div class="settings-section">
          <div class="section-label-row">
            <span class="section-icon">⚡</span>
            <span class="section-title">Hiệu Năng & Trải Nghiệm Học Tập</span>
          </div>
          <div class="settings-grouped-box">
            <div class="settings-switch-item">
              <div class="switch-item-label">
                <strong>Vật liệu PBR Y khoa cao cấp</strong>
                <small>Mô phỏng độ ẩm, sắc tố mô sống & phản xạ ánh sáng</small>
              </div>
              <label class="ios-switch">
                <input type="checkbox" id="chkPBRQuality" checked>
                <span class="ios-slider"></span>
              </label>
            </div>
            <div class="settings-switch-item">
              <div class="switch-item-label">
                <strong>Bóng mờ định vị cơ thể</strong>
                <small>Đường viền mờ trong suốt cố định tư thế giải phẫu chuẩn</small>
              </div>
              <label class="ios-switch">
                <input type="checkbox" id="chkBodyEnvelope" checked>
                <span class="ios-slider"></span>
              </label>
            </div>
            <div class="settings-switch-item">
              <div class="switch-item-label">
                <strong>Phát âm tự động khi chọn cấu trúc</strong>
                <small>Đọc tên cơ quan bằng giọng đọc y khoa chuẩn</small>
              </div>
              <label class="ios-switch">
                <input type="checkbox" id="chkSpeechAudio">
                <span class="ios-slider"></span>
              </label>
            </div>

            <!-- Profile Đồ họa 3 cấp độ (Append-only) -->
            <div class="settings-profile-container" style="border-top: 1px solid rgba(255,255,255,0.08); padding-top: 12px; margin-top: 10px;">
              <div class="switch-item-label" style="margin-bottom: 8px;">
                <strong>Cấu hình Đồ họa &amp; Hiệu năng</strong>
                <small>Tối ưu theo thiết bị: Điện thoại phổ thông hoặc Máy tính hiệu năng cao</small>
              </div>
              <div class="settings-segmented-profile" id="settingsGraphicsProfile" style="display: grid; grid-template-columns: repeat(3, 1fr); gap: 6px;">
                <button type="button" class="segment-profile-btn" data-profile="lite" style="padding: 8px 4px; border-radius: 8px; border: 1px solid rgba(255,255,255,0.12); background: rgba(255,255,255,0.04); color: inherit; cursor: pointer; display: flex; flex-direction: column; align-items: center; gap: 2px;">
                  <span style="font-size: 14px;">🔋</span>
                  <span style="font-size: 11px; font-weight: 700;">Tiết Kiệm</span>
                  <span style="font-size: 9px; opacity: 0.65;">Pin / Nhẹ</span>
                </button>
                <button type="button" class="segment-profile-btn" data-profile="balanced" style="padding: 8px 4px; border-radius: 8px; border: 1px solid rgba(255,255,255,0.12); background: rgba(255,255,255,0.04); color: inherit; cursor: pointer; display: flex; flex-direction: column; align-items: center; gap: 2px;">
                  <span style="font-size: 14px;">⚖️</span>
                  <span style="font-size: 11px; font-weight: 700;">Cân Bằng</span>
                  <span style="font-size: 9px; opacity: 0.65;">Mặc định</span>
                </button>
                <button type="button" class="segment-profile-btn" data-profile="cinematic" style="padding: 8px 4px; border-radius: 8px; border: 1px solid rgba(255,255,255,0.12); background: rgba(255,255,255,0.04); color: inherit; cursor: pointer; display: flex; flex-direction: column; align-items: center; gap: 2px;">
                  <span style="font-size: 14px;">🎬</span>
                  <span style="font-size: 11px; font-weight: 700;">Điện Ảnh</span>
                  <span style="font-size: 9px; opacity: 0.65;">Studio PBR</span>
                </button>
              </div>
            </div>

            <!-- Thanh trượt Phơi sáng (Append-only) -->
            <div class="settings-exposure-container" style="border-top: 1px solid rgba(255,255,255,0.08); padding-top: 12px; margin-top: 10px;">
              <div style="display: flex; justify-content: space-between; align-items: center; margin-bottom: 6px;">
                <div class="switch-item-label">
                  <strong>Độ Phơi Sáng Ánh Sáng</strong>
                  <small>Cân chỉnh độ sáng phòng mổ / phòng đọc phim</small>
                </div>
                <span id="txtExposureVal" style="font-size: 11px; font-weight: 700; color: #38bdf8; font-family: monospace;">1.06</span>
              </div>
              <input type="range" id="rngExposureLevel" min="0.75" max="1.50" step="0.02" value="1.06" style="width: 100%; accent-color: #38bdf8; cursor: pointer;">
            </div>
          </div>
        </div>

        <!-- 4. Sao lưu & Đồng bộ Tự động (Backup & Sync) -->
        <div class="settings-section">
          <div class="section-label-row">
            <span class="section-icon">💾</span>
            <span class="section-title">Sao Lưu & Phục Hồi Dữ Liệu</span>
            <span class="section-badge-smart">Tự động</span>
          </div>

          <div class="settings-grouped-box">
            <!-- Toggle tự động sao lưu -->
            <div class="settings-switch-item">
              <div class="switch-item-label">
                <strong>Tự động sao lưu định kỳ</strong>
                <small>Bảo toàn tiến độ học, ghi chú, điểm yếu & bookmark</small>
              </div>
              <label class="ios-switch">
                <input type="checkbox" id="chkAutoBackup" ${autoBackup ? 'checked' : ''}>
                <span class="ios-slider"></span>
              </label>
            </div>

            <!-- Google Drive Cloud Card -->
            <div class="gdrive-sync-card">
              <div class="gdrive-left">
                <div class="gdrive-icon-badge">
                  <svg width="22" height="22" viewBox="0 0 87.3 78" fill="none">
                    <path d="m6.6 66.85 3.85 6.65c.8 1.4 1.95 2.5 3.3 3.3l13.75-23.8H0c0 1.55.4 3.1 1.2 4.5z" fill="#0066da"/>
                    <path d="M43.65 25 29.9 1.2c-1.35.8-2.5 1.9-3.3 3.3l-25.4 44c-.8 1.4-1.2 2.95-1.2 4.5h27.5z" fill="#00ac47"/>
                    <path d="M73.55 76.8c1.35-.8 2.5-1.9 3.3-3.3l1.6-2.75 7.65-13.25c.8-1.4 1.2-2.95 1.2-4.5H59.8l5.85 10.1z" fill="#ea4335"/>
                    <path d="M43.65 25 57.4 1.2C56.05.4 54.5 0 52.95 0H34.35c-1.55 0-3.1.4-4.45 1.2z" fill="#00832d"/>
                    <path d="M59.8 53H27.5L13.75 76.8c1.35.8 2.9 1.2 4.45 1.2h50.9c1.55 0 3.1-.4 4.45-1.2z" fill="#2684fc"/>
                    <path d="m73.4 26.5-12.7-22c-.8-1.4-1.95-2.5-3.3-3.3L43.65 25l16.15 28h27.5c0-1.55-.4-3.1-1.2-4.5z" fill="#ffba00"/>
                  </svg>
                </div>
                <div class="gdrive-info-col">
                  <div class="gdrive-title-row">
                    <span class="gdrive-title">Google Drive Cloud</span>
                    <span class="gdrive-status-badge" id="gdriveStatusPill">● Đã kích hoạt</span>
                  </div>
                  <span class="gdrive-time-meta" id="gdriveMetaTime">Đồng bộ: ${backupInfo.drive}</span>
                </div>
              </div>
              <div class="gdrive-actions-group">
                <button type="button" class="btn-gdrive-sync" id="btnSyncGoogleDrive" title="Đồng bộ ngay lên Google Drive">
                  <svg width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.4">
                    <path d="M21.5 2v6h-6M21.34 15.57a10 10 0 1 1-.57-8.38l5.67-5.67"/>
                  </svg>
                  <span>Đồng bộ</span>
                </button>
                <button type="button" class="btn-gdrive-offline" id="btnSettingsDownloadOffline" title="Tải toàn bộ mô hình 3D về máy để dùng ngoại tuyến (Offline)">
                  <svg width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.2" stroke-linecap="round" stroke-linejoin="round">
                    <circle cx="9" cy="21" r="1"/>
                    <circle cx="20" cy="21" r="1"/>
                    <path d="M1 1h4l2.68 13.39a2 2 0 0 0 2 1.61h9.72a2 2 0 0 0 2-1.61L23 6H6"/>
                  </svg>
                  <span>Tải về máy</span>
                </button>
              </div>
            </div>

            <!-- Sao lưu vào máy và Khôi phục -->
            <div class="backup-actions-row">
              <button type="button" class="btn-backup-item" id="btnExportLocalBackup">
                <svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
                  <path d="M21 15v4a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-4"/>
                  <polyline points="7 10 12 15 17 10"/>
                  <line x1="12" y1="15" x2="12" y2="3"/>
                </svg>
                <div class="backup-btn-text">
                  <strong>Sao lưu vào máy</strong>
                  <small>Tải tệp .JSON</small>
                </div>
              </button>

              <button type="button" class="btn-backup-item" id="btnTriggerRestoreBackup">
                <svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
                  <path d="M21 15v4a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-4"/>
                  <polyline points="17 8 12 3 7 8"/>
                  <line x1="12" y1="3" x2="12" y2="15"/>
                </svg>
                <div class="backup-btn-text">
                  <strong>Khôi phục dữ liệu</strong>
                  <small>Nạp từ tệp máy</small>
                </div>
              </button>
              <input type="file" id="inputLocalBackupFile" accept=".json" style="display:none;" />
            </div>
          </div>
        </div>

        <!-- 5. Bản quyền & Nguồn dữ liệu -->
        <div class="settings-about-box">
          <div class="about-app-badge">Atlas Giải Phẫu 3D v2.4 • Chuẩn Quốc Tế TA2</div>
          <p>Xây dựng trên nền tảng nguồn mở Y khoa quốc tế (CC BY-NC-SA 4.0), tích hợp mô hình chuẩn hóa từ BodyParts3D (Nhật Bản) và Z-Anatomy.</p>
          <div class="about-links">
            <a href="https://www.z-anatomy.com/" target="_blank" rel="noopener">Z-Anatomy</a> • 
            <a href="https://lifesciencedb.jp/bp3d/" target="_blank" rel="noopener">BodyParts3D</a> • 
            <a href="https://3d-anatomy-atlas-vn.vercel.app" target="_blank" rel="noopener">Trang chủ Atlas</a>
          </div>
        </div>
      </div>
    </div>
  `;

  document.body.appendChild(modalEl);

  // Event handlers
  const overlay = modalEl.querySelector('#atlasSettingsOverlay');
  const closeBtn = modalEl.querySelector('#btnSettingsClose');

  const closeModal = () => {
    modalEl.classList.add('hidden');
  };

  overlay?.addEventListener('click', closeModal);
  closeBtn?.addEventListener('click', closeModal);

  // Language buttons
  const langCards = modalEl.querySelectorAll('.segment-lang-btn');
  langCards.forEach(btn => {
    btn.addEventListener('click', () => {
      const selected = btn.dataset.lang;
      setLanguage(selected);
      const langSelect = document.getElementById('langSelect');
      if (langSelect) langSelect.value = selected;
      updateSettingsUI();
      const name = btn.querySelector('.segment-name')?.textContent;
      showToast(`Đã chọn ngôn ngữ: ${name}`);
    });
  });

  // Theme buttons
  const themeBtns = modalEl.querySelectorAll('.theme-card-option');
  themeBtns.forEach(btn => {
    btn.addEventListener('click', () => {
      const theme = btn.dataset.theme;
      setAppTheme(theme, viewer);
      updateSettingsUI();
      showToast(`Đã chuyển sang ${theme === 'dark' ? 'Nền Tối' : 'Nền Sáng'}`);
    });
  });

  // Body envelope toggle
  const chkEnvelope = modalEl.querySelector('#chkBodyEnvelope');
  chkEnvelope?.addEventListener('change', (e) => {
    if (viewer && viewer.bodyEnvelopeMesh) {
      viewer.bodyEnvelopeMesh.visible = e.target.checked;
      showToast(`Đã ${e.target.checked ? 'bật' : 'ẩn'} đường viền cơ thể`);
    }
  });

  // PBR quality toggle
  const chkPBR = modalEl.querySelector('#chkPBRQuality');
  chkPBR?.addEventListener('change', (e) => {
    localStorage.setItem('atlas_pbr_enabled', e.target.checked ? 'true' : 'false');
    showToast(`Đã ${e.target.checked ? 'bật' : 'tắt'} Vật liệu PBR Y khoa`);
  });

  // Graphics Profile buttons
  const profileBtns = modalEl.querySelectorAll('.segment-profile-btn');
  profileBtns.forEach(btn => {
    btn.addEventListener('click', () => {
      const profile = btn.dataset.profile;
      engineManager.setGraphicsProfile(profile);
      updateSettingsUI();
      const labels = {
        lite: 'Tiết Kiệm Pin / Máy nhẹ',
        balanced: 'Cân Bằng Tiêu Chuẩn',
        cinematic: 'Điện Ảnh Studio PBR'
      };
      showToast(`Đã chọn cấu hình: ${labels[profile] || profile}`);
    });
  });

  // Exposure slider
  const rngExposure = modalEl.querySelector('#rngExposureLevel');
  const txtExposureVal = modalEl.querySelector('#txtExposureVal');
  rngExposure?.addEventListener('input', (e) => {
    const val = parseFloat(e.target.value);
    engineManager.setExposure(val);
    if (txtExposureVal) {
      txtExposureVal.textContent = val.toFixed(2);
    }
  });

  // Speech audio toggle
  const chkSpeech = modalEl.querySelector('#chkSpeechAudio');
  chkSpeech?.addEventListener('change', (e) => {
    localStorage.setItem('atlas_auto_pronounce', e.target.checked ? 'true' : 'false');
    showToast(`Đã ${e.target.checked ? 'bật' : 'tắt'} phát âm tự động`);
  });

  // Auto Backup toggle
  const chkAutoBackup = modalEl.querySelector('#chkAutoBackup');
  chkAutoBackup?.addEventListener('change', (e) => {
    setAutoBackupEnabled(e.target.checked);
    showToast(`Đã ${e.target.checked ? 'bật' : 'tắt'} tự động sao lưu định kỳ`);
    const statusPill = modalEl.querySelector('#gdriveStatusPill');
    if (statusPill) {
      statusPill.textContent = e.target.checked ? '● Đã kích hoạt' : '○ Tạm dừng';
      statusPill.className = e.target.checked ? 'gdrive-status-badge' : 'gdrive-status-badge paused';
    }
  });

  // Google Drive Sync button
  const btnSyncDrive = modalEl.querySelector('#btnSyncGoogleDrive');
  btnSyncDrive?.addEventListener('click', async () => {
    btnSyncDrive.classList.add('syncing');
    btnSyncDrive.innerHTML = `
      <svg class="spin-icon" width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.4">
        <path d="M21.5 2v6h-6M21.34 15.57a10 10 0 1 1-.57-8.38l5.67-5.67"/>
      </svg>
      <span>Đang lưu...</span>
    `;

    try {
      const res = await syncGoogleDriveBackup();
      const metaEl = modalEl.querySelector('#gdriveMetaTime');
      if (metaEl) {
        metaEl.textContent = `Đồng bộ: ${res.timestamp}`;
      }
      showToast(`✓ Đã sao lưu thành công toàn bộ tiến độ lên Google Drive (${res.sizeKb} KB)!`, 'success');
    } catch (err) {
      showToast('❌ Không thể kết nối Google Drive. Vui lòng kiểm tra mạng.', 'error');
    } finally {
      btnSyncDrive.classList.remove('syncing');
      btnSyncDrive.innerHTML = `
        <svg width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.4">
          <path d="M21.5 2v6h-6M21.34 15.57a10 10 0 1 1-.57-8.38l5.67-5.67"/>
        </svg>
        <span>Đồng bộ</span>
      `;
    }
  });

  // Tải về máy (Offline 3D Cache) button
  const btnDownloadOffline = modalEl.querySelector('#btnSettingsDownloadOffline');
  btnDownloadOffline?.addEventListener('click', async () => {
    closeSettingsModal();
    const { openOfflineModal } = await import('./offlineModal.js');
    openOfflineModal(viewer);
  });

  // Export Local Backup button
  const btnExportLocal = modalEl.querySelector('#btnExportLocalBackup');
  btnExportLocal?.addEventListener('click', () => {
    exportLocalBackup();
  });

  // Restore Local Backup button and file picker
  const btnTriggerRestore = modalEl.querySelector('#btnTriggerRestoreBackup');
  const fileInput = modalEl.querySelector('#inputLocalBackupFile');

  btnTriggerRestore?.addEventListener('click', () => {
    fileInput?.click();
  });

  fileInput?.addEventListener('change', async (e) => {
    const file = e.target.files?.[0];
    if (file) {
      try {
        await restoreFromBackupFile(file);
        updateSettingsUI();
      } catch (err) {
        // Handled in restoreFromBackupFile
      }
      // Reset input
      fileInput.value = '';
    }
  });

  updateSettingsUI();
}

export function openSettingsModal(viewer) {
  if (!modalEl) {
    initSettingsModal(viewer);
  }
  updateSettingsUI();
  modalEl?.classList.remove('hidden');
}

export function closeSettingsModal() {
  modalEl?.classList.add('hidden');
}

function updateSettingsUI() {
  if (!modalEl) return;
  const currentLang = state.language || 'vi';
  const currentTheme = getAppTheme();

  modalEl.querySelectorAll('.segment-lang-btn').forEach(btn => {
    btn.classList.toggle('active', btn.dataset.lang === currentLang);
  });

  modalEl.querySelectorAll('.theme-card-option').forEach(btn => {
    btn.classList.toggle('active', btn.dataset.theme === currentTheme);
  });

  const chkPBR = modalEl.querySelector('#chkPBRQuality');
  if (chkPBR) {
    chkPBR.checked = localStorage.getItem('atlas_pbr_enabled') !== 'false';
  }

  const currentProfile = engineManager.getGraphicsProfile();
  modalEl.querySelectorAll('.segment-profile-btn').forEach(btn => {
    const isActive = btn.dataset.profile === currentProfile;
    btn.classList.toggle('active', isActive);
    btn.style.borderColor = isActive ? '#38bdf8' : 'rgba(255,255,255,0.12)';
    btn.style.background = isActive ? 'rgba(56, 189, 248, 0.18)' : 'rgba(255,255,255,0.04)';
    btn.style.boxShadow = isActive ? '0 0 8px rgba(56, 189, 248, 0.28)' : 'none';
  });

  const rngExposure = modalEl.querySelector('#rngExposureLevel');
  const txtExposureVal = modalEl.querySelector('#txtExposureVal');
  if (rngExposure && txtExposureVal) {
    const curExp = engineManager.getExposure();
    rngExposure.value = curExp;
    txtExposureVal.textContent = Number(curExp).toFixed(2);
  }

  const chkSpeech = modalEl.querySelector('#chkSpeechAudio');
  if (chkSpeech) {
    chkSpeech.checked = localStorage.getItem('atlas_auto_pronounce') === 'true';
  }

  const chkAutoBackup = modalEl.querySelector('#chkAutoBackup');
  if (chkAutoBackup) {
    chkAutoBackup.checked = isAutoBackupEnabled();
  }

  const backupInfo = getLastBackupTimestamps();
  const metaEl = modalEl.querySelector('#gdriveMetaTime');
  if (metaEl) {
    metaEl.textContent = `Đồng bộ: ${backupInfo.drive}`;
  }
}
