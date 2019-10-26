/**
 * @callback MessageCallback
 * @param {Object} params
 * @return String
 */

/**
 * Attaches a message to a validator
 * @param {Function} $validator
 * @param {(MessageCallback | String)} $message
 */
export default function withMessage ($validator, $message) {
  return {
    $validator,
    $message
  }
}
