// pages/api/user/profile.js
import jwt from "jsonwebtoken";
import mysql from "mysql2/promise";

const SECRET_KEY = process.env.JWT_SECRET || "super_secret_key";
const WP_PREFIX = process.env.WP_TABLE_PREFIX || "fxiEe_";

export default async function handler(req, res) {
  try {
    const token = req.cookies.session;
    if (!token) return res.json({ success: false, message: "Not logged in" });

    const decoded = jwt.verify(token, SECRET_KEY);

    const conn = await mysql.createConnection({
      host: process.env.DB_HOST,
      user: process.env.DB_USER,
      password: process.env.DB_PASS,
      database: process.env.DB_NAME,
    });

    // Get user basic info
    const [users] = await conn.execute(
      `SELECT ID, user_login, user_email, display_name 
       FROM \`${WP_PREFIX}users\` WHERE ID = ? LIMIT 1`,
      [decoded.id]
    );

    if (!users.length) {
      await conn.end();
      return res.json({ success: false, message: "User not found" });
    }

    const user = users[0];

    // Get usermeta
    const [metaRows] = await conn.execute(
      `SELECT meta_key, meta_value 
       FROM \`${WP_PREFIX}usermeta\` 
       WHERE user_id = ?`,
      [decoded.id]
    );

    await conn.end();

    const meta = {};
    metaRows.forEach((row) => {
      meta[row.meta_key] = row.meta_value;
    });

    res.json({
      success: true,
      user: {
        ...user,
        meta,
      },
    });
  } catch (err) {
    console.error("/api/user/profile error:", err.message);
    res.json({ success: false, message: "Server error" });
  }
}