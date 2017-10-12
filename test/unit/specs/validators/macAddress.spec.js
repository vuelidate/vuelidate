import macAddress from 'src/validators/macAddress'

describe('macAddress validator', () => {
  it('should validate undefined', () => {
    expect(macAddress()(undefined)).to.be.true
  })

  it('should validate null', () => {
    expect(macAddress()(null)).to.be.true
  })

  it('should validate empty string', () => {
    expect(macAddress()('')).to.be.true
  })

  it('should validate zero mac', () => {
    expect(macAddress()('00:00:00:00:00:00')).to.be.true
    expect(macAddress()('00:00:00:00:00:00:00:00')).to.be.true
  })

  it('should validate correct mac', () => {
    expect(macAddress()('de:ad:be:ef:ba:ad')).to.be.true
    expect(macAddress()('de:ad:be:ef:ba:ad:f0:0d')).to.be.true
  })

  it('should not validate mac with too many parts', () => {
    expect(macAddress()('00:00:00:00:00:00:00')).to.be.false
    expect(macAddress()('00:00:00:00:00:00:00:00:00')).to.be.false
  })

  it('should not validate mac with not enough parts', () => {
    expect(macAddress()('00')).to.be.false
    expect(macAddress()('00:00:00:00:00:00:00')).to.be.false
  })

  it('should not validate mac with too big numbers', () => {
    expect(macAddress()('ff0:123:22:33:44:00')).to.be.false
    expect(macAddress()('ff0:123:22:33:44:00:00:00')).to.be.false
  })

  it('should not validate mac with single zero', () => {
    expect(macAddress()('de:ad:be:ef:0:00')).to.be.false
    expect(macAddress()('de:ad:be:ef:0:00:00:00')).to.be.false
  })

  it('should not validate mac with negative numbers', () => {
    expect(macAddress()('00:11:22:33:44:-5')).to.be.false
    expect(macAddress()('00:11:22:33:44:-5:66:77')).to.be.false
  })

  it('should not validate mac with bad hex numbers', () => {
    expect(macAddress()('he:ll:ow:or:ld:00')).to.be.false
    expect(macAddress()('be:ef:ba:ad:fo:od')).to.be.false
    expect(macAddress()('he:ll:ow:or:ld:00:00:00')).to.be.false
    expect(macAddress()('de:ad:be:ef:ba:ad:fo:od')).to.be.false
  })

  it('should not validate mac with bad separator', () => {
    expect(macAddress()('00;00;00;00;00;00')).to.be.false
    expect(macAddress()('00;00;00;00;00;00;00;00')).to.be.false
  })

  it('should validate mac with custom separator', () => {
    expect(macAddress(';')('00;00;00;00;00;00')).to.be.true
    expect(macAddress(';')('00;00;00;00;00;00;00;00')).to.be.true
  })

  it('should validate mac with empty separator', () => {
    expect(macAddress('')('000000000000')).to.be.true
    expect(macAddress('')('deadbeefdead')).to.be.true
    expect(macAddress('')('00ff00112233')).to.be.true
    expect(macAddress('')('0000000000000000')).to.be.true
    expect(macAddress('')('deadbeefdeadbeef')).to.be.true
    expect(macAddress('')('00ff001122334455')).to.be.true
  })

  it('should not validate bad mac with empty separator', () => {
    expect(macAddress('')('00000000z000')).to.be.false
    expect(macAddress('')('00000000z0000000')).to.be.false
  })

  it('should not validate too short mac with empty separator', () => {
    expect(macAddress('')('00')).to.be.false
    expect(macAddress('')('000000000000000')).to.be.false
  })

  it('should not validate too long mac with empty separator', () => {
    expect(macAddress('')('00000000000000000')).to.be.false
  })

  it('should treat nonstring separator as empty', () => {
    expect(macAddress(false)('000000000000')).to.be.true
    expect(macAddress(true)('000000000000')).to.be.true
    expect(macAddress(new Date())('000000000000')).to.be.true
    expect(macAddress(false)('0000000000000000')).to.be.true
    expect(macAddress(true)('0000000000000000')).to.be.true
    expect(macAddress(new Date())('0000000000000000')).to.be.true
  })
})
