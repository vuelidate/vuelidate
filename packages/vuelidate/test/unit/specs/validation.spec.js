import { computed, ref, h } from 'vue-demi'
import { flushPromises, mount } from '@vue/test-utils'
import { isEven } from '../validators.fixture'
import {
  asyncValidation,
  computedValidationsObjectWithReactive,
  computedValidationsObjectWithRefs,
  nestedComponentValidation,
  nestedReactiveObjectValidation,
  simpleValidation,
  nestedRefObjectValidation
} from '../validations.fixture'
import {
  createSimpleWrapper,
  shouldBePristineValidationObj,
  shouldBeInvalidValidationObject,
  shouldBeErroredValidationObject,
  createSimpleComponent
} from '../utils'
import { withAsync, withMessage, withParams } from '@vuelidate/validators/src/common'
import useVuelidate, { CollectFlag } from '../../../src'

describe('useVuelidate', () => {
  it('should have a `v` key defined if used', () => {
    const wrapper = createSimpleWrapper({}, {})

    expect(wrapper.vm.v).toEqual(expect.any(Object))
  })

  it('does not error out if invoked without any parameters', () => {
    const warnSpy = jest.spyOn(console, 'warn')
    const { vm } = createSimpleWrapper()

    expect(warnSpy).toHaveBeenCalledTimes(0)
    shouldBePristineValidationObj(vm.v)
  })

  it('should return a pristine validation object', () => {
    const { vm } = createSimpleWrapper({}, {})

    shouldBePristineValidationObj(vm.v)
  })

  it('should return a pristine validation object for a property', () => {
    const number = ref(2)
    const { vm } = createSimpleWrapper({ number: { isEven } }, { number })

    expect(vm.v).toHaveProperty('number', expect.any(Object))
    shouldBePristineValidationObj(vm.v.number)
  })

  it('should set the parent `$dirty` prop to true, when all children are dirty', () => {
    const { state, validations } = nestedReactiveObjectValidation()
    const { vm } = createSimpleWrapper(validations, state)

    expect(vm.v.$dirty).toBe(false)
    expect(vm.v.level0.$dirty).toBe(false)
    expect(vm.v.level1.$dirty).toBe(false)

    vm.v.level1.$touch()
    expect(vm.v.$dirty).toBe(false)
    expect(vm.v.level0.$dirty).toBe(false)
    expect(vm.v.level1.$dirty).toBe(true)

    vm.v.level0.$touch()
    expect(vm.v.$dirty).toBe(true)
    expect(vm.v.level0.$dirty).toBe(true)
  })

  describe('.$touch', () => {
    it('should update the `$dirty` state to `true`, on used property', () => {
      const { state, validations } = simpleValidation()
      const { vm } = createSimpleWrapper(validations, state)

      shouldBeInvalidValidationObject({ v: vm.v.number, property: 'number', validatorName: 'isEven' })

      vm.v.number.$touch()
      shouldBeErroredValidationObject({ v: vm.v.number, property: 'number', validatorName: 'isEven' })
    })

    it('should update the `$dirty` state to `true` on all nested properties', () => {
      const number = ref(1)
      const number2 = ref(1)
      const { vm } = createSimpleWrapper(
        { parent: { number: { isEven } }, number2: { isEven } },
        { parent: { number }, number2 }
      )

      shouldBeInvalidValidationObject({ v: vm.v.number2, property: 'number2', propertyPath: 'number2', validatorName: 'isEven' })
      shouldBeInvalidValidationObject({ v: vm.v.parent, property: 'number', propertyPath: 'parent.number', validatorName: 'isEven' })

      vm.v.parent.$touch()

      shouldBeErroredValidationObject({ v: vm.v.parent.number, property: 'number', propertyPath: 'parent.number', validatorName: 'isEven' })
      shouldBeErroredValidationObject({ v: vm.v.parent, property: 'number', propertyPath: 'parent.number', validatorName: 'isEven' })

      expect(vm.v.parent.$dirty).toBe(true)
      shouldBeInvalidValidationObject({ v: vm.v.number2, property: 'number2', propertyPath: 'number2', validatorName: 'isEven' })
    })

    it('should not update the `$dirty` state on the property it wasnt used on', () => {
      const numberA = ref(1)
      const numberB = ref(1)
      const { vm } = createSimpleWrapper(
        { numberA: { isEven }, numberB: { isEven } },
        { numberA, numberB }
      )

      shouldBeInvalidValidationObject({ v: vm.v.numberA, property: 'numberA', validatorName: 'isEven' })
      vm.v.numberA.$touch()
      shouldBeErroredValidationObject({ v: vm.v.numberA, property: 'numberA', validatorName: 'isEven' })
      shouldBeInvalidValidationObject({ v: vm.v.numberB, property: 'numberB', validatorName: 'isEven' })
      expect(vm.v).toHaveProperty('$error', false)
      expect(vm.v).toHaveProperty('$dirty', false)
      expect(vm.v).toHaveProperty('$anyDirty', true)
      expect(vm.v).toHaveProperty('$invalid', true)
      expect(vm.v.$errors).toEqual([{
        $message: '',
        $params: {
          $response: false
        },
        $pending: false,
        $property: 'numberA',
        $propertyPath: 'numberA',
        $validator: 'isEven'
      }])
    })

    it('should update the `$dirty` state to `true` on all properties, when used on top level node', () => {
      const number = ref(1)
      const number2 = ref(1)
      const { vm } = createSimpleWrapper(
        { parent: { number: { isEven } }, number2: { isEven } },
        { parent: { number }, number2 }
      )

      shouldBeInvalidValidationObject({ v: vm.v.parent, property: 'number', propertyPath: 'parent.number', validatorName: 'isEven' })
      shouldBeInvalidValidationObject({ v: vm.v.number2, property: 'number2', validatorName: 'isEven' })
      vm.v.$touch()
      shouldBeErroredValidationObject({ v: vm.v.parent, property: 'number', propertyPath: 'parent.number', validatorName: 'isEven' })
      shouldBeErroredValidationObject({ v: vm.v.number2, property: 'number2', validatorName: 'isEven' })
    })

    it('should update the `$dirty` state even if being cached before hand', async () => {
      const { state, validations } = computedValidationsObjectWithRefs()
      const { number, conditional } = state
      const { vm } = createSimpleWrapper(validations, { number })
      expect(vm.v.number).toHaveProperty('$dirty', false)
      conditional.value = 10
      // await the async watcher to pass
      await vm.$nextTick()
      expect(vm.v).not.toHaveProperty('number')
      // return the validator
      conditional.value = 3
      // await the async watcher to pass
      await vm.$nextTick()
      expect(vm.v.number).toHaveProperty('$dirty', false)
      vm.v.number.$touch()
      expect(vm.v.number).toHaveProperty('$dirty', true)
    })
  })

  describe('.$reset', () => {
    it('should update the $dirty state to false', () => {
      const number = ref(1)
      const { vm } = createSimpleWrapper({ number: { isEven } }, { number })
      shouldBeInvalidValidationObject({ v: vm.v.number, property: 'number', validatorName: 'isEven' })

      vm.v.number.$touch()
      shouldBeErroredValidationObject({ v: vm.v.number, property: 'number', validatorName: 'isEven' })

      vm.v.number.$reset()
      shouldBeInvalidValidationObject({ v: vm.v.number, property: 'number', validatorName: 'isEven' })
    })

    it('should update the $dirty state to false, only on the current property', () => {
      const numberA = ref(1)
      const numberB = ref(1)
      const { vm } = createSimpleWrapper(
        {
          numberA: { isEven },
          numberB: { isEven }
        },
        { numberA, numberB }
      )

      // make it dirty
      vm.v.numberA.$touch()
      vm.v.numberB.$touch()
      // assert both are touched
      shouldBeErroredValidationObject({ v: vm.v.numberA, property: 'numberA', validatorName: 'isEven' })
      shouldBeErroredValidationObject({ v: vm.v.numberB, property: 'numberB', validatorName: 'isEven' })
      // reset only A
      vm.v.numberA.$reset()
      // assert that numberB is still dirty
      shouldBeInvalidValidationObject({ v: vm.v.numberA, property: 'numberA', validatorName: 'isEven' })
      shouldBeErroredValidationObject({ v: vm.v.numberB, property: 'numberB', validatorName: 'isEven' })
    })

    it('should reset all the properties back to pristine condition, including nested ones', () => {
      const numberA = ref(1)
      const numberB = ref(1)
      const { vm } = createSimpleWrapper(
        {
          parent: { numberA: { isEven } },
          numberB: { isEven }
        },
        { parent: { numberA }, numberB }
      )

      // make it dirty
      vm.v.parent.$touch()
      vm.v.numberB.$touch()
      // assert both are touched
      shouldBeErroredValidationObject({ v: vm.v.parent, property: 'numberA', propertyPath: 'parent.numberA', validatorName: 'isEven' })
      shouldBeErroredValidationObject({ v: vm.v.numberB, property: 'numberB', validatorName: 'isEven' })
      // reset only A
      vm.v.$reset()
      // assert that numberB is still dirty
      shouldBeInvalidValidationObject({ v: vm.v.parent, property: 'numberA', propertyPath: 'parent.numberA', validatorName: 'isEven' })
      shouldBeInvalidValidationObject({ v: vm.v.numberB, property: 'numberB', validatorName: 'isEven' })
    })

    it('should reset even after coming back from cache', async () => {
      const { state, validations } = computedValidationsObjectWithRefs()
      const { number, conditional } = state
      const { vm } = createSimpleWrapper(validations, { number })
      vm.v.number.$touch()
      expect(vm.v.number).toHaveProperty('$dirty', true)
      conditional.value = 10
      await vm.$nextTick()
      expect(vm.v).not.toHaveProperty('number')
      conditional.value = 3
      await vm.$nextTick()
      expect(vm.v.number).toHaveProperty('$dirty', true)
      vm.v.number.$reset()
      expect(vm.v.number).toHaveProperty('$dirty', false)
    })
  })

  describe('$autoDirty', () => {
    it('should update the $dirty state to true when value changes', async () => {
      const number = ref(1)
      const { vm } = createSimpleWrapper({ number: { isEven, $autoDirty: true } }, { number })
      shouldBeInvalidValidationObject({ v: vm.v.number, property: 'number', validatorName: 'isEven' })

      number.value = 3
      await vm.$nextTick()
      shouldBeErroredValidationObject({ v: vm.v.number, property: 'number', validatorName: 'isEven' })
      number.value = 2
      await vm.$nextTick()
      expect(vm.v.$errors).toHaveLength(0)
      expect(vm.v.number).toHaveProperty('$error', false)
      expect(vm.v.number).toHaveProperty('$dirty', true)
      expect(vm.v.number).toHaveProperty('$anyDirty', true)
      expect(vm.v.number).toHaveProperty('$invalid', false)
    })

    it('when used at root with plain object, should update the $dirty state', async () => {
      const number = ref(1)
      const { vm } = createSimpleWrapper({ number: { isEven } }, { number }, { $autoDirty: true })
      shouldBeInvalidValidationObject({ v: vm.v.number, property: 'number', validatorName: 'isEven' })

      number.value = 3
      await vm.$nextTick()
      shouldBeErroredValidationObject({ v: vm.v.number, property: 'number', validatorName: 'isEven' })
      number.value = 2
      await vm.$nextTick()
      expect(vm.v.$errors).toHaveLength(0)
      expect(vm.v.number).toHaveProperty('$error', false)
      expect(vm.v.number).toHaveProperty('$dirty', true)
      expect(vm.v.number).toHaveProperty('$anyDirty', true)
      expect(vm.v.number).toHaveProperty('$invalid', false)
    })

    it('when used at root with reactive object, should update the $dirty state', async () => {
      const { state, validations } = nestedReactiveObjectValidation()
      const { vm } = createSimpleWrapper(validations, state, { $autoDirty: true })
      shouldBePristineValidationObj(vm.v.level0)

      state.level0 = 3
      await vm.$nextTick()
      shouldBeErroredValidationObject({ v: vm.v.level0, property: 'level0', validatorName: 'isEven' })
      state.level0 = 2
      await vm.$nextTick()
      expect(vm.v.level0).toHaveProperty('$error', false)
      expect(vm.v.level0).toHaveProperty('$dirty', true)
      expect(vm.v.level0).toHaveProperty('$anyDirty', true)
      expect(vm.v.level0).toHaveProperty('$invalid', false)
      expect(vm.v.$errors).toHaveLength(0)
    })
  })

  describe('$model', () => {
    it('should update the source value', async () => {
      const number = ref(1)
      const { vm } = createSimpleWrapper({ number: { isEven } }, { number })

      vm.v.number.$model = 3
      await vm.$nextTick()
      expect(number.value).toBe(3)
    })

    it('should update the $dirty state to true when $model value changes', async () => {
      const number = ref(2)
      const { vm } = createSimpleWrapper({ number: { isEven } }, { number })
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

    it('works with `reactive`', () => {
      const { state, validations } = nestedReactiveObjectValidation()
      const { vm } = createSimpleWrapper(validations, state)
      expect(vm.state.level0).toBe(0)
      expect(vm.v.level0.$model).toBe(0)
      vm.v.level0.$model = 5
      // assert both the state and the vm state are updated
      expect(state.level0).toBe(5)
      expect(vm.state.level0).toBe(5)
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

    it('collects all child validation results, if parent `$scope` is not set', async () => {
      const { childValidationRegisterName, parent, state } = nestedComponentValidation({ childScope: 'child' })
      const { vm } = mount(parent)
      shouldBeInvalidValidationObject({ v: vm.v, property: 'number', validatorName: 'isEven' })
      state.number.value = 3
      await vm.$nextTick()
      expect(vm.v.$errors).toHaveLength(1)
      let childState = vm.v.$getResultsForChild(childValidationRegisterName)
      expect(childState).toBeTruthy()
    })

    it('collects all child validation results, if both have the same `$scope`', async () => {
      const { childValidationRegisterName, parent, state } = nestedComponentValidation({ parentScope: 'sameScope', childScope: 'sameScope' })
      const { vm } = mount(parent)
      shouldBeInvalidValidationObject({ v: vm.v, property: 'number', validatorName: 'isEven' })
      state.number.value = 3
      await vm.$nextTick()
      expect(vm.v.$errors).toHaveLength(1)
      let childState = vm.v.$getResultsForChild(childValidationRegisterName)
      expect(childState).toBeTruthy()
    })

    it('does not collect child validation results, if components have different `$scope`', async () => {
      const { childValidationRegisterName, parent, state } = nestedComponentValidation({ parentScope: 'parent', childScope: 'child' })
      const { vm } = mount(parent)
      shouldBePristineValidationObj(vm.v)
      state.number.value = 3
      await vm.$nextTick()
      const childState = vm.v.$getResultsForChild(childValidationRegisterName)
      expect(childState).toEqual(undefined)
      expect(vm.v.$errors).toEqual([])
    })

    it('does not collect child validation, if child `$scope` is `COLLECT_NONE`', async () => {
      const { childValidationRegisterName, parent, state } = nestedComponentValidation({ childScope: CollectFlag.COLLECT_NONE })
      const { vm } = mount(parent)
      shouldBePristineValidationObj(vm.v)
      state.number.value = 3
      await vm.$nextTick()
      const childState = vm.v.$getResultsForChild(childValidationRegisterName)
      expect(childState).toEqual(undefined)
      expect(vm.v.$errors).toEqual([])
    })

    it('does not collect child validations, if parent `$scope` is `COLLECT_NONE`', async () => {
      const { childValidationRegisterName, parent, state } = nestedComponentValidation({ parentScope: CollectFlag.COLLECT_NONE })
      const { vm } = mount(parent)
      shouldBePristineValidationObj(vm.v)
      state.number.value = 3
      await vm.$nextTick()
      const childState = vm.v.$getResultsForChild(childValidationRegisterName)
      expect(childState).toEqual(undefined)
      expect(vm.v.$errors).toEqual([])
    })

    it('stops the propagation of errors up the component chain', () => {
      const { state, validations } = simpleValidation()
      let $registerAs = 'componentC'
      const componentC = createSimpleComponent(() => useVuelidate(validations, state, { $registerAs }))
      const componentB = {
        setup: () => ({ v: useVuelidate({ $stopPropagation: true, $lazy: false }) }),
        render: () => h(componentC)
      }
      const componentA = {
        setup: () => ({ v: useVuelidate() }),
        render: () => h(componentB)
      }
      // mount the top most component
      const wrapper = mount(componentA)
      // make sure it has no errors
      expect(wrapper.vm.v.$silentErrors).toHaveLength(0)
      // make sure the child component is not registered at all
      expect(wrapper.vm.v.$getResultsForChild($registerAs)).toBeFalsy()

      // find componentB
      let componentCVueWrapper = wrapper.findComponent(componentB)
      // make sure it has errors
      expect(componentCVueWrapper.vm.v.$silentErrors).toHaveLength(1)
      // make sure that componentC is registered
      expect(componentCVueWrapper.vm.v.$getResultsForChild($registerAs)).toBeTruthy()
      // make sure that componentC has errors
      expect(wrapper.findComponent(componentC).vm.v.$silentErrors).toHaveLength(1)
    })
  })

  describe('$error', () => {
    it('returns `true` if both `$invalid` and $dirty` are true', () => {
      const number = ref(1)
      const { vm } = createSimpleWrapper({ number: { isEven } }, { number })
      expect(vm.v.$invalid).toBe(true)
      expect(vm.v.$dirty).toBe(false)
      expect(vm.v.$error).toBe(false)
      vm.v.$touch()
      expect(vm.v.$invalid).toBe(true)
      expect(vm.v.$dirty).toBe(true)
      expect(vm.v.$error).toBe(true)
    })
  })

  describe('$silentErrors', () => {
    it('constructs an array of errors for invalid properties', () => {
      const { state, validations } = nestedReactiveObjectValidation()
      const { vm } = createSimpleWrapper(validations, state)
      expect(vm.v.$silentErrors).toEqual(expect.any(Array))
      expect(vm.v.$silentErrors).toHaveLength(1)
      expect(vm.v.$silentErrors[0]).toMatchSnapshot()
    })
  })

  describe('$errors', () => {
    it('constructs an array of errors for invalid AND drity properties', () => {
      const { state, validations } = nestedReactiveObjectValidation()
      const { vm } = createSimpleWrapper(validations, state)
      vm.v.$touch()
      expect(vm.v.$errors).toEqual(expect.any(Array))
      expect(vm.v.$errors).toHaveLength(1)
      expect(vm.v.$errors[0]).toMatchSnapshot()
    })

    it('collects `$propertyPath` as of deeply nested properties', () => {
      const { state, validations } = nestedReactiveObjectValidation()
      const { vm } = createSimpleWrapper(validations, state)

      vm.v.level1.level2.child.$model = 3
      expect(vm.v.$errors.find(error => error.$propertyPath === 'level1.level2.child')).toBeTruthy()
    })

    it('keeps `$params` reactive', () => {

    })

    it('keeps `$message` reactive', () => {

    })

    it('collects child component `$errors` in the parent `$errors` array', () => {

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
      const { vm } = createSimpleWrapper(validations, state)
      expect(vm.v).toHaveProperty('$getResultsForChild')
      expect(vm.v.level0).not.toHaveProperty('$getResultsForChild')
      expect(vm.v.level1).not.toHaveProperty('$getResultsForChild')
      expect(vm.v.level1.level2).not.toHaveProperty('$getResultsForChild')
    })
  })

  describe('$pending', () => {
    it('sets `$pending` to `true`, when async validators are used and are being resolved', () => {

    })

    it('propagates `$pending` up to the top most parent', () => {

    })

    it('sets `$pending` to false, when the last async invocation resolves', () => {

    })
  })

  describe('$params', () => {
    it('collects the `$params` passed to a validator via `withParams`', () => {
      const isEvenValidator = withParams({ min: 4 }, isEven)
      const state = { number: ref(1) }
      const validations = { number: { isEvenValidator } }
      const { vm } = createSimpleWrapper(validations, state)
      vm.v.$touch()
      expect(vm.v.number.isEvenValidator).toHaveProperty('$params')
      expect(vm.v.number.isEvenValidator.$params).toHaveProperty('min', 4)
    })

    it('keeps `$params` reactive', () => {
      const min = ref(4)
      const isEvenValidator = withParams({ min }, isEven)
      const state = { number: ref(1) }
      const validations = { number: { isEvenValidator } }
      const { vm } = createSimpleWrapper(validations, state)
      vm.v.$touch()
      expect(vm.v.number.isEvenValidator.$params.min).toBe(4)
      min.value = 10
      expect(vm.v.number.isEvenValidator.$params.min).toBe(10)
    })

    it('collects plain validator response', () => {
      const isEvenValidator = withParams({ min: 4 }, (v) => ({
        $invalid: isEven(v),
        $data: { foo: 'foo' }
      }))
      const state = { number: ref(1) }
      const validations = { number: { isEvenValidator } }
      const { vm } = createSimpleWrapper(validations, state)
      vm.v.$touch()
      expect(vm.v.number.isEvenValidator.$params).toHaveProperty('$response', {
        $invalid: false,
        $data: { foo: 'foo' }
      })
    })

    it('collects async validator response', async () => {
      const isEvenValidator = withParams({ min: 4 }, withAsync((v) => Promise.resolve({
        $invalid: isEven(v),
        $data: { foo: 'foo' }
      })))
      const state = { number: ref(1) }
      const validations = { number: { isEvenValidator } }
      const { vm } = createSimpleWrapper(validations, state)
      vm.v.$touch()
      await flushPromises()
      expect(vm.v.number.isEvenValidator.$params).toHaveProperty('$response', {
        $invalid: false,
        $data: { foo: 'foo' }
      })
    })
  })

  describe('$validate', () => {
    it('returns the result of the validation', async () => {
      const { state, validations } = simpleValidation()
      const { vm } = createSimpleWrapper(validations, state)
      expect(await vm.v.$validate()).toBe(false)
    })

    it('returns a Promise<Boolean>, that resolves instantly if `$pending === false`', async () => {
      const { state, validations } = simpleValidation()
      const { vm } = createSimpleWrapper(validations, state)
      const promise = vm.v.$validate()
      expect(vm.v.$pending).toBe(false)
      await promise
      expect(vm.v.$pending).toBe(false)
    })

    it('works with `lazy: true`', async () => {
      const { state, validations } = simpleValidation()
      const { vm } = createSimpleWrapper(validations, state, { $lazy: true })
      expect(await vm.v.$validate()).toBe(false)
      state.number.value = 2
      expect(await vm.v.$validate()).toBe(true)
    })

    it('is only present at the top level', () => {
      const { state, validations } = nestedReactiveObjectValidation()
      const { vm } = createSimpleWrapper(validations, state)

      expect(vm.v).toHaveProperty('$validate', expect.any(Function))
      expect(vm.v.level0).not.toHaveProperty('$validate')
      expect(vm.v.level1).not.toHaveProperty('$validate')
      expect(vm.v.level1.level2).not.toHaveProperty('$validate')
    })
  })

  describe('$message', () => {
    it('collects the `$message` for a validator', () => {
      const v = withMessage('Field is not Even', isEven)
      const val = ref(1)
      const { vm } = createSimpleWrapper({ val: v }, { val })
      vm.v.$touch()
      expect(vm.v.$errors[0]).toHaveProperty('$message', 'Field is not Even')
    })

    it('allows `$message` to be a function', () => {
      const isEvenMessage = withMessage(() => `Field is not Even`, isEven)
      const value = ref(1)
      const { vm } = createSimpleWrapper({ value: { isEvenMessage } }, { value })
      vm.v.$touch()
      expect(vm.v.$errors[0]).toHaveProperty('$message', 'Field is not Even')
    })

    it('keeps the `$message` reactive', () => {
      const isEvenMessage = withMessage(({ $model }) => `Field is not Even, given ${$model}`, isEven)
      const value = ref(1)
      const { vm } = createSimpleWrapper({ value: { isEvenMessage } }, { value })
      vm.v.$touch()
      expect(vm.v.$errors[0]).toHaveProperty('$message', 'Field is not Even, given 1')
      value.value = 5
      expect(vm.v.$errors[0]).toHaveProperty('$message', 'Field is not Even, given 5')
    })

    it('unwraps `$params` before sending to the $message function', () => {
      const foo = ref('foo')
      const validator = withParams({ foo }, isEven)
      const isEvenMessage = withMessage(({ $params }) => `Field is not Even, param is ${$params.foo}`, validator)
      const value = ref(1)
      const { vm } = createSimpleWrapper({ value: { isEvenMessage } }, { value })
      vm.v.$touch()
      expect(vm.v.$errors[0]).toHaveProperty('$message', 'Field is not Even, param is foo')
      foo.value = 'bar'
      expect(vm.v.$errors[0]).toHaveProperty('$message', 'Field is not Even, param is bar')
    })

    it('allows passing a message from a validator response', () => {
      const validator = (v) => ({
        $invalid: isEven(v),
        $message: v === 7 ? 'I dont like 7' : null
      })
      const isEvenMessage = withMessage(({ $params, $model }) => $params?.$response?.$message || `Field is not Even, ${$model} given`, validator)
      const value = ref(1)
      const { vm } = createSimpleWrapper({ value: { isEvenMessage } }, { value })
      vm.v.$touch()
      expect(vm.v.$errors[0]).toHaveProperty('$message', 'Field is not Even, 1 given')
      value.value = 7
      expect(vm.v.$errors[0]).toHaveProperty('$message', 'I dont like 7')
    })
  })

  describe('$lazy', () => {
    it('does not call a validator, until the property is dirty', async () => {
      // TODO: This is a breaking change, big one. Better let ppl know
      const isFive = jest.fn((v) => v === 5)
      const number = ref(0)
      const { vm } = createSimpleWrapper({ number: { isFive } }, { number }, { $lazy: true })
      expect(isFive).toHaveBeenCalledTimes(0)
      number.value = 10
      expect(isFive).toHaveBeenCalledTimes(0)
      await vm.v.$validate()
      expect(isFive).toHaveBeenCalledTimes(1)
    })
  })

  describe('validators', () => {
    it('supports a validator to be a function, returning a boolean', () => {

    })

    it('supports a validator to be a function, returning an object with `$invalid` property', () => {

    })

    it('supports a validator to be an object with `$validator` function property', () => {

    })

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

    // TODO: Fix this one
    it('allows multiple invocations of an async validator, the last one to resolve, sets the return value', async () => {
      // prepare async validator
      const validator = jest.fn().mockResolvedValue(true)
      const asyncValidator = withAsync(validator)
      // prepare state
      const number = ref(0)
      const { vm } = createSimpleWrapper({ number: { asyncValidator } }, { number })
      // make sure the validator is armed
      vm.v.$touch()
      // assert its called once, for the dirty state change
      expect(validator).toHaveBeenCalledTimes(1)
      // assert there is an error state
      expect(vm.v.number.asyncValidator.$invalid).toBe(true)
      expect(vm.v.number.$invalid).toBe(true)
      // change it a few times
      number.value = 1
      number.value = 2
      validator.mockResolvedValueOnce(false)
      number.value = 3
      await flushPromises()
      expect(validator).toHaveBeenCalledTimes(4)
      // `invalid` is true, because the last invocation of the validator, is false
      expect(vm.v.number.asyncValidator.$invalid).toBe(true)
      number.value = 2
      validator.mockResolvedValueOnce(true)
      number.value = 1
      // await the last invocation to have been called
      await flushPromises()
      expect(validator).toHaveLastReturnedWith(Promise.resolve(true))
      // last call to validator returned ture, so the invalid is false
      expect(vm.v.number.asyncValidator.$invalid).toBe(false)
    })

    describe('dynamic rules', () => {
      it('allows passing a computed value as a validations object, with Refs', async () => {
        const { state, validations } = computedValidationsObjectWithRefs()
        const { number, conditional } = state
        const { vm } = createSimpleWrapper(validations, state)
        expect(vm.v.number).toHaveProperty('isOdd')
        vm.v.number.$touch()
        expect(vm.v.number.isOdd).toHaveProperty('$invalid', true)
        number.value = 3
        await vm.$nextTick()
        expect(vm.v.number.isOdd).toHaveProperty('$invalid', false)
        // make sure the conditional is above the threshold
        conditional.value = 10
        await vm.$nextTick()
        // assert it is no longer there
        expect(vm.v).not.toHaveProperty('number')
        conditional.value = 3
        await vm.$nextTick()
        expect(vm.v.number.$invalid).toBe(false)
      })

      it('allows passing a computed value as a validations object, with Reactive', () => {
        const { state, validations } = computedValidationsObjectWithReactive()
        const { vm } = createSimpleWrapper(validations, state)
        expect(vm.v.number).toHaveProperty('isOdd')
        vm.v.number.$touch()
        expect(vm.v.number.isOdd).toHaveProperty('$invalid', true)
        state.number = 3
        expect(vm.v.number.isOdd).toHaveProperty('$invalid', false)
        // make sure the conditional is above the threshold
        state.conditional = 10
        // assert it is no longer there
        expect(vm.v.number).not.toHaveProperty('number')
        state.conditional = 3
        expect(vm.v.number.$invalid).toBe(false)
      })

      it('allows passing a computed as a property validator', async () => {
        const conditional = ref(0)
        const number = ref(0)
        const numberValidation = computed(() => {
          return conditional.value > 5
            ? {}
            : { isEven }
        })
        const state = { number }
        const validations = { number: numberValidation }

        const { vm } = createSimpleWrapper(validations, state)
        shouldBePristineValidationObj(vm.v.number)
        vm.v.$touch()
        number.value = 3
        // assert the number is invalid
        await vm.$nextTick()
        shouldBeErroredValidationObject({ v: vm.v.number, property: 'number', validatorName: 'isEven' })
        // go over the condition
        conditional.value = 7
        await vm.$nextTick()
        // assert the validation passes now, and there is no more isEven validator
        expect(vm.v.number).not.toHaveProperty('isEven')
        expect(vm.v.number.$error).toBe(false)
        // return the validation back
        conditional.value = 0
        await vm.$nextTick()
        // make sure there is an error
        expect(vm.v.number.$error).toBe(true)
        // make sure it is still dirty
        expect(vm.v.number.$dirty).toBe(true)
        expect(vm.v.number.isEven.$invalid).toBe(true)
      })

      it('caches the `$dirty` state of a validator, if the validator gets removed and re-added', async () => {
        const { state, validations } = computedValidationsObjectWithRefs()
        const { number, conditional } = state
        const { vm } = createSimpleWrapper(validations, { number })
        expect(vm.v.number).toHaveProperty('$dirty', false)
        vm.v.number.$touch()
        expect(vm.v.number).toHaveProperty('$dirty', true)
        // make sure the conditional is above the threshold
        conditional.value = 10
        await vm.$nextTick()
        // assert it is no longer there
        expect(vm.v).not.toHaveProperty('number')
        conditional.value = 3
        await vm.$nextTick()
        // assert the dirty state is still there
        expect(vm.v.number.$dirty).toBe(true)
        vm.v.number.$reset()
        expect(vm.v.number.$dirty).toBe(false)
      })
    })
  })

  describe('deep changes in refs', () => {
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

  // it('should allow watching a v state', async () => {
  //   let watcherValue = null
  //   let watcherValueOld = null
  //
  //   const vm = new Vue({
  //     ...base,
  //     validations: {
  //       value: { isEven }
  //     },
  //     watch: {
  //       'v.value.$invalid' (v, oldv) {
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

  // it('should have a v key while not overriding existing computed', () => {
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
  //   expect(vm.v).toBeDefined()
  //   expect(vm.x).toBe(1)
  // })
  //
  // it('should have a v key defined if used as function', () => {
  //   const vm = new Vue({
  //     ...base,
  //     validations () {
  //       return {
  //         value: { isEven }
  //       }
  //     }
  //   })
  //   expect(vm.v).toBeDefined()
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
  //   expect(vm.v).toBeDefined()
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
  //     expect(vm.v.value.$pending).toBe(false)
  //   })
  //
  //   it('$pending should be true immediately after value change on the validator itself', () => {
  //     const { vm } = setupAsync()
  //     vm.value = 'x1'
  //     expect(vm.v.value.asyncVal.$pending).toBe(true)
  //   })
  //
  //   it('$pending should cascade to state property', async () => {
  //     const { vm } = setupAsync()
  //     vm.value = 'x1'
  //     expect(vm.v.value.$pending).toBe(true)
  //   })
  //
  //   it('$pending should cascade to root v', () => {
  //     const { vm } = setupAsync()
  //     vm.value = 'x1'
  //     expect(vm.v.$pending).toBe(true)
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
  //     expect(vm.v.value.$pending).toBe(false)
  //   })
  //
  //   it('asyncVal value should be false just after value change', () => {
  //     const { vm } = setupAsync()
  //     vm.value = 'x1'
  //     expect(vm.v.value.asyncVal).toBe(false)
  //   })
  //
  //   it('asyncVal value should be true after promise resolve', (done) => {
  //     const { resolvePromise, vm } = setupAsync()
  //     vm.value = 'x1'
  //     vm.v.value.asyncVal // execute getter
  //     resolvePromise.resolve(true)
  //     Promise.resolve().then(() => {
  //       expect(vm.v.value.asyncVal).toBe(true)
  //       done()
  //     })
  //   })
  //
  //   it('asyncVal value should be false after promise reject', (done) => {
  //     const { resolvePromise, vm } = setupAsync()
  //     vm.value = 'x1'
  //     vm.v.value.asyncVal // execute getter
  //     resolvePromise.reject(new Error('test reject'))
  //     Promise.resolve().then(() => {
  //       expect(vm.v.value.asyncVal).toBe(false)
  //       done()
  //     })
  //   })
  // })
  //
  // describe('v.value.$dirty', () => {
  //   it('should have a $dirty set to false on initialization', () => {
  //     const vm = new Vue({
  //       ...base,
  //       validations: {
  //         value: { isEven }
  //       }
  //     })
  //     expect(vm.v.value.$dirty).toBe(false)
  //   })
  //
  //   it('should have a $anyDirty set to false on initialization', () => {
  //     const vm = new Vue({
  //       ...base,
  //       validations: {
  //         value: { isEven }
  //       }
  //     })
  //     expect(vm.v.value.$anyDirty).toBe(false)
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
  //     vm.v.value.$touch()
  //     vm.out = true
  //     expect(vm.v.value.$dirty).toBe(true)
  //     expect(vm.v.value2.$dirty).toBe(false)
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
  //     vm.v.value.$touch()
  //     vm.out = true
  //     expect(vm.v.value.$anyDirty).toBe(true)
  //     expect(vm.v.value2.$anyDirty).toBe(false)
  //   })
  //
  //   it('should have a $error set to false on initialization', () => {
  //     const vm = new Vue({
  //       ...base,
  //       validations: {
  //         value: { isEven }
  //       }
  //     })
  //     expect(vm.v.value.$error).toBe(false)
  //   })
  //   it('should have a $anyError set to false on initialization', () => {
  //     const vm = new Vue({
  //       ...base,
  //       validations: {
  //         value: { isEven }
  //       }
  //     })
  //     expect(vm.v.value.$anyError).toBe(false)
  //   })
  //   it('should have a $error false on dirty valid', () => {
  //     const vm = new Vue({
  //       ...base,
  //       validations: {
  //         value: { isEven }
  //       }
  //     })
  //     vm.v.value.$touch()
  //     expect(vm.v.value.$error).toBe(false)
  //   })
  //   it('should have a $anyError false on dirty valid', () => {
  //     const vm = new Vue({
  //       ...base,
  //       validations: {
  //         value: { isEven }
  //       }
  //     })
  //     vm.v.value.$touch()
  //     expect(vm.v.value.$anyError).toBe(false)
  //   })
  //   it('should have a $error true on dirty invalid', () => {
  //     const vm = new Vue({
  //       ...base,
  //       validations: {
  //         value: { isOdd }
  //       }
  //     })
  //     vm.v.value.$touch()
  //     expect(vm.v.value.$error).toBe(true)
  //   })
  //   it('should have a $anyError true on dirty invalid', () => {
  //     const vm = new Vue({
  //       ...base,
  //       validations: {
  //         value: { isOdd }
  //       }
  //     })
  //     vm.v.value.$touch()
  //     expect(vm.v.value.$anyError).toBe(true)
  //   })
  //   it('should have a $error false on clean invalid', () => {
  //     const vm = new Vue({
  //       ...base,
  //       validations: {
  //         value: { isOdd }
  //       }
  //     })
  //     expect(vm.v.value.$error).toBe(false)
  //   })
  //   it('should have a $dirty set to true after $touch', () => {
  //     const vm = new Vue({
  //       ...base,
  //       validations: {
  //         value: { isEven }
  //       }
  //     })
  //     vm.v.value.$touch()
  //     expect(vm.v.value.$dirty).toBe(true)
  //   })
  //   it('should have a $anyDirty set to true after $touch', () => {
  //     const vm = new Vue({
  //       ...base,
  //       validations: {
  //         value: { isEven }
  //       }
  //     })
  //     vm.v.value.$touch()
  //     expect(vm.v.value.$anyDirty).toBe(true)
  //   })
  //   it('should have a $dirty set to false after $reset', () => {
  //     const vm = new Vue({
  //       ...base,
  //       validations: {
  //         value: { isEven }
  //       }
  //     })
  //     vm.v.value.$touch()
  //     vm.v.value.$reset()
  //     expect(vm.v.value.$dirty).toBe(false)
  //   })
  //   it('should have a $anyDirty set to false after $reset', () => {
  //     const vm = new Vue({
  //       ...base,
  //       validations: {
  //         value: { isEven }
  //       }
  //     })
  //     vm.v.value.$touch()
  //     vm.v.value.$reset()
  //     expect(vm.v.value.$anyDirty).toBe(false)
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
  //       expect(vm.v.nested.$dirty).toBe(false)
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
  //       vm.v.nested.value1.$touch()
  //       expect(vm.v.nested.$dirty).toBe(false)
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
  //       vm.v.nested.value1.$touch()
  //       expect(vm.v.nested.$anyDirty).toBe(true)
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
  //       vm.v.nested.value1.$touch()
  //       vm.v.nested.value2.$touch()
  //       expect(vm.v.nested.$dirty).toBe(true)
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
  //       vm.v.nested.value1.$touch()
  //       vm.v.nested.value2.$touch()
  //       expect(vm.v.nested.$dirty).toBe(true)
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
  //       vm.v.nested.value1.$touch()
  //       vm.v.nested.value2.$touch()
  //       expect(vm.v.nested.$anyDirty).toBe(true)
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
  //       vm.v.nested.value1.$touch()
  //       expect(vm.v.nested.$error).toBe(false)
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
  //       vm.v.nested.value1.$touch()
  //       expect(vm.v.nested.$anyError).toBe(true)
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
  //       vm.v.nested.value1.$touch()
  //       vm.v.nested.$reset()
  //       expect(vm.v.nested.value1.$dirty).toBe(false)
  //       expect(vm.v.nested.value2.$dirty).toBe(false)
  //       expect(vm.v.nested.value1.$anyDirty).toBe(false)
  //       expect(vm.v.nested.value2.$anyDirty).toBe(false)
  //     })
  //   })
  // })
  //
  // describe('v.value', () => {
  //   describe('when validations pass', () => {
  //     it('should have $invalid value set to false', () => {
  //       const vm = new Vue({
  //         ...base,
  //         validations: {
  //           value: { isEven }
  //         }
  //       })
  //       expect(vm.v.value.$invalid).toBe(false)
  //     })
  //     it('should have validator name value set to true', () => {
  //       const vm = new Vue({
  //         ...base,
  //         validations: {
  //           value: { isEven }
  //         }
  //       })
  //       expect(vm.v.value.isEven).toBe(true)
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
  //       expect(vm.v.value.$invalid).toBe(true)
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
  //       expect(vm.v.value.isEven).toBe(false)
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
  //       expect(vm.v.value.$invalid).toBe(true)
  //       expect(vm.v.value.isEven).toBe(true)
  //       expect(vm.v.value.isOdd).toBe(false)
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
  //     expect(vm.v.nested.value3.$invalid).toBe(false)
  //     expect(vm.v.nested.value4.$invalid).toBe(true)
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
  //     expect(vm.v.nested.$invalid).toBe(true)
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
  //     expect(vm.v.nested.$invalid).toBe(false)
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
  //     expect(vm.v.group.$invalid).toBe(true)
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
  //     expect(vm.v.group['nested.value3'].$invalid).toBe(false)
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
  //     expect(vm.v.group.$invalid).toBe(true)
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
  //     expect(vm.v.group.$invalid).toBe(false)
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
  //     expect(vm.v.group['abc.def.ghi']).toBe(false)
  //     expect(vm.v.group.$invalid).toBe(true)
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
  //     expect(vm.v.list.$invalid).toBe(true)
  //     vm.list = undefined
  //     expect(vm.v.list.$invalid).toBe(false)
  //     vm.list = null
  //     expect(vm.v.list.$invalid).toBe(false)
  //     vm.list = false
  //     expect(vm.v.list.$invalid).toBe(false)
  //     vm.list = ''
  //     expect(vm.v.list.$invalid).toBe(false)
  //     vm.list = 1
  //     expect(vm.v.list.$invalid).toBe(false)
  //     vm.list = function () {}
  //     expect(vm.v.list.$invalid).toBe(false)
  //     vm.list = [{ value: 2 }]
  //     expect(vm.v.list.$invalid).toBe(false)
  //     expect(vm.v.list.$each[0]).toBeDefined()
  //     expect(vm.v.list.$each[1]).toBeFalsy()
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
  //     expect(vm.v.obj.$invalid).toBe(true)
  //     vm.obj = null
  //     expect(vm.v.obj.$invalid).toBe(true)
  //     vm.obj = false
  //     expect(vm.v.obj.$invalid).toBe(true)
  //     vm.obj = 1
  //     expect(vm.v.obj.$invalid).toBe(true)
  //     vm.obj = 'string'
  //     expect(vm.v.obj.$invalid).toBe(true)
  //     vm.obj = function () {}
  //     expect(vm.v.obj.$invalid).toBe(true)
  //     vm.obj = []
  //     expect(vm.v.obj.$invalid).toBe(true)
  //     vm.obj = {}
  //     expect(vm.v.obj.$invalid).toBe(true)
  //     vm.obj = { value: 1 }
  //     expect(vm.v.obj.$invalid).toBe(false)
  //   })
  //   it('should create validators for list items', () => {
  //     const vm = new Vue(vmDef(isEven))
  //     expect(vm.v.list.$each[0]).toBeDefined()
  //     expect(vm.v.list.$each[1]).toBeDefined()
  //     expect(vm.v.list.$each[2]).toBeFalsy()
  //   })
  //   it('should validate all items in list', () => {
  //     const vm = new Vue(vmDef(isEven))
  //     expect(vm.v.list.$each[0].$invalid).toBe(true)
  //     expect(vm.v.list.$each[1].$invalid).toBe(false)
  //   })
  //   it('should be $invalid when some elements are invalid', () => {
  //     const vm = new Vue(vmDef(isEven))
  //     expect(vm.v.list.$invalid).toBe(true)
  //   })
  //   it('should not be $invalid when all elements are valid', () => {
  //     const vm = new Vue(vmDef(T))
  //     expect(vm.v.list.$invalid).toBe(false)
  //   })
  //   it('should track additions and validate immediately', () => {
  //     const vm = new Vue(vmDef(isEven))
  //     vm.list.push({ value: 3 })
  //     vm.list.push({ value: 4 })
  //     expect(vm.v.list.$each[0]).toBeDefined()
  //     expect(vm.v.list.$each[1]).toBeDefined()
  //     expect(vm.v.list.$each[2]).toBeDefined()
  //     expect(vm.v.list.$each[3]).toBeDefined()
  //     expect(vm.v.list.$each[4]).toBeFalsy()
  //     expect(vm.v.list.$each[0].$invalid).toBe(true)
  //     expect(vm.v.list.$each[1].$invalid).toBe(false)
  //     expect(vm.v.list.$each[2].$invalid).toBe(true)
  //     expect(vm.v.list.$each[3].$invalid).toBe(false)
  //   })
  //   it('should not loose $dirty after insertion based by index', () => {
  //     const vm = new Vue(vmDef(isEven))
  //     vm.v.list.$each[0].$touch()
  //     vm.list.unshift({ value: 0 })
  //     expect(vm.v.list.$each[0].$dirty).toBe(true)
  //     expect(vm.v.list.$each[1].$dirty).toBe(false)
  //     expect(vm.v.list.$each[2].$dirty).toBe(false)
  //   })
  //   it('should not loose $dirty after insertion based by $trackBy', () => {
  //     const vm = new Vue(vmDef(isEven, 'value'))
  //     vm.v.list.$each[0].$touch()
  //     vm.list.unshift({ value: 0 })
  //     expect(vm.v.list.$each[0].$dirty).toBe(false)
  //     expect(vm.v.list.$each[1].$dirty).toBe(true)
  //   })
  //   it('should share validators when $trackBy overlap', () => {
  //     const vm = new Vue(vmDef(isEven, 'value'))
  //     vm.list.unshift({ value: 1 })
  //     expect(vm.v.list.$each[0]).toBe(vm.v.list.$each[1])
  //     expect(vm.v.list.$each[0].$dirty).toBe(false)
  //   })
  //   it('should share validators when functional $trackBy overlap', () => {
  //     const vm = new Vue(vmDef(isEven, (x) => x.value))
  //     vm.list.unshift({ value: 1 })
  //     expect(vm.v.list.$each[0]).toBe(vm.v.list.$each[1])
  //     expect(vm.v.list.$each[0].$dirty).toBe(false)
  //   })
  //   it('should share validators when $trackBy overlap after initial get', () => {
  //     const vm = new Vue(vmDef(isEven, 'value'))
  //     vm.v.list.$each[0].$touch()
  //     vm.list.unshift({ value: 1 })
  //     expect(vm.v.list.$each[0]).toBe(vm.v.list.$each[1])
  //     expect(vm.v.list.$each[0].$dirty).toBe(true)
  //   })
  //
  //   it('should allow deleting first child', () => {
  //     const vm = new Vue(vmDef(isEven, 'value'))
  //     expect(vm.v.list.$each[0].$invalid).toBe(true)
  //     vm.list.shift()
  //     expect(vm.v.list.$each[0].$invalid).toBe(false)
  //   })
  //   it('should allow deleting last child', () => {
  //     const vm = new Vue(vmDef(isEven, 'value'))
  //     expect(vm.v.list.$each[1].$invalid).toBe(false)
  //     vm.list.pop()
  //     expect(vm.v.list.$each[1]).toBeFalsy()
  //   })
  //   it('should allow swapping children', () => {
  //     const vm = new Vue(vmDef(isEven, 'value'))
  //     expect(vm.v.list.$each[0].$invalid).toBe(true)
  //     expect(vm.v.list.$each[1].$invalid).toBe(false)
  //     vm.list[0].value = 2
  //     vm.list[1].value = 1
  //     expect(vm.v.list.$each[0].$invalid).toBe(false)
  //     expect(vm.v.list.$each[1].$invalid).toBe(true)
  //   })
  //   it('should allow reordering with insertion children', () => {
  //     const vm = new Vue(vmDef(isEven, 'value'))
  //     vm.list.push({ value: 3 }, { value: 4 }, { value: 5 })
  //     expect(vm.v.list.$each[0].$invalid).toBe(true)
  //     expect(vm.v.list.$each[4].$invalid).toBe(true)
  //     vm.list[0].value = 1
  //     vm.list[1].value = 5
  //     vm.list[2].value = 6
  //     vm.list[3].value = 2
  //     vm.list[4].value = 4
  //     expect(vm.v.list.$each[0].$invalid).toBe(true)
  //     expect(vm.v.list.$each[4].$invalid).toBe(false)
  //     expect(vm.v.list.$each[2].$invalid).toBe(false)
  //   })
  //   it('should allow reordering with different beginning and ending', () => {
  //     const vm = new Vue(vmDef(isEven, 'value'))
  //     vm.list.push({ value: 3 }, { value: 4 }, { value: 5 }, { value: 6 })
  //     vm.v.list.$each[0]
  //     vm.list[0].value = 5
  //     vm.list[1].value = 6
  //     vm.list[2].value = 2
  //     vm.list[3].value = 1
  //     vm.list[4].value = 4
  //     expect(vm.v.list.$each[0].$invalid).toBe(true)
  //     expect(vm.v.list.$each[1].$invalid).toBe(false)
  //     expect(vm.v.list.$each[2].$invalid).toBe(false)
  //     expect(vm.v.list.$each[3].$invalid).toBe(true)
  //     expect(vm.v.list.$each[4].$invalid).toBe(false)
  //   })
  //   it('should have $iter key that iteates only over provided keys', () => {
  //     const vm = new Vue(vmDef(isEven, 'value'))
  //     expect(Object.keys(vm.v.list.$each.$iter)).toEqual(['0', '1'])
  //     expect(vm.v.list.$each.$iter[0]).toEqual(vm.v.list.$each[0])
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
  //     expect(vm.v.list.$each[0].$invalid).toBe(true)
  //     expect(vm.v.list.$each[1].$invalid).toBe(false)
  //     expect(vm.v.list.$each[2].$invalid).toBe(true)
  //   })
  //
  //   it('should not loose $dirty after insertion based by index', () => {
  //     const vm = new Vue(vmDef(isEven))
  //     vm.v.list.$each[0].$touch()
  //     vm.list.unshift(5)
  //     expect(vm.v.list.$each[0].$dirty).toBe(true)
  //     expect(vm.v.list.$each[1].$dirty).toBe(false)
  //     expect(vm.v.list.$each[2].$dirty).toBe(false)
  //   })
  //
  //   it('should not leak indirect watcher on destroy', () => {
  //     const vm = new Vue(vmDef(isEven))
  //     expect(vm.v.list.$each[0].$invalid).toBe(true)
  //     vm.$destroy()
  //     // FIXME: how to test against memory leak?
  //     // Now this just covers the teardown code in the report.
  //   })
  //
  //   it('should not leak indirect watcher on destroy', () => {
  //     const spy = sinon.spy(isEven)
  //     const vm = new Vue(vmDef(spy))
  //     expect(vm.v.list.$each[0].$invalid).toBe(true)
  //     expect(spy).to.have.been.calledWith(1, vm.list)
  //   })
  //
  //   it('should pass collection as second argument to validators', () => {
  //     const spy = sinon.spy(isEven)
  //     const vm = new Vue(vmDef(spy))
  //     expect(vm.v.list.$each[0].$invalid).toBe(true)
  //     expect(spy).to.have.been.calledWith(1, vm.list)
  //   })
  //
  //   it('should revalidate only changed items', () => {
  //     const spy = sinon.spy(isEven)
  //     const vm = new Vue(vmDef(spy))
  //
  //     expect(vm.v.list.$each[0].$invalid).toBe(true)
  //     expect(vm.v.list.$each[1].$invalid).toBe(false)
  //     expect(vm.v.list.$each[2].$invalid).toBe(true)
  //
  //     expect(spy).to.have.been.calledWith(1)
  //     expect(spy).to.have.been.calledWith(2)
  //     expect(spy).to.have.been.calledWith(3)
  //     expect(spy).to.have.been.calledThrice
  //     spy.resetHistory()
  //
  //     vm.$set(vm.list, 1, 15)
  //     expect(vm.v.list.$each[0].$invalid).toBe(true)
  //     expect(vm.v.list.$each[1].$invalid).toBe(true)
  //     expect(vm.v.list.$each[2].$invalid).toBe(true)
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
  //     expect(vm.v.list.$each[0].$invalid).toBe(false)
  //     expect(vm.v.list.$each[1].$invalid).toBe(false)
  //     expect(vm.v.list.$each[2].$invalid).toBe(false)
  //     expect(spy).to.have.been.calledThrice
  //     spy.resetHistory()
  //
  //     vm.external = false
  //     expect(vm.v.list.$each[0].$invalid).toBe(true)
  //     expect(vm.v.list.$each[1].$invalid).toBe(true)
  //     expect(vm.v.list.$each[2].$invalid).toBe(false)
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
  //     expect(vm.v.value.$params.isOdd).toBeNull()
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
  //     expect(vm.v.value.$params.fn).toEqual({ type: 'alwaysTrue' })
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
  //     expect(vm.v.$params.value).toEqual({ test: true })
  //     expect(vm.v.value.$params).toEqual({ T: null })
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
  //     expect(vm.v.nested.$params).toEqual({ value3: null, value4: null })
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
  //     expect(vm.v.value.$params.combo).toEqual({
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
  //     expect(vm.v.value.$params.comboDirect).toEqual({
  //       $sub: [{ type: 'alwaysTrue' }, { type: 'alwaysFalse' }]
  //     })
  //   })
  // })
  //
  // describe('v.$flattenParams', () => {
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
  //     expect(vm.v.$flattenParams().length).toBe(1)
  //   })
  //
  //   it('should return validator params', () => {
  //     expect(vm.v.$flattenParams()).toEqual([
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
  //       expect(vm.v.$flattenParams()).toHaveLength(0)
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
  //       expect(vm.v.first.foo.$flattenParams()).toEqual([
  //         { path: [], name: 'isEven', params: { type: 'isEven' } }
  //       ])
  //     })
  //
  //     it('should return params of all leaves', () => {
  //       expect(vm.v.first.$flattenParams()).toEqual([
  //         { path: ['foo'], name: 'isEven', params: { type: 'isEven' } },
  //         { path: ['bar'], name: 'isEven', params: { type: 'isEven' } }
  //       ])
  //     })
  //
  //     it('should flatten results from all children', () => {
  //       expect(vm.v.$flattenParams()).toEqual([
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
  //     expect(vm.v.$model).toBeNull()
  //   })
  //
  //   it('should give null for validation group', () => {
  //     const vm = new Vue(nested)
  //     expect(vm.v.group.$model).toBeNull()
  //   })
  //
  //   it('should give original model reference for simple object', () => {
  //     const vm = new Vue(simple)
  //     expect(vm.v.value.$model).toBe(4)
  //   })
  //
  //   it('should do nothing when setting root model', () => {
  //     const vm = new Vue(simple)
  //     vm.v.$model = 'x'
  //     expect(vm.v.$model).toBeNull()
  //     expect(vm.v.$dirty).toBe(false)
  //   })
  //
  //   it('should do nothing when setting validation group model', () => {
  //     const vm = new Vue(nested)
  //     vm.v.group.$model = 'x'
  //     expect(vm.v.group.$model).toBeNull()
  //     expect(vm.v.group.$dirty).toBe(false)
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
  //     expect(vm.v.nested.$model).toBe(expected)
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
  //     expect(vm.v.nested.value1.$model).toBe(expected.value1)
  //     expect(vm.v.nested.value2.$model).toBe(expected.value2)
  //   })
  //
  //   it('should set $dirty on write for simple object', () => {
  //     const vm = new Vue(simple)
  //     vm.v.value.$model = 5
  //     expect(vm.v.value.$dirty).toBe(true)
  //   })
  //
  //   it('should set $dirty on write for nested object', () => {
  //     const vm = new Vue(nested)
  //     const expected = {
  //       value1: 'hello',
  //       value2: 'world'
  //     }
  //     vm.v.nested.$model = expected
  //
  //     expect(vm.v.nested.$dirty).toBe(true)
  //     expect(vm.v.nested.value1.$dirty).toBe(true)
  //     expect(vm.v.nested.value2.$dirty).toBe(true)
  //   })
  //
  //   it('should not be present on $each', () => {
  //     const vm = new Vue(each)
  //     expect(vm.v.array.$each.$model).toBeUndefined()
  //   })
  //
  //   it('should reference array with defined $each', () => {
  //     const vm = new Vue(each)
  //     expect(vm.v.array.$model).toBe(vm.array)
  //   })
  //
  //   it('should allow reading model on $each fields', () => {
  //     const vm = new Vue(each)
  //     expect(vm.v.array.$each[0].$model).toBe(vm.array[0])
  //   })
  //
  //   it('should allow writing model on $each fields', () => {
  //     const vm = new Vue(each)
  //     vm.v.array.$each[0].$model = 5
  //     expect(vm.array[0]).toBe(5)
  //   })
  //
  //   it('should set $dirty on write through $each field', () => {
  //     const vm = new Vue(each)
  //     vm.v.array.$each[0].$model = 5
  //     expect(vm.v.array.$each[0].$dirty).toBe(true)
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
