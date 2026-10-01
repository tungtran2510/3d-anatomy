// Systems +/- Layer Stepper Controller (Complete Anatomy / Visible Body style)
// Allows gradual layer-by-layer opening and closing of each anatomical system.
// Features a collapsible left-edge pull tab: "Phân lớp +/-"
// Ultra-optimized for 60fps instant responsiveness with solid anatomical colors.

import { state, batchPartStates } from '../state/store.js';
import { loadModel } from '../viewer/loadModel.js';
import { showSystem, hideSystem, setStructureVisible } from '../viewer/visibility.js';
import { setView, frameRegion } from '../viewer/camera.js';
import { getSubSystemParts } from './sidebar.js';
import { getMeshesBySystem } from '../viewer/loadModel.js';
import { ICONS } from './icons.js';

const SYSTEM_CONFIGS = [
  { id: 'skeletal', icon: ICONS.skeletal, nameVi: 'Hệ Xương', shortNameVi: 'XƯƠNG', maxLevels: 4, defaultLevel: 4, baseSystem: 'skeletal' },
  { id: 'joints', icon: ICONS.joints, nameVi: 'Khớp & Dây chằng', shortNameVi: 'KHỚP', maxLevels: 4, defaultLevel: 0, baseSystem: 'joints' },
  { id: 'muscular', icon: ICONS.muscular, nameVi: 'Hệ Cơ bắp', shortNameVi: 'CƠ BẮP', maxLevels: 4, defaultLevel: 0, baseSystem: 'muscular' },
  { id: 'nervous', icon: ICONS.nervous, nameVi: 'Não & Thần kinh', shortNameVi: 'THẦN KINH', maxLevels: 4, defaultLevel: 0, baseSystem: 'nervous' },
  { id: 'cardiovascular', icon: ICONS.cardiovascular, nameVi: 'Hệ Tim mạch', shortNameVi: 'TIM MẠCH', maxLevels: 4, defaultLevel: 0, baseSystem: 'cardiovascular' },
  { id: 'respiratory', icon: ICONS.respiratory, nameVi: 'Hệ Hô hấp (Phổi)', shortNameVi: 'HÔ HẤP', maxLevels: 4, defaultLevel: 0, baseSystem: 'visceral', subType: 'respiratory' },
  { id: 'digestive', icon: ICONS.digestive, nameVi: 'Hệ Tiêu hóa (Gan, Ruột)', shortNameVi: 'TIÊU HÓA', maxLevels: 4, defaultLevel: 0, baseSystem: 'visceral', subType: 'digestive' },
  { id: 'urinary_genital', icon: ICONS.urinary_genital, nameVi: 'Tiết niệu & Sinh dục', shortNameVi: 'TIẾT NIỆU', maxLevels: 4, defaultLevel: 0, baseSystem: 'visceral', subType: 'urinary_genital' },
  { id: 'endocrine', icon: ICONS.endocrine, nameVi: 'Hệ Nội tiết', shortNameVi: 'NỘI TIẾT', maxLevels: 4, defaultLevel: 0, baseSystem: 'visceral', subType: 'endocrine' },
  { id: 'lymphatic', icon: ICONS.lymphatic, nameVi: 'Hệ Bạch huyết', shortNameVi: 'BẠCH HUYẾT', maxLevels: 4, defaultLevel: 0, baseSystem: 'lymphatic' }
];

const systemLevels = {
  skeletal: 4,
  joints: 0,
  muscular: 0,
  nervous: 0,
  cardiovascular: 0,
  respiratory: 0,
  digestive: 0,
  urinary_genital: 0,
  endocrine: 0,
  lymphatic: 0
};

const SUPERFICIAL_KEYWORDS = [
  'fascia', 'retinaculum', 'mạc', 'cân',
  'pectoralis major', 'ngực lớn',
  'deltoid', 'cơ delta',
  'rectus abdominis', 'thẳng bụng',
  'external oblique', 'chéo bụng ngoài',
  'trapezius', 'cơ thang',
  'latissimus', 'lưng rộng',
  'gluteus maximus', 'mông lớn',
  'biceps brachii', 'nhị đầu cánh tay',
  'gastrocnemius', 'bụng chân',
  'platysma', 'cơ bám da cổ'
];

