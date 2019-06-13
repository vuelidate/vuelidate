import isLatLong from 'validator/lib/isLatLong'
import { withParams, req } from './common'

/**
 * Check if the string is a valid latitude-longitude coordinate in the format lat,long or lat, long
 */
export default withParams(
  { type: 'latLong' },
  (value) => !req(value) || isLatLong(value)
)
