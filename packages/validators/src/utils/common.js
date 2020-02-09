import { isRef } from 'vue'

export function isFunction (val) {
  return typeof val === 'function'
}

export function isObject (o) {
  return o !== null && typeof o === 'object' && !Array.isArray(o)
}

/**
 * Unwraps a ref, returning its value
 * @param val
 * @return {*}
 */
export function unwrap (val) {
  return isRef(val) ? val.value : val
}

/**
 * Returns a standard ValidatorObject
 * Wraps a plain function into a ValidatorObject
 * @param {NormalizedValidator|Function} validator
 * @return {NormalizedValidator}
 */
export function normalizeValidatorObject (validator) {
  return isFunction(validator.$validator)
    ? validator
    : {
      $validator: validator
    }
}

/**
 * Returns whether a value is truthy ot not.
 * @param {Function|*} prop
 * @return {boolean}
 */
export function isTruthy (prop) {
  prop = unwrap(prop)
  return Boolean(isFunction(prop) ? prop() : prop)
}

export function isPromise (object) {
  return isObject(object) && isFunction(object.then)
}
