/** @type {import('tailwindcss').Config} */
module.exports = {
  content: [
    "./src/**/*.{html,ts}",
  ],
  darkMode: 'class', // Enable dark mode with class strategy
  theme: {
    extend: {
      screens: {
        'mobile': '320px',
        'tablet': '768px',
        'desktop': '1024px',
      },
    },
  },
  plugins: [],
}
