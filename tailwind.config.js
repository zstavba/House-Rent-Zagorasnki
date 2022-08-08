module.exports = {
  content: [
    "./src/*.{html,js,css}",
    './views/**/*.ejs',
    './node_modules/tw-elements/dist/js/**/*.js'
  ],
  theme: {
    extend: {},
  },
  plugins: [
    require('@tailwindcss/forms'),
    require('tailwindcss'),
    require('autoprefixer'),
    require('tw-elements/dist/plugin')
  ]
}
