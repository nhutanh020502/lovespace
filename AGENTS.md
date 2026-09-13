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
  - [x] **Cùng Nhau Học Từ Vựng (LoveVocab):** 10 từ mỗi ngày, Flashcard 3D lật mặt, Phát âm giọng bản xứ Web Speech API, Mini Quiz trắc nghiệm đôi, Bảng thi đua Chồng 🐻 vs Vợ 🐰, Nút "Ủn mông học bài 🚀", Hộp quà bí mật khi cả hai hoàn thành, Chuỗi ngày học Streak 🔥.

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

### 📅 [2026-08-30] - Ra Mắt Module "Kế Hoạch & Lịch Trình Hẹn Hò / Du Lịch Dài Ngày" (Dating & Travel Planner)
- **📋 Bảng Kế Hoạch 3 Cột Chuẩn Yêu Cầu:**
  - Cột Thời gian linh hoạt với ghi chú vui nhộn (VD: *tại cục chồng hay đi trễ*).
  - Cột Lịch trình hoạt động kèm kho Emoji đa dạng, tên quán/hoạt động, ghi chú và link Google Maps.
  - Cột Dự trù ngân sách (`~250 - 300k`, `200k`, `0đ tại có cục chồng chở`...).
  - Dòng tổng kết chi phí dự kiến nổi bật màu vàng cam pastel ở đáy bảng.
- **✨ Chế Độ Xem Đôi Linh Hoạt:** Chuyển đổi 1-chạm giữa **Bảng Kế Hoạch (Table View)** và **Dòng Thời Gian Tình Yêu (Timeline View)** kèm nút tick hoàn thành chặng.
- **🌴 Hỗ Trợ Chuyến Đi Dài Ngày (Multi-Day Trips: 2N1Đ, 3N2Đ...):** Phân chia tab theo từng ngày (Ngày 1, Ngày 2, Ngày 3...), lưu thông tin khách sạn/homestay và phương tiện di chuyển.
- **🎒 Danh Sách Xếp Đồ Vào Vali (Packing Checklist):** Quản lý đồ cần mang theo, phân công Chồng/Vợ và theo dõi thanh tiến độ xếp đồ %.
- **📁 Kho Lưu Trữ Kỷ Niệm & Nhân Bản (History Archive & Clone):** Lưu lại mọi lịch trình đã đi trong quá khứ; 1-click **"Nhân bản kế hoạch"** để đi lại chuyến đi yêu thích vào ngày mới.
- **🔄 Đồng Bộ Supabase Realtime & Push Notification:** Tự động tạo bảng `dating_plans` trên Supabase và đồng bộ 2 chiều tức thì giữa 2 người.
- **📱 Cập nhật file cài đặt Android `LoveSpace.apk` và deploy lên Vercel.**

### 📅 [2026-08-30] - [CRITICAL FIX] Sửa Triệt Để Lỗi Reset Ngày Yêu & Cài Đặt Không Gian Yêu (Cloud Persistence 2 Chiều)
- **Nguyên nhân gốc rễ (Root Cause):** Trước đây khi đổi ngày yêu (`anniversaryDate`), biệt danh hay avatar trong `SettingsModal`, app chỉ mới lưu vào state local `settings` mà chưa cập nhật đồng thời lên bảng `couples` trên Supabase và `authSession`. Khi người dùng reload trang hoặc partner đăng nhập từ máy khác, app tự lấy ngày mặc định `2023-02-14` từ bản ghi couple cũ ghi đè lại.
- **Giải pháp xử lý:**
  1. Chạy migration bổ sung cột `partner1_avatar`, `partner2_avatar`, `settings` trên bảng `couples` của Supabase Database.
  2. Thêm hàm `updateCoupleSettings()` và `fetchCoupleById()` trong `supabaseSync.ts`.
  3. Tích hợp đồng bộ 2 chiều: Khi đổi ngày yêu, biệt danh, avatar trong Settings -> Tự động cập nhật `authSession` và cập nhật trực tiếp lên Supabase.
  4. Lắng nghe `postgres_changes` trên bảng `couples` trong Supabase Realtime để khi 1 người đổi ngày yêu/ảnh đại diện thì máy người kia lập tức cập nhật theo thời gian thực.
  5. Khi khởi động app, `loadCloudData()` tự động tải ngày yêu mới nhất từ Cloud, bảo đảm **KHÔNG BAO GIỜ BỊ RESET** về mặc định nữa!

