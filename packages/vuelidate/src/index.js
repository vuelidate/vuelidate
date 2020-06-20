import { provide, inject, ref, computed } from 'vue'
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
export function useVuelidate (validations, state, registerAs) {
  const resultsStorage = new Map()

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

  const validationResults = computed(() => setValidations({
    validations: unwrap(validations),
    state,
    childResults,
    resultsStorage
  }))

  if (registerAs) {
    injectToParent(validationResults, registerAs)
  }

  if (registerAs && childResultsKeys.value.length) {
    return computed(() => ({
      ...validationResults.value,
      ...childResults
    }))
  } else {
    return validationResults
  }
}

/**
 * Vuelidate mixin, used to attach Vuelidate only to specified components
 * Relies on `validations` option to be defined on component instance
 * @type {ComponentOptions}
 */

export const VuelidateMixin = {
  beforeCreate () {
    const resultsStorage = new Map()
    const options = this.$options
    if (!options.validations) return

    if (!options.computed) options.computed = {}
    if (options.computed.$v) return

    const validations = computed(() => isFunction(options.validations)
      ? options.validations.call(this)
      : options.validations
    )
    let $v

    options.computed.$v = function () {
      if ($v) {
        return $v.value
      } else {
        $v = computed(() => setValidations({ validations, state: this, resultsStorage }))
        return $v.value
      }
    }
  }
}

/**
 * Default way to install Vuelidate globally for entire app.
 * @param {Vue} app
 */
export function VuelidatePlugin (app) {
  app.mixin(VuelidateMixin)
}

export default useVuelidate
