import Vue from 'vue'

const T = () => true

describe('#95 $v.$touch() does not cascade properly to nested array elements', () => {
  it('$touch() should correctly cascade through nested arrays', () => {
    const vm = new Vue({
      data: {
        items: [1, 2]
      },
      validations: {
        items: {
          $each: { T }
        }
      }
    })
    expect(vm.$v.items.$each[0].$dirty).to.be.false
    expect(vm.$v.items.$each[1].$dirty).to.be.false
    vm.$v.$touch()
    expect(vm.$v.items.$each[0].$dirty).to.be.true
    expect(vm.$v.items.$each[1].$dirty).to.be.true
  })
})
