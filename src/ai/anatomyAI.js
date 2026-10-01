// Smart 3D Anatomy AI Engine
// Natural language 3D model control, grounded medical reasoning, and adaptive pedagogy
import { state } from '../state/store.js';
import { getClinicalData } from '../data/clinicalInfo.js';
import { searchStructures } from '../utils/dataLoader.js';
import { selectPartById, deselectPart } from '../viewer/selection.js';
import { loadModel } from '../viewer/loadModel.js';
import { showSystem, hideSystem, isolatePart, setPartTransparency } from '../viewer/visibility.js';
import { highlightMesh, clearHighlight } from '../viewer/visibility.js';
import { setClippingPlane } from '../viewer/clipping.js';
import { toggleMeasurementMode } from '../viewer/measurement.js';
import { getWeakStructures, getRoadmapProgress } from '../state/learningRoadmap.js';

// Pre-mapped high-frequency Vietnamese clinical anatomical aliases
export const ANATOMICAL_SYNONYMS = {
  // Muscles
  'cơ delta': { id: 'Deltoid.l', base: 'Deltoid', system: 'muscular', nameVi: 'Cơ delta (Cơ vai)' },
  'co delta': { id: 'Deltoid.l', base: 'Deltoid', system: 'muscular', nameVi: 'Cơ delta (Cơ vai)' },
  'cơ nhị đầu': { id: 'Biceps brachii.l', base: 'Biceps brachii', system: 'muscular', nameVi: 'Cơ nhị đầu cánh tay (Chuột trước)' },
  'chuột tay': { id: 'Biceps brachii.l', base: 'Biceps brachii', system: 'muscular', nameVi: 'Cơ nhị đầu cánh tay' },
  'cơ tam đầu': { id: 'Triceps brachii.l', base: 'Triceps brachii', system: 'muscular', nameVi: 'Cơ tam đầu cánh tay (Chuột sau)' },
  'cơ tứ đầu đùi': { id: 'Quadriceps femoris.l', base: 'Quadriceps femoris', system: 'muscular', nameVi: 'Cơ tứ đầu đùi' },
  'cơ tứ đầu': { id: 'Quadriceps femoris.l', base: 'Quadriceps femoris', system: 'muscular', nameVi: 'Cơ tứ đầu đùi' },
  'cơ mông lớn': { id: 'Gluteus maximus.l', base: 'Gluteus maximus', system: 'muscular', nameVi: 'Cơ mông lớn' },
  'cơ mông': { id: 'Gluteus maximus.l', base: 'Gluteus maximus', system: 'muscular', nameVi: 'Cơ mông lớn' },
  'cơ thang': { id: 'Trapezius.l', base: 'Trapezius', system: 'muscular', nameVi: 'Cơ thang (Cơ cổ vai lưng)' },
  'cơ lưng rộng': { id: 'Latissimus dorsi.l', base: 'Latissimus dorsi', system: 'muscular', nameVi: 'Cơ lưng rộng' },
  'cơ ức đòn chũm': { id: 'Sternocleidomastoid.l', base: 'Sternocleidomastoid', system: 'muscular', nameVi: 'Cơ ức đòn chũm' },
  'cơ bắp chân': { id: 'Gastrocnemius.l', base: 'Gastrocnemius', system: 'muscular', nameVi: 'Cơ bụng chân (Bắp chân)' },

  // Nerves
  'thần kinh tọa': { id: 'Sciatic nerve.l', base: 'Sciatic nerve', system: 'nervous', nameVi: 'Dây thần kinh tọa (Dây thần kinh ngồi)' },
  'thần kinh hông to': { id: 'Sciatic nerve.l', base: 'Sciatic nerve', system: 'nervous', nameVi: 'Dây thần kinh tọa' },
  'thần kinh đùi': { id: 'Femoral nerve.l', base: 'Femoral nerve', system: 'nervous', nameVi: 'Dây thần kinh đùi' },
  'tủy sống': { id: 'Spinal cord', base: 'Spinal cord', system: 'nervous', nameVi: 'Tủy sống' },

  // Bones & Joints
  'xương đùi': { id: 'Femur.l', base: 'Femur', system: 'skeletal', nameVi: 'Xương đùi' },
  'xương chậu': { id: 'Hip bone.l', base: 'Hip bone', system: 'skeletal', nameVi: 'Xương chậu (Xương hông)' },
  'xương hông': { id: 'Hip bone.l', base: 'Hip bone', system: 'skeletal', nameVi: 'Xương chậu' },
  'xương bánh chè': { id: 'Patella.l', base: 'Patella', system: 'skeletal', nameVi: 'Xương bánh chè' },
  'khớp gối': { id: 'Patella.l', base: 'Patella', system: 'skeletal', nameVi: 'Khớp gối & Xương bánh chè' },
  'xương chày': { id: 'Tibia.l', base: 'Tibia', system: 'skeletal', nameVi: 'Xương chày' },
  'xương mác': { id: 'Fibula.l', base: 'Fibula', system: 'skeletal', nameVi: 'Xương mác' },
  'xương gót': { id: 'Calcaneus.l', base: 'Calcaneus', system: 'skeletal', nameVi: 'Xương gót chân' },
  'cột sống': { id: 'Lumbar vertebra I', base: 'Vertebra', system: 'skeletal', nameVi: 'Cột sống' },
  'đốt sống cổ c1': { id: 'Atlas', base: 'Atlas', system: 'skeletal', nameVi: 'Đốt sống cổ C1 (Đốt đội - Atlas)' },
  'đốt đội': { id: 'Atlas', base: 'Atlas', system: 'skeletal', nameVi: 'Đốt sống cổ C1 (Đốt đội)' },
  'atlas': { id: 'Atlas', base: 'Atlas', system: 'skeletal', nameVi: 'Đốt sống cổ C1 (Atlas)' },
  'đốt sống cổ c2': { id: 'Axis', base: 'Axis', system: 'skeletal', nameVi: 'Đốt sống cổ C2 (Đốt trục - Axis)' },
  'đốt trục': { id: 'Axis', base: 'Axis', system: 'skeletal', nameVi: 'Đốt sống cổ C2 (Đốt trục)' },
  'axis': { id: 'Axis', base: 'Axis', system: 'skeletal', nameVi: 'Đốt sống cổ C2 (Axis)' },
  'đốt sống thắt lưng': { id: 'Lumbar vertebra I', base: 'Lumbar vertebra', system: 'skeletal', nameVi: 'Đốt sống thắt lưng' },
  'xương cùng': { id: 'Sacrum', base: 'Sacrum', system: 'skeletal', nameVi: 'Xương cùng (Sacrum)' },
  'xương cụt': { id: 'Coccyx', base: 'Coccyx', system: 'skeletal', nameVi: 'Xương cụt (Coccyx)' },
  'xương đòn': { id: 'Clavicle.l', base: 'Clavicle', system: 'skeletal', nameVi: 'Xương đòn (Quai xanh)' },
  'quai xanh': { id: 'Clavicle.l', base: 'Clavicle', system: 'skeletal', nameVi: 'Xương đòn (Quai xanh)' },
  'xương bả vai': { id: 'Scapula.l', base: 'Scapula', system: 'skeletal', nameVi: 'Xương bả vai' },
  'xương cánh tay': { id: 'Humerus.l', base: 'Humerus', system: 'skeletal', nameVi: 'Xương cánh tay' },
  'xương quay': { id: 'Radius.l', base: 'Radius', system: 'skeletal', nameVi: 'Xương quay cẳng tay' },
  'xương trụ': { id: 'Ulna.l', base: 'Ulna', system: 'skeletal', nameVi: 'Xương trụ cẳng tay' },
  'xương sọ': { id: 'Frontal bone', base: 'Frontal bone', system: 'skeletal', nameVi: 'Hộp sọ (Xương trán)' },
  'xương trán': { id: 'Frontal bone', base: 'Frontal bone', system: 'skeletal', nameVi: 'Xương trán' },
  'xương hàm dưới': { id: 'Mandible', base: 'Mandible', system: 'skeletal', nameVi: 'Xương hàm dưới' },
  'xương ức': { id: 'Body of sternum', base: 'Body of sternum', system: 'skeletal', nameVi: 'Xương ức' },
  'xương sườn': { id: 'First rib.l', base: 'First rib', system: 'skeletal', nameVi: 'Xương sườn' }
};

