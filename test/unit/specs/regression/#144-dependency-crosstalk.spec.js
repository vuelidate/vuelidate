import Vue from 'vue'

const T = () => true

describe('#144 Dependency crosstalk', () => {
  it('should not generate crosstalk when validation function references it\'s validation object', () => {
    const noCrosstalkSpy = sinon.spy(function () {
      // call getter
      return (this.$v.A, true)
    })

    const vm = new Vue({
      data: {
        A: '',
        B: ''
      },
      validations: {
        A: {
          noCrosstalk (v) {
            return noCrosstalkSpy.call(this, v)
          }
        },
        B: { T }
      }
    })
    expect(vm.$v.A.noCrosstalk).to.be.true
    expect(noCrosstalkSpy).to.be.calledOnce
    vm.B = 'newB'
    expect(vm.$v.A.noCrosstalk).to.be.true
    expect(noCrosstalkSpy).to.be.calledOnce
  })
})
