// Sidebar UI - Systems panel with collapsible groups
import { state, subscribe, getSystemParts, getStructureInfo, setLanguage, translate, pushUndo } from '../state/store.js';
import { getMeshRegistry, loadModel, unloadSystem } from '../viewer/loadModel.js';
import { SYSTEM_IDS } from '../data/anatomy.js';
import { hideSystem, showSystem, hidePart, showPart, isolatePart, setPartTransparency, restoreAllParts, getSystemVisibilityState } from '../viewer/visibility.js';
import { selectPartById, deselectPart, undoLastDissect, executeUndo } from '../viewer/selection.js';
import { setView, resetView, frameRegion } from '../viewer/camera.js';
import { loadAllData, searchStructures } from '../utils/dataLoader.js';
import { initDepthSlider, resetDepthSlider } from './depthSlider.js';
import { PRESETS, applyPreset } from '../data/presets.js';
import { setInert, focusFirst, trapFocus, rovingList } from './focus.js';
import { REGIONS_DATA } from '../data/regions.js';
import { getBookmarks, isBookmarked, toggleBookmark, getHistory } from '../state/bookmarks.js';
import { initLabels, toggleLabels } from '../viewer/labels.js';
import { setExplodeFactor } from '../viewer/explodedView.js';
import { startQuiz, stopQuiz, isQuizRunning } from './quiz.js';
import { getClinicalData } from '../data/clinicalInfo.js';
import { initClipping, setClippingPlane, updateClippingOffset, toggleClippingFlip, disableClipping, toggleHalfBody, flipHalfBody, isHalfBodyActive } from '../viewer/clipping.js';
import { toggleMeasurementMode, isMeasurementActive, clearMeasurement } from '../viewer/measurement.js';
import { openStudyModulePicker, closeStudyMode } from './studyMode.js';
import { saveNote, getNote, getAllNotes, deleteNote } from '../state/notes.js';
import { openAIAssistant, closeAIAssistant, initAIAssistantUI } from './aiAssistantModal.js';
import { initVoiceController } from '../ai/voiceController.js';
import { renderRoadmapTab } from './roadmapTab.js';
import { trackPartViewed } from '../state/learningRoadmap.js';
import { ICONS } from './icons.js';
import { initSystemsLayerController } from './systemsLayerController.js';
import { initFloatingAIButton } from './floatingAIButton.js';
import { initFullscreenController } from './fullscreenController.js';
import { initAtlasHub, openAtlasHub } from './atlasHubModal.js';

// Systems as they are organised in the Z-Anatomy source file. Respiratory,
// digestive and urinary structures all live in the single "visceral" model.
const SYSTEM_LABELS = {
  vi: {
    skeletal: 'Hệ Xương',
    muscular: 'Hệ Cơ bắp',
    joints: 'Khớp & Dây chằng',
    cardiovascular: 'Hệ Tim mạch & Mạch máu',
    lymphatic: 'Hệ Bạch huyết & Miễn dịch',
    nervous: 'Hệ Thần kinh & Não bộ',
    visceral: 'Hệ Nội tạng toàn thể'
  },
  en: {
    skeletal: 'Skeletal system',
    muscular: 'Muscular system',
    joints: 'Joints & Ligaments',
    cardiovascular: 'Cardiovascular system',
    lymphatic: 'Lymphoid organs',
    nervous: 'Nervous system & sense organs',
    visceral: 'Visceral systems'
  }
};

const SYSTEM_ICONS = {
  skeletal: ICONS.skeletal,
  muscular: ICONS.muscular,
  joints: ICONS.joints,
  cardiovascular: ICONS.cardiovascular,
  lymphatic: ICONS.lymphatic,
  nervous: ICONS.nervous,
  visceral: ICONS.visceral
};

export function systemLabel(systemId, lang = state.language || 'vi') {
  return SYSTEM_LABELS[lang]?.[systemId] || SYSTEM_LABELS.vi?.[systemId] || SYSTEM_LABELS.en?.[systemId] || systemId;
}

// 10 Full Medical Systems Catalog
export const EXTENDED_SYSTEMS = [
  {
    id: 'skeletal',
    baseSystem: 'skeletal',
    label: { vi: 'Hệ Xương', en: 'Skeletal system' },
    icon: ICONS.skeletal,
    count: 277
  },
  {
    id: 'joints',
    baseSystem: 'joints',
    label: { vi: 'Khớp & Dây chằng', en: 'Joints & Ligaments' },
    icon: ICONS.joints,
    count: 349
  },
  {
    id: 'muscular',
    baseSystem: 'muscular',
    label: { vi: 'Hệ Cơ bắp', en: 'Muscular system' },
    icon: ICONS.muscular,
    count: 669
  },
  {
    id: 'nervous',
    baseSystem: 'nervous',
    label: { vi: 'Hệ Thần kinh & Não bộ', en: 'Nervous system' },
    icon: ICONS.nervous,
    count: 580
  },
  {
    id: 'cardiovascular',
    baseSystem: 'cardiovascular',
    label: { vi: 'Hệ Tim mạch & Mạch máu', en: 'Cardiovascular system' },
    icon: ICONS.cardiovascular,
    count: 676
  },
  {
    id: 'respiratory',
    baseSystem: 'visceral',
    subType: 'respiratory',
    label: { vi: 'Hệ Hô hấp (Phổi & Khí quản)', en: 'Respiratory system' },
    icon: `<svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path d="M6 3v6a6 6 0 0 0 12 0V3"/><path d="M12 9v12"/><path d="M8 15a4 4 0 0 0 4 4 4 4 0 0 0 4-4"/></svg>`,
    count: 40
  },
  {
    id: 'digestive',
    baseSystem: 'visceral',
    subType: 'digestive',
    label: { vi: 'Hệ Tiêu hóa (Gan, Dạ dày, Ruột)', en: 'Digestive system' },
    icon: `<svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path d="M12 2C8 2 6 5 6 9c0 6 6 13 6 13s6-7 6-13c0-4-2-7-6-7z"/><circle cx="12" cy="9" r="2.5"/></svg>`,
    count: 46
  },
  {
    id: 'urinary_genital',
    baseSystem: 'visceral',
    subType: 'urinary_genital',
    label: { vi: 'Hệ Tiết niệu & Sinh dục', en: 'Urogenital system' },
    icon: `<svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path d="M12 2v20M17 5H9.5a3.5 3.5 0 0 0 0 7h5a3.5 3.5 0 0 1 0 7H6"/></svg>`,
    count: 24
  },
  {
    id: 'lymphatic',
    baseSystem: 'lymphatic',
    label: { vi: 'Hệ Bạch huyết & Miễn dịch', en: 'Lymphatic system' },
    icon: ICONS.lymphatic,
    count: 158
  },
  {
    id: 'endocrine',
    baseSystem: 'visceral',
    subType: 'endocrine',
    label: { vi: 'Hệ Nội tiết (Tuyến giáp, Yên)', en: 'Endocrine system' },
    icon: `<svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><circle cx="12" cy="12" r="8"/><path d="M12 8v8M8 12h8"/></svg>`,
    count: 8
  },
  {
    id: 'visceral',
    baseSystem: 'visceral',
    label: { vi: 'Nội tạng toàn thể', en: 'Visceral systems' },
    icon: ICONS.visceral,
    count: 118
  }
];

export function getSubSystemParts(subType) {
  const allVisceral = getSystemParts('visceral');
  if (!allVisceral || !allVisceral.length) return [];

  return allVisceral.filter(name => {
    const lower = name.toLowerCase();
    if (subType === 'respiratory') {
      return lower.includes('bronchus') || lower.includes('lung') || lower.includes('trachea') || lower.includes('pleura') || lower.includes('nasal') || lower.includes('pharynx') || lower.includes('epiglottis');
    }
    if (subType === 'digestive') {
      return lower.includes('colon') || lower.includes('liver') || lower.includes('pancrea') || lower.includes('stomach') || lower.includes('duodenum') || lower.includes('jejunum') || lower.includes('appendix') || lower.includes('bile') || lower.includes('gallbladder') || lower.includes('esophagus') || lower.includes('oesophagus') || lower.includes('parotid') || lower.includes('sublingual') || lower.includes('submandibular') || lower.includes('gingiva') || lower.includes('tongue') || lower.includes('palate') || lower.includes('omentum') || lower.includes('taenia') || lower.includes('meso');
    }
    if (subType === 'urinary_genital') {
      return lower.includes('kidney') || lower.includes('bladder') || lower.includes('ureter') || lower.includes('urethra') || lower.includes('renal') || lower.includes('penis') || lower.includes('prostate') || lower.includes('testis') || lower.includes('seminal') || lower.includes('deferens') || lower.includes('epididymis') || lower.includes('ejaculatory');
    }
    if (subType === 'endocrine') {
      return lower.includes('thyroid') || lower.includes('suprarenal') || lower.includes('hypophysis') || lower.includes('pineal');
    }
    return false;
  });
}

