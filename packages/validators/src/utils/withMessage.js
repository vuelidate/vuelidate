import { normalizeValidatorObject, isFunction, isObject, unwrap } from './common'

/**
 * @callback MessageCallback
 * @param {Object} params
 * @return String
 */

/**
 * Attaches a message to a validator
 * @param {MessageCallback | String} $message
 * @param {NormalizedValidator|Function} $validator
 */
export default function withMessage ($message, $validator) {
  if (!isFunction($message) && typeof unwrap($message) !== 'string') throw new Error(`[@vuelidate/validators]: First parameter to "withMessage" should be string or a function returning a string, provided ${typeof $message}`)
  if (!isObject($validator) && !isFunction($validator)) throw new Error(`[@vuelidate/validators]: Validator must be a function or object with $validator parameter`)

  const validatorObj = normalizeValidatorObject($validator)
  validatorObj.$message = $message

  return validatorObj
}
