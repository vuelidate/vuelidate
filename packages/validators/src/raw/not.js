import { req } from '../common'
import { unwrapNormalizedValidator, unwrapValidatorResponse } from '../utils/common'

/**
 * Swaps the result of a value
 * @param {NormalizedValidator|Function} validator
 * @returns {function(*=, *=): boolean}
 */
export default function (validator) {
  return function (value, vm) {
    return !req(value) || !unwrapValidatorResponse(unwrapNormalizedValidator(validator).call(this, value, vm))
  }
}
