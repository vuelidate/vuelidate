import { req, len, withParams } from './common'

/**
 * Requires the input to have a maximum specified length, inclusive. Works with arrays
 *
 * @param {number} length - The max length
 */
export default (length) =>
  withParams(
    { type: 'maxLength', max: length },
    (value) => !req(value) || len(value) <= length
  )
