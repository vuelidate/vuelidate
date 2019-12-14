import { getValidatorObj, isObject } from './common'

/**
 * Allows attaching parameters to a validator
 * @param {Object} $params
 * @param {ValidatorObject|Function} $validator
 * @return {ValidatorObject}
 */
export default function withParams ($params, $validator) {
  if (!isObject($params)) throw new Error(`[@vuelidate/validators]: First parameter to "withParams" should be an object, provided ${typeof $params}`)

  const validatorObj = getValidatorObj($validator)

  validatorObj.$params = {
    ...validatorObj.$params,
    ...$params
  }

  return validatorObj
}
