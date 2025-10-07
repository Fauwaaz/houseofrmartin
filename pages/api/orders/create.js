import api from "../../../utils/woocommerce";

export default async function handler(req, res) {
  if (req.method !== "POST") {
    return res.status(405).json({ message: "Method not allowed" });
  }

  try {
    const { customer, items, total, payment_method } = req.body;

    if (!items || items.length === 0) {
      return res.status(400).json({ message: "Cart items are required" });
    }

    // ✅ Build WooCommerce order data
    const orderData = {
      payment_method: payment_method || "ccavenue",
      payment_method_title: "CCAvenue Payment",
      set_paid: false, // mark after success callback
      billing: {
        first_name: customer?.first_name || "Guest",
        last_name: customer?.last_name || "",
        address_1: customer?.address_1 || "",
        city: customer?.city || "",
        state: customer?.state || "",
        postcode: customer?.postcode || "",
        country: customer?.country || "AE",
        email: customer?.email || "",
        phone: customer?.phone || "",
      },
      shipping: {
        first_name: customer?.first_name || "Guest",
        last_name: customer?.last_name || "",
        address_1: customer?.address_1 || "",
        city: customer?.city || "",
        state: customer?.state || "",
        postcode: customer?.postcode || "",
        country: customer?.country || "AE",
      },
      line_items: items.map((item) => ({
        product_id: item.product_id,
        quantity: item.quantity,
        variation_id: item.variation_id || undefined,
      })),
      total: total,
    };

    // ✅ Create order in WooCommerce
    const { data } = await api.post("orders", orderData);

    return res.status(200).json({
      success: true,
      message: "Order created successfully",
      order: data,
    });
  } catch (error) {
    console.error("WooCommerce order create error:", error.response?.data || error);
    return res.status(500).json({
      success: false,
      message: "Failed to create order",
      error: error.response?.data || error.message,
    });
  }
}