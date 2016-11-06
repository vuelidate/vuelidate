function Validation (Vue) {
  if (Validation.installed) return

  Vue.mixin({
    beforeCreate () {
      if (!this.$options.validations) return
      const validations = this.$options.validations

      if (typeof this.$options.computed === 'undefined') {
        this.$options.computed = {}
      }

      this.$options.computed.$validation = () => {
        return Object.keys(validations).reduce(($validations, key) => {
          const rules = getRules(validations[key], this)
          $validations[key] = Object.keys(rules).reduce((results, rule) => {
            results[rule] = rules[rule](this[key])
            return results
          }, {})
          return $validations
        }, {})
      }
    }
  })
}

export default Validation

export { Validation }

function isFunction (f) {
  return typeof f === 'function'
}

function getRules (rules, context) {
  return isFunction(rules)
    ? rules.call(context)
    : rules
}
