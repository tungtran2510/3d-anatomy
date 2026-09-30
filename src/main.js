import '@fontsource-variable/inter';
import './styles/main.css';
import { createScene } from './viewer/createScene.js';
import { loadSystems } from './viewer/loadModel.js';
import { initSelection } from './viewer/selection.js';
import { initUI } from './ui/sidebar.js';
import { state, setViewer, setPartsData, setSystemsData, setTranslations, setSearchIndex, subscribe } from './state/store.js';
import { readState, storedState, applyState, scheduleStateWrite } from './state/urlState.js';
import { loadModel } from './viewer/loadModel.js';
import { selectPartById } from './viewer/selection.js';
import { showPart, hidePart, setPartTransparency, isolatePart } from './viewer/visibility.js';
import { loadSystemsData, loadLexicon, loadDefinitions, buildPartsData, DEFAULT_SYSTEM } from './data/anatomy.js';
import { translationsVi, translationsEn, translationsIt } from './data/translations.js';
import { getVietnameseSynonyms } from './data/vietnamese.js';

setTranslations({ vi: translationsVi, en: translationsEn, it: translationsIt });

function buildSearchIndex(parts) {
  const index = [];
  Object.entries(parts).forEach(([partId, info]) => {
    const terms = [partId.toLowerCase()];
    if (info.name?.vi) terms.push(info.name.vi.toLowerCase());
    if (info.name?.en) terms.push(info.name.en.toLowerCase());
    if (info.name?.it) terms.push(info.name.it.toLowerCase());
    if (info.baseName) terms.push(info.baseName.toLowerCase());
    if (info.latinName) terms.push(info.latinName.toLowerCase());

    const vnSyns = getVietnameseSynonyms(info.baseName);
    vnSyns.forEach(s => terms.push(s.toLowerCase()));

    index.push({
      partId,
      name: info.name?.[state.language] || info.name?.vi || info.name?.en || partId,
      latinName: info.latinName || '',
      system: info.system || 'unknown',
      terms: [...new Set(terms)]
    });
  });
  return index;
}

let viewer;
try {
  console.log('[main] Creating scene...');
  viewer = createScene();
  console.log('[main] Scene created:', !!viewer);
  setViewer(viewer);
  window.viewer = viewer;
  viewer.canvas.__viewer = viewer;
  viewer.startRenderLoop();
  console.log('[main] Render loop started');
} catch (err) {
  console.error('Scene creation error:', err);
}

async function init() {
  console.log('[main] init() called');
  const loadingOverlay = document.getElementById('loadingOverlay');

  try {
    const [systemsData, lexicon] = await Promise.all([loadSystemsData(), loadLexicon()]);
    setSystemsData(systemsData);

    // Definitions are big; start them now and let them land whenever.
    loadDefinitions();

    const partsData = buildPartsData(systemsData, lexicon);
    setPartsData(partsData);
    setSearchIndex(buildSearchIndex(partsData));
    console.log(`[main] Anatomy data ready: ${Object.keys(partsData).length} structures`);

    if (viewer) {
      // A shared link wins over the default view; a reload falls back to
      // whatever was last looked at.
      const saved = readState() || storedState();
      const systems = saved?.systems?.length ? saved.systems : [DEFAULT_SYSTEM];

      console.log(`[main] Loading ${systems.join(', ')}...`);
      await loadSystems(systems, viewer);

      if (saved) {
        await applyState(saved, {
          loadSystem: id => loadModel(id, viewer),
          selectPart: id => selectPartById(id, viewer),
          setVisible: (id, visible) => (visible ? showPart(id) : hidePart(id)),
          setTransparency: (id, opacity) => setPartTransparency(id, opacity),
          isolate: id => isolatePart(id)
        });
      }
    }
  } catch (error) {
    console.error('[main] Initialization error:', error);
  } finally {
    if (loadingOverlay) {
      loadingOverlay.classList.add('hidden');
      setTimeout(() => { loadingOverlay.style.display = 'none'; }, 300);
    }
    if (viewer) {
      await initUI(viewer);
      initSelection(viewer);
      trackViewState(viewer);
    }
    console.log('[main] Z-Anatomy initialization complete');
  }
}

// Anything that changes what the link should reproduce schedules a rewrite.
function trackViewState(activeViewer) {
  ['selectedPart', 'partStates', 'systemShown', 'systemHidden', 'partIsolated',
   'allPartsRestored', 'language'].forEach(key => subscribe(key, scheduleStateWrite));

  activeViewer.controls?.addEventListener('end', scheduleStateWrite);
}

console.log('[main] Calling init()...');
init();

document.addEventListener('visibilitychange', () => {
  if (!viewer) return;
  if (document.hidden) { viewer.stopRenderLoop(); } else { viewer.startRenderLoop(); }
});

window.ZAnatomy = { viewer, loadSystems };
