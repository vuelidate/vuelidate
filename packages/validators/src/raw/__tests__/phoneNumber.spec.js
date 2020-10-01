import phoneNumber from '../phoneNumber'

describe('phone validator', () => {
  it('should not validate letters', () => {
    expect(phoneNumber('abcdef')).toBe(false)
  })

  it('should validate null', () => {
    expect(phoneNumber(null)).toBe(true)
  })

  it('should validate undefined', () => {
    expect(phoneNumber(undefined)).toBe(true)
  })

  it('should not validate strings', () => {
    expect(phoneNumber('hehexd')).toBe(false)
  })

  it('should not validate space', () => {
    expect(phoneNumber(' ')).toBe(false)
  })

  it('should not validate incomplete numbers', () => {
    expect(phoneNumber('999')).toBe(false)
    expect(phoneNumber('9999999')).toBe(false)
    expect(phoneNumber('(999)99')).toBe(false)
    expect(phoneNumber('(999) 999 999')).toBe(false)
  })

  it('should validate standard US formatting', () => {
    expect(phoneNumber('999-999-9999')).toBe(true)
    expect(phoneNumber('999 999 9999')).toBe(true)
    expect(phoneNumber('(999) 999 9999')).toBe(true)
    expect(phoneNumber('(999)-999-9999')).toBe(true)
    expect(phoneNumber('9999999999')).toBe(true)
  })

  it('should validate standard UK formatting', () => {
    expect(phoneNumber('020 7183 8750')).toBe(true)
    expect(phoneNumber('02071838750')).toBe(true)
  })

  it('should validate standard international formatting', () => {
    expect(phoneNumber('+1 415 555 0132')).toBe(true)
    expect(phoneNumber('+14155550132')).toBe(true)
    expect(phoneNumber('+1-415-555-0132')).toBe(true)
  })
})
