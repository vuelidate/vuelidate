const jestConfig = require('eslint-plugin-jest')
module.exports = {
  env: {
    browser: true,
    es6: true,
    node: true
  },
  extends: [
    // 'plugin:vue/essential', // is this required?
    'standard'
  ],
  globals: {},
  parserOptions: {
    ecmaVersion: 2018,
    sourceType: 'module'
  },
  plugins: [],
  rules: {},
  overrides: [
    Object.assign({}, jestConfig.configs.recommended, {
      files: ['packages/**/*.spec.js'],
      globals: jestConfig.environments.globals.globals,
      env: {
        es6: true,
        node: true
      }
    })
  ]
}
