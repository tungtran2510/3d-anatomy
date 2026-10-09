/**
 * MULTI-LAYER DISSECTION ENGINE (HỆ THỐNG PHẪU TÍCH ĐA LỚP Y KHOA)
 * 
 * Chuẩn y khoa: Cơ quan giải phẫu có cấu trúc nhiều lớp (superficial -> deep).
 * Khi bóc tách, hệ thống tiến hành bóc tách tuần tự từng lớp:
 *  - Lớp 1: Bóc tách lớp nông / thành trước / màng bao / vỏ ngoài
 *           -> Làm lộ lòng cơ quan, niêm mạc, buồng tim, nhân nhầy, đài bể thận, v.v.
 *  - Lớp 2: Bóc tách lớp sâu / thành sau / toàn bộ khối cơ quan
 *           -> Làm lộ các cơ quan & bó mạch phía sau.
 * 
 * Hỗ trợ Hoàn tác (Undo) theo từng bước chính xác.
 */

import { state, pushUndo, notify } from '../state/store.js';
import { getMeshRegistry, ownMeshesOf } from './loadModel.js';
import { 
  setStructureVisible, 
  hidePart, 
  showPart, 
  getPartVisibility,
  setPartTransparency,
  toggleStomachDissection,
  isStomachDissected 
} from './visibility.js';
import { deselectPart, selectPart } from './selection.js';
import { showToast } from '../ui/sidebar.js';
import { getVietnameseName } from '../data/vietnamese.js';

/**
 * Kiểm tra xem một cơ quan có hỗ trợ bóc tách từng lớp hay không
 */
export function hasDissectionLayers(partId) {
  if (!partId) return false;
  const idLower = String(partId).toLowerCase();
  if (idLower === 'skin' || idLower.includes('lớp da') || idLower.includes('da bề mặt')) return true;
  if (idLower.includes('stomach') || idLower.includes('dạ dày')) return true;
  if (/intervertebral[ _]disc/i.test(partId)) return true;
  if (/kidney|thận/i.test(partId)) return true;
  if (partId === 'Liver' || idLower.includes('gan')) return true;
  if (idLower.includes('ventricle') || idLower.includes('thất') || idLower.includes('heart') || idLower.includes('tim') || idLower.includes('myocard') || idLower.includes('atrium') || idLower.includes('nhĩ')) return true;
  if (/superior lobe of (left|right) lung/i.test(partId)) return true;
  if (/pectoralis major/i.test(partId)) return true;
  if (/rectus abdominis/i.test(partId)) return true;
  return false;
}

/**
 * Bóc tách giải phẫu đa lớp (Multi-Layer Dissection)
 * Thực thi bóc tách tuần tự: Lớp 1 (thành trước/lớp nông) -> Lớp 2 (thành sau/toàn bộ)
 */
