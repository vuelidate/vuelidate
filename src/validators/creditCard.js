import isCreditCard from 'validator/lib/isCreditCard'
import { withParams, req } from './common'

/**
 * Check if the string is a credit card
 */
export default withParams(
  { type: 'creditCard' },
  (value) => !req(value) || isCreditCard(value)
)
