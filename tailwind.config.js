/** @type {import('tailwindcss').Config} */
module.exports = {
  content: [
    './pages/**/*.{js,ts,jsx,tsx,mdx}',
    './components/**/*.{js,ts,jsx,tsx,mdx}',
    './app/**/*.{js,ts,jsx,tsx,mdx}',
  ],
  theme: {
    extend: {
      colors: {
        'wani-green': '#4F7942',
        'wani-dark-green': '#2D5016',
        'wani-yellow': '#FFD700',
        'wani-red': '#FF4444',
        'wani-brown': '#8B4513',
        'game-bg': '#006400',
        'hole-dark': '#2D2D2D',
      },
      fontFamily: {
        'game': ['Impact', 'Arial Black', 'sans-serif'],
      },
      keyframes: {
        'wani-appear': {
          '0%': { transform: 'translateY(100%)', opacity: '0' },
          '100%': { transform: 'translateY(0)', opacity: '1' },
        },
        'wani-disappear': {
          '0%': { transform: 'translateY(0)', opacity: '1' },
          '100%': { transform: 'translateY(100%)', opacity: '0' },
        },
        'hit-effect': {
          '0%': { transform: 'scale(1)' },
          '50%': { transform: 'scale(1.2)' },
          '100%': { transform: 'scale(1)' },
        },
        'score-popup': {
          '0%': { transform: 'translateY(0) scale(1)', opacity: '1' },
          '100%': { transform: 'translateY(-50px) scale(1.5)', opacity: '0' },
        },
      },
      animation: {
        'wani-appear': 'wani-appear 0.3s ease-out',
        'wani-disappear': 'wani-disappear 0.3s ease-in',
        'hit-effect': 'hit-effect 0.2s ease-out',
        'score-popup': 'score-popup 1s ease-out forwards',
      },
    },
  },
  plugins: [],
} 