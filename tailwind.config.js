module.exports = {
  content: ['./index.html', './src/**/*.{js,ts,jsx,tsx}'],
  darkMode: 'class',
  theme: {
    extend: {
      animation: {
        glow: 'glow 1.5s infinite',
      },
      keyframes: {
        glow: {
          '0%, 100%': { boxShadow: '0 0 10px #8be9fd' },
          '50%':     { boxShadow: '0 0 20px #8be9fd' },
        },
      },
    },
  },
  plugins: [],
};
