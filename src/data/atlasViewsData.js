// Comprehensive Atlas 2027 Preset Views & Media Data
// Chuẩn thiết kế & Danh mục Giải phẫu học Quốc tế (Việt hóa 100% chuẩn Y khoa)

export const ATLAS_SYSTEMS_CATEGORIES = [
  {
    id: 'skeletal_views',
    titleVi: 'Hệ Xương Khớp',
    titleEn: 'Skeletal System Views',
    systemKey: 'skeletal',
    cards: [
      {
        id: 'skel_1_full',
        title: '1. Full Skeleton',
        titleVi: '1. Toàn bộ Hệ Xương',
        subtitle: 'Bộ xương người trưởng thành',
        image: '/images/atlas/skel_full.png',
        systems: ['skeletal'],
        camera: { x: 0, y: 0.86, z: 2.6, targetX: 0, targetY: 0.86, targetZ: 0 },
        desc: 'Bộ xương người trưởng thành: 206 xương trục và xương chi thể.'
      },
      {
        id: 'skel_2_skull',
        title: '2. Skull',
        titleVi: '2. Hộp Sọ & Xương Mặt',
        subtitle: 'Vòm sọ, nền sọ và xương hàm',
        image: '/images/atlas/skel_skull.png',
        systems: ['skeletal'],
        camera: { x: 0.48, y: 1.62, z: 0.58, targetX: 0, targetY: 1.58, targetZ: 0 },
        highlight: 'Frontal bone',
        desc: 'Khối xương sọ não bảo vệ não bộ và khối xương mặt.'
      },
      {
        id: 'skel_3_cranial_fossae',
        title: '3. Cranial Fossae',
        titleVi: '3. Cấu Trúc Nền Sọ',
        subtitle: 'Hố sọ trước, giữa và sau',
        image: '/images/atlas/skel_cranial_fossae.png',
        systems: ['skeletal'],
        camera: { x: 0, y: 1.40, z: 0.45, targetX: 0, targetY: 1.55, targetZ: 0 },
        highlight: 'Sphenoid bone',
        desc: 'Hệ thống các lỗ nền sọ cho 12 đôi dây TK sọ đi qua.'
      },
      {
        id: 'skel_4_skull_sagittal',
        title: '4. Skull, Sagittal Section',
        titleVi: '4. Sọ Cắt Đứng Dọc',
        subtitle: 'Khoang sọ & vách ngăn mũi',
        image: '/images/atlas/skel_skull.png',
        systems: ['skeletal'],
        camera: { x: 0.55, y: 1.60, z: 0.45, targetX: 0, targetY: 1.58, targetZ: 0 },
        clipping: { plane: 'sagittal', offset: 0 },
        desc: 'Mặt cắt dọc giữa hộp sọ bộc lộ xoang bướm, xoang trán và nền sọ.'
      },
      {
        id: 'skel_5_skull_transverse',
        title: '5. Skull, Transverse Section',
        titleVi: '5. Sọ Cắt Ngang',
        subtitle: 'Vòm sọ và các tầng nền sọ',
        image: '/images/atlas/skel_cranial_fossae.png',
        systems: ['skeletal'],
        camera: { x: 0, y: 1.75, z: 0.35, targetX: 0, targetY: 1.58, targetZ: 0 },
        clipping: { plane: 'axial', offset: 0.05 },
        desc: 'Mặt cắt ngang qua vòm sọ quan sát cấu trúc bản trong và ngoài xương sọ.'
      },
      {
        id: 'skel_6_disarticulated',
        title: '6. Disarticulated Skull',
        titleVi: '6. Sọ Tháo Rời Từng Mảnh',
        subtitle: 'Tách rời các xương khớp sọ',
        hasPlay: true,
        image: '/images/atlas/skel_skull.png',
        systems: ['skeletal'],
        camera: { x: 0.3, y: 1.60, z: 0.65, targetX: 0, targetY: 1.58, targetZ: 0 },
        explode: 40,
        desc: 'Quan sát các đường khớp sọ tách rời từng xương thành phần.'
      },
      {
        id: 'skel_7_arches',
        title: '7. Upper and Lower Arches',
        titleVi: '7. Cung Răng Hàm Trên & Dưới',
        subtitle: 'Cung răng và huyệt ổ răng',
        hasPlay: true,
        image: '/images/atlas/skel_skull.png',
        systems: ['skeletal'],
        camera: { x: 0, y: 1.54, z: 0.35, targetX: 0, targetY: 1.52, targetZ: 0 },
        highlight: 'Maxilla.l',
        desc: 'Cung răng hàm trên gắn xương hàm trên, cung răng hàm dưới gắn xương hàm dưới.'
      },
      {
        id: 'skel_8_teeth_blood',
        title: '8. Teeth Blood Supply',
        titleVi: '8. Mạch Máu Nuôi Răng',
        subtitle: 'Động mạch ổ răng trên & dưới',
        image: '/images/atlas/skel_skull.png',
        systems: ['skeletal', 'cardiovascular'],
        camera: { x: 0.22, y: 1.54, z: 0.38, targetX: 0, targetY: 1.52, targetZ: 0 },
        highlight: 'Mandible',
        desc: 'Mạng lưới động mạch hàm trên và nhánh huyệt răng dưới nuôi tủy răng.'
      },
      {
        id: 'skel_9_thoracic_cage',
        title: '9. Thoracic Cage',
        titleVi: '9. Lồng Ngực Sườn',
        subtitle: '12 đôi xương sườn & xương ức',
        image: '/images/atlas/skel_spine.png',
        systems: ['skeletal'],
        camera: { x: 0, y: 1.25, z: 0.85, targetX: 0, targetY: 1.25, targetZ: 0 },
        highlight: 'Body of sternum',
        desc: 'Khung xương lồng ngực bảo vệ tim phổi và tham gia động học hô hấp.'
      },
      {
        id: 'skel_10_thoracic_cavity',
        title: '10. Thoracic Cavity',
        titleVi: '10. Khoang Lồng Ngực',
        subtitle: 'Mối tương quan khung ngực và tạng',
        image: '/images/atlas/reg_thorax.png',
        systems: ['skeletal', 'visceral', 'cardiovascular'],
        camera: { x: 0, y: 1.25, z: 0.90, targetX: 0, targetY: 1.25, targetZ: 0 },
        desc: 'Toàn bộ khoang trung thất chứa tim và hai khoang màng phổi chứa phổi.'
      },
      {
        id: 'skel_11_pelvic_girdle',
        title: '11. Pelvic Girdle',
        titleVi: '11. Đai Chậu & Khớp Háng',
        subtitle: 'Xương chậu, xương cùng & ổ cối',
        image: '/images/atlas/skel_pelvis.png',
        systems: ['skeletal'],
        camera: { x: 0, y: 0.88, z: 0.95, targetX: 0, targetY: 0.85, targetZ: 0 },
        highlight: 'Hip bone.l',
        desc: 'Hai xương chậu kết hợp xương cùng tạo thành khung chậu nâng đỡ trọng lượng.'
      },
      {
        id: 'skel_12_pelvic_section',
        title: '12. Pelvic Section',
        titleVi: '12. Cắt Lớp Khung Chậu',
        subtitle: 'Mặt cắt đứng dọc qua chậu hông',
        image: '/images/atlas/skel_pelvis.png',
        systems: ['skeletal', 'visceral'],
        camera: { x: 0.4, y: 0.88, z: 0.85, targetX: 0, targetY: 0.85, targetZ: 0 },
        clipping: { plane: 'sagittal', offset: 0 },
        desc: 'Mặt cắt chậu hông quan sát bàng quang, trực tràng và cơ đáy chậu.'
      },
      {
        id: 'skel_13_spine_lateral',
        title: '13. Spine, Lateral',
        titleVi: '13. Cột Sống Nhìn Nghiêng',
        subtitle: '4 đường cong sinh lý cột sống',
        image: '/images/atlas/skel_spine.png',
        systems: ['skeletal'],
        camera: { x: 0.9, y: 1.15, z: 0, targetX: 0, targetY: 1.1, targetZ: 0 },
        highlight: 'Vertebra L1',
        desc: 'Góc nhìn nghiêng quan sát đường cong ưỡn cổ, gù ngực, ưỡn thắt lưng và cong cùng.'
      },
      {
        id: 'skel_14_spine_musculature',
        title: '14. Spine, Musculature',
        titleVi: '14. Cột Sống & Cơ Cạnh Sống',
        subtitle: 'Hệ thống cơ dựng sống và cơ sâu',
        image: '/images/atlas/musc_torso.png',
        systems: ['skeletal', 'muscular'],
        camera: { x: 0.6, y: 1.15, z: -0.9, targetX: 0, targetY: 1.1, targetZ: 0 },
        desc: 'Hệ cơ cạnh sống giữ trục cột sống vững chắc trong mọi tư thế vận động.'
      },
      {
        id: 'skel_15_shoulder_girdle',
        title: '15. Shoulder Girdle',
        titleVi: '15. Đai Vai & Khớp Cánh Tay',
        subtitle: 'Xương đòn, xương vai và ổ chảo',
        image: '/images/atlas/skel_full.png',
        systems: ['skeletal', 'joints'],
        camera: { x: 0.35, y: 1.35, z: 0.65, targetX: 0.2, targetY: 1.32, targetZ: 0 },
        highlight: 'Clavicle.l',
        desc: 'Đai vai nối chi trên với thân mình, khớp có biên độ vận động lớn nhất cơ thể.'
      }
    ]
  },
  {
    id: 'circulatory_views',
    titleVi: 'Hệ Tim Mạch & Tuần Hoàn',
    titleEn: 'Circulatory System Views',
    systemKey: 'cardiovascular',
    cards: [
      {
        id: 'circ_1_full',
        title: '1. Circulatory System',
        titleVi: '1. Toàn Bộ Hệ Tuần Hoàn',
        subtitle: 'Mạng lưới động - tĩnh mạch toàn thân',
        image: '/images/atlas/circ_full.png',
        systems: ['cardiovascular'],
        camera: { x: 0, y: 0.95, z: 2.3, targetX: 0, targetY: 0.95, targetZ: 0 },
        desc: 'Mạng lưới đại tuần hoàn và tiểu tuần hoàn vận chuyển máu đi khắp cơ thể.'
      },
      {
        id: 'circ_2_simplified',
        title: '2. Circulatory System, Simplified',
        titleVi: '2. Hệ Tuần Hoàn Giản Lược',
        subtitle: 'Các thân mạch máu chính yếu',
        image: '/images/atlas/circ_simplified.png',
        systems: ['cardiovascular'],
        camera: { x: 0, y: 1.0, z: 2.0, targetX: 0, targetY: 1.0, targetZ: 0 },
        desc: 'Trục động mạch chủ và tĩnh mạch chủ phân nhánh chính nuôi cơ thể.'
      },
      {
        id: 'circ_3_location_heart',
        title: '3. Location of Heart',
        titleVi: '3. Vị Trí Tim Trong Lồng Ngực',
        subtitle: 'Tim, quai ĐM chủ và trung thất',
        image: '/images/atlas/circ_heart_thorax.png',
        systems: ['cardiovascular', 'skeletal'],
        camera: { x: 0, y: 1.28, z: 0.72, targetX: 0, targetY: 1.28, targetZ: 0 },
        highlight: 'Left ventricle',
        desc: 'Mối tương quan giải phẫu giữa quả tim, màng ngoài tim và khung xương sườn.'
      },
      {
        id: 'circ_4_vasculature_brain',
        title: '4. Vasculature of the Brain',
        titleVi: '4. Mạng Mạch Não Bộ',
        subtitle: 'Động mạch cảnh trong & đốt sống',
        image: '/images/atlas/nerv_brain.png',
        systems: ['cardiovascular', 'nervous'],
        camera: { x: 0.42, y: 1.62, z: 0.52, targetX: 0, targetY: 1.58, targetZ: 0 },
        desc: 'Hệ thống cấp máu chuyên biệt nuôi vỏ não và các nhân xám trung ương.'
      },
      {
        id: 'circ_5_circle_willis',
        title: '5. Circle of Willis',
        titleVi: '5. Đa Giác Động Mạch Não Willis',
        subtitle: 'Vòng nối thông động mạch nền sọ',
        image: '/images/atlas/nerv_brain.png',
        systems: ['cardiovascular'],
        camera: { x: 0, y: 1.45, z: 0.40, targetX: 0, targetY: 1.56, targetZ: 0 },
        highlight: 'Basilar artery',
        desc: 'Vòng tuần hoàn bàng hệ bù trừ quan trọng nhất nuôi toàn bộ bán cầu đại não.'
      },
      {
        id: 'circ_6_carotid_jugular',
        title: '6. Carotid and Jugular',
        titleVi: '6. ĐM Cảnh & TM Cảnh',
        subtitle: 'Bó mạch thần kinh vùng cổ',
        image: '/images/atlas/circ_heart_thorax.png',
        systems: ['cardiovascular', 'skeletal'],
        camera: { x: 0.25, y: 1.48, z: 0.55, targetX: 0, targetY: 1.45, targetZ: 0 },
        highlight: 'Left common carotid artery',
        desc: 'Động mạch cảnh chung và tĩnh mạch cảnh trong vận chuyển máu nuôi đầu mặt cổ.'
      },
      {
        id: 'circ_7_pulmonary',
        title: '7. Pulmonary',
        titleVi: '7. Mạch Phổi & Tiểu Tuần Hoàn',
        subtitle: 'Thân động mạch & tĩnh mạch phổi',
        image: '/images/atlas/resp_lungs.png',
        systems: ['cardiovascular', 'visceral'],
        camera: { x: 0, y: 1.28, z: 0.75, targetX: 0, targetY: 1.26, targetZ: 0 },
        highlight: 'Pulmonary trunk',
        desc: 'Vòng tiểu tuần hoàn đưa máu giàu CO2 lên phổi và nhận máu giàu oxy về tim.'
      },
      {
        id: 'circ_8_heart_section',
        title: '8. Heart Section',
        titleVi: '8. Mặt Cắt Buồng Tim & Van Tim',
        subtitle: '4 buồng tim và van 2 lá, 3 lá',
        image: '/images/atlas/circ_heart_thorax.png',
        systems: ['cardiovascular'],
        camera: { x: 0.15, y: 1.28, z: 0.55, targetX: 0, targetY: 1.28, targetZ: 0 },
        clipping: { plane: 'coronal', offset: 0 },
        desc: 'Mặt cắt trán qua tim quan sát tâm thất trái, tâm thất phải và hệ thống van tim.'
      },
      {
        id: 'circ_9_azygos_system',
        title: '9. Azygos System',
        titleVi: '9. Hệ Tĩnh Mạch Đơn Azygos',
        subtitle: 'Tĩnh mạch đơn, bán đơn & gian sườn',
        image: '/images/atlas/circ_full.png',
        systems: ['cardiovascular', 'skeletal'],
        camera: { x: 0.45, y: 1.22, z: -0.75, targetX: 0, targetY: 1.22, targetZ: 0 },
        highlight: 'Azygos vein',
        desc: 'Hệ thống dẫn lưu máu thành ngực và là cầu nối quan trọng giữa hai tĩnh mạch chủ.'
      },
      {
        id: 'circ_10_vagus',
        title: '10. Vagus',
        titleVi: '10. Dây Thần Kinh Lang Thang X',
        subtitle: 'Thần kinh X đồng hành cùng bó mạch',
        image: '/images/atlas/circ_heart_thorax.png',
        systems: ['cardiovascular', 'nervous', 'visceral'],
        camera: { x: 0.2, y: 1.35, z: 0.65, targetX: 0, targetY: 1.32, targetZ: 0 },
        desc: 'Dây thần kinh X đi trong bao cảnh cùng động mạch cảnh và tĩnh mạch cảnh trong.'
      },
      {
        id: 'circ_11_liver_circulation',
        title: '11. Liver Circulation',
        titleVi: '11. Tuần Hoàn Cửa & Gan',
        subtitle: 'Tĩnh mạch cửa, ĐM gan & TM trên gan',
        image: '/images/atlas/dig_peritoneum.png',
        systems: ['cardiovascular', 'visceral'],
        camera: { x: 0.15, y: 1.10, z: 0.75, targetX: 0, targetY: 1.08, targetZ: 0 },
        highlight: 'Liver',
        desc: 'Hệ thống tĩnh mạch cửa thu gom máu giàu dưỡng chất từ ruột về gan xử lý.'
      },
      {
        id: 'circ_12_lower_digestive',
        title: '12. Lower Digestive',
        titleVi: '12. Mạch Máu Tiêu Hóa Dưới',
        subtitle: 'ĐM mạc treo tràng trên và dưới',
        image: '/images/atlas/dig_lower.png',
        systems: ['cardiovascular', 'visceral'],
        camera: { x: 0, y: 0.95, z: 0.85, targetX: 0, targetY: 0.95, targetZ: 0 },
        desc: 'Mạng lưới mạch máu nuôi toàn bộ hỗng tràng, hồi tràng và đại trực tràng.'
      },
      {
        id: 'circ_13_pelvic_circulation',
        title: '13. Pelvic Circulation',
        titleVi: '13. Mạch Máu Vùng Chậu',
        subtitle: 'Động mạch chậu trong & ngoài',
        image: '/images/atlas/urin_pelvic.png',
        systems: ['cardiovascular', 'skeletal'],
        camera: { x: 0, y: 0.85, z: 0.85, targetX: 0, targetY: 0.82, targetZ: 0 },
        desc: 'Phân nhánh cấp máu cho bàng quang, tử cung/tuyến tiền liệt và chi dưới.'
      }
    ]
  },
  {
    id: 'nervous_views',
    titleVi: 'Hệ Thần Kinh Trung Ương & Ngoại Biên',
    titleEn: 'Nervous System Views',
    systemKey: 'nervous',
    cards: [
      {
        id: 'nerv_1_full',
        title: '1. Nervous System',
        titleVi: '1. Toàn Bộ Hệ Thần Kinh',
        subtitle: 'Não bộ, tủy sống & mạng lưới TK',
        image: '/images/atlas/nerv_full.png',
        systems: ['nervous'],
        camera: { x: 0, y: 0.95, z: 2.3, targetX: 0, targetY: 0.95, targetZ: 0 },
        desc: 'Trung tâm chỉ huy cảm giác, vận động và tư duy toàn diện của cơ thể.'
      },
      {
        id: 'nerv_2_simplified',
        title: '2. Nervous System, Simplified',
        titleVi: '2. Hệ Thần Kinh Giản Lược',
        subtitle: 'Trục não - tủy sống cốt lõi',
        image: '/images/atlas/nerv_full.png',
        systems: ['nervous'],
        camera: { x: 0, y: 1.0, z: 2.1, targetX: 0, targetY: 1.0, targetZ: 0 },
        desc: 'Hệ thần kinh trung ương bao gồm não bộ trong hộp sọ và tủy sống trong ống sống.'
      },
      {
        id: 'nerv_3_brain',
        title: '3. Brain',
        titleVi: '3. Não Bộ Toàn Diện',
        subtitle: 'Đại não, tiểu não và thân não',
        image: '/images/atlas/nerv_brain.png',
        systems: ['nervous'],
        camera: { x: 0.35, y: 1.62, z: 0.52, targetX: 0, targetY: 1.58, targetZ: 0 },
        highlight: 'Falx cerebri',
        desc: 'Trung khu thần kinh cao cấp điều khiển toàn bộ chức năng sống và trí tuệ.'
      },
      {
        id: 'nerv_4_brain_blood',
        title: '4. Brain Blood Supply',
        titleVi: '4. Mạch Cấp Máu Cho Não',
        subtitle: 'Mạch não trước, giữa và sau',
        image: '/images/atlas/nerv_brain.png',
        systems: ['nervous', 'cardiovascular'],
        camera: { x: 0.38, y: 1.60, z: 0.52, targetX: 0, targetY: 1.58, targetZ: 0 },
        desc: 'Cung cấp liên tục 20% lượng oxy và năng lượng của toàn bộ cơ thể cho não.'
      },
      {
        id: 'nerv_5_limbic_system',
        title: '5. Limbic System',
        titleVi: '5. Hệ Viền Limbic & Trí Nhớ',
        subtitle: 'Hải mã, thể hạnh nhân & vòm não',
        image: '/images/atlas/nerv_csf.png',
        systems: ['nervous'],
        camera: { x: 0.28, y: 1.60, z: 0.45, targetX: 0, targetY: 1.58, targetZ: 0 },
        highlight: 'Hippocampus.l',
        desc: 'Trung tâm cảm xúc, động lực hành vi và củng cố trí nhớ dài hạn.'
      },
      {
        id: 'nerv_6_thalamus',
        title: '6. Thalamus',
        titleVi: '6. Đồi Thị & Nhân Xám',
        subtitle: 'Trạm chuyển tiếp cảm giác',
        image: '/images/atlas/nerv_brain.png',
        systems: ['nervous'],
        camera: { x: 0.25, y: 1.60, z: 0.42, targetX: 0, targetY: 1.58, targetZ: 0 },
        highlight: 'Thalamus.l',
        desc: 'Trạm chuyển tiếp mọi đường dẫn truyền cảm giác (trừ khứu giác) lên vỏ não.'
      },
      {
        id: 'nerv_7_cranial_nerves',
        title: '7. Cranial Nerves',
        titleVi: '7. 12 Đôi Dây Thần Kinh Sọ',
        subtitle: 'Thần kinh khứu, thị, vận nhãn, sọ...',
        image: '/images/atlas/nerv_brain.png',
        systems: ['nervous', 'skeletal'],
        camera: { x: 0.25, y: 1.58, z: 0.52, targetX: 0, targetY: 1.56, targetZ: 0 },
        desc: '12 đôi dây thần kinh xuất phát trực tiếp từ não chi phối vùng đầu mặt cổ.'
      },
      {
        id: 'nerv_8_vagus_nerve',
        title: '8. Vagus Nerve (X)',
        titleVi: '8. Dây Thần Kinh Phế Vị (X)',
        subtitle: 'Dây thần kinh lang thang cổ - ngực - bụng',
        image: '/images/atlas/circ_heart_thorax.png',
        systems: ['nervous', 'visceral', 'cardiovascular'],
        camera: { x: 0.18, y: 1.35, z: 0.65, targetX: 0, targetY: 1.32, targetZ: 0 },
        desc: 'Chi phối phó giao cảm cho tim, phổi và hầu hết các cơ quan tiêu hóa.'
      },
      {
        id: 'nerv_9_phrenic_nerves',
        title: '9. Phrenic Nerves',
        titleVi: '9. Dây Thần Kinh Hoành',
        subtitle: 'Nhánh C3-C5 vận động cơ hoành',
        image: '/images/atlas/resp_diaphragm.png',
        systems: ['nervous', 'muscular', 'skeletal'],
        camera: { x: 0.15, y: 1.30, z: 0.68, targetX: 0, targetY: 1.25, targetZ: 0 },
        desc: 'Dây thần kinh quan trọng nhất điều khiển nhịp hô hấp cơ hoành.'
      },
      {
        id: 'nerv_10_brachial_plexus',
        title: '10. Brachial Plexus',
        titleVi: '10. Đám Rối Thần Kinh Cánh Tay',
        subtitle: 'Thần kinh quay, trụ, giữa & cơ bì',
        image: '/images/atlas/musc_limbs.png',
        systems: ['nervous', 'skeletal', 'muscular'],
        camera: { x: 0.35, y: 1.40, z: 0.58, targetX: 0.18, targetY: 1.36, targetZ: 0 },
        desc: 'Mạng lưới thần kinh chi phối toàn bộ cảm giác và vận động chi trên.'
      },
      {
        id: 'nerv_11_lumbosacral',
        title: '11. Lumbosacral Plexus',
        titleVi: '11. Đám Rối Thắt Lưng - Cùng',
        subtitle: 'Rễ thần kinh L1-S4 chi phối chậu & chi dưới',
        image: '/images/atlas/nerv_spinal.png',
        systems: ['nervous', 'skeletal'],
        camera: { x: 0, y: 0.95, z: 0.85, targetX: 0, targetY: 0.92, targetZ: 0 },
        desc: 'Tập hợp các rễ thần kinh vùng thắt lưng và xương cùng tạo thành thần kinh đùi và tọa.'
      },
      {
        id: 'nerv_12_sciatic_nerve',
        title: '12. Sciatic Nerve',
        titleVi: '12. Dây Thần Kinh Tọa (Hông To)',
        subtitle: 'Dây thần kinh lớn nhất cơ thể',
        image: '/images/atlas/reg_lower_limb.png',
        systems: ['nervous', 'skeletal', 'muscular'],
        camera: { x: 0.3, y: 0.80, z: -0.9, targetX: 0.15, targetY: 0.75, targetZ: 0 },
        desc: 'Dây thần kinh chạy từ vùng mông xuống cẳng bàn chân, hay gặp trong bệnh lý thoát vị đĩa đệm.'
      },
      {
        id: 'nerv_13_autonomic',
        title: '13. Autonomic Nerves',
        titleVi: '13. Hệ Thần Kinh Tự Chủ',
        subtitle: 'Chuỗi hạch giao cảm cạnh sống',
        image: '/images/atlas/nerv_full.png',
        systems: ['nervous', 'visceral'],
        camera: { x: 0.35, y: 1.10, z: 0.85, targetX: 0, targetY: 1.10, targetZ: 0 },
        desc: 'Điều hòa nhịp tim, huyết áp, nhu động ruột và các phản ứng sinh tồn tự động.'
      }
    ]
  },
  {
    id: 'respiratory_views',
    titleVi: 'Hệ Hô Hấp',
    titleEn: 'Respiratory System Views',
    systemKey: 'visceral',
    cards: [
      {
        id: 'resp_1_upper',
        title: '1. Upper Respiratory',
        titleVi: '1. Đường Hô Hấp Trên',
        subtitle: 'Mũi xoang, thanh quản và khí quản',
        image: '/images/atlas/resp_upper.png',
        systems: ['visceral', 'skeletal'],
        camera: { x: 0.28, y: 1.54, z: 0.52, targetX: 0, targetY: 1.50, targetZ: 0 },
        highlight: 'Trachea',
        desc: 'Đường dẫn khí vùng đầu mặt cổ: mũi, xoang, hầu và thanh quản.'
      },
      {
        id: 'resp_2_nasal_cavity',
        title: '2. Nasal Cavity',
        titleVi: '2. Ổ Mũi & Cuống Mũi',
        subtitle: 'Xoang bướm, xoang trán & niêm mạc khứu',
        image: '/images/atlas/resp_upper.png',
        systems: ['visceral', 'skeletal'],
        camera: { x: 0.38, y: 1.58, z: 0.38, targetX: 0, targetY: 1.56, targetZ: 0 },
        clipping: { plane: 'sagittal', offset: 0 },
        desc: 'Khoang mũi có chức năng sưởi ấm, làm ẩm và lọc sạch không khí hít vào.'
      },
      {
        id: 'resp_3_eustachian',
        title: '3. Eustachian Tubes',
        titleVi: '3. Vòi Nhĩ Tai (Eustachian)',
        subtitle: 'Đường thông hòm nhĩ và hầu mũi',
        image: '/images/atlas/resp_upper.png',
        systems: ['visceral', 'skeletal'],
        camera: { x: 0.26, y: 1.58, z: 0.36, targetX: 0.05, targetY: 1.55, targetZ: 0 },
        desc: 'Vòi tai cân bằng áp suất giữa tai giữa và khí quyển bên ngoài.'
      },
      {
        id: 'resp_4_pharynx_larynx',
        title: '4. Pharynx and Larynx',
        titleVi: '4. Hầu & Thanh Quản',
        subtitle: 'Sụn giáp, sụn nhẫn & dây thanh âm',
        image: '/images/atlas/resp_upper.png',
        systems: ['visceral', 'skeletal'],
        camera: { x: 0.22, y: 1.48, z: 0.45, targetX: 0, targetY: 1.46, targetZ: 0 },
        highlight: 'Thyroid cartilage',
        desc: 'Cơ quan phát âm và ngã tư giữa đường thở và đường tiêu hóa.'
      },
      {
        id: 'resp_5_trachea_carotids',
        title: '5. Trachea and Carotids',
        titleVi: '5. Khí Quản & Động Mạch Cảnh',
        subtitle: 'Khí quản cổ và bó mạch thần kinh cảnh',
        image: '/images/atlas/circ_heart_thorax.png',
        systems: ['visceral', 'cardiovascular', 'skeletal'],
        camera: { x: 0.18, y: 1.42, z: 0.52, targetX: 0, targetY: 1.38, targetZ: 0 },
        highlight: 'Trachea',
        desc: 'Ống dẫn khí chính từ cổ xuống trung thất trước cột sống.'
      },
      {
        id: 'resp_6_laryngeal_muscles',
        title: '6. Laryngeal Muscles',
        titleVi: '6. Hệ Cơ Nội Tại Thanh Quản',
        subtitle: 'Cơ nhẫn giáp, nhẫn phễu căng chùng dây thanh',
        image: '/images/atlas/musc_head.png',
        systems: ['visceral', 'muscular', 'skeletal'],
        camera: { x: 0.15, y: 1.48, z: 0.35, targetX: 0, targetY: 1.46, targetZ: 0 },
        desc: 'Điều hòa độ căng của dây thanh âm giúp điều chỉnh cao độ giọng nói.'
      },
      {
        id: 'resp_7_location_lungs',
        title: '7. Location of Lungs',
        titleVi: '7. Vị Trí Hai Lá Phổi',
        subtitle: 'Khoang màng phổi trong lồng ngực',
        image: '/images/atlas/resp_lungs.png',
        systems: ['visceral', 'skeletal'],
        camera: { x: 0, y: 1.25, z: 0.90, targetX: 0, targetY: 1.25, targetZ: 0 },
        highlight: 'Superior lobe of left lung',
        desc: 'Mối tương quan giữa hai lá phổi, trung thất và khung xương sườn.'
      },
      {
        id: 'resp_8_hilum',
        title: '8. Hilum',
        titleVi: '8. Rốn Phổi & Cuống Phổi',
        subtitle: 'Phế quản gốc, ĐM phổi & TM phổi',
        image: '/images/atlas/resp_lungs.png',
        systems: ['visceral', 'cardiovascular'],
        camera: { x: 0.25, y: 1.26, z: 0.55, targetX: 0.05, targetY: 1.25, targetZ: 0 },
        desc: 'Nơi ra vào của các cấu trúc mạch máu và đường thở chính của phổi.'
      },
      {
        id: 'resp_9_inhalation_muscles',
        title: '9. Inhalation Muscles',
        titleVi: '9. Nhóm Cơ Hít Vào',
        subtitle: 'Cơ hoành & cơ liên sườn ngoài',
        image: '/images/atlas/resp_diaphragm.png',
        systems: ['visceral', 'muscular', 'skeletal'],
        camera: { x: 0, y: 1.20, z: 0.85, targetX: 0, targetY: 1.20, targetZ: 0 },
        highlight: 'Diaphragm',
        desc: 'Vòm hoành hạ xuống kết hợp sườn nâng lên làm tăng thể tích lồng ngực.'
      },
      {
        id: 'resp_10_exhalation_muscles',
        title: '10. Exhalation Muscles',
        titleVi: '10. Nhóm Cơ Thở Ra',
        subtitle: 'Cơ liên sườn trong & cơ thành bụng',
        image: '/images/atlas/musc_torso.png',
        systems: ['muscular', 'skeletal'],
        camera: { x: 0, y: 1.15, z: 0.95, targetX: 0, targetY: 1.15, targetZ: 0 },
        desc: 'Kéo khung sườn xuống và ép nội tạng bụng hỗ trợ thở ra gắng sức.'
      },
      {
        id: 'resp_11_respiratory_innervation',
        title: '11. Respiratory Innervation',
        titleVi: '11. Thần Kinh Chi Phối Hô Hấp',
        subtitle: 'Dây thần kinh hoành C3-C5 & thần kinh gian sườn',
        image: '/images/atlas/circ_heart_thorax.png',
        systems: ['visceral', 'nervous', 'skeletal'],
        camera: { x: 0.15, y: 1.28, z: 0.70, targetX: 0, targetY: 1.26, targetZ: 0 },
        desc: 'Mạng lưới thần kinh tự động duy trì nhịp thở sinh tồn liên tục.'
      },
      {
        id: 'resp_12_pulmonary_circ',
        title: '12. Pulmonary Circulation',
        titleVi: '12. Tuần Hoàn Máu Tại Phổi',
        subtitle: 'Hệ vi mao mạch phế nang trao đổi khí',
        image: '/images/atlas/resp_lungs.png',
        systems: ['visceral', 'cardiovascular'],
        camera: { x: 0, y: 1.26, z: 0.70, targetX: 0, targetY: 1.26, targetZ: 0 },
        highlight: 'Pulmonary trunk',
        desc: 'Tiểu tuần hoàn mang máu thiếu oxy đến phế nang để nhận oxy tươi.'
      }
    ]
  },
  {
    id: 'muscular_views',
    titleVi: 'Hệ Cơ Vân',
    titleEn: 'Muscular System Views',
    systemKey: 'muscular',
    cards: [
      {
        id: 'musc_1_expression',
        title: '1. Expression',
        titleVi: '1. Cơ Biểu Cảm Khuôn Mặt',
        subtitle: 'Cơ trán, cơ vòng mắt & cơ vòng miệng',
        image: '/images/atlas/musc_head.png',
        systems: ['muscular', 'skeletal'],
        camera: { x: 0.25, y: 1.60, z: 0.50, targetX: 0, targetY: 1.58, targetZ: 0 },
        desc: 'Hệ cơ bám da mặt do dây thần kinh số VII chi phối tạo các nét mặt.'
      },
      {
        id: 'musc_2_mastication',
        title: '2. Mastication',
        titleVi: '2. Cơ Nhai',
        subtitle: 'Cơ cắn, cơ thái dương & cơ chân bướm',
        image: '/images/atlas/musc_head.png',
        systems: ['muscular', 'skeletal'],
        camera: { x: 0.45, y: 1.58, z: 0.40, targetX: 0, targetY: 1.56, targetZ: 0 },
        highlight: 'Superficial part of masseter.l',
        desc: 'Tạo lực cắn nghiền thức ăn mạnh mẽ ở khớp thái dương hàm.'
      },
      {
        id: 'musc_3_laryngeal',
        title: '3. Laryngeal Muscles',
        titleVi: '3. Nhóm Cơ Thanh Quản',
        subtitle: 'Cơ dưới móng và cơ giáp móng',
        image: '/images/atlas/musc_head.png',
        systems: ['muscular', 'skeletal'],
        camera: { x: 0.20, y: 1.48, z: 0.38, targetX: 0, targetY: 1.46, targetZ: 0 },
        desc: 'Nâng hạ thanh quản khi nuốt và điều hòa phát âm.'
      },
      {
        id: 'musc_4_lateral_flexion',
        title: '4. Lateral Flexion',
        titleVi: '4. Cơ Nghiêng Cổ',
        subtitle: 'Cơ gối đầu và cơ bậc thang',
        image: '/images/atlas/musc_head.png',
        systems: ['muscular', 'skeletal'],
        camera: { x: 0, y: 1.45, z: -0.65, targetX: 0, targetY: 1.45, targetZ: 0 },
        desc: 'Nghiêng đầu sang bên trong mặt phẳng đứng ngang.'
      },
      {
        id: 'musc_5_head_rotation',
        title: '5. Head Rotation',
        titleVi: '5. Cơ Xoay Đầu',
        subtitle: 'Cơ ức đòn chũm (SCM)',
        image: '/images/atlas/musc_head.png',
        systems: ['muscular', 'skeletal'],
        camera: { x: 0.35, y: 1.52, z: 0.45, targetX: 0, targetY: 1.50, targetZ: 0 },
        desc: 'Xoay mặt sang phía đối diện và gập cột sống cổ.'
      },
      {
        id: 'musc_6_head_neck_ext',
        title: '6. Head and Neck Extension',
        titleVi: '6. Cơ Duỗi Đầu Cổ',
        subtitle: 'Cơ thang và các cơ sâu vùng gáy',
        image: '/images/atlas/musc_head.png',
        systems: ['muscular', 'skeletal'],
        camera: { x: 0.40, y: 1.52, z: -0.45, targetX: 0, targetY: 1.50, targetZ: 0 },
        desc: 'Giữ đầu ngẩng cao và kéo ngửa cột sống cổ ra sau.'
      },
      {
        id: 'musc_7_head_flexion',
        title: '7. Head Flexion',
        titleVi: '7. Cơ Gập Đầu',
        subtitle: 'Cơ dài đầu và cơ dài cổ',
        image: '/images/atlas/musc_head.png',
        systems: ['muscular', 'skeletal'],
        camera: { x: 0.30, y: 1.54, z: 0.45, targetX: 0, targetY: 1.50, targetZ: 0 },
        desc: 'Gập cằm về phía xương ức ở mặt trước cột sống cổ.'
      },
      {
        id: 'musc_8_mandible_depression',
        title: '8. Mandible Depression',
        titleVi: '8. Cơ Hạ Xương Hàm Dưới',
        subtitle: 'Cơ hai thân và cơ hàm móng',
        image: '/images/atlas/musc_head.png',
        systems: ['muscular', 'skeletal'],
        camera: { x: 0.35, y: 1.50, z: 0.35, targetX: 0, targetY: 1.50, targetZ: 0 },
        desc: 'Mở miệng và hạ hàm dưới khi ăn nhai và nói chuyện.'
      },
      {
        id: 'musc_9_inhalation',
        title: '9. Inhalation',
        titleVi: '9. Cơ Hít Vào Thân Mình',
        subtitle: 'Cơ ngực lớn, ngực bé và cơ liên sườn',
        image: '/images/atlas/musc_torso.png',
        systems: ['muscular', 'skeletal'],
        camera: { x: 0, y: 1.25, z: 0.85, targetX: 0, targetY: 1.25, targetZ: 0 },
        desc: 'Nâng khung xương sườn mở rộng thể tích khoang ngực.'
      },
      {
        id: 'musc_10_exhalation',
        title: '10. Exhalation',
        titleVi: '10. Cơ Thở Ra Thân Mình',
        subtitle: 'Cơ thẳng bụng và cơ chéo bụng',
        image: '/images/atlas/musc_torso.png',
        systems: ['muscular', 'skeletal'],
        camera: { x: 0.2, y: 1.15, z: 0.90, targetX: 0, targetY: 1.15, targetZ: 0 },
        desc: 'Nén thành bụng đẩy cơ hoành lên trên ép khí ra ngoài.'
      },
      {
        id: 'musc_11_shoulder',
        title: '11. Shoulder',
        titleVi: '11. Cơ Vùng Khớp Vai',
        subtitle: 'Cơ delta, cơ trên gai, dưới gai và cơ tròn',
        image: '/images/atlas/musc_limbs.png',
        systems: ['muscular', 'skeletal'],
        camera: { x: 0.35, y: 1.35, z: 0.65, targetX: 0.18, targetY: 1.30, targetZ: 0 },
        desc: 'Đai cơ chóp xoay giữ vững chỏm xương cánh tay trong ổ chảo.'
      },
      {
        id: 'musc_12_elbow',
        title: '12. Elbow',
        titleVi: '12. Cơ Vùng Khuỷu Tay',
        subtitle: 'Cơ nhị đầu, tam đầu và cơ cánh tay',
        image: '/images/atlas/musc_limbs.png',
        systems: ['muscular', 'skeletal'],
        camera: { x: 0.38, y: 1.10, z: 0.60, targetX: 0.22, targetY: 1.05, targetZ: 0 },
        desc: 'Thực hiện động tác gập duỗi khớp bản lề khuỷu tay.'
      },
      {
        id: 'musc_13_wrist_hand',
        title: '13. Wrist and Hand',
        titleVi: '13. Cơ Cổ Tay & Bàn Tay',
        subtitle: 'Các gân gập duỗi ngón tay và mạc hãm gân',
        image: '/images/atlas/reg_upper_limb.png',
        systems: ['muscular', 'skeletal'],
        camera: { x: 0.40, y: 0.85, z: 0.55, targetX: 0.30, targetY: 0.80, targetZ: 0 },
        desc: 'Điều khiển chuyển động cầm nắm tinh xảo của các ngón tay.'
      },
      {
        id: 'musc_14_upper_back',
        title: '14. Upper Back',
        titleVi: '14. Cơ Vùng Lưng Trên',
        subtitle: 'Cơ lưng rộng, cơ trám và cơ nâng vai',
        image: '/images/atlas/musc_torso.png',
        systems: ['muscular', 'skeletal'],
        camera: { x: 0, y: 1.30, z: -0.95, targetX: 0, targetY: 1.28, targetZ: 0 },
        desc: 'Kéo xương bả vai về sau và áp sát cột sống lưng.'
      },
      {
        id: 'musc_15_lower_back',
        title: '15. Lower Back',
        titleVi: '15. Cơ Vùng Thắt Lưng',
        subtitle: 'Nhóm cơ dựng sống và cơ vuông thắt lưng',
        image: '/images/atlas/skel_spine.png',
        systems: ['muscular', 'skeletal'],
        camera: { x: 0.2, y: 1.05, z: -0.85, targetX: 0, targetY: 1.05, targetZ: 0 },
        desc: 'Giữ vững trục thắt lưng và chống đỡ toàn bộ nửa trên cơ thể.'
      }
    ]
  },
  {
    id: 'digestive_views',
    titleVi: 'Hệ Tiêu Hóa',
    titleEn: 'Digestive System Views',
    systemKey: 'visceral',
    cards: [
      {
        id: 'dig_1_upper',
        title: '1. Upper Digestive System',
        titleVi: '1. Đường Tiêu Hóa Trên',
        subtitle: 'Miệng, thực quản và dạ dày',
        image: '/images/atlas/dig_upper.png',
        systems: ['visceral', 'skeletal'],
        camera: { x: 0.35, y: 1.45, z: 0.55, targetX: 0, targetY: 1.40, targetZ: 0 },
        highlight: 'Oesophagus',
        desc: 'Ống dẫn thức ăn từ miệng qua thực quản xuống dạ dày.'
      },
      {
        id: 'dig_2_lower',
        title: '2. Lower Digestive System',
        titleVi: '2. Đường Tiêu Hóa Dưới',
        subtitle: 'Ruột non, ruột già và hậu môn trực tràng',
        image: '/images/atlas/dig_lower.png',
        systems: ['visceral', 'skeletal'],
        camera: { x: 0, y: 0.95, z: 0.90, targetX: 0, targetY: 0.95, targetZ: 0 },
        highlight: 'Ascending colon',
        desc: 'Hấp thu triệt để chất dinh dưỡng và hình thành khuôn phân.'
      },
      {
        id: 'dig_3_peritoneum',
        title: '3. Peritoneum',
        titleVi: '3. Phúc Mạc & Mạc Nối',
        subtitle: 'Mạc nối lớn, mạc nối nhỏ và rễ mạc treo',
        image: '/images/atlas/dig_peritoneum.png',
        systems: ['visceral', 'skeletal'],
        camera: { x: 0, y: 1.05, z: 0.95, targetX: 0, targetY: 1.05, targetZ: 0 },
        desc: 'Màng bao bọc và cố định các tạng trong ổ bụng, chứa mạch máu nuôi ruột.'
      },
      {
        id: 'dig_4_salivary_glands',
        title: '4. Salivary Glands',
        titleVi: '4. Tuyến Nước Bọt',
        subtitle: 'Tuyến mang tai, dưới hàm và dưới lưỡi',
        image: '/images/atlas/dig_upper.png',
        systems: ['visceral', 'skeletal'],
        camera: { x: 0.35, y: 1.54, z: 0.40, targetX: 0, targetY: 1.52, targetZ: 0 },
        desc: 'Tiết enzym amylase bắt đầu quá trình tiêu hóa tinh bột ngay tại miệng.'
      },
      {
        id: 'dig_5_teeth',
        title: '5. Teeth',
        titleVi: '5. Bộ Răng Vĩnh Viễn',
        subtitle: '32 răng người lớn: răng cửa, nanh, hàm',
        image: '/images/atlas/skel_skull.png',
        systems: ['skeletal'],
        camera: { x: 0, y: 1.54, z: 0.35, targetX: 0, targetY: 1.52, targetZ: 0 },
        highlight: 'Maxilla.l',
        desc: 'Bộ phận cơ học cắn xé và nghiền nhỏ thức ăn trước khi nuốt.'
      },
      {
        id: 'dig_6_laryngopharynx',
        title: '6. Laryngopharynx',
        titleVi: '6. Hầu Thanh Quản',
        subtitle: 'Ngã tư đường ăn và đường thở',
        image: '/images/atlas/resp_upper.png',
        systems: ['visceral', 'skeletal'],
        camera: { x: 0.25, y: 1.46, z: 0.40, targetX: 0, targetY: 1.44, targetZ: 0 },
        desc: 'Nắp thanh nhiệt đậy kín đường thở khi thức ăn đi qua hầu vào thực quản.'
      },
      {
        id: 'dig_7_alimentary_canal',
        title: '7. Alimentary Canal',
        titleVi: '7. Toàn Bộ Ống Tiêu Hóa',
        subtitle: 'Trục ống liên tục từ miệng đến trực tràng',
        image: '/images/atlas/dig_lower.png',
        systems: ['visceral', 'skeletal'],
        camera: { x: 0, y: 1.12, z: 1.55, targetX: 0, targetY: 1.12, targetZ: 0 },
        desc: 'Đoạn ống tiêu hóa dài khoảng 9 mét với nhu động co bóp liên tục.'
      },
      {
        id: 'dig_8_stomach_vasculature',
        title: '8. Stomach Vasculature',
        titleVi: '8. Mạng Mạch Máu Nuôi Dạ Dày',
        subtitle: 'Vòng ĐM bờ cong lớn và bờ cong nhỏ',
        image: '/images/atlas/dig_upper.png',
        systems: ['visceral', 'cardiovascular'],
        camera: { x: 0.15, y: 1.15, z: 0.75, targetX: 0, targetY: 1.12, targetZ: 0 },
        highlight: 'Stomach',
        desc: 'Nhánh tách từ động mạch thân tạng cấp máu phong phú cho dạ dày.'
      },
      {
        id: 'dig_9_sphincters',
        title: '9. Sphincters',
        titleVi: '9. Các Cơ Thắt Đường Tiêu Hóa',
        subtitle: 'Cơ thắt tâm vị, môn vị, van hồi manh tràng',
        image: '/images/atlas/dig_lower.png',
        systems: ['visceral'],
        camera: { x: 0, y: 1.05, z: 0.70, targetX: 0, targetY: 1.05, targetZ: 0 },
        desc: 'Các van một chiều ngăn trào ngược dịch vị và kiểm soát lưu thông thức ăn.'
      },
      {
        id: 'dig_10_accessory_organs',
        title: '10. Accessory Organs',
        titleVi: '10. Tuyến Tiêu Hóa Phụ Trợ',
        subtitle: 'Lá gan, túi mật và tuyến tụy',
        image: '/images/atlas/dig_peritoneum.png',
        systems: ['visceral'],
        camera: { x: -0.15, y: 1.15, z: 0.75, targetX: 0, targetY: 1.12, targetZ: 0 },
        highlight: 'Liver',
        desc: 'Sản xuất mật nhũ hóa chất béo và enzym phân giải protid, lipid, glucid.'
      },
      {
        id: 'dig_11_regional_vasculature',
        title: '11. Regional Vasculature',
        titleVi: '11. Mạch Máu Vùng Ổ Bụng',
        subtitle: 'ĐM mạc treo tràng trên và tĩnh mạch cửa',
        image: '/images/atlas/dig_peritoneum.png',
        systems: ['visceral', 'cardiovascular'],
        camera: { x: 0.1, y: 1.12, z: 0.80, targetX: 0, targetY: 1.10, targetZ: 0 },
        desc: 'Thu gom toàn bộ chất dinh dưỡng hấp thu từ ruột về gan xử lý.'
      },
      {
        id: 'dig_12_intestines',
        title: '12. Intestines',
        titleVi: '12. Ruột Non & Ruột Già',
        subtitle: 'Hỗng tràng, hồi tràng, đại tràng lên, ngang, xuống',
        image: '/images/atlas/dig_lower.png',
        systems: ['visceral', 'skeletal'],
        camera: { x: 0, y: 0.95, z: 0.85, targetX: 0, targetY: 0.92, targetZ: 0 },
        desc: 'Toàn bộ các quai ruột non và khung đại tràng bao quanh ổ bụng.'
      }
    ]
  },
  {
    id: 'lymphatic_views',
    titleVi: 'Hệ Bạch Huyết',
    titleEn: 'Lymphatic System Views',
    systemKey: 'lymphatic',
    cards: [
      {
        id: 'lymph_spleen',
        title: '1. Spleen & Lymphatics',
        titleVi: '1. Lá Lách & Hệ Bạch Huyết',
        subtitle: 'Lá lách (Tỳ), chuỗi hạch bạch huyết và ống ngực',
        badge: 'Lá lách & Miễn dịch',
        image: '/images/atlas/lymph_spleen.png',
        systems: ['lymphatic', 'skeletal', 'visceral'],
        camera: { x: 0.25, y: 1.15, z: 0.78, targetX: 0.08, targetY: 1.15, targetZ: 0 },
        highlight: 'Spleen',
        desc: 'Cơ quan lympho lớn nhất cơ thể lọc máu, tiêu hủy hồng cầu già và sinh tế bào miễn dịch.'
      },
      {
        id: 'lymph_nodes_system',
        title: '2. Lymphatic Nodes Network',
        titleVi: '2. Mạng Lưới Hạch Bạch Huyết Toàn Thân',
        subtitle: 'Hạch vùng cổ, nách, bẹn và ống ngực dẫn lưu',
        badge: 'Hạch bạch huyết',
        image: '/images/atlas/lymph_nodes_system.png',
        systems: ['lymphatic', 'skeletal'],
        camera: { x: 0, y: 1.2, z: 1.4, targetX: 0, targetY: 1.15, targetZ: 0 },
        highlight: 'Central axillary nodes.l',
        desc: 'Hàng rào phòng thủ miễn dịch tế bào, bắt giữ vi khuẩn và dẫn lưu dịch bạch huyết về tĩnh mạch.'
      }
    ]
  },
  {
    id: 'urinary_views',
    titleVi: 'Hệ Tiết Niệu',
    titleEn: 'Urinary System Views',
    systemKey: 'visceral',
    cards: [
      {
        id: 'urin_system',
        title: '1. Urinary System',
        titleVi: '1. Hệ Tiết Niệu Thận',
        subtitle: 'Hai quả thận, niệu quản và bàng quang',
        badge: 'Thận tiết niệu',
        image: '/images/atlas/urin_system.png',
        systems: ['visceral', 'skeletal'],
        camera: { x: 0, y: 1.05, z: 0.85, targetX: 0, targetY: 1.05, targetZ: 0 },
        highlight: 'Kidney.l',
        desc: 'Lọc máu, cân bằng điện giải và bài tiết chất thải qua nước tiểu.'
      },
      {
        id: 'urin_pelvic',
        title: '2. Pelvic Organs',
        titleVi: '2. Các Tạng Vùng Chậu',
        subtitle: 'Bàng quang, niệu đạo và đáy chậu',
        badge: 'Chậu hông',
        image: '/images/atlas/urin_pelvic.png',
        systems: ['visceral', 'skeletal'],
        camera: { x: 0, y: 0.88, z: 0.78, targetX: 0, targetY: 0.88, targetZ: 0 },
        highlight: 'Urinary bladder',
        desc: 'Giải phẫu đáy chậu, nâng đỡ các tạng sinh dục và bài tiết nước tiểu.'
      }
    ]
  }
];

