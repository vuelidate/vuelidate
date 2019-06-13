import isBoolean from 'validator/lib/isBoolean'
import { withParams, req } from './common'

/**
 * Check if a string is a boolean
 */
export default withParams(
  { type: 'boolean' },
  (value) => !req(value) || isBoolean(value)
)
