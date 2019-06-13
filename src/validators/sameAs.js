import { ref, withParams } from './common'

/**
 * Checks for equality with a given property.
 *
 * @param equalTo The locator
 */
export default (equalTo) =>
  withParams({ type: 'sameAs', eq: equalTo }, function(value, parentVm) {
    return value === ref(equalTo, this, parentVm)
  })
