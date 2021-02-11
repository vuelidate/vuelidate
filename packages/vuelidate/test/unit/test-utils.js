const { isVue3 } = require('vue-demi')

module.exports = isVue3 ? require('@vue/test-utils') : require('@vue/test-utils-vue2')
module.exports.flushPromises = require('flush-promises')
