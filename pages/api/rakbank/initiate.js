import axios from "axios";

export default async function handler(req, res) {
  if (req.method !== "POST") {
    return res.status(405).json({ error: "Method not allowed" });
  }

  try {
    const { orderId, amount, user, redirectUrl, cancelUrl, cartItems } = req.body;

    if (!orderId || !amount) {
      return res.status(400).json({ error: "Missing required fields" });
    }

    const itemName = cartItems.map((item) => item.name)
    const itemQuantity = cartItems.map((item) => item.quantity)
    const itemSize = cartItems.map((item) => item.size)
    const itemColor = cartItems.map((item) => item.color)
    const item = `Name: ${itemName}, Quantity: ${itemQuantity}, Size: ${itemSize}, Color: ${itemColor}`

    const payload = {
      apiOperation: "INITIATE_CHECKOUT",
      order: {
        id: orderId.toString(),
        amount: Number(amount).toFixed(2),
        currency: "AED",
        description: `Order: #${orderId}, ${item}`,
      },
      interaction: {
        operation: "PURCHASE",
        merchant: {
          name: "House of R-Martin",
          url: "https://houseofrmartin.com/"
        },
        returnUrl: redirectUrl,
        cancelUrl: cancelUrl,
      },
      customer: {
        firstName: user?.firstName || user?.name?.split(" ")[0] || "",
        lastName: user?.lastName || user?.name?.split(" ")[1] || "",
        email: user?.email || "",
        mobilePhone: user?.phone || "",
      },
    };

    const rakResponse = await axios.post(
      `https://rakbankpay-nam.gateway.mastercard.com/api/rest/version/100/merchant/${process.env.RAKBANK_MERCHANT_ID}/session`,
      payload,
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

    const sessionId = rakResponse.data?.session?.id;

    if (!sessionId) {
      console.error("RakBank invalid response:", rakResponse.data);
      return res.status(500).json({ error: "RakBankPay initiate failed" });
    }

    const paymentUrl = `https://rakbankpay-nam.gateway.mastercard.com/checkout/version/100/merchant/${process.env.RAKBANK_MERCHANT_ID}/session/${sessionId}`;

    res.status(200).json({ paymentUrl, sessionId });
  } catch (error) {
    console.error("RakBankPay initiate error:", error.response?.data || error.message);
    res.status(error.response?.status || 500).json({
      error: "RakBankPay initiate failed",
      details: error.response?.data || error.message,
    });
  }
}