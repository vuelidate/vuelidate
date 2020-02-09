import { len, regex, req } from '../core'
import { ref } from 'vue'

describe('core', () => {
  describe('test the req helper for "required"', () => {
    it.each([
      [[], false],
      [[1], true],
      [undefined, false],
      [null, false],
      [false, true], // false should result to true
      [new Date(), true],
      [{}, false],
      [{ a: 1 }, true],
      [1, true],
      ['asd', true],
      ['', false]
    ])('req(%s) should be %s', (a, expected) => {
      expect(req(a)).toBe(expected)
    })
  })

  describe('get the length of a value', () => {
    it.each([
      [[], 0],
      [[1], 1],
      [{}, 0],
      [{ a: 1 }, 1],
      ['', 0],
      ['1', 1],
      [1, 1],
      [ref([]), 0],
      [ref([1]), 1]
    ])('len(%s) should be %s', (a, expected) => {
      expect(len(a)).toBe(expected)
    })
  })

  describe('validates against a regex', () => {
    it('does not validate falsy values', () => {
      expect(regex(/ad/)('')).toBe(true)
      expect(regex(/ad/)(null)).toBe(true)
    })
    it('validates truthy values against regex', () => {
      expect(regex(/ad/)('aaa')).toBe(false)
      expect(regex(/ad/)('ad')).toBe(true)
    })
  })
})
