import { state } from '../state/store.js';
import { selectPartById } from '../viewer/selection.js';
import { highlightMesh, clearHighlight } from '../viewer/visibility.js';
import { getStructureInfo } from '../state/store.js';
import { showToast } from './sidebar.js';
import { recordMistake, recordCorrect, getWeakStructures } from '../state/learningRoadmap.js';

export const EXAM_QUESTION_BANK = [
  {
    title: 'Xương bánh chè',
    latin: 'Patella (TA2: 1152)',
    targetIds: ['Patella.l', 'Patella.r'],
    hint: 'Xương vừng hình tam giác dẹt ở mặt trước khớp gối.',
    category: 'Chi dưới'
  },
  {
    title: 'Xương đùi',
    latin: 'Os femoris (TA2: 1133)',
    targetIds: ['Femur.l', 'Femur.r'],
    hint: 'Xương dài nhất và chịu lực khỏe nhất trong cơ thể con người.',
    category: 'Chi dưới'
  },
  {
    title: 'Xương chày',
    latin: 'Tibia (TA2: 1156)',
    targetIds: ['Tibia.l', 'Tibia.r'],
    hint: 'Xương lớn chịu 85% tải trọng nằm ở phía trong cẳng chân.',
    category: 'Chi dưới'
  },
  {
    title: 'Xương mác',
    latin: 'Fibula (TA2: 1172)',
    targetIds: ['Fibula.l', 'Fibula.r'],
    hint: 'Xương mảnh nằm ở phía ngoài cẳng chân, tạo nên mắt cá ngoài.',
    category: 'Chi dưới'
  },
  {
    title: 'Xương gót chân',
    latin: 'Calcaneus (TA2: 1184)',
    targetIds: ['Calcaneus.l', 'Calcaneus.r'],
    hint: 'Xương lớn nhất cổ chân, là điểm bám của gân gót Achilles.',
    category: 'Bàn chân'
  },
  {
    title: 'Đốt sống cổ C1 (Đốt đội)',
    latin: 'Atlas (Vertebra cervicalis I)',
    targetIds: ['Atlas (C1)', 'Atlas'],
    hint: 'Đốt sống cổ đầu tiên dạng vòng tròn không có thân, nâng đỡ hộp sọ.',
    category: 'Cột sống'
  },
  {
    title: 'Đốt sống cổ C2 (Đốt trục)',
    latin: 'Axis (Vertebra cervicalis II)',
    targetIds: ['Axis (C2)', 'Axis'],
    hint: 'Đốt sống có mỏm răng nhô thẳng lên tạo trục xoay cho cổ.',
    category: 'Cột sống'
  },
  {
    title: 'Đốt sống thắt lưng',
    latin: 'Vertebrae lumbales (TA2: 1045)',
    targetIds: ['Vertebra L1', 'Vertebra L2', 'Vertebra L3', 'Vertebra L4', 'Vertebra L5', 'Lumbar vertebra'],
    hint: '5 đốt sống lớn nhất chịu tải trọng chính của nửa trên cơ thể.',
    category: 'Cột sống'
  },
  {
    title: 'Xương cùng',
    latin: 'Os sacrum (TA2: 1056)',
    targetIds: ['Sacrum'],
    hint: 'Khối xương hình tam giác lớn nối giữa hai xương cánh chậu.',
    category: 'Cột sống'
  },
  {
    title: 'Xương cụt',
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
    title: 'Xương bả vai',
    latin: 'Scapula (TA2: 1102)',
    targetIds: ['Scapula.l', 'Scapula.r'],
    hint: 'Xương dẹt phẳng hình tam giác nằm ở mặt sau trên lồng ngực.',
    category: 'Chi trên'
  },
  {
    title: 'Xương cánh tay',
    latin: 'Humerus (TA2: 1118)',
    targetIds: ['Humerus.l', 'Humerus.r'],
    hint: 'Xương dài lớn nhất chi trên, nối từ vai xuống khuỷu.',
    category: 'Chi trên'
  },
  {
    title: 'Xương quay',
    latin: 'Radius (TA2: 1127)',
    targetIds: ['Radius.l', 'Radius.r'],
    hint: 'Xương cẳng tay nằm phía ngoài (ngón tay cái), thực hiện sấp ngửa.',
    category: 'Chi trên'
  },
  {
    title: 'Xương trụ',
    latin: 'Ulna (TA2: 1122)',
    targetIds: ['Ulna.l', 'Ulna.r'],
    hint: 'Xương cẳng tay nằm phía ngón út, có mỏm khuỷu rất to ở trên.',
    category: 'Chi trên'
  },
  {
    title: 'Thân xương ức',
    latin: 'Corpus sterni (TA2: 1079)',
    targetIds: ['Body of sternum'],
    hint: 'Xương dẹt phẳng ở đường giữa ngực khớp với các sụn sườn.',
    category: 'Lồng ngực'
  },
  {
    title: 'Xương trán',
    latin: 'Os frontale (TA2: 890)',
    targetIds: ['Frontal bone'],
    hint: 'Xương sọ bảo vệ thùy trán, tạo nên trán và trần ổ mắt.',
    category: 'Đầu mặt'
  },
  {
    title: 'Xương hàm dưới',
    latin: 'Mandibula (TA2: 953)',
    targetIds: ['Mandible'],
    hint: 'Xương duy nhất cử động được trong khối đầu mặt, thực hiện động tác nhai.',
    category: 'Đầu mặt'
  },
  {
    title: 'Xương chậu',
    latin: 'Os coxae (TA2: 1111)',
    targetIds: ['Hip bone.l', 'Hip bone.r', 'Ilium.l', 'Ilium.r'],
    hint: 'Khung xương lớn nâng đỡ thân mình và tạo ổ cối tiếp khớp với xương đùi.',
    category: 'Khung chậu'
  }
];

