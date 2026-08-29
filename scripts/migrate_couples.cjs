const { Client } = require('pg');

const client = new Client({
  connectionString: 'postgresql://postgres.umhymrdxcceiksslnoxy:J7AnZ%3FQ3TuAvCUK@aws-0-ap-southeast-1.pooler.supabase.com:6543/postgres',
  ssl: { rejectUnauthorized: false }
});

async function run() {
  await client.connect();
  console.log('Connected to PostgreSQL Supabase!');

  await client.query(`
    CREATE TABLE IF NOT EXISTS public.couples (
      id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
      invite_code TEXT UNIQUE NOT NULL,
      partner1_phone TEXT NOT NULL,
      partner1_name TEXT NOT NULL,
      partner1_role TEXT NOT NULL,
      partner2_phone TEXT,
      partner2_name TEXT,
      partner2_role TEXT,
      anniversary_date DATE DEFAULT '2023-02-14',
      status TEXT DEFAULT 'pending',
      created_at TIMESTAMPTZ DEFAULT now()
    );

    ALTER TABLE public.couples ENABLE ROW LEVEL SECURITY;

    DO $$
    BEGIN
      IF NOT EXISTS (
        SELECT 1 FROM pg_policies WHERE tablename = 'couples' AND policyname = 'Allow public read/write couples'
      ) THEN
        CREATE POLICY "Allow public read/write couples" ON public.couples FOR ALL USING (true) WITH CHECK (true);
      END IF;
    END
    $$;

    DO $$
    BEGIN
      IF NOT EXISTS (
        SELECT 1 FROM pg_publication_tables WHERE pubname = 'supabase_realtime' AND tablename = 'couples'
      ) THEN
        ALTER PUBLICATION supabase_realtime ADD TABLE public.couples;
      END IF;
    END
    $$;
  `);

  console.log('✅ Couples table migration completed successfully!');
  await client.end();
}

run().catch((err) => {
  console.error('Migration error:', err);
  process.exit(1);
});
