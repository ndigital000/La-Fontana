import { neon } from '@neondatabase/serverless';

const sql = neon('postgresql://neondb_owner:npg_rq2mfxcjuy9A@ep-morning-hall-ab2wf08r.eu-west-2.aws.neon.tech/neondb?sslmode=require');

async function inspect() {
  try {
    const tables = await sql`SELECT table_name FROM information_schema.tables WHERE table_schema = 'public'`;
    console.log('=== TABLES ===');
    console.log(JSON.stringify(tables, null, 2));

    for (const t of tables) {
      const tname = t.table_name;
      const cols = await sql`SELECT column_name, data_type, is_nullable, column_default FROM information_schema.columns WHERE table_name = ${tname} ORDER BY ordinal_position`;
      console.log('\n=== COLUMNS OF ' + tname + ' ===');
      console.log(JSON.stringify(cols, null, 2));

      // Use sql.query for dynamic table names
      const count = await sql.query('SELECT COUNT(*) as cnt FROM ' + tname);
      console.log('Row count:', count[0].cnt);

      const sample = await sql.query('SELECT * FROM ' + tname + ' LIMIT 5');
      console.log('Sample data:', JSON.stringify(sample, null, 2));
    }
  } catch (e) {
    console.error('Error:', e.message || e);
  }
}

inspect();
