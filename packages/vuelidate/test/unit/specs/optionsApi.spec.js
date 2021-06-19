import { ref, nextTick } from 'vue-demi'
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
import { flushPromises, mount } from '../test-utils'
import withAsync from '@vuelidate/validators/src/utils/withAsync'
import { toRef } from '@vue/composition-api'

describe('OptionsAPI validations', () => {
  it('should have a `v` key defined if used', async () => {
    const { vm } = await createOldApiSimpleWrapper({}, {})

    expect(vm.v).toEqual(expect.any(Object))
  })

  it('should return a pristine validation object', async () => {
    const { vm } = await createOldApiSimpleWrapper({}, {})

    shouldBePristineValidationObj(vm.v)
  })

  it('should return a pristine validation object for a property using ref', async () => {
    const number = ref(2)
    const { vm } = await createOldApiSimpleWrapper({ number: { isEven } }, { number })

    expect(vm.v).toHaveProperty('number', expect.any(Object))
    shouldBePristineValidationObj(vm.v.number)
  })

  it('should return a pristine validation object for a property', async () => {
    const { vm } = await createOldApiSimpleWrapper({ number: { isEven } }, { number: 2 })

    expect(vm.v).toHaveProperty('number', expect.any(Object))
    shouldBePristineValidationObj(vm.v.number)
  })

  describe('$model', () => {
    it('should update the source value', async () => {
      const { vm } = await createOldApiSimpleWrapper({ number: { isEven } }, { number: 1 })

      vm.v.number.$model = 3
      await vm.$nextTick()
      expect(vm.number).toBe(3)
    })

    it('should update the $dirty state to true when $model value changes', async () => {
      const { vm } = await createOldApiSimpleWrapper({ number: { isEven } }, { number: 2 })
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
      await wrapper.vm.$nextTick()
      shouldBeInvalidValidationObject({ v: wrapper.vm.v, property: 'number', validatorName: 'isEven' })
      state.number.value = 3
      await wrapper.vm.$nextTick()

      expect(wrapper.vm.v.$errors).toEqual([{
        $message: '',
        $params: {},
        $pending: false,
        $property: 'number',
        $propertyPath: 'number',
        $validator: 'isEven',
        $response: false,
        $uid: 'number-isEven'
      }])
    })

    it('should return false on $validate() if nested component validation is invalid', async () => {
      const { state, parent } = nestedComponentValidation()
      const wrapper = mount(parent)
      await wrapper.vm.$nextTick()

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
      await vm.$nextTick()

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
      await vm.$nextTick()
      shouldBeInvalidValidationObject({ v: vm.v, property: 'number', validatorName: 'isEven' })
      state.number.value = 3
      await vm.$nextTick()
      const childState = vm.v.$getResultsForChild(childValidationRegisterName)
      expect(childState).toHaveProperty('$errors')
      expect(childState.$errors).toContainEqual({
        '$message': '',
        '$params': {},
        '$pending': false,
        '$property': 'number',
        '$propertyPath': 'number',
        '$validator': 'isEven',
        $response: false,
        $uid: 'number-isEven'
      })
    })

    it('is only preset at the top level', async () => {
      const { state, validations } = nestedReactiveObjectValidation()
      const { vm } = await createOldApiSimpleWrapper(validations, state)
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
      const wrapper = await createOldApiSimpleWrapper(validation, { number: 2, condition: true })

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
      const wrapper = await createOldApiSimpleWrapper(validation, { number: 2, condition: false })

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
      const { validations } = asyncValidation()
      const { vm } = await createOldApiSimpleWrapper(validations, { number: 1 })
      vm.v.$touch()
      await nextTick()
      jest.advanceTimersByTime(6)
      await nextTick()
      expect(vm.v.number.asyncIsEven.$pending).toBe(false)
      vm.number = 6
      await nextTick()

      expect(vm.v.number.asyncIsEven.$pending).toBe(true)
      expect(vm.v.number.$invalid).toBe(true)

      jest.advanceTimersByTime(6)
      await nextTick()

      expect(vm.v.number.asyncIsEven.$pending).toBe(false)
      expect(vm.v.number.$invalid).toBe(false)
      jest.useRealTimers()
    })

    //
    // TODO: Fix this one
    it('allows multiple invocations of an async validator, the last one to resolve, sets the return value', async () => {
      // prepare async validator
      const validator = jest.fn((v) => Promise.resolve(isEven(v)))
      const asyncValidator = withAsync(validator)
      // prepare state
      const { vm } = await createOldApiSimpleWrapper({ number: { asyncValidator } }, { number: 1 })
      // assert its called once, for the dirty state change
      expect(validator).toHaveBeenCalledTimes(1)
      // assert there is an error state
      expect(vm.v.number.asyncValidator.$invalid).toBe(true)
      expect(vm.v.number.$invalid).toBe(true)
      // change it a few times
      vm.number = 0
      vm.number = 2
      await flushPromises()
      vm.number = 3
      expect(vm.v.number.asyncValidator.$invalid).toBe(false)
      vm.number = 1
      vm.number = 2
      await flushPromises()
      expect(vm.v.number.asyncValidator.$invalid).toBe(false)
    })

    it('passes the currentInstance to a validator', async () => {
      const validator = jest.fn(function (value, vm) {
        return this.number === value && vm.number === value
      })

      const validation = {
        number: { validator }
      }
      const wrapper = await createOldApiSimpleWrapper(validation, { number: 2 })

      expect(wrapper.vm.v).toHaveProperty('number', expect.any(Object))
      // assert that `this` is the same as the second parameter
      expect(validator.mock.instances[0]).toEqual(validator.mock.calls[0][1])
      // assert that the validator is called with the value and an object that is the VM
      expect(validator).toHaveBeenLastCalledWith(2, expect.objectContaining({ number: 2 }))
      // assert the validator returned `true`
      expect(validator).toHaveLastReturnedWith(true)
      wrapper.vm.number = 5
      await wrapper.vm.$nextTick()
      // make sure the validator is called with the updated value and VM
      expect(validator).toHaveBeenLastCalledWith(5, expect.objectContaining({ number: 5 }))
    })

    it('allows passing a watchTarget for async validators', async () => {
      const validator = jest.fn((v, instance) => Promise.resolve(instance.enabled ? isEven(v) : false))

      function validations () {
        return {
          number: {
            asyncValidator: withAsync(validator, () => this.enabled)
          }
        }
      }

      const state = { number: 1, enabled: false }
      // prepare state
      const { vm } = await createOldApiSimpleWrapper(validations, state)

      expect(vm.v.number).toHaveProperty('$invalid', true)
      expect(validator).toHaveBeenLastCalledWith(1, expect.any(Object))
      vm.number = 2
      await flushPromises()
      expect(validator).toHaveBeenLastCalledWith(2, expect.any(Object))
      expect(vm.v.number).toHaveProperty('$invalid', true)
      vm.enabled = true
      await flushPromises()
      expect(validator).toHaveBeenCalledTimes(3)
      expect(vm.v.number).toHaveProperty('$invalid', false)
      vm.enabled = false
      await flushPromises()
      expect(vm.v.number).toHaveProperty('$invalid', true)
    })
  })

  describe('external results', () => {
    it('saves external results, by changing individual properties', async () => {
      const validation = {
        number: { isEven }
      }
      const { vm } = await createOldApiSimpleWrapper(validation, { number: 1, vuelidateExternalResults: { number: '' } })

      vm.v.$touch()
      expect(vm.vuelidateExternalResults).toEqual({ number: '' })

      expect(vm.v).toHaveProperty('number', expect.any(Object))
      expect(vm.v.number.$externalResults).toEqual([])
      // set an external validation result
      vm.vuelidateExternalResults.number = ['foo']
      // assert
      const externalErrorObject = {
        '$message': 'foo',
        '$property': 'number',
        '$propertyPath': 'number',
        '$validator': '$externalResults'
      }
      expect(vm.v.number.$externalResults).toEqual([externalErrorObject])
      expect(vm.v.number.$error).toBe(true)
      expect(vm.v.number.$silentErrors).toHaveLength(2)
      expect(vm.v.number.$silentErrors).toContainEqual(externalErrorObject)
      vm.v.number.$model = 2
      await nextTick()
      expect(vm.v.number.$error).toBe(true)
      expect(vm.v.number.$silentErrors).toHaveLength(1)
      expect(vm.v.number.$silentErrors).toEqual([externalErrorObject])
      vm.vuelidateExternalResults.number = []
      expect(vm.v.number.$error).toBe(false)
      expect(vm.v.number.$silentErrors).toEqual([])
    })

    it('works by replacing the entire external state, with pre-definition', async () => {
      const validation = {
        number: { isEven }
      }
      const vuelidateExternalResults = { number: '' }
      const { vm } = await createOldApiSimpleWrapper(validation, { number: 1, vuelidateExternalResults })

      vm.v.$touch()
      expect(vm.vuelidateExternalResults).toEqual({ number: '' })

      expect(vm.v).toHaveProperty('number', expect.any(Object))
      expect(vm.v.number.$externalResults).toEqual([])
      // set an external validation result
      Object.assign(vm.vuelidateExternalResults, { number: ['foo'] })
      // assert
      const externalErrorObject = {
        '$message': 'foo',
        '$property': 'number',
        '$propertyPath': 'number',
        '$validator': '$externalResults'
      }
      expect(vm.v.number.$externalResults).toEqual([externalErrorObject])
      expect(vm.v.number.$error).toBe(true)
      expect(vm.v.number.$silentErrors).toHaveLength(2)
      expect(vm.v.number.$silentErrors).toContainEqual(externalErrorObject)
      vm.v.number.$model = 2
      await nextTick()
      expect(vm.v.number.$error).toBe(true)
      expect(vm.v.number.$silentErrors).toHaveLength(1)
      expect(vm.v.number.$silentErrors).toEqual([externalErrorObject])
      vm.v.$clearExternalResults()
      expect(vm.vuelidateExternalResults).toEqual(vuelidateExternalResults)
      expect(vm.v.number.$externalResults).toEqual([])
      expect(vm.v.number.$error).toBe(false)
      expect(vm.v.number.$silentErrors).toEqual([])
      // trigger again
      Object.assign(vm.vuelidateExternalResults, { number: ['bar'] })
      expect(vm.v.number.$externalResults).toEqual([{
        $message: 'bar',
        $property: 'number',
        $propertyPath: 'number',
        $validator: '$externalResults'
      }])
    })
  })

  describe('deep changes in state', () => {
    it('trigger $dirty and $model reactions', async () => {
      const { state, validations } = nestedRefObjectValidation()

      const { vm } = await createSimpleWrapper(validations, state)

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

      const { vm } = await createSimpleWrapper(validations, state)

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
      await vm.$nextTick()

      expect(vm.v.level1.level2.child).toHaveProperty('$invalid', true)
    })
  })
})