export function initSystemsSidebar() {
  const container = document.getElementById('systemsList');
  if (!container) return;

  const lang = state.language || 'vi';

  const presets = `
    <div class="preset-row">
      ${PRESETS.map(preset => `
        <button type="button" class="preset-chip" data-preset="${preset.id}">
          ${escapeHtml(preset.label[lang] || preset.label.vi || preset.label.en)}
        </button>
      `).join('')}
    </div>
  `;

  container.innerHTML = presets + EXTENDED_SYSTEMS.map(item => {
    const rawParts = item.subType ? getSubSystemParts(item.subType) : getSystemParts(item.baseSystem);
    const count = rawParts.length || item.count;
    const icon = item.icon || '🔬';
    const label = item.label[lang] || item.label.vi || item.label.en;

    // Determine initial visibility state
    let isVisible = false;
    if (item.subType) {
      const subParts = getSubSystemParts(item.subType);
      isVisible = state.loadedSystems.includes('visceral') && subParts.some(id => state.partStates.get(id)?.visible !== false && !state.hiddenParts.has(id));
    } else {
      const visibility = getSystemVisibilityState(item.id);
      isVisible = visibility.visible;
    }
    const checkboxState = isVisible ? 'checked' : '';

    return `
      <div class="system-group" data-system="${item.id}" data-base-system="${item.baseSystem}">
        <div class="system-group-header">
          <label class="system-checkbox-label" title="${isVisible ? 'Ẩn hệ này' : 'Hiện hệ này trên 3D'}">
            <input type="checkbox" ${checkboxState} data-system-checkbox="${item.id}" data-base-system="${item.baseSystem}" data-subtype="${item.subType || ''}">
            <span class="system-checkbox-custom"></span>
          </label>
          <div class="system-accordion-trigger" data-toggle-accordion="${item.id}">
            <span class="system-icon">${icon}</span>
            <div class="system-text-wrap">
              <span class="system-name">${escapeHtml(label)}</span>
            </div>
            <span class="system-count">${count}</span>
            <button type="button" class="system-expand-btn" aria-label="Xem chi tiết ${escapeHtml(label)}" title="Xem danh sách chi tiết">
              <svg class="expand-icon" width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.2"><path d="m9 18 6-6-6-6"/></svg>
            </button>
          </div>
        </div>
        <div class="system-group-content" style="display: none;"></div>
      </div>
    `;
  }).join('');

  container.querySelectorAll('[data-preset]').forEach(chip => {
    chip.addEventListener('click', () => {
      const preset = PRESETS.find(p => p.id === chip.dataset.preset);
      if (preset) applyPreset(preset);
    });
  });

  // Accordion Expand/Collapse
  container.querySelectorAll('[data-toggle-accordion]').forEach(trigger => {
    trigger.addEventListener('click', async (e) => {
      const systemId = trigger.dataset.toggleAccordion;
      const item = EXTENDED_SYSTEMS.find(s => s.id === systemId);
      if (!item) return;

      const group = trigger.closest('.system-group');
      const content = group.querySelector('.system-group-content');
      const chevron = trigger.querySelector('.system-expand-btn');
      const isExpanded = content.style.display === 'block';

      if (isExpanded) {
        content.style.display = 'none';
        group.classList.remove('is-expanded');
        chevron?.classList.remove('is-open');
      } else {
        // Expand
        content.style.display = 'block';
        group.classList.add('is-expanded');
        chevron?.classList.add('is-open');

        if (content.children.length === 0) {
          // If base system model is not loaded yet, fetch it
          await ensureSystemLoaded(item.baseSystem, group);
          const customParts = item.subType ? getSubSystemParts(item.subType) : null;
          populateSystemStructures(item.baseSystem, content, customParts);
        }
      }
    });
  });

  // Add event listeners for system checkboxes (3D Visibility)
  container.querySelectorAll('[data-system-checkbox]').forEach(checkbox => {
    checkbox.addEventListener('change', async (e) => {
      const systemId = e.target.dataset.systemCheckbox;
      const baseSystem = e.target.dataset.baseSystem;
      const subType = e.target.dataset.subtype;
      const group = e.target.closest('.system-group');
      const content = group.querySelector('.system-group-content');

      resetDepthSlider();

      if (subType) {
        // Sub-system of visceral (respiratory, digestive, urinary_genital, endocrine)
        const subParts = getSubSystemParts(subType);
        if (!e.target.checked) {
          subParts.forEach(id => hidePart(id));
        } else {
          await ensureSystemLoaded('visceral', group);
          subParts.forEach(id => showPart(id));
        }
        return;
      }

      // Standard primary system
      if (!e.target.checked) {
        hideSystem(systemId);
        scheduleUnload(systemId, content);
        return;
      }

      cancelUnload(systemId);
      await ensureSystemLoaded(systemId, group);
      showSystem(systemId);
    });
  });
}

// Selecting a structure from search must work even when its system has never
// been downloaded: 2550 of the 2827 structures are in that state on a fresh
// page, and every one of them used to be a dead click.
export async function selectStructureAnywhere(partId) {
  const info = getStructureInfo(partId);
  const systemId = info?.system;

  if (systemId) {
    // Switching a system off leaves it in loadedSystems with an unload timer
    // running, so "already loaded" is not the same as "on screen". Without
    // this the structure would be selected inside a system nobody can see, and
    // the timer would then dispose the geometry under the live selection.
    cancelUnload(systemId);

    const groupEl = () => document.querySelector(`.system-group[data-system="${systemId}"]`);
    const loaded = state.loadedSystems.includes(systemId);
    // Ask the scene rather than the checkbox: the checkbox is a rendering of
    // this answer and can be older than it. A system with anything still on
    // screen is left alone, because showSystem() would undo every structure
    // the user hid or faded inside it.
    const hidden = loaded && !getSystemVisibilityState(systemId).visible;

    if (!loaded || hidden) {
      if (!loaded) await ensureSystemLoaded(systemId, groupEl());

      // Re-read the row after the await: it may have been rebuilt while the
      // model was in flight.
      const group = groupEl();
      const checkbox = group?.querySelector('[data-system-checkbox]');
      const content = group?.querySelector('.system-group-content');
      if (checkbox) checkbox.checked = true;
      if (content) {
        content.style.display = 'block';
        if (content.children.length === 0) populateSystemStructures(systemId, content);
      }
      showSystem(systemId);
    }
  }

  selectPartById(partId, state.viewer);
}

// Hiding a system is instant, but its buffers are only released if it stays
// off: toggling twice in a row should not pay for a reload.
const UNLOAD_GRACE_MS = 30000;
const pendingUnloads = new Map();

function scheduleUnload(systemId, content) {
  cancelUnload(systemId);
  pendingUnloads.set(systemId, setTimeout(() => {
    pendingUnloads.delete(systemId);
    if (unloadSystem(systemId) && content) content.innerHTML = '';
  }, UNLOAD_GRACE_MS));
}

function cancelUnload(systemId) {
  const timer = pendingUnloads.get(systemId);
  if (timer) {
    clearTimeout(timer);
    pendingUnloads.delete(systemId);
  }
}

const pendingSystemLoads = new Map();

async function ensureSystemLoaded(systemId, group) {
  if (state.loadedSystems.includes(systemId)) return;

  if (!pendingSystemLoads.has(systemId)) {
    const label = group?.querySelector('.system-accordion-trigger') || group?.querySelector('.system-group-header') || group?.querySelector('.system-group-label');
    const counter = group?.querySelector('.system-count');
    const originalCount = counter?.textContent;
    label?.classList.add('loading');

    // The bytes were already being measured and thrown away; show them.
    const unsubscribe = subscribe('loading', info => {
      if (!counter || info.system !== systemId || info.loaded) return;
      counter.textContent = info.total
        ? `${Math.round(info.loaded / 1048576 * 10) / 10}/${Math.round(info.total / 1048576 * 10) / 10} MB`
        : `${Math.round(info.loaded / 1048576 * 10) / 10} MB`;
    });

    const promise = loadModel(systemId, state.viewer)
      .catch(error => {
        console.error(`[sidebar] Failed to load ${systemId}:`, error);
        label?.classList.add('failed');
        if (counter) counter.textContent = translate('retry');
      })
      .finally(() => {
        unsubscribe?.();
        label?.classList.remove('loading');
        if (counter && originalCount && !label?.classList.contains('failed')) {
          counter.textContent = originalCount;
        }
        pendingSystemLoads.delete(systemId);
      });

    pendingSystemLoads.set(systemId, promise);
  }

  await pendingSystemLoads.get(systemId);
}

const ROWS_PER_CHUNK = 60;

// Each rendered list keeps its roving-tabindex refresher, called as chunks land.
const rovingRefreshers = new WeakMap();

// One row per structure rather than per mesh: the left and right copies of the
// same structure share a row and are picked with a side chip.
function groupSystemStructures(systemId, lang, customParts = null) {
  const groups = new Map();
  const parts = customParts || getSystemParts(systemId);

  parts.forEach(partId => {
    const info = getStructureInfo(partId) || {};
    const base = info.baseName || partId;

    let group = groups.get(base);
    if (!group) {
      group = {
        base,
        label: (info.name?.[lang] || info.name?.vi || info.name?.en || base).replace(/\s*\((sinistro|destro|left|right)\)$/i, ''),
        parts: [],
        sides: {}
      };
      groups.set(base, group);
    }

    group.parts.push(partId);
    group.sides[info.side || 'none'] = partId;
  });

  return [...groups.values()];
}

