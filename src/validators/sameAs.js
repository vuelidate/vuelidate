export default equalTo => function (value, parentVm) {
  const compareTo = typeof equalTo === 'function'
    ? equalTo.call(this, parentVm)
    : parentVm[equalTo]
  return value === compareTo
}
