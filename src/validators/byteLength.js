import isByteLength from 'validator/lib/isByteLength'
import { withParams, req } from './common'

/**
 * Check if the string's length (in UTF-8 bytes) falls in a range
 *
 * @param {number} [min=0] - The min byte length
 * @param {number} [max=undefined] - The max byte length
 */
export default (min = 0, max = undefined) =>
  withParams(
    { type: 'byteLength', min, max },
    (value) => !req(value) || isByteLength(value, { min, max })
  )
