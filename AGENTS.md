# 🤖 ANTIGRAVITY & AGENTS CONTEXT & PROGRESS TRACKER

> **Dự án:** LoveSpace - Ứng Dụng Cặp Đôi (Couple Web/PWA)  
> **Workspace Root:** `c:\Code\family`  
> **Mục đích file này:** Là file context và nhật ký tiến độ bắt buộc đọc ở mỗi phiên làm việc để AI Agent nắm rõ kiến trúc, trạng thái công việc, những gì đã hoàn thành và những bước tiếp theo cần triển khai.

---

## 📌 QUY TẮC PHÁT TRIỂN BẮT BUỘC (MANDATORY RULES)
1. **Kiến trúc Feature-Driven (Vertical Slices):**
   - Mọi tính năng nằm trong `src/features/<feature-name>/` (bao gồm components, hooks, types, constants).
   - Tái sử dụng components dùng chung trong `src/components/ui/`.
2. **Local-First & Offline Resilience:**
   - Đảm bảo app luôn chạy mượt 100% với LocalStorage / Mock data khi chưa có Supabase key.
   - Khi có Supabase key, tự động sync 2 chiều realtime.
3. **Thẩm mỹ Cao Cấp (Mobile-First Pastel Romance):**
   - Giao diện glassmorphism, tone màu ấm áp, bo góc mềm mại, icon sắc nét (Lucide Icons), hiệu ứng chuyển động mượt (Framer Motion).
   - Hỗ trợ đầy đủ hiệu ứng âm thanh (Audio Web API) và rung phản hồi (Haptic).
4. **Cập nhật Progress Log:**
   - Sau mỗi bước code/tính năng hoàn thành, Agent PHẢI cập nhật mục ** Nhật Ký Tiến Độ (Development Changelog)** bên dưới.

---

## 🗺️ ROADMAP & TRẠNG THÁI TIẾN ĐỘ (PROGRESS TRACKER)

- [x] **Phase 0: Lập Kế Hoạch & Kiến Trúc**
  - [x] Tạo `PLAN.md` (Chi tiết toàn bộ tính năng & yêu cầu của vợ)
  - [x] Tạo `TECH_STACK.md` (Công nghệ sử dụng & cam kết 100% miễn phí)
  - [x] Tạo `PREPARATION.md` (Hướng dẫn lấy key Supabase, Cloudinary, OneSignal, Vercel)
  - [x] Tạo `PROJECT_STRUCTURE.md` (Cấu trúc thư mục chuẩn Senior Clean Architecture)
  - [x] Tạo `AGENTS.md` / `ANTIGRAVITY.md` (Quy tắc & file theo dõi tiến độ)

- [x] **Phase 1: Khởi Tạo Dự Án & Cấu Hình Nền Tảng (Project Initialization & Core Setup)**
  - [x] Khởi tạo Vite + React + TypeScript + Tailwind CSS
  - [x] Cấu hình PWA (`vite-plugin-pwa`, `manifest.json`, icon & meta tags)
  - [x] Xây dựng Atomic UI Components (`Button`, `Card`, `Modal`, `Input`, `Badge`, `Avatar`, `Lightbox`, `Confetti`)
  - [x] Xây dựng App Layout & Bottom Navigation Bar mượt mà cho Mobile
  - [x] Xây dựng hệ thống State Management & Mock Data ban đầu (`initialMockData.ts`, `useLocalStorage.ts`, `useAudio.ts`, `useHaptic.ts`)

- [x] **Phase 2: Phát Triển Các Module Cốt Lõi (Core Features)**
  - [x] **Dashboard & Love Counter:** Đếm ngày yêu, Hero hình ảnh cảm xúc đối phương, Nút tương tác 1 chạm (Thả tim, Nhắc uống nước, Hôn), SOS Dỗi Hờn.
  - [x] **Mood & Visual Status:** Chọn tâm trạng, Kho Meme mặc định (Mèo dỗi, Capybara, Panda...), Chụp ảnh selfie biểu cảm, Tải ảnh thật.
  - [x] **Health & Care Profile:** Tình trạng bệnh, Toa thuốc & báo giờ uống, Danh sách dị ứng, Món ghét vs Món khoái khẩu dỗ dành, Chu kỳ con gái.
  - [x] **Food & Places Wishlist:** Danh sách quán ăn/chỗ chơi (địa chỉ, mức giá, món ngon, maps), Vòng quay may mắn "Hôm nay ăn gì?".
  - [x] **Shared To-Do List:** Việc hôm nay, kế hoạch tương lai, phân công công việc, pháo hoa khi hoàn thành.

