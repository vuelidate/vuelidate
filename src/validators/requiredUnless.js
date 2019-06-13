import { req, ref, withParams } from './common'

/**
 * Requires non-empty data only if provided property or predicate is false
 *
 * @param prop The locator
 */
export default (prop) =>
  withParams({ type: 'requiredUnless', prop }, function(value, parentVm) {
    return !ref(prop, this, parentVm) ? req(value) : true
  })
