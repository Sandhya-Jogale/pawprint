import NextAuth from "next-auth";
import GoogleProvider from "next-auth/providers/google";
import CredentialsProvider from "next-auth/providers/credentials";
import bcrypt from "bcryptjs";
import pg from 'pg';

const { Pool } = pg;
const pool = new Pool({
  connectionString: process.env.DATABASE_URL
});

const handler = NextAuth({
  providers: [
    GoogleProvider({
      clientId: process.env.GOOGLE_CLIENT_ID || "",
      clientSecret: process.env.GOOGLE_CLIENT_SECRET || "",
      httpOptions: {
        timeout: 10000,
      },
    }),
    CredentialsProvider({
      name: "Credentials",
      credentials: {
        email: { label: "Email", type: "email", placeholder: "your.email@example.com" },
        password: { label: "Password", type: "password" }
      },
      async authorize(credentials) {
        if (!credentials?.email || !credentials?.password) {
          throw new Error("Missing credentials");
        }

        const userRes = await pool.query('SELECT * FROM users WHERE email = $1', [credentials.email]);
        const user = userRes.rows[0];

        if (!user || !user.password_hash) {
          throw new Error("Invalid credentials");
        }

        // Compare password
        const isPasswordValid = await bcrypt.compare(credentials.password, user.password_hash);

        if (!isPasswordValid) {
          throw new Error("Invalid credentials");
        }

        return {
          id: user.id,
          name: user.full_name,
          email: user.email,
        };
      }
    })
  ],
  pages: {
    signIn: '/login',
  },
  session: {
    strategy: "jwt",
  },
  callbacks: {
    async signIn({ user, account, profile }) {
      if (account?.provider === "google") {
        try {
          const { name, email } = user;
          
          // Sync the user to the PostgreSQL database
          await pool.query(
            `INSERT INTO users (full_name, email) 
             VALUES ($1, $2) 
             ON CONFLICT (email) DO NOTHING`,
            [name, email]
          );
          
          console.log(`✅ Synced Google user ${email} to PostgreSQL`);
          return true;
        } catch (error) {
          console.error("❌ Error saving user to DB during sign in:", error);
          // Return true anyway so the user can still access the frontend even if DB sync fails
          return true; 
        }
      }
      return true;
    },
    async jwt({ token, user }) {
      if (user) {
        token.id = user.id;
      }
      return token;
    },
    async session({ session, token }) {
      if (session.user && token.id) {
        // @ts-ignore
        session.user.id = token.id;
      }
      return session;
    },
  },
});

export { handler as GET, handler as POST };
