import isBase32 from 'validator/lib/isBase32'
import { withParams, req } from './common'

/**
 * Check if a string is base32 encoded
 */
export default withParams(
  { type: 'base32' },
  (value) => !req(value) || isBase32(value)
)
