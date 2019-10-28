import { req } from '../common'

export default (value) => {
  if (typeof value === 'string') {
    return req(value.trim())
  }
  return req(value)
}
