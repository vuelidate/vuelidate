import { normalizeValidatorObject, isFunction, isObject } from './common'

/**
 * Allows attaching parameters to a validator
 * @param {Object} $params
 * @param {NormalizedValidator|Function} $validator
 * @return {NormalizedValidator}
 */
export default function withParams ($params, $validator) {
  if (!isObject($params)) throw new Error(`[@vuelidate/validators]: First parameter to "withParams" should be an object, provided ${typeof $params}`)
  if (!isObject($validator) && !isFunction($validator)) throw new Error(`[@vuelidate/validators]: Validator must be a function or object with $validator parameter`)

  const validatorObj = normalizeValidatorObject($validator)

  validatorObj.$params = {
    ...validatorObj.$params,
    ...$params
  }

  return validatorObj
}
