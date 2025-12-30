import client from "../libs/apollo";
import { GET_SLUG } from "../utils/queries";

export async function getServerSideProps({ res }) {
    const baseUrl = "https://houseofrmartin.com";

    // Fetch all product slugs from WooCommerce
    let slugs = [];
    try {
        const { data } = await client.query({
            query: GET_SLUG,
        });

        slugs = data?.products?.nodes?.map((p) => p.slug) || [];
    } catch (e) {
        console.error("Error generating sitemap:", e);
    }

    // Static pages (add more as needed)
    const staticPages = [
        "",
        "about",
        "faqs",
        "contact",
        "privacy-policy",
        "shipping-return-refund",
        "terms-condition",
        "wishlist",
        "products",
    ];

    // Build XML
    const sitemap = `<?xml version="1.0" encoding="UTF-8"?>
<urlset 
  xmlns="http://www.sitemaps.org/schemas/sitemap/0.9"
  xmlns:xhtml="http://www.w3.org/1999/xhtml">

  ${staticPages
            .map(
                (path) => `
    <url>
      <loc>${baseUrl}/${path}</loc>
      <changefreq>monthly</changefreq>
      <priority>0.8</priority>
    </url>`
            )
            .join("")}

  ${slugs
            .map(
                (slug) => `
    <url>
      <loc>${baseUrl}/products/${slug}</loc>
      <changefreq>weekly</changefreq>
      <priority>0.9</priority>
    </url>`
            )
            .join("")}

</urlset>`;

    res.setHeader("Content-Type", "application/xml");
    res.write(sitemap);
    res.end();

    return {
        props: {},
    };
}

export default function Sitemap() {
    return null;
}
