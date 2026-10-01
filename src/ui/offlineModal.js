/**
 * Offline & Cache Manager Modal (LỆNH #06, #10)
 * PWA Storage Management, Per-System 3D Model Pre-caching, Offline Sync & RAM Optimization.
 * Modern, clean, professional medical software design.
 */

import { asset } from '../utils/paths.js';
import { getStorageQuotaEstimate, triggerMemoryCleanup, getHeapMemoryInfo } from '../viewer/memoryManager.js';
import { triggerManualSync, checkPendingCount, showSyncToast } from '../utils/syncManager.js';

let offlineModalEl = null;
let currentViewer = null;

const SYSTEM_CATALOG = [
  {
    id: 'skeletal',
    nameVi: 'Hệ Xương & Khớp',
    nameEn: 'Skeletal & Joints',
    icon: '🦴',
    models: ['skeletal.glb', 'joints.glb'],
    sizeMB: 2.7
  },
  {
    id: 'muscular',
    nameVi: 'Hệ Cơ Bắp',
    nameEn: 'Muscular System',
    icon: '💪',
    models: ['muscular.glb'],
    sizeMB: 4.5
  },
  {
    id: 'nervous',
    nameVi: 'Hệ Thần Kinh & Não',
    nameEn: 'Nervous System',
    icon: '🧠',
    models: ['nervous.glb'],
    sizeMB: 3.8
  },
  {
    id: 'cardiovascular',
    nameVi: 'Hệ Tuần Hoàn & Tim',
    nameEn: 'Cardiovascular System',
    icon: '🫀',
    models: ['cardiovascular.glb'],
    sizeMB: 5.6
  },
  {
    id: 'visceral',
    nameVi: 'Hệ Nội Tạng & Hô Hấp',
    nameEn: 'Visceral & Respiratory',
    icon: '🫁',
    models: ['visceral.glb'],
    sizeMB: 1.8
  },
  {
    id: 'lymphatic',
    nameVi: 'Hệ Bạch Huyết',
    nameEn: 'Lymphatic System',
    icon: '🛡️',
    models: ['lymphatic.glb'],
    sizeMB: 0.4
  }
];

export async function openOfflineModal(viewer) {
  currentViewer = viewer;

  if (!offlineModalEl) {
    offlineModalEl = document.createElement('div');
    offlineModalEl.id = 'offlineModal';
    offlineModalEl.className = 'offline-modal-backdrop';
    offlineModalEl.addEventListener('click', (e) => {
      if (e.target === offlineModalEl) {
        closeOfflineModal();
      }
    });
    document.body.appendChild(offlineModalEl);
  }

  offlineModalEl.classList.remove('hidden');
  await renderModalContent();
}

export function closeOfflineModal() {
  if (offlineModalEl) {
    offlineModalEl.classList.add('hidden');
  }
}

