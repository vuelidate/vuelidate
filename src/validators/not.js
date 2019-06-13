import { withParams, req } from './common'

/**
 * Passes when provided validator would not pass, fails otherwise. Can be chained with other validators like `not(sameAs('field'))`
 *
 * @param validator - The validator
 */
export default (validator) => {
  return withParams({ type: 'not' }, function(value, vm) {
    return !req(value) || !validator.call(this, value, vm)
  })
}
