import isAlpha from 'validator/lib/isAlpha'
import { withParams, req } from './common'

/**
 * Check if the string contains only letters (a-zA-Z)
 *
 * @param {Locales} [locale=en-US] - The locale
 */
export default (locale = 'en-US') =>
  withParams(
    { type: 'alpha', locale },
    (value) => !req(value) || isAlpha(value, locale)
  )
