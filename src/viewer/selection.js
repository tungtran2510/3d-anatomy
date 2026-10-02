// Selection - Raycasting, highlighting, and selection management
import * as THREE from 'three';
import { state, setSelectedPart, getStructureInfo, translate, pushUndo, popUndo } from '../state/store.js';
import { getMeshRegistry, getPickTargets, getStructure } from './loadModel.js';
import { highlightMesh, clearHighlight, ghostAllExcept, clearGhost, isolatePart, hidePart, showPart, restoreAllParts, setPartTransparency } from './visibility.js';
import { focusOnMesh, zoomIntoMesh, zoomOutToOverview } from './camera.js';
import { showCallout, hideCallout, isCalloutVisible } from '../ui/callout.js';
import { loadDefinitions } from '../data/anatomy.js';
import { handleQuizClick } from '../ui/quiz.js';
import { addToHistory } from '../state/bookmarks.js';
import { getClinicalData } from '../data/clinicalInfo.js';
import { openLesson, openVideo } from '../ui/sidebar.js';
import { isMeasurementActive, handleMeasurementClick } from './measurement.js';
import { getNote, saveNote } from '../state/notes.js';

// Distinguishes a tap from the end of an orbit gesture.
const TAP_MAX_MOVE_PX = 10;
const TAP_MAX_DURATION_MS = 300;
// The mouse gets a smaller threshold: a deliberate click barely moves, but an
// orbit drag is unbounded, and there is no duration limit because rotating
// slowly is still rotating.
const CLICK_MAX_MOVE_PX = 5;

let raycaster = new THREE.Raycaster();
// With a BVH in place, stopping at the nearest hit is much cheaper than
// sorting every intersection along the ray.
raycaster.firstHitOnly = true;
let mouse = new THREE.Vector2();
let lastSelectedMesh = null;
let lastIntersectedMesh = null;
let touchStart = null;
let pointerDown = null;
let hoverEvent = null;
let hoverFrame = null;
let orbiting = false;

// Raycasting against the model roots tests each subtree once; the registry
// holds nested structures, so it would test shared geometry repeatedly.
function pickAt(event, viewer) {
  getEventPosition(event, viewer.canvas);
  raycaster.setFromCamera(mouse, viewer.camera);

  const intersects = raycaster.intersectObjects(getPickTargets(), true);
  for (const hit of intersects) {
    if (!hit.object.visible) continue;
    const structure = findParentMesh(hit.object);
    if (structure) return structure;
  }
  return null;
}

export function initSelection(viewer) {
  const { canvas, controls } = viewer;

  // Picking during an orbit is wasted work: the pointer is dragging, not
  // pointing at anything.
  controls?.addEventListener('start', () => { orbiting = true; });
  controls?.addEventListener('end', () => { orbiting = false; });

  // Mouse events
  canvas.addEventListener('pointerdown', onPointerDown);
  canvas.addEventListener('pointercancel', onPointerCancel);
  canvas.addEventListener('click', onClick);
  canvas.addEventListener('dblclick', onDoubleClick);
  canvas.addEventListener('pointermove', onPointerMove);

  // Touch events for mobile
  canvas.addEventListener('touchstart', onTouchStart, { passive: false });
  canvas.addEventListener('touchend', onTouchEnd, { passive: false });

  return () => {
    canvas.removeEventListener('pointerdown', onPointerDown);
    canvas.removeEventListener('pointercancel', onPointerCancel);
    canvas.removeEventListener('click', onClick);
    canvas.removeEventListener('dblclick', onDoubleClick);
    canvas.removeEventListener('pointermove', onPointerMove);
    canvas.removeEventListener('touchstart', onTouchStart);
    canvas.removeEventListener('touchend', onTouchEnd);
  };
}

function getEventPosition(event, canvas) {
  const rect = canvas.getBoundingClientRect();
  const clientX = event.clientX || (event.touches && event.touches[0].clientX) || 0;
  const clientY = event.clientY || (event.touches && event.touches[0].clientY) || 0;

  mouse.x = ((clientX - rect.left) / rect.width) * 2 - 1;
  mouse.y = -((clientY - rect.top) / rect.height) * 2 + 1;
}