export const ATLAS_REGIONS_CATEGORIES = [
  {
    id: 'reg_head_neck',
    titleVi: 'Vùng Đầu & Cổ',
    title: 'Vùng Đầu & Cổ',
    subtitle: 'Hộp sọ, khối mặt và các cơ mạch máu cổ',
    badge: 'Đầu & Cổ',
    image: '/images/atlas/reg_head_neck.png',
    camera: { x: 0, y: 1.55, z: 0.7, targetX: 0, targetY: 1.52, targetZ: 0 },
    systems: ['skeletal', 'nervous', 'cardiovascular']
  },
  {
    id: 'reg_thorax',
    titleVi: 'Vùng Lồng Ngực',
    title: 'Vùng Lồng Ngực',
    subtitle: 'Tim, hai lá phổi, trung thất và thành ngực',
    badge: 'Lồng ngực',
    image: '/images/atlas/reg_thorax.png',
    camera: { x: 0, y: 1.25, z: 1.0, targetX: 0, targetY: 1.22, targetZ: 0 },
    systems: ['skeletal', 'cardiovascular', 'visceral']
  },
  {
    id: 'reg_abdomen_pelvis',
    titleVi: 'Vùng Bụng & Chậu',
    title: 'Vùng Bụng & Chậu',
    subtitle: 'Khoang phúc mạc, ruột và tạng chậu hông',
    badge: 'Bụng & Chậu',
    image: '/images/atlas/reg_abdomen_pelvis.png',
    camera: { x: 0, y: 0.98, z: 1.05, targetX: 0, targetY: 0.95, targetZ: 0 },
    systems: ['skeletal', 'visceral']
  },
  {
    id: 'reg_spine',
    titleVi: 'Trục Cột Sống',
    title: 'Trục Cột Sống',
    subtitle: 'Đoạn sống cổ, ngực, thắt lưng và cùng cụt',
    badge: 'Cột sống',
    image: '/images/atlas/reg_spine.png',
    camera: { x: 0.75, y: 1.15, z: 0.9, targetX: 0, targetY: 1.1, targetZ: 0 },
    systems: ['skeletal']
  },
  {
    id: 'reg_upper_limb',
    titleVi: 'Vùng Chi Trên',
    title: 'Vùng Chi Trên',
    subtitle: 'Đai vai, cánh tay, cẳng tay và bàn tay',
    badge: 'Chi trên',
    image: '/images/atlas/reg_upper_limb.png',
    camera: { x: 0.45, y: 1.1, z: 1.1, targetX: 0.35, targetY: 1.1, targetZ: 0 },
    systems: ['skeletal', 'muscular']
  },
  {
    id: 'reg_lower_limb',
    titleVi: 'Vùng Chi Dưới',
    title: 'Vùng Chi Dưới',
    subtitle: 'Khớp háng, đùi, khớp gối và cẳng bàn chân',
    badge: 'Chi dưới',
    image: '/images/atlas/reg_lower_limb.png',
    camera: { x: 0.25, y: 0.5, z: 1.3, targetX: 0.2, targetY: 0.5, targetZ: 0 },
    systems: ['skeletal']
  }
];

