import { h, nextTick } from 'vue-demi'
import { useVuelidate } from '../../src'
import { mount } from './test-utils'

export const createSimpleComponent = (getVuelidateResults, state) => ({
  name: 'childComp',
  setup () {
    const v = getVuelidateResults()

    return {
      v,
      // spread the state so we have access to it
      state
    }
  },
  render () {
    return h('pre', {}, JSON.stringify(this.v))
  }
})

export const createOldApiSimpleComponent = (validations, state, validationsConfig) => ({
  name: 'childComp',
  validations,
  validationsConfig,
  setup () {
    return { v: useVuelidate() }
  },
  data () {
    return state
  },
  render () {
    return h('pre', {}, JSON.stringify(this.v))
  }
})

export async function createSimpleWrapper (rules, state, config = {}) {
  const wrapper = mount(createSimpleComponent(() => useVuelidate(rules, state, config), state))
  await nextTick()
  return wrapper
}

export async function createOldApiSimpleWrapper (rules, state, config = {}) {
  const wrapper = mount(createOldApiSimpleComponent(rules, state, config))
  await nextTick()
  return wrapper
}

export const shouldBePristineValidationObj = (v) => {
  expect(v).toHaveProperty('$error', false)
  expect(v).toHaveProperty('$errors', [])
  expect(v).toHaveProperty('$silentErrors', [])
  expect(v).toHaveProperty('$invalid', false)
  expect(v).toHaveProperty('$pending', false)
  expect(v).toHaveProperty('$dirty', false)
  expect(v).toHaveProperty('$anyDirty', false)
  expect(v).toHaveProperty('$touch', expect.any(Function))
  expect(v).toHaveProperty('$reset', expect.any(Function))
}

export const shouldBeValidValidationObj = (v) => {
  expect(v).toHaveProperty('$error', false)
  expect(v).toHaveProperty('$errors', [])
  expect(v).toHaveProperty('$silentErrors', [])
  expect(v).toHaveProperty('$invalid', false)
  expect(v).toHaveProperty('$pending', false)
}

export function buildErrorObject (property, propertyPath, validatorName) {
  return {
    $message: '',
    $params: {},
    $pending: false,
    $property: property,
    $propertyPath: propertyPath,
    $validator: validatorName,
    $response: false,
    $uid: `${propertyPath}-${validatorName}`
  }
}

export const shouldBeInvalidValidationObject = ({ v, property, propertyPath = property, validatorName }) => {
  expect(v).toHaveProperty('$error', false)
  expect(v).toHaveProperty('$errors', [])
  expect(v).toHaveProperty('$silentErrors', [buildErrorObject(property, propertyPath, validatorName)])
  expect(v).toHaveProperty('$invalid', true)
  expect(v).toHaveProperty('$pending', false)
  expect(v).toHaveProperty('$dirty', false)
  expect(v).toHaveProperty('$anyDirty', false)
  expect(v).toHaveProperty('$touch', expect.any(Function))
  expect(v).toHaveProperty('$reset', expect.any(Function))
}

export const shouldBeErroredValidationObject = ({ v, property, propertyPath = property, validatorName }) => {
  expect(v).toHaveProperty('$error', true)
  expect(v).toHaveProperty('$errors', [buildErrorObject(property, propertyPath, validatorName)])
  expect(v).toHaveProperty('$silentErrors', [buildErrorObject(property, propertyPath, validatorName)])
  expect(v).toHaveProperty('$invalid', true)
  expect(v).toHaveProperty('$pending', false)
  expect(v).toHaveProperty('$dirty', true)
  expect(v).toHaveProperty('$anyDirty', true)
  expect(v).toHaveProperty('$touch', expect.any(Function))
  expect(v).toHaveProperty('$reset', expect.any(Function))
}

export function asyncTimeout (time) {
  return new Promise((resolve) => {
    setTimeout(resolve, time)
  })
}
