import requiredUnless from '../requiredUnless'
import { T, F } from '../../../tests/fixtures'

describe('requiredUnless validator', () => {
  it('should not validate if prop is falsy', async () => {
    await expect(requiredUnless(F)('')).resolves.toBe(false)
    await expect(requiredUnless(F)('truthy value')).resolves.toBe(true)
  })

  it('should not validate when prop condition is truthy', async () => {
    await expect(requiredUnless(T)('')).resolves.toBe(true)
    await expect(requiredUnless(T)('truthy value')).resolves.toBe(true)
  })

  it('should pass the value to the validation function', async () => {
    const validator = jest.fn()
    requiredUnless(validator)('foo', 'bar')
    await expect(validator).toHaveBeenCalledTimes(1)
    await expect(validator).toHaveBeenCalledWith('foo', 'bar')
  })

  it('should have the correct `this` context', async () => {
    const validator = jest.fn(function () { return this.foo === 'foo' })
    const context = { foo: 'foo' }
    const result = await requiredUnless.call(context, validator)('', '')
    await expect(validator).toHaveReturnedWith(true)
    await expect(result).toEqual(true)
  })
})
