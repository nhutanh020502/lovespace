# 🛠️ DANH SÁCH CÔNG NGHỆ SỬ DỤNG (TECH STACK)

Bảng tổng hợp toàn bộ các công nghệ, thư viện và dịch vụ đám mây được lựa chọn cho dự án ứng dụng cặp đôi **LoveSpace**.

---

## 1. 🖥️ Frontend (Giao Diện Người Dùng)

| Công nghệ | Vai trò / Mục đích | Lý do lựa chọn |
| :--- | :--- | :--- |
| **React 18 + Vite** | Khung phát triển Web App chính | Tốc độ build siêu nhanh, hiệu năng cao, dễ mở rộng tính năng. |
| **Tailwind CSS** | Styling & Thiết kế giao diện | Linh hoạt, tùy biến tone màu Pastel Romance, hiệu ứng Glassmorphism hiện đại. |
| **Framer Motion** | Hiệu ứng chuyển động (Animation) | Tạo cảm giác mượt mà, sống động khi mở thư, quay vòng quay, lướt tab. |
| **Lucide React** | Bộ icon giao diện hiện đại | Đầy đủ icon tình yêu, đồ ăn, sức khỏe, cảm xúc, siêu nhẹ và sắc nét. |
| **Canvas Confetti** | Hiệu ứng pháo hoa | Bắn pháo hoa rực rỡ khi hoàn thành task chung hoặc kỷ niệm ngày yêu. |
| **PWA (Progressive Web App)** | Biến Web thành Ứng dụng di động | Cho phép cả 2 bạn **Cài đặt trực tiếp ra màn hình chính iPhone / Android** như app App Store/Google Play mà không cần qua xét duyệt phức tạp. |

---

## 2. 🗄️ Backend & Cơ Sở Dữ Liệu (Backend-as-a-Service)

| Công nghệ | Vai trò / Mục đích | Lý do lựa chọn |
| :--- | :--- | :--- |
| **Supabase (PostgreSQL + Realtime)** | **Backend trọn gói (BaaS)** kiêm Database, Realtime WebSockets & Auth | Tự động cung cấp API & Realtime Server cực mạnh, không cần tự viết server Node.js cồng kềnh, không lo sập server, đồng bộ 2 máy tức thì < 0.1s. |
| **Supabase Edge Functions** *(Nếu cần)* | Xử lý logic backend đặc biệt (Serverless) | Viết các hàm logic backend tùy biến trên nền Deno/TypeScript nếu cần gửi webhook hoặc cron job. |
| **LocalStorage / IndexedDB (Local-First)** | Lưu trữ offline trên máy | Giúp ứng dụng mở lên tức thì, mượt mà kể cả khi mạng yếu hoặc đang đi trên máy bay. |

---

## 3. 🖼️ Quản Lý Hình Ảnh & Media (Storage)

| Công nghệ | Vai trò / Mục đích | Lý do lựa chọn |
| :--- | :--- | :--- |
| **Supabase Storage** (kết hợp **Cloudinary**) | Lưu trữ ảnh chụp, ảnh selfie, meme & ảnh kỷ niệm | Upload ảnh nhanh chóng, tự động nén dung lượng mà vẫn giữ độ nét cao, hỗ trợ CDN tải ảnh siêu tốc, hoàn toàn **miễn phí**. |

---

## 4. 🔔 Thông Báo & Tương Tác (Push Notifications)

| Công nghệ | Vai trò / Mục đích | Lý do lựa chọn |
| :--- | :--- | :--- |
| **OneSignal Web Push** (Khuyên dùng) | Thông báo đẩy ra **màn hình khóa điện thoại** (kể cả khi đã tắt app) | **Miễn phí 100%**, hỗ trợ cả **iPhone (iOS 16.4+ PWA)** và **Android**. Khi vợ nhắn tin, thả tim hay đổi trạng thái dỗi, điện thoại bạn sẽ rung và hiện popup thông báo ngay lập tức như Zalo/Messenger. |
| **Web Audio API & Haptic Vibrate** | Âm thanh thông báo cute & rung điện thoại khi đang mở app | Phát tiếng "ting ting", tiếng hôn "chụt", rung nhẹ điện thoại khi tương tác. |

---

## 5. 🚀 Triển Khai & Vận Hành (Deployment)

| Công nghệ | Vai trò / Mục đích | Chi phí |
| :--- | :--- | :--- |
| **Vercel / Netlify** | Host ứng dụng lên mạng internet với HTTPS | **Miễn phí 100%** (Cung cấp đường link ví dụ: `https://our-lovespace.vercel.app` để 2 bạn truy cập từ điện thoại mọi lúc mọi nơi). |
| **Custom Domain** *(Tùy chọn)* | Tên miền riêng (ví dụ: `anhyeuem.com` hoặc `lovespace.net`) | Mua thêm nếu 2 bạn thích có một địa chỉ web thật lãng mạn. |
