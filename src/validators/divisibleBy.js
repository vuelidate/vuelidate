import isDivisibleBy from 'validator/lib/isDivisibleBy'
import { withParams, req } from './common'

/**
 * Check if the string is a number that's divisible by another
 *
 * @param {number} number - The number
 */
export default (number) =>
  withParams(
    { type: 'divisibleBy', number },
    (value) => !req(value) || isDivisibleBy(value, number)
  )
