import { req, withParams } from './common'
export default withParams({ type: 'array' }, (value) => {
  if (!req(value)) {
    return true
  }
  return Array.isArray(value)
})
