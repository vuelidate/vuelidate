import { computed, getCurrentInstance, inject, onBeforeMount, onBeforeUnmount, provide, ref } from 'vue-demi'
import { isFunction, unwrap } from './utils'
import { setValidations } from './core'
import ResultsStorage from './storage'

const VuelidateInjectChildResults = Symbol('vuelidate#injectChiildResults')
const VuelidateRemoveChildResults = Symbol('vuelidate#removeChiildResults')

function nestedValidations () {
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

  const sendValidationResultsToParent = inject(VuelidateInjectChildResults, () => {
  })
  // provide to all of it's children the send results to parent function
  provide(VuelidateInjectChildResults, injectChildResultsIntoParent)

  const removeValidationResultsFromParent = inject(VuelidateRemoveChildResults, () => {
  })
  // provide to all of it's children the remove results  function
  provide(VuelidateRemoveChildResults, removeChildResultsFromParent)

  return { childResults, sendValidationResultsToParent, removeValidationResultsFromParent }
}

/**
 * Composition API compatible Vuelidate
 * Use inside the `setup` lifecycle hook
 * @param {Object|null} validations - Validations Object
 * @param {Object} state - State object
 * @param {String} globalConfig - Config Object
 * @return {UnwrapRef<*>}
 */
export function useVuelidate (validations, state, globalConfig = {}) {
  let { $registerAs } = globalConfig

  // if there is no registration name, add one.
  if (!$registerAs) {
    const instance = getCurrentInstance()
    // NOTE:
    // ._uid // Vue 2.x Composition-API plugin
    // .uid // Vue 3.0
    const uid = instance.uid || instance._uid
    $registerAs = `_vuelidate_${uid}`
  }
  const validationResults = ref({})
  const resultsCache = new ResultsStorage()

  const { childResults, sendValidationResultsToParent, removeValidationResultsFromParent } = nestedValidations()

  if (!validations) {
    const instance = getCurrentInstance()
    if (instance.type.validations) {
      const rules = instance.type.validations

      state = ref({})
      onBeforeMount(() => {
        // Delay binding state to validations defined with the Options API until mounting, when the data
        // has been attached to the component instance. From that point on it will be reactive.
        state.value = instance.proxy

        // helper proxy for instance property access. It makes every reference
        // reactive for the validation function
        function ComputedProxyFactory (target) {
          return new Proxy(target, {
            get (target, prop, receiver) {
              return (typeof target[prop] === 'object')
                ? ComputedProxyFactory(target[prop])
                : computed(() => target[prop])
            }
          })
        }

        validations = isFunction(rules)
          ? rules.call(instance.proxy, new ComputedProxyFactory(instance.proxy))
          : rules

        validationResults.value = setValidations({
          validations,
          state,
          childResults,
          resultsCache,
          globalConfig
        })
      })

      globalConfig = instance.type.validationsConfig || {}
    }
  } else {
    validationResults.value = setValidations({
      validations,
      state,
      childResults,
      resultsCache,
      globalConfig
    })
  }

  // send all the data to the parent when the function is invoked inside setup.
  sendValidationResultsToParent(validationResults.value, $registerAs)
  // before this component is destroyed, remove all the data from the parent.
  onBeforeUnmount(() => removeValidationResultsFromParent($registerAs))

  // // TODO autodirty is setting dirty for any temporal undefined
  // onBeforeMount(() => {
  //   validationResults.$reset()
  // })

  // TODO: Change into reactive + watch
  return computed(() => {
    return {
      ...validationResults.value,
      ...childResults.value
    }
  })
}

export default useVuelidate
