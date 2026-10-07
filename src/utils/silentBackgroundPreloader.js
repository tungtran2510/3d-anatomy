/**
 * Silent Background Preloader (Nạp Ngầm Thông Minh Khi Có Wi-Fi)
 * Tự động tải dần và lưu trữ toàn bộ mô hình 3D vào bộ nhớ đệm (CacheStorage & Service Worker)
 * Hoàn toàn chạy ngầm, không làm phiền người dùng, không giật lag và tự dừng khi dùng mạng di động tiết kiệm dữ liệu.
 */

import { asset } from './paths.js';
import { SYSTEM_CATALOG, getActiveModelsCache } from '../ui/offlineModal.js';

let isPreloading = false;
let isStarted = false;

/**
 * Kiểm tra kết nối mạng có đủ điều kiện nạp ngầm không
 * Ưu tiên: Wi-Fi hoặc 4G tốc độ cao, tuyệt đối không tải nếu người dùng bật chế độ Tiết kiệm dữ liệu (saveData)
 */
function isNetworkEligibleForSilentSync() {
  if (typeof navigator === 'undefined' || !navigator.onLine) return false;

  const conn = navigator.connection || navigator.mozConnection || navigator.webkitConnection;
  if (!conn) {
    // Không có Network API (Desktop Safari/Firefox): Cho phép tải ngầm với độ ưu tiên thấp
    return true;
  }

  // 1. Nếu người dùng bật chế độ tiết kiệm 3G/4G: TUYỆT ĐỐI KHÔNG TẢI NGẦM
  if (conn.saveData) {
    console.log('[SilentPreloader] Chế độ Tiết kiệm dữ liệu (Save Data) đang bật. Bỏ qua nạp ngầm.');
    return false;
  }

  // 2. Nếu là mạng 2G / 3G yếu: Không tải để tránh lag kết nối
  if (conn.effectiveType === '2g' || conn.effectiveType === 'slow-2g') {
    return false;
  }

  // 3. Nếu là Wi-Fi hoặc mạng 4G/Ethernet không giới hạn: Cho phép nạp ngầm
  return true;
}

/**
 * Xin quyền lưu trữ vĩnh viễn (Persistent Storage) để hệ điều hành điện thoại
 * không tự ý xóa bộ nhớ đệm khi máy đầy dung lượng tạm.
 */
async function requestPersistentStorage() {
  if (typeof navigator !== 'undefined' && navigator.storage && navigator.storage.persist) {
    try {
      const isPersisted = await navigator.storage.persisted();
      if (!isPersisted) {
        await navigator.storage.persist();
      }
    } catch {
      // Bỏ qua lỗi nếu trình duyệt không hỗ trợ
    }
  }
}

/**
 * Tải ngầm từng file mô hình 3D một cách êm ái
 */
async function runSilentDownloadQueue() {
  if (isPreloading || !isNetworkEligibleForSilentSync()) return;
  isPreloading = true;

  try {
    await requestPersistentStorage();
    const cache = await getActiveModelsCache();
    if (!cache) {
      isPreloading = false;
      return;
    }

    // Thứ tự ưu tiên tải ngầm: Xương -> Nội tạng -> Thần kinh -> Tuần hoàn -> Cơ -> Da -> Bạch huyết
    const priorityOrder = ['skeletal', 'visceral', 'nervous', 'cardiovascular', 'muscular', 'integumentary', 'lymphatic'];
    const sortedCatalog = [...SYSTEM_CATALOG].sort((a, b) => {
      const idxA = priorityOrder.indexOf(a.id);
      const idxB = priorityOrder.indexOf(b.id);
      return (idxA !== -1 ? idxA : 99) - (idxB !== -1 ? idxB : 99);
    });

    for (const sys of sortedCatalog) {
      // Kiểm tra lại điều kiện mạng giữa mỗi file
      if (!isNetworkEligibleForSilentSync()) {
        console.log('[SilentPreloader] Mạng thay đổi hoặc mất kết nối. Tạm dừng nạp ngầm.');
        break;
      }

      for (const modelFile of sys.models) {
        const url = asset(`models/${modelFile}`);

        // Kiểm tra xem file đã có trong bộ nhớ đệm chưa
        const match = await cache.match(url);
        if (match) {
          // Đã có sẵn -> Bỏ qua ngay không tốn băng thông
          continue;
        }

        // Tải file với mức ưu tiên thấp nhất để nhường đường cho thao tác người dùng
        try {
          // Nghỉ 2.5 giây giữa các lượt tải để CPU/GPU luôn ở trạng thái nghỉ 60fps
          await new Promise((r) => setTimeout(r, 2500));

          const res = await fetch(url, {
            cache: 'reload',
            priority: 'low'
          });

          if (res.ok) {
            await cache.put(url, res.clone());
            console.log(`[SilentPreloader] Đã nạp ngầm thành công: ${modelFile} (~${sys.sizeMB} MB)`);
            window.dispatchEvent(new CustomEvent('atlas-cache-updated', { detail: { systemId: sys.id } }));
          }
        } catch (fetchErr) {
          console.warn(`[SilentPreloader] Bỏ qua ${modelFile}:`, fetchErr.message);
        }
      }
    }
  } catch (err) {
    console.warn('[SilentPreloader] Lỗi nạp ngầm:', err);
  } finally {
    isPreloading = false;
  }
}

/**
 * Khởi động bộ nạp ngầm thông minh sau khi ứng dụng chính đã tải xong và ổn định
 */
export function initSilentBackgroundPreloader() {
  if (isStarted || typeof window === 'undefined') return;
  isStarted = true;

  // Lắng nghe mạng phục hồi hoặc chuyển sang Wi-Fi
  window.addEventListener('online', () => {
    setTimeout(runSilentDownloadQueue, 4000);
  });

  const conn = navigator.connection || navigator.mozConnection || navigator.webkitConnection;
  if (conn) {
    conn.addEventListener('change', () => {
      if (isNetworkEligibleForSilentSync()) {
        setTimeout(runSilentDownloadQueue, 3000);
      }
    });
  }

  // Khởi chạy ngầm sau 6 giây kể từ khi mở app (khi người dùng đã bắt đầu tương tác ổn định)
  const scheduleInitialPreload = () => {
    if ('requestIdleCallback' in window) {
      window.requestIdleCallback(() => runSilentDownloadQueue(), { timeout: 10000 });
    } else {
      setTimeout(runSilentDownloadQueue, 6000);
    }
  };

  if (document.readyState === 'complete') {
    setTimeout(scheduleInitialPreload, 5000);
  } else {
    window.addEventListener('load', () => {
      setTimeout(scheduleInitialPreload, 5000);
    });
  }
}
