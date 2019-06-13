import isMobilePhone from 'validator/lib/isMobilePhone'
import { withParams, req } from './common'

/**
 * Check if the string is a mobile phone number
 *
 * @param {(Locales | Locales[] | 'any')} [locale=any] - The locale
 * @param {boolean} [strictMode=false] - If this is set to true, the mobile phone number must be supplied with the country code and therefore must start with +
 */
export default (locale = 'any', strictMode = false) =>
  withParams(
    { type: 'mobilePhone', locale, strictMode },
    (value) => !req(value) || isMobilePhone(value, locale, { strictMode })
  )
