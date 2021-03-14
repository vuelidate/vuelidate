import { req } from './core'
import { unwrapNormalizedValidator, unwrapValidatorResponse } from '../utils/common'

/**
 * Swaps the result of a value
 * @param {NormalizedValidator|Function} validator
 * @returns {function(*=, *=): boolean}
 */
export default function (validator) {
  return async function (value, vm) {
    return !req(value) || !unwrapValidatorResponse(await unwrapNormalizedValidator(validator).call(this, value, vm))
  }
}
