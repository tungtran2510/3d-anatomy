/**
 * IMAGE ZOOM LIGHTBOX MODAL (Apple Medical / Atlas 2027 Standard)
 * Modal phóng to ảnh giải phẫu & vi thể toàn màn hình trên điện thoại di động
 * - Full-screen backdrop mờ sang trọng (Dark Blur 95%)
 * - Pinch-to-zoom (2 ngón tay) & Double-tap zoom (1x <-> 2.5x)
 * - Drag/Pan mượt mà 60 FPS khi đã phóng to để soi từng cấu trúc vi thể
 * - Nút điều khiển zoom trực quan: [-] [100%] [+] [↺] và nút đóng [✕] to rõ
 * - Hỗ trợ duyệt qua lại các slide (Cấu tạo, Sinh lý, Bệnh lý) ngay trong popup
 */

let modalEl = null;
let currentScale = 1.0;
let currentTx = 0;
let currentTy = 0;
let isDragging = false;
let startX = 0;
let startY = 0;
let initialDistance = 0;
let initialScale = 1.0;
let lastTapTime = 0;
let activeSlides = null;
let activeIndex = 0;
let onSlideChangeCallback = null;

export function openImageZoomModal({
  src,
  title = 'Hình ảnh giải phẫu & vi thể',
  subtitle = '',
  slides = null,
  currentIndex = 0,
  onSlideChange = null
}) {
  if (!modalEl) {
    createModalDOM();
  }

  activeSlides = slides && slides.length > 0 ? slides : null;
  activeIndex = currentIndex;
  onSlideChangeCallback = onSlideChange;

  updateModalContent(src, title, subtitle);
  resetTransform();

  modalEl.classList.remove('hidden');
  document.body.classList.add('lightbox-open');

  const selCard = document.getElementById('selectionCard');
  if (selCard) {
    selCard.dataset.wasVisible = !selCard.classList.contains('hidden') ? '1' : '0';
    selCard.classList.add('hidden');
  }
}

export function closeImageZoomModal() {
  if (!modalEl) return;
  modalEl.classList.add('hidden');
  document.body.classList.remove('lightbox-open');
  resetTransform();

  const selCard = document.getElementById('selectionCard');
  if (selCard && selCard.dataset.wasVisible === '1') {
    selCard.classList.remove('hidden');
  }
}

function resetTransform() {
  currentScale = 1.0;
  currentTx = 0;
  currentTy = 0;
  applyTransform(true);
  updateZoomBadge();
}

function setZoom(newScale, animate = true) {
  currentScale = Math.min(Math.max(newScale, 0.8), 4.5);
  if (currentScale <= 1.05) {
    currentTx = 0;
    currentTy = 0;
  }
  applyTransform(animate);
  updateZoomBadge();
}

function updateZoomBadge() {
  const badge = modalEl?.querySelector('#zoomBadgeText');
  if (badge) {
    badge.textContent = `${Math.round(currentScale * 100)}%`;
  }
}

function applyTransform(animate = false) {
  const img = modalEl?.querySelector('#lightboxZoomImage');
  if (!img) return;
  img.style.transition = animate ? 'transform 0.22s cubic-bezier(0.16, 1, 0.3, 1)' : 'none';
  img.style.transform = `translate3d(${currentTx}px, ${currentTy}px, 0) scale(${currentScale})`;
}

function updateModalContent(src, title, subtitle) {
  if (!modalEl) return;

  const currentSrc = activeSlides ? activeSlides[activeIndex]?.image || src : src;
  const currentTitle = activeSlides ? activeSlides[activeIndex]?.title || title : title;
  const currentSubtitle = activeSlides ? activeSlides[activeIndex]?.badge || subtitle : subtitle;

  const titleEl = modalEl.querySelector('#lightboxTitle');
  const subEl = modalEl.querySelector('#lightboxSubtitle');
  const imgEl = modalEl.querySelector('#lightboxZoomImage');
  const navContainer = modalEl.querySelector('#lightboxSlideNav');

  if (titleEl) titleEl.textContent = currentTitle;
  if (subEl) {
    subEl.textContent = currentSubtitle;
    subEl.style.display = currentSubtitle ? 'inline-block' : 'none';
  }
  if (imgEl) {
    imgEl.src = currentSrc;
    imgEl.alt = currentTitle;
  }

  // Render slide pills if available
  if (navContainer) {
    if (activeSlides && activeSlides.length > 1) {
      navContainer.innerHTML = activeSlides.map((s, idx) => `
        <button type="button" class="lightbox-slide-pill ${idx === activeIndex ? 'active' : ''}" data-idx="${idx}">
          ${s.title}
        </button>
      `).join('');
      navContainer.style.display = 'flex';

      navContainer.querySelectorAll('.lightbox-slide-pill').forEach(btn => {
        btn.addEventListener('click', (e) => {
          e.stopPropagation();
          const targetIdx = parseInt(btn.dataset.idx, 10);
          switchSlide(targetIdx);
        });
      });
    } else {
      navContainer.style.display = 'none';
      navContainer.innerHTML = '';
    }
  }
}

