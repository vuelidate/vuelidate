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

export function get (obj, stringPath, def) {
  // Cache the current object
  let current = obj
  const path = stringPath.split('.')
  // For each item in the path, dig into the object
  for (let i = 0; i < path.length; i++) {
    // If the item isn't found, return the default (or null)
    if (!current[path[i]]) return def

    // Otherwise, update the current  value
    current = current[path[i]]
  }

  return current
}

export function gatherBooleanGroupProperties (group, nestedResults, property) {
  return computed(() => {
    return group.some((path) => {
      return get(nestedResults, path, { [property]: false })[property]
    })
  })
}

export function gatherArrayGroupProperties (group, nestedResults, property) {
  return computed(() => {
    return group.reduce((all, path) => {
      const fetchedProperty = get(nestedResults, path, { [property]: false })[property] || []
      return all.concat(fetchedProperty)
    }, [])
  })
}
