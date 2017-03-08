import withParams from '../withParams'
export default withParams({type: 'alpha'}, value => {
  if (typeof value === 'undefined' || value === null || value === '') {
    return true
  }
  return /^[a-zA-Z]*$/.test(value)
})
