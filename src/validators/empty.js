import isEmpty from 'validator/lib/isEmpty'
import { withParams, req } from './common'

/**
 * Check if the string has a length of zero
 *
 * @param {boolean} [ignore_whitespace=false]
 */
export default (ignore_whitespace = false) =>
  withParams(
    { type: 'empty', ignore_whitespace },
    (value) => !req(value) || isEmpty(value, { ignore_whitespace })
  )
