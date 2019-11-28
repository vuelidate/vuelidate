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

  it('should not validate empty string when simple boolean condition is met', () => {
    expect(requiredIf('prop')('')).toBe(false)
  })

  it('should validate empty string when simple boolean condition not met', () => {
    expect(requiredIf('')('')).toBe(true)
  })
})
