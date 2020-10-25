import { req, len } from '../common'
import { unwrap } from '../utils/common'

/**
 * Check if provided value has a maximum length
 * @param {Number | Ref<Number>} length
 * @returns {function(Array|Object|String): boolean}
 */
export default function (length) {
  return (value) => !req(value) || len(value) <= unwrap(length)
}
