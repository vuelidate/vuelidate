/** @type {import('bili').Config} */
module.exports = {
  input: ['src', 'src/raw'],
  output: {
    format: ['esm', 'cjs']
  },
  plugins: {
    copy: {
      targets: [
        { src: 'src/index.d.ts', dest: 'dist' }
      ]
    }
  }
}
