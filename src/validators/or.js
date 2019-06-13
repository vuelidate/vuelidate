import { withParams } from './common'

/**
 * Passes when at least one of provided validators passes
 *
 * @param validators - The validators
 */
export default (...validators) => {
  return withParams({ type: 'or' }, function(...args) {
    return (
      validators.length > 0 &&
      validators.reduce((valid, fn) => valid || fn.apply(this, args), false)
    )
  })
}
