import { isFunction, isPromise, unwrap, unwrapObj } from './utils'
import { computed, isReactive, isRef, reactive, ref, watch } from 'vue-demi'

/**
 * @typedef NormalizedValidator
 * @property {Validator} $validator
 * @property {String | Ref<String> | function(*): string} [$message]
 * @property {Object | Ref<Object>} [$params]
 */

/**
 * Response form a raw Validator function.
 * Should return a Boolean or an object with $invalid property.
 * @typedef {Boolean | { $invalid: Boolean }} ValidatorResponse
 */

/**
 * Raw validator function, before being normalized
 * Can return a Promise or a {@see ValidatorResponse}
 * @typedef {function(*): ((Promise<ValidatorResponse> | ValidatorResponse))} Validator
 */

/**
 * Sorts the validators for a state tree branch
 * @param {Object<NormalizedValidator|Function>} validationsRaw
 * @return {{ rules: Object<NormalizedValidator>, nestedValidators: Object, config: Object }}
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
 * Calls a validation rule by unwrapping it's value first from a ref.
 * @param {Validator} rule
 * @param {Ref} value
 * @return {Promise<ValidatorResponse> | ValidatorResponse}
 */
function callRule (rule, value) {
  const v = unwrap(value)
  return rule(v)
}

/**
 * Normalizes the validator result
 * Allows passing a boolean of an object like `{ $invalid: Boolean }`
 * @param {ValidatorResponse} result - Validator result
 * @return {Boolean}
 */
function normalizeValidatorResponse (result) {
  return result.$invalid !== undefined
    ? !result.$invalid
    : !result
}

/**
 * Returns the result of the validator every time the model changes.
 * Wraps the call in a computed property.
 * Used for with normal functions.
 * TODO: This allows a validator to return $invalid, probably along with other parameters. We do not utilize them ATM.
 * @param {Validator} rule
 * @param {Ref<*>} model
 * @param {Ref<boolean>} $dirty
 * @param {Object} config
 * @return {Ref<Boolean>}
 */
function createComputedResult (rule, model, $dirty, { $lazy }) {
  return computed(() => {
    // if $dirty is false, we dont validate at all.
    // TODO: Make this optional, this is a huge breaking change
    if ($lazy && !$dirty.value) return false
    let result = callRule(rule, unwrap(model))
    // if it returns a promise directly, error out
    if (isPromise(result)) {
      throw Error('[vuelidate] detected a raw async validator. Please wrap any async validators in the `withAsync` helper.')
    }
    return normalizeValidatorResponse(result)
  })
}

/**
 * Returns the result of an async validator.
 * @param {Function} rule
 * @param {Ref<*>} model
 * @param {Ref<Boolean>} $pending
 * @param {Ref<Boolean>} $dirty
 * @param {Object} config
 * @return {Ref<Boolean>}
 */
function createAsyncResult (rule, model, $pending, $dirty, { $lazy }) {
  const $invalid = ref(!!$dirty.value)
  const $pendingCounter = ref(0)

  $pending.value = false

  watch(
    [model, $dirty],
    modelValue => {
      if ($lazy && !$dirty.value) return false
      const ruleResult = callRule(rule, model)

      $pendingCounter.value++
      $pending.value = !!$pendingCounter.value
      $invalid.value = true

      ruleResult
        .then(data => {
          $pendingCounter.value--
          $pending.value = !!$pendingCounter.value
          $invalid.value = normalizeValidatorResponse(data)
        })
        .catch(() => {
          $pendingCounter.value--
          $pending.value = !!$pendingCounter.value
          $invalid.value = true
        })
    },
    { flush: 'sync' }
  )

  return $invalid
}

/**
 * Returns the validation result.
 * Detects async and sync validators.
 * @param {NormalizedValidator} rule
 * @param {Ref<*>} modelValue
 * @return {{$params: *, $message: Ref<String>, $pending: Ref<Boolean>, $invalid: Ref<Boolean>}}
 */
function createValidatorResult (rule, modelValue, $dirty, config) {
  const $pending = ref(false)
  const $params = rule.$params || {}
  const $invalid = rule.$async
    ? createAsyncResult(
      rule.$validator,
      modelValue,
      $pending,
      $dirty,
      config
    )
    : createComputedResult(rule.$validator, modelValue, $dirty, config)

  const message = rule.$message
  const $message = isFunction(message)
    ? computed(() =>
      message(
        unwrapObj({
          $pending,
          $invalid,
          $params: unwrapObj($params), // $params can hold refs, so we unwrap them for easy access
          $model: modelValue
        })
      ))
    : message || ''

  return {
    $message,
    $params,
    $pending,
    $invalid
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
 */

/**
 * @typedef ValidationResult
 * @property {Ref<Boolean>} $pending
 * @property {Ref<Boolean>} $dirty
 * @property {Ref<Boolean>} $invalid
 * @property {Ref<Boolean>} $error
 * @property {Function} $touch
 * @property {Function} $reset
 * @property {Ref<ErrorObject[]>} $errors
 */

/**
 * Creates the main Validation Results object for a state tree
 * Walks the tree's top level branches
 * @param {Object<NormalizedValidator>} rules - Rules for the current state tree
 * @param {Object} modelValue - Current state tree
 * @param {String} key - Key for the current state tree
 * @param {Map} [resultsCache] - A cache map of all the validators
 * @param {String} [path] - the current property path
 * @return {ValidationResult | {}}
 */
function createValidationResults (rules, modelValue, key, resultsCache, path, config) {
  // collect the property keys
  const ruleKeys = Object.keys(rules)

  const cachedResult = resultsCache.get(path, rules)
  let $dirty = ref(false)

  if (cachedResult) {
    if (!cachedResult.$partial) return cachedResult
    $dirty = cachedResult.$dirty
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
  if (!ruleKeys.length) return result

  ruleKeys.forEach(ruleKey => {
    result[ruleKey] = createValidatorResult(
      rules[ruleKey],
      modelValue,
      result.$dirty,
      config
    )
  })

  result.$invalid = computed(() =>
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
        $message: res.$message,
        $params: res.$params,
        $pending: res.$pending
      })
    })
  )

  result.$errors = computed(() => result.$dirty.value
    ? result.$silentErrors.value
    : []
  )

  resultsCache.set(path, rules, result)

  return result
}

