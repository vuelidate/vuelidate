import contains from 'validator/lib/contains'
import { withParams, req } from './common'

/**
 * Check if the string contains the seed
 *
 * @param {string} seed - The seed for check if that is contains
 */
export default (seed) =>
  withParams(
    { type: 'contains', seed },
    (value) => !req(value) || contains(value, seed)
  )
