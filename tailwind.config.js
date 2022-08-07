module.exports = {
  content: [
    "./src/*.{html,js,css}",
    './views/**/*.{ejs}'
  ],
  theme: {
    extend: {},
  },
  plugins: [
    require('@tailwindcss/forms'),
    require('tailwindcss'),
    require('autoprefixer')
  ]
}
