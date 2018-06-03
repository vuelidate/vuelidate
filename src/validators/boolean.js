import { req, withParams } from './common'
export default withParams({ type: 'boolean' }, (value) => {
  if (!req(value)) {
    return true
  }
  if (typeof value === 'boolean') {
    return true
  }
  const acceptable = ['true', 'false', 0, 1, '0', '1']
  if (typeof value === 'string') {
    value = value.toLowerCase()
  }
  return acceptable.indexOf(value) > -1
})
