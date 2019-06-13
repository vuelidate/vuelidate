import isFQDN from 'validator/lib/isFQDN'
import { withParams, req } from './common'
import { merge } from '../lib'

/**
 * Check if the string is a fully qualified domain name (e.g. domain.com)
 *
 * @param {Object} [options] - The options
 * @param {boolean} [options.require_tld=true]
 * @param {boolean} [options.allow_underscores=false]
 * @param {boolean} [options.allow_trailing_dot=false]
 */
export default (options) => {
  options = merge(options, {
    require_tld: true,
    allow_underscores: false,
    allow_trailing_dot: false
  })

  return withParams(
    { type: 'fqdnAddress', options },
    (value) => !req(value) || isFQDN(value, options)
  )
}
