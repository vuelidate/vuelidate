export default (min, max) =>
  value => value === '' || (!/\s/.test(value) && Number(min) <= value && Number(max) >= value)
