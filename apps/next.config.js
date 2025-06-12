/** @type {import('next').NextConfig} */
const nextConfig = {
  webpack: (config) => {
    config.resolve.alias = {
      ...config.resolve.alias,
      '@': require('path').resolve(__dirname, './src'),
    }
    return config
  },
//   async rewrites() {
//     return [
//       {
//         source: '/api/v1/:path*',
//         destination: 'http://localhost:19090/api/v1/:path*',
//       },
//       {
//         source: '/customers/:path*',
//         destination: 'http://localhost:19091/customers/:path*',
//       },
//       {
//         source: '/managers/:path*',
//         destination: 'http://localhost:19092/managers/:path*',
//       },
//     ]
//   },
}

module.exports = nextConfig

