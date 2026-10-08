# ANATOMY ATLAS 3D - PROJECT BRAIN & SUPREME RULES
> **Trạng thái**: ACTIVE  
> **Cập nhật lần cuối**: 2026-10-08  

---

## QUY TẮC TỐI CAO BẮT BUỘC CHO MỌI AGENT (SUPREME MANDATORY RULES)

### 1. BÁO CÁO BẮT BUỘC BẰNG HÌNH ẢNH THỰC TẾ, CẤM BÁO CÁO VĂN BẢN SUÔNG (MANDATORY VISUAL PROOF REPORTING)
- **Cấm tuyệt đối:** CẤM TUYỆT ĐỐI việc chỉ viết báo cáo bằng văn bản, mô tả bằng lời ("đã làm xong", "cơ bản ổn", "đã sửa đẹp") mà không có hình ảnh thực tế chứng minh.
- **Bắt buộc gửi hình ảnh thực tế:** Mọi báo cáo hoàn thành công việc, chỉnh sửa giao diện, sửa lỗi hiển thị, cập nhật tính năng BẮT BUỘC phải chụp ảnh màn hình giao diện thực tế (Mobile / Desktop) và gửi/nhúng trực tiếp hình ảnh minh chứng để người dùng trực tiếp quan sát và đánh giá.
- **Quy trình nghiệm thu bắt buộc:**  
  `THỰC HIỆN` ➔ `CHỤP ẢNH MÀN HÌNH THỰC TẾ TRÊN MOBILE/DESKTOP` ➔ `GỬI HÌNH ẢNH MINH CHỨNG TRỰC TIẾP CHO NGƯỜI DÙNG` ➔ `CHỜ NGƯỜI DÙNG DUYỆT`.

---

### 2. CÔNG THÁI HỌC DI ĐỘNG (MOBILE ERGONOMICS & THUMB ZONE)
- **Khu vực thuận tay (Thanh Đáy - Bottom Navigation Bar)**:
  - Nút **"Hệ cơ quan"** đặt ở vị trí số 1 thuận tay ngón cái bên trái để mở danh mục 11 hệ cơ quan & vùng cơ thể trong tích tắc.
  - Các công cụ học tập cốt lõi (`Góc nhìn`, `Tìm kiếm`, `Bóc tách`, `Tự học`, `Hoàn tác`, `Làm lại`) nằm gọn gàng tại thanh đáy.
- **Khu vực ít dùng (Góc trên cùng bên trái - Top-Left Header)**:
  - Biểu tượng bánh răng ⚙️ (`#btnHeaderSettings`) dành riêng cho **Bảng Cài Đặt Hệ Thống & Trợ Giúp** (Danh pháp Y khoa Vi/En/La, Chế độ PBR, Âm thanh, Bản quyền CC BY-NC-SA 4.0).
  - Tách bạch 100% Cài đặt khỏi nút chuyển đổi Sáng / Tối.

---

### 3. CHẤT LƯỢNG KỸ THUẬT & CHUẨN Y KHOA PBR
- **Mạch máu**: Tuyệt đối không dùng `clearcoat` bóng dầu tạo vệt phản quang như ống nhựa PVC. Bắt buộc dùng tán xạ mô mềm (adventitial diffuse), `roughness: 0.52 - 0.54`, màu sắc mô sống sinh lý (Động mạch đỏ thẫm giàu oxy `0x9E2020`, Tĩnh mạch xanh tím than deoxygenated `0x24426E`).
- **Nội tạng & Dạ dày**: Bật `side: THREE.DoubleSide` và depth write đầy đủ, tuyệt đối không để thủng xuyên thấu thấy nền trắng.
- **Hạch bạch huyết**: Không rải hạt bi xanh neon lơ lửng khắp cơ thể khi xem các tạng riêng lẻ; dùng màu xanh rêu ô-liu mềm mờ sinh học `0x4A7C59` với độ mờ nhẹ `opacity: 0.75`.
- **Nút AI chạy theo**: Phải luôn luôn hiện diện trên màn hình, hỗ trợ chạm để mở thanh lệnh trong suốt và ấn giữ kéo thả di chuyển tự do.

---

### 4. NGUYÊN TẮC HỎI & XIN PHÉP TRƯỚC KHI LÀM
- Không tự ý thay đổi bố cục lớn hoặc cấu trúc hệ thống nếu chưa trình bày rõ phương án và được người dùng xác nhận "Đồng ý".
- Không tự ý đẩy (push) code lên mạng khi người dùng chưa bảo "đẩy".

---

### 5. KHÔNG LẶP LẠI THÔNG BÁO ĐÃ CUNG CẤP (NON-REPEATING NOTIFICATIONS)
- **Quy tắc tuyệt đối:** Những thông báo cấp quyền (như Microphone) hoặc trạng thái mà người dùng đã thấy / đã xử lý thì CẤM TUYỆT ĐỐI việc lặp lại hay spam cảnh báo trong cùng một phiên làm việc.
- Kiểm tra cờ lưu phiên (`sessionStorage.getItem('mic_perm_denied')` / `mic_perm_notified`), nếu đã thông báo 1 lần thì tự động bỏ qua, chỉ focus vào ô gõ phím.

---

### 6. PHÂN BIỆT THỊ GIÁC & ĐỒNG BỘ TYPOGRAPHY (TYPOGRAPHIC HIERARCHY)
- **Tên chính giải phẫu**: Bắt buộc in đậm (`font-weight: 600`).
- **Phần chú thích / danh pháp trong ngoặc đơn**: CẤM IN ĐẬM, bắt buộc dùng chữ thường (`font-weight: 400 !important; color: #94a3b8 / #64748b; font-size: 0.92em;`). Tuyệt đối không để in đậm cả cụm từ đầu đến đuôi.
- **Loại bỏ chuỗi rác**: Triệt tiêu 100% các ký tự rác như `(????????)` khi không có tên Latinh.

---

## DEPLOYMENT TARGETS
- **GitHub Repository**: `https://github.com/tungtran2510/3d-anatomy.git` (nhánh `master`)
- **Vercel Production Live**: `https://3d-anatomy-atlas-vn.vercel.app`
