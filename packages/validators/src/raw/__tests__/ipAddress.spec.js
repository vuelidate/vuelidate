import ipAddress from '../ipAddress'

describe('ipAddress validator', () => {
  it('should validate undefined', () => {
    expect(ipAddress(undefined)).toBe(true)
  })

  it('should validate null', () => {
    expect(ipAddress(null)).toBe(true)
  })

  it('should validate empty string', () => {
    expect(ipAddress('')).toBe(true)
  })

  it('should not validate number', () => {
    expect(ipAddress(123123123123)).toBe(false)
  })

  it('should validate basic loopback', () => {
    expect(ipAddress('127.0.0.1')).toBe(true)
  })

  it('should validate public address 1', () => {
    expect(ipAddress('8.8.8.8')).toBe(true)
  })

  it('should validate public address 2', () => {
    expect(ipAddress('123.41.12.168')).toBe(true)
  })

  it('should validate private address', () => {
    expect(ipAddress('10.0.0.1')).toBe(true)
  })

  it('should validate private address with multiple zeros', () => {
    expect(ipAddress('10.0.0.0')).toBe(true)
  })

  it('should not validate padded loopback', () => {
    expect(ipAddress(' 127.0.0.1 ')).toBe(false)
  })

  it('should not validate nonzero nibbles starting with 0', () => {
    expect(ipAddress('127.0.00.1')).toBe(false)
  })

  it('should not validate not enough nibbles', () => {
    expect(ipAddress('127.0.1')).toBe(false)
  })

  it('should not validate too many nibbles', () => {
    expect(ipAddress('10.0.1.2.3')).toBe(false)
  })

  it('should not validate negatives', () => {
    expect(ipAddress('1.2.3.-4')).toBe(false)
  })

  it('should not validate too big values', () => {
    expect(ipAddress('1.256.3.4')).toBe(false)
  })

  it('should not validate masks', () => {
    expect(ipAddress('10.0.0.1/24')).toBe(false)
  })
})
