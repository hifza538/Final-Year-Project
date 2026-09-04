// admin-frontend/tailwind.config.js

/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {
      colors: {
        // Custom colors for the LocalBites Admin panel
        primary: {
          DEFAULT: "#E8590C",
          dark: "#C2410C",
          light: "#FFF1E6",
        },
        secondary: {
          DEFAULT: "#292524",
          light: "#57534E",
        },
        keyframes: {
      fillbar: {
        "0%": { width: "0%" },
        "100%": { width: "100%" },
      },
    },
      },

      fontFamily: {
        sans: ["Inter", "system-ui", "sans-serif"],
        display: ["Space Grotesk", "sans-serif"],
        mono: ["JetBrains Mono", "monospace"],
      },
    },
  },
  plugins: [],
};
