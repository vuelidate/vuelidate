// utilities
const constant = c => () => c
const noop = () => {}
const buildFromKeys = (keys, fn, keyFn) => keys.reduce((build, key) => {
  build[keyFn ? keyFn(key) : key] = fn(key)
  return build
}, {})

function isObject (val) {
  return val !== null && typeof val === 'object'
}

function isPromise (object) {
  return (typeof object === 'object' || typeof object === 'function') && typeof object.then === 'function'
}

function isNested (ruleset) {
  return isObject(ruleset) && !ruleset.__isVuelidateAsyncVm
}

let _cachedVue = null
function getVue (rootVm) {
  if (_cachedVue) return _cachedVue
  let Vue = rootVm.constructor
  while (Vue.super) Vue = Vue.super
  _cachedVue = Vue
  return Vue
}

const getPath = (ctx, obj, path, fallback) => {
  if (typeof path === 'function') {
    return path.call(ctx, obj, fallback)
  }

  path = Array.isArray(path) ? path : path.split('.')
  for (let i = 0; i < path.length; i++) {
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
    if (isNested(val)) {
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
  },
  $flattenParams () {
    let params = []
    for (const key in this.params) {
      const val = this[mapDynamicKeyName(key)]
      if (isNested(val)) {
        const childParams = val.$flattenParams()
        for (let j = 0; j < childParams.length; j++) {
          childParams[j].path.unshift(key)
        }
        params = params.concat(childParams)
      } else {
        console.log(key, this.params, val)
        params.push({ path: [], name: key, params: this.params[key] })
      }
    }
    return params
  }
}

const defaultComputed = {
  $invalid () {
    return this.dynamicKeys.some(ruleOrNested => {
      const val = unwrapMaybeAsync(this, ruleOrNested)
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
      const nested = isNested(val)
      foundNested = foundNested || nested
      if (nested && !val.$dirty) {
        return false
      }
    }
    return foundNested
  },
  $error () {
    return !!(!this.$pending && this.$dirty && this.$invalid)
  },
  $pending () {
    return this.dynamicKeys.some(ruleOrNested => {
      const val = this[ruleOrNested]
      if (val.__isVuelidateAsyncVm) {
        return val.pending
      }
      return isNested(val) ? val.$pending : false
    })
  }
}

const defaultMethodKeys = Object.keys(defaultMethods)
const defaultComputedKeys = Object.keys(defaultComputed)
const mapDynamicKeyName = k => 'v$$' + k

function isSingleRule (ruleset) {
  return typeof ruleset === 'function'
}

function makePendingAsyncVm (Vue, promise) {
  const asyncVm = new Vue({
    data: {
      pending: true,
      value: false
    }
  })

  promise
    .then(value => {
      asyncVm.pending = false
      asyncVm.value = value
    }, error => {
      asyncVm.pending = false
      asyncVm.value = false
      throw error
    })

  asyncVm.__isVuelidateAsyncVm = true
  return asyncVm
}

function makeValidationVm (validations, parentVm, rootVm = parentVm, parentProp = null) {
  const validationKeys = Object.keys(validations).filter(key => key !== '$params' && !!validations[key])
  const dynamicKeys = validationKeys.map(mapDynamicKeyName)

  const computedRules = buildFromKeys(validationKeys, (key) => {
    const rule = validations[key]
    return mapValidator(rootVm, rule, key, parentVm, parentProp)
  }, mapDynamicKeyName)

  const $params = buildFromKeys(validationKeys, k => {
    const v = validations[k]
    if (v.hasOwnProperty('$params')) {
      return v.$params
    }
    return null
  })

  const Vue = getVue(rootVm)

  const validationVm = new Vue({
    data: {
      dirty: false,
      params: $params,
      dynamicKeys
    },
    methods: defaultMethods,
    computed: {
      ...computedRules,
      ...defaultComputed
    }
  })

  return proxyVm(validationVm, validationKeys, {$childParams: {enumerable: true, value: $params}})
}

function mapValidator (rootVm, rule, ruleKey, vm, vmProp) {
  if (isSingleRule(rule)) {
    return mapRule(rootVm, rule, ruleKey, vm, vmProp)
  } else if (Array.isArray(rule)) {
    return mapGroup(rootVm, rule, ruleKey, vm, vmProp)
  } else {
    return mapChild(rootVm, rule, ruleKey, vm, vmProp)
  }
}

function unwrapMaybeAsync (vm, dynamicKey) {
  const val = vm[dynamicKey]
  if (typeof val === 'object' && val.__isVuelidateAsyncVm) {
    return val.value
  }
  return val
}

function mapRule (rootVm, rule, ruleKey, parentVm, prop) {
  let indirectWatcher = null

  const runRule = () => rule.call(rootVm, parentVm[prop], parentVm)
  let lastInputVal = {}
  return function () {
    const isArrayDependant =
      prop !== null &&
      Array.isArray(parentVm) &&
      parentVm.__ob__

    if (isArrayDependant) {
      // force depend on the array
      const arrayDep = parentVm.__ob__.dep
      arrayDep.depend()

      const target = arrayDep.constructor.target

      if (!indirectWatcher) {
        const Watcher = target.constructor
        indirectWatcher = new Watcher(rootVm, runRule, noop, { lazy: true })
      }

      // if the update cause is only the array update
      // and value stays the same, don't recalculate
      if (!indirectWatcher.dirty && lastInputVal === parentVm[prop]) {
        indirectWatcher.depend()
        return target.value
      }

      lastInputVal = parentVm[prop]
      indirectWatcher.evaluate()
      indirectWatcher.depend()
    }

    const validatorOutput = indirectWatcher ? indirectWatcher.value : runRule()

    if (isPromise(validatorOutput)) {
      // handle async validators that return a Promise
      return makePendingAsyncVm(getVue(rootVm), validatorOutput)
    } else if (isObject(validatorOutput) && !!validatorOutput.__isVuelidateVm) {
      // support cross referencing validators, especially validation groups
      return validatorOutput
    } else {
      // only standard sync validators left
      return !!validatorOutput
    }
  }
}

function mapChild (rootVm, rules, ruleKey, parentVm, prop) {
  if (ruleKey === '$each') {
    return trackCollection(rootVm, rules, parentVm, prop)
  }
  const childVm = typeof prop === 'string' ? parentVm[prop] : parentVm
  const vm = makeValidationVm(rules, childVm, rootVm, ruleKey)
  return constant(vm)
}

function trackCollection (rootVm, eachRule, parentVm, prop) {
  let vmList = {}
  const strippedRule = {
    ...eachRule,
    $trackBy: undefined
  }

  return function () {
    const childVm = typeof prop === 'string' ? parentVm[prop] : parentVm
    const newKeys = Object.keys(childVm)
    const keyToTrack = typeof eachRule.$trackBy !== 'undefined'
      ? buildFromKeys(newKeys, key => getPath(rootVm, childVm[key], eachRule.$trackBy))
      : null

    const vmByKey = {}
    vmList = newKeys.reduce((newList, key) => {
      const track = keyToTrack ? keyToTrack[key] : key
      vmByKey[key] = newList[track] =
        newList[track] || vmList[track] ||
        mapValidator(rootVm, strippedRule, key, childVm)
      return newList
    }, {})

    return makeValidationVm(vmByKey, childVm, rootVm)
  }
}

function mapGroup (rootVm, group, prop, parentVm) {
  const rules = buildFromKeys(
    group,
    path => function () { return getPath(this, this.$v, path) }
  )

  const vm = makeValidationVm(rules, parentVm, rootVm, prop)
  return constant(vm)
}

function proxyVm (vm, originalKeys, extras) {
  const redirectDef = {
    ...buildFromKeys(originalKeys, key => {
      let dynKey = mapDynamicKeyName(key)
      return {
        enumerable: true,
        get () {
          return unwrapMaybeAsync(vm, dynKey)
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
    __isVuelidateVm: {
      configurable: false,
      enumerable: false,
      value: true
    },
    ...extras
  }

  return Object.defineProperties({}, redirectDef)
}

const validationMixin = {
  beforeCreate () {
    const options = this.$options
    if (!options.validations) return
    const validations = options.validations

    /* istanbul ignore if */
    if (typeof options.computed === 'undefined') {
      options.computed = {}
    }

    options.computed.$v = () => validateModel(this, validations)
  }
}

const validateModel = (model, validations) => makeValidationVm(validations, model)

function Validation (Vue) {
  /* istanbul ignore if */
  if (Validation.installed) {
    return
  }
  _cachedVue = Vue
  Vue.mixin(validationMixin)
}

export { Validation, validationMixin, validateModel }
export default Validation
