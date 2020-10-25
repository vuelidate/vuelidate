import alphaNum from '../raw/alphaNum'

/**
 * Validate if value is alpha-numeric string.
 * @type {NormalizedValidator}
 */
export default {
  $validator: alphaNum,
  $message: 'The value must be alpha-numeric'
}
