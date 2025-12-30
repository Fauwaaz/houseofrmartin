import crypto from "crypto";
import axios from "axios";

const workingKey = process.env.CCAVENUE_WORKING_KEY;
const wooBaseUrl = process.env.WOOCOMMERCE_URL; // Example: https://yourstore.com/wp-json/wc/v3
const wooConsumerKey = process.env.WOOCOMMERCE_CONSUMER_KEY;
const wooConsumerSecret = process.env.WOOCOMMERCE_CONSUMER_SECRET;

// AES Decrypt function
function decrypt(encText, workingKey) {
  const m = crypto.createHash("md5").update(workingKey).digest();
  const key = Buffer.concat([m, m.slice(0, 8)]);
  const iv = Buffer.from([
    0x00, 0x01, 0x02, 0x03,
    0x04, 0x05, 0x06, 0x07,
    0x08, 0x09, 0x0a, 0x0b,
    0x0c, 0x0d, 0x0e, 0x0f
  ]);
  const decipher = crypto.createDecipheriv("aes-128-cbc", key.slice(0, 16), iv);
  let decrypted = decipher.update(encText, "hex", "utf8");
  decrypted += decipher.final("utf8");
  return decrypted;
}

export default async function handler(req, res) {
  if (req.method !== "POST") {
    return res.status(405).send("Method Not Allowed");
  }

  try {
    const { encResp } = req.body;
    if (!encResp) return res.status(400).send("Missing encResp from CCAvenue");

    // Step 1️⃣ Decrypt CCAvenue Response
    const decryptedText = decrypt(encResp, workingKey);
    console.log("🔓 Decrypted:", decryptedText);

    // Step 2️⃣ Parse key=value pairs
    const params = {};
    decryptedText.split("&").forEach((pair) => {
      const [key, value] = pair.split("=");
      if (key && value) params[key] = decodeURIComponent(value);
    });

    const orderId = params.order_id;
    const orderStatus = params.order_status;
    console.log("🧾 Order:", orderId, "→", orderStatus);

    // Step 3️⃣ Map CCAvenue Status → WooCommerce Status
    let wooStatus = "pending";
    if (orderStatus === "Success") wooStatus = "processing";
    else if (orderStatus === "Aborted" || orderStatus === "Failure") wooStatus = "failed";
    else if (orderStatus === "Cancelled") wooStatus = "cancelled";

    // Step 4️⃣ Update WooCommerce via REST API
    const wooUrl = `${wooBaseUrl}/orders/${orderId}`;
    console.log(`🔄 Updating WooCommerce: ${wooUrl} → ${wooStatus}`);

    const wooResponse = await axios.put(
      wooUrl,
      { status: wooStatus },
      {
        auth: {
          username: wooConsumerKey,
          password: wooConsumerSecret,
        },
        headers: { "Content-Type": "application/json" },
      }
    );

    console.log(`✅ WooCommerce order ${orderId} updated → ${wooStatus}`);
    console.log("📦 Woo response:", wooResponse.data.status);

    // Step 5️⃣ Redirect to proper frontend page
    if (orderStatus === "Success") {
      return res.redirect(302, `/payment/success?order=${orderId}`);
    } else {
      return res.redirect(302, `/payment/cancel?order=${orderId}`);
    }

  } catch (err) {
    console.error("❌ CCAvenue Callback Error:", err.response?.data || err.message);
    return res.status(500).send("Internal Server Error");
  }
}