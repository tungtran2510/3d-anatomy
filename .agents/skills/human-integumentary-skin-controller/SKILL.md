---
name: human-integumentary-skin-controller
description: Quản trị Hệ Da & Khuôn mặt Người Hoàn Chỉnh (Human Integumentary System, Realistic Facial Skin PBR, Skin Opacity 0-100%, Multi-Layer Skin Dissection).
---

# Human Integumentary Skin Controller (Quản trị Hệ Da & Khuôn mặt Người Hoàn Chỉnh)

## 1. Nguyên tắc cốt lõi (Core Principles)
1. **Hệ Da là Hệ cơ quan Độc lập số 1 (Integumentary System)**:
   - File `public/models/integumentary.glb` là mesh da người hoàn chỉnh (`Skin`), bao gồm khuôn mặt, mắt, mũi, miệng, tai, thân mình và tứ chi.
   - Phải được quản lý như một hệ cơ quan chính thức trong `SYSTEM_IDS`, có toggle và thanh điều khiển độ trong suốt.

2. **Tiêu chuẩn Vật liệu Da Người PBR (`PBR_Skin`)**:
   - `color: 0xD6A389` (sắc da người ấm áp, tự nhiên, khỏe mạnh).
   - `roughness: 0.58` (độ nhám mịn tự nhiên của biểu bì).
   - `metalness: 0.0` (phi kim loại tuyệt đối).
   - `clearcoat: 0.20`, `clearcoatRoughness: 0.35` (độ ẩm tự nhiên của tuyến bã nhờn).
   - `sheen: 0.45`, `sheenColor: 0xfecdd3` (tán xạ hồng hào của mao mạch dưới da).

3. **Cơ chế 3 Trạng thái Hiển thị Da (3-Stage Skin Display)**:
   - **Trạng thái 100% (Da người thật)**: Hiển thị đầy đủ người hoàn chỉnh, khuôn mặt trang nhã, phục vụ giải phẫu bề mặt (surface anatomy).
   - **Trạng thái 35% (Kính mờ xuyên thấu - Frosted Glass)**: Da bán trong suốt, nhìn thấu các khối cơ và khung xương bên trong với chiều sâu quang học chuẩn Visible Body.
   - **Trạng thái 0% (Ẩn da)**: Quan sát thuần túy cơ quan sâu.

4. **Triệt tiêu Hoàn toàn Shader Bóng mờ Rác (Eliminate Ghost Halos)**:
   - Không được dùng shader Fresnel mờ đục với `renderOrder: 99` và `depthWrite: false` đè lên xương.
   - Khi ẩn da hoặc hiển thị da bán trong suốt, phải đảm bảo `depthWrite: true` và `renderOrder` hợp lý để không sinh ra viền bóng mờ xám xanh nhấp nháy quanh xương sọ và xương sườn.

5. **Phẫu tích Lớp Da (Skin Dissection)**:
   - Khi Da đang bật, thao tác "Bóc tách" trên Da sẽ bóc tách lớp da ngoài $\rightarrow$ làm lộ hệ cơ nông $\rightarrow$ bóc cơ lộ xương và tạng.
