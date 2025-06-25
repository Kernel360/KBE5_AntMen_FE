/** @type {import('tailwindcss').Config} */
module.exports = {
  content: [
    './src/pages/**/*.{js,ts,jsx,tsx,mdx}',
    './src/components/**/*.{js,ts,jsx,tsx,mdx}',
    './src/app/**/*.{js,ts,jsx,tsx,mdx}',
    './src/**/*.{js,ts,jsx,tsx,mdx}',
  ],
  theme: {
    extend: {
      fontFamily: {
        Apple_SD_Gothic_Neo: ['Apple SD Gothic Neo', 'sans-serif'],
      },
      colors: {
        primary: {
          200: '#BAEAFD',     // 밝은 배경, 호버
          DEFAULT: '#9CDAFB', // 기본 색상 (현재)
          500: '#5EBAF7',     // 중간 톤 (버튼)
          600: '#3FA9F5',     // 진한 버튼, 링크
          700: '#2B8FDB',     // 더 진한 색상 (활성)
          800: '#1F6BA8',     // 진한 텍스트, 아이콘
          900: '#164B75',     // 가장 진한 색상 (제목)
        },
        secondary: {
          DEFAULT: '#F3F4F6',
        },
        tertiary: {
          DEFAULT: '#F4E4BC',
        },
        dark: 'rgba(2, 9, 19, 0.91)',
        white: '#fff',
        blue: {
          50: '#e8f3ff',
          100: '#c9e2ff',
          200: '#90c2ff',
          300: '#64a8ff',
          400: '#4593fc',
          500: '#3182f6',
          600: '#2272eb',
          700: '#1b64da',
          800: '#1957c2',
          900: '#194aa6',
        },
        red: {
          50: '#fee',
          100: '#ffd4d6',
        },
        accent: {
          DEFAULT: '#F3F4F6',
          dark: '#E5E7EB',
          foreground: '#111827',
        },
        gray: {
          50: '#F9FAFB',
          100: '#F8F9FD',
          200: '#E5E7EB',
          300: '#D1D5DB',
          400: '#9CA3AF',
          500: '#6B7280',
          600: '#4B5563',
          700: '#374151',
          800: '#1F2937',
          900: '#111827',
        },
        warm: '#FFE5D9' ,
        lavender: '#D4C5E8',
        beige: {
          light: '#F0E6D2',
          dark: '#C8B99C',
        },
        sage: '#A8B5A0' 
      },
      keyframes: {
        'slide-up': {
          '0%': { transform: 'translateY(100%)' },
          '100%': { transform: 'translateY(0)' },
        },
        'slide-up-in': {
          '0%': { opacity: '0', transform: 'translateY(100%)' },
          '100%': { opacity: '1', transform: 'translateY(0)' },
        },
        'fade-out': {
          '0%': { opacity: '1' },
          '100%': { opacity: '0' },
        },
        'slide-up-out': {
          '0%': { opacity: '1', transform: 'translateY(0)' },
          '100%': { opacity: '0', transform: 'translateY(80%)' },
        },
        float: {
          '0%, 100%': { transform: 'translateY(0)' },
          '50%': { transform: 'translateY(-4px)' },
        },
      },
      animation: {
        'slide-up': 'slide-up 0.3s ease-out',
        'slide-up-in':
          'slide-up-in 0.38s cubic-bezier(0.22, 1, 0.36, 1) forwards',
        'slide-up-out':
          'slide-up-out 0.38s cubic-bezier(0.6, 0.05, 0.8, 0.3) forwards',
        'fade-out': 'fade-out 0.18s cubic-bezier(0.4, 0, 1, 1) forwards',
        float: 'float 2.5s ease-in-out infinite',
      },
      maxWidth: {
        mobile: '390px', // 모바일 기준
        tablet: '768px', // 태블릿
        desktop: '1200px',
      },
    },
    container: {
      center: true,
      padding: '20px',
      screens: {
        DEFAULT: '100%',
        mobile: '390px',
        tablet: '768px',
        desktop: '1200px',
      },
    },
  },
  plugins: [],
}
