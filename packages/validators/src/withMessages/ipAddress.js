import ipAddress from '../raw/ipAddress'

export default {
  $validator: ipAddress,
  $message: 'The value is not a valid IP address'
}