// A rotate gesture ends with a click event wherever the pointer happens to be,
// so without this every attempt to change the angle selected whatever was under
// the cursor. Touch had this discrimination from the start; the mouse did not.
function onPointerDown(event) {
  // Only the primary button produces a click. Recording a right-press would
  // leave stale coordinates behind — no click ever arrives to clear them — and
  // the next genuine click would be measured against them and dismissed as a
  // drag.
  if (event.button !== 0) {
    pointerDown = null;
    return;
  }
  pointerDown = { x: event.clientX, y: event.clientY, type: event.pointerType };
}

function onPointerCancel() {
  pointerDown = null;
}

function wasDrag(event, gesture) {
  if (!gesture) return false;

  const moved = Math.hypot(event.clientX - gesture.x, event.clientY - gesture.y);
  return moved > CLICK_MAX_MOVE_PX;
}

function onClick(event) {
  const viewer = state.viewer;
  if (!viewer) return;

  const gesture = pointerDown;
  pointerDown = null;

  // Touch selects from the tap handler; the click the browser synthesises
  // afterwards would select a second time.
  if (gesture && gesture.type !== 'mouse') return;
  if (wasDrag(event, gesture)) return;

  if (isMeasurementActive()) {
    handleMeasurementClick(event, viewer);
    return;
  }

  const structure = pickAt(event, viewer);
  if (structure) {
    const partId = structure.userData.partId;
    if (handleQuizClick(partId, viewer)) {
      return;
    }
    if (state.dissectMode) {
      pushUndo(partId);
      hidePart(partId);
      deselectPart();
      viewer.render();
      return;
    }

    // Toggle callout text when tapping on the structure that is already selected
    if (state.selectedPart && state.selectedPart.id === partId) {
      if (isCalloutVisible()) {
        hideCallout();
      } else {
        showCallout(partId, state.selectedPart.displayName, createCalloutActions(viewer));
      }
      viewer.render();
      return;
    }

    selectPart(partId, viewer);
  } else {
    // Clicked on background - deselect
    deselectPart();
  }
}

function onDoubleClick(event) {
  const viewer = state.viewer;
  if (!viewer) return;

  const structure = pickAt(event, viewer);
  if (structure) {
    focusOnMesh(structure, viewer, true);
  }
}

// Pointer events fire far more often than frames; coalescing to one pick per
// animation frame keeps a full-scene raycast off the critical path.
function onPointerMove(event) {
  // Touch drives selection through the tap handler; hovering with a finger is
  // not a gesture.
  if (event.pointerType && event.pointerType !== 'mouse') return;
  if (orbiting) return;

  hoverEvent = { clientX: event.clientX, clientY: event.clientY };
  if (hoverFrame) return;

  hoverFrame = requestAnimationFrame(() => {
    hoverFrame = null;
    const pending = hoverEvent;
    hoverEvent = null;
    if (pending) processHover(pending);
  });
}

function processHover(event) {
  const viewer = state.viewer;
  if (!viewer) return;

  const structure = pickAt(event, viewer);

  if (structure === lastIntersectedMesh) return;

  // Clear previous hover
  if (lastIntersectedMesh && lastIntersectedMesh !== lastSelectedMesh) {
    clearHighlight(lastIntersectedMesh.userData.partId);
  }

  if (structure) {
    if (structure !== lastSelectedMesh) {
      highlightMesh(structure.userData.partId, 0xffdf5d, 0.3);
    }
    lastIntersectedMesh = structure;
    viewer.canvas.style.cursor = 'pointer';
  } else {
    lastIntersectedMesh = null;
    viewer.canvas.style.cursor = 'grab';
  }

  // Hovering only mutates materials, and frames are drawn on demand: over an
  // idle scene the tint would sit in the material until something else asked
  // for a frame. Everything above changed what the next one looks like.
  viewer.render();
}

function onTouchStart(event) {
  if (event.touches.length !== 1) {
    // Pinch or two-finger pan belongs to OrbitControls.
    touchStart = null;
    return;
  }

  const touch = event.touches[0];
  touchStart = { x: touch.clientX, y: touch.clientY, time: event.timeStamp };
}

