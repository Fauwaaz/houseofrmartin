import crypto from "crypto";

const merchantId = process.env.CCAVENUE_MERCHANT_ID;
const accessCode = process.env.CCAVENUE_ACCESS_CODE;
const workingKey = process.env.CCAVENUE_WORKING_KEY; // encryption key
const transactionUrl = "https://secure.ccavenue.ae/transaction/transaction.do?command=initiateTransaction";

// Encrypt function
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

export default async function handler(req, res) {
  if (req.method !== "POST") {
    return res.status(405).json({ message: "Method not allowed" });
  }

  try {
    const {
      cartItems,
      amount,
      orderId,
      redirectUrl,
      user,
    } = req.body;

    if (!amount || !orderId || !user) {
      return res.status(400).json({ message: "Missing required parameters" });
    }

    // user object example:
    // {
    //   name: "Fauwaaz Shaikh",
    //   email: "fauwaaz@example.com",
    //   phone: "971500000000",
    //   address: "Flat 401, Dubai Marina",
    //   city: "Dubai",
    //   state: "Dubai",
    //   zip: "00000",
    //   country: "AE"
    // }

    // Build the request string
    let plainRequest = `merchant_id=${merchantId}&order_id=${orderId}&currency=AED&amount=${amount}&redirect_url=${redirectUrl}&cancel_url=${redirectUrl}&language=EN`;

    // Billing Info
    plainRequest += `&billing_name=${encodeURIComponent(user.name)}`;
    plainRequest += `&billing_address=${encodeURIComponent(user.address)}`;
    plainRequest += `&billing_city=${encodeURIComponent(user.city)}`;
    plainRequest += `&billing_state=${encodeURIComponent(user.state)}`;
    plainRequest += `&billing_zip=${encodeURIComponent(user.zip)}`;
    plainRequest += `&billing_country=${encodeURIComponent(user.country)}`;
    plainRequest += `&billing_tel=${encodeURIComponent(user.phone)}`;
    plainRequest += `&billing_email=${encodeURIComponent(user.email)}`;

    // Delivery Info (optional)
    plainRequest += `&delivery_name=${encodeURIComponent(user.name)}`;
    plainRequest += `&delivery_address=${encodeURIComponent(user.address)}`;
    plainRequest += `&delivery_city=${encodeURIComponent(user.city)}`;
    plainRequest += `&delivery_state=${encodeURIComponent(user.state)}`;
    plainRequest += `&delivery_zip=${encodeURIComponent(user.zip)}`;
    plainRequest += `&delivery_country=${encodeURIComponent(user.country)}`;
    plainRequest += `&delivery_tel=${encodeURIComponent(user.phone)}`;

    // Order Items (optional notes)
    plainRequest += `&merchant_param1=${encodeURIComponent(JSON.stringify(cartItems))}`;

    // Encrypt
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
