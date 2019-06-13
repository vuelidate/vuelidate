import isURL from 'validator/lib/isURL'
import { withParams, req } from './common'
import { merge } from '../lib'

/**
 * Check if the string is an URL
 *
 * @param {Object} [options] - The options
 * @param {string[]} [options.protocols=['http', 'https', 'ftp']]
 * @param {boolean} [options.require_tld=true]
 * @param {boolean} [options.require_protocol=false]
 * @param {boolean} [options.require_host=true]
 * @param {boolean} [options.require_valid_protocol=true]
 * @param {boolean} [options.allow_underscores=false]
 * @param {boolean} [options.host_whitelist=false]
 * @param {boolean} [options.host_blacklist=false]
 * @param {boolean} [options.allow_trailing_dot=false]
 * @param {boolean} [options.allow_protocol_relative_urls=false]
 * @param {boolean} [options.disallow_auth=false]
 */
export default (options) => {
  options = merge(options, {
    protocols: ['http', 'https', 'ftp'],
    require_tld: true,
    require_protocol: false,
    require_host: true,
    require_valid_protocol: true,
    allow_underscores: false,
    host_whitelist: false,
    host_blacklist: false,
    allow_trailing_dot: false,
    allow_protocol_relative_urls: false,
    disallow_auth: false
  })

  return withParams(
    { type: 'url', options },
    (value) => !req(value) || isURL(value, options)
  )
}
