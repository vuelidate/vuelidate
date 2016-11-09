class ValidationState {
  $invalid = false
  $dirty = false

  setDirty (state = true) {
    this.$dirty = !!state
  }
}

function Validation (Vue) {
  if (Validation.installed) return

  Vue.mixin({
    beforeCreate () {
      if (!this.$options.validations) return
      const validations = this.$options.validations

      if (typeof this.$options.computed === 'undefined') {
        this.$options.computed = {}
      }

      this.$options.computed.$validations = () => {
        const $validations = Object.keys(validations).reduce((_validations, model) => {
          const rules = getRules(validations[model], this)

          _validations[model] = validateRuleset(rules, this[model])
          _validations.$invalid = Object.keys(_validations).some(rule => _validations[rule].$invalid)
          _validations.setDirty(Object.keys(_validations).some(rule => _validations[rule].$dirty))
          return _validations
        }, new ValidationState())

        return $validations
      }
    }
  })
}

export default Validation

export { Validation }

function validateRuleset (rules, value) {
  return Object.keys(rules).reduce((results, rule) => {
    const isValid = rules[rule](value)

    results[rule] = isValid
    results.$invalid = !isValid || results.$invalid
    return results
  }, new ValidationState())
}

function isFunction (f) {
  return typeof f === 'function'
}

function getRules (rules, context) {
  if (Array.isArray(rules)) {
    // TODO: Handle rules in array
  }

  rules = isFunction(rules)
    ? rules.call(context)
    : rules

  return rules
}
