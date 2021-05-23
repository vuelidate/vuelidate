import asyncAnd from '../raw/asyncAnd'

/**
 * Validate if all validators match.
 * @param {...*} validators
 * @returns {NormalizedValidator}
 */
export default function (...validators) {
  return {
    $validator: asyncAnd(...validators),
    $message: 'The value does not match all of the provided validators'
  }
}
