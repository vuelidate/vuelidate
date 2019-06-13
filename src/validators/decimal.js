import isDecimal from 'validator/lib/isDecimal'
import { withParams, req } from './common'
import { merge } from '../lib'

/**
 * Check if the string represents a decimal number, such as 0.1, .3, 1.1, 1.00003, 4.0, etc
 *
 * @param {Object} [options] - The options
 * @param {boolean} [options.force_decimal=false]
 * @param {string} [options.decimal_digits=1]
 * @param {Locales} [options.locale=en-US]
 */
export default (options) => {
  options = merge(options, {
    force_decimal: false,
    decimal_digits: '1,',
    locale: 'en-US'
  })

  return withParams(
    { type: 'decimal', options },
    (value) => !req(value) || isDecimal(value, options)
  )
}
