// Anchored selection callout: a label pinned to the selected structure with a
// leader line, so the name is tied to a place in the body rather than sitting
// in a side panel the eye has to travel to.
import * as THREE from 'three';
import { state, translate } from '../state/store.js';
import { getStructure, ownMeshesOf } from '../viewer/loadModel.js';

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
    <svg class="callout-line" aria-hidden="true"><line x1="0" y1="0" x2="0" y2="0" /></svg>
    <div class="callout" role="status">
      <div class="callout-header-row" data-callout="zoom" title="Chạm để phóng to chi tiết">
        <span class="callout-pin-icon">📍</span>
        <span class="callout-name"></span>
      </div>
      <div class="callout-actions">
        <button type="button" class="callout-btn callout-zoom" data-callout="zoom" title="Phóng to chi tiết (Zoom closer)">🔍 Phóng to</button>
        <button type="button" class="callout-btn" data-callout="isolate"></button>
        <button type="button" class="callout-btn" data-callout="hide"></button>
        <button type="button" class="callout-btn callout-close" data-callout="close" aria-label="Đóng">&times;</button>
      </div>
    </div>
  `;
  container.appendChild(root);

  label = root.querySelector('.callout');
  line = root.querySelector('.callout-line line');

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
  if (!meshes.length) {
    const node = getStructure(partId)?.node;
    if (node) node.getWorldPosition(anchorWorld);
    return;
  }

  const box = new THREE.Box3();
  meshes.forEach(mesh => box.expandByObject(mesh));
  box.getCenter(anchorWorld);
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

  const box = label.getBoundingClientRect();
  let labelX = x + OFFSET_X;
  let labelY = y + OFFSET_Y;

  labelX = Math.min(Math.max(labelX, EDGE_PADDING), width - box.width - EDGE_PADDING);
  labelY = Math.min(Math.max(labelY, EDGE_PADDING), height - box.height - EDGE_PADDING);

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
  nameEl.textContent = `${displayName} (ở đây)`;
  nameEl.title = `Chạm để phóng to chi tiết: ${displayName}`;
  root.querySelector('[data-callout="isolate"]').textContent = translate('isolate');
  root.querySelector('[data-callout="hide"]').textContent = translate('hide');

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
  }
  if (unsubscribeFrame) {
    unsubscribeFrame();
    unsubscribeFrame = null;
  }
}
