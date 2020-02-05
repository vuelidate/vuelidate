import { provide, inject, ref, computed } from '@vue/composition-api'
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
    injectToParent(results, key)
  }

  const validationResults = setValidations({
    validations,
    state,
    childResults
  })

  if (registerAs) {
    injectToParent(validationResults, registerAs)
  }

  return computed(() => {
    if (registerAs && !childResultsKeys.value.length) {
      return validationResults
    } else {
      return {
        ...validationResults,
        ...childResults.value
      }
    }
  })
}

/**
 * Vuelidate mixin, used to attach Vuelidate only to specified components
 * Relies on `validations` option to be defined on component instance
 * @type {ComponentOptions}
 */
export const VuelidateMixin = {
  beforeCreate () {
    const options = this.$options
    if (!options.validations) return

    const validations = isFunction(options.validations)
      ? options.validations.call(this)
      : options.validations

    if (!options.computed) options.computed = {}
    if (options.computed.$v) return

    options.computed.$v = () => setValidations({
      validations,
      state: this
    })
  }
}

/**
 * Default way to install Vuelidate globally for entire app.
 * @param {Vue} app
 */
export function VuelidatePlugin (app) {
  app.mixin(VuelidateMixin)
}
