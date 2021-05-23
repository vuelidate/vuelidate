import { unwrapNormalizedValidator, unwrapValidatorResponse } from '../utils/common'

/**
 * Returns true when all validators are truthy
 * @param {...(NormalizedValidator | Function | function(): Promise<boolean>)} validators
 * @return {function(...[*]=): boolean}
 */
export default function and (...validators) {
  return function (...args) {
    return (
      validators.length > 0 &&
      validators.reduce(async (valid, fn) => await valid && unwrapValidatorResponse(await unwrapNormalizedValidator(fn).apply(this, args)), Promise.resolve(true))
    )
  }
}
