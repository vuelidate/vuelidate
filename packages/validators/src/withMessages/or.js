import or from '../raw/or'

/**
 * Returns true when one of the provided functions returns true.
 * @param {...(NormalizedValidator|Function)} validators
 * @return {NormalizedValidator}
 */
export default function (...validators) {
  return {
    $validator: or(...validators),
    $message: 'The value does not match any of the provided validators'
  }
}
