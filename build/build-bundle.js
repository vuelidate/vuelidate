// https://github.com/shelljs/shelljs
require('shelljs/global')
env.NODE_ENV = 'production'

var path = require('path')
var config = require('../config')
var ora = require('ora')
var webpack = require('webpack')
var webpackConfig = require('./webpack.bundle.conf')

var spinner = ora('building for production...')
spinner.start()

webpack(webpackConfig, function(err, stats) {
  spinner.stop()
  if (err) throw err
  process.stdout.write(
    stats.toString({
      colors: true,
      modules: false,
      children: false,
      chunks: false,
      chunkModules: false
    }) + '\n'
  )
})
