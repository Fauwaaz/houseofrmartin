const GATEWAY_HOST = process.env.RAKBANK_GATEWAY_HOST; // e.g. test-rakbankpay.mtf.gateway.mastercard.com
const MERCHANT_ID = process.env.RAKBANK_MERCHANT_ID;
const API_PASSWORD = process.env.RAKBANK_API_PASSWORD;

export default async function handler(req, res) {
  if (req.method !== 'POST') return res.status(405).end();

  try {
    const { orderId, amount, currency = 'AED', returnUrl } = req.body;

    if (!orderId || !amount) {
      return res.status(400).json({ error: 'orderId and amount required' });
    }

    // Build session payload according to gateway docs:
    const payload = {
      apiOperation: 'CREATE_CHECKOUT_SESSION',
      order: {
        id: orderId,
        amount: String(amount),
        currency: currency
      },
      interaction: {
        // operation can be PURCHASE or AUTHORISE depending on gateway/config
        operation: 'PURCHASE',
        returnUrl: returnUrl || `${process.env.NEXT_PUBLIC_BASE_URL}/payment/complete`
      }
    };

    // Basic Auth username: merchant.<MERCHANT_ID>
    const username = `merchant.${MERCHANT_ID}`;
    const basic = Buffer.from(`${username}:${API_PASSWORD}`).toString('base64');

    const url = `https://${GATEWAY_HOST}/api/rest/version/100/merchant/${MERCHANT_ID}/session`; // example path; check your docs/version
    const r = await fetch(url, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Basic ${basic}`
      },
      body: JSON.stringify(payload)
    });

    if (!r.ok) {
      const txt = await r.text();
      console.error('Gateway error', r.status, txt);
      return res.status(502).json({ error: 'Gateway error', details: txt });
    }

    const json = await r.json();
    // json should contain session.id (or similar); pass it to client
    return res.status(200).json({ session: json });
  } catch (err) {
    console.error('session error', err);
    return res.status(500).json({ error: 'server error' });
  }
}