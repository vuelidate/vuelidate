import decimal from '../decimal'

describe('decimal validator', () => {
  it('should validate undefined', () => {
    expect(decimal(undefined)).toBe(true)
  })

  it('should validate null', () => {
    expect(decimal(null)).toBe(true)
  })

  it('should validate empty string', () => {
    expect(decimal('')).toBe(true)
  })

  it('should validate numbers', () => {
    expect(decimal('01234')).toBe(true)
  })

  it('should not validate space', () => {
    expect(decimal(' ')).toBe(false)
  })

  it('should not validate english letters', () => {
    expect(decimal('abcdefghijklmnopqrstuvwxyz')).toBe(false)
  })

  it('should not validate english letters uppercase', () => {
    expect(decimal('ABCDEFGHIJKLMNOPQRSTUVWXYZ')).toBe(false)
  })

  it('should not validate alphanum', () => {
    expect(decimal('abc123')).toBe(false)
  })

  it('should not validate padded letters', () => {
    expect(decimal(' 123 ')).toBe(false)
  })

  it('should not validate unicode', () => {
    expect(decimal('🎉')).toBe(false)
  })

  it('should validate negative numbers', () => {
    expect(decimal('-123')).toBe(true)
  })

  it('should validate decimal numbers', () => {
    expect(decimal('0.1')).toBe(true)
    expect(decimal('1.0')).toBe(true)
  })

  it('should validate negative decimal numbers', () => {
    expect(decimal('-123.4')).toBe(true)
  })

  it('should not validate multiple decimal points', () => {
    expect(decimal('-123.4.')).toBe(false)
    expect(decimal('..')).toBe(false)
  })

  it('should validate decimal numbers without leading digits', () => {
    expect(decimal('.1')).toBe(true)
  })

  it('should not validate decimal numbers without trailing digits', () => {
    expect(decimal('1.')).toBe(false)
  })
})
