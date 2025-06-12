require('dotenv').config()
const path = require('path')

const API_HOST = process.env.API_HOST
const COMMON_API_PORT = process.env.COMMON_API_PORT
const CUSTOMER_API_PORT = process.env.CUSTOMER_API_PORT
const MANAGER_API_PORT = process.env.MANAGER_API_PORT
// ${API_HOST}:${COMMON_API_PORT}
/** @type {import('next').NextConfig} */
const nextConfig = {
  webpack: (config) => {
    config.resolve.alias = {
      ...config.resolve.alias,
      '@': path.resolve(__dirname, './src'),
    }
    return config
  },
  async rewrites() {
    return [
      {
        source: '/api/v1/:path*',
        destination: `https://api.antmen.site:9090/api/v1/:path*`,
      },
      {
        source: '/customers/:path*',
        destination: `https://api.antmen.site:9091/customers/:path*`,
      },
      {
        source: '/managers/:path*',
        destination: `https://api.antmen.site:9092/managers/:path*`,
      },
    ]
  },
}

module.exports = nextConfig
