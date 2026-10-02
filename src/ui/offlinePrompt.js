/**
 * Offline Download Suggestion Banner (LỆNH #10)
 * Politely prompts the user to download 3D models into browser cache
 * when they activate heavy systems (Cơ bắp, Động mạch, Tĩnh mạch, Não thần kinh, Nội tạng...)
 * for 100% offline usage, lightning-fast rendering, and zero stutter/lag.
 */

import { openOfflineModal, isSystemCached } from './offlineModal.js';

let promptBannerEl = null;
let autoDismissTimer = null;
let currentViewer = null;

// Human-friendly mapping for system notification
const SYSTEM_INFO_MAP = {
  muscular: {
    nameVi: 'Hệ Cơ Bắp',
    icon: '💪',
    sizeMB: '4.5',
    baseSystem: 'muscular',
    tip: 'Chứa hàng trăm bó cơ vận động chi tiết'
  },
  arterial: {
    nameVi: 'Tim & Hệ Động Mạch',
    icon: '🫀',
    sizeMB: '5.6',
    baseSystem: 'cardiovascular',
    tip: 'Mạng lưới vi mạch & tuần hoàn chuyên sâu'
  },
  venous: {
    nameVi: 'Hệ Tĩnh Mạch',
    icon: '🫀',
    sizeMB: '5.6',
    baseSystem: 'cardiovascular',
    tip: 'Mạng lưới tĩnh mạch ngoại vi & trung tâm'
  },
  cardiovascular: {
    nameVi: 'Hệ Tim Mạch & Mạch Máu',
    icon: '🫀',
    sizeMB: '5.6',
    baseSystem: 'cardiovascular',
    tip: 'Toàn bộ tim và hệ thống mạch máu'
  },
  nervous: {
    nameVi: 'Não & Hệ Thần Kinh',
    icon: '🧠',
    sizeMB: '3.8',
    baseSystem: 'nervous',
    tip: 'Chi tiết não bộ & dây thần kinh sọ/gai'
  },
  respiratory: {
    nameVi: 'Hệ Hô Hấp (Phổi)',
    icon: '🫁',
    sizeMB: '1.8',
    baseSystem: 'visceral',
    tip: 'Cây khí phế quản & nhu mô phổi'
  },
  digestive: {
    nameVi: 'Hệ Tiêu Hóa (Gan, Ruột)',
    icon: '🫁',
    sizeMB: '1.8',
    baseSystem: 'visceral',
    tip: 'Ống tiêu hóa & các tuyến tiêu hóa'
  },
  urinary_genital: {
    nameVi: 'Hệ Tiết Niệu & Sinh Dục',
    icon: '🫁',
    sizeMB: '1.8',
    baseSystem: 'visceral',
    tip: 'Thận, bàng quang & cơ quan sinh dục'
  },
  endocrine: {
    nameVi: 'Hệ Nội Tiết',
    icon: '🔬',
    sizeMB: '1.8',
    baseSystem: 'visceral',
    tip: 'Hệ thống các tuyến nội tiết'
  },
  visceral: {
    nameVi: 'Hệ Nội Tạng',
    icon: '🫁',
    sizeMB: '1.8',
    baseSystem: 'visceral',
    tip: 'Toàn bộ cơ quan nội tạng'
  },
  lymphatic: {
    nameVi: 'Hệ Bạch Huyết',
    icon: '🛡️',
    sizeMB: '0.4',
    baseSystem: 'lymphatic',
    tip: 'Hạch & mạng lưới bạch huyết'
  },
  joints: {
    nameVi: 'Khớp & Dây Chằng',
    icon: '🦴',
    sizeMB: '1.0',
    baseSystem: 'skeletal',
    tip: 'Toàn bộ bao khớp & dây chằng'
  },
  integumentary: {
    nameVi: 'Hệ Da (Lớp Da Người)',
    icon: '👤',
    sizeMB: '1.1',
    baseSystem: 'integumentary',
    tip: 'Lớp da người toàn thân chân thực'
  }
};

