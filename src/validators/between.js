import required from './required'
import withParams from './withParams'

export default (min, max) =>
  withParams({type: 'between', min, max}, value =>
    !required(value) || (!/\s/.test(value) && Number(min) <= value && Number(max) >= value))
