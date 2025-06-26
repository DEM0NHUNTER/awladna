// tailwind.config.js
module.exports = {
  content: ['./index.html', './src/**/*.{js,ts,jsx,tsx}'],
  theme: {
    extend: {
      animation: {
        glow: 'glow 1.5s infinite',
        'fade-in-up': 'fade-in-up 0.3s ease-out forwards',

      },
      keyframes: {
        glow: {
          '0%, 100%': { boxShadow: '0 0 10px #8be9fd' },
          '50%': { boxShadow: '0 0 20px #8be9fd' },
        'fade-in-up': {
          '0%': { opacity: '0', transform: 'translateY(10px) scale(0.95)' },
          '100%': { opacity: '1', transform: 'translateY(0) scale(1)' },
        },
      },
    },
  },
  plugins: [    require('@tailwindcss/forms'),
    require('tailwindcss-blend-mode')
};
