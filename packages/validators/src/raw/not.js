import { req } from '../common'

// TODO: Double check this
export default (validator) => function (value) {
  return !req(value) || !validator.call(this, value)
}
