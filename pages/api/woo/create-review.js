import axios from "axios";

export default async function handler(req, res) {
  if (req.method !== "POST") {
    return res.status(405).json({ success: false, message: "Method not allowed" });
  }

  const { productId, review, reviewer, reviewer_email, rating } = req.body;

  if (!productId) {
    return res.status(400).json({ success: false, message: "Missing product ID" });
  }

  try {
    const response = await axios.post(
      `${process.env.WOOCOMMERCE_URL}wp-json/wc/v3/products/reviews`,
      {
        product_id: Number(productId),
        review,
        reviewer,
        reviewer_email,
        rating,
        status: "approved", 
      },
      {
        auth: {
          username: process.env.WOOCOMMERCE_CONSUMER_KEY,
          password: process.env.WOOCOMMERCE_CONSUMER_SECRET,
        },
        headers: {
          "Content-Type": "application/json",
        },
      }
    );

    return res.status(200).json({ success: true, data: response.data });
  } catch (error) {
    console.error("Error creating review:", error.response?.data || error.message);
    return res.status(error.response?.status || 500).json({
      success: false,
      message: "Failed to create review",
      error: error.response?.data,
    });
  }
}