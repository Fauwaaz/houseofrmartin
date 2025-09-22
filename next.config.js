/** @type {import('next').NextConfig} */
const nextConfig = {
  reactStrictMode: true,
  swcMinify: true,
  images: {
    domains: ["dashboard.houseofrmartin.com", "secure.gravatar.com"],
  },
};

module.exports = nextConfig;
