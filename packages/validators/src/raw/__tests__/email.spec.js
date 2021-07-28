import email from '../email'

describe('email validator', () => {
  it('should validate undefined', () => {
    expect(email(undefined)).toBe(true)
  })

  it('should validate null', () => {
    expect(email(null)).toBe(true)
  })

  it('should validate empty string', () => {
    expect(email('')).toBe(true)
  })

  it('should not validate numbers', () => {
    expect(email('12345')).toBe(false)
  })

  it('should not validate strings', () => {
    expect(email('asdf12345')).toBe(false)
  })

  it('should not validate space', () => {
    expect(email(' ')).toBe(false)
  })

  it('should not validate incomplete addresses', () => {
    expect(email('someone@')).toBe(false)
    expect(email('someone@gmail')).toBe(false)
    expect(email('someone@gmail.')).toBe(false)
    expect(email('someone@gmail.c')).toBe(false)
    expect(email('gmail.com')).toBe(false)
    expect(email('@gmail.com')).toBe(false)
  })

  it('should not validate addresses that contain unsupported characters', () => {
    expect(email('someone@g~mail.com')).toBe(false)
    expect(email('someone@g=ail.com')).toBe(false)
    expect(email('"someone@gmail.com')).toBe(false)
    expect(email('nonvalid±@gmail.com')).toBe(false)
    expect(email('joão@gmail.com')).toBe(false)
    expect(email('someõne@gmail.com')).toBe(false)
  })

  it('should not validate addresses that contain spaces', () => {
    expect(email('someone@gmail.com ')).toBe(false)
    expect(email('someone@gmail.com    ')).toBe(false)
    expect(email(' someone@gmail.com')).toBe(false)
    expect(email('some one@gmail.com')).toBe(false)
  })

  it('should validate real addresses', () => {
    expect(email('someone@gmail.com')).toBe(true)
    expect(email('someone@g-mail.com')).toBe(true)
    expect(email('some!one@gmail.com')).toBe(true)
    expect(email('soMe12_one@gmail.com')).toBe(true)
    expect(email('someone@gmail.co')).toBe(true)
    expect(email('someone@g.cn')).toBe(true)
    expect(email('someone@g.accountants')).toBe(true)
    expect(email('"some@one"@gmail.com')).toBe(true)
    expect(email('"some one"@gmail.com')).toBe(true)
    expect(email('user.name+tag+sorting@example.com')).toBe(true)
    expect(email('"john..doe"@example.org')).toBe(true)
    expect(email('someone@Example.com')).toBe(true)
  })
})
