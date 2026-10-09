// Guided 3D Anatomical Study Mode
// Standard Medical Pedagogical Flow: Overview of Region/System -> Sequential Detailed Structures
import { selectPartById, deselectPart } from '../viewer/selection.js';
import { getClinicalData } from '../data/clinicalInfo.js';
import { openLesson, openVideo, selectStructureAnywhere } from './sidebar.js';
import { MEDICAL_TRAINING_PLAYLISTS } from '../data/atlasMediaManager.js';
import { startQuiz } from './quiz.js';
import { frameRegion } from '../viewer/camera.js';
import { loadModel } from '../viewer/loadModel.js';

export const STUDY_MODULES = [
  {
    id: 'spine',
    title: 'Cột Sống & Đĩa Đệm',
    focus: 'Tổng quan trục thân • Đốt sống C1-L5 • Xương cùng',
    color: '#1e3a8a',
    videoUrl: 'https://www.youtube.com/playlist?list=PLLyiVaWnDvSI1DFWLLmSiERKC5iO36kby',
    bgGradient: 'linear-gradient(135deg, rgba(30, 58, 138, 0.16) 0%, rgba(59, 130, 246, 0.06) 100%)',
    iconSvg: `<svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M12 2v20"/><rect x="9" y="3.5" width="6" height="3" rx="1.5"/><rect x="8" y="8.5" width="8" height="3" rx="1.5"/><rect x="7" y="13.5" width="10" height="3.5" rx="1.5"/><path d="M10 20.5l2 1.5 2-1.5"/></svg>`,
    steps: [
      {
        type: 'overview',
        nameVi: '1. Tổng quan Trục Cột Sống',
        nameLatin: 'Columna vertebralis (Overview)',
        systemVi: 'Khung xương trục',
        system: 'skeletal',
        cameraFocus: { x: 0.5, y: 1.15, z: 1.35, targetX: 0, targetY: 1.08, targetZ: 0 },
        overviewText: 'Trục cột sống gồm 33–34 đốt sống hợp nhất thành một cột nâng đỡ vững chắc, có 4 đoạn cong sinh lý (cổ, ngực, thắt lưng, cùng-cụt) giúp giảm xóc va đập, nâng tải 100% thân trên và bảo vệ tủy gai.',
        relations: {
          muscles: 'Cơ dựng gai (Erector spinae), cơ nhiều chân (Multifidus).',
          bones: 'Nâng đỡ hộp sọ, liên kết lồng ngực và neo chặt đai chậu.',
          nerves: 'Ống sống chứa tủy gai, phát xuất 31 đôi dây thần kinh gai sống.',
          vessels: 'Động mạch đốt sống, nhánh gai động mạch liên sườn & thắt lưng.'
        },
        clinical: 'Thoát vị đĩa đệm thường gặp nhất tại L4-L5 và L5-S1 chèn ép rễ thần kinh tọa; gù vẹo cột sống làm biến dạng lồng ngực ảnh hưởng chức năng hô hấp.'
      },
      {
        type: 'detail',
        id: 'Atlas (C1)',
        nameVi: '2. Đốt Đội C1 (Atlas)',
        nameLatin: 'Atlas [Vertebra C1]',
        systemVi: 'Cột sống cổ',
        system: 'skeletal'
      },
      {
        type: 'detail',
        id: 'Axis (C2)',
        nameVi: '3. Đốt Trục C2 (Axis)',
        nameLatin: 'Axis [Vertebra C2]',
        systemVi: 'Cột sống cổ',
        system: 'skeletal'
      },
      {
        type: 'detail',
        id: 'Vertebra L3',
        nameVi: '4. Đốt Sống Thắt Lưng L3-L5',
        nameLatin: 'Vertebrae lumbales [L1-L5]',
        systemVi: 'Cột sống thắt lưng',
        system: 'skeletal'
      },
      {
        type: 'detail',
        id: 'Sacrum',
        nameVi: '5. Khối Xương Cùng & Cụt',
        nameLatin: 'Os sacrum & Os coccygis',
        systemVi: 'Đoạn cùng-cụt',
        system: 'skeletal'
      }
    ]
  },
  {
    id: 'digestive',
    title: 'Hệ Gan – Mật – Tụy',
    focus: 'Tổng quan tầng trên ổ bụng • Gan • Tụy • Dạ dày',
    color: '#0284c7',
    bgGradient: 'linear-gradient(135deg, rgba(2, 132, 199, 0.16) 0%, rgba(56, 189, 248, 0.06) 100%)',
    iconSvg: `<svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><circle cx="12" cy="12" r="9"/><path d="M12 7v5l3 3"/></svg>`,
    steps: [
      {
        type: 'overview',
        nameVi: '1. Tổng quan Hệ Gan – Mật – Tụy & Dạ Dày',
        nameLatin: 'Systema digestorium (Overview)',
        systemVi: 'Hệ Tiêu Hóa',
        system: 'visceral',
        cameraFocus: { x: 0, y: 1.05, z: 1.1, targetX: 0, targetY: 1.02, targetZ: 0 },
        overviewText: 'Khối cơ quan tiêu hóa tầng trên ổ bụng phối hợp nhịp nhàng giữa tiêu hóa cơ học (dạ dày), tiêu hóa hóa học (dịch tụy, dịch mật) và hấp thu sơ bộ tại tá tràng, nuôi dưỡng toàn bộ cơ thể.',
        relations: {
          muscles: 'Cơ hoành ở trên, thành bụng trước ở trước, cơ thắt lưng chậu ở sau.',
          bones: 'Được che chở bởi lồng ngực dưới (xương sườn VII đến XII).',
          nerves: 'Đám rối tạng (Celiac plexus) và nhánh dây X bụng chi phối tạng.',
          vessels: 'Động mạch thân tạng (Celiac trunk) cấp máu nuôi dưỡng toàn vùng.'
        },
        clinical: 'Tắc sỏi đoạn bóng gan-tụy (Oddi) gây viêm tụy cấp nguy kịch do trào ngược men tụy tự tiêu mô.'
      },
      {
        type: 'detail',
        id: 'Liver',
        nameVi: '2. Gan (Liver)',
        nameLatin: 'Hepar',
        systemVi: 'Hệ Tiêu Hóa',
        system: 'visceral'
      },
      {
        type: 'detail',
        id: 'Gallbladder',
        nameVi: '3. Túi Mật (Gallbladder)',
        nameLatin: 'Vesica biliaris',
        systemVi: 'Hệ Tiêu Hóa',
        system: 'visceral'
      },
      {
        type: 'detail',
        id: 'Pancreas',
        nameVi: '4. Tuyến Tụy (Pancreas)',
        nameLatin: 'Pancreas',
        systemVi: 'Hệ Tiêu Hóa',
        system: 'visceral'
      },
      {
        type: 'detail',
        id: 'Stomach',
        nameVi: '5. Dạ Dày (Stomach)',
        nameLatin: 'Gaster',
        systemVi: 'Hệ Tiêu Hóa',
        system: 'visceral'
      },
      {
        type: 'detail',
        id: 'Duodenum',
        nameVi: '6. Tá Tràng (Duodenum)',
        nameLatin: 'Duodenum',
        systemVi: 'Hệ Tiêu Hóa',
        system: 'visceral'
      }
    ]
  },
  {
    id: 'cardio',
    title: 'Hệ Tim Mạch',
    focus: 'Tổng quan trung thất • Tim 4 buồng • Quai ĐM chủ',
    color: '#dc2626',
    videoUrl: 'https://www.youtube.com/playlist?list=PLXeja4lDX0Qc',
    pathologyUrl: 'https://www.youtube.com/playlist?list=PLLyiVaWnDvSI-Ej51joE-6N8R-G3ltg-x',
    bgGradient: 'linear-gradient(135deg, rgba(220, 38, 38, 0.16) 0%, rgba(248, 113, 113, 0.06) 100%)',
    iconSvg: `<svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M19 14c1.49-1.46 3-3.21 3-5.5A5.5 5.5 0 0 0 16.5 3c-1.76 0-3 .5-4.5 2-1.5-1.5-2.74-2-4.5-2A5.5 5.5 0 0 0 2 8.5c0 2.3 1.5 4.05 3 5.5l7 7Z"/></svg>`,
    steps: [
      {
        type: 'overview',
        nameVi: '1. Tổng quan Tim & Vòng Đại Tuần Hoàn',
        nameLatin: 'Systema cardiovasculare (Overview)',
        systemVi: 'Hệ Tuần Hoàn',
        system: 'cardiovascular',
        cameraFocus: { x: 0, y: 1.25, z: 1.0, targetX: 0, targetY: 1.22, targetZ: 0 },
        overviewText: 'Trái tim hoạt động như máy bơm sinh học trung tâm, co bóp đẩy máu qua 2 vòng tuần hoàn khép kín: vòng tiểu tuần hoàn trao đổi oxy tại phổi và vòng đại tuần hoàn cung cấp máu cho mọi cơ quan.',
        relations: {
          muscles: 'Nằm trên cơ hoành, sau thân xương ức, giữa hai khoang màng phổi.',
          bones: 'Bảo vệ bởi xương ức và sụn sườn III đến VI.',
          nerves: 'Hệ thần kinh tự chủ (Đám rối tim, dây X và chuỗi hạch giao cảm).',
          vessels: 'Động mạch vành trái & phải xuất phát ngay từ xoang động mạch chủ.'
        },
        clinical: 'Xơ vữa động mạch vành gây hẹp tắc mạch, dẫn đến cơn đau thắt ngực và nhồi máu cơ tim cấp.'
      },
      {
        type: 'detail',
        id: 'Heart',
        nameVi: '2. Quả Tim (Heart)',
        nameLatin: 'Cor',
        systemVi: 'Hệ Tuần Hoàn',
        system: 'cardiovascular'
      },
      {
        type: 'detail',
        id: 'Ascending aorta',
        nameVi: '3. Động Mạch Chủ Lên & Quai ĐM',
        nameLatin: 'Aorta ascendens & Arcus aortae',
        systemVi: 'Hệ Mạch Máu',
        system: 'cardiovascular'
      },
      {
        type: 'detail',
        id: 'Pulmonary trunk',
        nameVi: '4. Thân Động Mạch Phổi',
        nameLatin: 'Truncus pulmonalis',
        systemVi: 'Hệ Mạch Máu',
        system: 'cardiovascular'
      }
    ]
  },
  {
    id: 'nervous',
    title: 'Thần Kinh & Não Bộ',
    focus: 'Tổng quan não tủy • Đại não • TK lang thang & tọa',
    color: '#8b5cf6',
    videoUrl: 'https://www.youtube.com/playlist?list=PLLyiVaWnDvSIysyrnuDZLADVvkGrIKRae',
    bgGradient: 'linear-gradient(135deg, rgba(139, 92, 246, 0.16) 0%, rgba(196, 181, 253, 0.06) 100%)',
    iconSvg: `<svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M12 2a4 4 0 0 0-4 4c0 1.5.8 2.8 2 3.5V14h4V9.5c1.2-.7 2-2 2-3.5a4 4 0 0 0-4-4Z"/><path d="M9 18h6"/><path d="M10 22h4"/></svg>`,
    steps: [
      {
        type: 'overview',
        nameVi: '1. Tổng quan Hệ Thần Kinh & Trục Não Tủy',
        nameLatin: 'Systema nervosum (Overview)',
        systemVi: 'Hệ Thần Kinh',
        system: 'nervous',
        cameraFocus: { x: 0, y: 1.45, z: 1.15, targetX: 0, targetY: 1.38, targetZ: 0 },
        overviewText: 'Mạng lưới điều khiển tối cao của cơ thể gồm thần kinh trung ương (não bộ, tủy sống) tích hợp tư duy & phản xạ, phối hợp cùng 43 đôi dây thần kinh ngoại biên tiếp nhận cảm giác và điều phối vận động.',
        relations: {
          muscles: 'Chi phối vận động toàn bộ cơ xương và trương lực tư thế.',
          bones: 'Được bọc kín trong hộp sọ não và ống xương sống.',
          nerves: 'Mạng lưới 86 tỷ neuron liên kết synap tốc độ cao.',
          vessels: 'Đa giác Willis (Circulus arteriosus) cấp máu ưu tiên cho mô não.'
        },
        clinical: 'Đột quỵ não (tai biến mạch máu não) do tắc mạch hoặc xuất huyết não là cấp cứu y khoa đe dọa tử vong hàng đầu.'
      },
      {
        type: 'detail',
        id: 'Brain',
        nameVi: '2. Bán Cầu Đại Não (Cerebrum)',
        nameLatin: 'Encephalon',
        systemVi: 'Thần Kinh Trung Ương',
        system: 'nervous'
      },
      {
        type: 'detail',
        id: 'Lateral ventricle.l',
        nameVi: '3. Não Thất Bên & Dịch Não Tủy',
        nameLatin: 'Ventriculus lateralis',
        systemVi: 'Thần Kinh Trung Ương',
        system: 'nervous'
      },
      {
        type: 'detail',
        id: 'Sciatic nerve.l',
        nameVi: '4. Dây Thần Kinh Tọa (Sciatic nerve)',
        nameLatin: 'Nervus ischiadicus',
        systemVi: 'Thần Kinh Ngoại Biên',
        system: 'nervous'
      }
    ]
  },
  {
    id: 'lower_limb',
    title: 'Chi Dưới & Khớp Gối',
    focus: 'Tổng quan trục chịu lực • Khớp háng • Gối • Cổ chân',
    color: '#059669',
    bgGradient: 'linear-gradient(135deg, rgba(5, 150, 105, 0.16) 0%, rgba(52, 211, 153, 0.06) 100%)',
    iconSvg: `<svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><circle cx="12" cy="12" r="3.5"/><path d="M12 2v6.5"/><path d="M12 15.5V22"/><path d="M7 6c2 1.5 4 1.5 5 0"/><path d="M7 18c2-1.5 4-1.5 5 0"/><path d="M16 21l3-1"/></svg>`,
    steps: [
      {
        type: 'overview',
        nameVi: '1. Tổng quan Trục Cơ Xương Khớp Chi Dưới',
        nameLatin: 'Membrum inferius (Overview)',
        systemVi: 'Chi Dưới',
        system: 'skeletal',
        cameraFocus: { x: 0, y: 0.52, z: 1.55, targetX: 0, targetY: 0.48, targetZ: 0 },
        overviewText: 'Trục chi dưới gồm đai chậu, khớp háng, đùi, khớp gối, cẳng chân và bàn chân; cấu tạo chuyên biệt để chịu toàn bộ trọng lượng cơ thể, giảm xóc khi tiếp đất và tạo lực đẩy cho bước đi.',
        relations: {
          muscles: 'Cơ mông lớn (Gluteus maximus), cơ tứ đầu đùi (Quadriceps femoris).',
          bones: 'Xương chậu, xương đùi, xương bánh chè, xương chày, mác và cổ chân.',
          nerves: 'Đám rối thắt lưng-cùng, thần kinh đùi và thần kinh tọa.',
          vessels: 'Động mạch đùi, động mạch khoeo và các động mạch chày.'
        },
        clinical: 'Đứt dây chằng chéo trước (ACL), rách sụn chêm khớp gối và thoái hóa khớp háng/gối là những bệnh lý vận động phổ biến nhất.'
      },
      {
        type: 'detail',
        id: 'Hip bone.l',
        nameVi: '2. Xương Chậu & Khớp Háng',
        nameLatin: 'Os coxae & Articulatio coxae',
        systemVi: 'Đai chậu',
        system: 'skeletal'
      },
      {
        type: 'detail',
        id: 'Femur.l',
        nameVi: '3. Xương Đùi (Femur)',
        nameLatin: 'Os femoris',
        systemVi: 'Xương chi dưới',
        system: 'skeletal'
      },
      {
        type: 'detail',
        id: 'Patella.l',
        nameVi: '4. Xương Bánh Chè & Khớp Gối',
        nameLatin: 'Patella & Articulatio genus',
        systemVi: 'Khớp gối',
        system: 'skeletal'
      },
      {
        type: 'detail',
        id: 'Tibia.l',
        nameVi: '5. Xương Chày & Xương Mác',
        nameLatin: 'Tibia & Fibula',
        systemVi: 'Cẳng chân',
        system: 'skeletal'
      },
      {
        type: 'detail',
        id: 'Calcaneus.l',
        nameVi: '6. Xương Gót & Vòm Bàn Chân',
        nameLatin: 'Calcaneus',
        systemVi: 'Cổ & Bàn chân',
        system: 'skeletal'
      }
    ]
  },
  {
    id: 'upper_limb',
    title: 'Chi Trên & Đai Vai',
    focus: 'Tổng quan chi vận động • Đai vai • Khuỷu • Cẳng tay',
    color: '#d97706',
    bgGradient: 'linear-gradient(135deg, rgba(217, 119, 6, 0.16) 0%, rgba(251, 191, 36, 0.06) 100%)',
    iconSvg: `<svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><circle cx="7" cy="6" r="3"/><path d="M9.5 8.5L14 13l4 8"/><circle cx="14" cy="13" r="2.5"/><path d="M18 21l3-2"/></svg>`,
    steps: [
      {
        type: 'overview',
        nameVi: '1. Tổng quan Hệ Thống Chi Trên & Vận Động',
        nameLatin: 'Membrum superius (Overview)',
        systemVi: 'Chi Trên',
        system: 'skeletal',
        cameraFocus: { x: 0.35, y: 1.25, z: 1.25, targetX: 0.18, targetY: 1.2, targetZ: 0 },
        overviewText: 'Hệ chi trên được giải phóng khỏi chức năng chịu lực, tối ưu hóa triệt để cho tầm vận động linh hoạt đa hướng của khớp vai và sự tinh vi khéo léo của các ngón tay trong cầm nắm, lao động.',
        relations: {
          muscles: 'Cơ delta, nhóm cơ chóp xoay (Rotator cuff), cơ nhị đầu & tam đầu.',
          bones: 'Xương đòn, xương vai, xương cánh tay, xương quay, xương trụ.',
          nerves: 'Đám rối thần kinh cánh tay (Brachial plexus: cơ bì, quay, giữa, trụ).',
          vessels: 'Động mạch dưới đòn, động mạch nách, động mạch cánh tay.'
        },
        clinical: 'Trật khớp vai, viêm rách chóp xoay và hội chứng ống cổ tay chèn ép thần kinh giữa là tổn thương thường gặp.'
      },
      {
        type: 'detail',
        id: 'Clavicle.l',
        nameVi: '2. Đai Vai (Xương Đòn & Xương Vai)',
        nameLatin: 'Clavicula & Scapula',
        systemVi: 'Đai vai',
        system: 'skeletal'
      },
      {
        type: 'detail',
        id: 'Humerus.l',
        nameVi: '3. Xương Cánh Tay (Humerus)',
        nameLatin: 'Humerus',
        systemVi: 'Cánh tay',
        system: 'skeletal'
      },
      {
        type: 'detail',
        id: 'Radius.l',
        nameVi: '4. Xương Cẳng Tay (Quay & Trụ)',
        nameLatin: 'Radius & Ulna',
        systemVi: 'Cẳng tay',
        system: 'skeletal'
      }
    ]
  },
  {
    id: 'thorax',
    title: 'Lồng Ngực & Hô Hấp',
    focus: 'Tổng quan khung lồng ngực • Xương ức • Khung sườn',
    color: '#e11d48',
    videoUrl: 'https://www.youtube.com/playlist?list=PLFCWgyj8rzLA',
    bgGradient: 'linear-gradient(135deg, rgba(225, 29, 72, 0.16) 0%, rgba(251, 113, 133, 0.06) 100%)',
    iconSvg: `<svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M12 3v18"/><path d="M12 6c-3.5 0-7 1.5-8 4.5 1 3 4.5 4.5 8 4.5"/><path d="M12 6c3.5 0 7 1.5 8 4.5-1 3-4.5 4.5-8 4.5"/><path d="M12 11c-2.5 0-5 1-6 3 1 2 3.5 3 6 3"/><path d="M12 11c2.5 0 5 1 6 3-1 2-3.5 3-6 3"/></svg>`,
    steps: [
      {
        type: 'overview',
        nameVi: '1. Tổng quan Khung Lồng Ngực & Động Học Hô Hấp',
        nameLatin: 'Cavea thoracis (Overview)',
        systemVi: 'Lồng Ngực',
        system: 'skeletal',
        cameraFocus: { x: 0, y: 1.30, z: 1.15, targetX: 0, targetY: 1.25, targetZ: 0 },
        overviewText: 'Khung xương lồng ngực hình nón cụt vừa làm lá chắn bảo vệ tim, phổi và các đại mạch máu, vừa là máy bơm cơ học co giãn thể tích liên tục theo chu kỳ hít vào - thở ra của cơ hoành và cơ liên sườn.',
        relations: {
          muscles: 'Cơ hoành (cơ hô hấp chính), các cơ liên sườn trong và ngoài.',
          bones: '12 đốt sống ngực ở sau, 12 đôi xương sườn hai bên, xương ức ở trước.',
          nerves: 'Dây thần kinh hoành (C3-C5) và các dây thần kinh liên sườn.',
          vessels: 'Động mạch ngực trong, các bó mạch thần kinh liên sườn.'
        },
        clinical: 'Gãy xương sườn gây mảng sườn di động, tràn khí / tràn máu màng phổi chèn ép làm xẹp nhu mô phổi cấp cứu.'
      },
      {
        type: 'detail',
        id: 'Body of sternum',
        nameVi: '2. Xương Ức (Sternum)',
        nameLatin: 'Sternum',
        systemVi: 'Xương lồng ngực',
        system: 'skeletal'
      },
      {
        type: 'detail',
        id: 'First rib.l',
        nameVi: '3. Khung Xương Sườn (Ribs)',
        nameLatin: 'Costae',
        systemVi: 'Xương lồng ngực',
        system: 'skeletal'
      }
    ]
  },
  {
    id: 'cranium',
    title: 'Hộp Sọ & Đầu Mặt',
    focus: 'Tổng quan sọ não & mặt • Vòm sọ • Xương hàm dưới',
    color: '#7c3aed',
    bgGradient: 'linear-gradient(135deg, rgba(124, 58, 237, 0.16) 0%, rgba(167, 139, 250, 0.06) 100%)',
    iconSvg: `<svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M12 2a7.5 7.5 0 0 0-7.5 7.5c0 3 1.5 5.5 3.5 6.8V19a2 2 0 0 0 2 2h4a2 2 0 0 0 2-2v-2.7c2-1.3 3.5-3.8 3.5-6.8A7.5 7.5 0 0 0 12 2z"/><circle cx="9.5" cy="10" r="1.2" fill="currentColor"/><circle cx="14.5" cy="10" r="1.2" fill="currentColor"/><path d="M10 15h4"/></svg>`,
    steps: [
      {
        type: 'overview',
        nameVi: '1. Tổng quan Hộp Sọ Não & Sọ Mặt',
        nameLatin: 'Cranium (Overview)',
        systemVi: 'Hộp Sọ',
        system: 'skeletal',
        cameraFocus: { x: 0.35, y: 1.62, z: 0.65, targetX: 0, targetY: 1.58, targetZ: 0 },
        overviewText: 'Khối xương sọ được cấu tạo tinh xảo gồm 8 xương sọ não bảo vệ mô não quý giá và 14 xương sọ mặt chứa các hốc giác quan (thị giác, khứu giác, vị giác) và làm khung nâng đỡ cơ biểu cảm khuôn mặt.',
        relations: {
          muscles: 'Nhóm cơ nhai (Cơ cắn, cơ thái dương) và các cơ biểu cảm nét mặt.',
          bones: 'Tiếp khớp với đốt đội C1 qua lồi cầu xương chẩm (khớp đội-chẩm).',
          nerves: '12 đôi dây thần kinh sọ xuất phát từ đáy não đi qua các lỗ nền sọ.',
          vessels: 'Động mạch cảnh trong, động mạch đốt sống và hệ thống xoang tĩnh mạch màng cứng.'
        },
        clinical: 'Vỡ nền sọ (dấu hiệu mắt gấu trúc, dấu hiệu Battle) và chấn thương khớp thái dương hàm (TMJ) gây đau khi nhai.'
      },
      {
        type: 'detail',
        id: 'Frontal bone',
        nameVi: '2. Xương Trán & Vòm Sọ',
        nameLatin: 'Os frontale & Calvaria',
        systemVi: 'Sọ não',
        system: 'skeletal'
      },
      {
        type: 'detail',
        id: 'Mandible',
        nameVi: '3. Xương Hàm Dưới & Khớp Thái Dương-Hàm',
        nameLatin: 'Mandibula & Articulatio temporomandibularis',
        systemVi: 'Sọ mặt',
        system: 'skeletal'
      }
    ]
  }
];

