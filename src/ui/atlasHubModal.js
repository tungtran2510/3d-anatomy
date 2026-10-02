// Atlas 2027 Full-Screen Views & Media Hub Controller
// Mapped accurately to Visible Body / Human Anatomy Atlas (Atlas 2027) standards
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
import { toggleAppTheme, updateThemeButtons, isDarkTheme } from '../utils/themeManager.js';
import { setModelOrientation } from '../viewer/orientationManager.js';
import { setClippingPlane, disableClipping } from '../viewer/clipping.js';
import { normalise, searchStructures } from '../utils/dataLoader.js';

function escapeHtml(text) {
  if (!text) return '';
  return String(text)
    .replace(/&/g, '&amp;')
    .replace(/</g, '&lt;')
    .replace(/>/g, '&gt;')
    .replace(/"/g, '&quot;');
}

let hubModalEl = null;
let currentTab = 'views'; // 'views' | 'media' | 'quizzes'
let currentSubFilter = 'all'; // 'all' | 'systems' | 'regions'
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
    <div class="atlas-hub-panel" role="dialog" aria-modal="true" aria-label="Trung tâm góc nhìn và hoạt ảnh Atlas">
      
      <!-- Sleek 1-line Hub Header Frame -->
      <div class="atlas-hub-header">
        <div class="atlas-hub-brand-row">
          <div class="atlas-brand-badge">
            <span class="brand-cube-icon">
              <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path d="M21 16V8a2 2 0 0 0-1-1.73l-7-4a2 2 0 0 0-2 0l-7 4A2 2 0 0 0 3 8v8a2 2 0 0 0 1 1.73l7 4a2 2 0 0 0 2 0l7-4A2 2 0 0 0 21 16z"/><polyline points="3.27 6.96 12 12.01 20.73 6.96"/><line x1="12" y1="22.08" x2="12" y2="12"/></svg>
            </span>
            <h2 class="atlas-hub-title-1line">Thư Viện Atlas 3D</h2>
          </div>
          <div class="atlas-hub-header-actions">
            <button type="button" class="btn-hub-theme-toggle" id="btnHubThemeToggle" title="Chuyển chế độ Nền Sáng / Nền Tối">
              <span class="theme-icon">◐</span>
              <span class="theme-label">Giao diện</span>
            </button>
            <button type="button" class="btn-hub-offline-compact" id="btnHubOpenOffline" title="Tải toàn bộ thư viện về máy (Dùng Offline 100%)">
              <svg width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.2"><path d="M21 15v4a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-4"/><polyline points="7 10 12 15 17 10"/><line x1="12" y1="15" x2="12" y2="3"/></svg>
              <span>Tải Offline</span>
            </button>
            <button type="button" class="btn-launch-link-compact" id="btnHubLaunchLink" title="Sao chép liên kết góc nhìn 3D hiện tại">
              <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path d="M10 13a5 5 0 0 0 7.54.54l3-3a5 5 0 0 0-7.07-7.07l-1.72 1.71"/><path d="M14 11a5 5 0 0 0-7.54-.54l-3 3a5 5 0 0 0 7.07 7.07l1.71-1.71"/></svg>
              <span>Chia sẻ</span>
            </button>
            <button type="button" class="btn-hub-admin" id="btnHubAdmin" title="Quản trị Video & Dữ liệu Atlas (Mật khẩu: 123456)">
              <span class="admin-icon">🔐</span>
              <span class="admin-label">Quản trị</span>
            </button>
            <button type="button" class="atlas-hub-close" id="btnAtlasHubClose" aria-label="Đóng">&times;</button>
          </div>
        </div>

        <!-- KHỐI KHUNG 1: Segmented Navigation Control Frame -->
        <div class="atlas-hub-segmented-frame">
          <button type="button" class="atlas-main-tab active" data-tab="views" id="tabBtnViews">
            <svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path d="M21 16V8a2 2 0 0 0-1-1.73l-7-4a2 2 0 0 0-2 0l-7 4A2 2 0 0 0 3 8v8a2 2 0 0 0 1 1.73l7 4a2 2 0 0 0 2 0l7-4A2 2 0 0 0 21 16z"/><polyline points="3.27 6.96 12 12.01 20.73 6.96"/><line x1="12" y1="22.08" x2="12" y2="12"/></svg>
            <span>Góc nhìn 3D</span>
          </button>
          <button type="button" class="atlas-main-tab" data-tab="media" id="tabBtnMedia">
            <svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><circle cx="12" cy="12" r="10"/><polygon points="10 8 16 12 10 16 10 8" fill="currentColor"/></svg>
            <span>Hoạt ảnh & Video</span>
          </button>
          <button type="button" class="atlas-main-tab" data-tab="quizzes" id="tabBtnQuizzes">
            <svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><polyline points="9 11 12 14 22 4"/><path d="M21 12v7a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h11"/></svg>
            <span>Trắc nghiệm 3D</span>
          </button>
        </div>

        <!-- KHỐI KHUNG 2: Search & Filter Toolbox Frame -->
        <div class="atlas-hub-filter-frame">
          <div class="search-input-wrapper">
            <svg class="search-icon" width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><circle cx="11" cy="11" r="8"/><line x1="21" y1="21" x2="16.65" y2="16.65"/></svg>
            <input type="text" class="atlas-hub-search-input" id="atlasHubSearchInput" placeholder="Tìm nhanh cấu trúc (Dịch não tủy, Túi mật, Cột sống...)" autocomplete="off">
            <button type="button" class="hub-voice-mic-btn" id="btnHubVoiceMic" title="Tìm bằng giọng nói tiếng Việt">
              <svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.2"><path d="M12 2a3 3 0 0 0-3 3v7a3 3 0 0 0 6 0V5a3 3 0 0 0-3-3Z"/><path d="M19 10v2a7 7 0 0 1-14 0v-2"/><line x1="12" y1="19" x2="12" y2="22"/></svg>
            </button>
            <button type="button" class="search-clear-btn hidden" id="btnHubSearchClear" title="Xóa tìm kiếm">&times;</button>
          </div>
          <div class="atlas-subfilter-chips-row" id="atlasSubfilterChips">
            <span class="subfilter-chips-label">Lọc theo:</span>
            <div class="atlas-subfilter-chips">
              <button type="button" class="subchip active" data-sub="all">Tất cả</button>
              <button type="button" class="subchip" data-sub="systems">Hệ cơ quan</button>
              <button type="button" class="subchip" data-sub="regions">Phân vùng</button>
              <button type="button" class="subchip" data-sub="lab">Bàn mổ (Lab)</button>
              <button type="button" class="subchip" data-sub="cross_sections">Cắt lớp (Cross Sections)</button>
              <button type="button" class="subchip" data-sub="microanatomy">Vi thể & Da (Microanatomy)</button>
              <button type="button" class="subchip" data-sub="muscle_actions">Chuyển động (Muscle Actions)</button>
            </div>
          </div>
        </div>
      </div>

      <!-- Hub Scrollable Content Body -->
      <div class="atlas-hub-body" id="atlasHubBody">
        <!-- Rendered dynamically -->
      </div>

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
  const tabBtns = hubModalEl.querySelectorAll('.atlas-main-tab');
  const subChips = hubModalEl.querySelectorAll('.subchip');
  const launchLinkBtn = hubModalEl.querySelector('#btnHubLaunchLink');

  closeBtn?.addEventListener('click', closeAtlasHub);
  backdrop?.addEventListener('click', closeAtlasHub);

  window.addEventListener('keydown', (e) => {
    if (e.key === 'Escape' && hubModalEl && !hubModalEl.classList.contains('hidden')) {
      closeAtlasHub();
    }
  });

  tabBtns.forEach(btn => {
    btn.addEventListener('click', () => {
      tabBtns.forEach(b => b.classList.remove('active'));
      btn.classList.add('active');
      currentTab = btn.dataset.tab;
      
      // Update subchips visibility depending on tab
      const subChipsContainer = hubModalEl.querySelector('#atlasSubfilterChips');
      if (currentTab === 'views') {
        subChipsContainer.style.display = 'flex';
      } else {
        subChipsContainer.style.display = 'none';
      }

      renderHubContent(viewer);
    });
  });

  subChips.forEach(chip => {
    chip.addEventListener('click', () => {
      const targetSub = chip.dataset.sub;
      if (currentSubFilter === targetSub && targetSub !== 'all') {
        // Toggle OFF! Revert to 'all'
        currentSubFilter = 'all';
      } else {
        currentSubFilter = targetSub;
      }
      subChips.forEach(c => c.classList.toggle('active', c.dataset.sub === currentSubFilter));
      renderHubContent(viewer);
    });
  });

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
        showToast('🎙️ Đang nghe... Hãy nói tên bộ phận (VD: "dịch não tủy", "túi mật")');
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

  launchLinkBtn?.addEventListener('click', () => {
    copyLaunchLink();
  });

  const themeToggleBtn = hubModalEl.querySelector('#btnHubThemeToggle');
  themeToggleBtn?.addEventListener('click', () => {
    toggleAppTheme(viewer);
  });

  const hubOfflineBtn = hubModalEl.querySelector('#btnHubOpenOffline');
  hubOfflineBtn?.addEventListener('click', async () => {
    closeAtlasHub();
    const { openOfflineModal } = await import('./offlineModal.js');
    openOfflineModal(viewer);
  });

  const hubAdminBtn = hubModalEl.querySelector('#btnHubAdmin');
  hubAdminBtn?.addEventListener('click', () => {
    openAtlasAdmin(viewer);
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

  // Activate tab
  currentTab = targetTab;
  const tabBtns = hubModalEl.querySelectorAll('.atlas-main-tab');
  tabBtns.forEach(b => {
    b.classList.toggle('active', b.dataset.tab === currentTab);
  });

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
  } else if (currentTab === 'media') {
    renderMediaTab(body, viewer);
  } else if (currentTab === 'quizzes') {
    renderQuizzesTab(body, viewer);
  }
}

// 1. RENDER VIEWS TAB (Preset Views by Systems & Regions)
function renderViewsTab(container, viewer) {
  let html = '';
  const normQuery = normalise(searchQuery);

  // If user searched, show matching individual 3D structures first!
  if (normQuery && normQuery.length >= 2) {
    const matchedStructures = searchStructures(searchQuery, 12);
    if (matchedStructures.length > 0) {
      html += `
        <div class="atlas-view-section matched-structures-section">
          <div class="atlas-view-section-header">
            <div class="section-title-wrap">
              <span class="system-icon-mini">📍</span>
              <h3 class="section-heading">Cấu Trúc Giải Phẫu 3D Khớp Tìm Kiếm (${matchedStructures.length})</h3>
            </div>
            <span class="section-count">Nhấn để xem & định vị 3D</span>
          </div>
          <div class="atlas-structures-grid">
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
    }
  }

  // Filter Categories by search using normalized matching
  const filteredSystems = ATLAS_SYSTEMS_CATEGORIES.map(cat => {
    const matchedCards = cat.cards.filter(c => 
      !normQuery || 
      normalise(c.title).includes(normQuery) ||
      normalise(c.subtitle).includes(normQuery) ||
      (c.desc && normalise(c.desc).includes(normQuery)) ||
      normalise(cat.titleVi).includes(normQuery)
    );
    return { ...cat, cards: matchedCards };
  }).filter(cat => cat.cards.length > 0);

  const filteredRegions = ATLAS_REGIONS_CATEGORIES.filter(r =>
    !normQuery ||
    normalise(r.title).includes(normQuery) ||
    normalise(r.subtitle).includes(normQuery)
  );

  const filteredLab = ATLAS_LAB_CATEGORIES.filter(c =>
    !normQuery ||
    normalise(c.title).includes(normQuery) ||
    normalise(c.subtitle).includes(normQuery) ||
    (c.desc && normalise(c.desc).includes(normQuery))
  );

  const filteredCrossSections = ATLAS_CROSS_SECTIONS_CATEGORIES.map(group => {
    const matchedCards = group.cards.filter(c =>
      !normQuery ||
      normalise(c.title).includes(normQuery) ||
      normalise(c.subtitle).includes(normQuery) ||
      (c.desc && normalise(c.desc).includes(normQuery)) ||
      normalise(group.titleVi).includes(normQuery)
    );
    return { ...group, cards: matchedCards };
  }).filter(group => group.cards.length > 0);

  const filteredMicroanatomy = ATLAS_MICROANATOMY_CATEGORIES.map(group => {
    const matchedCards = group.cards.filter(c =>
      !normQuery ||
      normalise(c.title).includes(normQuery) ||
      normalise(c.subtitle).includes(normQuery) ||
      (c.desc && normalise(c.desc).includes(normQuery)) ||
      normalise(group.titleVi).includes(normQuery)
    );
    return { ...group, cards: matchedCards };
  }).filter(group => group.cards.length > 0);

  const filteredMuscleActions = ATLAS_MUSCLE_ACTIONS_CATEGORIES.map(group => {
    const matchedCards = group.cards.filter(c =>
      !normQuery ||
      normalise(c.title).includes(normQuery) ||
      normalise(c.subtitle).includes(normQuery) ||
      (c.desc && normalise(c.desc).includes(normQuery)) ||
      normalise(group.titleVi).includes(normQuery)
    );
    return { ...group, cards: matchedCards };
  }).filter(group => group.cards.length > 0);

  // Render Systems if selected
  if (currentSubFilter === 'all' || currentSubFilter === 'systems') {
    filteredSystems.forEach(cat => {
      html += `
        <div class="atlas-view-section">
          <div class="atlas-view-section-header">
            <div class="section-title-wrap">
              <span class="system-icon-mini">${ICONS[cat.systemKey] || ICONS.skeletal}</span>
              <h3 class="section-heading">${cat.titleVi}</h3>
            </div>
            <span class="section-count">${cat.cards.length} góc nhìn</span>
          </div>
          <div class="atlas-cards-grid">
            ${cat.cards.map(card => `
              <div class="atlas-view-card" data-view-id="${card.id}">
                <div class="card-thumb-banner">
                  <img class="card-thumb-img" src="${card.image || '/3d/images/atlas/skel_full.png'}" alt="${card.title}" loading="lazy" onerror="this.style.display='none'" />
                  <div class="thumb-badge">${card.badge}</div>
                </div>
                <div class="card-info">
                  <h4 class="card-title">${card.title}</h4>
                  <p class="card-subtitle">${card.subtitle}</p>
                </div>
              </div>
            `).join('')}
          </div>
        </div>
      `;
    });
  }

  // Render Cross Sections if selected (Image 4 Visible Body standard)
  if ((currentSubFilter === 'all' || currentSubFilter === 'cross_sections') && filteredCrossSections.length > 0) {
    filteredCrossSections.forEach(group => {
      html += `
        <div class="atlas-view-section">
          <div class="atlas-view-section-header">
            <div class="section-title-wrap">
              <span class="system-icon-mini">${ICONS.crossSection || '📐'}</span>
              <h3 class="section-heading">${group.titleVi}</h3>
            </div>
            <span class="section-count">${group.cards.length} lát cắt</span>
          </div>
          <div class="atlas-cards-grid">
            ${group.cards.map(card => `
              <div class="atlas-view-card cross-section-card" data-view-id="${card.id}">
                <div class="card-thumb-banner cross-thumb">
                  <img class="card-thumb-img" src="${card.image || '/3d/images/atlas/nerv_brain.png'}" alt="${card.title}" loading="lazy" onerror="this.style.display='none'" />
                  <div class="thumb-badge cross-badge">${card.badge}</div>
                </div>
                <div class="card-info">
                  <h4 class="card-title">${card.title}</h4>
                  <p class="card-subtitle">${card.subtitle}</p>
                </div>
              </div>
            `).join('')}
          </div>
        </div>
      `;
    });
  }

  // Render Microanatomy & Skin Layers if selected (Image 1 Visible Body standard)
  if ((currentSubFilter === 'all' || currentSubFilter === 'microanatomy') && filteredMicroanatomy.length > 0) {
    filteredMicroanatomy.forEach(group => {
      html += `
        <div class="atlas-view-section">
          <div class="atlas-view-section-header">
            <div class="section-title-wrap">
              <span class="system-icon-mini">${ICONS.microanatomy || '🔬'}</span>
              <h3 class="section-heading">${group.titleVi}</h3>
            </div>
            <span class="section-count">${group.cards.length} vi thể</span>
          </div>
          <div class="atlas-cards-grid">
            ${group.cards.map(card => `
              <div class="atlas-view-card micro-card" data-view-id="${card.id}">
                <div class="card-thumb-banner micro-thumb">
                  <img class="card-thumb-img" src="${card.image || '/3d/images/atlas/med_skin.png'}" alt="${card.title}" loading="lazy" onerror="this.style.display='none'" />
                  <div class="thumb-badge micro-badge">${card.badge}</div>
                </div>
                <div class="card-info">
                  <h4 class="card-title">${card.title}</h4>
                  <p class="card-subtitle">${card.subtitle}</p>
                </div>
              </div>
            `).join('')}
          </div>
        </div>
      `;
    });
  }

  // Render Muscle Actions if selected (Image 2 & 3 Visible Body standard)
  if ((currentSubFilter === 'all' || currentSubFilter === 'muscle_actions') && filteredMuscleActions.length > 0) {
    filteredMuscleActions.forEach(group => {
      html += `
        <div class="atlas-view-section">
          <div class="atlas-view-section-header">
            <div class="section-title-wrap">
              <span class="system-icon-mini">${ICONS.muscleAction || '💪'}</span>
              <h3 class="section-heading">${group.titleVi}</h3>
            </div>
            <span class="section-count">${group.cards.length} chuyển động</span>
          </div>
          <div class="atlas-cards-grid">
            ${group.cards.map(card => `
              <div class="atlas-view-card action-card" data-view-id="${card.id}">
                <div class="card-thumb-banner action-thumb">
                  <img class="card-thumb-img" src="${card.image || '/3d/images/atlas/musc_torso.png'}" alt="${card.title}" loading="lazy" onerror="this.style.display='none'" />
                  <div class="thumb-badge action-badge">${card.badge}</div>
                </div>
                <div class="card-info">
                  <h4 class="card-title">${card.title}</h4>
                  <p class="card-subtitle">${card.subtitle}</p>
                </div>
              </div>
            `).join('')}
          </div>
        </div>
      `;
    });
  }

  // Render Gross Anatomy Lab if selected
  if ((currentSubFilter === 'all' || currentSubFilter === 'lab') && filteredLab.length > 0) {
    html += `
      <div class="atlas-view-section">
        <div class="atlas-view-section-header">
          <div class="section-title-wrap">
            <span class="system-icon-mini">🗄️</span>
            <h3 class="section-heading">Bàn Phẫu Tích Y Khoa (Gross Anatomy Cadaver Lab)</h3>
          </div>
          <span class="section-count">${filteredLab.length} góc mổ</span>
        </div>
        <div class="atlas-cards-grid">
          ${filteredLab.map(card => `
            <div class="atlas-view-card lab-card" data-view-id="${card.id}">
              <div class="card-thumb-banner lab-thumb">
                <img class="card-thumb-img" src="${card.image || '/3d/images/atlas/reg_thorax.png'}" alt="${card.title}" loading="lazy" onerror="this.style.display='none'" />
                <div class="thumb-badge lab-badge">${card.badge}</div>
              </div>
              <div class="card-info">
                <h4 class="card-title">${card.title}</h4>
                <p class="card-subtitle">${card.subtitle}</p>
              </div>
            </div>
          `).join('')}
        </div>
      </div>
    `;
  }

  // Render Regions if selected
  if ((currentSubFilter === 'all' || currentSubFilter === 'regions') && filteredRegions.length > 0) {
    html += `
      <div class="atlas-view-section">
        <div class="atlas-view-section-header">
          <div class="section-title-wrap">
            <span class="system-icon-mini">${ICONS.regionWhole}</span>
            <h3 class="section-heading">Phân Vùng Cơ Thể</h3>
          </div>
          <span class="section-count">${filteredRegions.length} phân vùng</span>
        </div>
        <div class="atlas-cards-grid">
          ${filteredRegions.map(reg => `
            <div class="atlas-view-card region-card" data-region-id="${reg.id}">
              <div class="card-thumb-banner region-thumb">
                <img class="card-thumb-img" src="${reg.image || '/3d/images/atlas/reg_head_neck.png'}" alt="${reg.title}" loading="lazy" onerror="this.style.display='none'" />
                <div class="thumb-badge">${reg.badge}</div>
              </div>
              <div class="card-info">
                <h4 class="card-title">${reg.title}</h4>
                <p class="card-subtitle">${reg.subtitle}</p>
              </div>
            </div>
          `).join('')}
        </div>
      </div>
    `;
  }

  if (!html) {
    html = `
      <div class="atlas-empty-state">
        <svg width="48" height="48" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.5"><circle cx="11" cy="11" r="8"/><line x1="21" y1="21" x2="16.65" y2="16.65"/></svg>
        <p>Không tìm thấy góc nhìn nào phù hợp với từ khóa "<strong>${escapeHtml(searchQuery)}</strong>".</p>
      </div>
    `;
  }

  container.innerHTML = html;

  // Bind Matched 3D Structure Click Events
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

  // Bind View Card Click Events
  container.querySelectorAll('.atlas-view-card').forEach(cardEl => {
    cardEl.addEventListener('click', () => {
      const viewId = cardEl.dataset.viewId;
      const regId = cardEl.dataset.regionId;

      if (viewId) {
        let targetCard = null;
        for (const cat of ATLAS_SYSTEMS_CATEGORIES) {
          const found = cat.cards.find(c => c.id === viewId);
          if (found) { targetCard = found; break; }
        }
        if (!targetCard) {
          targetCard = ATLAS_LAB_CATEGORIES.find(c => c.id === viewId);
        }
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


// 2. RENDER MEDIA TAB (Photo 5: Patient Education Animations & 3D Biomechanics)
function renderMediaTab(container, viewer) {
  const mediaCategories = getAtlasMediaCategories();
  let totalCards = 0;
  mediaCategories.forEach(c => totalCards += (c.cards ? c.cards.length : 0));

  let html = `
    <div class="media-admin-quick-bar">
      <div class="media-admin-bar-info">
        <span class="media-count-badge">🎬 ${totalCards} Hoạt Ảnh & Video Y Khoa</span>
        <span class="media-count-sub">(Đồng bộ 12 chuyên đề lâm sàng Atlas)</span>
      </div>
      <button type="button" class="btn-media-admin-shortcut" id="btnMediaAdminShortcut" title="Mở bảng quản trị để thêm/sửa link video">
        <span>⚙️ Quản trị & Sửa link video (Pass: 123456)</span>
      </button>
    </div>
  `;

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

  filteredMedia.forEach(cat => {
    html += `
      <div class="atlas-view-section">
        <div class="atlas-view-section-header">
          <div class="section-title-wrap">
            <span class="system-icon-mini">
              <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><circle cx="12" cy="12" r="10"/><polygon points="10 8 16 12 10 16 10 8" fill="currentColor"/></svg>
            </span>
            <h3 class="section-heading">${cat.titleVi}</h3>
          </div>
          <span class="section-count">${cat.cards.length} hoạt ảnh</span>
        </div>
        <div class="atlas-cards-grid">
          ${cat.cards.map(card => `
            <div class="atlas-view-card media-card" data-media-id="${card.id}">
              <div class="card-thumb-banner media-thumb ${card.type === 'motion' ? 'motion-accent' : ''}">
                <img class="card-thumb-img" src="${card.image || './images/atlas/med_skin.png'}" alt="${card.title}" loading="lazy" onerror="this.src='./images/atlas/med_skin.png'" />
                <div class="thumb-badge">${card.badge || 'Video'}</div>
                <div class="thumb-duration-pill">
                  <svg width="11" height="11" viewBox="0 0 24 24" fill="currentColor"><polygon points="5 3 19 12 5 21 5 3"/></svg>
                  <span>${card.duration || '0:30'}</span>
                </div>
                <div class="media-play-indicator">
                  <svg width="26" height="26" viewBox="0 0 24 24" fill="currentColor"><circle cx="12" cy="12" r="11" fill="rgba(0,0,0,0.6)"/><polygon points="9.5 7.5 16.5 12 9.5 16.5 9.5 7.5" fill="#38bdf8"/></svg>
                </div>
              </div>
              <div class="card-info">
                <h4 class="card-title">${card.title}</h4>
                <p class="card-subtitle">${card.subtitle || ''}</p>
              </div>
            </div>
          `).join('')}
        </div>
      </div>
    `;
  });

  if (filteredMedia.length === 0) {
    html += `
      <div class="atlas-empty-state">
        <svg width="48" height="48" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.5"><circle cx="11" cy="11" r="8"/><line x1="21" y1="21" x2="16.65" y2="16.65"/></svg>
        <p>Không tìm thấy hoạt ảnh y khoa nào phù hợp với "<strong>${searchQuery}</strong>".</p>
      </div>
    `;
  }

  container.innerHTML = html;

  // Bind Admin Shortcut Button
  container.querySelector('#btnMediaAdminShortcut')?.addEventListener('click', () => {
    openAtlasAdmin(viewer);
  });

  // Bind Media Card Click Events
  container.querySelectorAll('.media-card').forEach(cardEl => {
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


// 3. RENDER QUIZZES TAB
function renderQuizzesTab(container, viewer) {
  let html = `
    <div class="atlas-view-section">
      <div class="atlas-view-section-header">
        <div class="section-title-wrap">
          <span class="system-icon-mini">
            <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><polyline points="9 11 12 14 22 4"/><path d="M21 12v7a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h11"/></svg>
          </span>
          <h3 class="section-heading">Hệ Thống Trắc Nghiệm & Kiểm Tra Kiến Thức 3D</h3>
        </div>
      </div>
      <div class="atlas-cards-grid">
        ${ATLAS_QUIZZES_DATA.map(q => `
          <div class="atlas-view-card hub-quiz-card" data-quiz-id="${q.id}">
            <div class="card-thumb-banner quiz-thumb">
              <img class="card-thumb-img" src="${q.image || '/3d/images/atlas/quiz_identify.png'}" alt="${q.title}" loading="lazy" onerror="this.style.display='none'" />
              <div class="thumb-badge">${q.badge}</div>
            </div>
            <div class="card-info">
              <h4 class="card-title">${q.title}</h4>
              <p class="card-subtitle">${q.subtitle}</p>
            </div>
          </div>
        `).join('')}
      </div>
    </div>
  `;

  container.innerHTML = html;

  container.querySelectorAll('.hub-quiz-card').forEach(cardEl => {
    cardEl.addEventListener('click', () => {
      const qId = cardEl.dataset.quizId;
      closeAtlasHub();
      if (qId === 'quiz_identify') {
        document.getElementById('btnToolQuiz')?.click();
      } else if (qId === 'quiz_fsrs') {
        document.getElementById('btnToolStudy')?.click();
      } else {
        document.getElementById('btnToolStudy')?.click();
      }
    });
  });
}

// ACTION: Apply 3D View Preset
async function applyAtlasView(card, viewer) {
  closeAtlasHub();
  showToast(`🎯 Đang tải góc nhìn: ${card.title}...`);

  const activeViewer = viewer || state.viewer || window.viewer;
  if (!activeViewer) return;

  try {
    // 1. Load requested systems
    const systemsToLoad = card.systems || ['skeletal'];
    for (const sys of systemsToLoad) {
      if (!state.loadedSystems.includes(sys)) {
        await loadModel(sys, activeViewer);
      }
      showSystem(sys);
    }

    // Hide systems not in view
    ['skeletal', 'muscular', 'joints', 'cardiovascular', 'lymphatic', 'nervous', 'visceral'].forEach(sys => {
      if (!systemsToLoad.includes(sys)) {
        hideSystem(sys);
      }
    });

    // 2. Set Model Orientation & Dissection Table
    setModelOrientation(card.orientation || 'standing', activeViewer, { showTable: !!card.showTable });

    // 3. Handle Cross-Section Clipping vs Kinematic Muscle Action vs Normal View
    if (card.plane) {
      closeMotionPanel();
      setClippingPlane(card.plane, card.offset !== undefined ? card.offset : 0, false, activeViewer, true);
      document.getElementById('btnToolClipping')?.classList.add('active');
      const popover = document.getElementById('clippingPopover');
      if (popover) {
        popover.classList.remove('hidden');
        const planeBtns = popover.querySelectorAll('.clipping-plane-select .plane-btn');
        planeBtns.forEach(btn => {
          btn.classList.toggle('active', btn.dataset.plane === card.plane);
        });
        const slider = document.getElementById('clippingSlider');
        const valLabel = document.getElementById('clippingValue');
        if (slider) {
          if (card.plane === 'axial') {
            slider.min = '0.0';
            slider.max = '1.8';
            slider.step = '0.01';
          } else if (card.plane === 'coronal') {
            slider.min = '-0.3';
            slider.max = '0.3';
            slider.step = '0.01';
          } else {
            slider.min = '-0.4';
            slider.max = '0.4';
            slider.step = '0.01';
          }
          slider.value = card.offset !== undefined ? card.offset : 0;
        }
        if (valLabel) {
          const off = card.offset !== undefined ? card.offset : 0;
          valLabel.textContent = `${(off * 100).toFixed(1)} cm`;
        }
      }
      import('./radiologicalScout.js').then(({ showScoutView }) => {
        showScoutView(card, card.plane, card.offset);
      });
    } else if (card.motionId) {
      import('./radiologicalScout.js').then(({ hideScoutView }) => {
        hideScoutView();
      });
      disableClipping(activeViewer);
      const popover = document.getElementById('clippingPopover');
      if (popover) popover.classList.add('hidden');
      document.getElementById('btnToolClipping')?.classList.remove('active');
      openMotionPanel(activeViewer, card.motionId);
    } else {
      import('./radiologicalScout.js').then(({ hideScoutView }) => {
        hideScoutView();
      });
      disableClipping(activeViewer);
      const popover = document.getElementById('clippingPopover');
      if (popover) popover.classList.add('hidden');
      document.getElementById('btnToolClipping')?.classList.remove('active');
      closeMotionPanel();
    }

    // 4. Animate camera
    if (card.camera) {
      const cam = card.camera;
      const { camera, controls } = activeViewer;
      const targetPos = { x: cam.x, y: cam.y, z: cam.z };
      const targetLook = { x: cam.targetX || 0, y: cam.targetY || cam.y, z: cam.targetZ || 0 };

      animateCameraTo(camera, controls, targetPos, targetLook);
    }

    // 5. Highlight specific part if present, or deselect
    if (card.highlight) {
      setTimeout(() => {
        const ok = selectPartById(card.highlight, activeViewer, false, true);
        if (!ok) {
          setTimeout(() => selectPartById(card.highlight, activeViewer, false, true), 350);
        }
      }, 350);
    } else {
      deselectPart(true);
    }

    activeViewer.render();
  } catch (err) {
    console.error('Error applying atlas view:', err);
    showToast(`Đã mở góc nhìn: ${card.title}`);
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
  const popover = document.getElementById('clippingPopover');
  if (popover) popover.classList.add('hidden');
  closeMotionPanel();

  if (currentActiveRegionId === reg.id) {
    // Toggle OFF: revert to front whole body view!
    currentActiveRegionId = null;
    setView('front', activeViewer);
    showToast(`Đã tắt phân vùng: ${reg.title} - Trở về toàn thân`);
    activeViewer.render();
    return;
  }

  currentActiveRegionId = reg.id;
  showToast(`🎯 Chuyển phân vùng: ${reg.title}...`);

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

// ACTION: Apply Media (3D Biomechanics Motion or Clinical Video)
function applyAtlasMedia(media, viewer) {
  closeAtlasHub();

  const activeViewer = viewer || state.viewer || window.viewer;
  if (media.type === 'motion') {
    disableClipping(activeViewer);
    const popover = document.getElementById('clippingPopover');
    if (popover) popover.classList.add('hidden');
    showToast(`▶️ Đang khởi chạy mô phỏng 3D: ${media.title}`);
    openMotionPanel(activeViewer, media.motionType);
  } else if (media.type === 'video') {
    closeMotionPanel();
    showToast(`🎬 Đang phát video y khoa: ${media.title}`);
    openVideoModal(media.videoUrl, media.title);
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
    const ease = 1 - Math.pow(1 - t, 3); // ease-out cubic

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
