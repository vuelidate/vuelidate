import Vue from 'vue'
import Validation from '../src/index'

import * as examples from './partials/examples'

Vue.use(Validation)

require('./docs.scss')

function throttle (callback, limit) {
  var wait = false
  return function () {
    if (!wait) {
      callback.call()
      wait = true
      setTimeout(function () {
        wait = false
      }, limit)
    }
  }
}

const SL = ', 100%, 85%'

/* eslint-disable no-new */
new Vue({
  el: '#app',
  components: {
    ...examples
  },
  data () {
    return {
      isNavSticky: false,
      firstColor: Math.floor(Math.random() * 255),
      secondColor: Math.floor(Math.random() * 255)
    }
  },
  computed: {
    gradient () {
      return {
        background: `linear-gradient(to left bottom, hsl(${this.firstColor + SL}) 0%, hsl(${this.secondColor + SL}) 100%)`
      }
    }
  },
  methods: {
    adjustNav () {
      this.isNavSticky = window.scrollY > window.innerHeight
    }
  },
  mounted () {
    this.adjustNav()
    window.addEventListener('scroll', throttle(this.adjustNav, 50))
  }
})
