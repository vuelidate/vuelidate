import isNumeric from 'validator/lib/isNumeric'
import { withParams, req } from './common'

/**
 * Check if the string contains only numbers
 *
 * @param {boolean} [no_symbols=false] - If no_symbols is true, the validator will reject numeric strings that feature a symbol (e.g. +, -, or .)
 */
export default (no_symbols = false) =>
  withParams(
    { type: 'numeric', no_symbols },
    (value) => !req(value) || isNumeric(value, { no_symbols })
  )
