// Atlas Admin Modal Controller
// Hệ thống Quản trị Video & Hoạt ảnh Y khoa Atlas 2027
// Mật khẩu quản trị mặc định: 123456
// Hỗ trợ thêm/sửa/xóa link video, cập nhật thời lượng, tiêu đề, danh mục và lưu trữ bền vững.

import {
  getAtlasMediaCategories,
  saveAtlasMediaCategories,
  resetAtlasMediaCategories,
  exportAtlasMediaJSON,
  importAtlasMediaJSON,
  parseVideoUrl,
  verifyAdminPassword,
  isAdminLoggedIn,
  setAdminLoggedIn,
  DEFAULT_ATLAS_MEDIA_CATEGORIES
} from '../data/atlasMediaManager.js';
import { showToast, openVideoModal } from './sidebar.js';
import { compressVideoFile } from '../utils/videoCompressor.js';
import { saveLocalVideo, getLocalVideoBlobUrl, formatBytes } from '../data/videoStore.js';

let adminModalEl = null;
let currentEditingItem = null; // { categoryId, cardIndex, card }
let activeViewerRef = null;
let filterCategory = 'all';
let searchQuery = '';

export function initAtlasAdmin(viewer) {
  if (adminModalEl) return;
  activeViewerRef = viewer;

  const container = document.getElementById('app') || document.body;
  adminModalEl = document.createElement('div');
  adminModalEl.id = 'atlasAdminModal';
  adminModalEl.className = 'atlas-admin-modal hidden';
  adminModalEl.innerHTML = `
    <div class="atlas-admin-backdrop" id="adminBackdrop"></div>
    <div class="atlas-admin-panel" role="dialog" aria-modal="true" aria-label="Bảng Quản Trị Video Y Khoa">
      <div id="adminPanelContent"></div>
    </div>
  `;

  container.appendChild(adminModalEl);

  adminModalEl.querySelector('#adminBackdrop')?.addEventListener('click', closeAtlasAdmin);
  window.addEventListener('keydown', (e) => {
    if (e.key === 'Escape' && adminModalEl && !adminModalEl.classList.contains('hidden')) {
      closeAtlasAdmin();
    }
  });
}

export function openAtlasAdmin(viewer) {
  if (!adminModalEl) initAtlasAdmin(viewer);
  activeViewerRef = viewer;
  adminModalEl.classList.remove('hidden');
  document.body.classList.add('atlas-admin-open');

  if (isAdminLoggedIn()) {
    renderAdminDashboard();
  } else {
    renderAdminLogin();
  }
}

export function closeAtlasAdmin() {
  if (adminModalEl) {
    adminModalEl.classList.add('hidden');
    document.body.classList.remove('atlas-admin-open');
    currentEditingItem = null;
  }
}

