import { computed, h, ref, reactive } from 'vue'
import { isEven, isOdd } from './validators.fixture'
import { createSimpleComponent } from './utils'
import { useVuelidate } from '../../src'

export function computedValidationsObjectWithRefs () {
  const conditional = ref(0)
  const number = ref(0)
  const validations = computed(() => {
    return conditional.value > 5
      ? {}
      : { number: { isOdd } }
  })
  return {
    state: {
      number, conditional
    },
    validations
  }
}

export function computedValidationsObjectWithReactive () {
  const state = reactive({
    conditional: 0,
    number: 0
  })
  const validations = computed(() => {
    return state.conditional > 5
      ? {}
      : { number: { isOdd } }
  })
  return {
    state,
    validations
  }
}

export function nestedComponentValidation ({ state: origState, validations: origValidations } = {}) {
  const state = origState || { number: ref(1) }
  const validations = origValidations || { number: { isEven, $autoDirty: true } }
  const childValidationRegisterName = 'child-validation'

  const ChildComponent = createSimpleComponent(() =>
    useVuelidate(validations, state, childValidationRegisterName)
  )

  const parent = {
    name: 'ParentWithChildForm',
    setup () {
      const $v = useVuelidate()

      return {
        $v
      }
    },
    render () {
      return h(ChildComponent)
    }
  }

  return {
    state,
    validations,
    parent,
    childValidationRegisterName
  }
}
