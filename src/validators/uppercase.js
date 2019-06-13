import isUppercase from 'validator/lib/isUppercase'
import { withParams, req } from './common'

/**
 * Check if the string is uppercase
 */
export default withParams(
  { type: 'uppercase' },
  (value) => !req(value) || isUppercase(value)
)
