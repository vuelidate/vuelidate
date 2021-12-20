import { watch, computed, getCurrentInstance, onBeforeMount, onBeforeUnmount, isRef, ref, reactive, isVue3 } from 'vue-demi'
import { isFunction, unwrap, isProxy } from './utils'
import { setValidations } from './core'
import ResultsStorage from './storage'
import { CollectFlag, nestedValidations } from './utils/injectNestedComponentValidations'
import { ComputedProxyFactory } from './utils/ComputedProxyFactory'

/**
 * @typedef GlobalConfig
 * @property {String} [$registerAs] - Config Object
 * @property {String | Number | Symbol} [$scope] - A scope to limit child component registration
 * @property {Boolean} [$stopPropagation] - Tells a Vue component to stop sending its results up to the parent
 * @property {Ref<Object>} [$externalResults] - External error messages, like from server validation.
 * @property {Boolean} [$autoDirty] - Should the form watch for state changed, and automatically set `$dirty` to true.
 * @property {Boolean} [$lazy] - Should the validations be lazy, and run only after they are dirty
 * @property {Boolean} [$rewardEarly] - Once valid, re-runs property validators only on manual calls of $commit
 */

/**
 * Composition API compatible Vuelidate
 * Use inside the `setup` lifecycle hook
 * @param {Object | GlobalConfig} [validations] - Validations Object or the globalConfig.
 * @param {Object} [state] - State object - required if `validations` is a validation object.
 * @param {GlobalConfig} [globalConfig] - Config Object
 * @return {ComputedRef<*>}
 */
export function useVuelidate (validations, state, globalConfig = {}) {
  // if we pass only one argument, its most probably the globalConfig.
  // This use case is so parents can just collect results of child forms.
  if (arguments.length === 1) {
    globalConfig = validations
    validations = undefined
    state = undefined
  }
  let { $registerAs, $scope = CollectFlag.COLLECT_ALL, $stopPropagation, $externalResults, currentVueInstance } = globalConfig

  const instance = currentVueInstance || getCurrentInstance()

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
    ? nestedValidations({ $scope, instance })
    : { childResults: ref({}) }

  // Options API
  if (!validations && componentOptions.validations) {
    const rules = componentOptions.validations

    state = ref({})
    onBeforeMount(() => {
      // Delay binding state to validations defined with the Options API until mounting, when the data
      // has been attached to the component instance. From that point on it will be reactive.
      state.value = instance.proxy

      watch(() => isFunction(rules) ? rules.call(state.value, new ComputedProxyFactory(state.value)) : rules,
        (validations) => {
          validationResults.value = setValidations({
            validations,
            state,
            childResults,
            resultsCache,
            globalConfig,
            instance: instance.proxy,
            externalResults: $externalResults || instance.proxy.vuelidateExternalResults
          })
        }, { immediate: true })
    })

    globalConfig = componentOptions.validationsConfig || globalConfig
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
    }, { immediate: true })
  }

  if (instance) {
    // send all the data to the parent when the function is invoked inside setup.
    sendValidationResultsToParent.forEach((f) => f(validationResults, { $registerAs, $scope, $stopPropagation }))
    // before this component is destroyed, remove all the data from the parent.
    onBeforeUnmount(() => removeValidationResultsFromParent.forEach((f) => f($registerAs)))
  }

  return computed(() => {
    return {
      ...unwrap(validationResults.value),
      ...childResults.value
    }
  })
}

export { CollectFlag }
export default useVuelidate
