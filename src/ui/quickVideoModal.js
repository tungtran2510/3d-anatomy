// Quick Video Attachment Modal Controller
// Supports 2 Minimalist Methods:
// 1. YouTube Link (Auto-parsed embed URL & HD Thumbnail)
// 2. Direct Local MP4 Upload with Automatic Client-Side Compression & IndexedDB Storage
// Enables attaching medical videos to any organ structure or library category in 1-click.

import {
  parseVideoUrl,
  setPartVideo,
  removePartVideo,
  isAdminLoggedIn,
  setAdminLoggedIn,
  verifyAdminPassword
} from '../data/atlasMediaManager.js';
import { saveLocalVideo, formatBytes, getLocalVideoBlobUrl } from '../data/videoStore.js';
import { compressVideoFile, extractVideoMetaAndThumbnail } from '../utils/videoCompressor.js';
import { showToast, openVideoModal } from './sidebar.js';

let modalEl = null;
let currentTarget = null; // { partId, partName, onSaved }
let activeTab = 'youtube'; // 'youtube' | 'local_mp4'
let selectedFile = null;
let compressedResult = null;
let isCompressing = false;

export function initQuickVideoModal() {
  if (modalEl) return;

  const container = document.getElementById('app') || document.body;
  modalEl = document.createElement('div');
  modalEl.id = 'quickVideoModal';
  modalEl.className = 'quick-video-modal hidden';
  modalEl.innerHTML = `
    <div class="quick-video-backdrop" id="quickVideoBackdrop"></div>
    <div class="quick-video-dialog" role="dialog" aria-modal="true" aria-label="Gắn Video Giải Phẫu">
      <div id="quickVideoDialogContent"></div>
    </div>
  `;

  container.appendChild(modalEl);

  modalEl.querySelector('#quickVideoBackdrop')?.addEventListener('click', closeQuickVideoModal);
  window.addEventListener('keydown', (e) => {
    if (e.key === 'Escape' && modalEl && !modalEl.classList.contains('hidden')) {
      closeQuickVideoModal();
    }
  });
}

/**
 * Open Quick Video Attachment Modal for a specific anatomical part or category
 * @param {string} partId - ID of organ (e.g. 'Liver', 'Vertebra L1') or null
 * @param {string} partName - Vietnamese display name
 * @param {Function} onSaved - Callback when video is saved
 */
export function openQuickVideoModal(partId, partName, onSaved = () => {}) {
  if (!modalEl) initQuickVideoModal();

  currentTarget = {
    partId,
    partName: partName || partId || 'Cơ quan giải phẫu',
    onSaved
  };

  selectedFile = null;
  compressedResult = null;
  isCompressing = false;
  activeTab = 'youtube';

  modalEl.classList.remove('hidden');

  if (isAdminLoggedIn()) {
    renderVideoAttachmentForm();
  } else {
    renderAdminAuthGate();
  }
}

export function closeQuickVideoModal() {
  if (modalEl) {
    modalEl.classList.add('hidden');
    currentTarget = null;
    selectedFile = null;
    compressedResult = null;
    isCompressing = false;
  }
}

