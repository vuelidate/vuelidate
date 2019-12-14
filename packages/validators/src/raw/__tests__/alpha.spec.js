import alpha from '../alpha'

describe('alpha validator', () => {
  it('should validate undefined', () => {
    expect(alpha(undefined)).toBe(true)
  })

  it('should validate null', () => {
    expect(alpha(null)).toBe(true)
  })

  it('should validate empty string', () => {
    expect(alpha('')).toBe(true)
  })

  it('should not validate numbers', () => {
    expect(alpha('1234')).toBe(false)
  })

  it('should not validate space', () => {
    expect(alpha(' ')).toBe(false)
  })

  it('should validate english letters', () => {
    expect(alpha('abcdefghijklmnopqrstuvwxyz')).toBe(true)
  })

  it('should validate english letters uppercase', () => {
    expect(alpha('ABCDEFGHIJKLMNOPQRSTUVWXYZ')).toBe(true)
  })

  it('should not validate alphanum', () => {
    expect(alpha('abc123')).toBe(false)
  })

  it('should not validate padded letters', () => {
    expect(alpha(' abc ')).toBe(false)
  })

  it('should not validate unicode', () => {
    expect(alpha('🎉')).toBe(false)
  })
})
