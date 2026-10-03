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

export const MODELS_CACHE_NAME = 'atlas-models-atlas-v1.0.0';

export async function getActiveModelsCache() {
  if (typeof window === 'undefined' || !('caches' in window)) return null;
  try {
    const keys = await caches.keys();
    const found = keys.find(k => k.startsWith('atlas-models'));
    return await caches.open(found || MODELS_CACHE_NAME);
  } catch (err) {
    console.warn('[OfflineModal] Cannot open cache:', err);
    return null;
  }
}

export const SYSTEM_CATALOG = [
  {
    id: 'skeletal',
    nameVi: 'Hệ Xương & Khớp',
    nameEn: 'Xương & Khớp',
    icon: '🦴',
    models: ['skeletal.glb', 'joints.glb'],
    sizeMB: 2.7
  },
  {
    id: 'muscular',
    nameVi: 'Hệ Cơ Bắp',
    nameEn: 'Hệ Cơ bắp',
    icon: '💪',
    models: ['muscular.glb'],
    sizeMB: 4.5
  },
  {
    id: 'nervous',
    nameVi: 'Hệ Thần Kinh & Não',
    nameEn: 'Não & Thần kinh',
    icon: '🧠',
    models: ['nervous.glb'],
    sizeMB: 3.8
  },
  {
    id: 'cardiovascular',
    nameVi: 'Hệ Tuần Hoàn & Tim',
    nameEn: 'Tuần hoàn & Tim',
    icon: '🫀',
    models: ['cardiovascular.glb'],
    sizeMB: 5.6
  },
  {
    id: 'visceral',
    nameVi: 'Hệ Nội Tạng & Hô Hấp',
    nameEn: 'Nội tạng & Phổi',
    icon: '🫁',
    models: ['visceral.glb'],
    sizeMB: 1.8
  },
  {
    id: 'lymphatic',
    nameVi: 'Hệ Bạch Huyết',
    nameEn: 'Bạch huyết',
    icon: '🛡️',
    models: ['lymphatic.glb'],
    sizeMB: 0.4
  },
  {
    id: 'integumentary',
    nameVi: 'Hệ Da (Lớp Da Người)',
    nameEn: 'Lớp Da người',
    icon: '👤',
    models: ['integumentary.glb'],
    sizeMB: 1.1
  }
];

export async function openOfflineModal(viewer, targetSystemId = null) {
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
  await renderModalContent(targetSystemId);
}

export function closeOfflineModal() {
  if (offlineModalEl) {
    offlineModalEl.classList.add('hidden');
  }
}

