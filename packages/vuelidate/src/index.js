import { watch, computed, getCurrentInstance, inject, onBeforeMount, onBeforeUnmount, provide, isRef, ref, reactive, isVue3 } from 'vue-demi'
import { isFunction, unwrap, isProxy } from './utils'
import { setValidations } from './core'
import ResultsStorage from './storage'

const VuelidateInjectChildResults = Symbol('vuelidate#injectChiildResults')
const VuelidateRemoveChildResults = Symbol('vuelidate#removeChiildResults')

export const CollectFlag = {
  COLLECT_ALL: true,
  COLLECT_NONE: false
}

/**
 * Create helpers to collect validation state from child components
 * @param {Object} params
 * @param {String | Number} params.$scope - Parent component scope
 * @return {{sendValidationResultsToParent: function, childResults: ComputedRef<Object>, removeValidationResultsFromParent: function}}
 */
function nestedValidations ({ $scope }) {
  const childResultsRaw = {}
  const childResultsKeys = ref([])
  const childResults = computed(() => childResultsKeys.value.reduce((results, key) => {
    results[key] = unwrap(childResultsRaw[key])
    return results
  }, {}))

  /**
   * Allows children to send validation data up to their parent.
   * @param {Object} results - the results
   * @param {Object} args
   * @param {String} args.$registerAs - the $registeredAs key
   * @param {String | Number} args.$scope - the $scope key
   */
  function injectChildResultsIntoParent (results, { $registerAs: key, $scope: childScope, $stopPropagation }) {
    if (
      $stopPropagation ||
      $scope === CollectFlag.COLLECT_NONE ||
      childScope === CollectFlag.COLLECT_NONE ||
      (
        $scope !== CollectFlag.COLLECT_ALL &&
        $scope !== childScope
      )
    ) return
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

  // inject the `injectChildResultsIntoParent` method, into the current scope
  const sendValidationResultsToParent = inject(VuelidateInjectChildResults, () => {})
  // provide to all of its children the send results to parent function
  provide(VuelidateInjectChildResults, injectChildResultsIntoParent)

  const removeValidationResultsFromParent = inject(VuelidateRemoveChildResults, () => {})
  // provide to all of its children the remove results  function
  provide(VuelidateRemoveChildResults, removeChildResultsFromParent)

  return { childResults, sendValidationResultsToParent, removeValidationResultsFromParent }
}

/**
 * @typedef GlobalConfig
 * @property {String} [$registerAs] - Config Object
 * @property {String | Number | Symbol} [$scope] - A scope to limit child component registration
 * @property {Boolean} [$stopPropagation] - Tells a Vue component to stop sending its results up to the parent
 * @property {Ref<Object>} [$externalResults] - External error messages, like from server validation.
 */

/**
 * Composition API compatible Vuelidate
 * Use inside the `setup` lifecycle hook
 * @param {Object | GlobalConfig} [validations] - Validations Object or the globalConfig.
 * @param {Object} [state] - State object - required if `validations` is a validation object.
 * @param {GlobalConfig} [globalConfig] - Config Object
 * @return {UnwrapRef<*>}
 */
export function useVuelidate (validations, state, globalConfig = {}) {
  // if we pass only one argument, its most probably the globalConfig.
  // This use case is so parents can just collect results of child forms.
  if (arguments.length === 1) {
    globalConfig = validations
    validations = undefined
    state = undefined
  }
  let { $registerAs, $scope = CollectFlag.COLLECT_ALL, $stopPropagation, $externalResults } = globalConfig

  let instance = getCurrentInstance()

  const componentOptions = instance
    ? (isVue3 ? instance.type : instance.proxy.$options)
    : {}
  // if there is no registration name, add one.
  if (!$registerAs && instance) {
    // NOTE:
    // ._uid // Vue 2.x Composition-API plugin
    // .uid // Vue 3.0
    const uid = instance.uid || instance._uid
    $registerAs = `_vuelidate_${uid}`
  }
  const validationResults = ref({})
  const resultsCache = new ResultsStorage()

  const {
    childResults,
    sendValidationResultsToParent,
    removeValidationResultsFromParent
  } = instance
    ? nestedValidations({ $scope })
    : { childResults: ref({}) }

  // Options API
  if (!validations && componentOptions.validations) {
    const rules = componentOptions.validations

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

      watch(() => isFunction(rules) ? rules.call(state.value, new ComputedProxyFactory(state.value)) : rules,
        (validations) => {
          validationResults.value = setValidations({
            validations,
            state,
            childResults,
            resultsCache,
            globalConfig,
            instance: instance.proxy,
            externalResults: instance.proxy.vuelidateExternalResults
          })
        }, { immediate: true })
    })

    globalConfig = componentOptions.validationsConfig || {}
  } else {
    const validationsWatchTarget = isRef(validations) || isProxy(validations)
      ? validations
      // wrap plain objects in a reactive, so we can track changes if they have computed in them.
      : reactive(validations || {})

    watch(validationsWatchTarget, (newValidationRules) => {
      validationResults.value = setValidations({
        validations: newValidationRules,
        state,
        childResults,
        resultsCache,
        globalConfig,
        instance: instance ? instance.proxy : {},
        externalResults: $externalResults
      })
    }, {
      immediate: true
    })
  }

  if (instance) {
    // send all the data to the parent when the function is invoked inside setup.
    sendValidationResultsToParent(validationResults, { $registerAs, $scope, $stopPropagation })
    // before this component is destroyed, remove all the data from the parent.
    onBeforeUnmount(() => removeValidationResultsFromParent($registerAs))
  }

  // TODO: Change into reactive + watch
  return computed(() => {
    return {
      ...unwrap(validationResults.value),
      ...childResults.value
    }
  })
}

export default useVuelidate
