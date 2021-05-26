import { unwrapNormalizedValidator, unwrapValidatorResponse } from '../utils/common'

function syncOr (validators) {
  return function (...args) {
    return validators.reduce((valid, fn) => valid ||
      unwrapValidatorResponse(
        unwrapNormalizedValidator(fn).apply(this, args)
      ), false)
  }
}

function asyncOr (validators) {
  return function (...args) {
    return validators
      .reduce(async (valid, fn) => await valid ||
        unwrapValidatorResponse(
          await unwrapNormalizedValidator(fn).apply(this, args)
        ), Promise.resolve(false)
      )
  }
}

/**
 * Returns true when one of the provided functions returns true.
 * @param {...(NormalizedValidator|Function)} validators
 * @return {function(...[*]=): boolean}
 */
export default function or (...validators) {
  const $async = validators.some(v => v.$async)
  if (!validators.length) return () => false
  if ($async) return asyncOr(validators)
  return syncOr(validators)
}
