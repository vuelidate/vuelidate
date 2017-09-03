import Vue from 'vue'
import Validation from '../src/index'

import * as examples from './partials/examples'
import LangSwitcher from './LangSwitcher'

Vue.use(Validation)

import './docs.scss'

const SL = ', 100%, 85%'

/* eslint-disable no-new */
new Vue({
  el: '#app',
  components: {
    LangSwitcher,
    ...examples
  },
  data () {
    return {
      isNavSticky: false,
      firstColor: Math.floor(Math.random() * 255),
      secondColor: Math.floor(Math.random() * 255),
      markupLangs: ['pug', 'html'],
      markupLanguage: 'pug',
      currentHash: ''
    }
  },
  computed: {
    gradient () {
      return {
        background: `linear-gradient(to left bottom, hsl(${this.firstColor + SL}) 0%, hsl(${this.secondColor + SL}) 100%)`
      }
    },
    allHeaders () {
      return [].slice.call(document.querySelectorAll('section[id], .typo__h2[id]'))
    }
  },
  methods: {
    selectLanguage (lang) {
      this.markupLanguage = lang
    },
    adjustNav () {
      const $nav = document.getElementById('main-nav')
      const navTop = $nav.getBoundingClientRect().top
      this.isNavSticky = navTop < 0

      const found = this.allHeaders.findIndex(e => {
        const top = e.getBoundingClientRect().top
        return top > 0
      })

      console.log(this.allHeaders)

      const head = found === -1 ? this.allHeaders.length - 1 : found - 1

      if (head !== -1) {
        const el = this.allHeaders[head]
        const hash = el.getAttribute('id')
        if (this.currentHash !== hash) {
          this.currentHash = hash
          el.setAttribute('id', '')
          window.location.hash = hash
          el.setAttribute('id', hash)
        }
      }
    },
    requestFrame () {
      if (!this._frameRequested) {
        this._frameRequested = true
        window.requestAnimationFrame(() => {
          this._frameRequested = false
          this.adjustNav()
        })
      }
    }
  },
  mounted () {
    this.adjustNav()
    window.addEventListener('scroll', this.requestFrame)
  }
})
