import { isRef } from '@vue/composition-api'

export function isFunction (val) {
  return typeof val === 'function'
}

export function unwrap (val) {
  return isRef(val) ? val.value : val
}

export function getValidatorObj (validator) {
  return isFunction(validator.$validator)
    ? validator
    : {
      $validator: validator
    }
}
