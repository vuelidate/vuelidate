import withParams from './withParams'
export default (...validators) => {
  const $params = {type: 'or', sub: validators.map(v => v.$params || null)}
  return withParams($params, function (...args) {
    return validators.length > 0 &&
      validators.reduce((valid, fn) =>
        valid || fn.apply(this, args), false)
  })
}
