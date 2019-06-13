import isCurrency from 'validator/lib/isCurrency'
import { withParams, req } from './common'
import { merge } from '../lib'

/**
 * Check if the string is a valid currency amount.
 *
 * @param {Object} [options] - The options
 * @param {string} [options.symbol=$]
 * @param {boolean} [options.require_symbol=false]
 * @param {boolean} [options.allow_space_after_symbol=false]
 * @param {boolean} [options.symbol_after_digits=false]
 * @param {boolean} [options.allow_negatives=true]
 * @param {boolean} [options.parens_for_negatives=false]
 * @param {boolean} [options.negative_sign_before_digits=false]
 * @param {boolean} [options.negative_sign_after_digits=false]
 * @param {boolean} [options.allow_negative_sign_placeholder=false]
 * @param {string} [options.thousands_separator=,]
 * @param {string} [options.decimal_separator=.]
 * @param {boolean} [options.allow_decimal=true]
 * @param {boolean} [options.require_decimal=false]
 * @param {number[]} [options.digits_after_decimal=[2]]
 * @param {boolean} [options.allow_space_after_digits=false]
 */
export default (options) => {
  options = merge(options, {
    symbol: '$',
    require_symbol: false,
    allow_space_after_symbol: false,
    symbol_after_digits: false,
    allow_negatives: true,
    parens_for_negatives: false,
    negative_sign_before_digits: false,
    negative_sign_after_digits: false,
    allow_negative_sign_placeholder: false,
    thousands_separator: ',',
    decimal_separator: '.',
    allow_decimal: true,
    require_decimal: false,
    digits_after_decimal: [2],
    allow_space_after_digits: false
  })

  return withParams(
    { type: 'currency', options },
    (value) => !req(value) || isCurrency(value, options)
  )
}
