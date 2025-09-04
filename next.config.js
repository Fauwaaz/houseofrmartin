/** @type {import('next').NextConfig} */
const nextConfig = {
  reactStrictMode: true,
  swcMinify: true,
  images: {
    domains: ["dashboard.houseofrmartin.com"],
  },
};

module.exports = nextConfig;
