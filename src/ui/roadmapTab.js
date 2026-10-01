// Personalized Study Roadmap & Adaptive Weak-Point Review Drawer UI
import { getRoadmapProgress, getWeakStructures, clearWeakStructure } from '../state/learningRoadmap.js';
import { selectPartById } from '../viewer/selection.js';
import { startAdaptiveQuiz } from './quiz.js';
import { showToast } from './sidebar.js';

export function renderRoadmapTab(viewer) {
  const container = document.getElementById('roadmapContent');
  if (!container) return;

  const progress = getRoadmapProgress();
  const weakList = getWeakStructures();

  container.innerHTML = `
    <!-- Top Progress Summary Card -->
    <div class="roadmap-summary-card">
      <div class="summary-progress-row">
        <div>
          <span class="summary-label">Tiến Độ Lộ Trình Toàn Diện</span>
          <h3 class="summary-pct">${progress.overallPercentage}%</h3>
        </div>
        <div class="summary-stats-col">
          <div class="stat-pill">🔥 <span>${progress.streakDays} ngày học</span></div>
          <div class="stat-pill">🎯 <span>Độ chính xác: ${progress.accuracyRate}%</span></div>
          <div class="stat-pill">🏆 <span>${progress.totalMastered} cấu trúc thành thạo</span></div>
        </div>
      </div>
      <div class="progress-bar-track">
        <div class="progress-bar-fill" style="width: ${progress.overallPercentage}%;"></div>
      </div>
    </div>

    <!-- Weak Structures / Cấu trúc hay sai Section -->
    <div class="roadmap-section">
      <div class="section-header-row">
        <div>
          <h4 class="roadmap-section-title">🎯 Cấu Trúc Cần Ôn Luyện (${progress.weakCount})</h4>
          <p class="roadmap-section-desc">Ghi nhận từ các câu trả lời sai hoặc quá giờ trong bài kiểm tra</p>
        </div>
        ${weakList.length > 0 ? `
          <button type="button" class="btn-start-adaptive" id="btnStartAdaptiveFromTab">
            ⚡ Ôn ngay
          </button>
        ` : ''}
      </div>

      <div class="weak-structures-list">
        ${weakList.length === 0 ? `
          <div class="empty-weak-state">
            <span class="empty-icon">🎉</span>
            <p>Tuyệt vời! Bạn chưa có điểm yếu nào cần củng cố.</p>
            <span class="hint">Hãy làm bài kiểm tra 3D để hệ thống phát hiện và gợi ý cấu trúc cần ôn.</span>
          </div>
        ` : weakList.map(item => `
          <div class="weak-item-card ${item.mastered ? 'mastered' : ''}" data-part="${escapeHtml(item.partId)}">
            <div class="weak-item-info">
              <div class="weak-item-title-row">
                <span class="weak-name">${escapeHtml(item.title)}</span>
                <span class="weak-badge-score ${item.mastered ? 'good' : 'warning'}">
                  ${item.mastered ? 'Đã thành thạo' : `Sai ${item.mistakeCount} lần`}
                </span>
              </div>
              ${item.hint ? `<p class="weak-hint">💡 ${escapeHtml(item.hint)}</p>` : ''}
            </div>
            <div class="weak-actions">
              <button type="button" class="btn-review-focus btn-weak-focus" data-part="${escapeHtml(item.partId)}">Xem 3D</button>
              <button type="button" class="btn-weak-del" data-del="${escapeHtml(item.partId)}" title="Bỏ qua">&times;</button>
            </div>
          </div>
        `).join('')}
      </div>
    </div>

    <!-- 7 Core Roadmap Milestones -->
    <div class="roadmap-section">
      <h4 class="roadmap-section-title">🗺️ Lộ Trình 7 Vùng Trọng Điểm</h4>
      <p class="roadmap-section-desc">Bám sát giải phẫu chức năng và chuẩn Terminologia Anatomica</p>

      <div class="roadmap-modules-list">
        ${progress.modules.map(mod => `
          <div class="roadmap-mod-card ${mod.status}" data-mod-id="${mod.id}">
            <div class="mod-icon-wrap">${mod.icon}</div>
            <div class="mod-body">
              <div class="mod-header-row">
                <h5 class="mod-title">${escapeHtml(mod.title)}</h5>
                <span class="mod-pct-badge">${mod.percentage}%</span>
              </div>
              <p class="mod-desc">${escapeHtml(mod.description)}</p>
              <div class="mod-progress-bar">
                <div class="mod-progress-fill" style="width: ${mod.percentage}%;"></div>
              </div>
              <div class="mod-footer-row">
                <span class="mod-count">${mod.masteredCount}/${mod.totalCount} cấu trúc trọng tâm</span>
                <button type="button" class="btn-mod-explore" data-part="${mod.keyParts[0]}">Khám phá 3D ➔</button>
              </div>
            </div>
          </div>
        `).join('')}
      </div>
    </div>
  `;

  // Attach Event Handlers
  document.getElementById('btnStartAdaptiveFromTab')?.addEventListener('click', () => {
    if (window.innerWidth <= 1024) {
      document.getElementById('systemsToggle')?.click();
    }
    startAdaptiveQuiz(viewer);
  });

  container.querySelectorAll('.btn-weak-focus').forEach(btn => {
    btn.addEventListener('click', (e) => {
      e.stopPropagation();
      const partId = btn.dataset.part;
      if (partId) {
        selectPartById(partId, viewer);
        if (window.innerWidth <= 1024) {
          document.getElementById('systemsToggle')?.click();
        }
      }
    });
  });

  container.querySelectorAll('.btn-weak-del').forEach(btn => {
    btn.addEventListener('click', (e) => {
      e.stopPropagation();
      const partId = btn.dataset.del;
      if (partId) {
        clearWeakStructure(partId);
        renderRoadmapTab(viewer);
        showToast('Đã xóa khỏi danh sách điểm yếu');
      }
    });
  });

  container.querySelectorAll('.btn-mod-explore').forEach(btn => {
    btn.addEventListener('click', (e) => {
      e.stopPropagation();
      const partId = btn.dataset.part;
      if (partId) {
        selectPartById(partId, viewer);
        if (window.innerWidth <= 1024) {
          document.getElementById('systemsToggle')?.click();
        }
      }
    });
  });
}

function escapeHtml(str) {
  if (!str) return '';
  return String(str)
    .replace(/&/g, '&amp;')
    .replace(/</g, '&lt;')
    .replace(/>/g, '&gt;')
    .replace(/"/g, '&quot;');
}
