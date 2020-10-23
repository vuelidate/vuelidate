/** @type {import('bili').Config} */
module.exports = {
  input: 'src/index.js',
  output: {
    format: ['es', 'cjs'],
    moduleName: 'Vuelidate'
  },
  plugins: {
    copy: {
      targets: [
        { src: 'src/index.d.ts', dest: 'dist' }
      ]
    }
  }
}
