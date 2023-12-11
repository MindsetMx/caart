/** @type {import('tailwindcss').Config} */
module.exports = {
  content: ["./src/**/*.{html,js}"],
  theme: {
    extend: {
      fontFamily: {
        montserrat: ["Montserrat"],
        optima: ["optima"],
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

