import Vue from 'vue'

import { required, sameAs } from 'vuelidate/lib/validators'

describe('#103 validation status is sometimes not evaluated', () => {
  it('should properly update global $invalid after values changed without observation', () => {
    const vm = new Vue({
      data: {
        identifier: null,
        password: null,
        repeatPassword: null
      },
      validations: {
        identifier: {
          required
        },
        password: {
          required
        },
        repeatPassword: {
          required,
          sameAsPassword: sameAs('password')
        }
      }
    })

    expect(vm.$v.$invalid).to.be.true

    vm.identifier = 'test'
    vm.password = 'test'
    vm.repeatPassword = 'test'

    expect(vm.$v.$invalid).to.be.false
  })
})
