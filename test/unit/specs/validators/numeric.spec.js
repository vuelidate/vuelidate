import numeric from 'src/validators/numeric'

describe('numeric validator', () => {
  it('should validate undefined', () => {
    expect(numeric(undefined)).to.be.true
  })

  it('should validate null', () => {
    expect(numeric(null)).to.be.true
  })

  it('should validate empty string', () => {
    expect(numeric('')).to.be.true
  })

  it('should validate numbers', () => {
    expect(numeric('01234')).to.be.true
  })

  it('should not validate space', () => {
    expect(numeric(' ')).to.be.false
  })

  it('should not validate english letters', () => {
    expect(numeric('abcdefghijklmnopqrstuvwxyz')).to.be.false
  })

  it('should not validate english letters uppercase', () => {
    expect(numeric('ABCDEFGHIJKLMNOPQRSTUVWXYZ')).to.be.false
  })

  it('should not validate alphanum', () => {
    expect(numeric('abc123')).to.be.false
  })

  it('should not validate padded letters', () => {
    expect(numeric(' 123 ')).to.be.false
  })

  it('should not validate unicode', () => {
    expect(numeric('🎉')).to.be.false
  })

  it('should not validate negative numbers', () => {
    expect(numeric('-123')).to.be.false
  })

  it('should not validate decimal numbers', () => {
    expect(numeric('0.1')).to.be.false
    expect(numeric('1.0')).to.be.false
  })

  it('should not validate negative decimal numbers', () => {
    expect(numeric('-123.4')).to.be.false
  })
})
