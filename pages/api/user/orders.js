// /api/user/orders.js
import jwt from "jsonwebtoken";
import axios from "axios";
import mysql from "mysql2/promise";

const SECRET_KEY = process.env.JWT_SECRET || "super_secret_key";
const WP_PREFIX = process.env.WP_TABLE_PREFIX || "fxiEe_";

export default async function handler(req, res) {
  try {
    // 1️⃣ Get token from cookies
    const token = req.cookies.session;
    if (!token)
      return res.status(401).json({ success: false, message: "Unauthorized" });

    // 2️⃣ Decode JWT to get WordPress user ID
    const decoded = jwt.verify(token, SECRET_KEY);

    // 3️⃣ Fetch the user’s email and WooCommerce ID from the DB
    const conn = await mysql.createConnection({
      host: process.env.DB_HOST,
      user: process.env.DB_USER,
      password: process.env.DB_PASS,
      database: process.env.DB_NAME,
    });

    const [rows] = await conn.execute(
      `SELECT user_email, ID FROM \`${WP_PREFIX}users\` WHERE ID = ?`,
      [decoded.id]
    );

    await conn.end();

    if (!rows.length)
      return res
        .status(404)
        .json({ success: false, message: "User not found in database" });

    const userEmail = rows[0].user_email;

    // 4️⃣ Fetch all WooCommerce orders
    const { data: orders } = await axios.get(
      `${process.env.NEXT_PUBLIC_WORDPRESS_URL}/wp-json/wc/v3/orders`,
      {
        auth: {
          username: process.env.WOOCOMMERCE_CONSUMER_KEY,
          password: process.env.WOOCOMMERCE_CONSUMER_SECRET,
        },
        params: {
          per_page: 50, // fetch more to ensure we get all orders
          order: "desc",
          orderby: "date",
        },
      }
    );

    // 5️⃣ Filter orders by customer email on the backend
    const userOrders = orders.filter(
      (order) => order.billing.email === userEmail
    );

    // 6️⃣ Map orders to include items with image, attributes, etc.
    const formattedOrders = userOrders.map((order) => ({
      id: order.id,
      date: order.date_created,
      total: order.total,
      currency: order.currency,
      status: order.status,
      items: order.line_items.map((item) => ({
        name: item.name,
        quantity: item.quantity,
        price: item.price,
        image: item.image?.src || null,
      })),
    }));

    res.status(200).json({
      success: true,
      orders: formattedOrders,
    });
  } catch (err) {
    console.error("/api/user/orders error:", err.response?.data || err.message);
    res.status(500).json({
      success: false,
      message: "Error fetching user orders",
      error: err.message,
    });
  }
}