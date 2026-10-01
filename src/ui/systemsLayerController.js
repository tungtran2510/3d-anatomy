// Systems +/- Layer Stepper Controller (Complete Anatomy / Visible Body style)
// Allows gradual layer-by-layer opening and closing of each anatomical system.
// Features a collapsible left-edge pull tab: "Systems +/-"
// Ultra-optimized for 60fps instant responsiveness with solid anatomical colors.

import { state, batchPartStates } from '../state/store.js';
import { loadModel } from '../viewer/loadModel.js';
import { showSystem, hideSystem, setStructureVisible } from '../viewer/visibility.js';
import { setView, frameRegion } from '../viewer/camera.js';
import { getSubSystemParts } from './sidebar.js';
import { getMeshesBySystem } from '../viewer/loadModel.js';
import { ICONS } from './icons.js';

export const SYSTEM_CONFIGS = [
  { id: 'skeletal', icon: ICONS.skeletal, nameVi: 'Hệ Xương', shortNameVi: 'XƯƠNG', maxLevels: 3, defaultLevel: 3, baseSystem: 'skeletal' },
  { id: 'joints', icon: ICONS.joints, nameVi: 'Khớp & Dây chằng', shortNameVi: 'KHỚP', maxLevels: 3, defaultLevel: 0, baseSystem: 'joints' },
  { id: 'muscular', icon: ICONS.muscular, nameVi: 'Hệ Cơ bắp', shortNameVi: 'CƠ BẮP', maxLevels: 3, defaultLevel: 0, baseSystem: 'muscular' },
  { id: 'nervous', icon: ICONS.nervous, nameVi: 'Não & Thần kinh', shortNameVi: 'THẦN KINH', maxLevels: 3, defaultLevel: 0, baseSystem: 'nervous' },
  { id: 'cardiovascular', icon: ICONS.cardiovascular, nameVi: 'Hệ Tim mạch', shortNameVi: 'TIM MẠCH', maxLevels: 3, defaultLevel: 0, baseSystem: 'cardiovascular' },
  { id: 'respiratory', icon: ICONS.respiratory, nameVi: 'Hệ Hô hấp (Phổi)', shortNameVi: 'HÔ HẤP', maxLevels: 3, defaultLevel: 0, baseSystem: 'visceral', subType: 'respiratory' },
  { id: 'digestive', icon: ICONS.digestive, nameVi: 'Hệ Tiêu hóa (Gan, Ruột)', shortNameVi: 'TIÊU HÓA', maxLevels: 3, defaultLevel: 0, baseSystem: 'visceral', subType: 'digestive' },
  { id: 'urinary_genital', icon: ICONS.urinary_genital, nameVi: 'Tiết niệu & Sinh dục', shortNameVi: 'TIẾT NIỆU', maxLevels: 3, defaultLevel: 0, baseSystem: 'visceral', subType: 'urinary_genital' },
  { id: 'endocrine', icon: ICONS.endocrine, nameVi: 'Hệ Nội tiết', shortNameVi: 'NỘI TIẾT', maxLevels: 3, defaultLevel: 0, baseSystem: 'visceral', subType: 'endocrine' },
  { id: 'lymphatic', icon: ICONS.lymphatic, nameVi: 'Hệ Bạch huyết', shortNameVi: 'BẠCH HUYẾT', maxLevels: 3, defaultLevel: 0, baseSystem: 'lymphatic' }
];

