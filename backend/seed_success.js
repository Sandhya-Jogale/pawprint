import pg from 'pg';
const { Pool } = pg;

const pool = new Pool({
  connectionString: process.env.DATABASE_URL || "postgresql://postgres:Sandy%402127@localhost:5433/pawprint"
});

async function seed() {
  try {
    // 1. Create a mock user
    const userRes = await pool.query(`
      INSERT INTO users (full_name, email, phone_number)
      VALUES ('Jane Smith', 'jane.smith@example.com', '555-0199')
      ON CONFLICT (email) DO UPDATE SET full_name = EXCLUDED.full_name
      RETURNING id;
    `);
    
    const userId = userRes.rows[0].id;

    // 2. Insert a reunited pet
    const insertQuery = `
      INSERT INTO pet_alerts 
      (user_id, alert_type, status, title, breed, description, location_name, latitude, longitude, event_time, image_url, reunited_time, reunited_message)
      VALUES ($1, 'LOST', 'REUNITED', $2, $3, $4, $5, $6, $7, NOW() - INTERVAL '5 days', $8, NOW() - INTERVAL '1 hour', $9)
      RETURNING *;
    `;
    
    await pool.query(insertQuery, [
      userId, 
      'Bella', 
      'Golden Retriever', 
      'Very friendly, wearing a pink collar.', 
      'Central Park, NY', 
      40.785091, 
      -73.968285, 
      'https://images.unsplash.com/photo-1552053831-71594a27632d?auto=format&fit=crop&q=80&w=800',
      "Bella was found hiding under a neighbor's porch! She is safe and sound. Thank you so much to everyone who helped look for her!!"
    ]);

    // Insert another reunited pet
    await pool.query(insertQuery, [
      userId, 
      'Oliver', 
      'Tabby Cat', 
      'Orange tabby, very vocal.', 
      'Downtown Brooklyn, NY', 
      40.6925, 
      -73.9903, 
      'https://images.unsplash.com/photo-1514888286974-6c03e2ca1dba?auto=format&fit=crop&q=80&w=800',
      'Oliver walked right back through the doggy door this morning like nothing happened! Thanks for the support.'
    ]);

    console.log('Mock success stories created successfully!');
  } catch (error) {
    console.error('Error seeding data:', error);
  } finally {
    pool.end();
  }
}

seed();
