const colors = require('tailwindcss/colors')


module.exports = {
  content: ['./src/**/*.{js,jsx,ts,tsx}', './public/index.html'],
  darkMode: "class", // or 'media' or 'class'
  theme: {
    extend: {
      colors: {
        slate: {
          ...colors.slate,
          150: "#e5eaf2",
          250: "#d5dee9"
        },
        grey: {
          ...colors.gray,
          350: "#b0b0b0",
        },
        dark: {
          100: "#AAAAAA",
          300: "#777777",
          400: "#333333",
          500: "#222222",
        },
      },
      maxHeight: {
        '128': '36rem'
      },
      fontFamily: {
        sans: ['sans-serif'],
      },
      screens: {
        xs: '400px',
      },
      keyframes: {
        fade: {
          '0%': {
            opacity: '0.05',
          },
          '50%': {
            opacity: '.9'
          },
          '100%': {
            opacity: '0.05'
          }
        }
      },
      animation: {
        fade: 'fade 1s ease-in-out infinite',
      }
    },
  },
  plugins: [],
}
