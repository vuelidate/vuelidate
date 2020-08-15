import { isFunction, isPromise, unwrap, unwrapObj } from './utils'
import { computed, reactive, ref, watch, isRef, toRef } from '@vue/composition-api'

/**
 * @typedef NormalizedValidator
 * @property {Validator} $validator
 * @property {String | Ref<String> | function(*): string} [$message]
 * @property {Ref<Object>} [$params]
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
 * @param {Object<NormalizedValidator|Function>} validations
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
 * @return {Ref<Boolean>}
 */
function createComputedResult (rule, model, $dirty) {
  return computed(() => {
    // if $dirty is false, we dont validate at all.
    // TODO: Make this optional, this is a huge breaking change
    if (!$dirty.value) return false
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
 * @return {Ref<Boolean>}
 */
function createAsyncResult (rule, model, $pending, $dirty) {
  const $invalid = ref(!!$dirty.value)
  const $pendingCounter = ref(0)

  $pending.value = false

  watch(
    [model, $dirty],
    modelValue => {
      if (!$dirty.value) return false
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
 * @param {Object} state
 * @param {String} key
 * @return {{$params: *, $message: Ref<String>, $pending: Ref<Boolean>, $invalid: Ref<Boolean>}}
 */
function createValidatorResult (rule, state, key, $dirty) {
  const model = computed(() => {
    const s = unwrap(state)
    return s ? unwrap(s[key]) : null
  })

  const $pending = ref(false)
  const $params = rule.$params || {}
  const $invalid = rule.$async
    ? createAsyncResult(
      rule.$validator,
      model,
      $pending,
      $dirty
    )
    : createComputedResult(rule.$validator, model, $dirty)

  const message = rule.$message
  const $message = isFunction(message)
    ? computed(() =>
      message(
        unwrapObj({
          $pending,
          $invalid,
          $params: unwrapObj($params), // $params can hold refs, so we unwrap them for easy access
          $model: model
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
 * @param {Object} state - Current state tree
 * @param {String} key - Key for the current state tree
 * @param {String} [parentKey] - Parent key of the state. Optional
 * @return {ValidationResult | {}}
 */
function createValidationResults (rules, state, key, parentKey, resultsCache, path) {
  // collect the property keys
  const ruleKeys = Object.keys(rules)

  const cachedResult = resultsCache.get(path)

  const $dirty = ref(false)

  const result = {
    // restore $dirty from cache
    $dirty: cachedResult ? cachedResult.$dirty : $dirty,
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
      state,
      key,
      result.$dirty
    )
  })

  result.$invalid = computed(() =>
    ruleKeys.some(ruleKey => result[ruleKey].$invalid.value)
  )

  result.$pending = computed(() =>
    ruleKeys.some(ruleKey => result[ruleKey].$pending.value)
  )

  result.$error = computed(() =>
    result.$invalid.value && result.$dirty.value
  )

  result.$errors = computed(() => ruleKeys
    .filter(ruleKey => result[ruleKey].$invalid.value)
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

  resultsCache.set(path, result)

  return result
}

/**
 * Collects the validation results of all nested state properties
 * @param {Object<NormalizedValidator|Function>} validations - The validation
 * @param {Object} state - Parent state
 * @param {String} [key] - Parent level state key
 * @return {{}}
 */
function collectNestedValidationResults (validations, state, key, path, resultsCache) {
  const nestedValidationKeys = Object.keys(validations)

  // if we have no state, return empty object
  if (!nestedValidationKeys.length) return {}

  return nestedValidationKeys.reduce((results, nestedKey) => {
    // if we have a key, use the nested state
    // else use top level state
    const nestedState = key ? state[key] : state

    // build validation results for nested state
    results[nestedKey] = setValidations({
      validations: validations[nestedKey],
      state: nestedState,
      key: nestedKey,
      parentKey: key,
      resultsCache
    })
    return results
  }, {})
}

/**
 * Generates the Meta fields from the results
 * @param {ValidationResult|{}} results
 * @param {Object<ValidationResult>[]} otherResults
 * @return {{$anyDirty: Ref<Boolean>, $error: Ref<Boolean>, $invalid: Ref<Boolean>, $errors: Ref<ErrorObject[]>, $dirty: Ref<Boolean>, $touch: Function, $reset: Function }}
 */
function createMetaFields (results, ...otherResults) {
  // use the $dirty property from the root level results
  const $dirty = results.$dirty

  const allResults = computed(() => otherResults
    .filter(res => res)
    .reduce((allRes, res) => {
      return allRes.concat(Object.values(unwrap(res)))
    }, [])
  )

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
    allResults.value.some(r => r.$dirty) || $dirty.value
  )

  const $error = computed(() => ($invalid.value && $dirty.value) || false)

  const $touch = () => {
    // call the root $touch
    results.$touch()
    // call all nested level $touch
    Object.values(allResults.value).forEach((result) => {
      result.$touch()
    })
  }

  const $reset = () => {
    // reset the root $dirty state
    results.$reset()
    // reset all the children $dirty states
    Object.values(allResults.value).forEach((result) => {
      result.$reset()
    })
  }

  return {
    $dirty,
    $errors,
    $invalid,
    $anyDirty,
    $error,
    $pending,
    $touch,
    $reset
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
 * @property {Array} $errors
 * @property {Function} $reset
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
 * @param {Object} [params.childResults] - Used to collect child results. TBD
 * @return {UnwrapRef<VuelidateState>}
 */
export function setValidations ({
  validations,
  state,
  key,
  parentKey,
  childResults,
  resultsCache
}) {
  const path = parentKey ? `${parentKey}.${key}` : key
  // Sort out the validation object into:
  // – rules = validators for current state tree fragment
  // — nestedValidators = nested state fragments keys that might contain more validators
  // – config = configuration properties that affect this state fragment
  const { rules, nestedValidators, config } = sortValidations(validations)

  // Use rules for the current state fragment and validate it
  const results = createValidationResults(rules, state, key, parentKey, resultsCache, path)
  // Use nested keys to repeat the process
  // *WARN*: This is recursive
  const nestedResults = collectNestedValidationResults(nestedValidators, state, key, path, resultsCache)

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
    $reset
  } = createMetaFields(results, nestedResults, childResults)

  /**
   * If we have no `key`, this is the top level state
   * We dont need `$model` there.
   */

  const $model = key ? computed({
    get: () => unwrap(state[key]),
    set: val => {
      $dirty.value = true
      if (isRef(state[key])) {
        state[key].value = val
      } else {
        state[key] = val
      }
    }
  }) : null

  if (config.$autoDirty) {
    const watchTarget = isRef(state[key]) ? state[key] : toRef(state, key)
    watch(watchTarget, () => {
      if (!$dirty.value) $touch()
    })
  }

  let $validate = function $validate () {
    return new Promise((resolve) => {
      if (!$dirty.value) $touch()
      // return whether it is valid or not
      if (!$pending.value) return resolve(!$error.value)
      const unwatch = watch($pending, () => {
        resolve(!$error.value)
        unwatch()
      })
    })
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
    $validate,
    // add each nested property's state
    ...nestedResults
  })
}
