export default class ResultsStorage {
  constructor (id) {
    this.id = id
    this.storage = new Map()
  }

  set (path, rules, result) {
    this.storage.set(path, { rules, result })
  }

  get (path, rules) {
    const storedRuleResultPair = this.storage.get(path)
    if (!storedRuleResultPair) return undefined

    const { rules: storedRules, result } = storedRuleResultPair

    const storedRulesKeys = Object.keys(storedRules)
    const newRulesKeys = Object.keys(rules)

    if (newRulesKeys.length !== storedRulesKeys.length) return { $dirty: result.$dirty, $partial: true }

    const hasAllValidators = newRulesKeys.every(ruleKey => storedRulesKeys.includes(ruleKey))
    if (!hasAllValidators) return { $dirty: result.$dirty, $partial: true }

    const hasSameParams = newRulesKeys.every(ruleKey => {
      if (!rules[ruleKey].$params) return true
      Object.keys(rules[ruleKey].$params).every(paramKey => {
        return storedRules[ruleKey].$params[paramKey] === rules[ruleKey].$params[paramKey]
      })
    })
    if (!hasSameParams) return { $dirty: result.$dirty, $partial: true }

    return result
  }
}
