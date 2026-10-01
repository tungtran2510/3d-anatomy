// Learning Roadmap, Weak-Point Tracking, and Adaptive Analytics System
// Persists learning milestones, mistake history, and progress metrics

const ROADMAP_STORAGE_KEY = 'anatomy_learning_roadmap';
const WEAK_POINTS_STORAGE_KEY = 'anatomy_weak_structures';
const STATS_STORAGE_KEY = 'anatomy_learning_stats';

export const ROADMAP_MODULES = [
  {
    id: 'spine',
    title: 'Cột Sống & Đĩa Đệm',
    description: 'Nền tảng trục xương thân mình, cơ sinh học và phòng ngừa thoái hóa',
    icon: '🦴',
    system: 'skeletal',
    keyParts: ['Atlas', 'Axis', 'Lumbar vertebra I', 'Sacrum', 'Coccyx']
  },
  {
    id: 'lower_limb',
    title: 'Khung Chậu & Chi Dưới',
    description: 'Trục chịu tải, khớp háng, khớp gối và chuyển động đi đứng',
    icon: '🦵',
    system: 'skeletal',
    keyParts: ['Hip bone.l', 'Femur.l', 'Patella.l', 'Tibia.l', 'Fibula.l', 'Calcaneus.l']
  },
  {
    id: 'upper_limb',
    title: 'Đai Vai & Chi Trên',
    description: 'Sự linh hoạt đai vai, khớp khuỷu và bàn tay cầm nắm khéo léo',
    icon: '💪',
    system: 'skeletal',
    keyParts: ['Clavicle.l', 'Scapula.l', 'Humerus.l', 'Radius.l', 'Ulna.l']
  },
  {
    id: 'thorax',
    title: 'Lồng Ngực & Hô Hấp',
    description: 'Khung bảo vệ tạng ngực, xương sườn và cơ chế giãn nở hô hấp',
    icon: '🫁',
    system: 'visceral',
    keyParts: ['Body of sternum', 'First rib.l']
  },
  {
    id: 'cranium',
    title: 'Hộp Sọ & Đầu Mặt Cổ',
    description: 'Bảo vệ hệ thần kinh trung ương, xương hàm và các giác quan',
    icon: '🧠',
    system: 'skeletal',
    keyParts: ['Frontal bone', 'Mandible']
  },
  {
    id: 'muscular',
    title: 'Hệ Cơ Bắp & Vận Động',
    description: 'Các nhóm cơ tư thế, cơ vận động chi và cân bằng cơ thể',
    icon: '⚡',
    system: 'muscular',
    keyParts: ['Deltoid.l', 'Biceps brachii.l', 'Quadriceps femoris.l', 'Gastrocnemius.l']
  },
  {
    id: 'nervous',
    title: 'Hệ Thần Kinh & Cảm Giác',
    description: 'Đường truyền cảm giác, phản xạ vận động và các đám rối thần kinh',
    icon: '💡',
    system: 'nervous',
    keyParts: ['Spinal cord', 'Sciatic nerve.l', 'Femoral nerve.l', 'Vagus nerve']
  }
];

// --- Stats Management ---

export function getLearningStats() {
  try {
    const raw = localStorage.getItem(STATS_STORAGE_KEY);
    const defaults = {
      totalQuestions: 0,
      correctQuestions: 0,
      streakDays: 1,
      lastActiveDate: new Date().toISOString().slice(0, 10),
      masteredParts: [],
      viewedParts: []
    };
    if (!raw) return defaults;
    const parsed = JSON.parse(raw);
    return { ...defaults, ...parsed };
  } catch {
    return {
      totalQuestions: 0,
      correctQuestions: 0,
      streakDays: 1,
      lastActiveDate: new Date().toISOString().slice(0, 10),
      masteredParts: [],
      viewedParts: []
    };
  }
}

export function saveLearningStats(stats) {
  try {
    localStorage.setItem(STATS_STORAGE_KEY, JSON.stringify(stats));
    window.dispatchEvent(new CustomEvent('anatomy-stats-updated', { detail: stats }));
  } catch (e) {
    console.warn('[Roadmap] Failed to save stats:', e);
  }
}

