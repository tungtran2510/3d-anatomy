import '@fontsource-variable/inter';
import './styles/main.css';
import { createScene } from './viewer/createScene.js';
import { loadSystems, getMeshRegistry } from './viewer/loadModel.js';
import { initSelection } from './viewer/selection.js';
import { initUI, selectStructureAnywhere } from './ui/sidebar.js';
import { state, setViewer, setPartsData, setSystemsData, setTranslations, setSearchIndex, subscribe } from './state/store.js';

window.state = state;
window.selectStructureAnywhere = selectStructureAnywhere;
window.selectPartById = selectPartById;
import { readState, storedState, applyState, scheduleStateWrite } from './state/urlState.js';
import { loadModel } from './viewer/loadModel.js';
import { selectPartById } from './viewer/selection.js';
import { showPart, hidePart, setPartTransparency, isolatePart } from './viewer/visibility.js';
import { loadSystemsData, loadLexicon, loadDefinitions, buildPartsData, DEFAULT_SYSTEM } from './data/anatomy.js';
import { translationsVi, translationsEn, translationsIt } from './data/translations.js';
import { dynamicAnatomy } from './viewer/dynamicAnatomy.js';
import { getVietnameseSynonyms } from './data/vietnamese.js';
import { initTheme, toggleAppTheme } from './utils/themeManager.js';
import { engineManager } from './viewer/engineManager.js';

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
      // A shared link with explicit URL hash wins over default.
      // On regular/first visit without URL hash, ALWAYS default strictly to skeletal (no muscular).
      const hashState = readState();
      const saved = hashState || storedState();
      if (!hashState && saved) {
        // Enforce skeleton-only default when opening root application
        saved.systems = [DEFAULT_SYSTEM];
      }
      const systems = (hashState?.systems?.length) ? hashState.systems : [DEFAULT_SYSTEM];

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
      initTheme(viewer);
      document.getElementById('mainThemeToggleBtn')?.addEventListener('click', () => {
        toggleAppTheme(viewer);
      });
      document.getElementById('netStatusBadge')?.addEventListener('click', () => {
        engineManager.toggleTelemetryHUD();
      });
      await initUI(viewer);
      initSelection(viewer);
      trackViewState(viewer);

      // Register PWA Service Worker & Version Update Banner (LỆNH #06)
      if ('serviceWorker' in navigator) {
        window.addEventListener('load', () => {
          navigator.serviceWorker.register('./sw.js', { scope: './' })
            .then((reg) => {
              console.log('[SW] Service Worker registered successfully:', reg.scope);
              import('./ui/updateBanner.js').then(({ initPWAUpdateBanner }) => {
                initPWAUpdateBanner();
              });
            })
            .catch((err) => console.warn('[SW] Registration failed:', err.message));
        });
      }

      // PWA Home Screen Installation Prompt (Gợi ý Cài đặt App lần đầu)
      import('./ui/pwaInstallPrompt.js').then(({ initPWAInstallPrompt }) => {
        initPWAInstallPrompt();
      });

      // Offline download recommendation prompt (LỆNH #10)
      import('./ui/offlinePrompt.js').then(({ initOfflinePrompt }) => {
        initOfflinePrompt(viewer);
      });

      // Cross-platform Desktop Keyboard Shortcuts
      initDesktopShortcuts(viewer);
    }
    console.log('[main] Z-Anatomy initialization complete');
  }
}

// Cross-platform Desktop Shortcuts (Space, R, Esc, F, H, I)
function initDesktopShortcuts(targetViewer) {
  window.addEventListener('keydown', (e) => {
    // Ignore when typing inside input or textarea
    if (['INPUT', 'TEXTAREA', 'SELECT'].includes(document.activeElement?.tagName)) return;

    if (e.code === 'Space') {
      e.preventDefault();
      document.getElementById('btnMotionPlayPause')?.click();
    } else if (e.key === 'r' || e.key === 'R') {
      import('./viewer/camera.js').then(({ resetView }) => resetView(targetViewer));
    } else if (e.key === 'Escape') {
      document.getElementById('btnAtlasHubClose')?.click();
      document.getElementById('btnAIQuickClose')?.click();
      document.getElementById('offlineCloseBtn')?.click();
      document.getElementById('motionCloseBtn')?.click();
      document.getElementById('aiCloseBtn')?.click();
      document.getElementById('cardCloseBtn')?.click();
      document.getElementById('helpClose')?.click();
      document.getElementById('videoModalClose')?.click();
      document.getElementById('btnQuizClose')?.click();
      document.getElementById('studyClosePickerBtn')?.click();
      document.getElementById('studyExitBtn')?.click();
    } else if (e.key === 'f' || e.key === 'F') {
      if (state.selectedPart) {
        import('./viewer/camera.js').then(({ frameRegion }) => frameRegion(state.selectedPart.id, targetViewer));
      }
    } else if (e.key === 'h' || e.key === 'H') {
      document.getElementById('cardHideBtn')?.click();
    } else if (e.key === 'i' || e.key === 'I') {
      document.getElementById('cardIsolateBtn')?.click();
    }
  });
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

window.selectPartById = (id) => selectPartById(id, viewer);
window.getLoadedPartIds = () => Array.from(getMeshRegistry().keys());
window.engineManager = engineManager;
window.ZAnatomy = { viewer, loadSystems, selectPartById: (id) => selectPartById(id, viewer), getLoadedPartIds: () => Array.from(getMeshRegistry().keys()), dynamicAnatomy, engine: engineManager };