function onTouchEnd(event) {
  const start = touchStart;
  touchStart = null;

  if (!start || event.changedTouches.length !== 1) return;

  const touch = event.changedTouches[0];
  const moved = Math.hypot(touch.clientX - start.x, touch.clientY - start.y);
  const elapsed = event.timeStamp - start.time;

  // Only a short, stationary touch is a selection; anything else was an orbit.
  if (moved > TAP_MAX_MOVE_PX || elapsed > TAP_MAX_DURATION_MS) return;

  const viewer = state.viewer;
  if (!viewer) return;

  const structure = pickAt({ clientX: touch.clientX, clientY: touch.clientY }, viewer);
  if (structure) {
    if (isMeasurementActive()) {
      handleMeasurementClick({ clientX: touch.clientX, clientY: touch.clientY }, viewer);
      return;
    }
    const partId = structure.userData.partId;
    if (handleQuizClick(partId, viewer)) {
      return;
    }
    if (state.dissectMode) {
      pushUndo(partId);
      hidePart(partId);
      deselectPart();
      viewer.render();
      return;
    }
    // Toggle callout text when tapping on the structure that is already selected
    if (state.selectedPart && state.selectedPart.id === partId) {
      if (isCalloutVisible()) {
        hideCallout();
      } else {
        showCallout(partId, state.selectedPart.displayName, createCalloutActions(viewer));
      }
      viewer.render();
      return;
    }

    selectPart(partId, viewer);
  } else {
    deselectPart();
  }
}

// A structure exported with several materials becomes a group of meshes, so the
// raycast hit may be a child; the partId lives on the node above it.
function findParentMesh(object) {
  let current = object;
  while (current) {
    if (current.userData?.partId) {
      return current;
    }
    current = current.parent;
  }
  return null;
}

// Two-way Selection History Stack (Visible Body Standard: <- and -> buttons)
const selectionHistoryStack = [];
let historyPointer = -1;
let isNavigatingHistory = false;

export function canGoBackSelection() {
  return historyPointer > 0;
}

export function canGoForwardSelection() {
  return historyPointer >= 0 && historyPointer < selectionHistoryStack.length - 1;
}

export function navigateSelectionHistory(delta, viewer) {
  if (selectionHistoryStack.length === 0) return;
  const newIdx = historyPointer + delta;
  if (newIdx < 0 || newIdx >= selectionHistoryStack.length) return;

  historyPointer = newIdx;
  const partId = selectionHistoryStack[historyPointer];
  isNavigatingHistory = true;
  selectPart(partId, viewer, true);
  isNavigatingHistory = false;
  notifySelectionHistoryChanged();
}

function recordSelectionHistory(partId) {
  if (isNavigatingHistory) return;
  if (selectionHistoryStack[historyPointer] === partId) return;

  // Truncate forward history if user made a new selection
  selectionHistoryStack.splice(historyPointer + 1);
  selectionHistoryStack.push(partId);
  historyPointer = selectionHistoryStack.length - 1;
  notifySelectionHistoryChanged();
}

export function notifySelectionHistoryChanged() {
  const backBtn = document.getElementById('btnSelectionHistoryBack');
  const fwdBtn = document.getElementById('btnSelectionHistoryForward');
  if (backBtn) {
    backBtn.disabled = !canGoBackSelection();
    backBtn.classList.toggle('disabled', !canGoBackSelection());
  }
  if (fwdBtn) {
    fwdBtn.disabled = !canGoForwardSelection();
    fwdBtn.classList.toggle('disabled', !canGoForwardSelection());
  }
}

function createCalloutActions(viewer) {
  return {
    zoom: () => {
      zoomIntoCurrentSelection(viewer);
    },
    info: () => {
      const card = document.getElementById('selectionCard');
      if (card) {
        card.classList.remove('hidden');
        window.dispatchEvent(new CustomEvent('expand-selection-card'));
      }
    },
    isolate: id => {
      pushUndo({
        type: 'isolate',
        partId: id,
        prevIsolated: state.isolatedPart || null
      });
      isolatePart(id);
      viewer?.render();
    },
    hide: id => {
      pushUndo({
        type: 'hide',
        partId: id
      });
      hidePart(id);
      deselectPart();
      viewer?.render();
    },
    close: () => hideCallout()
  };
}