- [x] **Phase 3: Module Nâng Cao & Giao Tiếp (Advanced & Communication)**
  - [x] **Couple Messenger:** Khung chat 1-1 riêng tư, gửi tin nhắn, gửi ảnh/meme, thả reaction cảm xúc, ghim tin nhắn yêu thương.
  - [x] **Kho Ảnh Kỷ Niệm (Memory Gallery):** Lưu ảnh theo ngày tháng, ghi chú kỷ niệm, tag địa điểm; Tìm kiếm thông minh theo từ khóa note & lọc theo địa điểm.
  - [x] **Nút Đổi Vai Người Dùng (Role Switcher):** Chuyển đổi mượt mà giữa Chồng 🐻 và Vợ 🐰 để test và sử dụng chung trên 1 thiết bị.

- [x] **Phase 4: Tích Hợp Supabase Realtime & Cloud Storage (Khi người dùng dán Key vào .env)**
  - [x] Đã tạo sẵn SQL Migrations Schema: `supabase/migrations/001_initial_schema.sql`
  - [x] Điền `VITE_SUPABASE_URL` và `VITE_SUPABASE_ANON_KEY` vào file `.env`
  - [x] Tích hợp Cloudinary Cloud Storage vào Memory Gallery, Chat và Mood Picker
  - [x] Đã tự động chạy Migration & thiết lập RLS Policies trên Supabase Database
  - [x] Hoàn thiện tích hợp 2 chiều Supabase Realtime Sync WebSockets trên toàn bộ ứng dụng
  - [x] Tích hợp OneSignal Web Push SDK (App ID: 497cba6f-e415-4cdd-aba4-d11d386e3440) & OneSignal Service Worker

---

## 📝 NHẬT KÝ TIẾN ĐỘ (DEVELOPMENT CHANGELOG)

### 📅 [2026-08-29] - Tích hợp Hệ Thống Thông Báo Đẩy (Push Notifications) & Realtime Toàn Diện
- Tích hợp OneSignal Web SDK v16 & Service Worker nền (`OneSignalSDKWorker.js`).
- Triển khai **Native System Push Notification** cho toàn bộ 100% các hành động tương tác và sự kiện dữ liệu giữa 2 người:
  1. 💬 **Tin nhắn chat mới:** Báo tiêu đề người gửi + nội dung tin/ảnh.
  2. ❤️ **Thả tim 1-chạm:** Báo "Đã gửi 1 triệu trái tim" + pháo hoa confetti.
  3. 💋 **Gửi nụ hôn:** Báo "Nụ hôn ngọt ngào Chụt" + âm thanh hôn.
  4. 🥛 **Nhắc uống nước:** Báo chuông nhắc nhở uống nước ấm.
  5. 🫂 **Cái ôm ấm áp:** Báo cái ôm kèm rung phản hồi.
  6. 💊 **Nhắc uống thuốc:** Báo đích danh tên thuốc cần uống.
  7. ✨ **Đổi tâm trạng & meme:** Báo caption tâm trạng mới.
  8. 🎉 **Hoàn thành việc chung (To-do):** Báo tên việc vừa hoàn thành.
  9. 🍽️ **Thêm quán ăn mới:** Báo tên quán và thể loại vào wishlist.
  10. 📸 **Lưu kỷ niệm mới:** Báo ghi chú khoảnh khắc kỷ niệm mới.
- Thêm nút kích hoạt nhanh quyền thông báo (Chuông thông minh) trên thanh điều hướng đầu trang (`TopHeader.tsx`).

### 📅 [2026-08-29] - Tinh Chỉnh Full CRUD & Chuẩn Hóa Logic Đổi Mood / Thông Báo
- **Chuẩn hóa Logic Đổi Tâm Trạng (Mood Picker):**
  - Tab **"Người Yêu"**: Chỉ hiển thị trạng thái của đối phương, không có nút sửa (vì không thể sửa tâm trạng thay người khác), chỉ có nút tương tác Thả tim & Nhắn tin.
  - Tab **"Bạn (Tôi)"**: Hiển thị nút **"✨ Đổi Mood Của Bạn"** để cập nhật trạng thái / ảnh meme cá nhân.
- **Nâng Cấp Nút Chuông Thông Báo Đẩy:**
  - Bổ sung Toast phản hồi trực quan trên màn hình báo trạng thái Bật/Chặn quyền thông báo.
  - Thêm đèn báo trạng thái: Xanh (Đã cấp quyền), Vàng (Chưa cấp quyền), Đỏ (Đang bị chặn).
- **Hoàn Thiện 100% Full CRUD (Thêm, Xóa, SỬA):**
  - **Việc cần làm (To-Dos):** Thêm modal sửa chi tiết tên, phân loại, người làm, hạn chót.
  - **Quán ăn & Điểm đến (Places):** Thêm modal chỉnh sửa toàn diện thông tin quán.
  - **Kho ảnh kỷ niệm (Memory Gallery):** Thêm nút sửa câu chuyện, ngày tháng, địa điểm.
  - **Toa thuốc (Health Care):** Thêm / Xóa / Nhắc nhở theo từng loại thuốc.
