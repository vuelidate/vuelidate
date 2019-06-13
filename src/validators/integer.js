import isInt from 'validator/lib/isInt'
import { withParams, req } from './common'

/**
 * Accepts positive and negative integers
 *
 * @param {Object} [options] - The options
 * @param {number} [options.min]
 * @param {number} [options.max]
 * @param {number} [options.gt]
 * @param {number} [options.lt]
 * @param {boolean} [options.allow_leading_zeroes]
 */
export default (options) =>
  withParams(
    { type: 'integer', options },
    (value) => !req(value) || isInt(value, options)
  )
