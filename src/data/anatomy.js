// Anatomy data derived from the Z-Anatomy models.
//
// The GLB files exported from Z-Anatomy carry the anatomical name on every mesh
// (Terminologia Anatomica, English), with a `.l` / `.r` suffix for paired
// structures. Rather than duplicating those ~2800 names in a separate data file
// that would drift out of sync, systems.json only lists which mesh belongs to
// which system, and every label is derived from the mesh name at runtime.

import { asset } from '../utils/paths.js';
import { getVietnameseName } from './vietnamese.js';

const SIDE_SUFFIX = { '.l': 'left', '.r': 'right' };

const SIDE_LABEL = {
  vi: { left: 'trái', right: 'phải' },
  en: { left: 'left', right: 'right' },
  it: { left: 'sinistro', right: 'destro' }
};

export const SYSTEM_IDS = [
  'skeletal',
  'muscular',
  'joints',
  'cardiovascular',
  'lymphatic',
  'nervous',
  'visceral',
  'integumentary'
];

// System loaded on startup. The others are fetched when the user enables them,
// so the initial payload stays around 2 MB instead of ~47 MB.
export const DEFAULT_SYSTEM = 'skeletal';

export function splitSide(meshName) {
  const suffix = meshName.slice(-2);
  const side = SIDE_SUFFIX[suffix];
  return side
    ? { base: meshName.slice(0, -2), side }
    : { base: meshName, side: null };
}

export function formatPartName(meshName, lang = 'vi') {
  const { base, side } = splitSide(meshName);

  // Z-Anatomy wraps structures outside the official terminology in parentheses.
  const clean = base.replace(/^\((.*)\)$/, '$1').trim();

  if (lang === 'vi') {
    const vnName = getVietnameseName(clean);
    if (!side) return vnName;
    const sideVn = side === 'left' ? 'trái' : 'phải';
    return `${vnName} (${sideVn})`;
  }

  if (!side) return clean;

  const label = (SIDE_LABEL[lang] || SIDE_LABEL.en)[side];
  return `${clean} (${label})`;
}

export async function loadSystemsData() {
  const response = await fetch(asset('data/systems.json'));
  if (!response.ok) {
    throw new Error(`systems.json: ${response.status} ${response.statusText}`);
  }
  return response.json();
}

// Latin names and the non-official-terminology flag, extracted from the
// Z-Anatomy source file by tools/export-lexicon.py.
export async function loadLexicon() {
  try {
    const response = await fetch(asset('data/lexicon.json'));
    return response.ok ? await response.json() : {};
  } catch {
    return {};
  }
}

// Definitions are an order of magnitude larger than the rest of the data, so
// they are fetched once in the background rather than blocking the first frame.
let definitionsPromise = null;

export function loadDefinitions() {
  if (!definitionsPromise) {
    definitionsPromise = fetch(asset('data/definitions.json'))
      .then(response => (response.ok ? response.json() : {}))
      .catch(() => ({}));
  }
  return definitionsPromise;
}

// Builds the part dictionary the store expects, keyed by mesh name because that
// is what loadModel.js registers as partId.
export function buildPartsData(systemsData, lexicon = {}) {
  const parts = {};

  Object.entries(systemsData).forEach(([systemId, meshNames]) => {
    meshNames.forEach(meshName => {
      const { base, side } = splitSide(meshName);
      const entry = lexicon[base] || {};

      parts[meshName] = {
        id: meshName,
        meshName,
        name: {
          vi: formatPartName(meshName, 'vi'),
          en: formatPartName(meshName, 'en'),
          it: formatPartName(meshName, 'it')
        },
        baseName: base,
        side,
        system: systemId,
        latinName: entry.la || '',
        // Z-Anatomy parenthesises names that are not in Terminologia Anatomica.
        official: entry.official !== false
      };
    });
  });

  return parts;
}
