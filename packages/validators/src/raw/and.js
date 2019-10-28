export default (...validators) => {
  return function (...args) {
    return (
      validators.length > 0 &&
      validators.reduce((valid, fn) => valid && fn.apply(this, args), true)
    )
  }
}
