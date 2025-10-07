import crypto from "crypto";
import axios from "axios";

const workingKey = process.env.CCAVENUE_WORKING_KEY; 
const wooBaseUrl = process.env.WOOCOMMERCE_URL;
const wooConsumerKey = process.env.WOOCOMMERCE_CONSUMER_KEY;
const wooConsumerSecret = process.env.WOOCOMMERCE_CONSUMER_SECRET;


// Decrypt function (AES 128 CBC)
function decrypt(encText, workingKey) {
  const m = crypto.createHash("md5").update(workingKey).digest();
  const key = Buffer.concat([m, m.slice(0, 8)]);
  const iv = Buffer.from([
    0x00, 0x01, 0x02, 0x03, 0x04, 0x05, 0x06, 0x07,
    0x08, 0x09, 0x0a, 0x0b, 0x0c, 0x0d, 0x0e, 0x0f
  ]);
  const decipher = crypto.createDecipheriv("aes-128-cbc", key.slice(0, 16), iv);
  let decrypted = decipher.update(encText, "hex", "utf8");
  decrypted += decipher.final("utf8");
  return decrypted;
}

export default async function handler(req, res) {
  if (req.method === "POST") {
    try {
      const encResp = req.body.encResp;

      if (!encResp) {
        return res.status(400).send("Missing encResp from CCAvenue");
      }

      // 1️⃣ Decrypt the response
      const decryptedText = decrypt(encResp, workingKey);
      console.log("Decrypted Response:", decryptedText);

      // 2️⃣ Parse the key-value pairs
      const params = {};
      decryptedText.split("&").forEach((pair) => {
        const [key, value] = pair.split("=");
        if (key && value) params[key] = decodeURIComponent(value);
      });

      const orderId = params.order_id;
      const orderStatus = params.order_status;

      console.log("Order:", orderId, "Status:", orderStatus);

      // 3️⃣ Map CCAvenue status to WooCommerce status
      let wooStatus = "pending";
      if (orderStatus === "Success") wooStatus = "processing";
      else if (orderStatus === "Aborted" || orderStatus === "Failure") wooStatus = "failed";
      else if (orderStatus === "Cancelled") wooStatus = "cancelled";

      // 4️⃣ Update order status in WooCommerce
      try {
        await axios.put(
          `${wooBaseUrl}/orders/${orderId}`,
          { status: wooStatus },
          {
            auth: {
              username: wooConsumerKey,
              password: wooConsumerSecret,
            },
          }
        );
        console.log(`✅ WooCommerce order ${orderId} updated to ${wooStatus}`);
      } catch (wooErr) {
        console.error("⚠️ WooCommerce update failed:", wooErr.response?.data || wooErr.message);
      }

      // 5️⃣ Show a thank-you page or redirect
      if (orderStatus === "Success") {
        return res.redirect(`/payment/success?order=${orderId}`);
      } else {
        return res.redirect(`/payment/failed?order=${orderId}`);
      }
    } catch (err) {
      console.error("Callback Error:", err);
      return res.status(500).send("Internal Server Error");
    }
  } else {
    return res.status(405).send("Method not allowed");
  }
}