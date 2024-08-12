/** @type {import('tailwindcss').Config} */
module.exports = {
  content: ["./src/**/*.{js,jsx,ts,tsx}"],
  theme: {
    extend: {
      flexGrow: {
        1: 1,
        2: 2,
        3: 3,
      },
      colors: {
        'bright-yellow': "#FFD700",
        "sky-blue": "#87CEEB",
        "coral": "#FF6F61",
        "lime-green": "#32CD32",
        "hot-pink": "#FF69B4",
      }
    },
  },
  plugins: [],
};
