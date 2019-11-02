import requiredIf from '../requiredIf'

const T = () => true
const F = () => false

describe('requiredIf validator', () => {
  it('should not validate empty string when functional condition is met', () => {
    expect(requiredIf(T)('')).toBe(false)
  })

  it('should validate empty string when functional condition not met', () => {
    expect(requiredIf(F)('')).toBe(true)
  })

  it('should not validate empty string when prop condition is met', () => {
    expect(requiredIf('prop')('', { prop: true })).toBe(false)
  })

  it('should validate empty string when prop condition not met', () => {
    expect(requiredIf('prop')('', { prop: false })).toBe(true)
  })
})