import { getAtlasMediaCategories } from './atlasMediaManager.js';

export const ATLAS_MEDIA_CATEGORIES = getAtlasMediaCategories();


export const ATLAS_QUIZZES_DATA = [
  {
    id: 'quiz_identify',
    titleVi: '1. Trắc Nghiệm Nhận Diện 3D',
    title: '1. Trắc Nghiệm Nhận Diện 3D',
    subtitle: 'Chạm trực tiếp vào đúng cấu trúc được yêu cầu',
    badge: 'Trắc nghiệm 3D',
    image: '/images/atlas/quiz_identify.png',
    action: 'start_quiz',
    desc: 'Hệ thống đưa ra câu hỏi danh pháp y khoa, bạn xoay mô hình 3D và chạm đúng đích.'
  },
  {
    id: 'quiz_fsrs',
    titleVi: '2. Thẻ Ghi Nhớ Thông Minh FSRS',
    title: '2. Thẻ Ghi Nhớ Thông Minh FSRS',
    subtitle: 'Thuật toán ôn tập ngắt quãng khoa học',
    badge: 'Ôn tập FSRS',
    image: '/images/atlas/quiz_fsrs.png',
    action: 'start_fsrs',
    desc: 'Tự động lên lịch ôn các mốc giải phẫu hay quên để khắc sâu vào trí nhớ dài hạn.'
  },
  {
    id: 'quiz_clinical_cases',
    titleVi: '3. Ca Bệnh Lâm Sàng Tương Tác',
    title: '3. Ca Bệnh Lâm Sàng Tương Tác',
    subtitle: 'Tình huống cấp cứu tai nạn và phẫu thuật',
    badge: 'Bác sĩ ảo',
    image: '/images/atlas/quiz_clinical_cases.png',
    action: 'start_scenario',
    desc: 'Vận dụng giải phẫu vào lâm sàng: vết thương thấu ngực, gãy cổ xương đùi, thoát vị.'
  }
];

