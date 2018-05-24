const webpack = require('webpack')
const CopyWebpackPlugin = require('copy-webpack-plugin')
const base = require('./webpack.base.conf')
const config = require('../config')
const merge = require('webpack-merge')

// this is used only for umd browser bundle,
// refer to .babelrc for lib configuration

base.mode = 'production'

base.entry = {
  vuelidate: './src/index.js',
  validators: './src/validators/index.js'
}

base.output = {
  path: config.bundle.assetsRoot,
  publicPath: config.bundle.assetsPublicPath,
  filename: '[name].min.js',
  libraryTarget: 'umd',
  library: '[name]'
}

module.exports = merge(base, {
  resolve: {
    alias: {
      'vuelidate/withParams': '../withParamsBrowser'
    }
  },
  plugins: [
    new webpack.DefinePlugin({
      'process.env': {
        NODE_ENV: '"production"',
        BUILD: '"web"'
      }
    })
  ],
  optimization: {
    minimize: true
  }
})
