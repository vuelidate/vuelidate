import email from '../raw/email'

/**
 * Validate if value is an email.
 * @type {NormalizedValidator}
 */
export default {
  $validator: email,
  $message: 'Value is not a valid email address',
  $params: { type: 'email' }
}
