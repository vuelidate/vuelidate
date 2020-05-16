import { toRefs, provide, inject, ref, computed, reactive, getCurrentInstance, onBeforeMount } from 'vue'
import { unwrap, isFunction } from './utils'
import { setValidations } from './core'

const VuelidateSymbol = Symbol('vuelidate')

/**
 * Composition API compatible Vuelidate
 * Use inside the `setup` lifecycle hook
 * @param {Object} validationsArg - Validations Object
 * @param {Object} state - State object
 * @param {String} registerAs
 * @return {UnwrapRef<*>}
 */
export default function useVuelidate (validationsArg, state, registerAs) {
  const validations = unwrap(validationsArg)

  const childResultsRaw = {}
  const childResultsKeys = ref([])
  const childResults = computed(() => childResultsKeys.value.reduce((results, key) => {
    results[key] = childResultsRaw[key]
    return results
  }, {}))
  const injectToParent = inject(VuelidateSymbol, () => {})
  provide(VuelidateSymbol, injectChildResults)

  function injectChildResults (results, key) {
    childResultsRaw[key] = results
    childResultsKeys.value.push(key)
  }

  const validationResults = setValidations({
    validations,
    state,
    childResults
  })

  if (registerAs) {
    injectToParent(validationResults, registerAs)
  }

  if (registerAs && childResultsKeys.value.length) {
    return reactive({
      ...validationResults,
      ...childResults
    })
  } else {
    return validationResults
  }
}

/**
 * Use old Options API syntax to get the validation Rules and State
 */
export function useVuelidateOptions () {
  const vm = getCurrentInstance()
  const options = vm.type
  const validations = isFunction(options.validations)
    ? options.validations.call(vm)
    : options.validations

  let isComponentDataAvailable = ref(false)

  onBeforeMount(() => {
    isComponentDataAvailable.value = true
  })

  const v$ = computed(() => {
    return isComponentDataAvailable.value
      ? useVuelidate(validations, { ...toRefs(vm.data), ...vm.renderContext })
      : {}
  })

  return reactive(v$)
}
