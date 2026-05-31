import { getServerSession } from "next-auth/next";
import { NextResponse } from "next/server";
import bcrypt from "bcryptjs";
import pg from 'pg';

const { Pool } = pg;
const pool = new Pool({
  connectionString: process.env.DATABASE_URL
});

export async function POST(req: Request) {
  try {
    const session = await getServerSession();

    if (!session || !session.user || !session.user.email) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const { oldPassword, newPassword } = await req.json();

    if (!oldPassword || !newPassword) {
      return NextResponse.json({ error: "Missing required fields" }, { status: 400 });
    }

    // Get user from database
    const userRes = await pool.query('SELECT * FROM users WHERE email = $1', [session.user.email]);
    const user = userRes.rows[0];

    if (!user) {
      return NextResponse.json({ error: "User not found" }, { status: 404 });
    }

    if (!user.password_hash) {
      return NextResponse.json({ error: "Cannot change password for users who sign in with Google." }, { status: 400 });
    }

    // Verify old password
    const isPasswordValid = await bcrypt.compare(oldPassword, user.password_hash);
    if (!isPasswordValid) {
      return NextResponse.json({ error: "Incorrect current password." }, { status: 401 });
    }

    // Hash new password
    const salt = await bcrypt.genSalt(10);
    const hashedPassword = await bcrypt.hash(newPassword, salt);

    // Update password in database
    await pool.query('UPDATE users SET password_hash = $1 WHERE email = $2', [hashedPassword, session.user.email]);

    return NextResponse.json({ message: "Password updated successfully" }, { status: 200 });

  } catch (error: any) {
    console.error("Change password error:", error);
    return NextResponse.json({ error: "Internal server error" }, { status: 500 });
  }
}
