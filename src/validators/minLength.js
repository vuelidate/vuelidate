import { req, len, withParams } from './common'

/**
 * Requires the input to have a minimum specified length, inclusive. Works with arrays
 *
 * @param {number} length - The min length
 */
export default (length) =>
  withParams(
    { type: 'minLength', min: length },
    (value) => !req(value) || len(value) >= length
  )
