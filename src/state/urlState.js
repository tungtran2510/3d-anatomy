// The whole view lives in the URL hash, so a link reproduces exactly what the
// sender was looking at and a reload does not throw the session away.
//
// Shape: #sys=skeletal,muscular&cam=x,y,z,tx,ty,tz&sel=Femur.l&hid=A|B&iso=X&lang=en
import { state, setLanguage } from './store.js';

const WRITE_DELAY_MS = 400;
const PRECISION = 3;

let writeTimer = null;
let applying = false;

function round(value) {
  return Number(value.toFixed(PRECISION));
}

export function serialiseState() {
  const params = new URLSearchParams();

  if (state.loadedSystems.length) {
    params.set('sys', state.loadedSystems.join(','));
  }

  const viewer = state.viewer;
  if (viewer) {
    const { camera, controls } = viewer;
    params.set('cam', [
      round(camera.position.x), round(camera.position.y), round(camera.position.z),
      round(controls.target.x), round(controls.target.y), round(controls.target.z)
    ].join(','));
  }

  if (state.selectedPart?.id) params.set('sel', state.selectedPart.id);
  if (state.isolatedPart) params.set('iso', state.isolatedPart);

  // Hidden and transparent structures are usually few; listing them keeps the
  // link readable and avoids encoding 2827 booleans.
  const hidden = [...state.hiddenParts];
  if (hidden.length && hidden.length < 200) params.set('hid', hidden.join('|'));

  const transparent = [...state.transparentParts];
  if (transparent.length && transparent.length < 200) params.set('tra', transparent.join('|'));

  if (state.language && state.language !== 'en') params.set('lang', state.language);

  return params.toString();
}

export function readState() {
  const hash = window.location.hash.replace(/^#/, '');
  if (!hash) return null;

  const params = new URLSearchParams(hash);
  const camera = params.get('cam')?.split(',').map(Number);

  return {
    systems: params.get('sys')?.split(',').filter(Boolean) || [],
    camera: camera?.length === 6 && camera.every(Number.isFinite) ? camera : null,
    selected: params.get('sel') || null,
    isolated: params.get('iso') || null,
    hidden: params.get('hid')?.split('|').filter(Boolean) || [],
    transparent: params.get('tra')?.split('|').filter(Boolean) || [],
    language: params.get('lang') || null
  };
}

function write() {
  writeTimer = null;
  if (applying) return;

  const serialised = serialiseState();
  const next = `${window.location.pathname}${window.location.search}#${serialised}`;

  // replaceState, not push: panning the camera must not fill the back button
  // with hundreds of entries.
  window.history.replaceState(null, '', next);

  // The active URL hash is the single source of truth for the active session.
  // We do NOT persist camera/part selections into global localStorage so that
  // fresh root launches always open cleanly into the pristine anatomical overview.
}

export function scheduleStateWrite() {
  if (applying || writeTimer) return;
  writeTimer = setTimeout(write, WRITE_DELAY_MS);
}

// Restores a serialised view. `loadSystem` is injected to avoid a cycle
// between the store and the loader.
export async function applyState(saved, { loadSystem, selectPart, setVisible, setTransparency, isolate }) {
  if (!saved) return false;

  applying = true;
  try {
    if (saved.language) setLanguage(saved.language);

    for (const systemId of saved.systems) {
      if (state.loadedSystems.includes(systemId)) continue;

      try {
        await loadSystem(systemId);
      } catch (error) {
        // A system that refuses to load costs its own structures and nothing
        // else: the camera, the isolation and the selection are still restored
        // on top of whatever did load.
        console.error(`[urlState] Failed to load ${systemId}:`, error);
      }
    }

    saved.hidden.forEach(partId => setVisible(partId, false));
    saved.transparent.forEach(partId => setTransparency(partId, 0.3));

    if (saved.camera && state.viewer) {
      const { camera, controls } = state.viewer;
      camera.position.set(saved.camera[0], saved.camera[1], saved.camera[2]);
      controls.target.set(saved.camera[3], saved.camera[4], saved.camera[5]);
      controls.update();
    }

    if (saved.isolated) isolate(saved.isolated);
    if (saved.selected) selectPart(saved.selected);

    return true;
  } finally {
    applying = false;
  }
}

export function storedState() {
  try {
    const serialised = window.localStorage.getItem('anatomy:view');
    if (!serialised) return null;

    const previous = window.location.hash;
    window.location.hash = serialised;
    const parsed = readState();
    window.history.replaceState(null, '', `${window.location.pathname}${window.location.search}${previous}`);
    return parsed;
  } catch {
    return null;
  }
}