let superficialPartsCache = null;
function getSuperficialParts() {
  if (superficialPartsCache && superficialPartsCache.length > 0) {
    return superficialPartsCache;
  }
  const nodes = getMeshesBySystem('muscular') || [];
  const partSet = new Set();
  nodes.forEach(node => {
    const partId = node.userData?.partId;
    if (!partId) return;
    const lower = partId.toLowerCase();
    if (SUPERFICIAL_KEYWORDS.some(kw => lower.includes(kw))) {
      partSet.add(partId);
    }
  });
  superficialPartsCache = Array.from(partSet);
  return superficialPartsCache;
}

const loadingSystems = new Set();
let drawerEl = null;
let pullTabEl = null;
let isDrawerOpen = false;

export function initSystemsLayerController(viewer) {
  const container = document.getElementById('viewerContainer');
  if (!container || drawerEl) return;

  // 1. Pull Tab on Left Edge (Modern Clean Medical Style)
  pullTabEl = document.createElement('button');
  pullTabEl.id = 'systemsPullTab';
  pullTabEl.className = 'systems-pull-tab';
  pullTabEl.title = 'Mở bảng phân lớp giải phẫu (Phân lớp +/-)';
  pullTabEl.innerHTML = `
    <span class="tab-body-icon">${ICONS.humanAnatomy}</span>
    <span class="tab-vertical-text">Phân lớp +/-</span>
  `;
  container.appendChild(pullTabEl);

  // 2. Sliding Systems Stepper Panel - Slim Medical Sidebar
  drawerEl = document.createElement('div');
  drawerEl.id = 'systemsStepperDrawer';
  drawerEl.className = 'systems-stepper-drawer hidden';
  drawerEl.innerHTML = `
    <div class="stepper-drawer-header">
      <div class="stepper-header-title">
        <span class="region-label">PHÂN VÙNG</span>
        <button type="button" class="btn-stepper-close" id="btnStepperClose" data-id="systemsDrawerCloseBtn" title="Đóng bảng phân lớp">✕</button>
      </div>
      <!-- Quick Region Selector Icons (Clean 5-zone switcher) -->
      <div class="stepper-regions-row">
        <button type="button" class="btn-region-chip active" data-region="whole" title="Toàn thân trước">
          <span>${ICONS.regionWhole}</span>
        </button>
        <button type="button" class="btn-region-chip" data-region="back" title="Toàn thân sau">
          <span>${ICONS.regionBack}</span>
        </button>
        <button type="button" class="btn-region-chip" data-region="head" title="Đầu cổ">
          <span>${ICONS.regionHead}</span>
        </button>
        <button type="button" class="btn-region-chip" data-region="torso" title="Lồng ngực">
          <span>${ICONS.regionTorso}</span>
        </button>
        <button type="button" class="btn-region-chip" data-region="pelvis" title="Vùng chậu">
          <span>${ICONS.regionPelvis}</span>
        </button>
      </div>
    </div>

    <!-- Systems Steppers List with Clear Vietnamese Labels -->
    <div class="stepper-systems-list" id="stepperSystemsList">
      ${renderSystemRows()}
    </div>
  `;
  container.appendChild(drawerEl);

  setupEvents(viewer);
  syncStateWithLoadedSystems();
}

function renderSystemRows() {
  return SYSTEM_CONFIGS.map(sys => {
    const lvl = systemLevels[sys.id] || 0;
    return `
      <div class="system-stepper-item ${lvl > 0 ? 'is-active' : ''}" data-system="${sys.id}">
        <div class="stepper-item-header">
          <span class="system-name-tag">${sys.shortNameVi}</span>
        </div>
        <div class="stepper-controls-row">
          <button type="button" class="btn-stepper-dec minus stepper-btn" data-action="dec" data-sys="${sys.id}" data-system="${sys.id}" title="Giảm lớp ${sys.nameVi}" ${lvl <= 0 ? 'disabled' : ''}>
            —
          </button>
          <button type="button" class="btn-stepper-icon ${lvl > 0 ? 'active' : ''}" data-action="toggle" data-sys="${sys.id}" data-system="${sys.id}" title="${sys.nameVi} (Bật / Tắt)">
            <span class="sys-icon">${sys.icon}</span>
            <span class="sys-loading-spinner hidden"></span>
          </button>
          <button type="button" class="btn-stepper-inc plus stepper-btn" data-action="inc" data-sys="${sys.id}" data-system="${sys.id}" title="Tăng lớp ${sys.nameVi}" ${lvl >= 4 ? 'disabled' : ''}>
            +
          </button>
        </div>
        <div class="stepper-level-segments" id="segments_${sys.id}">
          ${renderSegments(lvl, sys.maxLevels)}
        </div>
      </div>
    `;
  }).join('');
}

