// Vietnamese Anatomical Dictionary and Transliterator
// Standard Terminologia Anatomica (TA2) Vietnamese translation

const EXACT_DICTIONARY = {
  'Skin': 'Lớp da bề mặt',
  'Meso-appendix': 'Mạc treo ruột thừa',
  'Free taenia': 'Dải cơ tự do (Đại tràng)',
  'Mesocolic taenia': 'Dải cơ mạc treo đại tràng',
  'Omental taenia': 'Dải cơ mạc nối (Đại tràng)',
  'Liver': 'Lá gan (Gan)',
  'Gingiva': 'Nướu răng (Lợi)',
  'Soft palate': 'Khẩu cái mềm (Màn hầu)',
  'Tongue': 'Lưỡi',
  'Uvula of palate': 'Lưỡi gà khẩu cái',
  'Laryngopharynx': 'Họng thanh quản (Hạ hầu)',
  'Nasopharynx': 'Họng mũi (Tỵ hầu)',
  'Oropharynx': 'Họng miệng (Khẩu hầu)',
  'Adenohypophysis': 'Thùy trước tuyến yên (Tuyến yên tuyến)',
  'Neurohypophysis': 'Thùy sau tuyến yên (Tuyến yên thần kinh)',
  'Pineal gland': 'Tuyến tùng',
  'Corpus cavernosum of penis': 'Vật hang dương vật',
  'Corpus spongiosum of penis': 'Vật xốp dương vật',
  'Glans penis': 'Quy đầu dương vật',
  'Mucosa of nasal cavity': 'Niêm mạc hốc mũi',
  'Pleura': 'Màng phổi',
  'Anterior lateral segment of liver (VI)': 'Phân thùy gan trước ngoài (Phân thùy VI)',
  'Anterior medial segment of liver (V)': 'Phân thùy gan trước trong (Phân thùy V)',
  'Left anterior lateral segment of liver (III)': 'Phân thùy gan trái trước ngoài (Phân thùy III)',
  'Left medial segment of liver (IV)': 'Phân thùy gan trái trong (Phân thùy IV)',
  'Left posterior lateral segment of liver (II)': 'Phân thùy gan trái sau ngoài (Phân thùy II)',
  'Posterior lateral segment of liver (VII)': 'Phân thùy gan sau ngoài (Phân thùy VII)',
  'Posterior medial segment of liver (VIII)': 'Phân thùy gan sau trong (Phân thùy VIII)',
  'Posterior segment of liver (I)': 'Phân thùy gan sau (Thùy đuôi - Phân thùy I)',
  'Left inferior lobar bronchus': 'Phế quản thùy dưới phổi trái',
  'Left superior lobar bronchus': 'Phế quản thùy trên phổi trái',
  'Right inferior lobar bronchus': 'Phế quản thùy dưới phổi phải',
  'Right superior lobar bronchus': 'Phế quản thùy trên phổi phải',
  'Anteromedial basal segmental bronchus of left lung': 'Phế quản phân thùy đáy trước trong phổi trái',
  '(Anteromedial basal segmental bronchus of left lung)': 'Phế quản phân thùy đáy trước trong phổi trái',
  'Anterior basal segmental bronchus of left lung (BVIII)': 'Phế quản phân thùy đáy trước phổi trái (BVIII)',
  'Lateral basal segmental bronchus of left lung (BIX)': 'Phế quản phân thùy đáy ngoài phổi trái (BIX)',
  'Medial basal segmental bronchus of left lung (BVII)': 'Phế quản phân thùy đáy trong phổi trái (BVII)',
  'Posterior basal segmental bronchus of left lung (BX)': 'Phế quản phân thùy đáy sau phổi trái (BX)',
  'Superior segmental bronchus of left lung (BVI)': 'Phế quản phân thùy đỉnh thùy dưới phổi trái (BVI)',
  'Anterior segmental bronchus of left lung (BIII)': 'Phế quản phân thùy trước phổi trái (BIII)',
  'Apicoposterior segmental bronchus of left lung (BI+BII)': 'Phế quản phân thùy đỉnh - sau phổi trái (BI+BII)',
  'Inferior lingular segmental bronchus of left lung (BV)': 'Phế quản phân thùy lưỡi dưới phổi trái (BV)',
  'Superior lingular segmental bronchus of left lung (BIV)': 'Phế quản phân thùy lưỡi trên phổi trái (BIV)',
  'Lateral segmental bronchus of right lung (BIV)': 'Phế quản phân thùy ngoài phổi phải (BIV)',
  'Medial segmental bronchus of right lung (BV)': 'Phế quản phân thùy trong phổi phải (BV)',
  'Anterior basal segmental bronchus of right lung (BVIII)': 'Phế quản phân thùy đáy trước phổi phải (BVIII)',
  'Lateral basal segmental bronchus of right lung (BIX)': 'Phế quản phân thùy đáy ngoài phổi phải (BIX)',
  'Medial basal segmental bronchus of right lung (BVII)': 'Phế quản phân thùy đáy trong phổi phải (BVII)',
  'Posterior basal segmental bronchus of right lung (BX)': 'Phế quản phân thùy đáy sau phổi phải (BX)',
  'Superior segmental bronchus of right lung (BVI)': 'Phế quản phân thùy đỉnh thùy dưới phổi phải (BVI)',
  'Anterior segmental bronchus of right lung (BIII)': 'Phế quản phân thùy trước phổi phải (BIII)',
  'Apical segmental bronchus of right lung (BI)': 'Phế quản phân thùy đỉnh phổi phải (BI)',
  'Posterior segmental bronchus of right lung (BII)': 'Phế quản phân thùy sau phổi phải (BII)',
  'Inferior leaflet of right atrioventricular valve': 'Lá dưới van nhĩ thất phải (Van ba lá)',
  'Posterior leaflet of left atrioventricular valve': 'Lá sau van nhĩ thất trái (Van hai lá)',
  'Septal leaflet of right atrioventricular valve': 'Lá vách van nhĩ thất phải',
  'Left coronary leaflet': 'Lá vành trái (Van động mạch chủ)',
  'Non-coronary leaflet': 'Lá không vành (Van động mạch chủ)',
  'Right coronary leaflet': 'Lá vành phải (Van động mạch chủ)',
  'Anterior semilunar leaflet of pulmonary valve': 'Lá bán nguyệt trước (Van động mạch phổi)',
  'Left semilunar leaflet of pulmonary valve': 'Lá bán nguyệt trái (Van động mạch phổi)',
  'Right semilunar leaflet of pulmonary valve': 'Lá bán nguyệt phải (Van động mạch phổi)',
  'Bifurcation of pulmonary trunk': 'Trạc chia thân động mạch phổi',
  'Coeliac trunk': 'Thân động mạch thân tạng',
  'Sigmoid arteries': 'Các động mạch đại tràng sigma',
  'Intrarenal arteries of left kidney': 'Các động mạch trong thận trái',
  'Intrarenal arteries of right kidney': 'Các động mạch trong thận phải',
  'Brachiocephalic trunk': 'Thân động mạch cánh tay đầu',
  'Superior phrenic arteries': 'Các động mạch hoành trên',
  'Coronary sinus': 'Xoang tĩnh mạch vành tim',
  'Anterior intercavernous sinus': 'Xoang liên hang trước',
  'Posterior intercavernous sinus': 'Xoang liên hang sau',
  'Basilar venous plexus': 'Đám rối tĩnh mạch nền',
  'Inferior sagittal sinus': 'Xoang tĩnh mạch dọc dưới',
  'Occipital sinus': 'Xoang tĩnh mạch chẩm',
  'Straight sinus': 'Xoang tĩnh mạch thẳng',
  'Superior sagittal sinus': 'Xoang tĩnh mạch dọc trên',
  'Superficial dorsal veins of penis': 'Các tĩnh mạch mu nông dương vật',
  'Sigmoid veins': 'Các tĩnh mạch đại tràng sigma',
  'Hepatic veins': 'Các tĩnh mạch gan',
  'Intrarenal veins of left kidney': 'Các tĩnh mạch trong thận trái',
  'Intrarenal veins of right kidney': 'Các tĩnh mạch trong thận phải',
  'Inferior vena cava (abdominal part)': 'Tĩnh mạch chủ dưới (đoạn bụng)',
  'Inferior vena cava (thoracic part)': 'Tĩnh mạch chủ dưới (đoạn ngực)',
  'Central lobule': 'Tiểu thùy trung tâm (Tiểu não)',
  'Culmen': 'Đỉnh tiểu não (Culmen)',
  'Declive': 'Dốc tiểu não (Declive)',
  'Folium of vermis': 'Lá nhộng tiểu não',
  'Lingula of cerebellum': 'Lưỡi tiểu não',
  'Nodule of vermis': 'Củ nhộng tiểu não',
  'Pyramis of vermis': 'Tháp nhộng tiểu não',
  'Tuber of vermis': 'Củ sâu nhộng tiểu não',
  'Uvula of vermis': 'Lưỡi gà nhộng tiểu não',
  'Habenula': 'Cuống tùng (Vùng trên đồi)',
  'Posterior commissure': 'Mép sau (Não)',
  'Septal nuclei': 'Các nhân vách',
  'Septum pellucidum': 'Vách trong suốt',
  'Anterior commissure': 'Mép trước (Não)',
  'Corpus callosum': 'Thể chai',
  'Hippocampal commissure': 'Mép hải mã',
  'Central canal': 'Ống trung tâm tủy gai',
  "Central canal'": 'Ống trung tâm tủy gai',
  'Intermediolateral nucleus': 'Nhân trung gian ngoài',
  'Intermediomedial nucleus': 'Nhân trung gian trong',
  'Lateral intermediate substance': 'Chất trung gian ngoài',
  'Nucleus proprius': 'Nhân riêng (Sừng sau tủy gai)',
  'Spinal reticular process': 'Mỏm lưới tủy gai',
  'Anterior corticospinal tract': 'Bó vỏ - gai trước',
  'Anterior fasciculus proprius': 'Bó riêng trước tủy gai',
  'Lateral vestibulospinal tract': 'Bó tiền đình - gai ngoài',
  'Medial reticulospinal tract': 'Bó lưới - gai trong',
  'Medial vestibulospinal tract': 'Bó tiền đình - gai trong',
  'Tectospinal tract': 'Bó mái - gai',
  'Anterior spinothalamic tract': 'Bó gai - đồi thị trước',
  'Lateral spinothalamic tract': 'Bó gai - đồi thị ngoài',
  'Spinotectal tract': 'Bó gai - mái',
  'Anterior spinocerebellar tract': 'Bó gai - tiểu não trước',
  'Lateral corticospinal tract': 'Bó vỏ - gai ngoài',
  'Lateral fasciculus proprius': 'Bó riêng ngoài tủy gai',
  'Lateral reticulospinal tract': 'Bó lưới - gai ngoài',
  'Posterior spinocerebellar tract': 'Bó gai - tiểu não sau',
  'Rubrospinal tract': 'Bó nhân đỏ - gai',
  'Cuneate fasciculus': 'Bó chêm (Bó Burdach)',
  'Gracile fasciculus': 'Bó thon (Bó Goll)',
  'Posterior fasciculus proprius': 'Bó riêng sau tủy gai',
  'Posterolateral tract': 'Bó sau ngoài (Bó Lissauer)',
  'White matter of spinal cord': 'Chất trắng tủy gai',
  'Cauda equina': 'Chùm đuôi ngựa (Tủy gai)',
  'Left lobe of thymus': 'Thùy trái tuyến ức',
  'Right lobe of thymus': 'Thùy phải tuyến ức',
  'Inferior diaphragmatic nodes': 'Các hạch hoành dưới',
  'Lateral aortic nodes': 'Các hạch cạnh động mạch chủ',
  'Pre-aortic nodes': 'Các hạch trước động mạch chủ',
  'Retro-aortic nodes': 'Các hạch sau động mạch chủ',
  'Lateral caval nodes': 'Các hạch cạnh tĩnh mạch chủ',
  'Precaval nodes': 'Các hạch trước tĩnh mạch chủ',
  'Retrocaval nodes': 'Các hạch sau tĩnh mạch chủ',
  'Coeliac nodes': 'Các hạch thân tạng',
  'Cystic node': 'Hạch túi mật (Hạch Mascagni)',
  'Left colic nodes': 'Các hạch đại tràng trái',
  'Sigmoid nodes': 'Các hạch đại tràng sigma',
  'Intermediate lumbar nodes': 'Các hạch thắt lưng trung gian',
  'Inferior pancreatic nodes': 'Các hạch tụy dưới',
  'Superior pancreatic nodes': 'Các hạch tụy trên',
  'Superior pancreaticoduodenal nodes': 'Các hạch tụy - tá tràng trên',
  '(Retropyloric nodes)': 'Các hạch sau môn vị',
  'Retropyloric nodes': 'Các hạch sau môn vị',
  '(Subpyloric nodes)': 'Các hạch dưới môn vị',
  'Subpyloric nodes': 'Các hạch dưới môn vị',
  '(Suprapyloric node)': 'Hạch trên môn vị',
  'Suprapyloric node': 'Hạch trên môn vị',
  '????????': 'Mạch máu nhỏ (Vi tuần hoàn)',
  'Right gastric nodes': 'Các hạch dạ dày phải',
  'Right gastro-omental nodes': 'Các hạch mạc nối - dạ dày phải',
  'Splenic nodes': 'Các hạch lách',
  'Appendicular nodes': 'Các hạch ruột thừa',
  'Central superior mesenteric nodes': 'Các hạch mạc treo tràng trên trung tâm',
  'Ileocolic nodes': 'Các hạch hồi - đại tràng',
  'Juxta-intestinal mesenteric nodes': 'Các hạch mạc treo sát ruột',
  'Middle colic nodes': 'Các hạch đại tràng giữa',
  'Paracolic superior mesenteric nodes': 'Các hạch cạnh đại tràng',
  'Precaecal nodes': 'Các hạch trước manh tràng',
  'Retrocaecal nodes': 'Các hạch sau manh tràng',
  'Right colic nodes': 'Các hạch đại tràng phải',
  'Paratracheal cervical nodes': 'Các hạch cạnh khí quản cổ',
  'Superficial anterior cervical nodes': 'Các hạch cổ trước nông',
  'Intermediate common iliac nodes': 'Các hạch chậu chung trung gian',
  'Lateral common iliac nodes': 'Các hạch chậu chung ngoài',
  'Medial common iliac nodes': 'Các hạch chậu chung trong',
  'Subaortic nodes': 'Các hạch dưới động mạch chủ',
  'Pararectal nodes': 'Các hạch cạnh trực tràng',
  'Postvesical nodes': 'Các hạch sau bàng quang',
  'Prevesical nodes': 'Các hạch trước bàng quang',
  'Inferior tracheobronchial nodes': 'Các hạch khí - phế quản dưới (Hạch dưới chẽ đôi)',
  'Juxta-oesophageal nodes': 'Các hạch cạnh thực quản',
  'Lateral pericardial nodes': 'Các hạch cạnh màng ngoài tim',
  'Node of ligamentum arteriosum': 'Hạch dây chằng động mạch',
  'Paratracheal thoracic nodes': 'Các hạch cạnh khí quản ngực',
  'Prepericardial nodes': 'Các hạch trước màng ngoài tim',
  'Superior tracheobronchial nodes': 'Các hạch khí - phế quản trên',
  'Prevertebral nodes': 'Các hạch trước cột sống',
  'Superior diaphragmatic nodes': 'Các hạch hoành trên',
  'Intrapulmonary nodes': 'Các hạch trong nhu mô phổi',
  // --- BONES: HEAD & NECK ---
  'Frontal bone': 'Xương trán',
  'Parietal bone': 'Xương đỉnh',
  'Occipital bone': 'Xương chẩm',
  'Temporal bone': 'Xương thái dương',
  'Sphenoid bone': 'Xương bướm',
  'Ethmoid bone': 'Xương sàng',
  'Mandible': 'Xương hàm dưới',
  'Maxilla': 'Xương hàm trên',
  'Zygomatic bone': 'Xương gò má',
  'Nasal bone': 'Xương mũi',
  'Lacrimal bone': 'Xương lệ',
  'Palatine bone': 'Xương khẩu cái',
  'Vomer': 'Xương lá mía',
  'Inferior nasal concha': 'Xương xoăn mũi dưới',
  'Hyoid bone': 'Xương móng',
  'Anterior cells of ethmoid bone': 'Các xoang sàng trước',
  'Middle cells of ethmoid bone': 'Các xoang sàng giữa',
  'Posterior cells of ethmoid bone': 'Các xoang sàng sau',
  'Arytenoid cartilage': 'Sụn phễu',
  'Thyroid cartilage': 'Sụn giáp',
  'Cricoid cartilage': 'Sụn nhẫn',
  'Epiglottis': 'Nắp thanh môn',
  'Corniculate cartilage': 'Sụn sừng',
  'Cuneiform cartilage': 'Sụn chêm',

  // --- BONES: SPINE & THORAX ---
  'Atlas (C1)': 'Đốt sống cổ C1 (Đốt đội)',
  'Axis (C2)': 'Đốt sống cổ C2 (Đốt trục)',
  'Third cervical vertebra (C3)': 'Đốt sống cổ C3',
  'Fourth cervical vertebra (C4)': 'Đốt sống cổ C4',
  'Fifth cervical vertebra (C5)': 'Đốt sống cổ C5',
  'Sixth cervical vertebra (C6)': 'Đốt sống cổ C6',
  'Seventh cervical vertebra (C7)': 'Đốt sống cổ C7 (Đốt sống lồi)',
  'Vertebra C1': 'Đốt sống cổ C1 (Đốt đội)',
  'Vertebra C2': 'Đốt sống cổ C2 (Đốt trục)',
  'Vertebra C3': 'Đốt sống cổ C3',
  'Vertebra C4': 'Đốt sống cổ C4',
  'Vertebra C5': 'Đốt sống cổ C5',
  'Vertebra C6': 'Đốt sống cổ C6',
  'Vertebra C7': 'Đốt sống cổ C7 (Đốt sống lồi)',
  'First thoracic vertebra (T1)': 'Đốt sống ngực T1',
  'Second thoracic vertebra (T2)': 'Đốt sống ngực T2',
  'Third thoracic vertebra (T3)': 'Đốt sống ngực T3',
  'Fourth thoracic vertebra (T4)': 'Đốt sống ngực T4',
  'Fifth thoracic vertebra (T5)': 'Đốt sống ngực T5',
  'Sixth thoracic vertebra (T6)': 'Đốt sống ngực T6',
  'Seventh thoracic vertebra (T7)': 'Đốt sống ngực T7',
  'Eighth thoracic vertebra (T8)': 'Đốt sống ngực T8',
  'Ninth thoracic vertebra (T9)': 'Đốt sống ngực T9',
  'Tenth thoracic vertebra (T10)': 'Đốt sống ngực T10',
  'Eleventh thoracic vertebra (T11)': 'Đốt sống ngực T11',
  'Twelfth thoracic vertebra (T12)': 'Đốt sống ngực T12',
  'Vertebra T1': 'Đốt sống ngực T1',
  'Vertebra T2': 'Đốt sống ngực T2',
  'Vertebra T3': 'Đốt sống ngực T3',
  'Vertebra T4': 'Đốt sống ngực T4',
  'Vertebra T5': 'Đốt sống ngực T5',
  'Vertebra T6': 'Đốt sống ngực T6',
  'Vertebra T7': 'Đốt sống ngực T7',
  'Vertebra T8': 'Đốt sống ngực T8',
  'Vertebra T9': 'Đốt sống ngực T9',
  'Vertebra T10': 'Đốt sống ngực T10',
  'Vertebra T11': 'Đốt sống ngực T11',
  'Vertebra T12': 'Đốt sống ngực T12',
  'First lumbar vertebra (L1)': 'Đốt sống thắt lưng L1',
  'Second lumbar vertebra (L2)': 'Đốt sống thắt lưng L2',
  'Third lumbar vertebra (L3)': 'Đốt sống thắt lưng L3',
  'Fourth lumbar vertebra (L4)': 'Đốt sống thắt lưng L4',
  'Fifth lumbar vertebra (L5)': 'Đốt sống thắt lưng L5',
  'Vertebra L1': 'Đốt sống thắt lưng L1',
  'Vertebra L2': 'Đốt sống thắt lưng L2',
  'Vertebra L3': 'Đốt sống thắt lưng L3',
  'Vertebra L4': 'Đốt sống thắt lưng L4',
  'Vertebra L5': 'Đốt sống thắt lưng L5',
  'Sacrum': 'Xương cùng',
  'Coccyx': 'Xương cụt',
  'Sternum': 'Xương ức',
  'Body of sternum': 'Thân xương ức',
  'Manubrium of sternum': 'Cán xương ức',
  'Xiphoid process': 'Mỏm mũi kiếm (xương ức)',
  'First rib': 'Xương sườn 1',
  'Second rib': 'Xương sườn 2',
  'Third rib': 'Xương sườn 3',
  'Fourth rib': 'Xương sườn 4',
  'Fifth rib': 'Xương sườn 5',
  'Sixth rib': 'Xương sườn 6',
  'Seventh rib': 'Xương sườn 7',
  'Eighth rib': 'Xương sườn 8',
  'Ninth rib': 'Xương sườn 9',
  'Tenth rib': 'Xương sườn 10',
  'Eleventh rib': 'Xương sườn 11',
  'Twelfth rib': 'Xương sườn 12',
  'Costal cartilage of first rib': 'Sụn sườn 1',
  'Costal cartilage of second rib': 'Sụn sườn 2',
  'Costal cartilage of third rib': 'Sụn sườn 3',
  'Costal cartilage of fourth rib': 'Sụn sườn 4',
  'Costal cartilage of fifth rib': 'Sụn sườn 5',
  'Costal cartilage of sixth rib': 'Sụn sườn 6',
  'Costal cartilage of seventh rib': 'Sụn sườn 7',
  'Costal cartilage of eighth rib': 'Sụn sườn 8',
  'Costal cartilage of ninth rib': 'Sụn sườn 9',
  'Costal cartilage of tenth rib': 'Sụn sườn 10',

  // --- BONES: UPPER LIMB ---
  'Clavicle': 'Xương đòn (Quai xanh)',
  'Scapula': 'Xương bả vai',
  'Humerus': 'Xương cánh tay',
  'Radius': 'Xương quay',
  'Ulna': 'Xương trụ',
  'Scaphoid bone': 'Xương thuyền',
  'Lunate bone': 'Xương nguyệt',
  'Triquetrum': 'Xương tháp',
  'Pisiform bone': 'Xương đậu',
  'Trapezium bone': 'Xương thang',
  'Trapezoid bone': 'Xương thê',
  'Capitate bone': 'Xương cả',
  'Hamate bone': 'Xương móc',
  'First metacarpal bone': 'Xương đốt bàn tay 1 (ngón cái)',
  'Second metacarpal bone': 'Xương đốt bàn tay 2',
  'Third metacarpal bone': 'Xương đốt bàn tay 3',
  'Fourth metacarpal bone': 'Xương đốt bàn tay 4',
  'Fifth metacarpal bone': 'Xương đốt bàn tay 5',

  // --- BONES: LOWER LIMB ---
  'Hip bone': 'Xương chậu',
  'Pelvis': 'Khung chậu',
  'Femur': 'Xương đùi',
  'Patella': 'Xương bánh chè',
  'Tibia': 'Xương chày',
  'Fibula': 'Xương mác',
  'Talus': 'Xương sên',
  'Calcaneus': 'Xương gót',
  'Navicular bone': 'Xương ghe',
  'Medial cuneiform bone': 'Xương chêm trong',
  'Intermediate cuneiform bone': 'Xương chêm giữa',
  'Lateral cuneiform bone': 'Xương chêm ngoài',
  'Cuboid bone': 'Xương hộp',
  'First metatarsal bone': 'Xương đốt bàn chân 1',
  'Second metatarsal bone': 'Xương đốt bàn chân 2',
  'Third metatarsal bone': 'Xương đốt bàn chân 3',
  'Fourth metatarsal bone': 'Xương đốt bàn chân 4',
  'Fifth metatarsal bone': 'Xương đốt bàn chân 5',

  // --- MUSCLES ---
  'Deltoid muscle': 'Cơ delta (cơ vai)',
  'Pectoralis major': 'Cơ ngực lớn',
  'Pectoralis minor': 'Cơ ngực bé',
  'Biceps brachii': 'Cơ nhị đầu cánh tay (chuột trước)',
  'Triceps brachii': 'Cơ tam đầu cánh tay (bắp sau)',
  'Brachialis': 'Cơ cánh tay',
  'Brachioradialis': 'Cơ cánh tay quay',
  'Trapezius': 'Cơ thang (vai - gáy)',
  'Latissimus dorsi': 'Cơ lưng rộng (cơ xô)',
  'Rectus abdominis': 'Cơ thẳng bụng (cơ 6 múi)',
  'External oblique': 'Cơ chéo bụng ngoài',
  'Internal oblique': 'Cơ chéo bụng trong',
  'Transversus abdominis': 'Cơ ngang bụng',
  'Gluteus maximus': 'Cơ mông lớn',
  'Gluteus medius': 'Cơ mông nhỡ',
  'Gluteus minimus': 'Cơ mông bé',
  'Piriformis': 'Cơ hình lê',
  'Quadriceps femoris': 'Cơ tứ đầu đùi',
  'Rectus femoris': 'Cơ thẳng đùi',
  'Vastus lateralis': 'Cơ rộng ngoài',
  'Vastus medialis': 'Cơ rộng trong',
  'Vastus intermedius': 'Cơ rộng giữa',
  'Biceps femoris': 'Cơ nhị đầu đùi',
  'Semitendinosus': 'Cơ bán gân',
  'Semimembranosus': 'Cơ bán màng',
  'Sartorius': 'Cơ may',
  'Gracilis': 'Cơ thon',
  'Gastrocnemius': 'Cơ bụng chân (bắp chuối)',
  'Soleus': 'Cơ dép',
  'Tibialis anterior': 'Cơ chày trước',
  'Sternocleidomastoid': 'Cơ ức đòn chũm',
  'Masseter': 'Cơ cắn',
  'Temporalis': 'Cơ thái dương',
  'Diaphragm': 'Cơ hoành',

  // --- ORGANS & VISCERA ---
  'Heart': 'Quả tim',
  'Lung': 'Phổi',
  'Left lung': 'Phổi trái',
  'Right lung': 'Phổi phải',
  'Brain': 'Não bộ',
  'Liver': 'Gan',
  'Stomach': 'Dạ dày',
  'Duodenum': 'Tá tràng',
  'Small intestine': 'Ruột non',
  'Large intestine': 'Ruột già (Đại tràng)',
  'Appendix': 'Ruột thừa',
  'Vermiform appendix': 'Ruột thừa',
  'Spleen': 'Lá lách',
  'Pancreas': 'Tụy',
  'Pancreatic duct': 'Ống tụy',
  'Accessory pancreatic duct': 'Ống tụy phụ',
  'Gallbladder': 'Túi mật',
  'Bile duct': 'Ống mật',
  'Common bile duct': 'Ống mật chủ',
  'Cystic duct': 'Ống túi mật',
  'Kidney': 'Thận',
  'Left kidney': 'Thận trái',
  'Right kidney': 'Thận phải',
  'Urinary bladder': 'Bàng quang',
  'Ureter': 'Niệu quản',
  'Urethra': 'Niệu đạo',
  'Prostate': 'Tuyến tiền liệt',
  'Testis': 'Tinh hoàn',
  'Epididymis': 'Mào tinh',
  'Trachea': 'Khí quản',
  'Esophagus': 'Thực quản',
  'Oesophagus': 'Thực quản',
  'Thyroid gland': 'Tuyến giáp',
  'Parathyroid gland': 'Tuyến cận giáp',
  'Suprarenal gland': 'Tuyến thượng thận',
  'Adrenal gland': 'Tuyến thượng thận',
  'Thoracic duct': 'Ống ngực (Bạch huyết)',
  'Jejunum': 'Hỗng tràng',
  'Ileum': 'Hồi tràng',
  'Ascending colon': 'Đại tràng lên',
  'Transverse colon': 'Đại tràng ngang',
  'Descending colon': 'Đại tràng xuống',
  'Sigmoid colon': 'Đại tràng xích-ma',
  'Greater omentum': 'Mạc nối lớn',
  'Lesser omentum': 'Mạc nối nhỏ',
  'Mesentery': 'Mạc treo ruột',
  'Mesocolon': 'Mạc treo đại tràng',

  // --- CARDIOVASCULAR & HEART ---
  'Heart': 'Quả tim',
  'Left ventricle': 'Tâm thất trái',
  'Right ventricle': 'Tâm thất phải',
  'Left atrium': 'Tâm nhĩ trái',
  'Right atrium': 'Tâm nhĩ phải',
  'Interventricular septum': 'Vách liên thất',
  'Interatrial septum': 'Vách liên nhĩ',
  'Mitral valve': 'Van hai lá',
  'Tricuspid valve': 'Van ba lá',
  'Aortic valve': 'Van động mạch chủ',
  'Pulmonary valve': 'Van động mạch phổi',
  'Aorta': 'Động mạch chủ',
  'Ascending aorta': 'Động mạch chủ lên',
  'Aortic arch': 'Cung động mạch chủ',
  'Abdominal aorta': 'Động mạch chủ bụng',
  'Thoracic aorta': 'Động mạch chủ ngực',
  'Superior vena cava': 'Tĩnh mạch chủ trên',
  'Inferior vena cava': 'Tĩnh mạch chủ dưới',
  'Pulmonary trunk': 'Thân động mạch phổi',
  'Pulmonary artery': 'Động mạch phổi',
  'Pulmonary vein': 'Tĩnh mạch phổi',
  'Left pulmonary artery': 'Động mạch phổi trái',
  'Right pulmonary artery': 'Động mạch phổi phải',
  'Common carotid artery': 'Động mạch cảnh chung',
  'Internal carotid artery': 'Động mạch cảnh trong',
  'External carotid artery': 'Động mạch cảnh ngoài',
  'Femoral artery': 'Động mạch đùi',
  'Radial artery': 'Động mạch quay',
  'Ulnar artery': 'Động mạch trụ',
  'Brachial artery': 'Động mạch cánh tay',
  'Subclavian artery': 'Động mạch dưới đòn',
  'Circumflex artery of heart': 'Nhánh mũ động mạch vành',
  'Anterior interventricular artery': 'Động mạch liên thất trước',

  // --- RESPIRATORY LOBES ---
  'Superior lobe of left lung': 'Thùy trên phổi trái',
  'Inferior lobe of left lung': 'Thùy dưới phổi trái',
  'Superior lobe of right lung': 'Thùy trên phổi phải',
  'Middle lobe of right lung': 'Thùy giữa phổi phải',
  'Inferior lobe of right lung': 'Thùy dưới phổi phải',
  'Left main bronchus': 'Phế quản chính trái',
  'Right main bronchus': 'Phế quản chính phải',

  // --- LYMPHATIC NODES ---
  'Central axillary nodes': 'Nhóm hạch nách trung tâm',
  'Central axillary nodes.l': 'Hạch nách trung tâm (trái)',
  'Central axillary nodes.r': 'Hạch nách trung tâm (phải)',
  'Anterior axillary nodes.l': 'Hạch nách trước (trái)',
  'Anterior axillary nodes.r': 'Hạch nách trước (phải)',
  'Apical axillary nodes.l': 'Hạch nách đỉnh (trái)',
  'Apical axillary nodes.r': 'Hạch nách đỉnh (phải)',
  'Brachiocephalic nodes': 'Nhóm hạch cánh tay đầu',

  // --- NERVES & CENTRAL NERVOUS ---
  'Falx cerebri': 'Liềm đại não',
  'Tentorium cerebelli': 'Lều tiểu não',
  'Hypothalamus': 'Vùng hạ đồi',
  'Thalamus': 'Đồi thị',
  'Lateral ventricle': 'Não thất bên',
  'Lateral ventricle.l': 'Não thất bên (trái)',
  'Lateral ventricle.r': 'Não thất bên (phải)',
  'Third ventricle': 'Não thất ba',
  'Fourth ventricle': 'Não thất tư',
  'Aqueduct of midbrain': 'Cống não Sylvius',
  'Cerebral aqueduct': 'Cống não Sylvius',
  'Choroid plexus': 'Đám rối màng mạch (Sinh dịch não tủy)',
  'Choroid plexus.l': 'Đám rối màng mạch trái (Sinh dịch não tủy)',
  'Choroid plexus.r': 'Đám rối màng mạch phải (Sinh dịch não tủy)',
  'Spinal dura': 'Màng cứng tủy gai & Hộp sọ',
  'Anterior horn of spinal cord': 'Sừng trước tủy sống',
  'Posterior horn of spinal cord': 'Sừng sau tủy sống',
  'Spinal cord': 'Tủy sống',
  'Sciatic nerve': 'Dây thần kinh tọa (thần kinh ngồi)',
  'Femoral nerve': 'Dây thần kinh đùi',
  'Radial nerve': 'Dây thần kinh quay',
  'Ulnar nerve': 'Dây thần kinh trụ',
  'Median nerve': 'Dây thần kinh giữa',
  'Vagus nerve': 'Dây thần kinh phế vị (TK X)',
  'Trigeminal nerve': 'Dây thần kinh sinh ba (TK V)',
  'Facial nerve': 'Dây thần kinh mặt (TK VII)',
  'Olfactory nerve': 'Dây thần kinh khứu giác (TK I)',

  // --- HEAD & FACE MUSCLES, FASCIAS & APONEUROSES ---
  'Epicranial aponeurosis': 'Cân trên sọ',
  'Galea aponeurotica': 'Cân trên sọ',
  'Occipitofrontalis': 'Cơ chẩm trán',
  'Occipitofrontalis muscle': 'Cơ chẩm trán',
  'Frontalis': 'Cơ trán (Bụng trán cơ chẩm trán)',
  'Occipitalis': 'Cơ chẩm (Bụng chẩm cơ chẩm trán)',
  'Frontal belly of occipitofrontalis': 'Bụng trán (Cơ chẩm trán)',
  'Occipital belly of occipitofrontalis': 'Bụng chẩm (Cơ chẩm trán)',
  'Temporoparietalis': 'Cơ thái dương đỉnh',
  'Temporoparietal fascia': 'Mạc thái dương đỉnh',
  'Temporal fascia': 'Mạc thái dương',
  'Platysma': 'Cơ bám da cổ',
  'Orbicularis oculi': 'Cơ vòng mắt',
  'Orbicularis oris': 'Cơ vòng miệng',
  'Buccinator': 'Cơ mút',
  'Zygomaticus major': 'Cơ gò má lớn',
  'Zygomaticus minor': 'Cơ gò má bé',
  'Risorius': 'Cơ cười',
  'Levator labii superioris': 'Cơ nâng môi trên',
  'Depressor labii inferioris': 'Cơ hạ môi dưới',
  'Depressor anguli oris': 'Cơ hạ góc miệng',
  'Mentalis': 'Cơ cằm',
  'Corrugator supercilii': 'Cơ cau mày',
  'Procerus': 'Cơ tháp',
  'Nasalis': 'Cơ mũi',
  'Medial pterygoid': 'Cơ chân bướm trong',
  'Lateral pterygoid': 'Cơ chân bướm ngoài',

  // --- FASCIAS, LIGAMENTS & TRUNK ---
  'Thoracolumbar fascia': 'Mạc ngực thắt lưng',
  'Fascia lata': 'Mạc rộng đùi',
  'Iliotibial tract': 'Dải chậu chày',
  'Plantar aponeurosis': 'Cân gan chân',
  'Palmar aponeurosis': 'Cân gan tay',
  'Linea alba': 'Đường trắng giữa bụng',
  'Rectus sheath': 'Bao cơ thẳng bụng',
  'Inguinal ligament': 'Dây chằng bẹn',
  'Flexor retinaculum': 'Hãm gân gấp',
  'Extensor retinaculum': 'Hãm gân duỗi',
  'Cervical vertebra': 'Đốt sống cổ',
  'Thoracic vertebra': 'Đốt sống ngực',
  'Lumbar vertebra': 'Đốt sống thắt lưng',
  'Intervertebral disc': 'Đĩa đệm gian đốt sống',
  'Right lymphatic duct': 'Ống bạch huyết phải',
  'Cisterna chyli': 'Bể dưỡng chấp',

  // --- JOINTS, LIGAMENTS & ARTICULAR STRUCTURES ---
  'Acetabular labrum': 'Viền ổ cối (Khớp háng)',
  'Acromioclavicular ligament': 'Dây chằng cùng vai đòn',
  'Annular ligament of radius': 'Dây chằng vòng quay',
  'Anterior cruciate ligament': 'Dây chằng chéo trước (ACL)',
  'Anterior ligament of fibular head': 'Dây chằng trước chỏm mác',
  'Anterior longitudinal ligament': 'Dây chằng dọc trước (Cột sống)',
  'Anterior meniscotibial ligament (Lateral meniscus)': 'Dây chằng chêm chày trước (sụn chêm ngoài)',
  'Anterior meniscotibial ligament (Medial meniscus)': 'Dây chằng chêm chày trước (sụn chêm trong)',
  'Anterior sacro-iliac ligament': 'Dây chằng cùng chậu trước',
  'Anterior sternoclavicular ligament': 'Dây chằng ức đòn trước',
  'Anterior talocalcaneal ligament': 'Dây chằng sên gót trước',
  'Anterior tibiofibular ligament': 'Dây chằng chày mác trước',
  'Arcuate popliteal ligament': 'Dây chằng khoeo hình cung',
  'Articular capsule of acromioclavicular joint': 'Bao khớp cùng vai đòn',
  'Articular capsule of elbow joint': 'Bao khớp khuỷu',
  'Articular capsule of glenohumeral joint': 'Bao khớp vai (ổ chảo cánh tay)',
  'Articular capsule of hip joint': 'Bao khớp háng',
  'Articular capsule of interphalangeal joint of great toe': 'Bao khớp gian đốt ngón chân cái',
  'Articular capsule of knee joint': 'Bao khớp gối',
  'Articular capsule of radiocarpal joint': 'Bao khớp quay cổ tay',
  'Articular capsule of sternoclavicular joint': 'Bao khớp ức đòn',
  'Articular capsule of superior tibiofibular joint': 'Bao khớp chày mác trên',
  'Articular capsule of temporomandibular joint': 'Bao khớp thái dương hàm',
  'Articular capsules of distal interphalangeal joints': 'Bao các khớp gian đốt ngón xa (tay)',
  'Articular capsules of distal interphalangeal joints of foot': 'Bao các khớp gian đốt ngón xa (chân)',
  'Articular capsules of metacarpophalangeal joints': 'Bao các khớp bàn ngón tay',
  'Articular capsules of metatarsophalangeal joints': 'Bao các khớp bàn ngón chân',
  'Articular capsules of proximal interphalangeal joints': 'Bao các khớp gian đốt ngón gần (tay)',
  'Articular capsules of proximal interphalangeal joints of foot': 'Bao các khớp gian đốt ngón gần (chân)',
  'Articular disc of acromioclavicular joint': 'Đĩa khớp cùng vai đòn',
  'Articular disc of distal radio-ulnar joint': 'Đĩa khớp quay trụ dưới',
  'Articular disc of sternoclavicular joint': 'Đĩa khớp ức đòn',
  'Articular disc of temporomandibular joint': 'Đĩa khớp thái dương hàm',
  'Calcaneocuboid ligament': 'Dây chằng gót hộp',
  'Calcaneonavicular ligament': 'Dây chằng gót thuyền',
  'Collateral interphalangeal ligaments of foot': 'Các dây chằng bên khớp gian đốt ngón chân',
  'Collateral interphalangeal ligaments of hand': 'Các dây chằng bên khớp gian đốt ngón tay',
  'Collateral metacarpophalangeal ligaments': 'Các dây chằng bên khớp bàn ngón tay',
  'Collateral metatarsophalangeal ligaments': 'Các dây chằng bên khớp bàn ngón chân',
  'Conoid ligament': 'Dây chằng nón',
  'Coracohumeral ligament': 'Dây chằng quạ cánh tay',
  'Costotransverse ligament': 'Dây chằng sườn mỏm ngang',
  'Cricopharyngeal ligament': 'Dây chằng nhẫn hầu',
  'Cuneocuboid interosseous ligament': 'Dây chằng chêm hộp gian cốt',
  'Cuneometatarsal interosseous ligaments': 'Các dây chằng chêm bàn chân gian cốt',
  'Deep part of tibial collateral ligament': 'Phần sâu dây chằng bên chày',
  'Deep transverse metacarpal ligament': 'Dây chằng ngang bàn tay sâu',
  'Deep transverse metatarsal ligament': 'Dây chằng ngang bàn chân sâu',
  'Descending part of iliofemoral ligament': 'Bó dọc dây chằng chậu đùi',
  'Dorsal carpometacarpal ligaments': 'Các dây chằng cổ bàn tay mu tay',
  'Dorsal cuneonavicular ligaments': 'Các dây chằng chêm thuyền mu chân',
  'Dorsal intercarpal ligaments': 'Các dây chằng gian cổ tay mu tay',
  'Dorsal intercuneiform ligaments': 'Các dây chằng gian chêm mu chân',
  'Dorsal metacarpal ligaments': 'Các dây chằng gian đốt bàn tay mu tay',
  'Dorsal metatarsal ligaments': 'Các dây chằng bàn chân mu chân',
  'Dorsal radiocarpal ligament': 'Dây chằng quay cổ tay mu tay',
  'Dorsal scaphotriquetral ligament': 'Dây chằng thuyền tháp mu tay',
  'Dorsal tarsometatarsal ligaments': 'Các dây chằng cổ chân - bàn chân mu chân',
  'Dorsal ulnocarpal ligament': 'Dây chằng trụ cổ tay mu tay',
  'External intercostal membrane': 'Màng gian sườn ngoài',
  'Fibular collateral ligament': 'Dây chằng bên mác (LCL)',
  'Frenula capsulae': 'Hãm bao khớp vai',
  'Glenoid labrum': 'Viền ổ chảo (Khớp vai)',
  'Iliolumbar ligament': 'Dây chằng chậu thắt lưng',
  'Inferior glenohumeral ligament': 'Dây chằng ổ chảo cánh tay dưới',
  'Inferior pubic ligament': 'Dây chằng mu dưới',
  'Infrapatellar fat pad': 'Thể mỡ dưới xương bánh chè (Hoffa)',
  'Interclavicular ligament': 'Dây chằng gian đòn',
  'Intercornual ligament': 'Dây chằng gian sừng',
  'Intercuneiform interosseous ligaments': 'Các dây chằng gian chêm gian cốt',
  'Internal intercostal membrane': 'Màng gian sườn trong',
  'Interosseous membrane of forearm': 'Màng gian cốt cẳng tay',
  'Interosseous membrane of leg': 'Màng gian cốt cẳng chân',
  'Interosseous metacarpal ligaments': 'Các dây chằng bàn tay gian cốt',
  'Interosseous sacro-iliac ligament': 'Dây chằng cùng chậu gian cốt',
  'Interpubic disc': 'Đĩa gian mu',
  'Intersesamoid ligament': 'Dây chằng gian vừng',
  'Interspinous ligaments': 'Dây chằng gian gai (Cột sống)',
  'Intra-articular ligament of head of rib': 'Dây chằng nội khớp chỏm sườn',
  'Ischiofemoral ligament': 'Dây chằng ngồi đùi',
  'Lateral meniscus': 'Sụn chêm ngoài (Khớp gối)',
  'Lateral talocalcaneal ligament': 'Dây chằng sên gót ngoài',
  'Lateral temporomandibular ligament': 'Dây chằng thái dương hàm ngoài',
  'Lateral thyrohyoid ligament': 'Dây chằng giáp móng bên',
  'Ligament of head of femur': 'Dây chằng chỏm xương đùi',
  'Ligamenta flava': 'Dây chằng vàng (Cột sống)',
  'Long plantar ligament': 'Dây chằng gan chân dài',
  'Medial meniscus': 'Sụn chêm trong (Khớp gối)',
  'Medial talocalcaneal ligament': 'Dây chằng sên gót trong',
  'Median cricothyroid ligament': 'Dây chằng nhẫn giáp giữa',
  'Median thyrohyoid ligament': 'Dây chằng giáp móng giữa',
  'Meniscopatellar ligament': 'Dây chằng chêm bánh chè',
  'Metatarsal interosseous ligaments': 'Các dây chằng bàn chân gian cốt',
  'Middle glenohumeral ligament': 'Dây chằng ổ chảo cánh tay giữa',
  'Nuchal ligament': 'Dây chằng gáy',
  'Oblique popliteal ligament': 'Dây chằng khoeo chéo',
  'Obturator membrane': 'Màng bịt (Khung chậu)',
  'Palmar carpometacarpal ligaments': 'Các dây chằng cổ bàn tay gan tay',
  'Palmar interphalangeal ligaments': 'Các dây chằng gian đốt ngón gan tay',
  'Palmar metacarpal ligaments': 'Các dây chằng gian đốt bàn tay gan tay',
  'Palmar radio-ulnar ligament': 'Dây chằng quay trụ gan tay',
  'Palmar scaphotriquetral ligament': 'Dây chằng thuyền tháp gan tay',
  'Pisotriquetral ligament': 'Dây chằng đậu tháp',
  'Plantar calcaneocuboid ligament': 'Dây chằng gót hộp gan chân',
  'Plantar cuneocuboid ligament': 'Dây chằng chêm hộp gan chân',
  'Plantar cuneonavicular ligaments': 'Các dây chằng chêm thuyền gan chân',
  'Plantar intercuneiform ligaments': 'Các dây chằng gian chêm gan chân',
  'Plantar interphalangeal ligaments': 'Các dây chằng gian đốt ngón chân gan chân',
  'Plantar metatarsal ligaments': 'Các dây chằng bàn chân gan chân',
  'Plantar metatarsophalangeal ligaments': 'Các dây chằng bàn ngón chân gan chân',
  'Plantar tarsometatarsal ligaments': 'Các dây chằng cổ chân - bàn chân gan chân',
  'Popliteofibular ligament': 'Dây chằng khoeo mác',
  'Posterior cruciate ligament': 'Dây chằng chéo sau (PCL)',
  'Posterior ligament of fibular head': 'Dây chằng sau chỏm mác',
  'Posterior longitudinal ligament': 'Dây chằng dọc sau (Cột sống)',
  'Posterior meniscotibial ligament (Lateral meniscus)': 'Dây chằng chêm chày sau (sụn chêm ngoài)',
  'Posterior meniscotibial ligament (Medial meniscus)': 'Dây chằng chêm chày sau (sụn chêm trong)',
  'Posterior sacro-iliac ligament': 'Dây chằng cùng chậu sau',
  'Posterior sternoclavicular ligament': 'Dây chằng ức đòn sau',
  'Posterior talocalcaneal ligament': 'Dây chằng sên gót sau',
  'Posterior tibiofibular ligament': 'Dây chằng chày mác sau',
  'Posterior tibiotalar ligament': 'Dây chằng chày sên sau',
  'Pubic symphysis': 'Khớp mu (Bán động)',
  'Pubofemoral ligament': 'Dây chằng mu đùi',
  'Quadrangular membrane': 'Màng tứ giác thanh quản',
  'Radial collateral ligament': 'Dây chằng bên quay (Khủy tay)',
  'Radial collateral ligament of wrist joint': 'Dây chằng bên quay cổ tay',
  'Radiate carpal ligament': 'Dây chằng cổ tay tỏa tia',
  'Radiate ligament of head of rib': 'Dây chằng tỏa tia chỏm sườn',
  'Radioscaphocapitate ligament': 'Dây chằng quay - thuyền - cả',
  'Sacrococcygeal symphysis': 'Khớp cùng cụt',
  'Sacrospinous ligament': 'Dây chằng cùng gai ngồi',
  'Sacrotuberous ligament': 'Dây chằng cùng ụ ngồi',
  'Scaphotrapeziotrapezoidal ligament': 'Dây chằng thuyền - thang - thê',
  'Sphenomandibular ligament': 'Dây chằng bướm hàm',
  'Stylohyoid ligament': 'Dây chằng trâm móng',
  'Stylomandibular ligament': 'Dây chằng trâm hàm',
  'Superficial part of tibial collateral ligament': 'Phần nông dây chằng bên chày (MCL)',
  'Superior glenohumeral ligament': 'Dây chằng ổ chảo cánh tay trên',
  'Superior pubic ligament': 'Dây chằng mu trên',
  'Supraspinous ligament': 'Dây chằng trên gai (Cột sống)',
  'Talocalcaneal interosseous ligament': 'Dây chằng sên gót gian cốt',
  'Talonavicular ligament': 'Dây chằng sên thuyền',
  'Tibiocalcaneal ligament': 'Dây chằng chày gót',
  'Tibionavicular ligament': 'Dây chằng chày thuyền',
  'Transverse acetabular ligament': 'Dây chằng ngang ổ cối',
  'Transverse humeral ligament': 'Dây chằng ngang cánh tay',
  'Transverse ligament of knee': 'Dây chằng ngang gối',
  'Transverse part of iliofemoral ligament': 'Bó ngang dây chằng chậu đùi',
  'Transverse tibiofibular ligament': 'Dây chằng chày mác ngang',
  'Trapezoid ligament': 'Dây chằng thang',
  'Triquetrocapitate ligament': 'Dây chằng tháp cả',
  'Triradiate cartilage': 'Sụn ba chẽ (Khung chậu)',
  'Ulnar collateral ligament': 'Dây chằng bên trụ (Khuỷu tay)',
  'Ulnar collateral ligament of wrist joint': 'Dây chằng bên trụ cổ tay',
  'Ulnocapitate ligament': 'Dây chằng trụ cả',
  'Ulnolunate ligament': 'Dây chằng trụ nguyệt',
  'Ulnotriquetral ligament': 'Dây chằng trụ tháp',
  'Intervertebral disc C2-C3': 'Đĩa đệm C2-C3',
  'Intervertebral disc C3-C4': 'Đĩa đệm C3-C4',
  'Intervertebral disc C4-C5': 'Đĩa đệm C4-C5',
  'Intervertebral disc C5-C6': 'Đĩa đệm C5-C6',
  'Intervertebral disc C6-C7': 'Đĩa đệm C6-C7',
  'Intervertebral disc C7-T1': 'Đĩa đệm C7-T1',
  'Intervertebral disc L1-L2': 'Đĩa đệm L1-L2',
  'Intervertebral disc L2-L3': 'Đĩa đệm L2-L3',
  'Intervertebral disc L3-L4': 'Đĩa đệm L3-L4',
  'Intervertebral disc L4-L5': 'Đĩa đệm L4-L5',
  'Intervertebral disc L5-S1': 'Đĩa đệm L5-S1',
  'Intervertebral disc T1-T2': 'Đĩa đệm T1-T2',
  'Intervertebral disc T10-T11': 'Đĩa đệm T10-T11',
  'Intervertebral disc T11-T12': 'Đĩa đệm T11-T12',
  'Intervertebral disc T12-L1': 'Đĩa đệm T12-L1',
  'Intervertebral disc T2-T3': 'Đĩa đệm T2-T3',
  'Intervertebral disc T3-T4': 'Đĩa đệm T3-T4',
  'Intervertebral disc T4-T5': 'Đĩa đệm T4-T5',
  'Intervertebral disc T5-T6': 'Đĩa đệm T5-T6',
  'Intervertebral disc T6-T7': 'Đĩa đệm T6-T7',
  'Intervertebral disc T7-T8': 'Đĩa đệm T7-T8',
  'Intervertebral disc T8-T9': 'Đĩa đệm T8-T9',
  'Intervertebral disc T9-T10': 'Đĩa đệm T9-T10',
  'Nucleus pulposus C2-C3': 'Nhân nhầy đĩa đệm C2-C3',
  'Nucleus pulposus C3-C4': 'Nhân nhầy đĩa đệm C3-C4',
  'Nucleus pulposus C4-C5': 'Nhân nhầy đĩa đệm C4-C5',
  'Nucleus pulposus C5-C6': 'Nhân nhầy đĩa đệm C5-C6',
  'Nucleus pulposus C6-C7': 'Nhân nhầy đĩa đệm C6-C7',
  'Nucleus pulposus C7-T1': 'Nhân nhầy đĩa đệm C7-T1',
  'Nucleus pulposus L1-L2': 'Nhân nhầy đĩa đệm L1-L2',
  'Nucleus pulposus L2-L3': 'Nhân nhầy đĩa đệm L2-L3',
  'Nucleus pulposus L3-L4': 'Nhân nhầy đĩa đệm L3-L4',
  'Nucleus pulposus L4-L5': 'Nhân nhầy đĩa đệm L4-L5',
  'Nucleus pulposus L5-S1': 'Nhân nhầy đĩa đệm L5-S1',
  'Nucleus pulposus T1-T2': 'Nhân nhầy đĩa đệm T1-T2',
  'Nucleus pulposus T10-T11': 'Nhân nhầy đĩa đệm T10-T11',
  'Nucleus pulposus T11-T12': 'Nhân nhầy đĩa đệm T11-T12',
  'Nucleus pulposus T12-L1': 'Nhân nhầy đĩa đệm T12-L1',
  'Nucleus pulposus T2-T3': 'Nhân nhầy đĩa đệm T2-T3',
  'Nucleus pulposus T3-T4': 'Nhân nhầy đĩa đệm T3-T4',
  'Nucleus pulposus T4-T5': 'Nhân nhầy đĩa đệm T4-T5',
  'Nucleus pulposus T5-T6': 'Nhân nhầy đĩa đệm T5-T6',
  'Nucleus pulposus T6-T7': 'Nhân nhầy đĩa đệm T6-T7',
  'Nucleus pulposus T7-T8': 'Nhân nhầy đĩa đệm T7-T8',
  'Nucleus pulposus T8-T9': 'Nhân nhầy đĩa đệm T8-T9',
  'Nucleus pulposus T9-T10': 'Nhân nhầy đĩa đệm T9-T10',

  // Corrupted mesh name replacements
  'Microvascular anastomosis': 'Mạng mao mạch vi tuần hoàn (Vi mạch)',
  'Microvascular plexus': 'Đám rối vi mạch mao mạch',

  // Ear ossicles & middle ear
  'Incus': 'Xương đe (Tai giữa)',
  'Malleus': 'Xương búa (Tai giữa)',
  'Stapes': 'Xương bàn đạp (Tai giữa)',

  // Permanent teeth
  'Lower canine': 'Răng nanh hàm dưới',
  'Upper canine': 'Răng nanh hàm trên',
  'Lower first molar tooth': 'Răng cối lớn 1 hàm dưới (Răng 6)',
  'Upper first molar tooth': 'Răng cối lớn 1 hàm trên (Răng 6)',
  'Lower second molar tooth': 'Răng cối lớn 2 hàm dưới (Răng 7)',
  'Upper second molar tooth': 'Răng cối lớn 2 hàm trên (Răng 7)',
  'Lower third molar tooth': 'Răng khôn hàm dưới (Răng 8)',
  'Upper third molar tooth': 'Răng khôn hàm trên (Răng 8)',
  'Lower first premolar': 'Răng tiền cối 1 hàm dưới (Răng 4)',
  'Upper first premolar': 'Răng tiền cối 1 hàm trên (Răng 4)',
  'Lower second premolar': 'Răng tiền cối 2 hàm dưới (Răng 5)',
  'Upper second premolar': 'Răng tiền cối 2 hàm trên (Răng 5)',
  'Lower medial incisor': 'Răng cửa giữa hàm dưới (Răng 1)',
  'Upper medial incisor': 'Răng cửa giữa hàm trên (Răng 1)',
  'Lower lateral incisor': 'Răng cửa bên hàm dưới (Răng 2)',
  'Upper lateral incisor': 'Răng cửa bên hàm trên (Răng 2)',

  // Visceral & Genitourinary
  'Ductus deferens': 'Ống dẫn tinh',
  'Ejaculatory duct': 'Ống phóng tinh',
  'Seminal gland': 'Túi tinh (Tuyến tinh)',
  'Renal pelvis': 'Bể thận',
  'Major calyx': 'Đài thận lớn',
  'Minor calyx': 'Đài thận bé',
  'Parotid gland': 'Tuyến mang tai',
  'Submandibular gland': 'Tuyến dưới hàm',
  'Sublingual gland': 'Tuyến dưới lưỡi',
  'Sublingual caruncle': 'Cục dưới lưỡi',
  'Parotid duct': 'Ống tuyến mang tai (Ống Stenon)',
  'Submandibular duct': 'Ống tuyến dưới hàm (Ống Wharton)',
  'Lesser sublingual duct': 'Ống tuyến dưới lưỡi nhỏ',
  'Major sublingual duct': 'Ống tuyến dưới lưỡi lớn',
  'Superior parathyroid gland': 'Tuyến cận giáp trên',
  'Inferior parathyroid gland': 'Tuyến cận giáp dưới',
  'Intermediate bronchus': 'Phế quản trung gian',
  'Middle lobar bronchus': 'Phế quản thùy giữa',
  'Deep lingual artery': 'Động mạch lưỡi sâu',

  // Eye structures
  'Cornea': 'Giác mạc (Mắt)',
  'Iris': 'Mống mắt (Tròng đen)',
  'Sclera': 'Củng mạc (Tròng trắng)',
  'Retina': 'Võng mạc (Màng thị giác)',
  'Anterior chamber of eyeball': 'Tiền phòng nhãn cầu (Mắt)',
  'Posterior chamber of eyeball': 'Hậu phòng nhãn cầu (Mắt)',
  'Vitreous body': 'Thủy tinh thể (Thể dịch kính)',
  'Ciliary body': 'Thể mi (Mắt)',
  'Lens': 'Thể thủy tinh (Thấu kính mắt)',
  'Lacrimal gland': 'Tuyến lệ',
  'Lacrimal sac': 'Túi lệ',
  'Nasolacrimal duct': 'Ống lệ mũi',
  'Lacrimal canaliculus': 'Tiểu quản lệ',
  'Ampulla of lacrimal canaliculus': 'Bóng tiểu quản lệ',

  // Tendons & Fascia
  'Calcaneal tendon': 'Gân gót (Gân Achilles)',
  'Achilles tendon': 'Gân gót (Gân Achilles)',
  'Intermediate tendon of digastric muscle': 'Gân trung gian cơ hai bụng',
  'Epicranial aponeurosis': 'Cân trên sọ (Cân đỉnh)',
  'Clavipectoral fascia': 'Mạc quạ đòn (Mạc ngực đòn)',
  'Pectoral fascia': 'Mạc ngực',

  // Cranial bones
  'Frontal bone': 'Xương trán (Xương sọ)',
  'Parietal bone': 'Xương đỉnh (Xương sọ)',
  'Occipital bone': 'Xương chẩm (Xương sọ)',
  'Temporal bone': 'Xương thái dương (Xương sọ)',
  'Sphenoid bone': 'Xương bướm (Nền sọ)',
  'Ethmoid bone': 'Xương sàng (Nền sọ)',
  'Sinus of frontal bone': 'Xoang trán',

  // Brain structures & Nuclei
  'Amygdaloid body': 'Thể hạnh nhân (Não)',
  'Hippocampus': 'Hồi hải mã',
  'Corpus callosum': 'Thể chai',
  'Fornix': 'Vòm não',
  'Thalamus': 'Đồi thị',
  'Hypothalamus': 'Vùng dưới đồi',
  'Caudate nucleus': 'Nhân đuôi',
  'Putamen': 'Nhân bèo (Bèo sẫm)',
  'Globus pallidus': 'Cầu nhạt',
  'Substantia nigra': 'Chất đen',
  'Red nucleus': 'Nhân đỏ',
  'Cerebellum': 'Tiểu não',
  'Pons': 'Cầu não',
  'Medulla oblongata': 'Hành não',

  // Muscular missing
  'External intercostal muscles': 'Các cơ gian sườn ngoài',
  'Internal intercostal muscles': 'Các cơ gian sườn trong',
  'Innermost intercostal muscles': 'Các cơ gian sườn trong cùng',
  'Dorsal interossei muscles of foot': 'Các cơ gian cốt mu chân',
  'Dorsal interossei muscles of hand': 'Các cơ gian cốt mu tay',
  'Lumbrical muscles of foot': 'Các cơ giun bàn chân',
  'Lumbrical muscles of hand': 'Các cơ giun bàn tay',
  'Bucinator': 'Cơ mút',
  'External anal sphincter': 'Cơ thắt ngoài hậu môn',
  'Inferior pharyngeal constrictor': 'Cơ siết họng dưới',
  'Inferior tarsus': 'Sụn mi dưới',
  'Superior tarsus': 'Sụn mi trên'
};

