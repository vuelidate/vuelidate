import boolean from 'src/validators/boolean'

describe('boolean validator', () => {
  it('should validate undefined', () => {
    expect(boolean(undefined)).to.be.true
  })

  it('should validate null', () => {
    expect(boolean(null)).to.be.true
  })

  it('should not validate string', () => {
    expect(boolean('abcd')).to.be.false
  })

  it('should not validate array', () => {
    expect(boolean([1, 2])).to.be.false
  })

  it('should not validate space', () => {
    expect(boolean(' ')).to.be.false
  })
  it('should validate boolean number', () => {
    expect(boolean(0)).to.be.true
  })

  it('should validate boolean number', () => {
    expect(boolean(1)).to.be.true
  })

  it('should validate boolean string', () => {
    expect(boolean('0')).to.be.true
  })

  it('should validate boolean string', () => {
    expect(boolean('1')).to.be.true
  })

  it('should validate boolean string', () => {
    expect(boolean('true')).to.be.true
  })

  it('should validate boolean string', () => {
    expect(boolean('false')).to.be.true
  })

  it('should validate uppercase boolean string', () => {
    expect(boolean('FALSE')).to.be.true
  })
  it('should validate boolean', () => {
    expect(boolean(true)).to.be.true
  })
})
