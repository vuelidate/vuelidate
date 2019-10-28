import { getValidatorObj } from './common'

/**
 * Allows attaching parameters to a validator
 * @param {Object} $params
 * @param {ValidatorObject|Function} $validator
 * @return {ValidatorObject}
 */
export default function withParams ($params, $validator) {
  const validatorObj = getValidatorObj($validator)

  validatorObj.$params = {
    ...validatorObj.$params,
    ...$params
  }

  return validatorObj
}
