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
