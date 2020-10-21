import integer from '../raw/integer'

  /**
   * Validate if value is integer.
   * @type {NormalizedValidator}
   */
export default {
  $validator: integer,
  $message: 'Value is not an integer'
}
