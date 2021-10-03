import numeric from '../raw/numeric'

/**
 * Check whether a value is numeric.
 * @type NormalizedValidator
 */
export default {
  $validator: numeric,
  $message: 'Value must be numeric',
  $params: {
    type: 'numeric'
  }
}
