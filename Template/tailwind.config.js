/** @type {import('tailwindcss').Config} */
module.exports = {
  content: [
    "./pages/**/*.{js,ts,jsx,tsx}",
    "./components/**/*.{js,ts,jsx,tsx}",
    "./node_modules/flowbite-react/**/*.js",
  ],
  darkMode: "class",
  theme: {
    extend: {
      fontFamily: {
        inter: ["Inter", "sans-serif"],
        "now-regular": ["Now-Regular", "sans-serif"],
        "now-bold": ["Now-Bold", "sans-serif"],
      },
    },
  },
  plugins: [
    function ({ addVariant }) {
      addVariant("child", "& > *");
      addVariant("child-hover", "& > *:hover");
    },
    require("daisyui"),
    require("flowbite/plugin"),
    require('tailwind-scrollbar'),
    require('tailwind-scrollbar')({ nocompatible: true })
  ],
};