### 📅 [2026-08-30] - Tính Năng Phản Hồi / Trả Lời Trực Tiếp Lời Nhắn & Mood Đối Phương (Quote Reply in Chat)
- **Hiển thị Lời Nhắn Không Cần Ảnh:** Khi không có ảnh, khung thư tình bóng kính pastel `💬 Lời nhắn từ [Biệt danh]` vẫn hiển thị tuyệt đẹp với icon cảm xúc to rõ.
- **Nút "Nhắn Tin Ngay" 1-Chạm Rep Lời Nhắn:** Bấm "Nhắn Tin Ngay" ở Dashboard sẽ tự động chuyển sang tab Chat kèm banner trích dẫn đang rep lời nhắn của đối phương.
- **Khung Bong Bóng Chat Trích Dẫn Chuẩn Sang Trọng:**
  - Tin nhắn gửi đi sẽ đính kèm trích dẫn nguyên vẹn thẻ cảm xúc: Biệt danh, Emoji tâm trạng, Lời nhắn trích dẫn (hoặc thumbnail ảnh nếu có).
  - Phản hồi bên dưới hiển thị rõ ràng nội dung câu trả lời.
  - Đồng bộ 2 chiều qua Supabase Realtime WebSocket với cột `reply_to_mood JSONB`.

### 📅 [2026-08-30] - [FIX] Tải File `LoveSpace.apk` Trực Tiếp Thay Vì `index.html`
- **Nguyên nhân gốc rễ:** Do trước đó file APK cũ bị lồng đệ quy lên tới >100MB và bị `.gitignore` chặn đẩy lên git, dẫn đến Vercel không có file `.apk` và rewrite trả về file `index.html`.
- **Giải pháp:** Tối ưu hóa bộ build APK Android thành file cài đặt siêu nhẹ (chỉ **4.6MB**), đã ký sẵn chứng chỉ debug và đẩy trực tiếp lên thư mục `public/LoveSpace.apk` trên Vercel. Bây giờ bấm nút "Tải File APK" sẽ tải ngay file APK thật 100%.

### 📅 [2026-09-12] - Nâng Cấp Toàn Diện UI Theo Motion Wizard (`SKILL.md`) & Xóa Sạch 100% Dữ Liệu Mẫu
- **🪄 Triển khai Chuẩn Motion Wizard (`frontend-motion-wizard-v1`):**
  - **Calibrated Spring Physics:** Chuẩn hóa toàn bộ hiệu ứng chuyển động với thông số lò xo vật lý (`stiffness: 400, damping: 30`), phản hồi xúc giác chạm (`whileTap={{ scale: 0.97 }}` / `whileHover={{ scale: 1.015 }}`).
  - **100% GPU-Accelerated Transforms:** Loại bỏ hoàn toàn việc animate `width`/`height` (gây layout reflows); chuyển sang dùng `scaleX`, `scale`, `opacity`, `x`, `y` với origin chuẩn.
  - **Shared Layout Tracks (`layoutId`):** Áp dụng dynamic sliding pill trên tất cả các thanh tab và segmented controls:
    - `BottomNav`: Dynamic island floating dock lướt êm ái.
    - `PartnerStatusHero`: Chuyển đổi góc nhìn "Người yêu" vs "Bạn".
    - `PlacesView`: Bộ lọc loại địa điểm và danh mục ăn uống.
    - `MemoryGalleryView`: Chuyển đổi tab Album Kỷ niệm vs Bản đồ / Dòng thời gian.
    - `DatingPlanView` & `PlanDetailView`: Chuyển tab trạng thái kế hoạch, ngày hẹn hò và chế độ xem (Bảng vs Timeline).
    - `HealthCareView`: Chuyển đổi hồ sơ chăm sóc Chồng 🐻 vs Vợ 🐰.
  - **Breakpoint-Adaptive Overlays & AnimatePresence:** Cấu hình `<AnimatePresence mode="wait">` và `mode="popLayout"` cho `Modal`, `Lightbox`, danh sách To-do, tin nhắn Chat và thẻ kế hoạch.
