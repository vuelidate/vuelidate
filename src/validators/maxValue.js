import { req, withParams } from './common'

/**
 * Requires entry to have a specified maximum numeric value or Date
 *
 * @param {number | Date} max - The max value
 */
export default (max) =>
  withParams(
    { type: 'maxValue', max },
    (value) =>
      !req(value) ||
      ((!/\s/.test(value) || value instanceof Date) && +value <= +max)
  )
