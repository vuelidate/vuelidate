import alphaNum from '../alphaNum'

describe('alphaNum validator', () => {
  it('should validate undefined', () => {
    expect(alphaNum(undefined)).toBe(true)
  })

  it('should validate null', () => {
    expect(alphaNum(null)).toBe(true)
  })

  it('should validate empty string', () => {
    expect(alphaNum('')).toBe(true)
  })

  it('should validate numbers', () => {
    expect(alphaNum('1234567890')).toBe(true)
  })

  it('should not validate space', () => {
    expect(alphaNum(' ')).toBe(false)
  })

  it('should validate english letters', () => {
    expect(alphaNum('abcxyzABCXYZ')).toBe(true)
  })

  it('should validate alphaNum', () => {
    expect(alphaNum('abc123')).toBe(true)
  })

  it('should not validate padded letters', () => {
    expect(alphaNum(' abc ')).toBe(false)
  })

  it('should not validate unicode', () => {
    expect(alphaNum('🎉')).toBe(false)
  })
})