- **🧹 Xóa Sạch 100% Dữ Liệu Mẫu Hardcoded (Clean Slate Production-Ready):**
  - Đã làm sạch toàn bộ mảng mẫu fix cứng trong `initialMockData.ts` và `initialPlans.ts` (`INITIAL_MESSAGES = []`, `INITIAL_MEMORIES = []`, `INITIAL_PLACES = []`, `INITIAL_TODOS = []`, `INITIAL_PLANS = []`, `INITIAL_BUDGET = []`).
  - Xóa bỏ các giá trị placeholder fix cứng trong Hồ sơ sức khỏe (thuốc, dị ứng, món ghét, món khoái khẩu, lời dặn dò, chu kỳ mẫu).
  - Bổ sung cơ chế tự động dọn dẹp các ID mẫu cũ (`msg_1..4`, `mem_1..3`, `place_1..4`, `todo_1..3`, `plan_3108`) đã lưu trong `localStorage` tại `App.tsx` khi khởi động app.
  - Thiết kế các màn hình trạng thái rỗng (Empty States) tuyệt đẹp, ấm áp và lãng mạn cho tất cả các tính năng khi chưa có dữ liệu.

### 📅 [2026-09-12] - [CRITICAL FIX] Sửa Lỗi Trùng Avatar & Rà Soát Sâu Toàn Diện FE - BE (Codex-Grade Review)
- **🩹 Khắc Phục Triệt Để Lỗi Trùng Avatar (Chồng & Vợ hiển thị cùng 1 ảnh gấu):**
  - *Root Cause:* Logic gán avatar trong `onAuthSuccess` và `loadCloudData` bị sai nhánh ternary khi đăng nhập vai Chồng, dẫn đến ảnh Chồng bị gán đè vào Vợ và ghi đè cả 2 cột `partner1_avatar` & `partner2_avatar` trên Supabase.
  - *Giải pháp:* Tách bạch 100% việc ánh xạ avatar theo vai trò; bổ sung cơ chế Auto-heal tự động phát hiện và khôi phục ảnh Vợ khi khởi động app đồng thời dọn dẹp Supabase; bổ sung nút "Ảnh gốc" và cảnh báo trùng ảnh trong `SettingsModal`; thêm fallback ảnh an toàn khi lỗi trong `Avatar.tsx`.
- **🛠️ Khắc Phục Triệt Để Lỗi Thả Trôi Dữ Liệu Supabase (UUID v4 Migration):**
  - Xây dựng utility `uuidUtils.ts` chuẩn RFC4122 v4 (`generateUUID()`).
  - Chuyển đổi 100% cơ chế sinh ID cho Tin nhắn Chat, Việc cần làm (Todos), Địa điểm quán ăn (Places), Kho ảnh kỷ niệm (Memories), Kế hoạch hẹn hò (Plans), Timeline items và Toa thuốc (Medicines).
  - Khắc phục lỗi `update` và `delete` bị Supabase bỏ qua do `!isValidUUID(id)`.
