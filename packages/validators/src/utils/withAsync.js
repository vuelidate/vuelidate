import { normalizeValidatorObject } from './common'
/**
 * @typedef {function(*): Promise<boolean|ValidatorResponse>} asyncValidator
 */

/**
 * @typedef {Ref<*>[]|function(*): *} watchTargets
 */

/**
 * Wraps validators that returns a Promise.
 * @param {asyncValidator} $validator
 * @param {watchTargets} $watchTargets
 * @return {{$async: boolean, $validator: asyncValidator, $watchTargets: watchTargets}}
 */
export default function withAsync ($validator, $watchTargets = []) {
  const validatorObj = normalizeValidatorObject($validator)
  return {
    ...validatorObj,
    $async: true,
    $watchTargets
  }
}
