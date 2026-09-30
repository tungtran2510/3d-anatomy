// Interactive 3D Medical Exam & Practice Mode - Tap the correct anatomical structure
import { state } from '../state/store.js';
import { selectPartById, deselectPart } from '../viewer/selection.js';
import { highlightMesh, clearHighlight } from '../viewer/visibility.js';
import { getStructureInfo } from '../state/store.js';
import { showToast } from './sidebar.js';

export const EXAM_QUESTION_BANK = [
  {
    title: 'Xương bánh chè (Patella)',
    latin: 'Patella (TA2: 1152)',
    targetIds: ['Patella.l', 'Patella.r'],
    hint: 'Xương vừng hình tam giác dẹt ở mặt trước khớp gối.',
    category: 'Chi dưới'
  },
  {
    title: 'Xương đùi (Femur)',
    latin: 'Os femoris (TA2: 1133)',
    targetIds: ['Femur.l', 'Femur.r'],
    hint: 'Xương dài nhất và chịu lực khỏe nhất trong cơ thể con người.',
    category: 'Chi dưới'
  },
  {
    title: 'Xương chày (Tibia)',
    latin: 'Tibia (TA2: 1156)',
    targetIds: ['Tibia.l', 'Tibia.r'],
    hint: 'Xương lớn chịu 85% tải trọng nằm ở phía trong cẳng chân.',
    category: 'Chi dưới'
  },
  {
    title: 'Xương mác (Fibula)',
    latin: 'Fibula (TA2: 1172)',
    targetIds: ['Fibula.l', 'Fibula.r'],
    hint: 'Xương mảnh nằm ở phía ngoài cẳng chân, tạo nên mắt cá ngoài.',
    category: 'Chi dưới'
  },
  {
    title: 'Xương gót chân (Calcaneus)',
    latin: 'Calcaneus (TA2: 1184)',
    targetIds: ['Calcaneus.l', 'Calcaneus.r'],
    hint: 'Xương lớn nhất cổ chân, là điểm bám của gân gót Achilles.',
    category: 'Bàn chân'
  },
  {
    title: 'Đốt sống cổ C1 (Đốt đội - Atlas)',
    latin: 'Atlas (Vertebra cervicalis I)',
    targetIds: ['Atlas'],
    hint: 'Đốt sống cổ đầu tiên dạng vòng tròn không có thân, nâng đỡ hộp sọ.',
    category: 'Cột sống'
  },
  {
    title: 'Đốt sống cổ C2 (Đốt trục - Axis)',
    latin: 'Axis (Vertebra cervicalis II)',
    targetIds: ['Axis'],
    hint: 'Đốt sống có mỏm răng nhô thẳng lên tạo trục xoay cho cổ.',
    category: 'Cột sống'
  },
  {
    title: 'Đốt sống thắt lưng (Lumbar vertebra)',
    latin: 'Vertebrae lumbales (TA2: 1045)',
    targetIds: ['Lumbar vertebra I', 'Lumbar vertebra II', 'Lumbar vertebra III', 'Lumbar vertebra IV', 'Lumbar vertebra V'],
    hint: '5 đốt sống lớn nhất chịu tải trọng chính của nửa trên cơ thể.',
    category: 'Cột sống'
  },
  {
    title: 'Xương cùng (Sacrum)',
    latin: 'Os sacrum (TA2: 1056)',
    targetIds: ['Sacrum'],
    hint: 'Khối xương hình tam giác lớn nối giữa hai xương cánh chậu.',
    category: 'Cột sống'
  },
  {
    title: 'Xương cụt (Coccyx)',
    latin: 'Os coccygis (TA2: 1068)',
    targetIds: ['Coccyx'],
    hint: 'Đoạn xương nhỏ ở tận cùng phía dưới của cột sống.',
    category: 'Cột sống'
  },
  {
    title: 'Xương đòn (Quai xanh)',
    latin: 'Clavicula (TA2: 1098)',
    targetIds: ['Clavicle.l', 'Clavicle.r'],
    hint: 'Xương cong hình chữ S nằm ngang ở phía trước trên lồng ngực.',
    category: 'Chi trên'
  },
  {
    title: 'Xương bả vai (Scapula)',
    latin: 'Scapula (TA2: 1102)',
    targetIds: ['Scapula.l', 'Scapula.r'],
    hint: 'Xương dẹt phẳng hình tam giác nằm ở mặt sau trên lồng ngực.',
    category: 'Chi trên'
  },
  {
    title: 'Xương cánh tay (Humerus)',
    latin: 'Humerus (TA2: 1118)',
    targetIds: ['Humerus.l', 'Humerus.r'],
    hint: 'Xương dài lớn nhất chi trên, nối từ vai xuống khuỷu.',
    category: 'Chi trên'
  },
  {
    title: 'Xương quay (Radius)',
    latin: 'Radius (TA2: 1127)',
    targetIds: ['Radius.l', 'Radius.r'],
    hint: 'Xương cẳng tay nằm phía ngoài (ngón tay cái), thực hiện sấp ngửa.',
    category: 'Chi trên'
  },
  {
    title: 'Xương trụ (Ulna)',
    latin: 'Ulna (TA2: 1122)',
    targetIds: ['Ulna.l', 'Ulna.r'],
    hint: 'Xương cẳng tay nằm phía ngón út, có mỏm khuỷu rất to ở trên.',
    category: 'Chi trên'
  },
  {
    title: 'Thân xương ức (Sternum)',
    latin: 'Corpus sterni (TA2: 1079)',
    targetIds: ['Body of sternum'],
    hint: 'Xương dẹt phẳng ở đường giữa ngực khớp với các sụn sườn.',
    category: 'Lồng ngực'
  },
  {
    title: 'Xương trán (Frontal bone)',
    latin: 'Os frontale (TA2: 890)',
    targetIds: ['Frontal bone'],
    hint: 'Xương sọ bảo vệ thùy trán, tạo nên trán và trần ổ mắt.',
    category: 'Đầu mặt'
  },
  {
    title: 'Xương hàm dưới (Mandible)',
    latin: 'Mandibula (TA2: 953)',
    targetIds: ['Mandible'],
    hint: 'Xương duy nhất cử động được trong khối đầu mặt, thực hiện động tác nhai.',
    category: 'Đầu mặt'
  },
  {
    title: 'Xương chậu (Hip bone)',
    latin: 'Os coxae (TA2: 1111)',
    targetIds: ['Hip bone.l', 'Hip bone.r', 'Ilium.l', 'Ilium.r'],
    hint: 'Khung xương lớn nâng đỡ thân mình và tạo ổ cối tiếp khớp với xương đùi.',
    category: 'Khung chậu'
  }
];