function renderSegments(currentLevel, maxLevels) {
  let html = '';
  for (let i = 1; i <= maxLevels; i++) {
    const isFilled = i <= currentLevel;
    html += `<span class="level-segment ${isFilled ? 'filled' : ''}"></span>`;
  }
  return html;
}

function setupEvents(viewer) {
  // Toggle Drawer via Pull Tab
  pullTabEl?.addEventListener('click', (e) => {
    e.stopPropagation();
    toggleDrawer();
  });

  // Close Drawer via Close Button
  drawerEl?.querySelector('#btnStepperClose')?.addEventListener('click', (e) => {
    e.stopPropagation();
    closeDrawer();
  });

  // Clicking / touching anywhere outside drawer smoothly dismisses it
  const handleOutsideDismiss = (e) => {
    if (isDrawerOpen && drawerEl && !drawerEl.contains(e.target) && !pullTabEl?.contains(e.target)) {
      closeDrawer();
    }
  };
  document.addEventListener('pointerdown', handleOutsideDismiss, { passive: true });

  // Region View Buttons
  const regionButtons = drawerEl?.querySelectorAll('.btn-region-chip');
  regionButtons?.forEach(btn => {
    btn.addEventListener('click', () => {
      const reg = btn.dataset.region;
      const wasActive = btn.classList.contains('active');

      if (wasActive && reg !== 'whole') {
        regionButtons.forEach(b => b.classList.remove('active'));
        drawerEl.querySelector('.btn-region-chip[data-region="whole"]')?.classList.add('active');
        setView('front', viewer);
        return;
      }

      regionButtons.forEach(b => b.classList.remove('active'));
      btn.classList.add('active');

      if (reg === 'whole') setView('front', viewer);
      else if (reg === 'back') setView('back', viewer);
      else if (reg === 'head') frameRegion({ x: 0, y: 1.6, z: 0.7, targetX: 0, targetY: 1.55, targetZ: 0 }, viewer);
      else if (reg === 'torso') frameRegion({ x: 0, y: 1.25, z: 1.0, targetX: 0, targetY: 1.25, targetZ: 0 }, viewer);
      else if (reg === 'pelvis') frameRegion({ x: 0, y: 0.95, z: 0.9, targetX: 0, targetY: 0.92, targetZ: 0 }, viewer);
    });
  });

  // Stepper Actions (+, -, Icon toggle)
  drawerEl?.querySelector('#stepperSystemsList')?.addEventListener('click', async (e) => {
    const btn = e.target.closest('button');
    if (!btn || btn.disabled) return;
    const action = btn.dataset.action;
    const sysId = btn.dataset.system;
    if (!action || !sysId) return;

    if (action === 'inc') {
      await incrementSystemLevel(sysId, viewer);
    } else if (action === 'dec') {
      await decrementSystemLevel(sysId, viewer);
    } else if (action === 'toggle') {
      await toggleSystemLevel(sysId, viewer);
    }
  });
}

export function openDrawer() {
  if (!drawerEl) return;
  drawerEl.classList.remove('hidden');
  drawerEl.classList.add('open');
  pullTabEl?.classList.add('drawer-open');
  isDrawerOpen = true;
}

export function closeDrawer() {
  if (!drawerEl) return;
  drawerEl.classList.remove('open');
  drawerEl.classList.add('hidden');
  pullTabEl?.classList.remove('drawer-open');
  isDrawerOpen = false;
}

export function toggleDrawer() {
  if (isDrawerOpen) {
    closeDrawer();
  } else {
    openDrawer();
  }
}

