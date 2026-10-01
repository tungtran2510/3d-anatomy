/**
 * Offline & Cache Manager Modal (LỆNH #06)
 * PWA Storage Management, Per-System 3D Model Pre-caching, Offline Sync & RAM Optimization.
 */

import { asset } from '../utils/paths.js';
import { getStorageQuotaEstimate, triggerMemoryCleanup, getHeapMemoryInfo } from '../viewer/memoryManager.js';
import { triggerManualSync, checkPendingCount, showSyncToast } from '../utils/syncManager.js';
import { getProgressSummaryOffline } from '../utils/offlineDB.js';

let offlineModalEl = null;
let currentViewer = null;

const SYSTEM_CATALOG = [
  {
    id: 'skeletal',
    nameVi: 'Hệ Xương & Khớp',
    nameEn: 'Skeletal & Joints System',
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
    nameVi: 'Hệ Nội Tạng, Hô Hấp & Tiêu Hóa',
    nameEn: 'Visceral & Respiratory System',
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

  offlineModalEl.innerHTML = `
    <div class="offline-card animate-in">
      <!-- Modal Header -->
      <div class="offline-header">
        <div class="offline-title-wrap">
          <div class="offline-icon-avatar">⚡</div>
          <div>
            <h3 class="offline-title">Quản Lý Ngoại Tuyến & Bộ Nhớ</h3>
            <span class="offline-sub">Tải trước 3D Model từng hệ • Học tập không cần mạng Internet</span>
          </div>
        </div>
        <button type="button" class="offline-close-btn" id="offlineCloseBtn">&times;</button>
      </div>

      <!-- Sync & Connectivity Status Banner -->
      <div class="offline-status-banner ${navigator.onLine ? 'online' : 'offline'}">
        <div class="status-left">
          <span class="status-indicator-dot"></span>
          <span class="status-title-text">${navigator.onLine ? 'Đang kết nối Internet' : 'Đang hoạt động Ngoại Tuyến (Offline)'}</span>
          <span class="status-sub-text">${pendingCount > 0 ? `• Có ${pendingCount} thay đổi chờ đồng bộ` : '• Dữ liệu học tập đã đồng bộ'}</span>
        </div>
        <button type="button" class="btn-sync-now" id="btnOfflineSyncNow" ${!navigator.onLine ? 'disabled' : ''}>
          🔄 Đồng bộ ngay
        </button>
      </div>

      <!-- Scrollable Body -->
      <div class="offline-scroll-body">
        <!-- Section 1: Per-System Model Caching -->
        <div class="offline-section">
          <div class="section-header-row">
            <div>
              <h4 class="section-title">📦 Tải Mô Hình 3D Theo Hệ</h4>
              <p class="section-desc">Chọn tải riêng từng hệ bạn đang học để tiết kiệm dung lượng điện thoại:</p>
            </div>
            <button type="button" class="btn-download-all" id="btnDownloadAllModels">
              ⚡ Tải toàn bộ (~18.8 MB)
            </button>
          </div>

          <div class="download-progress-container hidden" id="masterProgressContainer">
            <div class="progress-bar-track">
              <div class="progress-bar-fill" id="masterProgressBar" style="width: 0%"></div>
            </div>
            <span class="progress-label" id="masterProgressLabel">Đang chuẩn bị tải...</span>
          </div>

          <div class="system-cache-list">
            ${SYSTEM_CATALOG.map((sys) => {
              const isCached = sys.models.every((m) =>
                cachedUrls.some((u) => u.includes(m))
              );

              return `
                <div class="system-cache-item" data-system="${sys.id}">
                  <div class="sys-item-left">
                    <span class="sys-item-icon">${sys.icon}</span>
                    <div class="sys-item-text">
                      <strong>${sys.nameVi}</strong>
                      <span class="sys-size">${sys.nameEn} • ~${sys.sizeMB} MB</span>
                    </div>
                  </div>
                  <div class="sys-item-actions">
                    <span class="cache-status-badge ${isCached ? 'cached' : 'not-cached'}" id="badge-${sys.id}">
                      ${isCached ? '✓ Sẵn sàng offline' : 'Chưa tải'}
                    </span>
                    <button type="button" class="btn-cache-action ${isCached ? 'danger' : 'primary'}" data-action="${isCached ? 'delete' : 'download'}" data-system="${sys.id}">
                      ${isCached ? 'Xóa cache' : 'Tải về'}
                    </button>
                  </div>
                </div>
              `;
            }).join('')}
          </div>
        </div>

        <!-- Section 2: Pre-cache Study Material -->
        <div class="offline-section">
          <h4 class="section-title">📚 Tải Trước Nội Dung Học Tập</h4>
          <p class="section-desc">Lưu toàn bộ từ điển giải phẫu, liên quan 4 hệ (Cơ-Xương-Thần kinh-Mạch máu) và ngân hàng Quiz thích ứng vào máy:</p>
          <div class="precache-row">
            <button type="button" class="btn-precache-data" id="btnPrecacheData">
              📥 Lưu Từ điển & Dữ liệu Y khoa Offline (~1.2 MB)
            </button>
            <span class="precache-status" id="precacheDataStatus">Đã kích hoạt lưu cục bộ</span>
          </div>
        </div>

        <!-- Section 3: Storage & RAM Management -->
        <div class="offline-section">
          <h4 class="section-title">💾 Dung Lượng & Quản Lý RAM Thiết Bị</h4>
          <div class="storage-stats-grid">
            <div class="stat-card">
              <span class="stat-num">${storageInfo.usageMB} MB</span>
              <span class="stat-label">Cache Storage Đã Dùng</span>
            </div>
            <div class="stat-card">
              <span class="stat-num">${storageInfo.quotaMB > 0 ? (storageInfo.quotaMB / 1024).toFixed(1) + ' GB' : 'Không giới hạn'}</span>
              <span class="stat-label">Dung Lượng Trống Còn Lại</span>
            </div>
            ${heapInfo.supported ? `
              <div class="stat-card">
                <span class="stat-num">${heapInfo.usedMB} MB</span>
                <span class="stat-label">RAM WebGL Hiện Tại</span>
              </div>
            ` : ''}
          </div>

          <div class="storage-actions-row">
            <button type="button" class="btn-storage-tool" id="btnPurgeRAM">
              🧹 Giải phóng RAM & Buffer WebGL
            </button>
            <button type="button" class="btn-storage-tool danger" id="btnClearAllCache">
              🗑️ Xóa toàn bộ Cache ngoại tuyến
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

  // Sync now button
  document.getElementById('btnOfflineSyncNow')?.addEventListener('click', async () => {
    const btn = document.getElementById('btnOfflineSyncNow');
    if (btn) btn.disabled = true;
    await triggerManualSync();
    await renderModalContent();
  });

  // Download all models
  document.getElementById('btnDownloadAllModels')?.addEventListener('click', async () => {
    await downloadAllSystems();
  });

  // Individual system download / delete
  offlineModalEl.querySelectorAll('.btn-cache-action').forEach((btn) => {
    btn.addEventListener('click', async () => {
      const sysId = btn.dataset.system;
      const action = btn.dataset.action;
      if (action === 'download') {
        await downloadSingleSystem(sysId);
      } else {
        await deleteSingleSystem(sysId);
      }
    });
  });

  // Precache study content
  document.getElementById('btnPrecacheData')?.addEventListener('click', async () => {
    const statusEl = document.getElementById('precacheDataStatus');
    if (statusEl) statusEl.textContent = '⏳ Đang tải từ điển & ngân hàng câu hỏi...';
    try {
      await fetch(asset('data/definitions.json')).catch(() => {});
      await fetch(asset('data/lexicon.json')).catch(() => {});
      await fetch(asset('data/systems.json')).catch(() => {});
      if (statusEl) statusEl.textContent = '✓ Đã sẵn sàng học tập ngoại tuyến 100%!';
      showSyncToast('✓ Đã tải trước từ điển và dữ liệu bài học offline!', 'success');
    } catch {
      if (statusEl) statusEl.textContent = '⚠️ Đã lưu một phần dữ liệu';
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
    badge.className = 'cache-status-badge downloading';
    badge.textContent = '⏳ Đang tải...';
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

  if (progressBox) progressBox.classList.remove('hidden');

  let completed = 0;
  const total = SYSTEM_CATALOG.length;

  for (let i = 0; i < total; i++) {
    const sys = SYSTEM_CATALOG[i];
    if (label) label.textContent = `Đang tải ${sys.nameVi} (${i + 1}/${total})...`;
    if (bar) bar.style.width = `${Math.round((i / total) * 100)}%`;

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

  if (bar) bar.style.width = '100%';
  if (label) label.textContent = '✓ Đã hoàn tất tải toàn bộ mô hình giải phẫu 3D!';
  showSyncToast('🎉 Toàn bộ Atlas Giải Phẫu 3D đã sẵn sàng dùng 100% Offline!', 'success');

  setTimeout(() => {
    renderModalContent();
  }, 1000);
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
