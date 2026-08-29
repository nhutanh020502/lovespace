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

### 📅 [2026-08-30] - Đại Tu Toàn Diện Giao Diện (Romantic Luxury UI/UX & Hiệu Ứng Độc Lạ)
- **🌌 Nền Cực Quang Tình Yêu Động (Romantic Aurora Mesh Background):** Tự động đổi sắc thái theo 4 buổi trong ngày (Sáng ban mai, Chiều hồng phấn, Hoàng hôn cam hồng, Đêm ngàn sao).
- **✨ Vệt Trái Tim & Bụi Sao Tương Tác (Particle Heart Trail):** Chạm/lướt ngón tay làm bùng nở các hạt tim và bụi sao bay bổng.
- **⏱️ Bộ Đếm Ngày Yêu Sống Động:** 3 vòng sóng trái tim nhịp đập (`animate-heartwave`), đồng hồ giây thời gian thực, thanh tiến trình cột mốc (100 ngày, 1 năm, 1000 ngày...).
- **🪞 Thẻ Kính Hologram Ánh Kim:** Viền thẻ phản chiếu ánh sáng óng ánh, vầng hào quang tâm trạng đổi màu theo cảm xúc đối phương.
- **🚀 Thanh Điều Hướng Đáy Nổi Dynamic Island (Floating Bubble Dock):** Viên nang trượt nước lướt êm ái giữa các tab bằng `framer-motion` kèm rung phản hồi Haptic.
- **📸 Kho Ảnh Polaroid Vintage:** Khung ảnh nghệ thuật kèm băng dính washi tape và hiệu ứng zoom mượt mà.
- **📱 Cập nhật Web & File `LoveSpace.apk` Mới Nhất:** Tải về và triển khai trực tiếp trên Vercel.

### 📅 [2026-08-29] - Nâng Cấp Kho Kỷ Niệm (Chụp Ảnh Camera Liền, Tự Động Định Vị GPS & 2 Tab)
- **📸 Chụp Ảnh Camera 1-Chạm:** Bấm nút chụp là mở thẳng camera thiết bị chụp và upload tự động.
- **📍 Tự Động Lưu Địa Chỉ GPS:** Tích hợp Geolocation và Nominatim OpenStreetMap tự động lấy tên đường, quận, thành phố khi chụp ảnh.
- **🔗 Dán Link Ảnh Trực Tiếp & Link Địa Điểm:** Hỗ trợ nhập URL ảnh từ internet và link Google Maps / TikTok review.
- **🗂️ Phân Chia 2 Tab Riêng Biệt:** 
  - `📸 Ảnh Kỷ Niệm Đôi 💕` (Ảnh selfie, khoảnh khắc ngọt ngào 2 người).
  - `🍽️ Điểm Hẹn & Ăn Chơi 🌴` (Check-in quán ăn, du lịch, tiệm cà phê).
- **📱 Build và Cập Nhật File Cài Đặt `LoveSpace.apk` Trực Tiếp:** Tải về máy từ web với 1 click.
- **✨ Tối Ưu Font Chữ & Responsive Toàn Diện:** Font `Plus Jakarta Sans` chuẩn tiếng Việt và Header co giãn mượt mà.
