import requiredIf from '../requiredIf'
import { T, F } from '../../../tests/fixtures'

const promiseT = () => Promise.resolve(true)
const promiseF = () => Promise.resolve(false)

describe('requiredIf validator', () => {
  it('should not validate empty string when functional condition is met', () => {
    expect(requiredIf(T)('')).resolves.toBe(false)
  })

  it('should validate empty string when functional condition not met', () => {
    expect(requiredIf(F)('')).resolves.toBe(true)
  })

  it('should not validate empty string when simple boolean condition is met', () => {
    expect(requiredIf('prop')('')).resolves.toBe(false)
  })

  it('should validate empty string when simple boolean condition not met', () => {
    expect(requiredIf('')('')).resolves.toBe(true)
  })

  it('should return a promise when passed a promise condition', () => {
    const response = requiredIf(promiseT)('')
    expect(response).toHaveProperty('then') // is a promise
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
})
