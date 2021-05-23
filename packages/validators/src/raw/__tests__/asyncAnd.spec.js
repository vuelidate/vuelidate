import asyncAnd from '../asyncAnd'
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
  asyncT, NormalizedAsyncT, NormalizedAsyncF, NormalizedAsyncValidatorResponseT, NormalizedAsyncValidatorResponseF
} from '../../../tests/fixtures'

describe('and validator', () => {
  it('should not validate no functions', () => {
    expect(asyncAnd()()).toBe(false)
  })

  it('should not validate single false function', () => {
    return expect(asyncAnd(F)()).resolves.toBe(false)
  })

  it('should validate single true function', () => {
    return expect(asyncAnd(T)()).resolves.toBe(true)
  })

  it('should validate all true functions', () => {
    return expect(asyncAnd(T, T, T)()).resolves.toBe(true)
  })

  it('should validate all to true, when mixed function types', () => {
    return expect(asyncAnd(T, asyncT, T)()).resolves.toBe(true)
  })

  it('should not validate some true functions', () => {
    return expect(asyncAnd(T, F, T)()).resolves.toBe(false)
  })

  it('should not validate some true functions, when mixed function types', () => {
    expect(asyncAnd(T, asyncF, T)()).resolves.toBe(false)
  })

  it('should not validate all false functions', async () => {
    await expect(asyncAnd(F, F, F)()).resolves.toBe(false)
  })

  it('should not validate all false functions, when async', async () => {
    await expect(asyncAnd(asyncF, asyncF, asyncF)()).resolves.toBe(false)
  })

  it('should pass values and model to function', async () => {
    const spy = jest.fn()
    await asyncAnd(spy)(1, 2)
    expect(spy).toHaveBeenCalledWith(1, 2)
  })

  it('should work with functions returning ValidatorResponse', async () => {
    await expect(asyncAnd(ValidatorResponseT, ValidatorResponseT, ValidatorResponseT)()).resolves.toBe(true)
    await expect(asyncAnd(ValidatorResponseF, ValidatorResponseF, ValidatorResponseF)()).resolves.toBe(false)
  })

  it('should work with Normalized Validators', async () => {
    await expect(asyncAnd(NormalizedT, NormalizedT)()).resolves.toBe(true)
    await expect(asyncAnd(NormalizedF, NormalizedF)()).resolves.toBe(false)
    await expect(asyncAnd(NormalizedValidatorResponseT, NormalizedValidatorResponseT)()).resolves.toBe(true)
    await expect(asyncAnd(NormalizedValidatorResponseF, NormalizedValidatorResponseF)()).resolves.toBe(false)
  })

  it('should work with Normalized Validators', async () => {
    await expect(asyncAnd(NormalizedAsyncT, NormalizedAsyncT)()).resolves.toBe(true)
    await expect(asyncAnd(NormalizedAsyncF, NormalizedAsyncF)()).resolves.toBe(false)
    await expect(asyncAnd(NormalizedAsyncValidatorResponseT, NormalizedAsyncValidatorResponseT)()).resolves.toBe(true)
    await expect(asyncAnd(NormalizedAsyncValidatorResponseF, NormalizedAsyncValidatorResponseF)()).resolves.toBe(false)
  })

  it('calls the functions with the correct `this` context', async () => {
    const context = { foo: 'foo' }

    const v1 = jest.fn(function () { return this === context })

    const result = await asyncAnd(v1).call(context, 'value', 'vm')
    expect(v1).toHaveReturnedWith(true)
    expect(v1).toHaveBeenCalledWith('value', 'vm')
    expect(result).toEqual(true)
  })
})
