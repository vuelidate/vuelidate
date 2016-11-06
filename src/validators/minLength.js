export default length => value => {
  return value === undefined || value === null
    ? false
    : String(value).length >= length
}
