import {h, patchChildren} from './vval'

const buildFromKeys = (keys, fn, keyFn) => keys.reduce((build, key) => {
  build[keyFn ? keyFn(key) : key] = fn(key)
  return build
}, {})

function isPromise (object) {
  return (typeof object === 'object' || typeof object === 'function') && typeof object.then === 'function'
}

const getPath = (ctx, obj, path, fallback) => {
  if (typeof path === 'function') {
    return path.call(ctx, obj, fallback)
  }

  path = Array.isArray(path) ? path : path.split('.')
  for (let i = 0; i < path.length; i++) {
    if (obj && typeof obj === 'object') {
      obj = obj[path[i]]
    } else {
      return fallback
    }
  }

  return typeof obj === 'undefined' ? fallback : obj
}

import {withParams, pushParams, popParams} from './params'

const __isVuelidateAsyncVm = '__isVuelidateAsyncVm'
function makePendingAsyncVm (Vue, promise) {
  const asyncVm = new Vue({
    data: {
      p: true, // pending
      v: false // value
    }
  })

  promise
    .then(value => {
      asyncVm.p = false
      asyncVm.v = value
    }, error => {
      asyncVm.p = false
      asyncVm.v = false
      throw error
    })

  asyncVm[__isVuelidateAsyncVm] = true
  return asyncVm
}

const validationGetters = {
  $invalid () {
    const proxy = this.proxy
    return this.nestedKeys.some(nested => proxy[nested].$invalid) ||
      this.ruleKeys.some(rule => !proxy[rule])
  },
  $dirty () {
    if (this.dirty) {
      return true
    }
    if (this.nestedKeys.length === 0) {
      return false
    }

    const proxy = this.proxy
    return this.nestedKeys.every(key => {
      return proxy[key].$dirty
    })
  },
  $error () {
    return this.$dirty && !this.$pending && this.$invalid
  },
  $pending () {
    const proxy = this.proxy
    return this.nestedKeys.some(key => proxy[key].$pending) ||
      this.ruleKeys.some(key => this.getRef(key).$pending)
  },
  $params () {
    const vals = this.validations
    return {
      ...buildFromKeys(this.nestedKeys, key => vals[key] && vals[key].$params || null),
      ...buildFromKeys(this.ruleKeys, key => this.getRef(key).$params)
    }
  }
}

function setDirtyRecursive (newState) {
  this.dirty = newState
  const proxy = this.proxy
  const method = newState ? '$touch' : '$reset'
  this.nestedKeys.forEach(key => {
    proxy[key][method]()
  })
}

const validationMethods = {
  $touch () {
    setDirtyRecursive.call(this, true)
  },
  $reset () {
    setDirtyRecursive.call(this, false)
  },
  $flattenParams () {
    const proxy = this.proxy
    let params = []
    for (const key in this.$params) {
      if (this.isNested(key)) {
        const childParams = proxy[key].$flattenParams()
        for (let j = 0; j < childParams.length; j++) {
          childParams[j].path.unshift(key)
        }
        params = params.concat(childParams)
      } else {
        params.push({ path: [], name: key, params: this.$params[key] })
      }
    }
    return params
  }

}

const getterNames = Object.keys(validationGetters)
const methodNames = Object.keys(validationMethods)

