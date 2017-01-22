import withParams from './withParams'
export default withParams({type: 'alphaNum'}, value => {
  if (typeof value === 'undefined' || value === null || value === '') {
    return true
  }
  return /^[a-zA-Z0-9]*$/.test(value)
})
