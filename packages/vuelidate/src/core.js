import { unwrap, gatherBooleanGroupProperties, gatherArrayGroupProperties } from './utils'
import { computed, isRef, nextTick, reactive, ref, watch } from 'vue-demi'
import { createValidatorResult } from './utils/createResults'
import { sortValidations } from './utils/sortValidations'

const ROOT_PATH = '__root'

/** @typedef {import('vue-demi').ComponentPublicInstance} VueInstance */
/** @typedef {import('vue-demi').ComputedRef} ComputedRef */
/** @typedef {import('vue-demi').UnwrapRef} UnwrapRef */
/** @typedef {import('vue-demi').WatchStopHandle} WatchStopHandle */
/** @typedef {import('vue-demi').WritableComputedRef} WritableComputedRef */
/** @typedef {import('vue-demi').UnwrapNestedRefs} UnwrapNestedRefs */

/**
 * @typedef NormalizedValidator
 * @property {Validator} $validator
 * @property {String | Ref<String> | function(*): string} [$message]
 * @property {Object | Ref<Object>} [$params]
 * @property {Object | Ref<Object>} [$async]
 * @property {Ref<*>[]} [$watchTargets]
 */

/**
 * Raw validator function, before being normalized
 * Can return a Promise or a {@see ValidatorResponse}
 * @typedef {function(*): ((Promise<ValidatorResponse> | ValidatorResponse))} Validator
 */

/**
 * @typedef ErrorObject
 * @property {Ref<String>} $message - Reactive error message
 * @property {Ref<Object>} $params - Params passed from withParams
 * @property {Ref<Boolean>} $pending - If validation is pending
 * @property {String} $property - State key
 * @property {String} $propertyPath - Dot notation path to state
 * @property {String} $validator - Validator name
 * @property {String} $uid - Unique identifier
 */

/**
 * @typedef ValidationResult
 * @property {Ref<Boolean>} $pending
 * @property {Ref<Boolean>} $dirty
 * @property {Ref<Boolean>} $invalid
 * @property {Ref<Boolean>} $error
 * @property {Ref<String>} $path
 * @property {Function} $touch
 * @property {Function} $reset
 * @property {ComputedRef<ErrorObject[]>} $errors
 * @property {ComputedRef<ErrorObject[]>} $silentErrors
 * @property {Function} $commit
 */

/**
 * Creates the main Validation Results object for a state tree
 * Walks the tree's top level branches
 * @param {Object<NormalizedValidator>} rules - Rules for the current state tree
 * @param {Object} model - Current state value
 * @param {String} key - Key for the current state tree
 * @param {ResultsStorage} [resultsCache] - A cache map of all the validators
 * @param {String} [path] - the current property path
 * @param {GlobalConfig} [config] - the config object
 * @param {VueInstance} instance
 * @param {ComputedRef<Object>} externalResults
 * @param {Object} siblingState
 * @return {ValidationResult | {}}
 */