// Morphological glossary for compound terms
const PATTERNS = [
  // Joints & Ligaments Compound Patterns
  { match: /\bArticular capsules of (.*)\b/i, replace: (m, p) => `Các bao khớp ${getVietnameseName(p)}` },
  { match: /\bArticular capsule of (.*)\b/i, replace: (m, p) => `Bao khớp ${getVietnameseName(p)}` },
  { match: /\bArticular disc of (.*)\b/i, replace: (m, p) => `Đĩa khớp ${getVietnameseName(p)}` },
  { match: /\bIntervertebral disc (.*)\b/i, replace: (m, p) => `Đĩa đệm ${p}` },
  { match: /\bNucleus pulposus (.*)\b/i, replace: (m, p) => `Nhân nhầy đĩa đệm ${p}` },
  { match: /\b(Anterior|Posterior) cruciate ligament\b/i, replace: (m, p) => `Dây chằng chéo ${/anterior/i.test(p) ? "trước (ACL)" : "sau (PCL)"}` },
  { match: /\bCollateral (.*) ligaments of (hand|foot)\b/i, replace: (m, p1, p2) => `Các dây chằng bên ${getVietnameseName(p1)} (${/hand/i.test(p2) ? "tay" : "chân"})` },
  { match: /\bCollateral (.*) ligaments\b/i, replace: (m, p) => `Các dây chằng bên ${getVietnameseName(p)}` },
  { match: /\bligaments of (.*)\b/i, replace: (m, p) => `Các dây chằng ${getVietnameseName(p)}` },
  { match: /\bligament of (.*)\b/i, replace: (m, p) => `Dây chằng ${getVietnameseName(p)}` },
  { match: /\bcostal cartilage of (.*) rib\b/i, replace: (m, p) => `Sụn sườn ${translateNumber(p)}` },
  { match: /\bcostal cartilage\b/i, replace: 'Sụn sườn' },
  { match: /\bfirst rib\b/i, replace: 'Xương sườn 1' },
  { match: /\bsecond rib\b/i, replace: 'Xương sườn 2' },
  { match: /\bthird rib\b/i, replace: 'Xương sườn 3' },
  { match: /\bfourth rib\b/i, replace: 'Xương sườn 4' },
  { match: /\bfifth rib\b/i, replace: 'Xương sườn 5' },
  { match: /\bsixth rib\b/i, replace: 'Xương sườn 6' },
  { match: /\bseventh rib\b/i, replace: 'Xương sườn 7' },
  { match: /\beighth rib\b/i, replace: 'Xương sườn 8' },
  { match: /\bninth rib\b/i, replace: 'Xương sườn 9' },
  { match: /\btenth rib\b/i, replace: 'Xương sườn 10' },
  { match: /\beleventh rib\b/i, replace: 'Xương sườn 11' },
  { match: /\btwelfth rib\b/i, replace: 'Xương sườn 12' },
  { match: /\bproximal phalanx\b/i, replace: 'Đốt ngón gần' },
  { match: /\bmiddle phalanx\b/i, replace: 'Đốt ngón giữa' },
  { match: /\bdistal phalanx\b/i, replace: 'Đốt ngón xa' },
  { match: /\bintervertebral disc\b/i, replace: 'Đĩa đệm gian đốt sống' },
  { match: /\bcervical vertebra\b/i, replace: 'Đốt sống cổ' },
  { match: /\bthoracic vertebra\b/i, replace: 'Đốt sống ngực' },
  { match: /\blumbar vertebra\b/i, replace: 'Đốt sống thắt lưng' },
  { match: /\bsacral vertebra\b/i, replace: 'Đốt sống cùng' },
  { match: /\bvertebra\b/i, replace: 'Đốt sống' },
  { match: /\bepicranial aponeurosis\b/i, replace: 'Cân trên sọ' },
  { match: /\bgalea aponeurotica\b/i, replace: 'Cân trên sọ' },
  { match: /\btemporoparietal fascia\b/i, replace: 'Mạc thái dương đỉnh' },
  { match: /\btemporal fascia\b/i, replace: 'Mạc thái dương' },
  { match: /\bthoracolumbar fascia\b/i, replace: 'Mạc ngực thắt lưng' },
  { match: /\bfascia lata\b/i, replace: 'Mạc rộng đùi' },
  { match: /\bplantar aponeurosis\b/i, replace: 'Cân gan chân' },
  { match: /\bpalmar aponeurosis\b/i, replace: 'Cân gan tay' },
  { match: /\bsuperficial part of (.*)\b/i, replace: (m, p) => `Phần nông ${getVietnameseName(p)}` },
  { match: /\bdeep part of (.*)\b/i, replace: (m, p) => `Phần sâu ${getVietnameseName(p)}` },
  { match: /\bsuperficial layer of (.*)\b/i, replace: (m, p) => `Lớp nông ${getVietnameseName(p)}` },
  { match: /\bdeep layer of (.*)\b/i, replace: (m, p) => `Lớp sâu ${getVietnameseName(p)}` },
  { match: /\blong head of (.*)\b/i, replace: (m, p) => `Đầu dài ${getVietnameseName(p)}` },
  { match: /\bshort head of (.*)\b/i, replace: (m, p) => `Đầu ngắn ${getVietnameseName(p)}` },
  { match: /\blateral head of (.*)\b/i, replace: (m, p) => `Đầu ngoài ${getVietnameseName(p)}` },
  { match: /\bmedial head of (.*)\b/i, replace: (m, p) => `Đầu trong ${getVietnameseName(p)}` },
  { match: /\bpart of (.*)\b/i, replace: (m, p) => `Phần ${getVietnameseName(p)}` },
  { match: /\blayer of (.*)\b/i, replace: (m, p) => `Lớp ${getVietnameseName(p)}` },
  { match: /\bhead of (.*)\b/i, replace: (m, p) => `Đầu ${getVietnameseName(p)}` },
  { match: /\bsubtendinous bursa of (.*)\b/i, replace: (m, p) => `Túi thanh mạc dưới gân ${getVietnameseName(p)}` },
  { match: /\bbursa of (.*)\b/i, replace: (m, p) => `Túi thanh mạc ${getVietnameseName(p)}` },
  { match: /\bsheath of (.*)\b/i, replace: (m, p) => `Bao ${getVietnameseName(p)}` },
  { match: /\baponeurosis of (.*)\b/i, replace: (m, p) => `Cân ${getVietnameseName(p)}` },
  { match: /\baponeurosis\b/i, replace: 'Cân cơ' },
  { match: /\bfascia of (.*)\b/i, replace: (m, p) => `Mạc ${getVietnameseName(p)}` },
  { match: /\bfascia\b/i, replace: 'Mạc' },
  { match: /\bretinaculum\b/i, replace: 'Hãm gân' },
  { match: /\blymph node(s)? of (.*)\b/i, replace: (m, p1, p2) => `Hạch bạch huyết ${getVietnameseName(p2)}` },
  { match: /\blymph node(s)?\b/i, replace: 'Hạch bạch huyết' },
  { match: /\blymphatic vessel(s)?\b/i, replace: 'Mạch bạch huyết' },
  { match: /\bcartilage\b/i, replace: 'Sụn' },
  { match: /\badductor longus\b/i, replace: 'Cơ khép dài' },
  { match: /\badductor magnus\b/i, replace: 'Cơ khép lớn' },
  { match: /\badductor brevis\b/i, replace: 'Cơ khép ngắn' },
  { match: /\badductor\b/i, replace: 'Cơ khép' },
  { match: /\babductor hallucis\b/i, replace: 'Cơ dạng ngón cái' },
  { match: /\babductor pollicis\b/i, replace: 'Cơ dạng ngón cái' },
  { match: /\babductor digiti minimi\b/i, replace: 'Cơ dạng ngón út' },
  { match: /\babductor\b/i, replace: 'Cơ dạng' },
  { match: /\bextensor digitorum\b/i, replace: 'Cơ duỗi các ngón' },
  { match: /\bextensor\b/i, replace: 'Cơ duỗi' },
  { match: /\bflexor digitorum\b/i, replace: 'Cơ gấp các ngón' },
  { match: /\bflexor\b/i, replace: 'Cơ gấp' },
  { match: /\bpronator teres\b/i, replace: 'Cơ sấp tròn' },
  { match: /\bpronator quadratus\b/i, replace: 'Cơ sấp vuông' },
  { match: /\bpronator\b/i, replace: 'Cơ sấp' },
  { match: /\bsupinator\b/i, replace: 'Cơ ngửa' },
  { match: /\blevator scapulae\b/i, replace: 'Cơ nâng vai' },
  { match: /\blevator\b/i, replace: 'Cơ nâng' },
  { match: /\bdepressor\b/i, replace: 'Cơ hạ' },

  // Lymphatic nodes
  { match: /^(.*)\s+lymph\s+nodes?$/i, replace: (m, p) => `Các hạch bạch huyết ${getVietnameseName(p)}` },
  { match: /^(.*)\s+nodes?$/i, replace: (m, p) => `Các hạch ${getVietnameseName(p)}` },
  // Vascular plurals & singulars
  { match: /^(.*)\s+veins$/i, replace: (m, p) => `Các tĩnh mạch ${getVietnameseName(p)}` },
  { match: /^(.*)\s+vein$/i, replace: (m, p) => `Tĩnh mạch ${getVietnameseName(p)}` },
  { match: /^(.*)\s+arteries$/i, replace: (m, p) => `Các động mạch ${getVietnameseName(p)}` },
  { match: /^(.*)\s+artery$/i, replace: (m, p) => `Động mạch ${getVietnameseName(p)}` },
  // Nervous system
  { match: /^(.*)\s+nerves$/i, replace: (m, p) => `Các dây thần kinh ${getVietnameseName(p)}` },
  { match: /^(.*)\s+nerve$/i, replace: (m, p) => `Dây thần kinh ${getVietnameseName(p)}` },
  { match: /^(.*)\s+plexus$/i, replace: (m, p) => `Đám rối ${getVietnameseName(p)}` },
  { match: /^(.*)\s+ganglion$/i, replace: (m, p) => `Hạch thần kinh ${getVietnameseName(p)}` },
  { match: /^(.*)\s+nucleus$/i, replace: (m, p) => `Nhân ${getVietnameseName(p)}` },
  { match: /^(.*)\s+tract$/i, replace: (m, p) => `Dải ${getVietnameseName(p)}` },
  { match: /^(.*)\s+fasciculus$/i, replace: (m, p) => `Bó ${getVietnameseName(p)}` },
  { match: /^(.*)\s+sulcus$/i, replace: (m, p) => `Rãnh ${getVietnameseName(p)}` },
  { match: /^(.*)\s+gyrus$/i, replace: (m, p) => `Hồi ${getVietnameseName(p)}` },
  { match: /^(.*)\s+lobule$/i, replace: (m, p) => `Tiểu thùy ${getVietnameseName(p)}` },
  { match: /^(.*)\s+pole$/i, replace: (m, p) => `Cực ${getVietnameseName(p)}` },
  // Muscles
  { match: /^(.*)\s+muscles$/i, replace: (m, p) => `Các cơ ${getVietnameseName(p)}` },
  { match: /^(.*)\s+muscle$/i, replace: (m, p) => `Cơ ${getVietnameseName(p)}` },
  // Divisions & Trunks
  { match: /^Anterior division of (.*)$/i, replace: (m, p) => `Ngành trước của ${getVietnameseName(p)}` },
  { match: /^Posterior division of (.*)$/i, replace: (m, p) => `Ngành sau của ${getVietnameseName(p)}` },
  { match: /^(.*)\s+trunk of brachial plexus$/i, replace: (m, p) => `thân ${getVietnameseName(p)} đám rối cánh tay` },
  // Branches
  { match: /^(.*)\s+branches of (.*)$/i, replace: (m, p1, p2) => `Các nhánh ${getVietnameseName(p1)} của ${getVietnameseName(p2)}` },
  { match: /^(.*)\s+branch of (.*)$/i, replace: (m, p1, p2) => `Nhánh ${getVietnameseName(p1)} của ${getVietnameseName(p2)}` },
  { match: /^(.*)\s+branches$/i, replace: (m, p) => `Các nhánh ${getVietnameseName(p)}` },
  { match: /^(.*)\s+branch$/i, replace: (m, p) => `Nhánh ${getVietnameseName(p)}` },
  // Septum & Bursa
  { match: /^(.*)\s+intermuscular septum of (.*)$/i, replace: (m, p1, p2) => `Vách gian cơ ${getVietnameseName(p1)} của ${getVietnameseName(p2)}` },
  { match: /^(.*)\s+intermuscular septum$/i, replace: (m, p) => `Vách gian cơ ${getVietnameseName(p)}` },
  { match: /^(.*)\s+bursae$/i, replace: (m, p) => `Các túi thanh mạc ${getVietnameseName(p)}` },
  { match: /^(.*)\s+bursa$/i, replace: (m, p) => `Túi thanh mạc ${getVietnameseName(p)}` },

  { match: /\bmuscle\b/i, replace: 'Cơ' },
  { match: /\bartery\b/i, replace: 'Động mạch' },
  { match: /\bvein\b/i, replace: 'Tĩnh mạch' },
  { match: /\bnerve\b/i, replace: 'Dây thần kinh' },
  { match: /\bligament\b/i, replace: 'Dây chằng' },
  { match: /\btendon\b/i, replace: 'Gân' },
  { match: /\bjoint\b/i, replace: 'Khớp' },
  { match: /\bbone\b/i, replace: 'Xương' }
];

