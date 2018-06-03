import { ref, withParams } from './common'
export default (lessThan) =>
  withParams({ type: 'less', lt: lessThan }, function(value, parentVm) {
    return value < ref(lessThan, this, parentVm)
  })
