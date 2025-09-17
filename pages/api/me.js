// pages/api/me.js
import jwt from "jsonwebtoken";
import mysql from "mysql2/promise";

const SECRET_KEY = process.env.JWT_SECRET || "super_secret_key";
const WP_PREFIX = process.env.WP_TABLE_PREFIX || "fxiEe_";

export default async function handler(req, res) {
  let conn;
  try {
    const token = req.cookies?.session;
    if (!token) {
      return res.json({ user: null });
    }

    // Verify JWT
    const decoded = jwt.verify(token, SECRET_KEY);

    conn = await mysql.createConnection({
      host: process.env.DB_HOST,
      user: process.env.DB_USER,
      password: process.env.DB_PASS,
      database: process.env.DB_NAME,
      port: process.env.DB_PORT ? Number(process.env.DB_PORT) : 3306,
    });

    // Fetch user from WordPress users table
    const [rows] = await conn.execute(
      `SELECT ID, user_email, display_name 
       FROM \`${WP_PREFIX}users\` 
       WHERE ID = ? LIMIT 1`,
      [decoded.id]
    );

    if (!rows || rows.length === 0) {
      return res.json({ user: null });
    }

    const user = rows[0];

    return res.json({
      user: {
        id: user.ID,
        email: user.user_email,
        name: user.display_name || user.user_email.split("@")[0],
      },
    });
  } catch (err) {
    console.error("❌ /api/me error:", err.message);
    return res.json({ user: null });
  } finally {
    if (conn) await conn.end();
  }
}