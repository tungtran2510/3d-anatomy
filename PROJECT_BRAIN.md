# ANATOMY ATLAS 3D - PROJECT BRAIN & SUPREME RULES
> **Trạng thái**: ACTIVE  
> **Cập nhật lần cuối**: 2026-10-08  

---

## QUY TẮC TỐI CAO BẮT BUỘC CHO MỌI AGENT (SUPREME MANDATORY RULES)

### 1. TUYỆT ĐỐI CẤM BÁO CÁO VĂN BẢN - CHỈ BÁO CÁO BẰNG HÌNH ẢNH THỰC TẾ (STRICT ZERO-TEXT & IMAGE-ONLY REPORTING)
- **Cấm tuyệt đối báo cáo văn bản:** CẤM TUYỆT ĐỐI viết báo cáo bằng văn bản dài dòng, phân tích liệt kê bằng chữ lê thê ("đã làm xong", các mục gạch đầu dòng chữ dài). Người dùng KHÔNG đọc văn bản dài dòng.
- **Bắt buộc báo cáo 100% bằng hình ảnh thực tế:** Mọi nghiệm thu, kết quả, tiến độ BẮT BUỘC chụp ảnh màn hình thực tế (Playwright Mobile 390x844) và nhúng trực tiếp hình ảnh vào chat (`![Mô tả ảnh](file:///đường/dẫn/ảnh.png)`).
- **Text kèm theo tối đa 1 dòng:** Lời thoại đi kèm chỉ tối đa 1 dòng ngắn hoặc câu hỏi xin ý kiến bước tiếp theo. Không giải thích dông dài.
- **Quy trình chuẩn:** `THỰC HIỆN` ➔ `CHỤP ẢNH PLAYWRIGHT MOBILE 390x844` ➔ `GỬI HÌNH ẢNH VÀO CHAT` ➔ `HỎI Ý KIẾN BƯỚC TIẾP THEO (1 DÒNG)`.

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

### 7. CHUẨN TÍCH HỢP VIDEO & PLAYLIST Y KHOA (YOUTUBE EMBED & MAPPING)
- **Chuẩn nhúng YouTube Playlist**: Không dùng URL trang web thông thường do hạn chế X-Frame-Options; bắt buộc nhúng qua: `https://www.youtube.com/embed/videoseries?list=${playlistId}&rel=0&enablejsapi=1`.
- **4 vị trí phân bổ bắt buộc**:
  1. **Thư viện Media (Atlas Hub)**: Kệ nổi bật số 1 (`medical_training_playlists`) gồm 8 playlist y khoa chuẩn mực với thumbnail, badge và đếm số lượng.
  2. **Chuyên đề Tự Học & Lớp Học 3D**: Segmented tab số 2 (`🎬 8 Video Đào Tạo`) hiển thị danh mục thẻ playlist 1 chạm xem ngay.
  3. **Flashcard bước học (Study Mode)**: Tích hợp nút `🎬 Video bài giảng` và nút `🎯 Thử thách 3D` trực tiếp trên thẻ bài giảng giải phẫu.
  4. **Bảng thông tin chi tiết (InfoPanel)**: Gắn thẻ video giải phẫu + nút phụ dinh dưỡng y khoa `🥗 Ăn Uống & Dinh Dưỡng Khoa Học ▶` cho tạng tiêu hóa. Tuyệt đối không gắn nhãn thương hiệu riêng biệt.
- **Dự phòng mở ngoài**: Tự động hiển thị nút `YouTube ↗` để người dùng có thể mở thẳng danh sách trên app YouTube khi cần.

---

### 8. VẬN HÀNH BỘ MÁY GIAO DIỆN & TƯƠNG TÁC (LIFECYCLE & INTEGRATION RUNBOOK)
- **Khởi tạo UI không chặn (Unblocked UI Initialization)**: Toàn bộ DOM listener, Navigation Drawer, Selection Controller và Theme Switcher phải được khởi tạo trước hoặc song song với quá trình tải model GLTF (`skeletal.glb`). Đảm bảo thanh đáy và các menu phản hồi ngay lập tức (<100ms), không bị đóng băng khi tải mạng 3G/4G.
- **Tiền nạp giọng đọc tiếng Việt (Web Speech API Voice Preload)**: Do hàm `speechSynthesis.getVoices()` trên WebKit/Blink là bất đồng bộ và trả về rỗng trong vài trăm mili-giây đầu, hệ thống sử dụng module `speechVoice.js` với sự kiện `onvoiceschanged` để lưu đệm trước các giọng `vi-VN`, triệt tiêu hoàn toàn lỗi rơi về giọng tiếng Anh mặc định.
- **Liên kết đánh dấu Đã lưu ⭐ đồng bộ**: Nút `#cardBookmarkBtn` tại tiêu đề bảng chọn 3D kết nối trực tiếp hai chiều với danh mục `#bookmarksList` trong ngăn kéo `Hệ cơ quan › Đã lưu`.
- **Mở rộng động học khớp (Expanded 3D Joint Kinematics)**: Hỗ trợ đầy đủ các vùng vận động chính: Gối, Vai, Háng, Khuỷu, Cột sống thân mình, Cột sống cổ, Khớp cổ chân, Khớp cổ tay, và Khớp thái dương hàm (TMJ).

---

## DEPLOYMENT TARGETS
- **GitHub Repository**: `https://github.com/tungtran2510/3d-anatomy.git` (nhánh `master`)
- **Vercel Production Live**: `https://3d-anatomy-atlas-vn.vercel.app`

