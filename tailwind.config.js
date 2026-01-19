/** @type {import('tailwindcss').Config} */
module.exports = {
  darkMode: "class",
  content: [
    "./src/**/*.{js,jsx,ts,tsx}",
    "./app/**/*.{js,jsx,ts,tsx}",
    "./components/**/*.{js,jsx,ts,tsx}",
    "./pages/**/*.{js,jsx,ts,tsx}",
    "./theme/**/*.{js,jsx,ts,tsx}",
    "./utils/**/*.{js,jsx,ts,tsx}",
  ],
  theme: {
    extend: {
      colors: {
        primary: "#2563EB",
        "primary-dark": "#6366f1",
        background: {
          DEFAULT: "#f9fafb",
          dark: "#000000",
        },
        "muted-foreground": {
          DEFAULT: "#6b7280",
          dark: "#9ca3af",
        },
      },
    },
  },
  plugins: [],
};