let isQuizActive = false;
let currentQuestions = [];
let currentIndex = 0;
let score = 0;
let streak = 0;
let maxStreak = 0;
let missedQuestions = [];
let timerInterval = null;
let timeLeft = 30;
let quizOverlay = null;

export function isQuizRunning() {
  return isQuizActive;
}

export function startQuiz(viewer) {
  isQuizActive = true;
  score = 0;
  streak = 0;
  maxStreak = 0;
  currentIndex = 0;
  missedQuestions = [];

  // Pick 5 random questions
  currentQuestions = [...EXAM_QUESTION_BANK].sort(() => 0.5 - Math.random()).slice(0, 5);

  renderQuizUI(viewer);
  showToast('🎯 Bắt đầu bài kiểm tra 3D! Chạm vào cấu trúc được yêu cầu');
  if (navigator.vibrate) navigator.vibrate([50]);
}

export function stopQuiz() {
  isQuizActive = false;
  clearInterval(timerInterval);
  if (quizOverlay) {
    quizOverlay.remove();
    quizOverlay = null;
  }
  showToast('Đã thoát chế độ kiểm tra');
}

function startTimer(viewer) {
  clearInterval(timerInterval);
  timeLeft = 30;
  updateTimerUI();

  timerInterval = setInterval(() => {
    timeLeft--;
    updateTimerUI();

    if (timeLeft <= 0) {
      clearInterval(timerInterval);
      handleTimeout(viewer);
    }
  }, 1000);
}

