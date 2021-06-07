import and from '../raw/and'
import { withMessage, withParams } from '../common'

/**
 * Validate if all validators match.
 * @param {...*} validators
 * @returns {NormalizedValidator}
 */
export default function (...validators) {
  return withParams({ type: 'and' },
    withMessage('The value does not match all of the provided validators',
      and(...validators)
    )
  )
}
