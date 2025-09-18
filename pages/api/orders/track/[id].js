// pages/api/orders/track/[id].js
import jwt from "jsonwebtoken";
import mysql from "mysql2/promise";

const SECRET_KEY = process.env.JWT_SECRET || "super_secret_key";
const WP_PREFIX = process.env.WP_TABLE_PREFIX || "fxiEe_";

export default async function handler(req, res) {
  const { id } = req.query;

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

    // Validate that order belongs to user
    const [orders] = await conn.execute(
      `SELECT ID, post_date, post_status 
       FROM \`${WP_PREFIX}posts\` 
       WHERE ID = ? AND post_type = 'shop_order' 
       AND post_author = ? LIMIT 1`,
      [id, decoded.id]
    );

    if (!orders.length) {
      await conn.end();
      return res.json({ success: false, message: "Order not found" });
    }

    // Fetch meta
    const [metaRows] = await conn.execute(
      `SELECT meta_key, meta_value 
       FROM \`${WP_PREFIX}postmeta\` 
       WHERE post_id = ?`,
      [id]
    );

    await conn.end();

    const meta = {};
    metaRows.forEach((row) => {
      meta[row.meta_key] = row.meta_value;
    });

    res.json({
      success: true,
      order: {
        id: orders[0].ID,
        date: orders[0].post_date,
        status: orders[0].post_status.replace("wc-", ""),
        meta,
      },
    });
  } catch (err) {
    console.error("❌ track-order error:", err.message);
    res.json({ success: false, message: "Server error" });
  }
}
