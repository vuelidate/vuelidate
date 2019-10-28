import requiredIf from '../raw/requiredIf'

export default prop => ({
  $validator: requiredIf(prop),
  $message: 'The value is required'
})
