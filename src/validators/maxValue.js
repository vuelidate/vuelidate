import { req, withParams } from './common'
export default (max) => withParams(
  { type: 'minValue', max },
    value => !req(value) || value <= max
  )
