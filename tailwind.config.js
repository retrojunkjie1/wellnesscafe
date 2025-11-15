/** @type {import('tailwindcss').Config} */
module.exports = {
  content: [
    "./index.html",                  // Vite root index.html
    "./public/index.html",           // (optional) if you still keep public assets
    "./src/**/*.{js,jsx,ts,tsx}"     // all React components
  ],
  theme: {
    extend: {
      colors: {
        brand: {
          DEFAULT: "#d4b483",
          2: "#cbb4ff"
        }
      }
    }
  },
  plugins: []
};
