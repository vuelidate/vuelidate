/** @type {import('bili').Config} */
module.exports = {
  input: './index.js',
  output: {
    format: ['es', 'cjs'],
    moduleName: 'VuelidateComponents'
  },
  externals: [/packages\/(vuelidate|validators)/]
}
