/** @type {import('tailwindcss').Config} */
module.exports = {
  content: [
    "./pages/**/*.{js,ts,jsx,tsx}",
    "./components/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {
      colors: {
        primary: '#6D28D9',
        accent: '#4F46E5',
        'bg-light': '#F4F4FB',
      },
      fontFamily: {
        logo: ['Montserrat', 'Arial', 'sans-serif'],
      }
    },
  },
  plugins: [],
}
