import pg from 'pg';
const { Pool } = pg;

async function testConnection(port) {
  const url = `postgresql://postgres:Sandy%402127@localhost:${port}/postgres`;
  const pool = new Pool({ connectionString: url });
  try {
    const client = await pool.connect();
    console.log(`✅ Successfully connected to port ${port}!`);
    client.release();
    return true;
  } catch (err) {
    console.log(`❌ Failed on port ${port}: ${err.message}`);
    return false;
  } finally {
    await pool.end();
  }
}

async function runTests() {
  await testConnection(5432);
  await testConnection(5433);
  await testConnection(5434);
}

runTests();
