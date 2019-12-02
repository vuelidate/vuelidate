import { isFunction, isPromise, unwrap, unwrapObj } from './utils'
import { computed, reactive, ref, watch } from '@vue/composition-api'

/**
 * @typedef NormalizedValidator
 * @property {Validator} $validator
 * @property {Ref<String>} $message
 * @property {Ref<Object>} $params
 */

/**
 * Response form a raw Validator function.
 * Should return a Boolean or an object with $invalid property.
 * @typedef {Boolean | { $invalid: Boolean }} ValidatorResponse
 */

/**
 * Raw validator function, before being normalized
 * Can return a Promise or a {@see ValidatorResponse}
 * @typedef {function(model): ((Promise<ValidatorResponse> | ValidatorResponse))} Validator
 */

/**
 * Sorts the validators for a state tree branch
 * @param {Object<NormalizedValidator|Function>} validations
 * @return {{ rules: Object<NormalizedValidator>, nestedValidators: Object, config: Object }}
 */
function sortValidations (validations) {
  const validationKeys = Object.keys(validations)

  let rules = {}
  let nestedValidators = {}
  let config = {}

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
 * @return {Ref<Boolean>}
 */
function createComputedResult (rule, model) {
  return computed(() => {
    const result = callRule(rule, model)
    return normalizeValidatorResponse(result)
  })
}

/**
 * Returns the result of an async validator.
 * @param {Function} rule
 * @param {Ref<*>} model
 * @param {Promise<Boolean>} initResult
 * @param $pending
 * @return {Ref<Boolean>}
 */
function createAsyncResult (rule, model, initResult, $pending) {
  const $invalid = ref(true)

  $pending.value = true

  initResult.then(data => {
    $pending.value = false
    $invalid.value = normalizeValidatorResponse(data)
  })

  watch(
    model,
    modelValue => {
      const ruleResult = callRule(rule, modelValue)

      $pending.value = true
      $invalid.value = true

      ruleResult
        .then(data => {
          $pending.value = false
          $invalid.value = !data
        })
        .catch(() => {
          $pending.value = false
          $invalid.value = true
        })
    },
    { lazy: true }
  )

  return $invalid
}

/**
 *
 * @param {NormalizedValidator} rule
 * @param {*} model
 * @return {{$params: *, $message: *, $pending: *, $invalid: *}}
 */
function createValidatorResult (rule, model) {
  const ruleResult = callRule(rule.$validator, model)

  const $pending = ref(false)
  const $params = rule.$params
  const $invalid = isPromise(ruleResult)
    ? createAsyncResult(
      rule.$validator,
      model,
      ruleResult,
      $pending
    )
    : createComputedResult(rule.$validator, model)

  const message = rule.$message
  const $message = isFunction(message)
    ? computed(() => message(
      unwrapObj({
        $pending,
        $invalid,
        $params,
        $model: model
      })
    ))
    : message

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
 * @property {String} $property - Dot notation path to state
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
 * @param {Object<NormalizedValidator>} rules - Rules for the current state tree
 * @param {Object} state - Current state tree
 * @param {String} key - Key for the current state tree
 * @param {String} [parentKey] - Parent key of the state. Optional
 * @return {ValidationResult | {}}
 */
function createValidationResults (rules, state, key, parentKey) {
  const ruleKeys = Object.keys(rules)
  if (!ruleKeys.length) return {}

  const $dirty = ref(false)

  let result = {
    $dirty,
    $touch: () => { $dirty.value = true },
    $reset: () => { $dirty.value = false },
    $pending: ref(false)
  }

  ruleKeys.forEach(ruleKey => {
    result[ruleKey] = createValidatorResult(
      rules[ruleKey],
      state[key]
    )
  })

  result.$invalid = computed(() =>
    ruleKeys.some(ruleKey => result[ruleKey].$invalid)
  )

  result.$error = computed(() =>
    result.$invalid.value && $dirty.value
  )

  result.$errors = computed(() => ruleKeys
    .filter(ruleKey => unwrap(result[ruleKey]).$invalid)
    .map(ruleKey => {
      const res = result[ruleKey]
      return {
        $property: parentKey ? `${parentKey}.${key}` : key,
        $validator: ruleKey,
        $message: res.$message,
        $params: res.$params,
        $pending: res.$pending
      }
    })
  )

  return result
}

/**
 * Collects the validation results of all nested state properties
 * @param {Object<NormalizedValidator|Function>} validations - The validation
 * @param {Object} state - Parent state
 * @param {String} [key] - Parent level state key
 * @return {{}}
 */
function collectNestedValidationResults (validations, state, key) {
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
      parentKey: key
    })
    return results
  }, {})
}

/**
 * Generates the Meta fields from the results
 * @param {ValidationResult|{}} results
 * @param {Object<ValidationResult>} nestedResults
 * @return {{$anyDirty: Ref<Boolean>, $error: Ref<Boolean>, $invalid: Ref<Boolean>, $errors: Ref<ErrorObject[]>, $dirty: Ref<Boolean>}}
 */
function createMetaFields (results, nestedResults) {
  const $dirty = ref(false)

  const $errors = computed(() => {
    const modelErrors = unwrap(results.$errors) || []

    const nestedErrors = Object.values(nestedResults)
      .filter(result => result.$errors.length)
      .reduce((errors, result) => {
        return errors.concat(...result.$errors)
      }, [])

    return modelErrors.concat(nestedErrors)
  })

  const $invalid = computed(() =>
    Object.values(nestedResults).some(r => r.$invalid) ||
    unwrap(results.$invalid) ||
    false
  )

  const $anyDirty = computed(() =>
    Object.values(nestedResults).some(r => r.$dirty)
  )

  const $error = computed(() => ($invalid.value && $dirty.value) || false)

  return {
    $dirty,
    $errors,
    $invalid,
    $anyDirty,
    $error
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
 * @param {Object<NormalizedValidator|Function>} validations
 * @param {Object} state
 * @param {String} [key] - Current state property key. Used when being called on nested items
 * @param {String} [parentKey] - Parent state property key. Used when being called recursively
 * @param {Object} [childResults] - Used to collect child results. TBD
 * @return {UnwrapRef<VuelidateState>}
 */
export function setValidations ({ validations, state, key, parentKey, childResults }) {
  // Sort out the validation object into:
  // – rules = validators for current state tree fragment
  // — nestedValidators = nested state fragments keys that might contain more validators
  // – config = configuration properties that affect this state fragment
  const { rules, nestedValidators, config } = sortValidations(validations)

  // Use rules for the current state fragment and validate it
  const results = createValidationResults(rules, state, key, parentKey)

  // Use nested keys to repeat the process
  // *WARN*: This is recursive
  const nestedResults = collectNestedValidationResults(nestedValidators, state, key)

  // Collect and merge this level validation results
  // with all nested validation results
  const {
    $dirty,
    $errors,
    $invalid,
    $anyDirty,
    $error
  } = createMetaFields(results, nestedResults)

  const $model = computed({
    get: () => unwrap(state[key]),
    set: val => {
      $dirty.value = true
      state[key].value = val
    }
  })

  if (config.$autoDirty) {
    watch(
      state[key],
      () => { $dirty.value = true },
      { lazy: true }
    )
  }

  return reactive({
    ...results,
    // NOTE: The order here is very important, since we want to override
    // some of the *results* meta fields with the collective version of it
    // that includes the results of nested state validation results
    ...(key ? { $model } : {}),
    $dirty,
    $error,
    $errors,
    $invalid,
    $anyDirty,
    ...nestedResults
  })
}