function rowMarkup(group) {
  const primary = group.sides.none || group.sides.right || group.sides.left;
  const visible = group.parts.some(id => state.partStates.get(id)?.visible !== false);
  const selected = group.parts.some(id => state.partStates.get(id)?.selected === true);

  const sides = ['left', 'right']
    .filter(side => group.sides[side])
    .map(side => `<button type="button" class="structure-side" data-select="${escapeHtml(group.sides[side])}" title="${translate(side === 'left' ? 'side_left' : 'side_right')}">${translate(side === 'left' ? 'side_left_short' : 'side_right_short')}</button>`)
    .join('');

  const label = escapeHtml(group.label);

  return `
    <div class="structure-item ${selected ? 'selected' : ''}" role="option" tabindex="-1" aria-selected="${selected}" data-part="${escapeHtml(primary)}" data-parts="${escapeHtml(group.parts.join('|'))}">
      <input type="checkbox" ${visible ? 'checked' : ''} data-part-checkbox="${escapeHtml(primary)}">
      <span class="structure-name" title="${label}">${label}</span>
      <span class="structure-sides">${sides}</span>
      <div class="structure-actions">
        <button class="action-btn isolate" data-action="isolate" title="${escapeHtml(translate('isolate'))}" aria-label="${escapeHtml(translate('isolate'))}">
          <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path d="M12 22c5.523 0 10-4.477 10-10S17.523 2 12 2 2 6.477 2 12s4.477 10 10 10z"/><circle cx="12" cy="12" r="3"/></svg>
        </button>
        <button class="action-btn hide" data-action="hide" title="${escapeHtml(translate('hide'))}" aria-label="${escapeHtml(translate('hide'))}">
          <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path d="M17.94 17.94A10.07 10.07 0 0 1 12 20c-7 0-11-8-11-8a18.45 18.45 0 0 1 5.06-5.94M9.9 4.24A9.12 9.12 0 0 1 12 4c7 0 11 8 11 8a18.5 18.5 0 0 1-2.16 3.19M2 2l20 20"/></svg>
        </button>
        <button class="action-btn transparent" data-action="transparent" title="${escapeHtml(translate('transparent'))}" aria-label="${escapeHtml(translate('transparent'))}">
          <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><circle cx="12" cy="12" r="10"/><path d="M12 2v20M2 12h20"/></svg>
        </button>
      </div>
    </div>
  `;
}

function populateSystemStructures(systemId, container, customParts = null) {
  const lang = state.language || 'vi';
  const groups = groupSystemStructures(systemId, lang, customParts);

  // A 669-structure system used to build ~10 000 nodes and ~2700 listeners in
  // one go. Rows arrive in chunks as the panel is scrolled, behind a single
  // delegated listener.
  let rendered = 0;
  container.innerHTML = '';

  const sentinel = document.createElement('div');
  sentinel.className = 'structure-sentinel';

  const renderChunk = () => {
    const slice = groups.slice(rendered, rendered + ROWS_PER_CHUNK);
    if (!slice.length) return;

    sentinel.insertAdjacentHTML('beforebegin', slice.map(rowMarkup).join(''));
    rendered += slice.length;
    rovingRefreshers.get(container)?.();

    if (rendered >= groups.length) {
      observer.disconnect();
      sentinel.remove();
    }
  };

  const observer = new IntersectionObserver(entries => {
    if (entries.some(entry => entry.isIntersecting)) renderChunk();
  }, { root: container.closest('.sidebar-content'), rootMargin: '200px' });

  container.setAttribute('role', 'listbox');
  container.setAttribute('aria-label', translate('systems'));

  container.appendChild(sentinel);
  renderChunk();
  observer.observe(sentinel);

  container.addEventListener('click', onStructureListClick);
  container.addEventListener('change', onStructureListChange);

  // One tab stop for the whole list; the arrows move between rows. 669 rows
  // would otherwise be 669 stops.
  const refreshRoving = rovingList(container, {
    itemSelector: '.structure-item',
    onActivate: item => selectPartById(item.dataset.part, state.viewer)
  });
  refreshRoving();
  rovingRefreshers.set(container, refreshRoving);
}

function partsOf(item) {
  return (item.dataset.parts || item.dataset.part || '').split('|').filter(Boolean);
}

function onStructureListChange(event) {
  const checkbox = event.target.closest('[data-part-checkbox]');
  if (!checkbox) return;

  const item = checkbox.closest('.structure-item');
  partsOf(item).forEach(partId => {
    if (checkbox.checked) showPart(partId); else hidePart(partId);
  });
}

function onStructureListClick(event) {
  const item = event.target.closest('.structure-item');
  if (!item) return;

  const side = event.target.closest('[data-select]');
  if (side) {
    event.stopPropagation();
    selectPartById(side.dataset.select, state.viewer);
    return;
  }

  const action = event.target.closest('[data-action]')?.dataset.action;
  const parts = partsOf(item);
  const primary = item.dataset.part;

  if (action === 'isolate') {
    event.stopPropagation();
    isolatePart(primary);
    return;
  }

  if (action === 'hide') {
    event.stopPropagation();
    parts.forEach(hidePart);
    deselectPart();
    return;
  }

  if (action === 'transparent') {
    event.stopPropagation();
    const opacity = getPartVisibility(primary).opacity < 1 ? 1 : 0.3;
    parts.forEach(partId => setPartTransparency(partId, opacity));
    return;
  }

  if (event.target.type === 'checkbox') return;
  selectPartById(primary, state.viewer);
}

function getPartVisibility(partId) {
  const meshRegistry = getMeshRegistry();
  const mesh = meshRegistry.get(partId);
  if (!mesh) return { visible: false, opacity: 1 };

  const partState = state.partStates.get(partId);
  return {
    visible: mesh.visible && (partState?.visible !== false),
    opacity: partState?.opacity ?? 1
  };
}

function escapeHtml(text) {
  const div = document.createElement('div');
  div.textContent = text;
  return div.innerHTML;
}

// Initialize toolbar buttons
export function initToolbar(viewer) {
  // Isolate / hide / transparency are on the callout and the action bar; the
  // toolbar only carries camera presets.
  const buttons = {
    resetBtn: () => resetView(viewer),
    frontViewBtn: () => setView('front', viewer),
    sideViewBtn: () => setView('right', viewer),
    backViewBtn: () => setView('back', viewer),
    topViewBtn: () => setView('top', viewer),
    halfBodyBtn: () => handleHalfBodyToggle(viewer)
  };

  Object.entries(buttons).forEach(([id, handler]) => {
    const btn = document.getElementById(id);
    if (btn) btn.addEventListener('click', handler);
  });
}

export function handleHalfBodyToggle(viewer) {
  const active = toggleHalfBody(viewer);
  const btnCtrl = document.getElementById('halfBodyBtn');
  const btnTool = document.getElementById('btnToolHalfBody');
  const pill = document.getElementById('halfBodyPill');

  if (btnCtrl) btnCtrl.classList.toggle('active', active);
  if (btnTool) btnTool.classList.toggle('active', active);
  if (pill) pill.classList.toggle('hidden', !active);

  showToast(active ? 'Chế độ Nửa Người: ĐÃ BẬT (Mặt cắt đứng dọc Sagittal)' : 'Chế độ Nửa Người: ĐÃ TẮT');
}

export function handleHalfBodyFlip(viewer) {
  const flipped = flipHalfBody(viewer);
  showToast(flipped ? 'Đã đổi sang nửa người bên đối diện' : 'Đã đổi nửa người');
}

export function closeHalfBody(viewer) {
  disableClipping(viewer);
  const btnCtrl = document.getElementById('halfBodyBtn');
  const btnTool = document.getElementById('btnToolHalfBody');
  const pill = document.getElementById('halfBodyPill');

  if (btnCtrl) btnCtrl.classList.remove('active');
  if (btnTool) btnTool.classList.remove('active');
  if (pill) pill.classList.add('hidden');
  showToast('Đã tắt chế độ nửa người');
}

function isolateSelected() {
  if (state.selectedPart) {
    isolatePart(state.selectedPart.id);
  }
}

function hideSelected() {
  if (state.selectedPart) {
    hidePart(state.selectedPart.id);
    deselectPart();
  }
}

function toggleTransparencySelected() {
  if (state.selectedPart) {
    const visibility = getPartVisibility(state.selectedPart.id);
    setPartTransparency(state.selectedPart.id, visibility.opacity < 1 ? 1 : 0.3);
  }
}

export function showToast(message, duration = 2500) {
  const toast = document.getElementById('appToast');
  if (!toast) return;
  toast.textContent = message;
  toast.classList.remove('hidden');
  toast.classList.add('show');
  clearTimeout(toast._timeout);
  toast._timeout = setTimeout(() => {
    toast.classList.remove('show');
    setTimeout(() => toast.classList.add('hidden'), 300);
  }, duration);
}

