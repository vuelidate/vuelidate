import or from '../or'
import {
  T,
  F,
  NormalizedF,
  NormalizedT,
  NormalizedValidatorResponseF,
  NormalizedValidatorResponseT,
  ValidatorResponseF,
  ValidatorResponseT,
  asyncF,
  asyncT
} from '../../../tests/fixtures'

describe('or validator', () => {
  it('should not validate no functions', () => {
    expect(or()()).toBe(false)
  })

  it('should not validate single false function', () => {
    return expect(or(F)()).resolves.toBe(false)
  })

  it('should validate single true function', () => {
    return expect(or(T)()).resolves.toBe(true)
  })

  it('should validate all true functions', () => {
    return expect(or(T, T, T)()).resolves.toBe(true)
  })

  it('should validate all true functions, when mixed with async', () => {
    return expect(or(T, asyncT, T)()).resolves.toBe(true)
  })

  it('should validate some true functions', () => {
    return expect(or(T, F, T)()).resolves.toBe(true)
  })

  it('should validate some true functions, when mixed with async', () => {
    return expect(or(T, asyncF, T)()).resolves.toBe(true)
  })

  it('should not validate all false functions', () => {
    return expect(or(F, F, F)()).resolves.toBe(false)
  })

  it('should pass values or model to function', async () => {
    const spy = jest.fn()
    await or(spy)(1, 2)
    expect(spy).toHaveBeenCalledWith(1, 2)
  })

  it('should work with functions returning ValidatorResponse', async () => {
    await expect(or(ValidatorResponseT, ValidatorResponseF, ValidatorResponseF)()).resolves.toBe(true)
    await expect(or(ValidatorResponseF, ValidatorResponseF, ValidatorResponseF)()).resolves.toBe(false)
  })

  it('should work with Normalized Validators', async () => {
    await expect(or(NormalizedT, NormalizedT)()).resolves.toBe(true)
    await expect(or(NormalizedF, NormalizedT)()).resolves.toBe(true)
    await expect(or(NormalizedValidatorResponseT, NormalizedValidatorResponseT)()).resolves.toBe(true)
    await expect(or(NormalizedValidatorResponseF, NormalizedValidatorResponseT)()).resolves.toBe(true)
  })
})
