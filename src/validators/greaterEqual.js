import { ref, withParams } from './common'
export default (gte) =>
  withParams({ type: 'greaterEqual', gte: gte }, function(value, parentVm) {
    return value >= ref(gte, this, parentVm)
  })
