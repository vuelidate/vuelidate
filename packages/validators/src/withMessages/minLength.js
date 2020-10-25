import minLength from '../raw/minLength'

/**
 * Check if value is above a threshold.
 * @param {Number | Ref<Number>} min
 * @returns {NormalizedValidator}
 */
export default function (min) {
  return {
    $validator: minLength(min),
    $message: ({ $params }) => `This field should be at least ${$params.min} long.`,
    $params: { min }
  }
}
