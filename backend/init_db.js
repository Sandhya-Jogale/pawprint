import pg from 'pg';
import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';
import dotenv from 'dotenv';

dotenv.config();

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const { Pool } = pg;

async function initDB() {
  try {
    console.log("Setting up database...");
    
    // First, connect to the default 'postgres' database to create the 'pawprint' database if it doesn't exist
    const defaultUrl = process.env.DATABASE_URL.replace('/pawprint', '/postgres');
    const defaultPool = new Pool({ connectionString: defaultUrl });
    
    try {
      const res = await defaultPool.query("SELECT 1 FROM pg_database WHERE datname = 'pawprint'");
      if (res.rowCount === 0) {
        console.log("Creating database 'pawprint'...");
        await defaultPool.query("CREATE DATABASE pawprint");
      } else {
        console.log("Database 'pawprint' already exists.");
      }
    } catch (dbError) {
      console.error("Error checking/creating database:", dbError.message);
    } finally {
      await defaultPool.end();
    }

    // Now connect to the pawprint database
    console.log("Connecting to pawprint database...");
    const pawprintPool = new Pool({ connectionString: process.env.DATABASE_URL });
    
    try {
      // Read the schema.sql file
      const schemaPath = path.join(__dirname, 'schema.sql');
      const schemaSql = fs.readFileSync(schemaPath, 'utf8');

      console.log("Executing schema.sql...");
      await pawprintPool.query(schemaSql);
      
      console.log("✅ Database tables initialized successfully!");
    } finally {
      await pawprintPool.end();
    }
  } catch (error) {
    console.error("❌ Error during setup:", error);
  }
}

initDB();
