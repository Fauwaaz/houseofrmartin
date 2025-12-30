import axios from "axios";

export default async function handler(req, res) {
  if (req.method !== "POST") {
    return res.status(405).json({ error: "Method not allowed" });
  }

  try {
    const { orderId } = req.body;

    if (!orderId) {
      return res.status(400).json({ error: "Missing orderId" });
    }

    // RakBank REST API call to get order status
    const response = await axios.get(
      `https://rakbankpay-nam.gateway.mastercard.com/api/rest/version/100/merchant/${process.env.RAKBANK_MERCHANT_ID}/order/${orderId}`,
      {
        auth: {
          username: `merchant.${process.env.RAKBANK_MERCHANT_ID}`,
          password: process.env.RAKBANK_API_PASSWORD,
        },
        headers: {
          "Content-Type": "application/json",
        },
      }
    );

    const orderData = response.data?.order;

    if (!orderData) {
      return res.status(404).json({ error: "Order not found in RakBank system" });
    }

    // Check if payment was successful
    const isPaid = orderData.status === "CAPTURED" || orderData.status === "AUTHORIZED";

    res.status(200).json({
      success: isPaid,
      order: orderData,
    });
  } catch (error) {
    console.error("RakBankPay verify error:", error.response?.data || error.message);
    res.status(error.response?.status || 500).json({
      error: "RakBankPay verification failed",
      details: error.response?.data || error.message,
    });
  }
}