import decimal from '../raw/decimal'

/**
 * Validate if value is decimal number.
 * @type {NormalizedValidator}
 */
export default {
  $validator: decimal,
  $message: 'Value must be decimal',
  $params: { type: 'decimal' }
}
