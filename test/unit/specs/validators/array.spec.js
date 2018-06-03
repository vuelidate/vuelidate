import array from 'src/validators/array'

describe('array validator', () => {
  it('should not validate undefined', () => {
    expect(array(undefined)).to.be.true
  })

  it('should not validate null', () => {
    expect(array(null)).to.be.true
  })

  it('should not validate string', () => {
    expect(array('*')).to.be.false
  })

  it('should validate empty array', () => {
    expect(array([])).to.be.true
  })

  it('should validate array', () => {
    expect(array([1, 2, 3])).to.be.true
  })
})
