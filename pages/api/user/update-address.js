// pages/api/user/update-address.js
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
    const {
      billing_address_1,
      billing_address_2,
      billing_city,
      billing_state,
      billing_postcode,
      billing_country,
      shipping_address_1,
      shipping_address_2,
      shipping_city,
      shipping_state,
      shipping_postcode,
      shipping_country,
      same_as_billing,
    } = req.body;

    const conn = await mysql.createConnection({
      host: process.env.DB_HOST,
      user: process.env.DB_USER,
      password: process.env.DB_PASS,
      database: process.env.DB_NAME,
    });

    // Helper function to upsert meta
    async function upsertMeta(userId, key, value) {
      if (value === undefined || value === null) return;
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

    // Billing
    await upsertMeta(decoded.id, "billing_address_1", billing_address_1);
    await upsertMeta(decoded.id, "billing_address_2", billing_address_2);
    await upsertMeta(decoded.id, "billing_city", billing_city);
    await upsertMeta(decoded.id, "billing_state", billing_state);
    await upsertMeta(decoded.id, "billing_postcode", billing_postcode);
    await upsertMeta(decoded.id, "billing_country", billing_country);
    await upsertMeta(decoded.id, "billing_phone", req.body.billing_phone || null);

    // Shipping
    await upsertMeta(decoded.id, "shipping_address_1", shipping_address_1);
    await upsertMeta(decoded.id, "shipping_address_2", shipping_address_2);
    await upsertMeta(decoded.id, "shipping_city", shipping_city);
    await upsertMeta(decoded.id, "shipping_state", shipping_state);
    await upsertMeta(decoded.id, "shipping_postcode", shipping_postcode);
    await upsertMeta(decoded.id, "shipping_country", shipping_country);

    // Same as billing
    await upsertMeta(decoded.id, "same_as_billing", same_as_billing ? "1" : "0");

    await conn.end();

    res.json({ success: true, message: "Address updated successfully" });
  } catch (err) {
    console.error("❌ update-address error:", err.message);
    res.json({ success: false, message: "Server error" });
  }
}