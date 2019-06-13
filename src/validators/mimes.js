import { withParams, req } from './common'

/**
 * Check if the file type is one of the specified mime types
 *
 * @param {string[]} mimes
 */
export default (mimes) =>
  withParams({ type: 'mimes', mimes }, (value) => {
    if (!req(value)) {
      return true
    }
    const regex = new RegExp(`${mimes.join('|').replace('*', '.+')}$`, 'i')
    return regex.test(value.type)
  })
