// Depth control: Medical-grade Anatomical Layer Dissection (Bóc tách giải phẫu chuẩn Y khoa)
// Peels away structures layer by layer from superficial to deep with 100% crisp solid opacity:
// Layer 0: Full superficial view (Toàn bộ cấu trúc nguyên bản)
// Layer 1: Dissect superficial fasciae & large superficial muscles (Bóc màng cân & cơ nông)
// Layer 2: Dissect entire muscular system (Bóc toàn bộ hệ cơ bắp)
// Layer 3: Dissect neurovascular bundles & lymphatic (Bóc mạch máu, thần kinh & bạch huyết)
// Layer 4: Dissect thoracic & abdominal viscera (Bóc nội tạng)
// Layer 5: Deepest skeleton framework (Khung xương cốt lõi)

import { state, translate, batchPartStates } from '../state/store.js';
import { showSystem, hideSystem, setStructureVisible } from '../viewer/visibility.js';
import { getMeshesBySystem } from '../viewer/loadModel.js';

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
  'platysma', 'cơ bám da cổ',
  'tensor fasciae',
  'sartorius', 'cơ may'
];

export const DISSECTION_STAGES = [
  { level: 0, title: 'Toàn bộ cấu trúc', short: 'Lớp 0: Đầy đủ' },
  { level: 1, title: 'Bóc cơ nông & cân mạc', short: 'Lớp 1: Cơ nông' },
  { level: 2, title: 'Bóc toàn bộ hệ cơ', short: 'Lớp 2: Hệ cơ' },
  { level: 3, title: 'Bóc mạch & thần kinh', short: 'Lớp 3: Mạch & TK' },
  { level: 4, title: 'Bóc nội tạng', short: 'Lớp 4: Nội tạng' },
  { level: 5, title: 'Khung xương cốt lõi', short: 'Lớp 5: Xương' }
];

let slider = null;
let hintEl = null;
let currentStage = 0;
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

