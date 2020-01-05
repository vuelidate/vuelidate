import { req } from '../common'
import { isPromise } from '../utils/common'

const validate = (prop, val) => !prop ? req(val) : true
/**
 * Returns required if the passed property is truthy
 * @param {Boolean | String | function(): (Boolean | Promise<boolean>)} prop
 * @return {function(*): (Boolean | Promise<Boolean>)}
 */
export default (prop) => (value) => {
  if (typeof prop !== 'function') {
    return validate(prop, value)
  }
  const result = prop()
  if (isPromise(result)) {
    return result.then((response) => {
      return validate(response, value)
    })
  }
  return validate(result, value)
}
