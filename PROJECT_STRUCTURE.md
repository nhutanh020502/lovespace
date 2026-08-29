# 🏗️ KIẾN TRÚC & CẤU TRÚC THƯ MỤC CHUẨN SENIOR (CLEAN FEATURE-FIRST ARCHITECTURE)

> **Triết lý thiết kế:** Áp dụng mô hình **Feature-Driven Architecture (Vertical Slice)** kết hợp **Clean Architecture**. 
> Cấu trúc này giúp dự án:
> 1. **Module hóa 100%**: Sửa tính năng nào (ví dụ Chat, Sức khỏe hay Kho ảnh) chỉ cần vào đúng thư mục của tính năng đó.
> 2. **Dễ bảo trì & Mở rộng**: Sau này muốn thêm tính năng mới chỉ cần tạo thêm 1 folder feature mà không làm gãy code cũ.
> 3. **Loose Coupling & High Cohesion**: Tách biệt rõ ràng giữa Giao diện (UI), Logic nghiệp vụ (Custom Hooks), Kết nối dữ liệu (Services/Supabase), và Kiểu dữ liệu (Types).

---

## 🌳 SƠ ĐỒ CÂY THƯ MỤC CHI TIẾT (FULL TREE VIEW)

```text
c:\Code\family\
├── 📁 public/                             # Tài nguyên tĩnh & Cấu hình PWA
│   ├── 📁 icons/                          # Icon PWA cho iOS & Android (192x192, 512x512, apple-touch-icon)
│   ├── 📁 sounds/                         # Âm thanh hiệu ứng (.mp3 / .wav)
│   │   ├── kiss.mp3                       # Tiếng nụ hôn "chụt" 💋
│   │   ├── pop.mp3                        # Tiếng ting ting gửi tin nhắn / thả tim
│   │   ├── celebration.mp3                # Tiếng pháo hoa hoàn thành task
│   │   └── alert.mp3                      # Tiếng chuông nhắc uống thuốc / dỗi
│   ├── 📁 default-memes/                  # Kho meme & sticker cảm xúc có sẵn
│   │   ├── angry-cat.webp
│   │   ├── hungry-bunny.webp
│   │   ├── sweet-hug.webp
│   │   └── sleepy-capybara.webp
│   ├── favicon.ico
│   ├── manifest.json                      # Cấu hình PWA cài đặt ra màn hình chính
│   └── sw.js                              # Service Worker (Offline caching & Push Notification)
│
├── 📁 supabase/                           # Quản lý Database & Migrations SQL
│   ├── 📁 migrations/
│   │   └── 001_initial_schema.sql         # Script SQL tạo đầy đủ bảng, RLS security & trigger
│   └── seed.sql                           # Dữ liệu mẫu ban đầu để test
│
├── 📁 src/                                # Toàn bộ mã nguồn ứng dụng
│   ├── 📁 assets/                         # Hình ảnh, SVG, vector cục bộ
│   │   ├── 📁 illustrations/              # Ảnh minh họa trống (empty states)
│   │   └── 📁 logos/                      # Logo LoveSpace
│   │
│   ├── 📁 components/                     # Các UI Component dùng chung (Shared UI)
│   │   ├── 📁 ui/                         # Atomic Design Components (Thành phần giao diện cơ bản)
│   │   │   ├── Button.tsx                 # Nút bấm đa năng (Primary, Secondary, Romantic, Danger)
│   │   │   ├── Card.tsx                   # Thẻ chứa hiệu ứng Glassmorphism bo tròn
│   │   │   ├── Modal.tsx                  # Hộp thoại popup mượt mà
│   │   │   ├── Drawer.tsx                 # Menu trượt từ đáy màn hình (Bottom Sheet cho mobile)
│   │   │   ├── Input.tsx                  # Ô nhập liệu có validation & icon
│   │   │   ├── Badge.tsx                  # Nhãn trạng thái (tag món ăn, tag dị ứng, tag cảm xúc)
│   │   │   ├── Avatar.tsx                 # Ảnh đại diện có viền online/offline & mood badge
│   │   │   ├── Toast.tsx                  # Thông báo popup góc màn hình siêu cute
│   │   │   ├── ConfettiEffect.tsx         # Hiệu ứng bắn pháo hoa
│   │   │   └── Lightbox.tsx               # Trình phóng to & xem ảnh full màn hình
│   │   │
│   │   └── 📁 layout/                     # Khung sườn ứng dụng (App Layout & Navigation)
│   │       ├── AppLayout.tsx              # Khung chính bọc toàn bộ App
│   │       ├── BottomNav.tsx              # Thanh điều hướng 5 tab ở đáy màn hình điện thoại
│   │       ├── TopHeader.tsx              # Header hiển thị tên 2 bạn, pin %, và nút cài đặt
│   │       ├── PageContainer.tsx          # Vùng chứa nội dung trang có padding & animation cuộn
│   │       └── OfflineBanner.tsx          # Cảnh báo khi mất mạng internet
│   │
│   ├── 📁 features/                       # 🌟 TRỌNG TÂM: CHIA THEO TỪNG TÍNH NĂNG ĐỘC LẬP
│   │   │
│   │   ├── 📁 dashboard/                  # 1. Trang chủ & Đếm ngày yêu
│   │   │   ├── components/
│   │   │   │   ├── LoveCounterCard.tsx    # Đồng hồ đếm số ngày, giờ, phút yêu nhau
│   │   │   │   ├── QuickInteractionBar.tsx# Nút 1 chạm: Thả tim, Thơm má, Nhắc uống nước
│   │   │   │   ├── PartnerStatusHero.tsx  # Khối hiển thị ảnh cảm xúc to nổi bật của người yêu
│   │   │   │   └── SOSRescueBanner.tsx    # Cẩm nang dỗ dành khi vợ bật chế độ "Đang dỗi"
│   │   │   └── useDashboardData.ts
│   │   │
│   │   ├── 📁 mood-status/                # 2. Cảm xúc bằng Hình ảnh & Meme
│   │   │   ├── components/
│   │   │   │   ├── MoodPickerModal.tsx    # Bảng chọn tâm trạng (Vui, Dỗi, Đói, Mệt...)
│   │   │   │   ├── MemeSelector.tsx       # Kho Meme có sẵn theo chủ đề
│   │   │   │   ├── PhotoUploader.tsx      # Chụp ảnh selfie / Tải ảnh biểu cảm thật
│   │   │   │   └── CustomMemeManager.tsx  # Quản lý kho meme tự tải lên của 2 bạn
│   │   │   ├── mood.types.ts
│   │   │   ├── mood.constants.ts          # Danh mục cảm xúc, danh sách meme mặc định
│   │   │   └── useMoodStatus.ts           # Hook quản lý cập nhật & realtime mood
│   │   │
│   │   ├── 📁 health-care/                # 3. Sổ tay Sức khỏe & Chăm sóc
│   │   │   ├── components/
│   │   │   │   ├── HealthStatusCard.tsx   # Đang bệnh gì, triệu chứng, mức độ
│   │   │   │   ├── MedicineTracker.tsx    # Lịch uống thuốc & nút bấm nhắc uống thuốc
│   │   │   │   ├── AllergyList.tsx        # Danh sách dị ứng (thực phẩm, thuốc, thời tiết)
│   │   │   │   ├── DietaryPreferences.tsx # Món ghét (không hành/cay) vs Món khoái khẩu
│   │   │   │   └── PeriodTracker.tsx      # Dự báo chu kỳ dâu & lời khuyên chăm sóc
│   │   │   ├── health.types.ts
│   │   │   └── useHealthCare.ts
│   │   │
│   │   ├── 📁 chat/                       # 4. Nhắn tin riêng tư (Couple Messenger)
│   │   │   ├── components/
│   │   │   │   ├── ChatWindow.tsx         # Khung cuộn tin nhắn mượt mà
│   │   │   │   ├── MessageBubble.tsx      # Bong bóng tin nhắn (text, ảnh, meme, thời gian)
│   │   │   │   ├── ChatInput.tsx          # Khung nhập tin nhắn, gửi sticker, đính kèm ảnh
│   │   │   │   ├── MessageReactions.tsx   # Menu thả tim, hôn, thương, giận vào tin nhắn
│   │   │   │   ├── PinnedMessages.tsx     # Thanh ghim lời dặn dò quan trọng lên đầu chat
│   │   │   │   └── TypingIndicator.tsx    # Hiệu ứng người yêu "đang soạn tin..."
│   │   │   ├── chat.types.ts
│   │   │   └── useChatMessages.ts         # Hook realtime Supabase chat channel
│   │   │
│   │   ├── 📁 gallery/                    # 5. Kho Ảnh Kỷ Niệm & Tìm Kiếm Thông Minh
│   │   │   ├── components/
│   │   │   │   ├── PhotoGrid.tsx          # Lưới ảnh kỷ niệm xếp dạng Masonry/Instagram
│   │   │   │   ├── PhotoCard.tsx          # Thẻ ảnh có ngày tháng, địa điểm & trích dẫn note
│   │   │   │   ├── MemoryUploadModal.tsx  # Form thêm ảnh mới (chọn ảnh, ghi note, chọn ngày, gắn vị trí)
│   │   │   │   ├── GallerySearchBar.tsx   # Thanh tìm kiếm theo từ khóa ghi chú & lọc địa điểm
│   │   │   │   └── TimelineFilter.tsx     # Lọc ảnh theo Năm / Tháng / Chuyến du lịch
│   │   │   ├── gallery.types.ts
│   │   │   └── useMemoryGallery.ts        # Hook tìm kiếm & quản lý album ảnh
│   │   │
│   │   ├── 📁 places-food/                # 6. Điểm đến & Quán ăn ngon
│   │   │   ├── components/
│   │   │   │   ├── PlaceCard.tsx          # Thẻ quán ăn (địa chỉ, mức giá, món must-try, maps link)
│   │   │   │   ├── PlaceFormModal.tsx     # Thêm quán mới / chỉnh sửa đánh giá
│   │   │   │   ├── PlaceFilters.tsx       # Lọc: Chưa đi / Đã trải nghiệm / Cafe / Ăn tối
│   │   │   │   └── RandomWheelModal.tsx   # Vòng quay may mắn "Hôm nay ăn gì?"
│   │   │   ├── places.types.ts
│   │   │   └── usePlacesFood.ts
│   │   │
│   │   ├── 📁 todo/                       # 7. Danh sách việc chung
│   │   │   ├── components/
│   │   │   │   ├── TodoList.tsx           # Danh sách việc phân loại theo danh mục
│   │   │   │   ├── TodoItem.tsx           # Hàng việc (checkbox, người làm, hạn chót)
│   │   │   │   └── AddTodoModal.tsx       # Form thêm việc cần làm
│   │   │   ├── todo.types.ts
│   │   │   └── useTodos.ts
│   │   │
│   │   └── 📁 budget/                     # 8. Heo đất & Quỹ chung
│   │       ├── components/
│   │       │   ├── PiggyBankCard.tsx      # Thanh tiến độ tiết kiệm (ví dụ: Quỹ Đà Lạt 65%)
│   │       │   ├── ExpenseList.tsx        # Danh sách chi tiêu gần đây
│   │       │   └── AddTransactionModal.tsx# Ghi chép đóng quỹ hoặc chi tiêu
│   │       ├── budget.types.ts
│   │       └── useBudget.ts
│   │
│   ├── 📁 hooks/                          # Các Custom Hooks tiện ích toàn cục
│   │   ├── useAudio.ts                    # Hook phát âm thanh hiệu ứng (kiss, ting, celebration)
│   │   ├── useHaptic.ts                   # Hook rung nhẹ điện thoại (rung khi thả tim)
│   │   ├── usePWAInstall.ts               # Hook gợi ý bấm nút "Cài đặt ra màn hình chính"
│   │   ├── useOnlineStatus.ts             # Hook theo dõi trạng thái mạng Internet
│   │   └── useLocalStorage.ts             # Hook lưu cache offline an toàn
│   │
│   ├── 📁 services/                       # Tầng kết nối dịch vụ bên ngoài (API & Clients)
│   │   ├── supabaseClient.ts              # Khởi tạo Supabase Client kết nối DB & Realtime
│   │   ├── cloudinaryService.ts           # Xử lý nén & upload ảnh lên Cloudinary
│   │   ├── oneSignalService.ts            # Đăng ký & kích hoạt Push Notification
│   │   └── syncService.ts                 # Bộ điều phối đồng bộ LocalStorage <-> Supabase
│   │
│   ├── 📁 store/                          # Quản lý Trạng Thái Toàn Cục (Zustand / Context)
│   │   ├── useAuthStore.ts                # Quản lý tài khoản hiện tại (Chồng hay Vợ đang đăng nhập)
│   │   ├── useCoupleStore.ts              # Thông tin cặp đôi, ngày yêu, biệt danh
│   │   └── useSettingsStore.ts            # Cài đặt âm thanh, rung, giao diện
│   │
│   ├── 📁 types/                          # Định nghĩa kiểu dữ liệu TypeScript chung
│   │   ├── database.types.ts              # Kiểu dữ liệu tự động map từ Database Supabase
│   │   └── common.types.ts                # Kiểu dữ liệu chung cho toàn bộ dự án
│   │
│   ├── 📁 utils/                          # Các hàm tiện ích thuần túy (Pure Helper Functions)
│   │   ├── dateUtils.ts                   # Tính số ngày yêu nhau, format ngày tháng Việt Nam
│   │   ├── currencyUtils.ts               # Format tiền tệ VNĐ (ví dụ: 50.000đ)
│   │   ├── imageCompressor.ts             # Nén ảnh trước khi upload để tiết kiệm dung lượng
│   │   └── soundEffects.ts                # Bộ phát âm thanh Web Audio API
│   │
│   ├── 📁 constants/                      # Hằng số toàn cục
│   │   ├── appConfig.ts                   # Tên app, version, link hỗ trợ
│   │   └── initialMockData.ts             # Dữ liệu demo đầy đủ sẵn sàng chạy offline
│   │
│   ├── App.tsx                            # Component gốc, khởi tạo theme & routing
│   ├── main.tsx                           # Điểm khởi chạy React (Entry Point)
│   └── index.css                          # Toàn bộ Style Tailwind, Glassmorphism & Custom Animations
│
├── .env.example                           # Mẫu cấu hình các biến môi trường
├── .gitignore                             # Loại trừ node_modules, dist, .env
├── index.html                             # File HTML chính chứa thẻ Meta PWA & Fonts Google
├── package.json                           # Khai báo dependencies & scripts chạy dự án
├── postcss.config.js                      # Cấu hình PostCSS cho Tailwind
├── tailwind.config.js                     # Cấu hình màu Pastel Romance, font chữ & animation
├── tsconfig.json                          # Cấu hình TypeScript nghiêm ngặt
└── vite.config.ts                         # Cấu hình Vite & Plugin PWA
```

---

## 🎯 ĐIỂM SÁNG VÀ LÝ DO CẤU TRÚC NÀY ĐẠT CHUẨN SENIOR:

1. **Kiến trúc Feature-Driven (Không bị rác code):**
   - Mỗi tính năng nằm trong 1 module riêng biệt chứa đủ Component, Hook xử lý logic, Types và Constants.
   - Khi bạn muốn nâng cấp tính năng **Chat** hay **Kho ảnh**, bạn chỉ làm việc trong đúng thư mục `src/features/chat` hoặc `src/features/gallery`.

2. **Cơ chế Local-First Hoàn Hảo:**
   - Ứng dụng chạy mượt mà ngay cả khi chưa nối Supabase/Cloudinary nhờ `initialMockData.ts` và `useLocalStorage.ts`.
   - Khi nối Supabase, `syncService.ts` sẽ tự động chuyển đổi từ Local Storage sang Cloud Realtime mà không cần sửa đổi giao diện UI.

3. **Tối ưu hóa tối đa cho PWA Di Động (Mobile-First):**
   - Đã cấu hình sẵn thư mục âm thanh `public/sounds`, `manifest.json`, icon và các hook rung/âm thanh (`useHaptic`, `useAudio`).
