import { ref, withParams } from './common'
export default (lte) =>
  withParams({ type: 'lessEqual', lte: lte }, function(value, parentVm) {
    return value <= ref(lte, this, parentVm)
  })
