// Neuromuscular Innervation & Clinical Reflex Interactive HUD Controller
// Visible Body & Stanford 3D Atlas Standard
// Provides interactive clinical pearl cards, reflex examination guides, motor deficit signs,
// and natural 15-second AI doctor voice explanations.

import { state } from '../state/store.js';
import { showToast } from './sidebar.js';
import { highlightMesh, clearGhost } from '../viewer/visibility.js';
import { getVietnameseVoice } from '../utils/speechVoice.js';

let hudElement = null;
let isSpeaking = false;
let currentUtterance = null;
let currentCard = null;

export function initNeuromuscularHUD(viewer) {
  if (hudElement) return;

  const container = document.getElementById('viewerContainer');
  if (!container) return;

  hudElement = document.createElement('div');
  hudElement.id = 'neuromuscularHUD';
  hudElement.className = 'neuromuscular-hud hidden';
  hudElement.innerHTML = `
    <div class="hud-glass-card">
      <div class="hud-header">
        <div class="hud-tag">
          <span class="hud-pulse-dot"></span>
          <span class="hud-tag-text" id="hudTagText">THẦN KINH CHI PHỐI CƠ</span>
        </div>
        <div class="hud-header-actions">
          <button type="button" class="hud-btn-toggle" id="btnToggleHudExpand" title="Thu gọn/Mở rộng">
            <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5"><polyline points="6 9 12 15 18 9"/></svg>
          </button>
          <button type="button" class="hud-btn-close" id="btnCloseHud" title="Đóng">✕</button>
        </div>
      </div>

      <div class="hud-body" id="hudBody">
        <h4 class="hud-title" id="hudTitle">Dây Thần Kinh</h4>
        <div class="hud-subtitle" id="hudSubtitle">Đám rối thần kinh & cơ chi phối</div>

        <div class="hud-grid">
          <div class="hud-col">
            <div class="hud-field-label">
              <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="#38bdf8" stroke-width="2.5"><circle cx="12" cy="12" r="10"/><polyline points="12 6 12 12 16 14"/></svg>
              CƠ CHI PHỐI ĐÍCH
            </div>
            <div class="hud-field-val" id="hudMuscles">...</div>
          </div>

          <div class="hud-col">
            <div class="hud-field-label">
              <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="#f59e0b" stroke-width="2.5"><polygon points="12 2 15.09 8.26 22 9.27 17 14.14 18.18 21.02 12 17.77 5.82 21.02 7 14.14 2 9.27 8.91 8.26 12 2"/></svg>
              KHÁM PHẢN XẠ XƯƠNG CƠ
            </div>
            <div class="hud-field-val" id="hudReflex">...</div>
          </div>
        </div>

        <div class="hud-sign-box">
          <div class="hud-sign-label">
            <span class="hud-sign-badge">DẤU HIỆU LÂM SÀNG</span>
            <span id="hudSignBadgeText">Tổn thương vận động</span>
          </div>
          <div class="hud-sign-desc" id="hudClinicalSign">...</div>
        </div>

        <div class="hud-actions-row">
          <button type="button" class="hud-action-btn hud-btn-audio" id="btnHudVoiceSummary">
            <span class="hud-audio-icon">
              <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><polygon points="11 5 6 9 2 9 2 15 6 15 11 19 11 5"/><path d="M19.07 4.93a10 10 0 0 1 0 14.14M15.54 8.46a5 5 0 0 1 0 7.07"/></svg>
            </span>
            <span id="btnHudVoiceText">Nghe Giải Thích (15s Voice)</span>
            <span class="hud-audio-wave hidden" id="hudAudioWave">
              <span class="hud-wave-bar"></span><span class="hud-wave-bar"></span><span class="hud-wave-bar"></span>
            </span>
          </button>

          <button type="button" class="hud-action-btn hud-btn-highlight" id="btnHudHighlightTarget" title="Nổi bật dây thần kinh đích">
            <svg width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5"><circle cx="11" cy="11" r="8"/><line x1="21" y1="21" x2="16.65" y2="16.65"/></svg>
            <span>Tập Trung Dây TK</span>
          </button>
        </div>
      </div>
    </div>
  `;

  container.appendChild(hudElement);

  // Event handlers
  const closeBtn = hudElement.querySelector('#btnCloseHud');
  closeBtn?.addEventListener('click', (e) => {
    e.stopPropagation();
    hideNeuromuscularHUD();
  });

  const toggleBtn = hudElement.querySelector('#btnToggleHudExpand');
  toggleBtn?.addEventListener('click', (e) => {
    e.stopPropagation();
    const body = hudElement.querySelector('#hudBody');
    if (body) {
      const isCollapsed = body.classList.toggle('collapsed');
      toggleBtn.innerHTML = isCollapsed ?
        `<svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5"><polyline points="18 15 12 9 6 15"/></svg>` :
        `<svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5"><polyline points="6 9 12 15 18 9"/></svg>`;
    }
  });

  const voiceBtn = hudElement.querySelector('#btnHudVoiceSummary');
  voiceBtn?.addEventListener('click', (e) => {
    e.stopPropagation();
    toggleVoiceSummary();
  });

  const highlightBtn = hudElement.querySelector('#btnHudHighlightTarget');
  highlightBtn?.addEventListener('click', (e) => {
    e.stopPropagation();
    if (currentCard?.highlight) {
      highlightMesh(currentCard.highlight, 0xfacc15, 0.95);
      showToast(`🎯 Nổi bật thần kinh: ${currentCard.highlight}`);
    }
  });
}

