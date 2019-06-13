import isISSN from 'validator/lib/isISSN'
import { withParams, req } from './common'

/**
 * Check if the string is an ISSN
 *
 * @param {boolean} [case_sensitive=false]
 * @param {boolean} [require_hyphen=false]
 */
export default (case_sensitive = false, require_hyphen = false) =>
  withParams(
    { type: 'issn', case_sensitive, require_hyphen },
    (value) => !req(value) || isISSN(value, { case_sensitive, require_hyphen })
  )
