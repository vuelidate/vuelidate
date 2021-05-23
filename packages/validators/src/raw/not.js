import { req } from './core'
import { isPromise, unwrapNormalizedValidator, unwrapValidatorResponse } from '../utils/common'

/**
 * Swaps the result of a value
 * @param {NormalizedValidator|Function} validator
 * @returns {function(*=, *=): boolean}
 */
export default function (validator) {
  return function (value, vm) {
    if (!req(value)) return true
    const response = unwrapNormalizedValidator(validator).call(this, value, vm)
    if (!isPromise(response)) return !unwrapValidatorResponse(response)
    return response.then(r => !unwrapValidatorResponse(r))
  }
}
