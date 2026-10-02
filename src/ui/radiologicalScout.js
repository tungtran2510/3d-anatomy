// Radiological CT/MRI Scout Inset Box Controller
// Inspired by Visible Body Image 3: Inset radiological scan at bottom left showing cutting plane position
import { showToast } from './sidebar.js';

let scoutBoxEl = null;
let currentCard = null;
let currentPlane = 'axial';
let currentOffset = 1.62;

export function initRadiologicalScout(viewer) {
  if (scoutBoxEl) return;

  const container = document.getElementById('viewerContainer');
  if (!container) return;

  scoutBoxEl = document.getElementById('radiologicalScoutBox');
  if (!scoutBoxEl) {
    scoutBoxEl = document.createElement('div');
    scoutBoxEl.className = 'radiological-scout-box hidden';
    scoutBoxEl.id = 'radiologicalScoutBox';
    scoutBoxEl.title = 'áº¢nh Cháº©n ÄoÃ¡n HÃ¬nh áº¢nh (CT / MRI) Äá»‘i Chiáº¿u (Cháº¡m Ä‘á»ƒ xem chi tiáº¿t)';
    scoutBoxEl.innerHTML = `
      <div class="scout-preview-frame">
        <div class="scout-badge" id="scoutBadgeLabel">CT Scout</div>
        <div class="scout-img-wrapper">
          <canvas id="scoutCanvas" width="90" height="90"></canvas>
        </div>
        <div class="scout-level-pill" id="scoutLevelText">Axial CT</div>
      </div>
    `;
    container.appendChild(scoutBoxEl);
  }

  scoutBoxEl.addEventListener('click', (e) => {
    e.stopPropagation();
    openScoutDetailModal();
  });
}

export function showScoutView(card, plane = 'axial', offset = 1.0) {
  currentCard = card;
  currentPlane = plane || card?.plane || 'axial';
  currentOffset = offset !== undefined ? offset : (card?.offset || 1.0);

  if (!scoutBoxEl) return;
  scoutBoxEl.classList.remove('hidden');

  const badge = scoutBoxEl.querySelector('#scoutBadgeLabel');
  const levelText = scoutBoxEl.querySelector('#scoutLevelText');

  if (badge) {
    badge.textContent = currentPlane === 'axial' ? 'CT Scout' : currentPlane === 'coronal' ? 'Coronal MRI' : 'Sagittal MRI';
  }

  if (levelText) {
    levelText.textContent = card?.scoutLabel || `${currentPlane.toUpperCase()} ${(currentOffset * 100).toFixed(0)}cm`;
  }

  drawScoutGraphic();
}

export function hideScoutView() {
  if (scoutBoxEl) {
    scoutBoxEl.classList.add('hidden');
  }
}

function drawScoutGraphic() {
  const canvas = document.getElementById('scoutCanvas');
  if (!canvas) return;
  const ctx = canvas.getContext('2d');
  const w = canvas.width;
  const h = canvas.height;

  ctx.clearRect(0, 0, w, h);

  // Background medical dark
  ctx.fillStyle = '#050b14';
  ctx.fillRect(0, 0, w, h);

  // Draw realistic radiological scan silhouette
  ctx.save();
  ctx.translate(w / 2, h / 2);

  if (currentPlane === 'axial') {
    // Head / Torso axial cross section (oval with bone cortex & internal soft tissue)
    const radX = w * 0.38;
    const radY = h * 0.32;

    // Soft tissue interior
    const grad = ctx.createRadialGradient(0, 0, 5, 0, 0, radX);
    grad.addColorStop(0, '#1e293b');
    grad.addColorStop(0.6, '#334155');
    grad.addColorStop(1, '#0f172a');
    ctx.fillStyle = grad;
    ctx.beginPath();
    ctx.ellipse(0, 0, radX, radY, 0, 0, Math.PI * 2);
    ctx.fill();

    // High attenuation cortical bone ring (bright white)
    ctx.strokeStyle = '#e2e8f0';
    ctx.lineWidth = 3.5;
    ctx.stroke();

    // Vertebra / Basilar bone marker posterior
    ctx.fillStyle = '#f8fafc';
    ctx.beginPath();
    ctx.arc(0, radY * 0.55, 6, 0, Math.PI * 2);
    ctx.fill();

    // Laser cutting line (horizontal cyan slice indicator)
    ctx.strokeStyle = '#06b6d4';
    ctx.lineWidth = 2;
    ctx.setLineDash([4, 2]);
    ctx.beginPath();
    ctx.moveTo(-radX - 8, 0);
    ctx.lineTo(radX + 8, 0);
    ctx.stroke();
    ctx.setLineDash([]);
  } else if (currentPlane === 'sagittal') {
    // Sagittal profile silhouette
    ctx.fillStyle = '#1e293b';
    ctx.beginPath();
    ctx.arc(0, -6, 28, 0, Math.PI * 2);
    ctx.fill();

    // High attenuation cranium
    ctx.strokeStyle = '#cbd5e1';
    ctx.lineWidth = 3;
    ctx.stroke();

    // Vertical slice indicator
    ctx.strokeStyle = '#06b6d4';
    ctx.lineWidth = 2;
    ctx.setLineDash([4, 2]);
    ctx.beginPath();
    ctx.moveTo(0, -h / 2 + 6);
    ctx.lineTo(0, h / 2 - 6);
    ctx.stroke();
    ctx.setLineDash([]);
  } else {
    // Coronal view
    ctx.fillStyle = '#1e293b';
    ctx.beginPath();
    ctx.ellipse(0, 0, 26, 32, 0, 0, Math.PI * 2);
    ctx.fill();

    ctx.strokeStyle = '#cbd5e1';
    ctx.lineWidth = 3;
    ctx.stroke();

    // Coronal slice indicator
    ctx.strokeStyle = '#06b6d4';
    ctx.lineWidth = 2;
    ctx.setLineDash([4, 2]);
    ctx.beginPath();
    ctx.moveTo(-w / 2 + 8, 0);
    ctx.lineTo(w / 2 - 8, 0);
    ctx.stroke();
    ctx.setLineDash([]);
  }

  ctx.restore();
}

