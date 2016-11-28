export default equalTo => function (value, parentVm) {
  if (value === null || value === undefined || value === '') {
    return true
  }

  const compareTo = typeof equalTo === 'function'
    ? equalTo.call(this, parentVm)
    : parentVm[equalTo]
  return value === compareTo
}
