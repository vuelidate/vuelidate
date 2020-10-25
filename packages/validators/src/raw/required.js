import { req } from '../common'

/**
 * Validates if a value is empty.
 * @param {String | Array | Date | Object} value
 * @returns {boolean}
 */
export default function (value) {
  if (typeof value === 'string') {
    value = value.trim()
  }
  return req(value)
}
