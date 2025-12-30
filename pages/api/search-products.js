import axios from "axios";

const BASE_URL =
  "https://dashboard.houseofrmartin.com/wp-json/wc/v3/products";

export default async function handler(req, res) {
  const { q } = req.query;

  // HARD GUARD — DO NOT REMOVE
  if (!q || q.trim().length < 2) {
    return res.status(200).json([]);
  }

  try {
    const response = await axios.get(BASE_URL, {
      params: {
        consumer_key: process.env.WC_CONSUMER_KEY,
        consumer_secret: process.env.WC_CONSUMER_SECRET,
        search: q.trim(),
        per_page: 10,
        status: "publish",
      },
    });

    res.status(200).json(response.data);
  } catch (error) {
    console.error("Search API error", error.response?.data || error.message);
    res.status(500).json([]);
  }
}
