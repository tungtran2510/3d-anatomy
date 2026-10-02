// Depth control: Medical-grade Anatomical Layer Dissection (Bóc tách giải phẫu chuẩn Y khoa)
// Peels away structures layer by layer from superficial to deep with 100% crisp solid opacity:
// Layer 0: Full superficial view (Toàn bộ cấu trúc - Cơ tầng nông)
// Layer 1: Peels superficial muscles (Lớp 1: Cơ tầng giữa)
// Layer 2: Peels intermediate muscles (Lớp 2: Cơ tầng sâu)
// Layer 3: Dissects entire muscular system (Lớp 3: Bóc sạch cơ - Lộ mạch máu, thần kinh & tạng)
// Layer 4: Dissects neurovascular bundles & viscera (Lớp 4: Khớp & Xương)
// Layer 5: Deepest skeleton framework (Lớp 5: Khung xương cốt lõi)

import { state, translate, batchPartStates } from '../state/store.js';
import { showSystem, hideSystem, setStructureVisible } from '../viewer/visibility.js';
import { getMuscleLayers, systemLevels, updateItemUI } from './systemsLayerController.js';

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

export function applyDepth(stage) {
  stage = Math.max(0, Math.min(5, Math.round(Number(stage) || 0)));
  currentStage = stage;

  // Single atomic batch: ZERO intermediate main-thread stalls
  batchPartStates(() => {
    const loaded = state.loadedSystems || [];
    const { superficial, intermediate, deep } = getMuscleLayers();

    // STAGE 0: All active systems fully visible (Muscular Level 4)
    if (stage === 0) {
      if (loaded.includes('muscular')) {
        showSystem('muscular');
        superficial.forEach(id => setStructureVisible(id, true));
        intermediate.forEach(id => setStructureVisible(id, true));
        deep.forEach(id => setStructureVisible(id, true));
        systemLevels.muscular = 4.0;
        updateItemUI('muscular');
      }
      if (loaded.includes('cardiovascular')) {
        showSystem('cardiovascular');
        systemLevels.arterial = 4.0;
        systemLevels.venous = 4.0;
        updateItemUI('arterial');
        updateItemUI('venous');
      }
      if (loaded.includes('nervous')) showSystem('nervous');
      if (loaded.includes('lymphatic')) showSystem('lymphatic');
      if (loaded.includes('visceral')) showSystem('visceral');
      if (loaded.includes('joints')) showSystem('joints');
      if (loaded.includes('skeletal')) showSystem('skeletal');
    }

    // STAGE 1: Dissect superficial muscles & fascia, reveal intermediate & deep musculature (Muscular Level 2.0)
    else if (stage === 1) {
      if (loaded.includes('muscular')) {
        showSystem('muscular');
        superficial.forEach(id => setStructureVisible(id, false));
        intermediate.forEach(id => setStructureVisible(id, true));
        deep.forEach(id => setStructureVisible(id, true));
        systemLevels.muscular = 2.0;
        updateItemUI('muscular');
      }
      if (loaded.includes('cardiovascular')) showSystem('cardiovascular');
      if (loaded.includes('nervous')) showSystem('nervous');
      if (loaded.includes('lymphatic')) showSystem('lymphatic');
      if (loaded.includes('visceral')) showSystem('visceral');
      if (loaded.includes('joints')) showSystem('joints');
      if (loaded.includes('skeletal')) showSystem('skeletal');
    }

    // STAGE 2: Dissect intermediate muscles, reveal deep layer only (Muscular Level 1.0)
    else if (stage === 2) {
      if (loaded.includes('muscular')) {
        showSystem('muscular');
        superficial.forEach(id => setStructureVisible(id, false));
        intermediate.forEach(id => setStructureVisible(id, false));
        deep.forEach(id => setStructureVisible(id, true));
        systemLevels.muscular = 1.0;
        updateItemUI('muscular');
      }
      if (loaded.includes('cardiovascular')) showSystem('cardiovascular');
      if (loaded.includes('nervous')) showSystem('nervous');
      if (loaded.includes('lymphatic')) showSystem('lymphatic');
      if (loaded.includes('visceral')) showSystem('visceral');
      if (loaded.includes('joints')) showSystem('joints');
      if (loaded.includes('skeletal')) showSystem('skeletal');
    }

    // STAGE 3: Dissect entire muscular system, reveal neurovascular, lymphatic & viscera
    else if (stage === 3) {
      if (loaded.includes('muscular')) {
        hideSystem('muscular');
        systemLevels.muscular = 0;
        updateItemUI('muscular');
      }
      if (loaded.includes('cardiovascular')) showSystem('cardiovascular');
      if (loaded.includes('nervous')) showSystem('nervous');
      if (loaded.includes('lymphatic')) showSystem('lymphatic');
      if (loaded.includes('visceral')) showSystem('visceral');
      if (loaded.includes('joints')) showSystem('joints');
      if (loaded.includes('skeletal')) showSystem('skeletal');
    }

    // STAGE 4: Dissect neurovascular, lymphatic & viscera, reveal skeletal framework & joints
    else if (stage === 4) {
      if (loaded.includes('muscular')) {
        hideSystem('muscular');
        systemLevels.muscular = 0;
        updateItemUI('muscular');
      }
      if (loaded.includes('cardiovascular')) {
        hideSystem('cardiovascular');
        systemLevels.arterial = 0;
        systemLevels.venous = 0;
        updateItemUI('arterial');
        updateItemUI('venous');
      }
      if (loaded.includes('nervous')) hideSystem('nervous');
      if (loaded.includes('lymphatic')) hideSystem('lymphatic');
      if (loaded.includes('visceral')) hideSystem('visceral');
      if (loaded.includes('joints')) showSystem('joints');
      if (loaded.includes('skeletal')) showSystem('skeletal');
    }

    // STAGE 5: Dissect articular joints, reveal pristine core skeleton
    else if (stage === 5) {
      if (loaded.includes('muscular')) {
        hideSystem('muscular');
        systemLevels.muscular = 0;
        updateItemUI('muscular');
      }
      if (loaded.includes('cardiovascular')) {
        hideSystem('cardiovascular');
        systemLevels.arterial = 0;
        systemLevels.venous = 0;
        updateItemUI('arterial');
        updateItemUI('venous');
      }
      if (loaded.includes('nervous')) hideSystem('nervous');
      if (loaded.includes('lymphatic')) hideSystem('lymphatic');
      if (loaded.includes('visceral')) hideSystem('visceral');
      if (loaded.includes('joints')) hideSystem('joints');
      if (loaded.includes('skeletal')) showSystem('skeletal');
    }
  });

  // Update state stage
  currentStage = stage;

  // Re-render viewer smoothly
  if (state.viewer) {
    state.viewer.render();
  }
}

export function initDepthSlider() {
  const container = document.getElementById('viewerContainer');
  if (!container || slider) return;

  const wrapper = document.createElement('div');
  wrapper.className = 'depth-control';
  wrapper.id = 'depthControl';
  wrapper.title = 'Độ sâu bóc tách giải phẫu (0: Đầy đủ - 5: Sâu)';
  wrapper.innerHTML = `
    <input type="range" id="depthSlider" class="depth-slider" min="0" max="5" value="0" step="1"
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
      applyDepth(val);
    });
  });

  return wrapper;
}

export function resetDepthSlider() {
  if (slider) {
    slider.value = 0;
  }
  currentStage = 0;
}
