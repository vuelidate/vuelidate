import isBase64 from 'validator/lib/isBase64'
import { withParams, req } from './common'

/**
 * Check if a string is base64 encoded
 */
export default withParams(
  { type: 'base64' },
  (value) => !req(value) || isBase64(value)
)