// Footer & Mobile Navigation actions
export function initFooterActions(viewer) {
  // Legacy footer buttons if present
  document.getElementById('footerIsolateBtn')?.addEventListener('click', () => {
    if (state.selectedPart) {
      pushUndo({
        type: 'isolate',
        partId: state.selectedPart.id,
        prevIsolated: state.isolatedPart || null
      });
      isolateSelected();
      viewer?.render();
    }
  });
  document.getElementById('footerHideBtn')?.addEventListener('click', () => {
    if (state.selectedPart) {
      pushUndo({
        type: 'hide',
        partId: state.selectedPart.id
      });
      hideSelected();
      viewer?.render();
    }
  });
  document.getElementById('footerTransparentBtn')?.addEventListener('click', () => {
    if (state.selectedPart) {
      const partState = state.partStates.get(state.selectedPart.id);
      const prevOpacity = partState?.opacity ?? 1;
      pushUndo({
        type: 'ghost',
        partId: state.selectedPart.id,
        prevOpacity: prevOpacity
      });
      toggleTransparencySelected();
      viewer?.render();
    }
  });
  document.getElementById('footerShowAllBtn')?.addEventListener('click', () => {
    restoreAllParts();
    deselectPart(true);
    if (viewer) resetView(viewer, true);
    viewer?.render();
  });

  // Floating Selection Card buttons
  document.getElementById('cardBookmarkBtn')?.addEventListener('click', () => {
    if (!state.selectedPart) return;
    const partId = state.selectedPart.id;
    const info = state.selectedPart.info || {};
    const saved = toggleBookmark(partId, {
      nameVi: state.selectedPart.displayName,
      nameLatin: info.latinName,
      system: state.selectedPart.system
    });
    updateBookmarkButton(partId);
    showToast(saved ? 'Đã lưu cấu trúc này vào mục Đã lưu ⭐' : 'Đã xóa khỏi mục Đã lưu');
  });

  document.getElementById('cardLessonBtn')?.addEventListener('click', () => {
    if (!state.selectedPart) return;
    const info = state.selectedPart.info || {};
    const clinical = getClinicalData(state.selectedPart.id, info.baseName);
    if (clinical?.lessonLink) {
      openLesson(clinical.lessonLink, clinical.lessonTitle);
    } else {
      openLesson('/cot-song/tu-the-va-van-dong', 'Giải phẫu cơ thể học');
    }
  });

  document.getElementById('cardIsolateBtn')?.addEventListener('click', () => {
    const btn = document.getElementById('cardIsolateBtn');
    const isCurrentlyIsolated = btn?.classList.contains('active') || (state.selectedPart && state.isolatedPart === state.selectedPart.id);
    if (isCurrentlyIsolated) {
      if (state.selectedPart) {
        pushUndo({
          type: 'isolate',
          partId: state.selectedPart.id,
          prevIsolated: state.isolatedPart
        });
      }
      // Toggle OFF: un-isolate and restore
      restoreAllParts();
      btn?.classList.remove('active');
      viewer?.render();
      showToast('Đã tắt cô lập - Khôi phục toàn bộ giải phẫu');
    } else {
      if (state.selectedPart) {
        pushUndo({
          type: 'isolate',
          partId: state.selectedPart.id,
          prevIsolated: state.isolatedPart || null
        });
        isolateSelected();
        btn?.classList.add('active');
        viewer?.render();
        showToast('Đã cô lập bộ phận này (Nhấn lại để tắt cô lập)');
      }
    }
  });

  document.getElementById('cardHideBtn')?.addEventListener('click', () => {
    if (state.selectedPart) {
      pushUndo({
        type: 'hide',
        partId: state.selectedPart.id
      });
      hideSelected();
      viewer?.render();
      showToast('Đã bóc tách / ẩn bộ phận');
    }
  });

  document.getElementById('cardGhostBtn')?.addEventListener('click', () => {
    if (state.selectedPart) {
      const partState = state.partStates.get(state.selectedPart.id);
      const prevOpacity = partState?.opacity ?? 1;
      pushUndo({
        type: 'ghost',
        partId: state.selectedPart.id,
        prevOpacity: prevOpacity
      });
      toggleTransparencySelected();
      viewer?.render();
      showToast('Đã đổi độ trong suốt');
    }
  });

  document.getElementById('cardInfoBtn')?.addEventListener('click', () => {
    document.getElementById('infoOpen')?.click();
  });

  document.getElementById('cardAIBtn')?.addEventListener('click', () => {
    openAIAssistant(viewer);
  });

  document.getElementById('cardShareBtn')?.addEventListener('click', () => {
    if (!state.selectedPart) return;
    const partId = state.selectedPart.id;
    const sys = state.selectedPart.system || 'skeletal';
    const currentUrl = `${window.location.origin}/giai-phau-3d#sys=${sys}&sel=${partId}&iso=${partId}`;
    if (navigator.clipboard) {
      navigator.clipboard.writeText(currentUrl);
      showToast(`Đã sao chép liên kết góc nhìn 3D của "${state.selectedPart.displayName}"! Có thể gửi cho lớp học 🔗`);
    } else {
      prompt('Sao chép liên kết chia sẻ góc nhìn 3D này:', currentUrl);
    }
  });

  // Card Note Button
  document.getElementById('cardNoteBtn')?.addEventListener('click', () => {
    const noteBox = document.getElementById('cardNoteBox');
    if (!noteBox || !state.selectedPart) return;
    const isHidden = noteBox.classList.toggle('hidden');
    if (!isHidden) {
      const input = document.getElementById('cardNoteInput');
      if (input) {
        input.value = getNote(state.selectedPart.id);
        input.focus();
      }
    }
  });

  document.getElementById('btnCardSaveNote')?.addEventListener('click', () => {
    if (!state.selectedPart) return;
    const input = document.getElementById('cardNoteInput');
    const text = input?.value || '';
    saveNote(state.selectedPart.id, text, {
      nameVi: state.selectedPart.displayName,
      nameLatin: state.selectedPart.info?.latinName,
      system: state.selectedPart.system
    });
    const hint = document.getElementById('cardNoteSavedHint');
    if (hint) {
      hint.classList.remove('hidden');
      setTimeout(() => hint.classList.add('hidden'), 2000);
    }
    showToast('Đã lưu ghi chú học tập 📝');
  });

  document.getElementById('cardCloseBtn')?.addEventListener('click', () => {
    const isolateBtn = document.getElementById('cardIsolateBtn');
    if (isolateBtn?.classList.contains('active')) {
      restoreAllParts();
      isolateBtn.classList.remove('active');
    }
    deselectPart();
    document.getElementById('cardNoteBox')?.classList.add('hidden');
  });

  // Mobile Bottom Bar Navigation
  document.getElementById('btnNavSystems')?.addEventListener('click', () => {
    openAtlasHub(viewer, 'views');
  });

  document.getElementById('btnNavSearch')?.addEventListener('click', () => {
    document.getElementById('searchOpen')?.click();
  });

  const btnDissect = document.getElementById('btnNavDissect');
  btnDissect?.addEventListener('click', () => {
    state.dissectMode = !state.dissectMode;
    btnDissect.classList.toggle('dissect-active', state.dissectMode);
    if (state.dissectMode) {
      showToast('Dao mổ BẬT: Chạm vào bất kỳ bộ phận nào để bóc tách');
    } else {
      showToast('Chế độ bóc tách: TẮT');
    }
  });

  const btnUndo = document.getElementById('btnNavUndo');
  btnUndo?.addEventListener('click', () => {
    const msg = executeUndo(viewer);
    if (msg) {
      showToast(msg);
    } else {
      showToast('Không còn thao tác nào để hoàn tác');
    }
  });

  document.getElementById('btnNavReset')?.addEventListener('click', () => {
    restoreAllParts();
    deselectPart(true);
    const isolateBtn = document.getElementById('cardIsolateBtn');
    if (isolateBtn) isolateBtn.classList.remove('active');

    // Turn off dissect mode if active
    if (state.dissectMode) {
      state.dissectMode = false;
      document.getElementById('btnNavDissect')?.classList.remove('dissect-active');
    }

    // Reset camera to default full front view
    if (viewer) {
      resetView(viewer, true);
    }

    state.undoStack = [];
    viewer?.render();
    showToast('Đã khôi phục toàn bộ giải phẫu & góc nhìn');
  });
}

// External Lesson / Video link handlers
export function openLesson(lessonUrl, lessonTitle) {
  if (!lessonUrl) return;
  showToast(`Đang mở bài học: ${lessonTitle || ''}`);
  if (window.parent && window.parent !== window) {
    window.parent.postMessage({ type: 'NAVIGATE_LESSON', url: lessonUrl, title: lessonTitle }, '*');
  } else {
    window.open(lessonUrl, '_blank');
  }
}

export function openVideo(videoIdOrUrl, videoTitle) {
  if (!videoIdOrUrl) return;
  const modal = document.getElementById('videoModal');
  const title = document.getElementById('videoModalTitle');
  const container = document.getElementById('videoFrameContainer');
  if (!modal || !container) return;

  let embedUrl = videoIdOrUrl;
  if (!videoIdOrUrl.startsWith('http')) {
    embedUrl = `https://www.youtube.com/embed/${videoIdOrUrl}?autoplay=1&rel=0`;
  } else if (!videoIdOrUrl.includes('autoplay=1')) {
    embedUrl += (videoIdOrUrl.includes('?') ? '&' : '?') + 'autoplay=1&rel=0';
  }

  if (title) title.textContent = videoTitle || 'Video Bài Giảng Giải Phẫu';
  container.innerHTML = `
    <iframe width="100%" height="100%"
            src="${embedUrl}"
            title="${escapeHtml(videoTitle || 'Video')}"
            frameborder="0"
            allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
            allowfullscreen>
    </iframe>
  `;
  modal.classList.remove('hidden');
}

export const openVideoModal = openVideo;

export function closeVideo() {
  const modal = document.getElementById('videoModal');
  const container = document.getElementById('videoFrameContainer');
  if (modal) modal.classList.add('hidden');
  if (container) container.innerHTML = '';
}

export function initVideoModal() {
  const closeBtn = document.getElementById('videoModalClose');
  const overlay = document.getElementById('videoModalOverlay');

  closeBtn?.addEventListener('click', closeVideo);
  overlay?.addEventListener('click', closeVideo);
  window.addEventListener('keydown', (e) => {
    if (e.key === 'Escape') closeVideo();
  });
}

export function updateBookmarkButton(partId) {
  const btn = document.getElementById('cardBookmarkBtn');
  if (!btn) return;
  const saved = isBookmarked(partId);
  btn.classList.toggle('active', saved);
  btn.innerHTML = saved
    ? `<svg width="18" height="18" viewBox="0 0 24 24" fill="#ffdf5d" stroke="#ffdf5d" stroke-width="2"><path d="M19 21l-7-5-7 5V5a2 2 0 0 1 2-2h10a2 2 0 0 1 2 2z"/></svg> Đã lưu`
    : `<svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path d="M19 21l-7-5-7 5V5a2 2 0 0 1 2-2h10a2 2 0 0 1 2 2z"/></svg> Lưu`;
}

