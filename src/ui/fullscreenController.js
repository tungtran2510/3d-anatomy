// Fullscreen Controller for Anatomy 3D Atlas
// Provides Auto-Fullscreen on mobile gesture & dedicated Fullscreen Toggle Button
// Ensures complete immersive 3D view by completely hiding top header bar and expanding canvas to screen edge.

import { ICONS } from './icons.js';

let fsBtnEl = null;
let targetViewer = null;

export function initFullscreenController(viewer) {
  const container = document.getElementById('viewerContainer');
  if (!container || fsBtnEl) return;
  targetViewer = viewer;

  fsBtnEl = document.createElement('button');
  fsBtnEl.id = 'btnFullscreenToggle';
  fsBtnEl.className = 'btn-fullscreen-toggle';
  fsBtnEl.title = 'Bật / Tắt Toàn Màn Hình';
  fsBtnEl.innerHTML = `<span class="fs-icon">${ICONS.fullscreen}</span>`;

  container.appendChild(fsBtnEl);

  // Toggle button click
  fsBtnEl.addEventListener('click', (e) => {
    e.stopPropagation();
    toggleFullscreen();
  });

  // Track fullscreen changes to update icon & trigger renderer resize
  const onFsChange = () => {
    const isNativeFs = !!(document.fullscreenElement || document.webkitFullscreenElement);
    const isFs = isNativeFs || document.body.classList.contains('is-fullscreen');

    if (!isNativeFs && !document.body.classList.contains('manual-fs')) {
      document.body.classList.remove('is-fullscreen');
      document.getElementById('app')?.classList.remove('is-fullscreen');
    }

    applyFullscreenUI(isFs);
  };

  document.addEventListener('fullscreenchange', onFsChange);
  document.addEventListener('webkitfullscreenchange', onFsChange);

  // Desktop ESC key handling
  window.addEventListener('keydown', (e) => {
    if (e.key === 'Escape' && document.body.classList.contains('is-fullscreen')) {
      exitFullscreen();
    }
  });
}

function applyFullscreenUI(isFs) {
  if (fsBtnEl) {
    fsBtnEl.classList.toggle('active', isFs);
    fsBtnEl.innerHTML = `<span class="fs-icon">${isFs ? ICONS.fullscreenExit : ICONS.fullscreen}</span>`;
    fsBtnEl.title = isFs ? 'Thoát Toàn Màn Hình' : 'Bật Toàn Màn Hình';
  }

  // Trigger double-pass resize for immediate & layout-settled Three.js buffer sync
  setTimeout(() => {
    window.dispatchEvent(new Event('resize'));
    targetViewer?.onResize?.();
    targetViewer?.invalidate?.(10);
    if (typeof targetViewer?.render === 'function') targetViewer.render();
  }, 50);

  setTimeout(() => {
    window.dispatchEvent(new Event('resize'));
    targetViewer?.onResize?.();
    targetViewer?.invalidate?.(10);
    if (typeof targetViewer?.render === 'function') targetViewer.render();
  }, 220);
}

export function requestFullscreen() {
  document.body.classList.add('is-fullscreen', 'manual-fs');
  document.getElementById('app')?.classList.add('is-fullscreen');

  const docEl = document.documentElement;
  if (docEl.requestFullscreen) {
    docEl.requestFullscreen().catch(() => {});
  } else if (docEl.webkitRequestFullscreen) {
    docEl.webkitRequestFullscreen().catch(() => {});
  }

  applyFullscreenUI(true);
}

export function exitFullscreen() {
  document.body.classList.remove('is-fullscreen', 'manual-fs');
  document.getElementById('app')?.classList.remove('is-fullscreen');

  if (document.fullscreenElement || document.webkitFullscreenElement) {
    if (document.exitFullscreen) {
      document.exitFullscreen().catch(() => {});
    } else if (document.webkitExitFullscreen) {
      document.webkitExitFullscreen().catch(() => {});
    }
  }

  applyFullscreenUI(false);
}

export function toggleFullscreen() {
  const isFs = document.body.classList.contains('is-fullscreen') ||
               !!(document.fullscreenElement || document.webkitFullscreenElement);

  if (isFs) {
    exitFullscreen();
  } else {
    requestFullscreen();
  }
}