function translateNumber(word) {
  const map = {
    'first': '1', 'second': '2', 'third': '3', 'fourth': '4', 'fifth': '5',
    'sixth': '6', 'seventh': '7', 'eighth': '8', 'ninth': '9', 'tenth': '10',
    'eleventh': '11', 'twelfth': '12'
  };
  return map[word.toLowerCase()] || word;
}

export function splitSideAndSuffix(rawName) {
  if (!rawName) return { base: '', side: null };
  let str = String(rawName).trim();
  str = str.replace(/^\((.*)\)$/, '$1').trim();

  // Strip technical suffixes like .l, .r, _l, _r, .left, .right, (left), (right)
  const leftRegex = /(?:[\._](?:l|left)|\s*\((?:l|left)\))\s*$/i;
  const rightRegex = /(?:[\._](?:r|right)|\s*\((?:r|right)\))\s*$/i;

  if (leftRegex.test(str)) {
    const base = str.replace(leftRegex, '').trim();
    return { base, side: 'left' };
  }
  if (rightRegex.test(str)) {
    const base = str.replace(rightRegex, '').trim();
    return { base, side: 'right' };
  }

  return { base: str, side: null };
}

export function getVietnameseName(englishBaseName) {
  if (!englishBaseName) return '';
  const { base, side } = splitSideAndSuffix(englishBaseName);
  const clean = base.replace(/^\((.*)\)$/, '$1').trim();

  let vnBase = null;

  // 1. Direct match
  if (EXACT_DICTIONARY[clean]) {
    vnBase = EXACT_DICTIONARY[clean];
  } else {
    // 2. Case-insensitive exact match
    const lower = clean.toLowerCase();
    for (const [key, val] of Object.entries(EXACT_DICTIONARY)) {
      if (key.toLowerCase() === lower) {
        vnBase = val;
        break;
      }
    }
  }

  // 2b. Strip suffix "muscle", "muscles", "tooth", "teeth" and check EXACT_DICTIONARY
  if (!vnBase) {
    if (/\s+muscles?\b/i.test(clean)) {
      const without = clean.replace(/\s+muscles?\b/i, '').trim();
      const withoutLower = without.toLowerCase();
      let matched = EXACT_DICTIONARY[without];
      if (!matched) {
        for (const [k, v] of Object.entries(EXACT_DICTIONARY)) {
          if (k.toLowerCase() === withoutLower) {
            matched = v;
            break;
          }
        }
      }
      if (matched) {
        vnBase = (!matched.startsWith('Cơ') && !matched.startsWith('Các cơ') && !matched.startsWith('Dải') && !matched.startsWith('Gân') && !matched.startsWith('Màng'))
          ? `Cơ ${matched.toLowerCase()}`
          : matched;
      }
    } else if (/\s+(?:tooth|teeth)\b/i.test(clean)) {
      const without = clean.replace(/\s+(?:tooth|teeth)\b/i, '').trim();
      const withoutLower = without.toLowerCase();
      for (const [k, v] of Object.entries(EXACT_DICTIONARY)) {
        if (k.toLowerCase() === withoutLower) {
          vnBase = v;
          break;
        }
      }
    }
  }

  // 3. Pattern match
  if (!vnBase) {
    for (const p of PATTERNS) {
      if (p.match.test(clean)) {
        if (typeof p.replace === 'function') {
          vnBase = clean.replace(p.match, p.replace);
        } else {
          vnBase = clean.replace(p.match, p.replace);
        }
        break;
      }
    }
  }

  if (!vnBase) {
    vnBase = clean;
  }

  if (side === 'left') {
    return `${vnBase} (Trái)`;
  } else if (side === 'right') {
    return `${vnBase} (Phải)`;
  }
  return vnBase;
}

