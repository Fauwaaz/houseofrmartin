// pages/api/user/orders.js
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

    // WooCommerce orders are stored in wp_posts with post_type = shop_order
    const [orders] = await conn.execute(
      `SELECT ID, post_date, post_status 
       FROM \`${WP_PREFIX}posts\` 
       WHERE post_type = 'shop_order' 
       AND post_author = ? 
       ORDER BY post_date DESC
       LIMIT 20`,
      [decoded.id]
    );

    if (!orders.length) {
      await conn.end();
      return res.json({ success: true, orders: [] });
    }

    // For each order, fetch meta
    const orderIds = orders.map((o) => o.ID);
    const [metaRows] = await conn.execute(
      `SELECT post_id, meta_key, meta_value 
       FROM \`${WP_PREFIX}postmeta\` 
       WHERE post_id IN (?)`,
      [orderIds]
    );

    await conn.end();

    const orderMetaMap = {};
    metaRows.forEach((row) => {
      if (!orderMetaMap[row.post_id]) orderMetaMap[row.post_id] = {};
      orderMetaMap[row.post_id][row.meta_key] = row.meta_value;
    });

    const formattedOrders = orders.map((order) => ({
      id: order.ID,
      date: order.post_date,
      status: order.post_status.replace("wc-", ""), // e.g., wc-completed → completed
      meta: orderMetaMap[order.ID] || {},
    }));

    res.json({ success: true, orders: formattedOrders });
  } catch (err) {
    console.error("❌ /api/user/orders error:", err.message);
    res.json({ success: false, message: "Server error" });
  }
}