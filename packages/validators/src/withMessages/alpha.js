import alpha from '../raw/alpha'

/**
 * Validate if value is alphabetical string.
 * @type {NormalizedValidator}
 */
export default {
  $validator: alpha,
  $message: 'The value is not alphabetical'
}