export function getAnatomyNomenclature(rawName) {
  if (!rawName) {
    return {
      rawName: '',
      cleanBase: '',
      side: null,
      sideLabelVi: '',
      sideSpeechVi: '',
      nameVi: '',
      nameLatin: '',
      nameEn: '',
      speakTextVi: ''
    };
  }

  const { base, side } = splitSideAndSuffix(rawName);
  const cleanBase = base.replace(/^\((.*)\)$/, '$1').trim();
  const baseVn = getVietnameseName(cleanBase);

  const sideLabelVi = side === 'left' ? 'Trái' : (side === 'right' ? 'Phải' : '');
  const sideSpeechVi = side === 'left' ? 'bên trái' : (side === 'right' ? 'bên phải' : '');
  const sideLatin = side === 'left' ? 'Sinistra' : (side === 'right' ? 'Dextra' : '');
  const sideEn = side === 'left' ? 'Left' : (side === 'right' ? 'Right' : '');

  const nameVi = sideLabelVi ? `${baseVn} (${sideLabelVi})` : baseVn;
  const nameEn = sideEn ? `${cleanBase} (${sideEn})` : cleanBase;
  const nameLatin = sideLatin ? `${cleanBase} (${sideLatin})` : cleanBase;
  const speakTextVi = sideSpeechVi ? `${baseVn} ${sideSpeechVi}` : baseVn;

  return {
    rawName,
    cleanBase,
    side,
    sideLabelVi,
    sideSpeechVi,
    sideLatin,
    sideEn,
    nameVi,
    nameLatin,
    nameEn,
    speakTextVi
  };
}