export const systemLevels = {
  skeletal: 3,
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

// -----------------------------------------------------------------------------
// 3-TIER ANATOMICAL MUSCLE DISSECTION ENGINE (Chuẩn Y khoa Visible Body)
// Level 3 (Superficial): 669 cơ đầy đủ (mạc, ngực lớn, thẳng bụng, delta, mông lớn...)
// Level 2 (Intermediate): 487 cơ giữa & sâu (bóc cơ nông, lộ ngực bé, chéo bụng trong, tứ đầu đùi...)
// Level 1 (Deep): 357 cơ sâu nhất sát xương (bóc cơ giữa, chỉ còn cơ ngang bụng, gian sườn, cơ bịt...)
// Level 0: Ẩn hoàn toàn hệ cơ
// -----------------------------------------------------------------------------

const SUPERFICIAL_PATTERNS = [
  'fascia', 'retinaculum', 'aponeurosis', 'mạc', 'cân',
  'platysma', 'cơ bám da cổ',
  'pectoralis major', 'ngực lớn',
  'deltoid', 'cơ delta',
  'rectus abdominis', 'thẳng bụng',
  'external abdominal oblique', 'external oblique', 'chéo bụng ngoài',
  'trapezius', 'cơ thang',
  'latissimus dorsi', 'latissimus', 'lưng rộng',
  'gluteus maximus', 'mông lớn',
  'gastrocnemius', 'bụng chân',
  'biceps brachii', 'nhị đầu cánh tay',
  'sartorius', 'cơ may',
  'tensor fasciae latae', 'căng mạc đùi',
  'gracilis', 'cơ thon',
  'orbicularis oris', 'orbicularis oculi', 'zygomaticus', 'risorius',
  'frontalis', 'occipitalis',
  'brachioradialis', 'cánh tay quay',
  'pronator teres', 'sấp tròn',
  'flexor carpi radialis', 'flexor carpi ulnaris', 'palmaris longus',
  'extensor carpi radialis', 'extensor digitorum', 'extensor digiti minimi',
  'extensor carpi ulnaris', 'tibialis anterior', 'chày trước',
  'fibularis longus', 'peroneus longus', 'mác dài',
  'sternocleidomastoid', 'ức đòn chũm'
];

const INTERMEDIATE_PATTERNS = [
  'pectoralis minor', 'ngực bé',
  'subclavius', 'dưới đòn',
  'internal abdominal oblique', 'internal oblique', 'chéo bụng trong',
  'rhomboid', 'cơ trám',
  'levator scapulae', 'nâng vai',
  'serratus anterior', 'răng trước',
  'serratus posterior', 'răng sau',
  'infraspinatus', 'dưới gai',
  'supraspinatus', 'trên gai',
  'teres major', 'tròn lớn',
  'teres minor', 'tròn bé',
  'gluteus medius', 'mông nhỡ',
  'rectus femoris', 'thẳng đùi',
  'vastus lateralis', 'rộng ngoài',
  'vastus medialis', 'rộng trong',
  'vastus intermedius', 'rộng giữa',
  'semitendinosus', 'bán gân',
  'semimembranosus', 'bán màng',
  'biceps femoris', 'nhị đầu đùi',
  'soleus', 'cơ dép',
  'plantaris', 'gan chân gầy',
  'brachialis', 'cánh tay',
  'coracobrachialis', 'quạ cánh tay',
  'triceps brachii', 'tam đầu cánh tay',
  'anconeus', 'cơ khuỷu',
  'flexor digitorum superficialis', 'gấp các ngón nông',
  'extensor digitorum longus', 'duỗi các ngón dài',
  'extensor hallucis longus', 'duỗi ngón cái dài',
  'masseter', 'cơ cắn',
  'temporalis', 'cơ thái dương',
  'buccinator', 'cơ mút',
  'scalenus', 'scalene', 'cơ bậc thang',
  'splenius', 'cơ gối',
  'omohyoid', 'vai móng',
  'sternohyoid', 'ức móng',
  'sternothyroid', 'ức giáp',
  'pectineus', 'cơ lược',
  'adductor longus', 'khép dài',
  'adductor brevis', 'khép ngắn',
  'erector spinae', 'dựng gai sống',
  'iliocostalis', 'chậu sườn',
  'longissimus', 'cực dài',
  'spinalis', 'gai sống'
];

let muscleLayersCache = null;

export function getMuscleLayers() {
  if (muscleLayersCache) return muscleLayersCache;
  const nodes = getMeshesBySystem('muscular') || [];
  const superficial = new Set();
  const intermediate = new Set();
  const deep = new Set();

  nodes.forEach(node => {
    const partId = node.userData?.partId;
    if (!partId) return;
    const lower = partId.toLowerCase();
    if (SUPERFICIAL_PATTERNS.some(p => lower.includes(p))) {
      superficial.add(partId);
    } else if (INTERMEDIATE_PATTERNS.some(p => lower.includes(p))) {
      intermediate.add(partId);
    } else {
      deep.add(partId);
    }
  });

  muscleLayersCache = {
    superficial: Array.from(superficial),
    intermediate: Array.from(intermediate),
    deep: Array.from(deep)
  };
  return muscleLayersCache;
}

// -----------------------------------------------------------------------------
// CARDIOVASCULAR DISSECTION LAYERS (3 Levels)
// Level 3: Toàn bộ mạng mạch máu (676 mạch)
// Level 2: Các động mạch & tĩnh mạch chính
// Level 1: Tim & các đại mạch gốc (ĐM chủ, TM chủ, Thân ĐM phổi)
// -----------------------------------------------------------------------------
const GREAT_VESSELS_PATTERNS = [
  'heart', 'tim', 'aorta', 'động mạch chủ', 'cava', 'tĩnh mạch chủ',
  'pulmonary trunk', 'thân động mạch phổi', 'coronary', 'vành'
];
const MAJOR_VESSELS_PATTERNS = [
  ...GREAT_VESSELS_PATTERNS,
  'carotid', 'cảnh', 'jugular', 'subclavian', 'dưới đòn',
  'femoral', 'đùi', 'iliac', 'chậu', 'brachial', 'cánh tay',
  'renal artery', 'renal vein', 'thận'
];

// -----------------------------------------------------------------------------
// NERVOUS DISSECTION LAYERS (3 Levels)
// Level 3: Toàn bộ hệ thần kinh (580 dây thần kinh)
// Level 2: Hệ TKTW & các đám rối thần kinh chính
// Level 1: Hệ thần kinh trung ương (Não bộ & Tủy sống)
// -----------------------------------------------------------------------------
const CNS_PATTERNS = [
  'brain', 'não', 'cerebr', 'cerebell', 'spinal cord', 'tủy sống',
  'brainstem', 'pons', 'medulla', 'thalamus'
];
const PLEXUS_PATTERNS = [
  ...CNS_PATTERNS,
  'plexus', 'đám rối', 'sciatic', 'ngồi', 'femoral nerve', 'đùi',
  'radial nerve', 'quay', 'median nerve', 'giữa', 'ulnar nerve', 'trụ',
  'vagus', 'lang thang', 'phrenic', 'hoành'
];

// -----------------------------------------------------------------------------
// SKELETAL DISSECTION LAYERS (3 Levels)
// Level 3: Toàn bộ 277 xương
// Level 2: Trục xương + Lồng ngực + Chi
// Level 1: Khung xương trục cốt lõi (Hộp sọ, Cột sống, Lồng ngực)
// -----------------------------------------------------------------------------
const AXIAL_SKELETON_PATTERNS = [
  'skull', 'sọ', 'vertebra', 'đốt sống', 'sacrum', 'cùng',
  'coccyx', 'cụt', 'sternum', 'ức', 'rib', 'sườn', 'hyoid', 'móng'
];

const loadingSystems = new Set();
let drawerEl = null;
let pullTabEl = null;
let isDrawerOpen = false;

export function initSystemsLayerController(viewer) {
  const container = document.getElementById('viewerContainer');
  if (!container || drawerEl) return;

  // 1. Pull Tab on Left Edge (Exact Visible Body layout)
  pullTabEl = document.createElement('button');
  pullTabEl.id = 'systemsPullTab';
  pullTabEl.className = 'systems-pull-tab';
  pullTabEl.title = 'Hệ cơ quan & Phân lớp giải phẫu (Systems +/-)';
  pullTabEl.innerHTML = `
    <span class="tab-body-icon">${ICONS.humanAnatomyWithPlus}</span>
    <span class="tab-vertical-text">Systems +/-</span>
  `;
  container.appendChild(pullTabEl);

  // 2. Sliding Systems Stepper Panel - Slim Medical Sidebar (~126px width)
  drawerEl = document.createElement('div');
  drawerEl.id = 'systemsStepperDrawer';
  drawerEl.className = 'systems-stepper-drawer hidden';
  drawerEl.innerHTML = `
    <div class="stepper-drawer-header">
      <div class="stepper-header-title">
        <button type="button" class="btn-stepper-nav" id="btnViewPrev" title="Góc nhìn trước">‹</button>
        <span class="stepper-views-title">Views</span>
        <button type="button" class="btn-stepper-nav" id="btnViewNext" title="Góc nhìn tiếp theo">›</button>
        <button type="button" class="btn-stepper-close" id="btnStepperClose" title="Đóng bảng">✕</button>
      </div>
      
      <div class="stepper-region-label">Affected Region</div>
      
      <!-- Quick Region Selector: Anterior, Posterior, and More Dots -->
      <div class="stepper-regions-row">
        <button type="button" class="btn-region-silhouette active" data-region="front" title="Mặt trước (Anterior)">
          ${ICONS.silhouetteAnterior}
        </button>
        <button type="button" class="btn-region-silhouette" data-region="back" title="Mặt sau (Posterior)">
          ${ICONS.silhouettePosterior}
        </button>
        <div class="region-dropdown-wrap">
          <button type="button" class="btn-region-more" id="btnRegionMore" title="Chọn phân vùng giải phẫu khác">
            ${ICONS.moreDots}
          </button>
          <div class="region-dropdown-menu hidden" id="regionDropdownMenu">
            <button type="button" class="region-menu-item" data-region="head">Đầu & Cổ</button>
            <button type="button" class="region-menu-item" data-region="torso">Lồng ngực</button>
            <button type="button" class="region-menu-item" data-region="pelvis">Khung chậu</button>
            <button type="button" class="region-menu-item" data-region="upperLimb">Chi trên (Tay)</button>
            <button type="button" class="region-menu-item" data-region="lowerLimb">Chi dưới (Chân)</button>
          </div>
        </div>
      </div>
    </div>

    <!-- Systems Steppers List (3 segments per row, instant 60fps) -->
    <div class="stepper-systems-list" id="stepperSystemsList">
      ${renderSystemRows()}
    </div>

    <!-- Bottom Tools: Pelvis & Sex Switcher -->
    <div class="stepper-drawer-footer">
      <button type="button" class="btn-drawer-tool" id="btnFocusPelvis" title="Tập trung vùng chậu (Pelvis)">
        <span class="drawer-tool-icon">${ICONS.pelvisBox}</span>
      </button>
      <button type="button" class="btn-drawer-tool" id="btnToggleGender" title="Chuyển đổi hình thái (Nam / Nữ)">
        <span class="drawer-tool-icon">${ICONS.genderToggle}</span>
      </button>
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
          <button type="button" class="btn-stepper-dec minus stepper-btn" data-action="dec" data-system="${sys.id}" title="Giảm lớp ${sys.nameVi}" ${lvl <= 0 ? 'disabled' : ''}>
            —
          </button>
          <button type="button" class="btn-stepper-icon ${lvl > 0 ? 'active' : ''}" data-action="toggle" data-system="${sys.id}" title="${sys.nameVi} (Bật / Tắt)">
            <span class="sys-icon">${sys.icon}</span>
            <span class="sys-loading-spinner hidden"></span>
          </button>
          <button type="button" class="btn-stepper-inc plus stepper-btn" data-action="inc" data-system="${sys.id}" title="Tăng lớp ${sys.nameVi}" ${lvl >= sys.maxLevels ? 'disabled' : ''}>
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

function renderSegments(currentLevel, maxLevels = 3) {
  let html = '';
  for (let i = 1; i <= maxLevels; i++) {
    const isFilled = i <= currentLevel;
    html += `<span class="level-segment ${isFilled ? 'filled' : ''}"></span>`;
  }
  return html;
}

function setupEvents(viewer) {
  // 1. Toggle Drawer via Pull Tab
  pullTabEl?.addEventListener('click', (e) => {
    e.stopPropagation();
    toggleDrawer();
  });

  // 2. Close Drawer via Close Button
  drawerEl?.querySelector('#btnStepperClose')?.addEventListener('click', (e) => {
    e.stopPropagation();
    closeDrawer();
  });

  // 3. Clicking / touching anywhere outside drawer smoothly dismisses it
  const handleOutsideDismiss = (e) => {
    if (isDrawerOpen && drawerEl && !drawerEl.contains(e.target) && !pullTabEl?.contains(e.target)) {
      closeDrawer();
    }
  };
  document.addEventListener('pointerdown', handleOutsideDismiss, { passive: true });

  // 4. Views Navigation: Prev/Next
  const viewOrder = ['front', 'back', 'left', 'right', 'top'];
  let currentViewIdx = 0;
  drawerEl?.querySelector('#btnViewPrev')?.addEventListener('click', () => {
    currentViewIdx = (currentViewIdx - 1 + viewOrder.length) % viewOrder.length;
    setView(viewOrder[currentViewIdx], viewer);
    updateSilhouetteActive(viewOrder[currentViewIdx]);
  });
  drawerEl?.querySelector('#btnViewNext')?.addEventListener('click', () => {
    currentViewIdx = (currentViewIdx + 1) % viewOrder.length;
    setView(viewOrder[currentViewIdx], viewer);
    updateSilhouetteActive(viewOrder[currentViewIdx]);
  });

  // 5. Silhouette buttons (Anterior / Posterior)
  const silhouetteBtns = drawerEl?.querySelectorAll('.btn-region-silhouette');
  silhouetteBtns?.forEach(btn => {
    btn.addEventListener('click', () => {
      const reg = btn.dataset.region;
      silhouetteBtns.forEach(b => b.classList.remove('active'));
      btn.classList.add('active');
      if (reg === 'front') {
        currentViewIdx = 0;
        setView('front', viewer);
      } else if (reg === 'back') {
        currentViewIdx = 1;
        setView('back', viewer);
      }
    });
  });

  // 6. Region More Dropdown (...)
  const moreBtn = drawerEl?.querySelector('#btnRegionMore');
  const dropdownMenu = drawerEl?.querySelector('#regionDropdownMenu');
  moreBtn?.addEventListener('click', (e) => {
    e.stopPropagation();
    dropdownMenu?.classList.toggle('hidden');
  });

  drawerEl?.querySelectorAll('.region-menu-item').forEach(item => {
    item.addEventListener('click', () => {
      dropdownMenu?.classList.add('hidden');
      const reg = item.dataset.region;
      if (reg === 'head') frameRegion({ x: 0, y: 1.6, z: 0.7, targetX: 0, targetY: 1.55, targetZ: 0 }, viewer);
      else if (reg === 'torso') frameRegion({ x: 0, y: 1.25, z: 1.0, targetX: 0, targetY: 1.25, targetZ: 0 }, viewer);
      else if (reg === 'pelvis') frameRegion({ x: 0, y: 0.95, z: 0.9, targetX: 0, targetY: 0.92, targetZ: 0 }, viewer);
      else if (reg === 'upperLimb') frameRegion({ x: 0.35, y: 1.15, z: 0.8, targetX: 0.3, targetY: 1.15, targetZ: 0 }, viewer);
      else if (reg === 'lowerLimb') frameRegion({ x: 0.15, y: 0.45, z: 1.0, targetX: 0.15, targetY: 0.45, targetZ: 0 }, viewer);
    });
  });

  // 7. Stepper Actions (+, -, Icon toggle)
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

  // 8. Bottom Footer Tools (Pelvis & Gender)
  drawerEl?.querySelector('#btnFocusPelvis')?.addEventListener('click', () => {
    frameRegion({ x: 0, y: 0.95, z: 0.9, targetX: 0, targetY: 0.92, targetZ: 0 }, viewer);
  });
  drawerEl?.querySelector('#btnToggleGender')?.addEventListener('click', () => {
    if (window.showAtlasToast) {
      window.showAtlasToast('Mô hình Nam Y khoa chuẩn (Male Anatomy Model)');
    }
  });
}

function updateSilhouetteActive(viewName) {
  const frontBtn = drawerEl?.querySelector('.btn-region-silhouette[data-region="front"]');
  const backBtn = drawerEl?.querySelector('.btn-region-silhouette[data-region="back"]');
  if (viewName === 'front') {
    frontBtn?.classList.add('active');
    backBtn?.classList.remove('active');
  } else if (viewName === 'back') {
    frontBtn?.classList.remove('active');
    backBtn?.classList.add('active');
  } else {
    frontBtn?.classList.remove('active');
    backBtn?.classList.remove('active');
  }
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
  // Also close dropdown if opened
  drawerEl.querySelector('#regionDropdownMenu')?.classList.add('hidden');
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
  if (current >= 3) return;
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
  const next = current > 0 ? 0 : 3;
  await applySystemLevel(systemId, next, viewer);
}

export async function setSystemLevel(systemId, level, viewer) {
  const clamped = Math.max(0, Math.min(3, Math.round(Number(level) || 0)));
  await applySystemLevel(systemId, clamped, viewer);
}

async function applySystemLevel(systemId, level, viewer) {
  if (loadingSystems.has(systemId)) return;
  systemLevels[systemId] = level;

  // Immediate optimistic UI response
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
    } else if (systemId === 'muscular') {
      // -------------------------------------------------------------
      // MUSCULAR 3-TIER LAYERED DISSECTION:
      // Level 3: All 669 muscles (Superficial + Intermediate + Deep)
      // Level 2: 487 muscles (Intermediate + Deep, Superficial peeled off)
      // Level 1: 357 muscles (Deepest layer only)
      // Level 0: Muscular system hidden
      // -------------------------------------------------------------
      if (level === 0) {
        hideSystem('muscular');
      } else {
        showSystem('muscular');
        const { superficial, intermediate, deep } = getMuscleLayers();
        if (level === 1) {
          superficial.forEach(id => setStructureVisible(id, false));
          intermediate.forEach(id => setStructureVisible(id, false));
          deep.forEach(id => setStructureVisible(id, true));
        } else if (level === 2) {
          superficial.forEach(id => setStructureVisible(id, false));
          intermediate.forEach(id => setStructureVisible(id, true));
          deep.forEach(id => setStructureVisible(id, true));
        } else if (level >= 3) {
          superficial.forEach(id => setStructureVisible(id, true));
          intermediate.forEach(id => setStructureVisible(id, true));
          deep.forEach(id => setStructureVisible(id, true));
        }
      }
    } else if (systemId === 'cardiovascular') {
      // -------------------------------------------------------------
      // CARDIOVASCULAR 3-TIER DISSECTION:
      // Level 3: Full cardiovascular (676 vessels)
      // Level 2: Heart & major arteries/veins
      // Level 1: Heart & great vessels (Aorta, Vena Cava, Pulmonary)
      // Level 0: Hidden
      // -------------------------------------------------------------
      if (level === 0) {
        hideSystem('cardiovascular');
      } else {
        showSystem('cardiovascular');
        const nodes = getMeshesBySystem('cardiovascular') || [];
        if (level === 1) {
          nodes.forEach(n => {
            const pId = (n.userData?.partId || '').toLowerCase();
            const isGreat = GREAT_VESSELS_PATTERNS.some(kw => pId.includes(kw));
            setStructureVisible(n.userData?.partId, isGreat);
          });
        } else if (level === 2) {
          nodes.forEach(n => {
            const pId = (n.userData?.partId || '').toLowerCase();
            const isMajor = MAJOR_VESSELS_PATTERNS.some(kw => pId.includes(kw));
            setStructureVisible(n.userData?.partId, isMajor);
          });
        } else {
          nodes.forEach(n => setStructureVisible(n.userData?.partId, true));
        }
      }
    } else if (systemId === 'nervous') {
      // -------------------------------------------------------------
      // NERVOUS 3-TIER DISSECTION:
      // Level 3: Full nervous system (580 nerves)
      // Level 2: CNS + major nerve plexuses
      // Level 1: Brain & Spinal Cord (CNS core)
      // Level 0: Hidden
      // -------------------------------------------------------------
      if (level === 0) {
        hideSystem('nervous');
      } else {
        showSystem('nervous');
        const nodes = getMeshesBySystem('nervous') || [];
        if (level === 1) {
          nodes.forEach(n => {
            const pId = (n.userData?.partId || '').toLowerCase();
            const isCNS = CNS_PATTERNS.some(kw => pId.includes(kw));
            setStructureVisible(n.userData?.partId, isCNS);
          });
        } else if (level === 2) {
          nodes.forEach(n => {
            const pId = (n.userData?.partId || '').toLowerCase();
            const isPlexus = PLEXUS_PATTERNS.some(kw => pId.includes(kw));
            setStructureVisible(n.userData?.partId, isPlexus);
          });
        } else {
          nodes.forEach(n => setStructureVisible(n.userData?.partId, true));
        }
      }
    } else if (systemId === 'skeletal') {
      // -------------------------------------------------------------
      // SKELETAL 3-TIER DISSECTION:
      // Level 3: Full skeleton (277 bones)
      // Level 2: Axial skeleton + Pelvis + Limbs
      // Level 1: Axial core (Spine, Ribs, Skull)
      // Level 0: Hidden
      // -------------------------------------------------------------
      if (level === 0) {
        hideSystem('skeletal');
      } else {
        showSystem('skeletal');
        const nodes = getMeshesBySystem('skeletal') || [];
        if (level === 1) {
          nodes.forEach(n => {
            const pId = (n.userData?.partId || '').toLowerCase();
            const isAxial = AXIAL_SKELETON_PATTERNS.some(kw => pId.includes(kw));
            setStructureVisible(n.userData?.partId, isAxial);
          });
        } else {
          nodes.forEach(n => setStructureVisible(n.userData?.partId, true));
        }
      }
    } else {
      // Standard full system (joints, lymphatic)
      if (level === 0) {
        hideSystem(systemId);
      } else {
        showSystem(systemId);
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

export function updateItemUI(systemId) {
  const itemEl = drawerEl?.querySelector(`.system-stepper-item[data-system="${systemId}"]`);
  if (!itemEl) return;

  const lvl = systemLevels[systemId] || 0;
  itemEl.classList.toggle('is-active', lvl > 0);

  const iconBtn = itemEl.querySelector('.btn-stepper-icon');
  iconBtn?.classList.toggle('active', lvl > 0);

  const decBtn = itemEl.querySelector('.btn-stepper-dec');
  if (decBtn) decBtn.disabled = lvl <= 0;

  const incBtn = itemEl.querySelector('.btn-stepper-inc');
  if (incBtn) incBtn.disabled = lvl >= 3;

  const segmentsEl = itemEl.querySelector('.stepper-level-segments');
  if (segmentsEl) {
    segmentsEl.innerHTML = renderSegments(lvl, 3);
  }
}

export function syncStateWithLoadedSystems() {
  state.loadedSystems.forEach(sysId => {
    if (systemLevels[sysId] === 0) {
      systemLevels[sysId] = 3;
    }
  });
  SYSTEM_CONFIGS.forEach(sys => updateItemUI(sys.id));
}