export function dissectMultiLayer(rawPartId, viewer = state.viewer) {
  if (!rawPartId) return false;
  const idLower = String(rawPartId).toLowerCase();
  const targetViewer = viewer || state.viewer;

  // 0. HỆ DA (SKIN / INTEGUMENTARY) - MÔ HÌNH 2 LỚP: BIỂU BÌ THẤU QUANG -> BÓC TÁCH TOÀN BỘ
  if (idLower === 'skin' || idLower.includes('lớp da') || idLower.includes('da bề mặt')) {
    const skinMeshes = ownMeshesOf('Skin');
    const isSolid = skinMeshes.some(m => !m.material?.transparent || (m.material?.opacity ?? 1.0) > 0.8);

    if (isSolid) {
      // BƯỚC 1: Bóc tách lớp da ngoài thành thấu quang X-ray (opacity 0.35) -> Lộ toàn bộ cơ bắp & mạch máu
      setPartTransparency('Skin', 0.35);
      pushUndo({
        type: 'dissect_layer',
        organ: 'Skin',
        layerIndex: 1,
        peeledId: 'Skin',
        layerNameVi: 'Lớp da bề mặt (Chuyển thấu quang X-ray)'
      });
      targetViewer?.render?.();
      showToast('🔪 Bóc tách Lớp 1 (Lớp da): Chuyển thấu quang X-ray, lộ cơ bắp & mạch máu dưới da!');
      return { success: true, organ: 'Skin', layerIndex: 1, isFinal: false };
    } else {
      // BƯỚC 2: Bóc tách toàn bộ lớp da
      hidePart('Skin');
      pushUndo({
        type: 'dissect_layer',
        organ: 'Skin',
        layerIndex: 2,
        peeledId: 'Skin',
        layerNameVi: 'Toàn bộ lớp da'
      });
      deselectPart();
      targetViewer?.render?.();
      showToast('🔪 Bóc tách Lớp 2 (Toàn bộ da): Bóc tách sạch lớp da, mở khoang giải phẫu sâu!');
      return { success: true, organ: 'Skin', layerIndex: 2, isFinal: true };
    }
  }

  // 1. DẠ DÀY (STOMACH) - MÔ HÌNH 2 LỚP: THÀNH TRƯỚC -> THÀNH SAU & LÒNG DẠ DÀY
  if (idLower.includes('stomach') || idLower.includes('dạ dày')) {
    const isAlreadyOpen = isStomachDissected();

    if (!isAlreadyOpen) {
      // BƯỚC 1: Bóc tách thành trước để mở lòng dạ dày
      toggleStomachDissection(true);
      pushUndo({
        type: 'dissect_layer',
        organ: 'Stomach',
        layerIndex: 1,
        peeledId: 'Stomach_AnteriorWall',
        layerNameVi: 'Thành trước dạ dày'
      });
      targetViewer?.render?.();
      showToast('🔪 Bóc tách Lớp 1 (Thành trước dạ dày): Mở lòng dạ dày, lộ niêm mạc & nếp gấp rugae!');
      return { success: true, organ: 'Stomach', layerIndex: 1, isFinal: false };
    } else {
      // BƯỚC 2: Bóc tách thành sau & toàn bộ dạ dày
      hidePart('Stomach');
      pushUndo({
        type: 'dissect_layer',
        organ: 'Stomach',
        layerIndex: 2,
        peeledId: 'Stomach',
        layerNameVi: 'Thành sau dạ dày'
      });
      deselectPart();
      targetViewer?.render?.();
      showToast('🔪 Bóc tách Lớp 2 (Thành sau dạ dày): Lộ tụy tạng & động mạch lách phía sau!');
      return { success: true, organ: 'Stomach', layerIndex: 2, isFinal: true };
    }
  }

  // 2. CỘT SỐNG & ĐĨA ĐỆM (INTERVERTEBRAL DISCS & NUCLEUS PULPOSUS)
  const discMatch = rawPartId.match(/intervertebral[ _]disc\s*([A-Za-z0-9-]+)?/i);
  if (discMatch) {
    const level = discMatch[1] || '';
    const discPartId = level ? `Intervertebral disc ${level}` : rawPartId;
    const nucleusPartId = level ? `Nucleus pulposus ${level}` : `Nucleus pulposus`;
    const discVis = getPartVisibility(discPartId);

    if (discVis.visible) {
      // BƯỚC 1: Bóc tách vòng sợi fibrocartilage bên ngoài -> Giữ nguyên nhân nhầy (Nucleus pulposus) bên trong!
      setStructureVisible(discPartId, false);
      setStructureVisible(nucleusPartId, true);
      pushUndo({
        type: 'dissect_layer',
        organ: 'IntervertebralDisc',
        level,
        layerIndex: 1,
        peeledId: discPartId,
        layerNameVi: `Vòng sợi đĩa đệm ${level}`
      });
      // Tự động chuyển tiêu điểm sang nhân nhầy vừa lộ
      selectPart(nucleusPartId, targetViewer, true);
      targetViewer?.render?.();
      showToast(`🔪 Bóc tách Lớp 1 (Vòng sợi đĩa đệm ${level}): Lộ nhân nhầy (Nucleus pulposus) bên trong!`);
      return { success: true, organ: 'IntervertebralDisc', layerIndex: 1, isFinal: false };
    } else {
      // BƯỚC 2: Bóc tách nhân nhầy
      hidePart(nucleusPartId);
      pushUndo({
        type: 'dissect_layer',
        organ: 'IntervertebralDisc',
        level,
        layerIndex: 2,
        peeledId: nucleusPartId,
        layerNameVi: `Nhân nhầy đĩa đệm ${level}`
      });
      deselectPart();
      targetViewer?.render?.();
      showToast(`🔪 Bóc tách Lớp 2 (Nhân nhầy đĩa đệm ${level})`);
      return { success: true, organ: 'IntervertebralDisc', layerIndex: 2, isFinal: true };
    }
  }

  // 3. THẬN & ĐÀI BỂ THẬN (KIDNEY & RENAL PELVIS) - MÔ HÌNH 2 LỚP: VỎ NHU MÔ NGOÀI -> ĐÀI BỂ THẬN, MẠCH MÁU & NIỆU QUẢN
  if (/kidney|thận/i.test(rawPartId)) {
    const side = rawPartId.toLowerCase().includes('left') || rawPartId.toLowerCase().includes('.l') || rawPartId.toLowerCase().includes('trái') ? '.l' : '.r';
    const sideVi = side === '.l' ? 'trái' : 'phải';
    const kidneyId = `Kidney${side}`;
    const pelvisId = `Renal pelvis${side}`;
    const ureterId = `Ureter${side}`;
    const suprarenalId = `Suprarenal gland${side}`;
    const kidneyVis = getPartVisibility(kidneyId);

    if (kidneyVis.visible) {
      // BƯỚC 1: Bóc tách mở cửa sổ phẫu thuật vỏ nhu mô thận -> Cắt sạch lớp vỏ, lộ 100% đài bể thận, niệu quản & mạch máu sắc nét!
      setStructureVisible(kidneyId, false);
      setStructureVisible(pelvisId, true);
      setStructureVisible(ureterId, true);
      setStructureVisible(suprarenalId, true);
      pushUndo({
        type: 'dissect_layer',
        organ: 'Kidney',
        side,
        layerIndex: 1,
        peeledId: kidneyId,
        layerNameVi: `Vỏ nhu mô thận ${sideVi}`
      });
      selectPart(pelvisId, targetViewer, true);
      targetViewer?.render?.();
      showToast(`🔪 Mở phẫu trường Thận ${sideVi}: Lộ rõ đài bể thận (Renal pelvis), niệu quản & rốn thận sắc nét!`);
      return { success: true, organ: 'Kidney', layerIndex: 1, isFinal: false };
    } else {
      // BƯỚC 2: Bóc tách đài bể thận & các cấu trúc rốn thận
      hidePart(pelvisId);
      pushUndo({
        type: 'dissect_layer',
        organ: 'Kidney',
        side,
        layerIndex: 2,
        peeledId: pelvisId,
        layerNameVi: `Đài bể thận ${sideVi}`
      });
      deselectPart();
      targetViewer?.render?.();
      showToast(`🔪 Bóc tách Lớp 2 (Đài bể thận ${sideVi}): Lộ khoang sau phúc mạc!`);
      return { success: true, organ: 'Kidney', layerIndex: 2, isFinal: true };
    }
  }

  // 4. GAN (LIVER) - NHU MÔ TRƯỚC -> TOÀN BỘ GAN
  if (rawPartId === 'Liver' || idLower.includes('gan')) {
    const liverVis = getPartVisibility('Liver');
    if (liverVis.visible && liverVis.opacity > 0.4) {
      // BƯỚC 1: Bóc tách lớp nhu mô bề mặt gan (làm trong suốt 0.22) -> Lộ túi mật, đường mật ngoài gan & tĩnh mạch cửa!
      setPartTransparency('Liver', 0.22);
      pushUndo({
        type: 'dissect_layer',
        organ: 'Liver',
        layerIndex: 1,
        peeledId: 'Liver',
        layerNameVi: 'Nhu mô bề mặt gan'
      });
      targetViewer?.render?.();
      showToast('🔪 Bóc tách Lớp 1 (Nhu mô gan): Làm trong suốt để lộ túi mật, đường mật & tĩnh mạch cửa!');
      return { success: true, organ: 'Liver', layerIndex: 1, isFinal: false };
    } else {
      // BƯỚC 2: Bóc tách toàn bộ khối gan
      hidePart('Liver');
      pushUndo({
        type: 'dissect_layer',
        organ: 'Liver',
        layerIndex: 2,
        peeledId: 'Liver',
        layerNameVi: 'Toàn bộ gan'
      });
      deselectPart();
      targetViewer?.render?.();
      showToast('🔪 Bóc tách Lớp 2 (Toàn bộ gan): Lộ tụy tạng, tĩnh mạch chủ dưới & tá tràng!');
      return { success: true, organ: 'Liver', layerIndex: 2, isFinal: true };
    }
  }

  // 5. TIM (HEART) - BÓC TÁCH PHẪU TÍCH ĐA TẦNG: THÀNH TRƯỚC TÂM THẤT -> MỞ CỬA SỔ PHẪU TRƯỜNG, LỘ 100% BUỒNG TIM, CƠ NHÚ & BỘ MÁY VAN TIM SẮC LẸM
  if (idLower.includes('ventricle') || idLower.includes('thất') || idLower.includes('heart') || idLower.includes('tim') || idLower.includes('myocard') || idLower.includes('atrium') || idLower.includes('nhĩ')) {
    const isLeft = idLower.includes('left') || idLower.includes('trái');
    const targetVentricle = isLeft ? 'Left ventricle' : 'Right ventricle';
    const targetVi = isLeft ? 'tâm thất trái' : 'tâm thất phải';
    const vVis = getPartVisibility(targetVentricle);

    if (vVis.visible) {
      // BƯỚC 1: Mở cửa sổ phẫu thuật thành trước tâm thất -> Cắt sạch thành cơ, để lộ 100% buồng tim bên trong, các cột cơ nhú & bộ máy van tim sắc lẹm!
      setStructureVisible(targetVentricle, false);
      const internalStructures = [
        'Anterior papillary muscle of right ventricle',
        'Inferior papillary muscle of right ventricle',
        'Septal papillary muscle of right ventricle',
        'Septal leaflet of right atrioventricular valve',
        'Inferior leaflet of right atrioventricular valve',
        'Anterior semilunar leaflet of pulmonary valve',
        'Left semilunar leaflet of pulmonary valve',
        'Right semilunar leaflet of pulmonary valve',
        'Inferior papillary muscle of left ventricle',
        'Posterior leaflet of left atrioventricular valve'
      ];
      internalStructures.forEach(id => setStructureVisible(id, true));
      pushUndo({
        type: 'dissect_layer',
        organ: 'Heart',
        targetPart: targetVentricle,
        layerIndex: 1,
        peeledId: targetVentricle,
        layerNameVi: `Thành trước ${targetVi}`
      });
      const focusTarget = isLeft ? 'Inferior papillary muscle of left ventricle' : 'Anterior papillary muscle of right ventricle';
      selectPart(focusTarget, targetViewer, true);
      targetViewer?.render?.();
      showToast(`🔪 Mở phẫu trường ${targetVi}: Cắt thành trước, lộ rõ buồng thất, cơ nhú & bộ máy van tim!`);
      return { success: true, organ: 'Heart', layerIndex: 1, isFinal: false };
    } else {
      // BƯỚC 2: Bóc tách cơ nhú trong buồng thất
      const innerTarget = isLeft ? 'Inferior papillary muscle of left ventricle' : 'Anterior papillary muscle of right ventricle';
      hidePart(innerTarget);
      pushUndo({
        type: 'dissect_layer',
        organ: 'Heart',
        targetPart: innerTarget,
        layerIndex: 2,
        peeledId: innerTarget,
        layerNameVi: `Cơ nhú ${targetVi}`
      });
      deselectPart();
      targetViewer?.render?.();
      showToast(`🔪 Bóc tách Lớp 2 (Cơ nhú ${targetVi}): Lộ vách liên thất sâu!`);
      return { success: true, organ: 'Heart', layerIndex: 2, isFinal: true };
    }
  }

  // 6. PHỔI (LUNGS) - BÓC TÁCH THÙY TRÊN TRƯỚC
  if (/superior lobe of left lung/i.test(rawPartId)) {
    hidePart('Superior lobe of left lung');
    pushUndo({
      type: 'dissect_layer',
      organ: 'Lung',
      layerIndex: 1,
      peeledId: 'Superior lobe of left lung',
      layerNameVi: 'Thùy trên phổi trái'
    });
    targetViewer?.render?.();
    showToast('🔪 Bóc tách Lớp 1 (Thùy trên phổi trái): Lộ cây phế quản & mạch máu rốn phổi!');
    return { success: true, organ: 'Lung', layerIndex: 1, isFinal: false };
  }
  if (/superior lobe of right lung/i.test(rawPartId)) {
    hidePart('Superior lobe of right lung');
    pushUndo({
      type: 'dissect_layer',
      organ: 'Lung',
      layerIndex: 1,
      peeledId: 'Superior lobe of right lung',
      layerNameVi: 'Thùy trên phổi phải'
    });
    targetViewer?.render?.();
    showToast('🔪 Bóc tách Lớp 1 (Thùy trên phổi phải): Lộ cây phế quản & rốn phổi phải!');
    return { success: true, organ: 'Lung', layerIndex: 1, isFinal: false };
  }

  // 7. CƠ NÔNG (CƠ NGỰC LỚN, CƠ THẲNG BỤNG)
  if (/pectoralis major/i.test(rawPartId)) {
    hidePart(rawPartId);
    pushUndo({
      type: 'dissect_layer',
      organ: 'Muscle',
      layerIndex: 1,
      peeledId: rawPartId,
      layerNameVi: getVietnameseName(rawPartId)
    });
    deselectPart();
    targetViewer?.render?.();
    showToast(`🔪 Bóc tách Lớp 1 (${getVietnameseName(rawPartId)}): Lộ cơ ngực bé & khung xương sườn!`);
    return { success: true, organ: 'Muscle', layerIndex: 1, isFinal: false };
  }
  if (/rectus abdominis/i.test(rawPartId)) {
    hidePart(rawPartId);
    pushUndo({
      type: 'dissect_layer',
      organ: 'Muscle',
      layerIndex: 1,
      peeledId: rawPartId,
      layerNameVi: getVietnameseName(rawPartId)
    });
    deselectPart();
    targetViewer?.render?.();
    showToast(`🔪 Bóc tách Lớp 1 (${getVietnameseName(rawPartId)}): Lộ cơ chéo bụng trong & cơ ngang bụng!`);
    return { success: true, organ: 'Muscle', layerIndex: 1, isFinal: false };
  }

  // 8. TẤT CẢ CÁC BỘ PHẬN ĐƠN LẺ KHÁC (FALLBACK CHUẨN)
  pushUndo({
    type: 'dissect',
    partId: rawPartId
  });
  hidePart(rawPartId);
  const partNameVi = getVietnameseName(rawPartId);
  deselectPart();
  targetViewer?.render?.();
  showToast(`🔪 Đã bóc tách: ${partNameVi}`);
  return { success: true, organ: rawPartId, layerIndex: 1, isFinal: true };
}

