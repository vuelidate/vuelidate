import { isFunction, unwrap, unwrapObj } from './utils'
import { computed, isRef, reactive, ref, watch, nextTick } from 'vue-demi'

let ROOT_PATH = '__root'

/**
 * @typedef {import('vue-demi').ComponentPublicInstance} VueInstance
 */
/**
 * @typedef {import('vue-demi').ComputedRef} ComputedRef
 */
/**
 * @typedef {import('vue-demi').WatchStopHandle} WatchStopHandle
 */

/**
 * @typedef NormalizedValidator
 * @property {Validator} $validator
 * @property {String | Ref<String> | function(*): string} [$message]
 * @property {Object | Ref<Object>} [$params]
 * @property {Object | Ref<Object>} [$async]
 * @property {Ref<*>[]} [$watchTargets]
 */

/**
 * Response form a raw Validator function.
 * Should return a Boolean or an object with $invalid property.
 * @typedef {Boolean | { $valid: Boolean }} ValidatorResponse
 */

/**
 * Raw validator function, before being normalized
 * Can return a Promise or a {@see ValidatorResponse}
 * @typedef {function(*): ((Promise<ValidatorResponse> | ValidatorResponse))} Validator
 */

/**
 * Sorts the validators for a state tree branch
 * @param {Object<NormalizedValidator|Function>} validationsRaw
 * @return {{ rules: Object<NormalizedValidator>, nestedValidators: Object, config: GlobalConfig }}
 */
function sortValidations (validationsRaw = {}) {
  const validations = unwrap(validationsRaw)
  const validationKeys = Object.keys(validations)

  const rules = {}
  const nestedValidators = {}
  const config = {}

  validationKeys.forEach(key => {
    const v = validations[key]

    switch (true) {
      // If it is already normalized, use it
      case isFunction(v.$validator):
        rules[key] = v
        break
      // If it is just a function, normalize it first
      // into { $validator: <Fun> }
      case isFunction(v):
        rules[key] = { $validator: v }
        break
      // Catch $-prefixed properties as config
      case key.startsWith('$'):
        config[key] = v
        break
      // If it doesn’t match any of the above,
      // treat as nestedValidators state property
      default:
        nestedValidators[key] = v
    }
  })

  return { rules, nestedValidators, config }
}

/**
 * Calls a validation rule by unwrapping its value first from a ref.
 * @param {Validator} rule
 * @param {Ref} value
 * @param {VueInstance} instance
 * @return {Promise<ValidatorResponse> | ValidatorResponse}
 */
