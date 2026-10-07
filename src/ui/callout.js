// Anchored selection callout: a label pinned to the selected structure with a
// leader line, so the name is tied to a place in the body rather than sitting
// in a side panel the eye has to travel to.
import * as THREE from 'three';
import { state, translate } from '../state/store.js';
import { getStructure, ownMeshesOf, getMeshRegistry } from '../viewer/loadModel.js';

const OFFSET_X = 96;
const OFFSET_Y = -64;
const EDGE_PADDING = 12;

let root = null;
let label = null;
let line = null;
let unsubscribeFrame = null;
let anchorWorld = new THREE.Vector3();
let projected = new THREE.Vector3();
let currentPartId = null;
let handlers = {};

function build(container) {
  root = document.createElement('div');
  root.className = 'callout-layer';
  root.innerHTML = `
    <svg class="callout-line" aria-hidden="true">
      <defs>
        <radialGradient id="calloutPinGlow" cx="50%" cy="50%" r="50%">
          <stop offset="0%" stop-color="#fbbf24" stop-opacity="0.9" />
          <stop offset="60%" stop-color="#f59e0b" stop-opacity="0.4" />
          <stop offset="100%" stop-color="#f59e0b" stop-opacity="0" />
        </radialGradient>
      </defs>
      <circle class="pin-halo" cx="0" cy="0" r="16" fill="url(#calloutPinGlow)" />
      <circle class="pin-ring" cx="0" cy="0" r="10" fill="none" stroke="#f59e0b" stroke-width="1.8" />
      <circle class="pin-dot" cx="0" cy="0" r="4.5" fill="#ffffff" stroke="#f59e0b" stroke-width="2.2" />
      <line class="callout-leader-line" x1="0" y1="0" x2="0" y2="0" stroke="#f59e0b" stroke-width="1.8" stroke-dasharray="3 3" />
    </svg>
    <div class="callout" role="status">
      <div class="callout-header-row" data-callout="info" title="Chạm để mở bảng chi tiết">
        <span class="callout-pin-icon">📍</span>
        <span class="callout-name"></span>
      </div>
      <button type="button" class="callout-btn-close" data-callout="close" title="Tắt nhãn chữ (giữ nguyên mô hình 3D)" aria-label="Đóng nhãn">✕</button>
    </div>
  `;
  container.appendChild(root);

  label = root.querySelector('.callout');
  line = root.querySelector('.callout-leader-line') || root.querySelector('.callout-line line');

  root.addEventListener('click', event => {
    const action = event.target.closest('[data-callout]')?.dataset.callout;
    if (!action) return;
    event.stopPropagation();
    handlers[action]?.(currentPartId);
  });
}

// The anchor is the centre of the structure's own geometry, which is not the
// same as the node origin for a group of meshes.
function computeAnchor(partId) {
  const meshes = ownMeshesOf(partId);
  if (meshes && meshes.length > 0) {
    const box = new THREE.Box3();
    meshes.forEach(mesh => box.expandByObject(mesh));
    if (!box.isEmpty()) {
      box.getCenter(anchorWorld);
      return;
    }
  }

  const node = getStructure(partId)?.node || getMeshRegistry()?.get(partId);
  if (node) {
    const box = new THREE.Box3().setFromObject(node);
    if (!box.isEmpty()) {
      box.getCenter(anchorWorld);
      return;
    }
    node.getWorldPosition(anchorWorld);
    return;
  }

  // Fallback: search by normalized alphanumeric ID in scene or meshRegistry
  const normTarget = String(partId).toLowerCase().replace(/[^a-z0-9]/g, '');
  const reg = getMeshRegistry();
  if (reg) {
    for (const [id, m] of reg.entries()) {
      const normId = id.toLowerCase().replace(/[^a-z0-9]/g, '');
      if (normId === normTarget || normId.startsWith(normTarget)) {
        const box = new THREE.Box3().setFromObject(m);
        if (!box.isEmpty()) {
          box.getCenter(anchorWorld);
          return;
        }
        m.getWorldPosition(anchorWorld);
        return;
      }
    }
  }
}

