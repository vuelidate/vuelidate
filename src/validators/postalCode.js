import isPostalCode from 'validator/lib/isPostalCode'
import { withParams, req } from './common'

/**
 * Check if the string is a postal code
 *
 * @param {(Locales | 'any')} [locale=any] - The locale
 */
export default (locale = 'any') =>
  withParams(
    { type: 'postalCode', locale },
    (value) => !req(value) || isPostalCode(value, locale)
  )
