import { req } from '../common'
import { unwrap } from '../utils/common'

/**
 * Check if value is below a threshold.
 * @param {Number | Ref<Number> | Ref<String>} max
 * @returns {function(*=): boolean}
 */
export default function (max) {
  return value =>
    !req(value) ||
    ((!/\s/.test(value) || value instanceof Date) && +value <= +unwrap(max))
}
