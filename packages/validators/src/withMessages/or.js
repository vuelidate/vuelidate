import or from '../raw/or'
import { withMessage, withParams } from '../common'

/**
 * Returns true when one of the provided functions returns true.
 * @param {...(NormalizedValidator|Function)} validators
 * @return {NormalizedValidator}
 */
export default function (...validators) {
  return withParams({ type: 'or' },
    withMessage('The value does not match any of the provided validators',
      or(...validators))
  )
}
