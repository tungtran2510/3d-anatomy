// Depth control: Medical-grade Anatomical Layer Dissection (Bóc tách giải phẫu chuẩn Y khoa)
// Peels away structures layer by layer from superficial to deep with 100% crisp solid opacity:
// Layer 0: Full superficial view (Toàn bộ cấu trúc - Cơ tầng nông)
// Layer 1: Peels superficial muscles (Lớp 1: Cơ tầng giữa)
// Layer 2: Peels intermediate muscles (Lớp 2: Cơ tầng sâu)
// Layer 3: Dissects entire muscular system (Lớp 3: Bóc sạch cơ - Lộ mạch máu, thần kinh & tạng)
// Layer 4: Dissects neurovascular bundles & viscera (Lớp 4: Khớp & Xương)
// Layer 5: Deepest skeleton framework (Lớp 5: Khung xương cốt lõi)

import { state, translate, batchPartStates } from '../state/store.js';
import { setStructureVisible, ghostAllExcept } from '../viewer/visibility.js';
import { loadModel, getMeshesBySystem } from '../viewer/loadModel.js';
import { getMuscleLayers, invalidateMuscleLayersCache, systemLevels, updateItemUI } from './systemsLayerController.js';
import { triggerHaptic } from '../viewer/engineManager.js';
import { showToast } from './sidebar.js';

export const DISSECTION_STAGES = [
  { level: 0, title: 'Toàn bộ cấu trúc (Cơ tầng nông)', short: 'Lớp 0: Đầy đủ' },
  { level: 1, title: 'Bóc cơ nông & mạc (Cơ tầng giữa)', short: 'Lớp 1: Cơ giữa' },
  { level: 2, title: 'Bóc cơ giữa (Chỉ còn cơ sâu)', short: 'Lớp 2: Cơ sâu' },
  { level: 3, title: 'Bóc toàn bộ hệ cơ (Lộ mạch, TK, tạng)', short: 'Lớp 3: Bóc cơ' },
  { level: 4, title: 'Bóc mạch, thần kinh & nội tạng', short: 'Lớp 4: Khớp & Xương' },
  { level: 5, title: 'Khung xương cốt lõi', short: 'Lớp 5: Xương' }
];

let slider = null;
let hintEl = null;
let currentStage = 0;

