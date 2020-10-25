import maxLength from '../raw/maxLength'

/**
 * Validate the max length of a string.
 * @param {Number} max
 * @return {NormalizedValidator}
 */
export default function (max) {
  return {
    $validator: maxLength(max),
    $message: ({ $params }) => `The maximum length allowed is ${$params.max}`,
    $params: { max }
  }
}
