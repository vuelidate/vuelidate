import { ref } from 'vue-demi'
import { isEven, isOdd } from '../validators.fixture'
import {
  createOldApiSimpleWrapper,
  createSimpleWrapper,
  shouldBeErroredValidationObject,
  shouldBeInvalidValidationObject,
  shouldBePristineValidationObj
} from '../utils'
import {
  asyncValidation,
  nestedComponentValidation,
  nestedRefObjectValidation,
  nestedReactiveObjectValidation
} from '../validations.fixture'
import { flushPromises, mount } from '@vue/test-utils'
import useVuelidate from '../../../src'
import { withAsync } from '@vuelidate/validators/src/common'

describe('OptionsAPI validations', () => {
  it('should have a `v` key defined if used', () => {
    const { vm } = createOldApiSimpleWrapper({}, {})

    expect(vm.v).toEqual(expect.any(Object))
  })

  it('should return a pristine validation object', () => {
    const { vm } = createOldApiSimpleWrapper({}, {})

    shouldBePristineValidationObj(vm.v)
  })

  it('should return a pristine validation object for a property using ref', () => {
    const number = ref(2)
    const { vm } = createOldApiSimpleWrapper({ number: { isEven } }, { number })

    expect(vm.v).toHaveProperty('number', expect.any(Object))
    shouldBePristineValidationObj(vm.v.number)
  })

  it('should return a pristine validation object for a property', () => {
    const { vm } = createOldApiSimpleWrapper({ number: { isEven } }, { number: 2 })

    expect(vm.v).toHaveProperty('number', expect.any(Object))
    shouldBePristineValidationObj(vm.v.number)
  })

  describe('$model', () => {
    it('should update the source value', async () => {
      const { vm } = createOldApiSimpleWrapper({ number: { isEven } }, { number: 1 })

      vm.v.number.$model = 3
      await vm.$nextTick()
      expect(vm.number).toBe(3)
    })

    it('should update the $dirty state to true when $model value changes', async () => {
      const { vm } = createOldApiSimpleWrapper({ number: { isEven } }, { number: 2 })
      shouldBePristineValidationObj(vm.v.number)

      vm.v.number.$model = 3
      await vm.$nextTick()
      shouldBeErroredValidationObject({ v: vm.v.number, property: 'number', validatorName: 'isEven' })
      vm.v.number.$model = 2
      await vm.$nextTick()
      expect(vm.v.$errors).toHaveLength(0)
      expect(vm.v.number).toHaveProperty('$error', false)
      expect(vm.v.number).toHaveProperty('$dirty', true)
      expect(vm.v.number).toHaveProperty('$anyDirty', true)
      expect(vm.v.number).toHaveProperty('$invalid', false)
    })
  })

  describe('nested component validations', () => {
    it('should collect child validations when they invalidate', async () => {
      const { state, parent } = nestedComponentValidation()
      const wrapper = mount(parent)
      shouldBeInvalidValidationObject({ v: wrapper.vm.v, property: 'number', validatorName: 'isEven' })
      state.number.value = 3
      await wrapper.vm.$nextTick()

      expect(wrapper.vm.v.$errors).toEqual([{
        $message: '',
        $params: {
          $response: false
        },
        $pending: false,
        $property: 'number',
        $propertyPath: 'number',
        $validator: 'isEven'
      }])
    })

    it('should return false on $validate() if nested component validation is invalid', async () => {
      const { state, parent } = nestedComponentValidation()
      const wrapper = mount(parent)
      shouldBeInvalidValidationObject({ v: wrapper.vm.v, property: 'number', validatorName: 'isEven' })
      // make the validation fail
      state.number.value = 3
      expect(await wrapper.vm.v.$validate()).toBe(false)
      // make the validation pass
      state.number.value = 4
      expect(await wrapper.vm.v.$validate()).toBe(true)
      expect(wrapper.vm.v.$errors).toHaveLength(0)
    })

    it('removes the child results if the child gets destroyed', async () => {
      const { childValidationRegisterName, parent, state } = nestedComponentValidation()
      const { vm } = mount(parent)
      // make sure the validation object is clear
      shouldBeInvalidValidationObject({ v: vm.v, property: 'number', validatorName: 'isEven' })
      state.number.value = 3
      await vm.$nextTick()
      expect(vm.v.$errors).toHaveLength(1)
      let childState = vm.v.$getResultsForChild(childValidationRegisterName)
      expect(childState).toBeTruthy()
      vm.shouldRenderChild = false
      await vm.$nextTick()
      childState = vm.v.$getResultsForChild(childValidationRegisterName)
      expect(childState).toBeFalsy()
      // there are no errors at all
      expect(vm.v.$errors).toEqual([])
    })
  })

  describe('$getResultsForChild', () => {
    it('returns the validation results for a child component', async () => {
      const { childValidationRegisterName, parent, state } = nestedComponentValidation()
      const { vm } = mount(parent)
      shouldBeInvalidValidationObject({ v: vm.v, property: 'number', validatorName: 'isEven' })
      state.number.value = 3
      await vm.$nextTick()
      const childState = vm.v.$getResultsForChild(childValidationRegisterName)
      expect(childState).toHaveProperty('$errors')
      expect(childState.$errors).toContainEqual({
        '$message': '',
        '$params': {
          $response: false
        },
        '$pending': false,
        '$property': 'number',
        '$propertyPath': 'number',
        '$validator': 'isEven'
      })
    })

    it('is only preset at the top level', () => {
      const { state, validations } = nestedReactiveObjectValidation()
      const { vm } = createOldApiSimpleWrapper(validations, state)
      expect(vm.v).toHaveProperty('$getResultsForChild')
      expect(vm.v.level0).not.toHaveProperty('$getResultsForChild')
      expect(vm.v.level1).not.toHaveProperty('$getResultsForChild')
      expect(vm.v.level1.level2).not.toHaveProperty('$getResultsForChild')
    })
  })

  // describe('$params', () => {
  //   it('keeps `$params` reactive', () => {
  //
  //   })
  // })

  describe('validators', () => {
    it('supports access to the component scope', async () => {
      const validation = function () {
        if (this.condition) {
          return { number: { isOdd } }
        }
        return { number: { isEven } }
      }
      const wrapper = createOldApiSimpleWrapper(validation, { number: 2, condition: true })

      expect(wrapper.vm.v).toHaveProperty('number', expect.any(Object))
      shouldBeInvalidValidationObject({ v: wrapper.vm.v, property: 'number', validatorName: 'isOdd' })
    })

    it('support dynamic validations', async () => {
      const validation = function () {
        if (this.condition) {
          return {}
        }
        return { number: { isEven } }
      }
      const wrapper = createOldApiSimpleWrapper(validation, { number: 2, condition: false })

      expect(wrapper.vm.v).toHaveProperty('number', expect.any(Object))
      shouldBePristineValidationObj(wrapper.vm.v.number)

      wrapper.vm.condition = true
      await flushPromises()

      expect(wrapper.vm.v).not.toHaveProperty('number')
      shouldBePristineValidationObj(wrapper.vm.v)
    })

    //   it('supports a validator to be a function, returning a boolean', () => {
    //
    //   })
    //
    //   it('supports a validator to be a function, returning an object with `$invalid` property', () => {
    //
    //   })
    //
    //   it('supports a validator to be an object with `$validator` function property', () => {
    //
    //   })
    //
    it('supports async validators via `$async: true` object syntax', async () => {
      jest.useFakeTimers()
      const { state, validations } = asyncValidation()
      const { vm } = createSimpleWrapper(validations, state)
      vm.v.$touch()
      await flushPromises()
      expect(vm.v.number.asyncIsEven.$pending).toBe(false)
      state.number.value = 6
      expect(vm.v.number.asyncIsEven.$pending).toBe(true)
      expect(vm.v.number.$invalid).toBe(true)
      await flushPromises()
      expect(vm.v.number.asyncIsEven.$pending).toBe(false)
      expect(vm.v.number.$invalid).toBe(false)
      jest.useRealTimers()
    })

    it('throws when passed an async validator directly', () => {
      const asyncValidator = (v) => Promise.resolve(v)
      const number = ref(0)
      const component = {
        template: '<div>Hello World</div>',
        setup () {
          const v = useVuelidate({ number: { asyncValidator } }, { number })
          return { v }
        }
      }
      const { vm } = mount(component)
      // throws here, because we call the `$invalid` getter.
      expect(() => vm.v.$touch).toThrowError()
    })
    //
    // TODO: Fix this one
    // it('allows multiple invocations of an async validator, the last one to resolve, sets the return value', async () => {
    //   // prepare async validator
    //   const validator = jest.fn().mockResolvedValue(true)
    //   const asyncValidator = withAsync(validator)
    //   // prepare state
    //   const number = ref(0)
    //   const { vm } = createSimpleWrapper({ number: { asyncValidator } }, { number }, { $lazy: true })
    //   // make sure the validator is armed
    //   vm.v.$touch()
    //   // assert its called once, for the dirty state change
    //   expect(validator).toHaveBeenCalledTimes(1)
    //   // assert there is an error state
    //   expect(vm.v.number.asyncValidator.$invalid).toBe(true)
    //   expect(vm.v.number.$invalid).toBe(true)
    //   // change it a few times
    //   number.value = 1
    //   number.value = 2
    //   validator.mockResolvedValueOnce(false)
    //   number.value = 3
    //   await flushPromises()
    //   expect(vm.v.number.asyncValidator.$invalid).toBe(false)
    //   validator.mockResolvedValueOnce(true)
    //   number.value = 2
    //   validator.mockResolvedValueOnce(false)
    //   number.value = 1
    //   await flushPromises()
    //   expect(vm.v.number.asyncValidator.$invalid).toBe(false)
    // })
  })

  describe('deep changes in state', () => {
    it('trigger $dirty and $model reactions', async () => {
      const { state, validations } = nestedRefObjectValidation()

      const { vm } = createSimpleWrapper(validations, state)

      expect(vm.v.level1.level2.child).toHaveProperty('$model', 2)
      expect(vm.v.level1.level2.child).toHaveProperty('$dirty', false)

      state.value = {
        ...state.value,
        level1: {
          ...state.value.level1,
          level2: {
            child: 1
          }
        }
      }
      await flushPromises()

      expect(vm.v.level1.level2.child).toHaveProperty('$model', 1)
      expect(vm.v.level1.level2.child).toHaveProperty('$dirty', true)
      expect(vm.v.level1.level2).toHaveProperty('$anyDirty', true)
      expect(vm.v.level1).toHaveProperty('$anyDirty', true)
      expect(vm.v).toHaveProperty('$anyDirty', true)
    })

    it('trigger $invalid reactions', async () => {
      const { state, validations } = nestedRefObjectValidation()

      const { vm } = createSimpleWrapper(validations, state)

      vm.v.level1.level2.child.$touch()
      expect(vm.v.level1.level2.child).toHaveProperty('$invalid', false)

      state.value = {
        ...state.value,
        level1: {
          ...state.value.level1,
          level2: {
            child: 1
          }
        }
      }

      expect(vm.v.level1.level2.child).toHaveProperty('$invalid', true)
    })
  })
})
