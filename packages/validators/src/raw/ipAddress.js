import { req } from '../common'

/**
 * Check if a string is an IP Address
 * @param {String} value
 * @returns {boolean}
 */
export default function (value) {
  if (!req(value)) {
    return true
  }

  if (typeof value !== 'string') {
    return false
  }

  const nibbles = value.split('.')
  return nibbles.length === 4 && nibbles.every(nibbleValid)
}

const nibbleValid = (nibble) => {
  if (nibble.length > 3 || nibble.length === 0) {
    return false
  }

  if (nibble[0] === '0' && nibble !== '0') {
    return false
  }

  if (!nibble.match(/^\d+$/)) {
    return false
  }

  const numeric = +nibble | 0
  return numeric >= 0 && numeric <= 255
}
