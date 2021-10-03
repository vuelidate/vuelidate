import withAsync from '@vuelidate/validators/src/utils/withAsync'

export function toAsync (validator, time = 0) {
  return withAsync((value) => new Promise((resolve) =>
    setTimeout(() => resolve(validator(value)), time)
  ))
}

export const isEven = (v) => {
  return v % 2 === 0
}
export const isOdd = (v) => v % 2 === 1

export const asyncIsEven = toAsync(isEven, 5)
export const asyncIsOdd = toAsync(isOdd, 5)
