import requiredIf from '../requiredIf'
import { T, F } from '../../../tests/fixtures'
import { ref } from 'vue-demi'

describe('requiredIf validator', () => {
  it('should not validate empty string when functional condition is met', () => {
    expect(requiredIf(T)('')).toBe(false)
  })

  it('should validate empty string when functional condition not met', () => {
    expect(requiredIf(F)('')).toBe(true)
  })

  it('should not validate empty string when simple boolean condition is met', () => {
    expect(requiredIf('prop')('')).toBe(false)
  })

  it('should validate empty string when simple boolean condition not met', () => {
    expect(requiredIf('')('')).toBe(true)
  })

  it('should validate string only with spaces', () => {
    expect(requiredIf(T)('  ')).toBe(false)
  })

  it('should pass the value to the validation function', () => {
    const validator = jest.fn()
    requiredIf(validator)('foo', 'bar')
    expect(validator).toHaveBeenCalledTimes(1)
    expect(validator).toHaveBeenCalledWith('foo', 'bar')
  })

  it('should have the correct `this` context', () => {
    let that
    const validator = jest.fn(function () { that = this })
    const context = { foo: 'foo' }
    requiredIf(validator).call(context, 'value', 'parentVM')
    expect(that).toEqual(context)
  })

  it('should work with a ref', () => {
    const prop = ref(false)
    // make sure if passed a `false` ref, it returns `true` directly
    expect(requiredIf(prop)(false)).toBe(true)
    prop.value = true
    expect(requiredIf(prop)('')).toBe(false)
    expect(requiredIf(prop)('1')).toBe(true)
  })
})