export function selectPart(partId, viewer, skipHistory = false, skipCamera = false) {
  // Record selection history stack
  if (!skipHistory) {
    recordSelectionHistory(partId);
  }

  // Record selection undo history
  if (!skipHistory && (!state.selectedPart || state.selectedPart.id !== partId)) {
    pushUndo({
      type: 'select',
      prevId: state.selectedPart ? state.selectedPart.id : null,
      newId: partId
    });
  }

  // Clear previous selection highlight
  if (lastSelectedMesh) {
    clearHighlight(lastSelectedMesh.userData.partId);
  }

  const mesh = getMeshRegistry().get(partId);
  if (!mesh) return;

  // Get structure info
  const info = getStructureInfo(partId);
  const partData = {
    id: partId,
    meshName: mesh.userData.originalName || mesh.name,
    displayName: info?.name?.[state.language] || info?.name?.en || partId,
    system: info?.system || mesh.userData.system || 'unknown',
    region: info?.region || 'unknown',
    info: info
  };

  // Highlight selected mesh
  highlightMesh(partId, 0xffdf5d, 0.8);
  lastSelectedMesh = mesh;

  // Smoothly jump/focus camera onto the selected structure if not skipped
  if (viewer && !skipCamera) {
    focusOnMesh(mesh, viewer, true, 2.2);
  }

  // Everything else drops to a ghost, so an occluded structure is still
  // readable, and the camera eases in to answer "where is it".
  ghostAllExcept(partId);

  showCallout(partId, partData.displayName, createCalloutActions(viewer));

  // Update part state
  getMeshRegistry().forEach((m, id) => {
    const partState = state.partStates.get(id);
    if (partState) {
      partState.selected = (id === partId);
    }
  });

  // Notify state change
  setSelectedPart(partData);

  // Add to viewing history
  addToHistory(partId, {
    nameVi: partData.displayName,
    nameLatin: info?.latinName,
    system: partData.system
  });

  if (navigator.vibrate) navigator.vibrate(20);

  // Show info panel
  showInfoPanel(partData);

  // Show footer actions
  showFooterActions();
}

export function deselectPart(skipHistory = false) {
  if (!skipHistory && state.selectedPart) {
    pushUndo({
      type: 'select',
      prevId: state.selectedPart.id,
      newId: null
    });
  }

  if (lastSelectedMesh) {
    clearHighlight(lastSelectedMesh.userData.partId);
    lastSelectedMesh = null;
  }

  clearGhost();
  hideCallout();

  // Fast O(1) clear selection state
  if (state.selectedPart) {
    const partState = state.partStates.get(state.selectedPart.id);
    if (partState) partState.selected = false;
  }

  setSelectedPart(null);
  hideInfoPanel();
  hideFooterActions();
  notifySelectionHistoryChanged();
}