/**
 * Khôi phục khi Hoàn tác (Undo) một thao tác bóc tách đa lớp
 */
export function restoreDissectLayer(action, viewer = state.viewer) {
  if (!action || action.type !== 'dissect_layer') return null;
  const targetViewer = viewer || state.viewer;

  if (action.organ === 'Stomach') {
    if (action.layerIndex === 1) {
      // Đóng kín thành trước dạ dày
      toggleStomachDissection(false);
      setStructureVisible('Stomach_AnteriorWall', true);
      setStructureVisible('Stomach', true);
    } else if (action.layerIndex === 2) {
      // Khôi phục thành sau, giữ lòng dạ dày mở
      setStructureVisible('Stomach', true);
      toggleStomachDissection(true);
    }
  } else if (action.organ === 'IntervertebralDisc') {
    if (action.layerIndex === 1) {
      setStructureVisible(action.peeledId, true);
    } else {
      setStructureVisible(action.peeledId, true);
    }
  } else if (action.organ === 'Kidney') {
    if (action.layerIndex === 1) {
      setStructureVisible(action.peeledId, true);
      setPartTransparency(action.peeledId, 1.0);
    } else {
      setStructureVisible(action.peeledId, true);
      setPartTransparency(action.peeledId, 1.0);
    }
  } else if (action.organ === 'Liver') {
    if (action.layerIndex === 1) {
      setPartTransparency('Liver', 1.0);
    } else {
      setStructureVisible('Liver', true);
      setPartTransparency('Liver', 0.22);
    }
  } else if (action.organ === 'Heart') {
    const part = action.targetPart || action.peeledId || 'Right ventricle';
    if (action.layerIndex === 1) {
      setStructureVisible(part, true);
      setPartTransparency(part, 1.0);
    } else {
      setStructureVisible(part, true);
      setPartTransparency(part, 1.0);
    }
  } else if (action.organ === 'Skin') {
    if (action.layerIndex === 1) {
      setPartTransparency('Skin', 1.0);
    } else {
      setStructureVisible('Skin', true);
      setPartTransparency('Skin', 0.35);
    }
  } else {
    showPart(action.peeledId);
  }

  targetViewer?.render?.();
  return `Đã hoàn tác: Khôi phục ${action.layerNameVi || action.peeledId}`;
}

