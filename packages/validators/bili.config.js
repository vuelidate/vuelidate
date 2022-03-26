/** @type {import('bili').Config} */
module.exports = {
  input: ['src', 'src/raw'],
  output: {
    format: ['esm', 'cjs', 'iife-min'],
    moduleName: 'VuelidateValidators'
  },
  globals: {
    'vue-demi': 'VueDemi'
  }
}
