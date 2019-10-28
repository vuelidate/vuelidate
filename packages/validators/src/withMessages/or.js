import or from '../raw/or'

export default (...validators) => ({
  $validator: or(...validators),
  $message: 'The value does not match any of the provided validators'
})
