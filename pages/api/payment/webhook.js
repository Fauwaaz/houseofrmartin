// pages/api/payment/webhook.js
import crypto from 'crypto';

export const config = {
  api: {
    bodyParser: false // we need raw body
  }
};

async function getRawBody(req) {
  const chunks = [];
  for await (const chunk of req) chunks.push(chunk);
  return Buffer.concat(chunks);
}

export default async function handler(req, res) {
  if (req.method !== 'POST') return res.status(405).end();

  try {
    const raw = await getRawBody(req);
    const bodyStr = raw.toString('utf8');

    const webhookSecret = process.env.WEBHOOK_SECRET;
    // the header name depends on gateway; check your docs. e.g. 'x-hub-signature' or 'x-mc-signature'
    const signatureHeader = req.headers['x-signature'] || req.headers['x-webhook-signature'] || req.headers['x-mc-signature'];

    if (!webhookSecret || !signatureHeader) {
      console.warn('Missing webhook secret or signature header');
      // For security, you may want to reject: return res.status(401).end();
    } else {
      const hmac = crypto.createHmac('sha256', webhookSecret);
      hmac.update(bodyStr, 'utf8');
      const digest = hmac.digest('base64');

      // Compare digests; use timing-safe compare
      const safeEqual = (a, b) => {
        const bufA = Buffer.from(a);
        const bufB = Buffer.from(b);
        if (bufA.length !== bufB.length) return false;
        return crypto.timingSafeEqual(bufA, bufB);
      };

      if (!safeEqual(digest, signatureHeader)) {
        console.warn('Invalid webhook signature');
        return res.status(401).end();
      }
    }

    const payload = JSON.parse(bodyStr);
    // handle event: e.g. check payload.transaction.status or payload.order.status
    console.log('Webhook payload', payload);

    // Update your order DB, mark paid, send email, etc.

    return res.status(200).json({ received: true });
  } catch (err) {
    console.error('Webhook handler error', err);
    return res.status(500).end();
  }
}