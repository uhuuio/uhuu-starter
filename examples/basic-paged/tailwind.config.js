const defaultTheme = require('tailwindcss/defaultTheme')

module.exports = {
  content: [
    "./index.html",
    "./src/**/*.{vue,js,ts,jsx,tsx}",
  ],
  theme: {    
    extend: {
      fontFamily: {
        'sans': ['"Open Sans"', ...defaultTheme.fontFamily.sans],
      },
      fontSize: {
        '4xl': ['2.26rem', '2.5rem'],
        '4xl-cover': ['2.3rem', '2.6rem'],
      },
      fontWeight: {
        'bold' : '600'
      }
    },
  },
  plugins: [],
}