function createValidationResults (rules, model, key, resultsCache, path, config, instance, externalResults, siblingState) {
  // collect the property keys
  const ruleKeys = Object.keys(rules)

  const cachedResult = resultsCache.get(path, rules)
  const $dirty = ref(false)
  // state for the $rewardEarly option
  /** The last invalid state of this property */
  const $lastInvalidState = ref(false)
  /** The last time $commit was called. Used to re-trigger async calls */
  const $lastCommittedOn = ref(0)

  if (cachedResult) {
    // if the rules are the same as before, use the cached results
    if (!cachedResult.$partial) return cachedResult
    // remove old watchers
    cachedResult.$unwatch()
    cachedResult.__unwatchInvalidResult?.()
    // use the `$dirty.value`, so we dont save references by accident
    $dirty.value = cachedResult.$dirty.value
  }

  const result = {
    // restore $dirty from cache
    $dirty,
    $path: path,
    $touch: () => { if (!$dirty.value) $dirty.value = true },
    $reset: () => { if ($dirty.value) $dirty.value = false },
    $commit: () => {}
  }

  /**
   * If there are no validation rules, it is most likely
   * a top level state, aka root
   */
  if (!ruleKeys.length) {
    // if there are cached results, we should overwrite them with the new ones
    cachedResult && resultsCache.set(path, rules, result)

    return result
  }

  ruleKeys.forEach(ruleKey => {
    result[ruleKey] = createValidatorResult(
      rules[ruleKey],
      model,
      result.$dirty,
      config,
      instance,
      ruleKey,
      key,
      path,
      siblingState,
      $lastInvalidState,
      $lastCommittedOn
    )
  })

  result.$externalResults = computed(() => {
    if (!externalResults.value) return []
    return [].concat(externalResults.value).map((stringError, index) => ({
      $propertyPath: path,
      $property: key,
      $validator: '$externalResults',
      $uid: `${path}-externalResult-${index}`,
      $message: stringError,
      $params: {},
      $response: null,
      $pending: false
    }))
  })

  result.$invalid = computed(() => {
    const r = ruleKeys.some(ruleKey => unwrap(result[ruleKey].$invalid))
    return !!result.$externalResults.value.length || r
  })

  // https://github.com/vuelidate/vuelidate/issues/1237
  // 1. Moved $lastInvalid assignment from the results.$invalid computed
  //   because computed props should be side-effect free.
  // 2. Added $lastCommittedOn as a watch source because 3.4.x vue will cache
  //   computed more aggressively and $lastInvalidState would be out of sync
  //   in the "commit() when valid" scenario:
  //   - commit() sets $lastInvalidState to true
  //   - validators run and return invalid as false
  //   - result.$invalid is already false, so it will not recompute (cached)
  //   - the watcher will not be triggered because $result.$invalid dep did
  //     not change.
  //   - last $invalidState is not sync to false (to match result.$invalid), and
  //     thus $model change triggers validators to run immediately.
  //   I don't know if it's out-of-scope of this PR to update vue, but 3.4.x
  //   brought many changes to computed optimization which vuelidate relies on
  //   heavily and it's the future.
  // 3. flush "post" is required for async validators to work in this mode, otherwise
  //   last invalid state will be flipped to false since sync validators run first
  //   and turn invalid to false "before" pending is set to true and it will prevent
  //   them from running (Guessing). At least is required for 3.4.x and that's
  //   the version the majority should be using.
  if (config.$rewardEarly) {
    result.__unwatchInvalidResult = watch(
      [result.$invalid, $lastCommittedOn],
      ([invalidState]) => { $lastInvalidState.value = invalidState },
      {
        deep: true,
        flush: 'post' // [3]
      }
    )
  }

  result.$pending = computed(() =>
    ruleKeys.some(ruleKey => unwrap(result[ruleKey].$pending))
  )

  result.$error = computed(() =>
    result.$dirty.value ? result.$pending.value || result.$invalid.value : false
  )

  result.$silentErrors = computed(() => ruleKeys
    .filter(ruleKey => unwrap(result[ruleKey].$invalid))
    .map(ruleKey => {
      const res = result[ruleKey]
      return reactive({
        $propertyPath: path,
        $property: key,
        $validator: ruleKey,
        $uid: `${path}-${ruleKey}`,
        $message: res.$message,
        $params: res.$params,
        $response: res.$response,
        $pending: res.$pending
      })
    })
    .concat(result.$externalResults.value)
  )

  result.$errors = computed(() => result.$dirty.value
    ? result.$silentErrors.value
    : []
  )

  result.$unwatch = () => ruleKeys.forEach(ruleKey => {
    result[ruleKey].$unwatch()
  })

  result.$commit = () => {
    $lastInvalidState.value = true
    $lastCommittedOn.value = Date.now()
  }

  resultsCache.set(path, rules, result)

  return result
}

/**
 * Collects the validation results of all nested state properties
 * @param {Object<NormalizedValidator|Function>} validations - The validation
 * @param {Object} nestedState - Current state
 * @param {String} path - Path to current property
 * @param {ResultsStorage} resultsCache - Validations cache map
 * @param {GlobalConfig} config - The config object
 * @param {VueInstance} instance - The current Vue instance
 * @param {ComputedRef<object>} nestedExternalResults - The external results for this nested collection
 * @return {Object<string, VuelidateState>}
 */
function collectNestedValidationResults (validations, nestedState, path, resultsCache, config, instance, nestedExternalResults) {
  const nestedValidationKeys = Object.keys(validations)

  // if we have no state, return empty object
  if (!nestedValidationKeys.length) return {}

  return nestedValidationKeys.reduce((results, nestedKey) => {
    // build validation results for nested state
    results[nestedKey] = setValidations({
      validations: validations[nestedKey],
      state: nestedState,
      key: nestedKey,
      parentKey: path,
      resultsCache,
      globalConfig: config,
      instance,
      externalResults: nestedExternalResults
    })
    return results
  }, {})
}

/**
 * Generates the Meta fields from the results
 * @param {ValidationResult|{}} results
 * @param {Object.<string, VuelidateState>} nestedResults
 * @param {Object.<string, ValidationResult>} childResults
 * @return {{$anyDirty: Ref<Boolean>, $error: Ref<Boolean>, $invalid: Ref<Boolean>, $errors: Ref<ErrorObject[]>, $dirty: Ref<Boolean>, $touch: Function, $reset: Function }}
 */
