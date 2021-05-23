import asyncOr from '../raw/asyncOr'

/**
 * Returns true when one of the provided functions returns true.
 * @param {...(NormalizedValidator|Function)} validators
 * @return {NormalizedValidator}
 */
export default function (...validators) {
  return {
    $validator: asyncOr(...validators),
    $message: 'The value does not match any of the provided validators'
  }
}
