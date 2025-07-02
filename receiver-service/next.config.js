/** @type {import('next').NextConfig} */
const nextConfig = {
  reactStrictMode: true,
  poweredByHeader: false,
  output: "standalone",
  env: {
    DEBUG: process.env.DEBUG,
    PORT: process.env.PORT,
  },
}

module.exports = nextConfig;
