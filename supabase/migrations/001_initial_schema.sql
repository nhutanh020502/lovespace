-- ==============================================================================
-- 💖 LOVESPACE SUPABASE DATABASE SCHEMA & REALTIME SETUP
-- Copy toàn bộ nội dung file này và paste vào: Supabase Dashboard -> SQL Editor -> Run
-- ==============================================================================

-- 1. Bảng Hồ Sơ Người Dùng (Profiles)
CREATE TABLE IF NOT EXISTS public.profiles (
  id UUID PRIMARY KEY DEFAULT auth.uid(),
  role TEXT NOT NULL CHECK (role IN ('husband', 'wife')),
  name TEXT NOT NULL,
  nickname TEXT NOT NULL,
  avatar TEXT,
  battery_level INTEGER DEFAULT 100,
  is_online BOOLEAN DEFAULT false,
  last_active TIMESTAMPTZ DEFAULT now()
);

-- 2. Bảng Trạng Thái & Cảm Xúc Hình Ảnh / Meme (Mood & Status)
CREATE TABLE IF NOT EXISTS public.mood_status (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id TEXT NOT NULL,
  mood TEXT NOT NULL,
  caption TEXT,
  photo_url TEXT,
  is_custom_photo BOOLEAN DEFAULT false,
  updated_at TIMESTAMPTZ DEFAULT now()
);

-- 3. Bảng Sức Khỏe & Chăm Sóc (Health & Care)
CREATE TABLE IF NOT EXISTS public.health_care (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id TEXT NOT NULL UNIQUE,
  illness_name TEXT,
  symptoms TEXT,
  severity TEXT DEFAULT 'mild',
  medicines JSONB DEFAULT '[]'::jsonb,
  allergies JSONB DEFAULT '[]'::jsonb,
  disliked_foods JSONB DEFAULT '[]'::jsonb,
  favorite_comfort_foods JSONB DEFAULT '[]'::jsonb,
  period_tracking JSONB,
  last_updated TIMESTAMPTZ DEFAULT now()
);

-- 4. Bảng Nhắn Tin Riêng Tư (Chat Messages)
CREATE TABLE IF NOT EXISTS public.chat_messages (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  sender_id TEXT NOT NULL,
  text TEXT,
  image_url TEXT,
  sticker_url TEXT,
  reactions JSONB DEFAULT '{}'::jsonb,
  is_pinned BOOLEAN DEFAULT false,
  status TEXT DEFAULT 'sent',
  created_at TIMESTAMPTZ DEFAULT now()
);

-- 5. Bảng Kho Ảnh Kỷ Niệm (Memory Gallery)
CREATE TABLE IF NOT EXISTS public.memory_gallery (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  photo_url TEXT NOT NULL,
  date DATE NOT NULL,
  note TEXT NOT NULL,
  location TEXT,
  tags JSONB DEFAULT '[]'::jsonb,
  uploaded_by TEXT NOT NULL,
  created_at TIMESTAMPTZ DEFAULT now()
);

-- 6. Bảng Điểm Đến & Quán Ăn Ngon (Places & Food Wishlist)
CREATE TABLE IF NOT EXISTS public.places_food (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  name TEXT NOT NULL,
  category TEXT NOT NULL,
  address TEXT,
  google_maps_url TEXT,
  estimated_price TEXT,
  must_try_dishes TEXT,
  notes TEXT,
  rating INTEGER DEFAULT 5,
  is_visited BOOLEAN DEFAULT false,
  added_by TEXT NOT NULL,
  created_at TIMESTAMPTZ DEFAULT now()
);

-- 7. Bảng Việc Cần Làm Chung (Shared Todos)
CREATE TABLE IF NOT EXISTS public.shared_todos (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  title TEXT NOT NULL,
  category TEXT DEFAULT 'daily',
  assigned_to TEXT DEFAULT 'both',
  due_date DATE,
  is_completed BOOLEAN DEFAULT false,
  completed_at TIMESTAMPTZ,
  completed_by TEXT,
  created_at TIMESTAMPTZ DEFAULT now()
);

-- ==============================================================================
-- ⚡ BẬT TÍNH NĂNG SUPABASE REALTIME REPLICATION (Đồng bộ tức thì giữa 2 máy)
-- ==============================================================================
ALTER PUBLICATION supabase_realtime ADD TABLE public.mood_status;
ALTER PUBLICATION supabase_realtime ADD TABLE public.health_care;
ALTER PUBLICATION supabase_realtime ADD TABLE public.chat_messages;
ALTER PUBLICATION supabase_realtime ADD TABLE public.places_food;
ALTER PUBLICATION supabase_realtime ADD TABLE public.shared_todos;
ALTER PUBLICATION supabase_realtime ADD TABLE public.memory_gallery;
