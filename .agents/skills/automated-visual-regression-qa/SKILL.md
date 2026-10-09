---
name: automated-visual-regression-qa
description: Automated visual regression QA engine for 3D medical anatomy atlases and web applications. Enforces empirical visual verification, multi-viewport capture (mobile 390x844 & desktop), shader fidelity checks, dissection layer validation, and strict zero-blind-pass reporting.
version: 1.0.0
author: Google Deepmind Antigravity Anatomy Engineering
tags: [qa, visual-regression, playwright, mobile-first, threejs-testing, zero-defect]
---

# Automated Visual Regression QA Engine (`automated-visual-regression-qa`)

## 1. Mục Đích & Nguyên Tắc Tối Thượng (Supreme Mandate)
- **Tuyệt đối cấm báo cáo văn bản:** CẤM TUYỆT ĐỐI viết báo cáo văn bản dài dòng, phân tích liệt kê bằng chữ lê thê. Người dùng KHÔNG đọc báo cáo chữ.
- **Bắt buộc 100% bằng hình ảnh thực tế:** Mọi nghiệm thu BẮT BUỘC chụp ảnh màn hình giao diện thực tế (Playwright Mobile 390x844) và nhúng/gửi trực tiếp ảnh vào chat.
- **Lời thoại đi kèm tối đa 1 dòng:** Chỉ tối đa 1 câu ngắn gọn hoặc câu hỏi hành động tiếp theo. Cấm giải thích dông dài.
- **Đa khổ hiển thị chuẩn:**
  - **Điện thoại:** Khổ chuẩn 390x844 px (iPhone 14 / modern flagship mobile viewport).
  - **Máy tính bảng:** Khổ chuẩn 768x1024 px.
  - **Máy tính:** Khổ chuẩn 1440x900 px.

---

## 2. Quy Trình Kiểm Thử Hồi Quy Thị Giác (Regression QA Protocol)

```
[BƯỚC 1: SỬA DELTA & BUILD]
      │
      ▼
[BƯỚC 2: KHỞI ĐỘNG LOCAL SERVER & PREVIEW]
      │
      ▼
[BƯỚC 3: MỞ TRÌNH DUYỆT PLAYWRIGHT (VIEWPORT ĐIỆN THOẠI 390x844)]
      │
      ▼
[BƯỚC 4: TƯƠNG TÁC THỰC TẾ (XOAY 3D / CHỌN CƠ QUAN / BÓC TÁCH / ĐỔI OPACITY)]
      │
      ▼
[BƯỚC 5: CHỤP ẢNH MÀN HÌNH THỰC TẾ (PLAYWRIGHT SCREENSHOT)]
      │
      ▼
[BƯỚC 6: ĐỐI CHIẾU CHỈ TIÊU Y HỌC & ĐỘ SẮC NÉT GRAPHICS]
      │
      ▼
[BƯỚC 7: BÁO CÁO MINH CHỨNG TRỰC QUAN CHO NGƯỜI DÙNG & CHỜ DUYỆT]
```

---

## 3. Các Chỉ Tiêu Đánh Giá Thị Giác Cụ Thể (Visual Quality Benchmarks)

### 3.1. Cơ Quan Nội Tạng (Visceral Organs)
- **Ruột non (Small Intestine):** Sắc độ hồng đào tươi sống động (`0xD96B5B`), không bị bợt trắng mờ nhạt, có độ bóng thanh mạc ẩm mượt (`clearcoat: 0.38`), vi mạch máu sống động (`sheen: 0.45`).
- **Gan (Liver):** Đỏ nâu đậm đà đặc trưng nhu mô (`0x7E261F`), bao Glisson căng bóng (`clearcoat: 0.45`).
- **Túi mật (Gallbladder):** Xanh ngọc mật đậm (`0x1E824C`), bóng láng.
- **Tụy (Pancreas):** Vàng kem tiểu thùy ấm (`0xD4A75E`), cấu trúc xốp nhẹ.
- **Thận (Kidneys):** Vỏ thận nâu đỏ đậm đà (`0x7A2626`), đài bể thận xám ngà (`0xDCD5C6`).
- **Phổi (Lungs):** Hồng thông khí mịn màng (`0xC67D88`).
- **Lách (Spleen):** Mận chín tủy đỏ thẫm (`0x5C1D2A`).

### 3.2. Hệ Xương & Hộp Sọ (Skeletal & Cranial Bones)
- **Xương sọ & xương thân:** Trắng ngà cổ điển (`0xE2D9C8`), ánh láng khoáng xương vỏ (`clearcoat: 0.18`), loại bỏ triệt để các quầng mờ bóng ma (fresnel ghost halos).
- **Răng:** Men ngà cao nguyên (`0xFBF7EE`).

### 3.3. Hệ Da (Integumentary System)
- **Độ phủ giải phẫu:** Ôm khít cơ thể, đường nét khuôn mặt tự nhiên, không che lấp bất thường.
- **3 chế độ hiển thị:**
  - 100% Solid: Cơ thể con người hoàn chỉnh.
  - 35% Translucent: Kính mờ X-ray nhìn xuyên thấu cơ quan bên trong.
  - 0% Off: Ẩn da để quan sát sâu hệ vận động và nội tạng.

### 3.4. Bóc Tách Đa Tầng (Multi-Layer Dissection)
- Từng tầng cơ quan bóc tách tuần tự, không bị biến mất đột ngột cả khối.
- Dạ dày: Bóc thành trước để lộ lòng dạ dày và nếp niêm mạc (rugae), sau đó mới bóc tiếp các cấu trúc phía sau.

---

## 4. Công Cụ & Script Tự Động Hóa QA
Sử dụng công cụ Playwright MCP:
- `browser_navigate`: `http://localhost:4181/`
- `browser_resize`: `{ width: 390, height: 844 }`
- `browser_evaluate`: Thao tác trực tiếp xoay camera Three.js, kích hoạt bóc tách, đổi opacity da.
- `browser_take_screenshot`: Chụp ảnh chất lượng cao lưu vào thư mục artifacts phục vụ báo cáo người dùng.
