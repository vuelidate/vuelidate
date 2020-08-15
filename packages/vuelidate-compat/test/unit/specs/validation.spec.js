import flushPromises from 'flush-promises'
import { h, ref } from 'vue'
import { mount } from '@vue/test-utils'
import { useVuelidate } from '../../../src/index.js'
// import { minLength } from '@vuelidate/validators'

const isEven = (v) => v % 2 === 0
// const isOdd = (v) => v % 2 === 1

const createComponent = (getVuelidateResults) => ({
  name: 'childComp',
  setup () {
    const $v = getVuelidateResults()

    return {
      $v
    }
  },
  render () {
    return h('pre', {}, JSON.stringify(this.$v))
  }
})

const createWrapper = (rules, state) => mount(createComponent(() => useVuelidate(rules, state)))

const shouldBePristineValidationObj = ($v) => {
  expect($v).toHaveProperty('$error', false)
  expect($v).toHaveProperty('$errors', [])
  expect($v).toHaveProperty('$invalid', false)
  expect($v).toHaveProperty('$pending', false)
  expect($v).toHaveProperty('$dirty', false)
  expect($v).toHaveProperty('$anyDirty', false)
  expect($v).toHaveProperty('$touch', expect.any(Function))
  expect($v).toHaveProperty('$reset', expect.any(Function))
  expect($v).toHaveProperty('$validate', expect.any(Function))
}

const shouldBeInvalidValidationObject = ($v, property, validatorName) => {
  expect($v).toHaveProperty('$error', true)
  expect($v).toHaveProperty('$errors', [{
    $message: '',
    $params: {},
    $pending: false,
    $property: property,
    $propertyPath: property,
    $validator: validatorName
  }])
  expect($v).toHaveProperty('$invalid', true)
  expect($v).toHaveProperty('$pending', false)
  expect($v).toHaveProperty('$dirty', true)
  expect($v).toHaveProperty('$anyDirty', true)
  expect($v).toHaveProperty('$touch', expect.any(Function))
  expect($v).toHaveProperty('$reset', expect.any(Function))
  expect($v).toHaveProperty('$validate', expect.any(Function))
}

// $dirty,
// $error,
// $errors,
// $invalid,
// $anyDirty,
// $pending,
// $touch,
// $reset,
// $validate,