- **⚡ Rà Soát Lỗi Tiềm Ẩn Toàn Bộ 12 Chức Năng:**
  - `upsertMoodStatus`: Kiểm tra bản ghi tồn tại trước khi cập nhật/chèn, loại bỏ phụ thuộc vào `ON CONFLICT` chưa có index trên DB.
  - `QuickInteractionBar`: Mở rộng xử lý broadcast realtime cho 100% các nút tương tác tùy chỉnh (custom interactions), đối phương nhận đầy đủ âm thanh, rung haptic và thông báo.
  - `ChatView`: Bổ sung huy hiệu đếm tin nhắn chưa đọc `unreadChatCount` trên thanh Dock điều hướng.
  - `SharedTodo`: Ngăn chặn thông báo tự gửi cho chính mình khi tạo việc mới.
  - Kiểm thử `npm run build` đạt chuẩn hoàn hảo 0 lỗi.

### 📅 [2026-09-12] - [UI FIX] Tối Ưu Hóa Giao Diện Chat Room (Khắc Phục Lỗi Cuộn Kép, Header Bị Cắt & Khoảng Trống)
- **🩹 Nguyên nhân lỗi trong trang Chat:**
  1. `<main>` có `pb-36` và không khóa chiều cao khi ở tab Chat, kết hợp `h-[calc(100vh-140px)]` bên trong `ChatView` tạo ra **cuộn kép (double scroll)** giữa toàn trang (`window`) và danh sách tin nhắn.
  2. `scrollToBottom()` dùng `scrollIntoView()` trên DOM toàn cục khiến trình duyệt cuộn cả cửa sổ trang, làm đầu trang `ChatView` (thẻ thông tin đối phương) trượt thụt vào bên dưới `TopHeader` và bị cắt xén nửa chừng.
  3. Thanh nhập tin nhắn `InputBar` bị lơ lửng ở giữa màn hình với một khoảng trống lớn ngăn cách với thanh điều hướng đáy `BottomNav`.
- **🛠️ Giải pháp xử lý triệt để:**
  - **Khóa Chiều Cao Viewport Chuẩn Chat App:** Khi `activeTab === 'chat'`, `<main>` tự động chuyển sang `h-[calc(100dvh-54px)] overflow-hidden pb-20 pt-1` và ẩn banner PWA để dành trọn vẹn 100% không gian màn hình cho chat.
  - **Cuộn Nội Bộ Độc Lập:** Chuyển `scrollToBottom` sang dùng `messagesContainerRef.current.scrollTo({ top: scrollHeight })`, triệt tiêu 100% việc giật lag hay cuộn lộn xộn của cửa sổ trang cha.
  - **Cố Định Header & Input Bar:** Thêm `shrink-0` cho Header Info, Pinned Message, Reply Banner và Input Bar; Input Bar áp sát ngay phía trên thanh Dock `BottomNav` tạo cảm giác liền mạch, cao cấp chuẩn ứng dụng Messenger / Telegram.

