import maxValue from '../raw/maxValue'

/**
 * Check if value is below a threshold.
 * @param {Number | Ref<Number> | Ref<String>} max
 * @return {NormalizedValidator}
 */
export default max => ({
  $validator: maxValue(max),
  $message: ({ $params }) => `The maximum value is ${$params.max}`,
  $params: { max, type: 'maxValue' }
})
