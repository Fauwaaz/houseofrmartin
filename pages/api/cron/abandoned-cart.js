import mysql from "mysql2/promise";
import { sendAbandonedCartMessage } from "../../../libs/aisensy";

export default async function handler(req, res) {
  if (req.headers.authorization !== `Bearer ${process.env.CRON_SECRET}`) {
    return res.status(401).end("Unauthorized");
  }

  const conn = await mysql.createConnection({
    host: process.env.DB_HOST,
    user: process.env.DB_USER,
    password: process.env.DB_PASS,
    database: process.env.DB_NAME,
  });

  const [rows] = await conn.execute(`
    SELECT *
    FROM fxiEe_abandoned_carts
    WHERE status = 'active'
      AND cart_json IS NOT NULL
  `);

  const now = Date.now();

  for (const row of rows) {
    const last = new Date(row.last_activity).getTime();
    const diff = now - last;
    const cartItems = JSON.parse(row.cart_json);

    try {
      // 1 HOUR
      if (diff > 60 * 60 * 1000 && !row.reminder_1h_sent) {
        await sendAbandonedCartMessage({
          phone: row.phone,
          cartItems,
          stage: "1h",
        });

        await conn.execute(
          `UPDATE fxiEe_abandoned_carts SET reminder_1h_sent = 1 WHERE id = ?`,
          [row.id]
        );
      }

      // 12 HOURS
      if (diff > 12 * 60 * 60 * 1000 && !row.reminder_12h_sent) {
        await sendAbandonedCartMessage({
          phone: row.phone,
          cartItems,
          stage: "12h",
        });

        await conn.execute(
          `UPDATE fxiEe_abandoned_carts SET reminder_12h_sent = 1 WHERE id = ?`,
          [row.id]
        );
      }

      // 24 HOURS
      if (diff > 24 * 60 * 60 * 1000 && !row.reminder_24h_sent) {
        await sendAbandonedCartMessage({
          phone: row.phone,
          cartItems,
          stage: "24h",
        });

        await conn.execute(
          `UPDATE fxiEe_abandoned_carts SET reminder_24h_sent = 1 WHERE id = ?`,
          [row.id]
        );
      }
    } catch (err) {
      console.error("❌ Abandoned cart send failed", err.message);
    }
  }

  await conn.end();
  res.json({ success: true });
}