let activeModule = null;
let currentPickerTab = 'modules';
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

  const renderContent = () => {
    modalEl.innerHTML = `
      <div class="study-dialog">
        <div class="study-dialog-header">
          <div class="study-dialog-header-left">
            <div class="study-dialog-title-row">
              <h3 class="study-dialog-title">${currentPickerTab === 'modules' ? 'Chuyên Đề Tự Học Giải Phẫu' : 'Video Đào Tạo & Bệnh Lý'}</h3>
              <span class="study-dialog-pill">${currentPickerTab === 'modules' ? `${STUDY_MODULES.length} chuyên đề` : `${MEDICAL_TRAINING_PLAYLISTS.length} playlist`}</span>
            </div>
            <p class="study-dialog-sub">${currentPickerTab === 'modules' ? 'Lộ trình chuẩn: Từ tổng quan vùng đến từng cấu trúc chi tiết' : 'Danh mục video đào tạo & bệnh lý chuẩn y khoa'}</p>
          </div>
          <button type="button" class="dialog-close-btn" id="studyClosePickerBtn" title="Đóng">&times;</button>
        </div>

        <div class="study-dialog-segmented-tabs">
          <button type="button" class="study-segment-tab ${currentPickerTab === 'modules' ? 'active' : ''}" id="tabStudy3DModules">
            <span>📚 ${STUDY_MODULES.length} Chuyên Đề 3D</span>
          </button>
          <button type="button" class="study-segment-tab ${currentPickerTab === 'playlists' ? 'active' : ''}" id="tabStudyPlaylists">
            <span>🎬 ${MEDICAL_TRAINING_PLAYLISTS.length} Video Đào Tạo</span>
          </button>
        </div>

        ${currentPickerTab === 'modules' ? `
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
                      ${mod.steps.length} bước học
                    </span>
                  </div>
                  <div class="module-card-focus" title="${mod.focus}">${mod.focus}</div>
                </div>
                <div class="module-card-arrow" aria-hidden="true">
                  <svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5"><polyline points="9 18 15 12 9 6"/></svg>
                </div>
              </div>
            `).join('')}
          </div>
        ` : `
          <div class="study-playlists-grid">
            ${(MEDICAL_TRAINING_PLAYLISTS || []).map(pl => `
              <div class="study-playlist-card" data-playlist-id="${pl.id}">
                <div class="playlist-card-thumb-wrap">
                  <img src="${pl.image || './images/atlas/med_skin.png'}" class="playlist-card-thumb-img" alt="${pl.titleVi || pl.title}" loading="lazy" />
                  <div class="playlist-card-play-icon">
                    <svg width="12" height="12" viewBox="0 0 24 24" fill="currentColor"><polygon points="6 4 20 12 6 20 6 4"/></svg>
                  </div>
                  <span class="playlist-card-badge-pill">${pl.badge || 'Playlist'}</span>
                </div>
                <div class="playlist-card-info">
                  <h4 class="playlist-card-title">${pl.titleVi || pl.title}</h4>
                  <p class="playlist-card-desc" title="${pl.desc}">${pl.desc}</p>
                </div>
                <div class="playlist-card-action">
                  <button type="button" class="btn-play-playlist" title="Xem danh sách phát">▶</button>
                </div>
              </div>
            `).join('')}
          </div>
        `}
      </div>
    `;

    document.getElementById('studyClosePickerBtn')?.addEventListener('click', () => {
      closeStudyMode(viewer);
    });

    document.getElementById('tabStudy3DModules')?.addEventListener('click', () => {
      if (currentPickerTab !== 'modules') {
        currentPickerTab = 'modules';
        renderContent();
      }
    });

    document.getElementById('tabStudyPlaylists')?.addEventListener('click', () => {
      if (currentPickerTab !== 'playlists') {
        currentPickerTab = 'playlists';
        renderContent();
      }
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

    modalEl.querySelectorAll('.study-playlist-card').forEach(card => {
      card.addEventListener('click', () => {
        const plId = card.dataset.playlistId;
        const pl = (MEDICAL_TRAINING_PLAYLISTS || []).find(p => p.id === plId);
        if (pl) {
          openVideo(pl.videoUrl, pl.titleVi || pl.title);
        }
      });
    });
  };

  renderContent();
}

export function startStudyModule(moduleOrId, viewer) {
  if (!modalEl) initStudyModeUI(viewer);

  if (typeof moduleOrId === 'string') {
    activeModule = STUDY_MODULES.find(m => m.id === moduleOrId) || STUDY_MODULES[0];
  } else {
    activeModule = moduleOrId || STUDY_MODULES[0];
  }

  currentIndex = 0;
  isStudyCollapsed = false;
  showStudyDetails = false;
  if (modalEl) {
    modalEl.classList.remove('hidden');
    modalEl.classList.add('step-mode');
  }
  renderStudyStep(viewer);
}

export function nextStudyStep(viewer) {
  if (!activeModule) return;
  if (currentIndex < activeModule.steps.length - 1) {
    currentIndex++;
    renderStudyStep(viewer);
  } else {
    showCompletionCard(viewer);
  }
}

export function prevStudyStep(viewer) {
  if (!activeModule) return;
  if (currentIndex > 0) {
    currentIndex--;
    renderStudyStep(viewer);
  }
}

function renderStudyStep(viewer) {
  if (!activeModule || !modalEl) return;

  const step = activeModule.steps[currentIndex];
  const isOverview = step.type === 'overview';

  let clinical = {};
  if (isOverview) {
    clinical = {
      nameVi: step.nameVi,
      nameLatin: step.nameLatin,
      systemVi: step.systemVi,
      description: step.overviewText,
      relations: step.relations,
      clinical: step.clinical,
      lessonLink: step.lessonLink || null,
      lessonTitle: step.lessonTitle || null,
      videoId: step.videoId || null
    };

    // 1. TỔNG QUAN HỆ THỐNG / TOÀN VÙNG:
    // Dỡ bỏ chọn riêng lẻ để người dùng nhìn thấy toàn cảnh
    deselectPart();

    // Tự động load hệ nếu chưa nạp
    if (step.system && viewer) {
      loadModel(step.system, viewer).catch(() => {});
    }

    // Camera lùi ra và định vị góc nhìn toàn cảnh trục/vùng
    if (viewer && step.cameraFocus) {
      const cf = step.cameraFocus;
      frameRegion({
        x: cf.x !== undefined ? cf.x : 0,
        y: cf.y !== undefined ? cf.y : 1.1,
        z: cf.z !== undefined ? cf.z : (cf.dist !== undefined ? cf.dist : 1.25),
        targetX: cf.targetX !== undefined ? cf.targetX : 0,
        targetY: cf.targetY !== undefined ? cf.targetY : (cf.y !== undefined ? cf.y : 1.1),
        targetZ: cf.targetZ !== undefined ? cf.targetZ : 0
      }, viewer);
    }
  } else {
    // 2. CHI TIẾT TỪNG PHẦN:
    const partId = step.id;
    const baseClinical = getClinicalData(partId) || {};
    clinical = {
      ...baseClinical,
      nameVi: step.nameVi || baseClinical.nameVi,
      nameLatin: step.nameLatin || baseClinical.nameLatin,
      systemVi: step.systemVi || baseClinical.systemVi
    };

    // Focus and select structure in 3D (ensuring system is loaded and visible)
    selectStructureAnywhere(partId).then(() => {
      selectPartById(partId, viewer);
    }).catch(() => {
      selectPartById(partId, viewer);
    });
  }

  // Hide selectionCard to avoid overlap with flashcard navigation
  const selCard = document.getElementById('selectionCard');
  if (selCard) selCard.classList.add('hidden');

  if (isStudyCollapsed) {
    modalEl.innerHTML = `
      <div class="study-step-container study-step-collapsed animate-in">
        <div class="study-collapsed-content">
          <div class="study-collapsed-info">
            <span class="step-counter">📚 ${currentIndex + 1}/${activeModule.steps.length}</span>
            <span class="study-name-mini">${clinical.nameVi}</span>
            <span class="study-latin-mini">(${clinical.nameLatin || ''})</span>
          </div>
          <div class="study-collapsed-actions">
            <button type="button" class="btn-study-mini-nav" id="studyPrevBtn" ${currentIndex === 0 ? 'disabled' : ''} title="Bước trước">◀</button>
            <button type="button" class="btn-study-mini-nav" id="studyNextBtn" title="Bước sau">▶</button>
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
            <span class="step-counter">${currentIndex + 1} / ${activeModule.steps.length}</span>
          </div>
          <div class="study-header-actions">
            <button type="button" class="btn-study-toggle" id="studyToggleCollapseBtn" title="Thu gọn xem toàn màn hình 3D">▲ Thu gọn</button>
            <button type="button" class="dialog-close-btn" id="studyExitBtn" title="Thoát chế độ học">&times;</button>
          </div>
        </div>

        <!-- Flashcard Content Area -->
        <div class="study-flashcard">
          <div class="flashcard-badge-row">
            <span class="flashcard-stage-pill ${isOverview ? 'overview' : 'detail'}">
              ${isOverview ? '🌟 Bước 1: Tổng quan toàn bộ' : `🔍 Bước ${currentIndex + 1}: Cấu trúc chi tiết`}
            </span>
          </div>

          <div class="flashcard-title-row">
            <div class="flashcard-name-wrap">
              <h3 class="flashcard-name">${clinical.nameVi}</h3>
              <span class="flashcard-latin">${clinical.nameLatin}</span>
            </div>
            <span class="flashcard-tag">${clinical.systemVi}</span>
          </div>

          ${isOverview ? `
            <div class="flashcard-overview-desc">
              ${clinical.description}
            </div>
          ` : `
            <div class="flashcard-summary-text">
              ${clinical.description || clinical.function || ''}
            </div>
          `}

          <!-- Quick Action Buttons Row -->
          <div class="flashcard-quick-actions">
            ${isOverview ? '' : `<button type="button" class="btn-study-action primary" id="studyQuickQuizBtn">🎯 Thử thách</button>`}
            ${(activeModule.videoUrl || clinical.videoUrl || clinical.videoId) ? `<button type="button" class="btn-study-action secondary" id="studyVideoBtn">🎬 Video</button>` : ''}
            ${clinical.lessonLink ? `<button type="button" class="btn-study-action secondary" id="studyLessonBtn">📖 Bài học</button>` : ''}
            <button type="button" class="btn-study-action toggle-details" id="studyDetailsToggleBtn">
              ${showStudyDetails ? '▲ Ẩn bớt' : '💡 Chi tiết'}
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
            ${currentIndex === activeModule.steps.length - 1 ? 'Hoàn thành 🎉' : (currentIndex === 0 ? 'Bắt đầu chi tiết ▶' : 'Tiếp theo ▶')}
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
    if (currentIndex < activeModule.steps.length - 1) {
      currentIndex++;
      renderStudyStep(viewer);
    } else {
      // Completed module
      showCompletionCard(viewer);
    }
  });

  document.getElementById('studyVideoBtn')?.addEventListener('click', () => {
    const vUrl = activeModule.videoUrl || clinical.videoUrl || clinical.videoId;
    openVideo(vUrl, `Video: ${activeModule.title}`);
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
      <p style="color: #8b949e; margin-bottom: 20px;">Bạn vừa nghiên cứu chi tiết ${activeModule.steps.length} bước học trong chuyên đề <strong>${activeModule.title}</strong> (từ tổng quan đến từng cấu trúc cụ thể).</p>
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