let isQuizActive = false;
let isAdaptiveMode = false;
let currentQuestions = [];
let currentIndex = 0;
let score = 0;
let streak = 0;
let maxStreak = 0;
let missedQuestions = [];
let timerInterval = null;
let timeLeft = 30;
let quizOverlay = null;
let isQuizCollapsed = false;

export function isQuizRunning() {
  return isQuizActive;
}

export function startQuiz(viewer) {
  isQuizActive = true;
  isAdaptiveMode = false;
  isQuizCollapsed = false;
  score = 0;
  streak = 0;
  maxStreak = 0;
  currentIndex = 0;
  missedQuestions = [];

  // Ẩn selection card phía dưới để tránh che màn hình
  document.getElementById('selectionCard')?.classList.add('hidden');
  document.body.classList.add('quiz-active');

  // Pick 5 random questions
  currentQuestions = [...EXAM_QUESTION_BANK].sort(() => 0.5 - Math.random()).slice(0, 5);

  renderQuizUI(viewer);
  showToast('🎯 Bắt đầu bài kiểm tra 3D! Chạm vào cấu trúc được yêu cầu');
  if (navigator.vibrate) navigator.vibrate([50]);
}

export function startAdaptiveQuiz(viewer) {
  const weakList = getWeakStructures().filter(w => !w.mastered);
  isQuizActive = true;
  isAdaptiveMode = true;
  isQuizCollapsed = false;
  score = 0;
  streak = 0;
  maxStreak = 0;
  currentIndex = 0;
  missedQuestions = [];

  // Ẩn selection card phía dưới để tránh che màn hình
  document.getElementById('selectionCard')?.classList.add('hidden');
  document.body.classList.add('quiz-active');

  if (weakList.length > 0) {
    const weakPartIds = weakList.map(w => w.partId);
    const matched = EXAM_QUESTION_BANK.filter(q => q.targetIds.some(t => weakPartIds.includes(t)));
    const others = EXAM_QUESTION_BANK.filter(q => !matched.includes(q)).sort(() => 0.5 - Math.random());
    currentQuestions = [...matched, ...others].slice(0, 5);
    showToast(`🎯 Bắt đầu Kiểm Tra Thích Ứng: Ôn ${matched.length} cấu trúc bạn hay sai!`);
  } else {
    currentQuestions = [...EXAM_QUESTION_BANK].sort(() => 0.5 - Math.random()).slice(0, 5);
    showToast('🎯 Chưa có câu sai! Bắt đầu bài kiểm tra thích ứng ngẫu nhiên');
  }

  renderQuizUI(viewer);
  if (navigator.vibrate) navigator.vibrate([50, 50]);
}

