import and from '../and'
import {
  F,
  T,
  ValidatorResponseT,
  ValidatorResponseF,
  NormalizedF,
  NormalizedT,
  NormalizedValidatorResponseF,
  NormalizedValidatorResponseT,
  asyncF,
  asyncT
} from '../../../tests/fixtures'

describe('and validator', () => {
  it('should not validate no functions', () => {
    expect(and()()).toBe(false)
  })

  it('should not validate single false function', () => {
    return expect(and(F)()).resolves.toBe(false)
  })

  it('should validate single true function', () => {
    return expect(and(T)()).resolves.toBe(true)
  })

  it('should validate all true functions', () => {
    return expect(and(T, T, T)()).resolves.toBe(true)
  })

  it('should validate all to true, when mixed function types', () => {
    return expect(and(T, asyncT, T)()).resolves.toBe(true)
  })

  it('should not validate some true functions', () => {
    return expect(and(T, F, T)()).resolves.toBe(false)
  })

  it('should not validate some true functions, when mixed function types', () => {
    expect(and(T, asyncF, T)()).resolves.toBe(false)
  })

  it('should not validate all false functions', async () => {
    await expect(and(F, F, F)()).resolves.toBe(false)
  })

  it('should not validate all false functions, when async', async () => {
    await expect(and(asyncF, asyncF, asyncF)()).resolves.toBe(false)
  })

  it('should pass values and model to function', async () => {
    const spy = jest.fn()
    await and(spy)(1, 2)
    expect(spy).toHaveBeenCalledWith(1, 2)
  })

  it('should work with functions returning ValidatorResponse', async () => {
    await expect(and(ValidatorResponseT, ValidatorResponseT, ValidatorResponseT)()).resolves.toBe(true)
    await expect(and(ValidatorResponseF, ValidatorResponseF, ValidatorResponseF)()).resolves.toBe(false)
  })

  it('should work with Normalized Validators', async () => {
    await expect(and(NormalizedT, NormalizedT)()).resolves.toBe(true)
    await expect(and(NormalizedF, NormalizedF)()).resolves.toBe(false)
    await expect(and(NormalizedValidatorResponseT, NormalizedValidatorResponseT)()).resolves.toBe(true)
    await expect(and(NormalizedValidatorResponseF, NormalizedValidatorResponseF)()).resolves.toBe(false)
  })

  it('calls the functions with the correct `this` context', async () => {
    const context = { foo: 'foo' }

    const v1 = jest.fn(function () { return this === context })

    const result = await and.call(context, v1)('value', 'vm')
    expect(v1).toHaveReturnedWith(true)
    expect(v1).toHaveBeenCalledWith('value', 'vm')
    expect(result).toEqual(true)
  })
})
