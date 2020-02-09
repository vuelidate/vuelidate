import { ref } from 'vue'
import { normalizeValidatorObject, isTruthy, unwrap, isObject, isFunction } from '../common'

describe('common', () => {
  describe('isFunction', () => {
    it.each([
      ['', false],
      [[], false],
      [{}, false],
      [true, false],
      [() => {}, true]
    ])('returns %p as %p', (a, b) => {
      expect(isFunction(a)).toEqual(b)
    })
  })

  describe('isObject', () => {
    it.each([
      ['', false],
      [[], false],
      [() => {}, false],
      [{}, true]
    ])('returns %p as %p', (a, b) => {
      expect(isObject(a)).toEqual(b)
    })
  })

  describe('unwrap', () => {
    it('returns values if not refs', () => {
      const val = unwrap('string')
      expect(val).toEqual('string')
    })

    it('unwraps refs', () => {
      expect(unwrap(ref('string'))).toEqual('string')
    })
  })

  describe('normalizeValidatorObject', () => {
    it('returns the same normalized validator object', () => {
      const fn = () => true
      const validator = { $validator: fn }

      expect(normalizeValidatorObject(validator)).toEqual(validator)
    })

    it('returns an object if passed a function', () => {
      const fn = () => true
      expect(normalizeValidatorObject(fn)).toEqual({ $validator: fn })
    })
  })

  describe('isTruthy', () => {
    it('returns true if passed true value', () => {
      expect(isTruthy('asdf')).toBe(true)
    })

    it('returns true if passed a function resolving to true', () => {
      const fn = jest.fn(() => true)
      expect(isTruthy(fn)).toBe(true)
      expect(fn).toHaveBeenCalled()
    })
  })
})
