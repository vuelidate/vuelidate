import isISBN from 'validator/lib/isISBN'
import { withParams, req } from './common'

/**
 * Check if the string is an ISBN (version 10 or 13)
 *
 * @param {10 | 13} [version] - The version of ISBN
 */
export default (version) =>
  withParams(
    { type: 'isbn', version },
    (value) => !req(value) || isISBN(value, version)
  )
