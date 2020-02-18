import { isRef, computed, ref, toRefs, isReactive, reactive } from 'vue'

export function unwrap (val) {
  return isRef(val)
    ? val.value
    : val
}

export function unwrapObj (obj, ignoreKeys = []) {
  return Object.keys(obj).reduce((o, k) => {
    if (ignoreKeys.includes(k)) return o
    o[k] = unwrap(obj[k])
    return o
  }, {})
}

export function isFunction (val) {
  return typeof val === 'function'
}

export function isObject (val) {
  return val !== null && (typeof val === 'object' || isFunction(val))
}

export function isPromise (object) {
  return isObject(object) && isFunction(object.then)
}

export function paramToRef (param) {
  if (isRef(param)) {
    return param
  } else if (typeof param === 'function') {
    return computed(param)
  } else {
    return ref(param)
  }
}

export function objectToRefs (param) {
  if (isReactive(param)) {
    return toRefs(param)
  } else if (isRef(param)) {
    return param
  } else if (typeof param === 'function') {
    throw Error('[Vuelidate]: Parameter should be Object, Reactive or a Ref, Function given')
  } else {
    return toRefs(reactive(param))
  }
}

export function isUndefined (param) {
  return typeof param === 'undefined'
}
