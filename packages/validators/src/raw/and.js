import { unwrapNormalizedValidator, unwrapValidatorResponse } from '../utils/common'

function syncAnd (validators) {
  return function (...args) {
    return validators.reduce((valid, fn) => {
      if (!unwrapValidatorResponse(valid)) return valid
      return unwrapNormalizedValidator(fn).apply(this, args)
    }, true)
  }
}

/**
 *
 * @param validators
 * @return {function(...[*]=): Promise<boolean>}
 */
function asyncAnd (validators) {
  return function (...args) {
    return validators.reduce(async (valid, fn) => {
      const r = await valid
      if (!unwrapValidatorResponse(r)) return r
      return unwrapNormalizedValidator(fn).apply(this, args)
    }, Promise.resolve(true))
  }
}

/**
 * Returns true when all validators are truthy
 * @param {...(NormalizedValidator | Function)} validators
 * @return {{$validator: function(...[*]=): (boolean | Promise<boolean>), $async: boolean, $watchTargets: any[]}}
 */
export default function and (...validators) {
  const $async = validators.some(v => v.$async)
  const $watchTargets = validators.reduce((all, v) => {
    if (!v.$watchTargets) return all
    return all.concat(v.$watchTargets)
  }, [])
  let $validator = () => false
  if (validators.length) $validator = $async ? asyncAnd(validators) : syncAnd(validators)
  return {
    $async,
    $validator,
    $watchTargets
  }
}
