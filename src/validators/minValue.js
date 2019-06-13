import { req, withParams } from './common'

/**
 * Requires entry to have a specified minimum numeric value or Date
 *
 * @param {number | Date} min - The min value
 */
export default (min) =>
  withParams(
    { type: 'minValue', min },
    (value) =>
      !req(value) ||
      ((!/\s/.test(value) || value instanceof Date) && +value >= +min)
  )
