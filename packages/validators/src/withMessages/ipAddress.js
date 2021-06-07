import ipAddress from '../raw/ipAddress'

/**
 * Validate if value is an ipAddress string.
 * @type {NormalizedValidator}
 */
export default {
  $validator: ipAddress,
  $message: 'The value is not a valid IP address',
  $params: { type: 'ipAddress' }
}