function update() {
  if (!currentPartId || !state.viewer) return;

  const { camera, canvas } = state.viewer;
  projected.copy(anchorWorld).project(camera);

  const width = canvas.clientWidth;
  const height = canvas.clientHeight;
  const x = (projected.x * 0.5 + 0.5) * width;
  const y = (-projected.y * 0.5 + 0.5) * height;

  // z > 1 means the anchor is behind the camera.
  const behind = projected.z > 1;
  root.classList.toggle('is-hidden', behind);
  if (behind) return;

  // Update glowing pin dot and pulsing ring at projected structure coordinate
  const halo = root.querySelector('.pin-halo');
  const ring = root.querySelector('.pin-ring');
  const dot = root.querySelector('.pin-dot');

  halo?.setAttribute('cx', x);
  halo?.setAttribute('cy', y);
  ring?.setAttribute('cx', x);
  ring?.setAttribute('cy', y);
  dot?.setAttribute('cx', x);
  dot?.setAttribute('cy', y);

  const cardEl = document.getElementById('selectionCard');
  const axisSheet = document.getElementById('clinicalAxisSheet');
  const isSheetOpen = axisSheet && !axisSheet.classList.contains('hidden');
  const isCardExpanded = cardEl && !cardEl.classList.contains('hidden') && !cardEl.classList.contains('compact-mode');

  if (isSheetOpen || isCardExpanded) {
    // When full sheet or mechanism sheet is open, hide floating callout to prevent overlap
    label.style.display = 'none';
    line.style.display = 'none';
  } else {
    label.style.display = '';
    line.style.display = '';
  }

  const box = label.getBoundingClientRect();
  let labelX = x + OFFSET_X;
  let labelY = y + OFFSET_Y;

  // Keep within safe viewport boundaries and NEVER overlap the bottom selection card or right controls
  let maxBottom = height - box.height - 84;
  if (cardEl && !cardEl.classList.contains('hidden')) {
    const cardRect = cardEl.getBoundingClientRect();
    if (cardRect.top > 80 && cardRect.top < height) {
      maxBottom = Math.min(maxBottom, cardRect.top - box.height - 12);
    }
  }

  // Right edge safety margin to stay clear of the right control column (34px buttons + padding)
  const rightSafetyMargin = width < 768 ? 54 : 20;
  const maxRight = width - box.width - rightSafetyMargin;
  labelX = Math.min(Math.max(labelX, EDGE_PADDING), Math.max(EDGE_PADDING, maxRight));
  labelY = Math.min(Math.max(labelY, 56), Math.max(56, maxBottom));

  label.style.transform = `translate(${Math.round(labelX)}px, ${Math.round(labelY)}px)`;

  // Attach the leader to whichever side of the label faces the structure.
  const anchorSide = labelX > x ? labelX : labelX + box.width;
  line.setAttribute('x1', x);
  line.setAttribute('y1', y);
  line.setAttribute('x2', anchorSide);
  line.setAttribute('y2', labelY + box.height / 2);
}

export function showCallout(partId, displayName, actions = {}) {
  const container = document.getElementById('viewerContainer');
  if (!container) return;

  if (!root) build(container);
  handlers = actions;
  currentPartId = partId;

  const info = state.partsData?.[partId];
  const nameEl = root.querySelector('.callout-name');
  nameEl.textContent = displayName;
  const isolateBtn = root.querySelector('[data-callout="isolate"]');
  if (isolateBtn) isolateBtn.textContent = translate('isolate');
  const hideBtn = root.querySelector('[data-callout="hide"]');
  if (hideBtn) hideBtn.textContent = translate('hide');

  computeAnchor(partId);
  root.classList.remove('is-hidden');
  root.classList.add('is-visible');

  update();

  if (!unsubscribeFrame && state.viewer?.onFrame) {
    unsubscribeFrame = state.viewer.onFrame(update);
  }
}

export function hideCallout() {
  currentPartId = null;
  if (root) {
    root.classList.remove('is-visible');
    root.classList.add('is-hidden');
  }
  if (unsubscribeFrame) {
    unsubscribeFrame();
    unsubscribeFrame = null;
  }
}

export function isCalloutVisible() {
  return !!(root && root.classList.contains('is-visible') && !root.classList.contains('is-hidden') && label?.style.display !== 'none');
}
