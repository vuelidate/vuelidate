const jestConfig = require('eslint-plugin-jest')
module.exports = {
  root: true,
  env: {
    node: true
  },
  extends: [
    'plugin:vue/recommended',
    'standard'
  ],
  plugins: [],
  rules: {
    'no-unused-vars': 0
  },
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