describe('useVuelidate', () => {
  it('should have a $v key defined if used', () => {
    const wrapper = createWrapper({}, {})

    expect(wrapper.vm.$v).toEqual(expect.any(Object))
  })

  it('should return a pristine validation object', () => {
    const { vm } = createWrapper({}, {})

    shouldBePristineValidationObj(vm.$v)
  })

  it('should return a pristine validation object for a property', () => {
    const number = ref(1)
    const { vm } = createWrapper({ number: { isEven } }, { number })

    expect(vm.$v).toHaveProperty('number', expect.any(Object))
    shouldBePristineValidationObj(vm.$v.number)
  })

  describe('.$touch', () => {
    it('should update the $dirty state to true', () => {
      const number = ref(1)
      const { vm } = createWrapper({ number: { isEven } }, { number })

      shouldBePristineValidationObj(vm.$v.number)
      vm.$v.number.$touch()
      shouldBeInvalidValidationObject(vm.$v.number, 'number', 'isEven')
    })

    it('should update the $dirty state to true on all properties', () => {
      const number = ref(1)
      const number2 = ref(1)
      const { vm } = createWrapper(
        { number: { isEven }, number2: { isEven } },
        { number, number2 }
      )

      shouldBePristineValidationObj(vm.$v.number)
      shouldBePristineValidationObj(vm.$v.number2)
      vm.$v.$touch()
      shouldBeInvalidValidationObject(vm.$v.number, 'number', 'isEven')
      shouldBeInvalidValidationObject(vm.$v.number2, 'number2', 'isEven')
    })

    it('should not update the $dirty state on the property it wasnt used on', () => {
      const numberA = ref(1)
      const numberB = ref(1)
      const { vm } = createWrapper(
        { numberA: { isEven }, numberB: { isEven } },
        { numberA, numberB }
      )

      shouldBePristineValidationObj(vm.$v.numberA)
      vm.$v.numberA.$touch()
      shouldBeInvalidValidationObject(vm.$v.numberA, 'numberA', 'isEven')
      shouldBePristineValidationObj(vm.$v.numberB, 'numberB', 'isEven')
      expect(vm.$v).toHaveProperty('$error', false)
      expect(vm.$v).toHaveProperty('$dirty', false)
      expect(vm.$v).toHaveProperty('$anyDirty', true)
      expect(vm.$v).toHaveProperty('$invalid', true)
      expect(vm.$v.$errors).toEqual([{
        $message: '',
        $params: {},
        $pending: false,
        $property: 'numberA',
        $propertyPath: 'numberA',
        $validator: 'isEven'
      }])
    })
  })

  describe('.$reset', () => {
    it('should update the $dirty state to false', () => {
      const number = ref(1)
      const { vm } = createWrapper({ number: { isEven } }, { number })
      shouldBePristineValidationObj(vm.$v.number)

      vm.$v.number.$touch()
      shouldBeInvalidValidationObject(vm.$v.number, 'number', 'isEven')

      vm.$v.number.$reset()
      shouldBePristineValidationObj(vm.$v.number)
    })

    it('should update the $dirty state to false, only on the current property', () => {
      const numberA = ref(1)
      const numberB = ref(1)
      const { vm } = createWrapper(
        {
          numberA: { isEven },
          numberB: { isEven }
        },
        { numberA, numberB }
      )

      // make it dirty
      vm.$v.numberA.$touch()
      vm.$v.numberB.$touch()
      // assert both are touched
      shouldBeInvalidValidationObject(vm.$v.numberA, 'numberA', 'isEven')
      shouldBeInvalidValidationObject(vm.$v.numberB, 'numberB', 'isEven')
      // reset only A
      vm.$v.numberA.$reset()
      // assert that numberB is still dirty
      shouldBePristineValidationObj(vm.$v.numberA)
      shouldBeInvalidValidationObject(vm.$v.numberB, 'numberB', 'isEven')
    })

    it('should reset all the properties back to pristine condition', () => {
      const numberA = ref(1)
      const numberB = ref(1)
      const { vm } = createWrapper(
        {
          numberA: { isEven },
          numberB: { isEven }
        },
        { numberA, numberB }
      )

      // make it dirty
      vm.$v.numberA.$touch()
      vm.$v.numberB.$touch()
      // assert both are touched
      shouldBeInvalidValidationObject(vm.$v.numberA, 'numberA', 'isEven')
      shouldBeInvalidValidationObject(vm.$v.numberB, 'numberB', 'isEven')
      // reset only A
      vm.$v.$reset()
      // assert that numberB is still dirty
      shouldBePristineValidationObj(vm.$v.numberA)
      shouldBePristineValidationObj(vm.$v.numberB)
    })
  })

  describe('$autoDirty', () => {
    it('should update the $dirty state to true when value changes', async () => {
      const number = ref(1)
      const { vm } = createWrapper({ number: { isEven, $autoDirty: true } }, { number })
      shouldBePristineValidationObj(vm.$v.number)

      number.value = 3
      await vm.$nextTick()
      shouldBeInvalidValidationObject(vm.$v.number, 'number', 'isEven')
      number.value = 2
      await vm.$nextTick()
      expect(vm.$v.$errors).toHaveLength(0)
      expect(vm.$v.number).toHaveProperty('$error', false)
      expect(vm.$v.number).toHaveProperty('$dirty', true)
      expect(vm.$v.number).toHaveProperty('$anyDirty', true)
      expect(vm.$v.number).toHaveProperty('$invalid', false)
    })
  })

  describe('$model', () => {
    it('should update the source value', async () => {
      const number = ref(1)
      const { vm } = createWrapper({ number: { isEven } }, { number })

      vm.$v.number.$model = 3
      await vm.$nextTick()
      expect(number.value).toBe(3)
    })

    it('should update the $dirty state to true when $model value changes', async () => {
      const number = ref(1)
      const { vm } = createWrapper({ number: { isEven } }, { number })
      shouldBePristineValidationObj(vm.$v.number)

      vm.$v.number.$model = 3
      await vm.$nextTick()
      shouldBeInvalidValidationObject(vm.$v.number, 'number', 'isEven')
      vm.$v.number.$model = 2
      await vm.$nextTick()
      expect(vm.$v.$errors).toHaveLength(0)
      expect(vm.$v.number).toHaveProperty('$error', false)
      expect(vm.$v.number).toHaveProperty('$dirty', true)
      expect(vm.$v.number).toHaveProperty('$anyDirty', true)
      expect(vm.$v.number).toHaveProperty('$invalid', false)
    })
  })

  describe('nested validations', () => {
    it('should collect child validations when they invalidate', async () => {
      const number = ref(1)
      const CompWithValidations = createComponent(() => useVuelidate({ number: { isEven, $autoDirty: true } }, { number }))

      const CompWithNestedValidations = {
        setup () {
          const $v = useVuelidate()

          return {
            $v
          }
        },
        render () {
          return h(CompWithValidations)
        }
      }

      const wrapper = mount(CompWithNestedValidations)
      shouldBePristineValidationObj(wrapper.vm.$v)
      number.value = 3
      await wrapper.vm.$nextTick()

      expect(wrapper.vm.$v.$errors).toEqual([{
        $message: '',
        $params: {},
        $pending: false,
        $property: 'number',
        $propertyPath: 'number',
        $validator: 'isEven'
      }])
    })
  })

  it('works with refs', () => {})

  it('works with reactive', () => {})

  // it('should allow watching a $v state', async () => {
  //   let watcherValue = null
  //   let watcherValueOld = null
  //
  //   const vm = new Vue({
  //     ...base,
  //     validations: {
  //       value: { isEven }
  //     },
  //     watch: {
  //       '$v.value.$invalid' (v, oldv) {
  //         watcherValue = v
  //         watcherValueOld = oldv
  //       }
  //     }
  //   })
  //   vm.value = 123
  //   await vm.$nextTick()
  //   expect(watcherValue).toBe(true)
  //   expect(watcherValueOld).toBe(false)
  // })

  // it('should have a $v key while not overriding existing computed', () => {
  //   const vm = new Vue({
  //     ...base,
  //     validations: {
  //       value: { isEven }
  //     },
  //     computed: {
  //       x () {
  //         return 1
  //       }
  //     }
  //   })
  //   expect(vm.$v).toBeDefined()
  //   expect(vm.x).toBe(1)
  // })
  //
  // it('should have a $v key defined if used as function', () => {
  //   const vm = new Vue({
  //     ...base,
  //     validations () {
  //       return {
  //         value: { isEven }
  //       }
  //     }
  //   })
  //   expect(vm.$v).toBeDefined()
  // })
  //
  // it('should not interfere with lifecycle hooks', () => {
  //   const createSpy = jest.fn()
  //   const Ctor = Vue.extend({
  //     created: createSpy,
  //     ...base,
  //     validations: {}
  //   })
  //   const vm = new Ctor()
  //   expect(vm.$v).toBeDefined()
  //   expect(createSpy).toHaveBeenCalledTimes(1)
  // })

  // describe('Async', () => {
  //   function setupAsync () {
  //     let resolvePromise = { resolve: null, reject: null }
  //     const asyncVal = (val) => {
  //       if (val === '') return true
  //       return new Promise((resolve, reject) => {
  //         resolvePromise.resolve = resolve
  //         resolvePromise.reject = reject
  //       })
  //     }
  //
  //     const vm = new Vue({
  //       data: { value: '' },
  //       validations: {
  //         value: { asyncVal }
  //       }
  //     })
  //     return { resolvePromise, vm }
  //   }
  //
  //   it('$pending should be false on initialization for empty value', () => {
  //     const { vm } = setupAsync()
  //     expect(vm.$v.value.$pending).toBe(false)
  //   })
  //
  //   it('$pending should be true immediately after value change on the validator itself', () => {
  //     const { vm } = setupAsync()
  //     vm.value = 'x1'
  //     expect(vm.$v.value.asyncVal.$pending).toBe(true)
  //   })
  //
  //   it('$pending should cascade to state property', async () => {
  //     const { vm } = setupAsync()
  //     vm.value = 'x1'
  //     expect(vm.$v.value.$pending).toBe(true)
  //   })
  //
  //   it('$pending should cascade to root $v', () => {
  //     const { vm } = setupAsync()
  //     vm.value = 'x1'
  //     expect(vm.$v.$pending).toBe(true)
  //   })
  //
  //   it('should not be computed without getter evaluation', () => {
  //     const { resolvePromise, vm } = setupAsync()
  //     vm.value = 'x1'
  //     expect(resolvePromise.resolve).toBeNull()
  //   })
  //
  //   it('$pending should be false tick after promise resolve', async () => {
  //     const { resolvePromise, vm } = setupAsync()
  //     vm.value = 'x1'
  //     resolvePromise.resolve(true)
  //     await flushPromises()
  //     expect(vm.$v.value.$pending).toBe(false)
  //   })
  //
  //   it('asyncVal value should be false just after value change', () => {
  //     const { vm } = setupAsync()
  //     vm.value = 'x1'
  //     expect(vm.$v.value.asyncVal).toBe(false)
  //   })
  //
  //   it('asyncVal value should be true after promise resolve', (done) => {
  //     const { resolvePromise, vm } = setupAsync()
  //     vm.value = 'x1'
  //     vm.$v.value.asyncVal // execute getter
  //     resolvePromise.resolve(true)
  //     Promise.resolve().then(() => {
  //       expect(vm.$v.value.asyncVal).toBe(true)
  //       done()
  //     })
  //   })
  //
  //   it('asyncVal value should be false after promise reject', (done) => {
  //     const { resolvePromise, vm } = setupAsync()
  //     vm.value = 'x1'
  //     vm.$v.value.asyncVal // execute getter
  //     resolvePromise.reject(new Error('test reject'))
  //     Promise.resolve().then(() => {
  //       expect(vm.$v.value.asyncVal).toBe(false)
  //       done()
  //     })
  //   })
  // })
  //
  // describe('$v.value.$dirty', () => {
  //   it('should have a $dirty set to false on initialization', () => {
  //     const vm = new Vue({
  //       ...base,
  //       validations: {
  //         value: { isEven }
  //       }
  //     })
  //     expect(vm.$v.value.$dirty).toBe(false)
  //   })
  //
  //   it('should have a $anyDirty set to false on initialization', () => {
  //     const vm = new Vue({
  //       ...base,
  //       validations: {
  //         value: { isEven }
  //       }
  //     })
  //     expect(vm.$v.value.$anyDirty).toBe(false)
  //   })
  //
  //   it('should preserve $dirty flag on validation recomputation', () => {
  //     const vm = new Vue({
  //       data: {
  //         out: false,
  //         value: 1,
  //         value2: 2
  //       },
  //       validations () {
  //         return {
  //           value: { fn: this.out ? T : F },
  //           value2: { fn: this.out ? T : F }
  //         }
  //       }
  //     })
  //
  //     vm.$v.value.$touch()
  //     vm.out = true
  //     expect(vm.$v.value.$dirty).toBe(true)
  //     expect(vm.$v.value2.$dirty).toBe(false)
  //   })
  //
  //   it('should preserve $anyDirty flag on validation recomputation', () => {
  //     const vm = new Vue({
  //       data: {
  //         out: false,
  //         value: 1,
  //         value2: 2
  //       },
  //       validations () {
  //         return {
  //           value: { fn: this.out ? T : F },
  //           value2: { fn: this.out ? T : F }
  //         }
  //       }
  //     })
  //
  //     vm.$v.value.$touch()
  //     vm.out = true
  //     expect(vm.$v.value.$anyDirty).toBe(true)
  //     expect(vm.$v.value2.$anyDirty).toBe(false)
  //   })
  //
  //   it('should have a $error set to false on initialization', () => {
  //     const vm = new Vue({
  //       ...base,
  //       validations: {
  //         value: { isEven }
  //       }
  //     })
  //     expect(vm.$v.value.$error).toBe(false)
  //   })
  //   it('should have a $anyError set to false on initialization', () => {
  //     const vm = new Vue({
  //       ...base,
  //       validations: {
  //         value: { isEven }
  //       }
  //     })
  //     expect(vm.$v.value.$anyError).toBe(false)
  //   })
  //   it('should have a $error false on dirty valid', () => {
  //     const vm = new Vue({
  //       ...base,
  //       validations: {
  //         value: { isEven }
  //       }
  //     })
  //     vm.$v.value.$touch()
  //     expect(vm.$v.value.$error).toBe(false)
  //   })
  //   it('should have a $anyError false on dirty valid', () => {
  //     const vm = new Vue({
  //       ...base,
  //       validations: {
  //         value: { isEven }
  //       }
  //     })
  //     vm.$v.value.$touch()
  //     expect(vm.$v.value.$anyError).toBe(false)
  //   })
  //   it('should have a $error true on dirty invalid', () => {
  //     const vm = new Vue({
  //       ...base,
  //       validations: {
  //         value: { isOdd }
  //       }
  //     })
  //     vm.$v.value.$touch()
  //     expect(vm.$v.value.$error).toBe(true)
  //   })
  //   it('should have a $anyError true on dirty invalid', () => {
  //     const vm = new Vue({
  //       ...base,
  //       validations: {
  //         value: { isOdd }
  //       }
  //     })
  //     vm.$v.value.$touch()
  //     expect(vm.$v.value.$anyError).toBe(true)
  //   })
  //   it('should have a $error false on clean invalid', () => {
  //     const vm = new Vue({
  //       ...base,
  //       validations: {
  //         value: { isOdd }
  //       }
  //     })
  //     expect(vm.$v.value.$error).toBe(false)
  //   })
  //   it('should have a $dirty set to true after $touch', () => {
  //     const vm = new Vue({
  //       ...base,
  //       validations: {
  //         value: { isEven }
  //       }
  //     })
  //     vm.$v.value.$touch()
  //     expect(vm.$v.value.$dirty).toBe(true)
  //   })
  //   it('should have a $anyDirty set to true after $touch', () => {
  //     const vm = new Vue({
  //       ...base,
  //       validations: {
  //         value: { isEven }
  //       }
  //     })
  //     vm.$v.value.$touch()
  //     expect(vm.$v.value.$anyDirty).toBe(true)
  //   })
  //   it('should have a $dirty set to false after $reset', () => {
  //     const vm = new Vue({
  //       ...base,
  //       validations: {
  //         value: { isEven }
  //       }
  //     })
  //     vm.$v.value.$touch()
  //     vm.$v.value.$reset()
  //     expect(vm.$v.value.$dirty).toBe(false)
  //   })
  //   it('should have a $anyDirty set to false after $reset', () => {
  //     const vm = new Vue({
  //       ...base,
  //       validations: {
  //         value: { isEven }
  //       }
  //     })
  //     vm.$v.value.$touch()
  //     vm.$v.value.$reset()
  //     expect(vm.$v.value.$anyDirty).toBe(false)
  //   })
  //   describe('for nested validators', () => {
  //     it('should have nested $dirty false on initialization', () => {
  //       const vm = new Vue({
  //         ...baseGroup,
  //         validations: {
  //           nested: {
  //             value1: { T },
  //             value2: { T }
  //           }
  //         }
  //       })
  //       expect(vm.$v.nested.$dirty).toBe(false)
  //     })
  //     it('should have nested.$dirty false when only one value is $dirty', () => {
  //       const vm = new Vue({
  //         ...baseGroup,
  //         validations: {
  //           nested: {
  //             value1: { T },
  //             value2: { T }
  //           }
  //         }
  //       })
  //       vm.$v.nested.value1.$touch()
  //       expect(vm.$v.nested.$dirty).toBe(false)
  //     })
  //     it('should have nested.$anyDirty true when only one value is $dirty', () => {
  //       const vm = new Vue({
  //         ...baseGroup,
  //         validations: {
  //           nested: {
  //             value1: { T },
  //             value2: { T }
  //           }
  //         }
  //       })
  //       vm.$v.nested.value1.$touch()
  //       expect(vm.$v.nested.$anyDirty).toBe(true)
  //     })
  //     it('should have nested.$dirty true when all values are $dirty', () => {
  //       const vm = new Vue({
  //         ...baseGroup,
  //         validations: {
  //           nested: {
  //             value1: { T },
  //             value2: { T }
  //           }
  //         }
  //       })
  //       vm.$v.nested.value1.$touch()
  //       vm.$v.nested.value2.$touch()
  //       expect(vm.$v.nested.$dirty).toBe(true)
  //     })
  //     it('should have nested.$dirty true when all values are $dirty', () => {
  //       const vm = new Vue({
  //         ...baseGroup,
  //         validations: {
  //           nested: {
  //             value1: { T },
  //             value2: { T }
  //           }
  //         }
  //       })
  //       vm.$v.nested.value1.$touch()
  //       vm.$v.nested.value2.$touch()
  //       expect(vm.$v.nested.$dirty).toBe(true)
  //     })
  //     it('should have nested.$anyDirty true when all values are $anyDirty', () => {
  //       const vm = new Vue({
  //         ...baseGroup,
  //         validations: {
  //           nested: {
  //             value1: { T },
  //             value2: { T }
  //           }
  //         }
  //       })
  //       vm.$v.nested.value1.$touch()
  //       vm.$v.nested.value2.$touch()
  //       expect(vm.$v.nested.$anyDirty).toBe(true)
  //     })
  //     it('should have $error false when not all nested values are $dirty and $invalid', () => {
  //       const vm = new Vue({
  //         ...baseGroup,
  //         validations: {
  //           nested: {
  //             value1: { F },
  //             value2: { T }
  //           }
  //         }
  //       })
  //       vm.$v.nested.value1.$touch()
  //       expect(vm.$v.nested.$error).toBe(false)
  //     })
  //     it('should have $anyError true when not all nested values are $dirty and $invalid', () => {
  //       const vm = new Vue({
  //         ...baseGroup,
  //         validations: {
  //           nested: {
  //             value1: { F },
  //             value2: { T }
  //           }
  //         }
  //       })
  //       vm.$v.nested.value1.$touch()
  //       expect(vm.$v.nested.$anyError).toBe(true)
  //     })
  //     it('should propagate nested.$reset to all nested values', () => {
  //       const vm = new Vue({
  //         ...baseGroup,
  //         validations: {
  //           nested: {
  //             value1: { T },
  //             value2: { T }
  //           }
  //         }
  //       })
  //       vm.$v.nested.value1.$touch()
  //       vm.$v.nested.$reset()
  //       expect(vm.$v.nested.value1.$dirty).toBe(false)
  //       expect(vm.$v.nested.value2.$dirty).toBe(false)
  //       expect(vm.$v.nested.value1.$anyDirty).toBe(false)
  //       expect(vm.$v.nested.value2.$anyDirty).toBe(false)
  //     })
  //   })
  // })
  //
  // describe('$v.value', () => {
  //   describe('when validations pass', () => {
  //     it('should have $invalid value set to false', () => {
  //       const vm = new Vue({
  //         ...base,
  //         validations: {
  //           value: { isEven }
  //         }
  //       })
  //       expect(vm.$v.value.$invalid).toBe(false)
  //     })
  //     it('should have validator name value set to true', () => {
  //       const vm = new Vue({
  //         ...base,
  //         validations: {
  //           value: { isEven }
  //         }
  //       })
  //       expect(vm.$v.value.isEven).toBe(true)
  //     })
  //   })
  //   describe('when validations did not pass', () => {
  //     it('should have $invalid value set to true', () => {
  //       const vm = new Vue({
  //         ...base,
  //         data () {
  //           return {
  //             value: 5
  //           }
  //         },
  //         validations: {
  //           value: { isEven }
  //         }
  //       })
  //       expect(vm.$v.value.$invalid).toBe(true)
  //     })
  //     it('should have validator name value set to false', () => {
  //       const vm = new Vue({
  //         ...base,
  //         data () {
  //           return {
  //             value: 5
  //           }
  //         },
  //         validations: {
  //           value: { isEven }
  //         }
  //       })
  //       expect(vm.$v.value.isEven).toBe(false)
  //     })
  //   })
  //   describe('when multiple validations exist', () => {
  //     it('should have the $invalid key set to true', () => {
  //       const vm = new Vue({
  //         ...base,
  //         validations: {
  //           value: { isEven, isOdd }
  //         }
  //       })
  //       expect(vm.$v.value.$invalid).toBe(true)
  //       expect(vm.$v.value.isEven).toBe(true)
  //       expect(vm.$v.value.isOdd).toBe(false)
  //     })
  //   })
  // })
  //
  // describe('nested fields', () => {
  //   it('should have accessible subvalidators with appropriate $invalid field', () => {
  //     const vm = new Vue({
  //       ...baseGroup,
  //       validations: {
  //         nested: {
  //           value3: { T },
  //           value4: { F }
  //         }
  //       }
  //     })
  //     expect(vm.$v.nested.value3.$invalid).toBe(false)
  //     expect(vm.$v.nested.value4.$invalid).toBe(true)
  //   })
  //
  //   it('should have $invalid value set to true on single nested fail', () => {
  //     const vm = new Vue({
  //       ...baseGroup,
  //       validations: {
  //         nested: {
  //           value3: { T },
  //           value4: { F }
  //         }
  //       }
  //     })
  //     expect(vm.$v.nested.$invalid).toBe(true)
  //   })
  //
  //   it('should have $invalid value set to false when all nested pass', () => {
  //     const vm = new Vue({
  //       ...baseGroup,
  //       validations: {
  //         nested: {
  //           value3: { isOdd },
  //           value4: { isEven }
  //         }
  //       }
  //     })
  //     expect(vm.$v.nested.$invalid).toBe(false)
  //   })
  // })
  //
  // describe('validator groups', () => {
  //   it('should have $invalid value set to true when value1 fail', () => {
  //     const vm = new Vue({
  //       ...baseGroup,
  //       validations: {
  //         group: ['value1', 'nested.value3', 'nested.value4'],
  //         value1: { isEven },
  //         nested: {
  //           value3: { isOdd },
  //           value4: { isEven }
  //         }
  //       }
  //     })
  //     expect(vm.$v.group.$invalid).toBe(true)
  //   })
  //   it('should allow groups defined by paths', () => {
  //     const vm = new Vue({
  //       ...baseGroup,
  //       validations: {
  //         group: [['nested', 'value3']],
  //         nested: {
  //           value3: { isOdd }
  //         }
  //       }
  //     })
  //     expect(vm.$v.group['nested.value3'].$invalid).toBe(false)
  //   })
  //   it('should have $invalid value set to true when nested.value3 fail', () => {
  //     const vm = new Vue({
  //       ...baseGroup,
  //       validations: {
  //         group: ['value1', 'nested.value3', 'nested.value4'],
  //         value1: { isOdd },
  //         nested: {
  //           value3: { isEven },
  //           value4: { isEven }
  //         }
  //       }
  //     })
  //     expect(vm.$v.group.$invalid).toBe(true)
  //   })
  //   it('should have $invalid value set to false when all grouped pass', () => {
  //     const vm = new Vue({
  //       ...baseGroup,
  //       validations: {
  //         group: ['value1', 'nested.value3', 'nested.value4'],
  //         value1: { isOdd },
  //         nested: {
  //           value3: { isOdd },
  //           value4: { isEven }
  //         }
  //       }
  //     })
  //     expect(vm.$v.group.$invalid).toBe(false)
  //   })
  //   it('should have $invalid value set to true when grouping undefined validators', () => {
  //     const vm = new Vue({
  //       ...baseGroup,
  //       validations: {
  //         group: [
  //           'value1',
  //           'nested.value3',
  //           'nested.value4',
  //           'abc.def',
  //           'abc.def.ghi'
  //         ],
  //         value1: { isOdd },
  //         nested: {
  //           value4: { isEven }
  //         }
  //       }
  //     })
  //     expect(vm.$v.group['abc.def.ghi']).toBe(false)
  //     expect(vm.$v.group.$invalid).toBe(true)
  //   })
  // })
  // describe('validating collections with $each', () => {
  //   const vmDef = (validator, tracker) => ({
  //     data () {
  //       return {
  //         list: [
  //           {
  //             value: 1
  //           },
  //           {
  //             value: 2
  //           }
  //         ]
  //       }
  //     },
  //     validations: {
  //       list: {
  //         $each: {
  //           $trackBy: tracker,
  //           value: {
  //             validator
  //           }
  //         }
  //       }
  //     }
  //   })
  //
  //   it('should allow changing the array to a non array value and back', () => {
  //     const vm = new Vue(vmDef(isEven))
  //     expect(vm.$v.list.$invalid).toBe(true)
  //     vm.list = undefined
  //     expect(vm.$v.list.$invalid).toBe(false)
  //     vm.list = null
  //     expect(vm.$v.list.$invalid).toBe(false)
  //     vm.list = false
  //     expect(vm.$v.list.$invalid).toBe(false)
  //     vm.list = ''
  //     expect(vm.$v.list.$invalid).toBe(false)
  //     vm.list = 1
  //     expect(vm.$v.list.$invalid).toBe(false)
  //     vm.list = function () {}
  //     expect(vm.$v.list.$invalid).toBe(false)
  //     vm.list = [{ value: 2 }]
  //     expect(vm.$v.list.$invalid).toBe(false)
  //     expect(vm.$v.list.$each[0]).toBeDefined()
  //     expect(vm.$v.list.$each[1]).toBeFalsy()
  //   })
  //
  //   it('should allow parent object to be non object', function () {
  //     const vm = new Vue({
  //       data () {
  //         return {
  //           obj: {
  //             value: 1
  //           }
  //         }
  //       },
  //       validations: {
  //         obj: {
  //           value: {
  //             noUndef
  //           }
  //         }
  //       }
  //     })
  //     vm.obj = undefined
  //     expect(vm.$v.obj.$invalid).toBe(true)
  //     vm.obj = null
  //     expect(vm.$v.obj.$invalid).toBe(true)
  //     vm.obj = false
  //     expect(vm.$v.obj.$invalid).toBe(true)
  //     vm.obj = 1
  //     expect(vm.$v.obj.$invalid).toBe(true)
  //     vm.obj = 'string'
  //     expect(vm.$v.obj.$invalid).toBe(true)
  //     vm.obj = function () {}
  //     expect(vm.$v.obj.$invalid).toBe(true)
  //     vm.obj = []
  //     expect(vm.$v.obj.$invalid).toBe(true)
  //     vm.obj = {}
  //     expect(vm.$v.obj.$invalid).toBe(true)
  //     vm.obj = { value: 1 }
  //     expect(vm.$v.obj.$invalid).toBe(false)
  //   })
  //   it('should create validators for list items', () => {
  //     const vm = new Vue(vmDef(isEven))
  //     expect(vm.$v.list.$each[0]).toBeDefined()
  //     expect(vm.$v.list.$each[1]).toBeDefined()
  //     expect(vm.$v.list.$each[2]).toBeFalsy()
  //   })
  //   it('should validate all items in list', () => {
  //     const vm = new Vue(vmDef(isEven))
  //     expect(vm.$v.list.$each[0].$invalid).toBe(true)
  //     expect(vm.$v.list.$each[1].$invalid).toBe(false)
  //   })
  //   it('should be $invalid when some elements are invalid', () => {
  //     const vm = new Vue(vmDef(isEven))
  //     expect(vm.$v.list.$invalid).toBe(true)
  //   })
  //   it('should not be $invalid when all elements are valid', () => {
  //     const vm = new Vue(vmDef(T))
  //     expect(vm.$v.list.$invalid).toBe(false)
  //   })
  //   it('should track additions and validate immediately', () => {
  //     const vm = new Vue(vmDef(isEven))
  //     vm.list.push({ value: 3 })
  //     vm.list.push({ value: 4 })
  //     expect(vm.$v.list.$each[0]).toBeDefined()
  //     expect(vm.$v.list.$each[1]).toBeDefined()
  //     expect(vm.$v.list.$each[2]).toBeDefined()
  //     expect(vm.$v.list.$each[3]).toBeDefined()
  //     expect(vm.$v.list.$each[4]).toBeFalsy()
  //     expect(vm.$v.list.$each[0].$invalid).toBe(true)
  //     expect(vm.$v.list.$each[1].$invalid).toBe(false)
  //     expect(vm.$v.list.$each[2].$invalid).toBe(true)
  //     expect(vm.$v.list.$each[3].$invalid).toBe(false)
  //   })
  //   it('should not loose $dirty after insertion based by index', () => {
  //     const vm = new Vue(vmDef(isEven))
  //     vm.$v.list.$each[0].$touch()
  //     vm.list.unshift({ value: 0 })
  //     expect(vm.$v.list.$each[0].$dirty).toBe(true)
  //     expect(vm.$v.list.$each[1].$dirty).toBe(false)
  //     expect(vm.$v.list.$each[2].$dirty).toBe(false)
  //   })
  //   it('should not loose $dirty after insertion based by $trackBy', () => {
  //     const vm = new Vue(vmDef(isEven, 'value'))
  //     vm.$v.list.$each[0].$touch()
  //     vm.list.unshift({ value: 0 })
  //     expect(vm.$v.list.$each[0].$dirty).toBe(false)
  //     expect(vm.$v.list.$each[1].$dirty).toBe(true)
  //   })
  //   it('should share validators when $trackBy overlap', () => {
  //     const vm = new Vue(vmDef(isEven, 'value'))
  //     vm.list.unshift({ value: 1 })
  //     expect(vm.$v.list.$each[0]).toBe(vm.$v.list.$each[1])
  //     expect(vm.$v.list.$each[0].$dirty).toBe(false)
  //   })
  //   it('should share validators when functional $trackBy overlap', () => {
  //     const vm = new Vue(vmDef(isEven, (x) => x.value))
  //     vm.list.unshift({ value: 1 })
  //     expect(vm.$v.list.$each[0]).toBe(vm.$v.list.$each[1])
  //     expect(vm.$v.list.$each[0].$dirty).toBe(false)
  //   })
  //   it('should share validators when $trackBy overlap after initial get', () => {
  //     const vm = new Vue(vmDef(isEven, 'value'))
  //     vm.$v.list.$each[0].$touch()
  //     vm.list.unshift({ value: 1 })
  //     expect(vm.$v.list.$each[0]).toBe(vm.$v.list.$each[1])
  //     expect(vm.$v.list.$each[0].$dirty).toBe(true)
  //   })
  //
  //   it('should allow deleting first child', () => {
  //     const vm = new Vue(vmDef(isEven, 'value'))
  //     expect(vm.$v.list.$each[0].$invalid).toBe(true)
  //     vm.list.shift()
  //     expect(vm.$v.list.$each[0].$invalid).toBe(false)
  //   })
  //   it('should allow deleting last child', () => {
  //     const vm = new Vue(vmDef(isEven, 'value'))
  //     expect(vm.$v.list.$each[1].$invalid).toBe(false)
  //     vm.list.pop()
  //     expect(vm.$v.list.$each[1]).toBeFalsy()
  //   })
  //   it('should allow swapping children', () => {
  //     const vm = new Vue(vmDef(isEven, 'value'))
  //     expect(vm.$v.list.$each[0].$invalid).toBe(true)
  //     expect(vm.$v.list.$each[1].$invalid).toBe(false)
  //     vm.list[0].value = 2
  //     vm.list[1].value = 1
  //     expect(vm.$v.list.$each[0].$invalid).toBe(false)
  //     expect(vm.$v.list.$each[1].$invalid).toBe(true)
  //   })
  //   it('should allow reordering with insertion children', () => {
  //     const vm = new Vue(vmDef(isEven, 'value'))
  //     vm.list.push({ value: 3 }, { value: 4 }, { value: 5 })
  //     expect(vm.$v.list.$each[0].$invalid).toBe(true)
  //     expect(vm.$v.list.$each[4].$invalid).toBe(true)
  //     vm.list[0].value = 1
  //     vm.list[1].value = 5
  //     vm.list[2].value = 6
  //     vm.list[3].value = 2
  //     vm.list[4].value = 4
  //     expect(vm.$v.list.$each[0].$invalid).toBe(true)
  //     expect(vm.$v.list.$each[4].$invalid).toBe(false)
  //     expect(vm.$v.list.$each[2].$invalid).toBe(false)
  //   })
  //   it('should allow reordering with different beginning and ending', () => {
  //     const vm = new Vue(vmDef(isEven, 'value'))
  //     vm.list.push({ value: 3 }, { value: 4 }, { value: 5 }, { value: 6 })
  //     vm.$v.list.$each[0]
  //     vm.list[0].value = 5
  //     vm.list[1].value = 6
  //     vm.list[2].value = 2
  //     vm.list[3].value = 1
  //     vm.list[4].value = 4
  //     expect(vm.$v.list.$each[0].$invalid).toBe(true)
  //     expect(vm.$v.list.$each[1].$invalid).toBe(false)
  //     expect(vm.$v.list.$each[2].$invalid).toBe(false)
  //     expect(vm.$v.list.$each[3].$invalid).toBe(true)
  //     expect(vm.$v.list.$each[4].$invalid).toBe(false)
  //   })
  //   it('should have $iter key that iteates only over provided keys', () => {
  //     const vm = new Vue(vmDef(isEven, 'value'))
  //     expect(Object.keys(vm.$v.list.$each.$iter)).toEqual(['0', '1'])
  //     expect(vm.$v.list.$each.$iter[0]).toEqual(vm.$v.list.$each[0])
  //   })
  // })
  //
  // describe('validating direct values with $each', () => {
  //   const vmDef = (validator, tracker) => ({
  //     data () {
  //       return {
  //         external: true,
  //         list: [1, 2, 3]
  //       }
  //     },
  //     validations: {
  //       list: {
  //         $each: {
  //           $trackBy: tracker,
  //           validator
  //         }
  //       }
  //     }
  //   })
  //
  //   it('should validate all items in list', () => {
  //     const vm = new Vue(vmDef(isEven))
  //     expect(vm.$v.list.$each[0].$invalid).toBe(true)
  //     expect(vm.$v.list.$each[1].$invalid).toBe(false)
  //     expect(vm.$v.list.$each[2].$invalid).toBe(true)
  //   })
  //
  //   it('should not loose $dirty after insertion based by index', () => {
  //     const vm = new Vue(vmDef(isEven))
  //     vm.$v.list.$each[0].$touch()
  //     vm.list.unshift(5)
  //     expect(vm.$v.list.$each[0].$dirty).toBe(true)
  //     expect(vm.$v.list.$each[1].$dirty).toBe(false)
  //     expect(vm.$v.list.$each[2].$dirty).toBe(false)
  //   })
  //
  //   it('should not leak indirect watcher on destroy', () => {
  //     const vm = new Vue(vmDef(isEven))
  //     expect(vm.$v.list.$each[0].$invalid).toBe(true)
  //     vm.$destroy()
  //     // FIXME: how to test against memory leak?
  //     // Now this just covers the teardown code in the report.
  //   })
  //
  //   it('should not leak indirect watcher on destroy', () => {
  //     const spy = sinon.spy(isEven)
  //     const vm = new Vue(vmDef(spy))
  //     expect(vm.$v.list.$each[0].$invalid).toBe(true)
  //     expect(spy).to.have.been.calledWith(1, vm.list)
  //   })
  //
  //   it('should pass collection as second argument to validators', () => {
  //     const spy = sinon.spy(isEven)
  //     const vm = new Vue(vmDef(spy))
  //     expect(vm.$v.list.$each[0].$invalid).toBe(true)
  //     expect(spy).to.have.been.calledWith(1, vm.list)
  //   })
  //
  //   it('should revalidate only changed items', () => {
  //     const spy = sinon.spy(isEven)
  //     const vm = new Vue(vmDef(spy))
  //
  //     expect(vm.$v.list.$each[0].$invalid).toBe(true)
  //     expect(vm.$v.list.$each[1].$invalid).toBe(false)
  //     expect(vm.$v.list.$each[2].$invalid).toBe(true)
  //
  //     expect(spy).to.have.been.calledWith(1)
  //     expect(spy).to.have.been.calledWith(2)
  //     expect(spy).to.have.been.calledWith(3)
  //     expect(spy).to.have.been.calledThrice
  //     spy.resetHistory()
  //
  //     vm.$set(vm.list, 1, 15)
  //     expect(vm.$v.list.$each[0].$invalid).toBe(true)
  //     expect(vm.$v.list.$each[1].$invalid).toBe(true)
  //     expect(vm.$v.list.$each[2].$invalid).toBe(true)
  //     expect(spy).to.have.been.calledOnce
  //     expect(spy).to.have.been.calledWith(15)
  //   })
  //
  //   it('should revalidate all items with updated dependency', () => {
  //     const spy = sinon.spy(function (val, arr, rootVm) {
  //       return val > 2 ? !isEven(val) : this.external
  //     })
  //     const vm = new Vue(vmDef(spy))
  //
  //     expect(vm.$v.list.$each[0].$invalid).toBe(false)
  //     expect(vm.$v.list.$each[1].$invalid).toBe(false)
  //     expect(vm.$v.list.$each[2].$invalid).toBe(false)
  //     expect(spy).to.have.been.calledThrice
  //     spy.resetHistory()
  //
  //     vm.external = false
  //     expect(vm.$v.list.$each[0].$invalid).toBe(true)
  //     expect(vm.$v.list.$each[1].$invalid).toBe(true)
  //     expect(vm.$v.list.$each[2].$invalid).toBe(false)
  //     expect(spy).to.have.been.calledWith(1)
  //     expect(spy).to.have.been.calledWith(2)
  //     expect(spy).to.have.been.calledTwice
  //   })
  // })
  //
  // describe('validator $params', () => {
  //   it('should have default null $params object', () => {
  //     const vm = new Vue({
  //       ...base,
  //       validations: {
  //         value: {
  //           isOdd (v) {
  //             return v % 2 === 1
  //           }
  //         }
  //       }
  //     })
  //     expect(vm.$v.value.$params.isOdd).toBeNull()
  //   })
  //
  //   it('should pass $params from validation function', () => {
  //     const fn = withParams({ type: 'alwaysTrue' }, () => true)
  //     const vm = new Vue({
  //       ...base,
  //       validations: {
  //         value: { fn }
  //       }
  //     })
  //     expect(vm.$v.value.$params.fn).toEqual({ type: 'alwaysTrue' })
  //   })
  //
  //   it('should pass $params from validation object', () => {
  //     const vm = new Vue({
  //       ...base,
  //       validations: {
  //         value: {
  //           $params: { test: true },
  //           T
  //         }
  //       }
  //     })
  //     expect(vm.$v.$params.value).toEqual({ test: true })
  //     expect(vm.$v.value.$params).toEqual({ T: null })
  //   })
  //
  //   it('should default $params for nested validation object to set of nulls', () => {
  //     const vm = new Vue({
  //       ...baseGroup,
  //       validations: {
  //         nested: {
  //           value3: { isOdd },
  //           value4: { isOdd }
  //         }
  //       }
  //     })
  //     expect(vm.$v.nested.$params).toEqual({ value3: null, value4: null })
  //   })
  //
  //   it('should return $sub $params on combined validators', () => {
  //     const tr = withParams({ type: 'alwaysTrue' }, () => true)
  //     const fl = withParams({ type: 'alwaysFalse' }, () => false)
  //     const combo = withParams({ type: 'combo' }, (v) => tr(v) && fl(v))
  //     const vm = new Vue({
  //       ...baseGroup,
  //       validations: {
  //         value: { combo }
  //       }
  //     })
  //     expect(vm.$v.value.$params.combo).toEqual({
  //       type: 'combo',
  //       $sub: [{ type: 'alwaysTrue' }, { type: 'alwaysFalse' }]
  //     })
  //   })
  //
  //   it('should return $sub $params on multiple direct validators', () => {
  //     const tr = withParams({ type: 'alwaysTrue' }, () => true)
  //     const fl = withParams({ type: 'alwaysFalse' }, () => false)
  //     const comboDirect = (v) => tr(v) && fl(v)
  //     const vm = new Vue({
  //       ...baseGroup,
  //       validations: {
  //         value: { comboDirect }
  //       }
  //     })
  //     expect(vm.$v.value.$params.comboDirect).toEqual({
  //       $sub: [{ type: 'alwaysTrue' }, { type: 'alwaysFalse' }]
  //     })
  //   })
  // })
  //
  // describe('$v.$flattenParams', () => {
  //   const vm = new Vue({
  //     ...base,
  //     data () {
  //       return {
  //         value: 5
  //       }
  //     },
  //     validations: {
  //       value: { isEven }
  //     }
  //   })
  //
  //   it('should return a list', () => {
  //     expect(vm.$v.$flattenParams().length).toBe(1)
  //   })
  //
  //   it('should return validator params', () => {
  //     expect(vm.$v.$flattenParams()).toEqual([
  //       { path: ['value'], name: 'isEven', params: { type: 'isEven' } }
  //     ])
  //   })
  //
  //   describe('for no validators', () => {
  //     const vm = new Vue({
  //       ...base,
  //       data () {
  //         return {
  //           value: 5
  //         }
  //       },
  //       validations: {
  //         value: {}
  //       }
  //     })
  //
  //     it('should return an empty array', () => {
  //       expect(vm.$v.$flattenParams()).toHaveLength(0)
  //     })
  //   })
  //
  //   describe('for nested validators', () => {
  //     const vm = new Vue({
  //       ...base,
  //       data () {
  //         return {
  //           first: {
  //             foo: 5,
  //             bar: 6
  //           },
  //           second: {
  //             foo: 7,
  //             bar: 8
  //           }
  //         }
  //       },
  //       validations: {
  //         first: {
  //           foo: { isEven },
  //           bar: { isEven }
  //         },
  //         second: {
  //           foo: { isEven },
  //           bar: { isEven }
  //         }
  //       }
  //     })
  //
  //     it('should work at the deepest validation level', () => {
  //       expect(vm.$v.first.foo.$flattenParams()).toEqual([
  //         { path: [], name: 'isEven', params: { type: 'isEven' } }
  //       ])
  //     })
  //
  //     it('should return params of all leaves', () => {
  //       expect(vm.$v.first.$flattenParams()).toEqual([
  //         { path: ['foo'], name: 'isEven', params: { type: 'isEven' } },
  //         { path: ['bar'], name: 'isEven', params: { type: 'isEven' } }
  //       ])
  //     })
  //
  //     it('should flatten results from all children', () => {
  //       expect(vm.$v.$flattenParams()).toEqual([
  //         {
  //           path: ['first', 'foo'],
  //           name: 'isEven',
  //           params: { type: 'isEven' }
  //         },
  //         {
  //           path: ['first', 'bar'],
  //           name: 'isEven',
  //           params: { type: 'isEven' }
  //         },
  //         {
  //           path: ['second', 'foo'],
  //           name: 'isEven',
  //           params: { type: 'isEven' }
  //         },
  //         {
  //           path: ['second', 'bar'],
  //           name: 'isEven',
  //           params: { type: 'isEven' }
  //         }
  //       ])
  //     })
  //   })
  // })
  //
  // describe('validation $model', () => {
  //   const simple = {
  //     ...base,
  //     validations: {
  //       value: { isEven }
  //     }
  //   }
  //
  //   const nested = {
  //     ...baseGroup,
  //     validations: {
  //       group: ['nested.value1', 'nested.value2'],
  //       nested: {
  //         value1: { T },
  //         value2: { T }
  //       }
  //     }
  //   }
  //
  //   const each = {
  //     data: {
  //       array: [1, 2, 3]
  //     },
  //     validations: {
  //       array: {
  //         $each: { isOdd }
  //       }
  //     }
  //   }
  //
  //   it('should give null for root object', () => {
  //     const vm = new Vue(simple)
  //     expect(vm.$v.$model).toBeNull()
  //   })
  //
  //   it('should give null for validation group', () => {
  //     const vm = new Vue(nested)
  //     expect(vm.$v.group.$model).toBeNull()
  //   })
  //
  //   it('should give original model reference for simple object', () => {
  //     const vm = new Vue(simple)
  //     expect(vm.$v.value.$model).toBe(4)
  //   })
  //
  //   it('should do nothing when setting root model', () => {
  //     const vm = new Vue(simple)
  //     vm.$v.$model = 'x'
  //     expect(vm.$v.$model).toBeNull()
  //     expect(vm.$v.$dirty).toBe(false)
  //   })
  //
  //   it('should do nothing when setting validation group model', () => {
  //     const vm = new Vue(nested)
  //     vm.$v.group.$model = 'x'
  //     expect(vm.$v.group.$model).toBeNull()
  //     expect(vm.$v.group.$dirty).toBe(false)
  //   })
  //
  //   it('should give original model reference for nested object', () => {
  //     const vm = new Vue(nested)
  //     const expected = {
  //       value1: 'hello',
  //       value2: 'world'
  //     }
  //     vm.nested = expected
  //
  //     expect(vm.$v.nested.$model).toBe(expected)
  //   })
  //
  //   it('should give original model references for nested object fields', () => {
  //     const vm = new Vue(nested)
  //     const expected = {
  //       value1: { a: 1 },
  //       value2: { b: 2 }
  //     }
  //     vm.nested = expected
  //
  //     expect(vm.$v.nested.value1.$model).toBe(expected.value1)
  //     expect(vm.$v.nested.value2.$model).toBe(expected.value2)
  //   })
  //
  //   it('should set $dirty on write for simple object', () => {
  //     const vm = new Vue(simple)
  //     vm.$v.value.$model = 5
  //     expect(vm.$v.value.$dirty).toBe(true)
  //   })
  //
  //   it('should set $dirty on write for nested object', () => {
  //     const vm = new Vue(nested)
  //     const expected = {
  //       value1: 'hello',
  //       value2: 'world'
  //     }
  //     vm.$v.nested.$model = expected
  //
  //     expect(vm.$v.nested.$dirty).toBe(true)
  //     expect(vm.$v.nested.value1.$dirty).toBe(true)
  //     expect(vm.$v.nested.value2.$dirty).toBe(true)
  //   })
  //
  //   it('should not be present on $each', () => {
  //     const vm = new Vue(each)
  //     expect(vm.$v.array.$each.$model).toBeUndefined()
  //   })
  //
  //   it('should reference array with defined $each', () => {
  //     const vm = new Vue(each)
  //     expect(vm.$v.array.$model).toBe(vm.array)
  //   })
  //
  //   it('should allow reading model on $each fields', () => {
  //     const vm = new Vue(each)
  //     expect(vm.$v.array.$each[0].$model).toBe(vm.array[0])
  //   })
  //
  //   it('should allow writing model on $each fields', () => {
  //     const vm = new Vue(each)
  //     vm.$v.array.$each[0].$model = 5
  //     expect(vm.array[0]).toBe(5)
  //   })
  //
  //   it('should set $dirty on write through $each field', () => {
  //     const vm = new Vue(each)
  //     vm.$v.array.$each[0].$model = 5
  //     expect(vm.$v.array.$each[0].$dirty).toBe(true)
  //   })
  // })
})

// const { withParams } = helpers
//
// const isEven = withParams({ type: 'isEven' }, (v) => {
//   return v % 2 === 0
// })
//
// const isOdd = withParams({ type: 'isOdd' }, (v) => {
//   return v % 2 === 1
// })
//
// const noUndef = withParams({ type: 'noUndef' }, (v) => v !== undefined)
//
// const T = () => true
// const F = () => false
//
// const base = {
//   data () {
//     return {
//       value: 4
//     }
//   }
// }
//
// const baseGroup = {
//   data () {
//     return {
//       value1: 1,
//       value2: 2,
//       nested: {
//         value3: 3,
//         value4: 4
//       }
//     }
//   }
// }
