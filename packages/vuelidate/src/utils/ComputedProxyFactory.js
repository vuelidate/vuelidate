import { computed } from 'vue-demi'

/**
 * Helper proxy for instance property access. It makes every reference
 * reactive for the validation function
 * @param target
 * @return {*|ComputedRef<*>}
 */
export function ComputedProxyFactory (target) {
  return new Proxy(target, {
    get (target, prop) {
      return (typeof target[prop] === 'object')
        ? ComputedProxyFactory(target[prop])
        : computed(() => target[prop])
    }
  })
}
