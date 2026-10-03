// Guided 3D Anatomical Study Mode
// Curated high-yield modules with 4-way anatomical relations and auto-focus
import { selectPartById, deselectPart } from '../viewer/selection.js';
import { getClinicalData } from '../data/clinicalInfo.js';
import { openLesson, openVideo } from './sidebar.js';
import { startQuiz } from './quiz.js';

export const STUDY_MODULES = [
  {
    id: 'spine',
    title: 'Cột Sống & Đĩa Đệm',
    focus: 'Đốt sống C1-L5 • Thoát vị đĩa đệm • Xương cùng',
    color: '#1e3a8a',
    bgGradient: 'linear-gradient(135deg, rgba(30, 58, 138, 0.16) 0%, rgba(59, 130, 246, 0.06) 100%)',
    iconSvg: `<svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M12 2v20"/><rect x="9" y="3.5" width="6" height="3" rx="1.5"/><rect x="8" y="8.5" width="8" height="3" rx="1.5"/><rect x="7" y="13.5" width="10" height="3.5" rx="1.5"/><path d="M10 20.5l2 1.5 2-1.5"/></svg>`,
    items: ['Atlas', 'Axis', 'Lumbar vertebra', 'Sacrum', 'Coccyx']
  },
  {
    id: 'lower_limb',
    title: 'Chi Dưới & Khớp Gối',
    focus: 'Khớp háng • Khớp gối • Dây chằng chéo',
    color: '#059669',
    bgGradient: 'linear-gradient(135deg, rgba(5, 150, 105, 0.16) 0%, rgba(52, 211, 153, 0.06) 100%)',
    iconSvg: `<svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><circle cx="12" cy="12" r="3.5"/><path d="M12 2v6.5"/><path d="M12 15.5V22"/><path d="M7 6c2 1.5 4 1.5 5 0"/><path d="M7 18c2-1.5 4-1.5 5 0"/><path d="M16 21l3-1"/></svg>`,
    items: ['Hip bone.l', 'Femur.l', 'Patella.l', 'Tibia.l', 'Fibula.l', 'Calcaneus.l']
  },
  {
    id: 'upper_limb',
    title: 'Chi Trên & Đai Vai',
    focus: 'Đai vai • Khớp khuỷu • Vận động bàn tay',
    color: '#d97706',
    bgGradient: 'linear-gradient(135deg, rgba(217, 119, 6, 0.16) 0%, rgba(251, 191, 36, 0.06) 100%)',
    iconSvg: `<svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><circle cx="7" cy="6" r="3"/><path d="M9.5 8.5L14 13l4 8"/><circle cx="14" cy="13" r="2.5"/><path d="M18 21l3-2"/></svg>`,
    items: ['Clavicle.l', 'Scapula.l', 'Humerus.l', 'Radius.l', 'Ulna.l']
  },
  {
    id: 'thorax',
    title: 'Lồng Ngực & Hô Hấp',
    focus: 'Khung sườn • Xương ức • Cơ hoành sinh lý',
    color: '#e11d48',
    bgGradient: 'linear-gradient(135deg, rgba(225, 29, 72, 0.16) 0%, rgba(251, 113, 133, 0.06) 100%)',
    iconSvg: `<svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M12 3v18"/><path d="M12 6c-3.5 0-7 1.5-8 4.5 1 3 4.5 4.5 8 4.5"/><path d="M12 6c3.5 0 7 1.5 8 4.5-1 3-4.5 4.5-8 4.5"/><path d="M12 11c-2.5 0-5 1-6 3 1 2 3.5 3 6 3"/><path d="M12 11c2.5 0 5 1 6 3-1 2-3.5 3-6 3"/></svg>`,
    items: ['Body of sternum', 'First rib.l']
  },
  {
    id: 'cranium',
    title: 'Hộp Sọ & Đầu Mặt Cổ',
    focus: 'Vòm sọ • Xương hàm dưới • Khớp TD-hàm',
    color: '#7c3aed',
    bgGradient: 'linear-gradient(135deg, rgba(124, 58, 237, 0.16) 0%, rgba(167, 139, 250, 0.06) 100%)',
    iconSvg: `<svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M12 2a7.5 7.5 0 0 0-7.5 7.5c0 3 1.5 5.5 3.5 6.8V19a2 2 0 0 0 2 2h4a2 2 0 0 0 2-2v-2.7c2-1.3 3.5-3.8 3.5-6.8A7.5 7.5 0 0 0 12 2z"/><circle cx="9.5" cy="10" r="1.2" fill="currentColor"/><circle cx="14.5" cy="10" r="1.2" fill="currentColor"/><path d="M10 15h4"/></svg>`,
    items: ['Frontal bone', 'Mandible']
  }
];

