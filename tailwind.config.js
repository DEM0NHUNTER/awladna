// tailwind.config.js
module.exports = {
  content: ['./index.html', './src/**/*.{js,ts,jsx,tsx}'],
  theme: {
    extend: {
      animation: {
        glow: 'glow 1.5s infinite',
        'fade-in': 'fade-in 200ms ease-out',
        'fade-out': 'fade-out 150ms ease-in',
      },
      keyframes: {
        glow: {
          '0%, 100%': { boxShadow: '0 0 10px #8be9fd' },
          '50%': { boxShadow: '0 0 20px #8be9fd' },
        },
        'fade-in': {
          '0%': { opacity: 0, transform: 'scale(0.95)' },
          '100%': { opacity: 1, transform: 'scale(1)' },
        },
        'fade-out': {
          '0%': { opacity: 1, transform: 'scale(1)' },
          '100%': { opacity: 0, transform: 'scale(0.95)' },
        },
      },
    },
  },
  plugins: [],
};
