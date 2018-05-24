var path = require('path')
var config = require('../config')
var webpack = require('webpack')
var merge = require('webpack-merge')
var utils = require('./utils')
var baseWebpackConfig = require('./webpack.base.conf')
var HtmlWebpackPlugin = require('html-webpack-plugin')
var projectRoot = path.resolve(__dirname, '../')

// add hot-reload related code to entry chunks
Object.keys(baseWebpackConfig.entry).forEach(function(name) {
  baseWebpackConfig.entry[name] = ['./build/dev-client'].concat(
    baseWebpackConfig.entry[name]
  )
})

module.exports = merge(baseWebpackConfig, {
  mode: 'development',
  devtool: '#eval',
  plugins: [
    new webpack.DefinePlugin({
      'process.env': config.dev.env,
      'process.env.BUILD': '"dev"'
    }),
    new webpack.HotModuleReplacementPlugin(),
    new HtmlWebpackPlugin({
      filename: 'index.html',
      template: 'docs/index.pug',
      inject: true
    })
  ],
  module: {
    rules: [
      {
        test: /\.(sass|scss)$/,
        use: ['vue-style-loader', 'css-loader', 'sass-loader'],
        include: projectRoot,
        exclude: /node_modules/
      }
    ]
  }
})
