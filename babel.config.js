module.exports = {
  presets: [
    ['@babel/preset-env', {
      modules: false
    }]
  ],
  plugins: [
    '@babel/plugin-proposal-object-rest-spread',
    '@babel/plugin-proposal-nullish-coalescing-operator'
  ],
  comments: false,
  env: {
    test: {
      presets: [
        ['@babel/preset-env']
      ],
      plugins: ['@babel/plugin-transform-runtime']
    }
  }
}
