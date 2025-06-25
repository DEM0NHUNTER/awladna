module.exports = {
  content: ["./src/**/*.{tsx,ts,js,jsx}"],
  theme: {
    extend: {
      backgroundImage: {
        "gradient-radial": "radial-gradient(var(--tw-gradient-stops))",
      },
      backdropBlur: {
        xs: "2px",
      },
    },
  },
  plugins: [],
  darkMode: 'class', // ✅ Required for dark mode via class

};