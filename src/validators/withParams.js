export default (params, fn) => {
  fn.$params = params
  return fn
}
