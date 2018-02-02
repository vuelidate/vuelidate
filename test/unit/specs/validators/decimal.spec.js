import decimal from 'src/validators/decimal'

describe('decimal validator', () => {
  it('should validate undefined', () => {
    expect(decimal(undefined)).to.be.true
  })

  it('should validate null', () => {
    expect(decimal(null)).to.be.true
  })

  it('should validate empty string', () => {
    expect(decimal('')).to.be.true
  })

  it('should validate numbers', () => {
    expect(decimal('01234')).to.be.true
  })

  it('should not validate space', () => {
    expect(decimal(' ')).to.be.false
  })

  it('should not validate english letters', () => {
    expect(decimal('abcdefghijklmnopqrstuvwxyz')).to.be.false
  })

  it('should not validate english letters uppercase', () => {
    expect(decimal('ABCDEFGHIJKLMNOPQRSTUVWXYZ')).to.be.false
  })

  it('should not validate alphanum', () => {
    expect(decimal('abc123')).to.be.false
  })

  it('should not validate padded letters', () => {
    expect(decimal(' 123 ')).to.be.false
  })

  it('should not validate unicode', () => {
    expect(decimal('🎉')).to.be.false
  })

  it('should validate negative numbers', () => {
    expect(decimal('-123')).to.be.true
  })

  it('should validate decimal numbers', () => {
    expect(decimal('0.1')).to.be.true
    expect(decimal('1.0')).to.be.true
  })

  it('should validate negative decimal numbers', () => {
    expect(decimal('-123.4')).to.be.true
  })

  it('should not validate multiple decimal points', () => {
    expect(decimal('-123.4.')).to.be.false
    expect(decimal('..')).to.be.false
  })

  it('should validate decimal numbers without leading digits', () => {
    expect(decimal('.1')).to.be.true
  })

  it('should not validate decimal numbers without trailing digits', () => {
    expect(decimal('1.')).to.be.false
  })
})
