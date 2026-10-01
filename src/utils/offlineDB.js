/**
 * IndexedDB Wrapper for Offline Anatomy Atlas
 * Manages: Bookmarks, Clinical Notes, Learning Progress, and Sync Outbox
 */

const DB_NAME = 'AtlasOfflineStore_v1';
const DB_VERSION = 1;

let dbPromise = null;

export function getOfflineDB() {
  if (dbPromise) return dbPromise;

  dbPromise = new Promise((resolve, reject) => {
    const request = indexedDB.open(DB_NAME, DB_VERSION);

    request.onupgradeneeded = (event) => {
      const db = event.target.result;

      // 1. Bookmarks Store (Key: partId)
      if (!db.objectStoreNames.contains('bookmarks')) {
        const store = db.createObjectStore('bookmarks', { keyPath: 'partId' });
        store.createIndex('system', 'system', { unique: false });
        store.createIndex('updatedAt', 'updatedAt', { unique: false });
      }

      // 2. Notes Store (Key: noteId)
      if (!db.objectStoreNames.contains('notes')) {
        const store = db.createObjectStore('notes', { keyPath: 'id', autoIncrement: true });
        store.createIndex('partId', 'partId', { unique: false });
        store.createIndex('updatedAt', 'updatedAt', { unique: false });
        store.createIndex('synced', 'synced', { unique: false });
      }

      // 3. Learning Progress & Quiz History (Key: partId)
      if (!db.objectStoreNames.contains('progress')) {
        const store = db.createObjectStore('progress', { keyPath: 'partId' });
        store.createIndex('masteryScore', 'masteryScore', { unique: false });
        store.createIndex('lastReviewed', 'lastReviewed', { unique: false });
        store.createIndex('synced', 'synced', { unique: false });
      }

      // 4. System Cache Metadata (Key: systemId)
      if (!db.objectStoreNames.contains('systemCacheMeta')) {
        db.createObjectStore('systemCacheMeta', { keyPath: 'systemId' });
      }

      // 5. Transactional Sync Outbox (Key: id)
      if (!db.objectStoreNames.contains('syncOutbox')) {
        const store = db.createObjectStore('syncOutbox', { keyPath: 'id', autoIncrement: true });
        store.createIndex('status', 'status', { unique: false });
        store.createIndex('createdAt', 'createdAt', { unique: false });
      }
    };

    request.onsuccess = () => resolve(request.result);
    request.onerror = (e) => reject(e.target.error);
  });

  return dbPromise;
}

// --- BOOKMARKS ---
export async function saveBookmarkOffline(bookmark) {
  const db = await getOfflineDB();
  return new Promise((resolve, reject) => {
    const tx = db.transaction(['bookmarks', 'syncOutbox'], 'readwrite');
    const bStore = tx.objectStore('bookmarks');
    const oStore = tx.objectStore('syncOutbox');

    const record = {
      ...bookmark,
      updatedAt: Date.now()
    };
    bStore.put(record);

    oStore.add({
      type: 'BOOKMARK_SAVE',
      payload: record,
      status: 'pending',
      createdAt: Date.now()
    });

    tx.oncomplete = () => resolve(record);
    tx.onerror = () => reject(tx.error);
  });
}

export async function getBookmarksOffline() {
  const db = await getOfflineDB();
  return new Promise((resolve, reject) => {
    const tx = db.transaction('bookmarks', 'readonly');
    const store = tx.objectStore('bookmarks');
    const req = store.getAll();
    req.onsuccess = () => resolve(req.result || []);
    req.onerror = () => reject(req.error);
  });
}

export async function deleteBookmarkOffline(partId) {
  const db = await getOfflineDB();
  return new Promise((resolve, reject) => {
    const tx = db.transaction(['bookmarks', 'syncOutbox'], 'readwrite');
    tx.objectStore('bookmarks').delete(partId);
    tx.objectStore('syncOutbox').add({
      type: 'BOOKMARK_DELETE',
      payload: { partId },
      status: 'pending',
      createdAt: Date.now()
    });
    tx.oncomplete = () => resolve(true);
    tx.onerror = () => reject(tx.error);
  });
}

