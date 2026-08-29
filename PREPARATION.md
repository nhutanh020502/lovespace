# 📋 HƯỚNG DẪN CHUẨN BỊ (PREPARATION & API KEYS)

Để ứng dụng hoạt động đầy đủ tính năng đồng bộ thời gian thực (Realtime Sync) giữa 2 điện thoại và lưu trữ ảnh/meme không giới hạn, bạn chỉ cần chuẩn bị một vài dịch vụ **hoàn toàn miễn phí** sau:

---

## 1. ⚡ Supabase (Đóng vai trò Backend, Database & Realtime Sync)
> *Supabase là nền tảng Backend-as-a-Service mã nguồn mở trên nền PostgreSQL, cung cấp sẵn toàn bộ API, Realtime WebSockets và Auth hoàn toàn miễn phí.*

### Các bước lấy Supabase Keys:
1. Truy cập [Supabase](https://supabase.com/) và đăng nhập (bằng tài khoản GitHub hoặc Google).
2. Bấm **New Project** (Tạo dự án mới):
   - Đặt tên Project: `lovespace` (hoặc tên tùy bạn thích).
   - Đặt mật khẩu Database (Database Password - lưu lại mật khẩu này).
   - Chọn Region: **Singapore (`ap-southeast-1`)** để đạt tốc độ nhanh nhất ở Việt Nam.
   - Bấm **Create new project**.
3. Sau khi dự án khởi tạo xong (mất ~1 phút), vào **Project Settings (biểu tượng bánh răng ở góc dưới bên trái)** -> Chọn **API**:
   - Copy **Project URL**: Ví dụ `https://xyzabcdefghijklm.supabase.co`
   - Copy **anon public API Key**: Chuỗi khóa `eyJh...`
4. Hai thông số này sẽ dùng để dán vào file `.env` của ứng dụng:
   ```env
   VITE_SUPABASE_URL="https://xyzabcdefghijklm.supabase.co"
   VITE_SUPABASE_ANON_KEY="eyJh..."
   ```

---

## 2. ☁️ Cloudinary (Dùng để Lưu trữ & Upload Ảnh Cảm Xúc, Meme, Selfie)
> *Cloudinary cung cấp 25GB lưu trữ miễn phí hàng tháng, tải ảnh siêu nhanh và tự động tối ưu hóa kích thước.*

### Các bước lấy Cloudinary Key:
1. Đăng ký tài khoản miễn phí tại [Cloudinary Signup](https://cloudinary.com/users/register_free).
2. Sau khi đăng nhập, tại trang **Dashboard**, bạn sẽ thấy:
   - **Cloud Name** (Ví dụ: `dxyzt1234`)
   - **API Key** (Ví dụ: `987654321098765`)
3. Tạo **Upload Preset (Unsigned)** để web có thể upload ảnh trực tiếp:
   - Vào **Settings (biểu tượng bánh răng)** -> Chọn tab **Upload**.
   - Kéo xuống mục **Upload presets** -> Bấm **Add upload preset**.
   - Đặt tên Preset (Ví dụ: `lovespace_preset`).
   - Tại mục **Signing Mode**: Đổi từ *Signed* sang **Unsigned**.
   - Bấm **Save**.
4. Hai thông số bạn cần lưu lại:
   - `VITE_CLOUDINARY_CLOUD_NAME = "tên_cloud_name_của_bạn"`
   - `VITE_CLOUDINARY_UPLOAD_PRESET = "lovespace_preset"`

---

## 3. 🔔 OneSignal (Dùng để Thông báo Đẩy ra Màn hình khóa Điện thoại)
> *OneSignal là dịch vụ Push Notification phổ biến nhất thế giới, hỗ trợ gửi thông báo ra màn hình khóa iPhone/Android hoàn toàn miễn phí.*

### Các bước lấy OneSignal App ID:
1. Đăng ký tài khoản miễn phí tại [OneSignal Signup](https://onesignal.com/).
2. Bấm **New App/Platform** -> Đặt tên `LoveSpace` -> Chọn nền tảng **Web Push**.
3. Tại mục cấu hình Web:
   - Chọn **Typical Site**.
   - Nhập tên site: `LoveSpace` và URL trang web (link Vercel của bạn, ví dụ: `https://our-lovespace.vercel.app` hoặc `http://localhost:5173` khi test local).
   - Chọn **Permission Prompt**: Bật popup xin quyền nhận thông báo.
   - Bấm **Save**.
4. Vào **Settings** -> **Keys & IDs** -> Copy mã **OneSignal App ID**:
   ```env
   VITE_ONESIGNAL_APP_ID="xxxxxxxx-xxxx-xxxx-xxxx-xxxxxxxxxxxx"
   ```

---

## 4. 🌐 Vercel (Dùng để đưa App lên mạng cho 2 bạn cài vào điện thoại)
> *Giúp bạn có một đường link web `https://tên-bạn-chọn.vercel.app` có chứng chỉ SSL bảo mật HTTPS, cho phép cài đặt App lên màn hình chính iPhone / Android.*

1. Đăng ký tài khoản miễn phí tại [Vercel](https://vercel.com/signup).
2. Khi code xong, bạn chỉ cần liên kết với GitHub hoặc tải code lên là có ngay link web để dùng!

---

## 4. 💖 Thông Tin Riêng Của Hai Bạn (Dùng để khởi tạo dữ liệu ban đầu)
Chuẩn bị sẵn những thông tin này để app hiển thị ngọt ngào nhất ngay từ đầu:
- **Tên / Biệt danh của 2 bạn**: (Ví dụ: *Anh Gấu 🐻 & Bé Thỏ 🐰*)
- **Ngày chính thức yêu nhau**: (Ngày / Tháng / Năm - để app đếm chính xác từng ngày)
- **1-2 tấm ảnh đại diện dễ thương của 2 bạn**.
- **Món ăn khoái khẩu & Món ghét của vợ**: Để đưa ngay vào danh sách cứu hộ khi dỗi!

---

> 💡 **LƯU Ý:**
> Nếu bạn chưa muốn tạo key Firebase hay Cloudinary ngay lúc này, **chúng ta vẫn có thể code hoàn thiện 100% giao diện và mọi tính năng với chế độ Local Storage trước** (có sẵn đầy đủ kho meme, mock data). Khi nào bạn lấy key xong, chỉ cần dán vào file `.env` là app tự động kích hoạt chế độ đồng bộ đám mây ngay lập tức!
