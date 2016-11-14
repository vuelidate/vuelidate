// utilities
const reduceKeys = (obj, fn, init) => Object.keys(obj).reduce(fn, init)
const reduceObj = (obj, fn, init) => reduceKeys(obj, (o, key) => fn(o, obj[key], key), init)
const buildFromKeys = (keys, fn) => keys.reduce((build, key) => {
  build[key] = fn(key)
  return build
}, {})

const getPath = (obj, path, fallback) => {
  if (typeof path === 'function') {
    return path.call(obj, fallback)
  }

  path = Array.isArray(path) ? path : path.split('.')
  for (var i = 0; i < path.length; i++) {
    if (typeof obj === 'object' && obj !== null) {
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
    if (typeof val === 'object') {
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
      return typeof val === 'object' ? val.$invalid : !val
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
      const isNested = typeof val === 'object'
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

const buildDynamics = (obj, fn) => reduceObj(obj, (build, val, key) => {
  if (typeof val !== 'undefined') {
    build[mapDynamicKeyName(key)] = fn(val, key)
  }
  return build
}, {})

function isSingleRule (ruleset) {
  return typeof ruleset === 'function'
}

function isProxyVm (rule) {
  return rule.__isProxyValidation === true
}

export const validationMixin = {
  beforeCreate () {
    if (!this.$options.validations) return
    const validations = this.$options.validations

    if (typeof this.$options.computed === 'undefined') {
      this.$options.computed = {}
    }

    const LocalVue = this.constructor
    this.$options.computed.$v = () => makeValidationVm(LocalVue, validations, this)
  }
}

function Validation (Vue) {
  if (Validation.installed) return
  Vue.mixin(validationMixin)
}

function makeValidationVm (Vue, validations, parentVm, rootVm = parentVm, parentProp = null) {
  const validationKeys = Object.keys(validations).filter(key => !!validations[key])
  const dynamicKeys = validationKeys.map(mapDynamicKeyName)

  const validationVm = new Vue({
    data: {
      dirty: false,
      dynamicKeys
    },
    methods: defaultMethods,
    computed: {
      ...buildDynamics(validations, mapValidator),
      ...defaultComputed
    }
  })

  return proxyVm(validationVm, validationKeys)

  function mapValidator (rule, ruleKey, vm = parentVm, vmProp = parentProp) {
    if (isProxyVm(rule)) {
      return rule
    } else if (isSingleRule(rule)) {
      return mapRule(rule, ruleKey, vm, vmProp)
    } else if (Array.isArray(rule)) {
      return mapGroup(rule, ruleKey, vm, vmProp)
    } else {
      return mapChild(rule, ruleKey, vm, vmProp)
    }
  }

  function mapRule (rule, ruleKey, parentVm, prop) {
    return function () {
      return rule.call(rootVm, parentVm[prop], parentVm)
    }
  }

  function mapChild (rules, ruleKey, parentVm, prop) {
    if (ruleKey === '$each') {
      return trackArray(rules, prop)
    }
    const childVm = typeof prop === 'string' ? parentVm[prop] : parentVm

    const vm = makeValidationVm(Vue, rules, childVm, rootVm, ruleKey)
    return () => vm
  }

  function trackArray (eachRule, prop) {
    let vmList = {}
    const strippedRule = {
      ...eachRule,
      $trackBy: undefined
    }

    return () => {
      const childVm = typeof prop === 'string' ? parentVm[prop] : parentVm
      const newKeys = Object.keys(childVm)
      const keyToTrack = typeof eachRule.$trackBy !== 'undefined'
        ? buildFromKeys(newKeys, key => getPath(childVm[key], eachRule.$trackBy))
        : null

      const vmByKey = {}
      vmList = newKeys.reduce((newList, key) => {
        const track = keyToTrack ? keyToTrack[key] : key
        vmByKey[key] = newList[track] = vmList[track] || mapValidator(strippedRule, key, childVm, null)
        return newList
      }, {})
      return makeValidationVm(Vue, vmByKey, childVm, rootVm)
    }
  }

  function mapGroup (group, prop, parentVm) {
    const rules = buildFromKeys(
      group,
      path => function () { return getPath(this.$v, path) }
    )

    const vm = makeValidationVm(Vue, rules, parentVm, rootVm, prop)
    return () => vm
  }
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
    '__isProxyValidation': {
      value: true
    }
  }

  return Object.defineProperties({}, redirectDef)
}

export default Validation

export { Validation }
