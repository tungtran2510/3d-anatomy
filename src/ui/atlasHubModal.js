// Atlas 2027 Full-Screen Views & Media Hub Controller
// Visible Body Human Anatomy Atlas (Atlas 2027) Native Standard Layout
import { state } from '../state/store.js';
import { loadModel } from '../viewer/loadModel.js';
import { showSystem, hideSystem } from '../viewer/visibility.js';
import { selectPartById, deselectPart } from '../viewer/selection.js';
import { setView } from '../viewer/camera.js';
import { showToast, openVideoModal, selectStructureAnywhere, systemLabel } from './sidebar.js';
import { openMotionPanel, closeMotionPanel } from './motionPanel.js';
import { ICONS } from './icons.js';
import {
  ATLAS_SYSTEMS_CATEGORIES,
  ATLAS_REGIONS_CATEGORIES,
  ATLAS_QUIZZES_DATA,
  ATLAS_LAB_CATEGORIES,
  ATLAS_CROSS_SECTIONS_CATEGORIES,
  ATLAS_MICROANATOMY_CATEGORIES,
  ATLAS_MUSCLE_ACTIONS_CATEGORIES
} from '../data/atlasViewsData.js';
import { getAtlasMediaCategories } from '../data/atlasMediaManager.js';
import { openAtlasAdmin } from './atlasAdminModal.js';
import { openQuickVideoModal } from './quickVideoModal.js';
import { toggleAppTheme, updateThemeButtons, isDarkTheme } from '../utils/themeManager.js';
import { setModelOrientation } from '../viewer/orientationManager.js';
import { setClippingPlane, disableClipping } from '../viewer/clipping.js';
import { normalise, searchStructures } from '../utils/dataLoader.js';
import { setExplodeFactor, resetExplode } from '../viewer/explodedView.js';
import { applyAtlasPreset } from './atlasPresetEngine.js';
import { openSettingsModal } from './settingsModal.js';

