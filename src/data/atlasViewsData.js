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
      },
      {
        id: 'nerv_inerv_shoulder_axillary',
        title: '14. Innervation of Shoulder (Axillary & Suprascapular)',
        titleVi: '14. Chi Phối Vận Động Khớp Vai (TK Nách & TK Trên Vai)',
        subtitle: 'Cơ delta, cơ tròn bé, cơ trên gai & cơ dưới gai',
        badge: 'Chi phối cơ vai',
        image: '/images/atlas/musc_limbs.png',
        systems: ['nervous', 'muscular', 'skeletal'],
        camera: { x: 0.38, y: 1.38, z: 0.52, targetX: 0.18, targetY: 1.35, targetZ: 0 },
        highlight: 'Axillary nerve.l',
        desc: 'Thần kinh nách (C5-C6) vòng quanh cổ phẫu thuật xương cánh tay chi phối cơ delta và cơ tròn bé. Thần kinh trên vai chi phối cơ trên gai và dưới gai.',
        innervationInfo: {
          nerve: 'Thần kinh nách (C5-C6) & Thần kinh trên vai (C5-C6)',
          muscles: 'Cơ delta (Deltoid), Cơ tròn bé (Teres minor), Cơ trên gai (Supraspinatus), Cơ dưới gai (Infraspinatus)',
          reflex: 'Phản xạ giạng cánh tay & xoay ngoài khớp vai',
          clinicalSign: 'Mất rãnh cơ delta, vai vuông, mất cảm giác da vùng huy hiệu cơ delta (Regimental badge area) khi gãy cổ phẫu thuật xương cánh tay hoặc trật khớp vai.',
          audioScript: 'Thần kinh nách xuất phát từ bó sau đám rối cánh tay, đi qua lỗ tứ giác vòng quanh cổ phẫu thuật xương cánh tay để vận động cơ delta. Tổn thương gây liệt cơ delta, mất khả năng giạng cánh tay và mất cảm giác vùng da huy hiệu.'
        }
      },
      {
        id: 'nerv_inerv_arm_radial',
        title: '15. Innervation of Arm & Forearm Extensors (Radial Nerve)',
        titleVi: '15. Chi Phối Duỗi Tay & Cẳng Tay (Thần Kinh Quay)',
        subtitle: 'Rãnh xoắn xương cánh tay, cơ tam đầu & các cơ duỗi cổ - ngón tay',
        badge: 'Bàn tay rũ cổ cò',
        image: '/images/atlas/musc_limbs.png',
        systems: ['nervous', 'muscular', 'skeletal'],
        camera: { x: 0.45, y: 1.15, z: 0.62, targetX: 0.28, targetY: 1.10, targetZ: 0 },
        highlight: 'Radial nerve.l',
        desc: 'Thần kinh quay (C5-T1) chạy trong rãnh thần kinh quay mặt sau xương cánh tay, chi phối toàn bộ nhóm cơ duỗi chi trên.',
        innervationInfo: {
          nerve: 'Thần kinh quay (Radial Nerve - C5, C6, C7, C8, T1)',
          muscles: 'Cơ tam đầu cánh tay, Cơ khuỷu, Cơ cánh tay quay, Cơ duỗi cổ tay quay dài & ngắn, Cơ duỗi các ngón, Cơ duỗi ngón út, Cơ duỗi cổ tay trụ, Cơ ngửa',
          reflex: 'Phản xạ gân cơ tam đầu (C7-C8) & Phản xạ trâm quay (C5-C6)',
          clinicalSign: 'Dấu hiệu "Bàn tay rũ cổ cò" (Wrist drop) - không thể duỗi cổ tay và khớp bàn ngón tay do gãy thân xương cánh tay hoặc tì đè kéo dài.',
          audioScript: 'Thần kinh quay chi phối toàn bộ hệ thống cơ duỗi của cánh tay, cẳng tay và bàn tay. Khi gãy một phần ba giữa dưới xương cánh tay, dây thần kinh dễ bị tổn thương trong rãnh xoắn, dẫn đến liệt duỗi cổ tay tạo nên tư thế bàn tay rũ cổ cò điển hình.'
        }
      },
      {
        id: 'nerv_inerv_forearm_median',
        title: '16. Innervation of Anterior Forearm & Hand (Median Nerve)',
        titleVi: '16. Chi Phối Gấp Cẳng Tay & Bàn Tay (Thần Kinh Giữa)',
        subtitle: 'Ống cổ tay, các cơ gấp & ô mô cái (Dấu hiệu Bàn tay khỉ)',
        badge: 'Ống cổ tay & Ô mô cái',
        image: '/images/atlas/musc_limbs.png',
        systems: ['nervous', 'muscular', 'skeletal'],
        camera: { x: 0.42, y: 0.95, z: 0.50, targetX: 0.30, targetY: 0.90, targetZ: 0 },
        highlight: 'Median nerve.l',
        desc: 'Thần kinh giữa (C6-T1) đi qua ống cổ tay dưới dây chằng vòng cổ tay, chi phối hầu hết các cơ gấp cẳng tay và các cơ ô mô cái.',
        innervationInfo: {
          nerve: 'Thần kinh giữa (Median Nerve - C6, C7, C8, T1)',
          muscles: 'Cơ sấp tròn, Cơ gấp cổ tay quay, Cơ gan tay dài, Cơ gấp nông các ngón, Cơ gấp sâu các ngón (ngón 2-3), Cơ sấp vuông, Các cơ ô mô cái (gấp ngắn, dạng ngắn, đối ngón cái)',
          reflex: 'Phản xạ sấp cẳng tay (C6-C7)',
          clinicalSign: 'Hội chứng ống cổ tay (Carpal Tunnel Syndrome) gây tê rát 3 ngón rưỡi ngoài; teo ô mô cái tạo nên dấu hiệu "Bàn tay khỉ" (Ape hand) và mất động tác đối chiếu ngón cái.',
          audioScript: 'Thần kinh giữa là dây thần kinh của sự khéo léo, chi phối các cơ gấp cẳng tay và cơ đối chiếu ngón cái. Chèn ép tại ống cổ tay gây tê buốt về đêm và lâu ngày teo phẳng ô mô cái tạo nên dấu hiệu bàn tay khỉ.'
        }
      },
      {
        id: 'nerv_inerv_hand_ulnar',
        title: '17. Innervation of Intrinsic Hand (Ulnar Nerve)',
        titleVi: '17. Chi Phối Cơ Nội Tại Bàn Tay (Thần Kinh Trụ)',
        subtitle: 'Rãnh khuỷu tay, ống Guyon, các cơ liên cốt & ô mô út',
        badge: 'Bàn tay vuốt trụ',
        image: '/images/atlas/musc_limbs.png',
        systems: ['nervous', 'muscular', 'skeletal'],
        camera: { x: 0.40, y: 0.92, z: 0.48, targetX: 0.28, targetY: 0.88, targetZ: 0 },
        highlight: 'Ulnar nerve.l',
        desc: 'Thần kinh trụ (C8-T1) đi sau mỏm trên lồi cầu trong xương cánh tay, qua ống Guyon chi phối các cơ nội tại bàn tay thực hiện các động tác khép dạng ngón tay.',
        innervationInfo: {
          nerve: 'Thần kinh trụ (Ulnar Nerve - C8, T1)',
          muscles: 'Cơ gấp cổ tay trụ, Cơ gấp sâu các ngón (ngón 4-5), Các cơ ô mô út (dạng, gấp, đối ngón út), Toàn bộ các cơ liên cốt mu tay & gan tay, Cơ giun 3-4, Cơ khép ngón cái',
          reflex: 'Nghiệm pháp Froment (Froment sign - kẹp giấy giữa ngón cái và ngón trỏ)',
          clinicalSign: 'Dấu hiệu "Bàn tay vuốt trụ" (Claw hand) - quá duỗi khớp bàn ngón và gấp khớp liên ngón 4-5; teo các khoang liên cốt mu bàn tay.',
          audioScript: 'Thần kinh trụ chi phối sức mạnh và độ tinh xảo ngón tay. Đi qua rãnh ròng rọc khuỷu tay và ống Guyon cổ tay. Khi tổn thương, cơ khép ngón cái và các cơ liên cốt bị liệt gây tư thế bàn tay vuốt trụ và teo rãnh mu tay.'
        }
      },
      {
        id: 'nerv_inerv_diaphragm_phrenic',
        title: '18. Innervation of Diaphragm (Phrenic Nerve C3-C5)',
        titleVi: '18. Chi Phối Vận Động Cơ Hoành (Thần Kinh Hoành C3-C5)',
        subtitle: 'Đường đi xuyên trung thất trước màng ngoài tim tới vòm hoành',
        badge: 'Nhịp thở sinh tồn',
        image: '/images/atlas/resp_diaphragm.png',
        systems: ['nervous', 'muscular', 'skeletal'],
        camera: { x: 0.16, y: 1.28, z: 0.60, targetX: 0, targetY: 1.22, targetZ: 0 },
        highlight: 'Diaphragm',
        desc: 'Thần kinh hoành bắt nguồn từ các nhánh trước dây thần kinh gai sống cổ C3, C4, C5, là nguồn vận động duy nhất cho cơ hoành hô hấp.',
        innervationInfo: {
          nerve: 'Thần kinh hoành (Phrenic Nerve - Rễ C3, C4, C5: "C3-4-5 keeps diaphragm alive")',
          muscles: 'Cơ hoành (Diaphragm) - phần ức, phần sườn, phần thắt lưng và trung tâm gân',
          reflex: 'Cử động hô hấp cơ hoành (Diaphragmatic excursion test)',
          clinicalSign: 'Liệt cơ hoành một bên gây nâng cao vòm hoành nghịch thường trên phim X-quang ngực thẳng và suy giảm dung tích sống.',
          audioScript: 'Thần kinh hoành là nguồn vận động độc quyền điều khiển cơ hoành, cơ hô hấp chính của cơ thể. Bắt nguồn từ các rễ cổ C3 đến C5, dây thần kinh chạy áp sát hai bên màng ngoài tim để phân nhánh vào vòm hoành.'
        }
      },
      {
        id: 'nerv_inerv_pelvic_pudendal',
        title: '19. Innervation of Pelvic Floor (Pudendal Nerve S2-S4)',
        titleVi: '19. Chi Phối Cơ Đáy Chậu & Vùng Chậu (Thần Kinh Thẹn S2-S4)',
        subtitle: 'Khuyết ngồi bé, ống thẹn Alcock, cơ nâng hậu môn & cơ thắt vân',
        badge: 'Đáy chậu & Cơ thắt',
        image: '/images/atlas/nerv_spinal.png',
        systems: ['nervous', 'muscular', 'skeletal'],
        camera: { x: 0, y: 0.82, z: -0.72, targetX: 0, targetY: 0.82, targetZ: 0 },
        highlight: 'Pudendal nerve.l',
        desc: 'Thần kinh thẹn (S2-S4) rời chậu hông qua khuyết ngồi lớn rồi vòng qua gai ngồi vào khuyết ngồi bé qua ống thẹn Alcock, chi phối cơ nâng hậu môn và cơ quan sinh dục ngoài.',
        innervationInfo: {
          nerve: 'Thần kinh thẹn (Pudendal Nerve - Rễ S2, S3, S4: "S2-3-4 keeps poop off the floor")',
          muscles: 'Cơ nâng hậu môn (Levator ani), Cơ thắt ngoài hậu môn (External anal sphincter), Cơ ngồi hang (Ischiocavernosus), Cơ hành xốp (Bulbospongiosus), Cơ ngang đáy chậu',
          reflex: 'Phản xạ hành xốp (Bulbocavernosus reflex - S2-S4) & Phản xạ co thắt hậu môn (Anal wink)',
          clinicalSign: 'Hội chứng đau dây thần kinh thẹn do chèn ép ống Alcock (thường gặp ở người đạp xe đường dài); mất phản xạ đại tiểu tiện tự chủ; chỉ định thủ thuật phong bế thần kinh thẹn trong sản khoa.',
          audioScript: 'Thần kinh thẹn xuất phát từ đám rối cùng các nhánh S2 đến S4, đi qua ống thẹn Alcock chi phối toàn bộ cơ sàn chậu và cơ thắt ngoài hậu môn niệu đạo, giữ vai trò sinh tồn trong việc kiểm soát đại tiểu tiện và chức năng sinh dục.'
        }
      },
      {
        id: 'nerv_inerv_thigh_femoral_obturator',
        title: '20. Innervation of Thigh (Femoral & Obturator Nerves)',
        titleVi: '20. Chi Phối Vận Động Đùi Trước & Đùi Trong (TK Đùi & TK Bịt)',
        subtitle: 'Cơ tứ đầu đùi, phản xạ gân bánh chè (L3-L4) & các cơ khép đùi',
        badge: 'Phản xạ bánh chè L3-L4',
        image: '/images/atlas/reg_lower_limb.png',
        systems: ['nervous', 'muscular', 'skeletal'],
        camera: { x: 0.28, y: 0.68, z: 0.72, targetX: 0.14, targetY: 0.65, targetZ: 0 },
        highlight: 'Femoral nerve.l',
        desc: 'Thần kinh đùi (L2-L4) đi qua tam giác đùi dưới dây chằng bẹn chi phối cơ tứ đầu đùi duỗi gối; thần kinh bịt (L2-L4) qua lỗ bịt chi phối nhóm cơ khép đùi.',
        innervationInfo: {
          nerve: 'Thần kinh đùi (Femoral Nerve - L2-L4) & Thần kinh bịt (Obturator Nerve - L2-L4)',
          muscles: 'Cơ tứ đầu đùi (Cơ thẳng đùi, Cơ rộng ngoài, rộng trong, rộng giữa), Cơ may, Cơ lược; Cơ khép dài, Cơ khép ngắn, Cơ khép lớn, Cơ thon',
          reflex: 'Phản xạ gân bánh chè (Patellar tendon reflex - trung khu tủy sống L3-L4)',
          clinicalSign: 'Mất phản xạ gân bánh chè, sụm gối do liệt cơ tứ đầu đùi, không thể leo cầu thang hoặc đá chân ra trước; mất động tác khép hai đùi.',
          audioScript: 'Thần kinh đùi là nhánh lớn nhất của đám rối thắt lưng, chi phối cơ tứ đầu đùi duỗi thẳng khớp gối. Khám phản xạ gân bánh chè là nghiệm pháp kinh điển đánh giá tính toàn vẹn của cung phản xạ thần kinh gai sống L3 và L4.'
        }
      },
      {
        id: 'nerv_inerv_leg_achilles_tibial_fibular',
        title: '21. Innervation of Leg, Heel & Foot (Sciatic, Tibial & Fibular)',
        titleVi: '21. Chi Phối Cẳng Chân & Gót Chân Achilles (TK Chày & TK Mác)',
        subtitle: 'Cơ tam đầu cẳng chân, gân gót Achilles (S1) & Bàn chân rũ (Foot Drop)',
        badge: 'Gân Achilles & Bàn chân rũ',
        image: '/images/atlas/reg_lower_limb.png',
        systems: ['nervous', 'muscular', 'skeletal'],
        camera: { x: 0.25, y: 0.35, z: -0.78, targetX: 0.12, targetY: 0.30, targetZ: 0 },
        highlight: 'Tibial nerve.l',
        desc: 'Thần kinh tọa chia nhánh tại đỉnh hố khoeo thành thần kinh chày (chi phối cơ tam đầu cẳng chân hợp thành gân Achilles, phản xạ S1) và thần kinh mác chung (vòng quanh chỏm xương mác chi phối duỗi cổ chân).',
        innervationInfo: {
          nerve: 'Thần kinh chày (Tibial Nerve - L4-S3) & Thần kinh mác chung / mác sâu (Common & Deep Fibular Nerve - L4-S2)',
          muscles: 'Cơ bụng chân (Gastrocnemius), Cơ dép (Soleus), Cơ gan chân, Gân gót Achilles, Cơ chày sau, Cơ chày trước, Cơ duỗi dài các ngón chân',
          reflex: 'Phản xạ gân gót Achilles (Achilles tendon reflex - trung khu tủy sống S1-S2)',
          clinicalSign: 'Tổn thương TK mác chung ở chỏm xương mác gây dấu hiệu "Bàn chân rũ" (Foot drop) với dáng đi chấm phẩy (Steppage gait); tổn thương TK chày gây mất phản xạ gân gót và không thể nhón gót chân (tiptoe).',
          audioScript: 'Thần kinh tọa phân đôi thành thần kinh chày chi phối gân gót Achilles giúp động tác nhón chân, và thần kinh mác chung chi phối cơ chày trước nâng bàn chân. Chấn thương chỏm xương mác rất dễ gây liệt thần kinh mác dẫn đến bàn chân rũ và dáng đi chấm phẩy.'
        }
      },
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
        subtitle: 'Thực quản, dạ dày và tá tràng D1-D4',
        image: '/images/atlas/dig_upper.png',
        systems: ['visceral', 'skeletal'],
        camera: { x: 0.35, y: 1.45, z: 0.55, targetX: 0, targetY: 1.40, targetZ: 0 },
        highlight: 'Oesophagus',
        desc: 'Đoạn đầu ống tiêu hóa tiếp nhận, vận chuyển và nghiền nhào nhũ trấp thức ăn.'
      },
      {
        id: 'dig_2_lower',
        title: '2. Lower Digestive System',
        titleVi: '2. Đường Tiêu Hóa Dưới',
        subtitle: 'Ruột non, khung đại tràng và hậu môn trực tràng',
        image: '/images/atlas/dig_lower.png',
        systems: ['visceral', 'skeletal'],
        camera: { x: 0, y: 0.95, z: 0.90, targetX: 0, targetY: 0.95, targetZ: 0 },
        highlight: 'Ascending colon',
        desc: 'Toàn bộ đoạn ruột hấp thu triệt để dưỡng chất, tái hấp thu nước và đào thải phân.'
      },
      {
        id: 'dig_3_hepatobiliary',
        title: '3. Hepatobiliary-Pancreatic System',
        titleVi: '3. Hệ Gan - Mật - Tụy & Ống Dẫn Mật',
        subtitle: 'Túi mật, ống mật chủ, ống tụy Wirsung và nhú tá lớn Oddi',
        image: '/images/atlas/biliary_anatomy.svg',
        systems: ['visceral', 'cardiovascular'],
        camera: { x: -0.06, y: 1.15, z: 0.52, targetX: -0.02, targetY: 1.13, targetZ: 0 },
        highlight: 'Bile duct',
        desc: 'Ngã ba mật tụy: Ống mật chủ kết hợp ống tụy chính tại bóng Vater đổ vào tá tràng D2 qua cơ vòng Oddi.'
      },
      {
        id: 'dig_4_stomach_layers',
        title: '4. Stomach Wall Layers & Dissection',
        titleVi: '4. Bóc Tách Các Lớp Dạ Dày & Nếp Gấp Rugae',
        subtitle: 'Bóc tách 3 tầng cơ trơn, dưới niêm mạc và nếp gấp niêm mạc Rugae',
        image: '/images/atlas/gastric_wall_histology.svg',
        systems: ['visceral'],
        camera: { x: 0.08, y: 1.18, z: 0.58, targetX: 0.02, targetY: 1.16, targetZ: 0 },
        highlight: 'Stomach',
        desc: 'Bóc tách hình bậc thang phơi bày 5 tầng thành dạ dày: Thanh mạc, Cơ dọc, Cơ vòng, Cơ chéo trong và Niêm mạc Rugae.'
      },
      {
        id: 'dig_5_esophagus_diaphragm',
        title: '5. Gastroesophageal Junction & Diaphragm',
        titleVi: '5. Kết Nối Dạ Dày - Thực Quản & Cơ Hoành',
        subtitle: 'Lỗ thực quản T10, góc tâm vị His và cơ thắt thực quản dưới',
        image: '/images/atlas/resp_diaphragm.png',
        systems: ['visceral', 'muscular', 'skeletal'],
        camera: { x: 0.12, y: 1.22, z: 0.56, targetX: -0.02, targetY: 1.25, targetZ: 0 },
        highlight: 'Diaphragm',
        desc: 'Thực quản chui qua lỗ cơ hoành T10, dây chằng hoành - thực quản và góc His tạo van chống trào ngược GERD.'
      },
      {
        id: 'dig_6_small_intestine',
        title: '6. Small Intestine & Mesentery Isolation',
        titleVi: '6. Cô Lập Ruột Non & Mạc Treo Ruột',
        subtitle: 'Tá tràng, hỗng tràng, hồi tràng và cung mạch mạc treo',
        image: '/images/atlas/dig_lower.png',
        systems: ['visceral', 'cardiovascular'],
        camera: { x: 0, y: 1.02, z: 0.82, targetX: 0, targetY: 1.00, targetZ: 0 },
        highlight: 'Jejunum',
        desc: 'Bóc tách cô lập 6m ruột non cuộn nếp, neo vào thành bụng sau bởi rễ mạc treo và cung mạch vòm vasa recta.'
      },
      {
        id: 'dig_7_large_intestine',
        title: '7. Large Intestine & Appendix Isolation',
        titleVi: '7. Cô Lập Khung Đại Tràng & Ruột Thừa',
        subtitle: 'Manh tràng, ruột thừa, 3 dải cơ dọc Taeniae và bướu Haustra',
        image: '/images/atlas/dig_lower.png',
        systems: ['visceral'],
        camera: { x: 0, y: 0.98, z: 0.98, targetX: 0, targetY: 0.96, targetZ: 0 },
        highlight: 'Ascending colon',
        desc: 'Cô lập khung đại tràng chữ U với 3 đặc trưng nhận diện: Dải cơ dọc Taeniae coli, túi phình Haustra và túi mỡ mạc nối.'
      },
      {
        id: 'dig_8_pelvic_anorectal',
        title: '8. Pelvic Floor & Anorectal Canal',
        titleVi: '8. Trực Tràng & Cơ Sàn Chậu (Cơ Nâng Hậu Môn)',
        subtitle: 'Bóng trực tràng, cơ mu - trực tràng, cơ thắt hậu môn trong & ngoài',
        image: '/images/atlas/skel_pelvis.png',
        systems: ['visceral', 'muscular', 'skeletal'],
        camera: { x: 0, y: 0.80, z: 0.68, targetX: 0, targetY: 0.78, targetZ: 0 },
        highlight: 'External anal sphincter.l',
        desc: 'Cơ mu - trực tràng (Puborectalis) tạo quai kéo góc hậu môn trực tràng 80-90 độ kiềm giữ phân, phối hợp cùng hệ cơ thắt kép.'
      },
      {
        id: 'dig_9_peritoneum',
        title: '9. Peritoneum & Mesenteries',
        titleVi: '9. Phúc Mạc & Mạc Nối',
        subtitle: 'Mạc nối lớn, mạc nối nhỏ và rễ mạc treo ruột',
        image: '/images/atlas/dig_peritoneum.png',
        systems: ['visceral', 'skeletal'],
        camera: { x: 0, y: 1.05, z: 0.95, targetX: 0, targetY: 1.05, targetZ: 0 },
        desc: 'Màng bao bọc và cố định các tạng trong ổ bụng, chứa mạch máu nuôi ruột và các ngách hậu cung mạc nối.'
      },
      {
        id: 'dig_10_alimentary_canal',
        title: '10. Alimentary Canal Complete',
        titleVi: '10. Toàn Bộ Trục Ống Tiêu Hóa',
        subtitle: 'Trục ống liên tục từ miệng đến hậu môn dài 9m',
        image: '/images/atlas/gi_tract_anatomy.svg',
        systems: ['visceral', 'skeletal'],
        camera: { x: 0, y: 1.12, z: 1.55, targetX: 0, targetY: 1.12, targetZ: 0 },
        desc: 'Đoạn ống tiêu hóa dài khoảng 9 mét với nhu động co bóp liên tục đưa thức ăn chuyển dịch một chiều.'
      },
      {
        id: 'dig_11_couinaud_liver',
        title: '11. Couinaud Liver Segments & Porta Hepatis',
        titleVi: '11. Tám Hạ Phân Thùy Gan Couinaud & Cửa Gan',
        subtitle: 'Phân chia giải phẫu 8 hạ phân thùy I - VIII theo cuống Glisson',
        image: '/images/atlas/dig_peritoneum.png',
        systems: ['visceral'],
        camera: { x: -0.10, y: 1.18, z: 0.68, targetX: -0.02, targetY: 1.15, targetZ: 0 },
        highlight: 'Liver',
        desc: '8 hạ phân thùy Couinaud độc lập về mạch máu cuống Glisson (TM cửa, ĐM gan, đường mật) làm nền tảng phẫu thuật gan chọn lọc.'
      },
      {
        id: 'dig_12_stomach_vasculature',
        title: '12. Stomach Vasculature & Celiac Trunk',
        titleVi: '12. Mạng Mạch Máu Nuôi Dạ Dày',
        subtitle: 'Vòng ĐM bờ cong lớn, bờ cong nhỏ và ĐM thân tạng',
        image: '/images/atlas/stomach_anatomy_macro.svg',
        systems: ['visceral', 'cardiovascular'],
        camera: { x: 0.15, y: 1.15, z: 0.75, targetX: 0, targetY: 1.12, targetZ: 0 },
        highlight: 'Stomach',
        desc: 'Nhánh tách từ động mạch thân tạng cấp máu phong phú cho dạ dày chống loét và nuôi dưỡng nhũ trấp.'
      },
      {
        id: 'dig_13_sphincters',
        title: '13. Digestive Sphincters & Valves',
        titleVi: '13. Các Cơ Thắt Đường Tiêu Hóa',
        subtitle: 'Cơ thắt tâm vị, môn vị, van hồi manh tràng và cơ thắt hậu môn',
        image: '/images/atlas/dig_lower.png',
        systems: ['visceral'],
        camera: { x: 0, y: 1.05, z: 0.70, targetX: 0, targetY: 1.05, targetZ: 0 },
        desc: 'Các van một chiều ngăn trào ngược dịch vị và kiểm soát lưu thông thức ăn nhịp nhàng theo nhu động.'
      },
      {
        id: 'dig_14_salivary_glands',
        title: '14. Salivary Glands',
        titleVi: '14. Tuyến Nước Bọt',
        subtitle: 'Tuyến mang tai, dưới hàm và dưới lưỡi',
        image: '/images/atlas/dig_upper.png',
        systems: ['visceral', 'skeletal'],
        camera: { x: 0.35, y: 1.54, z: 0.40, targetX: 0, targetY: 1.52, targetZ: 0 },
        desc: 'Tiết enzym amylase bắt đầu quá trình tiêu hóa tinh bột ngay tại miệng và bôi trơn thức ăn.'
      },
      {
        id: 'dig_15_teeth',
        title: '15. Permanent Teeth',
        titleVi: '15. Bộ Răng Vĩnh Viễn',
        subtitle: '32 răng người lớn: răng cửa, nanh, hàm',
        image: '/images/atlas/skel_skull.png',
        systems: ['skeletal'],
        camera: { x: 0, y: 1.54, z: 0.35, targetX: 0, targetY: 1.52, targetZ: 0 },
        highlight: 'Maxilla.l',
        desc: 'Bộ phận cơ học cắn xé và nghiền nhỏ thức ăn trước khi nuốt xuống thực quản.'
      },
      {
        id: 'dig_16_laryngopharynx',
        title: '16. Laryngopharynx & Epiglottis',
        titleVi: '16. Hầu Thanh Quản & Nắp Thanh Môn',
        subtitle: 'Ngã tư đường ăn và đường thở',
        image: '/images/atlas/resp_upper.png',
        systems: ['visceral', 'skeletal'],
        camera: { x: 0.25, y: 1.46, z: 0.40, targetX: 0, targetY: 1.44, targetZ: 0 },
        desc: 'Nắp thanh môn đậy kín đường thở khi thức ăn đi qua hầu vào thực quản, chống sặc đường hô hấp.'
      },
      {
        id: 'dig_17_regional_vasculature',
        title: '17. Regional Vasculature & Portal Vein',
        titleVi: '17. Mạch Máu Vùng Ổ Bụng & Tĩnh Mạch Cửa',
        subtitle: 'ĐM mạc treo tràng trên và hệ tĩnh mạch cửa gan',
        image: '/images/atlas/biliary_physiology.svg',
        systems: ['visceral', 'cardiovascular'],
        camera: { x: 0.1, y: 1.12, z: 0.80, targetX: 0, targetY: 1.10, targetZ: 0 },
        desc: 'Thu gom toàn bộ chất dinh dưỡng hấp thu từ ruột về gan xử lý và khử độc trước khi vào tuần hoàn.'
      },
      {
        id: 'dig_18_enteric_nervous',
        title: '18. Enteric Nervous System & Vagus',
        titleVi: '18. Phân Bố Thần Kinh Tự Chủ Ruột (Hệ ENS)',
        subtitle: 'Dây thần kinh lang thang X, chuỗi hạch giao cảm và đám rối Meissner/Auerbach',
        image: '/images/atlas/nerv_brain.png',
        systems: ['visceral', 'nervous', 'skeletal'],
        camera: { x: 0.22, y: 1.20, z: 0.70, targetX: 0, targetY: 1.18, targetZ: 0 },
        highlight: 'Stomach',
        desc: 'Hệ thần kinh ruột (não bộ thứ hai) phối hợp cùng thần kinh phó giao cảm điều phối nhu động ruột và tiết dịch.'
      },
      {
        id: 'dig_19_duodenum_papilla',
        title: '19. Duodenal Lumen & Ampulla of Vater',
        titleVi: '19. Lòng Tá Tràng D2 & Nhú Tá Lớn (Cơ Vòng Oddi)',
        subtitle: 'Ngã ba mật tụy đổ vào tá tràng qua nhú tá lớn',
        badge: 'Bóng Vater',
        image: '/images/atlas/dig_duodenum_papilla.png',
        systems: ['visceral', 'cardiovascular'],
        camera: { x: 0.08, y: 1.09, z: 0.24, targetX: 0.01, targetY: 1.09, targetZ: 0.03 },
        highlight: 'Major_Duodenal_Papilla',
        desc: 'Mở cửa sổ thành trước tá tràng đoạn D2: Quan sát nhú tá lớn, cơ vòng Oddi và điểm hội tụ của ống mật chủ cùng ống tụy chính Wirsung.'
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
        systems: ['visceral', 'skeletal'],
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
      },
      {
        id: 'uro_kidney_coronal',
        title: '3. Kidney Internal Architecture',
        titleVi: '3. Bổ Dọc Thận & Cấu Trúc Tủy - Vỏ (Sỏi Thận)',
        subtitle: 'Tháp thận Malpighi, đài bể thận và sỏi thận đài dưới',
        badge: 'Thận bổ dọc',
        image: '/images/atlas/uro_kidney_coronal.png',
        systems: ['visceral', 'skeletal', 'cardiovascular'],
        camera: { x: 0.14, y: 1.12, z: 0.35, targetX: 0.06, targetY: 1.11, targetZ: -0.02 },
        highlight: 'Kidney_Coronal_Cortex.l',
        desc: 'Thiết đồ bổ dọc thận trái: Phân định rõ vỏ thận giàu mao mạch, 7 tháp tủy Malpighi, hệ thống đài bể thận và vị trí đọng sỏi thận đài dưới.'
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
  },
  {
    id: 'surf_1_torso',
    titleVi: 'Giải Phẫu Bề Mặt Thân Mình (Da Bán Trong Suốt)',
    title: 'Surface Anatomy & Body Envelope',
    subtitle: 'Đối chiếu mốc xương và cơ bắp dưới lớp da người',
    badge: 'Giải phẫu bề mặt',
    image: '/images/atlas/surf_torso.png',
    camera: { x: 0, y: 1.25, z: 1.15, targetX: 0, targetY: 1.15, targetZ: 0 },
    systems: ['integumentary', 'skeletal', 'muscular']
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
    badge: 'Lâm sàng',
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
    systems: ['skeletal', 'muscular', 'visceral'],
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
    systems: ['skeletal', 'visceral'],
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
  },
  {
    id: 'lab_hepatobiliary_pancreas',
    titleVi: '10. Phẫu Tích Hệ Gan - Mật - Tụy - Tá Tràng',
    title: '10. Hepatobiliary & Pancreatic Dissection',
    subtitle: 'Bộc lộ túi mật, ống mật chủ, đầu tụy và tá tràng D2',
    badge: 'Nằm ngửa',
    orientation: 'supine',
    showTable: true,
    systems: ['visceral', 'cardiovascular', 'skeletal'],
    camera: { x: 0.35, y: 1.35, z: 0.30, targetX: -0.02, targetY: 0.82, targetZ: 0.05 },
    image: '/images/atlas/biliary_anatomy.svg',
    desc: 'Phẫu tích bộc lộ cuống gan, tam giác Calot (động mạch túi mật), ống mật chủ và ngã ba tụy tá tràng.'
  },
  {
    id: 'lab_stomach_dissection',
    titleVi: '11. Phẫu Tích & Cắt Mở Thành Dạ Dày',
    title: '11. Gastric Dissection & Mucosal Inspection',
    subtitle: 'Bóc tách tầng cơ và mở cửa sổ quan sát nếp gấp niêm mạc Rugae',
    badge: 'Nằm ngửa',
    orientation: 'supine',
    showTable: true,
    systems: ['visceral', 'skeletal'],
    camera: { x: 0.30, y: 1.35, z: 0.25, targetX: 0.02, targetY: 0.82, targetZ: 0.02 },
    image: '/images/atlas/stomach_anatomy_macro.svg',
    desc: 'Phẫu tích mở mặt trước dạ dày phơi bày các nếp gấp niêm mạc, lỗ tâm vị và van cơ thắt môn vị.'
  },
  {
    id: 'lab_pelvic_anorectal',
    titleVi: '12. Phẫu Tích Sàn Chậu & Ống Hậu Môn Trực Tràng',
    title: '12. Pelvic Floor & Anorectal Dissection',
    subtitle: 'Bộc lộ cơ nâng hậu môn, cơ thắt ngoài và khoang ngồi trực tràng',
    badge: 'Nằm sấp',
    orientation: 'prone',
    showTable: true,
    systems: ['visceral', 'muscular', 'skeletal'],
    camera: { x: 0.40, y: 1.30, z: 0.40, targetX: 0, targetY: 0.80, targetZ: 0.20 },
    image: '/images/atlas/skel_pelvis.png',
    desc: 'Phẫu tích sàn chậu từ phía sau bộc lộ quai cơ mu - trực tràng và hệ thống cơ thắt hậu môn.'
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
  },
  {
    id: 'cs_group_knee_radiology',
    titleVi: 'Khớp Gối (Cắt Lớp Đối Chiếu MRI/X-Quang)',
    plane: 'coronal',
    cards: [
      {
        id: 'cs_knee_coronal_mri',
        titleVi: '1. Khớp Gối (Cắt Đứng Ngang Coronal MRI)',
        title: '1. Knee (Coronal MRI)',
        subtitle: 'Lát cắt đứng ngang bộc lộ sụn chêm, dây chằng chéo và lồi cầu xương đùi',
        badge: 'Cắt đứng ngang',
        plane: 'coronal',
        offset: 0.02,
        camera: { x: 0.18, y: 0.48, z: 0.42, targetX: 0.15, targetY: 0.48, targetZ: 0 },
        systems: ['skeletal', 'joints'],
        image: '/images/atlas/hip_joint_anatomy.svg',
        scoutLabel: 'Knee Coronal MRI',
        desc: 'Mặt phẳng đứng ngang đối chiếu phim MRI khớp gối: đánh giá rách sụn chêm trong/ngoài, đứt dây chằng bên chày (MCL) và bên mác (LCL).'
      },
      {
        id: 'cs_knee_sagittal_mri',
        titleVi: '2. Khớp Gối (Cắt Đứng Dọc Sagittal MRI)',
        title: '2. Knee (Sagittal MRI)',
        subtitle: 'Lát cắt đứng dọc qua dây chằng chéo trước (ACL), chéo sau (PCL) và xương bánh chè',
        badge: 'Cắt đứng dọc',
        plane: 'sagittal',
        offset: 0.15,
        camera: { x: 0.52, y: 0.48, z: 0.05, targetX: 0.15, targetY: 0.48, targetZ: 0 },
        systems: ['skeletal', 'joints'],
        image: '/images/atlas/hip_joint_anatomy.svg',
        scoutLabel: 'Knee Sagittal MRI',
        desc: 'Mặt phẳng vàng trong chẩn đoán chấn thương thể thao: đối chiếu toàn vẹn bó dây chằng chéo trước (ACL), dây chằng chéo sau (PCL) và sừng sau sụn chêm.'
      },
      {
        id: 'cs_knee_axial_patella',
        titleVi: '3. Khớp Gối (Cắt Ngang Bánh Chè - Đùi Axial)',
        title: '3. Knee (Axial Patella)',
        subtitle: 'Lát cắt ngang khớp bánh chè đùi đối chiếu tư thế chụp Skyline X-quang',
        badge: 'Cắt ngang',
        plane: 'axial',
        offset: 0.49,
        camera: { x: 0.15, y: 0.72, z: 0.05, targetX: 0.15, targetY: 0.49, targetZ: 0 },
        systems: ['skeletal', 'joints'],
        image: '/images/atlas/hip_joint_anatomy.svg',
        scoutLabel: 'Knee Axial Skyline',
        desc: 'Mặt phẳng cắt ngang qua diện khớp bánh chè - lồi cầu đùi: đánh giá độ nghiêng, trật khớp bánh chè và thoái hóa sụn khớp bánh chè đùi.'
      }
    ]
  },
  {
    id: 'cs_group_hip_radiology',
    titleVi: 'Khớp Háng (Cắt Lớp Đối Chiếu CT/X-Quang)',
    plane: 'coronal',
    cards: [
      {
        id: 'cs_hip_coronal_ap',
        titleVi: '1. Khớp Háng (Cắt Đứng Ngang Khung Chậu Coronal)',
        title: '1. Hip (Coronal AP)',
        subtitle: 'Lát cắt đứng ngang bộc lộ chỏm xương đùi, ổ cối và sụn viền khớp háng',
        badge: 'Cắt đứng ngang',
        plane: 'coronal',
        offset: 0.00,
        camera: { x: 0.18, y: 0.86, z: 0.52, targetX: 0.15, targetY: 0.86, targetZ: 0 },
        systems: ['skeletal', 'joints'],
        image: '/images/atlas/hip_joint_anatomy.svg',
        scoutLabel: 'Hip Pelvis Coronal',
        desc: 'Mặt phẳng đối chiếu X-quang khung chậu thẳng (Pelvis AP): đánh giá góc cổ thân xương đùi (CCD), độ che phủ ổ cối và khe khớp háng.'
      },
      {
        id: 'cs_hip_axial_acetabulum',
        titleVi: '2. Khớp Háng (Cắt Ngang Ổ Cối & Chỏm Đùi Axial CT)',
        title: '2. Hip (Axial CT)',
        subtitle: 'Lát cắt ngang qua trung tâm ổ cối, chỏm xương đùi và bao khớp háng',
        badge: 'Cắt ngang',
        plane: 'axial',
        offset: 0.84,
        camera: { x: 0.15, y: 1.15, z: 0.05, targetX: 0.15, targetY: 0.84, targetZ: 0 },
        systems: ['skeletal', 'joints'],
        image: '/images/atlas/hip_joint_anatomy.svg',
        scoutLabel: 'Hip Axial CT',
        desc: 'Mặt phẳng cắt lớp vi tính (CT) qua ổ cối: đánh giá vỡ thành trước/thành sau ổ cối và hoại tử vô mạch chỏm xương đùi.'
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
  },
  {
    id: 'micro_group_digestive',
    titleVi: 'Mô Học & Giải Phẫu Vi Thể Hệ Tiêu Hóa',
    cards: [
      {
        id: 'micro_stomach_wall',
        titleVi: '1. Cắt Lớp Đa Tầng Thành Dạ Dày',
        title: '1. Gastric Wall Histology & Rugae',
        subtitle: 'Thanh mạc, 3 tầng cơ trơn, dưới niêm Meissner và tuyến vị tiết acid',
        badge: 'Mô học dạ dày',
        systems: ['visceral'],
        camera: { x: 0.08, y: 1.18, z: 0.58, targetX: 0.02, targetY: 1.16, targetZ: 0 },
        image: '/images/atlas/gastric_wall_histology.svg',
        desc: 'Mặt cắt vi thể 5 tầng: thanh mạc, cơ dọc, cơ vòng, cơ chéo trong, dưới niêm và niêm mạc với nếp gấp Rugae.'
      },
      {
        id: 'micro_ampulla_vater',
        titleVi: '2. Vi Thể Bóng Gan Tụy & Cơ Vòng Oddi',
        title: '2. Ampulla of Vater & Sphincter of Oddi',
        subtitle: 'Ống mật chủ, ống Wirsung, cơ vòng Oddi và nhú tá lớn D2',
        badge: 'Ngã ba mật tụy',
        systems: ['visceral'],
        camera: { x: -0.06, y: 1.15, z: 0.52, targetX: -0.02, targetY: 1.13, targetZ: 0 },
        image: '/images/atlas/biliary_anatomy.svg',
        desc: 'Cấu trúc vi thể cơ vòng Oddi kiểm soát dòng chảy dịch mật và dịch tụy đổ vào lòng tá tràng.'
      },
      {
        id: 'micro_intestinal_villi',
        titleVi: '3. Vi Thể Quai Ruột Non & Nhung Mao Hấp Thu',
        title: '3. Intestinal Villi & Microvilli',
        subtitle: 'Nếp gấp Kerckring, nhung mao ruột, bờ bàn chải và mảng Peyer',
        badge: 'Nhung mao ruột',
        systems: ['visceral'],
        camera: { x: 0, y: 1.02, z: 0.82, targetX: 0, targetY: 1.00, targetZ: 0 },
        image: '/images/atlas/gi_tract_anatomy.svg',
        desc: 'Đơn vị hấp thu vi thể: nhung mao ruột chứa mao mạch và mạch dưỡng trấp lacteal vận chuyển lipid.'
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


