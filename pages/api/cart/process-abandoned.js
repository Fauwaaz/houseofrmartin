import { db } from "../../../libs/db";

const AISENSY_WEBHOOK =
  "https://apis.aisensy.com/woocommerce/t1/shop/events/webhook-events/68fa2386a2b213674502625f";

export default async function handler(req, res) {
  try {
    const [rows] = await db.execute(`
      SELECT *
      FROM fxiEe_abandoned_carts
      WHERE status = 'active'
        AND last_activity < NOW() - INTERVAL 30 MINUTE
        AND (last_notified_at IS NULL)
      LIMIT 10
    `);

    for (const cart of rows) {
      await fetch(AISENSY_WEBHOOK, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          phone: cart.phone,
          cart: JSON.parse(cart.cart_json),
          user_id: cart.user_id,
        }),
      });

      await db.execute(
        `
        UPDATE fxiEe_abandoned_carts
        SET last_notified_at = NOW()
        WHERE user_id = ?
        `,
        [cart.user_id]
      );
    }

    res.json({ success: true, processed: rows.length });
  } catch (err) {
    console.error("❌ Abandoned cart processor failed", err);
    res.status(500).json({ success: false });
  }
}