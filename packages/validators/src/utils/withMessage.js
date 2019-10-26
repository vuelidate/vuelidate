import { getValidatorObj } from './common'

/**
 * @callback MessageCallback
 * @param {Object} params
 * @return String
 */

/**
 * Attaches a message to a validator
 * @param {Function | Object} $validator
 * @param {(MessageCallback | String)} $message
 */
export default function withMessage ($validator, $message) {
  const validatorObj = getValidatorObj($validator)
  validatorObj.$message = $message

  return validatorObj
}
