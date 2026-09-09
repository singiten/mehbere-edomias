/** @type {import('tailwindcss').Config} */
module.exports = {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {
      colors: {
        blue: {
          900: '#1a365d',
          800: '#1e3a6f',
          700: '#2a4a7f',
        },
        gold: {
          300: '#e8d5a3',
          400: '#dabf6e',
          500: '#c9a84c',
          600: '#a8893c',
          700: '#8a6e30',
        },
      },
    },
  },
  plugins: [],
}