### 📅 [2026-09-12] - [UI FIX] Triệt Tiêu Khoảng Trống Thừa Đáy Màn Hình Khi Cuộn Đến Cuối Trang (Bottom Gap Elimination)
- **🩹 Nguyên nhân:**
  - Cả `<main>` bên ngoài (`pb-36 sm:pb-44`, tương đương 144px - 176px) và các Component View bên trong ([HealthCareView.tsx](file:///c:/Code/family/src/features/health-care/components/HealthCareView.tsx), [DashboardView.tsx](file:///c:/Code/family/src/features/dashboard/components/DashboardView.tsx), [DatingPlanView.tsx](file:///c:/Code/family/src/features/plans/components/DatingPlanView.tsx), [PlacesView.tsx](file:///c:/Code/family/src/features/places-food/components/PlacesView.tsx), [MemoryGalleryView.tsx](file:///c:/Code/family/src/features/gallery/components/MemoryGalleryView.tsx)) đều mang thêm `pb-20` (80px).
  - Kết quả: Khi cuộn tới cuối trang, tổng khoảng đệm đáy bị cộng dồn lên tới **224px - 256px**, tạo ra một khoảng trống màu hồng khổng lồ bên dưới thẻ cuối cùng trước khi tới thanh điều hướng đáy `BottomNav`.
- **🛠️ Giải pháp xử lý triệt để:**
  - Loại bỏ hoàn toàn `pb-20` dư thừa bên trong tất cả 6 Feature Views.
  - Quy chuẩn hóa duy nhất khoảng đệm đáy an toàn trên thẻ `<main>` là `pb-24` (96px).
  - Vì thanh Dock `BottomNav` có tổng chiều cao + viền đáy khoảng 64px, khoảng đệm thực tế giữa thẻ cuối cùng và thanh Dock khi cuộn hết trang được cân chỉnh hoàn hảo ở mức **~30px** (khoảng thở vàng của thiết kế Mobile-First), vừa khít, gọn gàng và không còn khoảng trống thừa vô lý.

### 📅 [2026-09-12] - [LOGIC FIX] Sửa Lỗi Hiển Thị Thời Gian Cập Nhật Tâm Trạng Luôn Bị Gán "Hôm Nay"
- **🩹 Nguyên nhân:**
  - Trong [PartnerStatusHero.tsx](file:///c:/Code/family/src/features/dashboard/components/PartnerStatusHero.tsx), dòng text được viết fix cứng là: `Cập nhật lúc {formatTimeVi(currentDisplayMood.updatedAt)} hôm nay`.
  - Dù trạng thái tâm trạng được cập nhật từ 10 ngày trước hay bất kỳ thời điểm nào trong quá khứ, giao diện vẫn luôn hiện chữ "hôm nay".
- **🛠️ Giải pháp xử lý triệt để:**
  - Xây dựng hàm định dạng thời gian tương đối thông minh chuẩn tiếng Việt `formatMoodUpdateTime()` trong [dateUtils.ts](file:///c:/Code/family/src/utils/dateUtils.ts):
    - Dưới 1 phút: *"Vừa mới cập nhật"*.
    - Dưới 60 phút: *"Cập nhật [X] phút trước"*.
    - Trong ngày hôm nay: *"Cập nhật lúc HH:mm hôm nay"*.
    - Ngày hôm qua: *"Cập nhật lúc HH:mm hôm qua"*.
    - Trong vòng 7 ngày: *"Cập nhật lúc HH:mm ([X] ngày trước)"*.
    - Từ 7 ngày trở lên: *"Cập nhật ngày dd/MM lúc HH:mm"* (chính xác tuyệt đối với ngày tháng thực tế).

### 📅 [2026-09-12] - [CRITICAL UI FIX] Khóa Cứng Viewport Toàn Trang 100dvh Cho Tab Chat (Xóa Bỏ Cuộn Cắt Header & Che Mất Input Bar)
- **🩹 Nguyên nhân:**
  - Container gốc `App.tsx` có `min-h-screen overflow-x-hidden flex flex-col`. Khi ở tab Chat, `TopHeader` (~54px) + `<main>` tính toán bị lệch khiến toàn bộ cửa sổ trình duyệt `window` có thanh cuộn dọc.
  - Khi người dùng chạm hoặc lướt chuột, cửa sổ `window` bị trượt cuộn xuống: `TopHeader` bị đẩy trượt thụt lên trên (bị mép trên trình duyệt cắt xén mất một nửa), danh sách tin nhắn bị trôi lên đầu (tin nhắn cũ từ tháng 8), thanh nhập tin nhắn bị đẩy tụt xuống dưới đáy màn hình bị che khuất hoàn toàn, và thanh Dock `BottomNav` đè lên tin nhắn.
- **🛠️ Giải pháp xử lý triệt để:**
  - Khóa cứng container gốc của `App.tsx` thành `h-[100dvh] overflow-hidden` khi `activeTab === 'chat'` -> **Triệt tiêu 100% việc cửa sổ trang web bị cuộn**. `window.scrollY` luôn bằng 0 tuyệt đối!
  - `TopHeader` luôn cố định vững chắc 100% trên đỉnh đầu màn hình, không bao giờ bị cắt xén hay che khuất.
  - `<main>` được chuyển sang `flex-1 min-h-0 flex flex-col pb-[76px]` ôm trọn không gian giữa `TopHeader` và thanh Dock `BottomNav`.
### 📅 [2026-09-12] - [UI FIX] Cân Chỉnh Điểm Dừng Cuộn Trang Vượt Qua Thanh Menu Nổi (Bottom Dock Scroll Clearance)
- **🩹 Nguyên nhân:**
  - Trong [App.tsx](file:///c:/Code/family/src/App.tsx), thẻ `<main>` sử dụng class `p-3.5 sm:p-5 pb-24`.
  - Trên các màn hình `>= 640px` (desktop, tablet hoặc cửa sổ thu phóng), utility responsive `sm:p-5` của Tailwind có mức ưu tiên cao hơn và ghi đè `padding-bottom` thành `20px`.
  - Kết quả: Khi người dùng cuộn đến hết trang, nội dung lấy mép màn hình dưới làm mốc dừng thay vì thanh menu nổi, khiến thanh điều hướng đáy `BottomNav` (~90px) đè lên và che mất nửa dưới của thẻ cuối cùng ("Việc Cần Làm Cùng Nhau").
- **🛠️ Giải pháp xử lý triệt để:**
  - Tách biệt hoàn toàn padding ngang và đỉnh (`px-3.5 pt-3.5 sm:px-5 sm:pt-5`) để triệt tiêu việc ghi đè ngoài ý muốn lên `padding-bottom`.
  - Xây dựng class `.main-scroll-clearance` trong [index.css](file:///c:/Code/family/src/index.css) với công thức tính toán tự động chuẩn xác:
    `padding-bottom: calc(88px + max(env(safe-area-inset-bottom, 0px), 16px) + 24px)`
### 📅 [2026-09-12] - [NEW FEATURE] Ra Mắt Tab "Cùng Nhau Học Từ Vựng Tiếng Anh" (LoveVocab - 10 Từ Mỗi Ngày)
- **🎴 Flashcard 3D Lật Mặt Lãng Mạn:**
  - Hiệu ứng chuyển động lật mặt 3D vật lý mượt mà theo chuẩn `SKILL.md` (`preserve-3d`, `rotateY`).
  - Tích hợp **phát âm tiếng Anh bản xứ 100% miễn phí** qua Web Speech API (`speechSynthesis`), chuẩn giọng US/UK, không cần API key.
  - Mặt trước: Từ vựng, phiên âm IPA, loại từ, nút loa phát âm. Mặt sau: Nghĩa tiếng Việt, câu ví dụ lãng mạn & mẹo nhớ từ.
- **⚡ Mini Quiz Cặp Đôi (Speed Challenge):**
  - Thử thách 10 câu trắc nghiệm 4 đáp án xáo trộn, tính điểm số và nổ pháo hoa Confetti khi đạt kết quả cao.
- **🏆 Bảng Thi Đua Chồng 🐻 vs Vợ 🐰 & Nút "Ủn Mông Học Bài 🚀":**
  - Hiển thị song song tiến độ học 10 từ của từng người kèm % và thời gian hoàn thành.
  - Nút "Ủn mông học bài 🚀": Bắn Push Notification và chuông rung sang máy người yêu để giục vào học bài.
- **🎁 Hộp Quà Thưởng Tình Yêu (Love Mystery Box):**
  - Khi cả hai cùng đạt 10/10 trong ngày, hộp quà bí mật mở ra với phiếu thưởng ngẫu nhiên (trà sữa, massage, đi chơi...).
- **🔥 Chuỗi Ngày Yêu & Học (Couple Streak):**
  - Đếm chuỗi ngày liên tục cả 2 cùng hoàn thành bài học, giữ lửa học tập cùng nhau.
- **⚡ Nhập Nhanh 10 Từ (Bulk Quick Import) & Kho Gói Từ Gợi Ý (Preset Packs):**
  - Dán nhanh 10 dòng dạng `word : meaning : example`, tự động phân tích và tạo bài học trong 1 giây.
  - Kho 5 gói chủ đề chọn lọc sẵn (Tình yêu, Hẹn hò, Du lịch, Thấu hiểu, Tiếng Anh nâng cao).
- **📚 Kho Từ Vựng Tích Lũy (Word Bank):**
  - Lưu trữ toàn bộ từ đã học từ các ngày trước, tìm kiếm thông minh và lọc từ đã thuộc / cần ôn lại.
### 📅 [2026-09-13] - Tái Cấu Trúc Toàn Diện Module Học Tập (Topic-Driven Architecture & 100% Zero Mock Data)
- **🚫 Xóa Sạch 100% Dữ Liệu Mẫu Hardcoded:**
  - Loại bỏ hoàn toàn các gói từ vựng mẫu dựng sẵn (`presetVocabPacks`), không còn bài học mẫu fix cứng.
  - Toàn bộ chủ đề và từ vựng đều do người dùng tự tạo và sở hữu 100%.
- **📂 Kiến Trúc Học Tập Theo Chủ Đề (Topic-First Design):**
  - Người dùng chủ động tạo Chủ Đề trước: chọn Icon/Emoji sinh động, tên chủ đề, mô tả, 6 bảng màu pastel (Hồng, Xanh ngọc, Tím thạch anh, Vàng hổ phách, Xanh emerald, Đỏ hồng), và phần thưởng ngọt ngào khi cả 2 hoàn thành.
  - Sau khi có chủ đề, tự do thêm từ vựng vào từng chủ đề với 2 chế độ:
    1. **Thêm từng từ chi tiết:** Từ vựng, loại từ, phát âm IPA, nghĩa tiếng Việt, câu ví dụ, mẹo ghi nhớ.
    2. **Dán nhanh hàng loạt (Bulk Quick Import):** Dán danh sách dạng `từ : nghĩa : câu ví dụ` để thêm 10-20 từ chỉ trong 1 giây.
- **🎓 Đa Dạng 3 Chế Độ Học Tập Cặp Đôi Độc Đáo:**
  1. **🎴 Thẻ Ghi Nhớ 3D (Flashcard):** Hiệu ứng lật thẻ 3D xoay chiều mượt mà, phát âm chuẩn US/UK qua Web Speech API miễn phí.
  2. **⚡ Trắc Nghiệm Tốc Độ (Mini Quiz):** 4 đáp án xáo trộn, tính điểm, âm thanh sống động và pháo hoa khi đạt điểm tối đa.
  3. **✍️ Luyện Gõ Chính Tả (Spelling Practice):** Nghe phát âm và gõ lại từ vựng, tự động kiểm tra chính tả kèm nút "Gợi ý chữ cái (Hint)".
- **🏆 Bảng Thi Đua Chồng 🐻 vs Vợ 🐰 & Nút "Ủn Mông Học Bài 🚀":**
  - Theo dõi tỷ lệ thuộc từ (%) của từng người trong mỗi chủ đề theo thời gian thực (`masteredBy`).
  - Nút "Ủn mông học bài 🚀" gửi Push Notification và âm thanh nhắc nhở người yêu.
- **🔄 Đồng Bộ Supabase Realtime & Cloud Storage:**
  - Migration mới `supabase/migrations/003_vocab_topics_schema.sql` với bảng `vocab_topics` (JSONB words & topic metadata).
  - Đồng bộ 2 chiều WebSocket tức thì qua Supabase Realtime giữa Chồng và Vợ.



