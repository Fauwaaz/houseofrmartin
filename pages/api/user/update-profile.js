// pages/api/user/update-profile.js
import jwt from "jsonwebtoken";
import mysql from "mysql2/promise";

const SECRET_KEY = process.env.JWT_SECRET || "super_secret_key";
const WP_PREFIX = process.env.WP_TABLE_PREFIX || "fxiEe_";

export default async function handler(req, res) {
  if (req.method !== "POST") return res.status(405).end();

  try {
    const token = req.cookies.session;
    if (!token) return res.json({ success: false, message: "Not logged in" });

    const decoded = jwt.verify(token, SECRET_KEY);
    const { first_name, last_name, phone, image } = req.body; // use separate fields

    const conn = await mysql.createConnection({
      host: process.env.DB_HOST,
      user: process.env.DB_USER,
      password: process.env.DB_PASS,
      database: process.env.DB_NAME,
    });

    // Update display_name using first_name + last_name
    if (first_name || last_name) {
      const displayName = `${first_name || ""} ${last_name || ""}`.trim();
      await conn.execute(
        `UPDATE \`${WP_PREFIX}users\` SET display_name = ? WHERE ID = ?`,
        [displayName, decoded.id]
      );
    }

    // Upsert user meta
    async function upsertMeta(userId, key, value) {
      if (!value) return;

      const [rows] = await conn.execute(
        `SELECT umeta_id FROM \`${WP_PREFIX}usermeta\` WHERE user_id = ? AND meta_key = ? LIMIT 1`,
        [userId, key]
      );

      if (rows.length > 0) {
        await conn.execute(
          `UPDATE \`${WP_PREFIX}usermeta\` SET meta_value = ? WHERE umeta_id = ?`,
          [value, rows[0].umeta_id]
        );
      } else {
        await conn.execute(
          `INSERT INTO \`${WP_PREFIX}usermeta\` (user_id, meta_key, meta_value) VALUES (?, ?, ?)`,
          [userId, key, value]
        );
      }
    }

    await upsertMeta(decoded.id, "first_name", first_name);
    await upsertMeta(decoded.id, "last_name", last_name);
    await upsertMeta(decoded.id, "billing_phone", phone);
    await upsertMeta(decoded.id, "profile_image", image);

    await conn.end();

    res.json({ success: true, message: "Profile updated successfully" });
  } catch (err) {
    console.error("❌ update-profile error:", err.message);
    res.json({ success: false, message: "Server error" });
  }
}