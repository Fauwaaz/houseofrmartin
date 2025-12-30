import { db } from "../../../libs/db";

export default async function handler(req, res) {
  if (req.method !== "POST") {
    return res.status(405).json({ success: false });
  }

  try {
    const { userId, phone, cartItems, status } = req.body;

    if (!userId || !phone) {
      return res.status(400).json({ success: false, message: "Invalid payload" });
    }

    // Empty cart → mark inactive
    if (!cartItems || cartItems.length === 0) {
      await db.execute(
        `
        UPDATE fxiEe_abandoned_carts
        SET cart_json = '[]',
            status = 'empty',
            last_activity = NOW()
        WHERE user_id = ?
        `,
        [userId]
      );

      return res.json({ success: true, cleared: true });
    }

    // Normal save / update
    await db.execute(
      `
      INSERT INTO fxiEe_abandoned_carts (user_id, phone, cart_json, last_activity, status)
      VALUES (?, ?, ?, NOW(), 'active')
      ON DUPLICATE KEY UPDATE
        cart_json = VALUES(cart_json),
        last_activity = NOW(),
        status = 'active'
      `,
      [userId, phone, JSON.stringify(cartItems)]
    );

    return res.json({ success: true });
  } catch (err) {
    console.error("❌ Abandoned cart save error:", err);
    return res.status(500).json({ success: false });
  }
}