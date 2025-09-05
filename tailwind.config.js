/** @type {import('tailwindcss').Config} */
export default {
  darkMode: false, // Completely disable dark mode
  content: [
    "./index.html",
    "./src/**/*.{ts,tsx,js,jsx}",
  ],
  theme: {
    extend: {
      colors: {
        // Only light mode colors
        background: "hsl(0 0% 100%)",
        foreground: "hsl(222.2 47.4% 11.2%)",
        card: "hsl(0 0% 100%)",
        "card-foreground": "hsl(222.2 47.4% 11.2%)",
        // ... add other light colors
      },
    },
  },
  plugins: [require("tailwindcss-animate")],
}
