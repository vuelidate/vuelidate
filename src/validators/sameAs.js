import withParams from './withParams'
export default equalTo => {
  const $params = {type: 'sameAs', eq: equalTo}
  return withParams($params, function (value, parentVm) {
    const compareTo = typeof equalTo === 'function'
      ? equalTo.call(this, parentVm)
      : parentVm[equalTo]
    return value === compareTo
  })
}
