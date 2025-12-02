/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./**/*.{js,ts,jsx,tsx}",
  ],
  darkMode: 'class',
  theme: {
    extend: {
      fontFamily: {
        sans: ['Space Grotesk', 'sans-serif'],
      },
      colors: {
        brand: {
          orange: '#fe5009',
          teal: '#00bcbc',
          dark: '#0f172a',
          surface: '#1e293b',
        }
      }
    },
  },
  plugins: [],
}