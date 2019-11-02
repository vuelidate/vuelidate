import requiredUnless from '../requiredUnless'

const T = () => true
const F = () => false

describe('requiredUnless validator', () => {
  it('should not validate empty string when functional condition is not met', () => {
    expect(requiredUnless(F)('')).toBe(false)
  })

  it('should validate empty string when functional condition met', () => {
    expect(requiredUnless(T)('')).toBe(true)
  })

  it('should not validate empty string when prop condition is not met', () => {
    expect(requiredUnless('prop')('', { prop: false })).toBe(false)
  })

  it('should validate empty string when prop condition met', () => {
    expect(requiredUnless('prop')('', { prop: true })).toBe(true)
  })
})
