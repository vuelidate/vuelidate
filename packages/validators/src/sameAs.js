import sameAs from './raw/sameAs'

export default equalTo => ({
  $validator: sameAs,
  $message: 'This field should be equal as the other field.',
  $params: { equalTo }
})
