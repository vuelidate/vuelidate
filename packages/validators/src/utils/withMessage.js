import { getValidatorObj } from './common'

/**
 * @callback MessageCallback
 * @param {Object} params
 * @return String
 */

/**
 * Attaches a message to a validator
 * @param {MessageCallback | String} $message
 * @param {ValidatorObject|Function} $validator
 */
export default function withMessage ($message, $validator) {
  const validatorObj = getValidatorObj($validator)
  validatorObj.$message = $message

  return validatorObj
}