export function stopQuiz() {
  isQuizActive = false;
  isAdaptiveMode = false;
  isQuizCollapsed = false;
  document.body.classList.remove('quiz-active');
  clearInterval(timerInterval);
  if (quizOverlay) {
    quizOverlay.remove();
    quizOverlay = null;
  }
  document.getElementById('selectionCard')?.classList.add('hidden');
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
  recordMistake(q.targetIds[0], q.title, q.hint);
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

  // Tự động ẩn selection card phía dưới để giải phóng tối đa diện tích quan sát 3D
  document.getElementById('selectionCard')?.classList.add('hidden');

  if (isQuizCollapsed) {
    quizOverlay.innerHTML = `
      <div class="quiz-card quiz-card-collapsed animate-in">
        <div class="quiz-collapsed-content">
          <div class="quiz-collapsed-info">
            <span class="quiz-badge-mini">🎯 ${currentIndex + 1}/${currentQuestions.length}</span>
            <span class="quiz-target-name-mini" title="${q.title}">${q.title}</span>
            <span class="quiz-latin-mini">(${q.latin})</span>
          </div>
          <div class="quiz-collapsed-actions">
            <span class="quiz-timer-mini" id="quizTimerText">${timeLeft}s</span>
            <button type="button" class="btn-quiz-mini-toggle" id="btnQuizToggle" title="Mở rộng chi tiết & gợi ý">💡 Mở</button>
            <button type="button" class="btn-quiz-mini-close" id="btnQuizClose" title="Dừng bài kiểm tra">&times;</button>
          </div>
        </div>
        <div class="quiz-timer-track mini">
          <div class="quiz-timer-bar" id="quizTimerBar" style="width: ${(timeLeft / 30) * 100}%;"></div>
        </div>
      </div>
    `;
  } else {
    quizOverlay.innerHTML = `
      <div class="quiz-card animate-in">
        <div class="quiz-card-header">
          <div class="quiz-badge-group">
            <span class="quiz-badge-pill">🎯 Câu ${currentIndex + 1}/${currentQuestions.length}</span>
            <span class="quiz-score-pill">⭐ ${score}</span>
            ${isAdaptiveMode ? '<span class="quiz-adaptive-pill">⚡ Thích ứng</span>' : ''}
            ${streak > 1 ? `<span class="streak-badge">🔥 x${streak}</span>` : ''}
          </div>
          <div class="quiz-header-right">
            <span class="quiz-timer-pill" id="quizTimerText">⏱️ ${timeLeft}s</span>
            <button type="button" class="btn-quiz-hud-toggle" id="btnQuizToggle" title="Thu gọn xem toàn màn hình 3D">▲ Thu gọn</button>
            <button type="button" class="btn-quiz-hud-close" id="btnQuizClose" aria-label="Thoát">&times;</button>
          </div>
        </div>

        <div class="quiz-timer-track">
          <div class="quiz-timer-bar" id="quizTimerBar" style="width: ${(timeLeft / 30) * 100}%;"></div>
        </div>

        <div class="quiz-card-body">
          <div class="quiz-target-row">
            <span class="quiz-target-lead">CHẠM TRÊN 3D:</span>
            <h3 class="quiz-target-name">${q.title}</h3>
            <span class="quiz-target-latin">(${q.latin})</span>
            ${q.hint ? `<button type="button" class="btn-quiz-hint-pill" id="btnQuizHintPill" title="Xem gợi ý">💡 Gợi ý</button>` : ''}
          </div>

          ${q.hint ? `
            <div class="quiz-hint-box hidden" id="quizHintBox">
              <span>💡 <strong>Gợi ý:</strong> ${q.hint}</span>
            </div>
          ` : ''}
        </div>
      </div>
    `;
  }

  document.getElementById('btnQuizClose')?.addEventListener('click', stopQuiz);
  document.getElementById('btnQuizToggle')?.addEventListener('click', () => {
    isQuizCollapsed = !isQuizCollapsed;
    renderQuizUI(viewer);
  });
  document.getElementById('btnQuizHintPill')?.addEventListener('click', () => {
    const hintBox = document.getElementById('quizHintBox');
    if (hintBox) {
      hintBox.classList.toggle('hidden');
    }
  });
}


