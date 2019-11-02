import integer from '../integer'

describe('integer validator', () => {
  it('should validate undefined', () => {
    expect(integer(undefined)).toBe(true)
  })

  it('should validate null', () => {
    expect(integer(null)).toBe(true)
  })

  it('should validate empty string', () => {
    expect(integer('')).toBe(true)
  })

  it('should validate numbers', () => {
    expect(integer('01234')).toBe(true)
  })

  it('should not validate space', () => {
    expect(integer(' ')).toBe(false)
  })

  it('should not validate english letters', () => {
    expect(integer('abcdefghijklmnopqrstuvwxyz')).toBe(false)
  })

  it('should not validate english letters uppercase', () => {
    expect(integer('ABCDEFGHIJKLMNOPQRSTUVWXYZ')).toBe(false)
  })

  it('should not validate alphanum', () => {
    expect(integer('abc123')).toBe(false)
  })

  it('should not validate padded letters', () => {
    expect(integer(' 123 ')).toBe(false)
  })

  it('should not validate unicode', () => {
    expect(integer('🎉')).toBe(false)
  })

  it('should not validate minus sign', () => {
    expect(integer('-')).toBe(false)
  })

  it('should validate negative numbers', () => {
    expect(integer('-123')).toBe(true)
  })

  it('should not validate decimal numbers', () => {
    expect(integer('0.1')).toBe(false)
    expect(integer('1.0')).toBe(false)
  })

  it('should not validate negative decimal numbers', () => {
    expect(integer('-123.4')).toBe(false)
  })
})
