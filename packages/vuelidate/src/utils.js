import { isRef, computed, ref, isReactive, isReadonly, unref as unwrap } from 'vue-demi'

export { unwrap }

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

export function isProxy (value) {
  return isReactive(value) || isReadonly(value)
}
