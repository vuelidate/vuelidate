import { req } from '../common'
import { isTruthy } from '../utils/common'

// TODO: Double check
export default (prop) => (value) => {
  return isTruthy(prop) ? req(value) : true
}
