/** @type {import('tailwindcss').Config} */
module.exports = {
  content: ["./src/**/*.{html,js}"],
  theme: {
    container: {
      center: true,
      padding: "0.5rem",
      screens: {
        sm: '600px',
        md: '728px',
        lg: '984px',
        xl: '1280px',
        '2xl': '1536px',
      },
    },
    extend: {
      fontSize: {
        'xxs': '0.5rem',
      },
      fontFamily: {
        montserrat: ["Montserrat"],
        // optima: ["optima"],
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
        gray7: "#efefef",
        gray8: "#fafafa",
        green1: "#63b546",
        red2: "#ff0000",
        red3: "#ff2e2e",
        reddishOrange: "#e39115"
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
    "max-h-[48px]",
    "h-64",
    "bg-indigo-100",
    "bg-red-100",
    "mt-10"
  ]
}

