import { getClinicalData } from '../data/clinicalInfo.js';
import { getStructureInfo } from '../state/store.js';

let cachedVoices = [];

function refreshVoices() {
  if (typeof window !== 'undefined' && 'speechSynthesis' in window) {
    try {
      cachedVoices = window.speechSynthesis.getVoices() || [];
    } catch {
      cachedVoices = [];
    }
  }
}

if (typeof window !== 'undefined' && 'speechSynthesis' in window) {
  refreshVoices();
  if (window.speechSynthesis.onvoiceschanged !== undefined) {
    window.speechSynthesis.onvoiceschanged = () => {
      refreshVoices();
    };
  }

  // Intercept speak calls if muted
  try {
    const origSpeak = window.speechSynthesis.speak.bind(window.speechSynthesis);
    window.speechSynthesis.speak = function(utterance) {
      if (window.__aiVoiceMuted) {
        return;
      }
      return origSpeak(utterance);
    };
  } catch {}
}

/**
 * Returns the best matching Vietnamese voice if available
 */
export function getVietnameseVoice() {
  if (typeof window === 'undefined' || !('speechSynthesis' in window)) return null;
  if (!cachedVoices.length) refreshVoices();
  
  // Prefer exact vi-VN, then vi_VN, then any language starting with 'vi' or containing 'VIE'
  const exact = cachedVoices.find(v => v.lang === 'vi-VN' || v.lang === 'vi_VN');
  if (exact) return exact;

  const starts = cachedVoices.find(v => v.lang && (v.lang.toLowerCase().startsWith('vi') || v.lang.toUpperCase().includes('VIE')));
  if (starts) return starts;

  return null;
}

/**
 * Checks if AI speech reading is globally muted
 */
export function isVoiceMuted() {
  return typeof window !== 'undefined' && !!window.__aiVoiceMuted;
}

/**
 * Sets global mute state for AI voice reading
 */
export function setVoiceMuted(muted) {
  if (typeof window === 'undefined') return;
  window.__aiVoiceMuted = !!muted;
  if (muted && 'speechSynthesis' in window) {
    try {
      window.speechSynthesis.cancel();
    } catch {}
  }
}

/**
 * Immediately cancels all currently active AI speech synthesis
 */
export function stopAllSpeech() {
  if (typeof window !== 'undefined' && 'speechSynthesis' in window) {
    try {
      window.speechSynthesis.cancel();
    } catch {}
  }
}

/**
 * Speaks given Vietnamese text with high quality voice and natural cadence
 */
export function speakVietnamese(text, options = {}) {
  if (typeof window === 'undefined' || !('speechSynthesis' in window) || !text) return null;
  if (isVoiceMuted()) return null;

  try {
    window.speechSynthesis.cancel();
  } catch {}

  const clean = text.replace(/\s*\([^)]*\)/g, ' ').replace(/\s+/g, ' ').trim();
  if (!clean) return null;

  const utterance = new SpeechSynthesisUtterance(clean);
  utterance.lang = 'vi-VN';
  utterance.rate = options.rate || 0.95;
  utterance.pitch = options.pitch || 1.0;

  const viVoice = getVietnameseVoice();
  if (viVoice) utterance.voice = viVoice;

  if (options.onEnd) utterance.onend = options.onEnd;
  if (options.onError) utterance.onerror = options.onError;

  window.speechSynthesis.speak(utterance);
  return utterance;
}

/**
 * Returns a concise, zero-fluff 15-second Vietnamese functional summary of any anatomical structure.
 * Strips all greeting phrases and filler, going directly to [Name] + [Core Function].
 */
export function getStructure15sSpeechText(partId, baseName = null) {
  if (!partId) return '';
  const clinical = getClinicalData(partId, baseName);
  const info = getStructureInfo(partId) || (baseName ? getStructureInfo(baseName) : null);
  const rawName = clinical?.nameVi || info?.name?.vi || info?.name?.en || partId;
  const cleanName = (rawName || '').replace(/\s*\([^)]*\)/g, ' ').replace(/\s+/g, ' ').trim() || rawName;

  let funcText = clinical?.function || clinical?.description || '';
  // If child part function is very short, supplement with parent base clinical function
  if (funcText.length < 45 && baseName && baseName !== partId) {
    const parentClinical = getClinicalData(baseName);
    if (parentClinical?.function) {
      funcText = parentClinical.function;
    }
  }

  // Clean parenthetical text, quotes, and markdown
  funcText = funcText.replace(/\s*\([^)]*\)/g, ' ').replace(/[*_`"']/g, ' ').replace(/\s+/g, ' ').trim();
  // Strictly strip any possible greeting fluff
  funcText = funcText.replace(/^(chào bạn|xin chào|tôi là[^.]+?\.|rất vui[^.]+?\.)\s*/gi, '');

  // Extract first 1-2 core sentences (~15 seconds reading)
  const sentences = funcText.split(/(?<=[.!?])\s+/).filter(Boolean);
  const coreSummary = sentences.slice(0, 2).join(' ') || funcText;

  if (coreSummary) {
    return `${cleanName}. ${coreSummary}`;
  }
  return cleanName;
}

/**
 * Speaks the accurate Vietnamese name and 15-second core function summary without greetings.
 */
export function speakStructure15sSummary(partId, baseName = null, options = {}) {
  const text = getStructure15sSpeechText(partId, baseName);
  if (!text) return null;
  return speakVietnamese(text, options);
}