// 1. MÀN HÌNH XÁC THỰC MẬT KHẨU ADMIN (Nếu chưa đăng nhập)
function renderAdminAuthGate() {
  const content = modalEl.querySelector('#quickVideoDialogContent');
  if (!content) return;

  content.innerHTML = `
    <div class="qvm-card auth-card">
      <div class="qvm-header">
        <div class="qvm-badge">🔐 Xác Thực Quản Trị</div>
        <h3 class="qvm-title">Quyền Thêm Video Giải Phẫu</h3>
        <p class="qvm-desc">Vui lòng nhập mật khẩu quản trị để gắn video vào: <strong>${currentTarget.partName}</strong></p>
      </div>

      <form id="qvmAuthForm" class="qvm-form">
        <div class="qvm-input-wrap">
          <input type="password" id="qvmPassInput" class="qvm-input" placeholder="Mật khẩu quản trị (Mặc định: 123456)" autocomplete="current-password" autofocus required />
        </div>
        <div class="qvm-hint">💡 Gợi ý mật khẩu mặc định: <strong>123456</strong></div>
        <div class="qvm-error hidden" id="qvmAuthError">⚠️ Mật khẩu không chính xác. Mặc định là 123456.</div>

        <div class="qvm-actions">
          <button type="submit" class="qvm-btn primary">Xác Nhận & Tiếp Tục</button>
          <button type="button" class="qvm-btn secondary" id="btnQvmAuthCancel">Hủy</button>
        </div>
      </form>
    </div>
  `;

  const form = content.querySelector('#qvmAuthForm');
  const input = content.querySelector('#qvmPassInput');
  const error = content.querySelector('#qvmAuthError');
  const cancelBtn = content.querySelector('#btnQvmAuthCancel');

  cancelBtn?.addEventListener('click', closeQuickVideoModal);
  form?.addEventListener('submit', (e) => {
    e.preventDefault();
    if (verifyAdminPassword(input.value)) {
      setAdminLoggedIn(true);
      showToast('✓ Đăng nhập quản trị thành công!');
      renderVideoAttachmentForm();
    } else {
      error.classList.remove('hidden');
      input.classList.add('error');
      input.focus();
    }
  });

  setTimeout(() => input?.focus(), 120);
}

