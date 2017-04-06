import Vue from 'vue'

describe('#117 too eager evaluation', () => {
  it('$error access should not trigger validation on clean field', () => {
    const spy = sinon.stub().returns(true)
    const vm = new Vue({
      data: {
        test: ''
      },
      validations: {
        test: { spy }
      }
    })

    expect(vm.$v.test.$error).to.be.false
    expect(spy).to.not.have.been.called
  })

  it('$error access should trigger validation on dirty field', () => {
    const spy = sinon.stub().returns(true)
    const vm = new Vue({
      data: {
        test: ''
      },
      validations: {
        test: { spy }
      }
    })

    vm.$v.test.$touch()
    expect(vm.$v.test.$error).to.be.false
    expect(spy).to.have.been.calledOnce
  })
})
