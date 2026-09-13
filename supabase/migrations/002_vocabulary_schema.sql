-- Migration: Bổ sung bảng cho tính năng Học Từ Vựng Tiếng Anh (LoveVocab)

-- 1. Bảng lưu trữ bộ 10 từ vựng theo ngày
CREATE TABLE IF NOT EXISTS public.daily_vocab_sets (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    couple_id UUID REFERENCES public.couples(id) ON DELETE CASCADE,
    date DATE NOT NULL,
    title TEXT NOT NULL,
    topic TEXT,
    words JSONB DEFAULT '[]'::jsonb,
    partner1_progress JSONB DEFAULT '{"completedWordIds": [], "isCompleted": false, "score": 0}'::jsonb,
    partner2_progress JSONB DEFAULT '{"completedWordIds": [], "isCompleted": false, "score": 0}'::jsonb,
    reward JSONB DEFAULT NULL,
    created_by TEXT,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT timezone('utc'::text, now()) NOT NULL,
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT timezone('utc'::text, now()) NOT NULL,
    CONSTRAINT unique_couple_date UNIQUE(couple_id, date)
);

-- 2. Bảng lưu trữ chuỗi ngày học liên tục (Streak)
CREATE TABLE IF NOT EXISTS public.vocab_streaks (
    couple_id UUID PRIMARY KEY REFERENCES public.couples(id) ON DELETE CASCADE,
    current_streak INT DEFAULT 0,
    longest_streak INT DEFAULT 0,
    last_completed_date DATE,
    history JSONB DEFAULT '{}'::jsonb,
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT timezone('utc'::text, now()) NOT NULL
);

-- 3. Bật RLS
ALTER TABLE public.daily_vocab_sets ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.vocab_streaks ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Allow all on daily_vocab_sets" ON public.daily_vocab_sets FOR ALL USING (true) WITH CHECK (true);
CREATE POLICY "Allow all on vocab_streaks" ON public.vocab_streaks FOR ALL USING (true) WITH CHECK (true);

-- 4. Bật Realtime
ALTER PUBLICATION supabase_realtime ADD TABLE public.daily_vocab_sets;
ALTER PUBLICATION supabase_realtime ADD TABLE public.vocab_streaks;