// 2. GIAO DIỆN CHÍNH: 2 CÁCH GẮN VIDEO (YOUTUBE HOẶC MP4 NỘI BỘ KÈM NÉN)
function renderVideoAttachmentForm() {
  const content = modalEl.querySelector('#quickVideoDialogContent');
  if (!content) return;

  const titleDefault = `Giải phẫu & Chức năng ${currentTarget.partName}`;

  content.innerHTML = `
    <div class="qvm-card">
      <div class="qvm-header">
        <div class="qvm-header-left">
          <span class="qvm-icon">🎬</span>
          <div>
            <h3 class="qvm-title">Gắn Video Giải Phẫu</h3>
            <span class="qvm-target-name">${currentTarget.partName}</span>
          </div>
        </div>
        <button type="button" class="qvm-close-btn" id="btnQvmClose" aria-label="Đóng">&times;</button>
      </div>

      <!-- 2 Tabs: YouTube Link vs Local MP4 File -->
      <div class="qvm-tabs">
        <button type="button" class="qvm-tab ${activeTab === 'youtube' ? 'active' : ''}" id="tabQvmYouTube">
          <span>▶️ 1. Dán Link YouTube</span>
        </button>
        <button type="button" class="qvm-tab ${activeTab === 'local_mp4' ? 'active' : ''}" id="tabQvmLocal">
          <span>📁 2. Chọn MP4 Từ Máy (Tự động nén)</span>
        </button>
      </div>

      <!-- Tab Content 1: YouTube Link -->
      <div class="qvm-tab-pane ${activeTab === 'youtube' ? '' : 'hidden'}" id="paneQvmYouTube">
        <div class="qvm-field">
          <label>Đường dẫn YouTube (Mọi định dạng watch, youtu.be, shorts):</label>
          <div class="qvm-input-row">
            <input type="text" id="qvmYtUrlInput" class="qvm-input" placeholder="VD: https://youtu.be/aMGgCxUXV3o hoặc youtube.com/watch?v=..." />
            <button type="button" class="qvm-btn secondary" id="btnTestYtUrl" title="Kiểm tra phát thử">▶️ Thử</button>
          </div>
          <span class="qvm-tip">Hệ thống tự động trích xuất mã video và ảnh bìa HD chất lượng cao.</span>
        </div>

        <div class="qvm-preview-box hidden" id="qvmYtPreviewBox">
          <div class="qvm-thumb-preview" id="qvmYtThumb"></div>
          <div class="qvm-preview-info">
            <span class="qvm-preview-status">✓ Đã nhận diện link YouTube hợp lệ</span>
            <span class="qvm-preview-id" id="qvmYtIdText"></span>
          </div>
        </div>
      </div>

      <!-- Tab Content 2: Local MP4 Video with Auto Compression -->
      <div class="qvm-tab-pane ${activeTab === 'local_mp4' ? '' : 'hidden'}" id="paneQvmLocal">
        <div class="qvm-field">
          <label>Chọn file video từ máy (.mp4, .webm, .mov):</label>
          <div class="qvm-file-dropzone" id="qvmFileDropzone">
            <input type="file" id="qvmFileInput" accept="video/mp4,video/webm,video/quicktime,video/x-m4v" class="qvm-file-input" />
            <div class="dropzone-content">
              <span class="dropzone-icon">📥</span>
              <span class="dropzone-text" id="qvmDropzoneText">Bấm để chọn file video từ máy hoặc điện thoại</span>
              <span class="dropzone-sub">Hỗ trợ MP4, WebM, MOV. Tự động nén siêu tốc.</span>
            </div>
          </div>
        </div>

        <div class="qvm-field compress-toggle-wrap">
          <label class="qvm-checkbox-label">
            <input type="checkbox" id="chkAutoCompress" checked />
            <span class="chk-custom"></span>
            <span class="chk-text">
              <strong>⚡ Tự động nén tối ưu (Khuyên dùng)</strong>
              <small>Giảm 70-90% dung lượng mà vẫn giữ nguyên độ nét chuẩn HD, phát siêu mượt không giật lag.</small>
            </span>
          </label>
        </div>

        <!-- Compression Progress Bar -->
        <div class="qvm-progress-wrap hidden" id="qvmProgressWrap">
          <div class="qvm-progress-header">
            <span id="qvmProgressStatusText">Đang nén video...</span>
            <span id="qvmProgressPercent">0%</span>
          </div>
          <div class="qvm-progress-bar">
            <div class="qvm-progress-fill" id="qvmProgressFill" style="width: 0%;"></div>
          </div>
          <div class="qvm-size-comparison hidden" id="qvmSizeComparison"></div>
        </div>

        <!-- Local Video Preview -->
        <div class="qvm-local-preview-wrap hidden" id="qvmLocalPreviewWrap">
          <video id="qvmLocalVideoPlayer" controls playsinline class="qvm-video-player"></video>
        </div>
      </div>

      <!-- Common Fields: Title & Duration -->
      <div class="qvm-field">
        <label>Tiêu đề bài giảng / minh họa:</label>
        <input type="text" id="qvmTitleInput" class="qvm-input" value="${titleDefault}" placeholder="VD: Giải phẫu và sinh lý tim" required />
      </div>

      <div class="qvm-row-2">
        <div class="qvm-field">
          <label>Thời lượng:</label>
          <input type="text" id="qvmDurationInput" class="qvm-input" value="0:45" placeholder="0:45" />
        </div>
        <div class="qvm-field">
          <label>Nhãn phân loại:</label>
          <input type="text" id="qvmBadgeInput" class="qvm-input" value="Video 3D" placeholder="Video 3D" />
        </div>
      </div>

      <!-- Action Footer -->
      <div class="qvm-actions">
        <button type="button" class="qvm-btn primary" id="btnSavePartVideo">💾 Lưu & Gắn Vào Bộ Phận</button>
        <button type="button" class="qvm-btn secondary" id="btnCancelPartVideo">Hủy</button>
      </div>

    </div>
  `;

  bindFormEvents();
}

