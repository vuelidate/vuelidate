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
  NormalizedAsyncT,
  asyncF,
  NormalizedAsyncValidatorResponseT,
  NormalizedAsyncValidatorResponseF,
  trueValidatorResponse, asyncT
} from '../../../tests/fixtures'
import { withAsync } from '../../common'

describe('or validator', () => {
  it('should not validate no functions', () => {
    expect(or().$validator()).toBe(false)
  })

  it('should not validate single false function', () => {
    expect(or(F).$validator()).toBe(false)
  })

  it('should validate single true function', () => {
    expect(or(T).$validator()).toBe(true)
  })

  it('should validate all true functions', () => {
    expect(or(T, T, T).$validator()).toBe(true)
  })

  it('should validate some true functions', () => {
    expect(or(T, F, T).$validator()).toBe(true)
  })

  it('should not validate all false functions', () => {
    expect(or(F, F, F).$validator()).toBe(false)
  })

  it('should pass values or model to function', () => {
    const spy = jest.fn()
    or(spy).$validator(1, 2)
    expect(spy).toHaveBeenCalledWith(1, 2)
  })

  it('should pass the context to each validator', () => {
    const validator1 = jest.fn().mockReturnValue(false)
    const validator2 = jest.fn().mockReturnValue(false)
    const context = { foo: 'foo' }
    or(validator1, validator2).$validator.call(context, 1, 2)
    expect(validator1.mock.instances[0]).toEqual(context)
    expect(validator2.mock.instances[0]).toEqual(context)
  })

  it('should work with functions returning ValidatorResponse', () => {
    expect(or(ValidatorResponseT, ValidatorResponseF, ValidatorResponseF).$validator()).toEqual({ $data: {}, $valid: true })
    expect(or(ValidatorResponseF, ValidatorResponseF, ValidatorResponseF).$validator()).toEqual({ $data: {}, $valid: false })
  })

  it('should work with Normalized Validators', () => {
    expect(or(NormalizedT, NormalizedT).$validator()).toEqual(true)
    expect(or(NormalizedF, NormalizedT).$validator()).toEqual(true)
    expect(or(NormalizedValidatorResponseT, NormalizedValidatorResponseT).$validator()).toEqual(trueValidatorResponse)
    expect(or(NormalizedValidatorResponseF, NormalizedValidatorResponseT).$validator()).toEqual(trueValidatorResponse)
  })

  describe('async', () => {
    it('should validate all true functions, when mixed with async', () => {
      let v = or(T, NormalizedAsyncT, T)
      expect(v).toEqual({
        $validator: expect.any(Function),
        $async: true,
        $watchTargets: []
      })
      return expect(v.$validator()).resolves.toBe(true)
    })
    it('should validate some true functions, when mixed with async', () => {
      return expect(or(T, NormalizedAsyncF, T).$validator()).resolves.toBe(true)
    })

    it('should not validate all false functions', () => {
      return expect(or(NormalizedAsyncF, NormalizedAsyncF, NormalizedAsyncF).$validator()).resolves.toBe(false)
    })

    it('should work with Normalized Async Validators', async () => {
      let v = or(NormalizedAsyncT, NormalizedAsyncT)
      expect(v).toEqual({
        $async: true,
        $validator: expect.any(Function),
        $watchTargets: []
      })
      await expect(v.$validator()).resolves.toBe(true)
      await expect(or(NormalizedAsyncF, NormalizedAsyncT).$validator()).resolves.toBe(true)
      await expect(or(NormalizedAsyncValidatorResponseT, NormalizedAsyncValidatorResponseT).$validator())
        .resolves.toEqual(trueValidatorResponse)
      await expect(or(NormalizedAsyncValidatorResponseF, NormalizedAsyncValidatorResponseT).$validator())
        .resolves.toEqual(trueValidatorResponse)
    })

    it('should combine $watchTargets', () => {
      const targets = ['foo']
      const targets2 = ['bar']
      let v = or(withAsync(asyncT, targets), withAsync(asyncF, targets2), NormalizedAsyncF)
      expect(v).toMatchObject({
        $async: true,
        $validator: expect.any(Function),
        $watchTargets: [].concat(targets, targets2)
      })
      return expect(v.$validator()).resolves.toBe(true)
    })
  })
})
