import macAddress from '../raw/macAddress'

/**
 * Validate if value is a valid Mac Address string.
 * @returns {NormalizedValidator}
 */
export default function (separator) {
  return {
    $validator: macAddress(separator),
    $message: 'The value is not a valid MAC Address',
    $params: { type: 'macAddress' }
  }
}