// Drawer Tabs (Systems, Regions, Roadmap, Bookmarks, Notes, History)
export function initDrawerTabs(viewer) {
  const tabButtons = document.querySelectorAll('.sidebar-tab');
  const panes = {
    systems: document.getElementById('tabSystemsContent'),
    regions: document.getElementById('tabRegionsContent'),
    roadmap: document.getElementById('tabRoadmapContent'),
    bookmarks: document.getElementById('tabBookmarksContent'),
    notes: document.getElementById('tabNotesContent'),
    history: document.getElementById('tabHistoryContent')
  };

  tabButtons.forEach(btn => {
    btn.addEventListener('click', () => {
      const target = btn.dataset.tab;
      tabButtons.forEach(b => b.classList.toggle('active', b === btn));
      Object.entries(panes).forEach(([key, pane]) => {
        if (!pane) return;
        if (key === target) {
          pane.classList.remove('hidden');
          pane.classList.add('active');
        } else {
          pane.classList.add('hidden');
          pane.classList.remove('active');
        }
      });

      if (target === 'regions') renderRegionsList(viewer);
      if (target === 'roadmap') renderRoadmapTab(viewer);
      if (target === 'bookmarks') renderBookmarksList(viewer);
      if (target === 'notes') renderNotesList(viewer);
      if (target === 'history') renderHistoryList(viewer);
    });
  });

  window.addEventListener('anatomy-notes-updated', () => {
    if (document.querySelector('.sidebar-tab[data-tab="notes"]')?.classList.contains('active')) {
      renderNotesList(viewer);
    }
  });

  const refreshRoadmapIfActive = () => {
    if (document.querySelector('.sidebar-tab[data-tab="roadmap"]')?.classList.contains('active')) {
      renderRoadmapTab(viewer);
    }
  };
  window.addEventListener('anatomy-weak-points-updated', refreshRoadmapIfActive);
  window.addEventListener('anatomy-stats-updated', refreshRoadmapIfActive);
}

export function renderNotesList(viewer) {
  const container = document.getElementById('notesList');
  if (!container) return;

  const notes = getAllNotes();
  if (!notes || notes.length === 0) {
    container.innerHTML = `
      <div style="padding: 24px 16px; text-align: center; color: #8b949e;">
        <div style="font-size: 32px; margin-bottom: 8px;">📝</div>
        <p style="font-weight: 600; color: #c9d1d9; font-size: 13px;">Chưa có ghi chú nào</p>
        <p style="font-size: 11px; margin-top: 4px;">Hãy chọn cấu trúc bất kỳ trên mô hình 3D và viết ghi chú học tập.</p>
      </div>
    `;
    return;
  }

  container.innerHTML = notes.map(n => `
    <div class="note-card-item" data-part="${escapeHtml(n.partId)}">
      <div class="note-card-header">
        <span class="note-card-title">${escapeHtml(n.nameVi || n.partId)}</span>
        <span class="note-card-date">${new Date(n.updatedAt).toLocaleDateString('vi-VN')}</span>
      </div>
      <p class="note-card-text">${escapeHtml(n.text)}</p>
      <div style="display: flex; justify-content: flex-end; gap: 8px; margin-top: 6px;">
        <button type="button" class="btn-review-focus btn-note-goto" data-part="${escapeHtml(n.partId)}">Xem 3D</button>
        <button type="button" class="btn-review-focus btn-note-del" data-part="${escapeHtml(n.partId)}" style="color: #f85149; border-color: rgba(248,81,73,0.3);">Xóa</button>
      </div>
    </div>
  `).join('');

  container.querySelectorAll('.btn-note-goto').forEach(btn => {
    btn.addEventListener('click', (e) => {
      e.stopPropagation();
      selectPartById(btn.dataset.part, viewer);
    });
  });

  container.querySelectorAll('.btn-note-del').forEach(btn => {
    btn.addEventListener('click', (e) => {
      e.stopPropagation();
      deleteNote(btn.dataset.part);
      renderNotesList(viewer);
      showToast('Đã xóa ghi chú');
    });
  });

  container.querySelectorAll('.note-card-item').forEach(item => {
    item.addEventListener('click', () => {
      selectPartById(item.dataset.part, viewer);
    });
  });
}

export function renderRegionsList(viewer) {
  const container = document.getElementById('regionsList');
  if (!container) return;

  container.innerHTML = REGIONS_DATA.map(region => `
    <div class="region-card" data-region-id="${region.id}">
      <span class="region-icon">${region.icon}</span>
      <div class="region-info">
        <h4 class="region-title">${escapeHtml(region.labelVi)}</h4>
        <span class="region-sub">${escapeHtml(region.labelEn)}</span>
      </div>
      <button class="region-go-btn" aria-label="Đến vùng ${region.labelVi}">
        <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path d="M5 12h14M12 5l7 7-7 7"/></svg>
      </button>
    </div>
  `).join('');

  container.querySelectorAll('.region-card').forEach(card => {
    card.addEventListener('click', () => {
      const isAlreadyActive = card.classList.contains('active');
      if (isAlreadyActive) {
        // Toggle OFF!
        card.classList.remove('active');
        resetView(viewer);
        showToast('Đã tắt phân vùng - Khôi phục toàn thân');
        if (window.innerWidth <= 1024) {
          document.getElementById('systemsToggle')?.click();
        }
        return;
      }

      container.querySelectorAll('.region-card').forEach(c => c.classList.remove('active'));
      card.classList.add('active');

      const region = REGIONS_DATA.find(r => r.id === card.dataset.regionId);
      if (region && viewer) {
        frameRegion(region.camera, viewer);
        showToast(`Chuyển đến: ${region.labelVi} (Nhấn lại để tắt)`);
        if (window.innerWidth <= 1024) {
          document.getElementById('systemsToggle')?.click();
        }
      }
    });
  });
}

export function renderBookmarksList(viewer) {
  const container = document.getElementById('bookmarksList');
  if (!container) return;

  const bookmarks = getBookmarks();
  if (bookmarks.length === 0) {
    container.innerHTML = `
      <div class="list-empty-state">
        <span class="empty-icon">⭐</span>
        <p>Chưa có cấu trúc nào được lưu</p>
        <span class="hint">Chạm vào cấu trúc 3D và nhấn nút "Lưu" để thêm vào đây</span>
      </div>
    `;
    return;
  }

  container.innerHTML = bookmarks.map(item => `
    <div class="bookmark-item" data-part="${escapeHtml(item.id)}">
      <div class="bookmark-info">
        <h4 class="bookmark-name">${escapeHtml(item.nameVi || item.id)}</h4>
        ${item.nameLatin ? `<span class="bookmark-latin">${escapeHtml(item.nameLatin)}</span>` : ''}
      </div>
      <button class="bookmark-remove-btn" data-remove="${escapeHtml(item.id)}" title="Xóa khỏi lưu trữ">&times;</button>
    </div>
  `).join('');

  container.querySelectorAll('.bookmark-item').forEach(item => {
    item.addEventListener('click', (e) => {
      if (e.target.closest('.bookmark-remove-btn')) return;
      selectPartById(item.dataset.part, viewer);
      if (window.innerWidth <= 1024) {
        document.getElementById('systemsToggle')?.click();
      }
    });
  });

  container.querySelectorAll('.bookmark-remove-btn').forEach(btn => {
    btn.addEventListener('click', (e) => {
      e.stopPropagation();
      toggleBookmark(btn.dataset.remove);
      renderBookmarksList(viewer);
      showToast('Đã xóa khỏi danh sách đã lưu');
    });
  });
}

function formatRelativeTime(ts) {
  if (!ts) return '';
  const diff = Date.now() - ts;
  const mins = Math.floor(diff / 60000);
  if (mins < 1) return 'Vừa xong';
  if (mins < 60) return `${mins}p trước`;
  const hours = Math.floor(mins / 60);
  if (hours < 24) return `${hours}h trước`;
  return `${Math.floor(hours / 24)}d trước`;
}

export function renderHistoryList(viewer) {
  const container = document.getElementById('historyList');
  if (!container) return;

  const history = getHistory();
  if (history.length === 0) {
    container.innerHTML = `
      <div class="list-empty-state">
        <span class="empty-icon">🕒</span>
        <p>Chưa có lịch sử quan sát</p>
        <span class="hint">Các bộ phận bạn vừa xem sẽ hiển thị tại đây</span>
      </div>
    `;
    return;
  }

  container.innerHTML = history.slice(0, 30).map(item => `
    <div class="history-item" data-part="${escapeHtml(item.id)}">
      <div class="history-info">
        <h4 class="history-name">${escapeHtml(item.nameVi || item.id)}</h4>
        ${item.nameLatin ? `<span class="history-latin">${escapeHtml(item.nameLatin)}</span>` : ''}
      </div>
      <span class="history-time">${formatRelativeTime(item.time)}</span>
    </div>
  `).join('');

  container.querySelectorAll('.history-item').forEach(item => {
    item.addEventListener('click', () => {
      selectPartById(item.dataset.part, viewer);
      if (window.innerWidth <= 1024) {
        document.getElementById('systemsToggle')?.click();
      }
    });
  });
}

