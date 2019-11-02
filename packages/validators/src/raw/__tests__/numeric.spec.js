import numeric from '../numeric'

describe('numeric validator', () => {
  it('should validate undefined', () => {
    expect(numeric(undefined)).toBe(true)
  })

  it('should validate null', () => {
    expect(numeric(null)).toBe(true)
  })

  it('should validate empty string', () => {
    expect(numeric('')).toBe(true)
  })

  it('should validate numbers', () => {
    expect(numeric('01234')).toBe(true)
  })

  it('should not validate space', () => {
    expect(numeric(' ')).toBe(false)
  })

  it('should not validate english letters', () => {
    expect(numeric('abcdefghijklmnopqrstuvwxyz')).toBe(false)
  })

  it('should not validate english letters uppercase', () => {
    expect(numeric('ABCDEFGHIJKLMNOPQRSTUVWXYZ')).toBe(false)
  })

  it('should not validate alphanum', () => {
    expect(numeric('abc123')).toBe(false)
  })

  it('should not validate padded letters', () => {
    expect(numeric(' 123 ')).toBe(false)
  })

  it('should not validate unicode', () => {
    expect(numeric('🎉')).toBe(false)
  })

  it('should not validate negative numbers', () => {
    expect(numeric('-123')).toBe(false)
  })

  it('should not validate decimal numbers', () => {
    expect(numeric('0.1')).toBe(false)
    expect(numeric('1.0')).toBe(false)
  })

  it('should not validate negative decimal numbers', () => {
    expect(numeric('-123.4')).toBe(false)
  })
})
