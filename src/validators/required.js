export default value => {
  if (Array.isArray(value)) return !!value.length

  return value === undefined || value === null
    ? false
    : !!String(value).length
}
