export default (min, max) =>
  value => Number(min) <= value && Number(max) >= value