// 4. GROSS ANATOMY LAB (Phòng Thực Tập Giải Phẫu Thi Thể / Bàn Mổ - Visible Body Cadaver Standard)
export const ATLAS_LAB_CATEGORIES = [
  {
    id: 'lab_back',
    titleVi: '1. Vùng Lưng (Tư Thế Nằm Sấp)',
    title: '1. Vùng Lưng (Back - Nằm sấp)',
    subtitle: 'Cơ thang, cơ lưng rộng và cột sống trên bàn mổ',
    badge: 'Nằm sấp',
    orientation: 'prone',
    showTable: true,
    systems: ['muscular', 'skeletal'],
    camera: { x: 0.65, y: 1.55, z: 0.45, targetX: 0, targetY: 0.85, targetZ: 0 },
    image: '/images/atlas/reg_thorax.png',
    desc: 'Phẫu tích vùng lưng ở tư thế nằm sấp (Prone) trên bàn mổ inox y khoa.'
  },
  {
    id: 'lab_upper_limb',
    titleVi: '2. Chi Trên & Đai Vai',
    title: '2. Chi Trên & Đai Vai (Upper Limb)',
    subtitle: 'Đai vai, cánh tay, cẳng tay và bàn tay',
    badge: 'Nằm ngửa',
    orientation: 'supine',
    showTable: true,
    systems: ['muscular', 'skeletal', 'nervous'],
    camera: { x: 0.85, y: 1.35, z: 0.65, targetX: 0.35, targetY: 0.85, targetZ: -0.35 },
    image: '/images/atlas/reg_upper_limb.png',
    desc: 'Bộc lộ cơ delta, ống cánh tay và bó mạch thần kinh chi trên.'
  },
  {
    id: 'lab_thorax',
    titleVi: '3. Vùng Lồng Ngực',
    title: '3. Lồng Ngực (Thorax)',
    subtitle: 'Khung sườn, cơ liên sườn và cơ ngực lớn',
    badge: 'Nằm ngửa',
    orientation: 'supine',
    showTable: true,
    systems: ['skeletal', 'muscular'],
    camera: { x: 0.45, y: 1.50, z: 0.35, targetX: 0, targetY: 0.85, targetZ: -0.25 },
    image: '/images/atlas/reg_thorax.png',
    desc: 'Bóc tách thành ngực trước bộc lộ xương ức, sụn sườn và cơ hoành.'
  },
  {
    id: 'lab_heart_lungs',
    titleVi: '4. Tim & Hai Lá Phổi',
    title: '4. Tim & Phổi (Heart & Lungs)',
    subtitle: 'Trung thất, màng ngoài tim và phế quản',
    badge: 'Nằm ngửa',
    orientation: 'supine',
    showTable: true,
    systems: ['visceral', 'cardiovascular', 'skeletal'],
    camera: { x: 0.35, y: 1.45, z: 0.25, targetX: 0, targetY: 0.85, targetZ: -0.25 },
    image: '/images/atlas/circ_heart_thorax.png',
    desc: 'Phẫu tích trung thất giữa bộc lộ các buồng tim, quai động mạch chủ và hai lá phổi.'
  },
  {
    id: 'lab_abdomen',
    titleVi: '5. Thành Bụng & Ổ Bụng',
    title: '5. Thành Bụng & Ổ Bụng (Abdomen)',
    subtitle: 'Cơ thẳng bụng, cơ chéo bụng và bao cơ',
    badge: 'Nằm ngửa',
    orientation: 'supine',
    showTable: true,
    systems: ['muscular', 'visceral'],
    camera: { x: 0.50, y: 1.40, z: 0.45, targetX: 0, targetY: 0.82, targetZ: 0.05 },
    image: '/images/atlas/reg_abdomen_pelvis.png',
    desc: 'Mở thành bụng trước bộc lộ lá phúc mạc thành và mạc nối lớn.'
  },
  {
    id: 'lab_intraperitoneal',
    titleVi: '6. Các Tạng Trong Phúc Mạc',
    title: '6. Tạng Trong Phúc Mạc (Intraperitoneal)',
    subtitle: 'Dạ dày, gan, ruột non và đại tràng',
    badge: 'Nằm ngửa',
    orientation: 'supine',
    showTable: true,
    systems: ['visceral'],
    camera: { x: 0.40, y: 1.35, z: 0.35, targetX: 0, targetY: 0.82, targetZ: 0.05 },
    image: '/images/atlas/reg_abdomen_pelvis.png',
    desc: 'Hệ tiêu hóa trong ổ bụng, mạc treo ruột và phân bố mạch mạc treo tràng trên.'
  },
  {
    id: 'lab_retroperitoneal',
    titleVi: '7. Các Tạng Sau Phúc Mạc',
    title: '7. Tạng Sau Phúc Mạc (Retroperitoneal)',
    subtitle: 'Hai quả thận, tuyến thượng thận và ĐM chủ bụng',
    badge: 'Nằm ngửa',
    orientation: 'supine',
    showTable: true,
    systems: ['visceral', 'cardiovascular', 'skeletal'],
    camera: { x: 0.30, y: 1.35, z: 0.20, targetX: 0, targetY: 0.82, targetZ: 0.02 },
    image: '/images/atlas/reg_abdomen_pelvis.png',
    desc: 'Bóc tách khoang sau phúc mạc bộc lộ đài bể thận, niệu quản và TM chủ dưới.'
  },
  {
    id: 'lab_pelvis',
    titleVi: '8. Vùng Chậu & Đáy Chậu',
    title: '8. Vùng Chậu (Pelvis & Perineum)',
    subtitle: 'Bàng quang, trực tràng và đáy chậu',
    badge: 'Nằm ngửa',
    orientation: 'supine',
    showTable: true,
    systems: ['skeletal', 'visceral', 'muscular'],
    camera: { x: 0.45, y: 1.35, z: 0.55, targetX: 0, targetY: 0.80, targetZ: 0.25 },
    image: '/images/atlas/skel_pelvis.png',
    desc: 'Khung chậu thực tập giải phẫu cơ sàn chậu và động mạch chậu trong.'
  },
  {
    id: 'lab_lower_limb',
    titleVi: '9. Vùng Chi Dưới',
    title: '9. Chi Dưới (Lower Limb Regional)',
    subtitle: 'Đùi, khớp gối, cẳng chân và bàn chân',
    badge: 'Nằm ngửa',
    orientation: 'supine',
    showTable: true,
    systems: ['muscular', 'skeletal', 'nervous'],
    camera: { x: 0.75, y: 1.25, z: 0.85, targetX: 0, targetY: 0.78, targetZ: 0.65 },
    image: '/images/atlas/reg_lower_limb.png',
    desc: 'Bộc lộ tam giác đùi Scarpa, thần kinh tọa và các nhóm cơ cẳng chân.'
  }
];

