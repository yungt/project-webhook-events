/** @type {import('next').NextConfig} */
const nextConfig = {
  reactStrictMode: true,
  poweredByHeader: false,
  output: "standalone",
  env: {
    DEBUG: process.env.DEBUG,
    PORT: process.env.PORT,
    ALLOW_ORIGIN: process.env.ALLOW_ORIGIN,
  },
}

module.exports = nextConfig;