export function applyDepth(stage) {
  stage = Math.max(0, Math.min(5, Math.round(Number(stage) || 0)));
  currentStage = stage;

  // Single atomic batch: ZERO intermediate main-thread stalls
  batchPartStates(() => {
    const loaded = state.loadedSystems || [];
    const superficialParts = getSuperficialParts();

    // STAGE 0: All active systems fully opaque and visible
    if (stage === 0) {
      if (loaded.includes('muscular')) {
        showSystem('muscular');
        superficialParts.forEach(id => setStructureVisible(id, true));
      }
      if (loaded.includes('cardiovascular')) showSystem('cardiovascular');
      if (loaded.includes('nervous')) showSystem('nervous');
      if (loaded.includes('lymphatic')) showSystem('lymphatic');
      if (loaded.includes('visceral')) showSystem('visceral');
      if (loaded.includes('joints')) showSystem('joints');
      if (loaded.includes('skeletal')) showSystem('skeletal');
    }

    // STAGE 1: Dissect fascia & superficial muscles, reveal deep musculature & neurovasculature
    else if (stage === 1) {
      if (loaded.includes('muscular')) {
        showSystem('muscular');
        superficialParts.forEach(id => setStructureVisible(id, false));
      }
      if (loaded.includes('cardiovascular')) showSystem('cardiovascular');
      if (loaded.includes('nervous')) showSystem('nervous');
      if (loaded.includes('lymphatic')) showSystem('lymphatic');
      if (loaded.includes('visceral')) showSystem('visceral');
      if (loaded.includes('joints')) showSystem('joints');
      if (loaded.includes('skeletal')) showSystem('skeletal');
    }

    // STAGE 2: Dissect entire muscular system, reveal neurovascular, lymphatic & viscera
    else if (stage === 2) {
      if (loaded.includes('muscular')) hideSystem('muscular');
      if (loaded.includes('cardiovascular')) showSystem('cardiovascular');
      if (loaded.includes('nervous')) showSystem('nervous');
      if (loaded.includes('lymphatic')) showSystem('lymphatic');
      if (loaded.includes('visceral')) showSystem('visceral');
      if (loaded.includes('joints')) showSystem('joints');
      if (loaded.includes('skeletal')) showSystem('skeletal');
    }

    // STAGE 3: Dissect cardiovascular, nervous, lymphatic, reveal viscera & core skeleton
    else if (stage === 3) {
      if (loaded.includes('muscular')) hideSystem('muscular');
      if (loaded.includes('cardiovascular')) hideSystem('cardiovascular');
      if (loaded.includes('nervous')) hideSystem('nervous');
      if (loaded.includes('lymphatic')) hideSystem('lymphatic');
      if (loaded.includes('visceral')) showSystem('visceral');
      if (loaded.includes('joints')) showSystem('joints');
      if (loaded.includes('skeletal')) showSystem('skeletal');
    }

    // STAGE 4: Dissect thoracic/abdominal viscera, reveal skeletal framework & joints
    else if (stage === 4) {
      if (loaded.includes('muscular')) hideSystem('muscular');
      if (loaded.includes('cardiovascular')) hideSystem('cardiovascular');
      if (loaded.includes('nervous')) hideSystem('nervous');
      if (loaded.includes('lymphatic')) hideSystem('lymphatic');
      if (loaded.includes('visceral')) hideSystem('visceral');
      if (loaded.includes('joints')) showSystem('joints');
      if (loaded.includes('skeletal')) showSystem('skeletal');
    }

    // STAGE 5: Dissect articular joints, reveal pristine core skeleton
    else if (stage === 5) {
      if (loaded.includes('muscular')) hideSystem('muscular');
      if (loaded.includes('cardiovascular')) hideSystem('cardiovascular');
      if (loaded.includes('nervous')) hideSystem('nervous');
      if (loaded.includes('lymphatic')) hideSystem('lymphatic');
      if (loaded.includes('visceral')) hideSystem('visceral');
      if (loaded.includes('joints')) hideSystem('joints');
      if (loaded.includes('skeletal')) showSystem('skeletal');
    }
  });

  // Update UI hint badge
  if (hintEl) {
    hintEl.textContent = DISSECTION_STAGES[stage]?.short || `Lớp ${stage}`;
    hintEl.title = DISSECTION_STAGES[stage]?.title || '';
  }

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
  wrapper.innerHTML = `
    <span class="depth-label" for="depthSlider">${translate('depth')}</span>
    <input type="range" id="depthSlider" class="depth-slider" min="0" max="5" value="0" step="1"
           orient="vertical" aria-label="${translate('depth')}">
    <div class="depth-stage-hint" id="depthStageHint" title="Chạm để đổi lớp bóc tách">Lớp 0: Đầy đủ</div>
  `;
  container.appendChild(wrapper);

  slider = wrapper.querySelector('#depthSlider');
  hintEl = wrapper.querySelector('#depthStageHint');

  let depthRaf = null;
  slider.addEventListener('input', event => {
    const val = Number(event.target.value);
    // 0ms immediate visual hint feedback
    if (hintEl) {
      hintEl.textContent = DISSECTION_STAGES[val]?.short || `Lớp ${val}`;
    }
    if (depthRaf) cancelAnimationFrame(depthRaf);
    depthRaf = requestAnimationFrame(() => {
      depthRaf = null;
      applyDepth(val);
    });
  });

  // Tap on hint pill cycles through stages 0 -> 1 -> 2 -> 3 -> 4 -> 5 -> 0 instantly
  hintEl?.addEventListener('click', (e) => {
    e.stopPropagation();
    const nextStage = (currentStage + 1) % 6;
    if (slider) slider.value = nextStage;
    applyDepth(nextStage);
  });

  return wrapper;
}

// Toggling a system by hand or resetting view restores the slider
export function resetDepthSlider() {
  if (slider) {
    slider.value = 0;
  }
  if (hintEl) {
    hintEl.textContent = 'Lớp 0: Đầy đủ';
  }
  currentStage = 0;
}
