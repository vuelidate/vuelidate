import Vue from 'vue'
import Validation from '../src/index'
import { required, minLength, sameAs, between } from '../src/validators'

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
  data () {
    return {
      isNavSticky: false,
      firstColor: Math.floor(Math.random() * 255),
      secondColor: Math.floor(Math.random() * 255),
      name: '',
      age: 0,
      email: '',
      password: '',
      repeatPassword: '',
      form: {
        nestedA: '',
        nestedB: ''
      }
    }
  },
  validations: {
    name: {
      required,
      minLength: minLength(4)
    },
    age: {
      between: between(20, 30)
    },
    password: {
      required,
      minLength: minLength(6)
    },
    repeatPassword: {
      sameAsPassword: sameAs('password')
    },

    form: {
      nestedA: {
        required
      },
      nestedB: {
        required
      }
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
