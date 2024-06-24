const defaultTheme = require("tailwindcss/defaultTheme");

/** @type {import('tailwindcss').Config} */
module.exports = {
  content: ["./index.html", "./src/**/*.{js,ts,jsx,tsx}"],
  theme: {
    extend: {
      fontFamily: {
        sans: ["Nunito", ...defaultTheme.fontFamily.sans],
      },
      colors: {
        'primary-light': "#77a0a9",
        'primary-main': "#6F7D8C",
        'primary-dark': "#6C596E",
        'secondary-light': "#F3e0ec",
        'secondary-main': "#4b2e39",
        'secondary-dark': "#32021f",
        'error-main': "#fe654f",
        'warning-main': "#ffc100",
        'info-main': "#37ff8b",
        'success-main': "#0b6e4f",
      },
    },
  },
  important: '#root',
  corePlugins: {
    preflight: false
  },
  plugins: [],
};
