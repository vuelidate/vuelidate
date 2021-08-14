const jestConfig = require('eslint-plugin-jest')
module.exports = {
  root: true,
  env: {
    node: true
  },
  parserOptions: {
    parser: '@babel/eslint-parser'
  },
  extends: [
    'plugin:vue/recommended',
    'standard'
  ],
  plugins: [],
  rules: {},
  overrides: [
    Object.assign({}, jestConfig.configs.recommended, {
      files: ['packages/**/*.spec.js', 'packages/**/test/**/*.js'],
      globals: jestConfig.environments.globals.globals,
      env: {
        es6: true,
        node: true
      },
      rules: {
        'eslint-disable-next-line': 'off'
      }
    })
  ]
}
