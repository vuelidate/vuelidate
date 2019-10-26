import { getValidatorObj } from './common'

/**
 * Allows attaching parameters to a validator
 * @param {Function | Object} $validator
 * @param {Object} $params
 * @return {{$params: *, $validator: *}}
 */
export default function withParams ($validator, $params) {
  const validatorObj = getValidatorObj($validator)

  validatorObj.$params = {
    ...validatorObj.$params,
    ...$params
  }

  return validatorObj
}