function switchSlide(idx) {
  if (!activeSlides || idx < 0 || idx >= activeSlides.length) return;
  activeIndex = idx;
  resetTransform();
  updateModalContent(activeSlides[idx].image, activeSlides[idx].title, activeSlides[idx].badge);
  if (typeof onSlideChangeCallback === 'function') {
    onSlideChangeCallback(activeIndex);
  }
}

function createModalDOM() {
  modalEl = document.createElement('div');
  modalEl.id = 'imageZoomModal';
  modalEl.className = 'image-zoom-modal-backdrop hidden';
  modalEl.innerHTML = `
    <div class="image-zoom-container">
      <!-- 1. Header Toolbar -->
      <div class="lightbox-header-bar">
        <div class="lightbox-header-info">
          <div class="lightbox-title-row">
            <span class="lightbox-icon">🔬</span>
            <span class="lightbox-title" id="lightboxTitle">Hình ảnh giải phẫu</span>
            <span class="lightbox-subtitle-badge" id="lightboxSubtitle"></span>
          </div>
        </div>
        <div class="lightbox-controls">
          <button type="button" class="btn-lightbox-action" id="btnZoomOut" title="Thu nhỏ (-)">
            <svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5"><line x1="5" y1="12" x2="19" y2="12"></line></svg>
          </button>
          <span class="lightbox-zoom-badge" id="zoomBadgeText">100%</span>
          <button type="button" class="btn-lightbox-action" id="btnZoomIn" title="Phóng to (+)">
            <svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5"><line x1="12" y1="5" x2="12" y2="19"></line><line x1="5" y1="12" x2="19" y2="12"></line></svg>
          </button>
          <button type="button" class="btn-lightbox-action" id="btnZoomReset" title="Đặt lại tỷ lệ chuẩn (100%)">
            <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.2"><path d="M3 12a9 9 0 1 0 9-9 9.75 9.75 0 0 0-6.74 2.74L3 8"></path><path d="M3 3v5h5"></path></svg>
          </button>
          <button type="button" class="btn-lightbox-close" id="btnCloseZoomModal" title="Đóng cửa sổ ảnh (Esc)">
            ✕
          </button>
        </div>
      </div>

      <!-- 2. Viewport & Image Stage -->
      <div class="lightbox-viewport" id="lightboxViewport">
        <div class="lightbox-image-stage" id="lightboxStage">
          <img src="" alt="" class="lightbox-zoom-image" id="lightboxZoomImage" draggable="false" />
        </div>
      </div>

      <!-- 3. Bottom Slide Navigation & Smart Gestures Hint -->
      <div class="lightbox-footer-bar">
        <div class="lightbox-slide-nav" id="lightboxSlideNav"></div>
        <div class="lightbox-gesture-hint">
          <span class="hint-icon">💡</span>
          <span class="hint-text">Chạm đúp hoặc 2 ngón tay để phóng to • Kéo để soi vi thể</span>
        </div>
      </div>
    </div>
  `;

  document.body.appendChild(modalEl);

  // Bind Buttons
  modalEl.querySelector('#btnCloseZoomModal')?.addEventListener('click', (e) => {
    e.stopPropagation();
    closeImageZoomModal();
  });

  modalEl.querySelector('#btnZoomIn')?.addEventListener('click', (e) => {
    e.stopPropagation();
    setZoom(currentScale + 0.4, true);
  });

  modalEl.querySelector('#btnZoomOut')?.addEventListener('click', (e) => {
    e.stopPropagation();
    setZoom(currentScale - 0.4, true);
  });

  modalEl.querySelector('#btnZoomReset')?.addEventListener('click', (e) => {
    e.stopPropagation();
    resetTransform();
  });

  // ESC Key listener
  window.addEventListener('keydown', (e) => {
    if (e.key === 'Escape' && !modalEl.classList.contains('hidden')) {
      closeImageZoomModal();
    }
  });

  // Close when clicking empty backdrop if not dragging
  const viewport = modalEl.querySelector('#lightboxViewport');
  viewport?.addEventListener('click', (e) => {
    if (e.target === viewport && currentScale <= 1.05) {
      closeImageZoomModal();
    }
  });

  setupGestures(viewport);
}

