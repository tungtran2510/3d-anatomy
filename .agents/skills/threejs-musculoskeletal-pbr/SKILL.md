---
name: threejs-musculoskeletal-pbr
description: Chuyên gia Vật liệu PBR Cơ Vân & Gân Giải phẫu Y khoa 3D (Three.js Skeletal Muscle, Myofibril Fascicles, Epimysial Sheen, Pearlescent Collagen Tendons, Subsurface Scattering, TA2 Anatomical Color Palette).
---

# Three.js Musculoskeletal PBR Skill (Chuyên gia Vật liệu Cơ - Gân Y khoa 3D)

## 1. Nguyên lý Giải phẫu Y khoa & Quang học Sinh học (Biological Optics)

1. **Bản chất Mô học Cơ vân (Skeletal Muscle Histology)**:
   - **Bụng cơ (Muscle Belly)**: Chứa mật độ cao Myoglobin và mạng lưới mao mạch dày đặc, tạo nên sắc đỏ thẫm ruby/huyết sắc (`0x801C24` - `0x882028`).
   - **Bó sợi cơ (Muscle Fascicles)**: Các sợi cơ hợp thành bó được bọc trong màng liên kết *Perimysium*, tạo thành các rãnh uốn lượn tự nhiên dọc theo hướng co cơ.
   - **Màng bao ngoài bó cơ (Epimysium)**: Lớp mô liên kết mỏng ngậm dịch bọc ngoài toàn bộ bắp cơ, tạo phản xạ ẩm mềm mại sinh lý (*Epimysial Sheen*), tuyệt đối không phải lớp bóng vecni nhựa khô.
   - **Tán xạ ánh sáng dưới bề mặt (Subsurface Scattering - SSS)**: Mô cơ dày ~75% nước và huyết sắc tố, khi có ánh sáng xiên (rim light / backlight), mép cơ phải có độ tán xạ ánh sáng đỏ ấm mềm (`transmission: 0.06 - 0.10`, `thickness: 0.025 - 0.040`, `attenuationColor: 0x991b1b`).

2. **Bản chất Mô học Gân & Cân mạc (Tendon & Aponeurosis Histology)**:
   - **Gân (Tendon)**: Cấu tạo chủ yếu từ sợi Collagen Type-I xếp song song siêu chặt. Dưới ánh sáng, gân có độ óng ánh kim tuyến bạc/ngọc trai dẹt (*Pearlescent Collagen Sheen*) chạy dọc theo chiều sợi, màu trắng ngà tự nhiên (`0xEFEAD8`).
   - **Cân mạc (Aponeurosis / Fascia)**: Màng dẹt mỏng màu trắng xà cừ bán trong suốt, phủ lên trên bụng cơ và liên kết với xương.

---

## 2. Bảng thông số Three.js `MeshPhysicalMaterial` chuẩn Y khoa (Medical PBR Standards)

### A. Cơ vân chịu lực lớn (Locomotor & Postural Muscles - Ngực, Lưng, Đùi, Cẳng chân, Cánh tay)
```javascript
new THREE.MeshPhysicalMaterial({
  name: 'PBR_Muscle',
  color: new THREE.Color(0x821E26), // Đỏ ruby huyết sắc myoglobin tự nhiên
  roughness: 0.44,                  // Độ nhám mô mềm
  metalness: 0.01,
  clearcoat: 0.22,                  // Màng epimysium ẩm tự nhiên
  clearcoatRoughness: 0.32,         // Phản xạ mờ sinh lý, triệt tiêu bóng nhựa
  sheen: 0.65,                      // Tán xạ mao mạch vi mạch
  sheenColor: new THREE.Color(0xb91c1c), // Đỏ tươi mao mạch
  sheenRoughness: 0.30,
  transmission: 0.08,               // Tán xạ ánh sáng SSS sinh học
  thickness: 0.030,
  attenuationColor: new THREE.Color(0x991b1b),
  attenuationDistance: 0.035,
  normalMap: textures.muscleMap,    // Vân bó sợi cơ đa tầng
  normalScale: new THREE.Vector2(0.18, 0.18),
  roughnessMap: textures.muscleCavityMap, // Tăng nhám ở khe rãnh
  transparent: false,
  opacity: 1.0,
  depthWrite: true
});
```

