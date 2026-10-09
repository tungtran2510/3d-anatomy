/**
 * Vietnamese Web Speech API Voice Preloader & Normalizer
 * Resolves asynchronous voice list population race conditions in WebKit/Blink.
 */
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
