import not from '../not'
import {
  F,
  T,
  ValidatorResponseT,
  ValidatorResponseF,
  NormalizedF,
  NormalizedT,
  NormalizedValidatorResponseF,
  NormalizedValidatorResponseT,
  asyncT,
  asyncF
} from '../../../tests/fixtures'

describe('not validator', () => {
  it('should not validate with true function', () => {
    return expect(not(T)('test')).resolves.toBe(false)
  })

  it('should validate with true function on empty input', () => {
    return expect(not(T)('')).resolves.toBe(true)
  })

  it('should validate with async true function', () => {
    return expect(not(asyncT)('')).resolves.toBe(true)
  })

  it('should validate with false function', () => {
    return expect(not(F)('test')).resolves.toBe(true)
  })

  it('should validate with async false function', () => {
    return expect(not(asyncF)('test')).resolves.toBe(true)
  })

  it('should validate with false function on empty input', () => {
    return expect(not(T)('')).resolves.toBe(true)
  })

  it('should pass values or model to function', () => {
    const spy = jest.fn()
    not(spy)(1, 2)
    expect(spy).toHaveBeenCalledWith(1, 2)
  })

  it('should work with functions returning ValidatorResponse', async () => {
    await expect(not(ValidatorResponseT)('test')).resolves.toBe(false)
    await expect(not(ValidatorResponseT)('')).resolves.toBe(true)
    await expect(not(ValidatorResponseF)('test')).resolves.toBe(true)
  })

  it('should work with Normalized Validators', async () => {
    await expect(not(NormalizedT)('test')).resolves.toBe(false)
    await expect(not(NormalizedF)('')).resolves.toBe(true)
    await expect(not(NormalizedValidatorResponseT)('test')).resolves.toBe(false)
    await expect(not(NormalizedValidatorResponseF)('')).resolves.toBe(true)
  })

  it('calls with correct `this` context', async () => {
    const context = { foo: 'foo' }

    const validator = jest.fn(function () { return this === context })

    const result = await not.call(context, validator)('test', 'vm')
    expect(validator).toHaveReturnedWith(true)
    expect(validator).toHaveBeenLastCalledWith('test', 'vm')
    expect(result).toBe(false)
  })
})
