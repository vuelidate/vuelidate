import or from '../or'
import {
  T,
  F,
  NormalizedF,
  NormalizedT,
  NormalizedValidatorResponseF,
  NormalizedValidatorResponseT,
  ValidatorResponseF,
  ValidatorResponseT
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
})