// Floating Tools Bar (Visible Body Style: Explode, Labels, Clipping, Measurement, Study, Quiz)
export function initFloatingTools(viewer) {
  const btnToggleTools = document.getElementById('btnToggleTools');
  const viewerTools = document.getElementById('viewerTools');

  // On mobile screens, default to collapsed to keep 3D view 100% clean and unobstructed
  if (window.innerWidth <= 1024 && viewerTools) {
    viewerTools.classList.add('collapsed');
  }

  const updateToggleIcon = () => {
    const isCollapsed = viewerTools?.classList.contains('collapsed');
    const icon = btnToggleTools?.querySelector('.collapse-icon');
    if (icon) {
      icon.innerHTML = isCollapsed 
        ? ICONS.toolsFab 
        : `<svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path d="M18 6L6 18M6 6l12 12"/></svg>`;
    }
  };
  updateToggleIcon();

  btnToggleTools?.addEventListener('click', () => {
    viewerTools?.classList.toggle('collapsed');
    updateToggleIcon();
  });

  // Touch outside on canvas auto-collapses tools on mobile
  const canvas = document.getElementById('threeCanvas');
  const autoCollapse = () => {
    if (window.innerWidth <= 1024 && viewerTools && !viewerTools.classList.contains('collapsed')) {
      viewerTools.classList.add('collapsed');
      updateToggleIcon();
    }
  };
  canvas?.addEventListener('click', autoCollapse);
  canvas?.addEventListener('pointerdown', autoCollapse);

  const btnAI = document.getElementById('btnToolAI');
  btnAI?.addEventListener('click', () => {
    const modal = document.getElementById('aiAssistantModal');
    if (modal && !modal.classList.contains('hidden')) {
      closeAIAssistant();
      btnAI.classList.remove('active');
    } else {
      openAIAssistant(viewer);
      btnAI.classList.add('active');
    }
  });

  // Hands-free Voice AI Controller
  initVoiceController(viewer);

  const btnExplode = document.getElementById('btnToolExplode');
  const explodePopover = document.getElementById('explodePopover');
  const explodeSlider = document.getElementById('explodeSlider');
  const explodeValue = document.getElementById('explodeValue');
  const explodeClose = document.getElementById('explodeCloseBtn');

  btnExplode?.addEventListener('click', () => {
    const isHidden = explodePopover.classList.toggle('hidden');
    btnExplode.classList.toggle('active', !isHidden);
  });

  explodeClose?.addEventListener('click', () => {
    explodePopover.classList.add('hidden');
    btnExplode?.classList.remove('active');
  });

  explodeSlider?.addEventListener('input', (e) => {
    const val = parseInt(e.target.value, 10) || 0;
    if (explodeValue) explodeValue.textContent = `${val}%`;
    setExplodeFactor(val / 100, viewer);
  });

  const btnLabels = document.getElementById('btnToolLabels');
  btnLabels?.addEventListener('click', () => {
    const visible = toggleLabels(viewer);
    btnLabels.classList.toggle('active', visible);
    showToast(visible ? 'Đã BẬT nhãn mốc giải phẫu 3D' : 'Đã TẮT nhãn 3D');
  });

  // 3D Clipping Planes
  const btnClipping = document.getElementById('btnToolClipping');
  const clippingPopover = document.getElementById('clippingPopover');
  const clippingClose = document.getElementById('clippingCloseBtn');
  const planeButtons = document.querySelectorAll('.clipping-plane-select .plane-btn');
  const clippingSlider = document.getElementById('clippingSlider');
  const clippingValue = document.getElementById('clippingValue');
  const clipFlipBtn = document.getElementById('clipFlipBtn');
  const clipResetBtn = document.getElementById('clipResetBtn');

  btnClipping?.addEventListener('click', () => {
    const isHidden = clippingPopover.classList.toggle('hidden');
    btnClipping.classList.toggle('active', !isHidden);
    if (!isHidden) {
      const activeBtn = document.querySelector('.clipping-plane-select .plane-btn.active');
      const plane = activeBtn?.dataset.plane || 'sagittal';
      setClippingPlane(plane, viewer);
      showToast(`Mặt cắt ${plane === 'sagittal' ? 'Đứng dọc' : plane === 'coronal' ? 'Đứng ngang' : 'Ngang'} BẬT`);
    }
  });

  clippingClose?.addEventListener('click', () => {
    clippingPopover.classList.add('hidden');
    btnClipping?.classList.remove('active');
  });

  planeButtons.forEach(btn => {
    btn.addEventListener('click', () => {
      planeButtons.forEach(b => b.classList.toggle('active', b === btn));
      const plane = btn.dataset.plane;
      setClippingPlane(plane, viewer);
      if (clippingSlider) {
        clippingSlider.value = 0;
        if (clippingValue) clippingValue.textContent = '0.0 cm';
      }
      showToast(`Mặt cắt: ${btn.textContent.trim()}`);
    });
  });

  clippingSlider?.addEventListener('input', (e) => {
    const offset = parseFloat(e.target.value) || 0;
    updateClippingOffset(offset);
    if (clippingValue) clippingValue.textContent = `${(offset * 100).toFixed(1)} cm`;
  });

  clipFlipBtn?.addEventListener('click', () => {
    toggleClippingFlip();
    showToast('Đã đảo chiều mặt cắt');
  });

  clipResetBtn?.addEventListener('click', () => {
    disableClipping(viewer);
    clippingPopover.classList.add('hidden');
    btnClipping?.classList.remove('active');
    document.getElementById('halfBodyBtn')?.classList.remove('active');
    document.getElementById('btnToolHalfBody')?.classList.remove('active');
    document.getElementById('halfBodyPill')?.classList.add('hidden');
    showToast('Đã tắt mặt cắt 3D');
  });

  // Half-Body Hemisection Toolbar & Floating Pill controls
  const btnToolHalfBody = document.getElementById('btnToolHalfBody');
  const pillFlipHalfBodyBtn = document.getElementById('pillFlipHalfBodyBtn');
  const pillCloseHalfBodyBtn = document.getElementById('pillCloseHalfBodyBtn');

  btnToolHalfBody?.addEventListener('click', () => handleHalfBodyToggle(viewer));
  pillFlipHalfBodyBtn?.addEventListener('click', () => handleHalfBodyFlip(viewer));
  pillCloseHalfBodyBtn?.addEventListener('click', () => closeHalfBody(viewer));

  // 3D Measurement Caliper
  const btnMeasure = document.getElementById('btnToolMeasure');
  const measurePopover = document.getElementById('measurePopover');
  const measureClose = document.getElementById('measureCloseBtn');
  const measureBody = document.getElementById('measureBody');
  const measureClearBtn = document.getElementById('measureClearBtn');
  const measureSaveNoteBtn = document.getElementById('measureSaveNoteBtn');
  let currentMeasureResult = null;

  btnMeasure?.addEventListener('click', () => {
    const active = toggleMeasurementMode(viewer, (data) => {
      currentMeasureResult = data;
      if (!measureBody) return;
      if (data.status === 'point1_set' || data.state === 'point1') {
        measureBody.innerHTML = `
          <div style="display:flex; align-items:center; gap:8px;">
            <span style="font-size:16px;">📍</span>
            <span style="color:#58a6ff; font-weight:600; font-size:12px;">Đã chọn Điểm A. Chạm Điểm B trên mô hình 3D...</span>
          </div>
        `;
      } else if (data.status === 'completed' || data.state === 'point2') {
        const cm = typeof data.distanceCm === 'number' ? data.distanceCm.toFixed(1) : data.distanceCm;
        const mm = typeof data.distanceMm === 'number' ? data.distanceMm.toFixed(0) : data.distanceMm;
        measureBody.innerHTML = `
          <div style="background: rgba(35,134,54,0.15); border: 1px solid rgba(46,160,67,0.4); border-radius: 8px; padding: 10px; text-align: center;">
            <div style="font-size: 20px; font-weight: 700; color: #3fb950; letter-spacing: 0.5px;">${cm} cm</div>
            <div style="font-size: 11px; color: #8b949e; margin-top: 2px;">Khoảng cách 3D thực (${mm} mm)</div>
          </div>
        `;
      } else {
        measureBody.innerHTML = `<p class="measure-status">Chạm vào điểm thứ nhất trên mô hình 3D...</p>`;
      }
    });

    btnMeasure.classList.toggle('active', active);
    measurePopover.classList.toggle('hidden', !active);
    if (active) {
      showToast('Thước đo 3D BẬT: Chạm 2 điểm trên cơ thể để đo');
    } else {
      showToast('Đã tắt thước đo 3D');
    }
  });

  measureClose?.addEventListener('click', () => {
    if (isMeasurementActive()) {
      toggleMeasurementMode(viewer);
      btnMeasure?.classList.remove('active');
    }
    measurePopover.classList.add('hidden');
  });

  measureClearBtn?.addEventListener('click', () => {
    clearMeasurement();
    currentMeasureResult = null;
    if (measureBody) {
      measureBody.innerHTML = `<p class="measure-status">Đã xóa. Chạm vào điểm thứ nhất trên mô hình 3D...</p>`;
    }
  });

  measureSaveNoteBtn?.addEventListener('click', () => {
    if (!currentMeasureResult || (currentMeasureResult.status !== 'completed' && currentMeasureResult.state !== 'point2')) {
      showToast('Cần đo đủ 2 điểm trước khi lưu');
      return;
    }
    const cm = typeof currentMeasureResult.distanceCm === 'number' ? currentMeasureResult.distanceCm.toFixed(1) : currentMeasureResult.distanceCm;
    const mm = typeof currentMeasureResult.distanceMm === 'number' ? currentMeasureResult.distanceMm.toFixed(0) : currentMeasureResult.distanceMm;
    const noteText = `[Đo kích thước 3D]: ${cm} cm (${mm} mm)`;
    const partId = state.selectedPart?.id || 'measurement_note_' + Date.now();
    saveNote(partId, noteText, {
      nameVi: state.selectedPart?.displayName ? `${state.selectedPart.displayName} (Kích thước)` : 'Số đo giải phẫu 3D',
      nameLatin: state.selectedPart?.info?.latinName,
      system: state.selectedPart?.system || 'skeletal'
    });
    showToast('Đã lưu số đo vào mục Ghi chú 📝');
  });

  // Guided Study Mode
  const btnStudy = document.getElementById('btnToolStudy');
  btnStudy?.addEventListener('click', () => {
    const modal = document.getElementById('studyModeModal');
    if (modal && !modal.classList.contains('hidden')) {
      closeStudyMode(viewer);
      btnStudy.classList.remove('active');
    } else {
      openStudyModulePicker(viewer);
      btnStudy.classList.add('active');
    }
  });

  // Medical Exam Mode
  const btnQuiz = document.getElementById('btnToolQuiz');
  btnQuiz?.addEventListener('click', () => {
    if (isQuizRunning()) {
      stopQuiz();
      btnQuiz.classList.remove('active');
    } else {
      startQuiz(viewer);
      btnQuiz.classList.add('active');
    }
  });

  // Dynamic Anatomy & Physiological Motion Mode
  const btnMotion = document.getElementById('btnToolMotion');
  btnMotion?.addEventListener('click', async () => {
    const { toggleMotionPanel } = await import('./motionPanel.js');
    toggleMotionPanel(viewer);
  });

  // Augmented Reality (AR) Mode
  const btnAR = document.getElementById('btnToolAR');
  btnAR?.addEventListener('click', async () => {
    const { openARModal, closeARModal } = await import('./arModal.js');
    const hud = document.getElementById('arHUD');
    if (hud && !hud.classList.contains('hidden')) {
      closeARModal();
      btnAR.classList.remove('active');
    } else {
      openARModal(viewer);
      btnAR.classList.add('active');
    }
  });

  // Offline & PWA Storage Manager Mode (LỆNH #06)
  const btnOffline = document.getElementById('btnToolOffline');
  btnOffline?.addEventListener('click', async () => {
    const { openOfflineModal, closeOfflineModal } = await import('./offlineModal.js');
    const modal = document.getElementById('offlineModal');
    if (modal && !modal.classList.contains('hidden')) {
      closeOfflineModal();
      btnOffline.classList.remove('active');
    } else {
      openOfflineModal(viewer);
      btnOffline.classList.add('active');
    }
  });

  const netStatusBadge = document.getElementById('netStatusBadge');
  netStatusBadge?.addEventListener('click', async () => {
    const { openOfflineModal } = await import('./offlineModal.js');
    openOfflineModal(viewer);
  });

  // Subscribe to live network & sync status
  import('../utils/syncManager.js').then(({ subscribeNetworkStatus, initSyncManager }) => {
    initSyncManager();
    subscribeNetworkStatus(({ isOnline, isSyncing, pendingCount }) => {
      const badge = document.getElementById('netStatusBadge');
      const text = document.getElementById('netStatusText');
      if (!badge || !text) return;

      badge.className = `net-status-badge ${isOnline ? (isSyncing ? 'syncing' : 'online') : 'offline'}`;
      if (isSyncing) {
        text.textContent = 'Đang đồng bộ...';
      } else if (!isOnline) {
        text.textContent = pendingCount > 0 ? `Offline (${pendingCount})` : 'Ngoại tuyến';
      } else {
        text.textContent = pendingCount > 0 ? `Chờ sync (${pendingCount})` : 'Trực tuyến';
      }
    });
  }).catch((err) => console.warn('Sync manager init skipped:', err));
}

