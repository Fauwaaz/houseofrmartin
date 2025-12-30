import { db } from "../../../libs/db";

export default async function handler(req, res) {
  if (req.method !== "GET") {
    return res.status(405).end();
  }

  const { userId } = req.query;
  if (!userId) {
    return res.status(400).json({ success: false });
  }

  try {
    const [rows] = await db.execute(
      `
      SELECT cart_json 
      FROM fxiEe_abandoned_carts
      WHERE user_id = ?
      ORDER BY last_activity DESC
      LIMIT 1
      `,
      [userId]
    );

    if (!rows.length) {
      return res.json({ success: true, cart: [] });
    }

    return res.json({
      success: true,
      cart: JSON.parse(rows[0].cart_json),
    });
  } catch (err) {
    console.error("❌ Fetch cart error", err);
    return res.status(500).json({ success: false });
  }
}