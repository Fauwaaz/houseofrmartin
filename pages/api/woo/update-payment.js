import api from "../../../utils/woocommerce";

export default async function handler(req, res) {
  if (req.method !== "POST") {
    return res.status(405).json({ success: false, message: "Method not allowed" });
  }

  try {
    const { orderId, paymentId, paymentMethod, status } = req.body;

    if (!orderId || !paymentMethod) {
      return res.status(400).json({ success: false, message: "Missing fields" });
    }

    let orderStatus = "pending";
    if (status === "success" || status === "processing") orderStatus = "processing";
    if (status === "failed") orderStatus = "failed";

    // ✅ Update WooCommerce order
    const response = await api.put(`orders/${orderId}`, {
      status: orderStatus,
      set_paid: status === "success" || status === "processing",
      meta_data: [
        { key: "payment_id", value: paymentId || "N/A" },
        { key: "paymentMethod", value: paymentMethod },
      ],
    });

    return res.status(200).json({ success: true, order: response.data });
  } catch (err) {
    console.error("Woo update error:", err.response?.data || err.message);
    return res.status(500).json({ success: false, message: "Server error" });
  }
}