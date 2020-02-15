const path = require('path')
const dir = (p) => path.resolve(__dirname, p)

module.exports = {
  rootDir: '.',
  transform: {
    '^.+\\.js$': ['babel-jest', { cwd: __dirname }]
  },
  'snapshotSerializers': [
    dir('node_modules/jest-serializer-vue')
  ]
}