function openScoutDetailModal() {
  const existing = document.getElementById('scoutDetailModal');
  if (existing) existing.remove();

  const title = currentCard?.title || 'LÃ¡t Cáº¯t Cháº©n ÄoÃ¡n HÃ¬nh áº¢nh (CT / MRI)';
  const subtitle = currentCard?.subtitle || 'Äá»‘i chiáº¿u giáº£i pháº«u 3D vÃ  phim cáº¯t lá»›p vi tÃ­nh y khoa';
  const scoutLabel = currentCard?.scoutLabel || `${currentPlane.toUpperCase()} ${(currentOffset * 100).toFixed(1)} cm`;

  const modal = document.createElement('div');
  modal.id = 'scoutDetailModal';
  modal.className = 'atlas-hub-modal';
  modal.innerHTML = `
    <div class="atlas-hub-backdrop" id="scoutModalBackdrop"></div>
    <div class="study-dialog" style="max-width: 480px; padding: 22px;">
      <div class="study-dialog-header">
        <div style="display:flex;align-items:center;gap:10px;">
          <span style="font-size:22px;">ðŸ©»</span>
          <div>
            <h3 style="margin:0;font-size:16.5px;font-weight:700;color:#0f172a;">${title}</h3>
            <span style="font-size:13px;color:#0d9488;font-weight:600;">Máº·t pháº³ng: ${scoutLabel}</span>
          </div>
        </div>
        <button type="button" class="dialog-close-btn" id="scoutModalClose">&times;</button>
      </div>

      <div style="margin-top:16px;text-align:center;">
        <div style="background:#020617;padding:16px;border-radius:12px;border:1px solid #1e293b;display:inline-block;width:100%;box-sizing:border-box;">
          <img src="${currentCard?.image || '/images/atlas/nerv_brain.png'}" alt="Scout Detail" style="max-height:180px;object-fit:contain;filter:contrast(1.15) brightness(0.95);" />
          <div style="margin-top:8px;font-family:monospace;font-size:11.5px;color:#38bdf8;letter-spacing:1px;">
            LEVEL: ${(currentOffset * 100).toFixed(1)} cm | PLANE: ${currentPlane.toUpperCase()} | P-THICKNESS: 1.0mm
          </div>
        </div>
      </div>

      <div style="margin-top:14px;background:#f8fafc;padding:12px 14px;border-radius:10px;border:1px solid #e2e8f0;font-size:13px;color:#334155;line-height:1.55;">
        <p style="margin:0 0 6px;"><strong>Ã nghÄ©a Ä‘á»‘i chiáº¿u lÃ¢m sÃ ng:</strong></p>
        <p style="margin:0;">${currentCard?.desc || 'Máº·t pháº³ng cáº¯t lá»›p giÃºp bÃ¡c sÄ© vÃ  sinh viÃªn y khoa Ä‘á»‘i chiáº¿u cáº¥u trÃºc mÃ´ há»c 3D vá»›i hÃ¬nh áº£nh lÃ¡t cáº¯t trÃªn phim CT / MRI thá»±c táº¿ trong cháº©n Ä‘oÃ¡n.'}</p>
      </div>

      <div style="margin-top:16px;display:flex;justify-content:flex-end;">
        <button type="button" class="btn-isolate-action primary" id="scoutModalDone" style="padding:8px 18px;border-radius:8px;">
          ÄÃ£ hiá»ƒu & Tiáº¿p tá»¥c xem 3D
        </button>
      </div>
    </div>
  `;

  document.body.appendChild(modal);

  const close = () => modal.remove();
  modal.querySelector('#scoutModalClose')?.addEventListener('click', close);
  modal.querySelector('#scoutModalBackdrop')?.addEventListener('click', close);
  modal.querySelector('#scoutModalDone')?.addEventListener('click', close);
}
