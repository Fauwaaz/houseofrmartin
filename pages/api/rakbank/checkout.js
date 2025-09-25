import axios from "axios";
import api from "../../../utils/woocommerce";

export default async function handler(req, res) {
  if (req.method !== "POST") {
    return res.status(405).json({ error: "Method not allowed" });
  }

  try {
    const { cartItems, totalAmount, orderId, customer } = req.body;

    // Call RakBankPay API (simplified for example)
    const rakResponse = await axios.post("https://sandbox.rakbankpay.ae/api/payment/create", {
      merchantId: process.env.RAKBANK_MERCHANT_ID,
      orderId,
      amount: totalAmount,
      currency: "AED",
      returnUrl: `${process.env.NEXT_PUBLIC_BASE_URL}/payment/success?orderId=${orderId}`,
      cancelUrl: `${process.env.NEXT_PUBLIC_BASE_URL}/payment/cancel?orderId=${orderId}`,
    }, {
      headers: {
        accessKey: process.env.RAKBANK_ACCESS_KEY,
        secretKey: process.env.RAKBANK_SECRET_KEY,
      },
    });

    // Save the payment session response
    const paymentUrl = rakResponse.data.paymentUrl;

    // ⚡ Create WooCommerce Order (PENDING status until confirmation)
    const wooOrder = await api.post("orders", {
      payment_method: "rakbankpay",
      payment_method_title: "RakBankPay",
      set_paid: false,
      billing: {
        first_name: customer?.firstName || "Guest",
        last_name: customer?.lastName || "",
        email: customer?.email || "",
        phone: customer?.phone || "",
      },
      line_items: cartItems.map((item) => ({
        product_id: item.wooProductId, // Must pass WooCommerce product ID
        quantity: item.quantity,
      })),
      meta_data: [
        { key: "rakbankpay_order_id", value: orderId },
      ],
    });

    res.status(200).json({
      paymentUrl,
      wooOrderId: wooOrder.data.id,
    });

  } catch (error) {
    console.error("RakBankPay Checkout Error:", error.response?.data || error.message);
    res.status(500).json({ error: "RakBankPay checkout failed" });
  }
} 