function showInfoPanel(partData) {
  const placeholder = document.querySelector('.info-placeholder');
  const structureInfo = document.getElementById('structureInfo');

  if (placeholder) placeholder.style.display = 'none';
  if (structureInfo) structureInfo.classList.remove('hidden');

  const lang = state.language || 'en';
  const info = partData.info || {};

  const name = info.name?.[lang] || info.name?.en || partData.displayName;
  const systemLabel = getSystemLabel(info.system || partData.system, lang);

  const sideKey = info.side === 'left' ? 'side_left' : info.side === 'right' ? 'side_right' : null;

  const clinical = getClinicalData(partData.id, info.baseName);
  let clinicalMarkup = '';
  if (clinical) {
    const rel = clinical.relations || {};
    clinicalMarkup = `
      <div class="clinical-box">
        <h4 class="clinical-heading">⚡ Chức năng & Vận động</h4>
        <p class="clinical-desc">${escapeHtml(clinical.function)}</p>

        <!-- 4-Way Anatomical Relations -->
        <h4 class="clinical-heading" style="margin-top: 12px; color: #58a6ff;">🔗 Liên Quan Giải Phẫu Học</h4>
        <div class="flashcard-relations" style="margin-top: 6px;">
          <div class="relation-item">
            <span class="relation-icon">🔴</span>
            <div class="relation-body">
              <strong>Cơ liên quan:</strong>
              <p>${escapeHtml(rel.muscles || 'Liên kết nhóm cơ định hình và vận động.')}</p>
            </div>
          </div>
          <div class="relation-item">
            <span class="relation-icon">🦴</span>
            <div class="relation-body">
              <strong>Xương & Khớp:</strong>
              <p>${escapeHtml(rel.bones || 'Tiếp khớp với các diện xương kế cận.')}</p>
            </div>
          </div>
          <div class="relation-item">
            <span class="relation-icon">⚡</span>
            <div class="relation-body">
              <strong>Thần kinh:</strong>
              <p>${escapeHtml(rel.nerves || 'Chi phối bởi các nhánh thần kinh ngoại biên.')}</p>
            </div>
          </div>
          <div class="relation-item">
            <span class="relation-icon">🩸</span>
            <div class="relation-body">
              <strong>Mạch máu:</strong>
              <p>${escapeHtml(rel.vessels || 'Cấp máu bởi các nhánh động mạch khu vực.')}</p>
            </div>
          </div>
        </div>

        <h4 class="clinical-heading" style="margin-top: 12px; color: #ff7b72;">🩺 Ý nghĩa lâm sàng & Bệnh lý</h4>
        <p class="clinical-desc">${escapeHtml(clinical.clinical)}</p>

        <!-- Personal Study Note Area in Info Panel -->
        <div class="info-note-area" style="margin-top: 12px; padding-top: 8px; border-top: 1px solid rgba(255,255,255,0.1);">
          <label style="font-size: 11px; font-weight: 700; color: #a371f7; display: block; margin-bottom: 4px;">📝 Ghi chú cá nhân:</label>
          <textarea class="info-note-input" rows="2" style="width: 100%; background: rgba(0,0,0,0.3); border: 1px solid var(--border); border-radius: 6px; color: #fff; padding: 6px; font-size: 11px;" placeholder="Ghi chú học tập cho cấu trúc này...">${escapeHtml(getNote(partData.id))}</textarea>
          <div style="display: flex; justify-content: space-between; align-items: center; margin-top: 4px;">
            <button type="button" class="btn-info-save-note" style="padding: 4px 10px; font-size: 11px; background: #8957e5; color: #fff; border: none; border-radius: 4px; cursor: pointer;">Lưu ghi chú</button>
            <span class="info-note-hint" style="display: none; font-size: 10px; color: #3fb950; font-weight: 600;">✓ Đã lưu</span>
          </div>
        </div>

        <div class="clinical-actions" style="margin-top: 12px;">
          ${clinical.lessonLink ? `<button type="button" class="btn-lesson-link" data-lesson-url="${escapeHtml(clinical.lessonLink)}" data-lesson-title="${escapeHtml(clinical.lessonTitle)}">📖 Học bài: ${escapeHtml(clinical.lessonTitle)}</button>` : ''}
          ${clinical.videoId ? `<button type="button" class="btn-video-link" data-video-id="${escapeHtml(clinical.videoId)}" data-video-title="${escapeHtml(clinical.nameVi)}">▶️ Xem video bài giảng</button>` : ''}
        </div>
      </div>
    `;
  }

  structureInfo.innerHTML = `
    <div class="structure-header">
      <div class="structure-title">
        <h3>${escapeHtml(name)}</h3>
        ${info.latinName ? `<span class="structure-latin">${escapeHtml(info.latinName)}</span>` : ''}
        <div class="structure-tags">
          <span class="structure-system">${escapeHtml(systemLabel)}</span>
          ${sideKey ? `<span class="structure-tag">${escapeHtml(translate(sideKey, lang))}</span>` : ''}
          ${info.official === false ? `<span class="structure-tag warn" title="${escapeHtml(translate('non_official_hint', lang))}">${escapeHtml(translate('non_official', lang))}</span>` : ''}
        </div>
      </div>
    </div>
    ${clinicalMarkup}
    ${relationMarkup(partData.id, lang)}
    <div class="structure-description" data-definition>${escapeHtml(translate('loading_definition', lang))}</div>
  `;

  structureInfo.querySelectorAll('[data-relation]').forEach(link => {
    link.addEventListener('click', () => selectPartById(link.dataset.relation, state.viewer));
  });

  structureInfo.querySelectorAll('.btn-lesson-link').forEach(btn => {
    btn.addEventListener('click', () => {
      openLesson(btn.dataset.lessonUrl, btn.dataset.lessonTitle);
    });
  });

  structureInfo.querySelectorAll('.btn-video-link').forEach(btn => {
    btn.addEventListener('click', () => {
      openVideo(btn.dataset.videoId, btn.dataset.videoTitle);
    });
  });

  structureInfo.querySelector('.btn-info-save-note')?.addEventListener('click', () => {
    const input = structureInfo.querySelector('.info-note-input');
    const text = input?.value || '';
    saveNote(partData.id, text, {
      nameVi: name,
      nameLatin: info.latinName,
      system: info.system || partData.system
    });
    const hint = structureInfo.querySelector('.info-note-hint');
    if (hint) {
      hint.style.display = 'inline';
      setTimeout(() => { hint.style.display = 'none'; }, 2000);
    }
  });

  fillDefinition(partData, lang);
}

