/** @type {import('bili').Config} */
module.exports = {
  input: './index.js',
  output: {
    format: ['es', 'cjs', 'iife'],
    moduleName: 'VuelidateComponents'
  },
  externals: [/packages\/(vuelidate|validators)/],
  globals: {
    '@vuelidate/core': 'Vuelidate'
  }
}
