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
    const hasAllValidators = newRulesKeys.every(ruleKey =>
      storedRulesKeys.includes(ruleKey)
    ) && newRulesKeys.length === storedRulesKeys.length

    if (hasAllValidators) return result
    return { $dirty: result.$dirty, $partial: true }
  }
}