function setupGestures(viewport) {
  if (!viewport) return;

  const stage = modalEl.querySelector('#lightboxStage');

  // 1. Mouse Wheel Zoom
  viewport.addEventListener('wheel', (e) => {
    e.preventDefault();
    const delta = e.deltaY < 0 ? 0.2 : -0.2;
    setZoom(currentScale + delta, false);
  }, { passive: false });

  // 2. Mouse Drag (Desktop)
  viewport.addEventListener('mousedown', (e) => {
    if (e.button !== 0) return;
    isDragging = true;
    startX = e.clientX - currentTx;
    startY = e.clientY - currentTy;
    viewport.style.cursor = 'grabbing';
  });

  window.addEventListener('mousemove', (e) => {
    if (!isDragging) return;
    currentTx = e.clientX - startX;
    currentTy = e.clientY - startY;
    applyTransform(false);
  });

  window.addEventListener('mouseup', () => {
    if (!isDragging) return;
    isDragging = false;
    viewport.style.cursor = currentScale > 1 ? 'grab' : 'default';
  });

  // 3. Touch Gestures (Mobile / Tablet): Pinch-to-zoom & Pan & Double-tap
  viewport.addEventListener('touchstart', (e) => {
    if (e.touches.length === 1) {
      // Check double tap
      const now = performance.now();
      if (now - lastTapTime < 300) {
        // Double tap toggle zoom
        if (currentScale > 1.2) {
          resetTransform();
        } else {
          setZoom(2.5, true);
        }
        lastTapTime = 0;
        return;
      }
      lastTapTime = now;

      // Start single finger drag
      isDragging = true;
      startX = e.touches[0].clientX - currentTx;
      startY = e.touches[0].clientY - currentTy;
    } else if (e.touches.length === 2) {
      // Start 2-finger pinch
      isDragging = false;
      const t1 = e.touches[0];
      const t2 = e.touches[1];
      initialDistance = Math.hypot(t2.clientX - t1.clientX, t2.clientY - t1.clientY);
      initialScale = currentScale;
    }
  }, { passive: true });

  viewport.addEventListener('touchmove', (e) => {
    if (e.touches.length === 1 && isDragging && currentScale > 1.05) {
      // Pan when zoomed
      currentTx = e.touches[0].clientX - startX;
      currentTy = e.touches[0].clientY - startY;
      applyTransform(false);
    } else if (e.touches.length === 2 && initialDistance > 0) {
      // Pinch zoom
      const t1 = e.touches[0];
      const t2 = e.touches[1];
      const currentDist = Math.hypot(t2.clientX - t1.clientX, t2.clientY - t1.clientY);
      const ratio = currentDist / initialDistance;
      const targetScale = Math.min(Math.max(initialScale * ratio, 0.8), 4.5);
      currentScale = targetScale;
      applyTransform(false);
      updateZoomBadge();
    }
  }, { passive: true });

  viewport.addEventListener('touchend', (e) => {
    if (e.touches.length === 0) {
      isDragging = false;
      initialDistance = 0;
      if (currentScale < 1.0) {
        resetTransform();
      }
    } else if (e.touches.length === 1) {
      // Switching from pinch to pan
      isDragging = true;
      startX = e.touches[0].clientX - currentTx;
      startY = e.touches[0].clientY - currentTy;
      initialDistance = 0;
    }
  }, { passive: true });
}
