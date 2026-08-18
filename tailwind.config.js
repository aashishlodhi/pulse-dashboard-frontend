/** @type {import('tailwindcss').Config} */
export default {
  darkMode: "class",
  content: ["./index.html", "./src/**/*.{js,ts,jsx,tsx}"],
  theme: {
    extend: {
      colors: {
        brand: {
          50: "#eef4ff",
          100: "#dce8ff",
          200: "#b9d2ff",
          300: "#8bb4ff",
          400: "#5f92ff",
          500: "#3b74f5",
          600: "#2f5fe0",
          700: "#2749b3",
          800: "#213e8f",
          900: "#1c3573",
        },
        canvas: "#eef1f8",
      },
      fontFamily: {
        sans: ["Inter", "system-ui", "sans-serif"],
      },
      boxShadow: {
        card: "0 2px 10px rgba(30, 60, 130, 0.06)",
        soft: "0 8px 24px rgba(59, 116, 245, 0.18)",
      },
      borderRadius: {
        xl2: "1.25rem",
      },
      animation: {
        "spin-slow": "spin 1.4s linear infinite",
      },
    },
  },
  plugins: [],
};