export function getVietnameseSynonyms(englishBaseName) {
  const vn = getVietnameseName(englishBaseName);
  if (!vn || vn === englishBaseName) return [];

  const synonyms = [vn];
  const lower = vn.toLowerCase();
  const enLower = (englishBaseName || '').toLowerCase();

  // Visceral & Lymphatic Organs
  if (lower.includes('lách') || enLower.includes('spleen')) {
    synonyms.push('lá lách', 'lách', 'tỳ', 'lách tỳ', 'la lach', 'ty', 'spleen');
  }
  if (lower.includes('tụy') || enLower.includes('pancreas')) {
    synonyms.push('tụy', 'tuyến tụy', 'tụy tạng', 'tuy', 'tuyen tuy', 'pancreas', 'lá tụy', 'la tuy');
  }
  if (lower.includes('túi mật') || lower.includes('mật') || enLower.includes('gallbladder')) {
    synonyms.push('mật', 'túi mật', 'bọng mật', 'tui mat', 'mat', 'gallbladder');
  }
  if (lower.includes('ống mật') || enLower.includes('bile duct')) {
    synonyms.push('ống dẫn mật', 'đường mật', 'ong mat', 'ong dan mat', 'duong mat', 'bile');
  }
  if (lower.includes('ống tụy') || enLower.includes('pancreatic duct')) {
    synonyms.push('ống tụy chính', 'ống wirsung', 'ong tuy');
  }
  if (lower.includes('gan') || enLower.includes('liver')) {
    synonyms.push('lá gan', 'gan mật', 'la gan', 'hepar', 'liver');
  }
  if (lower.includes('thận') || enLower.includes('kidney')) {
    synonyms.push('quả thận', 'hai quả thận', 'qua than', 'than', 'kidney');
  }
  if (lower.includes('dạ dày') || enLower.includes('stomach')) {
    synonyms.push('bao tử', 'da day', 'bao tu', 'stomach');
  }
  if (lower.includes('ruột thừa') || enLower.includes('appendix')) {
    synonyms.push('manh tràng', 'dau ruot thua', 'ruot thua', 'appendix');
  }
  if (lower.includes('tá tràng') || enLower.includes('duodenum')) {
    synonyms.push('ruột non', 'ta trang', 'duodenum');
  }
  if (lower.includes('hỗng tràng') || lower.includes('không tràng') || enLower.includes('jejunum')) {
    synonyms.push('không tràng', 'hỗng tràng', 'khong trang', 'hong trang', 'ruột non', 'ruot non', 'jejunum');
  }
  if (lower.includes('hồi tràng') || enLower.includes('ileum') || enLower.includes('ileal') || enLower.includes('ileocolic')) {
    synonyms.push('hồi tràng', 'hoi trang', 'ruột non', 'ruot non', 'ileum', 'ileal');
  }
  if (lower.includes('đại tràng') || lower.includes('manh tràng') || lower.includes('trực tràng') || enLower.includes('colon') || enLower.includes('rectum') || enLower.includes('caecum') || enLower.includes('taenia')) {
    synonyms.push('ruột già', 'ruot gia', 'đại tràng', 'dai trang', 'colon', 'kết tràng');
  }
  if (lower.includes('phổi') || enLower.includes('lung')) {
    synonyms.push('lá phổi', 'hai lá phổi', 'la phoi', 'phoi', 'lung');
  }
  if (lower.includes('quả tim') || lower.includes('tim') || enLower.includes('heart')) {
    synonyms.push('tim', 'trai tim', 'qua tim', 'heart');
  }
  if (lower.includes('não') || enLower.includes('brain')) {
    synonyms.push('bộ não', 'nao bo', 'nao', 'brain');
  }
  if (lower.includes('bạch huyết') || enLower.includes('lymph')) {
    synonyms.push('hệ bạch huyết', 'hạch bạch huyết', 'bach huyet', 'hach');
  }

  // Sensory: Eye & Ear
  if (lower.includes('mắt') || lower.includes('nhãn cầu') || lower.includes('giác mạc') || lower.includes('mống mắt') || lower.includes('củng mạc') || lower.includes('võng mạc') || enLower.includes('eye') || enLower.includes('orbit') || enLower.includes('cornea') || enLower.includes('iris') || enLower.includes('sclera') || enLower.includes('retina') || enLower.includes('lacrimal')) {
    synonyms.push('nhãn cầu', 'mắt', 'con mắt', 'nhan cau', 'mat', 'eyeball', 'eye');
  }
  if (lower.includes('tai') || lower.includes('nhĩ') || lower.includes('ốc tai') || lower.includes('xương đe') || lower.includes('xương búa') || lower.includes('xương bàn đạp') || enLower.includes('incus') || enLower.includes('malleus') || enLower.includes('stapes') || enLower.includes('tympan') || enLower.includes('auric') || enLower.includes('cochlea')) {
    synonyms.push('tai', 'tai giữa', 'màng nhĩ', 'thính giác', 'ear');
  }

  // Pelvis / Reproductive notes
  if (lower.includes('sinh dục') || lower.includes('tiết niệu') || enLower.includes('genital') || enLower.includes('pelvis') || enLower.includes('testis') || enLower.includes('penis') || enLower.includes('prostate')) {
    synonyms.push('vùng chậu', 'khung chậu', 'hệ sinh dục');
  }

  // Cerebrospinal fluid & Ventricular system (CSF) - Exclude heart chambers!
  const isHeartVentricle = /heart|cardiac|coronary|left ventricle|right ventricle|ventriculus cordis|interventricular|papillary/i.test(enLower) ||
    lower.includes('tâm thất') || lower.includes('thất trái') || lower.includes('thất phải') || lower.includes('tim');

  if (
    !isHeartVentricle &&
    (
      lower.includes('não thất') ||
      lower.includes('cống não') ||
      lower.includes('màng mạch') ||
      lower.includes('màng cứng') ||
      lower.includes('dịch não tủy') ||
      (enLower.includes('ventric') && (enLower.includes('lateral') || enLower.includes('third') || enLower.includes('fourth') || enLower.includes('brain') || enLower.includes('cerebr'))) ||
      enLower.includes('aqueduct') ||
      enLower.includes('choroid') ||
      enLower.includes('spinal dura')
    )
  ) {
    synonyms.push(
      'dịch não tủy', 'dich nao tuy', 'csf', 'nước não tủy', 'nuoc nao tuy',
      'não thất', 'nao that', 'hệ thống não thất', 'he thong nao that',
      'não thất bên', 'nao that ben', 'não thất 3', 'não thất ba', 'nao that 3', 'nao that ba',
      'não thất 4', 'não thất tư', 'nao that 4', 'nao that tu',
      'cống não', 'cong nao', 'cống sylvius', 'cong sylvius', 'cống trung não',
      'đám rối màng mạch', 'dam roi mang mach',
      'màng cứng', 'mang cung', 'màng não', 'mang nao',
      'khoang dưới nhện', 'khoang duoi nhen', 'lưu thông dịch não tủy'
    );
  }

  // Joints, Ligaments & Discs (Khớp, Dây chằng, Đĩa đệm)
  if (lower.includes("dây chằng") || enLower.includes("ligament")) {
    synonyms.push("dây chằng", "day chang", "ligament", "khớp");
  }
  if (lower.includes("khớp") || enLower.includes("joint") || lower.includes("bao khớp")) {
    synonyms.push("khớp", "khop", "bao khớp", "bao khop", "joint", "hệ khớp", "ổ khớp");
  }
  if (lower.includes("đĩa đệm") || enLower.includes("disc") || lower.includes("nhân nhầy")) {
    synonyms.push("đĩa đệm", "dia dem", "thoát vị đĩa đệm", "nhân nhầy", "gian đốt sống");
  }
  if (lower.includes("sụn chêm") || enLower.includes("meniscus")) {
    synonyms.push("sụn chêm", "sun chem", "sụn gối", "meniscus");
  }
  if (lower.includes("chéo trước") || enLower.includes("cruciate")) {
    synonyms.push("acl", "pcl", "chéo trước", "chéo sau", "dây chằng chéo");
  }
  // Bones & Muscles
  if (lower.includes('xương đùi')) synonyms.push('đùi', 'bắp đùi', 'xuong dui', 'dui');
  if (lower.includes('xương đòn')) synonyms.push('xương quai xanh', 'quai xanh');
  if (lower.includes('cơ delta')) synonyms.push('cơ vai', 'bắp vai');
  if (lower.includes('cơ nhị đầu')) synonyms.push('chuột trước', 'bắp tay trước');
  if (enLower.includes('pectoral') || lower.includes('cơ ngực') || lower.includes('ngực lớn') || lower.includes('ngực bé') || lower.includes('ngực đòn')) {
    synonyms.push('cơ ngực', 'co nguc', 'ngực', 'bắp ngực', 'ngực lớn', 'ngực bé', 'pectoralis');
  }
  if (enLower.includes('latissimus') || enLower.includes('trapezius') || enLower.includes('erector spinae') || enLower.includes('rhomboid') || lower.includes('cơ lưng') || lower.includes('lưng rộng')) {
    synonyms.push('cơ lưng', 'co lung', 'lưng', 'cơ xô', 'bắp lưng');
  }
  if (enLower.includes('glute') || lower.includes('cơ mông') || lower.includes('mông lớn') || lower.includes('mông bé') || lower.includes('mông nhỡ')) {
    synonyms.push('cơ mông', 'co mong', 'mông', 'mông lớn', 'mông nhỡ', 'mông bé', 'gluteus');
  }
  if (enLower.includes('calcaneal tendon') || enLower.includes('achilles') || lower.includes('gân gót') || lower.includes('gân achilles')) {
    synonyms.push('gân gót', 'gân achilles', 'gót chân', 'gan got', 'gan achilles', 'calcaneal tendon', 'achilles tendon');
  }
  if (lower.includes('sọ') || lower.includes('trán') || lower.includes('đỉnh') || lower.includes('chẩm') || lower.includes('thái dương') || enLower.includes('cran') || enLower.includes('skull') || enLower.includes('parietal') || enLower.includes('frontal') || enLower.includes('occipital') || enLower.includes('temporal') || enLower.includes('sphenoid') || enLower.includes('ethmoid')) {
    synonyms.push('xương sọ', 'hộp sọ', 'sọ não', 'xuong so', 'hop so', 'so nao', 'skull', 'cranium');
  }
  if (lower.includes('đốt sống') || enLower.includes('vertebra')) {
    synonyms.push('cột sống', 'xương sống', 'dot song', 'cot song');

    // Cervical vertebrae (C1 - C7)
    if (enLower.includes('c7') || lower.includes('c7')) {
      synonyms.push('c7', 'đốt sống c7', 'dot song c7', 'đốt sống cổ c7', 'dot song co c7', 'đốt c7', 'cổ c7', 'co c7', 'đốt sống lồi', 'đốt lồi', 'dot loi', 'vertebra prominens', 'cervical vertebra 7');
    }
    if (enLower.includes('c1') || lower.includes('c1') || enLower.includes('atlas')) {
      synonyms.push('c1', 'đốt sống c1', 'dot song c1', 'đốt sống cổ c1', 'đốt đội', 'dot doi', 'atlas');
    }
    if (enLower.includes('c2') || lower.includes('c2') || enLower.includes('axis')) {
      synonyms.push('c2', 'đốt sống c2', 'dot song c2', 'đốt sống cổ c2', 'đốt trục', 'dot truc', 'axis');
    }
    for (let c = 3; c <= 6; c++) {
      if (enLower.includes(`c${c}`) || lower.includes(`c${c}`)) {
        synonyms.push(`c${c}`, `đốt sống c${c}`, `dot song c${c}`, `đốt sống cổ c${c}`, `dot song co c${c}`, `đốt c${c}`, `cổ c${c}`);
      }
    }
    // Thoracic vertebrae (T1 - T12)
    for (let t = 1; t <= 12; t++) {
      if (enLower.includes(`t${t}`) || lower.includes(`t${t}`)) {
        synonyms.push(`t${t}`, `đốt sống t${t}`, `dot song t${t}`, `đốt sống ngực t${t}`, `dot song nguc t${t}`, `đốt t${t}`, `ngực t${t}`);
      }
    }
    // Lumbar vertebrae (L1 - L5)
    for (let l = 1; l <= 5; l++) {
      if (enLower.includes(`l${l}`) || lower.includes(`l${l}`)) {
        synonyms.push(`l${l}`, `đốt sống l${l}`, `dot song l${l}`, `đốt sống thắt lưng l${l}`, `dot song that lung l${l}`, `đốt l${l}`, `thắt lưng l${l}`);
      }
    }
  }
  if (lower.includes('thần kinh tọa')) synonyms.push('thần kinh ngồi', 'đau dây tọa');

  return [...new Set(synonyms)];
}

