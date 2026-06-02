import defaultTheme from 'tailwindcss/defaultTheme'

export default {
  content: [
    "./index.html",
    "./src/**/*.{vue,js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {
      fontFamily: {
        'sans': [
          '"Inter"',
          '-apple-system',
          'BlinkMacSystemFont',
          '"Segoe UI"',
          '"Noto Sans"',
          'Helvetica',
          'Arial',
          '"Noto Color Emoji"',
          '"Apple Color Emoji"',
          '"Segoe UI Emoji"',
          'sans-serif'
        ],
      },
    },
  },
  plugins: [],
}
