import equals from 'validator/lib/equals'
import { withParams, req } from './common'

/**
 * Check if the string matches the comparison
 *
 * @param {string} comparison - The string to check if is equals
 */
export default (comparison) =>
  withParams(
    { type: 'equals', comparison },
    (value) => !req(value) || equals(value, comparison)
  )
