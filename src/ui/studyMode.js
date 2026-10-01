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
    description: 'Nền tảng trục xương thân mình, cơ sinh học và phòng tránh thoát vị đĩa đệm',
    items: ['Atlas', 'Axis', 'Lumbar vertebra', 'Sacrum', 'Coccyx']
  },
  {
    id: 'lower_limb',
    title: 'Chi Dưới & Khớp Gối',
    description: 'Trục chịu lực, khớp háng, khớp gối và chuyển động đi đứng',
    items: ['Hip bone.l', 'Femur.l', 'Patella.l', 'Tibia.l', 'Fibula.l', 'Calcaneus.l']
  },
  {
    id: 'upper_limb',
    title: 'Chi Trên & Đai Vai',
    description: 'Sự linh hoạt đai vai, khớp khuỷu và bàn tay cầm nắm',
    items: ['Clavicle.l', 'Scapula.l', 'Humerus.l', 'Radius.l', 'Ulna.l']
  },
  {
    id: 'thorax',
    title: 'Lồng Ngực & Hô Hấp',
    description: 'Khung bảo vệ tim phổi và cơ chế hô hấp sinh lý',
    items: ['Body of sternum', 'First rib.l']
  },
  {
    id: 'cranium',
    title: 'Hộp Sọ & Đầu Mặt Cổ',
    description: 'Khung bảo vệ não bộ, khớp thái dương hàm và các giác quan',
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

  // Hide selectionCard to avoid overlap
  const selCard = document.getElementById('selectionCard');
  if (selCard) selCard.classList.add('hidden');

  modalEl.classList.remove('hidden');
  modalEl.innerHTML = `
    <div class="study-dialog">
      <div class="study-dialog-header">
        <div>
          <h3>📚 Chế Độ Tự Học Giải Phẫu 3D</h3>
          <p>Khám phá chuyên sâu cấu trúc, chức năng và liên quan 4 thành phần (Cơ - Xương - Thần kinh - Mạch máu)</p>
        </div>
        <button type="button" class="dialog-close-btn" id="studyClosePickerBtn">&times;</button>
      </div>

      <div class="study-modules-grid">
        ${STUDY_MODULES.map(mod => `
          <div class="study-module-card" data-module-id="${mod.id}">
            <div class="module-card-icon">🩺</div>
            <div class="module-card-body">
              <h4>${mod.title}</h4>
              <p>${mod.description}</p>
              <span class="module-count">${mod.items.length} cấu trúc trọng tâm</span>
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
              <span class="flashcard-latin">${clinical.nameLatin} (${clinical.nameEn || ''})</span>
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
    modalEl.classList.add('hidden');
    modalEl.innerHTML = '';
  }
  document.getElementById('btnNavStudy')?.classList.remove('active');
  document.getElementById('btnQuickStudy')?.classList.remove('active');
  document.getElementById('btnToolStudy')?.classList.remove('active');
  deselectPart();
}
