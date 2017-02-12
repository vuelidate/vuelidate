import required from 'src/validators/required'

describe('required validator', () => {
  it('should not validate empty string', () => {
    expect(required('')).to.be.false
  })

  it('should not validate empty arrays', () => {
    expect(required([])).to.be.false
  })

  it('should validate nonempty arrays', () => {
    expect(required([1])).to.be.true
  })

  it('should not validate undefined', () => {
    expect(required(undefined)).to.be.false
  })

  it('should not validate null', () => {
    expect(required(null)).to.be.false
  })

  it('should validate string only with spaces', () => {
    expect(required('  ')).to.be.true
  })

  it('should validate english words', () => {
    expect(required('hello')).to.be.true
  })

  it('should validate padded words', () => {
    expect(required(' hello ')).to.be.true
  })

  it('should validate unicode', () => {
    expect(required('🎉')).to.be.true
  })
})
