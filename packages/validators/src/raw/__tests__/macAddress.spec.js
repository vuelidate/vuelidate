import macAddress from '../macAddress'

describe('macAddress validator', () => {
  it('should validate undefined', () => {
    expect(macAddress()(undefined)).toBe(true)
  })

  it('should validate null', () => {
    expect(macAddress()(null)).toBe(true)
  })

  it('should validate empty string', () => {
    expect(macAddress()('')).toBe(true)
  })

  it('should not validate number', () => {
    expect(macAddress()(112233445566)).toBe(false)
  })

  it('should validate zero mac', () => {
    expect(macAddress()('00:00:00:00:00:00')).toBe(true)
    expect(macAddress()('00:00:00:00:00:00:00:00')).toBe(true)
  })

  it('should validate correct mac', () => {
    expect(macAddress()('de:ad:be:ef:ba:ad')).toBe(true)
    expect(macAddress()('de:ad:be:ef:ba:ad:f0:0d')).toBe(true)
  })

  it('should not validate mac with too many parts', () => {
    expect(macAddress()('00:00:00:00:00:00:00')).toBe(false)
    expect(macAddress()('00:00:00:00:00:00:00:00:00')).toBe(false)
  })

  it('should not validate mac with not enough parts', () => {
    expect(macAddress()('00')).toBe(false)
    expect(macAddress()('00:00:00:00:00:00:00')).toBe(false)
  })

  it('should not validate mac with too big numbers', () => {
    expect(macAddress()('ff0:123:22:33:44:00')).toBe(false)
    expect(macAddress()('ff0:123:22:33:44:00:00:00')).toBe(false)
  })

  it('should not validate mac with single zero', () => {
    expect(macAddress()('de:ad:be:ef:0:00')).toBe(false)
    expect(macAddress()('de:ad:be:ef:0:00:00:00')).toBe(false)
  })

  it('should not validate mac with negative numbers', () => {
    expect(macAddress()('00:11:22:33:44:-5')).toBe(false)
    expect(macAddress()('00:11:22:33:44:-5:66:77')).toBe(false)
  })

  it('should not validate mac with bad hex numbers', () => {
    expect(macAddress()('he:ll:ow:or:ld:00')).toBe(false)
    expect(macAddress()('be:ef:ba:ad:fo:od')).toBe(false)
    expect(macAddress()('he:ll:ow:or:ld:00:00:00')).toBe(false)
    expect(macAddress()('de:ad:be:ef:ba:ad:fo:od')).toBe(false)
  })

  it('should not validate mac with bad separator', () => {
    expect(macAddress()('00;00;00;00;00;00')).toBe(false)
    expect(macAddress()('00;00;00;00;00;00;00;00')).toBe(false)
  })

  it('should validate mac with custom separator', () => {
    expect(macAddress(';')('00;00;00;00;00;00')).toBe(true)
    expect(macAddress(';')('00;00;00;00;00;00;00;00')).toBe(true)
  })

  it('should validate mac with empty separator', () => {
    expect(macAddress('')('000000000000')).toBe(true)
    expect(macAddress('')('deadbeefdead')).toBe(true)
    expect(macAddress('')('00ff00112233')).toBe(true)
    expect(macAddress('')('0000000000000000')).toBe(true)
    expect(macAddress('')('deadbeefdeadbeef')).toBe(true)
    expect(macAddress('')('00ff001122334455')).toBe(true)
  })

  it('should not validate bad mac with empty separator', () => {
    expect(macAddress('')('00000000z000')).toBe(false)
    expect(macAddress('')('00000000z0000000')).toBe(false)
  })

  it('should not validate too short mac with empty separator', () => {
    expect(macAddress('')('00')).toBe(false)
    expect(macAddress('')('000000000000000')).toBe(false)
  })

  it('should not validate too long mac with empty separator', () => {
    expect(macAddress('')('00000000000000000')).toBe(false)
  })

  it('should treat nonstring separator as empty', () => {
    expect(macAddress(false)('000000000000')).toBe(true)
    expect(macAddress(true)('000000000000')).toBe(true)
    expect(macAddress(new Date())('000000000000')).toBe(true)
    expect(macAddress(false)('0000000000000000')).toBe(true)
    expect(macAddress(true)('0000000000000000')).toBe(true)
    expect(macAddress(new Date())('0000000000000000')).toBe(true)
  })
})