/**
 * Parses user input to extract semantic intent, target entities, and 3D action
 */
export function interpretAIQuery(query, activePart = null) {
  const q = query.toLowerCase().trim();

  // 1. Natural Language 3D Scene Controls

  // Intent: Compare bilateral (Trái - Phải)
  if (
    q.includes('so sánh') ||
    q.includes('hai bên') ||
    q.includes('trái phải') ||
    q.includes('trái - phải') ||
    q.includes('đối xứng')
  ) {
    const matched = findTargetStructure(q, activePart);
    return {
      intent: 'COMPARE_BILATERAL',
      target: matched,
      rawQuery: query
    };
  }

  // Intent: System hide/show (e.g. "ẩn cơ để xem thần kinh", "bật hệ thần kinh", "tắt cơ", "chỉ xem xương")
  if (
    q.includes('ẩn cơ') ||
    q.includes('tắt cơ') ||
    q.includes('xem thần kinh') ||
    q.includes('bật thần kinh') ||
    q.includes('bật mạch máu') ||
    q.includes('chỉ xem xương') ||
    q.includes('ẩn xương')
  ) {
    let hideSystems = [];
    let showSystems = [];

    if (q.includes('cơ')) {
      if (q.includes('ẩn') || q.includes('tắt')) hideSystems.push('muscular');
      else if (q.includes('bật') || q.includes('xem')) showSystems.push('muscular');
    }
    if (q.includes('thần kinh')) {
      showSystems.push('nervous');
    }
    if (q.includes('mạch máu') || q.includes('tim mạch')) {
      showSystems.push('cardiovascular');
    }
    if (q.includes('chỉ xem xương')) {
      showSystems.push('skeletal');
      hideSystems.push('muscular', 'visceral', 'joints');
    }

    return {
      intent: 'SYSTEM_CONTROL',
      hideSystems,
      showSystems,
      rawQuery: query
    };
  }

  // Intent: Focus / Locate structure (e.g. "chỉ cơ delta", "tìm xương đùi", "cho tôi xem...")
  if (
    q.startsWith('chỉ ') ||
    q.startsWith('tìm ') ||
    q.startsWith('xem ') ||
    q.startsWith('cho xem ') ||
    q.startsWith('cho tôi xem ') ||
    q.startsWith('ở đâu') ||
    q.includes('ở vị trí nào') ||
    q.startsWith('focus ') ||
    q.startsWith('chỉ vào ')
  ) {
    const matched = findTargetStructure(q, activePart);
    if (matched) {
      return {
        intent: 'FOCUS_STRUCTURE',
        target: matched,
        rawQuery: query
      };
    }
  }

  // Intent: Isolate
  if (q.includes('cô lập') || q.includes('isolate') || q.includes('chỉ giữ lại')) {
    const matched = findTargetStructure(q, activePart);
    return {
      intent: 'ISOLATE_STRUCTURE',
      target: matched || activePart,
      rawQuery: query
    };
  }

  // Intent: Dissect / Hide part
  if (q.includes('bóc tách') || q.includes('mổ') || q.includes('ẩn cấu trúc') || q.includes('ẩn đi')) {
    return {
      intent: 'DISSECT_PART',
      target: activePart,
      rawQuery: query
    };
  }

  // Intent: 3D Cross-section / Clipping
  if (q.includes('mặt cắt') || q.includes('cắt dọc') || q.includes('cắt ngang') || q.includes('sagittal') || q.includes('axial')) {
    let plane = 'sagittal';
    if (q.includes('ngang') || q.includes('axial')) plane = 'axial';
    if (q.includes('đứng ngang') || q.includes('coronal')) plane = 'coronal';
    return {
      intent: 'CLIPPING_CONTROL',
      plane,
      rawQuery: query
    };
  }

  // Intent: Caliper / Measurement
  if (q.includes('thước đo') || q.includes('đo kích thước') || q.includes('đo khoảng cách') || q.includes('kích thước bao nhiêu')) {
    return {
      intent: 'MEASURE_CONTROL',
      rawQuery: query
    };
  }

  // Intent: Adaptive Quiz / Review Mistakes
  if (
    q.includes('ôn lại') ||
    q.includes('cấu trúc hay sai') ||
    q.includes('câu sai') ||
    q.includes('điểm yếu') ||
    q.includes('quiz thích ứng') ||
    q.includes('kiểm tra lại')
  ) {
    return {
      intent: 'ADAPTIVE_QUIZ',
      rawQuery: query
    };
  }

  // Intent: Roadmap & Progress
  if (q.includes('lộ trình') || q.includes('tiến độ') || q.includes('tiến bộ') || q.includes('thống kê học tập')) {
    return {
      intent: 'VIEW_ROADMAP',
      rawQuery: query
    };
  }

  // Fallback: Clinical Q&A about current or matched structure
  const matched = findTargetStructure(q, activePart);
  return {
    intent: 'CLINICAL_QNA',
    target: matched || activePart,
    rawQuery: query
  };
}

