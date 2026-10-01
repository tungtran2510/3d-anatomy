// Theme Manager - Synchronizes Light / Dark theme across HTML UI and 3D Canvas
import * as THREE from 'three';
import { state } from '../state/store.js';

export function getAppTheme() {
  if (typeof localStorage === 'undefined') return 'light';
  const saved = localStorage.getItem('giao_dien') || localStorage.getItem('theme');
  return saved === 'dark' ? 'dark' : 'light';
}

export function isDarkTheme() {
  return getAppTheme() === 'dark';
}

export function setAppTheme(theme, viewer = state.viewer || window.viewer) {
  const isDark = theme === 'dark';

  // 1. Sync DOM root & body classes
  document.body.classList.toggle('theme-dark', isDark);
  document.documentElement.setAttribute('data-theme', isDark ? 'dark' : 'light');

  // 2. Persist in localStorage
  if (typeof localStorage !== 'undefined') {
    localStorage.setItem('giao_dien', isDark ? 'dark' : 'light');
    localStorage.setItem('theme', isDark ? 'dark' : 'light');
  }

  // 3. Sync Three.js Scene Background
  const targetViewer = viewer || state.viewer || window.viewer;
  if (targetViewer?.scene) {
    targetViewer.scene.background = new THREE.Color(isDark ? 0x0d1117 : 0xf8fafc);
    targetViewer.invalidate?.(5);
    if (typeof targetViewer.render === 'function') {
      targetViewer.render();
    }
  }

  // 4. Update all UI theme toggle buttons
  updateThemeButtons(isDark);

  return isDark;
}

export function toggleAppTheme(viewer = state.viewer || window.viewer) {
  const nextTheme = isDarkTheme() ? 'light' : 'dark';
  return setAppTheme(nextTheme, viewer);
}

export function updateThemeButtons(isDark = isDarkTheme()) {
  document.querySelectorAll('.theme-toggle-btn, #btnHubThemeToggle, #mainThemeToggleBtn').forEach(btn => {
    btn.setAttribute('data-theme', isDark ? 'dark' : 'light');
    btn.setAttribute('title', isDark ? 'Chuyển sang nền sáng (Light Mode)' : 'Chuyển sang nền tối (Dark Mode)');
    
    const label = btn.querySelector('.theme-label');
    if (label) {
      label.textContent = isDark ? 'Nền Tối' : 'Nền Sáng';
    }

    const icon = btn.querySelector('.theme-icon');
    if (icon) {
      icon.innerHTML = isDark
        ? `<svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path d="M21 12.79A9 9 0 1 1 11.21 3 7 7 0 0 0 21 12.79z"/></svg>`
        : `<svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><circle cx="12" cy="12" r="5"/><line x1="12" y1="1" x2="12" y2="3"/><line x1="12" y1="21" x2="12" y2="23"/><line x1="4.22" y1="4.22" x2="5.64" y2="5.64"/><line x1="18.36" y1="18.36" x2="19.78" y2="19.78"/><line x1="1" y1="12" x2="3" y2="12"/><line x1="21" y1="12" x2="23" y2="12"/><line x1="4.22" y1="19.78" x2="5.64" y2="18.36"/><line x1="18.36" y1="5.64" x2="19.78" y2="4.22"/></svg>`;
    }
  });
}

export function initTheme(viewer = state.viewer || window.viewer) {
  const current = getAppTheme();
  setAppTheme(current, viewer);
}