let activeModule = null;
let currentIndex = 0;
let modalEl = null;
let isStudyCollapsed = false;
let showStudyDetails = false;

export function initStudyModeUI(viewer) {
  if (modalEl) return;

  modalEl = document.createElement('div');
  modalEl.className = 'study-mode-modal hidden';
  modalEl.id = 'studyModeModal';
  modalEl.addEventListener('click', (e) => {
    if (e.target === modalEl) {
      closeStudyMode(viewer);
    }
  });
  document.body.appendChild(modalEl);
}

export function openStudyModulePicker(viewer) {
  if (!modalEl) initStudyModeUI(viewer);

  modalEl.classList.remove('step-mode');
  // Hide selectionCard to avoid overlap
  const selCard = document.getElementById('selectionCard');
  if (selCard) selCard.classList.add('hidden');

  modalEl.classList.remove('hidden');
  modalEl.innerHTML = `
    <div class="study-dialog">
      <div class="study-dialog-header">
        <div class="study-dialog-header-left">
          <div class="study-dialog-badge-row">
            <span class="study-dialog-pill">Định hướng lâm sàng</span>
            <span class="study-dialog-pill secondary">4 hệ giải phẫu</span>
          </div>
          <h3 class="study-dialog-title">Chuyên Đề Tự Học Trọng Tâm</h3>
          <p class="study-dialog-sub">Chọn chuyên đề để khám phá cấu trúc &amp; cơ sinh học</p>
        </div>
        <button type="button" class="dialog-close-btn" id="studyClosePickerBtn" title="Đóng">&times;</button>
      </div>

      <div class="study-modules-grid">
        ${STUDY_MODULES.map(mod => `
          <div class="study-module-card" data-module-id="${mod.id}" style="--mod-accent: ${mod.color};">
            <div class="module-card-icon-wrap" style="background: ${mod.bgGradient}; color: ${mod.color}; border: 1px solid ${mod.color}35;">
              ${mod.iconSvg}
            </div>
            <div class="module-card-body">
              <div class="module-card-title-row">
                <h4 class="module-card-title">${mod.title}</h4>
                <span class="module-card-count-badge" style="color: ${mod.color}; background: ${mod.bgGradient}; border: 1px solid ${mod.color}30;">
                  ${mod.items.length} cấu trúc
                </span>
              </div>
              <div class="module-card-focus">${mod.focus}</div>
            </div>
            <div class="module-card-arrow" aria-hidden="true">
              <svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5"><polyline points="9 18 15 12 9 6"/></svg>
            </div>
          </div>
        `).join('')}
      </div>
    </div>
  `;

  document.getElementById('studyClosePickerBtn')?.addEventListener('click', () => {
    closeStudyMode(viewer);
  });

  modalEl.querySelectorAll('.study-module-card').forEach(card => {
    card.addEventListener('click', () => {
      const modId = card.dataset.moduleId;
      const targetMod = STUDY_MODULES.find(m => m.id === modId);
      if (targetMod) {
        startStudyModule(targetMod, viewer);
      }
    });
  });
}

export function startStudyModule(module, viewer) {
  activeModule = module;
  currentIndex = 0;
  isStudyCollapsed = false;
  showStudyDetails = false;
  if (modalEl) modalEl.classList.add('step-mode');
  renderStudyStep(viewer);
}

