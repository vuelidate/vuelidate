import isHexadecimal from 'validator/lib/isHexadecimal'
import { withParams, req } from './common'

/**
 * Check if the string is a hexadecimal number
 */
export default withParams(
  { type: 'hexadecimal' },
  (value) => !req(value) || isHexadecimal(value)
)
