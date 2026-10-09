# QUY TẮC BẤT KHẢ XÂM PHẠM CHO DỰ ÁN ATLAS GIẢI PHẪU 3D (ANATOMY ATLAS)

## 1. TUYỆT ĐỐI CẤM BÁO CÁO VĂN BẢN - CHỈ BÁO CÁO BẰNG HÌNH ẢNH THỰC TẾ TRÊN MOBILE (390x844)
- **Cấm tuyệt đối báo cáo văn bản:** CẤM TUYỆT ĐỐI viết báo cáo phân tích, liệt kê, giải thích dài dòng bằng chữ. Người dùng KHÔNG đọc văn bản dài.
- **Bắt buộc 100% bằng hình ảnh thực tế:** Mọi nghiệm thu, kết quả, tiến độ BẮT BUỘC chụp ảnh màn hình giao diện thực tế (Playwright Mobile 390x844) và nhúng/gửi trực tiếp ảnh vào đoạn chat.
- **Text đi kèm tối đa 1 dòng:** Lời thoại đi kèm chỉ tối đa 1 câu ngắn hoặc câu hỏi bước kế tiếp. Cấm dông dài.

## 2. QUY TẮC CHUẨN 1 DÒNG & BẢO TOÀN KHUNG HÌNH (STRICT 1-LINE & ZERO CLIPPING)
- **Chuẩn 1 dòng duy nhất:** Tiêu đề, thẻ badge, tên bộ phận, nút tab/pill, mô tả ngắn bắt buộc phải nằm gọn gàng trên **1 DÒNG DUY NHẤT**. Tuyệt đối không để rớt sang dòng thứ hai hay bị cắt chữ lửng lơ (`...`, `TUẤ...`, `4 Cấp `). Đặt tên ngắn gọn, chuẩn y khoa, súc tích.
- **Tuyệt đối không mất màn hình / che khuất:** Mọi khung card, slide deck, thanh trượt mô phỏng phải có kích thước gọn gàng, tỷ lệ cân đối, nằm vừa vặn trong tầm nhìn màn hình điện thoại (390x844). Tuyệt đối cấm để dài lưa thưa, phình to chiếm hết màn hình hoặc trồi sụt làm che mất mô hình 3D hay mất đầu mất đuôi ảnh slide.
- **Cấm dòng thừa:** Loại bỏ triệt để mọi câu giải thích rườm rà, các khối text thừa thãi. Trực quan bằng hình ảnh, biểu tượng và tương tác chuyển động thông minh.

## 3. NGUYÊN TẮC TỰ SOI LỖI & HOÀN THIỆN TRƯỚC KHI BÁO CÁO (SELF-INSPECT BEFORE REPORTING)
- Sau khi chụp ảnh màn hình Playwright, Agent BẮT BUỘC phải tự mở ảnh (`view_file`) kiểm tra từng pixel:
  - Chữ có bị rớt dòng không?
  - Ảnh slide có bị che lấp / mất khung / đen màn hình không?
  - Nút bấm, thanh trượt có nằm gọn gàng, tinh tế không?
- Nếu còn bất kỳ lỗi nào: TỰ ĐỘNG SỬA NGAY, kiểm thử lại đến khi hoàn hảo 100% rồi mới được báo cáo cho người dùng.

## 4. NGUYÊN TẮC BẢO VỆ DỰ ÁN & AN TOÀN
- Không tự ý can thiệp hay phá vỡ các luồng dữ liệu y khoa đã kiểm chứng.
- Giữ nguyên tắc Append-only cho các cấu hình cài đặt.
- Luôn kiểm tra build production (`npm run build`) và kiểm thử trực quan trước khi báo cáo hoàn thành.
- Không tự ý push code lên GitHub/Vercel khi người dùng chưa bảo "Đẩy lên".
