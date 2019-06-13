import isIP from 'validator/lib/isIP'
import { withParams, req } from './common'

/**
 * Accepts valid IPv4/IPv6 addresses in dotted decimal notation like 127.0.0.1.
 *
 * @param {4 | 6} [version] - The version of ip
 */
export default (version) =>
  withParams(
    { type: 'ipAddress', version },
    (value) => !req(value) || isIP(value, version)
  )
