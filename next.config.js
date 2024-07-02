/** @type {import('next').NextConfig} */
const nextConfig = {
  reactStrictMode: true,
  env: {
    RPC_ENDPOINTS: process.env.RPC_ENDPOINTS,
  },
}

module.exports = nextConfig