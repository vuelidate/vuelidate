module.exports = {
  'presets': [
    ['@babel/preset-env', {
      modules: false
    }]
  ],
  'plugins': [
    '@babel/plugin-proposal-object-rest-spread'
  ],
  'comments': false,
  env: {
    test: {
      'presets': [
        ['@babel/preset-env']
      ],
      'plugins': ['@babel/plugin-transform-runtime']
    }
  }
}
