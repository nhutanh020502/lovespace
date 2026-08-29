const { Client } = require('pg');

const client = new Client({
  connectionString: 'postgresql://postgres.umhymrdxcceiksslnoxy:J7AnZ%3FQ3TuAvCUK@aws-0-ap-southeast-1.pooler.supabase.com:6543/postgres',
  ssl: { rejectUnauthorized: false }
});

async function run() {
  await client.connect();
  console.log('Connected to PostgreSQL Supabase!');

  await client.query(`
    CREATE TABLE IF NOT EXISTS public.dating_plans (
      id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
      title TEXT NOT NULL,
      start_date TEXT NOT NULL,
      end_date TEXT,
      total_days INTEGER DEFAULT 1,
      time_header_note TEXT DEFAULT '(tại cục chồng hay đi trễ)',
      summary_budget_note TEXT,
      destination TEXT,
      cover_url TEXT,
      hotel_info JSONB DEFAULT '{}'::jsonb,
      transport_info TEXT,
      status TEXT DEFAULT 'upcoming',
      items JSONB DEFAULT '[]'::jsonb,
      packing_list JSONB DEFAULT '[]'::jsonb,
      created_by TEXT,
      created_at TIMESTAMPTZ DEFAULT now(),
      updated_at TIMESTAMPTZ DEFAULT now()
    );

    ALTER TABLE public.dating_plans ENABLE ROW LEVEL SECURITY;

    DO $$
    BEGIN
      IF NOT EXISTS (
        SELECT 1 FROM pg_policies WHERE tablename = 'dating_plans' AND policyname = 'Allow public read/write dating_plans'
      ) THEN
        CREATE POLICY "Allow public read/write dating_plans" ON public.dating_plans FOR ALL USING (true) WITH CHECK (true);
      END IF;
    END
    $$;

    DO $$
    BEGIN
      IF NOT EXISTS (
        SELECT 1 FROM pg_publication_tables WHERE pubname = 'supabase_realtime' AND tablename = 'dating_plans'
      ) THEN
        ALTER PUBLICATION supabase_realtime ADD TABLE public.dating_plans;
      END IF;
    END
    $$;
  `);

  console.log('✅ dating_plans table migration completed successfully!');
  await client.end();
}

run().catch((err) => {
  console.error('Migration error:', err);
  process.exit(1);
});
