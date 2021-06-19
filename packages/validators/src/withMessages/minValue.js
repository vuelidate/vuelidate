import minValue from '../raw/minValue'

/**
 * Check if a value is above a threshold.
 * @param {String | Number | Ref<Number> | Ref<String>} min
 * @returns {NormalizedValidator}
 */
export default function (min) {
  return {
    $validator: minValue(min),
    $message: ({ $params }) => `The minimum value allowed is ${$params.min}`,
    $params: { min, type: 'minValue' }
  }
}
