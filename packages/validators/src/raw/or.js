import { unwrapNormalizedValidator, unwrapValidatorResponse } from '../utils/common'

function syncOr (validators) {
  return function (...args) {
    return validators.reduce((valid, fn) => {
      if (unwrapValidatorResponse(valid)) return valid
      return unwrapNormalizedValidator(fn).apply(this, args)
    }, false)
  }
}

function asyncOr (validators) {
  return function (...args) {
    return validators
      .reduce(async (valid, fn) => {
        const r = await valid
        if (unwrapValidatorResponse(r)) return r
        return unwrapNormalizedValidator(fn).apply(this, args)
      }, Promise.resolve(false))
  }
}

/**
 * Returns true when one of the provided functions returns true.
 * @param {...(NormalizedValidator|Function)} validators
 * @return {{$validator: function(...[*]=): (boolean | Promise<boolean>), $async: boolean, $watchTargets: any[]}}
 */
export default function or (...validators) {
  const $async = validators.some(v => v.$async)
  const $watchTargets = validators.reduce((all, v) => {
    if (!v.$watchTargets) return all
    return all.concat(v.$watchTargets)
  }, [])
  let $validator = () => false
  if (validators.length) $validator = $async ? asyncOr(validators) : syncOr(validators)
  return {
    $async,
    $validator,
    $watchTargets
  }
}
