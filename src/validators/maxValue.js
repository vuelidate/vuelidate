import {req, withParams} from './common'
export default (max) => withParams(
  { type: 'minValue', max }, value =>
    !req(value) || (!/\s/.test(value) && value <= max)
)
