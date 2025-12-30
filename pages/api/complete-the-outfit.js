import axios from "axios";

const BASE =
  "https://dashboard.houseofrmartin.com/wp-json/wc/v3";

export default async function handler(req, res) {
  const { categories, exclude } = req.query;

  try {
    const productsRes = await axios.get(`${BASE}/products`, {
      params: {
        consumer_key: process.env.WC_CONSUMER_KEY,
        consumer_secret: process.env.WC_CONSUMER_SECRET,
        category: categories,
        exclude,
        per_page: 4,
        status: "publish",
      },
    });

    const products = productsRes.data;

    // Enrich variable products with variation prices
    const enriched = await Promise.all(
      products.map(async (product) => {
        if (product.type !== "variable") return product;

        const varsRes = await axios.get(
          `${BASE}/products/${product.id}/variations`,
          {
            params: {
              consumer_key: process.env.WC_CONSUMER_KEY,
              consumer_secret: process.env.WC_CONSUMER_SECRET,
              per_page: 100,
            },
          }
        );

        const variations = varsRes.data;

        const cheapest = variations
          .filter((v) => v.price)
          .sort((a, b) => Number(a.price) - Number(b.price))[0];

        return {
          ...product,
          _derived_price: cheapest?.price || product.price,
          _derived_regular: cheapest?.regular_price,
          _derived_sale: cheapest?.sale_price,
        };
      })
    );

    res.status(200).json(enriched);
  } catch (e) {
    res.status(500).json({ error: "Woo API failed" });
  }
}