// 5. CROSS SECTIONS (Lát Cắt Giải Phẫu 3D - Cắt Lớp Y Khoa CT/MRI Chuẩn Visible Body)
export const ATLAS_CROSS_SECTIONS_CATEGORIES = [
  {
    id: 'cs_group_head_axial',
    titleVi: 'Vùng Đầu (Mặt Cắt Ngang)',
    plane: 'axial',
    cards: [
      {
        id: 'cs_head_thalamus',
        titleVi: '1. Vùng Đầu (Mặt Cắt Đồi Thị & Hạch Nền)',
        title: '1. Head (Thalamus)',
        subtitle: 'Lát cắt ngang qua não thất ba, đồi thị và bao trong',
        badge: 'Cắt ngang',
        plane: 'axial',
        offset: 1.62,
        camera: { x: 0, y: 1.88, z: 0.05, targetX: 0, targetY: 1.62, targetZ: 0 },
        systems: ['skeletal', 'nervous'],
        image: '/images/atlas/nerv_brain.png',
        desc: 'Lát cắt ngang tiêu chuẩn qua đồi thị và hạch nền não bộ.'
      },
      {
        id: 'cs_head_brow',
        titleVi: '2. Vùng Đầu (Mặt Cắt Cung Mày & Cực Trán)',
        title: '2. Head (Brow)',
        subtitle: 'Lát cắt ngang qua thùy trán, xoang trán và sừng trán não thất bên',
        badge: 'Cắt ngang',
        plane: 'axial',
        offset: 1.58,
        camera: { x: 0, y: 1.85, z: 0.05, targetX: 0, targetY: 1.58, targetZ: 0 },
        systems: ['skeletal', 'nervous'],
        image: '/images/atlas/nerv_brain.png',
        desc: 'Mặt phẳng cắt ngang qua mức cung mày và cực trán.'
      },
      {
        id: 'cs_head_orbit_ax',
        titleVi: '3. Vùng Đầu (Mặt Cắt Ngang Hốc Mắt)',
        title: '3. Head (Orbit) (Axial)',
        subtitle: 'Lát cắt ngang qua nhãn cầu, thần kinh thị giác và xương bướm',
        badge: 'Cắt ngang',
        plane: 'axial',
        offset: 1.52,
        camera: { x: 0, y: 1.80, z: 0.05, targetX: 0, targetY: 1.52, targetZ: 0 },
        systems: ['skeletal', 'nervous'],
        image: '/images/atlas/skel_skull.png',
        desc: 'Mặt phẳng cắt ngang qua hai hốc mắt và xoang bướm.'
      }
    ]
  },
  {
    id: 'cs_group_head_coronal',
    titleVi: 'Vùng Đầu (Mặt Cắt Đứng Ngang)',
    plane: 'coronal',
    cards: [
      {
        id: 'cs_head_orbit_cor',
        titleVi: '1. Vùng Đầu (Mặt Cắt Đứng Ngang Hốc Mắt)',
        title: '1. Head (Orbit) (Coronal)',
        subtitle: 'Mặt phẳng đứng ngang qua nhãn cầu, xoang trán và xoang hàm trên',
        badge: 'Cắt đứng ngang',
        plane: 'coronal',
        offset: 0.06,
        camera: { x: 0, y: 1.55, z: 0.70, targetX: 0, targetY: 1.55, targetZ: 0 },
        systems: ['skeletal', 'nervous'],
        image: '/images/atlas/skel_skull.png',
        desc: 'Cắt đứng ngang bộc lộ hốc mắt và xoang cạnh mũi.'
      },
      {
        id: 'cs_head_pituitary',
        titleVi: '2. Vùng Đầu (Mặt Cắt Tuyến Yên & Xoang Hang)',
        title: '2. Head (Pituitary)',
        subtitle: 'Mặt phẳng đứng ngang qua hố yên, tuyến yên và giao thoa thị',
        badge: 'Cắt đứng ngang',
        plane: 'coronal',
        offset: 0.00,
        camera: { x: 0, y: 1.55, z: 0.70, targetX: 0, targetY: 1.55, targetZ: 0 },
        systems: ['skeletal', 'nervous'],
        image: '/images/atlas/nerv_brain.png',
        desc: 'Lát cắt đứng ngang qua tuyến yên và động mạch cảnh trong xoang hang.'
      },
      {
        id: 'cs_head_pons',
        titleVi: '3. Vùng Đầu (Mặt Cắt Cầu Não & Tiểu Não)',
        title: '3. Head (Pons)',
        subtitle: 'Mặt phẳng đứng ngang qua cầu não, não thất tư và bán cầu tiểu não',
        badge: 'Cắt đứng ngang',
        plane: 'coronal',
        offset: -0.04,
        camera: { x: 0, y: 1.55, z: 0.70, targetX: 0, targetY: 1.55, targetZ: 0 },
        systems: ['skeletal', 'nervous'],
        image: '/images/atlas/nerv_brain.png',
        desc: 'Cắt đứng ngang hố sọ sau bộc lộ cầu não và tiểu não.'
      }
    ]
  },
  {
    id: 'cs_group_head_sagittal',
    titleVi: 'Vùng Đầu (Mặt Cắt Đứng Dọc)',
    plane: 'sagittal',
    cards: [
      {
        id: 'cs_head_midsagittal',
        titleVi: '1. Vùng Đầu (Mặt Cắt Đứng Dọc Chính Giữa)',
        title: '1. Head (Midsagittal)',
        subtitle: 'Lát cắt đứng dọc chính giữa qua thể chai, thân não và tủy sống',
        badge: 'Cắt đứng dọc',
        plane: 'sagittal',
        offset: 0.00,
        camera: { x: 0.70, y: 1.55, z: 0.0, targetX: 0, targetY: 1.55, targetZ: 0 },
        systems: ['skeletal', 'nervous'],
        image: '/images/atlas/nerv_brain.png',
        desc: 'Lát cắt đứng dọc chính giữa thể hiện hệ thần kinh trung ương trung tâm.'
      },
      {
        id: 'cs_head_orbit_sag',
        titleVi: '2. Vùng Đầu (Mặt Cắt Đứng Dọc Hốc Mắt)',
        title: '2. Head (Orbit) (Sagittal)',
        subtitle: 'Lát cắt đứng dọc qua nhãn cầu, thần kinh thị và cơ thẳng trên/dưới',
        badge: 'Cắt đứng dọc',
        plane: 'sagittal',
        offset: 0.05,
        camera: { x: 0.70, y: 1.55, z: 0.05, targetX: 0.05, targetY: 1.55, targetZ: 0.05 },
        systems: ['skeletal', 'nervous'],
        image: '/images/atlas/skel_skull.png',
        desc: 'Mặt phẳng đứng dọc xuyên qua trục hốc mắt và ổ mắt.'
      }
    ]
  },
  {
    id: 'cs_group_thorax_axial',
    titleVi: 'Vùng Lồng Ngực (Mặt Cắt Ngang)',
    plane: 'axial',
    cards: [
      {
        id: 'cs_thorax_t02_t03',
        titleVi: '1. Lồng Ngực (Đoạn Đốt Sống T2 - T3)',
        title: '1. Thorax (T02-T03)',
        subtitle: 'Lát cắt ngang qua cung động mạch chủ, tĩnh mạch vô danh và khí quản',
        badge: 'Cắt ngang',
        plane: 'axial',
        offset: 1.36,
        camera: { x: 0, y: 1.70, z: 0.05, targetX: 0, targetY: 1.36, targetZ: 0 },
        systems: ['cardiovascular', 'visceral', 'skeletal'],
        image: '/images/atlas/reg_thorax.png',
        scoutLabel: 'Thorax T02-T03',
        desc: 'Mặt phẳng cắt ngang qua đốt sống ngực T2-T3 bộc lộ các mạch máu lớn vùng nền cổ.'
      },
      {
        id: 'cs_thorax_t03_t04',
        titleVi: '2. Lồng Ngực (Đoạn Đốt Sống T3 - T4)',
        title: '2. Thorax (T03-T04)',
        subtitle: 'Lát cắt ngang qua phế quản gốc, trạc ba khí quản carina và ĐM phổi',
        badge: 'Cắt ngang',
        plane: 'axial',
        offset: 1.32,
        camera: { x: 0, y: 1.68, z: 0.05, targetX: 0, targetY: 1.32, targetZ: 0 },
        systems: ['cardiovascular', 'visceral', 'skeletal'],
        image: '/images/atlas/resp_lungs.png',
        scoutLabel: 'Thorax T03-T04',
        desc: 'Mặt phẳng cắt ngang qua trạc ba khí quản và cuống phổi.'
      },
      {
        id: 'cs_thorax_t04_t05',
        titleVi: '3. Lồng Ngực (Đoạn Đốt Sống T4 - T5)',
        title: '3. Thorax (T04-T05)',
        subtitle: 'Lát cắt ngang qua 4 buồng tim, nhĩ thất và rãnh liên thất',
        badge: 'Cắt ngang',
        plane: 'axial',
        offset: 1.28,
        camera: { x: 0, y: 1.65, z: 0.05, targetX: 0, targetY: 1.28, targetZ: 0 },
        systems: ['cardiovascular', 'visceral', 'skeletal'],
        image: '/images/atlas/circ_heart_thorax.png',
        scoutLabel: 'Thorax T04-T05',
        desc: 'Lát cắt ngang 4 buồng tim tiêu chuẩn đối chiếu siêu âm và CT tim.'
      }
    ]
  },
  {
    id: 'cs_group_abdomen_axial',
    titleVi: 'Vùng Ổ Bụng (Mặt Cắt Ngang)',
    plane: 'axial',
    cards: [
      {
        id: 'cs_abdomen_t11_t12',
        titleVi: '1. Ổ Bụng (Đoạn Đốt Sống T11 - T12)',
        title: '1. Abdomen (T11-T12)',
        subtitle: 'Lát cắt ngang qua thùy gan, phình vị dạ dày, lách và động mạch thân tạng',
        badge: 'Cắt ngang',
        plane: 'axial',
        offset: 1.12,
        camera: { x: 0, y: 1.55, z: 0.05, targetX: 0, targetY: 1.12, targetZ: 0 },
        systems: ['visceral', 'skeletal'],
        image: '/images/atlas/dig_upper.png',
        scoutLabel: 'Abdomen T11-T12',
        desc: 'Mặt phẳng cắt ngang tầng trên mạc treo bộc lộ gan, dạ dày và lách.'
      },
      {
        id: 'cs_abdomen_t12_l01',
        titleVi: '2. Ổ Bụng (Đoạn Đốt Sống T12 - L1)',
        title: '2. Abdomen (T12-L01)',
        subtitle: 'Lát cắt ngang qua tụy, tá tràng, cuống thận và động mạch mạc treo tràng trên',
        badge: 'Cắt ngang',
        plane: 'axial',
        offset: 1.08,
        camera: { x: 0, y: 1.50, z: 0.05, targetX: 0, targetY: 1.08, targetZ: 0 },
        systems: ['visceral', 'skeletal'],
        image: '/images/atlas/dig_upper.png',
        scoutLabel: 'Abdomen T12-L01',
        desc: 'Lát cắt ngang qua cuống mạch thận và đầu tụy tá tràng.'
      },
      {
        id: 'cs_abdomen_l01_l02',
        titleVi: '3. Ổ Bụng (Đoạn Đốt Sống L1 - L2)',
        title: '3. Abdomen (L01-L02)',
        subtitle: 'Lát cắt ngang qua quai ruột non, đại tràng lên/xuống và tĩnh mạch chủ dưới',
        badge: 'Cắt ngang',
        plane: 'axial',
        offset: 1.04,
        camera: { x: 0, y: 1.48, z: 0.05, targetX: 0, targetY: 1.04, targetZ: 0 },
        systems: ['visceral', 'skeletal'],
        image: '/images/atlas/dig_lower.png',
        scoutLabel: 'Abdomen L01-L02',
        desc: 'Mặt phẳng cắt ngang tầng dưới mạc treo đại tràng ngang.'
      }
    ]
  },
  {
    id: 'cs_group_pelvis_axial',
    titleVi: 'Vùng Chậu Hông (Mặt Cắt Ngang)',
    plane: 'axial',
    cards: [
      {
        id: 'cs_pelvis_s05',
        titleVi: '1. Vùng Chậu (Mức Đốt Sống Cùng S5)',
        title: '1. Pelvis (S05) (M)',
        subtitle: 'Lát cắt ngang qua khớp cùng chậu, đỉnh bàng quang và bóng trực tràng',
        badge: 'Cắt ngang',
        plane: 'axial',
        offset: 0.92,
        camera: { x: 0, y: 1.35, z: 0.05, targetX: 0, targetY: 0.92, targetZ: 0 },
        systems: ['visceral', 'skeletal', 'muscular'],
        image: '/images/atlas/skel_pelvis.png',
        scoutLabel: 'Pelvis S05',
        desc: 'Mặt phẳng cắt ngang qua chậu hông bé và bóng bàng quang.'
      },
      {
        id: 'cs_pelvis_coccyx',
        titleVi: '2. Vùng Chậu (Mức Xương Cụt & Sàn Chậu)',
        title: '2. Pelvis (Coccyx) (M)',
        subtitle: 'Lát cắt ngang qua xương cụt, tuyến tiền liệt/tử cung và cơ nâng hậu môn',
        badge: 'Cắt ngang',
        plane: 'axial',
        offset: 0.87,
        camera: { x: 0, y: 1.30, z: 0.05, targetX: 0, targetY: 0.87, targetZ: 0 },
        systems: ['visceral', 'skeletal', 'muscular'],
        image: '/images/atlas/urin_pelvic.png',
        scoutLabel: 'Pelvis Coccyx',
        desc: 'Mặt phẳng cắt ngang qua sàn chậu và cơ nâng hậu môn.'
      },
      {
        id: 'cs_pelvis_symphysis',
        titleVi: '3. Vùng Chậu (Mức Khớp Mu & Ổ Cối)',
        title: '3. Pelvis (Symphysis) (M)',
        subtitle: 'Lát cắt ngang qua khớp mu, chỏm xương đùi và củ ngồi',
        badge: 'Cắt ngang',
        plane: 'axial',
        offset: 0.83,
        camera: { x: 0, y: 1.25, z: 0.05, targetX: 0, targetY: 0.83, targetZ: 0 },
        systems: ['skeletal', 'muscular'],
        image: '/images/atlas/skel_pelvis.png',
        scoutLabel: 'Pelvis Symphysis',
        desc: 'Mặt phẳng cắt ngang qua ổ cối và diện khớp mu.'
      },
      {
        id: 'cs_pelvis_midsagittal',
        titleVi: '4. Vùng Chậu (Mặt Cắt Đứng Dọc Chính Giữa)',
        title: '4. Pelvis (Midsagittal)',
        subtitle: 'Lát cắt đứng dọc qua bàng quang, trực tràng và sàn chậu',
        badge: 'Cắt đứng dọc',
        plane: 'sagittal',
        offset: 0.00,
        camera: { x: 0.75, y: 0.85, z: 0.0, targetX: 0, targetY: 0.85, targetZ: 0 },
        systems: ['visceral', 'skeletal', 'muscular'],
        image: '/images/atlas/skel_pelvis.png',
        scoutLabel: 'Pelvis Midsagittal',
        desc: 'Mặt phẳng đứng dọc chính giữa qua các tạng vùng chậu và đáy chậu.'
      }
    ]
  }
];

