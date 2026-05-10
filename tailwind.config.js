/** @type {import('tailwindcss').Config} */
module.exports = {
  content: ['./src/**/*.{js,ts,jsx,tsx,mdx}'],
  theme: {
    extend: {
      colors: {
        navy: {
          50: '#eef2ff',
          100: '#e0e7ff',
          200: '#c7d2fe',
          400: '#818cf8',
          600: '#1e3a5f',
          700: '#162d4a',
          800: '#0f1e33',
          900: '#0a1628',
        },
      },
      fontFamily: {
        sans: ['Inter', 'system-ui', 'sans-serif'],
      },
    },
  },
  plugins: [],
}