### B. Cơ bám da mặt (Facial Mimic Muscles - Vòng mi, Vòng môi, Cơ trán, Cơ gò má)
- Cơ mặt mỏng dẹt, đan xen mô mỡ dưới da và vi mạch phong phú:
```javascript
new THREE.MeshPhysicalMaterial({
  name: 'PBR_FacialMimic',
  color: new THREE.Color(0x8C262E), // Hồng đỏ tươi hơn, nhẹ nhàng hơn
  roughness: 0.46,
  metalness: 0.01,
  clearcoat: 0.20,
  clearcoatRoughness: 0.35,
  sheen: 0.70,
  sheenColor: new THREE.Color(0xd946ef), // Tán xạ ánh hồng vi mạch
  sheenRoughness: 0.32,
  transmission: 0.10,               // Mỏng hơn nên ánh sáng xuyên nhiều hơn
  thickness: 0.018,
  attenuationColor: new THREE.Color(0xa81c2d),
  attenuationDistance: 0.025,
  normalMap: textures.muscleMap,
  normalScale: new THREE.Vector2(0.14, 0.14),
  transparent: false,
  opacity: 1.0,
  depthWrite: true
});
```

### C. Gân (Tendons - Gân gót Achilles, Gân bánh chè, Gân cơ nhị đầu...)
```javascript
new THREE.MeshPhysicalMaterial({
  name: 'PBR_Tendon',
  color: new THREE.Color(0xEFEAD8), // Trắng ngà collagen Type-I tự nhiên
  roughness: 0.32,                  // Mịn màng
  metalness: 0.02,
  clearcoat: 0.42,                  // Ánh bóng của bao hoạt dịch gân
  clearcoatRoughness: 0.22,
  sheen: 0.85,                      // Óng ánh xà cừ collagen
  sheenColor: new THREE.Color(0xFFFDF5), // Ánh bạc ngọc trai
  sheenRoughness: 0.20,
  normalMap: textures.collagenMap,  // Vân thớ collagen song song siêu mịn
  normalScale: new THREE.Vector2(0.20, 0.20),
  transparent: false,
  opacity: 1.0,
  depthWrite: true
});
```

### D. Cân mạc & Dải liên kết (Fascia & Aponeurosis - Cân đùi, Cân ngực, Mạc giữ gân)
```javascript
new THREE.MeshPhysicalMaterial({
  name: 'PBR_Fascia',
  color: new THREE.Color(0xF0ECE1), // Trắng ngà xà cừ
  roughness: 0.38,
  metalness: 0.01,
  clearcoat: 0.38,
  clearcoatRoughness: 0.26,
  sheen: 0.75,
  sheenColor: new THREE.Color(0xFFFFFF),
  transparent: true,
  opacity: 0.55,                    // Bán trong suốt phủ lên cơ
  depthWrite: false,
  renderOrder: 5
});
```

---

## 3. Thuật toán Procedural Texture Cơ & Gân (Canvas Texture Generation)

- **Độ phân giải**: 512x512 (đảm bảo độ nét cao trên màn hình Retina/4K nhưng cực kỳ tiết kiệm bộ nhớ).
- **Nguyên lý đa tầng (Multi-Scale Noise)**:
  1. *Sóng chính (Primary Fascicle Waves)*: `sin` với tần số thấp kết hợp nhiễu pha lượn sóng dọc theo trục cơ.
  2. *Sợi thứ cấp (Secondary Myofibrils)*: `sin` tần số cao mô phỏng từng vi sợi cơ.
  3. *Vân ngang (Sarcomere Cross-striations)*: Tần số siêu nhỏ theo phương vuông góc.
  4. *Cavity Mask*: Tính toán rãnh khe để hạ specular và tăng roughness, tạo chiều sâu 3D tự nhiên.

---

## 4. Quy tắc Kiểm tra & Nghiệm thu (Verification & Acceptance)

1. **Khử hoàn toàn cảm giác nhựa (Anti-Plastic Rule)**:
   - Tuyệt đối không dùng `clearcoat > 0.40` trên thân cơ (trừ gân).
   - `roughness` của cơ nằm trong dải sinh lý 0.42 - 0.48.
2. **Khử cảm giác khối đất nặn đơn sắc (Anti-Monolith Rule)**:
   - Các nhóm cơ mặt, cơ thân, gân phải có bảng màu tách bạch theo phân loại giải phẫu.
   - Thớ cơ phải hiển thị rõ khi ánh sáng quét qua.
3. **Hiệu năng 60 FPS**:
   - Caching vĩnh viễn các procedural textures (singleton pattern).
   - Tối ưu GPU shader compilation bằng `renderer.compileAsync`.
