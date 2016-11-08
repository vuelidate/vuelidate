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

          _validations[model] = validateModel(rules, this[model])
          _validations.$invalid = Object.keys(_validations).some(rule => _validations[rule].$invalid)
          return _validations
        }, { $invalid: false })

        return $validations
      }
    }
  })
}

export default Validation

export { Validation }

function validateModel (rules, value) {
  return Object.keys(rules).reduce((results, rule) => {
    const isValid = rules[rule](value)

    results[rule] = isValid
    results.$invalid = !isValid || results.$invalid
    return results
  }, { $invalid: false })
}

function isFunction (f) {
  return typeof f === 'function'
}

function getRules (rules, context) {
  if (Array.isArray(rules)) {
    // TODO: Handle rules in array
  }

  return isFunction(rules)
    ? rules.call(context)
    : rules
}
