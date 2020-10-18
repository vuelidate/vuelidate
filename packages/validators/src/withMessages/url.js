import url from '../raw/url'

/**
 * Check if a value is a url
 * @type {NormalizedValidator}
 */
export default {
  $validator: url,
  $message: 'The value is not a valid URL address'
}
