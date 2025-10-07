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

    // ✅ Build WooCommerce line items with variants, image, and total price
    const line_items = cartItems.map((item) => ({
      product_id: item.id,
      variation_id: item.variation_id || undefined, // if you have variant-specific IDs
      name: item.name,
      quantity: item.quantity,
      price: Number(item.price),
      total: (Number(item.price) * item.quantity).toFixed(2),
      meta_data: [
        ...(item.size
          ? [{ key: "Size", value: item.size }]
          : []),
        ...(item.color
          ? [{ key: "Color", value: item.color }]
          : []),
        ...(item.image
          ? [{ key: "Product Image", value: item.image }]
          : []),
      ],
    }));

    // ✅ Order payload
    const orderPayload = {
      payment_method: paymentMethod || "ccavenue",
      payment_method_title: "CCAvenue",
      set_paid: false,
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
      shipping_lines: [
        {
          method_id: "flat_rate",
          method_title: "Flat Rate",
          total: "0.00",
        },
      ],
    };

    const response = await api.post("orders", orderPayload);

    return res.status(200).json({
      success: true,
      order: response.data,
    });
  } catch (err) {
    console.error("WooCommerce create order error:", err.response?.data || err.message);
    res
      .status(400)
      .json({ success: false, error: err.response?.data || err.message });
  }
}