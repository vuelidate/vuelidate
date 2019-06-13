import isIdentityCard from 'validator/lib/isIdentityCard'
import { withParams, req } from './common'

/**
 * Check if the string is a valid identity card code
 *
 * @param {('ES' | 'any')} [locale=any] - The locale. If 'any' is used, function will check if any of the locals match.
 */
export default (locale = 'any') =>
  withParams(
    { type: 'identityCard', locale },
    (value) => !req(value) || isIdentityCard(value, locale)
  )