// 1. GIAO DIỆN ĐĂNG NHẬP ADMIN (Mật khẩu: 123456)
function renderAdminLogin() {
  const content = adminModalEl.querySelector('#adminPanelContent');
  if (!content) return;

  content.innerHTML = `
    <div class="admin-login-wrapper">
      <div class="admin-login-header">
        <div class="admin-login-icon">
          <svg width="32" height="32" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
            <rect x="3" y="11" width="18" height="11" rx="2" ry="2"/>
            <path d="M7 11V7a5 5 0 0 1 10 0v4"/>
          </svg>
        </div>
        <h2 class="admin-login-title">Quản Trị Video & Hoạt Ảnh</h2>
        <p class="admin-login-desc">Nhập mật khẩu quản trị để chỉnh sửa liên kết video, thời lượng và thông tin 12 danh mục.</p>
      </div>

      <form class="admin-login-form" id="adminLoginForm">
        <div class="admin-form-row">
          <label for="adminPassInput" class="admin-form-label">Mật khẩu Quản trị (Admin Password):</label>
          <div class="admin-password-input-wrap">
            <input type="password" id="adminPassInput" class="admin-input" placeholder="Nhập mật khẩu (123456)" autocomplete="current-password" autofocus />
            <button type="button" class="btn-toggle-pass-visibility" id="btnTogglePassEye" title="Hiện/Ẩn mật khẩu">👁️</button>
          </div>
          <div class="admin-login-hint">💡 Mật khẩu mặc định của bạn là: <strong>123456</strong></div>
        </div>

        <div class="admin-login-error hidden" id="adminLoginError">
          ⚠️ Mật khẩu không chính xác. Vui lòng nhập đúng: <strong>123456</strong>
        </div>

        <div class="admin-login-actions">
          <button type="submit" class="btn-admin-primary">Đăng Nhập Quản Trị</button>
          <button type="button" class="btn-admin-secondary" id="btnCancelAdminLogin">Hủy bỏ</button>
        </div>
      </form>
    </div>
  `;

  const form = content.querySelector('#adminLoginForm');
  const passInput = content.querySelector('#adminPassInput');
  const errorBox = content.querySelector('#adminLoginError');
  const cancelBtn = content.querySelector('#btnCancelAdminLogin');
  const eyeBtn = content.querySelector('#btnTogglePassEye');

  eyeBtn?.addEventListener('click', () => {
    if (passInput.type === 'password') {
      passInput.type = 'text';
      eyeBtn.textContent = '🔒';
    } else {
      passInput.type = 'password';
      eyeBtn.textContent = '👁️';
    }
  });

  cancelBtn?.addEventListener('click', closeAtlasAdmin);

  form?.addEventListener('submit', (e) => {
    e.preventDefault();
    const entered = passInput.value.trim();
    if (verifyAdminPassword(entered)) {
      setAdminLoggedIn(true);
      showToast('✓ Xác thực Admin thành công!');
      renderAdminDashboard();
    } else {
      errorBox?.classList.remove('hidden');
      passInput.classList.add('input-error');
      passInput.focus();
    }
  });

  setTimeout(() => passInput?.focus(), 150);
}

