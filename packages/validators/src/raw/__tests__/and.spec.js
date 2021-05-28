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
  NormalizedAsyncT,
  NormalizedAsyncF,
  NormalizedAsyncValidatorResponseT,
  NormalizedAsyncValidatorResponseF,
  asyncT,
  asyncF,
  trueValidatorResponse,
  falseValidatorResponse
} from '../../../tests/fixtures'
import { withAsync } from '../../common'
import flushPromises from 'flush-promises'

describe('and validator', () => {
  it('should not validate no functions', () => {
    const result = and()
    expect(result).toEqual({
      $async: false,
      $validator: expect.any(Function),
      $watchTargets: []
    })
    expect(result.$validator()).toBe(false)
  })

  it('should not validate single false function', () => {
    expect(and(F).$validator()).toBe(false)
  })

  it('should validate single true function', () => {
    expect(and(T).$validator()).toBe(true)
  })

  it('should validate all true functions', () => {
    const result = and(T, T, T)
    expect(result).toEqual({
      $async: false,
      $validator: expect.any(Function),
      $watchTargets: []
    })
    expect(result.$validator()).toBe(true)
  })

  it('should not validate some true functions', () => {
    expect(and(T, F, T).$validator()).toBe(false)
  })

  it('should not validate all false functions', () => {
    expect(and(F, F, F).$validator()).toBe(false)
  })

  it('should pass values and model to function', () => {
    const spy = jest.fn()
    and(spy).$validator(1, 2)
    expect(spy).toHaveBeenCalledWith(1, 2)
  })

  it('should work with functions returning ValidatorResponse objects', () => {
    let result = and(ValidatorResponseT, ValidatorResponseT, ValidatorResponseT)
    expect(result).toEqual({
      $async: false,
      $validator: expect.any(Function),
      $watchTargets: []
    })
    expect(result.$validator()).toEqual(trueValidatorResponse)
    expect(and(ValidatorResponseF, ValidatorResponseF, ValidatorResponseF).$validator()).toEqual(falseValidatorResponse)
  })

  it('should work with Normalized Validators', () => {
    expect(and(NormalizedT, NormalizedT).$validator()).toBe(true)
    expect(and(NormalizedF, NormalizedF).$validator()).toBe(false)
    expect(and(NormalizedValidatorResponseT, NormalizedValidatorResponseT).$validator()).toEqual(trueValidatorResponse)
    expect(and(NormalizedValidatorResponseF, NormalizedValidatorResponseF).$validator()).toEqual(falseValidatorResponse)
  })

  it('calls the functions with the correct `this` context', () => {
    const context = { foo: 'foo' }

    const v1 = jest.fn(function () { return this === context })

    const result = and(v1).$validator.call(context, 'value', 'vm')
    expect(v1).toHaveReturnedWith(true)
    expect(v1).toHaveBeenCalledWith('value', 'vm')
    expect(result).toEqual(true)
  })

  describe('withAsync', () => {
    it('should validate as a promise, if some functions are async', () => {
      const v = and(T, NormalizedAsyncT, T)
      expect(v).toHaveProperty('$async', true)
      return expect(v.$validator()).resolves.toBe(true)
    })

    it('should call next async validator, when previous returns truthy', async () => {
      const v1 = jest.fn().mockResolvedValue(false)
      const v2 = jest.fn().mockResolvedValue(true)
      const promise = and(withAsync(v1), withAsync(v2)).$validator()
      await flushPromises()
      expect(v1).toHaveBeenCalled()
      expect(v2).not.toHaveBeenCalled()
      expect(await promise).toEqual(false)
      expect(v2).not.toHaveBeenCalled()
    })

    it('should work with Normalized Async Validators', async () => {
      const r = and(NormalizedAsyncT, NormalizedAsyncT)
      expect(r).toEqual({
        $async: true,
        $validator: expect.any(Function),
        $watchTargets: []
      })
      await expect(r.$validator()).resolves.toBe(true)
      await expect(and(NormalizedAsyncF, NormalizedAsyncF).$validator()).resolves.toBe(false)
      await expect(and(NormalizedAsyncValidatorResponseT, NormalizedAsyncValidatorResponseT).$validator()).resolves.toEqual(trueValidatorResponse)
      await expect(and(NormalizedAsyncValidatorResponseF, NormalizedAsyncValidatorResponseF).$validator()).resolves.toEqual(falseValidatorResponse)
    })

    it('should not validate some true functions, when mixed function types', () => {
      return expect(and(T, NormalizedAsyncF, T).$validator()).resolves.toBe(false)
    })

    it('should not validate all false functions, when async', () => {
      return expect(and(NormalizedAsyncF, NormalizedAsyncF, NormalizedAsyncF).$validator()).resolves.toBe(false)
    })

    it('should combine $watchTargets', () => {
      const targets = ['foo']
      const targets2 = ['bar']
      let v = and(withAsync(asyncT, targets), withAsync(asyncF, targets2), NormalizedAsyncF)
      expect(v).toMatchObject({
        $async: true,
        $validator: expect.any(Function),
        $watchTargets: [].concat(targets, targets2)
      })
      return expect(v.$validator()).resolves.toBe(false)
    })
  })
})
