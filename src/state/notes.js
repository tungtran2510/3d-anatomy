// Personal Study Notes & Annotations on 3D Anatomical Structures
// Persisted in localStorage

const STORAGE_KEY = 'qbiz_anatomy_notes';

function getStore() {
  try {
    const raw = localStorage.getItem(STORAGE_KEY);
    return raw ? JSON.parse(raw) : {};
  } catch (err) {
    console.warn('[notes] Failed to read from localStorage:', err);
    return {};
  }
}

function setStore(data) {
  try {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(data));
    window.dispatchEvent(new CustomEvent('anatomy-notes-updated', { detail: data }));
  } catch (err) {
    console.warn('[notes] Failed to write to localStorage:', err);
  }
}

/**
 * Gets note for a specific anatomical part ID
 */
export function getNote(partId) {
  if (!partId) return '';
  const store = getStore();
  return store[partId]?.text || '';
}

/**
 * Saves note for a specific anatomical part ID
 */
export function saveNote(partId, text, metadata = {}) {
  if (!partId) return;
  const store = getStore();
  const trimmed = (text || '').trim();

  if (!trimmed) {
    delete store[partId];
  } else {
    store[partId] = {
      partId,
      text: trimmed,
      nameVi: metadata.nameVi || partId,
      nameLatin: metadata.nameLatin || '',
      system: metadata.system || 'skeletal',
      updatedAt: new Date().toISOString()
    };
  }

  setStore(store);
  return store[partId];
}

/**
 * Deletes a note
 */
export function deleteNote(partId) {
  if (!partId) return;
  const store = getStore();
  delete store[partId];
  setStore(store);
}

/**
 * Gets all saved study notes
 */
export function getAllNotes() {
  const store = getStore();
  return Object.values(store).sort((a, b) => new Date(b.updatedAt) - new Date(a.updatedAt));
}

/**
 * Checks if a structure has notes
 */
export function hasNote(partId) {
  if (!partId) return false;
  const store = getStore();
  return Boolean(store[partId]?.text);
}
