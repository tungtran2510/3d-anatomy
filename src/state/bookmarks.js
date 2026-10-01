// Bookmarks & Viewing History Management with LocalStorage persistence

const BOOKMARKS_KEY = 'anatomy_bookmarks_v1';
const HISTORY_KEY = 'anatomy_history_v1';

export function getBookmarks() {
  try {
    const raw = localStorage.getItem(BOOKMARKS_KEY);
    return raw ? JSON.parse(raw) : [];
  } catch {
    return [];
  }
}

export function isBookmarked(partId) {
  if (!partId) return false;
  const list = getBookmarks();
  return list.some(item => item.id === partId);
}

export function toggleBookmark(partId, metadata = {}) {
  if (!partId) return false;
  const list = getBookmarks();
  const index = list.findIndex(item => item.id === partId);
  let saved = false;

  if (index >= 0) {
    list.splice(index, 1);
    saved = false;
  } else {
    list.unshift({
      id: partId,
      nameVi: metadata.nameVi || partId,
      nameLatin: metadata.nameLatin || '',
      system: metadata.system || '',
      time: Date.now()
    });
    saved = true;
  }

  try {
    localStorage.setItem(BOOKMARKS_KEY, JSON.stringify(list));
  } catch (err) {
    console.error('Failed to save bookmark:', err);
  }

  return saved;
}

export function getHistory() {
  try {
    const raw = localStorage.getItem(HISTORY_KEY);
    return raw ? JSON.parse(raw) : [];
  } catch {
    return [];
  }
}

export function addToHistory(partId, metadata = {}) {
  if (!partId) return;
  let list = getHistory();
  // Filter out existing to put on top
  list = list.filter(item => item.id !== partId);
  list.unshift({
    id: partId,
    nameVi: metadata.nameVi || partId,
    nameLatin: metadata.nameLatin || '',
    system: metadata.system || '',
    time: Date.now()
  });

  // Keep top 20
  if (list.length > 20) {
    list = list.slice(0, 20);
  }

  try {
    localStorage.setItem(HISTORY_KEY, JSON.stringify(list));
  } catch (err) {
    console.error('Failed to save history:', err);
  }
}

export function clearHistory() {
  try {
    localStorage.removeItem(HISTORY_KEY);
  } catch (_err) {
    // Ignore storage clear error
  }
}