// 2. GIAO DIỆN BẢNG ĐIỀU KHIỂN QUẢN TRỊ (DASHBOARD)
function renderAdminDashboard() {
  const content = adminModalEl.querySelector('#adminPanelContent');
  if (!content) return;

  const categories = getAtlasMediaCategories();
  let totalVideos = 0;
  categories.forEach(c => totalVideos += (c.cards ? c.cards.length : 0));

  content.innerHTML = `
    <div class="admin-dashboard-container">
      
      <!-- Top Action Bar -->
      <div class="admin-dash-header">
        <div class="admin-dash-top">
          <div class="admin-brand-info">
            <h2 class="admin-title">
              <span class="admin-shield-icon">🛡️</span>
              Bảng Quản Trị Video Y Khoa
            </h2>
            <span class="admin-status-badge">Đang đăng nhập Admin</span>
          </div>
          <button type="button" class="btn-admin-close" id="btnAdminCloseModal" aria-label="Đóng">&times;</button>
        </div>

        <div class="admin-action-grid">
          <!-- Hàng 1: Thao tác chính -->
          <div class="admin-btn-row">
            <button type="button" class="btn-admin-action btn-admin-accent" id="btnAdminAddVideo" title="Thêm video mới vào thư viện">
              <span>➕ Thêm Video</span>
            </button>
            <button type="button" class="btn-admin-action btn-admin-save" id="btnAdminSaveAll" title="Lưu toàn bộ thay đổi vào bộ nhớ">
              <span>💾 Lưu Dữ Liệu</span>
            </button>
            <button type="button" class="btn-admin-action btn-admin-logout" id="btnAdminLogout" title="Đăng xuất quyền Admin">
              <span>🚪 Đăng xuất</span>
            </button>
          </div>
          <!-- Hàng 2: Dữ liệu & Sao lưu -->
          <div class="admin-btn-row">
            <button type="button" class="btn-admin-action btn-admin-danger" id="btnAdminReset" title="Khôi phục danh mục 12 nhóm ban đầu">
              <span>🔄 Khôi phục gốc</span>
            </button>
            <button type="button" class="btn-admin-action" id="btnAdminExport" title="Xuất file sao lưu JSON">
              <span>📥 Xuất JSON</span>
            </button>
            <label class="btn-admin-action" title="Nhập file JSON đã sao lưu" style="cursor:pointer;margin:0;">
              <span>📤 Nhập JSON</span>
              <input type="file" id="adminImportFile" accept=".json" style="display:none;" />
            </label>
          </div>
        </div>
      </div>

      <!-- Filter & Search Controls -->
      <div class="admin-toolbar">
        <div class="admin-filter-group">
          <label for="adminCategoryFilter">📁 Danh mục:</label>
          <select id="adminCategoryFilter" class="admin-select">
            <option value="all" ${filterCategory === 'all' ? 'selected' : ''}>Tất cả (${categories.length} danh mục - ${totalVideos} video)</option>
            ${categories.map(cat => `
              <option value="${cat.id}" ${filterCategory === cat.id ? 'selected' : ''}>
                ${cat.titleVi} (${cat.cards ? cat.cards.length : 0})
              </option>
            `).join('')}
          </select>
        </div>

        <div class="admin-search-wrap">
          <span class="admin-search-icon">🔍</span>
          <input type="text" id="adminSearchInput" class="admin-search-input" placeholder="Tìm theo tên video, ID, link..." value="${searchQuery}" />
          ${searchQuery ? `<button type="button" class="admin-search-clear" id="btnAdminSearchClear">&times;</button>` : ''}
        </div>
      </div>

      <!-- Scrollable Video Cards List -->
      <div class="admin-media-list-container" id="adminMediaListContainer">
        <!-- Rendered by renderAdminVideoList -->
      </div>

      <!-- Edit/Add Video Drawer / Modal (Hidden by default) -->
      <div class="admin-edit-drawer hidden" id="adminEditDrawer">
        <!-- Rendered by openEditDrawer -->
      </div>

    </div>
  `;

  // Bind Events
  const addBtn = content.querySelector('#btnAdminAddVideo');
  const saveBtn = content.querySelector('#btnAdminSaveAll');
  const resetBtn = content.querySelector('#btnAdminReset');
  const exportBtn = content.querySelector('#btnAdminExport');
  const importInput = content.querySelector('#adminImportFile');
  const logoutBtn = content.querySelector('#btnAdminLogout');
  const closeBtn = content.querySelector('#btnAdminCloseModal');
  const catFilter = content.querySelector('#adminCategoryFilter');
  const searchInput = content.querySelector('#adminSearchInput');
  const clearSearchBtn = content.querySelector('#btnAdminSearchClear');

  addBtn?.addEventListener('click', () => openEditDrawer(null));
  saveBtn?.addEventListener('click', () => {
    const current = getAtlasMediaCategories();
    saveAtlasMediaCategories(current);
    showToast('✓ Đã lưu toàn bộ thay đổi thành công!');
  });

  resetBtn?.addEventListener('click', () => {
    if (confirm('Bạn có chắc chắn muốn khôi phục 12 danh mục hoạt ảnh về mặc định ban đầu không? Mọi link tự thêm sẽ được đưa về mẫu chuẩn.')) {
      resetAtlasMediaCategories();
      showToast('✓ Đã khôi phục 12 danh mục gốc!');
      renderAdminDashboard();
    }
  });

  exportBtn?.addEventListener('click', () => {
    exportAtlasMediaJSON();
    showToast('✓ Đã xuất file JSON thành công!');
  });

  importInput?.addEventListener('change', (e) => {
    const file = e.target.files?.[0];
    if (!file) return;
    const reader = new FileReader();
    reader.onload = (event) => {
      try {
        importAtlasMediaJSON(event.target.result);
        showToast('✓ Đã nhập dữ liệu danh mục thành công!');
        renderAdminDashboard();
      } catch (err) {
        alert('Lỗi nhập file: ' + err.message);
      }
    };
    reader.readAsText(file);
  });

  logoutBtn?.addEventListener('click', () => {
    setAdminLoggedIn(false);
    showToast('Đã đăng xuất khỏi quyền Admin.');
    renderAdminLogin();
  });

  closeBtn?.addEventListener('click', closeAtlasAdmin);

  catFilter?.addEventListener('change', (e) => {
    filterCategory = e.target.value;
    renderAdminVideoList();
  });

  searchInput?.addEventListener('input', (e) => {
    searchQuery = e.target.value.toLowerCase().trim();
    renderAdminDashboard();
  });

  clearSearchBtn?.addEventListener('click', () => {
    searchQuery = '';
    renderAdminDashboard();
  });

  renderAdminVideoList();
}

