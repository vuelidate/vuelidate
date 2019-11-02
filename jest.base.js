const path = require('path')
const dir = (p) => path.resolve(__dirname, p)

module.exports = {
  rootDir: '.',
  transform: {
    '^.+\\.js$': [dir('node_modules/babel-jest'), { cwd: __dirname }]
  }
}
