import numeric from 'src/validators/numeric'

describe('numeric validator', () => {
  it('should validate null string', () => {
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
})
