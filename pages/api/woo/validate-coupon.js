import api from "../../../utils/woocommerce"

export default async function handler(req, res) {
  if (req.method !== "POST") {
    return res.status(405).json({ message: "Method not allowed" });
  }

  const { code } = req.body;

  if (!code) {
    return res.status(400).json({ success: false, message: "Coupon code is required" });
  }

  try {
    const { data } = await api.get(`coupons?code=${code}`);
    if (!data || data.length === 0) {
      return res.status(404).json({ success: false, message: "Invalid coupon code" });
    }

    const coupon = data[0];
    res.status(200).json({
      success: true,
      coupon: {
        id: coupon.id,
        code: coupon.code,
        amount: coupon.amount,
        discount_type: coupon.discount_type, // 'percent' or 'fixed_cart'
        description: coupon.description,
      },
    });
  } catch (error) {
    console.error("Coupon validation error:", error.response?.data || error.message);
    res.status(500).json({ success: false, message: "Error validating coupon" });
  }
}