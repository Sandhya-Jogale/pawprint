import { NextResponse } from "next/server";
import bcrypt from "bcryptjs";
import pg from 'pg';

const { Pool } = pg;
const pool = new Pool({
  connectionString: process.env.DATABASE_URL
});

export async function POST(req: Request) {
  try {
    const { name, email, phone, password } = await req.json();

    if (!name || !email || !password) {
      return NextResponse.json({ error: "Missing required fields" }, { status: 400 });
    }

    // Check if user already exists
    const existingUser = await pool.query('SELECT * FROM users WHERE email = $1', [email]);
    const hashedPassword = await bcrypt.hash(password, 10);
    
    if (existingUser.rows.length > 0) {
      const user = existingUser.rows[0];
      if (user.password_hash) {
        // User has a password, meaning they registered normally
        return NextResponse.json({ error: "User already exists with this email" }, { status: 400 });
      } else {
        // User logged in via Google previously, but has no password
        // Update their account with the new password
        const updateQuery = `
          UPDATE users 
          SET password_hash = $1, full_name = COALESCE(full_name, $2), phone_number = COALESCE(phone_number, $3)
          WHERE email = $4
          RETURNING id, full_name, email;
        `;
        const result = await pool.query(updateQuery, [hashedPassword, name, phone || null, email]);
        return NextResponse.json({ message: "Password added to your Google account", user: result.rows[0] }, { status: 201 });
      }
    }

    // Insert new user
    const insertQuery = `
      INSERT INTO users (full_name, email, phone_number, password_hash) 
      VALUES ($1, $2, $3, $4)
      RETURNING id, full_name, email;
    `;
    const result = await pool.query(insertQuery, [name, email, phone || null, hashedPassword]);

    return NextResponse.json({ message: "User created successfully", user: result.rows[0] }, { status: 201 });
  } catch (error) {
    console.error("Registration error:", error);
    return NextResponse.json({ error: "Internal server error" }, { status: 500 });
  }
}
