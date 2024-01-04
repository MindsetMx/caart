/** @type {import('tailwindcss').Config} */
module.exports = {
  content: ["./src/**/*.{html,js}"],
  theme: {
    container: {
      center: true,
      padding: {
        DEFAULT: '1rem',
        sm: '1.5rem',
        lg: '2rem'
      },
    },
    extend: {
      fontFamily: {
        montserrat: ["Montserrat"],
        optima: ["optima"],
        lato: ["Lato"],
        robotoflex: ["Roboto Flex"],
      },
      colors: {
        gray1: "#f5f5f5",
        gray2: "#c4c4c4",
        gray3: "#dddddd",
        gray4: "#717171",
        gray5: "#f4f4f4",
        gray6: "#b2b2b2",
        green1: "#63b546",
        red2: "#ff0000",
        red3: "#ff2e2e"
      },
      width: {
        'fill': '-webkit-fill-available',
      },
      screens: {
        'xs': '480px',
        'xxs': '360px',
      }
    },
  },
  plugins: [],
  safelist: [
    "py-3",
    "py-3.5",
    "px-8",
  ]
}

