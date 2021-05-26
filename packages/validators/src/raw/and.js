import { unwrapNormalizedValidator, unwrapValidatorResponse } from '../utils/common'

function syncAnd (validators) {
  return function (...args) {
    return validators.reduce((valid, fn) => valid &&
      unwrapValidatorResponse(
        unwrapNormalizedValidator(fn).apply(this, args)
      ), true)
  }
}

/**
 *
 * @param validators
 * @return {function(...[*]=): Promise<boolean>}
 */
function asyncAnd (validators) {
  return function (...args) {
    return validators.reduce(async (valid, fn) => await valid &&
      unwrapValidatorResponse(
        await unwrapNormalizedValidator(fn).apply(this, args)
      ), Promise.resolve(true))
  }
}

/**
 * Returns true when all validators are truthy
 * @param {...(NormalizedValidator | Function)} validators
 * @return {function(...[*]=): (boolean | Promise<boolean>)}
 */
export default function and (...validators) {
  const $async = validators.some(v => v.$async)
  if (!validators.length) return () => false
  if ($async) return asyncAnd(validators)
  return syncAnd(validators)
}
