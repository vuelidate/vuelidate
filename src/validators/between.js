import { req, withParams } from './common'

/**
 * Checks if a number or Date is in specified bounds. Min and max are both inclusive
 *
 * @param {number | Date} min - The min value
 * @param {number | Date} max - The max value
 */
export default (min, max) =>
  withParams(
    { type: 'between', min, max },
    (value) =>
      !req(value) ||
      ((!/\s/.test(value) || value instanceof Date) &&
        +min <= +value &&
        +max >= +value)
  )
