import { withParams, req } from './common'

/**
 * Requires non-empty data. Checks for empty arrays and strings containing only whitespaces
 */
export default withParams({ type: 'required' }, (value) => {
  if (typeof value === 'string') {
    return req(value.trim())
  }
  return req(value)
})