// 6. MICROANATOMY (Giải Phẫu Vi Thể & Cắt Lớp Tầng Da - Mô Học Y Khoa)
export const ATLAS_MICROANATOMY_CATEGORIES = [
  {
    id: 'micro_group_skin',
    titleVi: 'Hệ Da & Cắt Lớp Tầng Da',
    cards: [
      {
        id: 'micro_skin_dark',
        titleVi: '1. Lát Cắt Da Sắc Tố Đậm (Hắc Tố Melanin)',
        title: '1. Skin (Dark Pigmentation)',
        subtitle: 'Cắt lớp 3D đa tầng: Biểu bì sắc tố Melanin, Trung bì và Mô mỡ dưới da',
        badge: 'Cắt lớp da',
        systems: ['integumentary'],
        camera: { x: 0, y: 1.25, z: 1.65, targetX: 0, targetY: 1.15, targetZ: 0 },
        image: '/images/atlas/micro_skin_dark.jpg',
        desc: 'Mô hình cắt lớp 3D tầng da: lớp sừng, lớp gai, lớp hạt, lớp đáy hắc tố Melanin, collagen và mỡ hạ bì.'
      },
      {
        id: 'micro_skin_light',
        titleVi: '2. Lát Cắt Da Sắc Tố Sáng',
        title: '2. Skin (Light Pigmentation)',
        subtitle: 'Lát cắt da sắc tố sáng: Tế bào đáy sinh sản và vi tuần hoàn mao mạch',
        badge: 'Mô học da',
        systems: ['integumentary'],
        camera: { x: 0, y: 1.25, z: 1.65, targetX: 0, targetY: 1.15, targetZ: 0 },
        image: '/images/atlas/micro_skin_light.jpg',
        desc: 'Chi tiết mô học vi thể các lớp tế bào sừng hóa và mạng lưới sợi đàn hồi elastin nâng đỡ.'
      },
      {
        id: 'micro_hair_follicle',
        titleVi: '3. Nang Lông & Tuyến Bã Nhờn',
        title: '3. Hair Follicle (Curly Hair)',
        subtitle: 'Nang lông, tuyến bã nhờn, tuyến mồ hôi và cơ dựng lông',
        badge: 'Phụ bì',
        systems: ['integumentary', 'skeletal'],
        camera: { x: 0.22, y: 1.62, z: 0.48, targetX: 0.05, targetY: 1.60, targetZ: 0 },
        image: '/images/atlas/micro_hair_follicle.jpg',
        desc: 'Đơn vị nang lông tuyến bã: bóng chân lông, cơ dựng lông arrector pili và tuyến tiết bã nhờn.'
      }
    ]
  },
  {
    id: 'micro_group_senses',
    titleVi: 'Giải Phẫu Vi Thể Giác Quan',
    cards: [
      {
        id: 'micro_eye',
        titleVi: '1. Cấu Trúc Nhãn Cầu 3D',
        title: '1. Eye (Nhãn Cầu 3D)',
        subtitle: 'Giác mạc, củng mạc, màng bồ đào, thể mi, mống mắt và võng mạc',
        badge: 'Thị giác',
        systems: ['nervous', 'skeletal', 'muscular'],
        camera: { x: 0.16, y: 1.60, z: 0.52, targetX: 0.03, targetY: 1.59, targetZ: 0.06 },
        image: '/images/atlas/micro_eye.jpg',
        desc: 'Mặt cắt cấu trúc nhãn cầu thể hiện đường truyền ánh sáng và võng mạc thụ cảm.'
      },
      {
        id: 'micro_lacrimal',
        titleVi: '2. Bộ Lệ & Tuyến Lệ',
        title: '2. Lacrimal Apparatus (Bộ Lệ)',
        subtitle: 'Tuyến lệ chính, tiểu quản lệ, túi lệ và ống lệ mũi',
        badge: 'Bộ lệ',
        systems: ['nervous', 'skeletal'],
        camera: { x: 0.14, y: 1.60, z: 0.48, targetX: 0.02, targetY: 1.58, targetZ: 0.06 },
        image: '/images/atlas/micro_lacrimal.jpg',
        desc: 'Hệ thống tiết và dẫn lưu nước mắt giữ ẩm và bảo vệ bề mặt giác mạc.'
      },
      {
        id: 'micro_lens_zonule',
        titleVi: '3. Thể Thủy Tinh & Dây Chằng Zinn',
        title: '3. Lens and Zonular Fibers',
        subtitle: 'Thể thủy tinh hai mặt lồi và dây chằng treo Zinn điều tiết',
        badge: 'Khúc xạ',
        systems: ['nervous', 'skeletal'],
        camera: { x: 0.12, y: 1.59, z: 0.42, targetX: 0.03, targetY: 1.59, targetZ: 0.06 },
        image: '/images/atlas/micro_lens_zonule.jpg',
        desc: 'Dây chằng Zinn treo thể thủy tinh vào thể mi phục vụ điều tiết thị lực gần xa.'
      }
    ]
  },
  {
    id: 'micro_group_skeletal',
    titleVi: 'Giải Phẫu Vi Thể Hệ Xương',
    cards: [
      {
        id: 'micro_femur_section',
        titleVi: '1. Mặt Cắt Xương Đùi & Bè Xương Xốp',
        title: '1. Sectioned Femur (Mặt Cắt Xương Đùi)',
        subtitle: 'Vỏ xương đặc ngoài, bè xương xốp xốp và khoang tủy xương',
        badge: 'Mô học xương',
        systems: ['skeletal'],
        camera: { x: 0.40, y: 0.62, z: 0.85, targetX: 0.10, targetY: 0.60, targetZ: 0 },
        image: '/images/atlas/micro_femur_section.jpg',
        desc: 'Cấu trúc giải phẫu vi thể xương đùi với hệ thống bè xương xốp chịu lực nén tối ưu.'
      },
      {
        id: 'micro_osteon',
        titleVi: '2. Đơn Vị Xương Vi Thể Havers (Osteon)',
        title: '2. Osteon (Đơn Vị Xương Vi Thể Havers)',
        subtitle: 'Ống Havers trung tâm, các lá xương đồng tâm và tế bào xương Osteocyte',
        badge: 'Vi thể',
        systems: ['skeletal'],
        camera: { x: 0.35, y: 0.62, z: 0.65, targetX: 0.10, targetY: 0.60, targetZ: 0 },
        image: '/images/atlas/micro_osteon.jpg',
        desc: 'Đơn vị cấu tạo chức năng cơ bản của xương đặc, dẫn truyền mạch máu và thần kinh nuôi xương.'
      }
    ]
  }
];