async function renderModalContent(targetSystemId = null) {
  if (!offlineModalEl) return;

  const storageInfo = await getStorageQuotaEstimate();
  const heapInfo = getHeapMemoryInfo();
  const pendingCount = await checkPendingCount();
  const cachedUrls = await getCachedUrlsFromSW();
  const totalSystemsCount = SYSTEM_CATALOG.length;
  const totalSizeMB = SYSTEM_CATALOG.reduce((acc, s) => acc + (s.sizeMB || 0), 0).toFixed(1);

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
              <span class="status-net-text">${navigator.onLine ? 'Trực tuyến' : 'Ngoại tuyến'}</span>
              <span class="status-divider">•</span>
              <span class="status-count-text">${totalSystemsCount} hệ (${totalSizeMB} MB)</span>
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
              <span>${allCached ? 'ĐÃ LƯU OFFLINE 100%' : 'KHUYÊN DÙNG'}</span>
            </div>
            <div class="hero-wifi-pill">
              <span>📶 Khuyên dùng Wi-Fi</span>
            </div>
          </div>

          <div class="hero-content">
            <h4 class="hero-download-title">${allCached ? 'Thư Viện 3D Đã Sẵn Sàng Ngoại Tuyến' : 'Tải Toàn Bộ Thư Viện 3D'}</h4>
            <p class="hero-download-desc">Lưu toàn bộ mô hình vào bộ nhớ máy giúp thao tác siêu mượt và tra cứu 100% không cần Internet.</p>
          </div>

          <button type="button" class="btn-hero-download-all ${allCached ? 'is-complete' : ''}" id="btnHeroDownloadAll" title="Bấm để tải về máy toàn bộ dữ liệu 3D">
            <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.2"><path d="M21 15v4a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-4"/><polyline points="7 10 12 15 17 10"/><line x1="12" y1="15" x2="12" y2="3"/></svg>
            <span id="heroDownloadBtnText">${allCached ? '✓ ĐÃ LƯU VỀ MÁY (Bấm để tải lại / cập nhật)' : `TẢI TẤT CẢ VỀ MÁY (${totalSizeMB} MB)`}</span>
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

  if (targetSystemId) {
    const baseMap = {
      skeletal: 'skeletal',
      joints: 'skeletal',
      muscular: 'muscular',
      nervous: 'nervous',
      cardiovascular: 'cardiovascular',
      arterial: 'cardiovascular',
      venous: 'cardiovascular',
      visceral: 'visceral',
      respiratory: 'visceral',
      digestive: 'visceral',
      urinary_genital: 'visceral',
      endocrine: 'visceral',
      lymphatic: 'lymphatic'
    };
    const resolvedId = baseMap[targetSystemId] || targetSystemId;
    const item = offlineModalEl.querySelector(`.system-cache-item[data-system="${resolvedId}"]`);
    if (item) {
      setTimeout(() => {
        item.scrollIntoView({ behavior: 'smooth', block: 'nearest' });
        item.classList.add('highlight-target-pulse');
        setTimeout(() => item.classList.remove('highlight-target-pulse'), 3500);
      }, 100);
    }
  }
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
    showSyncToast('🚀 Bắt đầu lưu toàn bộ dữ liệu 3D vào máy...', 'info');
    await downloadAllSystems();
  };
  offlineModalEl.querySelector('#btnHeroDownloadAll')?.addEventListener('click', handleDownloadAll);
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
    const cache = await getActiveModelsCache();
    for (const modelFile of sys.models) {
      const url = asset(`models/${modelFile}`);
      const res = await fetch(url, { cache: 'reload' });
      if (res.ok && cache) {
        await cache.put(url, res.clone());
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
    const cache = await getActiveModelsCache();
    if (cache) {
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
  const cache = await getActiveModelsCache();

  for (let i = 0; i < total; i++) {
    const sys = SYSTEM_CATALOG[i];
    const pct = Math.round(((i + 1) / (total + 1)) * 100);
    if (label) label.textContent = `Đang tải ${sys.nameVi} (${i + 1}/${total})... (${pct}%)`;
    if (heroBtnText) heroBtnText.textContent = `ĐANG TẢI... (${pct}%)`;
    if (bar) bar.style.width = `${pct}%`;

    try {
      for (const modelFile of sys.models) {
        const url = asset(`models/${modelFile}`);
        const res = await fetch(url, { cache: 'reload' });
        if (res.ok && cache) {
          await cache.put(url, res.clone());
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
      const res = await fetch(url, { cache: 'reload' });
      if (res.ok && cache) {
        await cache.put(url, res.clone());
      }
    }
  } catch (err) {
    console.warn('Failed caching JSON:', err);
  }

  if (bar) bar.style.width = '100%';
  if (label) label.textContent = `✓ Đã hoàn tất tải 100% (${completed}/${total} hệ giải phẫu)!`;
  if (heroBtnText) heroBtnText.textContent = '✓ ĐÃ TẢI TOÀN BỘ (DÙNG OFFLINE 100%)';
  if (heroBtn) {
    heroBtn.classList.add('is-complete');
    heroBtn.disabled = false;
  }

  localStorage.setItem('offline_all_cached', '1');
  showSyncToast('🎉 Toàn bộ Atlas Giải Phẫu 3D đã sẵn sàng dùng 100% Offline kể cả khi không có mạng!', 'success');

  setTimeout(() => {
    renderModalContent();
  }, 1200);
}

export async function getCachedUrlsFromSW() {
  if (!('caches' in window)) return [];
  try {
    const cacheNames = await caches.keys();
    const urls = [];
    for (const name of cacheNames) {
      if (name.includes('models') || name.includes('atlas') || name.includes('static')) {
        const cache = await caches.open(name);
        const requests = await cache.keys();
        requests.forEach(r => urls.push(r.url));
      }
    }
    return urls;
  } catch {
    return [];
  }
}

export async function isSystemCached(systemId) {
  if (typeof window === 'undefined' || !('caches' in window)) return false;
  if (localStorage.getItem('offline_all_cached') === '1') return true;

  try {
    const cachedUrls = await getCachedUrlsFromSW();
    const baseMap = {
      skeletal: 'skeletal',
      joints: 'skeletal',
      muscular: 'muscular',
      nervous: 'nervous',
      cardiovascular: 'cardiovascular',
      arterial: 'cardiovascular',
      venous: 'cardiovascular',
      visceral: 'visceral',
      respiratory: 'visceral',
      digestive: 'visceral',
      urinary_genital: 'visceral',
      endocrine: 'visceral',
      lymphatic: 'lymphatic'
    };

    const targetBase = baseMap[systemId] || systemId;
    const catEntry = SYSTEM_CATALOG.find(s => s.id === targetBase);
    if (!catEntry) return false;

    return catEntry.models.every(m => cachedUrls.some(u => u.includes(m)));
  } catch (err) {
    return false;
  }
}