export function initOfflinePrompt(viewer) {
  if (typeof window === 'undefined') return;
  currentViewer = viewer;

  // Gentle initial prompt after 4.5s on first visit if not dismissed
  const isDismissed = localStorage.getItem('offline_prompt_dismissed') === '1';
  if (!isDismissed) {
    setTimeout(async () => {
      const allCached = localStorage.getItem('offline_all_cached') === '1';
      if (!allCached && !document.getElementById('offlinePromptBanner')) {
        showGeneralOfflinePrompt(viewer);
      }
    }, 4500);
  }
}

/**
 * Triggered when user opens / increments / toggles a system (Cơ, Động mạch, Tĩnh mạch...)
 */
export async function suggestOfflineForSystem(systemId, systemNameVi, viewer) {
  if (typeof window === 'undefined') return;
  const v = viewer || currentViewer || (typeof window !== 'undefined' ? window.viewer : null);

  // 1. If system already cached offline in browser, NO prompt needed
  const cached = await isSystemCached(systemId);
  if (cached) {
    return;
  }

  // 2. Cooldown check:
  // Don't nag if dismissed for this specific system in this session
  const dismissedForSystem = sessionStorage.getItem(`offline_dismissed_${systemId}`) === '1';
  if (dismissedForSystem) {
    return;
  }

  // Don't re-show if any prompt was dismissed in the last 15 seconds
  const lastGlobalDismiss = Number(sessionStorage.getItem('offline_dismissed_global_ts') || 0);
  if (Date.now() - lastGlobalDismiss < 15000) {
    return;
  }

  const sysInfo = SYSTEM_INFO_MAP[systemId] || {
    nameVi: systemNameVi || systemId,
    icon: '⚡',
    sizeMB: '4-5',
    baseSystem: systemId,
    tip: 'Mô hình 3D độ phân giải cao'
  };

  showSpecificSystemPrompt(sysInfo, systemId, v);
}

function showSpecificSystemPrompt(sysInfo, systemId, viewer) {
  clearTimeout(autoDismissTimer);

  let banner = document.getElementById('offlinePromptBanner');
  if (!banner) {
    banner = document.createElement('div');
    banner.id = 'offlinePromptBanner';
    banner.className = 'offline-prompt-banner animate-in';
    document.body.appendChild(banner);
  } else {
    banner.classList.remove('fade-out');
    banner.classList.add('animate-in');
  }

  banner.innerHTML = `
    <button type="button" class="btn-prompt-close" id="btnPromptCloseTop" title="Đóng">&times;</button>
    <div class="prompt-main">
      <div class="prompt-icon-badge">${sysInfo.icon}</div>
      <div class="prompt-content">
        <strong class="prompt-headline">Gợi ý: Tải ${sysInfo.nameVi} về máy để dùng siêu mượt?</strong>
        <span class="prompt-subline">${sysInfo.nameVi} (~${sysInfo.sizeMB} MB, ${sysInfo.tip}). Tải offline về máy giúp xoay bóc tách 60fps mượt mà, không giật lag & không tốn 4G/Wi-Fi.</span>
      </div>
    </div>
    <div class="prompt-actions">
      <button type="button" class="btn-prompt-primary" id="btnPromptDownloadTarget">
        <svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5"><path d="M21 15v4a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-4"/><polyline points="7 10 12 15 17 10"/><line x1="12" y1="15" x2="12" y2="3"/></svg>
        Tải về máy ngay
      </button>
      <button type="button" class="btn-prompt-dismiss" id="btnPromptDismissSpecific" title="Để sau">Để sau</button>
    </div>
  `;

  // Bind actions
  const btnDownload = banner.querySelector('#btnPromptDownloadTarget');
  const btnDismiss = banner.querySelector('#btnPromptDismissSpecific');
  const btnCloseTop = banner.querySelector('#btnPromptCloseTop');

  const onDismiss = () => {
    sessionStorage.setItem(`offline_dismissed_${systemId}`, '1');
    sessionStorage.setItem('offline_dismissed_global_ts', Date.now().toString());
    dismissOfflinePrompt();
  };

  btnDownload?.addEventListener('click', () => {
    dismissOfflinePrompt();
    openOfflineModal(viewer, sysInfo.baseSystem);
  });

  btnDismiss?.addEventListener('click', onDismiss);
  btnCloseTop?.addEventListener('click', onDismiss);

  // Auto-dismiss after 20s if untouched
  autoDismissTimer = setTimeout(() => {
    dismissOfflinePrompt();
  }, 20000);

  // Pause auto-dismiss on mouse hover
  banner.onmouseenter = () => clearTimeout(autoDismissTimer);
  banner.onmouseleave = () => {
    clearTimeout(autoDismissTimer);
    autoDismissTimer = setTimeout(dismissOfflinePrompt, 5000);
  };
}

