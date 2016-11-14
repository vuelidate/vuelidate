import Vue from 'vue'
import Validation from '../../../src/index'

function isEven (v) {
  return v % 2 === 0
}

function isOdd (v) {
  return v % 2 === 1
}

const base = {
  data () {
    return {
      value: 4
    }
  }
}

Vue.use(Validation)

describe('Validation plugin', () => {
  it('should not have a $v key if not used', () => {
    const vm = new Vue(base)
    expect(vm.$v).to.not.exist
  })

  it('should have a $v key defined if used', () => {
    const vm = new Vue({
      ...base,
      validations: {
        value: { isEven }
      }
    })
    expect(vm.$v).to.exist
  })

  describe('$v.value', () => {
    describe('when validations pass', () => {
      it('should have $invalid value set to false', () => {
        const vm = new Vue({
          ...base,
          validations: {
            value: { isEven }
          }
        })
        expect(vm.$v.value.$invalid).to.be.false
      })
      it('should have validator name value set to true', () => {
        const vm = new Vue({
          ...base,
          validations: {
            value: { isEven }
          }
        })
        expect(vm.$v.value.isEven).to.be.true
      })
    })
    describe('when validations did not pass', () => {
      it('should have $invalid value set to true', () => {
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
        expect(vm.$v.value.$invalid).to.be.true
      })
      it('should have validator name value set to false', () => {
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
        expect(vm.$v.value.isEven).to.be.false
      })
    })
    describe('when multiple validations exist', () => {
      it('should have the $invalid key set to true', () => {
        const vm = new Vue({
          ...base,
          validations: {
            value: { isEven, isOdd }
          }
        })
        expect(vm.$v.value.$invalid).to.be.true
        expect(vm.$v.value.isEven).to.be.true
        expect(vm.$v.value.isOdd).to.be.false
      })
    })
  })
})
