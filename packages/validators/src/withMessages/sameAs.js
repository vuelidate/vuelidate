import sameAs from '../raw/sameAs'

/**
 * Check if two values are identical
 * @param {*} equalTo
 * @param {String} [otherName]
 * @return {NormalizedValidator}
 */
export default function (equalTo, otherName = 'other') {
  return {
    $validator: sameAs(equalTo),
    $message: ({ $params }) => `The value must be equal to the ${otherName} value`,
    $params: { equalTo, otherName }
  }
}
