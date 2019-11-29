import { isFunction, isPromise, unwrap, unwrapObj } from './utils'
import { computed, reactive, ref, watch } from '@vue/composition-api'

function sortValidations (validations) {
  const validationKeys = Object.keys(validations)

  let rules = {}
  let nested = {}
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
      // treat as nested state property
      default:
        nested[key] = v
    }
  })

  return { rules, nested, config }
}

function callRule (rule, value) {
  const v = unwrap(value)
  return rule(v)
}

function createComputedResult (rule, model) {
  return computed(() => {
    const result = callRule(rule, model)
    return result.$invalid !== undefined
      ? result.$invalid
      : !result
  })
}

function createAsyncResult (rule, model, initResult, $pending) {
  const $invalid = ref(true)

  $pending.value = true

  initResult.then(data => {
    $pending.value = false
    $invalid.value = !data
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

function collectNestedValidationResults (validations, state, key) {
  const nestedValidationKeys = Object.keys(validations)

  if (!nestedValidationKeys.length) return {}

  return nestedValidationKeys.reduce((results, nestedKey) => {
    const nestedState = key ? state[key] : state

    results[nestedKey] = setValidations({
      validations: validations[nestedKey],
      state: nestedState,
      key: nestedKey,
      parentKey: key
    })
    return results
  }, {})
}

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
 * Main Vuelidate bootstrap function.
 * Used both for Composition API in `setup` and for Global App usage
 * @param {Object} validations
 * @param {Object} state
 * @param {String} key - Current state key. Used when being called on nested items
 * @param parentKey
 * @param childResults
 * @return {UnwrapRef<{$anyDirty: *, $error: *, $pending?: (), $invalid: *, $errors: *, $touch?: (), $dirty: *, $reset?: ()}>}
 */
export function setValidations ({ validations, state, key, parentKey, childResults }) {
  // Sort out the validation object into:
  // – rules = validators for current state tree fragment
  // — nested = nested state fragments keys that might contain more validators
  // – config = configuration properties that affect this state fragment
  const { rules, nested, config } = sortValidations(validations)

  // Use rules for the current state fragment and validate it
  const results = createValidationResults(rules, state, key, parentKey)

  // Use nested keys to repeat the process
  // *WARN*: This is recursive
  const nestedResults = collectNestedValidationResults(nested, state, key)

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
