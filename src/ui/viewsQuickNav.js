// Views Quick Switcher (<| Views |>) Controller
// Inspired by Visible Body gold-standard quick view cycler
import { openAtlasHub } from './atlasHubModal.js';
import { showToast } from './sidebar.js';
import {
  ATLAS_CROSS_SECTIONS_CATEGORIES,
  ATLAS_REGIONS_CATEGORIES,
  ATLAS_SYSTEMS_CATEGORIES,
  ATLAS_MUSCLE_ACTIONS_CATEGORIES
} from '../data/atlasViewsData.js';

let quickNavEl = null;
let currentViewList = [];
let currentViewIndex = 0;
let currentViewer = null;

// Collect all cross sections by default as initial quick set
function getDefaultQuickViews() {
  const views = [];
  ATLAS_CROSS_SECTIONS_CATEGORIES.forEach(group => {
    views.push(...group.cards);
  });
  return views;
}

export function initViewsQuickNav(viewer) {
  currentViewer = viewer;
  if (quickNavEl) return;

  const container = document.getElementById('viewerContainer');
  if (!container) return;

  currentViewList = getDefaultQuickViews();
  currentViewIndex = 0;

  quickNavEl = document.getElementById('floatingViewsQuickNav');
  if (!quickNavEl) {
    quickNavEl = document.createElement('div');
    quickNavEl.className = 'floating-views-quick-nav';
    quickNavEl.id = 'floatingViewsQuickNav';
    quickNavEl.innerHTML = `
      <button type="button" class="btn-quick-nav-arrow" id="btnQuickNavPrev" title="Góc nhìn trước (<)">
        <svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5"><polyline points="15 18 9 12 15 6"/></svg>
      </button>
      <button type="button" class="btn-quick-nav-title" id="btnQuickNavTitle" title="Mở danh mục góc nhìn & hoạt ảnh (Views)">
        <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path d="M21 16V8a2 2 0 0 0-1-1.73l-7-4a2 2 0 0 0-2 0l-7 4A2 2 0 0 0 3 8v8a2 2 0 0 0 1 1.73l7 4a2 2 0 0 0 2 0l7-4A2 2 0 0 0 21 16z"/></svg>
        <span id="quickNavLabel">Góc nhìn</span>
      </button>
      <button type="button" class="btn-quick-nav-arrow" id="btnQuickNavNext" title="Góc nhìn tiếp theo (>)">
        <svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5"><polyline points="9 18 15 12 9 6"/></svg>
      </button>
    `;
    container.appendChild(quickNavEl);
  }

  quickNavEl.querySelector('#btnQuickNavPrev')?.addEventListener('click', (e) => {
    e.stopPropagation();
    navigateQuickView(-1, viewer);
  });

  quickNavEl.querySelector('#btnQuickNavNext')?.addEventListener('click', (e) => {
    e.stopPropagation();
    navigateQuickView(1, viewer);
  });

  quickNavEl.querySelector('#btnQuickNavTitle')?.addEventListener('click', (e) => {
    e.stopPropagation();
    openAtlasHub(viewer, 'views');
  });
}

export function setQuickNavContext(list, activeIndex = 0, categoryName = 'Góc nhìn') {
  if (Array.isArray(list) && list.length > 0) {
    currentViewList = list;
    currentViewIndex = Math.max(0, Math.min(activeIndex, list.length - 1));
    const label = document.getElementById('quickNavLabel');
    if (label) {
      label.textContent = categoryName;
    }
  }
}

export function navigateQuickView(delta, viewer) {
  if (!currentViewList || currentViewList.length === 0) {
    currentViewList = getDefaultQuickViews();
  }

  const newIdx = (currentViewIndex + delta + currentViewList.length) % currentViewList.length;
  currentViewIndex = newIdx;
  const targetCard = currentViewList[currentViewIndex];

  if (!targetCard) return;

  const v = viewer || currentViewer || window.viewer;
  showToast(`👁️ ${targetCard.title} (${currentViewIndex + 1}/${currentViewList.length})`);

  // Dynamically trigger applyAtlasView from atlasHubModal
  import('./atlasHubModal.js').then(({ applyAtlasViewDirect }) => {
    if (applyAtlasViewDirect) {
      applyAtlasViewDirect(targetCard, v);
    }
  });
}
