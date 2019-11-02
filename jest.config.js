const base = require('./jest.base')

module.exports = {
  ...base,
  rootDir: './',
  projects: ['<rootDir>/packages/*'],
  testURL: 'http://localhost/'
}
