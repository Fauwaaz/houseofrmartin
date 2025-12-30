/** @type {import('next').NextConfig} */
const nextConfig = {
  reactStrictMode: true,
  swcMinify: true,
  images: {
    domains: ["dashboard.houseofrmartin.com", "secure.gravatar.com"],
  },
  poweredByHeader: false,
  productionBrowserSourceMaps: false,
  devIndicators: false
};

module.exports = nextConfig;