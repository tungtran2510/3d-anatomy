---
name: medical-3d-motion-video-director
description: Đạo diễn Video & Hoạt ảnh Chức năng Sinh lý 3D (Medical 3D Functional Animation, Cardiac/Respiratory/GI Cycles, Biomechanics Timeline Scrubbing, Clinical Video Media).
---

# Medical 3D Motion & Video Director (Đạo diễn Video & Hoạt ảnh Chức năng 3D)

## 1. Nguyên tắc cốt lõi (Core Principles)
1. **Hoạt ảnh Sinh lý học Thời gian thực (Real-time Physiological Cycles)**:
   - Các chuyển động trong `src/viewer/dynamicAnatomy.js` phải phản ánh chính xác cơ học sinh học:
     - **Chu kỳ Tim (Cardiac Cycle)**: Tâm thu (co bóp tống máu) $\rightarrow$ Tâm trương (giãn đổ đầy máu).
     - **Cơ chế Hô hấp (Respiratory Mechanics)**: Hít vào (cơ hoành hạ, lồng ngực nở, phổi dãn) $\rightarrow$ Thở ra (phổi co hồi thụ động).
     - **Nhu động Tiêu hóa (Peristalsis)**: Sóng co bóp đẩy khối thức ăn từ thân vị xuống hang môn vị.
     - **Cơ sinh học Khớp (Joint Biomechanics)**: Gập, duỗi, dạng, khép, xoay khớp gắn liền nhóm cơ chủ vận (agonist) và đối vận (antagonist).

2. **Điều khiển Timeline Hoạt ảnh (Timeline Scrubbing)**:
   - Cho phép người dùng tạm dừng, tua chậm, kéo thanh trượt timeline để nghiên cứu từng thì giải phẫu cụ thể.
   - Khi chạy hoạt ảnh, không làm đơ giật UI và không gây rò rỉ bộ nhớ (zero idle overhead).

3. **Tích hợp Video Giải phẫu & Phẫu thuật Vi mô**:
   - Mỗi cấu trúc trọng yếu có video hoạt ảnh 3D mô phỏng chức năng hoặc video nội soi/phẫu thuật y khoa bổ trợ trực quan.
