import withParams from './withParams'
export default length => withParams({ type: 'minLength', min: length }, value => {
  if (Array.isArray(value)) return value.length === 0 || value.length >= length

  return value === undefined || value === null
    ? true
    : value === '' || String(value).length >= length
})