async function incrementSystemLevel(systemId, viewer) {
  const current = systemLevels[systemId] || 0;
  if (current >= 4) return;
  const next = current + 1;
  await applySystemLevel(systemId, next, viewer);
}

async function decrementSystemLevel(systemId, viewer) {
  const current = systemLevels[systemId] || 0;
  if (current <= 0) return;
  const next = current - 1;
  await applySystemLevel(systemId, next, viewer);
}

async function toggleSystemLevel(systemId, viewer) {
  const current = systemLevels[systemId] || 0;
  const next = current > 0 ? 0 : 4;
  await applySystemLevel(systemId, next, viewer);
}

async function applySystemLevel(systemId, level, viewer) {
  if (loadingSystems.has(systemId)) return;
  systemLevels[systemId] = level;

  // Immediate optimistic UI response - zero perceived latency
  updateItemUI(systemId);

  const cfg = SYSTEM_CONFIGS.find(s => s.id === systemId);
  const baseSys = cfg?.baseSystem || systemId;

  // 1. If level > 0 and base system not loaded, load it dynamically
  if (level > 0 && !state.loadedSystems.includes(baseSys)) {
    loadingSystems.add(systemId);
    setItemLoading(systemId, true);
    try {
      await loadModel(baseSys, viewer);
    } catch (err) {
      console.error(`[systemsLayer] Failed to load model for ${baseSys}:`, err);
    } finally {
      loadingSystems.delete(systemId);
      setItemLoading(systemId, false);
    }
  }

  // 2. Adjust visibility with solid, crisp, authentic medical colors (NO alpha transparency lag!)
  batchPartStates(() => {
    if (cfg?.subType) {
      // Sub-visceral system: respiratory, digestive, urinary_genital, endocrine
      const parts = getSubSystemParts(cfg.subType);
      const isVisible = level > 0;
      parts.forEach(id => setStructureVisible(id, isVisible));
    } else {
      // Standard full system
      if (level === 0) {
        hideSystem(systemId);
      } else {
        showSystem(systemId);

        // Muscular multi-level anatomical depth layering:
        // Level 1-2: Core/Deep muscles (bóc tách cơ nông)
        // Level 3-4: Full muscular coverage (tất cả cơ bắp nguyên bản)
        if (systemId === 'muscular') {
          const superficial = getSuperficialParts();
          if (level <= 2) {
            superficial.forEach(id => setStructureVisible(id, false));
          } else {
            superficial.forEach(id => setStructureVisible(id, true));
          }
        }
      }
    }
  });

  // 3. Final DOM update & immediate render frame
  updateItemUI(systemId);
  viewer?.invalidate?.(5);
  if (typeof viewer?.render === 'function') viewer.render();
}

function setItemLoading(systemId, isLoading) {
  const itemEl = drawerEl?.querySelector(`.system-stepper-item[data-system="${systemId}"]`);
  if (!itemEl) return;
  itemEl.classList.toggle('is-loading', isLoading);
  const spinner = itemEl.querySelector('.sys-loading-spinner');
  if (spinner) spinner.classList.toggle('hidden', !isLoading);
}

function updateItemUI(systemId) {
  const itemEl = drawerEl?.querySelector(`.system-stepper-item[data-system="${systemId}"]`);
  if (!itemEl) return;

  const lvl = systemLevels[systemId] || 0;
  itemEl.classList.toggle('is-active', lvl > 0);

  const iconBtn = itemEl.querySelector('.btn-stepper-icon');
  iconBtn?.classList.toggle('active', lvl > 0);

  const decBtn = itemEl.querySelector('.btn-stepper-dec');
  if (decBtn) decBtn.disabled = lvl <= 0;

  const incBtn = itemEl.querySelector('.btn-stepper-inc');
  if (incBtn) incBtn.disabled = lvl >= 4;

  const segmentsEl = itemEl.querySelector('.stepper-level-segments');
  if (segmentsEl) {
    segmentsEl.innerHTML = renderSegments(lvl, 4);
  }
}

function syncStateWithLoadedSystems() {
  state.loadedSystems.forEach(sysId => {
    if (systemLevels[sysId] === 0) {
      systemLevels[sysId] = 4;
    }
  });
  SYSTEM_CONFIGS.forEach(sys => updateItemUI(sys.id));
}
