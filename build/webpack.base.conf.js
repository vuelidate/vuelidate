var path = require('path')
var config = require('../config')
var utils = require('./utils')
var projectRoot = path.resolve(__dirname, '../')
var VueLoaderPlugin = require('vue-loader/lib/plugin')
var env = process.env.NODE_ENV
// check env & config/index.js to decide weither to enable CSS Sourcemaps for the
// various preprocessor loaders added to vue-loader at the end of this file
var cssSourceMapDev = env === 'development' && config.dev.cssSourceMap
var cssSourceMapProd = env === 'production' && config.docs.productionSourceMap
var useCssSourceMap = cssSourceMapDev || cssSourceMapProd

module.exports = {
  entry: {
    app: './docs/main.js'
  },
  output: {
    path: config.docs.assetsRoot,
    publicPath:
      process.env.NODE_ENV === 'production'
        ? config.docs.assetsPublicPath
        : config.dev.assetsPublicPath,
    filename: '[name].js'
  },
  resolve: {
    extensions: ['.js', '.vue'],
    alias: {
      vue$: 'vue/dist/vue',
      'vuelidate/lib/validators': path.resolve(__dirname, '../src/validators'), // for consistent docs
      src: path.resolve(__dirname, '../src'),
      assets: path.resolve(__dirname, '../docs/assets'),
      examples: path.resolve(__dirname, '../docs/partials/examples'),
      components: path.resolve(__dirname, '../src/components')
    }
  },
  plugins: [new VueLoaderPlugin()],
  module: {
    rules: [
      {
        enforce: 'pre',
        test: /\.(vue|js)$/,
        loader: 'eslint-loader',
        include: projectRoot,
        exclude: [/node_modules/, /docs[\\\/]assets/]
      },
      {
        test: /\.vue$/,
        loader: 'vue-loader',
        include: projectRoot,
        exclude: /node_modules/
      },
      {
        test: /\.pug$/,
        oneOf: [
          {
            exclude: /\.vue/,
            use: ['pug-loader']
          },
          // this applies to <template lang="pug"> in Vue components
          {
            use: ['pug-plain-loader']
          }
        ],
        include: projectRoot,
        exclude: /node_modules/
      },
      {
        test: /\.js$/,
        loader: 'babel-loader',
        include: projectRoot,
        exclude: /node_modules/
      },
      {
        test: /\.(png|jpe?g|gif|svg)(\?.*)?$/,
        loader: 'url-loader',
        options: {
          limit: 10000,
          name: utils.assetsPath('img/[name].[hash:7].[ext]')
        }
      },
      {
        test: /\.(woff2?|eot|ttf|otf)(\?.*)?$/,
        loader: 'url-loader',
        options: {
          limit: 10000,
          name: utils.assetsPath('fonts/[name].[hash:7].[ext]')
        }
      }
    ]
  }
}
