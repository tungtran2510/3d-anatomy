// Anatomical Name Formatter & Typographic Hierarchy
// Separates primary organ names (bold) from parenthetical notes/subunits (regular unbolded)

export function formatNameWithSubtitles(name) {
  if (!name || typeof name !== 'string') return '';
  const trimmed = name.trim();
  const parenIdx = trimmed.indexOf('(');
  if (parenIdx > 0) {
    const primary = trimmed.slice(0, parenIdx).trim();
    const remainder = trimmed.slice(parenIdx).trim();
    const formattedRemainder = remainder.replace(/\(([^)]+)\)/g, '<span class="name-sub-paren">($1)</span>');
    return `<span class="name-primary">${escapeHTML(primary)}</span> <span class="name-sub-wrap">${formattedRemainder}</span>`;
  }
  return `<span class="name-primary">${escapeHTML(trimmed)}</span>`;
}

export function escapeHTML(str) {
  if (!str || typeof str !== 'string') return '';
  return str
    .replace(/&/g, '&amp;')
    .replace(/</g, '&lt;')
    .replace(/>/g, '&gt;')
    .replace(/"/g, '&quot;')
    .replace(/'/g, '&#039;');
}

/**
 * Attaches a 2-3 line collapsible clamp and an expand/collapse toggle button
 * to a DOM element if its content exceeds charThreshold.
 */
export function setupCollapsibleClamp(element, fullText, charThreshold = 110, expandLabel = 'Mở rộng ↓', collapseLabel = 'Thu gọn ↑') {
  if (!element) return;
  const text = (fullText || '').trim();
  if (!text) {
    element.textContent = '';
    return;
  }

  // Remove existing toggle button if re-rendering
  const parent = element.parentElement;
  if (parent) {
    const existing = parent.querySelector(`.btn-clamp-toggle[data-target-id="${element.id || ''}"]`);
    if (existing) existing.remove();
  }

  element.textContent = text;
  element.title = text;

  // Short text (<= 2-3 lines) does not need clamp or button
  if (text.length <= charThreshold && !text.includes('\n\n')) {
    element.classList.remove('line-clamp-3', 'is-expanded');
    return;
  }

  element.classList.add('line-clamp-3');
  element.classList.remove('is-expanded');

  const toggleBtn = document.createElement('button');
  toggleBtn.type = 'button';
  toggleBtn.className = 'btn-text-expand-toggle btn-clamp-toggle';
  if (element.id) toggleBtn.dataset.targetId = element.id;
  toggleBtn.setAttribute('aria-expanded', 'false');
  toggleBtn.innerHTML = `
    <span class="clamp-toggle-text">${expandLabel}</span>
    <svg width="10" height="10" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5"><polyline points="6 9 12 15 18 9"/></svg>
  `;

  toggleBtn.addEventListener('click', (e) => {
    e.stopPropagation();
    const isExpanded = element.classList.toggle('is-expanded');
    toggleBtn.classList.toggle('is-expanded', isExpanded);
    toggleBtn.setAttribute('aria-expanded', isExpanded ? 'true' : 'false');
    const labelSpan = toggleBtn.querySelector('.clamp-toggle-text');
    if (labelSpan) {
      labelSpan.textContent = isExpanded ? collapseLabel : expandLabel;
    }
  });

  if (element.nextSibling) {
    element.parentNode.insertBefore(toggleBtn, element.nextSibling);
  } else {
    element.parentNode.appendChild(toggleBtn);
  }
}

/**
 * Returns HTML string with collapsible clamp for inline template strings
 */
export function renderCollapsibleTextHtml(text, charThreshold = 110, expandLabel = 'Mở rộng ↓', collapseLabel = 'Thu gọn ↑') {
  const safeText = escapeHTML(text || '');
  if (!safeText) return '';
  if (safeText.length <= charThreshold && !safeText.includes('\n')) {
    return `<div class="collapsible-text-body">${safeText}</div>`;
  }
  return `
    <div class="collapsible-text-wrap">
      <div class="collapsible-text-body line-clamp-3">${safeText}</div>
      <button type="button" class="btn-text-expand-toggle" aria-expanded="false" data-expand-label="${escapeHTML(expandLabel)}" data-collapse-label="${escapeHTML(collapseLabel)}">
        <span class="clamp-toggle-text">${expandLabel}</span>
        <svg width="10" height="10" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5"><polyline points="6 9 12 15 18 9"/></svg>
      </button>
    </div>
  `;
}

// Global delegated listener for collapsible text toggles
if (typeof document !== 'undefined') {
  document.addEventListener('click', (e) => {
    const toggleBtn = e.target.closest('.btn-text-expand-toggle');
    if (!toggleBtn || toggleBtn.classList.contains('btn-clamp-toggle')) return;
    e.stopPropagation();
    const wrap = toggleBtn.closest('.collapsible-text-wrap') || toggleBtn.parentElement;
    const body = wrap?.querySelector('.collapsible-text-body');
    if (!body) return;
    const isExpanded = body.classList.toggle('is-expanded');
    toggleBtn.classList.toggle('is-expanded', isExpanded);
    toggleBtn.setAttribute('aria-expanded', isExpanded ? 'true' : 'false');
    const expandLabel = toggleBtn.dataset.expandLabel || 'Mở rộng ↓';
    const collapseLabel = toggleBtn.dataset.collapseLabel || 'Thu gọn ↑';
    const labelSpan = toggleBtn.querySelector('.clamp-toggle-text');
    if (labelSpan) {
      labelSpan.textContent = isExpanded ? collapseLabel : expandLabel;
    }
  });
}
