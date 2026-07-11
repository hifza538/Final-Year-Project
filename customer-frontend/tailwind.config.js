// customer-frontend/tailwind.config.js

/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {
      colors: {
        // LocalBites brand colors — used across all components via Tailwind classes
        primary: {
          DEFAULT: "#E8590C", // Deep orange — buttons, links, active states
          dark: "#C2410C",    // hover/active shade
          light: "#FFF1E6",   // light backgrounds, badges
        },
        secondary: {
          DEFAULT: "#292524", // Charcoal — footer, dark sections, secondary accents
          light: "#57534E",   // muted text/borders
        },
      },
      fontFamily: {
        sans: ["Inter", "system-ui", "sans-serif"],
      },
      keyframes: {
        // Used for skeleton loaders
        shimmer: {
          "0%": { backgroundPosition: "-1000px 0" },
          "100%": { backgroundPosition: "1000px 0" },
        },
      },
      animation: {
        shimmer: "shimmer 2s infinite linear",
      },
    },
  },
  plugins: [],
};