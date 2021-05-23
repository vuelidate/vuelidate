import asyncOr from '../asyncOr'
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
  asyncT,
  NormalizedAsyncT, NormalizedAsyncF, NormalizedAsyncValidatorResponseT, NormalizedAsyncValidatorResponseF
} from '../../../tests/fixtures'

describe('or validator', () => {
  it('should not validate no functions', () => {
    expect(asyncOr()()).toBe(false)
  })

  it('should not validate single false function', () => {
    return expect(asyncOr(F)()).resolves.toBe(false)
  })

  it('should validate single true function', () => {
    return expect(asyncOr(T)()).resolves.toBe(true)
  })

  it('should validate all true functions', () => {
    return expect(asyncOr(T, T, T)()).resolves.toBe(true)
  })

  it('should validate all true functions, when mixed with async', () => {
    return expect(asyncOr(T, asyncT, T)()).resolves.toBe(true)
  })

  it('should validate some true functions', () => {
    return expect(asyncOr(T, F, T)()).resolves.toBe(true)
  })

  it('should validate some true functions, when mixed with async', () => {
    return expect(asyncOr(T, asyncF, T)()).resolves.toBe(true)
  })

  it('should not validate all false functions', () => {
    return expect(asyncOr(F, F, F)()).resolves.toBe(false)
  })

  it('should pass values or model to function', async () => {
    const spy = jest.fn()
    await asyncOr(spy)(1, 2)
    expect(spy).toHaveBeenCalledWith(1, 2)
  })

  it('should work with functions returning ValidatorResponse', async () => {
    await expect(asyncOr(ValidatorResponseT, ValidatorResponseF, ValidatorResponseF)()).resolves.toBe(true)
    await expect(asyncOr(ValidatorResponseF, ValidatorResponseF, ValidatorResponseF)()).resolves.toBe(false)
  })

  it('should work with Normalized Validators', async () => {
    await expect(asyncOr(NormalizedT, NormalizedT)()).resolves.toBe(true)
    await expect(asyncOr(NormalizedF, NormalizedT)()).resolves.toBe(true)
    await expect(asyncOr(NormalizedValidatorResponseT, NormalizedValidatorResponseT)()).resolves.toBe(true)
    await expect(asyncOr(NormalizedValidatorResponseF, NormalizedValidatorResponseT)()).resolves.toBe(true)
  })

  it('should work with Normalized Async Validators', async () => {
    await expect(asyncOr(NormalizedAsyncT, NormalizedAsyncT)()).resolves.toBe(true)
    await expect(asyncOr(NormalizedAsyncF, NormalizedAsyncT)()).resolves.toBe(true)
    await expect(asyncOr(NormalizedAsyncValidatorResponseT, NormalizedAsyncValidatorResponseT)()).resolves.toBe(true)
    await expect(asyncOr(NormalizedAsyncValidatorResponseF, NormalizedAsyncValidatorResponseT)()).resolves.toBe(true)
  })

  it('should pass the context to each validator', async () => {
    const validator1 = jest.fn().mockReturnValue(false)
    const validator2 = jest.fn().mockReturnValue(false)
    const context = { foo: 'foo' }
    await asyncOr(validator1, validator2).call(context, 1, 2)
    expect(validator1.mock.instances[0]).toEqual(context)
    expect(validator2.mock.instances[0]).toEqual(context)
  })
})