/**
 * create protected state for cases when the state branch does not exist yet.
 * This protects when using the OptionsAPI as the data is LINKED after the setup
 * method
 * @param {Object} state
 * @param {string} key
 * @returns {Ref<*>>|ComputedRef<*>}
 */
function getNestedState (state, key) {
  const s = unwrap(state)

  if (!s) {
    return computed(() => {
      const s = unwrap(state)
      return s ? s[key] : undefined
    })
  }

  if (isRef(s[key]) || isReactive(s[key])) return s[key]

  return computed(() => {
    return unwrap(state)[key]
  })
}

/**
 * Collects the validation results of all nested state properties
 * @param {Object<NormalizedValidator|Function>} validations - The validation
 * @param {Object} nestedState - Current state
 * @param {String} [key] - Parent level state key
 * @param {String} path - Path to current property
 * @param {Map} resultsCache - Validations cache map
 * @return {{}}
 */
function collectNestedValidationResults (validations, nestedState, key, path, resultsCache, config) {
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
      globalConfig: config
    })
    return results
  }, {})
}

/**
 * Generates the Meta fields from the results
 * @param {ValidationResult|{}} results
 * @param {Object<ValidationResult>[]} nestedResults
 * @param {Object<ValidationResult>[]} childResults
 * @return {{$anyDirty: Ref<Boolean>, $error: Ref<Boolean>, $invalid: Ref<Boolean>, $errors: Ref<ErrorObject[]>, $dirty: Ref<Boolean>, $touch: Function, $reset: Function }}
 */
function createMetaFields (results, nestedResults, childResults, path) {
  // use the $dirty property from the root level results
  const $dirty = results.$dirty

  const allResults = computed(() => [nestedResults, childResults]
    .filter(res => res)
    .reduce((allRes, res) => {
      return allRes.concat(Object.values(unwrap(res)))
    }, [])
  )

  const $silentErrors = computed(() => {
    // current state level errors, fallback to empty array if root
    const modelErrors = unwrap(results.$silentErrors) || []

    // collect all nested and child $silentErrors
    const nestedErrors = allResults.value
      .filter(result => unwrap(result).$silentErrors.length)
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
      .filter(result => unwrap(result).$errors.length)
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
    // $dirty.value = true
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

  // Ensure that if all child and nester results are $dirty, this also becomes $dirty
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
 * @property {Boolean} $anyDirty
 * @property {Boolean} $error
 * @property {Boolean} $pending
 * @property {Boolean} $invalid
 * @property {ErrorObject[]} $errors
 * @property {*} [$model]
 * @property {Function} $touch
 * @property {Boolean} $dirty
 * @property {Function} $reset
 * @property {Function} $validate
 * @property {Function} $getResultsForChild
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
 * @param {Map} resultsCache - The cached validation results
 * @return {UnwrapRef<VuelidateState>}
 */
export function setValidations ({
  validations,
  state,
  key,
  parentKey,
  childResults,
  resultsCache,
  globalConfig = {}
}) {
  console.log('setValidations', state, key)
  const path = parentKey ? `${parentKey}.${key}` : key

  // Sort out the validation object into:
  // – rules = validators for current state tree fragment
  // — nestedValidators = nested state fragments keys that might contain more validators
  // – config = configuration properties that affect this state fragment
  const { rules, nestedValidators, config } = sortValidations(validations)
  const mergedConfig = { ...globalConfig, ...config }

  const nestedState = key ? getNestedState(state, key) : state

  // Use rules for the current state fragment and validate it
  const results = createValidationResults(rules, nestedState, key, resultsCache, path, mergedConfig)
  // Use nested keys to repeat the process
  // *WARN*: This is recursive
  const nestedResults = collectNestedValidationResults(nestedValidators, nestedState, key, path, resultsCache, mergedConfig)

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
  } = createMetaFields(results, nestedResults, childResults, path || '__root')

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

  if (mergedConfig.$autoDirty) {
    const watchTarget = nestedState
    watch(watchTarget, () => {
      if (!$dirty.value) $touch()
    })
  }

  /**
   * Executes the validators and returns the result. Doesn’t work with $lazy: true
   * @param {boolean} silent - when true, won’t trigger $dirty state
   * @return {VuelidateState}
   */
  function $validate ({ silent = false } = {}) {
    return new Promise((resolve) => {
      if (!silent && !$dirty.value) $touch()
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
    $path: path || '__root',
    $silentErrors,
    // if there are no child results, we are inside a nested property
    ...(childResults && {
      $getResultsForChild,
      $validate
    }),
    // add each nested property's state
    ...nestedResults
  })
}
