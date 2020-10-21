import { unwrapNormalizedValidator, unwrapValidatorResponse } from '../utils/common'

/**
 * Returns true when one of the provided functions returns true.
 * @param {...(NormalizedValidator|Function)} validators
 * @return {function(...[*]=): boolean}
 */
export default function (...validators) {
  return function (...args) {
    return (
      validators.length > 0 &&
      validators.reduce((valid, fn) => valid || unwrapValidatorResponse(unwrapNormalizedValidator(fn).apply(this, args)), false)
    )
  }
}