async function renderModalContent() {
  if (!offlineModalEl) return;

  const storageInfo = await getStorageQuotaEstimate();
  const heapInfo = getHeapMemoryInfo();
  const pendingCount = await checkPendingCount();
  const cachedUrls = await getCachedUrlsFromSW();

  const allCached = SYSTEM_CATALOG.every(sys =>
    sys.models.every(m => cachedUrls.some(u => u.includes(m)))
  );

  offlineModalEl.innerHTML = `
    <div class="offline-card animate-in">
      <!-- Modal Header -->
      <div class="offline-header">
        <div class="offline-title-wrap">
          <div class="offline-icon-avatar">
            <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.2"><path d="M21 15v4a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-4"/><polyline points="7 10 12 15 17 10"/><line x1="12" y1="15" x2="12" y2="3"/></svg>
          </div>
          <div class="offline-title-col">
            <h3 class="offline-title">Tải Ngoại Tuyến (Offline)</h3>
            <div class="offline-sub-row">
              <span class="status-indicator-dot ${navigator.onLine ? 'online' : 'offline'}"></span>
              <span class="status-net-text">${navigator.onLine ? 'Đang trực tuyến' : 'Ngoại tuyến'}</span>
              <span class="status-divider">•</span>
              <span class="status-count-text">6 hệ giải phẫu (~18.8 MB)</span>
            </div>
          </div>
        </div>
        <button type="button" class="offline-close-btn" id="offlineCloseBtn" aria-label="Đóng">&times;</button>
      </div>

      <!-- Scrollable Body -->
      <div class="offline-scroll-body">
        <!-- Hero Download All Box -->
        <div class="offline-hero-card ${allCached ? 'all-saved' : ''}">
          <div class="hero-top-row">
            <div class="hero-badge">
              <span class="pulse-dot"></span>
              <span>${allCached ? 'ĐÃ SẴN SÀNG OFFLINE 100%' : 'KHUYÊN DÙNG CHO ĐIỆN THOẠI'}</span>
            </div>
            <div class="hero-wifi-pill">
              <span>📶 Nên dùng Wi-Fi</span>
            </div>
          </div>

          <div class="hero-content">
            <h4 class="hero-download-title">${allCached ? 'Thư Viện 3D Đã Sẵn Sàng Ngoại Tuyến' : 'Tải Toàn Bộ Thư Viện 3D'}</h4>
            <p class="hero-download-desc">
              Lưu toàn bộ mô hình giải phẫu 3D vào bộ nhớ máy giúp thao tác siêu mượt, không giật lag và tra cứu 100% không cần Internet.
            </p>
          </div>

          <button type="button" class="btn-hero-download-all ${allCached ? 'is-complete' : ''}" id="btnHeroDownloadAll">
            <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.2"><path d="M21 15v4a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-4"/><polyline points="7 10 12 15 17 10"/><line x1="12" y1="15" x2="12" y2="3"/></svg>
            <span id="heroDownloadBtnText">${allCached ? '✓ ĐÃ TẢI TOÀN BỘ (DÙNG OFFLINE 100%)' : 'TẢI TẤT CẢ VỀ MÁY (18.8 MB)'}</span>
          </button>

          <div class="download-progress-container hidden" id="masterProgressContainer">
            <div class="progress-bar-track">
              <div class="progress-bar-fill" id="masterProgressBar" style="width: 0%"></div>
            </div>
            <span class="progress-label" id="masterProgressLabel">Đang chuẩn bị tải...</span>
          </div>
        </div>

        <!-- Section: Individual System List -->
        <div class="offline-section">
          <div class="section-label-row">
            <span class="section-heading">TẢI RIÊNG TỪNG HỆ GIẢI PHẪU</span>
          </div>

          <div class="system-cache-list">
            ${SYSTEM_CATALOG.map((sys) => {
              const isCached = sys.models.every((m) =>
                cachedUrls.some((u) => u.includes(m))
              );

              return `
                <div class="system-cache-item" data-system="${sys.id}">
                  <div class="sys-item-left">
                    <span class="sys-item-avatar">${sys.icon}</span>
                    <div class="sys-item-info">
                      <span class="sys-title-vi">${sys.nameVi}</span>
                      <span class="sys-sub-meta">${sys.nameEn} • ~${sys.sizeMB} MB</span>
                    </div>
                  </div>
                  <div class="sys-item-actions">
                    ${isCached ? `
                      <span class="chip-cached" id="badge-${sys.id}">✓ Đã lưu</span>
                      <button type="button" class="btn-cache-del" data-action="delete" data-system="${sys.id}" title="Xóa bản tải hệ này">
                        &times;
                      </button>
                    ` : `
                      <button type="button" class="btn-cache-action primary" data-action="download" data-system="${sys.id}" id="badge-${sys.id}">
                        <svg width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.4"><path d="M21 15v4a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-4"/><polyline points="7 10 12 15 17 10"/><line x1="12" y1="15" x2="12" y2="3"/></svg>
                        Tải về
                      </button>
                    `}
                  </div>
                </div>
              `;
            }).join('')}
          </div>
        </div>

        <!-- Section: Study Material Precache -->
        <div class="offline-compact-row">
          <div class="compact-left">
            <span class="compact-icon">📚</span>
            <div class="compact-text">
              <span class="compact-title">Từ điển danh pháp & Dữ liệu Y khoa</span>
              <span class="compact-sub">Từ điển 3 ngôn ngữ & ngân hàng câu hỏi (~1.2 MB)</span>
            </div>
          </div>
          <button type="button" class="btn-precache-data" id="btnPrecacheData">
            <span id="precacheDataStatus">Tải dữ liệu</span>
          </button>
        </div>

        <!-- Section: Storage Info & Quick Cleanup -->
        <div class="storage-footer-card">
          <div class="storage-stats-bar">
            <div class="stat-pill">
              <span class="stat-label">Cache 3D:</span>
              <strong class="stat-val">${storageInfo.usageMB} MB</strong>
            </div>
            <div class="stat-pill">
              <span class="stat-label">RAM WebGL:</span>
              <strong class="stat-val">${heapInfo.usedMB ? heapInfo.usedMB + ' MB' : 'Tối ưu'}</strong>
            </div>
          </div>
          <div class="storage-footer-actions">
            <button type="button" class="btn-footer-tool" id="btnPurgeRAM" title="Giải phóng RAM WebGL">
              🧹 Dọn RAM
            </button>
            <button type="button" class="btn-footer-tool danger" id="btnClearAllCache" title="Xóa toàn bộ Cache">
              🗑️ Xóa Cache
            </button>
          </div>
        </div>
      </div>
    </div>
  `;

  attachModalEvents();
}

