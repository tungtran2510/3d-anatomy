// Atlas Settings Modal (Visible Body & Medical Atlas Standard)
// Tách biệt hoàn toàn Cài đặt hệ thống khỏi Chế độ Sáng/Tối.
import { state, setLanguage } from '../state/store.js';
import { getAppTheme, setAppTheme, isDarkTheme } from '../utils/themeManager.js';
import { showToast } from './sidebar.js';

let modalEl = null;

export function initSettingsModal(viewer) {
  if (modalEl) return;

  modalEl = document.createElement('div');
  modalEl.id = 'atlasSettingsModal';
  modalEl.className = 'modal atlas-settings-modal hidden';
  modalEl.setAttribute('role', 'dialog');
  modalEl.setAttribute('aria-modal', 'true');
  modalEl.setAttribute('aria-label', 'Cài đặt hệ thống Atlas 3D');

  modalEl.innerHTML = `
    <div class="modal-overlay" id="atlasSettingsOverlay"></div>
    <div class="modal-content atlas-settings-content">
      <div class="modal-header">
        <div class="settings-modal-title">
          <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
            <circle cx="12" cy="12" r="3"/>
            <path d="M19.4 15a1.65 1.65 0 0 0 .33 1.82l.06.06a2 2 0 0 1 0 2.83 2 2 0 0 1-2.83 0l-.06-.06a1.65 1.65 0 0 0-1.82-.33 1.65 1.65 0 0 0-1 1.51V21a2 2 0 0 1-2 2 2 2 0 0 1-2-2v-.09A1.65 1.65 0 0 0 9 19.4a1.65 1.65 0 0 0-1.82.33l-.06.06a2 2 0 0 1-2.83 0 2 2 0 0 1 0-2.83l.06-.06a1.65 1.65 0 0 0 .33-1.82 1.65 1.65 0 0 0-1.51-1H3a2 2 0 0 1-2-2 2 2 0 0 1 2-2h.09A1.65 1.65 0 0 0 4.6 9a1.65 1.65 0 0 0-.33-1.82l-.06-.06a2 2 0 0 1 0-2.83 2 2 0 0 1 2.83 0l.06.06a1.65 1.65 0 0 0 1.82.33H9a1.65 1.65 0 0 0 1-1.51V3a2 2 0 0 1 2-2 2 2 0 0 1 2 2v.09a1.65 1.65 0 0 0 1 1.51 1.65 1.65 0 0 0 1.82-.33l.06-.06a2 2 0 0 1 2.83 0 2 2 0 0 1 0 2.83l-.06.06a1.65 1.65 0 0 0-.33 1.82V9a1.65 1.65 0 0 0 1.51 1H21a2 2 0 0 1 2 2 2 2 0 0 1-2 2h-.09a1.65 1.65 0 0 0-1.51 1z"/>
          </svg>
          <h3>Cài Đặt Hệ Thống</h3>
        </div>
        <button type="button" class="modal-close" id="btnSettingsClose" aria-label="Đóng">&times;</button>
      </div>

      <div class="modal-body settings-modal-body">
        <!-- 1. Ngôn ngữ danh pháp giải phẫu -->
        <div class="settings-group">
          <div class="settings-group-header">
            <h4>🌐 Danh pháp Y khoa & Ngôn ngữ</h4>
            <span class="settings-group-desc">Chuẩn hóa tên cấu trúc theo thuật ngữ giải phẫu học</span>
          </div>
          <div class="settings-radio-cards" id="settingsLangCards">
            <button type="button" class="settings-card-btn" data-lang="vi">
              <span class="card-btn-indicator"></span>
              <div class="card-btn-text">
                <strong>Tiếng Việt (Bộ Y tế)</strong>
                <small>Thuật ngữ giải phẫu chuẩn đại học y Việt Nam</small>
              </div>
            </button>
            <button type="button" class="settings-card-btn" data-lang="en">
              <span class="card-btn-indicator"></span>
              <div class="card-btn-text">
                <strong>English (International)</strong>
                <small>Standard anatomical terminology (Gray's Anatomy)</small>
              </div>
            </button>
            <button type="button" class="settings-card-btn" data-lang="it">
              <span class="card-btn-indicator"></span>
              <div class="card-btn-text">
                <strong>Latina (Terminologia Anatomica)</strong>
                <small>Danh pháp Latinh TA2 chuẩn quốc tế FIPAT</small>
              </div>
            </button>
          </div>
        </div>

        <!-- 2. Giao diện & Chế độ Sáng / Tối -->
        <div class="settings-group">
          <div class="settings-group-header">
            <h4>🎨 Chế độ hiển thị & Màu nền</h4>
            <span class="settings-group-desc">Lựa chọn chế độ nền phòng mổ hoặc nền trắng nghiên cứu</span>
          </div>
          <div class="settings-theme-toggle-row">
            <button type="button" class="theme-choice-btn" data-theme="light">
              <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
                <circle cx="12" cy="12" r="5"/><line x1="12" y1="1" x2="12" y2="3"/><line x1="12" y1="21" x2="12" y2="23"/><line x1="4.22" y1="4.22" x2="5.64" y2="5.64"/><line x1="18.36" y1="18.36" x2="19.78" y2="19.78"/><line x1="1" y1="12" x2="3" y2="12"/><line x1="21" y1="12" x2="23" y2="12"/><line x1="4.22" y1="19.78" x2="5.64" y2="18.36"/><line x1="18.36" y1="5.64" x2="19.78" y2="4.22"/>
              </svg>
              <span>Nền Sáng (Medical White)</span>
            </button>
            <button type="button" class="theme-choice-btn" data-theme="dark">
              <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
                <path d="M21 12.79A9 9 0 1 1 11.21 3 7 7 0 0 0 21 12.79z"/>
              </svg>
              <span>Nền Tối (Deep Navy)</span>
            </button>
          </div>
        </div>

        <!-- 3. Chất lượng đồ họa 3D -->
        <div class="settings-group">
          <div class="settings-group-header">
            <h4>⚡ Hiệu năng & Đồ họa 3D</h4>
            <span class="settings-group-desc">Tự động tối ưu theo cấu hình vi xử lý thiết bị</span>
          </div>
          <div class="settings-switch-row">
            <div class="settings-switch-label">
              <strong>Vật liệu PBR Y khoa cao cấp</strong>
              <small>Mô phỏng chân thực độ ẩm, sắc tố mô sống và chiều sâu</small>
            </div>
            <label class="toggle-switch">
              <input type="checkbox" id="chkPBRQuality" checked>
              <span class="slider"></span>
            </label>
          </div>
          <div class="settings-switch-row">
            <div class="settings-switch-label">
              <strong>Bóng mờ đường viền cơ thể</strong>
              <small>Đường viền mờ trong suốt định vị tư thế giải phẫu chuẩn</small>
            </div>
            <label class="toggle-switch">
              <input type="checkbox" id="chkBodyEnvelope" checked>
              <span class="slider"></span>
            </label>
          </div>
        </div>

        <!-- 4. Âm thanh & Nhãn hiển thị -->
        <div class="settings-group">
          <div class="settings-group-header">
            <h4>🔊 Hỗ trợ học tập & Phát âm</h4>
            <span class="settings-group-desc">Nghe chuẩn phát âm giải phẫu tiếng Việt và quốc tế</span>
          </div>
          <div class="settings-switch-row">
            <div class="settings-switch-label">
              <strong>Phát âm tự động khi chọn cấu trúc</strong>
              <small>Đọc tên cơ quan bằng giọng đọc y khoa chuẩn</small>
            </div>
            <label class="toggle-switch">
              <input type="checkbox" id="chkSpeechAudio">
              <span class="slider"></span>
            </label>
          </div>
        </div>

        <!-- 5. Bản quyền & Nguồn dữ liệu -->
        <div class="settings-group settings-about-group">
          <div class="settings-about-box">
            <div class="about-app-badge">Atlas Giải Phẫu 3D v2.4</div>
            <p>Xây dựng trên nền tảng nguồn mở Y khoa quốc tế (CC BY-NC-SA 4.0), tích hợp mô hình chuẩn hóa từ BodyParts3D (Nhật Bản) và Z-Anatomy.</p>
            <div class="about-links">
              <a href="https://www.z-anatomy.com/" target="_blank" rel="noopener">Z-Anatomy</a> • 
              <a href="https://lifesciencedb.jp/bp3d/" target="_blank" rel="noopener">BodyParts3D</a> • 
              <a href="https://3d-anatomy-atlas-vn.vercel.app" target="_blank" rel="noopener">Trang chủ Atlas</a>
            </div>
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
  const langCards = modalEl.querySelectorAll('.settings-card-btn');
  langCards.forEach(btn => {
    btn.addEventListener('click', () => {
      const selected = btn.dataset.lang;
      setLanguage(selected);
      const langSelect = document.getElementById('langSelect');
      if (langSelect) langSelect.value = selected;
      updateSettingsUI();
      showToast(`Đã chọn ngôn ngữ: ${btn.querySelector('strong')?.textContent}`);
    });
  });

  // Theme buttons
  const themeBtns = modalEl.querySelectorAll('.theme-choice-btn');
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

  // Speech audio toggle
  const chkSpeech = modalEl.querySelector('#chkSpeechAudio');
  chkSpeech?.addEventListener('change', (e) => {
    localStorage.setItem('atlas_auto_pronounce', e.target.checked ? 'true' : 'false');
    showToast(`Đã ${e.target.checked ? 'bật' : 'tắt'} phát âm tự động`);
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

  modalEl.querySelectorAll('.settings-card-btn').forEach(btn => {
    btn.classList.toggle('active', btn.dataset.lang === currentLang);
  });

  modalEl.querySelectorAll('.theme-choice-btn').forEach(btn => {
    btn.classList.toggle('active', btn.dataset.theme === currentTheme);
  });

  const chkSpeech = modalEl.querySelector('#chkSpeechAudio');
  if (chkSpeech) {
    chkSpeech.checked = localStorage.getItem('atlas_auto_pronounce') === 'true';
  }
}
