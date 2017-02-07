import withParams from '../withParams'
export default withParams({type: 'numeric'}, value => {
  if (typeof value === 'undefined' || value === null || value === '') {
    return true
  }
  return /^[0-9]*$/.test(value)
})
