import { computed, ref, watch } from 'vue-demi'
import { isFunction, unwrap, unwrapObj } from '../utils'

/**
 * Response form a raw Validator function.
 * Should return a Boolean or an object with $invalid property.
 * @typedef {Boolean | { $valid: Boolean }} ValidatorResponse
 */

/**
 * Calls a validation rule by unwrapping its value first from a ref.
 * @param {Validator} rule
 * @param {Ref} value
 * @param {VueInstance} instance
 * @param {Object} siblingState
 * @return {Promise<ValidatorResponse> | ValidatorResponse}
 */
function callRule (rule, value, siblingState, instance) {
  return rule.call(instance, unwrap(value), unwrap(siblingState), instance)
}

/**
 * Normalizes the validator result
 * Allows passing a boolean of an object like `{ $valid: Boolean }`
 * @param {ValidatorResponse} result - Validator result
 * @return {boolean}
 */
function normalizeValidatorResponse (result) {
  return result.$valid !== undefined
    ? !result.$valid
    : !result
}

/**
 * Returns the result of an async validator.
 * @param {Validator} rule
 * @param {Ref<*>} model
 * @param {Ref<Boolean>} $pending
 * @param {Ref<Boolean>} $dirty
 * @param {GlobalConfig} config
 * @param {boolean} config.$lazy
 * @param {Ref<*>} $response
 * @param {VueInstance} instance
 * @param {Ref<*>[]} watchTargets
 * @param {Object} siblingState
 * @param {Ref<Boolean>} $lastInvalidState
 * @param {Ref<Number>} $lastCommittedOn
 * @return {{ $invalid: Ref<Boolean>, $unwatch: WatchStopHandle }}
 */
function createAsyncResult (
  rule,
  model,
  $pending,
  $dirty,
  {
    $lazy,
    $rewardEarly
  },
  $response,
  instance,
  watchTargets = [],
  siblingState,
  $lastInvalidState,
  $lastCommittedOn
) {
  const $invalid = ref(!!$dirty.value)
  const $pendingCounter = ref(0)

  $pending.value = false

  const $unwatch = watch(
    [model, $dirty].concat(watchTargets, $lastCommittedOn),
    () => {
      if (
        // if $lazy and not dirty, return
        ($lazy && !$dirty.value) ||
        // if in $rewardEarly mode and no previous errors, nothing pending, return
        ($rewardEarly && !$lastInvalidState.value && !$pending.value)
      ) {
        return
      }
      let ruleResult
      // make sure we dont break if a validator throws
      try {
        ruleResult = callRule(rule, model, siblingState, instance)
      } catch (err) {
        // convert to a promise, so we can handle it async
        ruleResult = Promise.reject(err)
      }

      $pendingCounter.value++
      $pending.value = !!$pendingCounter.value
      // ensure $invalid is false, while validator is resolving
      $invalid.value = false

      Promise.resolve(ruleResult)
        .then(data => {
          $pendingCounter.value--
          $pending.value = !!$pendingCounter.value
          $response.value = data
          $invalid.value = normalizeValidatorResponse(data)
        })
        .catch((error) => {
          $pendingCounter.value--
          $pending.value = !!$pendingCounter.value
          $response.value = error
          $invalid.value = true
        })
    }, { immediate: true, deep: typeof model === 'object' }
  )

  return { $invalid, $unwatch }
}

/**
 * Returns the result of a sync validator
 * @param {Validator} rule
 * @param {Ref<*>} model
 * @param {Ref<Boolean>} $dirty
 * @param {GlobalConfig} config
 * @param {Boolean} config.$lazy
 * @param {Ref<*>} $response
 * @param {VueInstance} instance
 * @param {Object} siblingState
 * @param {Ref<Boolean>} $lastInvalidState
 * @return {{$unwatch: (function(): {}), $invalid: ComputedRef<boolean>}}
 */
function createSyncResult (
  rule,
  model,
  $dirty,
  { $lazy, $rewardEarly },
  $response,
  instance,
  siblingState,
  $lastInvalidState
) {
  const $unwatch = () => ({})
  const $invalid = computed(() => {
    if (
      // return early if $lazy mode and not touched
      ($lazy && !$dirty.value) ||
      // If $rewardEarly mode is ON and last invalid was false (no error), return it.
      // If we want to invalidate, we just flip the last state to true, causing the computed to run again
      ($rewardEarly && !$lastInvalidState.value)) {
      return false
    }
    let returnValue = true
    try {
      const result = callRule(rule, model, siblingState, instance)
      $response.value = result
      returnValue = normalizeValidatorResponse(result)
    } catch (err) {
      $response.value = err
    }
    return returnValue
  })
  return { $unwatch, $invalid }
}

/**
 * Returns the validation result.
 * Detects async and sync validators.
 * @param {NormalizedValidator} rule
 * @param {Ref<*>} model
 * @param {Ref<boolean>} $dirty
 * @param {GlobalConfig} config - Vuelidate config
 * @param {VueInstance} instance - component instance
 * @param {string} validatorName - name of the current validator
 * @param {string} propertyKey - the current property we are validating
 * @param {string} propertyPath - the deep path to the validated property
 * @param {Object} siblingState
 * @param {Ref<Boolean>} $lastInvalidState - the last invalid state
 * @param {Ref<Number>} $lastCommittedOn - the last time $commit was called
 * @return {{ $params: *, $message: Ref<String>, $pending: Ref<Boolean>, $invalid: Ref<Boolean>, $response: Ref<*>, $unwatch: WatchStopHandle }}
 */
export function createValidatorResult (
  rule,
  model,
  $dirty,
  config,
  instance,
  validatorName,
  propertyKey,
  propertyPath,
  siblingState,
  $lastInvalidState,
  $lastCommittedOn
) {
  const $pending = ref(false)
  const $params = rule.$params || {}
  const $response = ref(null)
  let $invalid
  let $unwatch

  if (rule.$async) {
    ({ $invalid, $unwatch } = createAsyncResult(
      rule.$validator,
      model,
      $pending,
      $dirty,
      config,
      $response,
      instance,
      rule.$watchTargets,
      siblingState,
      $lastInvalidState,
      $lastCommittedOn
    ))
  } else {
    ({ $invalid, $unwatch } = createSyncResult(
      rule.$validator,
      model,
      $dirty,
      config,
      $response,
      instance,
      siblingState,
      $lastInvalidState
    ))
  }

  const message = rule.$message
  const $message = isFunction(message)
    ? computed(() =>
      message(
        unwrapObj({
          $pending,
          $invalid,
          $params: unwrapObj($params), // $params can hold refs, so we unwrap them for easy access
          $model: model,
          $response,
          $validator: validatorName,
          $propertyPath: propertyPath,
          $property: propertyKey
        })
      ))
    : message || ''

  return {
    $message,
    $params,
    $pending,
    $invalid,
    $response,
    $unwatch
  }
}
