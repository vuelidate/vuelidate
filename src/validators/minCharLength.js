import { req, withParams } from './common'
export default (length) =>
  withParams(
    { type: 'minLength', min: length },
    (value) => !req(value) || Buffer.byteLength(value, "utf8") >= length
  )
