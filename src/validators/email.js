import isEmail from 'validator/lib/isEmail'
import { withParams, req } from './common'
import { merge } from '../lib'

/**
 * Accepts valid email addresses. Keep in mind you still have to carefully verify it on your server, as it is impossible to tell if the address is real without sending verification email.
 *
 * @param {Object} [options] - The options
 * @param {boolean} [options.allow_display_name=false]
 * @param {boolean} [options.require_display_name=false]
 * @param {boolean} [options.allow_utf8_local_part=true]
 * @param {boolean} [options.require_tld=true]
 * @param {boolean} [options.allow_ip_domain=false]
 * @param {boolean} [options.domain_specific_validation=false]
 */
export default (options) => {
  options = merge(options, {
    allow_display_name: false,
    require_display_name: false,
    allow_utf8_local_part: true,
    require_tld: true,
    allow_ip_domain: false,
    domain_specific_validation: false
  })

  return withParams(
    { type: 'email', options },
    (value) => !req(value) || isEmail(value, options)
  )
}
