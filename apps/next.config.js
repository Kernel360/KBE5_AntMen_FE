require('dotenv').config()

const API_HOST = process.env.API_HOST
const COMMON_API_PORT = process.env.COMMON_API_PORT
const CUSTOMER_API_PORT = process.env.CUSTOMER_API_PORT
const MANAGER_API_PORT = process.env.MANAGER_API_PORT

/** @type {import('next').NextConfig} */
const nextConfig = {
  webpack: (config) => {
    config.resolve.alias = {
      ...config.resolve.alias,
      '@': require('path').resolve(__dirname, './src'),
    }
    return config
  },
  async rewrites() {
    return [
      {
        source: '/api/v1/:path*',
        destination: `http://${API_HOST}:${COMMON_API_PORT}/api/v1/:path*`,
      },
      {
        source: '/customers/:path*',
        destination: `http://${API_HOST}:${CUSTOMER_API_PORT}/customers/:path*`,
      },
      {
        source: '/managers/:path*',
        destination: `http://${API_HOST}:${MANAGER_API_PORT}/managers/:path*`,
      },
    ]
  },
}

module.exports = nextConfig