// 3. RENDER DANH SÁCH VIDEO TRONG BẢNG QUẢN TRỊ
function renderAdminVideoList() {
  const container = adminModalEl.querySelector('#adminMediaListContainer');
  if (!container) return;

  const categories = getAtlasMediaCategories();
  let html = '';

  categories.forEach(cat => {
    if (filterCategory !== 'all' && cat.id !== filterCategory) return;

    const cards = (cat.cards || []).filter(c => {
      if (!searchQuery) return true;
      return (
        c.title.toLowerCase().includes(searchQuery) ||
        (c.subtitle && c.subtitle.toLowerCase().includes(searchQuery)) ||
        (c.videoUrl && c.videoUrl.toLowerCase().includes(searchQuery)) ||
        cat.titleVi.toLowerCase().includes(searchQuery)
      );
    });

    if (cards.length === 0) return;

    html += `
      <div class="admin-category-block" data-cat-id="${cat.id}">
        <div class="admin-category-header">
          <h3 class="admin-category-title">📁 ${cat.titleVi}</h3>
          <div class="admin-category-badge">${cards.length} video</div>
        </div>
        <div class="admin-video-cards-list">
          ${cards.map((card, idx) => {
            const parsed = parseVideoUrl(card.videoUrl);
            const isYouTube = parsed.type === 'youtube';
            const isDirect = parsed.type === 'video';
            return `
              <div class="admin-video-card" data-card-id="${card.id}">
                <!-- HÀNG 1: Thumbnail + Tiêu đề + Thời lượng + Badge nguồn -->
                <div class="admin-card-head">
                  <img class="admin-card-thumb" src="${card.image || './images/atlas/med_skin.png'}" alt="${card.title}" onerror="this.src='./images/atlas/med_skin.png'" />
                  <div class="admin-card-info-col">
                    <div class="admin-card-title-row">
                      <h4 class="admin-card-title">${card.title}</h4>
                      <div class="admin-card-meta-tags">
                        <span class="admin-pill-duration">⏱️ ${card.duration || '--:--'}</span>
                        <span class="admin-url-badge ${isYouTube ? 'badge-yt' : (isDirect ? 'badge-mp4' : '')}">
                          ${isYouTube ? 'YouTube' : (isDirect ? 'MP4' : 'Link')}
                        </span>
                      </div>
                    </div>
                    ${card.subtitle ? `<p class="admin-card-subtitle">${card.subtitle}</p>` : ''}
                  </div>
                </div>

                <!-- HÀNG 2: Video URL & Bộ 3 nút thao tác (Thử - Sửa - Xóa) -->
                <div class="admin-card-foot">
                  <div class="admin-card-url-box" title="${card.videoUrl || '(Chưa có link)'}">
                    <span class="admin-url-icon">🔗</span>
                    <span class="admin-card-url-text">${card.videoUrl || '(Chưa gắn link video)'}</span>
                  </div>
                  <div class="admin-card-actions">
                    <button type="button" class="btn-card-action btn-mini-play" data-action="preview" data-cat="${cat.id}" data-idx="${idx}" title="Phát thử video">▶️ Thử</button>
                    <button type="button" class="btn-card-action btn-mini-edit" data-action="edit" data-cat="${cat.id}" data-idx="${idx}" title="Sửa link & thông tin">✏️ Sửa</button>
                    <button type="button" class="btn-card-action btn-mini-delete" data-action="delete" data-cat="${cat.id}" data-idx="${idx}" title="Xóa video này">🗑️ Xóa</button>
                  </div>
                </div>
              </div>
            `;
          }).join('')}
        </div>
      </div>
    `;
  });

  if (!html) {
    html = `
      <div class="admin-empty-state">
        <p>Không có video nào khớp với bộ lọc hiện tại.</p>
      </div>
    `;
  }

  container.innerHTML = html;

  // Bind row action buttons
  container.querySelectorAll('[data-action]').forEach(btn => {
    btn.addEventListener('click', (e) => {
      e.stopPropagation();
      const action = btn.dataset.action;
      const catId = btn.dataset.cat;
      const idx = parseInt(btn.dataset.idx, 10);
      const categories = getAtlasMediaCategories();
      const targetCat = categories.find(c => c.id === catId);
      if (!targetCat || !targetCat.cards || !targetCat.cards[idx]) return;

      const targetCard = targetCat.cards[idx];

      if (action === 'preview') {
        if (!targetCard.videoUrl) {
          showToast('⚠️ Video này chưa có link!');
          return;
        }
        openVideoModal(targetCard.videoUrl, targetCard.title);
      } else if (action === 'edit') {
        openEditDrawer({ categoryId: catId, cardIndex: idx, card: targetCard });
      } else if (action === 'delete') {
        if (confirm(`Bạn có chắc muốn xóa video: "${targetCard.title}" không?`)) {
          targetCat.cards.splice(idx, 1);
          saveAtlasMediaCategories(categories);
          showToast(`✓ Đã xóa: ${targetCard.title}`);
          renderAdminVideoList();
        }
      }
    });
  });
}

