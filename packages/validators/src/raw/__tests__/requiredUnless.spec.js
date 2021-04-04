import requiredUnless from '../requiredUnless'
import { T, F } from '../../../tests/fixtures'

describe('requiredUnless validator', () => {
  it('should not validate if prop is falsy', () => {
    expect(requiredUnless(F)('')).resolves.toBe(false)
    expect(requiredUnless(F)('truthy value')).resolves.toBe(true)
  })

  it('should not validate when prop condition is truthy', () => {
    expect(requiredUnless(T)('')).resolves.toBe(true)
    expect(requiredUnless(T)('truthy value')).resolves.toBe(true)
  })

  it('should pass the value to the validation function', () => {
    const validator = jest.fn()
    requiredUnless(validator)('foo', 'bar')
    expect(validator).toHaveBeenCalledTimes(1)
    expect(validator).toHaveBeenCalledWith('foo', 'bar')
  })
})
