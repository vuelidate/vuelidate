import isJWT from 'validator/lib/isJWT'
import { withParams, req } from './common'

/**
 * Check if the string is valid JWT token
 */
export default withParams(
  { type: 'jwt' },
  (value) => !req(value) || isJWT(value)
)