function escapeHtml(text) {
  if (!text) return '';
  return String(text)
    .replace(/&/g, '&amp;')
    .replace(/</g, '&lt;')
    .replace(/>/g, '&gt;')
    .replace(/"/g, '&quot;');
}

let hubModalEl = null;
let currentTab = 'views'; // 'views' | 'search' | 'media' | 'quizzes' | 'library'
let currentSubFilter = 'systems'; // 'regions' | 'systems' | 'lab' | 'cross_sections' | 'microanatomy' | 'muscle_actions'
let searchQuery = '';

export function initAtlasHub(viewer) {
  if (hubModalEl) return;

  hubModalEl = document.getElementById('atlasHubModal');
  if (!hubModalEl) {
    const container = document.getElementById('app') || document.body;

    hubModalEl = document.createElement('div');
    hubModalEl.id = 'atlasHubModal';
    hubModalEl.className = 'atlas-hub-modal hidden';
    hubModalEl.innerHTML = `
      <div class="atlas-hub-backdrop" id="atlasHubBackdrop"></div>
      <div class="atlas-hub-container" role="dialog" aria-modal="true" aria-label="Danh mục góc nhìn và hoạt ảnh giải phẫu 3D">
        
        <!-- 1. TOP PRIMARY NAVIGATION BAR (5 Tabs: Góc nhìn, Tìm kiếm, Đa phương tiện, Trắc nghiệm, Thư viện của tôi) -->
        <header class="atlas-vb-topbar">
          <div class="atlas-vb-tabs">
            <button type="button" class="vb-tab-btn active" data-tab="views" id="tabBtnViews">
              <div class="vb-tab-icon cube-icon">
                <svg width="22" height="22" viewBox="0 0 24 24" fill="currentColor">
                  <path d="M21 16V8a2 2 0 0 0-1-1.73l-7-4a2 2 0 0 0-2 0l-7 4A2 2 0 0 0 3 8v8a2 2 0 0 0 1 1.73l7 4a2 2 0 0 0 2 0l7-4A2 2 0 0 0 21 16z"/>
                </svg>
              </div>
              <span class="vb-tab-label">Góc nhìn</span>
            </button>
            <button type="button" class="vb-tab-btn" data-tab="search" id="tabBtnSearch">
              <div class="vb-tab-icon">
                <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.3">
                  <circle cx="11" cy="11" r="8"/>
                  <line x1="21" y1="21" x2="16.65" y2="16.65"/>
                </svg>
              </div>
              <span class="vb-tab-label">Tìm kiếm</span>
            </button>
            <button type="button" class="vb-tab-btn" data-tab="media" id="tabBtnMedia">
              <div class="vb-tab-icon">
                <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.3">
                  <rect x="2" y="4" width="20" height="16" rx="3"/>
                  <polygon points="10 8 16 12 10 16 10 8" fill="currentColor"/>
                </svg>
              </div>
              <span class="vb-tab-label">Media</span>
            </button>
            <button type="button" class="vb-tab-btn" data-tab="quizzes" id="tabBtnQuizzes">
              <div class="vb-tab-icon">
                <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.3">
                  <polyline points="9 11 12 14 22 4"/>
                  <rect x="3" y="3" width="18" height="18" rx="2"/>
                </svg>
              </div>
              <span class="vb-tab-label">Trắc nghiệm</span>
            </button>
            <button type="button" class="vb-tab-btn" data-tab="library" id="tabBtnLibrary">
              <div class="vb-tab-icon">
                <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.2">
                  <rect x="3" y="3" width="14" height="18" rx="2"/>
                  <polygon points="10 7 11 9 13.5 9.5 11.7 11 12.2 13.5 10 12.2 7.8 13.5 8.3 11 6.5 9.5 9 9" fill="currentColor"/>
                </svg>
              </div>
              <span class="vb-tab-label">Thư viện</span>
            </button>
          </div>
          <button type="button" class="vb-topbar-close" id="btnAtlasHubClose" title="Quay lại mô hình 3D (Đóng)">&times;</button>
        </header>

        <!-- 2. SUB-CATEGORY BAR (Vùng cơ thể, Hệ cơ quan, Bàn phẫu tích, Lát cắt giải phẫu, Giải phẫu vi thể, Chuyển động cơ) -->
        <nav class="atlas-vb-subbar" id="atlasSubCategoryBar">
          <div class="atlas-vb-subnav-scroll">
            <button type="button" class="vb-sub-item" data-sub="regions">Vùng cơ thể</button>
            <button type="button" class="vb-sub-item active" data-sub="systems">Hệ cơ quan</button>
            <button type="button" class="vb-sub-item" data-sub="lab">Bàn phẫu tích</button>
            <button type="button" class="vb-sub-item" data-sub="cross_sections">Lát cắt giải phẫu</button>
            <button type="button" class="vb-sub-item" data-sub="microanatomy">Giải phẫu vi thể</button>
            <button type="button" class="vb-sub-item" data-sub="muscle_actions">Chuyển động cơ</button>
          </div>
        </nav>

        <!-- 3. FILTER SEARCH BAR -->
        <div class="atlas-vb-filter-bar" id="atlasFilterBar">
          <div class="vb-search-box">
            <svg class="vb-search-glass" width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.2">
              <circle cx="11" cy="11" r="8"/>
              <line x1="21" y1="21" x2="16.65" y2="16.65"/>
            </svg>
            <input type="text" class="vb-search-input" id="atlasHubSearchInput" placeholder="Lọc kết quả theo tên (VD: sọ, tim, mắt)..." autocomplete="off">
            <button type="button" class="vb-voice-btn" id="btnHubVoiceMic" title="Tìm bằng giọng nói tiếng Việt">
              <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.2">
                <path d="M12 2a3 3 0 0 0-3 3v7a3 3 0 0 0 6 0V5a3 3 0 0 0-3-3Z"/>
                <path d="M19 10v2a7 7 0 0 1-14 0v-2"/>
                <line x1="12" y1="19" x2="12" y2="22"/>
              </svg>
            </button>
            <button type="button" class="vb-clear-btn hidden" id="btnHubSearchClear" title="Xóa">&times;</button>
          </div>
        </div>

        <!-- 4. MAIN SCROLLABLE SHELVES CONTENT -->
        <div class="atlas-vb-body" id="atlasHubBody"></div>

        <!-- 5. BOTTOM NAVIGATION BAR (5 Items: Trình đơn, Liên kết, Cài đặt, Trợ giúp, Tải Offline) -->
        <footer class="atlas-vb-bottombar">
          <button type="button" class="vb-bottom-item" id="btnHubBottomMenu" title="Trình đơn giải phẫu">
            <div class="vb-bottom-icon">
              <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.8">
                <rect x="3" y="3" width="7" height="7" rx="1.5"/>
                <rect x="14" y="3" width="7" height="7" rx="1.5"/>
                <rect x="3" y="14" width="7" height="7" rx="1.5"/>
                <rect x="14" y="14" width="7" height="7" rx="1.5"/>
                <polyline points="18 9 21 12 18 15"/>
              </svg>
            </div>
            <span>Trình đơn</span>
          </button>
          <button type="button" class="vb-bottom-item" id="btnHubLaunchLink" title="Sao chép Liên kết góc nhìn">
            <div class="vb-bottom-icon">
              <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.8">
                <rect x="3" y="3" width="18" height="18" rx="2"/>
                <path d="M9 15l6-6"/>
                <polyline points="11 9 15 9 15 13"/>
                <polyline points="13 15 9 15 9 11"/>
              </svg>
            </div>
            <span>Liên kết</span>
          </button>
          <button type="button" class="vb-bottom-item" id="btnHubBottomSettings" title="Cài đặt giao diện & Quản trị">
            <div class="vb-bottom-icon">
              <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.8">
                <circle cx="12" cy="12" r="3"/>
                <path d="M19.4 15a1.65 1.65 0 0 0 .33 1.82l.06.06a2 2 0 0 1 0 2.83 2 2 0 0 1-2.83 0l-.06-.06a1.65 1.65 0 0 0-1.82-.33 1.65 1.65 0 0 0-1 1.51V21a2 2 0 0 1-2 2 2 2 0 0 1-2-2v-.09A1.65 1.65 0 0 0 9 19.4a1.65 1.65 0 0 0-1.82.33l-.06.06a2 2 0 0 1-2.83 0 2 2 0 0 1 0-2.83l.06-.06a1.65 1.65 0 0 0 .33-1.82 1.65 1.65 0 0 0-1.51-1H3a2 2 0 0 1-2-2 2 2 0 0 1 2-2h.09A1.65 1.65 0 0 0 4.6 9a1.65 1.65 0 0 0-.33-1.82l-.06-.06a2 2 0 0 1 0-2.83 2 2 0 0 1 2.83 0l.06.06a1.65 1.65 0 0 0 1.82.33H9a1.65 1.65 0 0 0 1-1.51V3a2 2 0 0 1 2-2 2 2 0 0 1 2 2v.09a1.65 1.65 0 0 0 1 1.51 1.65 1.65 0 0 0 1.82-.33l.06-.06a2 2 0 0 1 2.83 0 2 2 0 0 1 0 2.83l-.06.06a1.65 1.65 0 0 0-.33 1.82V9a1.65 1.65 0 0 0 1.51 1H21a2 2 0 0 1 2 2 2 2 0 0 1-2 2h-.09a1.65 1.65 0 0 0-1.51 1z"/>
              </svg>
            </div>
            <span>Cài đặt</span>
          </button>
          <button type="button" class="vb-bottom-item" id="btnHubBottomHelp" title="Hướng dẫn sử dụng">
            <div class="vb-bottom-icon">
              <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.8">
                <circle cx="12" cy="12" r="10"/>
                <path d="M9.09 9a3 3 0 0 1 5.83 1c0 2-3 3-3 3"/>
                <line x1="12" y1="17" x2="12.01" y2="17"/>
              </svg>
            </div>
            <span>Trợ giúp</span>
          </button>
          <button type="button" class="vb-bottom-item" id="btnHubBottomStore" title="Tải toàn bộ dữ liệu để xem khi không có mạng">
            <div class="vb-bottom-icon">
              <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.8">
                <circle cx="9" cy="21" r="1"/>
                <circle cx="20" cy="21" r="1"/>
                <path d="M1 1h4l2.68 13.39a2 2 0 0 0 2 1.61h9.72a2 2 0 0 0 2-1.61L23 6H6"/>
              </svg>
            </div>
            <span>Tải Về Máy</span>
          </button>
        </footer>
      </div>
    `;

    container.appendChild(hubModalEl);
  }

  setupHubEvents(viewer);
  renderHubContent(viewer);
}

function setupHubEvents(viewer) {
  const closeBtn = hubModalEl.querySelector('#btnAtlasHubClose');
  const backdrop = hubModalEl.querySelector('#atlasHubBackdrop');
  const searchInput = hubModalEl.querySelector('#atlasHubSearchInput');
  const clearSearchBtn = hubModalEl.querySelector('#btnHubSearchClear');
  const tabBtns = hubModalEl.querySelectorAll('.vb-tab-btn');
  const subBtns = hubModalEl.querySelectorAll('.vb-sub-item');
  const launchLinkBtn = hubModalEl.querySelector('#btnHubLaunchLink');

  closeBtn?.addEventListener('click', closeAtlasHub);
  backdrop?.addEventListener('click', closeAtlasHub);

  window.addEventListener('keydown', (e) => {
    if (e.key === 'Escape' && hubModalEl && !hubModalEl.classList.contains('hidden')) {
      closeAtlasHub();
    }
  });

  // Top tabs click
  tabBtns.forEach(btn => {
    btn.addEventListener('click', () => {
      tabBtns.forEach(b => b.classList.remove('active'));
      btn.classList.add('active');
      currentTab = btn.dataset.tab;

      const subBar = hubModalEl.querySelector('#atlasSubCategoryBar');
      if (currentTab === 'views') {
        if (subBar) subBar.style.display = 'flex';
      } else {
        if (subBar) subBar.style.display = 'none';
      }

      if (currentTab === 'search') {
        setTimeout(() => searchInput?.focus(), 100);
      }

      renderHubContent(viewer);
    });
  });

  // Sub-category click
  subBtns.forEach(btn => {
    btn.addEventListener('click', () => {
      subBtns.forEach(b => b.classList.remove('active'));
      btn.classList.add('active');
      currentSubFilter = btn.dataset.sub;
      renderHubContent(viewer);
    });
  });

  // Search input
  searchInput?.addEventListener('input', (e) => {
    searchQuery = e.target.value.toLowerCase().trim();
    if (searchQuery) {
      clearSearchBtn.classList.remove('hidden');
    } else {
      clearSearchBtn.classList.add('hidden');
    }
    renderHubContent(viewer);
  });

  clearSearchBtn?.addEventListener('click', () => {
    searchInput.value = '';
    searchQuery = '';
    clearSearchBtn.classList.add('hidden');
    searchInput.focus();
    renderHubContent(viewer);
  });

  // Voice search
  const hubVoiceBtn = hubModalEl.querySelector('#btnHubVoiceMic');
  let hubRecognition = null;
  hubVoiceBtn?.addEventListener('click', () => {
    const SpeechRecognition = window.SpeechRecognition || window.webkitSpeechRecognition;
    if (!SpeechRecognition) {
      showToast('⚠️ Trình duyệt chưa hỗ trợ nhận diện giọng nói');
      return;
    }
    if (!hubRecognition) {
      hubRecognition = new SpeechRecognition();
      hubRecognition.lang = 'vi-VN';
      hubRecognition.continuous = false;
      hubRecognition.interimResults = false;
      hubRecognition.onstart = () => {
        hubVoiceBtn.classList.add('listening');
        showToast('🎙️ Đang nghe... Hãy nói tên góc nhìn hoặc bộ phận (VD: "não bộ", "sọ")');
      };
      hubRecognition.onend = () => {
        hubVoiceBtn.classList.remove('listening');
      };
      hubRecognition.onerror = (err) => {
        hubVoiceBtn.classList.remove('listening');
        if (err.error === 'not-allowed') showToast('⚠️ Vui lòng cấp quyền Microphone để nói');
      };
      hubRecognition.onresult = (ev) => {
        const text = ev.results?.[0]?.[0]?.transcript?.trim();
        if (text) {
          searchInput.value = text;
          searchQuery = text.toLowerCase().trim();
          clearSearchBtn.classList.remove('hidden');
          renderHubContent(viewer);
          showToast(`🎯 Đã tìm: "${text}"`);
        }
      };
    }
    try {
      hubRecognition.start();
    } catch {
      hubVoiceBtn.classList.remove('listening');
    }
  });

  // Bottom buttons
  const bottomMenuBtn = hubModalEl.querySelector('#btnHubBottomMenu');
  bottomMenuBtn?.addEventListener('click', () => {
    closeAtlasHub();
    document.getElementById('btnMenuToggle')?.click();
  });

  launchLinkBtn?.addEventListener('click', () => {
    copyLaunchLink();
  });

  const bottomSettingsBtn = hubModalEl.querySelector('#btnHubBottomSettings');
  bottomSettingsBtn?.addEventListener('click', () => {
    openSettingsModal(viewer);
  });

  const bottomHelpBtn = hubModalEl.querySelector('#btnHubBottomHelp');
  bottomHelpBtn?.addEventListener('click', () => {
    showToast('💡 Mẹo: Chạm vào bất kỳ thẻ góc nhìn nào để mở trực tiếp trên mô hình 3D.');
  });

  const bottomStoreBtn = hubModalEl.querySelector('#btnHubBottomStore');
  bottomStoreBtn?.addEventListener('click', async () => {
    closeAtlasHub();
    const { openOfflineModal } = await import('./offlineModal.js');
    openOfflineModal(viewer);
  });

  window.addEventListener('atlas-media-updated', () => {
    if (currentTab === 'media') {
      renderHubContent(viewer);
    }
  });
}

export function openAtlasHub(viewer, targetTab = 'views') {
  if (!hubModalEl) initAtlasHub(viewer);

  hubModalEl.classList.remove('hidden');
  document.body.classList.add('atlas-hub-open');
  updateThemeButtons();

  currentTab = targetTab;
  const tabBtns = hubModalEl.querySelectorAll('.vb-tab-btn');
  tabBtns.forEach(b => {
    b.classList.toggle('active', b.dataset.tab === currentTab);
  });

  const subBar = hubModalEl.querySelector('#atlasSubCategoryBar');
  if (currentTab === 'views') {
    if (subBar) subBar.style.display = 'flex';
  } else {
    if (subBar) subBar.style.display = 'none';
  }

  renderHubContent(viewer);
}

export function closeAtlasHub() {
  if (hubModalEl) {
    hubModalEl.classList.add('hidden');
    document.body.classList.remove('atlas-hub-open');
  }
}

export function toggleAtlasHub(viewer, targetTab = 'views') {
  if (!hubModalEl) initAtlasHub(viewer);
  if (hubModalEl.classList.contains('hidden')) {
    openAtlasHub(viewer, targetTab);
  } else {
    closeAtlasHub();
  }
}

function renderHubContent(viewer) {
  const body = hubModalEl?.querySelector('#atlasHubBody');
  if (!body) return;

  if (currentTab === 'views') {
    renderViewsTab(body, viewer);
  } else if (currentTab === 'search') {
    renderSearchTab(body, viewer);
  } else if (currentTab === 'media') {
    renderMediaTab(body, viewer);
  } else if (currentTab === 'quizzes') {
    renderQuizzesTab(body, viewer);
  } else if (currentTab === 'library') {
    renderLibraryTab(body, viewer);
  }

  setupShelfScrollIndicators(body);
}

// Attach dynamic scroll indicator & desktop horizontal mouse wheel to shelves
function setupShelfScrollIndicators(container) {
  const shelves = container.querySelectorAll('.atlas-carousel-shelf');
  shelves.forEach(shelf => {
    const track = shelf.querySelector('.shelf-track');
    const pill = shelf.querySelector('.shelf-scroll-pill');
    if (!track || !pill) return;

    // Smooth horizontal scroll with mouse wheel on desktop
    track.addEventListener('wheel', (e) => {
      if (Math.abs(e.deltaY) > Math.abs(e.deltaX)) {
        e.preventDefault();
        track.scrollLeft += e.deltaY;
      }
    }, { passive: false });

    // Update scroll indicator pill position
    const updatePill = () => {
      const maxScroll = track.scrollWidth - track.clientWidth;
      if (maxScroll <= 0) {
        pill.style.transform = 'translateX(0)';
        return;
      }
      const scrollPct = Math.min(Math.max(track.scrollLeft / maxScroll, 0), 1);
      const indicatorWidth = 80;
      const pillWidth = 28;
      const travel = indicatorWidth - pillWidth;
      pill.style.transform = `translateX(${scrollPct * travel}px)`;
    };

    track.addEventListener('scroll', updatePill, { passive: true });
    updatePill();
  });
}

// 1. RENDER VIEWS TAB (Horizontal Carousel Shelves by Sub-Category)
function renderViewsTab(container, viewer) {
  let html = '';
  const normQuery = normalise(searchQuery);

  // If user searched, show matching 3D structures first
  if (normQuery && normQuery.length >= 2) {
    const matchedStructures = searchStructures(searchQuery, 12);
    if (matchedStructures.length > 0) {
      html += `
        <div class="atlas-carousel-shelf matched-shelf">
          <div class="shelf-header">
            <h3 class="shelf-title">Cấu Trúc Khớp Tìm Kiếm (${matchedStructures.length})</h3>
            <span class="shelf-action-btn">•••</span>
          </div>
          <div class="shelf-track">
            ${matchedStructures.map(s => {
              const targetPart = s.sides.none || s.sides.right || s.sides.left;
              return `
                <div class="atlas-shelf-card structure-shelf-card" data-structure-part="${escapeHtml(targetPart)}" role="button" tabindex="0">
                  <div class="shelf-thumb-box">
                    <span class="shelf-pin-icon">📍</span>
                    <span class="shelf-thumb-dots">•••</span>
                  </div>
                  <div class="shelf-card-title">${escapeHtml(s.label)}</div>
                </div>
              `;
            }).join('')}
          </div>
          <div class="shelf-scroll-indicator"><div class="shelf-scroll-pill"></div></div>
        </div>
      `;
    }
  }

  if (currentSubFilter === 'systems') {
    // Render all Systems shelves
    const filteredSystems = ATLAS_SYSTEMS_CATEGORIES.map(cat => {
      const matchedCards = cat.cards.filter(c =>
        !normQuery ||
        normalise(c.title).includes(normQuery) ||
        (c.titleVi && normalise(c.titleVi).includes(normQuery)) ||
        (c.subtitle && normalise(c.subtitle).includes(normQuery)) ||
        (c.desc && normalise(c.desc).includes(normQuery)) ||
        normalise(cat.titleVi).includes(normQuery) ||
        (cat.titleEn && normalise(cat.titleEn).includes(normQuery))
      );
      return { ...cat, cards: matchedCards };
    }).filter(cat => cat.cards.length > 0);

    filteredSystems.forEach(cat => {
      html += `
        <div class="atlas-carousel-shelf" data-shelf-id="${cat.id}">
          <div class="shelf-header">
            <h3 class="shelf-title">${escapeHtml(cat.titleVi || cat.titleEn)}</h3>
            <button type="button" class="shelf-action-btn" title="Tùy chọn">•••</button>
          </div>
          <div class="shelf-track">
            ${cat.cards.map(card => `
              <div class="atlas-shelf-card" data-view-id="${card.id}" title="${escapeHtml(card.titleVi || card.title)}${card.subtitle ? ' - ' + escapeHtml(card.subtitle) : ''}">
                <div class="shelf-thumb-box">
                  <img class="shelf-thumb-img" src="${card.image || '/images/atlas/skel_full.png'}" alt="${escapeHtml(card.titleVi || card.title)}" loading="lazy" onerror="this.src='/images/atlas/skel_full.png'" />
                  <span class="shelf-thumb-dots">•••</span>
                  ${card.hasPlay || card.explode || card.motionId ? `
                    <span class="shelf-thumb-play">
                      <svg width="10" height="10" viewBox="0 0 24 24" fill="currentColor"><polygon points="6 3 20 12 6 21 6 3"/></svg>
                    </span>
                  ` : ''}
                </div>
                <div class="shelf-card-title">${escapeHtml(card.titleVi || card.title)}</div>
              </div>
            `).join('')}
          </div>
          <div class="shelf-scroll-indicator"><div class="shelf-scroll-pill"></div></div>
        </div>
      `;
    });
  } else if (currentSubFilter === 'regions') {
    const filteredRegions = ATLAS_REGIONS_CATEGORIES.filter(r =>
      !normQuery ||
      normalise(r.title).includes(normQuery) ||
      (r.titleVi && normalise(r.titleVi).includes(normQuery)) ||
      (r.subtitle && normalise(r.subtitle).includes(normQuery))
    );
    if (filteredRegions.length > 0) {
      html += `
        <div class="atlas-carousel-shelf">
          <div class="shelf-header">
            <h3 class="shelf-title">Giải Phẫu Theo Vùng Cơ Thể</h3>
            <button type="button" class="shelf-action-btn">•••</button>
          </div>
          <div class="shelf-track">
            ${filteredRegions.map(reg => `
              <div class="atlas-shelf-card" data-region-id="${reg.id}" title="${escapeHtml(reg.titleVi || reg.title)}">
                <div class="shelf-thumb-box">
                  <img class="shelf-thumb-img" src="${reg.image || '/images/atlas/reg_head_neck.png'}" alt="${escapeHtml(reg.titleVi || reg.title)}" loading="lazy" onerror="this.src='/images/atlas/reg_head_neck.png'" />
                  <span class="shelf-thumb-dots">•••</span>
                </div>
                <div class="shelf-card-title">${escapeHtml(reg.titleVi || reg.title)}</div>
              </div>
            `).join('')}
          </div>
          <div class="shelf-scroll-indicator"><div class="shelf-scroll-pill"></div></div>
        </div>
      `;
    }
  } else if (currentSubFilter === 'lab') {
    const filteredLab = ATLAS_LAB_CATEGORIES.filter(c =>
      !normQuery ||
      normalise(c.title).includes(normQuery) ||
      (c.titleVi && normalise(c.titleVi).includes(normQuery)) ||
      (c.subtitle && normalise(c.subtitle).includes(normQuery)) ||
      (c.desc && normalise(c.desc).includes(normQuery))
    );
    if (filteredLab.length > 0) {
      html += `
        <div class="atlas-carousel-shelf">
          <div class="shelf-header">
            <h3 class="shelf-title">Bàn Phẫu Tích Giải Phẫu</h3>
            <button type="button" class="shelf-action-btn">•••</button>
          </div>
          <div class="shelf-track">
            ${filteredLab.map(card => `
              <div class="atlas-shelf-card" data-view-id="${card.id}" title="${escapeHtml(card.titleVi || card.title)}">
                <div class="shelf-thumb-box">
                  <img class="shelf-thumb-img" src="${card.image || '/images/atlas/reg_thorax.png'}" alt="${escapeHtml(card.titleVi || card.title)}" loading="lazy" onerror="this.src='/images/atlas/reg_thorax.png'" />
                  <span class="shelf-thumb-dots">•••</span>
                </div>
                <div class="shelf-card-title">${escapeHtml(card.titleVi || card.title)}</div>
              </div>
            `).join('')}
          </div>
          <div class="shelf-scroll-indicator"><div class="shelf-scroll-pill"></div></div>
        </div>
      `;
    }
  } else if (currentSubFilter === 'cross_sections') {
    const filteredCross = ATLAS_CROSS_SECTIONS_CATEGORIES.map(group => {
      const matched = group.cards.filter(c =>
        !normQuery ||
        normalise(c.title).includes(normQuery) ||
        (c.titleVi && normalise(c.titleVi).includes(normQuery)) ||
        (c.subtitle && normalise(c.subtitle).includes(normQuery)) ||
        (c.desc && normalise(c.desc).includes(normQuery)) ||
        normalise(group.titleVi).includes(normQuery)
      );
      return { ...group, cards: matched };
    }).filter(g => g.cards.length > 0);

    filteredCross.forEach(group => {
      html += `
        <div class="atlas-carousel-shelf">
          <div class="shelf-header">
            <h3 class="shelf-title">${escapeHtml(group.titleVi)}</h3>
            <button type="button" class="shelf-action-btn">•••</button>
          </div>
          <div class="shelf-track">
            ${group.cards.map(card => `
              <div class="atlas-shelf-card" data-view-id="${card.id}" title="${escapeHtml(card.titleVi || card.title)}">
                <div class="shelf-thumb-box">
                  <img class="shelf-thumb-img" src="${card.image || '/images/atlas/nerv_brain.png'}" alt="${escapeHtml(card.titleVi || card.title)}" loading="lazy" onerror="this.src='/images/atlas/nerv_brain.png'" />
                  <span class="shelf-thumb-dots">•••</span>
                </div>
                <div class="shelf-card-title">${escapeHtml(card.titleVi || card.title)}</div>
              </div>
            `).join('')}
          </div>
          <div class="shelf-scroll-indicator"><div class="shelf-scroll-pill"></div></div>
        </div>
      `;
    });
  } else if (currentSubFilter === 'microanatomy') {
    const filteredMicro = ATLAS_MICROANATOMY_CATEGORIES.map(group => {
      const matched = group.cards.filter(c =>
        !normQuery ||
        normalise(c.title).includes(normQuery) ||
        (c.titleVi && normalise(c.titleVi).includes(normQuery)) ||
        (c.subtitle && normalise(c.subtitle).includes(normQuery)) ||
        (c.desc && normalise(c.desc).includes(normQuery)) ||
        normalise(group.titleVi).includes(normQuery)
      );
      return { ...group, cards: matched };
    }).filter(g => g.cards.length > 0);

    filteredMicro.forEach(group => {
      html += `
        <div class="atlas-carousel-shelf">
          <div class="shelf-header">
            <h3 class="shelf-title">${escapeHtml(group.titleVi)}</h3>
            <button type="button" class="shelf-action-btn">•••</button>
          </div>
          <div class="shelf-track">
            ${group.cards.map(card => `
              <div class="atlas-shelf-card" data-view-id="${card.id}" title="${escapeHtml(card.titleVi || card.title)}">
                <div class="shelf-thumb-box">
                  <img class="shelf-thumb-img" src="${card.image || '/images/atlas/med_skin.png'}" alt="${escapeHtml(card.titleVi || card.title)}" loading="lazy" onerror="this.src='/images/atlas/med_skin.png'" />
                  <span class="shelf-thumb-dots">•••</span>
                </div>
                <div class="shelf-card-title">${escapeHtml(card.titleVi || card.title)}</div>
              </div>
            `).join('')}
          </div>
          <div class="shelf-scroll-indicator"><div class="shelf-scroll-pill"></div></div>
        </div>
      `;
    });
  } else if (currentSubFilter === 'muscle_actions') {
    const filteredActions = ATLAS_MUSCLE_ACTIONS_CATEGORIES.map(group => {
      const matched = group.cards.filter(c =>
        !normQuery ||
        normalise(c.title).includes(normQuery) ||
        (c.titleVi && normalise(c.titleVi).includes(normQuery)) ||
        (c.subtitle && normalise(c.subtitle).includes(normQuery)) ||
        (c.desc && normalise(c.desc).includes(normQuery)) ||
        normalise(group.titleVi).includes(normQuery)
      );
      return { ...group, cards: matched };
    }).filter(g => g.cards.length > 0);

    filteredActions.forEach(group => {
      html += `
        <div class="atlas-carousel-shelf">
          <div class="shelf-header">
            <h3 class="shelf-title">${escapeHtml(group.titleVi)}</h3>
            <button type="button" class="shelf-action-btn">•••</button>
          </div>
          <div class="shelf-track">
            ${group.cards.map(card => `
              <div class="atlas-shelf-card" data-view-id="${card.id}" title="${escapeHtml(card.titleVi || card.title)}">
                <div class="shelf-thumb-box">
                  <img class="shelf-thumb-img" src="${card.image || '/images/atlas/musc_torso.png'}" alt="${escapeHtml(card.titleVi || card.title)}" loading="lazy" onerror="this.src='/images/atlas/musc_torso.png'" />
                  <span class="shelf-thumb-dots">•••</span>
                  <span class="shelf-thumb-play">
                    <svg width="10" height="10" viewBox="0 0 24 24" fill="currentColor"><polygon points="6 3 20 12 6 21 6 3"/></svg>
                  </span>
                </div>
                <div class="shelf-card-title">${escapeHtml(card.titleVi || card.title)}</div>
              </div>
            `).join('')}
          </div>
          <div class="shelf-scroll-indicator"><div class="shelf-scroll-pill"></div></div>
        </div>
      `;
    });
  }

  if (!html) {
    html = `
      <div class="atlas-empty-state">
        <svg width="44" height="44" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.6"><circle cx="11" cy="11" r="8"/><line x1="21" y1="21" x2="16.65" y2="16.65"/></svg>
        <p>Không tìm thấy góc nhìn phù hợp với "<strong>${escapeHtml(searchQuery)}</strong>".</p>
      </div>
    `;
  }

  container.innerHTML = html;
  bindCardClickEvents(container, viewer);
}

// 2. RENDER SEARCH TAB
function renderSearchTab(container, viewer) {
  let html = '';
  const normQuery = normalise(searchQuery);

  if (!normQuery) {
    html = `
      <div class="atlas-search-prompt">
        <svg width="40" height="40" viewBox="0 0 24 24" fill="none" stroke="#1e3a8a" stroke-width="1.8">
          <circle cx="11" cy="11" r="8"/>
          <line x1="21" y1="21" x2="16.65" y2="16.65"/>
        </svg>
        <h3>Tìm Kiếm Danh Pháp & Góc Nhìn Giải Phẫu</h3>
        <p>Gõ tên cấu trúc (VD: "não", "cơ hoành", "xương sườn", "tim") hoặc nói qua micro để định vị 3D tức thì.</p>
      </div>
    `;
  } else {
    const matchedStructures = searchStructures(searchQuery, 30);
    if (matchedStructures.length > 0) {
      html += `
        <div class="atlas-carousel-shelf">
          <div class="shelf-header">
            <h3 class="shelf-title">Cấu Trúc Giải Phẫu 3D Khớp (${matchedStructures.length})</h3>
            <span class="shelf-action-btn">•••</span>
          </div>
          <div class="shelf-search-list">
            ${matchedStructures.map(s => {
              const targetPart = s.sides.none || s.sides.right || s.sides.left;
              return `
                <div class="atlas-structure-item-card" data-structure-part="${escapeHtml(targetPart)}" role="button" tabindex="0">
                  <div class="structure-card-main">
                    <span class="structure-card-name">${escapeHtml(s.label)}</span>
                    <span class="structure-card-latin">${escapeHtml(s.latin || s.base)}</span>
                  </div>
                  <span class="structure-card-badge">${escapeHtml(systemLabel(s.system))}</span>
                </div>
              `;
            }).join('')}
          </div>
        </div>
      `;
    } else {
      html = `
        <div class="atlas-empty-state">
          <p>Không tìm thấy cấu trúc giải phẫu nào với từ khóa "<strong>${escapeHtml(searchQuery)}</strong>".</p>
        </div>
      `;
    }
  }

  container.innerHTML = html;

  container.querySelectorAll('.atlas-structure-item-card').forEach(cardEl => {
    cardEl.addEventListener('click', async () => {
      const partId = cardEl.dataset.structurePart;
      if (!partId) return;
      closeAtlasHub();
      const name = cardEl.querySelector('.structure-card-name')?.textContent || partId;
      showToast(`🎯 Đang định vị 3D: ${name}...`);
      await selectStructureAnywhere(partId);
    });
  });
}

// 3. RENDER MEDIA TAB (Patient Education Animations & Biomechanics)
function renderMediaTab(container, viewer) {
  const mediaCategories = getAtlasMediaCategories();
  const normQuery = normalise(searchQuery);

  const filteredMedia = mediaCategories.map(cat => {
    const matched = (cat.cards || []).filter(c =>
      !normQuery ||
      normalise(c.title).includes(normQuery) ||
      (c.subtitle && normalise(c.subtitle).includes(normQuery)) ||
      (c.desc && normalise(c.desc).includes(normQuery)) ||
      normalise(cat.titleVi).includes(normQuery)
    );
    return { ...cat, cards: matched };
  }).filter(cat => cat.cards.length > 0);

  let html = `
    <div class="media-shelf-topbar">
      <div class="media-shelf-info">
        <span class="media-shelf-badge">🎬 12 Chuyên đề Hoạt ảnh</span>
      </div>
      <button type="button" class="btn-media-add-new" id="btnMediaAddNewVideo" title="Thêm video mới">
        <span>➕ Thêm Video</span>
      </button>
    </div>
  `;

  filteredMedia.forEach(cat => {
    html += `
      <div class="atlas-carousel-shelf">
        <div class="shelf-header">
          <h3 class="shelf-title">${escapeHtml(cat.titleVi)}</h3>
          <button type="button" class="shelf-action-btn">•••</button>
        </div>
        <div class="shelf-track">
          ${cat.cards.map(card => `
            <div class="atlas-shelf-card media-shelf-card" data-media-id="${card.id}" title="${escapeHtml(card.titleVi || card.title)}">
              <div class="shelf-thumb-box">
                <img class="shelf-thumb-img" src="${card.image || '/images/atlas/med_skin.png'}" alt="${escapeHtml(card.titleVi || card.title)}" loading="lazy" onerror="this.src='/images/atlas/med_skin.png'" />
                <span class="shelf-thumb-dots">•••</span>
                <span class="shelf-thumb-play">
                  <svg width="10" height="10" viewBox="0 0 24 24" fill="currentColor"><polygon points="6 3 20 12 6 21 6 3"/></svg>
                </span>
                <span class="shelf-duration-pill">${card.duration || '0:30'}</span>
              </div>
              <div class="shelf-card-title">${escapeHtml(card.titleVi || card.title)}</div>
            </div>
          `).join('')}
        </div>
        <div class="shelf-scroll-indicator"><div class="shelf-scroll-pill"></div></div>
      </div>
    `;
  });

  if (filteredMedia.length === 0) {
    html += `
      <div class="atlas-empty-state">
        <p>Không tìm thấy hoạt ảnh nào phù hợp.</p>
      </div>
    `;
  }

  container.innerHTML = html;

  container.querySelector('#btnMediaAddNewVideo')?.addEventListener('click', () => {
    openQuickVideoModal(null, 'Thư Viện Hoạt Ảnh', () => {
      renderMediaTab(container, viewer);
    });
  });

  container.querySelectorAll('.media-shelf-card').forEach(cardEl => {
    cardEl.addEventListener('click', () => {
      const mediaId = cardEl.dataset.mediaId;
      let targetMedia = null;
      for (const cat of mediaCategories) {
        const found = (cat.cards || []).find(c => c.id === mediaId);
        if (found) { targetMedia = found; break; }
      }
      if (targetMedia) applyAtlasMedia(targetMedia, viewer);
    });
  });
}

// 4. RENDER QUIZZES TAB
function renderQuizzesTab(container, viewer) {
  let html = `
    <div class="atlas-carousel-shelf">
      <div class="shelf-header">
        <h3 class="shelf-title">Trắc Nghiệm & Kiểm Tra Kiến Thức 3D</h3>
        <button type="button" class="shelf-action-btn">•••</button>
      </div>
      <div class="shelf-track">
        ${ATLAS_QUIZZES_DATA.map(q => `
          <div class="atlas-shelf-card quiz-shelf-card" data-quiz-id="${q.id}" title="${escapeHtml(q.titleVi || q.title)}">
            <div class="shelf-thumb-box">
              <img class="shelf-thumb-img" src="${q.image || '/images/atlas/quiz_identify.png'}" alt="${escapeHtml(q.titleVi || q.title)}" loading="lazy" onerror="this.src='/images/atlas/quiz_identify.png'" />
              <span class="shelf-thumb-dots">•••</span>
            </div>
            <div class="shelf-card-title">${escapeHtml(q.titleVi || q.title)}</div>
          </div>
        `).join('')}
      </div>
      <div class="shelf-scroll-indicator"><div class="shelf-scroll-pill"></div></div>
    </div>
  `;

  container.innerHTML = html;

  container.querySelectorAll('.quiz-shelf-card').forEach(cardEl => {
    cardEl.addEventListener('click', () => {
      const qId = cardEl.dataset.quizId;
      closeAtlasHub();
      if (qId === 'quiz_identify') {
        document.getElementById('btnToolQuiz')?.click();
      } else {
        document.getElementById('btnToolStudy')?.click();
      }
    });
  });
}

// 5. RENDER MY LIBRARY TAB
function renderLibraryTab(container, viewer) {
  let html = `
    <div class="atlas-carousel-shelf">
      <div class="shelf-header">
        <h3 class="shelf-title">Góc Nhìn Đã Lưu & Ghi Chú</h3>
        <button type="button" class="shelf-action-btn">•••</button>
      </div>
      <div class="atlas-library-empty">
        <div class="library-empty-icon">📁</div>
        <h4>Chưa có góc nhìn tùy chỉnh nào được lưu</h4>
        <p>Khi khám phá mô hình 3D, nhấn nút <strong>Liên kết góc nhìn</strong> hoặc lưu góc nhìn để truy cập nhanh tại đây.</p>
        <button type="button" class="btn-lib-explore" id="btnLibExploreViews">Khám phá Góc Nhìn Chuẩn</button>
      </div>
    </div>
  `;

  container.innerHTML = html;

  container.querySelector('#btnLibExploreViews')?.addEventListener('click', () => {
    const tabViews = hubModalEl.querySelector('#tabBtnViews');
    tabViews?.click();
  });
}

// Helper: Bind card click events across all shelves
function bindCardClickEvents(container, viewer) {
  container.querySelectorAll('.atlas-shelf-card').forEach(cardEl => {
    cardEl.addEventListener('click', () => {
      const viewId = cardEl.dataset.viewId;
      const regId = cardEl.dataset.regionId;

      if (viewId) {
        let targetCard = null;
        for (const cat of ATLAS_SYSTEMS_CATEGORIES) {
          const found = cat.cards.find(c => c.id === viewId);
          if (found) { targetCard = found; break; }
        }
        if (!targetCard) targetCard = ATLAS_LAB_CATEGORIES.find(c => c.id === viewId);
        if (!targetCard) {
          for (const g of ATLAS_CROSS_SECTIONS_CATEGORIES) {
            const found = g.cards.find(c => c.id === viewId);
            if (found) { targetCard = found; break; }
          }
        }
        if (!targetCard) {
          for (const g of ATLAS_MICROANATOMY_CATEGORIES) {
            const found = g.cards.find(c => c.id === viewId);
            if (found) { targetCard = found; break; }
          }
        }
        if (!targetCard) {
          for (const g of ATLAS_MUSCLE_ACTIONS_CATEGORIES) {
            const found = g.cards.find(c => c.id === viewId);
            if (found) { targetCard = found; break; }
          }
        }
        if (targetCard) applyAtlasView(targetCard, viewer);
      } else if (regId) {
        const targetReg = ATLAS_REGIONS_CATEGORIES.find(r => r.id === regId);
        if (targetReg) applyAtlasRegion(targetReg, viewer);
      }
    });
  });
}

// ACTION: Apply 3D View Preset
async function applyAtlasView(card, viewer) {
  closeAtlasHub();
  showToast(`🎯 Đang tải góc nhìn: ${card.titleVi || card.title}...`);

  const activeViewer = viewer || state.viewer || window.viewer;
  if (!activeViewer) return;

  try {
    await applyAtlasPreset(card, activeViewer);
  } catch (err) {
    console.error('Error applying atlas view:', err);
    showToast(`Đã mở góc nhìn: ${card.titleVi || card.title}`);
  }
}

export async function applyAtlasViewDirect(card, viewer) {
  return applyAtlasView(card, viewer);
}

let currentActiveRegionId = null;

// ACTION: Apply Region
async function applyAtlasRegion(reg, viewer) {
  closeAtlasHub();

  const activeViewer = viewer || state.viewer || window.viewer;
  if (!activeViewer) return;

  disableClipping(activeViewer);
  closeMotionPanel();

  if (currentActiveRegionId === reg.id) {
    currentActiveRegionId = null;
    setView('front', activeViewer);
    showToast(`Đã trở về toàn thân`);
    activeViewer.render();
    return;
  }

  currentActiveRegionId = reg.id;
  showToast(`🎯 Chuyển phân vùng: ${reg.titleVi || reg.title}...`);

  const systemsToLoad = reg.systems || ['skeletal'];
  for (const sys of systemsToLoad) {
    if (!state.loadedSystems.includes(sys)) {
      await loadModel(sys, activeViewer);
    }
    showSystem(sys);
  }

  if (reg.camera) {
    const cam = reg.camera;
    const { camera, controls } = activeViewer;
    animateCameraTo(camera, controls, { x: cam.x, y: cam.y, z: cam.z }, { x: cam.targetX || 0, y: cam.targetY || cam.y, z: cam.targetZ || 0 });
  }

  activeViewer.render();
}

// ACTION: Apply Media
function applyAtlasMedia(media, viewer) {
  const activeViewer = viewer || state.viewer || window.viewer;
  if (media.type === 'motion') {
    closeAtlasHub();
    disableClipping(activeViewer);
    showToast(`▶️ Đang khởi chạy mô phỏng 3D: ${media.titleVi || media.title}`);
    openMotionPanel(activeViewer, media.motionType);
  } else if (media.type === 'video') {
    closeMotionPanel();
    showToast(`🎬 Đang phát video y khoa: ${media.titleVi || media.title}`);
    openVideoModal(media.videoUrl, media.titleVi || media.title);
  }
}

// Helper: Animate camera smoothly to target pos & lookAt
function animateCameraTo(camera, controls, pos, lookAt, duration = 650) {
  const startPos = camera.position.clone();
  const startTarget = controls.target.clone();
  const startTime = performance.now();

  function step(now) {
    const elapsed = now - startTime;
    const t = Math.min(elapsed / duration, 1);
    const ease = 1 - Math.pow(1 - t, 3);

    camera.position.x = startPos.x + (pos.x - startPos.x) * ease;
    camera.position.y = startPos.y + (pos.y - startPos.y) * ease;
    camera.position.z = startPos.z + (pos.z - startPos.z) * ease;

    controls.target.x = startTarget.x + (lookAt.x - startTarget.x) * ease;
    controls.target.y = startTarget.y + (lookAt.y - startTarget.y) * ease;
    controls.target.z = startTarget.z + (lookAt.z - startTarget.z) * ease;
    controls.update();

    if (t < 1) {
      requestAnimationFrame(step);
    }
  }

  requestAnimationFrame(step);
}

// Helper: Copy Launch Link to clipboard
function copyLaunchLink() {
  const url = window.location.href;
  if (navigator.clipboard) {
    navigator.clipboard.writeText(url).then(() => {
      showToast('✓ Đã sao chép liên kết góc nhìn 3D hiện tại!');
    }).catch(() => {
      prompt('Sao chép liên kết dưới đây:', url);
    });
  } else {
    prompt('Sao chép liên kết dưới đây:', url);
  }
}
