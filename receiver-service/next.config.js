/** @type {import('next').NextConfig} */
const nextConfig = {
  reactStrictMode: true,
  poweredByHeader: false,
  output: "standalone",
  env: {
    DEBUG: process.env.DEBUG,
  },
}

module.exports = nextConfig;
