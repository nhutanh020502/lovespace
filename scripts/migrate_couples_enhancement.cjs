const { Client } = require('pg');

const client = new Client({
  connectionString: 'postgresql://postgres.umhymrdxcceiksslnoxy:J7AnZ%3FQ3TuAvCUK@aws-0-ap-southeast-1.pooler.supabase.com:6543/postgres',
  ssl: { rejectUnauthorized: false }
});

async function run() {
  await client.connect();
  console.log('Connected to PostgreSQL Supabase!');

  await client.query(`
    ALTER TABLE public.couples ADD COLUMN IF NOT EXISTS partner1_avatar TEXT;
    ALTER TABLE public.couples ADD COLUMN IF NOT EXISTS partner2_avatar TEXT;
    ALTER TABLE public.couples ADD COLUMN IF NOT EXISTS settings JSONB DEFAULT '{}'::jsonb;
  `);

  console.log('✅ couples table enhancement completed successfully!');
  await client.end();
}

run().catch((err) => {
  console.error('Migration error:', err);
  process.exit(1);
});
