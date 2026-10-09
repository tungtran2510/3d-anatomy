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
