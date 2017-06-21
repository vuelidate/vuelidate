import { withParams } from './common'
export default (min) => withParams(
  { type: 'minValue', min },
    value => value >= min)
