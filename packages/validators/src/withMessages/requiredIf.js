import requiredIf from '../raw/requiredIf'

/**
 * Returns required if the passed property is truthy
 * @param {Boolean | String | function(): (Boolean | Promise<boolean>)} prop
 * @return {NormalizedValidator}
 */
export default function (prop) {
  return {
    $validator: requiredIf(prop),
    $message: 'The value is required'
  }
}