function createMetaFields (results, nestedResults, childResults) {
  const allResults = computed(() => [nestedResults, childResults]
    .filter(res => res)
    .reduce((allRes, res) => {
      return allRes.concat(Object.values(unwrap(res)))
    }, [])
  )

  // returns `$dirty` as true, if all children are dirty
  const $dirty = computed({
    get () {
      return results.$dirty.value ||
        (allResults.value.length ? allResults.value.every(r => r.$dirty) : false)
    },
    set (v) {
      results.$dirty.value = v
    }
  })

  const $silentErrors = computed(() => {
    // current state level errors, fallback to empty array if root
    const modelErrors = unwrap(results.$silentErrors) || []

    // collect all nested and child $silentErrors
    const nestedErrors = allResults.value
      .filter(result => (unwrap(result).$silentErrors || []).length)
      .reduce((errors, result) => {
        return errors.concat(...result.$silentErrors)
      }, [])

    // merge the $silentErrors
    return modelErrors.concat(nestedErrors)
  })

  const $errors = computed(() => {
    // current state level errors, fallback to empty array if root
    const modelErrors = unwrap(results.$errors) || []

    // collect all nested and child $errors
    const nestedErrors = allResults.value
      .filter(result => (unwrap(result).$errors || []).length)
      .reduce((errors, result) => {
        return errors.concat(...result.$errors)
      }, [])

    // merge the $errors
    return modelErrors.concat(nestedErrors)
  })

  const $invalid = computed(() =>
    // if any of the nested values is invalid
    allResults.value.some(r => r.$invalid) ||
    // or if the current state is invalid
    unwrap(results.$invalid) ||
    // fallback to false if is root
    false
  )

  const $pending = computed(() =>
    // if any of the nested values is pending
    allResults.value.some(r => unwrap(r.$pending)) ||
    // if any of the current state validators is pending
    unwrap(results.$pending) ||
    // fallback to false if is root
    false
  )

  const $anyDirty = computed(() =>
    allResults.value.some(r => r.$dirty) ||
    allResults.value.some(r => r.$anyDirty) ||
    $dirty.value
  )

  const $error = computed(() => $dirty.value ? $pending.value || $invalid.value : false)

  const $touch = () => {
    // call the root $touch
    results.$touch()
    // call all nested level $touch
    allResults.value.forEach((result) => {
      result.$touch()
    })
  }

  const $commit = () => {
    // call the root $touch
    results.$commit()
    // call all nested level $touch
    allResults.value.forEach((result) => {
      result.$commit()
    })
  }

  const $reset = () => {
    // reset the root $dirty state
    results.$reset()
    // reset all the children $dirty states
    allResults.value.forEach((result) => {
      result.$reset()
    })
  }

  // Ensure that if all child and nested results are $dirty, this also becomes $dirty
  if (allResults.value.length && allResults.value.every(nr => nr.$dirty)) $touch()

  return {
    $dirty,
    $errors,
    $invalid,
    $anyDirty,
    $error,
    $pending,
    $touch,
    $reset,
    $silentErrors,
    $commit
  }
}

/**
 * @typedef VuelidateState
 * @property {WritableComputedRef<any>} $model
 * @property {ComputedRef<Boolean>} $dirty
 * @property {ComputedRef<Boolean>} $error
 * @property {ComputedRef<ErrorObject[]>} $errors
 * @property {ComputedRef<Boolean>} $invalid
 * @property {ComputedRef<Boolean>} $anyDirty
 * @property {ComputedRef<Boolean>} $pending
 * @property {Function} $touch
 * @property {Function} $reset
 * @property {String} $path
 * @property {ComputedRef<ErrorObject[]>} $silentErrors
 * @property {Function} [$validate]
 * @property {Function} [$getResultsForChild]
 * @property {Object.<string, VuelidateState>}
 */

/**
 * Main Vuelidate bootstrap function.
 * Used both for Composition API in `setup` and for Global App usage.
 * Used to collect validation state, when walking recursively down the state tree
 * @param {Object} params
 * @param {Object<NormalizedValidator|Function>} params.validations
 * @param {Object} params.state
 * @param {String} [params.key] - Current state property key. Used when being called on nested items
 * @param {String} [params.parentKey] - Parent state property key. Used when being called recursively
 * @param {Object<string, ValidationResult>} [params.childResults] - Used to collect child results.
 * @param {ResultsStorage} params.resultsCache - The cached validation results
 * @param {VueInstance} params.instance - The current Vue instance
 * @param {GlobalConfig} params.globalConfig - The validation config, passed to this setValidations instance.
 * @param {UnwrapNestedRefs<object> | Ref<Object>} params.externalResults - External validation results
 * @return {UnwrapNestedRefs<VuelidateState>}
 */
