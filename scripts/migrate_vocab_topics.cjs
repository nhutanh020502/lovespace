const { Client } = require('pg');

const client = new Client({
  connectionString: 'postgresql://postgres.umhymrdxcceiksslnoxy:J7AnZ%3FQ3TuAvCUK@aws-0-ap-southeast-1.pooler.supabase.com:6543/postgres',
  ssl: { rejectUnauthorized: false }
});

async function run() {
  await client.connect();
  console.log('Connected to PostgreSQL Supabase!');

  // Check if table exists
  const checkRes = await client.query(
    "SELECT EXISTS (SELECT FROM information_schema.tables WHERE table_schema = 'public' AND table_name = 'vocab_topics');"
  );
  console.log('vocab_topics exists before migration:', checkRes.rows[0].exists);

  await client.query(`
    CREATE TABLE IF NOT EXISTS public.vocab_topics (
      id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
      couple_id UUID,
      title TEXT NOT NULL,
      description TEXT,
      emoji TEXT DEFAULT '📚',
      color_theme TEXT DEFAULT 'rose',
      words JSONB DEFAULT '[]'::jsonb,
      reward JSONB DEFAULT NULL,
      created_by TEXT,
      created_at TIMESTAMPTZ DEFAULT now(),
      updated_at TIMESTAMPTZ DEFAULT now()
    );

    ALTER TABLE public.vocab_topics ENABLE ROW LEVEL SECURITY;

    DO $$
    BEGIN
      IF NOT EXISTS (
        SELECT 1 FROM pg_policies WHERE tablename = 'vocab_topics' AND policyname = 'Allow public read/write vocab_topics'
      ) THEN
        CREATE POLICY "Allow public read/write vocab_topics" ON public.vocab_topics FOR ALL USING (true) WITH CHECK (true);
      END IF;
    END
    $$;

    DO $$
    BEGIN
      IF NOT EXISTS (
        SELECT 1 FROM pg_publication_tables WHERE pubname = 'supabase_realtime' AND tablename = 'vocab_topics'
      ) THEN
        ALTER PUBLICATION supabase_realtime ADD TABLE public.vocab_topics;
      END IF;
    END
    $$;
  `);

  console.log('✅ vocab_topics migration completed successfully!');

  const checkAfter = await client.query(
    "SELECT EXISTS (SELECT FROM information_schema.tables WHERE table_schema = 'public' AND table_name = 'vocab_topics');"
  );
  console.log('vocab_topics exists after migration:', checkAfter.rows[0].exists);

  await client.end();
}

run().catch((err) => {
  console.error('Migration error:', err);
  process.exit(1);
});
