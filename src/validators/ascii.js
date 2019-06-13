import isAscii from 'validator/lib/isAscii'
import { withParams, req } from './common'

/**
 * Check if the string contains ASCII chars only
 */
export default withParams(
  { type: 'ascii' },
  (value) => !req(value) || isAscii(value)
)