export function handleQuizClick(partId, viewer) {
  if (!isQuizActive) return false;

  clearInterval(timerInterval);
  const q = currentQuestions[currentIndex];
  if (!q) return false;

  const isCorrect = q.targetIds.some(target => {
    if (partId === target) return true;
    if (partId.startsWith(target.replace(/\.(l|r)$/, ''))) return true;
    if (target.startsWith('Vertebra L') && partId.startsWith('Vertebra L')) return true;
    if ((target === 'Atlas' || target === 'Atlas (C1)') && partId.startsWith('Atlas')) return true;
    if ((target === 'Axis' || target === 'Axis (C2)') && partId.startsWith('Axis')) return true;
    return false;
  });

  if (isCorrect) {
    // Correct!
    streak++;
    if (streak > maxStreak) maxStreak = streak;
    const streakBonus = (streak - 1) * 20;
    const gained = 100 + streakBonus;
    score += gained;
    recordCorrect(q.targetIds[0]);

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
    recordMistake(q.targetIds[0], q.title, q.hint);
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

  let rankTitle = 'Xuất sắc - Nắm vững cấu trúc';
  let rankColor = '#10b981';
  let rankIcon = '🏆';

  if (pct < 60) {
    rankTitle = 'Cần ôn luyện thêm';
    rankColor = '#ef4444';
    rankIcon = '📖';
  } else if (pct < 80) {
    rankTitle = 'Khá - Nắm vững cơ bản';
    rankColor = '#f59e0b';
    rankIcon = '🌟';
  }

  quizOverlay.innerHTML = `
    <div class="quiz-card score-card animate-in">
      <div class="score-card-header">
        <span class="score-card-icon">${rankIcon}</span>
        <div class="score-card-title-group">
          <h2 class="score-card-title" style="color: ${rankColor};">${rankTitle}</h2>
          <p class="score-card-sub">Đúng <strong>${correctCount}/${total}</strong> câu (${pct}%) • Điểm số: <strong>${score}</strong></p>
        </div>
      </div>

      ${missedQuestions.length > 0 ? `
        <div class="missed-review-box">
          <span class="review-title">Cấu trúc cần ôn tập lại:</span>
          <div class="missed-list">
            ${missedQuestions.map(m => `
              <div class="missed-item" data-part="${m.targetIds[0]}">
                <span class="missed-item-name">📍 ${m.title} <em class="missed-item-latin">(${m.latin})</em></span>
                <button type="button" class="btn-review-focus" data-focus="${m.targetIds[0]}">Xem lại 3D</button>
              </div>
            `).join('')}
          </div>
        </div>
      ` : '<div class="quiz-perfect-notice">🎉 Tuyệt vời! Bạn không sai câu nào!</div>'}

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
