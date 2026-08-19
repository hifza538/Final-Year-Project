// vendor-frontend/tailwind.config.js

/** @type {import('tailwindcss').Config} */
export default {
  content: ["./index.html", "./src/**/*.{js,ts,jsx,tsx}"],
  theme: {
    extend: {
      colors: {
        // Custom color palette for LocalBites
        primary: {
          DEFAULT: "#E8590C",
          dark: "#C2410C",
          light: "#FFF1E6",
        },
        secondary: {
          DEFAULT: "#292524",
          light: "#57534E",
        },
      },
    },
  },
  plugins: [],
};