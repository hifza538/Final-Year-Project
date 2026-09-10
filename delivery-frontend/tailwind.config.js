// delivery-frontend/tailwind.config.js
/** @type {import('tailwindcss').Config} */
export default {
  content: ["./index.html", "./src/**/*.{js,ts,jsx,tsx}"],
  theme: {
    extend: {
      colors: {
        primary: {
          DEFAULT: "#E8590C",
          dark: "#C2410C",
          light: "#FFF1E6",
        },
        secondary: {
          DEFAULT: "#292524",
          light: "#44403C",
        },
        
        cream: {
          DEFAULT: "#FDF6EC", // page background
          panel: "#FCEEDA",   // soft peach for highlighted panels (Active Job, stats)
        },
      },
      fontFamily: {
        sans: ["Inter", "system-ui", "sans-serif"],
      },
    },
  },
  plugins: [],
};