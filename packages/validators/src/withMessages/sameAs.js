import sameAs from '../raw/sameAs'

export default (equalTo, otherName) => ({
  $validator: sameAs(equalTo),
  $message: ({ $params }) => `The value must be equal to the ${otherName} value.`,
  $params: { equalTo, otherName }
})
