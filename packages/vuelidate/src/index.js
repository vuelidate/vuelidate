import { unwrap, isFunction } from './utils'
import { setValidations } from './core'

// const VuelidateSymbol = Symbol('vuelidate')

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
  //
  // const childResults = ref({})
  //
  // const injectToParent = inject(VuelidateSymbol, () => {})
  // // const childResults = computed(() => {
  // //   return childValidationsKeys.value.reduce((res, key, index) => {
  // //     res[key] = childValidationsResults.value[index]
  // //     console.log('res', res)
  // //     return res
  // //   }, {})
  // // })
  //
  // function injectChildResults (results, key) {
  //   childResults.value[key] = results
  //   console.log('saving', key)
  // }
  //
  // provide(VuelidateSymbol, injectChildResults)

  const validationResults = setValidations({
    validations,
    state
    // childResults
  })

  // if (registerAs) {
  //   injectToParent(validationResults, registerAs)
  // }

  return validationResults
}

/**
 * Vuelidate mixin, used to attach Vuelidate only to specified components
 * Relies on `validations` option to be defined on component instance
 * @type {{beforeCreate: Function }}
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