let _cachedComponent = null
const getComponent = (Vue) => {
  if (_cachedComponent) {
    return _cachedComponent
  }

  const VBase = Vue.extend({
    beforeCreate () {
      this._vval = null
    },
    beforeDestroy () {
      if (this._vval) {
        patchChildren(this._vval)
      }
    },
    computed: {
      refs () {
        const oldVval = this._vval
        this._vval = this.children
        patchChildren(oldVval, this._vval)
        const refs = {}
        this._vval.forEach(c => {
          refs[c.key] = c.vm
        })
        return refs
      }
    }
  })

  const ValidationRule = VBase.extend({
    data () {
      return {
        rule: null,
        model: null,
        parentModel: null,
        rootModel: null
      }
    },
    methods: {
      runRule (parent) {
        // Avoid using this.parentModel to not get dependent on it.
        // Passed as an argument for workaround
        pushParams()
        const rawOutput = this.rule.call(this.rootModel, this.model, parent)
        const output = isPromise(rawOutput)
          ? makePendingAsyncVm(Vue, rawOutput)
          : rawOutput

        const rawParams = popParams()
        const params = rawParams && rawParams.$sub
          ? rawParams.$sub.length > 1
            ? rawParams
            : rawParams.$sub[0]
          : null

        return { output, params }
      }
    },
    computed: {
      run () {
        const parent = this.parentModel
        const isArrayDependant =
          Array.isArray(parent) &&
          parent.__ob__

        if (isArrayDependant) {
          // force depend on the array
          const arrayDep = parent.__ob__.dep
          arrayDep.depend()

          const target = arrayDep.constructor.target

          if (!this._indirectWatcher) {
            const Watcher = target.constructor
            this._indirectWatcher = new Watcher(this.rootModel, () => this.runRule(parent), null, { lazy: true })
          }

          // if the update cause is only the array update
          // and value stays the same, don't recalculate
          if (!this._indirectWatcher.dirty && this._lastModel === this.model) {
            this._indirectWatcher.depend()
            return target.value
          }

          this._lastModel = this.model
          this._indirectWatcher.evaluate()
          this._indirectWatcher.depend()
        }

        return this._indirectWatcher ? this._indirectWatcher.value : this.runRule(parent)
      },
      $params () {
        return this.run.params
      },
      proxy () {
        const output = this.run.output
        if (output[__isVuelidateAsyncVm]) {
          return !!output.v
        }
        return !!output
      },
      $pending () {
        const output = this.run.output
        if (output[__isVuelidateAsyncVm]) {
          return output.p
        }
        return false
      }
    }
  })

  const Validation = VBase.extend({
    data () {
      return {
        dirty: false,
        validations: null,
        model: null,
        prop: null,
        parentModel: null,
        rootModel: null
      }
    },
    methods: {
      ...validationMethods,
      getRef (key) {
        return this.refs[key]
      },
      isNested (key) {
        return typeof this.validations[key] !== 'function'
      }
    },
    computed: {
      ...validationGetters,
      nestedKeys () {
        return this.keys.filter(this.isNested)
      },
      ruleKeys () {
        return this.keys.filter(k => !this.isNested(k))
      },
      keys () {
        return Object.keys(this.validations).filter(k => k !== '$params')
      },
      proxy () {
        const keyDefs = buildFromKeys(this.keys, key => ({
          enumerable: true,
          configurable: false,
          get: () => this.getRef(key).proxy
        }))

        const getterDefs = buildFromKeys(getterNames, key => ({
          enumerable: true,
          configurable: false,
          get: () => this[key]
        }))

        const methodDefs = buildFromKeys(methodNames, key => ({
          enumerable: false,
          configurable: false,
          get: () => this[key]
        }))

        return Object.defineProperties({}, {
          ...keyDefs, ...getterDefs, ...methodDefs
        })
      },
      children () {
        return [
          ...this.nestedKeys.map(key => renderNested(this, key)),
          ...this.ruleKeys.map(key => renderRule(this, key))
        ].filter(Boolean)
      }
    }
  })

  const GroupValidation = Validation.extend({
    methods: {
      isNested (key) {
        return typeof this.validations[key]() !== 'undefined'
      },
      getRef (key) {
        const vm = this
        return {
          get proxy () {
            // default to invalid
            return vm.validations[key]() || false
          }
        }
      }
    }
  })

  const EachValidation = Validation.extend({
    computed: {
      keys () {
        return Object.keys(this.model)
      },
      tracker () {
        const trackBy = this.validations.$trackBy
        return trackBy
            ? key => `${getPath(this.rootModel, this.model[key], trackBy)}`
            : x => `${x}`
      },
      children () {
        const def = this.validations

        const validations = { ...def }
        delete validations['$trackBy']

        let usedTracks = {}

        return this.keys.map(key => {
          const track = this.tracker(key)
          if (usedTracks.hasOwnProperty(track)) {
            return null
          }
          usedTracks[track] = true
          return h(Validation, track, {
            validations,
            prop: key,
            parentModel: this.model,
            model: this.model[key],
            rootModel: this.rootModel
          })
        }).filter(Boolean)
      }
    },
    methods: {
      isNested () {
        return true
      },
      getRef (key) {
        return this.refs[this.tracker(key)]
      }
    }
  })

  const renderNested = (vm, key) => {
    if (key === '$each') {
      return h(EachValidation, key, {
        validations: vm.validations[key],
        parentModel: vm.parentModel,
        prop: key,
        model: vm.model,
        rootModel: vm.rootModel
      })
    }
    const validations = vm.validations[key]
    if (Array.isArray(validations)) {
      const root = vm.rootModel
      const refVals = buildFromKeys(
        validations,
        path => function () { return getPath(root, root.$v, path) },
        v => Array.isArray(v) ? v.join('.') : v
      )
      return h(GroupValidation, key, {
        validations: refVals,
        parentModel: null,
        prop: key,
        model: null,
        rootModel: root
      })
    }
    return h(Validation, key, {
      validations,
      parentModel: vm.model,
      prop: key,
      model: vm.model[key],
      rootModel: vm.rootModel
    })
  }

  const renderRule = (vm, key) => {
    return h(ValidationRule, key, {
      rule: vm.validations[key],
      parentModel: vm.parentModel,
      model: vm.model,
      rootModel: vm.rootModel
    })
  }

  _cachedComponent = {VBase, Validation}
  return _cachedComponent
}

let _cachedVue = null
function getVue (rootVm) {
  if (_cachedVue) return _cachedVue
  let Vue = rootVm.constructor
  /* istanbul ignore next */
  while (Vue.super) Vue = Vue.super
  _cachedVue = Vue
  return Vue
}

const validateModel = (model, validations) => {
  const Vue = getVue(model)
  const {Validation, VBase} = getComponent(Vue)
  const root = new VBase({
    computed: {
      children () {
        const vals = typeof validations === 'function'
          ? validations.call(model)
          : validations

        return [h(Validation, '$v', {
          validations: vals,
          parentModel: null,
          prop: '$v',
          model,
          rootModel: model
        })]
      }
    }
  })
  return root
}

const validationMixin = {
  data () {
    const vals = this.$options.validations
    if (vals) {
      this._vuelidate = validateModel(this, vals)
    }
    return {}
  },
  beforeCreate () {
    const options = this.$options
    const vals = options.validations
    if (!vals) return
    if (!options.computed) options.computed = {}
    options.computed.$v = () => this._vuelidate.refs.$v.proxy
  },
  beforeDestroy () {
    if (this._vuelidate) {
      this._vuelidate.$destroy()
      this._vuelidate = null
    }
  }
}

function Vuelidate (Vue) {
  Vue.mixin(validationMixin)
}

export { Vuelidate, validationMixin, withParams }
export default Vuelidate