// Z-Anatomy's collections are flat, so there is no tree to show — but the glTF
// graph does record which structure contains which, and that relation is worth
// surfacing: 868 of the 2827 structures sit inside another one.
function relationMarkup(partId, lang) {
  const entry = getStructure(partId);
  if (!entry) return '';

  const label = id => {
    const info = getStructureInfo(id);
    return escapeHtml(info?.name?.[lang] || info?.name?.en || id);
  };

  const parts = [];

  if (entry.parentId) {
    parts.push(`
      <div class="relation">
        <span class="relation-label">${escapeHtml(translate('part_of', lang))}</span>
        <button type="button" class="relation-link" data-relation="${escapeHtml(entry.parentId)}">${label(entry.parentId)}</button>
      </div>
    `);
  }

  if (entry.childIds.length) {
    parts.push(`
      <div class="relation">
        <span class="relation-label">${escapeHtml(translate('contains', lang))}</span>
        <span class="relation-links">
          ${entry.childIds.slice(0, 8).map(id => `<button type="button" class="relation-link" data-relation="${escapeHtml(id)}">${label(id)}</button>`).join('')}
          ${entry.childIds.length > 8 ? `<span class="relation-more">+${entry.childIds.length - 8}</span>` : ''}
        </span>
      </div>
    `);
  }

  return parts.length ? `<div class="structure-relations">${parts.join('')}</div>` : '';
}

// Definitions arrive from a separate file that is still downloading on a cold
// start, so the panel renders first and fills in when the text is available.
async function fillDefinition(partData, lang) {
  const definitions = await loadDefinitions();
  const target = document.querySelector('#structureInfo [data-definition]');

  // The user may have selected something else in the meantime.
  if (!target || state.selectedPart?.id !== partData.id) return;

  const base = partData.info?.baseName || partData.id;
  const text = definitions[base];

  if (!text) {
    target.classList.add('is-empty');
    target.textContent = translate('no_definition', lang);
    return;
  }

  target.classList.remove('is-empty');
  target.innerHTML = `
    ${escapeHtml(text)}
    <a class="definition-source" href="https://en.wikipedia.org/wiki/Special:Search?search=${encodeURIComponent(base)}"
       target="_blank" rel="noopener">${escapeHtml(translate('read_more', lang))}</a>
  `;
}

function hideInfoPanel() {
  const placeholder = document.querySelector('.info-placeholder');
  const structureInfo = document.getElementById('structureInfo');

  if (placeholder) placeholder.style.display = 'flex';
  if (structureInfo) structureInfo.classList.add('hidden');
}

function showFooterActions() {
  const footer = document.getElementById('footerBar');
  if (footer) footer.style.display = 'flex';
}

function hideFooterActions() {
  const footer = document.getElementById('footerBar');
  if (footer) footer.style.display = 'none';
}

