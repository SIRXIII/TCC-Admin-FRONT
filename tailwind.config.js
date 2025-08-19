export default {

    content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}", // 👈 must include your source files
  ],
  theme: {
    extend: {
      fontFamily: {
        robotoSerif: ['"Roboto Serif"'],
      },
    },
  },
  plugins: [require("tailwindcss-font-inter"),],
}
