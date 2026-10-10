// Selection - Raycasting, highlighting, and selection management
import * as THREE from 'three';
import { state, setSelectedPart, getStructureInfo, translate, pushUndo, popUndo, pushRedo, popRedo, clearRedo } from '../state/store.js';
import { getMeshRegistry, getPickTargets, getStructure } from './loadModel.js';
import { highlightMesh, clearHighlight, ghostAllExcept, clearGhost, isGhostActive, isolatePart, hidePart, showPart, restoreAllParts, setPartTransparency } from './visibility.js';
import { focusOnMesh, zoomIntoMesh, zoomOutToOverview } from './camera.js';
import { showCallout, hideCallout, isCalloutVisible } from '../ui/callout.js';
import { loadDefinitions } from '../data/anatomy.js';
import { handleQuizClick } from '../ui/quiz.js';
import { addToHistory } from '../state/bookmarks.js';
import { getClinicalData } from '../data/clinicalInfo.js';
import { openLesson, openVideo } from '../ui/sidebar.js';
import { isMeasurementActive, handleMeasurementClick } from './measurement.js';
import { getNote, saveNote } from '../state/notes.js';
import { triggerHaptic } from './engineManager.js';
import { dissectMultiLayer, restoreDissectLayer, redoDissectLayer } from './dissection.js';
import { renderCollapsibleTextHtml } from '../utils/textFormatters.js';

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
      dissectMultiLayer(partId, viewer);
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
      dissectMultiLayer(partId, viewer);
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
    expand: () => {
      const card = document.getElementById('selectionCard');
      if (card) {
        card.classList.remove('hidden');
        import('../ui/infoPanel.js').then(({ setSheetSnapTier }) => {
          setSheetSnapTier('half');
        });
      }
    },
    speak: id => {
      if (typeof window !== 'undefined' && window.speechSynthesis) {
        if (window.speechSynthesis.speaking) {
          window.speechSynthesis.cancel();
          return;
        }
      }
      const targetId = id || state.selectedPart?.id;
      if (!targetId) return;
      const part = state.selectedPart || { id: targetId };
      import('../utils/speechVoice.js').then(({ speakStructure15sSummary }) => {
        speakStructure15sSummary(targetId, part.meshName);
      });
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
  triggerHaptic('light');

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

  // Cancel any active speech synthesis and reset speaking button states
  if (typeof window !== 'undefined' && window.speechSynthesis) {
    if (window.speechSynthesis.speaking || window.speechSynthesis.pending) {
      window.speechSynthesis.cancel();
    }
  }
  document.querySelectorAll('.is-speaking').forEach(el => el.classList.remove('is-speaking'));

  // Clear previous selection highlight
  if (lastSelectedMesh) {
    clearHighlight(lastSelectedMesh.userData.partId);
  }

  let mesh = getMeshRegistry().get(partId);
  if (!mesh) {
    const normTarget = String(partId).toLowerCase().replace(/[^a-z0-9]/g, '');
    for (const [id, m] of getMeshRegistry().entries()) {
      const normId = id.toLowerCase().replace(/[^a-z0-9]/g, '');
      if (normId === normTarget || normId.startsWith(normTarget)) {
        mesh = m;
        break;
      }
    }
  }
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

  // Highlight selected mesh with crisp clinical cyan accent (preserves 100% PBR textures & normal maps)
  highlightMesh(partId, 0x38bdf8, 0.28);
  lastSelectedMesh = mesh;

  // Smoothly jump/focus camera onto the selected structure if not skipped
  if (viewer && !skipCamera) {
    focusOnMesh(mesh, viewer, true, 2.2);
  }

  // Only maintain ghosting if ghost mode was explicitly activated by the user (Fade Others).
  // By default, surrounding anatomy remains 100% solid, fully shaded & crisp, eliminating hazy fog!
  if (isGhostActive()) {
    ghostAllExcept(partId);
  }

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

  // Cancel any active speech synthesis
  if (typeof window !== 'undefined' && window.speechSynthesis) {
    if (window.speechSynthesis.speaking || window.speechSynthesis.pending) {
      window.speechSynthesis.cancel();
    }
  }
  document.querySelectorAll('.is-speaking').forEach(el => el.classList.remove('is-speaking'));

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
        <div class="clinical-desc">${renderCollapsibleTextHtml(clinical.function, 100, 'Mở rộng ↓', 'Thu gọn ↑')}</div>

        <!-- 4-Way Anatomical Relations -->
        <h4 class="clinical-heading" style="margin-top: 12px; color: #58a6ff;">🔗 Liên Quan Giải Phẫu Học</h4>
        <div class="flashcard-relations" style="margin-top: 6px;">
          <div class="relation-item">
            <span class="relation-icon">🔴</span>
            <div class="relation-body">
              <strong>Cơ liên quan:</strong>
              ${renderCollapsibleTextHtml(rel.muscles || 'Liên kết nhóm cơ định hình và vận động.', 100, 'Mở rộng ↓', 'Thu gọn ↑')}
            </div>
          </div>
          <div class="relation-item">
            <span class="relation-icon">🦴</span>
            <div class="relation-body">
              <strong>Xương & Khớp:</strong>
              ${renderCollapsibleTextHtml(rel.bones || 'Tiếp khớp với các diện xương kế cận.', 100, 'Mở rộng ↓', 'Thu gọn ↑')}
            </div>
          </div>
          <div class="relation-item">
            <span class="relation-icon">⚡</span>
            <div class="relation-body">
              <strong>Thần kinh:</strong>
              ${renderCollapsibleTextHtml(rel.nerves || 'Chi phối bởi các nhánh thần kinh ngoại biên.', 100, 'Mở rộng ↓', 'Thu gọn ↑')}
            </div>
          </div>
          <div class="relation-item">
            <span class="relation-icon">🩸</span>
            <div class="relation-body">
              <strong>Mạch máu:</strong>
              ${renderCollapsibleTextHtml(rel.vessels || 'Cấp máu bởi các nhánh động mạch khu vực.', 100, 'Mở rộng ↓', 'Thu gọn ↑')}
            </div>
          </div>
        </div>

        <h4 class="clinical-heading" style="margin-top: 12px; color: #ff7b72;">🩺 Ý nghĩa lâm sàng & Bệnh lý</h4>
        <div class="clinical-desc">${renderCollapsibleTextHtml(clinical.clinical, 100, 'Mở rộng ↓', 'Thu gọn ↑')}</div>

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

// Anatomical alias map for standardized resolution across search, AI, and viewer
export const ANATOMICAL_ALIAS_MAP = {
  'atlas': 'Atlas (C1)',
  'axis': 'Axis (C2)',
  'sternum': 'Body of sternum',
  'lumbar vertebra': 'Vertebra L3',
  'lumbar vertebrae': 'Vertebra L3',
  'disc': 'Intervertebral disc L4-L5',
  'discs': 'Intervertebral disc L4-L5',
  'đĩa đệm': 'Intervertebral disc L4-L5',
  'dia dem': 'Intervertebral disc L4-L5',
  'đĩa đệm gian đốt': 'Intervertebral disc L4-L5',
  'đĩa đệm gian đốt sống': 'Intervertebral disc L4-L5',
  'đĩa đệm cột sống': 'Intervertebral disc L4-L5',
  'thoát vị đĩa đệm': 'Intervertebral disc L4-L5',
  'thoat vi dia dem': 'Intervertebral disc L4-L5',
  'nhân nhầy': 'Nucleus pulposus L4-L5',
  'vòng sợi': 'Intervertebral disc L4-L5',
  'intervertebral disc': 'Intervertebral disc L4-L5',
  'thân xương ức': 'Body of sternum',
  'xương ức': 'Body of sternum',
  'xuong uc': 'Body of sternum',
  'cột sống': 'Vertebra L3',
  'cot song': 'Vertebra L3',
  'khớp gối': 'Patellar ligament',
  'khop goi': 'Patellar ligament',
  'dây chằng chéo': 'Anterior cruciate ligament.l',
  'day chang cheo': 'Anterior cruciate ligament.l',
  'acl': 'Anterior cruciate ligament.l',
  'pcl': 'Posterior cruciate ligament.l',
  'dây chằng chéo trước': 'Anterior cruciate ligament.l',
  'day chang cheo truoc': 'Anterior cruciate ligament.l',
  'dây chằng chéo sau': 'Posterior cruciate ligament.l',
  'day chang cheo sau': 'Posterior cruciate ligament.l',
  'sụn chêm': 'Lateral meniscus.l',
  'sụn chêm ngoài': 'Lateral meniscus.l',
  'sụn chêm trong': 'Medial meniscus.l',
  'xương đùi': 'Femur.l',
  'xuong dui': 'Femur.l',
  'femur': 'Femur.l',
  'xương bánh chè': 'Patella.l',
  'xuong banh che': 'Patella.l',
  'patella': 'Patella.l',
  'xương chày': 'Tibia.l',
  'xuong chay': 'Tibia.l',
  'tibia': 'Tibia.l',
  'xương mác': 'Fibula.l',
  'xuong mac': 'Fibula.l',
  'fibula': 'Fibula.l',
  'xương cánh tay': 'Humerus.l',
  'xuong canh tay': 'Humerus.l',
  'humerus': 'Humerus.l',
  'xương quay': 'Radius.l',
  'xuong quay': 'Radius.l',
  'radius': 'Radius.l',
  'xương trụ': 'Ulna.l',
  'xuong tru': 'Ulna.l',
  'ulna': 'Ulna.l',
  'xương bả vai': 'Scapula.l',
  'xuong ba vai': 'Scapula.l',
  'scapula': 'Scapula.l',
  'xương đòn': 'Clavicle.l',
  'xuong don': 'Clavicle.l',
  'clavicle': 'Clavicle.l',
  'khớp háng': 'Femur.l',
  'khop hang': 'Femur.l',
  'ilium': 'Hip bone.l',
  'pelvis': 'Hip bone.l',
  'rib 5': 'Fifth rib.l',
  'rib 1': 'First rib.l',
  'rib 2': 'Second rib.l',
  'rib 3': 'Third rib.l',
  'rib 4': 'Fourth rib.l',
  'rib 6': 'Sixth rib.l',
  'rib 7': 'Seventh rib.l',
  'rib 8': 'Eighth rib.l',
  'rib 9': 'Ninth rib.l',
  'rib 10': 'Tenth rib.l',
  'rib 11': 'Eleventh rib.l',
  'rib 12': 'Twelfth rib.l',
  // Heart chambers & great vessels
  'heart': 'Left ventricle',
  'heart_all': 'Left ventricle',
  'tim': 'Left ventricle',
  'trai tim': 'Left ventricle',
  'left ventricle': 'Left ventricle',
  'right ventricle': 'Right ventricle',
  'left atrium': 'Left atrium',
  'right atrium': 'Right atrium',
  'tâm thất trái': 'Left ventricle',
  'tam that trai': 'Left ventricle',
  'tâm thất phải': 'Right ventricle',
  'tam that phai': 'Right ventricle',
  'tâm nhĩ trái': 'Left atrium',
  'tam nhi trai': 'Left atrium',
  'tâm nhĩ phải': 'Right atrium',
  'tam nhi phai': 'Right atrium',
  'internal carotid artery': 'Internal carotid artery.l',
  'external carotid artery': 'External carotid artery.l',
  'common carotid artery': 'Left common carotid artery',
  'động mạch cảnh trong': 'Internal carotid artery.l',
  'dong mach canh trong': 'Internal carotid artery.l',
  'động mạch cảnh trong trái': 'Internal carotid artery.l',
  'dong mach canh trong trai': 'Internal carotid artery.l',
  'động mạch cảnh trong phải': 'Internal carotid artery.r',
  'dong mach canh trong phai': 'Internal carotid artery.r',
  'động mạch cảnh ngoài': 'External carotid artery.l',
  'dong mach canh ngoai': 'External carotid artery.l',
  'động mạch cảnh ngoài trái': 'External carotid artery.l',
  'dong mach canh ngoai trai': 'External carotid artery.l',
  'động mạch cảnh ngoài phải': 'External carotid artery.r',
  'dong mach canh ngoai phai': 'External carotid artery.r',
  'động mạch cảnh chung': 'Left common carotid artery',
  'dong mach canh chung': 'Left common carotid artery',
  'động mạch cảnh chung trái': 'Left common carotid artery',
  'dong mach canh chung trai': 'Left common carotid artery',
  'động mạch cảnh chung phải': 'Right common carotid artery',
  'dong mach canh chung phai': 'Right common carotid artery',
  'động mạch cảnh': 'Internal carotid artery.l',
  'dong mach canh': 'Internal carotid artery.l',
  'động mạch chủ': 'Ascending aorta',
  'dong mach chu': 'Ascending aorta',
  'aorta': 'Ascending aorta',
  // Heart & cardiac complex
  'heart': 'Left ventricle',
  'tim': 'Left ventricle',
  'quả tim': 'Left ventricle',
  'qua tim': 'Left ventricle',
  'trái tim': 'Left ventricle',
  'trai tim': 'Left ventricle',
  'cor': 'Left ventricle',
  'tâm thất trái': 'Left ventricle',
  'that trai': 'Left ventricle',
  'left ventricle': 'Left ventricle',
  'động mạch vành trái': 'Left coronary artery',
  'dong mach vanh trai': 'Left coronary artery',
  'động mạch vành': 'Left coronary artery',
  'dong mach vanh': 'Left coronary artery',
  // Visceral organs & lungs
  'lungs': 'Superior lobe of left lung',
  'lungs_all': 'Superior lobe of left lung',
  'lung': 'Superior lobe of left lung',
  'phổi': 'Superior lobe of left lung',
  'phoi': 'Superior lobe of left lung',
  'thận': 'Kidney.l',
  'than': 'Kidney.l',
  'thận trái': 'Kidney.l',
  'than trai': 'Kidney.l',
  'thận phải': 'Kidney.r',
  'than phai': 'Kidney.r',
  'dạ dày': 'Stomach',
  'da day': 'Stomach',
  'gan': 'Liver',
  'túi mật': 'Gallbladder',
  'tui mat': 'Gallbladder',
  'tuyến tụy': 'Pancreas',
  'tuyen tuy': 'Pancreas',
  'lá lách': 'Spleen',
  'la lach': 'Spleen',
  'bàng quang': 'Urinary bladder',
  'bang quang': 'Urinary bladder',
  // High-yield nervous system aliases
  'não': 'Superior frontal gyrus.l',
  'nao': 'Superior frontal gyrus.l',
  'bộ não': 'Superior frontal gyrus.l',
  'bo nao': 'Superior frontal gyrus.l',
  'đại não': 'Superior frontal gyrus.l',
  'dai nao': 'Superior frontal gyrus.l',
  'vỏ não': 'Superior frontal gyrus.l',
  'vo nao': 'Superior frontal gyrus.l',
  'óc': 'Superior frontal gyrus.l',
  'oc': 'Superior frontal gyrus.l',
  'bán cầu đại não': 'Superior frontal gyrus.l',
  'ban cau dai nao': 'Superior frontal gyrus.l',
  'brain': 'Superior frontal gyrus.l',
  'cerebrum': 'Superior frontal gyrus.l',
  'tiểu não': 'Lingula of cerebellum',
  'tieu nao': 'Lingula of cerebellum',
  'cerebellum': 'Lingula of cerebellum',
  'thân não': 'Midbrain.l',
  'than nao': 'Midbrain.l',
  'brainstem': 'Midbrain.l',
  'tủy': 'White matter of spinal cord',
  'tuy': 'White matter of spinal cord',
  'tuỷ': 'White matter of spinal cord',
  'tủy sống': 'White matter of spinal cord',
  'tuy song': 'White matter of spinal cord',
  'tuỷ sống': 'White matter of spinal cord',
  'tủy gai': 'White matter of spinal cord',
  'tuy gai': 'White matter of spinal cord',
  'nón tủy': 'White matter of spinal cord',
  'non tuy': 'White matter of spinal cord',
  'chất trắng tủy sống': 'White matter of spinal cord',
  'sừng trước': 'Anterior horn of spinal cord',
  'sung truoc': 'Anterior horn of spinal cord',
  'sừng trước tủy sống': 'Anterior horn of spinal cord',
  'sừng sau': 'Posterior horn of spinal cord',
  'sung sau': 'Posterior horn of spinal cord',
  'sừng sau tủy sống': 'Posterior horn of spinal cord',
  'rễ thần kinh': 'Anterior root of spinal nerve',
  're than kinh': 'Anterior root of spinal nerve',
  'rễ thần kinh gai sống': 'Anterior root of spinal nerve',
  'màng cứng tủy sống': 'Spinal dura',
  'màng cứng': 'Spinal dura',
  'spinal cord': 'White matter of spinal cord',
  'medulla spinalis': 'White matter of spinal cord',
  'chùm đuôi ngựa': 'Cauda equina',
  'chum duoi ngua': 'Cauda equina',
  'đuôi ngựa': 'Cauda equina',
  'duoi ngua': 'Cauda equina',
  'cauda equina': 'Cauda equina',
  'thần kinh giữa': 'Median nerve.l',
  'than kinh giua': 'Median nerve.l',
  'median nerve': 'Median nerve.l',
  'thần kinh trụ': 'Ulnar nerve.l',
  'than kinh tru': 'Ulnar nerve.l',
  'ulnar nerve': 'Ulnar nerve.l',
  'thần kinh quay': 'Radial nerve.l',
  'than kinh quay': 'Radial nerve.l',
  'radial nerve': 'Radial nerve.l',
  'thần kinh tọa': 'Sciatic nerve.l',
  'than kinh toa': 'Sciatic nerve.l',
  'thần kinh ngồi': 'Sciatic nerve.l',
  'than kinh ngoi': 'Sciatic nerve.l',
  'dây thần kinh tọa': 'Sciatic nerve.l',
  'day than kinh toa': 'Sciatic nerve.l',
  'sciatic nerve': 'Sciatic nerve.l',
  'sciatic': 'Sciatic nerve.l',
  'thần kinh tọa trái': 'Sciatic nerve.l',
  'thần kinh tọa phải': 'Sciatic nerve.r',
  // High-yield digestive aliases
  'ruột thừa': 'Vermiform appendix',
  'ruot thua': 'Vermiform appendix',
  'appendix': 'Vermiform appendix',
  'vermiform appendix': 'Vermiform appendix',
  'ruột tịt': 'Vermiform appendix',
  'ruot tit': 'Vermiform appendix',
  'viêm ruột thừa': 'Vermiform appendix',
  // High-yield muscular aliases
  'cơ delta': 'Acromial part of deltoid muscle.l',
  'co delta': 'Acromial part of deltoid muscle.l',
  'deltoid': 'Acromial part of deltoid muscle.l',
  'deltoid muscle': 'Acromial part of deltoid muscle.l',
  'cơ delta trái': 'Acromial part of deltoid muscle.l',
  'cơ delta phải': 'Acromial part of deltoid muscle.r',
  // High-yield tendons & ligaments aliases
  'dây chằng bánh chè': 'Patellar ligament',
  'day chang banh che': 'Patellar ligament',
  'gân bánh chè': 'Patellar ligament',
  'gan banh che': 'Patellar ligament',
  'patellar ligament': 'Patellar ligament',
  'patellar tendon': 'Patellar ligament',
  'gân gót': 'Calcaneal tendon.l',
  'gan got': 'Calcaneal tendon.l',
  'gân achilles': 'Calcaneal tendon.l',
  'gan achilles': 'Calcaneal tendon.l',
  'gân gót achilles': 'Calcaneal tendon.l',
  'achilles tendon': 'Calcaneal tendon.l',
  'calcaneal tendon': 'Calcaneal tendon.l',
  'dải chậu chày': 'Iliotibial tract.l',
  'dai chau chay': 'Iliotibial tract.l',
  'iliotibial tract': 'Iliotibial tract.l',
  'it band': 'Iliotibial tract.l'
};

export function resolveAnatomicalAlias(name) {
  if (!name) return name;
  const lower = name.toLowerCase().trim();
  if (ANATOMICAL_ALIAS_MAP[lower]) return ANATOMICAL_ALIAS_MAP[lower];
  if (lower.includes('lumbar')) return 'Vertebra L3';
  return name;
}

export function selectPartById(partId, viewer, skipHistory = false, skipCamera = false) {
  if (!partId) return false;
  const targetViewer = viewer || state.viewer || window.viewer;
  const registry = getMeshRegistry();
  const targetId = resolveAnatomicalAlias(partId);

  // 1. Direct match
  let mesh = registry.get(targetId);
  let resolvedId = targetId;

  // 2. Case-insensitive match
  if (!mesh) {
    const lower = targetId.toLowerCase();
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
    const lower = targetId.toLowerCase();
    for (const [id, m] of registry.entries()) {
      if (id.toLowerCase().startsWith(lower)) {
        mesh = m;
        resolvedId = id;
        break;
      }
    }
  }

  // 4. Normalized Alphanumeric match (ignoring spaces, underscores, periods, and hyphens)
  // e.g. "Vertebra T5" <-> "Vertebra_T5_1", "Atlas" <-> "Atlas (C1)"
  if (!mesh) {
    const normTarget = targetId.toLowerCase().replace(/[^a-z0-9]/g, '');
    for (const [id, m] of registry.entries()) {
      const normId = id.toLowerCase().replace(/[^a-z0-9]/g, '');
      if (normId === normTarget || normId.startsWith(normTarget) || normTarget.startsWith(normId)) {
        mesh = m;
        resolvedId = m.userData?.partId || id;
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

  // 0. Handle multi-layer dissection action
  if (action.type === 'dissect_layer') {
    const msg = restoreDissectLayer(action, targetViewer);
    pushRedo(action);
    return msg;
  }

  // 1. Handle simple string or dissect action
  if (typeof action === 'string' || action.type === 'dissect') {
    const partId = typeof action === 'string' ? action : action.partId;
    showPart(partId);
    pushRedo({ type: 'dissect', partId });
    targetViewer?.render();
    const info = getStructureInfo(partId);
    const name = info?.name?.[state.language] || info?.name?.vi || info?.name?.en || partId;
    return `Đã hoàn tác: Khôi phục ${name}`;
  }

  // 2. Handle hide action
  if (action.type === 'hide') {
    showPart(action.partId);
    pushRedo({ type: 'hide', partId: action.partId });
    targetViewer?.render();
    const info = getStructureInfo(action.partId);
    const name = info?.name?.[state.language] || info?.name?.vi || info?.name?.en || action.partId;
    return `Đã hoàn tác: Khôi phục ${name}`;
  }

  // 2b. Handle peel anterior obstacles action
  if (action.type === 'peel_obstacles') {
    (action.peeledIds || []).forEach(id => {
      showPart(id);
    });
    pushRedo(action);
    targetViewer?.render();
    return `Đã hoàn tác: Khôi phục ${action.peeledIds?.length || 0} cấu trúc che chắn`;
  }

  // 3. Handle isolate action
  if (action.type === 'isolate') {
    pushRedo({
      type: 'isolate',
      partId: action.partId,
      prevIsolated: action.prevIsolated
    });
    restoreAllParts();
    if (action.prevIsolated) {
      isolatePart(action.prevIsolated);
    }
    const isolateBtn = document.getElementById('cardIsolateBtn');
    if (isolateBtn) {
      isolateBtn.classList.toggle('active', !!action.prevIsolated);
    }
    const miniIso = document.getElementById('btnMiniIsolate');
    if (miniIso) {
      const isIso = !!action.prevIsolated;
      miniIso.classList.toggle('active', isIso);
      const l = miniIso.querySelector('.mini-btn-label');
      const i = miniIso.querySelector('.mini-btn-icon');
      if (l) l.textContent = isIso ? 'Bỏ cô lập' : 'Cô lập';
      if (i) i.textContent = isIso ? '✓' : '⚡';
    }
    targetViewer?.render();
    return 'Đã hoàn tác: Khôi phục giải phẫu';
  }

  // 4. Handle selection step action
  if (action.type === 'select') {
    pushRedo({
      type: 'select',
      prevId: action.prevId,
      partId: action.partId || state.selectedPart?.id
    });
    if (action.prevId) {
      selectPart(action.prevId, targetViewer, true);
      const info = getStructureInfo(action.prevId);
      const name = info?.name?.[state.language] || info?.name?.vi || info?.name?.en || action.prevId;
      targetViewer?.render();
      return `Đã hoàn tác: Quay lại ${name}`;
    } else {
      deselectPart(true);
      targetViewer?.render();
      return 'Đã hoàn tác: Bỏ chọn bộ phận';
    }
  }

  // 5. Handle transparency action
  if (action.type === 'ghost') {
    const partState = state.partStates.get(action.partId);
    const currentOpacity = partState?.opacity ?? 1;
    pushRedo({
      type: 'ghost',
      partId: action.partId,
      opacity: currentOpacity,
      prevOpacity: action.prevOpacity
    });
    setPartTransparency(action.partId, action.prevOpacity ?? 1);
    targetViewer?.render();
    return 'Đã hoàn tác độ trong suốt';
  }

  return 'Đã hoàn tác thao tác';
}

export function executeRedo(viewer = state.viewer) {
  const action = popRedo();
  if (!action) return null;

  const targetViewer = viewer || state.viewer || window.viewer;

  // 0. Redo multi-layer dissection action
  if (action.type === 'dissect_layer') {
    const msg = redoDissectLayer(action, targetViewer);
    pushUndo(action, true);
    return msg;
  }

  // 1. Redo dissect / hide
  if (action.type === 'dissect' || action.type === 'hide') {
    hidePart(action.partId);
    pushUndo({ type: action.type, partId: action.partId }, true);
    targetViewer?.render();
    const info = getStructureInfo(action.partId);
    const name = info?.name?.[state.language] || info?.name?.vi || info?.name?.en || action.partId;
    return `Đã làm lại: Ẩn ${name}`;
  }

  // 1b. Redo peel anterior obstacles
  if (action.type === 'peel_obstacles') {
    (action.peeledIds || []).forEach(id => {
      hidePart(id);
    });
    pushUndo(action, true);
    targetViewer?.render();
    return 'Đã làm lại: Bóc cấu trúc che chắn';
  }

  // 2. Redo isolate
  if (action.type === 'isolate') {
    pushUndo({
      type: 'isolate',
      partId: action.partId,
      prevIsolated: action.prevIsolated
    }, true);
    if (action.partId) {
      isolatePart(action.partId);
      const isolateBtn = document.getElementById('cardIsolateBtn');
      if (isolateBtn) isolateBtn.classList.add('active');
      const miniIso = document.getElementById('btnMiniIsolate');
      if (miniIso) {
        miniIso.classList.add('active');
        const l = miniIso.querySelector('.mini-btn-label');
        const i = miniIso.querySelector('.mini-btn-icon');
        if (l) l.textContent = 'Bỏ cô lập';
        if (i) i.textContent = '✓';
      }
    }
    targetViewer?.render();
    return 'Đã làm lại: Cô lập bộ phận';
  }

  // 3. Redo select
  if (action.type === 'select') {
    pushUndo({
      type: 'select',
      prevId: action.prevId,
      partId: action.partId
    }, true);
    if (action.partId) {
      selectPart(action.partId, targetViewer, true);
      const info = getStructureInfo(action.partId);
      const name = info?.name?.[state.language] || info?.name?.vi || info?.name?.en || action.partId;
      targetViewer?.render();
      return `Đã làm lại: Chọn ${name}`;
    }
  }

  // 4. Redo ghost
  if (action.type === 'ghost') {
    pushUndo({
      type: 'ghost',
      partId: action.partId,
      prevOpacity: action.prevOpacity
    }, true);
    setPartTransparency(action.partId, action.opacity ?? 0.3);
    targetViewer?.render();
    return 'Đã làm lại độ trong suốt';
  }

  return 'Đã làm lại thao tác';
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