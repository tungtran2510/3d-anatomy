// Draggable Floating AI Bubble Widget
// Free-floating, small & subtle opacity, snaps to screen edge.
// Tap to open 1-line transparent AI bar. Long-press (>220ms) to drag & move around.

import { toggleAIAssistant } from './aiAssistantModal.js';
import { ICONS } from './icons.js';

let bubbleEl = null;
let isDragging = false;
let longPressTimer = null;
let isLongPressed = false;
let startX = 0;
let startY = 0;
let initialLeft = 0;
let initialTop = 0;
let pointerMoved = false;

export function initFloatingAIButton(viewer) {
  const container = document.getElementById('viewerContainer');
  if (!container || bubbleEl) return;

  bubbleEl = document.createElement('div');
  bubbleEl.id = 'floatingAIBubble';
  bubbleEl.className = 'floating-ai-bubble';
  bubbleEl.title = 'Trợ lý AI (Chạm để ra lệnh, Ấn giữ để di chuyển)';
  bubbleEl.innerHTML = `
    <span class="ai-sparkle-dot"></span>
    <span class="ai-bubble-icon">${ICONS.aiSparkle}</span>
    <span class="ai-bubble-text">AI</span>
  `;

  // Restore saved position (if on right half) or default to bottom-right above "Làm lại"
  const savedPos = getSavedPosition();
  if (savedPos && savedPos.x > 150) {
    bubbleEl.style.left = `${savedPos.x}px`;
    bubbleEl.style.top = `${savedPos.y}px`;
    bubbleEl.style.right = 'auto';
    bubbleEl.style.bottom = 'auto';
  } else {
    bubbleEl.style.right = '8px';
    bubbleEl.style.bottom = '64px';
    bubbleEl.style.left = 'auto';
    bubbleEl.style.top = 'auto';
  }

  container.appendChild(bubbleEl);
  setupLongPressDragHandlers(viewer);
}

function getSavedPosition() {
  try {
    const raw = localStorage.getItem('anatomy_ai_bubble_pos');
    if (raw) return JSON.parse(raw);
  } catch {}
  return null;
}

function savePosition(x, y) {
  try {
    localStorage.setItem('anatomy_ai_bubble_pos', JSON.stringify({ x, y }));
  } catch {}
}

function setupLongPressDragHandlers(viewer) {
  if (!bubbleEl) return;

  let pointerDownStartedOnBubble = false;

  const onPointerDown = (e) => {
    pointerDownStartedOnBubble = true;
    isDragging = false;
    isLongPressed = false;
    pointerMoved = false;
    startX = e.clientX;
    startY = e.clientY;

    const rect = bubbleEl.getBoundingClientRect();
    const parentRect = bubbleEl.parentElement.getBoundingClientRect();
    initialLeft = rect.left - parentRect.left;
    initialTop = rect.top - parentRect.top;

    // Start long-press timer (220ms threshold)
    if (longPressTimer) clearTimeout(longPressTimer);
    longPressTimer = setTimeout(() => {
      isLongPressed = true;
      isDragging = true;
      bubbleEl.classList.add('is-dragging');
      if (navigator.vibrate) navigator.vibrate(25);
      try { bubbleEl.setPointerCapture?.(e.pointerId); } catch {}
    }, 220);
  };

  const onPointerMove = (e) => {
    if (!pointerDownStartedOnBubble) return;

    const dx = e.clientX - startX;
    const dy = e.clientY - startY;

    if (Math.abs(dx) > 6 || Math.abs(dy) > 6) {
      pointerMoved = true;
      // If moved before long-press elapsed, cancel long press
      if (!isLongPressed) {
        clearTimeout(longPressTimer);
        return;
      }
    }

    if (!isDragging || !isLongPressed) return;

    const parent = bubbleEl.parentElement;
    if (!parent) return;

    const maxLeft = parent.clientWidth - bubbleEl.offsetWidth;
    const maxTop = parent.clientHeight - bubbleEl.offsetHeight;

    const newLeft = Math.max(6, Math.min(maxLeft - 6, initialLeft + dx));
    const newTop = Math.max(48, Math.min(maxTop - 60, initialTop + dy));

    bubbleEl.style.left = `${newLeft}px`;
    bubbleEl.style.right = 'auto';
    bubbleEl.style.top = `${newTop}px`;
    e.preventDefault();
  };

  const onPointerUp = (e) => {
    if (!pointerDownStartedOnBubble) return;
    pointerDownStartedOnBubble = false;

    if (longPressTimer) {
      clearTimeout(longPressTimer);
      longPressTimer = null;
    }

    try { bubbleEl.releasePointerCapture?.(e.pointerId); } catch {}

    if (isLongPressed && isDragging) {
      // Completed drag operation -> Snap to nearest edge
      isDragging = false;
      isLongPressed = false;
      bubbleEl.classList.remove('is-dragging');
      snapToEdge();
    } else {
      isDragging = false;
      isLongPressed = false;
      bubbleEl.classList.remove('is-dragging');
    }
  };

  bubbleEl.addEventListener('click', (e) => {
    e.stopPropagation();
    if (!pointerMoved && !isLongPressed) {
      toggleAIAssistant(viewer);
    }
  });

  bubbleEl.addEventListener('pointerdown', onPointerDown);
  window.addEventListener('pointermove', onPointerMove, { passive: false });
  window.addEventListener('pointerup', onPointerUp);
  window.addEventListener('pointercancel', onPointerUp);
}

function snapToEdge() {
  if (!bubbleEl) return;
  const parent = bubbleEl.parentElement;
  if (!parent) return;

  const rect = bubbleEl.getBoundingClientRect();
  const parentRect = parent.getBoundingClientRect();
  const currentLeft = rect.left - parentRect.left;
  const currentTop = rect.top - parentRect.top;

  const threshold = parent.clientWidth / 2;
  const finalLeft = currentLeft < threshold ? 8 : parent.clientWidth - bubbleEl.offsetWidth - 8;

  bubbleEl.style.transition = 'left 0.22s cubic-bezier(0.16, 1, 0.3, 1)';
  bubbleEl.style.left = `${finalLeft}px`;
  bubbleEl.style.right = 'auto';

  savePosition(finalLeft, currentTop);

  setTimeout(() => {
    if (bubbleEl) bubbleEl.style.transition = '';
  }, 240);
}