function callRule (rule, value, instance) {
  const v = unwrap(value)
  return rule.call(instance, v, instance)
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
 * @return {{ $invalid: Ref<Boolean>, $unwatch: WatchStopHandle }}
 */
function createAsyncResult (rule, model, $pending, $dirty, { $lazy }, $response, instance, watchTargets = []) {
  const $invalid = ref(!!$dirty.value)
  const $pendingCounter = ref(0)

  $pending.value = false

  const $unwatch = watch(
    [model, $dirty].concat(watchTargets),
    () => {
      if ($lazy && !$dirty.value) return false
      let ruleResult
      // make sure we dont break if a validator throws
      try {
        ruleResult = callRule(rule, model, instance)
      } catch (err) {
        // convert to a promise, so we can handle it async
        ruleResult = Promise.reject(err)
      }

      $pendingCounter.value++
      $pending.value = !!$pendingCounter.value
      $invalid.value = true

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
 * @return {{$unwatch: (function(): {}), $invalid: ComputedRef<boolean>}}
 */
function createSyncResult (rule, model, $dirty, { $lazy }, $response, instance) {
  const $unwatch = () => ({})
  const $invalid = computed(() => {
    if ($lazy && !$dirty.value) return false
    try {
      const result = callRule(rule, model, instance)
      $response.value = result
      return normalizeValidatorResponse(result)
    } catch (err) {
      $response.value = err
    }
    return true
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
 * @return {{ $params: *, $message: Ref<String>, $pending: Ref<Boolean>, $invalid: Ref<Boolean>, $response: Ref<*>, $unwatch: WatchStopHandle }}
 */
function createValidatorResult (rule, model, $dirty, config, instance, validatorName, propertyKey, propertyPath) {
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
      rule.$watchTargets
    ))
  } else {
    ({ $invalid, $unwatch } = createSyncResult(
      rule.$validator,
      model,
      $dirty,
      config,
      $response,
      instance
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
 * @return {ValidationResult | {}}
 */
function createValidationResults (rules, model, key, resultsCache, path, config, instance, externalResults) {
  // collect the property keys
  const ruleKeys = Object.keys(rules)

  const cachedResult = resultsCache.get(path, rules)
  let $dirty = ref(false)

  if (cachedResult) {
    // if the rules are the same as before, use the cached results
    if (!cachedResult.$partial) return cachedResult
    // remove old watchers
    cachedResult.$unwatch()
    // use the `$dirty.value`, so we dont save references by accident
    $dirty.value = cachedResult.$dirty.value
  }

  const result = {
    // restore $dirty from cache
    $dirty,
    $path: path,
    $touch: () => { if (!$dirty.value) $dirty.value = true },
    $reset: () => { if ($dirty.value) $dirty.value = false }
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
      path
    )
  })

  result.$externalResults = computed(() => {
    if (!externalResults.value) return []
    return [].concat(externalResults.value).map((stringError, index) => ({
      $propertyPath: path,
      $property: key,
      $validator: '$externalResults',
      $uid: `${path}-${index}`,
      $message: stringError,
      $params: {},
      $response: null,
      $pending: false
    }))
  })

  result.$invalid = computed(() =>
    !!result.$externalResults.value.length ||
    ruleKeys.some(ruleKey => unwrap(result[ruleKey].$invalid))
  )

  result.$pending = computed(() =>
    ruleKeys.some(ruleKey => unwrap(result[ruleKey].$pending))
  )

  result.$error = computed(() =>
    result.$invalid.value && result.$dirty.value
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
 * @return {{}}
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
 * @param {Object.<string, ValidationResult>[]} nestedResults
 * @param {Object.<string, ValidationResult>[]} childResults
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

  const $error = computed(() => ($invalid.value && $dirty.value) || false)

  const $touch = () => {
    // call the root $touch
    results.$touch()
    // call all nested level $touch
    allResults.value.forEach((result) => {
      result.$touch()
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
    $silentErrors
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
 * @param {Object<ValidationResult>} [params.childResults] - Used to collect child results.
 * @param {ResultsStorage} params.resultsCache - The cached validation results
 * @param {VueInstance} params.instance - The current Vue instance
 * @param {GlobalConfig} params.globalConfig - The validation config, passed to this setValidations instance.
 * @param {Reactive<object> | Ref<Object>} params.externalResults - External validation results
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
  const { rules, nestedValidators, config } = sortValidations(validations)
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
  const results = createValidationResults(rules, nestedState, key, resultsCache, path, mergedConfig, instance, nestedExternalResults)
  // Use nested keys to repeat the process
  // *WARN*: This is recursive
  const nestedResults = collectNestedValidationResults(nestedValidators, nestedState, path, resultsCache, mergedConfig, instance, nestedExternalResults)

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
    $silentErrors
  } = createMetaFields(results, nestedResults, childResults)

  /**
   * If we have no `key`, this is the top level state
   * We dont need `$model` there.
   */
  const $model = key ? computed({
    get: () => unwrap(nestedState),
    set: val => {
      $dirty.value = true
      const s = unwrap(state)
      if (isRef(s[key])) {
        s[key].value = val
      } else {
        s[key] = val
      }
    }
  }) : null

  if (key && mergedConfig.$autoDirty) {
    const $unwatch = watch(nestedState, () => {
      const autoDirtyPath = `_${path}_$watcher_`
      const cachedAutoDirty = resultsCache.get(autoDirtyPath, {})
      if (!$dirty.value) $touch()
      if (cachedAutoDirty) cachedAutoDirty.$unwatch()
      resultsCache.set(autoDirtyPath, {}, { $unwatch })
    }, { flush: 'sync' })
  }

  /**
   * Executes the validators and returns the result.
   * @return {Promise<boolean>}
   */
  function $validate () {
    return new Promise(async (resolve) => {
      if (!$dirty.value) $touch()
      // await the watchers
      await nextTick()
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
    // if there are no child results, we are inside a nested property
    ...(childResults && {
      $getResultsForChild,
      $validate,
      $clearExternalResults
    }),
    // add each nested property's state
    ...nestedResults
  })
}
