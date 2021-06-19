const { isVue3 } = require('vue-demi')

module.exports = isVue3 ? require('@vue/test-utils') : require('@vue/test-utils-vue2')
module.exports.flushPromises = require('flush-promises')
const ifTest = (value) => value ? it : it.skip
module.exports.ifVue2 = ifTest(!isVue3)
module.exports.ifVue3 = ifTest(isVue3)