/**
 * Làm lại khi Redo một thao tác bóc tách đa lớp
 */
export function redoDissectLayer(action, viewer = state.viewer) {
  if (!action || action.type !== 'dissect_layer') return null;
  const targetViewer = viewer || state.viewer;

  if (action.organ === 'Stomach') {
    if (action.layerIndex === 1) {
      toggleStomachDissection(true);
    } else {
      hidePart('Stomach');
    }
  } else if (action.organ === 'IntervertebralDisc') {
    if (action.layerIndex === 1) {
      setStructureVisible(action.peeledId, false);
    } else {
      hidePart(action.peeledId);
    }
  } else if (action.organ === 'Kidney') {
    if (action.layerIndex === 1) {
      setStructureVisible(action.peeledId, false);
    } else {
      hidePart(action.peeledId);
    }
  } else if (action.organ === 'Liver') {
    if (action.layerIndex === 1) {
      setPartTransparency('Liver', 0.22);
    } else {
      hidePart('Liver');
    }
  } else if (action.organ === 'Heart') {
    const part = action.targetPart || action.peeledId || 'Right ventricle';
    if (action.layerIndex === 1) {
      setStructureVisible(part, false);
    } else {
      hidePart(part);
    }
  } else if (action.organ === 'Skin') {
    if (action.layerIndex === 1) {
      setPartTransparency('Skin', 0.35);
    } else {
      hidePart('Skin');
    }
  } else {
    hidePart(action.peeledId);
  }

  targetViewer?.render?.();
  return `Đã làm lại: Bóc tách ${action.layerNameVi || action.peeledId}`;
}
