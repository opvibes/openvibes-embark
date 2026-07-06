/** @type {import('tailwindcss').Config} */
export default {
  content: ["./index.html", "./src/**/*.{ts,tsx}"],
  darkMode: "class",
  theme: {
    extend: {
      fontFamily: {
        sans: ["Inter", "sans-serif"],
        display: ["Space Grotesk", "Inter", "sans-serif"],
        mono: ["JetBrains Mono", "ui-monospace", "monospace"],
      },
      colors: {
        accent: {
          DEFAULT: "#5eb8ff",
          soft: "rgba(94,184,255,.18)",
          50: "#eaf6ff",
          100: "#cdebff",
          200: "#9ad7ff",
          300: "#5eb8ff",
          400: "#3aa0f5",
          500: "#1e85e0",
          600: "#1568b3",
          700: "#124f87",
        },
        ink: {
          50: "#dbeaf5",
          100: "#8fb3cc",
          400: "#4a7690",
          700: "#0d2438",
          800: "#0a1b2e",
          900: "#071624",
          950: "#06131f",
        },
      },
    },
  },
  plugins: [],
};