export function showGeneralOfflinePrompt(viewer) {
  clearTimeout(autoDismissTimer);

  let banner = document.getElementById('offlinePromptBanner');
  if (!banner) {
    banner = document.createElement('div');
    banner.id = 'offlinePromptBanner';
    banner.className = 'offline-prompt-banner animate-in';
    document.body.appendChild(banner);
  }

  banner.innerHTML = `
    <button type="button" class="btn-prompt-close" id="btnPromptCloseTop" title="Đóng">&times;</button>
    <div class="prompt-main">
      <div class="prompt-icon-badge">⚡</div>
      <div class="prompt-content">
        <strong class="prompt-headline">Tải về máy để xem siêu mượt & chạy Offline 100%?</strong>
        <span class="prompt-subline">Lưu mô hình 3D vào bộ nhớ máy giúp lướt cực nhanh, triệt tiêu giật lag. Khuyên dùng Wi-Fi khi tải!</span>
      </div>
    </div>
    <div class="prompt-actions">
      <button type="button" class="btn-prompt-primary" id="btnPromptDownloadAll">
        <svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5"><path d="M21 15v4a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-4"/><polyline points="7 10 12 15 17 10"/><line x1="12" y1="15" x2="12" y2="3"/></svg>
        Tải về máy ngay
      </button>
      <button type="button" class="btn-prompt-dismiss" id="btnPromptDismiss" title="Để sau">Để sau</button>
    </div>
  `;

  const btnDownload = banner.querySelector('#btnPromptDownloadAll');
  const btnDismiss = banner.querySelector('#btnPromptDismiss');
  const btnCloseTop = banner.querySelector('#btnPromptCloseTop');

  const onDismiss = () => {
    localStorage.setItem('offline_prompt_dismissed', '1');
    sessionStorage.setItem('offline_dismissed_global_ts', Date.now().toString());
    dismissOfflinePrompt();
  };

  btnDownload?.addEventListener('click', () => {
    localStorage.setItem('offline_prompt_dismissed', '1');
    dismissOfflinePrompt();
    openOfflineModal(viewer);
  });

  btnDismiss?.addEventListener('click', onDismiss);
  btnCloseTop?.addEventListener('click', onDismiss);

  autoDismissTimer = setTimeout(() => {
    dismissOfflinePrompt();
  }, 10000);

  banner.onmouseenter = () => clearTimeout(autoDismissTimer);
  banner.onmouseleave = () => {
    clearTimeout(autoDismissTimer);
    autoDismissTimer = setTimeout(dismissOfflinePrompt, 5000);
  };
}

export function dismissOfflinePrompt() {
  clearTimeout(autoDismissTimer);
  const banner = document.getElementById('offlinePromptBanner');
  if (banner) {
    banner.classList.remove('animate-in');
    banner.classList.add('fade-out');
    setTimeout(() => {
      banner.remove();
      promptBannerEl = null;
    }, 350);
  }
}

if (typeof window !== 'undefined') {
  window.suggestOfflineForSystem = suggestOfflineForSystem;
  window.dismissOfflinePrompt = dismissOfflinePrompt;
}
