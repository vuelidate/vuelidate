import { unref as unwrap } from 'vue-demi'

export { unwrap }

export function isFunction (val) {
  return typeof val === 'function'
}

export function isObject (o) {
  return o !== null && typeof o === 'object' && !Array.isArray(o)
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

/**
 * Unwraps a ValidatorResponse object, into a boolean.
 * @param {ValidatorResponse} result
 * @return {boolean}
 */
export function unwrapValidatorResponse (result) {
  if (typeof result === 'object') return result.$invalid
  return result
}

/**
 * Unwraps a `NormalizedValidator` object, returning it's validator function.
 * @param {NormalizedValidator | Function} validator
 * @return {function}
 */
export function unwrapNormalizedValidator (validator) {
  return validator.$validator || validator
}
