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
          DEFAULT: '#9CDAFB',
        },
        secondary: {
          DEFAULT: '#F3F4F6',
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
      },
      keyframes: {
        'slide-up': {
          '0%': { transform: 'translateY(100%)' },
          '100%': { transform: 'translateY(0)' },
        },
      },
      animation: {
        'slide-up': 'slide-up 0.3s ease-out',
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
