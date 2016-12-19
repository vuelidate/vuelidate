import required from './required'

export default (min, max) =>
  value => !required(value) || (!/\s/.test(value) && Number(min) <= value && Number(max) >= value)