function updateTimerUI() {
  const timerBar = document.getElementById('quizTimerBar');
  const timerText = document.getElementById('quizTimerText');
  if (timerBar && timerText) {
    const pct = Math.max(0, (timeLeft / 30) * 100);
    timerBar.style.width = `${pct}%`;
    timerText.textContent = `${timeLeft}s`;

    if (timeLeft <= 5) {
      timerBar.style.background = '#ef4444';
      timerText.style.color = '#ef4444';
    } else if (timeLeft <= 12) {
      timerBar.style.background = '#f59e0b';
      timerText.style.color = '#f59e0b';
    } else {
      timerBar.style.background = '#10b981';
      timerText.style.color = '#10b981';
    }
  }
}

function handleTimeout(viewer) {
  const q = currentQuestions[currentIndex];
  missedQuestions.push(q);
  streak = 0;
  showToast('⏰ Hết giờ cho câu hỏi này!');
  if (navigator.vibrate) navigator.vibrate([100, 50, 100]);

  // Show correct part
  if (q.targetIds[0]) {
    highlightMesh(q.targetIds[0], 0xff4444, 0.9);
  }

  setTimeout(() => {
    currentIndex++;
    renderQuizUI(viewer);
  }, 1800);
}

function renderQuizUI(viewer) {
  if (!quizOverlay) {
    quizOverlay = document.createElement('div');
    quizOverlay.id = 'quizOverlay';
    quizOverlay.className = 'quiz-overlay';
    document.getElementById('viewerContainer')?.appendChild(quizOverlay);
  }

  const q = currentQuestions[currentIndex];
  if (!q) {
    renderScoreCard(viewer);
    return;
  }

  startTimer(viewer);

  quizOverlay.innerHTML = `
    <div class="quiz-card animate-in">
      <div class="quiz-card-header">
        <div class="quiz-badge">
          <span>🎯 Câu ${currentIndex + 1}/${currentQuestions.length}</span>
          ${streak > 1 ? `<span class="streak-badge">🔥 x${streak}</span>` : ''}
        </div>
        <div class="quiz-timer">
          <span id="quizTimerText">30s</span>
          <button class="quiz-close-btn" id="btnQuizClose" aria-label="Thoát">&times;</button>
        </div>
      </div>

      <div class="quiz-timer-track">
        <div class="quiz-timer-bar" id="quizTimerBar" style="width: 100%;"></div>
      </div>

      <div class="quiz-prompt">
        <span class="quiz-target-label">Hãy chạm vào trên mô hình 3D:</span>
        <h3 class="quiz-target-name">${q.title}</h3>
        <span class="quiz-target-latin">${q.latin}</span>
      </div>

      <div class="quiz-hint-box">
        💡 <strong>Gợi ý:</strong> ${q.hint}
      </div>

      <div class="quiz-footer-status">
        <span>Điểm hiện tại: <strong>${score}</strong></span>
        <span class="quiz-hint-tap">Chạm trực tiếp vào xương/cơ trên màn hình</span>
      </div>
    </div>
  `;

  document.getElementById('btnQuizClose')?.addEventListener('click', stopQuiz);
}

