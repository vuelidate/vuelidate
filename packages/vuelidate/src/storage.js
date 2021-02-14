export default class ResultsStorage {
  constructor () {
    this.storage = new Map()
  }

  /**
   * Stores a validation result, and its rules by its path
   * @param {String} path
   * @param {Object<NormalizedValidator>} rules
   * @param {ValidationResult} result
   */
  set (path, rules, result) {
    this.storage.set(path, { rules, result })
  }

  invalidateValidatorAt (path) {
    const storedRuleResultPair = this.storage.get(path)
    if (!storedRuleResultPair) return undefined

    const { result } = storedRuleResultPair

    this.storage.set(path, {
      rules: {},
      result: {
        $dirty: result.$dirty,
        $unwatch: () => {}
      }
    })
  }

  /**
   * Check if the stored `results` for the provided `path` have the same `rules` compared to 'storedRules'
   * @param {String} path
   * @param {Object<NormalizedValidator>} rules
   * @param {Object<NormalizedValidator>} storedRules
   * @return {Boolean}
   */
  checkRulesValidity (path, rules, storedRules) {
    const storedRulesKeys = Object.keys(storedRules)
    const newRulesKeys = Object.keys(rules)

    if (newRulesKeys.length !== storedRulesKeys.length) return false

    const hasAllValidators = newRulesKeys.every(ruleKey => storedRulesKeys.includes(ruleKey))
    if (!hasAllValidators) return false

    const hasSameParams = newRulesKeys.every(ruleKey => {
      if (!rules[ruleKey].$params) return true
      Object.keys(rules[ruleKey].$params).every(paramKey => {
        return storedRules[ruleKey].$params[paramKey] === rules[ruleKey].$params[paramKey]
      })
    })
    if (!hasSameParams) return false
    return true
  }

  /**
   * Returns the matched result if catche is valid
   * @param {String} path
   * @param {Object<NormalizedValidator>} rules
   * @return {{$partial: boolean, $dirty: Ref<boolean>}|undefined|ValidationResult}
   */
  get (path, rules) {
    const storedRuleResultPair = this.storage.get(path)
    if (!storedRuleResultPair) return undefined
    const { rules: storedRules, result } = storedRuleResultPair

    const isValidCache = this.checkRulesValidity(path, rules, storedRules)

    if (!isValidCache) return { $dirty: result.$dirty, $partial: true, $unwatch: result.$unwatch }
    return result
  }
}
