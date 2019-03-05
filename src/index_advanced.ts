import Vue from 'vue'

declare module 'vue/types/vue' {
  // 3. Declare augmentation for Vue
  interface Vue {
    $v: object
  }
}

// utilities
const reduceKeys = (obj, fn, init) => Object.keys(obj).reduce(fn, init)
const reduceObj = (obj, fn, init) => reduceKeys(obj, (o, key) => fn(o, obj[key], key), init)
const buildFromKeys = (keys: Array<string>, fn: Function) => keys.reduce((build: object, key) => {
  build[key] = fn(key)
  return build
}, {})

const getPath = (obj: object, path: string | string[], fallback: string) => {
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
    return this.dirty ||
      this.dynamicKeys.some(ruleOrNested => {
        const val = this[ruleOrNested]
        return typeof val === 'object' ? val.$dirty : false
      })
  },
  $error () {
    return !!(this.$dirty && this.$invalid)
  }
}

const defaultMethodKeys = Object.keys(defaultMethods)
const defaultComputedKeys = Object.keys(defaultComputed)
const mapDynamicKeyName = k => 'v$$' + k

const buildDynamics = (obj, fn) => reduceObj(obj, (build, val, key) => {
  build[mapDynamicKeyName(key)] = fn(val, key)
  return build
}, {})

function isSingleRule (ruleset) {
  return typeof ruleset === 'function'
}

function Vuelidate (Vue) {
  Vue.mixin({
    beforeCreate () {
      if (!this.$options.validations) return
      const validations = this.$options.validations

      if (typeof this.$options.computed === 'undefined') {
        this.$options.computed = {}
      }

      this.$options.computed.$v = () => makeValidationVm(validations, this)

      // this.$options.computed.$v = () => VuelidateVm.$v
    }
  })

  function makeValidationVm (validations, parentVm, rootVm = parentVm, masterProp = null) {
    const validationKeys = Object.keys(validations)
    const transformedKeys = validationKeys.map(mapDynamicKeyName)

    const rules = {}
    const nested = {}
    const groups = {}
    validationKeys.forEach(key => {
      const v = validations[key]
      let baseObj

      if (isSingleRule(v)) {
        baseObj = rules
      } else if (Array.isArray(v)) {
        baseObj = groups
      } else {
        baseObj = nested
      }
      baseObj[key] = v
    })

    // const validationVm = new Vue({
      // data: {
      //   dirty: false,
      //   dynamicKeys: transformedKeys
      // },
    //   methods: defaultMethods,
    //   computed: {
    //     ...buildDynamics(rules, mapRule),
    //     ...buildDynamics(nested, mapChild),
    //     ...buildDynamics(groups, mapGroup),
    //     ...defaultComputed
    //   }
    // })

    const VuelidateVm = new Vuelidator({
      data: {
        dynamicKeys: transformedKeys
      },
      computed: {
        ...buildDynamics(rules, mapRule),
        ...buildDynamics(nested, mapChild),
        ...buildDynamics(groups, mapGroup),
        ...defaultComputed
      }
    })

    console.log(VuelidateVm)

    const proxyValidationVm = proxyVm(VuelidateVm, validationKeys)

    return proxyValidationVm

    function mapRule (rule, localProp) {
      console.log('rule', rule, localProp)
      return function () {
        return rule.call(rootVm, parentVm[masterProp], parentVm)
      }
    }

    function mapChild (rules, localProp) {
      const childVm = masterProp ? parentVm[masterProp] : parentVm
      const vm = makeValidationVm(rules, childVm, rootVm, localProp)
      return () => vm
    }

    function mapGroup (group, localProp) {
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

class Vuelidator extends Vue {
  dirty: boolean = false

  constructor (vmObj: object) {
    super(vmObj)
  }

  setDirty (newState: boolean = true) {
    this.dirty = !!newState
  }
}

export default Vuelidate

export { Vuelidate }
