/** @type {import('next').NextConfig} */
const nextConfig = {
  webpack: (config) => {
    config.resolve.alias = {
      ...config.resolve.alias,
      '@': require('path').resolve(__dirname, './src'),
    };
    return config;
  },
  async rewrites() {
    return [
      {
        source: '/api/v1/:path*',
        destination: 'http://localhost:9090/api/v1/:path*',
      },
      {
        source: '/customers/:path*',
        destination: 'http://localhost:9091/customers/:path*',
      },
      {
        source: '/managers/:path*',
        destination: 'http://localhost:9092/managers/:path*',
      },
    ];
  },
};

module.exports = nextConfig; 