export function setValidations ({
  validations,
  state,
  key,
  parentKey,
  childResults,
  resultsCache,
  globalConfig = {},
  instance,
  externalResults
}) {
  const path = parentKey ? `${parentKey}.${key}` : key

  // Sort out the validation object into:
  // – rules = validators for current state tree fragment
  // — nestedValidators = nested state fragments keys that might contain more validators
  // – config = configuration properties that affect this state fragment
  const { rules, nestedValidators, config, validationGroups } = sortValidations(validations)
  const mergedConfig = { ...globalConfig, ...config }

  // create protected state for cases when the state branch does not exist yet.
  // This protects when using the OptionsAPI as the data is bound after the setup method
  const nestedState = key
    ? computed(() => {
      const s = unwrap(state)
      return s ? unwrap(s[key]) : undefined
    })
    : state

  // cache the external results, so we can revert back to them
  const cachedExternalResults = { ...(unwrap(externalResults) || {}) }

  const nestedExternalResults = computed(() => {
    const results = unwrap(externalResults)
    if (!key) return results
    return results ? unwrap(results[key]) : undefined
  })

  // Use rules for the current state fragment and validate it
  const results = createValidationResults(rules, nestedState, key, resultsCache, path, mergedConfig, instance, nestedExternalResults, state)
  // Use nested keys to repeat the process
  // *WARN*: This is recursive
  const nestedResults = collectNestedValidationResults(nestedValidators, nestedState, path, resultsCache, mergedConfig, instance, nestedExternalResults)

  const $validationGroups = {}
  if (validationGroups) {
    Object.entries(validationGroups).forEach(([key, group]) => {
      $validationGroups[key] = {
        $invalid: gatherBooleanGroupProperties(group, nestedResults, '$invalid'),
        $error: gatherBooleanGroupProperties(group, nestedResults, '$error'),
        $pending: gatherBooleanGroupProperties(group, nestedResults, '$pending'),
        $errors: gatherArrayGroupProperties(group, nestedResults, '$errors'),
        $silentErrors: gatherArrayGroupProperties(group, nestedResults, '$silentErrors')
      }
    })
  }

  // Collect and merge this level validation results
  // with all nested validation results
  const {
    $dirty,
    $errors,
    $invalid,
    $anyDirty,
    $error,
    $pending,
    $touch,
    $reset,
    $silentErrors,
    $commit
  } = createMetaFields(results, nestedResults, childResults)

  /**
   * If we have no `key`, this is the top level state
   * We dont need `$model` there.
   */
  const $model = key
    ? computed({
      get: () => unwrap(nestedState),
      set: val => {
        $dirty.value = true
        const s = unwrap(state)
        const external = unwrap(externalResults)
        if (external) {
          external[key] = cachedExternalResults[key]
        }
        if (isRef(s[key])) {
          s[key].value = val
        } else {
          s[key] = val
        }
      }
    })
    : null

  if (key && mergedConfig.$autoDirty) {
    watch(nestedState, () => {
      if (!$dirty.value) $touch()
      const external = unwrap(externalResults)
      if (external) {
        external[key] = cachedExternalResults[key]
      }
    }, { flush: 'sync' })
  }

  /**
   * Executes the validators and returns the result.
   * @return {Promise<boolean>}
   */
  async function $validate () {
    $touch()
    if (mergedConfig.$rewardEarly) {
      $commit()
      // await the watchers
      await nextTick()
    }
    // await the watchers
    await nextTick()
    return new Promise((resolve) => {
      // return whether it is valid or not
      if (!$pending.value) return resolve(!$invalid.value)
      const unwatch = watch($pending, () => {
        resolve(!$invalid.value)
        unwatch()
      })
    })
  }

  /**
   * Returns a child component's results, based on registration name
   * @param {string} key
   * @return {VuelidateState}
   */
  function $getResultsForChild (key) {
    return (childResults.value || {})[key]
  }

  function $clearExternalResults () {
    if (isRef(externalResults)) {
      externalResults.value = cachedExternalResults
    } else {
      // if the external results state was empty, we need to delete every property, one by one
      if (Object.keys(cachedExternalResults).length === 0) {
        Object.keys(externalResults).forEach((k) => {
          delete externalResults[k]
        })
      } else {
        // state was not empty, so we just assign it back into the current state
        Object.assign(externalResults, cachedExternalResults)
      }
    }
  }

  return reactive({
    ...results,
    // NOTE: The order here is very important, since we want to override
    // some of the *results* meta fields with the collective version of it
    // that includes the results of nested state validation results
    $model,
    $dirty,
    $error,
    $errors,
    $invalid,
    $anyDirty,
    $pending,
    $touch,
    $reset,
    $path: path || ROOT_PATH,
    $silentErrors,
    $validate,
    $commit,
    // if there are no child results, we are inside a nested property
    ...(childResults && {
      $getResultsForChild,
      $clearExternalResults,
      $validationGroups
    }),
    // add each nested property's state
    ...nestedResults
  })
}
