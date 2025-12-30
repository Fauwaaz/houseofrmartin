export async function getServerSideProps({ res }) {
  const baseUrl = "https://houseofrmartin.com";

  const robotsTxt = `
User-agent: *
Allow: /

Sitemap: ${baseUrl}/sitemap.xml
`;

  res.setHeader("Content-Type", "text/plain");
  res.write(robotsTxt);
  res.end();

  return {
    props: {},
  };
}

export default function Robots() {
  return null;
}
