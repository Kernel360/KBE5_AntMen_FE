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
        'Apple_SD_Gothic_Neo': ['Apple SD Gothic Neo', 'sans-serif'],
      },
      colors: {
        primary: '#4ABED9',
        secondary: '#F3F4F6',
        'secondary-foreground': '#374151',
        accent: '#F3F4F6',
        'accent-foreground': '#111827',
      },
    },
  },
  plugins: [],
}

