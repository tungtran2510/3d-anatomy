// IndexedDB Storage Engine for Local Anatomy Videos
// Stores compressed MP4/WebM Blobs, thumbnails, and metadata safely without LocalStorage quota limits.

const DB_NAME = 'AtlasVideoStore_v1';
const DB_VERSION = 1;
const STORE_NAME = 'videos';

let dbPromise = null;
const blobUrlCache = new Map();

function getDB() {
  if (dbPromise) return dbPromise;

  dbPromise = new Promise((resolve, reject) => {
    if (typeof indexedDB === 'undefined') {
      return reject(new Error('IndexedDB is not supported in this browser.'));
    }

    const request = indexedDB.open(DB_NAME, DB_VERSION);

    request.onupgradeneeded = (event) => {
      const db = event.target.result;
      if (!db.objectStoreNames.contains(STORE_NAME)) {
        const store = db.createObjectStore(STORE_NAME, { keyPath: 'id' });
        store.createIndex('partId', 'partId', { unique: false });
        store.createIndex('createdAt', 'createdAt', { unique: false });
      }
    };

    request.onsuccess = () => resolve(request.result);
    request.onerror = (e) => reject(e.target.error);
  });

  return dbPromise;
}

/**
 * Save a video blob with its metadata
 * @param {Object} item - { id, partId, title, blob, mimeType, sizeBytes, originalSize, duration, thumbnail }
 */
export async function saveLocalVideo(item) {
  const db = await getDB();
  const record = {
    id: item.id || `local_vid_${Date.now()}`,
    partId: item.partId || null,
    title: item.title || 'Video Giải Phẫu',
    blob: item.blob,
    mimeType: item.mimeType || item.blob?.type || 'video/mp4',
    sizeBytes: item.blob ? item.blob.size : 0,
    originalSize: item.originalSize || (item.blob ? item.blob.size : 0),
    duration: item.duration || '0:30',
    thumbnail: item.thumbnail || '',
    createdAt: Date.now()
  };

  return new Promise((resolve, reject) => {
    const tx = db.transaction(STORE_NAME, 'readwrite');
    const store = tx.objectStore(STORE_NAME);
    const req = store.put(record);

    req.onsuccess = () => {
      // Clear cached URL if exists so it regenerates
      if (blobUrlCache.has(record.id)) {
        try { URL.revokeObjectURL(blobUrlCache.get(record.id)); } catch {}
        blobUrlCache.delete(record.id);
      }
      resolve(record);
    };
    req.onerror = (e) => reject(e.target.error);
  });
}

/**
 * Retrieve a local video record by ID
 */
export async function getLocalVideo(id) {
  if (!id) return null;
  const db = await getDB();
  return new Promise((resolve, reject) => {
    const tx = db.transaction(STORE_NAME, 'readonly');
    const store = tx.objectStore(STORE_NAME);
    const req = store.get(id);
    req.onsuccess = () => resolve(req.result || null);
    req.onerror = (e) => reject(e.target.error);
  });
}

/**
 * Get a playable Blob URL for a local video
 */
export async function getLocalVideoBlobUrl(id) {
  if (!id) return null;
  if (blobUrlCache.has(id)) {
    return blobUrlCache.get(id);
  }

  const record = await getLocalVideo(id);
  if (!record || !record.blob) return null;

  const url = URL.createObjectURL(record.blob);
  blobUrlCache.set(id, url);
  return url;
}

/**
 * Delete a local video by ID
 */
export async function deleteLocalVideo(id) {
  if (!id) return false;
  const db = await getDB();
  return new Promise((resolve, reject) => {
    const tx = db.transaction(STORE_NAME, 'readwrite');
    const store = tx.objectStore(STORE_NAME);
    const req = store.delete(id);

    req.onsuccess = () => {
      if (blobUrlCache.has(id)) {
        try { URL.revokeObjectURL(blobUrlCache.get(id)); } catch {}
        blobUrlCache.delete(id);
      }
      resolve(true);
    };
    req.onerror = (e) => reject(e.target.error);
  });
}

/**
 * Get all stored local videos
 */
export async function getAllLocalVideos() {
  const db = await getDB();
  return new Promise((resolve, reject) => {
    const tx = db.transaction(STORE_NAME, 'readonly');
    const store = tx.objectStore(STORE_NAME);
    const req = store.getAll();
    req.onsuccess = () => resolve(req.result || []);
    req.onerror = (e) => reject(e.target.error);
  });
}

/**
 * Format bytes into human readable format (MB, KB)
 */
export function formatBytes(bytes, decimals = 1) {
  if (!bytes || bytes === 0) return '0 B';
  const k = 1024;
  const dm = decimals < 0 ? 0 : decimals;
  const sizes = ['B', 'KB', 'MB', 'GB'];
  const i = Math.floor(Math.log(bytes) / Math.log(k));
  return `${parseFloat((bytes / Math.pow(k, i)).toFixed(dm))} ${sizes[i]}`;
}
