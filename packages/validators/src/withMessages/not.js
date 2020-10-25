import not from '../raw/not'

/**
 * Swaps the result of a value
 * @param {NormalizedValidator|Function} validator
 * @returns {NormalizedValidator}
 */
export default function (validator) {
  return {
    $validator: not(validator),
    $message: `The value does not match the provided validator`
  }
}
