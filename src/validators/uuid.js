import isUUID from 'validator/lib/isUUID'
import { withParams, req } from './common'

/**
 * Check if the string is a UUID (version 3, 4 or 5)
 *
 * @param {3 | 4 | 5} [version] - The version of UUID
 */
export default (version) =>
  withParams(
    { type: 'uuid', version },
    (value) => !req(value) || isUUID(value, version)
  )
