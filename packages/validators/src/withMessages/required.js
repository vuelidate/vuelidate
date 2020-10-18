import required from '../raw/required'

/**
 * Check if a value is empty or not.
 * @type {NormalizedValidator}
 */
export default {
  $validator: required,
  $message: 'Value is required'
}
