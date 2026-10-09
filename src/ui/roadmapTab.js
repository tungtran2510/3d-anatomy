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
    <!-- Top Progress Summary Card (Ultra-Compact) -->
    <div class="roadmap-summary-card">
      <div class="summary-hero-row">
        <div class="summary-hero-left">
          <span class="summary-hero-tag">Tiến Độ Lộ Trình</span>
          <div class="summary-hero-num">
            <span class="summary-hero-pct">${progress.overallPercentage}%</span>
            <span class="summary-hero-sub">${progress.totalMastered} / 28 cấu trúc</span>
          </div>
        </div>
        <div class="summary-hero-badge ${progress.overallPercentage >= 80 ? 'good' : progress.overallPercentage > 0 ? 'active' : ''}">
          ${progress.overallPercentage >= 80 ? '🏆 Xuất sắc' : progress.overallPercentage > 0 ? '⚡ Đang học' : '🌱 Khởi đầu'}
        </div>
      </div>
      <div class="summary-progress-bar">
        <div class="summary-progress-fill" style="width: ${progress.overallPercentage}%;"></div>
      </div>
      <div class="summary-metrics-row">
        <div class="metric-chip">
          <span class="metric-icon">🔥</span>
          <span class="metric-val">${progress.streakDays} ngày</span>
        </div>
        <div class="metric-chip">
          <span class="metric-icon">🎯</span>
          <span class="metric-val">${progress.accuracyRate}% đúng</span>
        </div>
        <div class="metric-chip">
          <span class="metric-icon">🏆</span>
          <span class="metric-val">${progress.totalMastered} đã thuộc</span>
        </div>
      </div>
    </div>

    <!-- Weak Structures Section (Sleek Single-Line Items) -->
    <div class="roadmap-section">
      <div class="section-header-compact">
        <h4 class="section-title-compact">
          <span>🎯 Cần Ôn Luyện</span>
          <span class="badge-count">${progress.weakCount}</span>
        </h4>
        ${weakList.length > 0 ? `
          <button type="button" class="btn-start-adaptive-compact" id="btnStartAdaptiveFromTab" title="Làm bài kiểm tra ôn luyện điểm yếu">
            ⚡ Ôn ngay
          </button>
        ` : ''}
      </div>

      <div class="weak-structures-list">
        ${weakList.length === 0 ? `
          <div class="empty-weak-compact">
            <span class="empty-icon">🎉</span>
            <span>Chưa có điểm yếu nào cần củng cố</span>
          </div>
        ` : weakList.map(item => `
          <div class="weak-item-row ${item.mastered ? 'mastered' : ''}" data-part="${escapeHtml(item.partId)}">
            <div class="weak-row-main" title="${escapeHtml(item.title)}${item.hint ? ' - ' + escapeHtml(item.hint) : ''}">
              <span class="weak-dot ${item.mastered ? 'good' : ''}"></span>
              <div class="weak-title-group">
                ${formatWeakTitle(item.title)}
              </div>
            </div>
            <div class="weak-row-actions">
              <span class="weak-badge-score ${item.mastered ? 'good' : 'warning'}">
                ${item.mastered ? 'Đã thuộc' : `Sai ${item.mistakeCount}x`}
              </span>
              <button type="button" class="btn-weak-focus-compact" data-part="${escapeHtml(item.partId)}" title="Xem vị trí 3D">
                👁️ 3D
              </button>
              <button type="button" class="btn-weak-del-compact" data-del="${escapeHtml(item.partId)}" title="Bỏ qua">&times;</button>
            </div>
          </div>
        `).join('')}
      </div>
    </div>

    <!-- 7 Core Roadmap Milestones (Sleek List Tiles) -->
    <div class="roadmap-section">
      <div class="section-header-compact">
        <h4 class="section-title-compact">🗺️ 7 Vùng Trọng Điểm</h4>
        <span class="section-meta-compact">Chuẩn TA2</span>
      </div>

      <div class="roadmap-modules-group">
        ${progress.modules.map(mod => `
          <div class="roadmap-module-tile ${mod.status}" data-part="${mod.keyParts[0]}" title="${escapeHtml(mod.title)} (${mod.masteredCount}/${mod.totalCount} cấu trúc)">
            <div class="mod-tile-icon">${mod.icon}</div>
            <div class="mod-tile-center">
              <div class="mod-tile-title-row">
                <span class="mod-tile-title">${escapeHtml(mod.title)}</span>
                <span class="mod-tile-pct ${mod.percentage > 0 ? 'active' : ''}">${mod.percentage}%</span>
              </div>
              <div class="mod-tile-meta-row">
                <div class="mod-mini-track">
                  <div class="mod-mini-fill" style="width: ${mod.percentage}%;"></div>
                </div>
                <span class="mod-tile-count">${mod.masteredCount}/${mod.totalCount}</span>
              </div>
            </div>
            <div class="mod-tile-chevron">
              <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.2" stroke-linecap="round" stroke-linejoin="round"><polyline points="9 18 15 12 9 6"></polyline></svg>
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

  container.querySelectorAll('.btn-weak-focus-compact').forEach(btn => {
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

  container.querySelectorAll('.btn-weak-del-compact').forEach(btn => {
    btn.addEventListener('click', (e) => {
      e.stopPropagation();
      const partId = btn.dataset.del;
      if (partId) {
        clearWeakStructure(partId);
        renderRoadmapTab(viewer);
        showToast('Đã xóa khỏi danh sách ôn luyện');
      }
    });
  });

  container.querySelectorAll('.roadmap-module-tile').forEach(tile => {
    tile.addEventListener('click', () => {
      const partId = tile.dataset.part;
      if (partId) {
        selectPartById(partId, viewer);
        if (window.innerWidth <= 1024) {
          document.getElementById('systemsToggle')?.click();
        }
      }
    });
  });
}

function formatWeakTitle(title) {
  if (!title) return '';
  const match = title.match(/^(.*?)\s*\((.*?)\)$/);
  if (match) {
    return `<span class="weak-main-name">${escapeHtml(match[1])}</span> <span class="weak-subname">(${escapeHtml(match[2])})</span>`;
  }
  return `<span class="weak-main-name">${escapeHtml(title)}</span>`;
}

function escapeHtml(str) {
  if (!str) return '';
  return String(str)
    .replace(/&/g, '&amp;')
    .replace(/</g, '&lt;')
    .replace(/>/g, '&gt;')
    .replace(/"/g, '&quot;');
}
