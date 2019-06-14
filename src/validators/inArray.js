import isIn from 'validator/lib/isIn'
import { withParams, req } from './common'

/**
 * Check if the string is in a array of allowed values
 *
 * @param {*[]} values - The values array for possible value
 */
export default (values) =>
  withParams(
    { type: 'inArray', values },
    (value) => !req(value) || isIn(value, values)
  )