function renderStudyStep(viewer) {
  if (!activeModule || !modalEl) return;

  const partId = activeModule.items[currentIndex];
  const clinical = getClinicalData(partId);

  // Focus and select structure in 3D
  selectPartById(partId, viewer);

  // Hide selectionCard to avoid overlap with flashcard navigation
  const selCard = document.getElementById('selectionCard');
  if (selCard) selCard.classList.add('hidden');

  if (isStudyCollapsed) {
    modalEl.innerHTML = `
      <div class="study-step-container study-step-collapsed animate-in">
        <div class="study-collapsed-content">
          <div class="study-collapsed-info">
            <span class="step-counter">📚 ${currentIndex + 1}/${activeModule.items.length}</span>
            <span class="study-name-mini">${clinical.nameVi}</span>
            <span class="study-latin-mini">(${clinical.nameLatin})</span>
          </div>
          <div class="study-collapsed-actions">
            <button type="button" class="btn-study-mini-nav" id="studyPrevBtn" ${currentIndex === 0 ? 'disabled' : ''} title="Cấu trúc trước">◀</button>
            <button type="button" class="btn-study-mini-nav" id="studyNextBtn" title="Cấu trúc sau">▶</button>
            <button type="button" class="btn-study-mini-toggle" id="studyToggleExpandBtn" title="Mở rộng chi tiết">📖 Mở</button>
            <button type="button" class="btn-study-mini-close" id="studyExitBtn" title="Thoát">&times;</button>
          </div>
        </div>
      </div>
    `;
  } else {
    modalEl.innerHTML = `
      <div class="study-step-container animate-in">
        <!-- Step Header Bar -->
        <div class="study-step-header">
          <div class="step-module-title">
            <span>📚 ${activeModule.title}</span>
            <span class="step-counter">${currentIndex + 1} / ${activeModule.items.length}</span>
          </div>
          <div class="study-header-actions">
            <button type="button" class="btn-study-toggle" id="studyToggleCollapseBtn" title="Thu gọn xem toàn màn hình 3D">▲ Thu gọn</button>
            <button type="button" class="dialog-close-btn" id="studyExitBtn" title="Thoát chế độ học">&times;</button>
          </div>
        </div>

        <!-- Flashcard Content Area -->
        <div class="study-flashcard">
          <div class="flashcard-title-row">
            <div class="flashcard-name-wrap">
              <h3 class="flashcard-name">${clinical.nameVi}</h3>
              <span class="flashcard-latin">${clinical.nameLatin}</span>
            </div>
            <span class="flashcard-tag">${clinical.systemVi}</span>
          </div>

          <!-- Quick Action Buttons Row -->
          <div class="flashcard-quick-actions">
            <button type="button" class="btn-study-action primary" id="studyQuickQuizBtn">🎯 Thử thách 3D</button>
            ${clinical.lessonLink ? `<button type="button" class="btn-study-action secondary" id="studyLessonBtn">📖 Bài học</button>` : ''}
            <button type="button" class="btn-study-action toggle-details" id="studyDetailsToggleBtn">
              ${showStudyDetails ? '▲ Ẩn bớt' : '💡 Chi tiết liên quan'}
            </button>
          </div>

          <!-- Collapsible Anatomical Relations & Clinical Note -->
          ${showStudyDetails ? `
            <div class="flashcard-details-box animate-in">
              <div class="relation-compact-grid">
                <div class="relation-chip"><strong>🔴 Cơ:</strong> <span>${clinical.relations?.muscles || 'Liên kết cơ vận động.'}</span></div>
                <div class="relation-chip"><strong>🦴 Khớp:</strong> <span>${clinical.relations?.bones || 'Tiếp khớp xương lân cận.'}</span></div>
                <div class="relation-chip"><strong>⚡ Thần kinh:</strong> <span>${clinical.relations?.nerves || 'Chi phối thần kinh ngoại biên.'}</span></div>
                <div class="relation-chip"><strong>🩸 Mạch máu:</strong> <span>${clinical.relations?.vessels || 'Cấp máu bởi động mạch vùng.'}</span></div>
              </div>
              ${clinical.clinical ? `
                <div class="flashcard-clinical-compact">
                  <strong>🩺 Lâm sàng:</strong> <span>${clinical.clinical}</span>
                </div>
              ` : ''}
            </div>
          ` : ''}
        </div>

        <!-- Bottom Step Navigation -->
        <div class="study-step-footer">
          <button type="button" class="step-nav-btn prev" id="studyPrevBtn" ${currentIndex === 0 ? 'disabled' : ''}>
            ◀ Trước
          </button>
          <button type="button" class="step-nav-btn next" id="studyNextBtn">
            ${currentIndex === activeModule.items.length - 1 ? 'Hoàn thành 🎉' : 'Tiếp theo ▶'}
          </button>
        </div>
      </div>
    `;
  }

  // Wire buttons
  document.getElementById('studyExitBtn')?.addEventListener('click', () => closeStudyMode(viewer));

  document.getElementById('studyToggleCollapseBtn')?.addEventListener('click', () => {
    isStudyCollapsed = true;
    renderStudyStep(viewer);
  });

  document.getElementById('studyToggleExpandBtn')?.addEventListener('click', () => {
    isStudyCollapsed = false;
    renderStudyStep(viewer);
  });

  document.getElementById('studyDetailsToggleBtn')?.addEventListener('click', () => {
    showStudyDetails = !showStudyDetails;
    renderStudyStep(viewer);
  });

  document.getElementById('studyPrevBtn')?.addEventListener('click', () => {
    if (currentIndex > 0) {
      currentIndex--;
      renderStudyStep(viewer);
    }
  });

  document.getElementById('studyNextBtn')?.addEventListener('click', () => {
    if (currentIndex < activeModule.items.length - 1) {
      currentIndex++;
      renderStudyStep(viewer);
    } else {
      // Completed module
      showCompletionCard(viewer);
    }
  });

  document.getElementById('studyLessonBtn')?.addEventListener('click', () => {
    openLesson(clinical.lessonLink, clinical.lessonTitle);
  });

  document.getElementById('studyVideoBtn')?.addEventListener('click', () => {
    openVideo(clinical.videoId, clinical.nameVi);
  });

  document.getElementById('studyQuickQuizBtn')?.addEventListener('click', () => {
    closeStudyMode(viewer);
    startQuiz(viewer);
  });
}

