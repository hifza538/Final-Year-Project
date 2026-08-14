/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {
      colors: {
        // LocalBites brand colors - same across vendor, customer and delivery portals
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
      fontFamily: {
        sans: ["Inter", "system-ui", "sans-serif"],
      },
    },
  },
  plugins: [],
};
