import Vue from 'vue'
import Validation from 'src/index'

function isEven (v) {
  return v % 2 === 0
}

function isOdd (v) {
  return v % 2 === 1
}

const base = {
  el: document.createElement('div'),
  data () {
    return {
      value: 4
    }
  }
}

Vue.use(Validation)

describe('Validation plugin', () => {
  it('should not have a $validations key if not used', () => {
    const vm = new Vue(base)
    expect(vm.$validations).to.not.exist
  })

  it('should have a $validations key defined if used', () => {
    Vue.use(Validation)
    const vm = new Vue({
      ...base,
      validations: {
        value: { isEven }
      }
    })
    expect(vm.$validations).to.exist
  })

  describe('$validation.value', () => {
    describe('when validations pass', () => {
      it('should have $invalid value set to false', () => {
        Vue.use(Validation)
        const vm = new Vue({
          ...base,
          validations: {
            value: { isEven }
          }
        })
        expect(vm.$validations.value.$invalid).to.be.false
      })
      it('should have validator name value set to true', () => {
        Vue.use(Validation)
        const vm = new Vue({
          ...base,
          validations: {
            value: { isEven }
          }
        })
        expect(vm.$validations.value.isEven).to.be.true
      })
    })
    describe('when validations did not pass', () => {
      it('should have $invalid value set to true', () => {
        Vue.use(Validation)
        const vm = new Vue({
          ...base,
          data () {
            return {
              value: 5
            }
          },
          validations: {
            value: { isEven }
          }
        })
        expect(vm.$validations.value.$invalid).to.be.true
      })
      it('should have validator name value set to false', () => {
        Vue.use(Validation)
        const vm = new Vue({
          ...base,
          data () {
            return {
              value: 5
            }
          },
          validations: {
            value: { isEven }
          }
        })
        expect(vm.$validations.value.isEven).to.be.false
      })
    })
    describe('when multiple validations exist', () => {
      it('should have the $invalid key set to true', () => {
        Vue.use(Validation)
        const vm = new Vue({
          ...base,
          validations: {
            value: { isEven, isOdd }
          }
        })
        expect(vm.$validations.value.$invalid).to.be.true
        expect(vm.$validations.value.isEven).to.be.true
        expect(vm.$validations.value.isOdd).to.be.false
      })
    })
  })
})
