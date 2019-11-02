import required from '../required'

describe('required validator', () => {
  it('should not validate empty string', () => {
    expect(required('')).toBe(false)
  })

  it('should not validate empty arrays', () => {
    expect(required([])).toBe(false)
  })

  it('should validate nonempty arrays', () => {
    expect(required([1])).toBe(true)
  })

  it('should not validate empty objects', () => {
    expect(required({})).toBe(false)
  })

  it('should validate nonempty objects', () => {
    expect(required({ a: 1 })).toBe(true)
  })

  it('should not validate undefined', () => {
    expect(required(undefined)).toBe(false)
  })

  it('should not validate null', () => {
    expect(required(null)).toBe(false)
  })

  it('should validate false', () => {
    expect(required(false)).toBe(true)
  })

  it('should validate true', () => {
    expect(required(true)).toBe(true)
  })

  it('should validate string only with spaces', () => {
    expect(required('  ')).toBe(false)
  })

  it('should validate english words', () => {
    expect(required('hello')).toBe(true)
  })

  it('should validate padded words', () => {
    expect(required(' hello ')).toBe(true)
  })

  it('should validate unicode', () => {
    expect(required('🎉')).toBe(true)
  })

  it('should validate correct date', () => {
    expect(required(new Date(1234123412341))).toBe(true)
  })

  it('should not validate invalid date', () => {
    expect(required(new Date('a'))).toBe(false)
  })
})
