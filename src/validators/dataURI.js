import isDataURI from 'validator/lib/isDataURI'
import { withParams, req } from './common'

/**
 * Check if the string is a data uri format
 */
export default withParams(
  { type: 'dataURI' },
  (value) => !req(value) || isDataURI(value)
)
