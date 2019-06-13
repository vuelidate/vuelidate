import matches from 'validator/lib/matches'
import { withParams, req } from './common'

/**
 * Check if string matches the pattern.
 *
 * @param {RegExp | string} pattern - The pattern
 * @param {string} [modifiers] - The regex modifiers
 */
export default (pattern, modifiers) =>
  withParams(
    { type: 'matches', pattern },
    (value) => !req(value) || matches(value, pattern, modifiers)
  )
