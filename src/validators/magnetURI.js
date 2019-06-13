import isMagnetURI from 'validator/lib/isMagnetURI'
import { withParams, req } from './common'

/**
 * Check if the string is a magnet uri format
 */
export default withParams(
  { type: 'magnetURI' },
  (value) => !req(value) || isMagnetURI(value)
)