// System labels come from the shared dictionary; there used to be a private
// copy here that drifted from the one in the sidebar.
function getSystemLabel(system, lang) {
  const label = translate(`system_${system}`, lang);
  return label === `system_${system}` ? system : label;
}


function escapeHtml(text) {
  const div = document.createElement('div');
  div.textContent = text;
  return div.innerHTML;
}

export function getSelectedPart() {
  return state.selectedPart;
}

export function selectPartById(partId, viewer, skipHistory = false, skipCamera = false) {
  if (!partId) return false;
  const targetViewer = viewer || state.viewer || window.viewer;
  const registry = getMeshRegistry();

  // 1. Direct match
  let mesh = registry.get(partId);
  let resolvedId = partId;

  // 2. Case-insensitive match
  if (!mesh) {
    const lower = partId.toLowerCase();
    for (const [id, m] of registry.entries()) {
      if (id.toLowerCase() === lower) {
        mesh = m;
        resolvedId = id;
        break;
      }
    }
  }

  // 3. Prefix match (e.g. "Hip bone" -> "Hip bone.l", "Femur" -> "Femur.l")
  if (!mesh) {
    const lower = partId.toLowerCase();
    for (const [id, m] of registry.entries()) {
      if (id.toLowerCase().startsWith(lower)) {
        mesh = m;
        resolvedId = id;
        break;
      }
    }
  }

  if (mesh) {
    selectPart(resolvedId, targetViewer, skipHistory, skipCamera);
    return true;
  }
  return false;
}

export function executeUndo(viewer = state.viewer) {
  const action = popUndo();
  if (!action) return null;

  const targetViewer = viewer || state.viewer || window.viewer;

  // 1. Handle simple string or dissect action
  if (typeof action === 'string' || action.type === 'dissect') {
    const partId = typeof action === 'string' ? action : action.partId;
    showPart(partId);
    targetViewer?.render();
    const info = getStructureInfo(partId);
    const name = info?.name?.[state.language] || info?.name?.vi || info?.name?.en || partId;
    return `Đã phục hồi: ${name}`;
  }

  // 2. Handle hide action
  if (action.type === 'hide') {
    showPart(action.partId);
    targetViewer?.render();
    const info = getStructureInfo(action.partId);
    const name = info?.name?.[state.language] || info?.name?.vi || info?.name?.en || action.partId;
    return `Đã phục hồi: ${name}`;
  }

  // 3. Handle isolate action
  if (action.type === 'isolate') {
    restoreAllParts();
    if (action.prevIsolated) {
      isolatePart(action.prevIsolated);
    }
    const isolateBtn = document.getElementById('cardIsolateBtn');
    if (isolateBtn) {
      isolateBtn.classList.toggle('active', !!action.prevIsolated);
    }
    targetViewer?.render();
    return 'Đã hoàn tác: Khôi phục giải phẫu';
  }

  // 4. Handle selection step action
  if (action.type === 'select') {
    if (action.prevId) {
      selectPart(action.prevId, targetViewer, true);
      const info = getStructureInfo(action.prevId);
      const name = info?.name?.[state.language] || info?.name?.vi || info?.name?.en || action.prevId;
      targetViewer?.render();
      return `Đã quay lại bước trước: ${name}`;
    } else {
      deselectPart(true);
      targetViewer?.render();
      return 'Đã bỏ chọn bộ phận';
    }
  }

  // 5. Handle transparency action
  if (action.type === 'ghost') {
    setPartTransparency(action.partId, action.prevOpacity ?? 1);
    targetViewer?.render();
    return 'Đã hoàn tác độ trong suốt';
  }

  return 'Đã hoàn tác thao tác';
}

export function undoLastDissect(viewer) {
  return executeUndo(viewer);
}

export function zoomIntoCurrentSelection(viewer) {
  const targetViewer = viewer || state.viewer || window.viewer;
  if (!lastSelectedMesh || !targetViewer) return Promise.resolve();
  return zoomIntoMesh(lastSelectedMesh, targetViewer, true);
}

export function zoomOutSelectionOverview(viewer) {
  const targetViewer = viewer || state.viewer || window.viewer;
  return zoomOutToOverview(targetViewer, true);
}