export function applyDepth(stage, notifyToast = false) {
  stage = Math.max(0, Math.min(5, Math.round(Number(stage) || 0)));
  if (stage !== currentStage) {
    triggerHaptic('light');
    if (notifyToast) {
      showToast(DISSECTION_STAGES[stage]?.title || `Độ sâu: Lớp ${stage}`);
    }
  }
  currentStage = stage;

  // Synchronize Dissection HUD pills if present
  if (typeof document !== 'undefined') {
    const hud = document.getElementById('dissectionLayerHud');
    if (hud) {
      hud.querySelectorAll('.dissect-pill-btn').forEach(btn => {
        btn.classList.toggle('active', parseInt(btn.dataset.stage, 10) === stage);
      });
    }
  }

  // Ensure skeletal system is loaded as core foundation
  if (!state.loadedSystems?.includes('skeletal')) {
    loadModel('skeletal', state.viewer).then(() => {
      applyDepth(stage, false);
    }).catch(err => console.error('[depthSlider] Failed to load skeletal:', err));
    return;
  }

  // If user requests full or intermediate muscle layers, ensure muscular system is loaded!
  if ((stage === 0 || stage === 1 || stage === 2) && !state.loadedSystems?.includes('muscular')) {
    if (notifyToast) showToast('Đang nạp hệ cơ bắp để bóc tách tầng...');
    loadModel('muscular', state.viewer).then(() => {
      invalidateMuscleLayersCache();
      applyDepth(stage, notifyToast);
    }).catch(err => console.error('[depthSlider] Failed to load muscular:', err));
    return;
  }

  // Single atomic batch: ZERO intermediate main-thread stalls, ZERO screen flicker
  batchPartStates(() => {
    const loaded = state.loadedSystems || [];
    const { superficial, intermediate, deep } = getMuscleLayers();

    // 1. Fundamental rule: Skeleton is ALWAYS 100% visible and anchored across all dissection stages
    if (loaded.includes('skeletal')) {
      const skelMeshes = getMeshesBySystem('skeletal') || [];
      skelMeshes.forEach(node => {
        if (node.userData?.partId) setStructureVisible(node.userData.partId, true);
      });
      systemLevels.skeletal = 4.0;
      updateItemUI('skeletal');
    }

    // 2. Muscular System Dissection (Superficial -> Intermediate -> Deep -> Stripped)
    if (loaded.includes('muscular')) {
      if (stage === 0) {
        // STAGE 0: All muscle layers visible (100% full view)
        superficial.forEach(id => setStructureVisible(id, true));
        intermediate.forEach(id => setStructureVisible(id, true));
        deep.forEach(id => setStructureVisible(id, true));
        systemLevels.muscular = 4.0;
      } else if (stage === 1) {
        // STAGE 1: Peel superficial muscles & fascia, reveal intermediate & deep musculature
        superficial.forEach(id => setStructureVisible(id, false));
        intermediate.forEach(id => setStructureVisible(id, true));
        deep.forEach(id => setStructureVisible(id, true));
        systemLevels.muscular = 2.0;
      } else if (stage === 2) {
        // STAGE 2: Peel intermediate muscles, reveal deep layer clinging to bones
        superficial.forEach(id => setStructureVisible(id, false));
        intermediate.forEach(id => setStructureVisible(id, false));
        deep.forEach(id => setStructureVisible(id, true));
        systemLevels.muscular = 1.0;
      } else {
        // STAGE 3, 4, 5: Dissect entire muscular system completely
        superficial.forEach(id => setStructureVisible(id, false));
        intermediate.forEach(id => setStructureVisible(id, false));
        deep.forEach(id => setStructureVisible(id, false));
        systemLevels.muscular = 0;
      }
      updateItemUI('muscular');
    }

    // 3. Other systems (neurovascular, viscera, joints)
    if (stage >= 4) {
      ['cardiovascular', 'nervous', 'lymphatic', 'visceral'].forEach(sys => {
        if (loaded.includes(sys)) {
          const meshes = getMeshesBySystem(sys) || [];
          meshes.forEach(m => {
            if (m.userData?.partId) setStructureVisible(m.userData.partId, false);
          });
        }
      });
    }

    if (stage === 5 && loaded.includes('joints')) {
      const jMeshes = getMeshesBySystem('joints') || [];
      jMeshes.forEach(m => {
        if (m.userData?.partId) setStructureVisible(m.userData.partId, false);
      });
    }
  });

  // Preserve highlight / ghosting if a structure is currently selected (e.g. Rib 7)
  if (state.selectedPart?.id) {
    try {
      ghostAllExcept(state.selectedPart.id);
    } catch {
      // Ignore if not applicable
    }
  }

  // Update state stage
  currentStage = stage;

  // If no specific part is selected, frame whole torso/body overview so layer changes are clearly visible
  if (!state.selectedPart?.id && state.viewer) {
    import('../viewer/camera.js').then(({ setView }) => {
      setView('front', state.viewer, true);
    }).catch(() => {});
  }

  // Re-render viewer smoothly
  if (state.viewer) {
    state.viewer.render();
  }
}

export function initDepthSlider() {
  const container = document.getElementById('viewerContainer');
  if (!container || slider) return;

  const initialStage = state.loadedSystems?.includes('muscular') ? 0 : 5;
  currentStage = initialStage;

  const wrapper = document.createElement('div');
  wrapper.className = 'depth-control';
  wrapper.id = 'depthControl';
  wrapper.title = 'Độ sâu bóc tách giải phẫu (0: Đầy đủ - 5: Sâu)';
  wrapper.innerHTML = `
    <input type="range" id="depthSlider" class="depth-slider" min="0" max="5" value="${initialStage}" step="1"
           orient="vertical" aria-label="${translate('depth')}">
  `;
  container.appendChild(wrapper);

  slider = wrapper.querySelector('#depthSlider');

  let depthRaf = null;
  slider.addEventListener('input', event => {
    const val = Number(event.target.value);
    if (depthRaf) cancelAnimationFrame(depthRaf);
    depthRaf = requestAnimationFrame(() => {
      depthRaf = null;
      applyDepth(val, true);
    });
  });

  return wrapper;
}

export function resetDepthSlider() {
  const initialStage = state.loadedSystems?.includes('muscular') ? 0 : 5;
  if (slider) {
    slider.value = initialStage;
  }
  currentStage = initialStage;
}
