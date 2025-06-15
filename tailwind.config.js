/** @type {import('tailwindcss').Config} */
module.exports = {
  content: [
    "./pages/**/*.{js,ts,jsx,tsx}",
    "./components/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {
      colors: {
        primary: "#6c2eb9", // Violet ClaimOneOff
        secondary: "#182454", // Bleu foncé
        accent: "#7e57c2", // Cube violet/bleu
      },
    },
  },
  plugins: [],
}
