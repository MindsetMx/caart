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
      }
    },
  },
  plugins: [],
}

