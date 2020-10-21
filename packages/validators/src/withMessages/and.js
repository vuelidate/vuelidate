import and from '../raw/and'

/**
 * Validate if all validators match.
 * @param {...*} validators
 * @returns {NormalizedValidator}
 */
export default function (...validators) {
  return {
    $validator: and(...validators),
    $message: 'The value does not match all of the provided validators'
  }
}
