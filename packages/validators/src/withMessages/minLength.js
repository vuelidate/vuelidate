import minLength from '../raw/minLength'

/**
 * Check if value is above a threshold.
 * @param {Number | Ref<Number>} length
 * @returns {NormalizedValidator}
 */
export default function (length) {
  return {
    $validator: minLength(length),
    $message: ({ $params }) => `This field should be at least ${$params.length} long.`,
    $params: { length }
  }
}
