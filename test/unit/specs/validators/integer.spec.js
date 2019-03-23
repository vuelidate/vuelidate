import integer from 'src/validators/integer'

describe('integer validator', () => {
  it('should validate undefined', () => {
    expect(integer(undefined)).to.be.true
  })

  it('should validate null', () => {
    expect(integer(null)).to.be.true
  })

  it('should validate empty string', () => {
    expect(integer('')).to.be.true
  })

  it('should validate numbers', () => {
    expect(integer('01234')).to.be.true
  })

  it('should not validate space', () => {
    expect(integer(' ')).to.be.false
  })

  it('should not validate english letters', () => {
    expect(integer('abcdefghijklmnopqrstuvwxyz')).to.be.false
  })

  it('should not validate english letters uppercase', () => {
    expect(integer('ABCDEFGHIJKLMNOPQRSTUVWXYZ')).to.be.false
  })

  it('should not validate alphanum', () => {
    expect(integer('abc123')).to.be.false
  })

  it('should not validate padded letters', () => {
    expect(integer(' 123 ')).to.be.false
  })

  it('should not validate unicode', () => {
    expect(integer('🎉')).to.be.false
  })

  it('should not validate minus sign', () => {
    expect(integer('-')).to.be.false
  })

  it('should validate negative numbers', () => {
    expect(integer('-123')).to.be.true
  })

  it('should not validate decimal numbers', () => {
    expect(integer('0.1')).to.be.false
    expect(integer('1.0')).to.be.false
  })

  it('should not validate negative decimal numbers', () => {
    expect(integer('-123.4')).to.be.false
  })
})
