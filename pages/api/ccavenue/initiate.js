import crypto from "crypto";

const merchantId = process.env.CCAVENUE_MERCHANT_ID;
const accessCode = process.env.CCAVENUE_ACCESS_CODE;
const workingKey = process.env.CCAVENUE_WORKING_KEY; // encryption key
const transactionUrl = "https://secure.ccavenue.ae/transaction/transaction.do?command=initiateTransaction";

function encrypt(plainText, workingKey) {
  const m = crypto.createHash("md5").update(workingKey).digest();
  const key = Buffer.concat([m, m.slice(0, 8)]);
  const iv = Buffer.from([
    0x00, 0x01, 0x02, 0x03, 0x04, 0x05, 0x06, 0x07,
    0x08, 0x09, 0x0a, 0x0b, 0x0c, 0x0d, 0x0e, 0x0f
  ]);
  const cipher = crypto.createCipheriv("aes-128-cbc", key.slice(0, 16), iv);
  let encrypted = cipher.update(plainText, "utf8", "hex");
  encrypted += cipher.final("hex");
  return encrypted;
}

const encodeField = (field) => encodeURIComponent(field || "");

export default async function handler(req, res) {
  if (req.method !== "POST") {
    return res.status(405).json({ message: "Method not allowed" });
  }

  try {
    const { amount, orderId, redirectUrl, cancelUrl, user } = req.body;

    if (!amount || !orderId || !user) {
      return res.status(400).json({ message: "Missing required parameters" });
    }

    let plainRequest = `merchant_id=${merchantId}&order_id=${orderId}&currency=AED&amount=${amount}&redirect_url=${redirectUrl}&cancel_url=${cancelUrl}&language=EN`;

    plainRequest += `&billing_name=${encodeField(user.name)}`;
    plainRequest += `&billing_address=${encodeField(user.address)}`;
    plainRequest += `&billing_city=${encodeField(user.city)}`;
    plainRequest += `&billing_state=${encodeField(user.state)}`;
    plainRequest += `&billing_zip=${encodeField(user.zip)}`;
    plainRequest += `&billing_country=${encodeField(user.country)}`;
    plainRequest += `&billing_tel=${encodeField(user.phone)}`;
    plainRequest += `&billing_email=${encodeField(user.email)}`;

    plainRequest += `&delivery_name=${encodeField(user.name)}`;
    plainRequest += `&delivery_address=${encodeField(user.address)}`;
    plainRequest += `&delivery_city=${encodeField(user.city)}`;
    plainRequest += `&delivery_state=${encodeField(user.state)}`;
    plainRequest += `&delivery_zip=${encodeField(user.zip)}`;
    plainRequest += `&delivery_country=${encodeField(user.country)}`;
    plainRequest += `&delivery_tel=${encodeField(user.phone)}`;

    const encRequest = encrypt(plainRequest, workingKey);

    return res.status(200).json({
      encRequest,
      accessCode,
      transactionUrl,
    });
  } catch (err) {
    console.error("CCAvenue initiate error:", err);
    return res.status(500).json({ message: "Internal Server Error" });
  }
}