export function trackPartViewed(partId) {
  if (!partId) return;
  const stats = getLearningStats();
  if (!stats.viewedParts.includes(partId)) {
    stats.viewedParts.push(partId);
    saveLearningStats(stats);
  }
}

// --- Weak Structures Tracking ---

export function getWeakStructures() {
  try {
    const raw = localStorage.getItem(WEAK_POINTS_STORAGE_KEY);
    if (!raw) return [];
    return JSON.parse(raw);
  } catch {
    return [];
  }
}

export function recordMistake(partId, title, hint) {
  if (!partId) return;
  const list = getWeakStructures();
  const existing = list.find(item => item.partId === partId || item.title === title);

  if (existing) {
    existing.mistakeCount = (existing.mistakeCount || 1) + 1;
    existing.masteryScore = Math.max(0, (existing.masteryScore || 50) - 20);
    existing.lastAttempt = Date.now();
  } else {
    list.push({
      partId,
      title: title || partId,
      hint: hint || '',
      mistakeCount: 1,
      masteryScore: 20,
      firstMistake: Date.now(),
      lastAttempt: Date.now()
    });
  }

  // Sort by highest mistake count
  list.sort((a, b) => b.mistakeCount - a.mistakeCount);

  try {
    localStorage.setItem(WEAK_POINTS_STORAGE_KEY, JSON.stringify(list));
    window.dispatchEvent(new CustomEvent('anatomy-weak-points-updated', { detail: list }));
  } catch (e) {
    console.warn('[Roadmap] Failed to save weak points:', e);
  }

  // Also update overall stats
  const stats = getLearningStats();
  stats.totalQuestions++;
  saveLearningStats(stats);
}

export function recordCorrect(partId) {
  if (!partId) return;
  const list = getWeakStructures();
  const existing = list.find(item => item.partId === partId);

  if (existing) {
    existing.masteryScore = Math.min(100, (existing.masteryScore || 0) + 30);
    existing.lastAttempt = Date.now();
    // If mastered (>85%), reduce mistake priority
    if (existing.masteryScore >= 85) {
      existing.mastered = true;
    }
    localStorage.setItem(WEAK_POINTS_STORAGE_KEY, JSON.stringify(list));
    window.dispatchEvent(new CustomEvent('anatomy-weak-points-updated', { detail: list }));
  }

  // Update overall stats
  const stats = getLearningStats();
  stats.totalQuestions++;
  stats.correctQuestions++;
  if (!stats.masteredParts.includes(partId)) {
    stats.masteredParts.push(partId);
  }
  saveLearningStats(stats);
}

export function clearWeakStructure(partId) {
  const list = getWeakStructures().filter(item => item.partId !== partId);
  localStorage.setItem(WEAK_POINTS_STORAGE_KEY, JSON.stringify(list));
  window.dispatchEvent(new CustomEvent('anatomy-weak-points-updated', { detail: list }));
}

// --- Roadmap Progress Calculation ---

export function getRoadmapProgress() {
  const stats = getLearningStats();
  const weakPoints = getWeakStructures();
  const totalKeyParts = ROADMAP_MODULES.reduce((acc, m) => acc + m.keyParts.length, 0);

  // Calculate module status
  const moduleProgress = ROADMAP_MODULES.map(mod => {
    const masteredInMod = mod.keyParts.filter(p => stats.masteredParts.includes(p)).length;
    const viewedInMod = mod.keyParts.filter(p => stats.viewedParts.includes(p)).length;
    const pct = Math.round((masteredInMod / mod.keyParts.length) * 100);

    let status = 'not_started';
    if (pct >= 80) status = 'mastered';
    else if (viewedInMod > 0 || masteredInMod > 0) status = 'in_progress';

    return {
      ...mod,
      masteredCount: masteredInMod,
      totalCount: mod.keyParts.length,
      percentage: pct,
      status
    };
  });

  const totalMastered = stats.masteredParts.length;
  const overallPercentage = Math.min(100, Math.round((totalMastered / totalKeyParts) * 100));

  return {
    overallPercentage,
    modules: moduleProgress,
    totalMastered,
    weakCount: weakPoints.filter(w => !w.mastered).length,
    accuracyRate: stats.totalQuestions > 0 ? Math.round((stats.correctQuestions / stats.totalQuestions) * 100) : 0,
    streakDays: stats.streakDays
  };
}
