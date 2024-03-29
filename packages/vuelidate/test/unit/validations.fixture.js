import { computed, h, ref, reactive } from 'vue-demi'
import { asyncIsEven, isEven, isOdd } from './validators.fixture'
import { createSimpleComponent } from './utils'
import { useVuelidate } from '../../src'
import withAsync from '../../../validators/src/utils/withAsync'

export function nestedReactiveObjectValidation () {
  const state = reactive({
    level0: 0,
    level1: {
      child: 1,
      level2: {
        child: 2
      }
    }
  })
  const validations = {
    level0: { isEven },
    level1: {
      child: { isEven },
      level2: {
        child: { isEven }
      }
    }
  }
  return { state, validations }
}

export function nestedRefObjectValidation () {
  const state = ref({
    level0: 0,
    level1: {
      child: 1,
      level2: {
        child: 2
      }
    }
  })

  const validations = {
    level0: { isEven, $autoDirty: true },
    level1: {
      $autoDirty: true,
      child: { isEven, $autoDirty: true },
      level2: {
        $autoDirty: true,
        child: { isEven, $autoDirty: true }
      }
    }
  }
  return { state, validations }
}

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
      ? { number: {} }
      : { number: { isOdd } }
  })
  return {
    state,
    validations
  }
}

export function nestedComponentValidation ({ state: origState, validations: origValidations, parentScope, childScope } = {}) {
  const state = origState || { number: ref(1) }
  const validations = origValidations || { number: { isEven, $autoDirty: true } }
  const childValidationRegisterName = 'child-validation'

  const ChildComponent = createSimpleComponent(() =>
    useVuelidate(validations, state, { $registerAs: childValidationRegisterName, $scope: childScope })
  )

  const parent = {
    name: 'ParentWithChildForm',
    setup () {
      const v = useVuelidate({ $scope: parentScope })
      const shouldRenderChild = ref(true)
      return {
        v,
        shouldRenderChild
      }
    },
    render () {
      return this.shouldRenderChild ? h(ChildComponent) : false
    }
  }

  return {
    state,
    validations,
    parent,
    ChildComponent,
    childValidationRegisterName
  }
}

export function simpleValidation () {
  const state = { number: ref(1) }
  const validations = { number: { isEven } }
  return { state, validations }
}

export function asyncValidation () {
  const state = { number: ref(1) }
  const validations = { number: { asyncIsEven } }
  return { state, validations }
}

export function simpleErrorValidation () {
  const errorObject = new Error('message')
  const state = { withPromise: ref(1), noPromise: ref(1) }
  const asyncValidator = withAsync(() => Promise.reject(errorObject))

  function syncValidator () {
    throw errorObject
  }

  const validations = {
    withPromise: {
      asyncValidator
    },
    noPromise: {
      syncValidator
    },
    combined: {
      syncValidator, asyncValidator
    }
  }
  return { state, validations, errorObject }
}
