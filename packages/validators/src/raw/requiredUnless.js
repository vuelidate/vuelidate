import { req } from '../common'

// TODO: double check
export default (prop) =>
  function (value) {
    return !req(prop) ? req(value) : true
  }