export function handleQuizClick(partId, viewer) {
  if (!isQuizActive) return false;

  clearInterval(timerInterval);
  const q = currentQuestions[currentIndex];
  if (!q) return false;

  const isCorrect = q.targetIds.some(target => {
    return partId === target || partId.startsWith(target.replace(/\.(l|r)$/, ''));
  });

  if (isCorrect) {
    // Correct!
    streak++;
    if (streak > maxStreak) maxStreak = streak;
    const streakBonus = (streak - 1) * 20;
    const gained = 100 + streakBonus;
    score += gained;

    highlightMesh(partId, 0x10b981, 1.0);
    showToast(`🎉 CHÍNH XÁC! +${gained} điểm ${streak > 1 ? `(Chuỗi x${streak})` : ''}`);
    if (navigator.vibrate) navigator.vibrate([30, 40, 60]);

    setTimeout(() => {
      clearHighlight(partId);
      currentIndex++;
      renderQuizUI(viewer);
    }, 1200);
  } else {
    // Incorrect!
    streak = 0;
    missedQuestions.push(q);
    const clickedInfo = getStructureInfo(partId);
    const clickedName = clickedInfo?.name?.[state.language] || clickedInfo?.name?.vi || partId;

    highlightMesh(partId, 0xef4444, 0.9);
    showToast(`❌ Chưa đúng! Bạn vừa chạm: "${clickedName}"`);
    if (navigator.vibrate) navigator.vibrate([150]);

    // Show correct structure
    if (q.targetIds[0]) {
      highlightMesh(q.targetIds[0], 0xffd700, 0.9);
    }

    setTimeout(() => {
      clearHighlight(partId);
      if (q.targetIds[0]) clearHighlight(q.targetIds[0]);
      currentIndex++;
      renderQuizUI(viewer);
    }, 2000);
  }

  return true;
}

function renderScoreCard(viewer) {
  clearInterval(timerInterval);
  const total = currentQuestions.length;
  const correctCount = total - missedQuestions.length;
  const pct = Math.round((correctCount / total) * 100);

  let rankTitle = 'Bác sĩ tương lai (Xuất sắc)';
  let rankColor = '#10b981';
  let rankIcon = '🏆';

  if (pct < 60) {
    rankTitle = 'Cần rèn luyện thêm';
    rankColor = '#ef4444';
    rankIcon = '📖';
  } else if (pct < 80) {
    rankTitle = 'Khá - Nắm vững cơ bản';
    rankColor = '#f59e0b';
    rankIcon = '🌟';
  }

  quizOverlay.innerHTML = `
    <div class="quiz-card score-card animate-in">
      <div style="font-size: 40px; margin-bottom: 6px;">${rankIcon}</div>
      <h2 style="color: ${rankColor}; font-size: 20px; font-weight: 800; margin-bottom: 4px;">${rankTitle}</h2>
      <p style="color: #c9d1d9; font-size: 13px; margin-bottom: 12px;">Đúng <strong>${correctCount}/${total}</strong> câu (${pct}%) • Điểm số: <strong>${score}</strong></p>

      ${missedQuestions.length > 0 ? `
        <div class="missed-review-box">
          <span class="review-title">Cấu trúc cần ôn tập lại:</span>
          <div class="missed-list">
            ${missedQuestions.map(m => `
              <div class="missed-item" data-part="${m.targetIds[0]}">
                <span>📍 ${m.title}</span>
                <button type="button" class="btn-review-focus" data-focus="${m.targetIds[0]}">Xem lại 3D</button>
              </div>
            `).join('')}
          </div>
        </div>
      ` : '<p style="color: #10b981; font-weight: 600; font-size: 13px; margin-bottom: 12px;">Tuyệt vời! Bạn không sai câu nào!</p>'}

      <div class="score-card-actions">
        <button type="button" class="quiz-btn primary" id="btnQuizRestart">🔄 Kiểm tra lại</button>
        <button type="button" class="quiz-btn secondary" id="btnQuizFinish">Đóng</button>
      </div>
    </div>
  `;

  document.getElementById('btnQuizRestart')?.addEventListener('click', () => startQuiz(viewer));
  document.getElementById('btnQuizFinish')?.addEventListener('click', stopQuiz);

  quizOverlay.querySelectorAll('.btn-review-focus').forEach(btn => {
    btn.addEventListener('click', () => {
      const partId = btn.dataset.focus;
      if (partId) {
        stopQuiz();
        selectPartById(partId, viewer);
      }
    });
  });
}
