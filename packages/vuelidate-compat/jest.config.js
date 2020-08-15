const base = require('../../jest.base')

module.exports = {
  ...base,
  name: 'Vuelidate',
  collectCoverage: true,
  collectCoverageFrom: ['<rootDir>/src/**/*.js'],
  displayName: 'Vuelidate'
}