// Help modal
export function initHelpModal() {
  const modal = document.getElementById('helpModal');
  const openBtn = document.getElementById('helpBtn');
  const closeBtn = document.getElementById('helpClose');
  const overlay = modal?.querySelector('.modal-overlay');
  if (!modal) return;

  let release = null;

  function open() {
    modal.classList.remove('hidden');
    setInert(modal, false);
    // A modal dialog keeps the focus until it is dismissed, and hands it back
    // to whatever opened it.
    release = trapFocus(modal.querySelector('.modal-content') || modal, { onEscape: close, returnFocusTo: openBtn });
  }

  function close() {
    if (modal.classList.contains('hidden')) return;
    modal.classList.add('hidden');
    setInert(modal, true);
    release?.();
    release = null;
  }

  setInert(modal, true);

  openBtn?.addEventListener('click', open);
  closeBtn?.addEventListener('click', close);
  overlay?.addEventListener('click', close);
}

// Language selector
export function initLanguageSelector() {
  const select = document.getElementById('langSelect');
  if (select) {
    select.value = state.language || 'it';
    select.addEventListener('change', (e) => {
      setLanguage(e.target.value);
    });
  }
}

// Search functionality
export function initSearch() {
  const input = document.getElementById('searchInput');
  const results = document.getElementById('searchResults');

  if (!input || !results) return;

  input.addEventListener('input', debounce((e) => {
    const query = e.target.value.toLowerCase().trim();
    if (query.length < 2) {
      results.innerHTML = '';
      results.classList.remove('show');
      return;
    }

    const matches = searchStructures(query);
    if (matches.length > 0) {
      const lang = state.language || 'it';

      results.innerHTML = matches.map((row, index) => {
        // Paired structures are one row with a side chip each, instead of two
        // near-identical rows.
        const sides = ['left', 'right']
          .filter(side => row.sides[side])
          .map(side => `<button type="button" class="result-side" data-part="${escapeHtml(row.sides[side])}" title="${translate(side === 'left' ? 'side_left' : 'side_right')}">${translate(side === 'left' ? 'side_left_short' : 'side_right_short')}</button>`)
          .join('');

        const target = row.sides.none || row.sides.right || row.sides.left;
        const pending = state.loadedSystems.includes(row.system) ? '' : ' is-pending';

        return `
          <div class="search-result-item${pending}" role="option" id="search-option-${index}" aria-selected="false" data-part="${escapeHtml(target)}">
            <span class="result-name">${escapeHtml(row.label)}</span>
            <span class="result-sides">${sides}</span>
            <span class="result-system">${escapeHtml(systemLabel(row.system, lang))}</span>
          </div>
        `;
      }).join('');

      results.classList.add('show');

      const choose = async (partId) => {
        input.value = '';
        results.innerHTML = '';
        results.classList.remove('show');
        document.querySelector('.header')?.classList.remove('search-open');
        document.getElementById('searchOpen')?.setAttribute('aria-expanded', 'false');
        input.blur();
        await selectStructureAnywhere(partId);
      };

      results.querySelectorAll('.search-result-item').forEach(item => {
        item.addEventListener('click', (clickEvent) => {
          const side = clickEvent.target.closest('.result-side');
          choose(side ? side.dataset.part : item.dataset.part);
        });
      });
    } else {
      results.innerHTML = `<div class="search-result-item is-empty" role="option" aria-disabled="true">${translate('no_results')}</div>`;
      results.classList.add('show');
    }
  }, 150));

  // Close results on click outside
  document.addEventListener('click', (e) => {
    if (!input.contains(e.target) && !results.contains(e.target)) {
      results.classList.remove('show');
    }
  });

  // Combobox semantics: the field keeps the focus and the arrows move an
  // "active" option, which is what a screen reader announces.
  input.setAttribute('role', 'combobox');
  input.setAttribute('aria-autocomplete', 'list');
  input.setAttribute('aria-expanded', 'false');
  input.setAttribute('aria-controls', 'searchResults');
  results.setAttribute('role', 'listbox');

  let activeIndex = -1;

  function options() {
    return [...results.querySelectorAll('.search-result-item:not(.is-empty)')];
  }

  function setActive(index) {
    const list = options();
    list.forEach(option => {
      option.classList.remove('is-active');
      option.setAttribute('aria-selected', 'false');
    });

    activeIndex = list.length ? (index + list.length) % list.length : -1;
    const active = list[activeIndex];

    if (active) {
      active.classList.add('is-active');
      active.setAttribute('aria-selected', 'true');
      active.scrollIntoView({ block: 'nearest' });
      input.setAttribute('aria-activedescendant', active.id);
    } else {
      input.removeAttribute('aria-activedescendant');
    }
  }

  function closeResults() {
    results.classList.remove('show');
    input.setAttribute('aria-expanded', 'false');
    input.removeAttribute('aria-activedescendant');
    activeIndex = -1;
  }

  // The list is rebuilt on every keystroke, so the active option resets with it.
  const observer = new MutationObserver(() => {
    input.setAttribute('aria-expanded', String(results.classList.contains('show')));
    activeIndex = -1;
  });
  observer.observe(results, { childList: true });

  input.addEventListener('keydown', (e) => {
    if (e.key === 'Escape') {
      closeResults();
      input.blur();
      return;
    }

    if (!results.classList.contains('show')) return;

    if (e.key === 'ArrowDown') {
      e.preventDefault();
      setActive(activeIndex + 1);
    } else if (e.key === 'ArrowUp') {
      e.preventDefault();
      setActive(activeIndex - 1);
    } else if (e.key === 'Enter') {
      const list = options();
      const target = list[activeIndex] || list[0];
      if (target) {
        e.preventDefault();
        target.click();
      }
    }
  });
}

function debounce(fn, delay) {
  let timeoutId;
  return (...args) => {
    clearTimeout(timeoutId);
    timeoutId = setTimeout(() => fn(...args), delay);
  };
}

// State change handlers
subscribe('selectedPart', onSelectionChange);
subscribe('language', onLanguageChange);
subscribe('partStates', onPartStatesChange);

function onSelectionChange(part) {
  // Update sidebar highlights
  document.querySelectorAll('.structure-item.selected').forEach(el => {
    el.classList.remove('selected');
  });

  const card = document.getElementById('selectionCard');

  if (part) {
    trackPartViewed(part.id);
    const item = document.querySelector(`.structure-item[data-part="${part.id}"]`);
    if (item) item.classList.add('selected');

    if (card) {
      card.classList.remove('hidden');
      const title = document.getElementById('cardTitle');
      const subtitle = document.getElementById('cardSubtitle');
      const lang = state.language || 'vi';
      const info = part.info || {};
      const name = info.name?.[lang] || info.name?.vi || part.displayName;
      if (title) title.textContent = name;
      const sysName = systemLabel(info.system || part.system, lang);
      if (subtitle) {
        subtitle.textContent = info.latinName ? `${info.latinName} • ${sysName}` : sysName;
      }
    }

    updateBookmarkButton(part.id);
    updateFooterButtons(part);
    document.getElementById('cardIsolateBtn')?.classList.toggle('active', !!(part && state.isolatedPart === part.id));
  } else {
    document.getElementById('cardIsolateBtn')?.classList.remove('active');
    if (card) card.classList.add('hidden');
    document.getElementById('footerBar')?.style.setProperty('display', 'none');
  }
}

function onLanguageChange(lang) {
  // Update UI text
  updateUIText(lang);

  // Re-render sidebar
  initSystemsSidebar();

  // Re-render info panel if part selected
  if (state.selectedPart) {
    selectPartById(state.selectedPart.id, state.viewer);
  }
}

