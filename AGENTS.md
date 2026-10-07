# QUY TẮC BẤT KHẢ XÂM PHẠM CHO DỰ ÁN ATLAS GIẢI PHẪU 3D (ANATOMY ATLAS)

## 1. QUY TẮC BẮT BUỘC: PLAYWRIGHT MOBILE VIEWPORT (390x844) & GỬI ẢNH TRỰC TIẾP VÀO CHAT
- **Bắt buộc tuyệt đối:** Sau BẤT KỲ một thao tác, tính năng, sửa lỗi, căn chỉnh nút bấm hay văn bản nào: Agent BẮT BUỘC phải dùng trình duyệt (Playwright mobile viewport 390x844) chụp ảnh màn hình giao diện thực tế và **GỬI TRỰC TIẾP HÌNH ẢNH ĐÓ VÀO ĐOẠN CHAT** để người dùng nghiệm thu bằng mắt thường.
- **Cấm tuyệt đối:** CẤM báo cáo chay bằng chữ, cấm phỏng đoán, cấm chỉ đưa đường dẫn file ảnh. Phải nhúng trực tiếp markdown hình ảnh vào câu trả lời để hiển thị trực quan trước mắt người dùng.
- **Chuẩn tinh gọn Mobile-First:** Mọi tính năng, thẻ thông tin, nút bấm phải được tối ưu hoàn hảo trên màn hình điện thoại (390x844), bố cục tinh tế, không có dòng chữ thừa, không thừa thãi hay làm che khuất mô hình 3D.

## 2. NGUYÊN TẮC BẢO VỆ DỰ ÁN & AN TOÀN
- Không tự ý can thiệp hay phá vỡ các luồng dữ liệu y khoa đã kiểm chứng.
- Giữ nguyên tắc Append-only cho các cấu hình cài đặt.
- Luôn kiểm tra build production (`npm run build`) và kiểm thử trực quan trước khi báo cáo hoàn thành.
