import isMACAddress from 'validator/lib/isMACAddress'
import { req, withParams } from './common'

/**
 * Accepts valid MAC addresses like 00:ff:11:22:33:44:55. Don't forget to call it `macAddress()`, as it has optional parameter.
 * Provide no colons `macAddress(true)` to validate MAC addresses like 00ff1122334455.
 *
 * @param {boolean} [no_colons=false] - If no_colons is true, the validator will allow MAC addresses without the colons
 */
export default (no_colons = false) =>
  withParams({ type: 'macAddress' }, (value) => {
    if (!req(value)) {
      return true
    }
    if (!isNaN(value)) {
      return false
    }

    return isMACAddress(value, { no_colons })
  })
