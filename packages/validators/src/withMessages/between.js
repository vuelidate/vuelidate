import between from '../raw/between'

/**
 * Checks if a value is between two values.
 * @param {Ref<Number> | Number} min
 * @param {Ref<Number> | Number} max
 * @return {NormalizedValidator}
 */
export default function (min, max) {
  return {
    $validator: between(min, max),
    $message: ({ $params }) => `The value must be between ${$params.min} and ${$params.max}`,
    $params: { min, max }
  }
}
