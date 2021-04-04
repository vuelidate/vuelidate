import { req } from './core'

const validate = (prop, val) => !prop ? req(val) : true
/**
 * Returns required if the passed property is falsy.
 * @param {Boolean | String | function(any): (Boolean | Promise<boolean>)} propOrFunction
 * @return {function(*): (Boolean | Promise<Boolean>)}
 */
export default function requiredUnless (propOrFunction) {
  return async function requiredUnlessInternal (value, parentVM) {
    if (typeof propOrFunction !== 'function') {
      return validate(propOrFunction, value)
    }
    const result = await propOrFunction.call(this, value, parentVM)
    return validate(result, value)
  }
}
