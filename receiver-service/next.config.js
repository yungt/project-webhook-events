/** @type {import('next').NextConfig} */
const nextConfig = {
  reactStrictMode: true,
  poweredByHeader: false,
  env: {
    DEBUG: process.env.DEBUG,
  },
}

module.exports = nextConfig;
