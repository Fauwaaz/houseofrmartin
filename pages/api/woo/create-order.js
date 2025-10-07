import api from "../../../utils/woocommerce";

export default async function handler(req, res) {
  if (req.method !== "POST") {
    return res.status(405).json({ message: "Method not allowed" });
  }

  try {
    const { cartItems, user, paymentMethod } = req.body;

    if (!cartItems || cartItems.length === 0) {
      return res.status(400).json({ message: "Cart is empty" });
    }

    if (!user || !user.email || !user.name) {
      return res.status(400).json({ message: "User information is missing" });
    }

    // Prepare line_items for WooCommerce
    const line_items = cartItems.map(item => ({
      product_id: item.id,
      quantity: item.quantity,
    }));

    // Create order payload
    const orderPayload = {
      payment_method: paymentMethod || "ccavenue",
      payment_method_title: "CCAvenue",
      set_paid: false, // mark false initially, update after payment webhook
      billing: {
        first_name: user.name.split(" ")[0],
        last_name: user.name.split(" ")[1] || "",
        address_1: user.address,
        city: user.city,
        state: user.state,
        postcode: user.zip,
        country: user.country || "AE",
        email: user.email,
        phone: user.phone,
      },
      shipping: {
        first_name: user.name.split(" ")[0],
        last_name: user.name.split(" ")[1] || "",
        address_1: user.address,
        city: user.city,
        state: user.state,
        postcode: user.zip,
        country: user.country || "AE",
      },
      line_items,
    };

    const response = await api.post("orders", orderPayload);

    res.status(200).json({ success: true, order: response.data });
  } catch (err) {
    console.error("WooCommerce create order error:", err.response?.data || err.message);
    res.status(400).json({ success: false, error: err.response?.data || err.message });
  }
}