/**
 * Searches for target structure from query or active selection
 */
function findTargetStructure(query, activePart) {
  const q = query.toLowerCase();

  // 1. Check known high-yield synonyms
  for (const [synonym, data] of Object.entries(ANATOMICAL_SYNONYMS)) {
    if (q.includes(synonym)) {
      return data;
    }
  }

  // 2. Fallback to active selected part if context fits
  if (activePart) {
    return {
      id: activePart.id,
      base: activePart.info?.baseName || activePart.id,
      system: activePart.system,
      nameVi: activePart.displayName
    };
  }

  // 3. Search database
  const searchResults = searchStructures(query);
  if (searchResults.length > 0) {
    const first = searchResults[0];
    const side = first.sides[0];
    return {
      id: side?.id || first.baseName,
      base: first.baseName,
      system: first.system,
      nameVi: first.name?.vi || first.baseName
    };
  }

  return null;
}

/**
 * Executes AI 3D actions and builds an authoritative, grounded response
 */
export async function executeAICommand(interpreted, viewer) {
  const { intent, target, rawQuery, hideSystems, showSystems, plane } = interpreted;

  // 1. FOCUS STRUCTURE
  if (intent === 'FOCUS_STRUCTURE' && target) {
    if (viewer) {
      const sys = target.system;
      if (sys && !state.loadedSystems.includes(sys)) {
        loadModel(sys, viewer).then(() => {
          showSystem(sys);
          selectPartById(target.id, viewer);
        }).catch(err => console.warn('Failed background load of', sys, err));
      } else {
        if (sys) showSystem(sys);
        selectPartById(target.id, viewer);
      }
    }
    const clinical = getClinicalData(target.id, target.base);
    return {
      action: 'FOCUS',
      actionBadge: `🎯 AI đã định vị & làm nổi bật: ${target.nameVi}`,
      speechText: `Đã tìm thấy ${target.nameVi}.`,
      message: `
        **${clinical.nameVi}** *(Latin: ${clinical.nameLatin || ''})*
        - **Hệ cơ quan:** ${clinical.systemVi}
        - **Chức năng chính:** ${clinical.function}
        - **Liên quan lâm sàng:** ${clinical.clinical}
      `.trim(),
      data: clinical,
      partId: target.id
    };
  }

  // 2. SYSTEM CONTROL ("ẩn cơ để xem thần kinh", "bật hệ thần kinh",...)
  if (intent === 'SYSTEM_CONTROL') {
    let actionDesc = [];
    if (hideSystems?.length) {
      hideSystems.forEach(sys => {
        hideSystem(sys);
        actionDesc.push(`Ẩn ${getSystemNameVi(sys)}`);
      });
    }
    if (showSystems?.length) {
      showSystems.forEach(sys => {
        if (viewer && !state.loadedSystems.includes(sys)) {
          loadModel(sys, viewer).then(() => showSystem(sys)).catch(() => {});
        } else {
          showSystem(sys);
        }
        actionDesc.push(`Bật ${getSystemNameVi(sys)}`);
      });
    }
    viewer?.render();

    return {
      action: 'SYSTEM_VISIBILITY',
      actionBadge: `👁️ AI đã điều chỉnh: ${actionDesc.join(', ')}`,
      message: `
        Đã điều chỉnh các lớp giải phẫu theo yêu cầu:
        ${actionDesc.map(d => `- ✅ **${d}**`).join('\n')}
        
        *💡 Mẹo y khoa:* Khi ẩn các khối cơ nông, bạn có thể quan sát rõ đường đi của các bó mạch thần kinh sâu bên dưới và diện tiếp khớp giữa các xương.
      `.trim()
    };
  }

  // 3. COMPARE BILATERAL (So sánh trái - phải)
  if (intent === 'COMPARE_BILATERAL') {
    const t = target || { id: 'Femur.l', base: 'Femur', nameVi: 'Xương đùi', system: 'skeletal' };
    const leftId = t.base + '.l';
    const rightId = t.base + '.r';

    if (viewer) {
      const sys = t.system || 'skeletal';
      if (!state.loadedSystems.includes(sys)) {
        loadModel(sys, viewer).then(() => {
          showSystem(sys);
          highlightMesh(leftId, 0x00f0ff, 0.9);
          highlightMesh(rightId, 0xffd700, 0.9);
          selectPartById(leftId, viewer);
          viewer?.render();
        }).catch(() => {});
      } else {
        showSystem(sys);
        highlightMesh(leftId, 0x00f0ff, 0.9);
        highlightMesh(rightId, 0xffd700, 0.9);
        selectPartById(leftId, viewer);
        viewer?.render();
      }
    }

    // Highlight both in 3D
    highlightMesh(leftId, 0x00f0ff, 0.9);
    highlightMesh(rightId, 0xffd700, 0.9);
    viewer?.render();

    const clinical = getClinicalData(leftId, t.base);

    return {
      action: 'COMPARE_BILATERAL',
      actionBadge: `⚖️ AI đang so sánh hai bên: ${clinical.nameVi} (Trái 🔵 & Phải 🟡)`,
      message: `
        ### ⚖️ So Sánh Giải Phẫu Đối Xứng: ${clinical.nameVi}
        - **Đặc điểm hình thái:** Cấu trúc đối xứng gương qua mặt phẳng đứng dọc giữa (*Mid-sagittal plane*).
        - **Cơ chế chịu lực & Động học:** Hai bên phối hợp đồng vận để phân bổ tải trọng cơ thể đều 50/50 qua khung chậu xuống hai chân khi đứng thẳng.
        - **Ý nghĩa lâm sàng sai lệch:**
          - Sự bất đối xứng chiều dài (>0.5 - 1.0 cm) gây lệch vẹo xương chậu và vẹo cột sống phản ứng (*Compensatory scoliosis*).
          - Lệch tải trọng dẫn đến mòn sụn không đều ở một bên khớp (*Unilateral osteoarthritis*).
        - **Liên quan thần kinh:** Chi phối đối xứng bởi các rễ thần kinh tương ứng ở hai bên tủy sống.
      `.trim(),
      partId: leftId
    };
  }

  // 4. CLIPPING CONTROL
  if (intent === 'CLIPPING_CONTROL') {
    setClippingPlane(plane || 'sagittal', viewer);
    const planeName = plane === 'sagittal' ? 'Đứng dọc (Sagittal)' : plane === 'coronal' ? 'Đứng ngang (Coronal)' : 'Ngang (Axial)';
    return {
      action: 'CLIPPING',
      actionBadge: `🔪 AI đã kích hoạt Mặt cắt 3D: ${planeName}`,
      message: `Đã kích hoạt mặt phẳng cắt **${planeName}**. Bạn có thể dùng thanh trượt để di chuyển mặt cắt đi xuyên qua các lớp giải phẫu bên trong cơ thể.`
    };
  }

  // 5. MEASURE CONTROL
  if (intent === 'MEASURE_CONTROL') {
    toggleMeasurementMode(viewer);
    return {
      action: 'MEASURE',
      actionBadge: `📏 AI đã bật Thước đo 3D Caliper`,
      message: `Đã mở thước đo kích thước 3D thực tế. Hãy chạm 2 điểm bất kỳ trên mô hình để tính khoảng cách giải phẫu theo cm và mm.`
    };
  }

  // 6. ADAPTIVE QUIZ
  if (intent === 'ADAPTIVE_QUIZ') {
    const weakList = getWeakStructures();
    return {
      action: 'TRIGGER_ADAPTIVE_QUIZ',
      actionBadge: `🎯 AI sẵn sàng mở bài kiểm tra thích ứng`,
      message: weakList.length > 0
        ? `Hệ thống ghi nhận bạn đang có **${weakList.length} cấu trúc cần củng cố** (như *${weakList.slice(0, 3).map(w => w.title).join(', ')}*). Nhấn nút bên dưới để bắt đầu bài thi thích ứng tập trung đúng điểm yếu!`
        : `Hiện tại bạn chưa có câu sai nào được ghi nhận. Hệ thống sẽ tạo bài kiểm tra tổng hợp 5 câu ngẫu nhiên để thử thách năng lực!`
    };
  }

  // 7. VIEW ROADMAP
  if (intent === 'VIEW_ROADMAP') {
    const progress = getRoadmapProgress();
    return {
      action: 'OPEN_ROADMAP',
      actionBadge: `📊 Lộ trình học: Hoàn thành ${progress.overallPercentage}%`,
      message: `
        ### 📊 Tiến Trình Học Tập Của Bạn
        - **Tiến độ tổng thể:** **${progress.overallPercentage}%**
        - **Cấu trúc đã thành thạo:** ${progress.totalMastered} cấu trúc
        - **Tỷ lệ trả lời chính xác:** ${progress.accuracyRate}%
        - **Chuỗi học liên tục:** ${progress.streakDays} ngày 🔥
        - **Điểm yếu cần ôn:** ${progress.weakCount} cấu trúc
      `.trim()
    };
  }

  // 8. CLINICAL Q&A (Grounded Medical Knowledge)
  if (target) {
    const clinical = getClinicalData(target.id, target.base);
    const rel = clinical.relations || {};

    let answerContent = '';
    const qLower = rawQuery.toLowerCase();

    if (qLower.includes('thần kinh') || qLower.includes('dây thần kinh')) {
      answerContent = `
        **Chi phối Thần kinh của ${clinical.nameVi}:**
        ⚡ ${rel.nerves || 'Được chi phối bởi các nhánh thần kinh vận động và cảm giác khu vực.'}
      `.trim();
    } else if (qLower.includes('mạch máu') || qLower.includes('máu') || qLower.includes('động mạch')) {
      answerContent = `
        **Cấp máu & Tuần hoàn của ${clinical.nameVi}:**
        🩸 ${rel.vessels || 'Được nuôi dưỡng bởi các nhánh động mạch và mạng mạch quanh vùng.'}
      `.trim();
    } else if (qLower.includes('cơ') || qLower.includes('bám')) {
      answerContent = `
        **Liên quan Cơ bắp của ${clinical.nameVi}:**
        🔴 ${rel.muscles || 'Liên kết với các gân cơ phụ trách vận động và giữ vững tư thế.'}
      `.trim();
    } else if (qLower.includes('bệnh') || qLower.includes('chấn thương') || qLower.includes('đau')) {
      answerContent = `
        **Bệnh lý & Ý nghĩa Lâm sàng của ${clinical.nameVi}:**
        🩺 ${clinical.clinical}
      `.trim();
    } else {
      // Full Academic Brief
      answerContent = `
### 📘 Thông Tin Học Thuật: ${clinical.nameVi}
*Latinh (TA2):* **${clinical.nameLatin || 'Chưa định danh'}** | *Tiếng Anh:* **${clinical.nameEn || ''}**

⚡ **Chức năng & Cơ sinh học:**
${clinical.function}

🔗 **4 Liên Quan Giải Phẫu Trọng Yếu:**
- 🔴 **Cơ liên quan:** ${rel.muscles || 'Gân cơ vận động chính.'}
- 🦴 **Xương & Khớp:** ${rel.bones || 'Tiếp khớp các diện xương kế cận.'}
- ⚡ **Thần kinh chi phối:** ${rel.nerves || 'Các nhánh thần kinh ngoại biên.'}
- 🩸 **Mạch máu cấp máu:** ${rel.vessels || 'Mạng mạch máu khu vực.'}

🩺 **Ý Nghĩa Lâm Sàng & Tổn Thương:**
${clinical.clinical}
      `.trim();
    }

    return {
      action: 'CLINICAL_ANSWER',
      message: answerContent,
      data: clinical,
      partId: target.id
    };
  }

  // General Fallback
  return {
    action: 'ASSISTANT_REPLY',
    message: `
      Xin chào! Tôi là Trợ lý AI Giải Phẫu 3D. Tôi có thể giúp bạn:
      - 🎯 **Điều khiển 3D bằng giọng lệnh:** Gõ *"chỉ cơ delta"*, *"tìm xương đùi"*, *"xương chày ở đâu"*...
      - 👁️ **Bóc tách nhiều lớp:** Gõ *"ẩn cơ để xem thần kinh"*, *"chỉ xem xương"*...
      - ⚖️ **So sánh đối xứng:** Gõ *"so sánh xương đùi trái-phải"*...
      - 📚 **Hỏi đáp giải phẫu học:** Hỏi chức năng, thần kinh, mạch máu của bất kỳ bộ phận nào đang chọn.
      - 🎯 **Ôn luyện điểm yếu:** Gõ *"ôn lại cấu trúc hay sai"* để mở quiz thích ứng.
    `.trim()
  };
}

function getSystemNameVi(systemId) {
  const map = {
    skeletal: 'Hệ Xương',
    muscular: 'Hệ Cơ',
    nervous: 'Hệ Thần kinh',
    cardiovascular: 'Hệ Tim mạch',
    visceral: 'Hệ Nội tạng',
    joints: 'Hệ Khớp',
    lymphatic: 'Hệ Bạch huyết'
  };
  return map[systemId] || systemId;
}
