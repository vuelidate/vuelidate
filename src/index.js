// utilities
const constant = c => () => c
const buildFromKeys = (keys, fn, keyFn) => keys.reduce((build, key) => {
  build[keyFn ? keyFn(key) : key] = fn(key)
  return build
}, {})

function isObject (ruleset) {
  return ruleset !== null && typeof ruleset === 'object'
}

const getPath = (obj, path, fallback) => {
  if (typeof path === 'function') {
    return path.call(obj, fallback)
  }

  path = Array.isArray(path) ? path : path.split('.')
  for (var i = 0; i < path.length; i++) {
    if (isObject(obj)) {
      obj = obj[path[i]]
    } else {
      return fallback
    }
  }

  return typeof obj === 'undefined' ? fallback : obj
}

function setDirtyRecursive (newState) {
  this.dirty = newState
  const method = newState ? '$touch' : '$reset'
  const keys = this.dynamicKeys
  for (let i = 0; i < keys.length; i++) {
    const ruleOrNested = keys[i]
    const val = this[ruleOrNested]
    if (isObject(val)) {
      val[method]()
    }
  }
}

// vm static definition
const defaultMethods = {
  $touch () {
    setDirtyRecursive.call(this, true)
  },
  $reset () {
    setDirtyRecursive.call(this, false)
  }
}

const defaultComputed = {
  $invalid () {
    return this.dynamicKeys.some(ruleOrNested => {
      const val = this[ruleOrNested]
      return isObject(val) ? val.$invalid : !val
    })
  },
  $dirty () {
    if (this.dirty) {
      return true
    }
    const keys = this.dynamicKeys
    // iteration to trigger as little getters as possible
    let foundNested = false
    for (let i = 0; i < keys.length; i++) {
      const ruleOrNested = keys[i]
      const val = this[ruleOrNested]
      const isNested = isObject(val)
      foundNested = foundNested || isNested
      if (isNested && !val.$dirty) {
        return false
      }
    }
    return foundNested
  },
  $error () {
    return !!(this.$dirty && this.$invalid)
  }
}

const defaultMethodKeys = Object.keys(defaultMethods)
const defaultComputedKeys = Object.keys(defaultComputed)
const mapDynamicKeyName = k => 'v$$' + k
const proxyValidationGuard = '__isProxyValidation'

function isSingleRule (ruleset) {
  return typeof ruleset === 'function'
}

function isProxyVm (rule) {
  return rule[proxyValidationGuard] === true
}

function makeValidationVm (validations, parentVm, rootVm = parentVm, parentProp = null) {
  const validationKeys = Object.keys(validations).filter(key => !!validations[key])
  const dynamicKeys = validationKeys.map(mapDynamicKeyName)

  const computedRules = buildFromKeys(validationKeys, (key) => {
    const rule = validations[key]
    return mapValidator(rootVm, rule, key, parentVm, parentProp)
  }, mapDynamicKeyName)

  const Vue = rootVm.constructor
  const validationVm = new Vue({
    data: {
      dirty: false,
      dynamicKeys
    },
    methods: defaultMethods,
    computed: {
      ...computedRules,
      ...defaultComputed
    }
  })

  return proxyVm(validationVm, validationKeys)
}

function mapValidator (rootVm, rule, ruleKey, vm, vmProp) {
  if (isProxyVm(rule)) {
    return rule
  } else if (isSingleRule(rule)) {
    return mapRule(rootVm, rule, ruleKey, vm, vmProp)
  } else if (Array.isArray(rule)) {
    return mapGroup(rootVm, rule, ruleKey, vm, vmProp)
  } else {
    return mapChild(rootVm, rule, ruleKey, vm, vmProp)
  }
}

function mapRule (rootVm, rule, ruleKey, parentVm, prop) {
  return function () {
    return rule.call(rootVm, parentVm[prop], parentVm)
  }
}

function mapChild (rootVm, rules, ruleKey, parentVm, prop) {
  if (ruleKey === '$each') {
    return trackArray(rootVm, rules, parentVm, prop)
  }
  const childVm = typeof prop === 'string' ? parentVm[prop] : parentVm
  const vm = makeValidationVm(rules, childVm, rootVm, ruleKey)
  return constant(vm)
}

function trackArray (rootVm, eachRule, parentVm, prop) {
  let vmList = {}
  const strippedRule = {
    ...eachRule,
    $trackBy: undefined
  }

  return function () {
    const childVm = typeof prop === 'string' ? parentVm[prop] : parentVm
    const newKeys = Object.keys(childVm)
    const keyToTrack = typeof eachRule.$trackBy !== 'undefined'
      ? buildFromKeys(newKeys, key => getPath(childVm[key], eachRule.$trackBy))
      : null

    const vmByKey = {}
    vmList = newKeys.reduce((newList, key) => {
      const track = keyToTrack ? keyToTrack[key] : key
      vmByKey[key] = newList[track] = vmList[track] || mapValidator(rootVm, strippedRule, key, childVm)
      return newList
    }, {})

    return makeValidationVm(vmByKey, childVm, rootVm)
  }
}

function mapGroup (rootVm, group, prop, parentVm) {
  const rules = buildFromKeys(
    group,
    path => function () { return getPath(this.$v, path) }
  )

  const vm = makeValidationVm(rules, parentVm, rootVm, prop)
  return constant(vm)
}

function proxyVm (vm, originalKeys) {
  const redirectDef = {
    ...buildFromKeys(originalKeys, key => {
      let dynKey = mapDynamicKeyName(key)
      return {
        enumerable: true,
        get () {
          return vm[dynKey]
        }
      }
    }),
    ...buildFromKeys(defaultComputedKeys, key => ({
      enumerable: true,
      get () {
        return vm[key]
      }
    })),
    ...buildFromKeys(defaultMethodKeys, key => ({
      value: vm[key].bind(vm)
    })),
    [proxyValidationGuard]: {
      value: true
    }
  }

  return Object.defineProperties({}, redirectDef)
}

const validationMixin = {
  beforeCreate () {
    const options = this.$options
    if (!options.validations) return
    const validations = options.validations

    if (typeof options.computed === 'undefined') {
      options.computed = {}
    }

    options.computed.$v = () => validateModel(this, validations)
  }
}

const validateModel = (model, validations) => makeValidationVm(validations, model)

function Validation (Vue) {
  if (Validation.installed) return
  Vue.mixin(validationMixin)
}

export { Validation, validationMixin, validateModel }
export default Validation
