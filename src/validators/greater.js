import { ref, regex, withParams } from './common'
export default (greaterThan) =>
  withParams({ type: 'greater', gt: greaterThan }, function(value, parentVm) {
    return value > ref(greaterThan, this, parentVm)
  })
