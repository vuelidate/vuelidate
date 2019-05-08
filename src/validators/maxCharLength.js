import { req, withParams } from './common'
export default (length) =>
  withParams(
    { type: 'maxLength', max: length },
    (value) => !req(value) || Buffer.byteLength(value, "utf8") <= length
  )
