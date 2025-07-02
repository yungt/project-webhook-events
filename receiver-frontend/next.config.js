/** @type {import('next').NextConfig} */
const nextConfig = {
  reactStrictMode: true,
  poweredByHeader: false,
  env: {
    DEBUG: process.env.DEBUG,
  },
  experimental: {
    optimizePackageImports: ['@mantine/core', '@mantine/hooks'],
  }
}

module.exports = nextConfig;
