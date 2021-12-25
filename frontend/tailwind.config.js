const colors = require('tailwindcss/colors')


module.exports = {
  content: ['./src/**/*.{js,jsx,ts,tsx}', './public/index.html'],
  darkMode: "class", // or 'media' or 'class'
  theme: {
    colors: {
      transparent: 'transparent',
      current: 'currentColor',
      black: colors.black,
      white: colors.white,
      grey: {
        ...colors.gray,
        350: "#b0b0b0",
      },
      red: colors.red,
      yellow: colors.amber,
      blue: colors.blue,
      dark: {
        100: "#AAAAAA",
        300: "#777777",
        400: "#333333",
        500: "#222222",
      },
    },
    extend: {
      fontFamily: {
        sans: ['"Graphik"', 'sans-serif'],
      },
      boxShadow: {
        "sidebar-l": "rgb(0 0 0 / 5%) 8px 0px 12px",
        "sidebar-d": "rgb(0 0 0 / 35%) 12px 0 12px"
      },
      screens: {
        xs: '400px',
      }
    },
  },
  plugins: [],
}
