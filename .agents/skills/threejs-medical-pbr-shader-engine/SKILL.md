---
name: threejs-medical-pbr-shader-engine
description: Chuyên gia Vật liệu PBR & Đồ họa Y khoa 3D (Three.js Medical PBR Shaders, MeshPhysicalMaterial, Subsurface Scattering, Clearcoat Serosal Sheen, Cavity Crevice Lighting).
---

# Three.js Medical PBR Shader Engine (Động cơ Vật liệu PBR Y khoa 3D)

## 1. Nguyên tắc cốt lõi (Core Principles)
1. **MeshPhysicalMaterial là tiêu chuẩn tối thượng**: Tất cả các mô sống (nội tạng, da, cơ, mạch máu, sụn) đều phải sử dụng `THREE.MeshPhysicalMaterial` để mô phỏng chính xác tính chất quang học sinh học:
   - `clearcoat` (0.25 - 0.55): Mô phỏng lớp dịch thanh mạc (serosa) ẩm ướt tự nhiên của cơ thể người sống.
   - `clearcoatRoughness` (0.15 - 0.25): Tạo phản xạ gương mềm mại của lớp ẩm sinh lý.
   - `sheen` (0.30 - 0.70) & `sheenColor`: Mô phỏng hiện tượng tán xạ ánh sáng mao mạch (microvascular light scatter) dưới lớp thanh mạc hoặc lớp hạ bì.
   - `roughness` (0.35 - 0.65): Tránh tuyệt đối vật liệu phẳng lì như nhựa (roughness < 0.20 không có clearcoat hoặc > 0.80 khô khốc).

2. **Bảng màu PBR Giải phẫu chuẩn y khoa (Medical Color Palette)**:
   - **Ruột non (Jejunum / Ileum)**: `0xD96B5B` (hồng san hô/đào tươi sống), `clearcoat: 0.38`, `sheen: 0.45` với `sheenColor: 0xfecdd3`.
   - **Đại tràng (Colon)**: `0x98443A` (nâu đỏ đất sâu), tương phản với dải cơ dọc taenia coli màu ngà sáng `0xEDE8D0`.
   - **Gan (Liver)**: `0x7E261F` (đỏ nâu huyết dụ bao Glisson), `clearcoat: 0.45`, `sheen: 0.35`.
   - **Túi mật (Gallbladder)**: `0x1E824C` (ngọc lục bảo dịch mật), `sheen: 0.55`, `clearcoat: 0.50`.
   - **Tuyến tụy (Pancreas)**: `0xD4A75E` (vàng kem tiểu thùy hạt ấm), `roughness: 0.60`.
   - **Thận (Kidneys)**: `0x7A2626` (nâu đỏ hạt dẻ nhu mô), tách bạch với đài bể thận ngà ngọc `0xDCD5C6`.
   - **Phổi (Lungs)**: `0xC67D88` (hồng đào xốp thông khí), `roughness: 0.58`.
   - **Dạ dày (Stomach)**: `0xB86A64` (cơ trơn ấm áp), mặt trong niêm mạc `0xC87068`.
   - **Xương sọ & Xương dẹt (Cranial & Flat bones)**: `0xE2D9C8` (ngà xương thanh nhã), `clearcoat: 0.18`, `roughness: 0.52`.
   - **Răng (Teeth Enamel)**: `0xFBF7EE` (men ngọc trai), `clearcoat: 0.40`.

3. **Cân chỉnh Ánh sáng Hốc Giải phẫu (Cavity & Crevice Shading)**:
   - Ánh sáng môi trường (`AmbientLight`) duy trì ở mức cân bằng 0.30 - 0.35 để các hốc sâu giữa các quai ruột non, thùy gan, rãnh phổi có bóng đổ tự nhiên.
   - Đèn chính (`Key light`: 0.90) phối hợp đèn điền (`Fill light`: 0.45) và cặp đèn viền (`Dual Rim lights`: 0.55 - 0.65) tại Z: -55 để tách lớp viền 3D sắc nét.