// 4. MỞ KHUNG CHỈNH SỬA / THÊM MỚI VIDEO (DRAWER)
function openEditDrawer(itemData) {
  const drawer = adminModalEl.querySelector('#adminEditDrawer');
  if (!drawer) return;

  const categories = getAtlasMediaCategories();
  const isEditing = Boolean(itemData);
  const card = itemData?.card || {
    id: 'med_' + Date.now(),
    title: '',
    subtitle: '',
    duration: '0:30',
    badge: 'Chuyên khoa',
    type: 'video',
    image: './images/atlas/med_skin.png',
    videoUrl: ''
  };

  const selectedCatId = itemData?.categoryId || categories[0]?.id || 'system_overviews_media';

  drawer.innerHTML = `
    <div class="admin-drawer-card">
      <div class="admin-drawer-header">
        <h3 class="admin-drawer-title">${isEditing ? '✏️ Chỉnh Sửa Video Giải Phẫu' : '➕ Thêm Video Giải Phẫu Mới'}</h3>
        <button type="button" class="admin-drawer-close" id="btnAdminDrawerClose">&times;</button>
      </div>

      <form class="admin-drawer-form" id="adminDrawerForm">
        <div class="admin-drawer-field">
          <label>Danh mục (Category):</label>
          <select id="drawerCategorySelect" class="admin-input">
            ${categories.map(c => `
              <option value="${c.id}" ${c.id === selectedCatId ? 'selected' : ''}>${c.titleVi}</option>
            `).join('')}
          </select>
        </div>

        <div class="admin-drawer-field">
          <label>Tiêu đề video (Title):</label>
          <input type="text" id="drawerTitleInput" class="admin-input" value="${card.title || ''}" placeholder="VD: 1. Function of the Skin (Chức năng của da)" required />
        </div>

        <div class="admin-drawer-field">
          <label>Mô tả ngắn / Chú thích (Subtitle):</label>
          <input type="text" id="drawerSubtitleInput" class="admin-input" value="${card.subtitle || ''}" placeholder="VD: Cấu trúc 3 tầng: Biểu bì, thân bì và hạ bì" />
        </div>

        <div class="admin-drawer-row-2">
          <div class="admin-drawer-field">
            <label>Thời lượng (Duration):</label>
            <input type="text" id="drawerDurationInput" class="admin-input" value="${card.duration || '0:45'}" placeholder="0:56" />
          </div>
          <div class="admin-drawer-field">
            <label>Nhãn thẻ (Badge):</label>
            <input type="text" id="drawerBadgeInput" class="admin-input" value="${card.badge || 'Video'}" placeholder="VD: Tim mạch, Cơ xương..." />
          </div>
        </div>

        <div class="admin-drawer-field">
          <label>Đường dẫn Video (YouTube / MP4 URL):</label>
          <div class="admin-input-btn-wrap">
            <input type="text" id="drawerUrlInput" class="admin-input" value="${card.videoUrl || ''}" placeholder="Dán link YouTube (watch, embed, youtu.be, shorts) hoặc link .mp4" />
            <button type="button" class="btn-test-url" id="btnDrawerTestUrl" title="Kiểm tra phát thử link này ngay">▶️ Thử link</button>
          </div>
          <span class="admin-field-tip">Hệ thống tự động nhận diện và chuyển hóa mọi link YouTube hoặc file MP4 trực tiếp.</span>
          <div class="admin-local-mp4-box" style="margin-top:8px;padding:8px 10px;background:rgba(255,255,255,0.04);border:1px dashed rgba(56,189,248,0.3);border-radius:8px;">
            <label class="btn-admin-secondary" style="cursor:pointer;display:inline-flex;align-items:center;gap:6px;font-size:12px;padding:6px 12px;margin:0;">
              <span>📁 Hoặc chọn video MP4 từ máy (Kèm tự động nén)</span>
              <input type="file" id="drawerLocalFileInput" accept="video/mp4,video/webm,video/quicktime" style="display:none;" />
            </label>
            <div id="drawerLocalFileStatus" style="font-size:11px;opacity:0.85;margin-top:6px;display:none;"></div>
          </div>
        </div>

        <div class="admin-drawer-field">
          <label>Ảnh Thumbnail xem trước:</label>
          <input type="text" id="drawerImageInput" class="admin-input" value="${card.image || './images/atlas/med_skin.png'}" placeholder="./images/atlas/med_skin.png hoặc link ảnh online" />
          <div class="admin-preset-thumbs">
            <span style="font-size:11px;opacity:0.8;">Chọn ảnh mẫu có sẵn:</span>
            <button type="button" class="btn-preset-thumb" data-thumb="./images/atlas/med_skin.png">Da</button>
            <button type="button" class="btn-preset-thumb" data-thumb="./images/atlas/med_skeleton.png">Xương</button>
            <button type="button" class="btn-preset-thumb" data-thumb="./images/atlas/med_muscles.png">Cơ</button>
            <button type="button" class="btn-preset-thumb" data-thumb="./images/atlas/med_paired_muscles.png">Cơ đối vận</button>
            <button type="button" class="btn-preset-thumb" data-thumb="./images/atlas/med_ball_socket.png">Khớp cầu</button>
            <button type="button" class="btn-preset-thumb" data-thumb="./images/atlas/med_condyloid.png">Khớp gối</button>
            <button type="button" class="btn-preset-thumb" data-thumb="./images/atlas/circ_heart_thorax.png">Tim</button>
            <button type="button" class="btn-preset-thumb" data-thumb="./images/atlas/resp_lungs.png">Phổi</button>
            <button type="button" class="btn-preset-thumb" data-thumb="./images/atlas/dig_upper.png">Dạ dày</button>
          </div>
        </div>

        <div class="admin-drawer-footer">
          <button type="submit" class="btn-admin-primary">💾 ${isEditing ? 'Lưu Cập Nhật' : '➕ Thêm Vào Thư Viện'}</button>
          <button type="button" class="btn-admin-secondary" id="btnAdminDrawerCancel">Hủy</button>
        </div>
      </form>
    </div>
  `;

  drawer.classList.remove('hidden');

  // Drawer event listeners
  const closeBtn = drawer.querySelector('#btnAdminDrawerClose');
  const cancelBtn = drawer.querySelector('#btnAdminDrawerCancel');
  const testUrlBtn = drawer.querySelector('#btnDrawerTestUrl');
  const form = drawer.querySelector('#adminDrawerForm');
  const imgInput = drawer.querySelector('#drawerImageInput');

  closeBtn?.addEventListener('click', () => drawer.classList.add('hidden'));
  cancelBtn?.addEventListener('click', () => drawer.classList.add('hidden'));

  testUrlBtn?.addEventListener('click', () => {
    const rawUrl = drawer.querySelector('#drawerUrlInput').value.trim();
    const titleVal = drawer.querySelector('#drawerTitleInput').value.trim() || 'Video Thử Nghiệm';
    if (!rawUrl) {
      alert('Vui lòng dán link video trước khi kiểm tra!');
      return;
    }
    openVideoModal(rawUrl, titleVal);
  });

  const localFileInput = drawer.querySelector('#drawerLocalFileInput');
  const localFileStatus = drawer.querySelector('#drawerLocalFileStatus');
  const urlInput = drawer.querySelector('#drawerUrlInput');
  const durInput = drawer.querySelector('#drawerDurationInput');

  localFileInput?.addEventListener('change', async (e) => {
    const file = e.target.files?.[0];
    if (!file) return;

    localFileStatus.style.display = 'block';
    localFileStatus.textContent = `Đang nén ${file.name}...`;

    try {
      const res = await compressVideoFile(file, { shouldCompress: true, speed: 2.0 }, (pct, status) => {
        localFileStatus.textContent = `${status} (${pct}%)`;
      });

      const vidId = `local_vid_${Date.now()}`;
      await saveLocalVideo({
        id: vidId,
        title: drawer.querySelector('#drawerTitleInput').value.trim() || file.name,
        blob: res.blob,
        originalSize: file.size,
        duration: res.duration,
        thumbnail: res.thumbnail
      });

      const blobUrl = await getLocalVideoBlobUrl(vidId);
      urlInput.value = blobUrl;
      card.localVideoId = vidId;
      if (res.duration) durInput.value = res.duration;
      if (res.thumbnail) imgInput.value = res.thumbnail;

      const origMB = formatBytes(res.originalSize);
      const compMB = formatBytes(res.compressedSize);
      localFileStatus.innerHTML = `✓ Đã nén: ${origMB} ➔ <strong>${compMB}</strong>!`;
    } catch (err) {
      localFileStatus.textContent = '⚠️ Lỗi: ' + err.message;
    }
  });

  drawer.querySelectorAll('.btn-preset-thumb').forEach(b => {
    b.addEventListener('click', () => {
      imgInput.value = b.dataset.thumb;
    });
  });

  form?.addEventListener('submit', (e) => {
    e.preventDefault();
    const catId = drawer.querySelector('#drawerCategorySelect').value;
    const title = drawer.querySelector('#drawerTitleInput').value.trim();
    const subtitle = drawer.querySelector('#drawerSubtitleInput').value.trim();
    const duration = drawer.querySelector('#drawerDurationInput').value.trim() || '0:30';
    const badge = drawer.querySelector('#drawerBadgeInput').value.trim() || 'Video';
    const videoUrl = drawer.querySelector('#drawerUrlInput').value.trim();
    const image = drawer.querySelector('#drawerImageInput').value.trim() || './images/atlas/med_skin.png';

    const categories = getAtlasMediaCategories();
    const targetCat = categories.find(c => c.id === catId);
    if (!targetCat) {
      alert('Không tìm thấy danh mục!');
      return;
    }

    if (!targetCat.cards) targetCat.cards = [];

    if (isEditing) {
      // Update existing item
      const originalCat = categories.find(c => c.id === itemData.categoryId);
      if (originalCat && originalCat.id === catId) {
        // Same category
        originalCat.cards[itemData.cardIndex] = {
          ...originalCat.cards[itemData.cardIndex],
          title,
          subtitle,
          duration,
          badge,
          videoUrl,
          image
        };
      } else {
        // Moved to another category
        if (originalCat) originalCat.cards.splice(itemData.cardIndex, 1);
        targetCat.cards.push({
          id: card.id,
          title,
          subtitle,
          duration,
          badge,
          type: 'video',
          videoUrl,
          image
        });
      }
      showToast(`✓ Đã cập nhật video: ${title}`);
    } else {
      // Add new item
      targetCat.cards.push({
        id: 'med_' + Date.now(),
        title,
        subtitle,
        duration,
        badge,
        type: 'video',
        videoUrl,
        image
      });
      showToast(`✓ Đã thêm video mới: ${title}`);
    }

    saveAtlasMediaCategories(categories);
    drawer.classList.add('hidden');
    renderAdminVideoList();
  });
}
