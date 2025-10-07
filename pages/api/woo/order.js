import api from "../../../utils/woocommerce";

export default async function handler(req, res) {
  if (req.method !== "GET") {
    return res.status(405).json({ message: "Method Not Allowed" });
  }

  const { orderId } = req.query;

  if (!orderId) {
    return res.status(400).json({ message: "Missing orderId parameter" });
  }

  try {
    const response = await api.get(`orders/${orderId}`);
    return res.status(200).json({ success: true, order: response.data });
  } catch (error) {
    console.error("WooCommerce API Error:", error.response?.data || error.message);
    return res.status(500).json({
      success: false,
      error: error.response?.data || error.message,
    });
  }
}
