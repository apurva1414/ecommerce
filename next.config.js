/** @type {import('next').NextConfig} */
const nextConfig = {
  reactStrictMode: true,
  images: {
    domains: ["fakestoreapi.com", "cdn.dummyjson.com"],
  },
};

module.exports = nextConfig;