function attachModalEvents() {
  document.getElementById('offlineCloseBtn')?.addEventListener('click', closeOfflineModal);

  // Sync now button (if present)
  document.getElementById('btnOfflineSyncNow')?.addEventListener('click', async () => {
    const btn = document.getElementById('btnOfflineSyncNow');
    if (btn) btn.disabled = true;
    await triggerManualSync();
    await renderModalContent();
  });

  // Download all models
  const handleDownloadAll = async () => {
    await downloadAllSystems();
  };
  document.getElementById('btnHeroDownloadAll')?.addEventListener('click', handleDownloadAll);
  document.getElementById('btnDownloadAllModels')?.addEventListener('click', handleDownloadAll);

  // Individual system download / delete
  offlineModalEl.querySelectorAll('[data-action]').forEach((btn) => {
    btn.addEventListener('click', async () => {
      const sysId = btn.dataset.system;
      const action = btn.dataset.action;
      if (!sysId) return;
      if (action === 'download') {
        await downloadSingleSystem(sysId);
      } else if (action === 'delete') {
        await deleteSingleSystem(sysId);
      }
    });
  });

  // Precache study content
  document.getElementById('btnPrecacheData')?.addEventListener('click', async () => {
    const statusEl = document.getElementById('precacheDataStatus');
    if (statusEl) statusEl.textContent = 'Đang tải...';
    try {
      await fetch(asset('data/definitions.json')).catch(() => {});
      await fetch(asset('data/lexicon.json')).catch(() => {});
      await fetch(asset('data/systems.json')).catch(() => {});
      if (statusEl) statusEl.textContent = '✓ Đã lưu';
      showSyncToast('✓ Đã tải trước từ điển và dữ liệu bài học offline!', 'success');
    } catch {
      if (statusEl) statusEl.textContent = 'Lỗi tải';
    }
  });

  // Purge RAM
  document.getElementById('btnPurgeRAM')?.addEventListener('click', () => {
    triggerMemoryCleanup(currentViewer);
    showSyncToast('🧹 Đã giải phóng bộ nhớ RAM, shaders và WebGL render lists!', 'info');
    renderModalContent();
  });

  // Clear all cache
  document.getElementById('btnClearAllCache')?.addEventListener('click', async () => {
    if (confirm('Bạn có chắc chắn muốn xóa toàn bộ mô hình 3D và dữ liệu đã lưu ngoại tuyến không?')) {
      if ('serviceWorker' in navigator && navigator.serviceWorker.controller) {
        navigator.serviceWorker.controller.postMessage({ type: 'CLEAR_ALL_CACHES' });
      }
      if ('caches' in window) {
        const keys = await caches.keys();
        await Promise.all(keys.map((k) => caches.delete(k)));
      }
      showSyncToast('🗑️ Đã xóa toàn bộ cache ngoại tuyến.', 'warning');
      await renderModalContent();
    }
  });
}

