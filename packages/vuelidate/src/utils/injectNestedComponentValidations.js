import { computed, inject, provide, ref } from 'vue-demi'
import { unwrap } from './index'

export const CollectFlag = {
  COLLECT_ALL: true,
  COLLECT_NONE: false
}

const VuelidateInjectChildResults = Symbol('vuelidate#injectChildResults')
const VuelidateRemoveChildResults = Symbol('vuelidate#removeChildResults')

/**
 * Create helpers to collect validation state from child components
 * @param {Object} params
 * @param {String | Number | Boolean} params.$scope - Parent component scope
 * @return {{sendValidationResultsToParent: function[], childResults: ComputedRef<Object>, removeValidationResultsFromParent: function[]}}
 */
export function nestedValidations ({ $scope, instance }) {
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
   * @param {String | Number | Boolean} args.$scope - the $scope key
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

  // combine with other `injectChildResultsIntoParent` from vuelidate instances in this Vue component instance
  instance.__vuelidateInjectInstances = [].concat(instance.__vuelidateInjectInstances || [], injectChildResultsIntoParent)

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

  // combine with other `removeChildResultsFromParent` from vuelidate instances in this Vue component instance
  instance.__vuelidateRemoveInstances = [].concat(instance.__vuelidateRemoveInstances || [], removeChildResultsFromParent)

  // inject the `injectChildResultsIntoParent` method, into the current scope
  const sendValidationResultsToParent = inject(VuelidateInjectChildResults, [])
  // provide to all of its children the send results to parent function
  provide(VuelidateInjectChildResults, instance.__vuelidateInjectInstances)

  const removeValidationResultsFromParent = inject(VuelidateRemoveChildResults, [])
  // provide to all of its children the remove results  function
  provide(VuelidateRemoveChildResults, instance.__vuelidateRemoveInstances)

  return { childResults, sendValidationResultsToParent, removeValidationResultsFromParent }
}
