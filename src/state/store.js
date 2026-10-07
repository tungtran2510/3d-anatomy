// State Management - Single source of truth for application state
import { translationsVi, translationsEn, translationsIt } from '../data/translations.js';

export const state = {
  // Selected structure
  selectedPart: null,

  // Loaded systems
  loadedSystems: [],

  // Visibility states per part
  partStates: new Map(), // Map<partId, { visible: true, opacity: 1, selected: false }>

  // Currently isolated part (null = none isolated)
  isolatedPart: null,

  // Parts that are hidden
  hiddenParts: new Set(),

  // Parts with transparency
  transparentParts: new Set(),

  // Current language
  language: 'vi',

  // Dissect Mode (Visible Body scalpel mode)
  dissectMode: false,
  undoStack: [],

  // Loaded data
  partsData: null,
  systemsData: null,
  regionsData: null,
  translations: { vi: translationsVi, en: translationsEn, it: translationsIt },

  // Search index
  searchIndex: [],

  // Camera/view state
  currentView: 'front',
  isAnimating: false,

  // Loading state
  loading: {
    systems: {},
    progress: 0,
    total: 0
  },

  // Viewer reference (set after initialization)
  viewer: null,

  // Selection history for undo
  selectionHistory: [],
  maxHistory: 20
};

// Subscribers for reactive updates
const subscribers = new Map(); // Map<key, Set<callback>>

export function subscribe(key, callback) {
  if (!subscribers.has(key)) {
    subscribers.set(key, new Set());
  }
  subscribers.get(key).add(callback);
  return () => unsubscribe(key, callback);
}

export function unsubscribe(key, callback) {
  if (subscribers.has(key)) {
    subscribers.get(key).delete(callback);
  }
}

export function notify(key, value) {
  if (subscribers.has(key)) {
    subscribers.get(key).forEach(cb => cb(value));
  }

  // Rendering is on demand, so anything that changes the scene has to ask for
  // a frame. Every mutation already goes through notify(), and requesting one
  // is just setting a flag.
  state.viewer?.render?.();
}

// State setters with notification
export function setSelectedPart(part) {
  state.selectedPart = part;
  if (part) {
    // Add to history
    state.selectionHistory.unshift(part);
    if (state.selectionHistory.length > state.maxHistory) {
      state.selectionHistory.pop();
    }
  }
  notify('selectedPart', part);
}

let partStateBatchDepth = 0;

export function setPartState(partId, updates) {
  const current = state.partStates.get(partId) || { visible: true, opacity: 1, selected: false };
  state.partStates.set(partId, { ...current, ...updates });
  if (partStateBatchDepth === 0) notify('partStates', state.partStates);
}

// Bulk operations (isolate, show all, per-system toggles) touch every structure.
// Subscribers walk the whole map, so notifying once per structure turns a single
// click into thousands of DOM queries.
export function batchPartStates(fn) {
  partStateBatchDepth++;
  try {
    fn();
  } finally {
    partStateBatchDepth--;
    if (partStateBatchDepth === 0) notify('partStates', state.partStates);
  }
}

export function setPartStates(partStates) {
  state.partStates = partStates;
  notify('partStates', partStates);
}

export function setIsolatedPart(partId) {
  state.isolatedPart = partId;
  notify('isolatedPart', partId);
}

export function setHiddenParts(parts) {
  state.hiddenParts = new Set(parts);
  notify('hiddenParts', state.hiddenParts);
}

export function setTransparentParts(parts) {
  state.transparentParts = new Set(parts);
  notify('transparentParts', state.transparentParts);
}

export function setLanguage(lang) {
  state.language = lang;
  notify('language', lang);
}

export function setPartsData(data) {
  state.partsData = data;
  notify('partsData', data);
}

export function setSystemsData(data) {
  state.systemsData = data;
  notify('systemsData', data);
}

export function setRegionsData(data) {
  state.regionsData = data;
  notify('regionsData', data);
}

export function setTranslations(data) {
  state.translations = {
    vi: { ...translationsVi, ...(data.vi || {}) },
    en: { ...translationsEn, ...(data.en || {}) },
    it: { ...translationsIt, ...(data.it || {}) }
  };
  notify('translations', state.translations);
}

export function setSearchIndex(index) {
  state.searchIndex = index;
  notify('searchIndex', index);
}

export function setCurrentView(view) {
  state.currentView = view;
  notify('currentView', view);
}

export function setAnimating(animating) {
  state.isAnimating = animating;
  notify('isAnimating', animating);
}

export function setLoadingSystem(system, loaded, progress = 100, detail = {}) {
  state.loading.systems[system] = { loaded, progress, ...detail };
  const loadedCount = Object.values(state.loading.systems).filter(s => s.loaded).length;
  const totalCount = Object.keys(state.loading.systems).length;
  state.loading.progress = totalCount > 0 ? (loadedCount / totalCount) * 100 : 0;
  state.loading.total = totalCount;
  notify('loading', { ...state.loading, system, ...state.loading.systems[system] });
}

export function setViewer(viewer) {
  state.viewer = viewer;
}

export function getViewer() {
  return state.viewer;
}

// Returns the stored entry, creating it on first use. It used to hand back a
// throwaway object, so callers that mutated it silently lost the change.
export function getPartState(partId) {
  let partState = state.partStates.get(partId);
  if (!partState) {
    partState = { visible: true, opacity: 1, selected: false };
    state.partStates.set(partId, partState);
  }
  return partState;
}

export function isPartVisible(partId) {
  const partState = getPartState(partId);
  if (state.isolatedPart && state.isolatedPart !== partId) return false;
  return partState.visible && !state.hiddenParts.has(partId);
}

export function getStructureInfo(partId) {
  if (!state.partsData || !partId) return null;
  if (state.partsData[partId]) return state.partsData[partId];
  if (state.partsData[`${partId}.r`]) return state.partsData[`${partId}.r`];
  if (state.partsData[`${partId}.l`]) return state.partsData[`${partId}.l`];
  const lower = partId.toLowerCase();
  for (const [k, v] of Object.entries(state.partsData)) {
    if (k.toLowerCase() === lower || k.toLowerCase() === `${lower}.r` || k.toLowerCase() === `${lower}.l`) {
      return v;
    }
  }
  return null;
}

export function translate(key, lang = state.language) {
  const dict = state.translations[lang] || state.translations.vi || state.translations.en || state.translations.it || {};
  return dict[key] || key;
}

export function setDissectMode(enabled) {
  state.dissectMode = enabled;
  notify('dissectMode', enabled);
}

export function pushUndo(action) {
  if (!action) return;
  state.undoStack.push(action);
  if (state.undoStack.length > 50) {
    state.undoStack.shift();
  }
  notify('undoStack', state.undoStack);
}

export function popUndo() {
  const action = state.undoStack.pop();
  notify('undoStack', state.undoStack);
  return action;
}

export function getSystemParts(systemId) {
  if (!state.systemsData) return [];
  return state.systemsData[systemId] || [];
}

export function getPartsByRegion(regionId) {
  if (!state.regionsData) return [];
  return state.regionsData[regionId] || [];
}

export function resetState() {
  state.selectedPart = null;
  state.isolatedPart = null;
  state.hiddenParts.clear();
  state.transparentParts.clear();
  state.partStates.clear();
  state.selectionHistory = [];
  state.currentView = 'front';
  notify('selectedPart', null);
  notify('partStates', state.partStates);
  notify('isolatedPart', null);
  notify('hiddenParts', state.hiddenParts);
  notify('transparentParts', state.transparentParts);
  notify('currentView', 'front');
}