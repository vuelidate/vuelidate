import { provide, inject, ref, computed, getCurrentInstance, onBeforeUnmount } from 'vue-demi'
import { unwrap, isFunction } from './utils'
import { setValidations } from './core'

const VuelidateInjectChildResults = Symbol('vuelidate#injectChiildResults')
const VuelidateRemoveChildResults = Symbol('vuelidate#removeChiildResults')

/**
 * Composition API compatible Vuelidate
 * Use inside the `setup` lifecycle hook
 * @param {Object} validations - Validations Object
 * @param {Object} state - State object
 * @param {String} registerAs - a registration name, when registering results to the parent validator.
 * @return {UnwrapRef<*>}
 */
export function useVuelidate (validations, state, registerAs) {
  // if there is no registration name, add one.
  if (!registerAs) {
    const instance = getCurrentInstance()
    // NOTE:
    // ._uid // Vue 2.x Composition-API plugin
    // .uid // Vue 3.0
    const uid = instance.uid || instance._uid
    registerAs = `_vuelidate_${uid}`
  }
  const resultsCache = new Map()

  const childResultsRaw = {}
  const childResultsKeys = ref([])
  const childResults = computed(() => childResultsKeys.value.reduce((results, key) => {
    results[key] = unwrap(childResultsRaw[key])
    return results
  }, {}))

  /**
   * Allows children to send validation data up to their parent.
   * @param {Object} results - the results
   * @param {String} key - the registeredAs key
   */
  function injectChildResultsIntoParent (results, key) {
    childResultsRaw[key] = results
    childResultsKeys.value.push(key)
  }

  /**
   * Allows children to remove the validation data from their parent, before getting destroyed.
   * @param {String} key - the registeredAs key
   */
  function removeChildResultsFromParent (key) {
    // remove the key
    childResultsKeys.value = childResultsKeys.value.filter(childKey => childKey !== key)
    // remove the stored data for the key
    delete childResultsRaw[key]
  }

  const sendValidationResultsToParent = inject(VuelidateInjectChildResults, () => {})
  // provide to all of it's children the send results to parent function
  provide(VuelidateInjectChildResults, injectChildResultsIntoParent)

  const removeValidationResultsFromParent = inject(VuelidateRemoveChildResults, () => {})
  // provide to all of it's children the remove results  function
  provide(VuelidateRemoveChildResults, removeChildResultsFromParent)

  const validationResults = computed(() => setValidations({
    validations: unwrap(validations),
    state,
    childResults,
    resultsCache
  }))

  // send all the data to the parent when the function is invoked inside setup.
  sendValidationResultsToParent(validationResults, registerAs)
  // before this component is destroyed, remove all the data from the parent.
  onBeforeUnmount(() => removeValidationResultsFromParent(registerAs))

  // TODO: Change into reactive + watch
  return computed(() => {
    return {
      ...validationResults.value,
      ...childResults.value
    }
  })
}

/**
 * Vuelidate mixin, used to attach Vuelidate only to specified components
 * Relies on `validations` option to be defined on component instance
 * @type {ComponentOptions}
 */

export const VuelidateMixin = {
  computed: {},
  beforeCreate () {
    const resultsCache = new Map()
    const options = this.$options
    if (!options.validations) return

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
        $v = computed(() => setValidations({ validations, state: this, resultsCache }))
        return $v.value
      }
    }
  },
  beforeUnmount() {
    const options = this.$options;
    if (options.computed.$v) {
      delete options.computed.$v;
    }
  },
}

/**
 * Default way to install Vuelidate globally for entire app.
 * @param {Vue} app
 */
export const VuelidatePlugin = {
  install (app) {
    app.mixin(VuelidateMixin)
  }
}

export default useVuelidate
