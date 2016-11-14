export default (...validators) => {
  return function (...args) {
    validators.reduce((valid, fn) =>
      valid && fn.apply(this, args), false)
  }
}
