import { h, toRefs, isReactive } from 'vue'
import { mount } from '@vue/test-utils'
import { useVuelidate } from '../../src'

export const createSimpleComponent = (getVuelidateResults, state) => ({
  name: 'childComp',
  setup () {
    const v = getVuelidateResults()

    return {
      v,
      // spread the state so we have access to it
      ...(isReactive(state) ? toRefs(state) : state)
    }
  },
  render () {
    return h('pre', {}, JSON.stringify(this.v))
  }
})

export const createSimpleWrapper = (rules, state) => mount(createSimpleComponent(() => useVuelidate(rules, state), state))

export const shouldBePristineValidationObj = (v) => {
  expect(v).toHaveProperty('$error', false)
  expect(v).toHaveProperty('$errors', [])
  expect(v).toHaveProperty('$invalid', false)
  expect(v).toHaveProperty('$pending', false)
  expect(v).toHaveProperty('$dirty', false)
  expect(v).toHaveProperty('$anyDirty', false)
  expect(v).toHaveProperty('$touch', expect.any(Function))
  expect(v).toHaveProperty('$reset', expect.any(Function))
}

export const shouldBeInvalidValidationObject = ({ v, property, propertyPath = property, validatorName }) => {
  expect(v).toHaveProperty('$error', true)
  expect(v).toHaveProperty('$errors', [{
    $message: '',
    $params: {},
    $pending: false,
    $property: property,
    $propertyPath: propertyPath,
    $validator: validatorName
  }])
  expect(v).toHaveProperty('$invalid', true)
  expect(v).toHaveProperty('$pending', false)
  expect(v).toHaveProperty('$dirty', true)
  expect(v).toHaveProperty('$anyDirty', true)
  expect(v).toHaveProperty('$touch', expect.any(Function))
  expect(v).toHaveProperty('$reset', expect.any(Function))
}
