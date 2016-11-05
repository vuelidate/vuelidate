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
          const rules = validations[key].call(this)
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
