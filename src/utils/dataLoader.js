// Data loading from JSON files
import { state, setTranslations, setSearchIndex, notify } from '../state/store.js';
import { asset } from './paths.js';
import { getVietnameseSynonyms } from '../data/vietnamese.js';

// Parts and systems are set up in main.js from systems.json (see data/anatomy.js);
// this only loads the UI translations and refreshes the search index.
export async function loadAllData() {
  try {
    // Load translations (VI, EN, IT)
    const [viResponse, enResponse, itResponse] = await Promise.all([
      fetch(asset('data/translations/vi.json')).catch(() => ({ ok: false })),
      fetch(asset('data/translations/en.json')).catch(() => ({ ok: false })),
      fetch(asset('data/translations/it.json')).catch(() => ({ ok: false }))
    ]);

    const vi = viResponse.ok ? await viResponse.json() : {};
    const en = enResponse.ok ? await enResponse.json() : {};
    const it = itResponse.ok ? await itResponse.json() : {};
    setTranslations({ vi, en, it });

    // Italian & Vietnamese names for structures
    await loadSynonyms();
    buildSearchIndex();

    notify('dataLoaded', true);
  } catch (error) {
    console.error('Error loading data:', error);
    notify('dataError', error);
  }
}

// "femore" must find "Femur", "xuong dui" must find "Xương đùi"
export function normalise(text) {
  if (!text) return '';
  return text
    .normalize('NFD')
    .replace(/[\u0300-\u036f]/g, '')
    .replace(/[đĐ]/g, 'd')
    .toLowerCase()
    .trim();
}

let synonyms = {};
let synonymsByFirstWord = new Map();

export async function loadSynonyms() {
  try {
    const response = await fetch(asset('data/synonyms.it.json'));
    if (response.ok) synonyms = await response.json();
  } catch {
    // Search still works without them, just not in Italian.
    synonyms = {};
  }

  // Z-Anatomy names a muscle "Gluteus maximus muscle" and splits others into
  // parts ("Acromial part of deltoid muscle"), so an Italian term is attached
  // to every structure whose name contains it, not only to an exact match.
  // Bucketing by first word keeps that from being 1644 x 204 comparisons.
  synonymsByFirstWord = new Map();
  Object.keys(synonyms).forEach(key => {
    const first = key.split(' ')[0];
    if (!synonymsByFirstWord.has(first)) synonymsByFirstWord.set(first, []);
    synonymsByFirstWord.get(first).push(key);
  });
}

function italianTermsFor(normalisedBase) {
  const words = normalisedBase.split(/[^a-z0-9+]+/).filter(Boolean);
  const found = [];

  for (const word of new Set(words)) {
    const candidates = synonymsByFirstWord.get(word);
    if (!candidates) continue;

    for (const key of candidates) {
      if (normalisedBase === key || normalisedBase.includes(key)) {
        found.push(...synonyms[key]);
      }
    }
  }

  return [...new Set(found)];
}

export function cleanSearchLabel(text) {
  if (!text) return '';
  let str = text.trim();
  // 1. Remove side indicator in parentheses: (trái), (phải), (trai), (phai)
  str = str.replace(/\s*\((trái|phải|trai|phai)\)/gi, '').trim();
  // 2. Remove bulky aliases in parentheses (e.g. (Cơ dựng gai sống), (Cơ cổ vai gáy), (Phần lên), (Phần ngang), (cơ 6 múi), (Cơ lưng sâu))
  // Keeps concise structural notations like (C1), (L4-L5), (Atlas)
  str = str.replace(/\s*\((?:Cơ\s+|Phần\s+|cơ\s+|nhánh\s+|vai\s*-\s*gáy|[^)]{6,})\)/gi, '').trim();
  return str;
}

// One row per anatomical structure, not per mesh: a paired structure appears
// once with both sides attached, instead of filling the list with duplicates.
function buildSearchIndex() {
  if (!state.partsData) return;

  const rows = new Map();

  Object.entries(state.partsData).forEach(([partId, info]) => {
    const base = info.baseName || partId;
    const system = info.system || 'unknown';
    const key = `${base}|${system}`;

    let row = rows.get(key);
    if (!row) {
      const rawVi = info.name?.vi || '';
      const viName = cleanSearchLabel(rawVi) || rawVi;
      const viSyns = getVietnameseSynonyms(base);
      const latin = info.latinName || '';
      const italian = italianTermsFor(normalise(base));

      const terms = [
        normalise(base),
        normalise(rawVi),
        normalise(viName),
        normalise(latin),
        ...viSyns.map(normalise),
        ...italian.map(normalise)
      ].filter(Boolean);

      row = {
        key,
        base,
        label: viName || base.replace(/^\((.*)\)$/, '$1'),
        rawLabel: rawVi,
        latin,
        system,
        sides: {},
        partIds: [],
        italian,
        terms: [...new Set(terms)]
      };
      rows.set(key, row);
    }

    row.partIds.push(partId);
    row.sides[info.side || 'none'] = partId;
  });

  setSearchIndex([...rows.values()]);
}

function scoreRow(row, query, tokens, rawQuery = '') {
  let best = 0;
  const rawLower = rawQuery ? rawQuery.toLowerCase().trim() : '';

  const label = row.label || row.name || row.partId || '';
  const labelLen = label.length;

  // 1. Direct Exact & Accented Vietnamese matches (Ưu tiên tuyệt đối từ chuẩn y khoa)
  if (rawLower && label) {
    const labelLower = label.toLowerCase();
    if (labelLower === rawLower) best = 150;
    else if (labelLower.startsWith(rawLower)) best = 120;
    else if (labelLower.split(/[\s(),.-]+/).some(word => word === rawLower)) best = 110;
    else if (labelLower.includes(rawLower)) best = 95;
  }

  for (const term of (row.terms || [])) {
    if (term === query) best = Math.max(best, 100);
    else if (term.startsWith(query)) best = Math.max(best, 80);
    else if (term.split(/[\s(),.-]+/).some(word => word.startsWith(query))) best = Math.max(best, 60);
    else if (term.includes(query)) best = Math.max(best, 40);
  }

  if (!best && tokens.length > 1) {
    // Every token has to appear somewhere for a multi-word query to count.
    const all = (row.terms || []).join(' ');
    if (tokens.every(token => all.includes(token))) best = 35;
  }

  if (!best) return 0;

  // Prefer what the user can already see over a system still to be downloaded.
  if (state.loadedSystems.includes(row.system)) best += 15;

  // A short name that matches is a better answer than a long one that merely
  // contains the query.
  best -= Math.min(labelLen / 12, 6);

  return best;
}

export function searchStructures(query, limit = 30) {
  if (!state.searchIndex || !query) return [];

  const normalised = normalise(query);
  if (normalised.length < 2) return [];

  const tokens = normalised.split(/\s+/).filter(Boolean);
  const scored = [];

  for (const row of state.searchIndex) {
    const score = scoreRow(row, normalised, tokens, query);
    if (score > 0) scored.push({ row, score });
  }

  scored.sort((a, b) => {
    const lenA = (a.row.label || a.row.name || '').length;
    const lenB = (b.row.label || b.row.name || '').length;
    return b.score - a.score || lenA - lenB;
  });

  return scored.slice(0, limit).map(entry => {
    const r = entry.row;
    if (!r.base) r.base = r.partId;
    if (!r.label) r.label = r.name || r.partId;
    return r;
  });
}