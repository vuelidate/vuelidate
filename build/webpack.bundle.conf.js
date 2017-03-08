const webpack = require('webpack')
const CopyWebpackPlugin = require('copy-webpack-plugin')
const base = require('./webpack.base.conf')
const config = require('../config')

// this is used only for umd browser bundle,
// refer to .babelrc for lib configuration

base.entry = {
  'vuelidate': './src/index.js',
  'validators': './src/validators/index.js'
}

base.output = {
  path: config.bundle.assetsRoot,
  publicPath: config.bundle.assetsPublicPath,
  filename: '[name].min.js',
  libraryTarget: 'umd',
  library: '[name]'
}

base.alias = {
  'vuelidate/withParams': '../withParamsBrowser'
}

var webpackConfig = Object.assign({}, base)

webpackConfig.plugins = (webpackConfig.plugins || []).concat([
  new webpack.DefinePlugin({
    'process.env': {
      NODE_ENV: '"production"'
    }
  }),
  new webpack.optimize.UglifyJsPlugin({
    compress: { warnings: false }
  }),
  new webpack.optimize.OccurenceOrderPlugin()
])

module.exports = webpackConfig
