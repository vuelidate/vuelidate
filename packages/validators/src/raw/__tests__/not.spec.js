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
  asyncF, NormalizedAsyncT, NormalizedAsyncF, NormalizedAsyncValidatorResponseT, NormalizedAsyncValidatorResponseF
} from '../../../tests/fixtures'

describe('not validator', () => {
  it('should not validate with true function', () => {
    expect(not(T)('test')).toBe(false)
  })

  it('should validate with true function on empty input', () => {
    expect(not(T)('')).toBe(true)
  })

  it('should validate with async true function', () => {
    expect(not(asyncT)('')).toBe(true)
  })

  it('should validate with false function', () => {
    expect(not(F)('test')).toBe(true)
  })

  it('should validate with async false function', () => {
    return expect(not(asyncF)('test')).resolves.toBe(true)
  })

  it('should validate with `false` function on empty input', () => {
    expect(not(T)('')).toBe(true)
  })

  it('should pass values or model to function', () => {
    const spy = jest.fn()
    not(spy)(1, 2)
    expect(spy).toHaveBeenCalledWith(1, 2)
  })

  it('should work with functions returning ValidatorResponse', () => {
    expect(not(ValidatorResponseT)('test')).toBe(false)
    expect(not(ValidatorResponseT)('')).toBe(true)
    expect(not(ValidatorResponseF)('test')).toBe(true)
  })

  it('should work with Normalized Validators', () => {
    expect(not(NormalizedT)('test')).toBe(false)
    expect(not(NormalizedF)('')).toBe(true)
    expect(not(NormalizedValidatorResponseT)('test')).toBe(false)
    expect(not(NormalizedValidatorResponseF)('')).toBe(true)
  })

  it('should work with Normalized Async Validators', async () => {
    await expect(not(NormalizedAsyncT)('true')).resolves.toBe(false)
    await expect(not(NormalizedAsyncF)('true')).resolves.toBe(true)
    await expect(not(NormalizedAsyncValidatorResponseT)('true')).resolves.toBe(false)
    await expect(not(NormalizedAsyncValidatorResponseF)('true')).resolves.toBe(true)
  })

  it('calls with correct `this` context', () => {
    const context = { foo: 'foo' }
    let that
    const validator = function () { that = this }

    not(validator).call(context, 'test', 'vm')
    expect(that).toEqual(context)
  })
})
