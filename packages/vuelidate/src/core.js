import { isFunction, isPromise, paramToRef, unwrap, unwrapObj } from './utils'
import { computed, reactive, ref, watch, toRefs } from 'vue'

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
 * @return {{ rules: Ref<Object<NormalizedValidator>>, nestedValidators: Ref<Object>, config: Ref<Object> }}
 */
function sortValidations (validations) {
  let rules = ref({})
  let nestedValidators = ref({})
  let config = ref({})

  watch(validations, (changedValidations) => {
    // rules.value = {}
    // nestedValidators.value = {}
    // config.value = {}

    Object.entries(changedValidations).forEach(([key, v]) => {
      if (isFunction(v.$validator)) {
        rules.value[key] = v
      } else if (isFunction(v)) {
        rules.value[key] = { $validator: v }
      } else if (key.startsWith('$')) {
        config.value[key] = v
      } else {
        nestedValidators.value[key] = v
      }
    })
  }, { flush: 'sync', deep: true })

  return { rules, nestedValidators, config }
}

/**
 * Calls a validation rule by unwrapping it's value first from a ref.
 * @param {Validator} rule
 * @param {Ref} value
 * @return {Promise<ValidatorResponse> | ValidatorResponse}
 */
let count = 0

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
 * @param {Ref<Boolean>} $pending
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
    // we set lazy: true to stop watcher eager invocation
    { lazy: true }
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
function createValidatorResult (rule, state, key) {
  const ruleResult = callRule(rule.$validator, state[key])

  const $pending = ref(false)
  const $params = rule.$params || {}
  const $invalid = isPromise(ruleResult)
    ? createAsyncResult(
      rule.$validator,
      state[key],
      ruleResult,
      $pending
    )
    : createComputedResult(rule.$validator, state[key])

  const message = rule.$message
  const $message = isFunction(message)
    ? computed(() =>
      message(
        unwrapObj({
          $pending,
          $invalid,
          $params: unwrapObj($params), // $params can hold refs, so we unwrap them for easy access
          $model: state[key]
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
function createValidationResults (rules, state, key, parentKey) {
  // collect the property keys
  const $dirty = ref(false)

  const results = {
    $dirty,
    $touch: () => { $dirty.value = true },
    $reset: () => { $dirty.value = false }
  }

  watch(rules, (changedRules) => {
    /**
     * If there are no validation rules, it is most likely
     * a top level state, aka root
     */
    const ruleKeys = Object.keys(changedRules)
    // if (!ruleKeys.length) return result
    ruleKeys.forEach(ruleKey => {
      results[ruleKey] = createValidatorResult(
        changedRules[ruleKey],
        state,
        key
      )
    })

    results.$invalid = computed(() =>
      ruleKeys.some(ruleKey => results[ruleKey].$invalid.value)
    )
    results.$pending = computed(() =>
      ruleKeys.some(ruleKey => results[ruleKey].$pending.value)
    )
    results.$error = computed(() =>
      results.$invalid.value && $dirty.value
    )
    results.$errors = computed(() => ruleKeys
      .filter(ruleKey => results[ruleKey].$invalid.value)
      .map(ruleKey => {
        const res = results[ruleKey]
        return reactive({
          $propertyPath: parentKey ? `${parentKey}.${key}` : key,
          $property: key,
          $validator: ruleKey,
          $message: res.$message,
          $params: res.$params,
          $pending: res.$pending
        })
      })
    )
  }, { flush: 'sync', deep: true })

  return results
}

/**
 * Collects the validation results of all nested state properties
 * @param {Object<NormalizedValidator|Function>} validations - The validation
 * @param {Object} state - Parent state
 * @param {String} [key] - Parent level state key
 * @return {{}}
 */
function collectNestedValidationResults (validations, state, key) {
  const collected = ref({})

  watch(validations, (changedValidations) => {
    const nestedValidationKeys = Object.keys(changedValidations)
    // if we have no state, return empty object
    if (!nestedValidationKeys.length) return

    collected.value = nestedValidationKeys.reduce((results, nestedKey) => {
      // if we have a key, use the nested state
      // else use top level state
      const nestedState = key ? state[key] : state
      // build validation results for nested state
      results[nestedKey] = setValidations({
        validations: changedValidations[nestedKey],
        state: nestedState,
        key: nestedKey,
        parentKey: key
      })
      return results
    }, {})
  }, { flush: 'sync', deep: true })

  return collected
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
      .filter(result => result.$errors.value.length)
      .reduce((errors, result) => {
        return errors.concat(...result.$errors.value)
      }, [])

    // merge the $errors
    return modelErrors.concat(nestedErrors)
  })

  const $invalid = computed(() =>
    // if any of the nested values is invalid
    allResults.value.some(r => r.$invalid.value) ||
    // or if the current state is invalid
    unwrap(results.$invalid) ||
    // fallback to false if is root
    false
  )

  const $pending = computed(() =>
    // if any of the nested values is pending
    allResults.value.some(r => r.$pending.value) ||
    // if any of the current state validators is pending
    unwrap(results.$pending) ||
    // fallback to false if is root
    false
  )

  const $anyDirty = computed(() =>
    allResults.value.some(r => r.$dirty.value)
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
export function setValidations ({ validations, state, key, parentKey, childResults }) {
  // Sort out the validation object into:
  // – rules = validators for current state tree fragment
  // — nestedValidators = nested state fragments keys that might contain more validators
  // – config = configuration properties that affect this state fragment
  const { rules, nestedValidators, config } = sortValidations(paramToRef(validations))

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
    $error,
    $pending,
    $touch,
    $reset
  } = createMetaFields(results, nestedResults, childResults)

  /**
   * If we have no `key`, this is the top level state
   * We dont need `$model` there.
   */
  let $model = key ? computed({
    get: () => unwrap(state[key]),
    set: val => {
      $dirty.value = true
      state[key].value = val
    }
  }) : null

  if (config.value.$autoDirty) {
    watch(
      state[key],
      () => { $dirty.value = true },
      // we set lazy: true to stop watcher eager invocation
      { lazy: true }
    )
  }

  return computed(() => Object.assign({}, results, {
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
    $reset
    // add each nested property's state
  }, nestedResults.value))
}
