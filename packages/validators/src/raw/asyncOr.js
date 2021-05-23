import { unwrapNormalizedValidator, unwrapValidatorResponse } from '../utils/common'

/**
 * Returns true when one of the provided functions returns true.
 * @param {...(NormalizedValidator|Function)} validators
 * @return {function(...[*]=): boolean}
 */
export default function asyncOr (...validators) {
  return function orInternal (...args) {
    return (
      validators.length > 0 &&
      validators.reduce(async (valid, fn) => await valid || unwrapValidatorResponse(await unwrapNormalizedValidator(fn).apply(this, args)), Promise.resolve(false))
    )
  }
}