function bindFormEvents() {
  const content = modalEl.querySelector('#quickVideoDialogContent');
  if (!content) return;

  const closeBtn = content.querySelector('#btnQvmClose');
  const cancelBtn = content.querySelector('#btnCancelPartVideo');
  const saveBtn = content.querySelector('#btnSavePartVideo');

  const tabYt = content.querySelector('#tabQvmYouTube');
  const tabLocal = content.querySelector('#tabQvmLocal');
  const paneYt = content.querySelector('#paneQvmYouTube');
  const paneLocal = content.querySelector('#paneQvmLocal');

  const ytInput = content.querySelector('#qvmYtUrlInput');
  const ytTestBtn = content.querySelector('#btnTestYtUrl');
  const ytPreviewBox = content.querySelector('#qvmYtPreviewBox');
  const ytThumb = content.querySelector('#qvmYtThumb');
  const ytIdText = content.querySelector('#qvmYtIdText');

  const fileInput = content.querySelector('#qvmFileInput');
  const dropzoneText = content.querySelector('#qvmDropzoneText');
  const chkAutoCompress = content.querySelector('#chkAutoCompress');
  const progressWrap = content.querySelector('#qvmProgressWrap');
  const progressFill = content.querySelector('#qvmProgressFill');
  const progressPercent = content.querySelector('#qvmProgressPercent');
  const progressStatus = content.querySelector('#qvmProgressStatusText');
  const sizeComparison = content.querySelector('#qvmSizeComparison');
  const localPreviewWrap = content.querySelector('#qvmLocalPreviewWrap');
  const localVideoPlayer = content.querySelector('#qvmLocalVideoPlayer');

  const titleInput = content.querySelector('#qvmTitleInput');
  const durationInput = content.querySelector('#qvmDurationInput');
  const badgeInput = content.querySelector('#qvmBadgeInput');

  closeBtn?.addEventListener('click', closeQuickVideoModal);
  cancelBtn?.addEventListener('click', closeQuickVideoModal);

  // Tab switching
  tabYt?.addEventListener('click', () => {
    activeTab = 'youtube';
    tabYt.classList.add('active');
    tabLocal.classList.remove('active');
    paneYt.classList.remove('hidden');
    paneLocal.classList.add('hidden');
  });

  tabLocal?.addEventListener('click', () => {
    activeTab = 'local_mp4';
    tabLocal.classList.add('active');
    tabYt.classList.remove('active');
    paneLocal.classList.remove('hidden');
    paneYt.classList.add('hidden');
  });

  // YouTube live inspection
  const inspectYtUrl = () => {
    const raw = ytInput.value.trim();
    const parsed = parseVideoUrl(raw);
    if (parsed.type === 'youtube') {
      ytPreviewBox.classList.remove('hidden');
      const thumbUrl = `https://i.ytimg.com/vi/${parsed.id}/hqdefault.jpg`;
      ytThumb.style.backgroundImage = `url('${thumbUrl}')`;
      ytIdText.textContent = `YouTube ID: ${parsed.id}`;
    } else {
      ytPreviewBox.classList.add('hidden');
    }
  };

  ytInput?.addEventListener('input', inspectYtUrl);
  ytTestBtn?.addEventListener('click', () => {
    const raw = ytInput.value.trim();
    if (!raw) {
      alert('Vui lòng dán link YouTube trước khi thử!');
      return;
    }
    openVideoModal(raw, titleInput.value.trim() || currentTarget.partName);
  });

  // Local File Selection & Auto-Compression
  fileInput?.addEventListener('change', async (e) => {
    const file = e.target.files?.[0];
    if (!file) return;

    selectedFile = file;
    dropzoneText.textContent = `📁 Đã chọn: ${file.name} (${formatBytes(file.size)})`;

    const shouldCompress = chkAutoCompress?.checked ?? true;

    // Show progress container
    progressWrap.classList.remove('hidden');
    sizeComparison.classList.add('hidden');
    localPreviewWrap.classList.add('hidden');
    saveBtn.disabled = true;
    isCompressing = true;

    try {
      compressedResult = await compressVideoFile(
        file,
        { shouldCompress, maxWidth: 960, maxHeight: 540, bitrate: 1100000, speed: 2.0 },
        (pct, status) => {
          progressFill.style.width = `${pct}%`;
          progressPercent.textContent = `${pct}%`;
          progressStatus.textContent = status;
        }
      );

      // Display size comparison
      const origMB = formatBytes(compressedResult.originalSize);
      const compMB = formatBytes(compressedResult.compressedSize);
      const savedPct = Math.max(0, Math.round((1 - compressedResult.compressedSize / compressedResult.originalSize) * 100));

      sizeComparison.classList.remove('hidden');
      sizeComparison.innerHTML = `
        <span class="size-pill orig">Gốc: ${origMB}</span>
        <span class="size-arrow">➔</span>
        <span class="size-pill comp">Đã nén: ${compMB} (-${savedPct}%)</span>
      `;

      // Update duration field
      if (compressedResult.duration) {
        durationInput.value = compressedResult.duration;
      }

      // Preview local video
      const blobUrl = URL.createObjectURL(compressedResult.blob);
      localVideoPlayer.src = blobUrl;
      localPreviewWrap.classList.remove('hidden');

    } catch (err) {
      console.error('[QuickVideoModal] Compression error:', err);
      progressStatus.textContent = '⚠️ ' + err.message;
    } finally {
      saveBtn.disabled = false;
      isCompressing = false;
    }
  });

  // Save Video Action
  saveBtn?.addEventListener('click', async () => {
    if (isCompressing) {
      alert('Video đang được nén, vui lòng đợi trong giây lát...');
      return;
    }

    const title = titleInput.value.trim() || currentTarget.partName;
    const duration = durationInput.value.trim() || '0:30';
    const badge = badgeInput.value.trim() || 'Video';

    if (activeTab === 'youtube') {
      const rawUrl = ytInput.value.trim();
      if (!rawUrl) {
        alert('Vui lòng dán link YouTube!');
        ytInput.focus();
        return;
      }
      const parsed = parseVideoUrl(rawUrl);
      const thumbnail = parsed.type === 'youtube'
        ? `https://i.ytimg.com/vi/${parsed.id}/hqdefault.jpg`
        : './images/atlas/med_skin.png';

      const videoData = {
        title,
        videoUrl: rawUrl,
        videoType: 'youtube',
        duration,
        badge,
        thumbnail
      };

      setPartVideo(currentTarget.partId, videoData);
      showToast(`✓ Đã gắn link YouTube cho ${currentTarget.partName}!`);
      currentTarget.onSaved?.(videoData);
      closeQuickVideoModal();

    } else {
      // Local MP4
      if (!selectedFile && !compressedResult) {
        alert('Vui lòng chọn file video từ máy!');
        return;
      }

      saveBtn.disabled = true;
      saveBtn.textContent = '💾 Đang lưu vào máy...';

      try {
        const blobToStore = compressedResult ? compressedResult.blob : selectedFile;
        const thumbnail = compressedResult?.thumbnail || '';
        const vidId = `local_vid_${Date.now()}`;

        await saveLocalVideo({
          id: vidId,
          partId: currentTarget.partId,
          title,
          blob: blobToStore,
          originalSize: selectedFile.size,
          duration,
          thumbnail
        });

        const blobUrl = await getLocalVideoBlobUrl(vidId);

        const videoData = {
          id: vidId,
          title,
          videoUrl: blobUrl,
          videoType: 'local_mp4',
          localVideoId: vidId,
          duration,
          badge: 'Video Máy',
          thumbnail: thumbnail || './images/atlas/med_skin.png'
        };

        setPartVideo(currentTarget.partId, videoData);
        showToast(`✓ Đã lưu và gắn video cho ${currentTarget.partName}!`);
        currentTarget.onSaved?.(videoData);
        closeQuickVideoModal();

      } catch (err) {
        console.error('[QuickVideoModal] Failed to save video:', err);
        alert('Lỗi lưu video vào bộ nhớ: ' + err.message);
      } finally {
        saveBtn.disabled = false;
        saveBtn.textContent = '💾 Lưu & Gắn Vào Bộ Phận';
      }
    }
  });
}
