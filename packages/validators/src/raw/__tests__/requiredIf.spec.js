import requiredIf from '../requiredIf'
import { T, F } from '../../../tests/fixtures'

const promiseT = () => Promise.resolve(true)
const promiseF = () => Promise.resolve(false)

describe('requiredIf validator', () => {
  it('should not validate empty string when functional condition is met', async () => {
    await expect(requiredIf(T)('')).resolves.toBe(false)
  })

  it('should validate empty string when functional condition not met', async () => {
    await expect(requiredIf(F)('')).resolves.toBe(true)
  })

  it('should not validate empty string when simple boolean condition is met', async () => {
    await expect(requiredIf('prop')('')).resolves.toBe(false)
  })

  it('should validate empty string when simple boolean condition not met', async () => {
    await expect(requiredIf('')('')).resolves.toBe(true)
  })

  it('should return a promise when passed a promise condition', async () => {
    const response = requiredIf(promiseT)('')
    await expect(response).toHaveProperty('then') // is a promise
  })

  it('should validate value if condition is a truthy promise', async () => {
    expect(await requiredIf(promiseT)('')).toBe(false)
    expect(await requiredIf(promiseT)('someValue')).toBe(true)
  })

  it('should NOT validate value if condition is a falsy promise', async () => {
    expect(await requiredIf(promiseF)('')).toBe(true)
  })

  it('should pass the value to the validation function', () => {
    const validator = jest.fn()
    requiredIf(validator)('foo', 'bar')
    expect(validator).toHaveBeenCalledTimes(1)
    expect(validator).toHaveBeenCalledWith('foo', 'bar')
  })

  it('should have the correct `this` context', async () => {
    const validator = jest.fn(function () { return this.foo === 'foo' })
    const context = { foo: 'foo' }
    const result = await requiredIf.call(context, validator)('value', 'parentVM')
    expect(validator).toHaveReturnedWith(true)
    expect(result).toEqual(true)
  })
})
