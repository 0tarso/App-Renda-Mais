/** @type {import('tailwindcss').Config} */
module.exports = {
  // NOTE: Update this to include the paths to all of your component files.
  content: ["./App.tsx", "./app/**", "./components/**/*.{js,jsx,ts,tsx}"],
  presets: [require("nativewind/preset")],
  theme: {
    extend: {
      colors: {
        yellowPrimary: "#FFE55D",
        redPrimary: "#C82F2F",
      },
      fontFamily: {
        ubuntuBold: ["UbuntuBold", "sans-serif"],
        ubuntuBoldItalic: ["UbuntuBoldItalic", "sans-serif"],
        ubuntuItalic: ["UbuntuItalic", "sans-serif"],
        ubuntuLight: ["UbuntuLight", "sans-serif"],
        ubuntuRegular: ["UbuntuRegular", "sans-serif"],
      }
    },
  },
  plugins: [],
}