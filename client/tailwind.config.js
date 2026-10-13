/** @type {import('tailwindcss').Config} */
export default {
  content: ['./index.html', './src/**/*.{js,jsx}'],
  theme: {
    extend: {
      colors: {
        navy: { DEFAULT: '#0f1f3d', 800: '#16294f', 900: '#0a1428', 100: '#e7ebf4' },
        gold: { DEFAULT: '#c9a227', light: '#e6c860', dark: '#a8841a' },
      },
      fontFamily: {
        serif: ['"Playfair Display"', 'serif'],
        sans: ['Inter', 'sans-serif'],
      },
    },
  },
  plugins: [],
}
