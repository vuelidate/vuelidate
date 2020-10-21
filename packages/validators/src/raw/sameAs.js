import { unwrap } from '../utils/common'

/**
 * Check if two values are identical.
 * @param {*} equalTo
 * @return {function(*=): boolean}
 */
export default function (equalTo) {
  return value => unwrap(value) === unwrap(equalTo)
}
