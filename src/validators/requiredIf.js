import required from './required'
import withParams from '../withParams'
export default prop => {
  const $params = {type: 'requiredIf', prop}
  return withParams($params, function (value, parentVm) {
    const propVal = typeof prop === 'function'
      ? prop.call(this, parentVm)
      : parentVm[prop]
    return propVal ? required(value) : true
  })
}
