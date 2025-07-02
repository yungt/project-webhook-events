/** @type {import('next').NextConfig} */
const nextConfig = {
  reactStrictMode: true,
  poweredByHeader: false,
  output: "standalone",
  env: {
    DEBUG: process.env.DEBUG,
    PORT: process.env.PORT,
    RECEIVER_SERVICE_EVENTS_URL: process.env.RECEIVER_SERVICE_EVENTS_URL
  },
  experimental: {
    optimizePackageImports: ['@mantine/core', '@mantine/hooks'],
  }
}

module.exports = nextConfig;
