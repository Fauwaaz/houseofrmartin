import api from "../../../utils/woocommerce";

export default async function handler(req, res) {
  if (req.method !== "POST") {
    return res.status(405).json({ message: "Method not allowed" });
  }

  try {
    const { order_id, status, transaction_id } = req.body;

    if (!order_id) {
      return res.status(400).json({ message: "order_id is required" });
    }

    // ✅ Update WooCommerce order
    const { data } = await api.put(`orders/${order_id}`, {
      set_paid: status === "processing" || status === "completed", // mark as paid
      status: status || "processing",
      transaction_id: transaction_id || null,
    });

    return res.status(200).json({
      success: true,
      message: "Order updated successfully",
      order: data,
    });
  } catch (error) {
    console.error("WooCommerce order update error:", error.response?.data || error);
    return res.status(500).json({
      success: false,
      message: "Failed to update order",
      error: error.response?.data || error.message,
    });
  }
}