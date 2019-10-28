import { req } from '../common'

// TODO: Double check
export default (prop) =>
  function (value) {
    return req(prop) ? req(value) : true
  }
