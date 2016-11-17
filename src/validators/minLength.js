export default length => value => {
  if (Array.isArray(value)) return value.length >= length

  return value === undefined || value === null
    ? false
    : String(value).trim().length >= length
}
