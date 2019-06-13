import isAlphanumeric from 'validator/lib/isAlphanumeric'
import { withParams, req } from './common'

/**
 * Check if the string contains only letters and numbers
 *
 * @param {Locales} [locale=en-US] - The locale
 */
export default (locale = 'en-US') =>
  withParams(
    { type: 'alphaNum', locale },
    (value) => !req(value) || isAlphanumeric(value, locale)
  )