// 7. MUSCLE ACTIONS (Chuyển Động Khớp & Cơ Sinh Lý 3D - Chuẩn Visible Body)
export const ATLAS_MUSCLE_ACTIONS_CATEGORIES = [
  {
    id: 'act_group_spine',
    titleVi: 'Chuyển Động Cột Sống & Lưng',
    cards: [
      {
        id: 'act_spine_flex',
        titleVi: '1. Gập Cột Sống',
        title: '1. Spine Flexion (Gập Cột Sống)',
        subtitle: 'Cơ thẳng bụng co, cột sống thắt lưng gập ra trước',
        badge: 'Cột sống',
        motionId: 'spine_flexion',
        systems: ['muscular', 'skeletal'],
        camera: { x: 0.95, y: 1.15, z: 1.35, targetX: 0, targetY: 1.05, targetZ: 0 },
        image: '/images/atlas/musc_torso.png',
        desc: 'Chuyển động gập thân mình quanh trục ngang ở các đốt sống thắt lưng.'
      },
      {
        id: 'act_spine_ext',
        titleVi: '2. Duỗi Cột Sống',
        title: '2. Spine Extension (Duỗi Cột Sống)',
        subtitle: 'Nhóm cơ dựng sống (Erector spinae) kéo cột sống ngửa ra sau',
        badge: 'Cột sống',
        motionId: 'spine_extension',
        systems: ['muscular', 'skeletal'],
        camera: { x: 1.25, y: 1.15, z: -1.35, targetX: 0, targetY: 1.05, targetZ: 0 },
        image: '/images/atlas/musc_torso.png',
        desc: 'Chuyển động duỗi cột sống giúp duy trì tư thế đứng thẳng của con người.'
      },
      {
        id: 'act_spine_lat',
        titleVi: '3. Nghiêng Cột Sống Sang Bên',
        title: '3. Spine Lateral Flexion (Nghiêng Cột Sống)',
        subtitle: 'Cơ vuông thắt lưng và cơ chéo bụng co nghiêng thân sang bên',
        badge: 'Cột sống',
        motionId: 'spine_lat_flexion',
        systems: ['muscular', 'skeletal'],
        camera: { x: 0, y: 1.15, z: 1.65, targetX: 0, targetY: 1.05, targetZ: 0 },
        image: '/images/atlas/musc_torso.png',
        desc: 'Chuyển động nghiêng cột sống trong mặt phẳng đứng ngang.'
      }
    ]
  },
  {
    id: 'act_group_pelvis',
    titleVi: 'Chuyển Động Khung Chậu & Khớp Háng',
    cards: [
      {
        id: 'act_hip_flex',
        titleVi: '1. Gập Khớp Háng',
        title: '1. Hip Flexion (Gập Khớp Háng)',
        subtitle: 'Cơ thắt lưng chậu (Iliopsoas) và cơ thẳng đùi nâng đùi ra trước',
        badge: 'Khớp háng',
        motionId: 'hip_flexion',
        systems: ['muscular', 'skeletal'],
        camera: { x: 1.25, y: 0.65, z: 1.20, targetX: 0.08, targetY: 0.55, targetZ: 0 },
        image: '/images/atlas/musc_limbs.png',
        desc: 'Chuyển động gập khớp chỏm đùi - ổ cối trong bước đi và chạy.'
      },
      {
        id: 'act_hip_ext',
        titleVi: '2. Duỗi Khớp Háng',
        title: '2. Hip Extension (Duỗi Khớp Háng)',
        subtitle: 'Cơ mông lớn (Gluteus maximus) và gân kheo kéo đùi ra sau',
        badge: 'Khớp háng',
        motionId: 'hip_extension',
        systems: ['muscular', 'skeletal'],
        camera: { x: 1.15, y: 0.65, z: -0.95, targetX: 0.08, targetY: 0.60, targetZ: 0 },
        image: '/images/atlas/musc_limbs.png',
        desc: 'Chuyển động tạo lực đẩy chính khi đứng dậy, leo dốc và chạy nhảy.'
      },
      {
        id: 'act_hip_rot',
        titleVi: '3. Xoay Trong Khớp Háng',
        title: '3. Hip Medial Rotation (Xoay Trong Khớp Háng)',
        subtitle: 'Cơ căng mạc đùi và cơ mông nhỡ xoay đùi vào trong',
        badge: 'Khớp háng',
        motionId: 'hip_rotation',
        systems: ['muscular', 'skeletal'],
        camera: { x: 0.40, y: 0.65, z: 1.45, targetX: 0.08, targetY: 0.60, targetZ: 0 },
        image: '/images/atlas/musc_limbs.png',
        desc: 'Chuyển động xoay trục đùi quanh đường nối từ chỏm đùi đến lồi cầu.'
      }
    ]
  },
  {
    id: 'act_group_lower_limbs',
    titleVi: 'Chuyển Động Chi Dưới & Khớp Gối',
    cards: [
      {
        id: 'act_knee_flex',
        titleVi: '1. Gập Khớp Gối',
        title: '1. Knee Flexion (Gập Khớp Gối)',
        subtitle: 'Nhóm cơ gân kheo (Hamstrings) co gập cẳng chân ra sau',
        badge: 'Khớp gối',
        motionId: 'knee_flexion',
        systems: ['muscular', 'skeletal'],
        camera: { x: 1.10, y: 0.38, z: 0.85, targetX: 0.08, targetY: 0.32, targetZ: 0 },
        image: '/images/atlas/musc_limbs.png',
        desc: 'Khớp bản lề gối gập cẳng chân lên đùi.'
      },
      {
        id: 'act_knee_ext',
        titleVi: '2. Duỗi Khớp Gối',
        title: '2. Knee Extension (Duỗi Khớp Gối)',
        subtitle: 'Cơ tứ đầu đùi (Quadriceps) kéo bánh chè duỗi thẳng cẳng chân',
        badge: 'Khớp gối',
        motionId: 'knee_extension',
        systems: ['muscular', 'skeletal'],
        camera: { x: 1.10, y: 0.38, z: 0.85, targetX: 0.08, targetY: 0.32, targetZ: 0 },
        image: '/images/atlas/musc_limbs.png',
        desc: 'Khóa khớp gối giúp giữ vững trọng tâm cơ thể khi đứng thẳng.'
      },
      {
        id: 'act_knee_rot',
        titleVi: '3. Xoay Trong Khớp Gối',
        title: '3. Knee Medial Rotation (Xoay Trong Khớp Gối)',
        subtitle: 'Cơ khoeo và cơ bán gân xoay nhẹ cẳng chân vào trong',
        badge: 'Khớp gối',
        motionId: 'knee_rotation',
        systems: ['muscular', 'skeletal'],
        camera: { x: 0.30, y: 0.38, z: 0.95, targetX: 0.08, targetY: 0.32, targetZ: 0 },
        image: '/images/atlas/musc_limbs.png',
        desc: 'Mở khóa khớp gối khi bắt đầu bước gập chân.'
      }
    ]
  },
  {
    id: 'act_group_shoulder',
    titleVi: 'Chuyển Động Khớp Vai',
    cards: [
      {
        id: 'act_shoulder_flex',
        titleVi: '1. Gập Khớp Vai',
        title: '1. Shoulder Flexion (Gập Khớp Vai)',
        subtitle: 'Bó trước cơ delta và cơ ngực lớn nâng cánh tay ra trước',
        badge: 'Khớp vai',
        motionId: 'shoulder_flexion',
        systems: ['muscular', 'skeletal'],
        camera: { x: -0.95, y: 1.25, z: 0.85, targetX: -0.18, targetY: 1.20, targetZ: 0 },
        image: '/images/atlas/musc_limbs.png',
        desc: 'Chuyển động nâng cánh tay lên phía trước theo mặt phẳng đứng dọc.'
      },
      {
        id: 'act_shoulder_ext',
        titleVi: '2. Duỗi Khớp Vai',
        title: '2. Shoulder Extension (Duỗi Khớp Vai)',
        subtitle: 'Cơ lưng rộng, cơ tròn lớn và bó sau cơ delta kéo tay ra sau',
        badge: 'Khớp vai',
        motionId: 'shoulder_extension',
        systems: ['muscular', 'skeletal'],
        camera: { x: -0.95, y: 1.25, z: -0.75, targetX: -0.18, targetY: 1.20, targetZ: 0 },
        image: '/images/atlas/musc_limbs.png',
        desc: 'Chuyển động đưa cánh tay về sau thân mình.'
      },
      {
        id: 'act_shoulder_abd',
        titleVi: '3. Dang Ngang Khớp Vai',
        title: '3. Shoulder Horizontal Abduction (Dang Ngang Vai)',
        subtitle: 'Cơ delta và cơ trên gai dang cánh tay sang bên',
        badge: 'Khớp vai',
        motionId: 'shoulder_abduction',
        systems: ['muscular', 'skeletal'],
        camera: { x: -0.25, y: 1.25, z: 1.45, targetX: -0.20, targetY: 1.20, targetZ: 0 },
        image: '/images/atlas/musc_limbs.png',
        desc: 'Khớp chỏm cầu ổ chảo dang cánh tay từ 0 đến 90 độ.'
      }
    ]
  },
  {
    id: 'act_group_upper_limbs',
    titleVi: 'Chuyển Động Chi Trên & Khớp Khuỷu',
    cards: [
      {
        id: 'act_elbow_flex',
        titleVi: '1. Gập Khớp Khuỷu',
        title: '1. Elbow Flexion (Gập Khớp Khuỷu)',
        subtitle: 'Cơ nhị đầu cánh tay (Biceps) và cơ cánh tay gập cẳng tay',
        badge: 'Khuỷu tay',
        motionId: 'elbow_flexion',
        systems: ['muscular', 'skeletal'],
        camera: { x: -1.05, y: 1.05, z: 0.95, targetX: -0.24, targetY: 0.95, targetZ: 0 },
        image: '/images/atlas/musc_limbs.png',
        desc: 'Chuyển động gập bản lề của khớp cánh tay - trụ và cánh tay - quay.'
      },
      {
        id: 'act_elbow_ext',
        titleVi: '2. Duỗi Khớp Khuỷu',
        title: '2. Elbow Extension (Duỗi Khớp Khuỷu)',
        subtitle: 'Cơ tam đầu cánh tay (Triceps) kéo mỏm khuỷu duỗi thẳng tay',
        badge: 'Khuỷu tay',
        motionId: 'elbow_extension',
        systems: ['muscular', 'skeletal'],
        camera: { x: -1.05, y: 1.05, z: 0.95, targetX: -0.24, targetY: 0.95, targetZ: 0 },
        image: '/images/atlas/musc_limbs.png',
        desc: 'Khóa khớp khuỷu khi đẩy hoặc nâng vật thể.'
      },
      {
        id: 'act_forearm_pro',
        titleVi: '3. Sấp Cẳng Tay',
        title: '3. Forearm Pronation (Sấp Cẳng Tay)',
        subtitle: 'Cơ sấp tròn và cơ sấp vuông xoay xương quay vắt chéo xương trụ',
        badge: 'Cẳng tay',
        motionId: 'forearm_pronation',
        systems: ['muscular', 'skeletal'],
        camera: { x: -0.65, y: 0.95, z: 0.75, targetX: -0.24, targetY: 0.92, targetZ: 0 },
        image: '/images/atlas/musc_limbs.png',
        desc: 'Khớp quay - trụ xoay bàn tay úp xuống dưới.'
      }
    ]
  },
  {
    id: 'act_group_thorax',
    titleVi: 'Chuyển Động Lồng Ngực & Hô Hấp',
    cards: [
      {
        id: 'act_ribs_elev',
        titleVi: '1. Nâng Khung Sườn (Hít Vào)',
        title: '1. Ribs Elevation (Nâng Khung Sườn - Hít Vào)',
        subtitle: 'Cơ liên sườn ngoài nâng khung sườn làm tăng thể tích lồng ngực',
        badge: 'Hô hấp',
        motionId: 'respiratory',
        systems: ['skeletal', 'visceral'],
        camera: { x: 0, y: 1.28, z: 1.0, targetX: 0, targetY: 1.28, targetZ: 0 },
        image: '/images/atlas/med_respiratory_cycle.png',
        desc: 'Chuyển động nâng sườn dạng cán xô và tay cầm bơm khi hít vào.'
      },
      {
        id: 'act_ribs_dep',
        titleVi: '2. Hạ Khung Sườn (Thở Ra)',
        title: '2. Ribs Depression (Hạ Khung Sườn - Thở Ra)',
        subtitle: 'Khung sườn hạ xuống xẹp lại, phổi co hồi thụ động đẩy khí ra ngoài',
        badge: 'Hô hấp',
        motionId: 'respiratory',
        systems: ['skeletal', 'visceral'],
        camera: { x: 0, y: 1.28, z: 1.0, targetX: 0, targetY: 1.28, targetZ: 0 },
        image: '/images/atlas/med_respiratory_cycle.png',
        desc: 'Giai đoạn thở ra của chu kỳ thông khí phổi.'
      },
      {
        id: 'act_cardiac',
        titleVi: '3. Chu Kỳ Co Bóp Tim (Tâm Thu & Tâm Trương)',
        title: '3. Cardiac Cycle (Chu Kỳ Co Bóp Tim)',
        subtitle: 'Tâm thu tống máu vào động mạch và tâm trương giãn nở hút máu về',
        badge: 'Tuần hoàn',
        motionId: 'cardiac',
        systems: ['cardiovascular', 'skeletal'],
        camera: { x: 0.05, y: 1.28, z: 0.65, targetX: 0.02, targetY: 1.28, targetZ: 0.03 },
        image: '/images/atlas/med_cardiac_cycle.png',
        desc: 'Hoạt động co bóp nhịp nhàng của cơ tim theo hệ thống dẫn truyền tự động.'
      }
    ]
  }
];