function onPartStatesChange(partStates) {
  // Update checkboxes in sidebar
  partStates.forEach((partState, partId) => {
    const checkbox = document.querySelector(`[data-part-checkbox="${partId}"]`);
    if (checkbox) {
      checkbox.checked = partState.visible !== false;
    }

    const item = document.querySelector(`.structure-item[data-part="${partId}"]`);
    if (item) {
      item.classList.toggle('hidden', partState.visible === false);
      item.style.opacity = partState.opacity < 1 ? '0.5' : '1';
    }
  });
}

function updateFooterButtons(part) {
  const footer = document.getElementById('footerBar');
  if (!footer) return;

  footer.style.display = 'flex';

  const isolateBtn = document.getElementById('footerIsolateBtn');
  const hideBtn = document.getElementById('footerHideBtn');
  const transparentBtn = document.getElementById('footerTransparentBtn');

  if (isolateBtn) isolateBtn.disabled = false;
  if (hideBtn) hideBtn.disabled = false;
  if (transparentBtn) transparentBtn.disabled = false;

  const visibility = getPartVisibility(part.id);
  if (transparentBtn) {
    transparentBtn.textContent = translate(visibility.opacity < 1 ? 'opaque' : 'transparent');
  }
}

function updateUIText(lang) {
  const t = (key) => translate(key, lang);

  // Assistive technology takes pronunciation and language from the document,
  // not from the picker in the header.
  document.documentElement.lang = lang;

  // Update placeholders
  const searchInput = document.getElementById('searchInput');
  if (searchInput) searchInput.placeholder = t('search_placeholder');

  // Update button titles
  const updates = [
    ['resetBtn', 'reset'],
    ['isolateBtn', 'isolate'],
    ['hideBtn', 'hide'],
    ['transparentBtn', 'transparent'],
    ['frontViewBtn', 'front_view'],
    ['sideViewBtn', 'side_view'],
    ['backViewBtn', 'back_view'],
    ['topViewBtn', 'top_view'],
    ['footerIsolateBtn', 'isolate'],
    ['footerHideBtn', 'hide'],
    ['footerTransparentBtn', 'transparent'],
    ['footerShowAllBtn', 'show_all']
  ];

  updates.forEach(([id, key]) => {
    const el = document.getElementById(id);
    if (el) {
      el.title = t(key);
      const ctrlText = el.querySelector('.ctrl-text');
      if (ctrlText) {
        ctrlText.textContent = t(key);
      } else if (el.tagName === 'BUTTON' && !el.querySelector('svg') && !el.querySelector('.ctrl-icon')) {
        el.textContent = t(key);
      }
    }
  });

  // Update sidebar headers
  const systemsHeader = document.querySelector('.sidebar-systems .sidebar-header h2');
  if (systemsHeader) systemsHeader.textContent = t('systems');

  const infoHeader = document.querySelector('.sidebar-info .sidebar-header h2');
  if (infoHeader) infoHeader.textContent = t('info');

  // Static markup opts in with data-i18n; that is what keeps the help modal
  // from staying in English after switching language.
  document.querySelectorAll('[data-i18n]').forEach(element => {
    element.textContent = t(element.dataset.i18n);
  });

  const depthLabel = document.querySelector('.depth-label');
  if (depthLabel) depthLabel.textContent = t('depth');

  const depthSlider = document.getElementById('depthSlider');
  if (depthSlider) depthSlider.setAttribute('aria-label', t('depth'));
}

// Initialize all UI
export async function initUI(viewer) {
  await loadAllData();
  // The markup is written in English; anything else comes from the dictionaries.
  updateUIText(state.language);
  initSystemsSidebar();
  initDrawerTabs(viewer);
  initToolbar(viewer);
  initFloatingTools(viewer);
  initFooterActions(viewer);
  initVideoModal();
  initLabels(viewer);
  initClipping(viewer);
  initHelpModal();
  initAIAssistantUI(viewer);
  initLanguageSelector();
  initSearch();
  initDrawers();
  initMobileSearch();
  initDepthSlider();

  // Complete Anatomy Style System Stepper, Floating AI Widget, Fullscreen Controller & Atlas 2027 Hub
  initSystemsLayerController(viewer);
  initFloatingAIButton(viewer);
  initFullscreenController(viewer);
  initAtlasHub(viewer);
}

// Under 1024px the search field is hidden; this button is the only way to it.
function initMobileSearch() {
  const button = document.getElementById('searchOpen');
  const header = document.querySelector('.header');
  const input = document.getElementById('searchInput');
  if (!button || !header || !input) return;

  button.addEventListener('click', () => {
    const open = header.classList.toggle('search-open');
    button.setAttribute('aria-expanded', String(open));
    if (open) input.focus();
  });

  input.addEventListener('keydown', e => {
    if (e.key === 'Escape') {
      header.classList.remove('search-open');
      button.setAttribute('aria-expanded', 'false');
      input.blur();
    }
  });
}

// On narrow layouts both sidebars slide off-canvas; these wire the header
// buttons that bring them back and the close buttons inside them.
function initDrawers() {
  const app = document.getElementById('app');
  const drawerQuery = window.matchMedia('(max-width: 1024px)');

  const panels = {
    systems: { el: document.getElementById('systemsSidebar'), closed: '-100%', flag: 'systems-open', trigger: 'systemsOpen' },
    info: { el: document.getElementById('infoSidebar'), closed: '100%', flag: 'info-open', trigger: 'infoOpen' }
  };

  // The drawer offset is written inline rather than left to a class, because
  // the off-canvas transform is declared in several places and whichever rule
  // wins is not worth reasoning about every time the stylesheet moves.
  function apply(name, open, { moveFocus = false } = {}) {
    const panel = panels[name];
    if (!panel.el) return;

    app?.classList.toggle(panel.flag, open);

    if (drawerQuery.matches) {
      panel.el.style.transform = open ? 'translateX(0)' : `translateX(${panel.closed})`;
    } else {
      panel.el.style.transform = '';
    }

    // Touch / Click Outside Backdrop for Drawers on Mobile
    const backdrop = document.getElementById('sidebarBackdrop');
    if (backdrop && drawerQuery.matches) {
      const anyOpen = (name === 'systems' ? open : isOpen('systems')) || (name === 'info' ? open : isOpen('info'));
      backdrop.classList.toggle('active', anyOpen);
    }

    // A panel that is off screen must not be reachable with Tab. The systems
    // panel is a real column on desktop, so it only goes inert as a drawer.
    const offScreen = name === 'systems' ? drawerQuery.matches && !open : !open;
    setInert(panel.el, offScreen);

    const trigger = document.getElementById(panel.trigger);
    trigger?.setAttribute('aria-expanded', String(open));

    if (!moveFocus) return;

    if (open) {
      focusFirst(panel.el);
    } else if (trigger && trigger.offsetParent !== null) {
      trigger.focus();
    } else {
      // The trigger is hidden at this width; park the focus somewhere sane.
      document.getElementById('threeCanvas')?.focus();
    }
  }

  function isOpen(name) {
    return app?.classList.contains(panels[name].flag);
  }

  document.getElementById('systemsOpen')?.addEventListener('click', () => apply('systems', !isOpen('systems'), { moveFocus: true }));
  document.getElementById('systemsToggle')?.addEventListener('click', () => apply('systems', false, { moveFocus: true }));
  document.getElementById('infoOpen')?.addEventListener('click', () => apply('info', !isOpen('info'), { moveFocus: true }));
  document.getElementById('infoToggle')?.addEventListener('click', () => apply('info', false, { moveFocus: true }));

  // Auto-dismiss when touching or clicking backdrop
  const backdrop = document.getElementById('sidebarBackdrop');
  if (backdrop) {
    backdrop.addEventListener('click', () => {
      if (isOpen('systems')) apply('systems', false, { moveFocus: true });
      if (isOpen('info')) apply('info', false, { moveFocus: true });
    });
    backdrop.addEventListener('touchstart', (e) => {
      e.preventDefault();
      if (isOpen('systems')) apply('systems', false, { moveFocus: true });
      if (isOpen('info')) apply('info', false, { moveFocus: true });
    }, { passive: false });
  }

  // Auto-dismiss when touching / orbiting on 3D canvas
  const canvas = document.getElementById('threeCanvas');
  canvas?.addEventListener('pointerdown', () => {
    if (drawerQuery.matches) {
      if (isOpen('systems')) apply('systems', false);
      if (isOpen('info')) apply('info', false);
    }
  });

  // Global document pointerdown to catch any click outside sidebars & triggers
  document.addEventListener('pointerdown', (e) => {
    if (!drawerQuery.matches) return;
    if (!isOpen('systems') && !isOpen('info')) return;
    const inSystems = panels.systems.el?.contains(e.target);
    const inInfo = panels.info.el?.contains(e.target);
    const isTrigger = e.target.closest('#systemsOpen') || e.target.closest('#infoOpen');
    if (!inSystems && !inInfo && !isTrigger) {
      if (isOpen('systems')) apply('systems', false);
      if (isOpen('info')) apply('info', false);
    }
  });

  // Escape closes whichever panel the focus is in.
  Object.entries(panels).forEach(([name, panel]) => {
    panel.el?.addEventListener('keydown', event => {
      if (event.key === 'Escape' && isOpen(name)) apply(name, false, { moveFocus: true });
    });
  });

  // Crossing the breakpoint must not leave a drawer offset stuck on a panel
  // that is now part of the desktop layout.
  drawerQuery.addEventListener('change', () => {
    apply('systems', isOpen('systems'));
    apply('info', isOpen('info'));
  });

  // On a phone the systems drawer starts closed; on desktop it is a column.
  apply('systems', false);
  apply('info', false);
}