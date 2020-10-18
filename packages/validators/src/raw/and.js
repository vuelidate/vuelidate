import { unwrapNormalizedValidator, unwrapValidatorResponse } from '../utils/common'

/**
 * Returns true when all validators are truthy
 * @param {...(NormalizedValidator|Function)} validators
 * @return {function(...[*]=): boolean}
 */
export default function (...validators) {
  return function (...args) {
    return (
      validators.length > 0 &&
      validators.reduce((valid, fn) => valid && unwrapValidatorResponse(unwrapNormalizedValidator(fn).apply(this, args)), true)
    )
  }
}
