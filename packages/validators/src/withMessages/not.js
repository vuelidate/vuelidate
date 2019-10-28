import not from '../raw/not'

export default validator => ({
  $validator: not(validator),
  $message: `The value does not match the provided validator`
})
