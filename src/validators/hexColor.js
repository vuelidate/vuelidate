import isHexColor from 'validator/lib/isHexColor'
import { withParams, req } from './common'

/**
 * Check if the string is a hexadecimal color
 */
export default withParams(
  { type: 'hexColor' },
  (value) => !req(value) || isHexColor(value)
)
