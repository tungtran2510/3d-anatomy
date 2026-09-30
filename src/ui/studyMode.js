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

export function initStudyModeUI(viewer) {
  if (modalEl) return;

  modalEl = document.createElement('div');
  modalEl.className = 'study-mode-modal hidden';
  modalEl.id = 'studyModeModal';
  document.body.appendChild(modalEl);
}

export function openStudyModulePicker(viewer) {
  if (!modalEl) initStudyModeUI(viewer);

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
  renderStudyStep(viewer);
}

function renderStudyStep(viewer) {
  if (!activeModule || !modalEl) return;

  const partId = activeModule.items[currentIndex];
  const clinical = getClinicalData(partId);

  // Focus and select structure in 3D
  selectPartById(partId, viewer);

  modalEl.innerHTML = `
    <div class="study-step-container">
      <!-- Step Header Bar -->
      <div class="study-step-header">
        <div class="step-module-title">
          <span>📚 ${activeModule.title}</span>
          <span class="step-counter">${currentIndex + 1} / ${activeModule.items.length}</span>
        </div>
        <button type="button" class="dialog-close-btn" id="studyExitBtn" title="Thoát chế độ học">&times;</button>
      </div>

      <!-- Flashcard Content Area -->
      <div class="study-flashcard">
        <div class="flashcard-title-row">
          <div>
            <h3>${clinical.nameVi}</h3>
            <span class="flashcard-latin">${clinical.nameLatin} (${clinical.nameEn || ''})</span>
          </div>
          <span class="flashcard-tag">${clinical.systemVi}</span>
        </div>

        <!-- 4-Way Anatomical Relations -->
        <div class="flashcard-relations">
          <div class="relation-item">
            <span class="relation-icon">🔴</span>
            <div class="relation-body">
              <strong>Cơ liên quan:</strong>
              <p>${clinical.relations?.muscles || 'Liên kết nhóm cơ định hình và vận động.'}</p>
            </div>
          </div>

          <div class="relation-item">
            <span class="relation-icon">🦴</span>
            <div class="relation-body">
              <strong>Xương & Khớp:</strong>
              <p>${clinical.relations?.bones || 'Tiếp khớp với các diện xương kế cận.'}</p>
            </div>
          </div>

          <div class="relation-item">
            <span class="relation-icon">⚡</span>
            <div class="relation-body">
              <strong>Thần kinh:</strong>
              <p>${clinical.relations?.nerves || 'Chi phối bởi các nhánh thần kinh ngoại biên.'}</p>
            </div>
          </div>

          <div class="relation-item">
            <span class="relation-icon">🩸</span>
            <div class="relation-body">
              <strong>Mạch máu:</strong>
              <p>${clinical.relations?.vessels || 'Cấp máu bởi các nhánh động mạch khu vực.'}</p>
            </div>
          </div>
        </div>

        <!-- Clinical Takeaway -->
        <div class="flashcard-clinical">
          <strong>🩺 Ý nghĩa lâm sàng & Bệnh lý:</strong>
          <p>${clinical.clinical}</p>
        </div>

        <!-- Direct Actions -->
        <div class="flashcard-actions">
          ${clinical.lessonLink ? `<button type="button" class="btn-study-lesson" id="studyLessonBtn">📖 Học bài: ${clinical.lessonTitle}</button>` : ''}
          ${clinical.videoId ? `<button type="button" class="btn-study-video" id="studyVideoBtn">▶️ Xem video bài giảng</button>` : ''}
          <button type="button" class="btn-study-quiz" id="studyQuickQuizBtn">🎯 Thử thách chạm 3D</button>
        </div>
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

  // Wire buttons
  document.getElementById('studyExitBtn')?.addEventListener('click', () => closeStudyMode(viewer));

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
  deselectPart();
}
