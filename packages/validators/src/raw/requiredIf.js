import { req } from './core'
import { unwrap } from '../common'

const validate = (prop, val) => prop ? req(typeof val === 'string' ? val.trim() : val) : true
/**
 * Returns required if the passed property is truthy
 * @param {Boolean | String | function(any): Boolean | Ref<string | boolean>} propOrFunction
 * @return {function(value: *, parentVM: object): Boolean}
 */
export default function requiredIf (propOrFunction) {
  return function (value, parentVM) {
    if (typeof propOrFunction !== 'function') {
      return validate(unwrap(propOrFunction), value)
    }
    const result = propOrFunction.call(this, value, parentVM)
    return validate(result, value)
  }
}
