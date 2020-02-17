import { provide, inject, ref, computed, reactive, watch } from 'vue'
import { isFunction } from './utils'
import { setValidations } from './core'

const VuelidateSymbol = Symbol('vuelidate')

/**
 * Composition API compatible Vuelidate
 * Use inside the `setup` lifecycle hook
 * @param {Object} validations - Validations Object
 * @param {Object} state - State object
 * @param {String} registerAs
 * @return {UnwrapRef<*>}
 */
export default function useVuelidate (validations, state, registerAs) {
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
    return reactive(validationResults)
  }
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