function showCompletionCard(viewer) {
  if (modalEl) modalEl.classList.remove('step-mode');
  modalEl.innerHTML = `
    <div class="study-dialog text-center">
      <div style="font-size: 48px; margin-bottom: 12px;">🎉</div>
      <h3>Chúc Mừng Bạn Đã Hoàn Thành!</h3>
      <p style="color: #8b949e; margin-bottom: 20px;">Bạn vừa nghiên cứu chi tiết ${activeModule.items.length} cấu trúc trong chuyên đề <strong>${activeModule.title}</strong>.</p>
      <div style="display: flex; gap: 10px; justify-content: center;">
        <button type="button" class="step-nav-btn next" id="studyFinishQuizBtn">🎯 Làm bài kiểm tra 3D ngay</button>
        <button type="button" class="step-nav-btn prev" id="studyFinishCloseBtn">Đóng</button>
      </div>
    </div>
  `;

  document.getElementById('studyFinishQuizBtn')?.addEventListener('click', () => {
    closeStudyMode(viewer);
    startQuiz(viewer);
  });

  document.getElementById('studyFinishCloseBtn')?.addEventListener('click', () => {
    closeStudyMode(viewer);
  });
}

export function closeStudyMode(viewer) {
  activeModule = null;
  currentIndex = 0;
  if (modalEl) {
    modalEl.classList.remove('step-mode');
    modalEl.classList.add('hidden');
    modalEl.innerHTML = '';
  }
  document.getElementById('btnNavStudy')?.classList.remove('active');
  document.getElementById('btnQuickStudy')?.classList.remove('active');
  document.getElementById('btnToolStudy')?.classList.remove('active');
  deselectPart();
}
