// utilities
const reduceKeys = (obj, fn, init) => Object.keys(obj).reduce(fn, init)
const reduceObj = (obj, fn, init) => reduceKeys(obj, (o, key) => fn(o, obj[key], key), init)
const buildFromKeys = (keys, fn) => keys.reduce((build, key) => {
  build[key] = fn(key)
  return build
}, {})

const getPath = (obj, path, fallback) => {
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

// vm static definition
const defaultMethods = {
  setDirty (newState = true) {
    this.dirty = !!newState
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
    // iteration to trigger as little as possible getters
    let foundNested = false
    for (let i = 0; i < this.dynamicKeys.length; i++) {
      const ruleOrNested = this.dynamicKeys[i]
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

const buildDynamics = (obj, fn, cache) => reduceObj(obj, (build, val, key) => {
  build[mapDynamicKeyName(key)] = (cache && cache[key]) || fn(val, key)
  return build
}, {})

function isSingleRule (ruleset) {
  return typeof ruleset === 'function'
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

      this.$options.computed.$validations = () => makeValidationVm(validations, this)
    }
  })

  function makeValidationVm (validations, parentVm, rootVm = parentVm, masterProp = null, computedCache = null) {
    const validationKeys = Object.keys(validations)
    const dynamicKeys = validationKeys.map(mapDynamicKeyName)

    const validationVm = new Vue({
      data: {
        dirty: false,
        dynamicKeys
      },
      methods: defaultMethods,
      computed: {
        ...buildDynamics(validations, mapValidator, computedCache),
        ...defaultComputed
      }
    })

    const proxyValidationVm = proxyVm(validationVm, validationKeys)

    return proxyValidationVm

    function mapValidator (rule, localProp, vm = parentVm, master = masterProp) {
      if (isSingleRule(rule)) {
        return mapRule(rule, localProp, vm, master)
      } else if (Array.isArray(rule)) {
        return mapGroup(rule, localProp, vm, master)
      } else {
        return mapChild(rule, localProp, vm, master)
      }
    }

    function mapRule (rule, localProp, parentVm, masterProp) {
      return function () {
        return rule.call(rootVm, parentVm[masterProp], parentVm)
      }
    }

    function mapChild (rules, localProp, parentVm, masterProp) {
      if (localProp === '$each') {
        return trackArray(rules, masterProp)
      }
      const childVm = masterProp ? parentVm[masterProp] : parentVm

      const vm = makeValidationVm(rules, childVm, rootVm, localProp)
      return () => vm
    }

    function trackArray (eachRule, masterProp) {
      let vmList = {}
      return () => {
        const childVm = masterProp ? parentVm[masterProp] : parentVm
        const newKeys = Object.keys(childVm)
        vmList = buildFromKeys(newKeys, key => {
          return vmList[key] || mapValidator(eachRule, key, childVm, null)
        })
        return makeValidationVm(vmList, childVm, rootVm, null, vmList)
      }
    }

    function mapGroup (group, localProp, parentVm) {
      const rules = buildFromKeys(
        group,
        path => function () { return getPath(this.$validations, path) }
      )

      const vm = makeValidationVm(rules, parentVm, rootVm, localProp)
      return () => vm
    }
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
    }))
  }

  return Object.defineProperties({}, redirectDef)
}

export default Validation

export { Validation }
