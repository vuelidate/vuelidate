const someKeys = (obj, fn) => Object.keys(obj).some(fn)
const reduceKeys = (obj, fn, init) => Object.keys(obj).reduce(fn, init)
const reduceObj = (obj, fn, init) => reduceKeys(obj, (o, key) => fn(o, obj[key], key), init)
const mapObj = (obj, fn) => reduceObj(obj, (build, val, key) => {
  build[key] = fn(val, key)
  return build
}, {})
const buildFromKeys = (keys, fn) => keys.reduce((build, key) => {
  build[key] = fn(key)
  return build
}, {})

function Validation (Vue) {
  if (Validation.installed) return

  function makeValidationVm (validations, parentVm, masterProp) {
    function validationMapper (rules, localProp) {
      const prop = masterProp || localProp

      if (typeof rules === 'function') {
        return function () {
          return rules(this.parentVm[prop], this.parentVm)
        }
      }
      const vm = makeValidationVm(rules, masterProp ? parentVm[masterProp] : parentVm, localProp)
      return function () {
        return vm
      }
    }

    const vm = new Vue({
      data: { parentVm, _dirty: false },
      methods: {
        setDirty (newState = true) {
          this._dirty = !!newState
        }
      },
      computed: {
        ...mapObj(validations, validationMapper),
        $invalid () {
          return someKeys(validations, rule => {
            const val = this[rule]
            return typeof val === 'object' ? val.$invalid : !val
          })
        },
        $dirty () {
          return this._dirty || someKeys(validations, rule => {
            const val = this[rule]
            return typeof val === 'object' ? val.$dirty : false
          })
        },
        $error () {
          return !!(this.$dirty && this.$invalid)
        }
      }
    })

    const redirectKeys = [...Object.keys(validations), '$invalid', '$error', '$dirty', 'setDirty']
    const redirectDef = buildFromKeys(redirectKeys, key => ({
      enumerable: key !== 'setDirty',
      get () {
        return vm[key]
      }
    }))

    return Object.defineProperties({}, redirectDef)
  }

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
}

export default Validation

export { Validation }
