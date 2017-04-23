import Vue from 'vue'
import Validation from '../../src/index'
Vue.use(Validation)

// require all ssr test files (files that ends with .spec.js)
require('./ssr.spec')
