import axios from "axios";

export default async function handler(req, res) {
  try {
    const response = await axios.post(
      process.env.WP_GRAPHQL_API, 
      req.body,
      {
        headers: { "Content-Type": "application/json" },
      }
    );

    res.status(200).json(response.data);
  } catch (error) {
    console.error("GraphQL proxy error:", error);
    res.status(500).json({ error: "Failed to fetch from WP GraphQL" });
  }
}