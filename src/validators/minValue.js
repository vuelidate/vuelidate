import {req, withParams} from './common'
export default (min) => withParams(
  { type: 'minValue', min },
  value => !req(value) || value >= min
)