// --- CLINICAL NOTES ---
export async function saveNoteOffline(partId, content, partName = '') {
  const db = await getOfflineDB();
  return new Promise((resolve, reject) => {
    const tx = db.transaction(['notes', 'syncOutbox'], 'readwrite');
    const nStore = tx.objectStore('notes');
    const oStore = tx.objectStore('syncOutbox');

    const note = {
      partId,
      partName,
      content,
      updatedAt: Date.now(),
      synced: 0
    };

    const addReq = nStore.add(note);
    addReq.onsuccess = () => {
      const generatedId = addReq.result;
      note.id = generatedId;
      oStore.add({
        type: 'NOTE_SAVE',
        payload: note,
        status: 'pending',
        createdAt: Date.now()
      });
    };

    tx.oncomplete = () => resolve(note);
    tx.onerror = () => reject(tx.error);
  });
}

export async function getNotesOffline(partId = null) {
  const db = await getOfflineDB();
  return new Promise((resolve, reject) => {
    const tx = db.transaction('notes', 'readonly');
    const store = tx.objectStore('notes');
    let req;
    if (partId) {
      const index = store.index('partId');
      req = index.getAll(partId);
    } else {
      req = store.getAll();
    }
    req.onsuccess = () => resolve(req.result || []);
    req.onerror = () => reject(req.error);
  });
}

// --- LEARNING PROGRESS & QUIZ ---
export async function recordQuizResultOffline(partId, isCorrect, partName = '', system = '') {
  const db = await getOfflineDB();
  return new Promise((resolve, reject) => {
    const tx = db.transaction(['progress', 'syncOutbox'], 'readwrite');
    const pStore = tx.objectStore('progress');
    const oStore = tx.objectStore('syncOutbox');

    const getReq = pStore.get(partId);
    getReq.onsuccess = () => {
      let record = getReq.result || {
        partId,
        partName,
        system,
        totalAttempts: 0,
        correctCount: 0,
        wrongCount: 0,
        masteryScore: 0,
        lastReviewed: Date.now()
      };

      record.totalAttempts += 1;
      if (isCorrect) {
        record.correctCount += 1;
      } else {
        record.wrongCount += 1;
      }
      record.masteryScore = Math.round((record.correctCount / record.totalAttempts) * 100);
      record.lastReviewed = Date.now();
      record.synced = 0;

      pStore.put(record);

      oStore.add({
        type: 'PROGRESS_UPDATE',
        payload: record,
        status: 'pending',
        createdAt: Date.now()
      });
    };

    tx.oncomplete = () => resolve(true);
    tx.onerror = () => reject(tx.error);
  });
}

export async function getProgressSummaryOffline() {
  const db = await getOfflineDB();
  return new Promise((resolve, reject) => {
    const tx = db.transaction('progress', 'readonly');
    const store = tx.objectStore('progress');
    const req = store.getAll();
    req.onsuccess = () => {
      const list = req.result || [];
      const totalStudied = list.length;
      const averageMastery = totalStudied > 0
        ? Math.round(list.reduce((acc, cur) => acc + cur.masteryScore, 0) / totalStudied)
        : 0;
      const weakSpots = list.filter(item => item.masteryScore < 60);

      resolve({
        totalStudied,
        averageMastery,
        weakSpotsCount: weakSpots.length,
        items: list
      });
    };
    req.onerror = () => reject(req.error);
  });
}

// --- SYNC OUTBOX ---
export async function getPendingSyncCount() {
  const db = await getOfflineDB();
  return new Promise((resolve, reject) => {
    const tx = db.transaction('syncOutbox', 'readonly');
    const store = tx.objectStore('syncOutbox');
    const index = store.index('status');
    const req = index.count('pending');
    req.onsuccess = () => resolve(req.result || 0);
    req.onerror = () => reject(req.error);
  });
}

export async function getPendingSyncItems() {
  const db = await getOfflineDB();
  return new Promise((resolve, reject) => {
    const tx = db.transaction('syncOutbox', 'readonly');
    const store = tx.objectStore('syncOutbox');
    const index = store.index('status');
    const req = index.getAll('pending');
    req.onsuccess = () => resolve(req.result || []);
    req.onerror = () => reject(req.error);
  });
}

export async function markSyncItemsCompleted(itemIds) {
  if (!itemIds || itemIds.length === 0) return;
  const db = await getOfflineDB();
  return new Promise((resolve, reject) => {
    const tx = db.transaction('syncOutbox', 'readwrite');
    const store = tx.objectStore('syncOutbox');

    itemIds.forEach(id => {
      const req = store.get(id);
      req.onsuccess = () => {
        if (req.result) {
          const item = req.result;
          item.status = 'synced';
          item.syncedAt = Date.now();
          store.put(item);
        }
      };
    });

    tx.oncomplete = () => resolve(true);
    tx.onerror = () => reject(tx.error);
  });
}
