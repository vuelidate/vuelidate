import { req } from '../common'
import { isTruthy } from '../utils/common'

export default (validateAgainst) => (value) => {
  return !isTruthy(validateAgainst) ? req(value) : true
}
