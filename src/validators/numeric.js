export default value => {
  if (typeof value === 'undefined' || value === null || value === '') {
    return true
  }
  return /^[0-9]*$/.test(value)
}
