import and from '../and'
import {
  F,
  T,
  ValidatorResponseT,
  ValidatorResponseF,
  NormalizedF,
  NormalizedT,
  NormalizedValidatorResponseF,
  NormalizedValidatorResponseT
} from '../../../tests/fixtures'

describe('and validator', () => {
  it('should not validate no functions', () => {
    expect(and()()).toBe(false)
  })

  it('should not validate single false function', () => {
    expect(and(F)()).toBe(false)
  })

  it('should validate single true function', () => {
    expect(and(T)()).toBe(true)
  })

  it('should validate all true functions', () => {
    expect(and(T, T, T)()).toBe(true)
  })

  it('should not validate some true functions', () => {
    expect(and(T, F, T)()).toBe(false)
  })

  it('should not validate all false functions', () => {
    expect(and(F, F, F)()).toBe(false)
  })

  it('should pass values and model to function', () => {
    const spy = jest.fn()
    and(spy)(1, 2)
    expect(spy).toHaveBeenCalledWith(1, 2)
  })

  it('should work with functions returning ValidatorResponse', () => {
    expect(and(ValidatorResponseT, ValidatorResponseT, ValidatorResponseT)()).toBe(true)
    expect(and(ValidatorResponseF, ValidatorResponseF, ValidatorResponseF)()).toBe(false)
  })

  it('should work with Normalized Validators', () => {
    expect(and(NormalizedT, NormalizedT)()).toBe(true)
    expect(and(NormalizedF, NormalizedF)()).toBe(false)
    expect(and(NormalizedValidatorResponseT, NormalizedValidatorResponseT)()).toBe(true)
    expect(and(NormalizedValidatorResponseF, NormalizedValidatorResponseF)()).toBe(false)
  })

  it('calls the functions with the correct `this` context', () => {
    const context = { foo: 'foo' }

    const v1 = jest.fn(function () { return this === context })

    const result = and(v1).call(context, 'value', 'vm')
    expect(v1).toHaveReturnedWith(true)
    expect(v1).toHaveBeenCalledWith('value', 'vm')
    expect(result).toEqual(true)
  })
})