export function showNeuromuscularHUD(card, viewer) {
  if (!card) return;
  if (!hudElement) initNeuromuscularHUD(viewer);
  if (!hudElement) return;

  const info = card.innervationInfo;
  if (!info && !card.id.startsWith('nerv_inerv_')) {
    hideNeuromuscularHUD();
    return;
  }

  currentCard = card;

  // Populate data
  const titleEl = hudElement.querySelector('#hudTitle');
  const subtitleEl = hudElement.querySelector('#hudSubtitle');
  const musclesEl = hudElement.querySelector('#hudMuscles');
  const reflexEl = hudElement.querySelector('#hudReflex');
  const signEl = hudElement.querySelector('#hudClinicalSign');
  const tagEl = hudElement.querySelector('#hudTagText');
  const badgeTextEl = hudElement.querySelector('#hudSignBadgeText');

  if (titleEl) titleEl.textContent = info?.nerve || card.titleVi || card.title;
  if (subtitleEl) subtitleEl.textContent = card.subtitle || 'Giải phẫu chi phối thần kinh cơ';
  if (musclesEl) musclesEl.textContent = info?.muscles || card.desc || 'Đang cập nhật...';
  if (reflexEl) reflexEl.textContent = info?.reflex || 'Khám phản xạ thần kinh tương ứng';
  if (signEl) signEl.textContent = info?.clinicalSign || card.desc || '';
  if (tagEl) tagEl.textContent = card.badge ? card.badge.toUpperCase() : 'THẦN KINH CHI PHỐI CƠ';
  if (badgeTextEl) badgeTextEl.textContent = 'DẤU HIỆU LÂM SÀNG KINH ĐIỂN';

  // Make sure body is uncollapsed
  const body = hudElement.querySelector('#hudBody');
  body?.classList.remove('collapsed');

  // Stop any active speech
  stopSpeech();

  // Show HUD with smooth fade-in
  hudElement.classList.remove('hidden');
}

export function hideNeuromuscularHUD() {
  stopSpeech();
  if (hudElement) {
    hudElement.classList.add('hidden');
  }
}

function toggleVoiceSummary() {
  if (isSpeaking) {
    stopSpeech();
    return;
  }

  if (!window.speechSynthesis) {
    showToast('Trình duyệt không hỗ trợ tổng hợp giọng nói Web Speech.');
    return;
  }

  const script = currentCard?.innervationInfo?.audioScript || currentCard?.desc || currentCard?.titleVi;
  if (!script) return;

  window.speechSynthesis.cancel();

  const utterance = new SpeechSynthesisUtterance(script);
  utterance.lang = 'vi-VN';
  utterance.rate = 1.0;
  utterance.pitch = 1.05;

  const viVoice = getVietnameseVoice();
  if (viVoice) utterance.voice = viVoice;

  utterance.onstart = () => {
    isSpeaking = true;
    updateVoiceUI(true);
  };

  utterance.onend = () => {
    isSpeaking = false;
    updateVoiceUI(false);
  };

  utterance.onerror = () => {
    isSpeaking = false;
    updateVoiceUI(false);
  };

  currentUtterance = utterance;
  window.speechSynthesis.speak(utterance);
}

function stopSpeech() {
  if (window.speechSynthesis) {
    window.speechSynthesis.cancel();
  }
  isSpeaking = false;
  updateVoiceUI(false);
}

function updateVoiceUI(speaking) {
  const btnText = hudElement?.querySelector('#btnHudVoiceText');
  const wave = hudElement?.querySelector('#hudAudioWave');
  const voiceBtn = hudElement?.querySelector('#btnHudVoiceSummary');

  if (speaking) {
    if (btnText) btnText.textContent = 'Đang giải thích (Chạm để dừng)...';
    wave?.classList.remove('hidden');
    voiceBtn?.classList.add('active-speaking');
  } else {
    if (btnText) btnText.textContent = 'Nghe Giải Thích (15s Voice)';
    wave?.classList.add('hidden');
    voiceBtn?.classList.remove('active-speaking');
  }
}
