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
  NormalizedAsyncF,
  NormalizedAsyncT, asyncF, NormalizedAsyncValidatorResponseT, NormalizedAsyncValidatorResponseF
} from '../../../tests/fixtures'

describe('or validator', () => {
  it('should not validate no functions', () => {
    expect(or()()).toBe(false)
  })

  it('should not validate single false function', () => {
    expect(or(F)()).toBe(false)
  })

  it('should validate single true function', () => {
    expect(or(T)()).toBe(true)
  })

  it('should validate all true functions', () => {
    expect(or(T, T, T)()).toBe(true)
  })

  it('should validate some true functions', () => {
    expect(or(T, F, T)()).toBe(true)
  })

  it('should not validate all false functions', () => {
    expect(or(F, F, F)()).toBe(false)
  })

  it('should pass values or model to function', () => {
    const spy = jest.fn()
    or(spy)(1, 2)
    expect(spy).toHaveBeenCalledWith(1, 2)
  })

  it('should pass the context to each validator', () => {
    const validator1 = jest.fn().mockReturnValue(false)
    const validator2 = jest.fn().mockReturnValue(false)
    const context = { foo: 'foo' }
    or(validator1, validator2).call(context, 1, 2)
    expect(validator1.mock.instances[0]).toEqual(context)
    expect(validator2.mock.instances[0]).toEqual(context)
  })

  it('should work with functions returning ValidatorResponse', () => {
    expect(or(ValidatorResponseT, ValidatorResponseF, ValidatorResponseF)()).toBe(true)
    expect(or(ValidatorResponseF, ValidatorResponseF, ValidatorResponseF)()).toBe(false)
  })

  it('should work with Normalized Validators', () => {
    expect(or(NormalizedT, NormalizedT)()).toBe(true)
    expect(or(NormalizedF, NormalizedT)()).toBe(true)
    expect(or(NormalizedValidatorResponseT, NormalizedValidatorResponseT)()).toBe(true)
    expect(or(NormalizedValidatorResponseF, NormalizedValidatorResponseT)()).toBe(true)
  })

  describe('async', () => {
    it('should validate all true functions, when mixed with async', () => {
      return expect(or(T, NormalizedAsyncT, T)()).resolves.toBe(true)
    })
    it('should validate some true functions, when mixed with async', () => {
      return expect(or(T, NormalizedAsyncF, T)()).resolves.toBe(true)
    })

    it('should not validate all false functions', () => {
      return expect(or(NormalizedAsyncF, NormalizedAsyncF, NormalizedAsyncF)()).resolves.toBe(false)
    })

    it('should work with Normalized Async Validators', async () => {
      await expect(or(NormalizedAsyncT, NormalizedAsyncT)()).resolves.toBe(true)
      await expect(or(NormalizedAsyncF, NormalizedAsyncT)()).resolves.toBe(true)
      await expect(or(NormalizedAsyncValidatorResponseT, NormalizedAsyncValidatorResponseT)()).resolves.toBe(true)
      await expect(or(NormalizedAsyncValidatorResponseF, NormalizedAsyncValidatorResponseT)()).resolves.toBe(true)
    })
  })
})