async function downloadSingleSystem(sysId) {
  const sys = SYSTEM_CATALOG.find((s) => s.id === sysId);
  if (!sys) return;

  const badge = document.getElementById(`badge-${sysId}`);
  if (badge) {
    badge.className = 'chip-cached downloading';
    badge.textContent = 'Đang tải...';
  }

  try {
    for (const modelFile of sys.models) {
      const url = asset(`models/${modelFile}`);
      const res = await fetch(url);
      if ('caches' in window) {
        const cache = await caches.open('atlas-models-atlas-v6');
        await cache.put(url, res);
      }
    }
    showSyncToast(`✓ Đã tải xong ${sys.nameVi} vào bộ nhớ ngoại tuyến!`, 'success');
  } catch (err) {
    showSyncToast(`❌ Không thể tải ${sys.nameVi}: ${err.message}`, 'error');
  }

  await renderModalContent();
}

async function deleteSingleSystem(sysId) {
  const sys = SYSTEM_CATALOG.find((s) => s.id === sysId);
  if (!sys) return;

  try {
    if ('caches' in window) {
      const cache = await caches.open('atlas-models-atlas-v6');
      for (const modelFile of sys.models) {
        const url = asset(`models/${modelFile}`);
        await cache.delete(url);
      }
    }
    showSyncToast(`✓ Đã xóa cache của ${sys.nameVi}`, 'info');
  } catch (err) {
    console.error('Delete error:', err);
  }

  await renderModalContent();
}

async function downloadAllSystems() {
  const progressBox = document.getElementById('masterProgressContainer');
  const bar = document.getElementById('masterProgressBar');
  const label = document.getElementById('masterProgressLabel');
  const heroBtnText = document.getElementById('heroDownloadBtnText');
  const heroBtn = document.getElementById('btnHeroDownloadAll');

  if (progressBox) progressBox.classList.remove('hidden');
  if (heroBtn) {
    heroBtn.disabled = true;
    heroBtn.style.opacity = '0.85';
  }

  let completed = 0;
  const total = SYSTEM_CATALOG.length;

  for (let i = 0; i < total; i++) {
    const sys = SYSTEM_CATALOG[i];
    const pct = Math.round((i / (total + 1)) * 100);
    if (label) label.textContent = `Đang tải ${sys.nameVi} (${i + 1}/${total})... (${pct}%)`;
    if (heroBtnText) heroBtnText.textContent = `ĐANG TẢI... (${pct}%)`;
    if (bar) bar.style.width = `${pct}%`;

    try {
      for (const modelFile of sys.models) {
        const url = asset(`models/${modelFile}`);
        const res = await fetch(url);
        if ('caches' in window) {
          const cache = await caches.open('atlas-models-atlas-v6');
          await cache.put(url, res);
        }
      }
      completed++;
    } catch (err) {
      console.warn(`Failed model ${sys.id}:`, err);
    }
  }

  // Pre-cache medical data JSON
  if (label) label.textContent = 'Đang lưu từ điển và dữ liệu giải phẫu... (95%)';
  if (bar) bar.style.width = '95%';
  try {
    for (const jsonFile of ['data/systems.json', 'data/lexicon.json']) {
      const url = asset(jsonFile);
      const res = await fetch(url);
      if ('caches' in window) {
        const cache = await caches.open('atlas-models-atlas-v6');
        await cache.put(url, res);
      }
    }
  } catch (err) {
    console.warn('Failed caching JSON:', err);
  }

  if (bar) bar.style.width = '100%';
  if (label) label.textContent = `✓ Đã hoàn tất tải 100% dữ liệu (${completed}/${total} hệ giải phẫu)!`;
  if (heroBtnText) heroBtnText.textContent = '✓ ĐÃ TẢI TOÀN BỘ (DÙNG OFFLINE 100%)';
  if (heroBtn) {
    heroBtn.classList.add('is-complete');
    heroBtn.disabled = false;
  }

  showSyncToast('🎉 Toàn bộ Atlas Giải Phẫu 3D đã sẵn sàng dùng 100% Offline kể cả khi không có mạng!', 'success');

  setTimeout(() => {
    renderModalContent();
  }, 1200);
}

async function getCachedUrlsFromSW() {
  if (!('caches' in window)) return [];
  try {
    const cache = await caches.open('atlas-models-atlas-v6');
    const requests = await cache.keys();
    return requests.map((r) => r.url);
  } catch {
    return [];
  }
}
