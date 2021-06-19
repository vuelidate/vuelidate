import requiredUnless from '../requiredUnless'
import { T, F } from '../../../tests/fixtures'
import { ref } from 'vue-demi'

describe('requiredUnless validator', () => {
  it('should not validate if prop is falsy', () => {
    expect(requiredUnless(F)('')).toBe(false)
    expect(requiredUnless(F)('truthy value')).toBe(true)
  })

  it('should not validate when prop condition is truthy', async () => {
    expect(requiredUnless(T)('')).toBe(true)
    expect(requiredUnless(T)('truthy value')).toBe(true)
  })

  it('should pass the value to the validation function', () => {
    const validator = jest.fn()
    requiredUnless(validator)('foo', 'bar')
    expect(validator).toHaveBeenCalledTimes(1)
    expect(validator).toHaveBeenCalledWith('foo', 'bar')
  })

  it('should have the correct `this` context', () => {
    let that
    const validator = jest.fn(function () { that = this })
    const context = { foo: 'foo' }
    requiredUnless(validator).call(context, '', '')
    expect(that).toEqual(context)
  })

  it('should work with a ref', () => {
    const prop = ref(true)
    expect(requiredUnless(prop)(true)).toBe(true)
    prop.value = false
    expect(requiredUnless(prop)('')).toBe(false)
    expect(requiredUnless(prop)('1')).toBe(true)
  })
})
