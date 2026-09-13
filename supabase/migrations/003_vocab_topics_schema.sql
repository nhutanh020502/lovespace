-- Migration 003: Bảng lưu trữ Chủ Đề Từ Vựng Cặp Đôi (Topic-Driven LoveVocab)

CREATE TABLE IF NOT EXISTS public.vocab_topics (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    couple_id UUID REFERENCES public.couples(id) ON DELETE CASCADE,
    title TEXT NOT NULL,
    description TEXT,
    emoji TEXT DEFAULT '📚',
    color_theme TEXT DEFAULT 'rose',
    words JSONB DEFAULT '[]'::jsonb,
    reward JSONB DEFAULT NULL,
    created_by TEXT,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT timezone('utc'::text, now()) NOT NULL,
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT timezone('utc'::text, now()) NOT NULL
);

-- Bật Row Level Security (RLS)
ALTER TABLE public.vocab_topics ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Allow all on vocab_topics" ON public.vocab_topics FOR ALL USING (true) WITH CHECK (true);

-- Bật Supabase Realtime
ALTER PUBLICATION supabase_realtime ADD TABLE public.vocab_topics;
