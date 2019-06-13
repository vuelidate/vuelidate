import isFloat from 'validator/lib/isFloat'
import { withParams, req } from './common'

/**
 * Check if the string is a float
 *
 * @param {Object} [options] - The options
 * @param {number} [options.min] - The min value
 * @param {number} [options.max] - The max value
 * @param {number} [options.gt] - The min value
 * @param {number} [options.lt] - The max value
 * @param {number} [options.locale] - The locale
 */
export default (options) =>
  withParams(
    { type: 'float', options },
    (value) => !req(value) || isFloat(value, options)
  )
