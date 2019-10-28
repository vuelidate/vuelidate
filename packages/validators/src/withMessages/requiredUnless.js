import requiredUnless from '../raw/requiredUnless'

export default prop => ({
  $validator: requiredUnless(prop),
  $message: 'The value is required'
})
