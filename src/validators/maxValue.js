import { withParams } from './common'
export default (max) => withParams(
  { type: 'minValue', max },
    value => value <= max
  )
