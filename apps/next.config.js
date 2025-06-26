/** @type {import('next').NextConfig} */
const nextConfig = {
  // Standalone 모드 활성화 (Docker 최적화)
  output: 'standalone',

  // 환경변수 명시적 로딩 (개발 환경)
  env: {
    KAKAO_REST_API_KEY: process.env.KAKAO_REST_API_KEY,
    NEXTAUTH_SECRET: process.env.NEXTAUTH_SECRET,
    NEXTAUTH_URL: process.env.NEXTAUTH_URL,
  },

  // 번들 크기 최적화
  experimental: {
    // Tree shaking 최적화 (Next.js 14.1+ 지원)
    optimizePackageImports: [
      '@mui/material',
      '@mui/icons-material',
      '@heroicons/react',
      'react-icons',
      'framer-motion'
    ],
    // CSS 최적화는 일단 비활성화 (critters 의존성 문제)
    // optimizeCss: true,
    webVitalsAttribution: ['CLS', 'LCP'],
  },

  // 이미지 최적화
  images: {
    // 외부 이미지 최적화 비활성화 (용량 절약)
    unoptimized: false,
    // 지원 형식 제한
    formats: ['image/webp'],
    // 이미지 크기 제한
    deviceSizes: [640, 750, 828, 1080, 1200],
    imageSizes: [16, 32, 48, 64, 96, 128, 256],
    // 외부 이미지 도메인 허용
    remotePatterns: [
      {
        protocol: 'https',
        hostname: 'antmen-bucket.s3.ap-northeast-2.amazonaws.com',
        port: '',
        pathname: '/**',
      },
    ],
  },

  // 컴파일 최적화
  compiler: {
    // 프로덕션에서 console.log 제거
    removeConsole: process.env.NODE_ENV === 'production' ? {
      exclude: ['error']
    } : false,
    // 주석 제거
    reactRemoveProperties: process.env.NODE_ENV === 'production',
  },

  // Webpack 최적화 (기존 alias 설정 포함)
  webpack: (config, { dev, isServer }) => {
    // 기존 alias 설정 유지
    config.resolve.alias = {
      ...config.resolve.alias,
      '@': require('path').resolve(__dirname, './src'),
    };

    // 프로덕션 빌드 최적화
    if (!dev && !isServer) {
      // 클라이언트 번들 최적화
      config.optimization.splitChunks = {
        chunks: 'all',
        cacheGroups: {
          default: false,
          vendors: false,
          // 벤더 청크 분리
          vendor: {
            name: 'vendors',
            chunks: 'all',
            test: /node_modules/,
            priority: 20
          },
          // 공통 청크 분리
          common: {
            name: 'commons',
            minChunks: 2,
            chunks: 'all',
            priority: 10,
            reuseExistingChunk: true,
            enforce: true
          }
        }
      };
    }

    // 번들 분석기 (필요시)
    if (process.env.ANALYZE === 'true') {
      const { BundleAnalyzerPlugin } = require('webpack-bundle-analyzer');
      config.plugins.push(
          new BundleAnalyzerPlugin({
            analyzerMode: 'static',
            openAnalyzer: false,
          })
      );
    }

    return config;
  },

  // API 프록시 설정 (기존 rewrites 설정 - 현재 주석 처리됨)
  // 개발 환경에서 사용하려면 주석 해제
  // async rewrites() {
  //   return [
  //     {
  //       source: '/api/v1/:path*',
  //       destination: 'http://localhost:19090/api/v1/:path*',
  //     },
  //     {
  //       source: '/customers/:path*',
  //       destination: 'http://localhost:19091/customers/:path*',
  //     },
  //     {
  //       source: '/managers/:path*',
  //       destination: 'http://localhost:19092/managers/:path*',
  //     },
  //   ]
  // },

  // SWC 최적화
  swcMinify: true,

  // 불필요한 기능 비활성화
  eslint: {
    ignoreDuringBuilds: true,
  },
  typescript: {
    ignoreBuildErrors: false,
  },

  // 압축 설정
  compress: true,

  // 정적 파일 최적화
  trailingSlash: false,

  // 파워드 바이 헤더 제거
  poweredByHeader: false,
};

module.exports = nextConfig;